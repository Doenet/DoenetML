import React, { useContext, useEffect, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { DocContext } from "../DocViewer";
import { cesc } from "@doenet/utils";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function ContentBrowser(props) {
    let { name, id, SVs, children, actions, callAction } =
        useDoenetRenderer(props);

    let { location = {} } = useContext(DocContext) || {};

    let search = location.search || "";
    let hash = location.hash || "";

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    let setSelectedItemInd = (ind: unknown) => {
        callAction({
            action: actions.setSelectedItemInd,
            args: { ind },
        });
    };

    useEffect(() => {
        // Check to see if hash contains the component name of one of the items of the browser.
        // If so, select that item
        let hashFirstSlash = hash.indexOf("\\/");
        if (hashFirstSlash !== -1) {
            let hashTarget = hash.substring(hashFirstSlash);
            let indFromHash = SVs.indByEscapedComponentName[hashTarget];

            if (
                indFromHash !== undefined &&
                indFromHash !== SVs.selectedItemInd
            ) {
                // have an item from the browser that isn't hte current selected one
                setSelectedItemInd(indFromHash);
            }
        }
    }, [hash]);

    if (SVs.hidden) {
        return null;
    }

    let firstSlash = id.indexOf("\\/");
    let prefix = id.substring(0, firstSlash);
    let urlStart = search + "#" + prefix;

    let initials = SVs.allInitials.map((initial) => (
        <a
            key={initial}
            style={{
                padding: "0 5px",
                width: "10px",
                cursor: "pointer",
                color: "var(--mainBlue)",
                textDecoration: initial === SVs.initial ? "underline" : "none",
            }}
            href={urlStart + cesc(SVs.firstComponentNameByInitial[initial])}
        >
            {initial}
        </a>
    ));

    let labelRows = [];

    let nLabels = SVs.itemInfoForInitial.length;
    let nRows = Math.ceil(nLabels / 3);

    for (let rowInd = 0; rowInd < nRows; rowInd++) {
        let row = [];
        for (let ind = rowInd * 3; ind < (rowInd + 1) * 3; ind++) {
            let itemInfo = SVs.itemInfoForInitial[ind];
            if (!itemInfo) {
                break;
            }
            row.push(
                <td width="33%">
                    <a
                        key={itemInfo.ind}
                        style={{
                            display: "block",
                            // padding: "4px",
                            // width: "100%",
                            cursor: "pointer",
                            color: "var(--canvasText)",
                            textDecoration: "none",
                            backgroundColor: itemInfo.selected
                                ? "var(--mainGray)"
                                : "var(--canvas)",
                        }}
                        href={urlStart + cesc(itemInfo.componentName)}
                    >
                        {itemInfo.label}
                    </a>
                </td>,
            );
        }
        labelRows.push(<tr key={rowInd}>{row}</tr>);
    }

    let labels = <table>{labelRows}</table>;

    let labelPicker = (
        <div style={{ width: "100%" }} data-test="labelPicker">
            <div
                style={{
                    marginTop: "12px",
                    height: "25px",
                    maxWidth: "220px",
                }}
            >
                Select component
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "solid",
                    maxWidth: "100%",
                    height: "100px",
                    overflowX: "hidden",
                    marginBottom: "12px",
                    boxSizing: "border-box",
                }}
            >
                {labels}
            </div>
        </div>
    );

    if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    return (
        <div id={id} ref={ref}>
            <div style={{ display: "flex" }} data-test="initials">
                Filter by: {initials}
            </div>
            {labelPicker}
            {children}
        </div>
    );
});
