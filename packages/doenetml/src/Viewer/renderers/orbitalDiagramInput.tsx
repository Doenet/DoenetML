import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { Button } from "@doenet/ui-components";
import { useRecordVisibilityChanges } from "../../utils/visibility";

const ORBITAL_ARROW_STYLE: React.CSSProperties = {
    fill: "none",
    stroke: "var(--canvasText)",
    strokeWidth: "2",
};

interface OrbitalRowData {
    orbitalText: string;
    boxes: string[];
}

interface OrbitalDiagramInputSVs {
    [key: string]: any;
    hidden: boolean;
    fixed: boolean;
    rows: OrbitalRowData[];
    selectedRowIndex: number;
    selectedBoxIndex: number;
}

// border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};

export default React.memo(function orbitalDiagramInput(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<OrbitalDiagramInputSVs>(props);

    let selectedRowIndex0 = SVs.selectedRowIndex - 1;
    let selectedBoxIndex0 = SVs.selectedBoxIndex - 1;

    // @ts-ignore
    orbitalDiagramInput.ignoreActionsWithoutCore = () => true;

    // use ref for fixed so changed value appears in callbacks
    let fixed = useRef<boolean>(SVs.fixed);
    fixed.current = SVs.fixed;

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    function setSelectedRow(index: number | string) {
        if (!fixed.current) {
            callAction({
                action: actions.selectRow,
                args: { index: Number(index) + 1 },
            });
        }
    }

    function setSelectedBox(index: number | string, rowNum?: number | string) {
        if (!fixed.current) {
            if (rowNum !== undefined) {
                callAction({
                    action: actions.selectRow,
                    args: { index: Number(rowNum) + 1 },
                });
            }
            callAction({
                action: actions.selectBox,
                args: { index: Number(index) + 1 },
            });
        }
    }

    function updateRowText(newValue: string) {
        if (!fixed.current) {
            callAction({
                action: actions.updateRowText,
                args: { newValue },
            });
        }
    }

    function deselect(e: React.FocusEvent) {
        const relatedId = (e.relatedTarget as HTMLElement | null)?.id;
        if (
            relatedId !== `orbitaladdrow${id}` &&
            relatedId !== `orbitalremoverow${id}` &&
            relatedId !== `orbitaladdbox${id}` &&
            relatedId !== `orbitaladduparrow${id}` &&
            relatedId !== `orbitaladddownarrow${id}` &&
            relatedId !== `orbitalremovearrow${id}` &&
            relatedId !== `orbitalremovebox${id}`
        ) {
            if (
                relatedId !== `OrbitalText${selectedRowIndex0}${id}` &&
                relatedId !== `OrbitalRow${selectedRowIndex0}${id}` &&
                relatedId?.substring(0, 10 + id.length) !== `orbitalbox${id}`
            ) {
                setSelectedRow(-1);
            }
            setSelectedBox(-1);
        }
    }

    let rowsJSX = [];
    for (let [index, row] of Object.entries(SVs.rows)) {
        let rowNumber = SVs.rows.length - Number(index) - 1;
        rowsJSX.push(
            <OrbitalRow
                key={`OrbitalRow${rowNumber}`}
                updateRowText={updateRowText}
                rowNumber={rowNumber}
                selectedRow={selectedRowIndex0}
                setSelectedRow={setSelectedRow}
                orbitalText={row.orbitalText}
                boxes={row.boxes}
                selectedBox={selectedBoxIndex0}
                setSelectedBox={setSelectedBox}
                deselect={deselect}
                name={id}
            />,
        );
    }

    let controls = null;

    if (!SVs.fixed) {
        controls = (
            <div>
                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitaladdrow${id}`}
                        onBlur={(e: React.FocusEvent) => {
                            deselect(e);
                        }}
                        onClick={() => {
                            callAction({
                                action: actions.addRow,
                            });
                        }}
                        value="Add Row"
                    />
                </div>
                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitalremoverow${id}`}
                        onClick={() => {
                            callAction({
                                action: actions.removeRow,
                            });
                        }}
                        value="Remove Row"
                    />
                </div>

                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitaladdbox${id}`}
                        onBlur={(e: React.FocusEvent) => {
                            deselect(e);
                        }}
                        onClick={() => {
                            callAction({
                                action: actions.addBox,
                            });
                        }}
                        value="Add Box"
                    />
                </div>

                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitalremovebox${id}`}
                        onBlur={(e: React.FocusEvent) => {
                            deselect(e);
                        }}
                        onClick={() => {
                            callAction({
                                action: actions.removeBox,
                            });
                        }}
                        value="Remove Box"
                    />
                </div>

                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitaladduparrow${id}`}
                        onBlur={(e: React.FocusEvent) => {
                            deselect(e);
                        }}
                        onClick={() => {
                            callAction({
                                action: actions.addUpArrow,
                            });
                        }}
                        value="Add Up Arrow"
                    />
                </div>

                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitaladddownarrow${id}`}
                        onBlur={(e: React.FocusEvent) => {
                            deselect(e);
                        }}
                        onClick={() => {
                            callAction({
                                action: actions.addDownArrow,
                            });
                        }}
                        value="Add Down Arrow"
                    />
                </div>

                <div style={{ display: "inline-block", marginRight: "4px" }}>
                    <Button
                        id={`orbitalremovearrow${id}`}
                        onBlur={(e: React.FocusEvent) => {
                            deselect(e);
                        }}
                        onClick={() => {
                            callAction({
                                action: actions.removeArrow,
                            });
                        }}
                        value="Remove Arrow"
                    />
                </div>
            </div>
        );
    }
    return (
        <div ref={ref} id={id}>
            {controls}
            {rowsJSX}
        </div>
    );
});

