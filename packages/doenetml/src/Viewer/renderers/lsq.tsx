import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface LsqSVs {
    hidden: boolean;
}

export default React.memo(function Lsq(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<LsqSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&lsquo;</>;
});
