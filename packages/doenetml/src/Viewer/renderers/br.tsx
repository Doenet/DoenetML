import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Br(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer(props);

    if (SVs.hidden) {
        return null;
    }

    return <br id={id} />;
});
