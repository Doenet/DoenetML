import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Hr(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer(props);

    if (SVs.hidden) {
        return null;
    }

    return <hr id={id} />;
});
