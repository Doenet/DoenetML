import React, { useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Footnote(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer(props, false);
    let [isVisible, setIsVisible] = useState(false);

    if (SVs.hidden) {
        return null;
    }

    const footnoteMessageStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#e2e2e2",
        display: "block",
    };
    let footnoteMessage: React.ReactNode = "";

    if (isVisible) {
        footnoteMessage = <span style={footnoteMessageStyle}>{SVs.text}</span>;
    }

    const buttonStyle = {
        backgroundColor: "white",
        border: "none",
    };

    const footnoteStyle = {
        textDecoration: "none",
        color: "#1A5A99",
    };

    return (
        <span id={id}>
            <sup>
                <span
                    style={buttonStyle}
                    onClick={() => setIsVisible((was) => !was)}
                >
                    <a href="#" title={SVs.text} style={footnoteStyle}>
                        [{SVs.footnoteTag}]
                    </a>
                </span>
            </sup>
            {footnoteMessage}
        </span>
    );
});
