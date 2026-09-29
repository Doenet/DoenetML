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
 * follow from its own width and its `<col>` widths alone. The `<tabular>`
 * renderer works those widths out from the table's measured width and
 * writes them as custom properties on the `<table>` — one per column edge,
 * measured from the table's start — and a cell reads the two edges it sits
 * between. Declaring every edge on every `<table>` keeps a cell of a nested
 * tabular from seeing its outer table's.
 */
export const CELL_PADDING_FRACTION = 0.15;
export const MAX_CELL_PADDING_PX = 10;
export const MIN_CELL_PADDING_PX = 1;

/**
 * The width a table is taken to have before it has been measured: wide
 * enough that every cell gets the full `MAX_CELL_PADDING_PX`.
 */
const UNMEASURED_TABLE_WIDTH_PX = 100000;

function columnEdgeProperty(edgeIndex: number) {
    return `--doenet-tabular-column-edge-${edgeIndex}`;
}

/**
 * The width of each of `numColumns` columns of a fixed-layout table
 * `tableWidth` pixels wide, distributed the way browsers do it:
 * - a column with an absolute `width` gets it;
 * - a column with a percentage `width` gets that share of the table, except
 *   that the percentage columns together get no more than what the absolute
 *   ones leave, shrinking in proportion to fit it;
 * - the columns without a `width` share what is left equally;
 * - if every column has a `width` and some of the table is left over, the
 *   absolute columns grow in proportion to their widths to fill it, or the
 *   percentage columns do if there are no absolute ones.
 */
export function fixedLayoutColumnWidths({
    columnWidths,
    numColumns,
    tableWidth,
}: {
    columnWidths: ({ size: number; isAbsolute: boolean } | null)[];
    numColumns: number;
    tableWidth: number;
}): number[] {
    const kinds: ("absolute" | "percent" | "unset")[] = [];
    const sizes: number[] = [];
    for (let i = 0; i < numColumns; i++) {
        const width = columnWidths[i];
        const size = Number(width?.size);
        if (!width || !Number.isFinite(size) || size < 0) {
            kinds.push("unset");
            sizes.push(0);
        } else if (width.isAbsolute) {
            kinds.push("absolute");
            sizes.push(size);
        } else {
            kinds.push("percent");
            sizes.push((size / 100) * tableWidth);
        }
    }

    const total = (kind: string) =>
        sizes.reduce(
            (sum, size, i) => (kinds[i] === kind ? sum + size : sum),
            0,
        );
    const absoluteTotal = total("absolute");
    const percentTotal = total("percent");
    const unsetCount = kinds.filter((kind) => kind === "unset").length;

    const afterAbsolute = Math.max(0, tableWidth - absoluteTotal);
    const percentScale =
        percentTotal > afterAbsolute ? afterAbsolute / percentTotal : 1;
    const widths = sizes.map((size, i) =>
        kinds[i] === "percent" ? size * percentScale : size,
    );
    const leftOver = afterAbsolute - percentTotal * percentScale;

    if (unsetCount > 0) {
        return widths.map((width, i) =>
            kinds[i] === "unset" ? leftOver / unsetCount : width,
        );
    }
    const growKind =
        absoluteTotal > 0 ? "absolute" : percentTotal > 0 ? "percent" : null;
    if (growKind === null) {
        return widths.map(() => leftOver / Math.max(numColumns, 1));
    }
    const growTotal = growKind === "absolute" ? absoluteTotal : percentTotal;
    return widths.map((width, i) =>
        kinds[i] === growKind ? width + (leftOver * width) / growTotal : width,
    );
}

/**
 * The custom properties a `<tabular>`'s `<table>` declares for its cells:
 * the position of every column edge from 0 through `numColumns`.
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
    const widths = fixedLayoutColumnWidths({
        columnWidths,
        numColumns,
        tableWidth: measuredTableWidth ?? UNMEASURED_TABLE_WIDTH_PX,
    });
    const properties: Record<string, string> = {};
    let edge = 0;
    properties[columnEdgeProperty(0)] = "0px";
    widths.forEach((width, index) => {
        edge += width;
        // Rounded so that the value is always written in plain decimal.
        properties[columnEdgeProperty(index + 1)] =
            `${Math.round(edge * 1000) / 1000}px`;
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
    const end = `var(${columnEdgeProperty(columnIndex + span)}, ${UNMEASURED_TABLE_WIDTH_PX}px)`;
    return `clamp(${MIN_CELL_PADDING_PX}px, calc(${CELL_PADDING_FRACTION} * (${end} - ${start})), ${MAX_CELL_PADDING_PX}px)`;
}
