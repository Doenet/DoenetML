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

            const titleChild = element.children.findIndex(
                (child) =>
                    typeof child !== "string" && child.id === titleChildIdx,
            );
            if (titleChild !== -1) {
                element.children.splice(titleChild, 1);
                props.xrefLabel.label = "";
            }
        }
    }
}