const OrbitalRow = React.memo(function OrbitalRow({
    rowNumber,
    updateRowText,
    selectedRow,
    setSelectedRow,
    orbitalText,
    boxes,
    selectedBox,
    setSelectedBox,
    deselect,
    name,
}: {
    rowNumber: number;
    updateRowText: (newValue: string) => void;
    selectedRow: number;
    setSelectedRow: (index: number | string) => void;
    orbitalText: string;
    boxes: string[];
    selectedBox: number;
    setSelectedBox: (index: number | string, rowNum?: number | string) => void;
    deselect: (e: React.FocusEvent) => void;
    name: string;
}) {
    let rowStyle: React.CSSProperties = {
        width: "800px",
        height: "44px",
        display: "flex",
        backgroundColor: "var(--revealButtonSurface)",
        marginTop: "2px",
        marginBottom: "2px",
        padding: "2px",
        border: "var(--canvas) solid 2px",
    };
    if (selectedRow === rowNumber) {
        rowStyle["border"] = "var(--mainBlue) solid 2px";
        // rowStyle['backgroundColor'] = '#1A5A99';
    }

    //Make boxes
    let boxesJSX = [];
    for (let [index, code] of Object.entries(boxes)) {
        let isSelected = false;
        // console.log("selectedBox === index",selectedBox,index,selectedBox === index,selectedBox == index)
        if (selectedRow == rowNumber && String(selectedBox) === index) {
            isSelected = true;
        }
        boxesJSX.push(
            <OrbitalBox
                key={`OrbitalBox${rowNumber}-${index}`}
                boxNum={index}
                rowNumber={rowNumber}
                arrows={code}
                isSelected={isSelected}
                setSelectedBox={setSelectedBox}
                name={name}
            />,
        );
    }

    return (
        <div
            key={`OrbitalRow${rowNumber}`}
            id={`OrbitalRow${rowNumber}${name}`}
            tabIndex={-1}
            onClick={() => {
                if (selectedRow !== rowNumber) {
                    setSelectedRow(rowNumber);
                }
            }}
            onBlur={(e: React.FocusEvent) => {
                deselect(e);
            }}
            style={rowStyle}
        >
            {/* <span style={{marginRight:"2px"}}>row {rowNumber + 1}</span> */}
            <OrbitalText
                orbitalText={orbitalText}
                rowNumber={rowNumber}
                updateRowText={updateRowText}
                name={name}
            />
            {boxesJSX}
        </div>
    );
});

