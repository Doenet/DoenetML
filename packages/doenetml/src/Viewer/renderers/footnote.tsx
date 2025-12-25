import React, { useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { TooltipProvider, TooltipAnchor, Tooltip } from "@ariakit/react";

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

    const footnoteStyle = {
        textDecoration: "none",
        color: "#1A5A99",
        cursor: "pointer",
    };

    return (
        <span id={id}>
            <TooltipProvider>
                <TooltipAnchor style={{ display: "inline" }}>
                    <sup>
                        <span
                            style={footnoteStyle}
                            onClick={(e) => {
                                setIsVisible((was) => !was);
                            }}
                        >
                            [{SVs.footnoteTag}]
                        </span>
                    </sup>
                </TooltipAnchor>
                <Tooltip
                    style={{
                        backgroundColor: "var(--mainGray)",
                        padding: "0.2em 0.5em",
                    }}
                >
                    {isVisible ? "Hide" : "Show"} footnote
                </Tooltip>
            </TooltipProvider>
            <span aria-live="polite">{footnoteMessage}</span>
        </span>
    );
});
