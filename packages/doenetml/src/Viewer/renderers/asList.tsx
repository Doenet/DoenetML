import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function AsList(props: UseDoenetRendererProps) {
    let { name, id, SVs, children } = useDoenetRenderer(props);

    if (SVs.hidden) {
        return null;
    }

    if (children.length === 0) {
        return <React.Fragment key={id} />;
    }

    let withCommas = children
        .slice(1)
        .reduce((a, b) => [...a, ", ", b], [children[0]]);

    return <React.Fragment key={id}>{withCommas}</React.Fragment>;
});
