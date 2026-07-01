import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
// @ts-ignore
import { HotTable } from "@handsontable/react-wrapper";
import { HyperFormula } from "hyperformula";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-classic.min.css";
import { sizeToCSS } from "./utils/css";
// @ts-ignore
import { registerAllModules } from "handsontable/registry";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";

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
    renderInlineForListItem?: boolean;
}

registerAllModules();

export default React.memo(function SpreadsheetRenderer(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<SpreadsheetSVs>(props);

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

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
                theme="ht-theme-classic"
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
                readOnly={SVs.disabled}
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
