import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

interface AlertSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
}

export default React.memo(function Alert(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<AlertSVs>(props);

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

    return <strong id={id}>{children}</strong>;
});
