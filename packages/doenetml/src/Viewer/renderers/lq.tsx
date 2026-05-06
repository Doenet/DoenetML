import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface LqSVs {
    hidden: boolean;
}

export default React.memo(function Lq(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<LqSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&ldquo;</>;
});
