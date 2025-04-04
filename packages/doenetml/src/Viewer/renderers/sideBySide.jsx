import React, { useRef } from "react";

// import styled from "styled-components";
import useDoenetRenderer from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function sideBySide(props) {
    let { name, id, SVs, children, actions, callAction } =
        useDoenetRenderer(props);
    // console.log(">>>name: ", name, " value: ", SVs);
    // console.log(">>>children",children)
    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let styledChildren = [];
    const marginLeft = SVs.margins[0];
    const marginRight = SVs.margins[1];

    const numColumns = children.length;

    for (let [i, child] of children.entries()) {
        let width = SVs.widths[i];
        // console.log(">>>marginLeft",marginLeft)
        // console.log(">>>width",width)
        // console.log(">>>marginRight",marginRight)
        // console.log(">>>gap",SVs.gapWidth)

        let thisMarginLeft = marginLeft;
        let thisMarginRight = marginRight;

        if (i > 0) {
            thisMarginLeft += SVs.gapWidth / 2;
        }
        if (i < numColumns - 1) {
            thisMarginRight += SVs.gapWidth / 2;
        }

        styledChildren.push(
            <span
                style={{
                    marginLeft: `${thisMarginLeft}%`,
                    marginRight: `${thisMarginRight}%`,
                    width: `${width}%`,
                }}
                key={child.key}
            >
                {child}
            </span>,
        );
    }

    return (
        <div
            id={id}
            style={{ display: "flex", maxWidth: "850px", margin: "12px 0" }}
            ref={ref}
        >
            <a name={id} />
            {styledChildren}
        </div>
    );
});
