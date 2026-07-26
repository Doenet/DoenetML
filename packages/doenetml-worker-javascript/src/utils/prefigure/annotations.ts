import { escapeXml } from "./common";
import type { AnnotationNode } from "./types";
import type { DiagnosticRecord } from "@doenet/utils";
import { codedDiagnostic } from "@doenet/utils";
import type { DiagnosticCode } from "@doenet/i18n";

/**
 * Mutable context shared while building `<annotations>` XML.
 *
 * Tracks graph scope, emitted/claimed refs, and warning collection.
 */
interface AnnotationXmlBuildState {
    diagnostics: DiagnosticRecord[];
    handleByComponentIdx: Map<number, string>;
    graphComponentIdx: number;
    graphDescendantComponentIndices: Set<number>;
    functionToCurveComponentIdx: Record<number, number>;
    conceptualRefCounter: number;
    usedAnnotationRefs: Set<string>;
}

/**
 * Inputs needed to convert DoenetML annotation nodes into PreFigure XML.
 */
interface BuildAnnotationsXmlParams {
    annotations: AnnotationNode[] | null;
    diagnostics: DiagnosticRecord[];
    handleByComponentIdx: Map<number, string>;
    graphComponentIdx: number;
    graphDescendantComponentIndices: Set<number>;
    functionToCurveComponentIdx?: Record<number, number>;
}

/**
 * Finds the first free conceptual annotation ref of the form `annotation_N`.
 *
 * Returns both the selected ref and the next counter value so callers can
 * update state without recomputing.
 */
export function nextAvailableConceptualAnnotationRef({
    initialCounter,
    usedRefs,
}: {
    initialCounter: number;
    usedRefs: Set<string>;
}): { ref: string; nextCounter: number } {
    let nextCounter = initialCounter;

    while (usedRefs.has(`annotation_${nextCounter}`)) {
        nextCounter += 1;
    }

    return { ref: `annotation_${nextCounter}`, nextCounter: nextCounter + 1 };
}

/**
 * Allocates the next available conceptual ref and records it as used.
 *
 * This advances conversion state so subsequent conceptual refs remain unique.
 */
function nextConceptualRef(state: AnnotationXmlBuildState): string {
    const { ref, nextCounter } = nextAvailableConceptualAnnotationRef({
        initialCounter: state.conceptualRefCounter,
        usedRefs: state.usedAnnotationRefs,
    });
    state.conceptualRefCounter = nextCounter;
    state.usedAnnotationRefs.add(ref);
    return ref;
}

/**
 * Converts DoenetML annotation subtrees into PreFigure XML.
 *
 * Input: children from a DoenetML `<annotations>` container
 * (`annotationSubtrees`).
 * Output: one PreFigure `<annotations>` element whose `<annotation>` children
 * keep the same parent/child nesting as the input tree.
 *
 * This function changes representation/attributes (DoenetML -> PreFigure XML),
 * not hierarchy. Nodes with invalid refs are omitted and reported as
 * diagnostics.
 */
export function convertDoenetMLAnnotationsToPreFigureXml({
    annotations,
    diagnostics,
    handleByComponentIdx,
    graphComponentIdx,
    graphDescendantComponentIndices,
    functionToCurveComponentIdx,
}: BuildAnnotationsXmlParams): string {
    // Always emit an empty <annotations> container when none are authored.
    // This suppresses PreFigure WASM's implicit auto-generated annotations;
    // we have not found a separate PreFigure option to disable that behavior.
    if (!Array.isArray(annotations) || annotations.length === 0) {
        return "<annotations></annotations>";
    }

    const state: AnnotationXmlBuildState = {
        diagnostics,
        handleByComponentIdx,
        graphComponentIdx,
        graphDescendantComponentIndices,
        functionToCurveComponentIdx: functionToCurveComponentIdx ?? {},
        conceptualRefCounter: 1,
        usedAnnotationRefs: new Set(handleByComponentIdx.values()),
    };

    const annotationsXml = annotations
        .map((annotation) =>
            convertAnnotationNodeToPreFigureXml(annotation, state),
        )
        .filter((x): x is string => x !== null)
        .join("");

    return `<annotations>${annotationsXml}</annotations>`;
}

