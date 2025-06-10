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
        display: `static`,
    };
    let footnoteMessage: React.ReactNode = "";

    if (isVisible) {
        footnoteMessage = <div style={footnoteMessageStyle}>{SVs.text}</div>;
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
                <button
                    style={buttonStyle}
                    onClick={() => setIsVisible((was) => !was)}
                >
                    <a href="#" title={SVs.text} style={footnoteStyle}>
                        [{SVs.footnoteTag}]
                    </a>
                </button>
            </sup>
            {footnoteMessage}
        </span>
    );
});
