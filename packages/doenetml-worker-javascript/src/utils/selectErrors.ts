import {
    formatEnglishDiagnostic,
    type DiagnosticArgs,
    type DiagnosticCode,
} from "@doenet/i18n";
import { codedDiagnostic, diagnosticCodeFrom } from "./diagnostics";

/**
 * The error a `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>`
 * replaces itself with, as the pair of state values that carry it.
 *
 * These three are the only components that build an `_error` out of a state
 * variable rather than out of a caught value: when nothing can be selected
 * there is no component to render, so the replacement *is* the error box. That
 * state variable held a finished English sentence, which made this the last
 * uncoded `_error` path in the worker — and the one place a Spanish reader got
 * an English box on an otherwise Spanish page (#1581).
 *
 * ## Two values, set together
 *
 * `errorMessage` is unchanged: English, and the string every existing test
 * asserts on. It is filled in from the English catalog rather than written by
 * the caller, exactly as `codedDiagnostic` does it, so the two cannot drift.
 *
 * `errorDiagnostic` is what is new — the code and its arguments, in the shape
 * `errorComponentState` reads. The component hands it to that builder when it
 * creates its replacement, and the main thread renders the box from the code
 * in the reader's language.
 *
 * They are one object because they have to be set together. Both are essential
 * state variables in the same definition group, so a definition that set one
 * and left the other would leave a stale code beside a fresh message — and the
 * box would confidently render the wrong sentence. Every return path hands
 * {@link selectionResult} either a {@link selectError} or
 * {@link NO_SELECT_ERROR}, and there is no way to spell one half.
 *
 * The code is what persists, not the message: a document saved in one language
 * and reopened in another gets the box in the second language, because nothing
 * localized was ever written down.
 */
export type SelectErrorState = {
    errorMessage: string;
    errorDiagnostic: {
        code: DiagnosticCode;
        args?: DiagnosticArgs;
        /**
         * Set when the select could not select because of a value or the
         * variant, rather than because of what the author wrote. Then the
         * select is missing and reports an info rather than an error (D38,
         * DIAG-7; see {@link selectFailureType}).
         */
        type?: "info";
    } | null;
};

/**
 * The pair for a select that cannot select.
 *
 * Takes the code as a named property rather than positionally: `lint:i18n`
 * recognizes a raised code by the text `code: "doenet-…"` in source, and a
 * code passed as a bare argument would read as never raised — which would fail
 * the check that every registered code has a call site.
 */
export function selectError({
    code,
    args,
    type = "error",
}: {
    code: DiagnosticCode;
    args?: DiagnosticArgs;
    /** {@link selectFailureType}; an error unless said otherwise. */
    type?: "error" | "info";
}): SelectErrorState {
    return {
        errorMessage: formatEnglishDiagnostic(code, args),
        errorDiagnostic: {
            code,
            ...(args === undefined ? {} : { args }),
            ...(type === "info" ? { type } : {}),
        },
    };
}

/**
 * The level of a select's failure to select (D38, DIAG-7): an error when
 * what decides it is written in the DoenetML, so it is the same in every
 * variant and the author must change it; otherwise an info, since a value or
 * another random choice decides it (`<selectFromSequence to="$a"
 * numToSelect="3"/>` with a random `a`), and the select is missing while it
 * lasts (DIAG-2).
 *
 * @param decidedByDoenetML The select's `choicesDecidedByDoenetML`.
 */
export function selectFailureType(
    decidedByDoenetML: boolean,
): "error" | "info" {
    return decidedByDoenetML ? "error" : "info";
}

/**
 * Whether a failure of the select to select is a missing selection with an
 * info rather than an error (`selectFailureType`).
 */
export function isInfoSelectFailure(errorDiagnostic: unknown): boolean {
    return (
        typeof errorDiagnostic === "object" &&
        errorDiagnostic !== null &&
        (errorDiagnostic as { type?: unknown }).type === "info"
    );
}

/**
 * Whether the attribute `attribute` of a component is decided by the
 * DoenetML alone: not written (its default), a literal, a primitive, or an
 * attribute component that holds no reference. A reference anywhere in it
 * (`to="$a"`, `numToSelect="$n+1"`) makes it a value that can change.
 */
