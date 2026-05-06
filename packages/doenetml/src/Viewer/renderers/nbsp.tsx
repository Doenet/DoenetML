import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface NbspSVs {
    hidden: boolean;
}

export default React.memo(function Nbsp(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<NbspSVs>(props, false);

    if (SVs.hidden) {
        return null;
    }

    return <>&nbsp;</>;
});
