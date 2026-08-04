import { codedDastError } from "../../coded-dast-error";
import { DastElement, DastError } from "../../types";

/**
 * If there is a `description` attribute, turn it into a `<shortDescription>` child.
 *
 * The attribute is a leftover from version 0.6: it is in neither the schema nor
 * the documentation, so the only authors reaching it are ones carrying old
 * source forward. It still works, and warns.
 *
 * The warning is emitted here rather than from `DEPRECATION_REGISTRY`, which
 * knows how to rename an attribute and how to drop one but not how to turn one
 * into a child. Teaching it that shape would split the knowledge of which child
 * `description` becomes across two places, since this function still has to
 * insert it. Sugar emitting its own coded diagnostics is established — see
 * `answerSugar` — and `convertNormalizedDast` lifts a warning node into a
 * diagnostic wherever in the tree it sits, so it need not be hoisted to the
 * `<document>` the way the deprecation pass hoists its own.
 */
export function descriptionAttributeSugar(node: DastElement) {
    if (
        ![
            "image",
            "video",
            "graph",
            "answer",
            "mathInput",
            "textInput",
            "choiceInput",
            "booleanInput",
            "matrixInput",
            "fractionInput",
        ].includes(node.name)
    ) {
        // This should be unreachable
        throw Error(
            "Description attribute sugar can only be applied to an `<image>`, `<video>`, `<graph>`, `<answer>` or `<*Input>`.",
        );
    }

    const descriptionAttribute = node.attributes["description"];

    if (descriptionAttribute) {
        delete node.attributes["description"];
        const shortDescriptionChild: DastElement = {
            type: "element",
            name: "shortDescription",
            children: descriptionAttribute.children,
            position: descriptionAttribute.position,
            source_doc: descriptionAttribute.source_doc,
            attributes: {},
        };
        const deprecation: DastError = codedDastError({
            code: "doenet-w0120",
            error_type: "warning",
            message: `[deprecation] Attribute \`description\` on \`<${node.name}>\` is deprecated; use a \`<shortDescription>\` child instead.`,
            args: {
                attribute: "description",
                child: "shortDescription",
                // The component the author actually wrote, since this sugar
                // covers ten of them.
                component: node.name,
            },
            position: descriptionAttribute.position ?? node.position,
            source_doc: descriptionAttribute.source_doc ?? node.source_doc,
        });

        node.children.unshift(deprecation, shortDescriptionChild);
    }
}
