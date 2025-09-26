import React, { useRef, useState, useEffect } from "react";
// @ts-ignore
import me from "math-expressions";
import styled from "styled-components";
// import { Spring } from '@react-spring/web';
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { ActionButton } from "@doenet/ui-components";
import { ActionButtonGroup } from "@doenet/ui-components";
import { MathJax } from "better-react-mathjax";

let round_to_decimals = (x: number, n: number) => {
    try {
        return me.round_numbers_to_decimals(x, n).tree as number;
    } catch (_e) {
        return NaN;
    }
};

const SliderContainer = styled.div<{ labeled: boolean; noTicked: boolean }>`
    width: fit-content;
    height: ${(props) =>
        props.labeled && props.noTicked
            ? "60px"
            : props.labeled
              ? "80px"
              : props.noTicked
                ? "40px"
                : "60px"};
    margin-bottom: 12px;
    &:focus {
        outline: 0;
    }
`;

const SubContainer2 = styled.div`
    padding-top: 10px;
    height: 50px;
`;

const StyledSlider = styled.div<{ width: string }>`
    position: relative;
    border-radius: 3px;
    background-color: var(--canvasText);
    height: 2px;
    width: ${(props) => props.width};
    user-select: none;
`;

const StyledValueLabel = styled.p`
    display: inline;
    user-select: none;
`;

const StyledThumb = styled.div<{ disabled?: boolean }>`
    width: 10px;
    height: 10px;
    border-radius: 5px;
    position: relative;
    top: -4px;
    opacity: 1;
    background: ${(props) =>
        props.disabled
            ? "var(--mainGray)"
            : "var(--mainBlue)"}; // var(--mainBlue)?
    cursor: pointer;
`;

const Tick = styled.div<{ x: string }>`
    position: absolute;
    border-left: 2px solid var(--mainGray);
    height: 10px;
    top: 1px;
    z-index: -2;
    left: ${(props) => props.x};
    user-select: none;
`;

const Label = styled.p<{ x: string }>`
    position: absolute;
    left: ${(props) => props.x};
    color: var(--canvasText);
    font-size: 12px;
    top: 1px;
    user-select: none;
`;

