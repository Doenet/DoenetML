// @ts-nocheck
import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb as lightOff } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as lightOn } from "@fortawesome/free-regular-svg-icons";
import { useRecordVisibilityChanges } from "../../utils/visibility";

import { addCommasForCompositeRanges } from "./utils/composites";
import "./hint.css";

export default React.memo(function Hint(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (!SVs.showHints) {
        return null;
    }

    let title;
    let removedChildInd = null;
    // BADBADBAD: need to redo how getting the title child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble
    if (SVs.titleChildName) {
        for (let [ind, child] of children.entries()) {
            //child might be null or a string
            if (
                child &&
                typeof child === "object" &&
                "props" in child &&
                child?.props?.componentInstructions.componentIdx ===
                    SVs.titleChildName
            ) {
                title = children[ind];
                children.splice(ind, 1); // remove title
                removedChildInd = ind;
                break;
            }
        }
    }

    if (!title) {
        title = SVs.title;
    }

    //let twirlIcon = <FontAwesomeIcon icon={twirlIsClosed} />;
    let icon = <FontAwesomeIcon icon={lightOff} />;
    let info = null;
    let infoBlockStyle: React.CSSProperties = { display: "none" };
    let onClickFunction = () => {
        callAction({
            action: actions.revealHint,
        });
    };
    let onKeyPressFunction = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            callAction({
                action: actions.revealHint,
            });
        }
    };

    let openCloseText = "open";

    if (SVs.open) {
        if (SVs._compositeReplacementActiveRange) {
            children = addCommasForCompositeRanges({
                children,
                compositeReplacementActiveRange:
                    SVs._compositeReplacementActiveRange,
                startInd: 0,
                endInd: children.length - 1,
                removedInd: removedChildInd,
            });
        }

        // twirlIcon = <FontAwesomeIcon icon={twirlIsOpen} />;
        openCloseText = "close";
        icon = <FontAwesomeIcon icon={lightOn} />;
        info = children;
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
        onKeyPressFunction = (e) => {
            if (e.key === "Enter") {
                callAction({
                    action: actions.closeHint,
                });
            }
        };

        onClickFunction = () => {
            callAction({
                action: actions.closeHint,
            });
        };
    }

    return (
        <aside id={id} key={id} ref={ref}>
            <span
                className="hint-title"
                style={{
                    margin: SVs.open ? "12px 4px 0px 4px" : "12px 4px 12px 4px",
                    borderBottomLeftRadius: SVs.open ? "0px" : "5px",
                    borderBottomRightRadius: SVs.open ? "0px" : "5px",
                }}
                tabIndex={0}
                data-test="hint-heading"
                onClick={onClickFunction}
                onKeyDown={onKeyPressFunction}
            >
                {" "}
                {icon} {title} (click to {openCloseText})
            </span>
            <span style={infoBlockStyle}>{info}</span>
        </aside>
    );
});
