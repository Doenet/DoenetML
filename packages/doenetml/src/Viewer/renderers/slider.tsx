import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import me from "math-expressions";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import { sizeToCSS } from "./utils/css";

let round_to_decimals = (x: number, n: number) => {
    try {
        return me.round_numbers_to_decimals(x, n).tree as number;
    } catch (_e) {
        return NaN;
    }
};

function generateNumericLabels(
    points: number[],
    inputWidth: number,
    SVs: any,
): { value: number; label: string }[] {
    let maxValueWidth;
    let maxAbs = Math.max(Math.abs(SVs.firstItem), Math.abs(SVs.lastItem));
    let magnitudeOfMaxAbs = Math.round(Math.log(maxAbs) / Math.log(10));
    if (maxAbs === 0) {
        magnitudeOfMaxAbs = 1;
    }
    let roundDecimals = 5 - magnitudeOfMaxAbs;

    if (points.length === 0) {
        let pointsToTest = [
            round_to_decimals(SVs.firstItem, roundDecimals),
            round_to_decimals(SVs.lastItem, roundDecimals),
        ];
        let numToTest = Math.min(SVs.numItems, 100);
        let dInd = Math.floor(SVs.numItems / numToTest);
        for (let i = 1; i < numToTest; i++) {
            pointsToTest.push(
                round_to_decimals(
                    SVs.from + SVs.step * i * dInd,
                    roundDecimals,
                ),
            );
        }
        maxValueWidth = findMaxValueWidth(pointsToTest, SVs);
    } else {
        let pointsToTest = points.map((x) =>
            round_to_decimals(x, roundDecimals),
        );
        maxValueWidth = findMaxValueWidth(pointsToTest, SVs);
    }
    const numItems = SVs.numItems;
    if (inputWidth >= maxValueWidth * numItems) {
        if (points.length === 0) {
            let labels: { value: number; label: string }[] = [];
            let maxAbs = Math.max(
                Math.abs(SVs.firstItem),
                Math.abs(SVs.lastItem),
            );
            let magnitudeOfMaxAbs = Math.round(Math.log(maxAbs) / Math.log(10));
            if (maxAbs === 0) {
                magnitudeOfMaxAbs = 1;
            }
            let roundDecimals = 5 - magnitudeOfMaxAbs;
            for (let index = 0; index < SVs.numItems; index++) {
                let point = round_to_decimals(
                    SVs.from + SVs.step * index,
                    roundDecimals,
                );
                labels.push({ value: index, label: point.toString() });
            }
            return labels;
        } else {
            return points.map((point, index) => ({
                value: index,
                label: point.toString(),
            }));
        }
    } else if (inputWidth < maxValueWidth) {
        const leftPoint = points.length === 0 ? SVs.from : points[0];

        return [{ value: 0, label: leftPoint.toString() }];
    } else {
        if (points.length === 0) {
            let desiredNumberOfTicks = Math.floor(inputWidth / maxValueWidth);
            let tickSpan = SVs.lastItem - SVs.firstItem;
            let desiredDTick = tickSpan / (desiredNumberOfTicks + 1);
            let maxAbs = Math.max(
                Math.abs(SVs.firstItem),
                Math.abs(SVs.lastItem),
            );
            let magnitudeOfMaxAbs = Math.round(Math.log(maxAbs) / Math.log(10));
            let roundDecimalsForTickSpacing = 1 - magnitudeOfMaxAbs;
            let dTick = Math.max(
                round_to_decimals(desiredDTick, roundDecimalsForTickSpacing),
                10 ** -roundDecimalsForTickSpacing,
            );
            let numberOfTicks = Math.floor(tickSpan / dTick) + 1;

            let roundDecimals = 5 - magnitudeOfMaxAbs;

            return [...Array(numberOfTicks).keys()]
                .map((i) => SVs.from + dTick * i)
                .map((x) => ({
                    value: Math.round((x - SVs.from) / SVs.step),
                    label: round_to_decimals(x, roundDecimals).toString(),
                }));
        } else {
            let desiredNumberOfTicks = Math.max(
                2,
                Math.floor(inputWidth / maxValueWidth),
            );
            let dIndex = Math.ceil(
                (SVs.numItems - 1) / (desiredNumberOfTicks - 1) - 1e-10,
            );
            let numberOfTicks =
                Math.floor((SVs.numItems - 1) / dIndex + 1e-10) + 1;

            let maxAbs = Math.max(
                Math.abs(SVs.firstItem),
                Math.abs(SVs.lastItem),
            );
            let magnitudeOfMaxAbs = Math.round(Math.log(maxAbs) / Math.log(10));
            let roundDecimals = 2 - magnitudeOfMaxAbs;

            return [...Array(numberOfTicks).keys()]
                .map((i) => Math.round(dIndex * i))
                .map((x) => ({
                    value: x,
                    label: round_to_decimals(
                        points[x],
                        roundDecimals,
                    ).toString(),
                }));
        }
    }
}

function findMaxValueWidth(points: (number | string)[], SVs: any) {
    if (SVs.rotateTickLabels) {
        return 20;
    }
    let currWidth = points.reduce(function (a, b) {
        return +a > b.toString().length ? +a : b.toString().length;
    }, 1);
    return +currWidth * 13;
}

