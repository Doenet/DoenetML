import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";

export default React.memo(function Pre(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) return null;

    if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    for (let ind of SVs.displayDoenetMLIndices) {
        let prevChild = children[ind - 1];

        if (typeof prevChild === "string") {
            // if the last \n is followed by just spacing
            // (or beginning of string is just spacing, if no \n)
            // remove those spaces
            // so that the first line of the displayed DoenetML will not be indented,
            // consistent with the remaining lines of the DoenetML

            let lastLineBreak = prevChild.lastIndexOf("\n");
            if (/^\s*$/.test(prevChild.slice(lastLineBreak + 1))) {
                prevChild = prevChild.slice(0, lastLineBreak + 1);
                children[ind - 1] = prevChild;
            }
        }
    }

    return (
        <pre id={id} style={{ margin: "12px 0" }} ref={ref}>
            {children}
        </pre>
    );
});
