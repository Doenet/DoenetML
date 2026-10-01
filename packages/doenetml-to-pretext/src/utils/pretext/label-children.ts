import type { FlatDastRoot } from "@doenet/doenetml-worker";
import { elementOf, propsOf } from "./writing-space";

/**
 * Take the `<label>` child out of each element that hands it on only so the viewer can
 * show its markup: an input, an answer, a slider, or a button such as `<updateValue>`.
 * Such an element says so with a `labelChildInd` prop. Its PreTeXt renderer draws the
 * label from its `label` prop instead, so the child would print the label a second time
 * or, for a `<choiceInput>`, be counted as one of its choices. `flatDast` is mutated in
 * place.
 */
export function removeLabelChildren(flatDast: FlatDastRoot) {
    for (const element of flatDast.elements) {
        if (!element || !("labelChildInd" in propsOf(element))) {
            continue;
        }
        element.children = element.children.filter(
            (child) => elementOf(child, flatDast)?.name !== "label",
        );
    }
}
