import type { FlatDastRoot } from "@doenet/doenetml-worker";
import { elementOf, mutableProps, propsOf } from "./writing-space";

/**
 * Take the `<label>` children out of each element that has one to label it: an input, an
 * answer, a slider, or a button such as `<updateValue>`. Such an element says so with a
 * `labelChildInd` prop. Left among its children, the label would be printed where the
 * element prints its children, or, for a `<choiceInput>`, be counted as one of its choices.
 *
 * The id of the last `<label>` child, the one the element's `label` comes from, is kept
 * as the element's `labelElementId` prop. A renderer that prints the label prints that
 * element, so the label keeps its markup (`<em>`, `<delete>`, …), which the `label`
 * string has dropped. `flatDast` is mutated in place.
 */
export function detachLabelChildren(flatDast: FlatDastRoot) {
    for (const element of flatDast.elements) {
        if (!element || !("labelChildInd" in propsOf(element))) {
            continue;
        }
        const isLabel = (child: (typeof element.children)[number]) =>
            elementOf(child, flatDast)?.name === "label";
        const labels = element.children.filter(isLabel);
        if (labels.length === 0) {
            continue;
        }
        const label = labels[labels.length - 1];
        if (typeof label !== "string") {
            mutableProps(element).labelElementId = label.id;
        }
        element.children = element.children.filter((child) => !isLabel(child));
    }
}
