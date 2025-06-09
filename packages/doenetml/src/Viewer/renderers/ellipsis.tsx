import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Ellipsis(props: UseDoenetRendererProps) {
    let { name, id, SVs } = useDoenetRenderer(props);

    if (SVs.hidden) {
        return null;
    }

    return <span id={id}>&hellip;</span>;
});
