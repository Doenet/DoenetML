import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface AsListSVs {
    hidden: boolean;
}

export default React.memo(function AsList(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<AsListSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    if (children.length === 0) {
        return <React.Fragment key={id} />;
    }

    let withCommas = children
        .slice(1)
        .reduce(
            (a: React.ReactNode[], b: React.ReactNode) => [...a, ", ", b],
            [children[0]],
        );

    return <React.Fragment key={id}>{withCommas}</React.Fragment>;
});
