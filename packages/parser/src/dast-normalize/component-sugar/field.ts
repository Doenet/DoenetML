import { codedDastError } from "../../coded-dast-error";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastError,
} from "../../types";

/** Variable names a bare expression is read as a function of, when the field
 * does not name any itself. */
const DEFAULT_VARIABLES = "x y";

/**
 * Children this sugar never folds into the function.
 *
 * A field takes a `<shortDescription>`, and takes no label at all: it covers
 * the whole visible region, so there is nowhere for one to sit, and the
 * components set `includeLabels = false`. The label tags are listed anyway so
 * that one written by mistake is left where it was and reported as the invalid
 * child it is, rather than being swallowed into the expression and reported as
 * something else entirely.
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
        warnVariablesIgnored(node, "no-expression");
        return;
    }

    // Already the thing this sugar would build.
    if (
        substantive.every(
            (child) => child.type === "element" && child.name === "function",
        )
    ) {
        warnVariablesIgnored(node, "function-child");
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

/**
 * Say that a `variables` the sugar did not use is being ignored.
 *
 * The attribute only ever reaches the `<function>` this sugar builds, so when
 * no function is built it does nothing at all — silently, and while looking
 * exactly like the attribute of the same name that a `<function>` does obey.
 * An author who wrote it meant something by it, so the two ways it can come to
 * nothing are both worth saying out loud.
 *
 * Nothing is emitted when there is no `variables` to ignore, which is the
 * ordinary case for both.
 */
function warnVariablesIgnored(
    node: DastElement,
    reason: "function-child" | "no-expression",
) {
    const variables = node.attributes.variables;
    if (!variables) {
        return;
    }

    const explanation =
        reason === "function-child"
            ? "The function here is given as a `<function>` child, which names its own variables, so `variables` is ignored."
            : "No such expression is given here, so `variables` is ignored.";

    const warning: DastError = codedDastError({
        code: "doenet-w0124",
        error_type: "warning",
        message: `\`<${node.name}>\`: the \`variables\` attribute names the variables of an expression written directly inside the component. ${explanation}`,
        args: {
            // The field's own tag, since this sugar covers both of them.
            component: node.name,
            reason,
        },
        position: variables.position ?? node.position,
        source_doc: variables.source_doc ?? node.source_doc,
    });

    node.children.unshift(warning);
}
