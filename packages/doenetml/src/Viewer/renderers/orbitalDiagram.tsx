import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
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

interface OrbitalDiagramSVs {
    [key: string]: any;
    hidden: boolean;
    fixed: boolean;
    value: OrbitalRowData[];
}

export default React.memo(function orbitalDiagram(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<OrbitalDiagramSVs>(props);

    // use ref for fixed so changed value appears in callbacks
    let fixed = useRef<boolean>(SVs.fixed);
    fixed.current = SVs.fixed;

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden || !SVs.value) {
        return null;
    }

    let rows = [...SVs.value].reverse();

    let rowsJSX = [];
    for (let [index, row] of Object.entries(rows)) {
        let rowNumber = rows.length - Number(index) - 1;
        rowsJSX.push(
            <OrbitalRow
                key={`OrbitalRow${rowNumber}`}
                rowNumber={rowNumber}
                orbitalText={row.orbitalText}
                boxes={row.boxes}
                name={id}
            />,
        );
    }

    return (
        <div ref={ref} id={id}>
            {rowsJSX}
        </div>
    );
});

const OrbitalRow = React.memo(function OrbitalRow({
    rowNumber,
    orbitalText,
    boxes,
    name,
}: {
    rowNumber: number;
    orbitalText: string;
    boxes: string[];
    name: string;
}) {
    let rowStyle = {
        width: "800px",
        height: "44px",
        display: "flex",
        backgroundColor: "var(--revealButtonSurface)",
        marginTop: "2px",
        marginBottom: "2px",
        padding: "2px",
        border: "var(--canvas) solid 2px",
    };

    //Make boxes
    let boxesJSX = [];
    for (let [index, code] of Object.entries(boxes)) {
        boxesJSX.push(
            <OrbitalBox
                key={`OrbitalBox${rowNumber}-${index}`}
                boxNum={index}
                rowNumber={rowNumber}
                arrows={code}
                name={name}
            />,
        );
    }

    return (
        <div
            key={`OrbitalRow${rowNumber}`}
            id={`OrbitalRow${rowNumber}${name}`}
            tabIndex={-1}
            style={rowStyle}
        >
            {/* <span style={{marginRight:"2px"}}>row {rowNumber + 1}</span> */}
            <OrbitalText
                orbitalText={orbitalText}
                rowNumber={rowNumber}
                name={name}
            />
            {boxesJSX}
        </div>
    );
});

const OrbitalText = React.memo(function OrbitalText({
    rowNumber,
    orbitalText,
    name,
}: {
    rowNumber: number;
    orbitalText: string;
    name: string;
}) {
    return (
        <div
            id={`OrbitalText${rowNumber}${name}`}
            style={{
                marginRight: "4px",
                height: "14px",
                width: "40px",
                backgroundColor: "var(--canvas)",
            }}
        >
            {orbitalText}
        </div>
    );
});

const OrbitalBox = React.memo(function OrbitalBox({
    boxNum,
    arrows = "",
    rowNumber,
    name,
}: {
    boxNum: string | number;
    arrows?: string;
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

    return (
        <svg
            key={`orbitalbox${boxNum}`}
            id={`orbitalbox${name}${rowNumber}-${boxNum}`}
            tabIndex={-1}
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
