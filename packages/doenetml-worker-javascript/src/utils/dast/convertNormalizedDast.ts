import {
    FlatElement,
    FlatFragment,
    FlatPathPart,
    IndexResolution,
    NormalizedRoot,
    RefResolution,
    Source,
    UntaggedContent,
} from "@doenet/doenetml-worker";
import {
    convertLiteralAttributes,
    literalFromAttributeComponent,
} from "../literalAttribute";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    AttributeDefinition,
    DoenetMLComponentClass,
    PrimitiveAttributeValue,
    SerializedAttribute,
    SerializedComponent,
    SerializedRefResolution,
    SerializedRefResolutionPathPart,
    UnresolvedAttribute,
} from "./types";
import {
    UnflattenedAttribute,
    UnflattenedComponent,
    UnflattenedPathPart,
    UnflattenedRefResolution,
} from "./intermediateTypes";
import { convertToErrorComponent, errorComponentState } from "./errors";
import { decodeXMLEntities, removeBlankStringChildren } from "./convertUtils";
import { applySugar } from "./sugar";
import {
    convertRefsToCopies,
    warnOfAttributesTheTagDoesNotHave,
} from "./convertToCopy";
import { convertCopiesToValueReferences } from "./valueReferences";
import { convertToListForms } from "./listForms";
import {
    checkTypeChangesAtLoad,
    reportTypeChangesAtLoad,
} from "./typeChangeAtLoad";
import { convertRepeatsToLists } from "./repeatLists";
import { convertExpressionAttributes } from "./expressionAttributes";
import { breakReferenceCycles, type LoadCycle } from "./referenceCycles";
import { markCompositesMakingNoSectioning } from "./sectionNumberingAtLoad";
import { markCopiedAwards, removeCopiedAwardMarks } from "./copiedAwards";
import { checkExtendErrorsAtLoad } from "./extendErrorsAtLoad";
import { checkChoiceErrorsAtLoad } from "./choiceErrorsAtLoad";
import { checkRepeatNamesAtLoad } from "./repeatNamesAtLoad";
import { checkChoiceParametersAtLoad } from "./choiceParametersAtLoad";
import { checkChoiceFeasibilityAtLoad } from "./choiceFeasibilityAtLoad";
import { checkReorderedItemsAtLoad } from "./reorderedItemsAtLoad";
import { checkActionTargetsAtLoad } from "./actionTargetsAtLoad";
import { checkBooleanNumberMixAtLoad } from "./booleanNumberMixAtLoad";
import {
    markPropertyTypesAtLoad,
    referencesToUndecidedTypes,
} from "./propertyTypesAtLoad";
import { markReferencesToVariantControls } from "./variantControlReferences";
import {
    authoredComponentTypes,
    nameDifferingOnlyInCase,
    suggestionArgs,
} from "./nameCase";
import {
    ATTRIBUTES_OF_A_COPY,
    ATTRIBUTES_OF_EVERY_TAG,
    attributeNameCaseCorrections,
} from "@doenet/parser/attribute-name-case";
import { DiagnosticRecord } from "@doenet/utils";
import {
    doenetMLDollarsForReference,
    doenetMLReferenceAsWritten,
    doenetMLStringForReference,
} from "../sourceLocation";
import {
    codedDiagnostic,
    diagnosticCodeFrom,
    DiagnosticError,
} from "../diagnostics";

/**
 * `reference` without the parentheses around its path, as a reference quoted
 * from its path is (`doenetMLDollarsForReference`): `$(f)` becomes `$f`, and
 * `$$(f)(2)` becomes `$$f(2)`. A reference without them, or whose parentheses
 * cannot be matched up, is returned unchanged.
 *
 * The path's closing parenthesis is found from the end, because an index can
 * hold an unmatched parenthesis (`$(f[)])`). A plain reference ends with it,
 * `{…}` included (`$(f{simplify})`); a function reference ends with it or with
 * its arguments, which are stepped over (`$$(f)((x), 3)`).
 */
