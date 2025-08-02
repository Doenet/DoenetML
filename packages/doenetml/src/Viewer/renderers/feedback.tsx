import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment as thoughtBubble } from "@fortawesome/free-regular-svg-icons";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import styled from "styled-components";
import { addCommasForCompositeRanges } from "./utils/composites";
const FeedbackStyling = styled.aside`
    background-color: var(--canvas);
    margin: 0px 4px 12px 4px;
    padding: 1em;
    border: 2px solid var(--canvasText);
    border-top: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    //   &: focus {
    //   outline: 2px solid var(--canvasText);
    //   outline-offset: 2px;
    //  }
`;
const SpanStyling = styled.span`
    display: block;
    margin: 12px 4px 0px 4px;
    padding: 6px;
    border: 2px solid var(--canvasText);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: var(--mainGray);
    &: focus {
        outline: 2px solid var(--canvasText);
        outline-offset: 2px;
    }
`;
export default React.memo(function Feedback(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let icon = <FontAwesomeIcon icon={thoughtBubble} />;

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
        <div ref={ref}>
            <SpanStyling tabIndex={0}>{icon} Feedback</SpanStyling>
            <FeedbackStyling
                id={id}
                // tabIndex="0"
            >
                {SVs.feedbackText}
                {children}
            </FeedbackStyling>
        </div>
    );
});
