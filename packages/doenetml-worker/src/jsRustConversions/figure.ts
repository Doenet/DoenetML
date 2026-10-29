import type { FlatDastElement } from "../CoreWorker";

/**
 * Conversion from javascript to rust for the figure component.
 *
 * The JS core names its `<caption>` child by component index
 * (`captionChildName`); the figure renderer draws that child in the
 * figure's caption, through `props.captionChild`, so it is taken out of the
 * ordinary children, as a section's title is (`section.ts`).
 */
export function figureJsToRust(
    props: Record<string, any>,
    element: FlatDastElement,
) {
    const captionChildIdx =
        props.captionChildName != null
            ? Number(props.captionChildName)
            : undefined;
    if (captionChildIdx === undefined || !Number.isInteger(captionChildIdx)) {
        props.captionChild = null;
        return;
    }
    props.captionChild = captionChildIdx;
    const captionChild = element.children.findIndex(
        (child) => typeof child !== "string" && child.id === captionChildIdx,
    );
    if (captionChild !== -1) {
        element.children.splice(captionChild, 1);
    }
}