function withoutPathParentheses(reference: string): string {
    const dollars = /^\$\$?(?=\()/.exec(reference)?.[0];
    if (dollars === undefined || !reference.endsWith(")")) {
        return reference;
    }
    let close = reference.length - 1;
    if (dollars === "$$") {
        // Step back over the arguments, if there are any.
        let depth = 0;
        let i = close;
        for (; i >= 0; i--) {
            if (reference[i] === ")") {
                depth++;
            } else if (reference[i] === "(" && --depth === 0) {
                break;
            }
        }
        if (i < 0) {
            return reference;
        }
        if (i > dollars.length) {
            close = i - 1;
        }
    }
    if (reference[close] !== ")") {
        return reference;
    }
    return (
        dollars +
        reference.slice(dollars.length + 1, close) +
        reference.slice(close + 1)
    );
}

/**
 * The warning for a reference the resolver could not resolve: `doenet-w0104`
 * when it names nothing, `doenet-w0105` when it names more than one thing. The
 * resolver marks the error node with the code, and its English message quotes
 * the path only up to the first index (`$l` for `$l[0]`); the code's argument
 * is the whole reference, read from the source here, in the same form the
 * worker quotes a reference it fails to resolve itself
 * (`refResolutionDependencies.ts`).
 */
function unresolvedReferenceDiagnostic(
    node: {
        code?: string;
        unresolvedPath?: any[] | null;
        position?: any;
        sourceDoc?: number;
    },
    sources: readonly string[],
    type: "warning" | "error" = "warning",
): DiagnosticRecord {
    // The path has a position for each of its parts, so it spans just the
    // reference even in the parenthesized form `$(l[0])`. The resolver gives
    // the path only when the reference names nothing; otherwise the node's own
    // position spans the reference. A function reference (`$$f(2)`), told
    // apart by the `$$` before its path, is quoted from the node's position,
    // which spans its arguments too, as the path does not (#2419). The
    // position spans any parentheses around the path as well, which are
    // dropped, as they are from a path.
    let reference = "";
    if (node.unresolvedPath && node.unresolvedPath.length > 0) {
        const path = node.unresolvedPath;
        const dollars = doenetMLDollarsForReference(path, sources);
        const text = doenetMLStringForReference(path, sources);
        if (text && dollars !== "$$") {
            reference = `${dollars}${text}`;
        }
    }
    if (!reference) {
        const start = node.position?.start?.offset;
        const end = node.position?.end?.offset;
        if (start != undefined && end != undefined) {
            reference = withoutPathParentheses(
                sources[node.sourceDoc ?? 0]?.substring(start, end) ?? "",
            );
        }
    }

    return codedDiagnostic({
        type,
        // Spread rather than a ternary on the value: the code has to sit
        // next to `code:` as a literal, or `lint:i18n` reads it as a code
        // nothing raises.
        ...(node.code === "doenet-w0105"
            ? { code: "doenet-w0105" as const }
            : { code: "doenet-w0104" as const }),
        args: { reference },
        position: node.position,
        sourceDoc: node.sourceDoc,
    });
}

/**
 * Transform the normalized dast into the serialized components used
 * to initialize the Javascript Doenet core
 *
 * Assumes that the `normalized_root` has a single document child.
 * Throws an error if it does not.
 */
export async function normalizedDastToSerializedComponents(
    normalized_root: NormalizedRoot,
    componentInfoObjects: ComponentInfoObjects,
    addNodesToResolver: (
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) => void,
    {
        loadCycles,
    }: {
        /**
         * What each load that stopped on a circular dependency blamed, when
         * the document is rebuilt (D57, D61 decision 2, `blameLoadCycle`):
         * each made `doenet-e0005` by the cycle check
         * (`breakReferenceCycles`).
         */
        loadCycles?: LoadCycle[];
    } = {},
): Promise<{
    document: SerializedComponent;
    nComponents: number;
    diagnostics: DiagnosticRecord[];
    sources: string[];
}> {
    /**
     * Unflatten the normalized dast node so that
     * children of attributes and nodes, as well as ref resolutions, contain the actual children.
     *
     * Convert Elements to a `componentType` matching their name.
     * Convert Errors to a `componentType` of "_error".
     */
    /**
     * The placeholders made for a reference in an `extend` or `copy`
     * attribute that names nothing, or more than one thing: the tag is then
     * missing (D37), whatever it adds, with the warning the same reference
     * written bare gives. The placeholder is replaced by the missing tag
     * (`missingTag`).
     */
    const missingInPlaceOfTag = new Set<UnflattenedComponent>();

    /**
     * Whether any element is a `<variantControl>`, noted as each is
     * unflattened, so that the check of references to one
     * (`markReferencesToVariantControls`) walks the document only when one
     * is written, which few documents do.
     */
    let variantControlWritten = false;

    /**
     * Give an attribute of `node` written in another case than its
     * component's (`<subsetOfRealsInput xmin>` for `xMin`) the component's
     * spelling, with the warning the parser gives (`doenet-w0197`), for this
     * release (D51's migration). The parser (`attribute-name-case.ts`) has
     * renamed those the schema lists, before anything read them; this is the
     * backstop for those it does not know of, an attribute the schema hides
     * and every attribute of a tag it hides (`<panel>`), so that every
     * attribute applied before names were case-sensitive still is, for now.
     * Those it renamed are matched here as written, so are not warned of
     * twice. It runs before anything in the core reads an attribute: the
     * sugar and the checks at load read the unflattened components. Not
     * `name`, `extend`, `copy` or `copyWithState`, which every class
     * declares: the reference resolver has read them already, as written,
     * so the parser corrects those on every tag, listed or not; one still
     * in another case here was written beside its spelling
     * (`copy="$a" Copy="$b"`), and is an attribute the tag doesn't have
     * (`doenet-w0187`, which suggests the spelling). On a class that
     * accepts any attribute, only when it names the tag it passes them to
     * (`attributesOfNamedType`, `<collect componentType>`); so not on a
     * `<module>`. A value naming a tag is corrected first
     * (`correctValueNameCase`).
     */
    const correctedNodes = new Set<number>();
    function correctAttributeNameCase(
        node: FlatElement,
        nodeIdx: number,
        diagnostics: DiagnosticRecord[],
    ) {
        if (correctedNodes.has(nodeIdx)) {
            return;
        }
        correctedNodes.add(nodeIdx);
        const componentType = componentInfoObjects.componentTypeAsWritten(
            getComponentType(node),
        );
        const componentClass =
            componentType === undefined
                ? undefined
                : componentInfoObjects.allComponentClasses[componentType];
        if (!componentClass) {
            return;
        }
        const attributesObject = componentClass.createAttributesObject();
        // First, so that the type a value names is known below.
        correctValueNameCase(
            node,
            componentType!,
            attributesObject,
            diagnostics,
        );
        const known = componentClass.acceptAnyAttribute
            ? attributesOfNamedType(node, attributesObject)
            : [
                  ...Object.keys(attributesObject),
                  ...(node.extending ? ATTRIBUTES_OF_A_COPY : []),
              ];
        const corrections =
            known === undefined
                ? []
                : attributeNameCaseCorrections({
                      written: node.attributes.map(
                          (attribute) => attribute.name,
                      ),
                      known,
                      exclude: ["name", ...ATTRIBUTES_OF_EVERY_TAG],
                  });
        for (const { written, corrected } of corrections) {
            const i = node.attributes.findIndex(
                (attribute) => attribute.name === written,
            );
            const attribute = node.attributes[i];
            node.attributes[i] = { ...attribute, name: corrected };
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0197",
                    args: {
                        attribute: written,
                        suggestion: corrected,
                        componentType,
                    },
                    position: attribute.position ?? node.position,
                    sourceDoc: attribute.sourceDoc ?? node.sourceDoc,
                }),
            );
        }
    }

    /**
     * On a class that accepts any attribute, the attributes that apply: when
     * one of its attributes names a tag, written as text
     * (`<collect componentType="math">`), its own and those of the tag it
     * names, to which it passes the rest (`<collect DisplayDigits="2">` is
     * corrected to `displayDigits`). Otherwise `undefined`, and none is
     * corrected: on a `<module>`, an attribute its definition declares is not
     * the module's own (the parser corrects those), nor is a `_copy`'s.
     */
    function attributesOfNamedType(
        node: FlatElement,
        attributesObject: Record<string, any>,
    ): string[] | undefined {
        for (const attribute of node.attributes) {
            if (
                !attributesObject[attribute.name]?.valueNamesComponentType ||
                !attribute.children.every(
                    (child: UntaggedContent) => typeof child === "string",
                )
            ) {
                continue;
            }
            const named = componentInfoObjects.componentTypeAsWritten(
                (attribute.children as string[]).join("").trim(),
            );
            const namedClass =
                named === undefined
                    ? undefined
                    : componentInfoObjects.allComponentClasses[named];
            if (namedClass) {
                return [
                    ...Object.keys(attributesObject),
                    ...Object.keys(namedClass.createAttributesObject()),
                ];
            }
        }
        return undefined;
    }

    /**
     * Give the value of each attribute of `node` that names a tag
     * (`valueNamesComponentType`, `<collect componentType>`), written as text
     * in another case than the tag's (`componentType="Point"`), the tag's
     * spelling, with `doenet-w0197`, for this release. A value that names a
     * tag is a name, matched exactly (NAME-0, D62), but the fallback for an
     * attribute in another case (D51) applies to it too. Run before anything
     * reads the value, so every reader can match it exactly. A value that
     * matches no tag, or two that differ only in case, or that is not
     * written as text (a reference), is left as written.
     */
    function correctValueNameCase(
        node: FlatElement,
        componentType: string,
        attributesObject: Record<string, any>,
        diagnostics: DiagnosticRecord[],
    ) {
        for (const [i, attribute] of node.attributes.entries()) {
            if (!attributesObject[attribute.name]?.valueNamesComponentType) {
                continue;
            }
            if (
                !attribute.children.every(
                    (child: UntaggedContent) => typeof child === "string",
                )
            ) {
                continue;
            }
            const value = (attribute.children as string[]).join("").trim();
            if (componentInfoObjects.componentTypeAsWritten(value)) {
                continue;
            }
            const corrected = nameDifferingOnlyInCase(
                value,
                authoredComponentTypes(componentInfoObjects),
            );
            if (corrected === undefined) {
                continue;
            }
            node.attributes[i] = { ...attribute, children: [corrected] };
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0197",
                    args: {
                        kind: "value",
                        attribute: attribute.name,
                        value,
                        suggestion: corrected,
                        componentType,
                    },
                    position: attribute.position ?? node.position,
                    sourceDoc: attribute.sourceDoc ?? node.sourceDoc,
                }),
            );
        }
    }

    /**
     * The missing tag (`BaseComponent.isMissing`) for the element `node`,
     * whose `extend` or `copy` names nothing, under its own index: a
     * component of its type with its own attributes, but not its children,
     * which are not drawn. A composite, such as a `<group>`, has nothing of
     * its type to be missing as, and a list is drawn as its entries, so each
     * is a `_missing` (`Missing.js`) with its name and `hide`.
     */
    function missingTag(
        node: FlatElement,
        componentIdx: number,
        diagnostics: DiagnosticRecord[],
    ): UnflattenedComponent {
        const componentType = getComponentType(node);
        const mapped =
            componentInfoObjects.componentTypeAsWritten(componentType);
        // A list is drawn as its entries, and a missing one has none, so it
        // is a `_missing` too, to be drawn and read as one blank.
        const isComposite =
            mapped !== undefined &&
            (componentInfoObjects.isCompositeComponent({
                componentType: mapped,
                includeNonStandard: true,
            }) ||
                componentInfoObjects.allComponentClasses[mapped]
                    ?.listEntryComponentType !== undefined);
        // A division's `type` is its component type (`getComponentType`),
        // not an attribute, as for a tag that is not missing.
        const attributes: Record<string, UnflattenedAttribute> =
            Object.fromEntries(
                node.attributes
                    .filter(
                        (attribute) =>
                            !(
                                attribute.name === "type" &&
                                node.name === "division"
                            ),
                    )
                    .map((attribute) => [
                        attribute.name,
                        {
                            name: attribute.name,
                            children: unflattenDastNodes(
                                attribute.children,
                                diagnostics,
                            ),
                            position: attribute.position,
                            sourceDoc: attribute.sourceDoc,
                        },
                    ]),
            );
        // An attribute the tag does not have is ignored and warned of, as on
        // an `extend` or `copy` that names something (`doenet-w0187`, #2332),
        // whatever the tag is missing as.
        warnOfAttributesTheTagDoesNotHave({
            component: {
                componentType,
                position: node.position,
                sourceDoc: node.sourceDoc,
            },
            attributes,
            componentInfoObjects,
            diagnostics,
        });
        // What is left is the tag's, or the reference's (`asList`, `link`),
        // which has no source to apply to, and is dropped.
        const componentClass =
            mapped === undefined
                ? undefined
                : componentInfoObjects.allComponentClasses[mapped];
        const tagAttributes =
            componentClass && !componentClass.acceptAnyAttribute
                ? new Set(
                      Object.keys(componentClass.createAttributesObject()).map(
                          (name) => name.toLowerCase(),
                      ),
                  )
                : undefined;
        for (const name of Object.keys(attributes)) {
            if (
                isComposite
                    ? name !== "name" && name.toLowerCase() !== "hide"
                    : tagAttributes !== undefined &&
                      !tagAttributes.has(name.toLowerCase()) &&
                      !name.includes(":")
            ) {
                delete attributes[name];
            }
        }
        return {
            type: "unflattened",
            componentType: isComposite ? "_missing" : componentType,
            componentIdx,
            attributes,
            position: node.position,
            sourceDoc: node.sourceDoc,
            doenetAttributes: isComposite ? {} : { missing: true },
            children: [],
            state: {},
        };
    }

    /**
     * The component type of the element an attribute written twice is on,
     * for the parser's `doenet-w0201` warning `node`, which it named
     * `componentType` from the tag as written. A `<division>` is the tag its
     * `type` names (`getComponentType`), which the parser did not yet know
     * there, so it is read off the element the warning is in (the parser
     * puts it among the element's children): `<division type="foo">`, or a
     * `<division>` with no `type`, is no component type (`doenet-e0002`).
     * (A `doenet-w0197` already names a `<division>`'s `type`.)
     */
    function repeatedOnComponentType(
        node: { parent?: number },
        componentType: string,
    ): string {
        if (componentType !== "division" || node.parent === undefined) {
            return componentType;
        }
        const parent = normalized_root.nodes[node.parent];
        return parent?.type === "element"
            ? getComponentType(parent)
            : componentType;
    }

    function unflattenDastNodes(
        indicesOrStrings: UntaggedContent[],
        diagnostics: DiagnosticRecord[],
    ): (UnflattenedComponent | string)[] {
        const unflattenedNodes: (UnflattenedComponent | string)[] = [];

        for (const idxOrString of indicesOrStrings) {
            if (typeof idxOrString === "string") {
                unflattenedNodes.push(idxOrString);
                continue;
            } else {
                const node = normalized_root.nodes[idxOrString];
                if (node.type === "element") {
                    correctAttributeNameCase(node, idxOrString, diagnostics);
                    if (getComponentType(node) === "variantControl") {
                        variantControlWritten = true;
                    }
                    const children = unflattenDastNodes(
                        node.children,
                        diagnostics,
                    );
                    const inPlaceOfTag = children.some(
                        (child) =>
                            typeof child === "object" &&
                            missingInPlaceOfTag.has(child),
                    );
                    if (
                        inPlaceOfTag &&
                        getComponentType(node) === "variantControl"
                    ) {
                        // Made with `extend` or `copy`, which is an error
                        // however the reference resolves (`doenet-e0088`):
                        // left as written for the error to replace it.
                        unflattenedNodes.push({
                            type: "unflattened",
                            componentType: "variantControl",
                            componentIdx: idxOrString,
                            attributes: {},
                            doenetAttributes: { madeFromAnother: true },
                            position: node.position,
                            sourceDoc: node.sourceDoc,
                            state: {},
                            children: [],
                        });
                        continue;
                    }
                    if (inPlaceOfTag) {
                        // The tag, with what its `extend` or `copy` names
                        // unresolved, is missing (D37), under its own index
                        // and name, so a reference to it reads as missing.
                        unflattenedNodes.push(
                            missingTag(node, idxOrString, diagnostics),
                        );
                        continue;
                    }
                    unflattenedNodes.push({
                        type: "unflattened",
                        componentType: getComponentType(node),
                        componentIdx: idxOrString,
                        attributes: Object.fromEntries(
                            node.attributes
                                // remove type attribute from divisions
                                .filter(
                                    (attribute) =>
                                        attribute.name !== "type" ||
                                        node.name !== "division",
                                )
                                .map((attribute) => [
                                    attribute.name,
                                    {
                                        name: attribute.name,
                                        children: unflattenDastNodes(
                                            attribute.children,
                                            diagnostics,
                                        ),
                                        position: attribute.position,
                                        sourceDoc: attribute.sourceDoc,
                                    },
                                ]),
                        ),
                        position: node.position,
                        sourceDoc: node.sourceDoc,
                        childrenPosition: node.childrenPosition,
                        extending: node.extending
                            ? unFlattenExtending(node.extending, diagnostics)
                            : undefined,
                        children,
                        state: {},
                    });
                } else {
                    // node.type === "error"

                    // XXX: for now, treating info the same as warning

                    // Remove warning from the dast and add to warning record
                    if (
                        node.errorType === "warning" ||
                        node.errorType === "info"
                    ) {
                        // Empty unless the parser, or the Rust resolver for
                        // a reference it could not resolve, named this
                        // diagnostic by code; the code and its arguments have
                        // ridden through the Rust flattening on the DAST
                        // error node (#1549). The English stays the parser's —
                        // `DocViewer` re-renders it in the reader's language
                        // on the way out.
                        //
                        // Bound to a local rather than spread in place, for
                        // the reason given in `errorComponentState`: this
                        // construction's severity is a variable, so the
                        // burn-down never counted it, and a visible spread
                        // would be credit against nothing.
                        const codeAndArgs = diagnosticCodeFrom(node);
                        const isUnresolvedReference =
                            codeAndArgs.code === "doenet-w0104" ||
                            codeAndArgs.code === "doenet-w0105";
                        if (
                            (codeAndArgs.code === "doenet-w0197" ||
                                codeAndArgs.code === "doenet-w0201") &&
                            typeof codeAndArgs.args?.componentType ===
                                "string" &&
                            componentInfoObjects.componentTypeAsWritten(
                                codeAndArgs.code === "doenet-w0201"
                                    ? repeatedOnComponentType(
                                          node,
                                          codeAndArgs.args.componentType,
                                      )
                                    : codeAndArgs.args.componentType,
                            ) === undefined
                        ) {
                            // The parser corrected `name`, `extend`, `copy`
                            // or `copyWithState` on a tag the schema doesn't
                            // list, not knowing if it is a component type, or
                            // kept the first of an attribute written twice on
                            // any tag (`doenet-w0201`). One that is not a
                            // component type is an error (`doenet-e0002`),
                            // so nothing is applied, and the warning that
                            // it is would be false.
                        } else if (!isUnresolvedReference) {
                            diagnostics.push({
                                type: node.errorType,
                                message: node.message,
                                ...codeAndArgs,
                                position: node.position,
                                sourceDoc: node.sourceDoc,
                            });
                        } else {
                            // A reference the resolver could not resolve. It
                            // names the code but cannot quote the reference,
                            // as it does not have the source; quote all of it
                            // here, as the worker does for a reference it
                            // resolves itself, so `$l[0]` and `$l[$i]` with
                            // `i` = 0 read the same (#2407).
                            diagnostics.push(
                                unresolvedReferenceDiagnostic(
                                    node,
                                    normalized_root.sources,
                                ),
                            );

                            // The arguments of a function reference that
                            // names nothing (`$a` of `$$f($a)`), which the
                            // resolver keeps in a `<setup>` (`ref_expand.rs`).
                            // They are made as if written in a `<setup>` at
                            // the reference's place (D40, #2489): not shown,
                            // but a component named in them is made, and a
                            // reference in them is resolved, and reported when
                            // it fails, now rather than once the function
                            // reference is fixed (#2434).
                            const input = (
                                node as { input?: UntaggedContent[][] }
                            ).input;
                            for (const argument of input ?? []) {
                                unflattenedNodes.push(
                                    ...unflattenDastNodes(
                                        argument,
                                        diagnostics,
                                    ),
                                );
                            }

                            // Depending on the parent, we still want something to show up for these invalid reference.
                            // Since we already have that logic implemented for copy, we'll just make a copy
                            // with no referent
                            unflattenedNodes.push({
                                type: "unflattened",
                                componentType: "_copy",
                                componentIdx: idxOrString,
                                attributes: {},
                                position: node.position,
                                sourceDoc: node.sourceDoc,
                                // a blank, as `<T extend="$nothing"/>` is
                                // (D37, `Copy.js`)
                                doenetAttributes: { noReferent: true },
                                extending: {
                                    Ref: {
                                        nodeIdx: -1,
                                        unresolvedPath: null,
                                        originalPath: [],
                                        nodesInResolvedPath: [],
                                    },
                                },
                                state: {},
                                children: [],
                            });
                        }
                    } else if (
                        node.code === "doenet-w0104" ||
                        node.code === "doenet-w0105"
                    ) {
                        // A reference in the `extend` or `copy` attribute
                        // of a tag that names nothing, or more than one
                        // thing (`ref_expand.rs`, which marks it as an
                        // error, as the attribute failed). Quoted as a
                        // reference written as text is, at the warning
                        // level the same reference written bare is (D37):
                        // the tag is missing (`missingTag`).
                        diagnostics.push(
                            unresolvedReferenceDiagnostic(
                                node,
                                normalized_root.sources,
                                "warning",
                            ),
                        );
                        const placeholder: UnflattenedComponent = {
                            type: "unflattened",
                            componentType: "_missing",
                            componentIdx: idxOrString,
                            attributes: {},
                            position: node.position,
                            sourceDoc: node.sourceDoc,
                            state: {},
                            children: [],
                        };
                        missingInPlaceOfTag.add(placeholder);
                        unflattenedNodes.push(placeholder);
                    } else {
                        unflattenedNodes.push({
                            type: "unflattened",
                            componentType: "_error",
                            componentIdx: idxOrString,
                            attributes: {},
                            position: node.position,
                            sourceDoc: node.sourceDoc,
                            state: {
                                // Reads the code and arguments off the DAST
                                // error when the parser named one (#1549),
                                // so the diagnostic the `_error` component
                                // raises from this state is coded and can be
                                // re-rendered in the reader's language.
                                ...errorComponentState(node.message, node),
                                unresolvedPath: node.unresolvedPath,
                            },
                            children: [],
                        });
                    }
                }
            }
        }
        return unflattenedNodes;
    }

    function unFlattenExtending(
        extending: Source<RefResolution>,
        diagnostics: DiagnosticRecord[],
    ): Source<UnflattenedRefResolution> {
        const refResolution = unwrapSource(extending);

        let unresolvedPath: UnflattenedPathPart[] | null = null;

        if (refResolution.unresolvedPath) {
            unresolvedPath = unflattenPath(
                refResolution.unresolvedPath,
                diagnostics,
            );
        }

        const originalPath = unflattenPath(
            refResolution.originalPath,
            diagnostics,
        );

        const unflattenedRefResolution: UnflattenedRefResolution = {
            nodeIdx: refResolution.nodeIdx,
            unresolvedPath,
            originalPath,
            nodesInResolvedPath: [...refResolution.nodesInResolvedPath],
        };

        return addSource(unflattenedRefResolution, extending);
    }

    function unflattenPath(
        path: FlatPathPart[],
        diagnostics: DiagnosticRecord[],
    ) {
        return path.map((path_part) => {
            let index = path_part.index.map((flat_index) => {
                let value = unflattenDastNodes(flat_index.value, diagnostics);
                return {
                    value,
                    position: flat_index.position,
                    sourceDoc: flat_index.sourceDoc,
                };
            });

            return {
                index,
                name: path_part.name,
                position: path_part.position,
                sourceDoc: path_part.sourceDoc,
            };
        });
    }

    const documentIdx = normalized_root.children[0];

    let nComponents = normalized_root.nodes.length;

    // console.log({ normalized_root });

    if (
        typeof documentIdx === "string" ||
        normalized_root.children.length !== 1
    ) {
        throw Error("Root of dast should be a single document");
    }
    const diagnostics: DiagnosticRecord[] = [];

    const unflattenedDocument = unflattenDastNodes(
        [documentIdx],
        diagnostics,
    )[0] as UnflattenedComponent;

    if (unflattenedDocument.componentType !== "document") {
        throw Error("Root of dast should be a single document");
    }

    // console.log(
    //     "before create copies",
    //     JSON.parse(JSON.stringify([unflattenedDocument])),
    //     nComponents,
    // );

    const convertToCopyResult = convertRefsToCopies({
        serializedComponents: [unflattenedDocument],
        nComponents,
        componentInfoObjects,
        allNodes: normalized_root.nodes,
        addNodesToResolver,
        diagnostics,
    });
    nComponents = convertToCopyResult.nComponents;

    // console.log(
    //     "after create copies",
    //     JSON.parse(JSON.stringify(convertToCopyResult.components)),
    //     nComponents,
    // );

    let expandResult = expandUnflattenedToSerializedComponents({
        serializedComponents: convertToCopyResult.components,
        componentInfoObjects,
        nComponents,
    });

    // console.log({ expandResult });

    let expandedRoot = expandResult.components;
    nComponents = expandResult.nComponents;
    diagnostics.push(...expandResult.diagnostics);

    expandedRoot = removeBlankStringChildren(
        expandedRoot,
        componentInfoObjects,
    );

    // console.log(
    //     "before apply sugar",
    //     JSON.parse(JSON.stringify(expandedRoot)),
    //     nComponents,
    // );

    // An `<answer>`'s sugar decides from its awards' children whether it
    // needs an input, so an `<award copy>` is first given the children it
    // will hold (CPY-1, #2531), and they are removed once read.
    markCopiedAwards({
        serializedComponents: expandedRoot,
        componentInfoObjects,
    });

    const sugarResult = applySugar({
        serializedComponents: expandedRoot,
        componentInfoObjects,
        nComponents,
    });
    diagnostics.push(...sugarResult.diagnostics);
    nComponents = sugarResult.nComponents;

    removeCopiedAwardMarks(sugarResult.components);

    // console.log(
    //     "after apply sugar",
    //     JSON.parse(JSON.stringify(sugarResult.components)),
    //     nComponents,
    // );

    // The type of each property its component doesn't declare, decided from
    // what is written (TYPE, D45), marked on the component for the checks
    // below and the run time. After sugar, which splits a `<tally>`'s text
    // into the values it counts.
    // An answer's responses of different types from the cases of a
    // `<conditionalContent>` are an error, reported now (`doenet-e0082`).
    diagnostics.push(
        ...markPropertyTypesAtLoad({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
        }),
    );
    // A reference that reads a property whose type the DoenetML doesn't
    // decide needs that type, so it is an error at load, in place of the
    // reference (TYPE-3, `doenet-e0091`). A type that read what such a
    // reference holds (a choice holding `$a.currentResponses[2]`) is then
    // decided again, from the error in its place.
    // Each round can only decide more, so it ends.
    for (;;) {
        const undecided = referencesToUndecidedTypes({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
        });
        if (undecided.length === 0) {
            break;
        }
        for (const { copy, what } of undecided) {
            const originalPath = copy.extending
                ? (unwrapSource(copy.extending as any) as any)?.originalPath
                : undefined;
            const diagnostic = codedDiagnostic({
                type: "error",
                code: "doenet-e0091",
                args: {
                    source: doenetMLReferenceAsWritten(
                        originalPath,
                        normalized_root.sources,
                    ),
                    what,
                },
                position: copy.position,
                sourceDoc: copy.sourceDoc,
            });
            diagnostics.push(diagnostic);
            const errorComponent = copy as any;
            errorComponent.componentType = "_error";
            errorComponent.state = errorComponentState(
                diagnostic.message,
                diagnostic,
            );
            errorComponent.attributes = {};
            errorComponent.children = [];
            errorComponent.doenetAttributes = {};
            delete errorComponent.extending;
        }
        markPropertyTypesAtLoad({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
        });
    }

    // After sugar, which makes an `<else>` a `<case>`, and before the list
    // forms and value references, so that what a reference written as a tag
    // is of is read as the author wrote it (D36, `typeChangeAtLoad.ts`).
    // First among them: a name or a property after a collection is the
    // collection's own, so anything else after one names nothing (D59,
    // `doenet-w0200`, `namesAfterCollectionsAtLoad.ts`), with the
    // every-branch rule for a collection reached through branches.
    const {
        branchNameWarnings,
        collectionItemWarnings,
        branchReads,
        nameAfterCollectionDiagnostics,
    } = checkTypeChangesAtLoad({
        serializedComponents: sugarResult.components,
        componentInfoObjects,
        sources: normalized_root.sources,
    });
    diagnostics.push(...nameAfterCollectionDiagnostics);
    // A reference to a name the branches of a `<conditionalContent>` or a
    // one-pick `<select>` do not all declare with one tag names nothing
    // (D13, D22), so that what it names never changes type with the active
    // branch. A name the branches declare with different types is an error,
    // shown in place of the reference, as it is for the reference written as
    // a tag (`doenet-e0066`): only a name a branch lacks is a warning, with a
    // blank (D37).
    for (const { copy, code, args } of branchNameWarnings) {
        const ref: any = (copy.extending as any)?.Ref;
        const originalPath = ref?.originalPath;
        const isError = code === "doenet-w0184";
        const diagnostic = codedDiagnostic({
            type: isError ? "error" : "warning",
            code: code as any,
            args: {
                ...args,
                reference: doenetMLReferenceAsWritten(
                    originalPath,
                    normalized_root.sources,
                ),
            },
            position: copy.position,
            sourceDoc: copy.sourceDoc,
        });
        if (isError) {
            // Reported now, as the `_error` may be made only after an
            // interaction (in a case not yet true), and again, the same, kept
            // once, when the `_error` is made (`ComponentBuilder`).
            diagnostics.push(diagnostic);
            const errorComponent = copy as any;
            errorComponent.componentType = "_error";
            errorComponent.state = errorComponentState(
                diagnostic.message,
                diagnostic,
            );
            errorComponent.attributes = {};
            errorComponent.children = [];
            errorComponent.doenetAttributes = {};
            delete errorComponent.extending;
            continue;
        }
        diagnostics.push(diagnostic);
        if (ref) {
            copy.extending = {
                Ref: {
                    ...ref,
                    nodeIdx: -1,
                    unresolvedPath: null,
                    nodesInResolvedPath: [],
                },
            } as any;
            // a blank, as a reference to one thing that names nothing is
            // (D37, `Copy.js`)
            copy.doenetAttributes = {
                ...copy.doenetAttributes,
                noReferent: true,
            };
        }
    }

    // A reference to a `<variantControl>` names nothing, with a warning that
    // says it shows nothing and nothing can be read from it (#2623 item 7).
    // Only a document with one written needs the walk (#2637 item 6).
    if (variantControlWritten) {
        diagnostics.push(
            ...markReferencesToVariantControls({
                serializedComponents: sugarResult.components,
                componentInfoObjects,
                sources: normalized_root.sources,
            }),
        );
    }

    // What a property or an index after a `<select>` or `<conditionalContent>`
    // reaches in its options or cases, decided at load from every one of them
    // (#2520 item 1, #2452): a warning at the reference, which is left as it
    // is.
    for (const { copy, code, args, kind } of collectionItemWarnings) {
        const ref: any = copy.extending
            ? unwrapSource(copy.extending as any)
            : undefined;
        const reference = doenetMLReferenceAsWritten(
            ref?.originalPath,
            normalized_root.sources,
        );
        const extra: Record<string, string> = {};
        if (code === "doenet-w0191") {
            const suggestion = referenceNamingTheItem(
                ref,
                kind,
                reference,
                normalized_root.sources,
            );
            extra.suggestion = suggestion ?? "";
            extra.hasSuggestion = suggestion === undefined ? "false" : "true";
        }
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: code as any,
                args: { ...args, ...extra, reference } as any,
                position: copy.position,
                sourceDoc: copy.sourceDoc,
            }),
        );
    }

    // Which composites the DoenetML shows can make no section, so that a
    // section's number needn't wait for them to expand (#2614 item 2).
    // Before the cycle check, which follows a reference to a section's
    // number to the composites its numbering does wait for.
    markCompositesMakingNoSectioning({
        serializedComponents: sugarResult.components,
        componentInfoObjects,
    });

    // A reference that depends on itself, through what is written in every
    // branch, is a circular dependency, an error at load in place of the
    // reference (D14, DIAG-7). After the type check, whose own circular
    // dependency (a tag extending the `<conditionalContent>` holding it) it
    // leaves to that check, and before the value references, while each
    // reference is still a `_copy`.
    diagnostics.push(
        ...breakReferenceCycles({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
            branchReads,
            loadCycles,
        }),
    );

    // What was decided of each reference written as a tag is reported now,
    // though the tag may be made only after an interaction, as in a case that
    // is not true yet: an error never first shows to a student.
    diagnostics.push(
        ...reportTypeChangesAtLoad({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
            sources: normalized_root.sources,
        }),
    );

    // An `<updateValue>` whose target is a container of several things,
    // which has no one value (COLL-3), is a warning at load (DIAG-1), not
    // only once it acts. After sugar, which makes a `<repeat>`'s template.
    diagnostics.push(
        ...checkActionTargetsAtLoad({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
            sources: normalized_root.sources,
        }),
    );

    // A `<sort>` or `<shuffle>` takes items of one type, decided from what
    // is written (COLL-4, D41 decision 4): one that does not is an error,
    // marked on it and reported now, wherever it is (DIAG-7). After sugar,
    // which splits its text into the items it reads, and before the list
    // forms, which leave one in error a composite.
    diagnostics.push(
        ...checkReorderedItemsAtLoad({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
        }),
    );

    // A boolean where a number or a math is wanted, or a number where a
    // boolean is, is a type mix: a warning at load and a blank in its place
    // (D47 decisions 3 and 4). So is a text ordered against a number, which
    // is only warned of (D58). After sugar, which wraps a `<number>`'s
    // several children in a `<math>`, and before the list forms and value
    // references, while each reference is still a `_copy`.
    const booleanNumberMix = checkBooleanNumberMixAtLoad({
        serializedComponents: sugarResult.components,
        componentInfoObjects,
        sources: normalized_root.sources,
        nComponents,
    });
    diagnostics.push(...booleanNumberMix.diagnostics);
    nComponents = booleanNumberMix.nComponents;

    // After sugar, which splits the text of a `<sort>` or `<shuffle>` into
    // the values it reads, and before the value references, so that a
    // reference among the children of a list made here is one.
    nComponents = convertToListForms({
        serializedComponents: sugarResult.components,
        componentInfoObjects,
        nComponents,
    }).nComponents;

    // The errors of an extend that would change what it extends are decided
    // by what is written, so they are marked on it and reported now,
    // wherever the extend is (D32, DIAG-7). After the list forms, so that
    // the tag extended is the one the extend's replacement has, and after
    // the type check, whose error the extend shows first.
    diagnostics.push(
        ...checkExtendErrorsAtLoad({
            serializedComponents: sugarResult.components,
            componentInfoObjects,
            sources: normalized_root.sources,
        }),
    );

    // A select that its literals keep from selecting is an error in every
    // variant, marked on it and reported now, wherever the select is
    // (DIAG-7).
    diagnostics.push(
        ...checkChoiceErrorsAtLoad({
            serializedComponents: sugarResult.components,
        }),
    );

    // A repeat whose value and index have the same name, which a reference
    // to the name finds both of, is warned of at the repeat, wherever it is
    // (#2175).
    diagnostics.push(
        ...checkRepeatNamesAtLoad({
            serializedComponents: sugarResult.components,
        }),
    );

    // After sugar, so that each reference is judged by the parent it will
    // have: the `$n` of `<number>$n+1</number>` sits in the `<math>` sugar
    // made.
    convertCopiesToValueReferences({
        serializedComponents: sugarResult.components,
        componentInfoObjects,
    });

    // After the value references, which decide whether a repeat's value and
    // index are lists and make the references that read them value
    // references, a repeat whose template is one value becomes a list.
    nComponents = convertRepeatsToLists({
        serializedComponents: sugarResult.components,
        componentInfoObjects,
        nComponents,
    }).nComponents;

    // After everything that reads an attribute component's written text, an
    // attribute that is only a literal becomes the literal.
    const document = convertLiteralAttributes(
        sugarResult.components,
        componentInfoObjects,
    )[0] as SerializedComponent;

    // After the literal attributes, an attribute that is text and value
    // references is held by its component (`expressionAttributes.ts`).
    convertExpressionAttributes([document], {
        numResolverNodes: normalized_root.nodes.length,
        componentInfoObjects,
    });

    // A random choice whose parameter reaches what a reader can change is an
    // error in every variant (D39, SEL-1), reported now, wherever the choice
    // is, and made an `_error` in place of the choice. On the final tree, as
    // the pass that finds what a reader can change reads it in `Core`, and
    // before the variants are counted, so that the choice is not one.
    diagnostics.push(
        ...checkChoiceParametersAtLoad({
            document,
            componentInfoObjects,
            sources: normalized_root.sources,
        }),
    );

    // Every random choice that can appear can be made as written (D39,
    // SEL-5 to SEL-7): proven over every value its parameters can take, or
    // an error in every variant, reported now and made an `_error` in place
    // of the choice. After SEL-1, whose errors leave the choices reading
    // them unchecked, and before the variants are counted.
    const feasibility = checkChoiceFeasibilityAtLoad({
        document,
        componentInfoObjects,
        sources: normalized_root.sources,
        nComponents,
    });
    diagnostics.push(...feasibility.diagnostics);
    nComponents = feasibility.nComponents;

    // Last, so that the walk sees the final tree -- after references became
    // copies, after attributes became components, and after sugar added
    // whatever it adds.
    assignDocumentDerivedStateIds(document);

    return {
        document,
        nComponents,
        diagnostics,
        sources: [...normalized_root.sources],
    };
}

