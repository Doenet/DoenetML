import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface TagSVs {
    [key: string]: any;
    hidden: boolean;
    closing: boolean;
    selfClosed: boolean;
}

export default React.memo(function Tag(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<TagSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    let open = "<";
    let close = ">";

    if (SVs.selfClosed) {
        close = "/>";
    } else if (SVs.closing) {
        open = "</";
    }

    return (
        <code id={id} className="doenet-tag">
            {open}
            {children}
            {close}
        </code>
    );
});
