import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { HotTable } from "@handsontable/react-wrapper";
import { HyperFormula } from "hyperformula";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-classic.min.css";
import "./spreadsheet.css";
import { sizeToCSS } from "./utils/css";
import { registerAllModules } from "handsontable/registry";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";
import { DocContext } from "../DocViewer";

interface SpreadsheetSVs {
    [key: string]: any;
    hidden: boolean;
    disabled: boolean;
    fixed: boolean;
    cells: any[][];
    columnHeaders: string[] | boolean;
    rowHeaders: string[] | boolean;
    width: { size: string; isAbsolute: boolean };
    height: { size: string; isAbsolute: boolean };
    fixedRowsTop: number;
    fixedColumnsLeft: number;
    hiddenColumns: number[];
    hiddenRows: number[];
    cellsFixed: boolean[][];
    cellsInHeader: boolean[][];
    renderInlineForListItem?: boolean;
}

registerAllModules();

export default React.memo(function SpreadsheetRenderer(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<SpreadsheetSVs>(props);

    const { darkMode } = useContext(DocContext) || {};

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    /**
     * Per-cell settings, which Handsontable asks for one cell at a time and
     * re-asks for whenever the settings change (`cells` being present clears
     * its cell-meta cache). `row` and `col` are physical indices, which is what
     * `cellsFixed` and `cellsInHeader` are indexed by: the hidden-row and
     * hidden-column plugins drop a row or column from the rendered table
     * without renumbering the ones that remain, so a hidden row does not shift
     * the flags of the rows below it. `spreadsheet.cy.js` holds a case with
     * `hiddenRows` and `hiddenColumns` set that fails if that stops being true.
     */
    function cellSettings(row: number, col: number) {
        const cellProperties: { readOnly?: boolean; className?: string } = {};
        if (SVs.cellsFixed?.[row]?.[col]) {
            cellProperties.readOnly = true;
        }
        if (SVs.cellsInHeader?.[row]?.[col]) {
            cellProperties.className = "doenet-spreadsheet-header-cell";
        }
        return cellProperties;
    }

    /**
     * Give a header cell the header role, after Handsontable has drawn it.
     *
     * The class `cellSettings` sets makes a header cell *look* like one, and
     * that is all it does: Handsontable draws every data cell as a `<td>`, so
     * without this a screen reader is told a header row is ordinary data. The
     * `<tabular>` path has it easier — `cell.tsx` renders an `inHeader` cell as
     * a `<th>` and the role comes with the element.
     *
     * `afterRenderer` runs for every cell of every table Handsontable draws,
     * the pinned copies under `.ht_clone_*` included, so the role reaches a
     * header row that `fixedRowsTop` has pinned. It must also *remove* the
     * role: Handsontable reuses its `<td>` elements as the grid scrolls, so a
     * cell that stops being a header would otherwise keep the role of whatever
     * it was drawn as before.
     *
     * `columnheader` rather than a `rowheader`, because a header row labels the
     * columns beneath it. It is valid on a `<td>` inside the `<tr>`'s implicit
     * `row`, and does not disturb the native table semantics that
     * `ariaTags={false}` below preserves.
     */
    function afterRenderer(td: HTMLTableCellElement, row: number, col: number) {
        if (SVs.cellsInHeader?.[row]?.[col]) {
            td.setAttribute("role", "columnheader");
        } else {
            td.removeAttribute("role");
        }
    }

    if (SVs.hidden) {
        return null;
    }

    return (
        <div
            id={id}
            style={{
                margin: getBlockMarginWithOptionalTopSuppression({
                    suppressTopMargin: !!SVs.renderInlineForListItem,
                }),
            }}
            ref={ref}
        >
            <HotTable
                // style={{ borderRadius:"var(--mainBorderRadius)", border:"var(--mainBorder)" }}
                licenseKey="non-commercial-and-evaluation"
                // Handsontable reads the inherited `dir` and flips its column
                // order to match, so an RTL document would renumber the
                // columns from the right. Column A is column A in every
                // language: `fixedColumnsLeft` and the cell references authors
                // write both assume it. Stated rather than inherited because
                // Handsontable owns this decision through its own option, not
                // through CSS.
                layoutDirection="ltr"
                theme={
                    darkMode === "dark"
                        ? "ht-theme-classic-dark"
                        : "ht-theme-classic"
                }
                // Handsontable 18's ARIA treegrid roles currently violate
                // aria-required-children; preserve native table semantics.
                ariaTags={false}
                data={SVs.cells.map((x) => [...x])}
                colHeaders={SVs.columnHeaders as any}
                rowHeaders={SVs.rowHeaders as any}
                width={sizeToCSS(SVs.width)}
                height={sizeToCSS(SVs.height)}
                // beforeChange={this.actions.onChange}
                afterChange={(changes: any, source: any) =>
                    callAction({
                        action: actions.onChange,
                        args: { changes, source },
                    })
                }
                formulas={{
                    engine: HyperFormula,
                }}
                fixedRowsTop={SVs.fixedRowsTop}
                fixedColumnsLeft={SVs.fixedColumnsLeft}
                hiddenColumns={{
                    columns: SVs.hiddenColumns.map((x) => x - 1),
                    indicators: false,
                }}
                hiddenRows={{
                    rows: SVs.hiddenRows.map((x) => x - 1),
                    indicators: false,
                }}
                cells={cellSettings}
                afterRenderer={afterRenderer}
                // A `fixed` spreadsheet rejects every edit in the worker, so
                // the whole grid is read-only — including the positions no
                // `<cell>` backs, which `cellsFixed` cannot speak for.
                readOnly={SVs.disabled || SVs.fixed}
                disableVisualSelection={SVs.disabled}
                // contextMenu={
                //   {
                //     items: {
                //       'row_above': {
                //         // name: 'Insert row above this one'
                //       },
                //       'row_below':{
                //         // name: 'Insert row below this one'
                //       },
                //     }
                //   }
                // }
                stretchH="all"
            />
        </div>
    );
});
