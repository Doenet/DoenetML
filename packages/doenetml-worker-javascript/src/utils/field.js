/**
 * Shared pieces of `<slopeField>` and `<vectorField>`.
 *
 * The two components differ only in how many outputs their function must have
 * and in what a mark looks like; the lattice they sample it on, and the way
 * they accept the function, are identical.
 */

import { returnWrapNonLabelsDescriptionsSugarFunction } from "./label";

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
 * Sugar that turns a bare expression child into the `function` attribute, so
 * that `<slopeField>y - x</slopeField>` means the same as
 * `<slopeField function="$f" />` for `<function variables="x y">y - x</function>`.
 *
 * The wrapped function is given both variables explicitly. A `<function>` with
 * no `variables` takes only `x`, so a bare `y - x` would otherwise treat `y` as
 * a symbol and evaluate to NaN everywhere — a field that silently draws
 * nothing. Naming both is harmless for an expression that uses only `x`, since
 * the extra input is simply ignored.
 *
 * Sugar recurses into attribute components, so from here `<function>`'s own
 * sugar wraps the expression in `<math>` and the variable list splits its
 * string into variable names. Any `<label>` child is left where it is, which is
 * what the shared wrapping helper is for.
 */
export function returnFieldFunctionSugarInstruction() {
    const wrapChildren = returnWrapNonLabelsDescriptionsSugarFunction({
        wrappingComponentType: "function",
        createAttributeOfType: "function",
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
                            children: ["x y"],
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                        },
                    },
                },
                nComponents,
            };
        },
    });

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

            return wrapChildren(args);
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
 * throw away. `numInputs` comes along because a one-input function built that
 * way has signature `(x, overrideDomain)`, so calling it as `f(x, y)` would
 * quietly pass `y` as `overrideDomain`.
 *
 * @param {number} numOutputs how many outputs the function must have — 1 for a
 *   slope field, 2 for a vector field. Anything else is not a usable field, and
 *   `haveFunction` is false so that nothing is drawn.
 */
export function returnFieldFunctionStateVariableDefinitions({ numOutputs }) {
    return {
        haveFunction: {
            forRenderer: true,
            additionalStateVariablesDefined: [
                { variableName: "fDefinitions", forRenderer: true },
                { variableName: "numInputs", forRenderer: true },
            ],
            returnDependencies: () => ({
                functionAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "function",
                    variableNames: ["numInputs", "numOutputs", "fDefinitions"],
                },
            }),
            definition({ dependencyValues }) {
                const attr = dependencyValues.functionAttr;

                // Both y' = f(x) and y' = f(x, y) are meaningful fields, so
                // either arity is accepted; the number of outputs is not
                // negotiable, since it is what a mark is drawn from.
                const usable =
                    attr !== null &&
                    (attr.stateValues.numInputs === 1 ||
                        attr.stateValues.numInputs === 2) &&
                    attr.stateValues.numOutputs === numOutputs;

                if (!usable) {
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
                            numInputs: 0,
                        },
                    };
                }

                return {
                    setValue: {
                        haveFunction: true,
                        fDefinitions: attr.stateValues.fDefinitions,
                        numInputs: attr.stateValues.numInputs,
                    },
                };
            },
        },
    };
}
