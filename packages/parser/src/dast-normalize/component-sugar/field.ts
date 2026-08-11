import { DastAttribute, DastElement, DastElementContent } from "../../types";

/** Variable names a bare expression is read as a function of, when the field
 * does not name any itself. */
const DEFAULT_VARIABLES = "x y";

/**
 * Children a field takes alongside its function, which are left where they are.
 * `xLabel` and `yLabel` are inherited from the graphical base along with
 * `label`, so a field accepts all three.
 */
const NON_FUNCTION_CHILDREN = new Set([
    "label",
    "xLabel",
    "yLabel",
    "description",
    "shortDescription",
]);

/**
 * Wrap a field's bare expression in a `<function>` child, so that
 * `<slopeField>y - x</slopeField>` means the same as
 * `<slopeField><function variables="x y">y - x</function></slopeField>`.
 *
 * Naming the variables is what makes the short form work at all: a `<function>`
 * given none takes only `x`, so every other symbol in the expression would be
 * free and the field would be NaN at every lattice point — drawing nothing
 * while reporting that it has a function.
 *
 * The field's own `variables` attribute is *moved* onto the wrapper rather than
 * read, so the names may be references: `variables="$v1 $v2"` naming two
 * `<mathInput>`s renames the inputs as the student types. Nothing here parses a
 * variable list; `<function>` does, in the one place it always did.
 *
 * A child that is already a `<function>` is left alone. It names its own
 * inputs, so there is nothing for a wrapper to add, and the field's `variables`
 * has no bearing on it — the attribute stays behind, unused. A macro such as
 * `$F` is indistinguishable here from a macro naming a `<math>`, since neither
 * has resolved, so it is wrapped like any other expression. That is right
 * either way: a `<function>` holding a referenced function passes its inputs
 * straight through positionally, so the referenced function keeps the variable
 * names its own author chose.
 */
export function fieldFunctionSugar(node: DastElement) {
    if (!["slopeField", "vectorField"].includes(node.name)) {
        // This should be unreachable
        throw Error(
            "Field function sugar can only be applied to a `<slopeField>` or `<vectorField>`.",
        );
    }

    const isLeftAlone = (child: DastElementContent) =>
        child.type === "element" && NON_FUNCTION_CHILDREN.has(child.name);
    const isBlankText = (child: DastElementContent) =>
        child.type === "text" && child.value.trim() === "";

    const toWrap = node.children.filter((child) => !isLeftAlone(child));
    const substantive = toWrap.filter((child) => !isBlankText(child));

    // Whitespace alone is not an expression. Wrapping it would produce a
    // function that is NaN everywhere — a field that draws nothing while
    // claiming to have a function — where leaving it alone reports honestly
    // that there is no function.
    if (substantive.length === 0) {
        return;
    }

    // Already the thing this sugar would build.
    if (
        substantive.every(
            (child) => child.type === "element" && child.name === "function",
        )
    ) {
        return;
    }

    const variables: DastAttribute = node.attributes.variables ?? {
        type: "attribute",
        name: "variables",
        children: [{ type: "text", value: DEFAULT_VARIABLES }],
        position: node.position,
        source_doc: node.source_doc,
    };
    delete node.attributes.variables;

    const functionChild: DastElement = {
        type: "element",
        name: "function",
        attributes: { variables },
        children: toWrap,
        position: node.position,
        source_doc: node.source_doc,
    };

    // The wrapper takes the place of the first child it swallowed, so a label
    // written before or after the expression stays on that side of it.
    let placed = false;
    node.children = node.children.flatMap((child) => {
        if (isLeftAlone(child)) {
            return [child];
        }
        if (placed) {
            return [];
        }
        placed = true;
        return [functionChild];
    });
}
