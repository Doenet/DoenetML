import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";

interface InsertSVs extends MarkupSVsBase {
    [key: string]: any;
}

export default React.memo(function Insert(props: UseDoenetRendererProps) {
    const { id, SVs, children } = useDoenetRenderer<InsertSVs>(props);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }
    return <ins id={id}>{body}</ins>;
});
