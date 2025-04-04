import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { useRef } from "react";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function P(props) {
    let { name, id, SVs, children, actions, callAction } =
        useDoenetRenderer(props);

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
        <p id={id} ref={ref}>
            <a name={id} />
            {children}
        </p>
    );
});
