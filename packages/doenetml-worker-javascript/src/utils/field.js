/**
 * Shared pieces of `<slopeField>` and `<vectorField>`.
 *
 * The two components differ only in how many outputs their function must have
 * and in what a mark looks like; the lattice they sample it on, and the way
 * they accept the function, are identical.
 */

import { codedDiagnostic } from "./diagnostics";
import { returnWrapNonLabelsDescriptionsSugarFunction } from "./label";

/** Variable names a bare expression is read as a function of, when the field
 * does not say otherwise. */
const DEFAULT_VARIABLES = "x y";

/**
 * The `variables` attribute both field components take.
 *
 * It names the inputs of the `<function>` the sugar builds around a bare
 * expression, so `<slopeField variables="s t">s - t</slopeField>` reads that
 * expression the way its author wrote it. Without naming them, a `<function>`
 * takes only `x` and every other symbol in the expression is free: the field
 * would be NaN at every lattice point and draw nothing, while reporting that it
 * has a function.
 *
 * It is deliberately a primitive rather than a `_variableNameList`: sugar runs
 * before attributes become components, and reads primitives only. The string is
 * handed to `<function variables="...">` untouched, so the variable list is
 * parsed in exactly one place — the same place that parses what an author
 * writes on a `<function>` directly.
 *
 * The attribute has nothing to say about an explicit `<function>` child, which
 * names its own inputs; see {@link returnFieldFunctionSugarInstruction}.
 */
export function returnFieldVariablesAttribute() {
    return {
        variables: {
            createPrimitiveOfType: "string",
            description: `Names of the variables a bare expression is read as a function of. Defaults to "${DEFAULT_VARIABLES}". Ignored when the function is given as a <function> child, which names its own variables.`,
        },
    };
}

/**
 * The lattice attributes both field components take.
 *
 * `dx`, `dy`, `xoffset` and `yoffset` deliberately match `<pegboard>`, which
 * describes the same lattice.
 *
 * @param {string} markNoun plural noun for the marks ("marks", "arrows"), used
 *   in the attribute descriptions.
 * @param {number} markLengthDefault default `markLength`, in pixels.
 * @param {string} markLengthDescription description of `markLength`, which
 *   means something slightly different for each component.
 */
export function returnFieldLatticeAttributes({
    markNoun,
    markLengthDefault,
    markLengthDescription,
}) {
    return {
        dx: {
            createComponentOfType: "number",
            createStateVariable: "dx",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: `Horizontal spacing between ${markNoun}.`,
        },
        dy: {
            createComponentOfType: "number",
            createStateVariable: "dy",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: `Vertical spacing between ${markNoun}.`,
        },
        xoffset: {
            createComponentOfType: "number",
            createStateVariable: "xoffset",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            description: "Horizontal offset of the lattice origin.",
        },
        yoffset: {
            createComponentOfType: "number",
            createStateVariable: "yoffset",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            description: "Vertical offset of the lattice origin.",
        },
        markLength: {
            createComponentOfType: "number",
            createStateVariable: "markLength",
            defaultValue: markLengthDefault,
            public: true,
            forRenderer: true,
            description: markLengthDescription,
        },
        maxMarks: {
            createComponentOfType: "number",
            createStateVariable: "maxMarks",
            defaultValue: 2500,
            public: true,
            forRenderer: true,
            description: `Upper bound on how many ${markNoun} are drawn. Zooming out past this coarsens the lattice rather than drawing an unbounded number of ${markNoun}.`,
        },
    };
}

/**
 * Sugar that wraps a bare expression child in a `<function>` child, so that
 * `<slopeField>y - x</slopeField>` means the same as
 * `<slopeField><function variables="x y">y - x</function></slopeField>`.
 *
 * The wrapping `<function>` is given the field's `variables`, so an author who
 * writes their equation in other letters can say so once on the field rather
 * than reaching for an explicit `<function>`. See
 * {@link returnFieldVariablesAttribute} for why naming them at all is what
 * keeps a bare `y - x` from being NaN everywhere.
 *
 * Children that are *already* `<function>` components are left alone: they name
 * their own inputs, so there is nothing for a wrapper to add, and the field's
 * `variables` has no bearing on them. A reference such as `$F` cannot be told
 * apart from a reference to a `<math>` at this stage — neither has resolved yet
 * — so it is wrapped like any other expression. That is harmless either way: a
 * `<function>` holding a referenced function passes its inputs straight through
 * positionally, so a referenced function keeps the variable names its own
 * author chose.
 *
 * Sugar recurses into what it builds, so from here `<function>`'s own sugar
 * wraps the expression in `<math>` and the variable list splits the string into
 * names. Any `<label>` child is left where it is, which is what the shared
 * wrapping helper is for.
 */