function pushAnnotationWarning({
    diagnostics,
    code,
    annotation,
}: {
    diagnostics: DiagnosticRecord[];
    code: DiagnosticCode;
    annotation: AnnotationNode;
}) {
    // TODO: populate annotation node positions so non-ref warnings can point
    // to the authored <annotation> node instead of falling back to ref data.
    diagnostics.push(
        codedDiagnostic({
            type: "warning",
            code,
            position: annotation?.refResolutions?.[0]?.position,
        }),
    );
}

function pushInvalidRefWarning(
    annotation: AnnotationNode,
    state: AnnotationXmlBuildState,
): null {
    pushAnnotationWarning({
        diagnostics: state.diagnostics,
        annotation,
        // Inlined rather than held in a constant: `lint:i18n` finds raised
        // codes by scanning for a `code:` property, and a code reached
        // through a variable reads to it as a code nothing raises.
        code: "doenet-w0095",
    });
    return null;
}

/**
 * Resolves an annotation `ref` to a PreFigure handle (or `figure`).
 *
 * For DoenetML annotations without `ref`, this allocates a unique conceptual
 * handle so nested annotations can still be represented.
 */
function resolveAnnotationRef(
    annotation: AnnotationNode,
    state: AnnotationXmlBuildState,
): string | null {
    if (!annotation.hasRefAttribute) {
        return nextConceptualRef(state);
    }

    const [firstResolution, ...otherResolutions] =
        annotation.refResolutions ?? [];

    if (!firstResolution) {
        return pushInvalidRefWarning(annotation, state);
    }

    if (otherResolutions.length > 0) {
        pushAnnotationWarning({
            diagnostics: state.diagnostics,
            annotation,
            code: "doenet-w0096",
        });
    }

    const unresolvedPath = firstResolution.unresolvedPath;
    const targetComponentIdx = Number.isFinite(firstResolution.componentIdx)
        ? Number(firstResolution.componentIdx)
        : null;

    if (targetComponentIdx === null || unresolvedPath !== null) {
        return pushInvalidRefWarning(annotation, state);
    }

    if (targetComponentIdx === state.graphComponentIdx) {
        state.usedAnnotationRefs.add("figure");
        return "figure";
    }

    let resolvedIdx = targetComponentIdx;

    const directHandle = state.handleByComponentIdx.get(resolvedIdx);

    if (!directHandle) {
        const aliasedTargetComponentIdx =
            state.functionToCurveComponentIdx[resolvedIdx];

        if (Number.isFinite(aliasedTargetComponentIdx)) {
            resolvedIdx = aliasedTargetComponentIdx;
        }
    }

    if (!state.graphDescendantComponentIndices.has(resolvedIdx)) {
        pushAnnotationWarning({
            diagnostics: state.diagnostics,
            annotation,
            code: "doenet-w0097",
        });
        return null;
    }

    const handle = directHandle ?? state.handleByComponentIdx.get(resolvedIdx);
    if (!handle) {
        pushAnnotationWarning({
            diagnostics: state.diagnostics,
            annotation,
            code: "doenet-w0098",
        });
        return null;
    }

    state.usedAnnotationRefs.add(handle);
    return handle;
}

/**
 * Recursively converts one DoenetML annotation node and its descendants.
 */
function convertAnnotationNodeToPreFigureXml(
    annotation: AnnotationNode,
    state: AnnotationXmlBuildState,
): string | null {
    const ref = resolveAnnotationRef(annotation, state);
    if (ref === null) {
        return null;
    }

    const text = typeof annotation.text === "string" ? annotation.text : "";

    if (text.trim() === "") {
        pushAnnotationWarning({
            diagnostics: state.diagnostics,
            annotation,
            code: "doenet-w0099",
        });
    }

    const attrs = [`ref="${escapeXml(ref)}"`, `text="${escapeXml(text)}"`];

    if (typeof annotation.speech === "string" && annotation.speech !== "") {
        attrs.push(`speech="${escapeXml(annotation.speech)}"`);
    }

    if (Boolean(annotation.sonify)) {
        attrs.push('sonify="yes"');
    }

    if (Boolean(annotation.circular)) {
        attrs.push('circular="yes"');
    }

    const childAnnotationsXml = (annotation.children ?? [])
        .map((child) => convertAnnotationNodeToPreFigureXml(child, state))
        .filter((x): x is string => x !== null)
        .join("");

    return `<annotation ${attrs.join(" ")}>${childAnnotationsXml}</annotation>`;
}
