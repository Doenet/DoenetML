import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface MdashSVs {
    hidden: boolean;
}

export default React.memo(function Ndash(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<MdashSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&mdash;</>;
});