function attributeDecidedByDoenetML(
    attribute: any,
    componentInfoObjects: any,
): boolean {
    if (!attribute) {
        return true;
    }
    if (attribute.type === "literal" || attribute.type === "primitive") {
        return true;
    }
    if (attribute.type === "expression") {
        return (attribute.slots ?? []).length === 0;
    }
    if (attribute.component) {
        return componentDecidedByDoenetML(
            attribute.component,
            componentInfoObjects,
        );
    }
    // a reference to a variable of another component
    return false;
}

/**
 * Whether the live component `component`, an attribute component or a
 * child, holds only what is written: no reference (a `_ref` read for its
 * value, or a composite, such as a `_copy`), no extend, and the same of its
 * children and attributes.
 */
function componentDecidedByDoenetML(
    component: any,
    componentInfoObjects: any,
): boolean {
    if (typeof component !== "object" || component === null) {
        return true;
    }
    if (
        component.shadows ||
        component.extending ||
        // a reference read for its value (`valueReferences.ts`)
        component.componentType === "_ref" ||
        componentInfoObjects.isCompositeComponent({
            componentType: component.componentType,
            includeNonStandard: true,
        })
    ) {
        return false;
    }
    return (
        (component.definingChildren ?? []).every((child: any) =>
            componentDecidedByDoenetML(child, componentInfoObjects),
        ) &&
        Object.values(component.attributes ?? {}).every((attribute) =>
            attributeDecidedByDoenetML(attribute, componentInfoObjects),
        )
    );
}

/**
 * Whether what a select chooses from, and how many, is decided by the
 * DoenetML alone (D38, DIAG-7): each of the attributes `attributeNames` of
 * the select `component` is {@link attributeDecidedByDoenetML}, and, when
 * `optionChildType` is given, each child is a component of that type
 * written in it (not one made by a reference or a composite, whose number
 * the DoenetML doesn't fix). Computed when the select is made, from what
 * the author wrote, so it is the same in every variant.
 */
export function choicesDecidedByDoenetML({
    component,
    attributeNames,
    optionChildType,
    componentInfoObjects,
}: {
    component: any;
    attributeNames: string[];
    optionChildType?: string;
    componentInfoObjects: any;
}): boolean {
    const attributesDecided = attributeNames.every((name) =>
        attributeDecidedByDoenetML(
            component.attributes?.[name],
            componentInfoObjects,
        ),
    );
    if (!attributesDecided || optionChildType === undefined) {
        return attributesDecided;
    }
    return (component.definingChildren ?? []).every(
        (child: any) =>
            typeof child !== "object" ||
            (child.componentType === optionChildType && !child.shadows),
    );
}

/**
 * The state variable `choicesDecidedByDoenetML` of a select, read by the
 * definition that selects to set the level of a failure
 * ({@link selectFailureType}). The select's constructor computes it from
 * what the author wrote ({@link choicesDecidedByDoenetML}) and keeps it in
 * `doenetAttributes`.
 */