/**
 * Give every component built from the document an identifier derived from where
 * it sits in that document, rather than from the order it happened to be built
 * in.
 *
 * Saved reader state is keyed by `stateId`, and `ComponentBuilder` falls back to
 * `componentIdx.toString()` for anything that arrives without one — which, until
 * this pass, was the whole authored tree and every component built from an
 * attribute. A component index is a position in the build, so it moves whenever
 * anything before it changes, and a reader's saved values then come back on the
 * wrong components (Doenet/DoenetML#1944, Doenet/DoenetML#1940).
 *
 * The path is built from what the author wrote:
 *
 * | segment | form | example |
 * |---|---|---|
 * | document root | `` (empty) | `` |
 * | k-th child, unnamed | `/k` | `/0/2` |
 * | k-th child, named `P` | `/~P` | `/~P` |
 * | attribute `x` | `@x` | `/~P@x` |
 * | i-th reference in an attribute | `@x/i` | `/~P@through/0` |
 * | index component in a reference path | `@@p.i.v` | `/~q@@0.0.0` |
 *
 * Two properties matter. **Attributes are keyed by name**, so the swap in #1944
 * — where `x` and `y` were handed each other's indices — cannot be expressed in
 * this scheme at all, independently of the iteration order they are visited in.
 * And **a named element is keyed by its name**, so inserting something earlier
 * in the document does not move it; an author renaming it does, which is
 * acceptable because `cid` already discards saved state on any change to the
 * document text.
 *
 * Only components that do not already carry a `stateId` are given one, so the
 * ids composites mint for their replacements (`<composite stateId>|<n>`) are
 * left alone — those hang off a composite whose own id this pass has made
 * stable, so the whole tree becomes anchored to the document.
 *
 * This pass sees only what the document builds. The other components Doenet
 * builds — a composite's replacements, and the adapters `ChildMatcher`
 * inserts (`<adapted stateId>@@adapt<n>`) — are keyed where they are built, in
 * each case off a component this pass has already anchored. Between them that
 * accounts for everything a reader can put work into; nothing holding their
 * work is left on the `componentIdx` fallback in
 * `ComponentBuilder`, and `statePersistenceKeying.test.ts` asserts as much.
 */
