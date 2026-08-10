/**
 * Shared pieces of `<slopeField>` and `<vectorField>`.
 *
 * The two components differ only in how many outputs their function must have
 * and in what a mark looks like; the lattice they sample it on, and the way
 * they accept the function, are identical.
 */

/**
 * The lattice attributes both field components take.
 *
 * `dx`, `dy`, `xoffset` and `yoffset` deliberately match `<pegboard>`, which
 * describes the same lattice.
 *
 * @param {string} markNoun plural noun for a single mark ("marks", "arrows"),
 *   used in the attribute descriptions.
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
 */
export function returnFieldFunctionSugarInstruction() {
    return {
        replacementFunction({ matchedChildren, nComponents, stateIdInfo }) {
            // Nothing to do if there are no children, or only whitespace.
            if (
                matchedChildren.length === 0 ||
                matchedChildren.every(
                    (child) => typeof child === "string" && child.trim() === "",
                )
            ) {
                return { success: false };
            }

            function nextStateId() {
                return stateIdInfo
                    ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                    : undefined;
            }

            // Wrap the children in a <function>, and hand it over as the
            // `function` attribute. Sugar recurses into attribute components,
            // so <function>'s own sugar wraps the strings in <math> from here,
            // and the variable list splits its string into variable names.
            const variables = {
                type: "component",
                name: "variables",
                component: {
                    type: "serialized",
                    componentType: "_variableNameList",
                    componentIdx: nComponents++,
                    stateId: nextStateId(),
                    children: ["x y"],
                    attributes: {},
                    doenetAttributes: {},
                    state: {},
                },
            };

            return {
                success: true,
                newAttributes: {
                    function: {
                        type: "component",
                        name: "function",
                        component: {
                            type: "serialized",
                            componentType: "function",
                            componentIdx: nComponents++,
                            stateId: nextStateId(),
                            children: matchedChildren,
                            attributes: { variables },
                            doenetAttributes: {},
                            state: {},
                        },
                    },
                },
                nComponents,
            };
        },
    };
}

/**
 * Whether the `function` attribute component is usable as a field of
 * `numOutputs` outputs: it must exist, take one or two inputs, and have exactly
 * the expected number of outputs.
 */
export function functionAttrIsUsableField(functionAttr, numOutputs) {
    return (
        functionAttr !== null &&
        (functionAttr.stateValues.numInputs === 1 ||
            functionAttr.stateValues.numInputs === 2) &&
        functionAttr.stateValues.numOutputs === numOutputs
    );
}
