import React, { useContext, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { HotTable } from "@handsontable/react-wrapper";
import type Handsontable from "handsontable/base";
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
    columnWidths: ({ size: number; isAbsolute: boolean } | null)[];
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
    // The width of the vertical scrollbar as of the last render, which the
    // percentage column widths are computed beside (see `afterRender`).
    const scrollbarWidth = useRef(0);

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

    /**
     * The width in pixels an author gave physical column `col`, or `undefined`
     * if they gave none. A percentage is of the width Handsontable has for
     * the data columns, which excludes the row headers — the counterpart of a
     * `<col width="…%">` being a percentage of its `<tabular>`.
     *
     * It also excludes a vertical scrollbar, which `getViewportWidth` counts.
     * A narrow column wraps its text, the taller rows can outgrow the
     * spreadsheet's height, and percentages summing to 100% of a width that
     * includes the scrollbar would then add a horizontal scrollbar too. The
     * stretch plugin makes the same deduction, with a helper Handsontable
     * does not export, so the scrollbar is measured off the master holder.
     */
    function authoredColumnWidth(
        hot: Handsontable,
        col: number,
    ): number | undefined {
        const width = SVs.columnWidths?.[col];
        if (!width) {
            return undefined;
        }
        if (width.isAbsolute) {
            return width.size;
        }
        const viewportWidth = hot.view?.getViewportWidth();
        if (!viewportWidth) {
            return undefined;
        }
        // Rounded down, so that percentages summing to 100% never total more
        // than the viewport: a pixel over and the stretch plugin gives up,
        // leaving a horizontal scrollbar. It hands the spare pixels to the
        // last column.
        return Math.floor(
            (width.size / 100) * (viewportWidth - scrollbarWidth.current),
        );
    }

    /** The width of the master table's vertical scrollbar, 0 if it has none. */
    function verticalScrollbarWidth(hot: Handsontable) {
        const holder = hot.rootElement?.querySelector<HTMLElement>(
            ".ht_master .wtHolder",
        );
        return holder
            ? Math.max(0, holder.offsetWidth - holder.clientWidth)
            : 0;
    }

    /**
     * Keep `scrollbarWidth` in step with the table, rendering once more when
     * it changes. The percentage widths are what wrap the text that makes the
     * rows tall enough to need a scrollbar, so the scrollbar can only appear
     * after the render that used them. The follow-up render uses the new
     * width and settles: narrower columns wrap at least as much, so the
     * scrollbar stays.
     */
    function afterRender(this: Handsontable) {
        if (!SVs.columnWidths?.some((width) => width && !width.isAbsolute)) {
            return;
        }
        const measured = verticalScrollbarWidth(this);
        if (measured !== scrollbarWidth.current) {
            scrollbarWidth.current = measured;
            requestAnimationFrame(() => {
                if (!this.isDestroyed) {
                    // The render resizes the columns but not the scroll area
                    // around them: Handsontable postpones that to the render
                    // after, so it would keep the old total, and scroll
                    // sideways, until something else rendered. Flushing it
                    // is `adjustElementsSize`'s documented escape hatch.
                    this.render();
                    this.view.adjustElementsSize(true);
                }
            });
        }
    }

    /**
     * Apply the authored widths through two hooks rather than `colWidths`,
     * because setting `colWidths` at all switches off Handsontable's
     * automatic sizing for every column, including the ones left alone.
     *
     * - `modifyColWidth` replaces the automatic width of an authored column.
     *   It runs after the auto-size plugin's hook (priority -10) and before
     *   the stretch plugin's (10), so it sets the width stretching starts
     *   from.
     * - `beforeStretchingColumnWidth` then pins that column, so
     *   `stretchH="all"` hands the remaining width to the other columns
     *   instead of scaling the authored one along with them.
     *
     * Both hooks receive a visual column index; `columnWidths` is physical.
     */
    function applyAuthoredColumnWidth(
        this: Handsontable,
        width: number,
        visualCol: number,
    ) {
        return (
            authoredColumnWidth(this, this.toPhysicalColumn(visualCol)) ?? width
        );
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
                modifyColWidth={applyAuthoredColumnWidth}
                beforeStretchingColumnWidth={applyAuthoredColumnWidth}
                afterRender={afterRender}
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
