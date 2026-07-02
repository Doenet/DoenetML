import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";

interface CSVs extends MarkupSVsBase {
    [key: string]: any;
}

export default React.memo(function C(props: UseDoenetRendererProps) {
    const { id, SVs, children } = useDoenetRenderer<CSVs>(props);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }
    return (
        <code id={id} style={{ margin: "12px 0" }}>
            {body}
        </code>
    );
});
