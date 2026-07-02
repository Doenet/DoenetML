import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface EllipsisSVs {
    hidden: boolean;
}

export default React.memo(function Ellipsis(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<EllipsisSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    return <span id={id}>&hellip;</span>;
});
