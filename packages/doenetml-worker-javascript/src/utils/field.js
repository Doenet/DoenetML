/**
 * Shared pieces of `<slopeField>` and `<vectorField>`.
 *
 * The two components differ only in how many outputs their function must have
 * and in what a mark looks like; the lattice they sample it on, and the way
 * they accept the function, are identical.
 */

import { codedDiagnostic } from "./diagnostics";
import { returnWrapNonLabelsDescriptionsSugarFunction } from "./label";

/**
 * The `function` attribute both field components take.
 *
 * The `<function>` it creates is always given `variables="x y"`, which is what
 * the sugar does for a bare expression child. Without it, an attribute holding
 * a literal expression — `<vectorField function="(y, -x)" />`, the form the
 * editor's completions offer — would create a `<function>` that takes only `x`,
 * leaving `y` a free symbol: the field would be NaN at every lattice point and
 * draw nothing at all, while reporting that it has a function. Naming both
 * variables is harmless for an expression in `x` alone, since the extra input
 * is simply ignored.
 *
 * A function supplied by reference is unaffected: the created component holds
 * the referenced one as a *child* and passes inputs through to it positionally,
 * so `<function name="F" variables="u v">(v, -u)</function>` keeps the variable
 * names its own author chose.
 *
 * @param {string} description description of the attribute, which says
 *   something different for each component.
 */
export function returnFieldFunctionAttribute({ description }) {
    return {
        function: {
            createComponentOfType: "function",
            attributesForCreatedComponent: { variables: "x y" },
            description,
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
 * Sugar that turns a bare expression child into the `function` attribute, so
 * that `<slopeField>y - x</slopeField>` means the same as
 * `<slopeField function="$f" />` for `<function variables="x y">y - x</function>`.
 *
 * The wrapped function is given `variables="x y"`, for the reason spelled out
 * on {@link returnFieldFunctionAttribute}: without it a bare `y - x` would be
 * read as a function of `x` alone and evaluate to NaN everywhere. The sugar has
 * to name them itself rather than inherit the attribute's
 * `attributesForCreatedComponent`, since it builds the attribute's component
 * directly instead of going through the usual attribute conversion.
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
                functionAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "function",
                    variableNames: ["numOutputs", "fDefinitions"],
                },
            }),
            definition({ dependencyValues }) {
                const attr = dependencyValues.functionAttr;

                if (
                    attr === null ||
                    attr.stateValues.numOutputs !== numOutputs
                ) {
                    const sendDiagnostics = [];

                    // A field with no function at all is visibly unfinished —
                    // it is what the editor's completions leave behind, and a
                    // warning would fire while the author was still typing. A
                    // field whose function is present but has the wrong number
                    // of outputs looks finished and silently draws nothing, so
                    // that one is worth saying out loud.
                    if (attr !== null) {
                        const found = attr.stateValues.numOutputs;
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
                                position: attr.position || undefined,
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
                        fDefinitions: attr.stateValues.fDefinitions,
                    },
                };
            },
        },
    };
}
