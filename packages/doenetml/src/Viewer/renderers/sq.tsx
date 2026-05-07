import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";

interface SqSVs extends MarkupSVsBase {
    [key: string]: any;
}

export default React.memo(function Sq(props: UseDoenetRendererProps) {
    const { SVs, children } = useDoenetRenderer<SqSVs>(props);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }
    return <>&lsquo;{body}&rsquo;</>;
});