export function assignDocumentDerivedStateIds(document: SerializedComponent) {
    const assigned = new Set<string>();

    /**
     * @param fullPath   this component's position, counting every ancestor
     * @param namedAnchor the path of the nearest ancestor the author named,
     *   which is what a named component hangs off instead of its position
     */
    function assign(
        component: SerializedComponent | string,
        fullPath: string,
        namedAnchor: string,
    ) {
        if (typeof component === "string") {
            return;
        }

        const name = authorGivenName(component);

        // A named component hangs off the nearest named ancestor, skipping the
        // positions of any unnamed ones in between: that is what lets an author
        // wrap it in a `<div>`, or add a paragraph above it, without moving it.
        // Where the name is not available -- unnamed, or the name is already
        // taken -- position is the fallback, and a tree position is unique by
        // construction.
        let path = fullPath;
        if (name !== undefined) {
            const anchored = `${namedAnchor}/~${name}`;
            // A name the author reused elsewhere under the same anchor cannot
            // identify this component, so fall back to its position rather than
            // hand two components the same key.
            if (!assigned.has(anchored)) {
                path = anchored;
            }
        }

        assigned.add(path);
        if (component.stateId === undefined) {
            component.stateId = path;
        }

        // Descendants hang off this component's name if it has one, so that a
        // named ancestor shields everything under it from edits above.
        const anchorForChildren = name !== undefined ? path : namedAnchor;

        for (const [index, child] of component.children.entries()) {
            if (typeof child === "string") {
                continue;
            }
            assign(child, `${path}/${index}`, anchorForChildren);
        }

        // Sorted so the recursion order does not depend on the order the
        // attributes happen to be stored in -- the very thing #1944 was about.
        // The names are what the ids are built from, so sorting changes no id.
        for (const attrName of Object.keys(component.attributes).sort()) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "component") {
                assign(
                    attribute.component,
                    `${path}@${attrName}`,
                    anchorForChildren,
                );
            } else if (attribute.type === "references") {
                for (const [
                    index,
                    reference,
                ] of attribute.references.entries()) {
                    assign(
                        reference,
                        `${path}@${attrName}/${index}`,
                        anchorForChildren,
                    );
                }
            }
        }

        // Components written inside the index of a reference path -- the `<b/>`
        // of `$a[<b/>]`. `ComponentBuilder` builds these too, so they need ids
        // of their own or they fall back to their index.
        // `unwrapSource` rather than a hand-written unwrap, so a fourth kind of
        // `Source` could not silently leave a subtree unvisited.
        const refResolution = component.extending
            ? unwrapSource(component.extending)
            : undefined;
        if (refResolution?.originalPath) {
            for (const [
                partIndex,
                pathPart,
            ] of refResolution.originalPath.entries()) {
                for (const [
                    pieceIndex,
                    indexPiece,
                ] of pathPart.index.entries()) {
                    for (const [
                        valueIndex,
                        value,
                    ] of indexPiece.value.entries()) {
                        assign(
                            value,
                            `${path}@@${partIndex}.${pieceIndex}.${valueIndex}`,
                            anchorForChildren,
                        );
                    }
                }
            }
        }
    }

    assign(document, "", "");
}

