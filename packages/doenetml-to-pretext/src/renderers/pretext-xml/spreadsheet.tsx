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

    return (
        <tabular>
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
