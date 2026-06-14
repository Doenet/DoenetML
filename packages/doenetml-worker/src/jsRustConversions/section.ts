import type { FlatDastElement, FlatDastElementContent } from "../CoreWorker";

/**
 * Conversion from javascript to rust for the section component
 */
export function sectionJsToRust(
    props: Record<string, any>,
    element: FlatDastElement,
) {
    props.divisionType = element.name;
    props.divisionDepth = props.level;
    element.name = "division";

    let title = props.title;
    props.title = null;

    // Hack to try to get `xrefLabel` info from JS state variables
    let label = title;
    let codeNumber = "";
    let ident = "1";

    const match = label.match(/^(.*)\s+(\d+)$/);

    if (match) {
        label = match[1];
        codeNumber = match[2];
        ident = codeNumber;
    }

    props.xrefLabel = {
        label,
        global_ident: ident,
        local_ident: ident,
        preferred_form: "Global",
    };
    props.codeNumber = codeNumber;

    if (props.titleChildName) {
        const titleChildIdx = Number(props.titleChildName);
        if (Number.isInteger(titleChildIdx)) {
            props.title = titleChildIdx;

            // A title child means the section renders its title separately (via
            // `props.title`), so the xrefLabel must not also carry the title
            // text — otherwise the renderer shows it twice. Clear it whenever a
            // title child exists, independent of whether `element.children` is
            // materialized in this batch: the update path (`flatDastUpdateFromJS`)
            // builds the synthetic element with only the children carried by the
            // current update, which for a section state-only update is empty.
            props.xrefLabel.label = "";

            // When the children are present, also remove the title child so it
            // is not additionally rendered as ordinary section content.
            const titleChild = element.children.findIndex(
                (child) =>
                    typeof child !== "string" && child.id === titleChildIdx,
            );
            if (titleChild !== -1) {
                element.children.splice(titleChild, 1);
            }
        }
    }
}
