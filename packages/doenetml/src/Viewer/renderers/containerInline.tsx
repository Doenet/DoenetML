import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

export default React.memo(function ContainerInline(
    props: UseDoenetRendererProps,
) {
    let { name, id, SVs, children } = useDoenetRenderer(props);

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

    return <span id={id}>{children}</span>;
});
