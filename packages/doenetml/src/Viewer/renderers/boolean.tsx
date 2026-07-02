import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface BooleanSVs {
    [key: string]: any;
    hidden: boolean;
    text: string;
}

export default React.memo(function Boolean(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<BooleanSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <span id={id}>{SVs.text}</span>;
});
