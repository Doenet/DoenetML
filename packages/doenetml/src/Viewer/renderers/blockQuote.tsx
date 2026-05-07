import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";

interface BlockQuoteSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    renderInlineForListItem: boolean;
}

export default React.memo(function Container(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<BlockQuoteSVs>(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
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
        <blockquote
            id={id}
            ref={ref}
            // Only suppress top margin so list-item numbering top-aligns; keep
            // native blockquote side/bottom spacing from stylesheet defaults.
            style={SVs.renderInlineForListItem ? { marginTop: 0 } : undefined}
        >
            {children}
        </blockquote>
    );
});