export function returnFieldFunctionSugarInstruction() {
    return {
        replacementFunction(args) {
            // Whitespace alone is not an expression. Wrapping it in a
            // <function> would produce one that is NaN everywhere, i.e. a field
            // that draws nothing while claiming to have a function; leaving the
            // sugar unapplied reports honestly that there is no function.
            // (`every` is also true of no children at all.)
            if (
                args.matchedChildren.every(
                    (child) => typeof child === "string" && child.trim() === "",
                )
            ) {
                return { success: false };
            }

            // Primitive attributes are the ones sugar can see; `variables` is
            // declared primitive so that it can be read here.
            const variables =
                args.componentAttributes?.variables?.value ?? DEFAULT_VARIABLES;

            return returnWrapNonLabelsDescriptionsSugarFunction({
                wrappingComponentType: "function",
                skipIfAllWrappingComponentType: true,
                createWrappingComponentAttributes(nComponents, stateIdInfo) {
                    return {
                        attributes: {
                            variables: {
                                type: "component",
                                name: "variables",
                                component: {
                                    type: "serialized",
                                    componentType: "_variableNameList",
                                    componentIdx: nComponents++,
                                    stateId: stateIdInfo
                                        ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                        : undefined,
                                    children: [variables],
                                    attributes: {},
                                    doenetAttributes: {},
                                    state: {},
                                },
                            },
                        },
                        nComponents,
                    };
                },
            })(args);
        },
    };
}

/**
 * The state variables both field components derive from their `function`
 * attribute.
 *
 * The renderer redraws the field on every pan and zoom without going back to
 * the worker, so what it needs is not a closure but `fDefinitions`, which it
 * rehydrates with `createFunctionFromDefinition`. The worker therefore never
 * asks the function for `numericalfs`, which it would only have to build and
 * throw away. The definitions always describe a function of two inputs, since
 * `returnFieldFunctionAttribute` names both variables on the `<function>` it
 * creates; the renderer can call them as `f(x, y)` without checking an arity.
 *
 * The number of outputs, by contrast, is what a mark is drawn from and so is
 * not negotiable. A function with the wrong number is almost always meant for
 * the sibling component, which the warning says.
 *
 * @param {number} numOutputs how many outputs the function must have — 1 for a
 *   slope field, 2 for a vector field. Anything else is not a usable field, and
 *   `haveFunction` is false so that nothing is drawn.
 */
export function returnFieldFunctionStateVariableDefinitions({ numOutputs }) {
    // The two field components are each other's alternative: whichever one this
    // is, a function with the other's number of outputs belongs to the other.
    const isSlopeField = numOutputs === 1;
    const componentType = isSlopeField ? "slopeField" : "vectorField";
    const alternativeComponentType = isSlopeField
        ? "vectorField"
        : "slopeField";
    const alternativeNumOutputs = isSlopeField ? 2 : 1;

    return {
        haveFunction: {
            forRenderer: true,
            additionalStateVariablesDefined: [
                { variableName: "fDefinitions", forRenderer: true },
            ],
            returnDependencies: () => ({
                functionChildren: {
                    dependencyType: "child",
                    childGroups: ["functions"],
                    variableNames: ["numOutputs", "fDefinitions"],
                },
            }),
            definition({ dependencyValues }) {
                // A second <function> child is not a second field; the first
                // one is the field's function.
                const functionChild =
                    dependencyValues.functionChildren[0] ?? null;

                if (
                    functionChild === null ||
                    functionChild.stateValues.numOutputs !== numOutputs
                ) {
                    const sendDiagnostics = [];

                    // A field with no function at all is visibly unfinished —
                    // it is what the editor's completions leave behind, and a
                    // warning would fire while the author was still typing. A
                    // field whose function is present but has the wrong number
                    // of outputs looks finished and silently draws nothing, so
                    // that one is worth saying out loud.
                    if (functionChild !== null) {
                        const found = functionChild.stateValues.numOutputs;
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0122",
                                args: {
                                    component: componentType,
                                    expected: numOutputs,
                                    found,
                                    // Naming the sibling component only helps
                                    // if the function would actually suit it.
                                    alternative:
                                        found === alternativeNumOutputs
                                            ? alternativeComponentType
                                            : "none",
                                },
                                position: functionChild.position || undefined,
                            }),
                        );
                    }

                    return {
                        setValue: {
                            haveFunction: false,
                            // An empty definition rehydrates to the NaN
                            // function, so a field with no usable function
                            // draws nothing rather than throwing.
                            fDefinitions: Array.from(
                                { length: numOutputs },
                                () => ({}),
                            ),
                        },
                        sendDiagnostics,
                    };
                }

                return {
                    setValue: {
                        haveFunction: true,
                        fDefinitions: functionChild.stateValues.fDefinitions,
                    },
                };
            },
        },
    };
}
