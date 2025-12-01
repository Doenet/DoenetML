// @ts-nocheck
import React, { useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { HotTable } from "@handsontable/react";
import { HyperFormula } from "hyperformula";
import "handsontable/dist/handsontable.full.css";
import { sizeToCSS } from "./utils/css";
import { registerAllModules } from "handsontable/registry";
import { useRecordVisibilityChanges } from "../../utils/visibility";

registerAllModules();

export default React.memo(function SpreadsheetRenderer(props) {
    let { id, SVs, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    return (
        <div id={id} style={{ margin: "12px 0" }} ref={ref}>
            <HotTable
                // style={{ borderRadius:"var(--mainBorderRadius)", border:"var(--mainBorder)" }}
                licenseKey="non-commercial-and-evaluation"
                data={SVs.cells.map((x) => [...x])}
                colHeaders={SVs.columnHeaders}
                rowHeaders={SVs.rowHeaders}
                width={sizeToCSS(SVs.width)}
                height={sizeToCSS(SVs.height)}
                // beforeChange={this.actions.onChange}
                afterChange={(changes, source) =>
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
