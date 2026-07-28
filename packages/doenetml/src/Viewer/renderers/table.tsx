import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";

interface TableSVs {
    [key: string]: any;
    hidden: boolean;
    suppressTableNameInTitle: boolean;
    tableName: string;
    tableNamePrefix: string;
    title: string;
    titleChildName: string;
}

export default React.memo(function Table(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<TableSVs>(props);

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
        // The separator between the name and the title is part of the name the
        // worker composed, not a `": "` written here: it is a translation
        // decision, and it used to be unreachable from any catalog (#1582).
        // It falls inside the `<strong>` as a result, which is the trade the
        // issue named and settled. Which of the two names to print is decided
        // here rather than taken from the worker's answer alone, because a
        // title child can exist without this renderer finding a node for it,
        // and a dangling ": " would show.
        const tableName = (
            <strong>{title ? SVs.tableNamePrefix : SVs.tableName}</strong>
        );
        title = title ? (
            <>
                {tableName}
                {title}
            </>
        ) : (
            tableName
        );
    }

    heading = <div id={id + "_title"}>{title}</div>;

    return (
        <div id={id} style={{ margin: "12px 0" }} ref={ref}>
            {heading}
            {childrenToRender}
        </div>
    );
});
