import React, { type CSSProperties, type Ref } from "react";

interface MediaLayoutStyles {
    outerStyle: CSSProperties;
    innerStyle: CSSProperties;
    mediaContainerStyle: CSSProperties;
    mediaColumnStyle: CSSProperties;
}

interface NonInlineMediaWrapperProps {
    id: string;
    /** "inline" preserves inline layout; any other value uses non-inline. */
    displayMode: string;
    /**
     * When true, suppress the outer container's top margin. Used when the
     * renderer is the first child of a list-item container so list-item
     * numbering top-aligns with the media.
     */
    suppressTopMargin: boolean;
    /**
     * Pre-built style bundle. Inline-mode renderers build a small two-style
     * pair manually; non-inline-mode renderers source it from
     * `getNonInlineMediaLayoutStyles()`. The unused fields can be empty.
     */
    layoutStyles: MediaLayoutStyles;
    /** The actual media element (e.g. <img>, <video>, <iframe>). */
    media: React.ReactNode;
    /** Description content (already wrapped in popover/details by the caller). */
    description: React.ReactNode | null;
    containerRef?: Ref<HTMLDivElement>;
    /**
     * Extra attributes for the outer container <div>. Use this for
     * renderer-specific outer-div decorations (e.g. `tabIndex`, `className`).
     * `id`, `ref`, and `style` are managed by the wrapper.
     */
    containerAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Shared layout wrapper for the image and video renderers' off-graph
 * fallback path. Handles the outer/inner container nesting and the
 * inline-vs-non-inline conditional that interleaves the media element with
 * its description.
 *
 * Pre-extraction, the same nested-div block was duplicated between
 * `image.tsx` and `video.tsx` — only the outer-div decorations
 * (`tabIndex`, `className`) and the media-element type differed.
 */
export function NonInlineMediaWrapper({
    id,
    displayMode,
    suppressTopMargin,
    layoutStyles,
    media,
    description,
    containerRef,
    containerAttrs,
}: NonInlineMediaWrapperProps) {
    const { outerStyle, innerStyle, mediaContainerStyle, mediaColumnStyle } =
        layoutStyles;
    const containerStyle = suppressTopMargin
        ? { ...outerStyle, marginTop: 0 }
        : outerStyle;
    const isInline = displayMode === "inline";

    return (
        <div
            {...containerAttrs}
            id={`${id}-container`}
            ref={containerRef}
            style={containerStyle}
        >
            <div style={innerStyle}>
                {isInline ? (
                    media
                ) : (
                    <div style={mediaContainerStyle}>{media}</div>
                )}
                {isInline || !description ? (
                    description
                ) : (
                    <div style={mediaContainerStyle}>
                        <div style={mediaColumnStyle}>{description}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
