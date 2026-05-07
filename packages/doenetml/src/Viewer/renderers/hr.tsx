import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface HrSVs {
    hidden: boolean;
}

export default React.memo(function Hr(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<HrSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    return <hr id={id} />;
});
