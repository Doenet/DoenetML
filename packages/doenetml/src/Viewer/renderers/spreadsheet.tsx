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
     * `cellsFixed` and `cellsInHeader` are indexed by: the spreadsheet never
     * reorders its data, and the hidden-row and hidden-column plugins hide
     * without trimming, so physical and visual indices stay aligned.
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
