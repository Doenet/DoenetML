import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece as puzzle } from "@fortawesome/free-solid-svg-icons";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useChromeLangDir, useT } from "../../utils/i18n";
import { clickToToggleLabel } from "./utils/disclosure";
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

    const openCloseText = clickToToggleLabel(t, SVs.open);
    // The heading is mixed: the section name and message come from the worker
    // in the document's language, while "(click to open)" is the reader's.
    // Only the chrome half re-declares itself, and only where the two
    // directions disagree.
    const chromeLangDir = useChromeLangDir();

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
        childrenToRender = SVs.rendered ? (
            children
        ) : (
            <p>{t("collapsible-initializing", undefined, "Initializing...")}</p>
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
                {icon} {SVs.sectionName} {SVs.message}{" "}
                <span {...chromeLangDir}>{openCloseText}</span>
            </span>
            <span style={infoBlockStyle}>{childrenToRender}</span>
        </aside>
    );
});