export function returnChoicesDecidedByDoenetMLDefinition() {
    return {
        returnDependencies: () => ({
            decided: {
                dependencyType: "doenetAttribute",
                attributeName: "choicesDecidedByDoenetML",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { decided: boolean | undefined };
        }) {
            return {
                setValue: {
                    choicesDecidedByDoenetML:
                        dependencyValues.decided !== false,
                },
            };
        },
    };
}

/**
 * The state variable `ignoredVariantChoicesReported` of a select, which
 * reports, as an info, that the choices the requested variant gave it don't
 * fit it, so it made its own (`doenet-i0057`). That happens when the
 * document changed after the variant was saved. The select then chooses as
 * though it had been given none, fixed for the variant, as `<shuffle>` does
 * (`doenet-i0006`), rather than failing.
 *
 * Decided from the variant each time, not kept, so it is reported the same
 * after a reload. A reference to the select, which shadows its choices, does
 * not report it again. A variant that gives `null` or `[]` gives no choices:
 * that is what a select that selected nothing records in its
 * `generatedVariantInfo`, which a reload, or a `copy` of the select, passes
 * back to it, so nothing is ignored.
 *
 * @param component The select's DoenetML tag, for the message.
 * @param desiredChoicesFit Given `dependencyValues` (with the select's
 *   `variants` and the `dependencies` named here), whether the choices the
 *   variant gave fit the select. It is called only when the variant gives
 *   some (a nonempty array).
 * @param choicesKey The key of the choices in the variant: `indices` or
 *   `values`.
 */
export function returnIgnoredVariantChoicesDefinition({
    component,
    dependencies,
    desiredChoicesFit,
    choicesKey = "indices",
}: {
    component: string;
    dependencies: Record<string, unknown>;
    desiredChoicesFit: (dependencyValues: any) => boolean;
    choicesKey?: "indices" | "values";
}) {
    return {
        mustEvaluate: true,
        returnDependencies: () => ({
            ...dependencies,
            variants: {
                dependencyType: "stateVariable",
                variableName: "variants",
            },
            shadowSource: {
                dependencyType: "shadowSource",
            },
        }),
        definition({ dependencyValues }: { dependencyValues: any }) {
            const desired =
                dependencyValues.variants?.desiredVariant?.[choicesKey];
            const ignored =
                Array.isArray(desired) &&
                desired.length > 0 &&
                dependencyValues.shadowSource === null &&
                !desiredChoicesFit(dependencyValues);
            return {
                setValue: { ignoredVariantChoicesReported: ignored },
                sendDiagnostics: ignored
                    ? [
                          codedDiagnostic({
                              type: "info",
                              code: "doenet-i0057",
                              args: { component },
                          }),
                      ]
                    : [],
            };
        },
    };
}

/** The pair for a select that selected something. */
export const NO_SELECT_ERROR: SelectErrorState = {
    errorMessage: "",
    errorDiagnostic: null,
};

/**
 * The pair off something already carrying one — a helper's return value, on
 * its way into the state variables.
 *
 * Exists so a forwarding site names one thing rather than two: spelling both
 * properties by hand is exactly where a message ends up without its code.
 */
export function takeSelectError({
    errorMessage,
    errorDiagnostic,
}: SelectErrorState): SelectErrorState {
    return { errorMessage, errorDiagnostic };
}

/**
 * What a select's definition returns: the error pair, and whatever the
 * component ended up selecting.
 *
 * The two slots always carry the same thing — a select's selection is
 * essential, so every branch writes the value it computed to both — and each
 * branch used to spell that thing out twice. Writing it once is what keeps the
 * error pair and the selection from disagreeing between the two.
 *
 * They stay two objects rather than one shared reference, because core owns
 * each independently once it has them.
 *
 * @param selection The selection state variables this component defines:
 *   `selectedIndices` for `<select>`, `selectedValues` too for the other two.
 */
export function selectionResult(
    error: SelectErrorState,
    selection: Record<string, unknown>,
) {
    return {
        setEssentialValue: { ...error, ...selection },
        setValue: { ...error, ...selection },
    };
}

/**
 * The state variable `selectErrorReported` of a select that is a list
 * component (`<selectFromSequence>`, `<selectPrimeNumbers>`), which reports
 * the select's error, when it has one, as an error diagnostic, or as an info
 * when a value or the variant decided it ({@link selectFailureType}): the
 * select then selects nothing, and has no error put after it.
 *
 * Such a select has no replacement to be the error box. A definition that
 * sends an error while the document is built has one put after its component
 * instead (`addQueuedErrorComponentsFromStateVariables`), so this is
 * evaluated as the select is created (`mustEvaluate`). A reference to the
 * select, which shadows its error, does not report it again.
 */
export function returnSelectErrorReportDefinition() {
    return {
        mustEvaluate: true,
        returnDependencies: () => ({
            errorMessage: {
                dependencyType: "stateVariable",
                variableName: "errorMessage",
            },
            errorDiagnostic: {
                dependencyType: "stateVariable",
                variableName: "errorDiagnostic",
            },
            shadowSource: {
                dependencyType: "shadowSource",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: {
                errorMessage: string | null;
                errorDiagnostic: unknown;
                shadowSource: unknown;
            };
        }) {
            const report =
                Boolean(dependencyValues.errorMessage) &&
                dependencyValues.shadowSource === null;
            return {
                setValue: { selectErrorReported: report },
                sendDiagnostics: report
                    ? [
                          {
                              type: isInfoSelectFailure(
                                  dependencyValues.errorDiagnostic,
                              )
                                  ? "info"
                                  : "error",
                              message: dependencyValues.errorMessage,
                              ...diagnosticCodeFrom(
                                  dependencyValues.errorDiagnostic,
                              ),
                          },
                      ]
                    : [],
            };
        },
    };
}
