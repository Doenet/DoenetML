import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface BrSVs {
    hidden: boolean;
}

export default React.memo(function Br(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<BrSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    return <br id={id} />;
});