/**
 * The name the author wrote for `component`, or `undefined` where they wrote
 * none.
 *
 * Not every name in the tree is the author's. `pluginAddCompatibilityNames`
 * names every element the author left unnamed, `_<componentType><n>`, from a
 * counter in document order — so anchoring on one would be no more stable than
 * the position it replaces, and would cost more bytes. They are recognised by
 * their leading underscore, which is the form that plugin documents. Should an
 * author write a name of that form themselves, the only consequence is that
 * the component is keyed by position rather than by name: less robust to an
 * edit above it, but no less correct.
 *
 * What is built after that plugin runs — everything sugar adds, in the parser
 * and again here — carries no name at all, and falls to position the same way.
 */
function authorGivenName(component: SerializedComponent): string | undefined {
    const nameAttribute = component.attributes?.name;
    if (
        nameAttribute?.type === "primitive" &&
        nameAttribute.primitive.type === "string" &&
        nameAttribute.primitive.value &&
        !nameAttribute.primitive.value.startsWith("_")
    ) {
        return nameAttribute.primitive.value;
    }
    return undefined;
}

/**
 * Whether `component` is a `<variantControl>` written with `extend`, `copy`
 * or `copyWithState`, whether or not what it references is found. A document's
 * variants are decided before anything in it is made, so before what the
 * attribute references could be read: a `<variantControl>` must be written
 * out, and one made from another is an error at load (`doenet-e0088`, D47
 * decision 1).
 */
export function variantControlMadeFrom(
    component: UnflattenedComponent,
): boolean {
    return (
        component.componentType === "variantControl" &&
        ((component.extending !== undefined &&
            !("Ref" in component.extending)) ||
            component.doenetAttributes?.madeFromAnother === true)
    );
}

/**
 * Expand the intermediate form `UnflattenedComponent` to `SerializedComponent`,
 * which is the format used in the Javascript Core.
 *
 * The main new feature of `SerializedComponent`
 * is that the attributes have been expanded into one of
 * `ComponentAttribute`, `PrimitiveAttribute` or `UnresolvedAttribute`,
 * depending on the attributes defined for the parent's component type.
 *
 * If an error is encountered, convert the serialized component
 * to an "error" (componentType: "_error"), and record the error
 * in the `diagnostics` record.
 */
export function expandUnflattenedToSerializedComponents({
    serializedComponents,
    componentInfoObjects,
    nComponents,
    ignoreErrors = false,
    init = true,
    stateIdInfo,
}: {
    serializedComponents: (UnflattenedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    ignoreErrors?: boolean;
    init?: boolean;
    stateIdInfo?: { prefix: string; num: number };
}): {
    components: (SerializedComponent | string)[];
    diagnostics: DiagnosticRecord[];
    nComponents: number;
} {
    const diagnostics: DiagnosticRecord[] = [];

    let newComponents: (SerializedComponent | string)[] = [];

    for (let component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        let componentClass: DoenetMLComponentClass<any> =
            componentInfoObjects.allComponentClasses[component.componentType];
        let newComponent: SerializedComponent;

        try {
            if (componentClass === undefined) {
                // A tag is matched exactly, with `copy` or `extend` as
                // without (D51); one in another case suggests the tag.
                throw new DiagnosticError({
                    code: "doenet-e0002",
                    args: {
                        componentType: component.componentType,
                        ...suggestionArgs(
                            nameDifferingOnlyInCase(
                                component.componentType,
                                authoredComponentTypes(componentInfoObjects),
                            ),
                        ),
                    },
                });
            }

            if (variantControlMadeFrom(component)) {
                throw new DiagnosticError({ code: "doenet-e0088" });
            }

            const expandResult = expandAllUnflattenedAttributes({
                unflattenedAttributes: component.attributes,
                componentClass,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
                authoredComponentType: component.authoredComponentType,
            });
            let attributes: Record<string, SerializedAttribute> =
                expandResult.attributes;
            diagnostics.push(...expandResult.diagnostics);
            nComponents = expandResult.nComponents;

            const defaultPrimitiveResult = addDefaultPrimitiveAttributes({
                unflattenedAttributes: component.attributes,
                currentAttributes: attributes,
                componentClass,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
            });
            attributes = defaultPrimitiveResult.attributes;
            diagnostics.push(...defaultPrimitiveResult.diagnostics);
            nComponents = defaultPrimitiveResult.nComponents;

            let extending: Source<SerializedRefResolution> | undefined =
                undefined;

            if (component.extending) {
                const unflattenedRefResolution = unwrapSource(
                    component.extending,
                );
                const refResolutionResult = expandUnflattenedRefResolution({
                    unflattenedRefResolution,
                    componentInfoObjects,
                    nComponents,
                    ignoreErrors,
                    stateIdInfo,
                });

                const refResolution = refResolutionResult.refResolution;
                extending = addSource(refResolution, component.extending);

                diagnostics.push(...refResolutionResult.diagnostics);
                nComponents = refResolutionResult.nComponents;
            }

            newComponent = {
                ...component,
                type: "serialized",
                children: [],
                attributes,
                extending,
                doenetAttributes: component.doenetAttributes ?? {},
            };
        } catch (e) {
            const convertResult = convertToErrorComponent(component, e);
            newComponent = convertResult.component;

            if (!ignoreErrors) {
                diagnostics.push({
                    type: "error",
                    message: convertResult.message,
                    // Empty unless the caught error named its diagnostic by
                    // code, which `convertToErrorComponent` has already read
                    // off it and put on the `_error` component.
                    ...diagnosticCodeFrom(convertResult),
                    // where the `_error` is: at the attribute that caused
                    // it, when the error names one
                    position: newComponent.position,
                    sourceDoc: component.sourceDoc,
                });
            }
        }

        //recurse on children
        let ignoreErrorsInChildren =
            ignoreErrors || componentClass?.ignoreErrorsFromChildren;
        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: component.children,
            componentInfoObjects,
            nComponents,
            ignoreErrors: ignoreErrorsInChildren,
            init: false,
            stateIdInfo,
        });
        newComponent.children = res.components;
        diagnostics.push(...res.diagnostics);
        nComponents = res.nComponents;

        newComponents.push(newComponent);
    }

    if (init) {
        // decodeXMLEntities recurses to children,
        // so just apply it during the first pass (not on recursion to children)
        newComponents = decodeXMLEntities(newComponents);
    }

    return { diagnostics, components: newComponents, nComponents };
}

function expandUnflattenedRefResolution({
    unflattenedRefResolution,
    componentInfoObjects,
    nComponents,
    ignoreErrors,
    stateIdInfo,
}: {
    unflattenedRefResolution: UnflattenedRefResolution;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    ignoreErrors: boolean;
    stateIdInfo?: { prefix: string; num: number };
}): {
    refResolution: SerializedRefResolution;
    diagnostics: DiagnosticRecord[];
    nComponents: number;
} {
    let unresolvedPath: SerializedRefResolutionPathPart[] | null = null;
    const diagnostics: DiagnosticRecord[] = [];

    if (unflattenedRefResolution.unresolvedPath) {
        const res = expandUnflattenedPath({
            unflattenedPath: unflattenedRefResolution.unresolvedPath,
            componentInfoObjects,
            nComponents,
            ignoreErrors,
            stateIdInfo,
        });

        unresolvedPath = res.expandedPath;
        nComponents = res.nComponents;
        diagnostics.push(...res.diagnostics);
    }

    const res = expandUnflattenedPath({
        unflattenedPath: unflattenedRefResolution.originalPath,
        componentInfoObjects,
        nComponents,
        ignoreErrors,
        stateIdInfo,
    });

    const originalPath = res.expandedPath;
    nComponents = res.nComponents;
    diagnostics.push(...res.diagnostics);

    const refResolution: SerializedRefResolution = {
        nodeIdx: unflattenedRefResolution.nodeIdx,
        unresolvedPath,
        originalPath,
        nodesInResolvedPath: [...unflattenedRefResolution.nodesInResolvedPath],
    };

    return {
        refResolution,
        diagnostics,
        nComponents,
    };
}

function expandUnflattenedPath({
    unflattenedPath,
    componentInfoObjects,
    nComponents,
    ignoreErrors,
    stateIdInfo,
}: {
    unflattenedPath: UnflattenedPathPart[];
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    ignoreErrors: boolean;
    stateIdInfo?: { prefix: string; num: number };
}) {
    const diagnostics: DiagnosticRecord[] = [];

    const expandedPath = unflattenedPath.map((path_part) => {
        let index = path_part.index.map((flat_index) => {
            let res = expandUnflattenedToSerializedComponents({
                serializedComponents: flat_index.value,
                componentInfoObjects,
                nComponents,
                ignoreErrors,
                stateIdInfo,
            });
            let valueComponents = res.components;
            diagnostics.push(...res.diagnostics);
            nComponents = res.nComponents;

            if (valueComponents.length !== 1) {
                throw Error("Unresolved index should be a single component");
            }

            return {
                value: valueComponents,
                position: flat_index.position,
                sourceDoc: flat_index.sourceDoc,
            };
        });

        return {
            index,
            name: path_part.name,
            position: path_part.position,
            sourceDoc: path_part.sourceDoc,
        };
    });

    return { expandedPath, nComponents, diagnostics };
}

