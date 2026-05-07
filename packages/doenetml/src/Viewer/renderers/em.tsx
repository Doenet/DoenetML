import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

interface EmSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
}

export default React.memo(function Em(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<EmSVs>(props);

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

    return <em id={id}>{children}</em>;
});
