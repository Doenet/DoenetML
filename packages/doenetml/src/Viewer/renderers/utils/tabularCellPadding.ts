import type React from "react";

/**
 * A tabular cell's side padding shrinks with the width of the columns it
 * covers, so that a table with many narrow columns still has room for its
 * content between the rules. The padding is `CELL_PADDING_FRACTION` of the
 * cell's width, never more than `MAX_CELL_PADDING_PX` (the padding every cell
 * of an ordinarily sized table gets) and never less than
 * `MIN_CELL_PADDING_PX`.
 *
 * A `<tabular>` is laid out with `table-layout: fixed`, so its column widths
 * follow from its own width and its `<col>` widths alone: a column with a
 * `width` gets it, and the columns without one share what is left equally.
 * The `<tabular>` renderer writes those widths as custom properties on the
 * `<table>` — one per column edge, measured from the table's start — and a
 * cell reads the two edges it sits between. Declaring every edge on every
 * `<table>` keeps a cell of a nested tabular from seeing its outer table's.
 */
export const CELL_PADDING_FRACTION = 0.15;
export const MAX_CELL_PADDING_PX = 10;
export const MIN_CELL_PADDING_PX = 1;

/**
 * The width a table is taken to have before it has been measured: wide
 * enough that every cell gets the full `MAX_CELL_PADDING_PX`.
 */
const UNMEASURED_TABLE_WIDTH = "100000px";

const TABLE_WIDTH_PROPERTY = "--doenet-tabular-width";
const UNSET_COLUMN_WIDTH_PROPERTY = "--doenet-tabular-unset-column-width";

function columnEdgeProperty(edgeIndex: number) {
    return `--doenet-tabular-column-edge-${edgeIndex}`;
}

/**
 * The custom properties a `<tabular>`'s `<table>` declares for its cells:
 * its measured width, the width of each column without a `width` of its own,
 * and the position of every column edge from 0 through `numColumns`.
 */
export function tabularColumnEdgeProperties({
    columnWidths,
    numColumns,
    measuredTableWidth,
}: {
    /** Each `<col>`'s `componentSize` width, or `null`; may be empty. */
    columnWidths: ({ size: number; isAbsolute: boolean } | null)[];
    numColumns: number;
    measuredTableWidth: number | null;
}): Record<string, string> {
    const tableWidth = `var(${TABLE_WIDTH_PROPERTY})`;
    const unsetWidth = `var(${UNSET_COLUMN_WIDTH_PROPERTY})`;

    // Each edge is `fraction * tableWidth + pixels + unsetCount * unsetWidth`,
    // accumulated column by column.
    const edges: string[] = [];
    let fraction = 0;
    let pixels = 0;
    let unsetCount = 0;
    const edgeExpression = () =>
        `calc(${fraction} * ${tableWidth} + ${pixels}px + ${unsetCount} * ${unsetWidth})`;
    edges.push(edgeExpression());
    for (let i = 0; i < numColumns; i++) {
        const width = columnWidths[i];
        if (!width || !Number.isFinite(Number(width.size))) {
            unsetCount++;
        } else if (width.isAbsolute) {
            pixels += Number(width.size);
        } else {
            fraction += Number(width.size) / 100;
        }
        edges.push(edgeExpression());
    }

    const totalUnset = Math.max(unsetCount, 1);
    const properties: Record<string, string> = {
        [TABLE_WIDTH_PROPERTY]:
            measuredTableWidth === null
                ? UNMEASURED_TABLE_WIDTH
                : `${measuredTableWidth}px`,
        [UNSET_COLUMN_WIDTH_PROPERTY]: `max(0px, calc((${1 - fraction} * ${tableWidth} - ${pixels}px) / ${totalUnset}))`,
    };
    edges.forEach((edge, index) => {
        properties[columnEdgeProperty(index)] = edge;
    });
    return properties;
}

/**
 * The side padding of a cell that starts in column `columnIndex` and covers
 * `colSpan` columns. A cell outside a `<row>` (with no column index) keeps
 * the full padding.
 */
export function cellInlinePadding({
    columnIndex,
    colSpan,
}: {
    columnIndex: number | null | undefined;
    colSpan: number;
}): React.CSSProperties["paddingInline"] {
    if (typeof columnIndex !== "number") {
        return `${MAX_CELL_PADDING_PX}px`;
    }
    const span = Number.isInteger(colSpan) && colSpan > 0 ? colSpan : 1;
    // An edge the table did not declare falls back so that the cell gets the
    // full padding.
    const start = `var(${columnEdgeProperty(columnIndex)}, 0px)`;
    const end = `var(${columnEdgeProperty(columnIndex + span)}, ${UNMEASURED_TABLE_WIDTH})`;
    return `clamp(${MIN_CELL_PADDING_PX}px, calc(${CELL_PADDING_FRACTION} * (${end} - ${start})), ${MAX_CELL_PADDING_PX}px)`;
}