/**
 * Based on the attribute definitions of `componentClass`,
 * expand all `unflattenedAttributes` into `SerializedAttribute`s.
 *
 * If errors were encountered within an attribute,
 * the attribute many contain children that are `_error`s
 * and information about the error appended to `diagnostics`.
 *
 * Throws an Error if errors found in the attribute specifications
 * (which will be caught and turn the parent component into an `_error`).
 */
export function expandAllUnflattenedAttributes({
    unflattenedAttributes,
    componentClass,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
    authoredComponentType,
}: {
    unflattenedAttributes: Record<string, UnflattenedAttribute>;
    componentClass: DoenetMLComponentClass<any>;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    stateIdInfo?: { prefix: string; num: number };
    /**
     * The tag the author wrote, when the component has since been retyped.
     * Only a message uses it; validation still answers to `componentClass`.
     */
    authoredComponentType?: string;
}): {
    attributes: Record<string, SerializedAttribute>;
    diagnostics: DiagnosticRecord[];
    nComponents: number;
} {
    let classAttributes = componentClass.createAttributesObject();

    const diagnostics: DiagnosticRecord[] = [];

    let attributes: Record<string, SerializedAttribute> = {};

    // The `<document>` is the root, which nothing can replace: an attribute
    // it doesn't have is reported at the attribute, which
    // is ignored, and the rest of the document renders (DIAG-5, #2614 item 1). Anywhere else, it
    // is thrown, and the component becomes an `_error`.
    const keepComponent = componentClass.componentType === "document";
    function attributeError(
        error: DiagnosticError,
        attribute: UnflattenedAttribute,
    ) {
        if (!keepComponent) {
            throw error;
        }
        diagnostics.push(
            codedDiagnostic({
                type: "error",
                code: error.code as any,
                args: error.args as any,
                position: attribute.position,
                sourceDoc: attribute.sourceDoc,
            }),
        );
    }

    // Matched exactly (D51). One written in another case was given the
    // component's spelling already, with a warning, for now: by the parser
    // (`attribute-name-case.ts`), or, for one the schema hides, by
    // `correctAttributeNameCase`.
    for (let attr in unflattenedAttributes) {
        const attrName = attr;
        let attrDef = Object.hasOwn(classAttributes, attr)
            ? classAttributes[attr]
            : undefined;
        if (attrDef) {
            let attribute = unflattenedAttributes[attr];
            if (attrDef.readBeforeReferences) {
                const res = withoutReferences({ attribute, attrName });
                diagnostics.push(...res.diagnostics);
                if (!res.attribute) {
                    continue;
                }
                attribute = res.attribute;
                // A blank number (`<variantControl numVariants="">`) is
                // ignored, with an error at the attribute, rather than read
                // as 0 or made an error that replaces the component: these
                // never stop the document (D47 decision 1).
                if (
                    (attrDef.createPrimitiveOfType === "number" ||
                        attrDef.createPrimitiveOfType === "integer") &&
                    attribute.children.every(
                        (child) =>
                            typeof child === "string" && child.trim() === "",
                    )
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "error",
                            code: "doenet-e0072",
                            args: { attribute: attrName },
                            position: attribute.position,
                            sourceDoc: attribute.sourceDoc,
                        }),
                    );
                    continue;
                }
                // So is one that isn't a number (`numVariants="abc"`), which
                // was read as `NaN` and fell back to the default silently
                // (#2623 item 5).
                if (
                    attrDef.createPrimitiveOfType === "number" ||
                    attrDef.createPrimitiveOfType === "integer"
                ) {
                    const written = attribute.children
                        .map((child) =>
                            typeof child === "string" ? child : "",
                        )
                        .join("")
                        .trim();
                    if (!Number.isFinite(Number(written))) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "error",
                                code: "doenet-e0089",
                                args: { attribute: attrName, value: written },
                                position: attribute.position,
                                sourceDoc: attribute.sourceDoc,
                            }),
                        );
                        continue;
                    }
                }
            }

            let res = expandAttribute({
                attrDef,
                attribute,
                allUnflattenedAttributes: unflattenedAttributes,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
            });
            attributes[attrName] = res.attribute;
            diagnostics.push(...res.diagnostics);
            nComponents = res.nComponents;
        } else if (componentClass.acceptAnyAttribute || attr.includes(":")) {
            let res = expandAttribute({
                attribute: unflattenedAttributes[attr],
                allUnflattenedAttributes: unflattenedAttributes,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
            });
            attributes[attr] = res.attribute;
            diagnostics.push(...res.diagnostics);
            nComponents = res.nComponents;
        } else {
            attributeError(
                new DiagnosticError({
                    code: "doenet-e0004",
                    args: {
                        attribute: attr,
                        // What the author wrote, not what the component was
                        // retyped to. Naming `<integer>` for a `<number>`
                        // written between index brackets points at markup
                        // that is nowhere in their document (#1919).
                        componentType:
                            authoredComponentType ??
                            componentClass.componentType,
                        ...suggestionArgs(
                            nameDifferingOnlyInCase(attr, [
                                ...Object.keys(classAttributes),
                                ...ATTRIBUTES_OF_EVERY_TAG,
                            ]),
                        ),
                    },
                }),
                unflattenedAttributes[attr],
            );
        }
    }
    return { attributes, diagnostics, nComponents };
}

/**
 * If there are any primitive attributes that define a default value
 * but were not specified via props, add them with their default value.
 */
export function addDefaultPrimitiveAttributes({
    unflattenedAttributes,
    currentAttributes,
    componentClass,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}: {
    unflattenedAttributes?: Record<string, UnflattenedAttribute>;
    currentAttributes: Record<string, SerializedAttribute>;
    componentClass: DoenetMLComponentClass<any>;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    stateIdInfo?: { prefix: string; num: number };
}): {
    attributes: Record<string, SerializedAttribute>;
    diagnostics: DiagnosticRecord[];
    nComponents: number;
} {
    const diagnostics: DiagnosticRecord[] = [];

    let classAttributes = componentClass.createAttributesObject();

    const newAttributes = { ...currentAttributes };

    for (let attrName in classAttributes) {
        let attrDef = classAttributes[attrName];

        if (
            attrDef.createPrimitiveOfType &&
            "defaultPrimitiveValue" in attrDef &&
            !(attrName in currentAttributes)
        ) {
            let res = expandAttribute({
                attrDef: attrDef,
                allUnflattenedAttributes: unflattenedAttributes,
                attribute: {
                    name: attrName,
                    children: [attrDef.defaultPrimitiveValue.toString()],
                },
                componentInfoObjects,
                nComponents,
                stateIdInfo,
            });
            newAttributes[attrName] = res.attribute;
            diagnostics.push(...res.diagnostics);
            nComponents = res.nComponents;
        }
    }
    return { attributes: newAttributes, diagnostics, nComponents };
}

/**
 * The attribute `attribute`, of an attribute read before references can be
 * (`readBeforeReferences`), with any reference in it removed and the text
 * around it kept, joined. A reference is reported once for the attribute,
 * with `doenet-e0085`. When nothing but blank text is left, `attribute` is
 * `undefined`: the attribute is left out, as if not written.
 */
function withoutReferences({
    attribute,
    attrName,
}: {
    attribute: UnflattenedAttribute;
    attrName: string;
}): {
    attribute: UnflattenedAttribute | undefined;
    diagnostics: DiagnosticRecord[];
} {
    if (attribute.children.every((child) => typeof child === "string")) {
        return { attribute, diagnostics: [] };
    }

    const text = attribute.children
        .filter((child): child is string => typeof child === "string")
        .join("");

    const diagnostics: DiagnosticRecord[] = [
        codedDiagnostic({
            type: "error",
            code: "doenet-e0085",
            args: { attribute: attrName },
            position: attribute.position,
            sourceDoc: attribute.sourceDoc,
        }),
    ];

    if (text.trim() === "") {
        return { attribute: undefined, diagnostics };
    }

    return { attribute: { ...attribute, children: [text] }, diagnostics };
}

/**
 * Based on the `attrDef` (determined from parent's component type),
 * convert the unflattened attribute `attribute`
 * into a `SerializedAttribute`, which will be one of
 * `ComponentAttribute`, `PrimitiveAttribute` or `UnresolvedAttribute`,
 */
export function expandAttribute({
    attrDef,
    attribute,
    allUnflattenedAttributes = {},
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}: {
    attrDef?: AttributeDefinition<any>;
    attribute: UnflattenedAttribute | UnresolvedAttribute;
    allUnflattenedAttributes?: Record<string, UnflattenedAttribute>;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    stateIdInfo?: { prefix: string; num: number };
}): {
    attribute: SerializedAttribute;
    diagnostics: DiagnosticRecord[];
    nComponents: number;
} {
    const diagnostics: DiagnosticRecord[] = [];

    if (attrDef?.createComponentOfType) {
        const initialResult = createInitialComponentFromAttribute({
            attrDef,
            attribute,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        });

        const unflattenedComponent = initialResult.component;
        nComponents = initialResult.nComponents;

        if (attribute.position) {
            unflattenedComponent.position = attribute.position;
        }
        if (attribute.sourceDoc !== undefined) {
            unflattenedComponent.sourceDoc = attribute.sourceDoc;
        }

        if (!unflattenedComponent.doenetAttributes) {
            unflattenedComponent.doenetAttributes = {};
        }
        unflattenedComponent.doenetAttributes.isAttributeChildFor =
            attribute.name;

        if (
            attrDef.attributesForCreatedComponent ||
            attrDef.copyComponentAttributesForCreatedComponent
        ) {
            const unflattenedComponentAttributes: Record<
                string,
                UnflattenedAttribute
            > = {};
            if (attrDef.attributesForCreatedComponent) {
                for (const attrName in attrDef.attributesForCreatedComponent) {
                    unflattenedComponentAttributes[attrName] = {
                        name: attrName,
                        children: [
                            attrDef.attributesForCreatedComponent[attrName],
                        ],
                    };
                }
            }

            if (attrDef.copyComponentAttributesForCreatedComponent) {
                // Attribute names are matched exactly (D51): one the author
                // wrote in another case was given the declared spelling
                // already (`attribute-name-case.ts`, `correctAttributeNameCase`).
                for (let attrName of attrDef.copyComponentAttributesForCreatedComponent) {
                    if (Object.hasOwn(allUnflattenedAttributes, attrName)) {
                        // XXX: we many need to increment component indices here
                        unflattenedComponentAttributes[attrName] = JSON.parse(
                            JSON.stringify(allUnflattenedAttributes[attrName]),
                        );
                    }
                }
            }

            unflattenedComponent.attributes = unflattenedComponentAttributes;
        }

        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: [unflattenedComponent],
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        });
        diagnostics.push(...res.diagnostics);
        nComponents = res.nComponents;

        let attr: SerializedAttribute = {
            type: "component",
            name: attribute.name,
            component: removeBlankStringChildren(
                res.components,
                componentInfoObjects,
            )[0] as SerializedComponent,
            sourceDoc: attribute.sourceDoc,
        };
        if (attrDef.ignoreFixed) {
            // set the component to ignore the fixed of its parent
            attr.component.doenetAttributes.ignoreParentFixed = true;
        }
        return { attribute: attr, diagnostics, nComponents };
    } else if (attrDef?.createPrimitiveOfType) {
        let primitiveValue: PrimitiveAttributeValue =
            createPrimitiveFromAttribute({ attrDef, attribute });

        if (attrDef.validatePrimitives) {
            primitiveValue = attrDef.validatePrimitives(primitiveValue);
        }
        return {
            attribute: {
                type: "primitive",
                name: attribute.name,
                primitive: primitiveValue,
                ...(attribute.position ? { position: attribute.position } : {}),
                sourceDoc: attribute.sourceDoc,
            },
            diagnostics,
            nComponents,
        };
    } else if (attrDef?.createReferences) {
        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: attribute.children,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        });
        diagnostics.push(...res.diagnostics);
        nComponents = res.nComponents;

        const references: SerializedComponent[] = [];
        const stringChildren: string[] = [];

        for (const child of res.components) {
            if (typeof child === "object") {
                references.push(child);
            } else if (typeof child === "string") {
                if (child.trim() !== "") {
                    stringChildren.push(child);
                    if (!attrDef.allowStrings) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0077",
                                args: {
                                    value: child.trim(),
                                    attribute: attribute.name,
                                },
                                position: attribute.position,
                                sourceDoc: attribute.sourceDoc,
                            }),
                        );
                    }
                }
            }
        }

        return {
            attribute: {
                type: "references",
                name: attribute.name,
                references,
                stringChildren,
                position: attribute.position,
                sourceDoc: attribute.sourceDoc,
            },
            diagnostics,
            nComponents,
        };
    } else {
        return {
            attribute: {
                type: "unresolved",
                name: attribute.name,
                children: attribute.children,
                position: attribute.position,
                sourceDoc: attribute.sourceDoc,
            },
            diagnostics,
            nComponents,
        };
    }
}

