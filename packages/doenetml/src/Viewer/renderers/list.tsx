import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

export default React.memo(function List(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let checkWorkComponent = null;

    if (actions.submitAllAnswers) {
        const submitAllAnswers = () =>
            callAction({
                action: actions.submitAllAnswers,
            });

        const validationState = calculateValidationState(SVs);
        checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitAllAnswers,
            true,
        );
    }

    if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    // TODO: incorporate label
    if (SVs.item) {
        return (
            <li id={id} ref={ref}>
                {children}
                {checkWorkComponent}
            </li>
        );
    } else if (SVs.numbered) {
        let list_style;
        if (SVs.marker) {
            if (SVs.marker[0] === "1") {
                list_style = "decimal";
            } else if (SVs.marker[0] === "a") {
                list_style = "lower-alpha";
            } else if (SVs.marker[0] === "i") {
                list_style = "lower-roman";
            } else if (SVs.marker[0] === "A") {
                list_style = "upper-alpha";
            } else if (SVs.marker[0] === "I") {
                list_style = "upper-roman";
            }
        }
        if (!list_style) {
            list_style =
                styleTypeByLevel.numbered[
                    (SVs.level - 1) % styleTypeByLevel.numbered.length
                ];
        }
        return (
            <ol id={id} style={{ listStyleType: list_style }} ref={ref}>
                {children}
            </ol>
        );
    } else {
        let list_style;
        if (SVs.marker) {
            list_style = SVs.marker.toLowerCase();
            if (!unnumberedStyles.includes(list_style)) {
                list_style = null;
            }
        }
        if (!list_style) {
            list_style =
                styleTypeByLevel.unnumbered[
                    (SVs.level - 1) % styleTypeByLevel.unnumbered.length
                ];
        }
        return (
            <ul id={id} style={{ listStyleType: list_style }} ref={ref}>
                {children}
            </ul>
        );
    }
});

const unnumberedStyles = ["disc", "circle", "square"];

const styleTypeByLevel = {
    numbered: [
        "decimal",
        "lower-alpha",
        "lower-roman",
        "upper-alpha",
        "upper-roman",
    ],
    unnumbered: unnumberedStyles,
};
