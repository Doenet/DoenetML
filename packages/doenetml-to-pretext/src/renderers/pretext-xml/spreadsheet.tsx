import React from "react";
import { BasicComponent } from "../types";

type SpreadsheetData = {
    props: {
        cells: string[][];
        columnHeaders: boolean;
        rowHeaders: boolean;
        hiddenRows: number[];
        hiddenColumns: number[];
        cellsInHeader: boolean[][];
        columnWidths?: ({ size: number; isAbsolute: boolean } | null)[];
        width?: { size: number; isAbsolute: boolean };
    };
};

/**
 * The width, in pixels, of the row-label strip Handsontable draws down the
 * left of the spreadsheet in the viewer. It is fixed, and the column
 * percentages are shares of what is left beside it.
 */
const ROW_HEADER_PIXELS = 50;

/**
 * The printed text width, in pixels, assumed for a spreadsheet whose width is
 * a percentage, so that the row-label strip can be given its share of it.
 */
const ASSUMED_PAGE_PIXELS = 600;

/** The width, in points, of the line in PreTeXt's default LaTeX article. */
const LINE_POINTS = 340;

/**
 * The share of the printed line, as a percentage, that LaTeX spends on the
 * padding and rule around each column: 6pt of `\tabcolsep` on each side and a
 * 0.4pt rule, out of the 340pt line of PreTeXt's default article. LaTeX adds
 * it outside a paragraph cell's width, where the viewer counts a cell's
 * padding inside it, so widths totalling 100% would overrun the line by it.
 */
const COLUMN_PADDING_PERCENT = (12.4 / LINE_POINTS) * 100;

/**
 * The width, in points, of a row number in PreTeXt's default LaTeX font: the
 * numbers are emphasized, and measure 5.11pt a digit plus 1.35pt of italic
 * correction (11.57pt for "10", 21.80pt for "1000").
 */
function rowNumberPoints(numDigits: number) {
    return 5.11 * numDigits + 1.35;
}