/**
 * Given that `attrDef` calls for creating a `ComponentAttribute` from `attribute`,
 * create the initial form of an `UnflattenedComponent` to be later converted
 * into a `SerializedComponent` for the attribute.
 *
 * First address special cases of an attribute with no children (corresponding to `true`)
 * as well as a single literal "true" and "false" child in boolean settings.
 * Otherwise create an `UnflattenedComponent` with children being the attribute's children.
 */
function createInitialComponentFromAttribute({
    attrDef,
    attribute,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}: {
    attrDef: AttributeDefinition<any>;
    attribute: UnflattenedAttribute | UnresolvedAttribute;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    stateIdInfo?: { prefix: string; num: number };
}): { component: UnflattenedComponent; nComponents: number } {
    if (attrDef.createComponentOfType === undefined) {
        throw Error(
            "Cannot call initialComponentFromAttribute unless have createComponentOfType",
        );
    }

    if (attribute.children.length === 0) {
        // if attribute is a boolean or has a `valueForTrue`,
        // create a component from `true`
        if (attrDef.valueForTrue !== undefined) {
            return {
                component: {
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    componentIdx: nComponents++,
                    stateId: stateIdInfo
                        ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                        : undefined,
                    attributes: {},
                    children: [],
                    state: { value: attrDef.valueForTrue },
                    sourceDoc: attribute.sourceDoc,
                },
                nComponents,
            };
        } else if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: attrDef.createComponentOfType,
                baseComponentType: "boolean",
            })
        ) {
            return {
                component: {
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    componentIdx: nComponents++,
                    stateId: stateIdInfo
                        ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                        : undefined,
                    attributes: {},
                    children: [],
                    state: { value: true },
                    sourceDoc: attribute.sourceDoc,
                },
                nComponents,
            };
        } else {
            throw new DiagnosticError({
                code: "doenet-e0072",
                args: { attribute: attribute.name },
            });
        }
    } else if (attribute.children.length === 1) {
        const firstChild = attribute.children[0];

        if (typeof firstChild === "string") {
            // Address special case of a single string child of "true" or "false",
            // where either have a boolean attribute or an attribute
            // with valueForTrue/valueForFalse.
            let valueTrimLower = firstChild.trim().toLowerCase();

            if (
                valueTrimLower === "true" &&
                attrDef.valueForTrue !== undefined
            ) {
                return {
                    component: {
                        type: "unflattened",
                        componentType: attrDef.createComponentOfType,
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        attributes: {},
                        children: [],
                        state: { value: attrDef.valueForTrue },
                        sourceDoc: attribute.sourceDoc,
                    },
                    nComponents,
                };
            } else if (
                valueTrimLower === "false" &&
                attrDef.valueForFalse !== undefined
            ) {
                return {
                    component: {
                        type: "unflattened",
                        componentType: attrDef.createComponentOfType,
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        attributes: {},
                        children: [],
                        state: { value: attrDef.valueForFalse },
                        sourceDoc: attribute.sourceDoc,
                    },
                    nComponents,
                };
            } else if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: attrDef.createComponentOfType,
                    baseComponentType: "boolean",
                }) &&
                ["true", "false"].includes(valueTrimLower)
            ) {
                return {
                    component: {
                        type: "unflattened",
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        componentType: attrDef.createComponentOfType,
                        attributes: {},
                        children: [],
                        state: { value: valueTrimLower === "true" },
                        sourceDoc: attribute.sourceDoc,
                    },
                    nComponents,
                };
            }
        }
    }

    const component: UnflattenedComponent = {
        type: "unflattened",
        componentType: attrDef.createComponentOfType,
        componentIdx: nComponents++,
        stateId: stateIdInfo
            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
            : undefined,
        attributes: {},
        children: [],
        state: {},
        sourceDoc: attribute.sourceDoc,
    };

    component.children = [...attribute.children];

    return { component, nComponents };
}

/**
 * Given that `attrDef` calls for creating a `PrimitiveAttribute` from `attribute`,
 * create the `PrimitiveAttributeValue` from the attribute's children,
 * based on the type of primitive called for by `attrDef`.
 */
function createPrimitiveFromAttribute({
    attrDef,
    attribute,
}: {
    attrDef: AttributeDefinition<any>;
    attribute: UnflattenedAttribute;
}): PrimitiveAttributeValue {
    if (attrDef.createPrimitiveOfType === undefined) {
        throw Error(
            "Cannot call initialPrimitiveFromAttribute unless have createPrimitiveOfType",
        );
    }

    if (attribute.children.length === 0) {
        // if attribute is a boolean or has a `valueForTrue`,
        // create a component from `true`
        if (attrDef.valueForTrue !== undefined) {
            return attrDef.valueForTrue;
        } else if (attrDef.createPrimitiveOfType === "boolean") {
            return { type: "boolean", value: true };
        } else {
            throw new DiagnosticError({
                code: "doenet-e0072",
                args: { attribute: attribute.name },
            });
        }
    } else if (attribute.children.length === 1) {
        const firstChild = attribute.children[0];

        if (typeof firstChild === "string") {
            let valueTrimLower = firstChild.trim().toLowerCase();

            if (
                valueTrimLower === "true" &&
                attrDef.valueForTrue !== undefined
            ) {
                return attrDef.valueForTrue;
            } else if (
                valueTrimLower === "false" &&
                attrDef.valueForFalse !== undefined
            ) {
                return attrDef.valueForFalse;
            } else if (attrDef.createPrimitiveOfType === "boolean") {
                return { type: "boolean", value: valueTrimLower === "true" };
            } else if (attrDef.createPrimitiveOfType === "number") {
                return { type: "number", value: Number(firstChild) };
            } else if (attrDef.createPrimitiveOfType === "integer") {
                return {
                    type: "number",
                    value: Math.round(Number(firstChild)),
                };
            } else if (attrDef.createPrimitiveOfType === "numberArray") {
                return {
                    type: "numberArray",
                    value: firstChild.trim().split(/\s+/).map(Number),
                };
            } else if (attrDef.createPrimitiveOfType === "stringArray") {
                return {
                    type: "stringArray",
                    value: firstChild.trim().split(/\s+/),
                };
            } else {
                // else assume string
                return { type: "string", value: firstChild };
            }
        }
    }

    // A reference (`sortByProp="$t"`), or text beside one, in an attribute
    // read as text when the document loads, before references are.
    throw new DiagnosticError({
        code: "doenet-e0090",
        args: { attribute: attribute.name },
        ...(attribute.position ? { position: attribute.position } : {}),
    });
}

/**
 * The error that converting `attributes`, written on a tag `componentType`
 * with `extend` or `copy`, would throw when its replacement is made
 * (`convertUnresolvedAttributesForComponentType` in `Copy.js`), if one: an
 * attribute the tag reads as a primitive, written with a reference
 * (`doenet-e0090`) or with no value (`doenet-e0072`). The `_copy`'s own
 * attributes are not the tag's, as there.
 */
export function primitiveAttributeErrorOfCopy({
    componentType,
    attributes,
    componentInfoObjects,
}: {
    componentType: string;
    attributes: Record<string, UnflattenedAttribute>;
    componentInfoObjects: ComponentInfoObjects;
}): DiagnosticError | undefined {
    const attributesObj =
        componentInfoObjects.allComponentClasses[
            componentType
        ]?.createAttributesObject();
    if (!attributesObj) {
        return undefined;
    }
    const copyAttributesObj =
        componentInfoObjects.allComponentClasses._copy.createAttributesObject();
    for (const [name, attribute] of Object.entries(attributes)) {
        if (
            (Object.hasOwn(copyAttributesObj, name) &&
                !copyAttributesObj[name].leaveRaw &&
                name !== "asList") ||
            !Object.hasOwn(attributesObj, name) ||
            attributesObj[name].createPrimitiveOfType === undefined
        ) {
            continue;
        }
        try {
            createPrimitiveFromAttribute({
                attrDef: attributesObj[name],
                attribute,
            });
        } catch (e) {
            if (e instanceof DiagnosticError) {
                return e;
            }
            throw e;
        }
    }
    return undefined;
}

