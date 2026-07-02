import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";

interface EmSVs extends MarkupSVsBase {
    [key: string]: any;
}

export default React.memo(function Em(props: UseDoenetRendererProps) {
    const { id, SVs, children } = useDoenetRenderer<EmSVs>(props);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }
    return <em id={id}>{body}</em>;
});
