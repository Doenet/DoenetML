import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MarkupSVsBase, renderMarkupBody } from "./utils/markupRenderer";

interface QSVs extends MarkupSVsBase {
    [key: string]: any;
}

export default React.memo(function Q(props: UseDoenetRendererProps) {
    const { SVs, children } = useDoenetRenderer<QSVs>(props);

    const body = renderMarkupBody({ SVs, children });
    if (body === null) {
        return null;
    }
    return <>&ldquo;{body}&rdquo;</>;
});