export function convertUnresolvedAttributesForComponentType({
    attributes,
    componentType,
    componentInfoObjects,
    compositeAttributesObj = {},
    dontSkipAttributes = [],
    inheritedAttributes = {},
    nComponents,
    stateIdInfo,
}: {
    attributes: Record<string, SerializedAttribute>;
    componentType: string;
    componentInfoObjects: ComponentInfoObjects;
    compositeAttributesObj?: Record<string, AttributeDefinition<any>>;
    dontSkipAttributes?: string[];
    /**
     * The attributes the component already has, when these are added to a
     * component made from another (the replacement of a `copy` or `extend`,
     * which is its source's DoenetML). A primitive one among them -- the
     * `type` of a `<substitute>` -- is what a sugar function of an attribute
     * written here reads, as it is on a tag written whole, unless one of
     * `attributes` replaces it (#2216).
     */
    inheritedAttributes?: Record<string, SerializedAttribute>;
    nComponents: number;
    stateIdInfo?: {
        prefix: string;
        num: number;
    };
}) {
    const diagnostics: DiagnosticRecord[] = [];

    const newClass = componentInfoObjects.allComponentClasses[componentType];
    const newAttributesObj = newClass.createAttributesObject();

    // Attribute names are matched exactly (D51), and only as the class's
    // own, so that an attribute an author names `constructor` or `toString`
    // finds nothing rather than `Object`'s.
    function ownAttribute<T>(
        attributesObj: Record<string, T>,
        attrName: string,
    ): string | undefined {
        return Object.hasOwn(attributesObj, attrName) ? attrName : undefined;
    }

    const newAttributes: Record<string, SerializedAttribute> = {};

    // What a sugar function of an attribute component reads as its parent's
    // attributes (`applySugar`'s `parentAttributes`): the primitive
    // attributes of the component, the ones written here replacing the ones
    // it already has. So the primitives are converted first.
    const parentAttributes: Record<string, PrimitiveAttributeValue> = {};
    for (const [attrName, attribute] of Object.entries(inheritedAttributes)) {
        if (attribute.type === "primitive") {
            parentAttributes[attrName] = attribute.primitive;
        }
    }
    function isPrimitiveAttribute(attrNameOrig: string) {
        const attrName = ownAttribute(newAttributesObj, attrNameOrig);
        return Boolean(
            attrName !== undefined &&
            newAttributesObj[attrName].createPrimitiveOfType,
        );
    }
    const attrNamesInOrder = [
        ...Object.keys(attributes).filter(isPrimitiveAttribute),
        ...Object.keys(attributes).filter((a) => !isPrimitiveAttribute(a)),
    ];

    for (const attrNameOrig of attrNamesInOrder) {
        const attribute = attributes[attrNameOrig];

        const attrName = ownAttribute(newAttributesObj, attrNameOrig);

        const attrDef =
            attrName === undefined ? undefined : newAttributesObj[attrName];

        // Look the attribute up by the composite's own name for it, not the
        // new class's: a class that accepts any attribute (`<module>`) does
        // not declare the composite's `_createComponentIdx`, and would
        // otherwise be handed it, along with the rest of a `_copy`'s own
        // attributes (#2227).
        const compositeAttrName = ownAttribute(
            compositeAttributesObj,
            attrNameOrig,
        );

        if (
            compositeAttrName !== undefined &&
            !compositeAttributesObj[compositeAttrName].leaveRaw &&
            !dontSkipAttributes.includes(compositeAttrName)
        ) {
            // skip any attributes in the composite itself
            // unless specifically marked to not be processed for the composite
            // or argument is passed in to not skip
            continue;
        }

        if (attrDef && attrName !== undefined) {
            if (attribute.type === "unresolved") {
                let res = expandAttribute({
                    attrDef,
                    attribute,
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });

                newAttributes[attrName] = res.attribute;
                diagnostics.push(...res.diagnostics);
                nComponents = res.nComponents;

                if (res.attribute.type === "primitive") {
                    parentAttributes[attrName] = res.attribute.primitive;
                }

                if (newAttributes[attrName].type === "component") {
                    // give the children of the component new component indices
                    for (const child of newAttributes[attrName].component
                        .children) {
                        if (typeof child === "object") {
                            child.componentIdx = nComponents++;
                            child.stateId = stateIdInfo
                                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                : undefined;
                        }
                    }

                    let serializedComponents = [
                        newAttributes[attrName].component,
                    ];

                    removeBlankStringChildren(
                        serializedComponents,
                        componentInfoObjects,
                    );

                    const sugarResult = applySugar({
                        serializedComponents,
                        parentAttributes,
                        parentComponentType: componentType,
                        componentInfoObjects,
                        nComponents,
                        stateIdInfo,
                    });
                    diagnostics.push(...sugarResult.diagnostics);
                    nComponents = sugarResult.nComponents;

                    newAttributes[attrName].component = sugarResult
                        .components[0] as SerializedComponent;

                    // an attribute that is only a literal becomes the literal
                    const literal =
                        attrName === newClass.addAttributeToResolver
                            ? undefined
                            : literalFromAttributeComponent({
                                  name: attrName,
                                  component: newAttributes[attrName].component,
                                  attrDef,
                                  sourceDoc: newAttributes[attrName].sourceDoc,
                              });
                    if (literal) {
                        newAttributes[attrName] = literal;
                    }
                }
            } else {
                // The attribute is already resolved.
                newAttributes[attrName] = attribute;
            }
        } else if (newClass.acceptAnyAttribute) {
            newAttributes[attrNameOrig] = attribute;
        }
    }

    return { attributes: newAttributes, nComponents };
}

/**
 * The name of the essential value that a component of type `componentType`
 * starts from when it is made from a value (an unlinked copy of a property,
 * an attribute given a value): the essential name of its
 * `primaryStateVariableForDefinition`, which a point (`coords` for
 * `coordsShadow`) or vector (`displacement` for `displacementShadow`) keeps
 * under a name of its own, as `BaseComponent.serialize` writes it.
 */
export function primaryEssentialStateVariableOf({
    componentType,
    componentInfoObjects,
}: {
    componentType: string;
    componentInfoObjects: ComponentInfoObjects;
}): string {
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    if (componentClass.primaryEssentialStateVariable) {
        return componentClass.primaryEssentialStateVariable;
    }
    const varName: string | undefined =
        componentClass.primaryStateVariableForDefinition;
    if (!varName) {
        return "value";
    }
    return (
        componentInfoObjects.stateVariableInfo[componentType]
            ?.stateVariableDescriptions[varName]?.essentialVarName ?? varName
    );
}

/**
 * Convert `attributeValues` into `SerializedAttribute`s for a component of type `componentType`.
 * Attributes that don't match what `componentType` accepts are ignored.
 *
 * Arguments:
 * - `attributeValues`: an object keyed on attribute names with each value consisting
 *   of the desired value for that attribute
 * - `componentType`: the type of component that these attributes will be assigned to.
 * - `componentInfoObjects`
 * - `nComponents`
 *
 * Returns:
 * - `attributes`: the new attributes
 * - `nComponents`
 */
export function convertAttributeValuesForComponentType({
    attributeValues,
    componentType,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}: {
    attributeValues: Record<string, unknown>;
    componentType: string;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    stateIdInfo?: {
        prefix: string;
        num: number;
    };
}) {
    const diagnostics: DiagnosticRecord[] = [];

    const newClass = componentInfoObjects.allComponentClasses[componentType];
    const newAttributesObj = newClass.createAttributesObject();

    const newAttributes: Record<string, SerializedAttribute> = {};

    // Matched exactly (D51).
    for (const attrName in attributeValues) {
        const attributeVal = attributeValues[attrName];

        const attrDef = Object.hasOwn(newAttributesObj, attrName)
            ? newAttributesObj[attrName]
            : undefined;

        if (attrDef?.createComponentOfType) {
            newAttributes[attrName] = {
                type: "component",
                name: attrName,
                component: {
                    type: "serialized",
                    componentIdx: nComponents++,
                    stateId: stateIdInfo
                        ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                        : undefined,
                    componentType: attrDef.createComponentOfType,
                    attributes: {},
                    doenetAttributes: {},
                    state: {
                        [primaryEssentialStateVariableOf({
                            componentType: attrDef.createComponentOfType,
                            componentInfoObjects,
                        })]: attributeVal,
                    },
                    children: [],
                },
            };
        } else if (attrDef?.createPrimitiveOfType) {
            const cType = attrDef.createPrimitiveOfType;

            if (
                cType === "string" ||
                cType === "boolean" ||
                cType === "number"
            ) {
                if (typeof attributeVal === cType) {
                    newAttributes[attrName] = {
                        type: "primitive",
                        name: attrName,
                        primitive: { type: cType, value: attributeVal as any },
                    };
                }
            } else if (cType === "numberArray") {
                if (
                    Array.isArray(attributeVal) &&
                    attributeVal.every((v) => typeof v === "number")
                ) {
                    newAttributes[attrName] = {
                        type: "primitive",
                        name: attrName,
                        primitive: { type: cType, value: attributeVal },
                    };
                }
            } else if (cType === "stringArray") {
                if (
                    Array.isArray(attributeVal) &&
                    attributeVal.every((v) => typeof v === "string")
                ) {
                    newAttributes[attrName] = {
                        type: "primitive",
                        name: attrName,
                        primitive: { type: cType, value: attributeVal },
                    };
                }
            }
        }
    }

    return { attributes: newAttributes, nComponents };
}

/**
 * Unwrap an `extending` attribute to its underlying `refResolution`.
 */
export function unwrapSource<T>(extending: Source<T>): T {
    if ("Ref" in extending) {
        return extending.Ref;
    } else if ("ExtendAttribute" in extending) {
        return extending.ExtendAttribute;
    } else if ("CopyAttribute" in extending) {
        return extending.CopyAttribute;
    } else {
        return extending.CopyWithStateAttribute;
    }
}

/**
 * Whether `extending` came from a `copy` or a `copyWithState` attribute: an
 * unlinked copy, the source's DoenetML pasted (CPY-1).
 */
export function isCopySource<T>(extending: Source<T>): boolean {
    return (
        "CopyAttribute" in extending || "CopyWithStateAttribute" in extending
    );
}

/**
 * Wrap `refResolution` with the type of `Source` that `extending` has.
 */
export function addSource<T, U>(
    refResolution: T,
    extending: Source<U>,
): Source<T> {
    if ("Ref" in extending) {
        return { Ref: refResolution };
    } else if ("ExtendAttribute" in extending) {
        return { ExtendAttribute: refResolution };
    } else if ("CopyAttribute" in extending) {
        return { CopyAttribute: refResolution };
    } else {
        return { CopyWithStateAttribute: refResolution };
    }
}

/**
 * For divisions, return their `type` attribute as `componentType`.
 * For all other elements return their `name` as `componentType`.
 */
function getComponentType(element: FlatElement) {
    if (element.name === "division") {
        const typeAttr = element.attributes.find(
            (attr) => attr.name === "type",
        );
        if (
            typeAttr?.children.length == 1 &&
            typeof typeAttr.children[0] === "string"
        ) {
            return typeAttr.children[0];
        }
    }

    return element.name;
}

/**
 * The reference `reference` (as written, `$s.x`, `$s[1][2]`, `$s[1].x`) of
 * the copy whose resolution is `ref`, with `.P` written after the
 * `<select>` or `<conditionalContent>` it reaches and its first index, if
 * any (`$s.P.x`, `$s[1].P[2]`, `$s[1].P.x`): what to write to read the
 * component named `P` in each option or case (`doenet-w0191`). `undefined`
 * when where to put it is not known from the positions in the DoenetML.
 * After a `<select>` that picks several, only the indexed form reaches here
 * (`$s[1].P.x`): with no index, a name or a property after it names nothing
 * (`doenet-w0200`, D59).
 */
function referenceNamingTheItem(
    ref: any,
    kind: "index" | "property",
    reference: string,
    sources: readonly string[],
    name = "P",
) {
    const path: any[] = ref?.unresolvedPath ?? [];
    const original: any[] = ref?.originalPath ?? [];
    const start = original[0]?.position?.start?.offset;
    const end = original[original.length - 1]?.position?.end?.offset;
    const sourceDoc = original[0]?.sourceDoc ?? 0;
    const source = sources[sourceDoc];
    let at: number | undefined;
    if (path[0]?.name !== "") {
        // before the `.` of the property
        at = path[0]?.position?.start?.offset - 1;
    } else if (kind === "property") {
        // before the `.` of the property after the first index
        at = path[1]?.position?.start?.offset - 1;
    } else {
        // at the `[` of the second index
        at = path[0]?.index?.[1]?.position?.start?.offset;
    }
    if (
        source === undefined ||
        typeof start !== "number" ||
        typeof end !== "number" ||
        typeof at !== "number" ||
        Number.isNaN(at) ||
        at <= start ||
        at > end
    ) {
        return undefined;
    }
    // what is written before the path (`$`, `$$`)
    const written = source.substring(start, end);
    const at0 = reference.indexOf(written);
    if (at0 < 0) {
        return undefined;
    }
    const dollars = reference.slice(0, at0);
    return `${dollars}${source.substring(start, at)}.${name}${source.substring(at, end)}`;
}
