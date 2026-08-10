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
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { useContentT } from "../../utils/i18n";
import type { PProps } from "./p";
import "./list.css";

interface ListSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    item?: any;
    firstChildListItemAlignment?: string;
    justSubmitted: boolean;
    level: number;
    marker: string;
    numbered: boolean;
}

export default React.memo(function List(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<ListSVs>(props);

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

    // TODO: incorporate label
    if (SVs.item) {
        return (
            <li
                id={id}
                ref={ref}
                // A leading block with no line box of its own leaves the browser
                // nowhere to draw the item's native marker; the class supplies a
                // line box at the top of the item. See `list.css`.
                className={
                    SVs.firstChildListItemAlignment === "flex-start"
                        ? "list-item-marker-anchored"
                        : undefined
                }
            >
                {markLeadingParagraphOfListItem(children)}
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
            <>
                <ol id={id} style={{ listStyleType: list_style }} ref={ref}>
                    {children}
                </ol>
                {checkWorkComponent}
            </>
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
            <>
                <ul id={id} style={{ listStyleType: list_style }} ref={ref}>
                    {children}
                </ul>
                {checkWorkComponent}
            </>
        );
    }
});

/**
 * Flag the leading paragraph of a list item so that it renders as
 * presentational.
 *
 * A screen reader folds a list item's `::marker` into the item's own text run
 * only when that text is a direct child of the `<li>`. A paragraph wrapper
 * makes the marker a separate object that VoiceOver lands on and announces as
 * a bare "list marker" instead of "1. Apples, 1 of 3" — see issue #662. The
 * leading paragraph therefore drops out of the accessibility tree; every later
 * paragraph keeps its own node, since a reader still wants to be told where
 * the next paragraph starts.
 *
 * Only a paragraph that leads the item is worth flagging: any other leading
 * child (a figure, a nested list, or the `<span>` that
 * `addCommasForCompositeRanges` wraps around a composite's replacements) sits
 * between the marker and the text no matter what role the paragraph carries.
 * Blink folds away a semantics-free *inline* generic, so a bare `<span>` around
 * text is harmless — but the span around a composite's replacements holds the
 * block-level `<div class="para">`, which keeps it in the tree as a `generic`
 * node. Making the paragraph inside it presentational would only trade
 * `generic > paragraph > text` for `generic > text`, which is the shape that is
 * already broken; the paragraph keeps its `paragraph` role instead.
 *
 * Two kinds of child are skipped when looking for the leading one, because
 * neither reaches the accessibility tree: whitespace-only text (the
 * indentation an author writes inside the `<li>`) and `null`, which stands for
 * a child that is not rendered — the core sends it for a child it leaves out,
 * most often a `<p hide>`, and `useDoenetRenderer` sends it for a child whose
 * renderer has not finished loading yet (a later render then marks that child,
 * since this runs on every render).
 */
function markLeadingParagraphOfListItem(children: React.ReactNode[]) {
    const leadingInd = children.findIndex(
        (child) =>
            child != null &&
            !(typeof child === "string" && child.trim() === ""),
    );

    const leadingChild = children[leadingInd];

    if (
        !React.isValidElement<PProps>(leadingChild) ||
        leadingChild.props.componentInstructions?.rendererType !== "p"
    ) {
        return children;
    }

    const markedChildren = [...children];
    markedChildren[leadingInd] = React.cloneElement(leadingChild, {
        isLeadingListItemParagraph: true,
    });
    return markedChildren;
}

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
