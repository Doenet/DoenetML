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
    };
};

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
    // PreTeXt currently applies a `<col>` width only to cells holding a `<p>`,
    // not to plain-text cells like these, so the widths are kept in the XML
    // but do not change how PreTeXt draws the table.
    const columnWidths = node.data.props.columnWidths ?? [];
    const hasPretextWidth = columnWidths.some(
        (width) => width != null && !width.isAbsolute,
    );
    const cols: React.ReactNode[] = [];
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
        // PreTeXt stops the whole build if a tabular's `<col>` widths add up
        // to more than 100%, while the spreadsheet itself just scrolls. So
        // widths that overflow are scaled down, keeping their proportions,
        // and rounded down to hundredths. PreTeXt checks by subtracting each
        // width from 100 in floating point, so widths totalling exactly 100%
        // (70.4% and 29.6%) can still fail; shrink the target until they pass.
        const percents = drawnColumns.map(({ percent }) => percent);
        const total = percents.reduce<number>((sum, p) => sum + (p ?? 0), 0);
        let exported = percents;
        for (
            let target = 100;
            !fitsPretextCap(exported) && target > 0;
            target -= 0.01
        ) {
            exported = percents.map((p) =>
                p === null
                    ? null
                    : Math.floor((p * target * 100) / total) / 100,
            );
        }
        drawnColumns.forEach(({ key }, i) => {
            const scaled = exported[i];
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
                            return (
                                <cell key={colIndex} right="minor">
                                    {
                                        // Pretext cannot have both a row and column header, so we have to fake it.
                                        inHeaderColumn ? <em>{cell}</em> : cell
                                    }
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
 * Whether PreTeXt accepts these `<col>` percentages, checked the way its
 * `cap-width-at-one-hundred-percent` template does: each width in turn must
 * not exceed what is left of 100 after subtracting the ones before it.
 */
function fitsPretextCap(percents: (number | null)[]): boolean {
    let cap = 100;
    for (const p of percents) {
        if (!p) {
            continue; // written as a `<col>` with no width
        }
        if (p > cap) {
            return false;
        }
        cap -= p;
    }
    return true;
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
