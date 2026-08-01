import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment as thoughtBubble } from "@fortawesome/free-regular-svg-icons";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useChromeLangDir, useT } from "../../utils/i18n";
import "./feedback.css";

interface FeedbackSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    feedbackText: string;
}

export default React.memo(function Feedback(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<FeedbackSVs>(props);

    const t = useT();
    // Only the heading is chrome; the feedback text below it is the
    // author's and stays in the document's language and direction.
    const chromeLangDir = useChromeLangDir();

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
        <div ref={ref} className="feedback">
            <span tabIndex={0} {...chromeLangDir}>
                {icon} {t("feedback-heading", undefined, "Feedback")}
            </span>
            <aside id={id}>
                {SVs.feedbackText}
                {children}
            </aside>
        </div>
    );
});