function generateTextLabels(
    points: string[],
    inputWidth: number,
    SVs: Record<string, any>,
): { value: number; label: string }[] {
    let maxValueWidth = findMaxValueWidth(points, SVs);
    const length = Object.keys(points).length;

    if (inputWidth >= maxValueWidth * length) {
        return points.map((point, index) => ({ value: index, label: point }));
    } else if (inputWidth >= 13 * 3 * length) {
        return points.map((point, index) => {
            const label =
                length === index + 1 || point.length < 3
                    ? point
                    : point.substr(0, 3) + "...";
            return { value: index, label };
        });
    } else {
        return [{ value: 0, label: points[0] }];
    }
}

export default React.memo(function Slider(props: UseDoenetRendererProps) {
    let { id, SVs, actions, ignoreUpdate, rendererName, callAction } =
        useDoenetRenderer(props);

    // @ts-ignore
    Slider.baseStateVariable = "index";

    const [index, setIndex] = useState(SVs.index);
    const width = sizeToCSS(SVs.width);

    const [transient, setTransient] = useState(false);

    const [inputWidth, setInputWidth] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            setInputWidth(inputRef.current.offsetWidth);
        }

        const handleResize = () => {
            if (inputRef.current) {
                setInputWidth(inputRef.current.offsetWidth);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setIndex(SVs.index);
    }, [SVs.index]);

    const changeValue = React.useCallback((v: string, isTransient: boolean) => {
        const index = Number(v);
        if (!(SVs.type === "text")) {
            const value =
                SVs.items.length === 0
                    ? SVs.from + SVs.step * index
                    : Number(SVs.items[index]);

            setIndex(index);

            callAction({
                action: actions.changeValue,
                args: {
                    value: value,
                    transient: isTransient,
                    skippable: isTransient,
                },
                baseVariableValue: index,
            });
        } else {
            setIndex(index);

            callAction({
                action: actions.changeValue,
                args: {
                    value: SVs.items[index],
                    transient: isTransient,
                    skippable: isTransient,
                },
                baseVariableValue: index,
            });
        }
    }, []);

    if (SVs.hidden) {
        return null;
    }

    let labels: { value: number; label: string }[];
    if (SVs.type === "text") {
        labels = generateTextLabels(SVs.items, inputWidth, SVs);
    } else {
        labels = generateNumericLabels(SVs.items, inputWidth, SVs);
    }
    let dataList: React.ReactNode;
    if (SVs.showTicks === false) {
        dataList = null;
    } else {
        const lastTickValue = labels[labels.length - 1]?.value ?? 0;
        const dataRatio = lastTickValue / (SVs.numItems - 1);
        const dataWidth = inputWidth * dataRatio;

        const dataListStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: dataWidth,
        };

        const dataOptionStyle: React.CSSProperties = {
            padding: "0",
            width: "20px",
            textAlign: "center",
        };

        if (SVs.rotateTickLabels) {
            dataListStyle.flexDirection = "column";
            dataListStyle.writingMode = "vertical-lr";

            delete dataOptionStyle.textAlign;
            delete dataOptionStyle.width;
        }

        dataList = (
            <datalist id={id + "-datalist"} style={dataListStyle}>
                {labels.map(({ value, label }) => (
                    <option
                        key={value}
                        value={value}
                        label={label}
                        style={dataOptionStyle}
                        onClick={(e) => {
                            changeValue(
                                (e.target as HTMLInputElement).value,
                                false,
                            );
                        }}
                    ></option>
                ))}
            </datalist>
        );
    }

    // Conditional label and showValue attributes
    let myLabel = null;
    if (SVs.label) {
        let label = SVs.label;
        if (SVs.labelHasLatex) {
            label = (
                <MathJax hideUntilTypeset={"first"} inline dynamic>
                    {label}
                </MathJax>
            );
        }
        if (SVs.showValue) {
            myLabel = (
                <>
                    {label}
                    {" = " + SVs.valueForDisplay}
                </>
            );
        } else {
            myLabel = label;
        }
    } else if (!SVs.label && SVs.showValue) {
        myLabel = SVs.valueForDisplay;
    } else {
        myLabel = null;
    }
    if (myLabel != null) {
        myLabel = (
            <div id={`${id}-label`}>
                <label htmlFor={id}>{myLabel}</label>
            </div>
        );
    }

    return (
        <div>
            {myLabel}
            <input
                ref={inputRef}
                id={id}
                type="range"
                style={{ width, margin: 0, maxWidth: "100%" }}
                value={index}
                list={id + "-datalist"}
                min={0}
                max={SVs.numItems - 1}
                onInput={(e) =>
                    changeValue((e.target as HTMLInputElement).value, transient)
                }
                onMouseDown={() => setTransient(true)}
                onMouseUp={(e) => {
                    setTransient(false);
                    changeValue((e.target as HTMLInputElement).value, false);
                }}
                disabled={SVs.disabled}
            />
            {dataList}
        </div>
    );
});
