import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRef } from "react";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { useContentT } from "../../utils/i18n";

interface PSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    justSubmitted: boolean;
    renderInlineForListItem: boolean;
}

export type PProps = UseDoenetRendererProps & {
    /**
     * Set by the `<li>` renderer on the paragraph that leads a list item, so
     * that the item's marker stays part of the item's text for screen readers.
     * See `markLeadingParagraphOfListItem` in `list.tsx`.
     */
    isLeadingListItemParagraph?: boolean;
};

export default React.memo(function P(props: PProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<PSVs>(props);

    // The check-work button follows the document's language, not the
    // reader's — see `useContentT`.
    const tContent = useContentT();

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let checkWorkComponent = null;
    const validationState = calculateValidationState(SVs);
    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAllAnswers",
        actions,
        callAction,
        validationState,
        justSubmitted: SVs.justSubmitted,
    });

    if (actions.submitAllAnswers) {
        checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitActionWithPending,
            true,
            isPending,
            tContent,
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

    return (
        <div
            id={id}
            ref={ref}
            className="para"
            // A `<div>` is exposed as an anonymous `generic` node, so paragraphs
            // are not announced as paragraphs without an explicit role. The one
            // paragraph that leads a list item is presentational instead, to
            // keep the item's marker readable — see `list.tsx`. That flag comes
            // from the `<li>` renderer rather than from
            // `SVs.renderInlineForListItem` below: the latter is the core's
            // margin-collapsing signal, which answers a related but different
            // question — it fires for a `<p>` leading either a real `<li>` or
            // a section rendered as a list item — and does not track what the
            // renderer actually puts in the accessibility tree.
            role={
                props.isLeadingListItemParagraph ? "presentation" : "paragraph"
            }
            // Keep paragraph spacing contract intact and only collapse the top
            // margin when this paragraph is first in a list-item container.
            style={SVs.renderInlineForListItem ? { marginTop: 0 } : undefined}
        >
            {children}
            {checkWorkComponent}
        </div>
    );
});