const OrbitalText = React.memo(function OrbitalText({
    rowNumber,
    updateRowText,
    orbitalText,
    name,
}: {
    rowNumber: number;
    updateRowText: (newValue: string) => void;
    orbitalText: string;
    name: string;
}) {
    return (
        <input
            id={`OrbitalText${rowNumber}${name}`}
            style={{ marginRight: "4px", height: "14px" }}
            type="text"
            size={4}
            value={orbitalText}
            onChange={(e) => {
                let newValue = e.target.value;
                updateRowText(newValue);
            }}
            aria-label={`Label for row ${rowNumber + 1}`}
        />
    );
});

const OrbitalBox = React.memo(function OrbitalBox({
    boxNum,
    arrows = "",
    setSelectedBox,
    isSelected,
    rowNumber,
    name,
}: {
    boxNum: string | number;
    arrows?: string;
    setSelectedBox: (index: number | string, rowNum?: number | string) => void;
    isSelected: boolean;
    rowNumber: number;
    name: string;
}) {
    const firstUp = (
        <polyline
            key={`orbitalboxfirstUp${boxNum}`}
            id={`firstUp${boxNum}`}
            points="6,14 12,6 18,14 12,6 12,35"
            style={ORBITAL_ARROW_STYLE}
        />
    );
    const firstDown = (
        <polyline
            key={`orbitalboxfirstDown${boxNum}`}
            id={`firstDown${boxNum}`}
            points="6,26 12,34 18,26 12,34 12,5"
            style={ORBITAL_ARROW_STYLE}
        />
    );
    const secondUp = (
        <polyline
            key={`orbitalboxsecondUp${boxNum}`}
            id={`secondUp${boxNum}`}
            points="22,14 28,6 34,14 28,6 28,35"
            style={ORBITAL_ARROW_STYLE}
        />
    );
    const secondDown = (
        <polyline
            key={`orbitalboxsecondDown${boxNum}`}
            id={`secondDown${boxNum}`}
            points="22,26 28,34 34,26 28,34 28,5"
            style={ORBITAL_ARROW_STYLE}
        />
    );
    const thirdUp = (
        <polyline
            key={`orbitalboxthirdUp${boxNum}`}
            id={`thirdUp${boxNum}`}
            points="38,14 44,6 50,14 44,6 44,35"
            style={ORBITAL_ARROW_STYLE}
        />
    );
    const thirdDown = (
        <polyline
            key={`orbitalboxthirdDown${boxNum}`}
            id={`thirdDown${boxNum}`}
            points="38,26 44,34 50,26 44,34 44,5"
            style={ORBITAL_ARROW_STYLE}
        />
    );

    let arrowsJSX = [];
    let [first, second, third] = arrows.split("");

    if (first == "U") {
        arrowsJSX.push(firstUp);
    }
    if (first == "D") {
        arrowsJSX.push(firstDown);
    }
    if (second == "U") {
        arrowsJSX.push(secondUp);
    }
    if (second == "D") {
        arrowsJSX.push(secondDown);
    }
    if (third == "U") {
        arrowsJSX.push(thirdUp);
    }
    if (third == "D") {
        arrowsJSX.push(thirdDown);
    }

    let boxWidth = 40;
    if (third) {
        boxWidth = 56;
    }

    let boxColor = "var(--canvasText)";
    let strokeWidth = "2px";
    if (isSelected) {
        boxColor = "var(--mainBlue)";
        strokeWidth = "6px";
    }

    return (
        <svg
            key={`orbitalbox${boxNum}`}
            id={`orbitalbox${name}${rowNumber}-${boxNum}`}
            tabIndex={-1}
            onClick={(e) => {
                setSelectedBox(boxNum, rowNumber);
                e.stopPropagation();
            }}
            width={boxWidth}
            height="40"
            style={{ margin: "2px" }}
        >
            <rect
                x="0"
                y="0"
                rx="4"
                ry="4"
                width={boxWidth}
                height="40"
                style={{
                    fill: "var(--canvas)",
                    stroke: boxColor,
                    strokeWidth: strokeWidth,
                    fillOpacity: "1",
                    strokeOpacity: "1",
                }}
            />
            {arrowsJSX}
        </svg>
    );
});