function generateNumericLabels(
    points: number[],
    div_width: number,
    point_start_val: number,
    SVs: any,
) {
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
        maxValueWidth = findMaxValueWidth(pointsToTest);
    } else {
        let pointsToTest = points.map((x) =>
            round_to_decimals(x, roundDecimals),
        );
        maxValueWidth = findMaxValueWidth(pointsToTest);
    }
    const numItems = SVs.numItems;
    if (SVs.width.size > maxValueWidth * numItems) {
        if (points.length === 0) {
            let ticks = [];
            let labels = [];
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
                ticks.push(<Tick key={point} x={`${index * div_width}px`} />);
                labels.push(
                    <Label key={point} x={`${index * div_width - 3}px`}>
                        {point}
                    </Label>,
                );
            }
            return [ticks, labels];
        } else {
            return [
                points.map((point, index) => (
                    <Tick key={point} x={`${index * div_width}px`} />
                )),
                points.map((point, index) => (
                    <Label key={point} x={`${index * div_width - 3}px`}>
                        {point}
                    </Label>
                )),
            ];
        }
    } else if (SVs.width.size < maxValueWidth) {
        let pointsCopy = [...points];
        if (points.length === 0) {
            for (let index = 0; index < Math.min(3, SVs.numItems); index++) {
                pointsCopy.push(SVs.from + SVs.step * index);
            }
        }
        return [
            pointsCopy.map((point, index) => {
                if (index == 0) {
                    return <Tick key={point} x={`${index * div_width}px`} />;
                } else {
                    return "";
                }
            }),
            pointsCopy.map((point, index) => {
                if (index == 0) {
                    return (
                        <Label key={point} x={`${index * div_width - 3}px`}>
                            {point}
                        </Label>
                    );
                } else if (index == 2) {
                    return (
                        <Label key={point} x={`${index * div_width - 3}px`}>
                            {"..."}
                        </Label>
                    );
                }
            }),
        ];
    } else if (SVs.width.size < maxValueWidth * numItems) {
        let tickIndices: number[], tickValues: number[];
        if (points.length === 0) {
            let desiredNumberOfTicks = Math.floor(
                SVs.width.size / maxValueWidth,
            );
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

            tickValues = [...Array(numberOfTicks).keys()].map(
                (i) => SVs.from + dTick * i,
            );

            tickIndices = tickValues.map((x) =>
                Math.round((x - SVs.from) / SVs.step),
            );
            tickValues = tickValues.map((x) =>
                round_to_decimals(x, roundDecimals),
            );
        } else {
            let desiredNumberOfTicks = Math.max(
                2,
                Math.floor(SVs.width.size / maxValueWidth),
            );
            let dIndex = Math.ceil(
                (SVs.numItems - 1) / (desiredNumberOfTicks - 1) - 1e-10,
            );
            let numberOfTicks =
                Math.floor((SVs.numItems - 1) / dIndex + 1e-10) + 1;

            tickIndices = [...Array(numberOfTicks).keys()].map((i) =>
                Math.round(dIndex * i),
            );

            let maxAbs = Math.max(
                Math.abs(SVs.firstItem),
                Math.abs(SVs.lastItem),
            );
            let magnitudeOfMaxAbs = Math.round(Math.log(maxAbs) / Math.log(10));
            let roundDecimals = 2 - magnitudeOfMaxAbs;
            tickValues = tickIndices.map((x) =>
                round_to_decimals(points[x], roundDecimals),
            );
        }

        return [
            tickIndices.map((x, i) => (
                <Tick key={tickValues[i]} x={`${x * div_width}px`} />
            )),
            tickIndices.map((x, i) => (
                <Label key={tickValues[i]} x={`${x * div_width}px`}>
                    {tickValues[i]}
                </Label>
            )),
        ];
    } else {
        return [
            points.map((point) => (
                <Tick
                    key={point}
                    x={`${(point - point_start_val) * div_width}px`}
                />
            )),
            points.map((point) => (
                <Label
                    key={point}
                    x={`${(point - point_start_val) * div_width - 3}px`}
                >
                    {point}
                </Label>
            )),
        ];
    }
}

function findMaxValueWidth(points: number[]) {
    let currWidth = points.reduce(function (a, b) {
        return +a > b.toString().length ? +a : b.toString().length;
    });
    return +currWidth * 12;
}

function generateTextLabels(points: number[], div_width: number, SVs) {
    let maxValueWidth = findMaxValueWidth(points);
    const length = Object.keys(points).length;

    let showAllItems = false;
    if (SVs.width.size > maxValueWidth * length) {
        showAllItems = true;
        return [
            points.map((point, index) => (
                <Tick key={point} x={`${index * div_width}px`} />
            )),
            points.map((point, index) => {
                return (
                    <Label key={point} x={`${index * div_width - 3}px`}>
                        {point}
                    </Label>
                );
            }),
        ];
    } else if (SVs.width.size < maxValueWidth) {
        showAllItems = false;
        return [
            points.map((point, index) => {
                if (index == 0) {
                    return <Tick key={point} x={`${index * div_width}px`} />;
                } else {
                    return "";
                }
            }),
            points.map((point, index) => {
                if (index == 0) {
                    return (
                        <Label key={point} x={`${index * div_width - 3}px`}>
                            {point}
                        </Label>
                    );
                } else if (index == 2) {
                    return (
                        <Label key={point} x={`${index * div_width - 3}px`}>
                            {"..."}
                        </Label>
                    );
                }
            }),
        ];
    } else if (SVs.width.size < maxValueWidth * length) {
        showAllItems = false;
        return [
            points.map((point, index) => (
                <Tick key={point} x={`${index * div_width}px`} />
            )),
            points.map((point, index) => {
                if (index == 0 || length === index + 1) {
                    return (
                        <Label key={point} x={`${index * div_width - 3}px`}>
                            {point}
                        </Label>
                    );
                } else {
                    return (
                        <Label key={point} x={`${index * div_width - 3}px`}>
                            {point.length < 3
                                ? point
                                : point.substr(0, 3) + "..."}
                        </Label>
                    );
                }
            }),
        ];
    }
}

