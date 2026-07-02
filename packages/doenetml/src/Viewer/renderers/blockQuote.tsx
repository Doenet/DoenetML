import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";

interface BlockQuoteSVs extends MarkupSVsBase {
    [key: string]: any;
    renderInlineForListItem: boolean;
}

export default React.memo(function Container(props: UseDoenetRendererProps) {
    const { id, SVs, children, actions, callAction } =
        useDoenetRenderer<BlockQuoteSVs>(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }

    return (
        <blockquote
            id={id}
            ref={ref}
            // Only suppress top margin so list-item numbering top-aligns; keep
            // native blockquote side/bottom spacing from stylesheet defaults.
            style={SVs.renderInlineForListItem ? { marginTop: 0 } : undefined}
        >
            {body}
        </blockquote>
    );
});
