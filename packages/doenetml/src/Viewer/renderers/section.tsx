import React, { useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faLevelDownAlt,
    faTimes,
    faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { faCaretRight as twirlIsClosed } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown as twirlIsOpen } from "@fortawesome/free-solid-svg-icons";

import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { cesc } from "@doenet/utils";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { DocContext } from "../DocViewer";

interface SectionSVs {
    [key: string]: any;
    hidden: boolean;
    rendered: boolean;
    isListItem: boolean;
    boxed: boolean;
    collapsible: boolean;
    open: boolean;
    title: string;
    titleChildName?: string;
    titleColor?: string;
    titleColorDarkMode?: string;
    titlePrefix?: string;
    sectionNumber?: string;
    level: number;
    containerTag: string;
    justSubmitted: boolean;
    firstChildListItemAlignment?: string;
    firstVisibleChildAdjustedForListItem?: any;
    useListItemGridLayout?: boolean;
}

export default React.memo(function Section(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<SectionSVs>(props);

    const { darkMode } = useContext(DocContext) || {};

    // Pick the heading box background appropriate for the current theme.
    // titleColorDarkMode is a hex default; titleColor may be a CSS variable.
    const headingBoxBg =
        darkMode === "dark" && SVs.titleColorDarkMode != null
            ? SVs.titleColorDarkMode
            : SVs.titleColor;

    // List item styling constants
    // When a section is rendered as a list item (SVs.isListItem), the section number
    // hangs to the left of the content. These constants control the spacing.
    const LIST_ITEM_INDENT = "2em"; // Total width reserved for the hanging section number
    const LIST_ITEM_SPACING = "0.3em"; // Space between section number and following text
    const BOX_PADDING = "6px"; // Standard padding for boxed sections
    const EMPTY_HEADING_MIN_HEIGHT = "1.5em"; // Min height for empty heading box with section number

    const ref = useRef(null);

    // Determine if this section will have a title/heading
    // Used for dependency tracking in useEffect
    // Title exists if there's a titleChildName OR if there's SVs.title and it's not a list item
    // (list items only use SVs.title as a fallback when titleChildName doesn't exist,
    // but the logic at line ~233 prevents this: "} else if (!SVs.isListItem) { title = SVs.title; }")
    const hasTitle = !!SVs.titleChildName || (!!SVs.title && !SVs.isListItem);

    // Declare heading variable early (assigned later in the component)
    let heading: React.ReactNode = null;

    const hasAdjustedFirstChildForListItem =
        SVs.firstVisibleChildAdjustedForListItem;
    // Use the hanging-number grid for any non-empty untitled/unboxed list item
    // (string-first or component-first) so the number's horizontal position is
    // content-independent. `hasAdjustedFirstChildForListItem` remains the
    // narrower, component-only signal used for first-child margin suppression.
    const useListItemGridLayout = SVs.useListItemGridLayout;
    // Baseline is the correct default for a text/inline first line (and for a
    // string first child, where `firstChildListItemAlignment` is "none"); only
    // an explicit "flex-start" first child (e.g. a block choiceInput) opts out.
    const shouldBaselineAlignFirstChild =
        SVs.firstChildListItemAlignment !== "flex-start";

    // Helper function to generate CSS for section number ::before pseudo-element
    // Used for list-item sections to display hanging section numbers
    const getSectionNumberStyles = (hasHeading: boolean) => {
        if (hasHeading) {
            // When there's a heading, use flexbox layout with inline-block ::before
            // This allows proper baseline alignment between number and heading
            return `
                display: inline-block;
                width: calc(${LIST_ITEM_INDENT} - ${LIST_ITEM_SPACING});
                margin-left: calc(-1 * ${LIST_ITEM_INDENT});
                margin-right: ${LIST_ITEM_SPACING};
                text-align: right;
                flex-shrink: 0;
            `;
        } else {
            // Without a heading, use absolute positioning to place number in hanging indent area
            // Use same width as with-heading case to ensure period alignment
            return `
                position: absolute;
                left: 0;
                width: calc(${LIST_ITEM_INDENT} - ${LIST_ITEM_SPACING});
                text-align: right;
            `;
        }
    };

    // Helper function to create heading box styles for boxed sections
    const getHeadingBoxStyle = (
        isCollapsible: boolean,
    ): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            padding: BOX_PADDING,
            backgroundColor: headingBoxBg,
            borderTopLeftRadius: "var(--mainBorderRadius)",
            borderTopRightRadius: "var(--mainBorderRadius)",
            ...(isCollapsible && {
                cursor: "pointer",
                borderBottom: SVs.open ? "var(--mainBorder)" : "none",
            }),
            ...(!isCollapsible && {
                borderBottom: "var(--mainBorder)",
            }),
        };

        // Add list-item specific styling
        if (SVs.isListItem) {
            if (!heading) {
                // No heading: use relative positioning for ::before
                return {
                    ...baseStyle,
                    position: "relative",
                    paddingLeft: LIST_ITEM_INDENT,
                };
            } else {
                // With heading: use flexbox for baseline alignment
                return {
                    ...baseStyle,
                    display: "flex",
                    alignItems: "baseline",
                    paddingLeft: LIST_ITEM_INDENT,
                };
            }
        }

        return baseStyle;
    };

    // Helper function to render the container element based on containerTag
    const renderContainer = (
        content: React.ReactNode,
        style: React.CSSProperties,
    ) => {
        const props = { id, style, ref };

        switch (SVs.containerTag) {
            case "aside":
                return <aside {...props}>{content}</aside>;
            case "article":
                return <article {...props}>{content}</article>;
            case "div":
                return <div {...props}>{content}</div>;
            default:
                return <section {...props}>{content}</section>;
        }
    };

    // Inject dynamic CSS for list-item section numbers into document head
    // This prevents inline <style> tags from interfering with text content in tests
    useEffect(() => {
        if (!SVs.isListItem) {
            return;
        }

        // Create a unique style element ID for this section
        const styleId = `section-list-item-styles-${id}`;

        // Remove any existing style element for this section
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        // Create new style element
        const styleElement = document.createElement("style");
        styleElement.id = styleId;

        // Build CSS rules based on section configuration
        const cssRules = [];
        const escapedId = cesc(id);
        const escapedHeadingWrapperId = cesc(`${id}-heading-wrapper`);
        const escapedContentWrapperId = cesc(`${id}-content-wrapper`);

        // For non-boxed sections with heading wrapper
        if (!SVs.collapsible && !SVs.boxed && hasTitle) {
            cssRules.push(`
                #${escapedHeadingWrapperId}::before {
                    content: "${SVs.sectionNumber}.";
                    display: inline-block;
                    width: calc(${LIST_ITEM_INDENT} - ${LIST_ITEM_SPACING});
                    margin-left: calc(-1 * ${LIST_ITEM_INDENT});
                    margin-right: ${LIST_ITEM_SPACING};
                    text-align: right;
                    flex-shrink: 0;
                }
            `);
        }

        // For non-boxed sections without heading
        if (!SVs.collapsible && !SVs.boxed && !hasTitle) {
            if (useListItemGridLayout) {
                // Hanging-number grid: a fixed-width number column keeps the
                // number's horizontal position (the decimal) independent of the
                // content's width, wrapping, and whether the first child is a
                // string or a component, so sibling numbers always line up.
                cssRules.push(`
                    #${escapedId} {
                        display: grid;
                        grid-template-columns: ${LIST_ITEM_INDENT} minmax(0, 1fr);
                        align-items: ${
                            shouldBaselineAlignFirstChild
                                ? "baseline"
                                : "flex-start"
                        };
                    }

                    #${escapedId}::before {
                        content: "${SVs.sectionNumber}.";
                        grid-column: 1;
                        text-align: right;
                        padding-right: ${LIST_ITEM_SPACING};
                    }

                    #${escapedContentWrapperId} {
                        grid-column: 2;
                        min-width: 0;
                    }
                `);

                // Only suppress the top margin of a *component* first child: a
                // string first child has no margin to suppress, and a block that
                // merely follows leading text keeps its normal margins.
                if (hasAdjustedFirstChildForListItem) {
                    cssRules.push(`
                        #${escapedContentWrapperId} > :first-child {
                            margin-block-start: 0;
                        }
                    `);
                }
            } else {
                // Empty untitled list item (number only, no content): hang the
                // number into the container's left indent.
                cssRules.push(`
                    #${escapedId}::before {
                        content: "${SVs.sectionNumber}.";
                        display: inline-block;
                        width: calc(${LIST_ITEM_INDENT} - ${LIST_ITEM_SPACING});
                        margin-left: calc(-1 * ${LIST_ITEM_INDENT});
                        margin-right: ${LIST_ITEM_SPACING};
                        text-align: right;
                        vertical-align: baseline;
                    }
                `);
            }
        }

        // For collapsible boxed sections
        if (SVs.collapsible) {
            const headingBoxClassName = `section-heading-${id}`;
            const escapedHeadingBoxClassName = cesc(headingBoxClassName);
            cssRules.push(`
                #${escapedId} .${escapedHeadingBoxClassName}::before {
                    content: "${SVs.sectionNumber}.";
                    text-align: right;
                    ${getSectionNumberStyles(hasTitle)}
                }
            `);
        }

        // For static boxed sections
        if (SVs.boxed && !SVs.collapsible) {
            const headingBoxClassName = `section-heading-${id}`;
            const escapedHeadingBoxClassName = cesc(headingBoxClassName);
            cssRules.push(`
                #${escapedId} .${escapedHeadingBoxClassName}::before {
                    content: "${SVs.sectionNumber}.";
                    text-align: right;
                    ${getSectionNumberStyles(hasTitle)}
                }
            `);
        }

        // Add CSS rules to style element and append to head
        if (cssRules.length > 0) {
            styleElement.textContent = cssRules.join("\n");
            document.head.appendChild(styleElement);
        }

        // Cleanup: remove style element when component unmounts or dependencies change
        return () => {
            const style = document.getElementById(styleId);
            if (style) {
                style.remove();
            }
        };
    }, [
        SVs.isListItem,
        SVs.sectionNumber,
        SVs.collapsible,
        SVs.boxed,
        hasTitle,
        hasAdjustedFirstChildForListItem,
        useListItemGridLayout,
        shouldBaselineAlignFirstChild,
        id,
    ]);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    const validationState = calculateValidationState(SVs);
    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAllAnswers",
        actions,
        callAction,
        validationState,
        justSubmitted: SVs.justSubmitted,
    });

    let title;
    let removedChildInd = null;
    // BADBADBAD: need to redo how getting the title child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble
    if (SVs.titleChildName) {
        for (let [ind, child] of children.entries()) {
            //child might be null or a string
            if (
                (child as any)?.props?.componentInstructions.componentIdx ===
                SVs.titleChildName
            ) {
                title = children[ind];
                children.splice(ind, 1); // remove title
                removedChildInd = ind;
                break;
            }
        }
    }

    if (title) {
        title = (
            <>
                {SVs.titlePrefix}
                {title}
            </>
        );
    } else if (!SVs.isListItem) {
        title = SVs.title;
    }

    let headingId = id + "_title";

    if (SVs.collapsible) {
        if (SVs.open) {
            title = (
                <>
                    <FontAwesomeIcon icon={twirlIsOpen} /> {title} (click to
                    close)
                </>
            );
        } else {
            title = (
                <>
                    <FontAwesomeIcon icon={twirlIsClosed} /> {title} (click to
                    open)
                </>
            );
        }
    }

    let headingStyle = {};
    if (SVs.collapsible || SVs.boxed) {
        // remove large margins if heading is in a box
        headingStyle = {
            marginBlockStart: 0,
            marginBlockEnd: 0,
        };
    }

    if (title) {
        switch (SVs.level) {
            case 0:
                heading = (
                    <h1 id={headingId} style={headingStyle}>
                        {title}
                    </h1>
                );
                break;
            case 1:
                heading = (
                    <h2 id={headingId} style={headingStyle}>
                        {title}
                    </h2>
                );
                break;
            case 2:
                heading = (
                    <h3 id={headingId} style={headingStyle}>
                        {title}
                    </h3>
                );
                break;
            case 3:
                heading = (
                    <h4 id={headingId} style={headingStyle}>
                        {title}
                    </h4>
                );
                break;
            case 4:
                heading = (
                    <h5 id={headingId} style={headingStyle}>
                        {title}
                    </h5>
                );
                break;
            default:
                heading = (
                    <h6 id={headingId} style={headingStyle}>
                        {title}
                    </h6>
                );
                break;
        }
    }

    let checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitActionWithPending,
        true,
        isPending,
    );

    if (checkWorkComponent) {
        checkWorkComponent = <div>{checkWorkComponent}</div>;
    }

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

    let childrenForContentWrapper = children;
    const needsContentWrapper =
        SVs.isListItem &&
        !SVs.collapsible &&
        !SVs.boxed &&
        !heading &&
        useListItemGridLayout;

    if (needsContentWrapper) {
        let startInd = 0;
        while (
            startInd < children.length &&
            typeof children[startInd] === "string" &&
            (children[startInd] as string).trim() === ""
        ) {
            startInd++;
        }
        childrenForContentWrapper = children.slice(startInd);
    }

    let content = (
        <>
            {/* For non-boxed list items with a heading, wrap the heading in a flex container
                that positions the section number using ::before pseudo-element. This achieves
                baseline alignment between the section number and the heading text. */}
            {SVs.isListItem && !SVs.collapsible && !SVs.boxed && heading ? (
                <div
                    id={`${id}-heading-wrapper`}
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        position: "relative",
                    }}
                >
                    {heading}
                </div>
            ) : (
                heading
            )}
            {needsContentWrapper ? (
                <div id={`${id}-content-wrapper`}>
                    {childrenForContentWrapper}
                    {checkWorkComponent}
                </div>
            ) : (
                <>
                    {children}
                    {checkWorkComponent}
                </>
            )}
        </>
    );

    if (SVs.collapsible) {
        let innerContent = null;
        if (SVs.open) {
            const innerContentStyle = {
                display: "block",
                padding: BOX_PADDING,
                ...(SVs.isListItem && { paddingLeft: LIST_ITEM_INDENT }),
            };
            innerContent = (
                <div style={innerContentStyle}>
                    {SVs.rendered ? children : <p>Initializing...</p>}
                    {checkWorkComponent}
                </div>
            );
        }

        const headingBoxStyle = getHeadingBoxStyle(true);
        const headingBoxClassName = `section-heading-${id}`;

        content = (
            <div
                style={{
                    border: "var(--mainBorder)",
                    borderRadius: "var(--mainBorderRadius)",
                    marginTop: "24px",
                }}
            >
                <div
                    className={headingBoxClassName}
                    style={headingBoxStyle}
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            callAction({
                                action: SVs.open
                                    ? actions.closeSection
                                    : actions.revealSection,
                            });
                        }
                    }}
                    onClick={() =>
                        callAction({
                            action: SVs.open
                                ? actions.closeSection
                                : actions.revealSection,
                        })
                    }
                >
                    {heading ||
                        (SVs.isListItem ? (
                            <span
                                style={{
                                    minHeight: EMPTY_HEADING_MIN_HEIGHT,
                                    display: "inline-block",
                                }}
                            >
                                &nbsp;
                            </span>
                        ) : null)}
                </div>
                {innerContent}
            </div>
        );
    } else if (SVs.boxed) {
        const headingBoxStyle = getHeadingBoxStyle(false);

        const contentDivStyle = {
            display: "block",
            padding: BOX_PADDING,
            ...(SVs.isListItem && { paddingLeft: LIST_ITEM_INDENT }),
        };

        const headingBoxClassName = `section-heading-${id}`;

        content = (
            <div
                style={{
                    border: "var(--mainBorder)",
                    borderRadius: "var(--mainBorderRadius)",
                    marginTop: "24px",
                }}
            >
                <div className={headingBoxClassName} style={headingBoxStyle}>
                    {heading ||
                        (SVs.isListItem ? (
                            <span
                                style={{
                                    minHeight: EMPTY_HEADING_MIN_HEIGHT,
                                    display: "inline-block",
                                }}
                            >
                                &nbsp;
                            </span>
                        ) : null)}
                </div>
                <div style={contentDivStyle}>
                    {children}
                    {checkWorkComponent}
                </div>
            </div>
        );
    }

    // Render non-boxed list-item sections with hanging section numbers
    if (SVs.isListItem && !SVs.collapsible && !SVs.boxed) {
        // With the hanging-number grid the number lives in the grid's fixed
        // first column, so the container must NOT also add a left indent
        // (that would double the gutter). Titled/empty list items still use the
        // legacy hanging indent via a container margin.
        const containerStyle: React.CSSProperties = useListItemGridLayout
            ? { margin: "12px 0" }
            : {
                  margin: "12px 0",
                  position: "relative",
                  marginLeft: LIST_ITEM_INDENT,
              };

        return renderContainer(content, containerStyle);
    }

    // Render all other sections (non-list-item or boxed sections)
    return renderContainer(content, { margin: "12px 0" });
});
