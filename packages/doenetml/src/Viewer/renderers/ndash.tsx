import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface NdashSVs {
    hidden: boolean;
}

export default React.memo(function Ndash(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<NdashSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    return <>&ndash;</>;
});
