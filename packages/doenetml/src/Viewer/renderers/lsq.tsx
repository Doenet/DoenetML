import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Lsq(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&lsquo;</>;
});
