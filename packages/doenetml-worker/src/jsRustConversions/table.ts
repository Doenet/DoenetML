import type { FlatDastElement } from "../CoreWorker";

/**
 * Conversion from javascript to rust for the table component.
 *
 * Mirrors the section conversion: extracts the title child from `element.children`
 * and moves it into `props.title` (as a child index), so the renderer does not
 * have to find it by scanning children.
 *
 * `xrefLabel.label` is populated from `tableName` (e.g. "Table 2"), which plays
 * the same role as `titlePrefix` does for sections.  `tableEnumeration` (the
 * bare number, e.g. "2") becomes both `codeNumber` and the ident fields for
 * cross-reference resolution.
 */
export function tableJsToRust(
    props: Record<string, any>,
    element: FlatDastElement,
) {
    props.xrefLabel = {
        label: props.tableName ?? "",
        global_ident: props.tableEnumeration ?? "",
        local_ident: props.tableEnumeration ?? "",
        preferred_form: "Global",
    };
    props.codeNumber = props.tableEnumeration ?? "";
    props.titlePrefix = props.suppressTableNameInTitle
        ? ""
        : (props.tableName ?? "");
    props.divisionType = "table";
    // XXX: this is wrong; should be an actual depth to get the headings correct for accessibility.
    props.divisionDepth = 3;

    const titleChildIdx =
        props.titleChildName != null ? Number(props.titleChildName) : undefined;
    const hasTitleChild =
        titleChildIdx !== undefined && Number.isInteger(titleChildIdx);

    if (hasTitleChild) {
        props.title = titleChildIdx;

        const titleChild = element.children.findIndex(
            (child) => typeof child !== "string" && child.id === titleChildIdx,
        );
        if (titleChild !== -1) {
            element.children.splice(titleChild, 1);
        }
    } else {
        props.title = null;
    }

    delete props.tableEnumeration;
    delete props.titleChildName;
    delete props.tableName;
}
