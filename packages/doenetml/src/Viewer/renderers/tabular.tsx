import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";
import { useRecordVisibilityChanges } from "../../utils/visibility";

/** One entry of `<tabular>`'s `columnSpecs`, i.e. one `<col>`'s settings. */
interface ColumnSpec {
    /** A `componentSize`: `{ size, isAbsolute }`, or `null` if unset. */
    width: any;
    halign: string | null;
    topBorder: string | null;
    endBorder: string | null;
}

interface TabularSVs {
    [key: string]: any;
    hidden: boolean;
    renderInlineForListItem: boolean;
    width?: any;
    height?: any;
    topBorder?: any;
    columnSpecs?: ColumnSpec[];
}

/** Translate a DoenetML border weight into a CSS `border-*-width`. */
function borderWeightToCSSWidth(weight: string) {
    if (weight === "minor") {
        return "thin";
    }
    if (weight === "medium") {
        return "medium";
    }
    return "thick";
}

export default React.memo(function Tabular(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<TabularSVs>(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    const tableStyle: React.CSSProperties = {
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        borderCollapse: "collapse",
        borderColor: "var(--canvasText)",
        borderRadius: "var(--mainBorderRadius)",
        tableLayout: "fixed",
    };
    if (SVs.topBorder !== "none") {
        tableStyle.borderTopStyle = "solid";
        if (SVs.topBorder === "minor") {
            tableStyle.borderTopWidth = "thin";
        } else if (SVs.topBorder === "medium") {
            tableStyle.borderTopWidth = "medium";
        } else {
            tableStyle.borderTopWidth = "thick";
        }
    }

    // Known limitation: when tabular is the first child of a list-item section,
    // the table box/cell padding can leave a slight horizontal/vertical offset.
    // We intentionally leave that visual quirk unchanged for now to avoid adding
    // table-specific list-item layout rules without a stronger product need.

    // `<col>` settings are delivered on the `<tabular>` rather than as
    // rendered children, because HTML wants them in a `<colgroup>` ahead of
    // the rows and the worker has already padded them out to one entry per
    // column. Only `width` and `topBorder` are drawn here: a column's
    // `halign` and `endBorder` do not reach cell content through a
    // `<colgroup>`, so the worker inherits those into the cells instead.
    const columnSpecs = SVs.columnSpecs ?? [];
    const colGroup =
        columnSpecs.length > 0 ? (
            <colgroup>
                {columnSpecs.map((spec, index) => {
                    const colStyle: React.CSSProperties = {};
                    const colWidth = sizeToCSS(spec.width ?? undefined);
                    if (colWidth !== undefined) {
                        colStyle.width = colWidth;
                    }
                    if (spec.topBorder && spec.topBorder !== "none") {
                        colStyle.borderTopStyle = "solid";
                        colStyle.borderTopWidth = borderWeightToCSSWidth(
                            spec.topBorder,
                        );
                    }
                    return <col key={index} style={colStyle} />;
                })}
            </colgroup>
        ) : null;

    return (
        <div
            style={{
                margin: getBlockMarginWithOptionalTopSuppression({
                    suppressTopMargin: SVs.renderInlineForListItem,
                }),
            }}
            ref={ref}
        >
            <table id={id} style={tableStyle}>
                {colGroup}
                <tbody>{children}</tbody>
            </table>
        </div>
    );
});
