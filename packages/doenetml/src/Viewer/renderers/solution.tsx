import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece as puzzle } from "@fortawesome/free-solid-svg-icons";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import styled from "styled-components";
import { addCommasForCompositeRanges } from "./utils/composites";
const SpanStyling = styled.span`
    // display: block;
    // margin: SVs.open ? 12px 4px 0px 4px : 12px 4px 12px 4px;
    // padding: 6px;
    // border: 2px solid black;
    // border-top-left-radius: 5px;
    // border-top-right-radius: 5px;
    // border-bottom-left-radius: SVs.open ? 0px : 5px;
    // border-bottom-right-radius: SVs.open ? 0px : 5px;
    // background-color: var(--mainGray);
    // cursor: pointer;
    &: focus {
        outline: 2px solid var(--canvastext);
        outline-offset: 2px;
    }
`;

export default React.memo(function Solution(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    let openCloseText = "open";

    if (SVs.hidden) {
        return null;
    }

    let icon;
    let childrenToRender = null;
    let infoBlockStyle: React.CSSProperties = { display: "none" };

    let onClickFunction;
    let cursorStyle;
    let onKeyPressFunction;

    if (SVs.open) {
        if (SVs._compositeReplacementActiveRange) {
            children = addCommasForCompositeRanges({
                children,
                compositeReplacementActiveRange:
                    SVs._compositeReplacementActiveRange,
                startInd: 0,
                endInd: children.length - 1,
            });
        }

        icon = <FontAwesomeIcon icon={puzzle} />;
        openCloseText = "close";
        childrenToRender = SVs.rendered ? children : <p>Initializing...</p>;
        infoBlockStyle = {
            display: "block",
            margin: "0px 4px 12px 4px",
            padding: "6px",
            border: "2px solid var(--canvastext)",
            borderTop: "0px",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            backgroundColor: "var(--canvas)",
        };
        onKeyPressFunction = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                callAction({
                    action: actions.closeSolution,
                });
            }
        };

        if (SVs.canBeClosed) {
            cursorStyle = "pointer";
            onClickFunction = () => {
                callAction({
                    action: actions.closeSolution,
                });
            };
        } else {
            onClickFunction = () => {};
        }
    } else {
        icon = <FontAwesomeIcon icon={puzzle} rotation={90} />;
        cursorStyle = "pointer";
        onClickFunction = () => {
            callAction({
                action: actions.revealSolution,
            });
        };
        onKeyPressFunction = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                callAction({
                    action: actions.revealSolution,
                });
            }
        };
    }

    return (
        <aside id={id} style={{ margin: "12px 0" }} ref={ref}>
            <SpanStyling
                style={{
                    display: "block",
                    margin: SVs.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
                    padding: "6px",
                    border: "2px solid var(--canvastext)",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: SVs.open ? "0px" : "5px",
                    borderBottomRightRadius: SVs.open ? "0px" : "5px",
                    backgroundColor: "var(--mainGray)",
                    cursor: "pointer",
                }}
                tabIndex={0}
                id={id + "_button"}
                onClick={onClickFunction}
                onKeyDown={onKeyPressFunction}
            >
                {icon} {SVs.sectionName} {SVs.message} (click to {openCloseText}
                )
            </SpanStyling>
            <span style={infoBlockStyle}>{childrenToRender}</span>
        </aside>
    );
});
