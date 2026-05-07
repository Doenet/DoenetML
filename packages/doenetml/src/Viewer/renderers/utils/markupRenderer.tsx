import React from "react";
import { addCommasForCompositeRanges } from "./composites";

/**
 * Minimum SV shape consumed by `renderMarkupBody`. Markup-style renderers
 * (em, c, q, sq, blockQuote, …) carry these two fields plus their own
 * wrapper-specific fields; this base captures the common pair.
 */
export interface MarkupSVsBase {
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
}

/**
 * Compute the body for a simple markup renderer that wraps its children in
 * a single element and conditionally interleaves composite-range commas.
 *
 * Returns `null` when the renderer should render nothing (`hidden`), or the
 * (possibly transformed) children otherwise. The caller decides which
 * wrapper element (e.g. `<em>`, `<code>`, `<blockquote>`) to drop the body
 * into.
 */
export function renderMarkupBody({
    SVs,
    children,
}: {
    SVs: MarkupSVsBase;
    children: React.ReactNode[];
}): React.ReactNode[] | null {
    if (SVs.hidden) {
        return null;
    }

    if (SVs._compositeReplacementActiveRange) {
        return addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    return children;
}
