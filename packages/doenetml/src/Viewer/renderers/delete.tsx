import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";
import "./editMarkup.css";

interface DeleteSVs extends MarkupSVsBase {
    [key: string]: any;
}

export default React.memo(function Delete(props: UseDoenetRendererProps) {
    const { id, SVs, children } = useDoenetRenderer<DeleteSVs>(props);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }
    return <del id={id}>{body}</del>;
});