function xPositionToValue(ref: number, div_width: number, start_val: number) {
    return start_val + ref / div_width;
}

function nearestValue(refval: number, points: number[], SVs) {
    let index = Math.max(
        0,
        Math.min(SVs.numItems - 1, Math.round(refval - SVs.firstItem)),
    );

    let val;

    if (points.length === 0) {
        // values specified by from, to, step
        val = SVs.from + SVs.step * index;
    } else {
        val = points[index];
    }

    return [val, index];
}

export default React.memo(function Slider(props: UseDoenetRendererProps) {
    let { id, SVs, actions, ignoreUpdate, rendererName, callAction } =
        useDoenetRenderer(props);

    // @ts-ignore
    Slider.baseStateVariable = "index";

    const containerRef = useRef<HTMLDivElement>(null);
    // console.log("SVs",SVs);
    // let sorted_points = [...SVs.items].sort((p1, p2) => p1 - p2);

    const [thumbXPos, setThumbXPos] = useState(0);
    // const [thumbValue, setThumbValue] = useState(SVs.firstItem);
    const isMouseDown = useRef(false);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const startValue = SVs.type === "text" ? 0 : SVs.firstItem;
    // const endValue = (SVs.type === "text") ? 0 : SVs.lastItem;
    let divisionWidth = SVs.width.size / (SVs.numItems - 1);

    const [index, setIndex] = useState(0);
    // const width = (SVs.width.size);
    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setOffsetLeft(rect.left);
        }
    }, []);

    useEffect(() => {
        //console.log("ran");
        if (!isMouseDown.current && !ignoreUpdate) {
            // setThumbValue(SVs.value);
            setIndex(SVs.index);
            if (!(SVs.type === "text")) {
                setThumbXPos((SVs.index / (SVs.numItems - 1)) * SVs.width.size);
                // setThumbXPos((SVs.value - startValue)*divisionWidth);
            } else {
                setThumbXPos(SVs.index * divisionWidth);
            }
        }
    }, [SVs.index]);

    if (SVs.hidden) {
        return null;
    }

    if (SVs.disabled) {
        let controls: React.ReactNode = "";

        if (SVs.showControls) {
            controls = (
                <ActionButtonGroup style={{ marginBottom: "12px" }}>
                    <ActionButton
                        value="Prev"
                        onClick={(e: KeyboardEvent) => handlePrevious(e)}
                        disabled
                    />
                    <ActionButton
                        value="Next"
                        onClick={(e: KeyboardEvent) => handleNext(e)}
                        disabled
                    />
                </ActionButtonGroup>
            );
        } else {
            controls = null;
        }
        let labels: React.ReactNode = "";
        if (SVs.type === "text") {
            labels = generateTextLabels(SVs.items, divisionWidth, SVs);
        } else {
            labels = generateNumericLabels(
                SVs.items,
                divisionWidth,
                startValue,
                SVs,
            );
        }
        let ticksAndLabels: React.ReactNode = "";
        if (SVs.showTicks === false) {
            ticksAndLabels = null;
        } else {
            ticksAndLabels = labels;
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
                    <StyledValueLabel>
                        {label}
                        {" = " + SVs.valueForDisplay}
                    </StyledValueLabel>
                );
            } else {
                myLabel = <StyledValueLabel>{label}</StyledValueLabel>;
            }
        } else if (!SVs.label && SVs.showValue) {
            myLabel = (
                <StyledValueLabel>{SVs.valueForDisplay}</StyledValueLabel>
            );
        } else {
            myLabel = null;
        }

        return (
            <SliderContainer
                labeled={SVs.showControls || SVs.label}
                noTicked={SVs.showTicks === false}
                ref={containerRef}
            >
                <div
                    id={`${id}-label`}
                    style={{
                        height: SVs.label || SVs.showValue ? "20px" : "0px",
                    }}
                >
                    {myLabel}
                </div>
                <SubContainer2>
                    <StyledSlider width={`${SVs.width.size}px`} id={id}>
                        <StyledThumb
                            disabled
                            style={{ left: `${thumbXPos - 4}px` }}
                            id={`${id}-handle`}
                        />
                        {ticksAndLabels}
                    </StyledSlider>
                </SubContainer2>
                <div style={{ height: SVs.showControls ? "20px" : "0px" }}>
                    {controls}
                </div>
            </SliderContainer>
        );
    }

    function handleDragEnter(e: React.MouseEvent) {
        isMouseDown.current = true;

        document.addEventListener("mousemove", handleDragThrough);
        document.addEventListener("mouseup", handleDragExit);

        setThumbXPos(e.nativeEvent.clientX - offsetLeft);

        if (!(SVs.type === "text")) {
            let refval = xPositionToValue(
                e.nativeEvent.clientX - offsetLeft,
                divisionWidth,
                startValue,
            );

            let valindexpair = nearestValue(refval, SVs.items, SVs);

            // setThumbValue(valindexpair[0]);
            setIndex(valindexpair[1]);

            callAction({
                action: actions.changeValue,
                args: { value: valindexpair[0], transient: true },
                baseVariableValue: valindexpair[1],
            });
        } else {
            let i = Math.round(
                (e.nativeEvent.clientX - offsetLeft) / divisionWidth,
            );
            setIndex(i);
            // setThumbValue(SVs.items[i]);

            callAction({
                action: actions.changeValue,
                args: { value: SVs.items[i], transient: true },
                baseVariableValue: i,
            });
        }
    }

    function handleDragExit(e: MouseEvent) {
        document.removeEventListener("mousemove", handleDragThrough);
        document.removeEventListener("mouseup", handleDragExit);

        if (!isMouseDown.current) {
            return;
        }

        isMouseDown.current = false;

        if (!(SVs.type === "text")) {
            //Find the new index based on clientX and total width
            // const ratio = (e.clientX - offsetLeft) / SVs.width.size;
            // const selectedIndex = Math.min(Math.max(Math.round(ratio * SVs.numItems), 0), SVs.numItems - 1)

            let refval = xPositionToValue(
                e.clientX - offsetLeft,
                divisionWidth,
                startValue,
            );

            function xPositionToValue(
                ref: number,
                div_width: number,
                start_val: number,
            ) {
                return start_val + ref / div_width;
            }

            let valindexpair = nearestValue(refval, SVs.items, SVs);

            // setThumbValue(valindexpair[0]);
            setIndex(valindexpair[1]);

            setThumbXPos(valindexpair[1] * divisionWidth);

            callAction({
                action: actions.changeValue,
                args: { value: valindexpair[0] },
                baseVariableValue: valindexpair[1],
            });
        } else {
            let i = Math.round((e.clientX - offsetLeft) / divisionWidth);
            i = Math.max(0, Math.min(SVs.numItems - 1, i));

            setIndex(i);
            // setThumbValue(SVs.items[i]);

            setThumbXPos(i * divisionWidth);

            callAction({
                action: actions.changeValue,
                args: { value: SVs.items[i] },
                baseVariableValue: i,
            });
        }
    }

    function handleDragThrough(e: MouseEvent) {
        if (isMouseDown.current) {
            setThumbXPos(
                Math.max(0, Math.min(SVs.width.size, e.clientX - offsetLeft)),
            );
            if (!(SVs.type === "text")) {
                let refval = xPositionToValue(
                    e.clientX - offsetLeft,
                    divisionWidth,
                    startValue,
                );

                let valindexpair = nearestValue(refval, SVs.items, SVs);
                // setThumbValue(valindexpair[0]);
                setIndex(valindexpair[1]);

                callAction({
                    action: actions.changeValue,
                    args: {
                        value: valindexpair[0],
                        transient: true,
                        skippable: true,
                    },
                    baseVariableValue: valindexpair[1],
                });
            } else {
                let i = Math.round((e.clientX - offsetLeft) / divisionWidth);
                setIndex(i);
                // setThumbValue(SVs.items[i]);

                callAction({
                    action: actions.changeValue,
                    args: {
                        value: SVs.items[i],
                        transient: true,
                        skippable: true,
                    },
                    baseVariableValue: i,
                });
            }
        }
    }

    function handleNext(e: KeyboardEvent) {
        if (index === SVs.numItems - 1) {
            return;
        }

        let val;

        if (SVs.items.length === 0) {
            val = SVs.from + SVs.step * (index + 1);
        } else {
            val = SVs.items[index + 1];
        }

        callAction({
            action: actions.changeValue,
            args: { value: val },
            baseVariableValue: index + 1,
        });

        // setThumbValue(val);
        setIndex(index + 1);
    }

    function handlePrevious(e: KeyboardEvent) {
        if (index === 0) {
            return;
        }

        let val;

        if (SVs.items.length === 0) {
            val = SVs.from + SVs.step * (index - 1);
        } else {
            val = SVs.items[index - 1];
        }

        callAction({
            action: actions.changeValue,
            args: { value: val },
            baseVariableValue: index - 1,
        });

        // setThumbValue(val);
        setIndex(index - 1);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowLeft") {
            return handlePrevious(e);
        } else if (e.key === "ArrowRight") {
            return handleNext(e);
        }
    }

    let labels: React.ReactNode = "";
    if (SVs.type === "text") {
        labels = generateTextLabels(SVs.items, divisionWidth, SVs);
    } else {
        labels = generateNumericLabels(
            SVs.items,
            divisionWidth,
            startValue,
            SVs,
        );
    }
    let ticksAndLabels: React.ReactNode = "";
    if (SVs.showTicks === false) {
        ticksAndLabels = null;
    } else {
        ticksAndLabels = labels;
    }

    let controls: React.ReactNode = "";
    if (SVs.showControls) {
        controls = (
            <ActionButtonGroup style={{ marginBottom: "12px" }}>
                <ActionButton
                    value="Prev"
                    onClick={(e: KeyboardEvent) => handlePrevious(e)}
                    id={`${id}-prevbutton`}
                ></ActionButton>
                <ActionButton
                    value="Next"
                    onClick={(e: KeyboardEvent) => handleNext(e)}
                    id={`${id}-nextbutton`}
                ></ActionButton>
            </ActionButtonGroup>
        );
    } else {
        null;
    }

    let valueDisplay = null;
    if (SVs.showValue) {
        valueDisplay = (
            <span style={{ left: `${thumbXPos - 4}px`, userSelect: "none" }}>
                {SVs.valueForDisplay}{" "}
            </span>
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
                <StyledValueLabel>
                    {label}
                    {" = " + SVs.valueForDisplay}
                </StyledValueLabel>
            );
        } else {
            myLabel = <StyledValueLabel>{label}</StyledValueLabel>;
        }
    } else if (!SVs.label && SVs.showValue) {
        myLabel = <StyledValueLabel>{SVs.valueForDisplay}</StyledValueLabel>;
    } else {
        myLabel = null;
    }

    return (
        <SliderContainer
            ref={containerRef}
            labeled={SVs.showControls || SVs.label}
            noTicked={SVs.showTicks === false}
            onKeyDown={handleKeyDown as any}
            tabIndex={0}
        >
            <div
                id={`${id}-label`}
                style={{ height: SVs.label || SVs.showValue ? "20px" : "0px" }}
            >
                {myLabel}
            </div>
            <SubContainer2 onMouseDown={handleDragEnter}>
                <StyledSlider width={`${SVs.width.size}px`} id={id}>
                    {/* {valueDisplay} */}
                    <StyledThumb
                        style={{ left: `${thumbXPos - 4}px` }}
                        id={`${id}-handle`}
                    />
                    {ticksAndLabels}
                </StyledSlider>
            </SubContainer2>
            <div style={{ height: SVs.showControls ? "20px" : "0px" }}>
                {/* TODO */}
                {controls}
            </div>
        </SliderContainer>
    );
});
