import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece as puzzle } from "@fortawesome/free-solid-svg-icons";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useT } from "../../utils/i18n";
import "./solution.css";

interface SolutionSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    canBeClosed: boolean;
    message: string;
    open: boolean;
    rendered: boolean;
    sectionName: string;
}

export default React.memo(function Solution(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<SolutionSVs>(props);

    const t = useT();

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    // The whole parenthetical is one message: which word goes where inside it
    // is the translator's business, not this component's.
    let openCloseText = t(
        "solution-click-to-open",
        undefined,
        "(click to open)",
    );

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
        openCloseText = t(
            "solution-click-to-close",
            undefined,
            "(click to close)",
        );
        childrenToRender = SVs.rendered ? (
            children
        ) : (
            <p>{t("solution-initializing", undefined, "Initializing...")}</p>
        );
        infoBlockStyle = {
            display: "block",
            margin: "0px 4px 12px 4px",
            padding: "6px",
            border: "2px solid var(--canvasText)",
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
        <aside
            id={id}
            style={{ margin: "12px 0" }}
            ref={ref}
            className="solution"
        >
            <span
                style={{
                    display: "block",
                    margin: SVs.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
                    padding: "6px",
                    border: "2px solid var(--canvasText)",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    borderBottomLeftRadius: SVs.open ? "0px" : "5px",
                    borderBottomRightRadius: SVs.open ? "0px" : "5px",
                    backgroundColor: "var(--revealButtonSurface)",
                    cursor: "pointer",
                }}
                tabIndex={0}
                id={id + "_button"}
                onClick={onClickFunction}
                onKeyDown={onKeyPressFunction}
            >
                {icon} {SVs.sectionName} {SVs.message} {openCloseText}
            </span>
            <span style={infoBlockStyle}>{childrenToRender}</span>
        </aside>
    );
});
