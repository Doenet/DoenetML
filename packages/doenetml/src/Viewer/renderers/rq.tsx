import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface RqSVs {
    hidden: boolean;
}

export default React.memo(function Rq(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<RqSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&rdquo;</>;
});