export const Spreadsheet: BasicComponent<SpreadsheetData> = ({ node }) => {
    const clonedCellData = node.data.props.cells.map((row) => [...row]);
    const includeColumnHeaders = node.data.props.columnHeaders;
    const includeRowHeaders = node.data.props.rowHeaders;
    const hiddenRows = node.data.props.hiddenRows;
    const hiddenColumns = node.data.props.hiddenColumns;
    const cellsInHeader = node.data.props.cellsInHeader;
    // Augment the cell data to add the headers if needed
    if (includeColumnHeaders) {
        clonedCellData.unshift(
            clonedCellData[0].map((_, colIndex) =>
                columnIndexToLabel(colIndex),
            ),
        );
    }
    if (includeRowHeaders) {
        clonedCellData.forEach((row, rowIndex) => {
            if (includeColumnHeaders && rowIndex === 0) {
                row.unshift(""); // Top-left cell is empty if both headers are included
            } else {
                row.unshift(
                    (rowIndex + 1 - (includeColumnHeaders ? 1 : 0)).toString(),
                );
            }
        });
    }

    // PreTeXt takes column widths only as percentages, and once one `<col>`
    // is written it wants one per column, so write a `<col>` for every
    // column that is drawn (the generated row-number column included) as
    // soon as any column has a percentage width. A width in pixels has no
    // PreTeXt equivalent and is dropped, as it is for a `<tabular>`.
    //
    // The printed table is meant to look like the one on screen. There the
    // percentages are shares of the width beside the fixed row-label strip,
    // so they are scaled into what is left of the page once the generated
    // row-number column has its share (see `rowHeaderPercent`), and that
    // column keeps no width of its own, taking its natural width as the
    // strip does.
    //
    // PreTeXt applies a `<col>` width only to a cell holding a `<p>`, which
    // it sets as a paragraph box of that width; a bare-text cell keeps its
    // natural width and can push its column wider. So every cell of a column
    // given a width, other than its generated column label, is wrapped in a
    // `<p>` below (`paragraphColumns`).
    const columnWidths = node.data.props.columnWidths ?? [];
    const hasPretextWidth = columnWidths.some(
        (width) => width != null && !width.isAbsolute,
    );
    const cols: React.ReactNode[] = [];
    const paragraphColumns = new Set<number>();
    if (hasPretextWidth) {
        const numColumns = clonedCellData[0]?.length ?? 0;
        const drawnColumns: { key: number; percent: number | null }[] = [];
        for (let colIndex = 0; colIndex < numColumns; colIndex++) {
            const spreadsheetColIndex = includeRowHeaders
                ? colIndex
                : colIndex + 1;
            if (hiddenColumns.includes(spreadsheetColIndex)) {
                continue;
            }
            const width =
                spreadsheetColIndex === 0
                    ? null
                    : columnWidths[spreadsheetColIndex - 1];
            drawnColumns.push({
                key: colIndex,
                percent: width && !width.isAbsolute ? width.size : null,
            });
        }
        // The share of the page the data columns divide between them: all
        // of it, less the row-number column's share when there is one and
        // the padding LaTeX puts around each column given a width.
        const numWithWidth = drawnColumns.filter(
            ({ percent }) => percent,
        ).length;
        // So many columns that the padding alone fills the line leaves the
        // widths nothing, and they are dropped rather than written negative.
        const available = Math.max(
            0,
            100 -
                (includeRowHeaders
                    ? rowHeaderPercent(
                          node.data.props.width,
                          node.data.props.cells.length,
                      )
                    : 0) -
                numWithWidth * COLUMN_PADDING_PERCENT,
        );
        // The percentages are shares of `available`, as they are shares of
        // the data area on screen. Widths totalling more than 100%, which the
        // spreadsheet just scrolls, are scaled down to fit it, keeping their
        // proportions: PreTeXt stops the whole build if a tabular's `<col>`
        // widths add up to more than 100%. Rounding down to hundredths keeps
        // the total within `available`, which the padding keeps at least
        // 3.65% under 100, clear of the floating-point slack in PreTeXt's
        // own check of the sum.
        const total = drawnColumns.reduce(
            (sum, { percent }) => sum + (percent ?? 0),
            0,
        );
        const exported = drawnColumns.map(({ percent }) =>
            percent === null
                ? null
                : Math.floor(
                      percent * (available / Math.max(total, 100)) * 100,
                  ) / 100,
        );
        drawnColumns.forEach(({ key }, i) => {
            const scaled = exported[i];
            if (scaled) {
                paragraphColumns.add(key);
            }
            // `createElement` because `col` is also an HTML element, whose
            // React typing rejects PreTeXt's attributes (see `tabular.tsx`).
            cols.push(
                React.createElement("col", {
                    key,
                    width: scaled ? `${scaled}%` : undefined,
                }),
            );
        });
    }

    return (
        <tabular>
            {cols}
            {clonedCellData.map((row, rowIndex) => {
                const inHeaderRow = includeColumnHeaders && rowIndex === 0;
                const spreadsheetRowIndex = includeColumnHeaders
                    ? rowIndex
                    : rowIndex + 1;
                if (hiddenRows.includes(spreadsheetRowIndex)) {
                    return null; // Skip hidden rows
                }
                // A `<row header="true">` of the spreadsheet itself, as
                // distinct from the generated A/B/C strip above. PreTeXt marks
                // a header row on the row, and permits more than one in a
                // `<tabular>` — `header` is an optional attribute of every
                // `row` in the schema, and PreTeXt's own sample article has a
                // "Two Row Headers" table — so an authored header row says so
                // the same way the strip does, rather than settling for the
                // `<em>` that stands in for a header *column* below.
                //
                // Necessarily coarser than the grid: `header` belongs to the
                // row, so a header row narrower than the grid marks its empty
                // remainder too, where the grid emphasizes only the cells it
                // has. Row-level is what the author wrote, so it is the better
                // of the two things PreTeXt can say here.
                const inAuthoredHeaderRow = Boolean(
                    cellsInHeader?.[spreadsheetRowIndex - 1]?.some(Boolean),
                );
                const header =
                    inHeaderRow || inAuthoredHeaderRow ? "yes" : undefined;
                return (
                    <row key={rowIndex} header={header} bottom="minor">
                        {row.map((cell, colIndex) => {
                            const inHeaderColumn =
                                includeRowHeaders && colIndex === 0;
                            const spreadsheetColIndex = includeRowHeaders
                                ? colIndex
                                : colIndex + 1;
                            if (hiddenColumns.includes(spreadsheetColIndex)) {
                                return null; // Skip hidden columns
                            }
                            let content: React.ReactNode = cell;
                            // The generated A/B/C labels are left bare: they
                            // are too short to widen a column, and PreTeXt's
                            // LaTeX drops a header row's bold for a paragraph.
                            if (
                                paragraphColumns.has(colIndex) &&
                                !inHeaderRow
                            ) {
                                content = <p>{cell}</p>;
                            } else if (inHeaderColumn) {
                                // Pretext cannot have both a row and column header, so we have to fake it.
                                content = <em>{cell}</em>;
                            }
                            return (
                                <cell key={colIndex} right="minor">
                                    {content}
                                </cell>
                            );
                        })}
                    </row>
                );
            })}
        </tabular>
    );
};

/**
 * The share of the printed width, as a percentage, to leave the generated
 * row-number column, so that the columns beside it get the same proportions
 * of the table they have on screen: the row-label strip's fixed pixels as a
 * fraction of the spreadsheet's width, or of an assumed page width when the
 * spreadsheet's width is itself a percentage.
 *
 * Never less than the column needs in print, though. LaTeX sets it at its
 * natural width, its widest number plus the padding around it, whatever
 * share it was left, so a wide spreadsheet (where 50px is a small share)
 * would otherwise overrun the line.
 */
function rowHeaderPercent(
    width: { size: number; isAbsolute: boolean } | undefined,
    numRows: number,
): number {
    const totalPixels =
        width?.isAbsolute && width.size > ROW_HEADER_PIXELS
            ? width.size
            : ASSUMED_PAGE_PIXELS;
    const onScreen = (ROW_HEADER_PIXELS / totalPixels) * 100;
    const numDigits = String(Math.max(numRows, 1)).length;
    const inPrint =
        COLUMN_PADDING_PERCENT +
        (rowNumberPoints(numDigits) / LINE_POINTS) * 100;
    return Math.max(onScreen, inPrint);
}

/**
 * Convert a 0-indexed value into a spreadsheet column label. For example, 0 -> "A", 1 -> "B", ..., 25 -> "Z", 26 -> "AA", etc.
 */
function columnIndexToLabel(index: number): string {
    let label = "";
    while (index >= 0) {
        label = String.fromCharCode((index % 26) + 65) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label;
}
