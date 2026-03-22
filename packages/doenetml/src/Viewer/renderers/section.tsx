// @ts-nocheck
import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faLevelDownAlt,
    faTimes,
    faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { faCaretRight as twirlIsClosed } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown as twirlIsOpen } from "@fortawesome/free-solid-svg-icons";

import useDoenetRenderer from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { cesc } from "@doenet/utils";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

export default React.memo(function Section(props) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

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
    let heading = null;

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
    const getHeadingBoxStyle = (isCollapsible: boolean) => {
        const baseStyle = {
            padding: BOX_PADDING,
            backgroundColor: SVs.titleColor,
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
            {children}
            {checkWorkComponent}
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
                    tabIndex="0"
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
        const containerStyle = {
            margin: "12px 0",
            position: "relative",
            marginLeft: LIST_ITEM_INDENT,
        };

        return renderContainer(content, containerStyle);
    }

    // Render all other sections (non-list-item or boxed sections)
    return renderContainer(content, { margin: "12px 0" });
});
