import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface RsqSVs {
    hidden: boolean;
}

export default React.memo(function Rsq(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<RsqSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&rsquo;</>;
});
