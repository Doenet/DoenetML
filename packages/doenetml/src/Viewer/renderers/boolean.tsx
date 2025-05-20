import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Boolean(props: UseDoenetRendererProps) {
    let { name, id, SVs } = useDoenetRenderer(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <span id={id}>{SVs.text}</span>;
});
