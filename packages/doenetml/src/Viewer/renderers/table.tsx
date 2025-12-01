import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function Table(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let heading = null;

    let childrenToRender = [...children];

    // BADBADBAD: need to redo how getting the title child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble

    let title: React.ReactNode | null = null;
    if (SVs.titleChildName) {
        let titleChildInd: number | null = null;
        for (let [ind, child] of children.entries()) {
            //child might be null or a string
            if (
                child &&
                typeof child === "object" &&
                "props" in child &&
                (child.props as any)?.componentInstructions.componentIdx ===
                    SVs.titleChildName
            ) {
                titleChildInd = ind;
                break;
            }
        }

        if (titleChildInd !== null) {
            title = children[titleChildInd];
            childrenToRender.splice(titleChildInd, 1); // remove title
        }
    }
    if (!title) {
        title = SVs.title;
    }

    if (!SVs.suppressTableNameInTitle) {
        let tableName = <strong>{SVs.tableName}</strong>;
        if (title) {
            title = (
                <>
                    {tableName}: {title}
                </>
            );
        } else {
            title = tableName;
        }
    }

    heading = <div id={id + "_title"}>{title}</div>;

    return (
        <div id={id} style={{ margin: "12px 0" }} ref={ref}>
            {heading}
            {childrenToRender}
        </div>
    );
});
