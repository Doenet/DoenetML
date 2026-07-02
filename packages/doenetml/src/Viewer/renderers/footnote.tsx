import React, { useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import {
    TooltipProvider,
    TooltipAnchor,
    Tooltip,
    Button,
} from "@ariakit/react";

interface FootnoteSVs {
    [key: string]: any;
    hidden: boolean;
    footnoteTag: string;
    text: string;
}

export default React.memo(function Footnote(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<FootnoteSVs>(props, false);
    let [isVisible, setIsVisible] = useState(false);

    if (SVs.hidden) {
        return null;
    }

    const footnoteMessageStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "var(--revealButtonSurface)",
        color: "var(--canvasText)",
        display: "block",
    };
    let footnoteMessage: React.ReactNode = "";

    if (isVisible) {
        footnoteMessage = <span style={footnoteMessageStyle}>{SVs.text}</span>;
    }

    const buttonStyle = {
        backgroundColor: "var(--canvas)",
        border: "none",
        color: "var(--whiteBlankLink)",
        padding: "0",
    };

    return (
        <span id={id}>
            <sup>
                <TooltipProvider>
                    <TooltipAnchor
                        render={
                            <Button
                                style={buttonStyle}
                                onClick={() => {
                                    setIsVisible((was) => !was);
                                }}
                            />
                        }
                    >
                        [{SVs.footnoteTag}]
                    </TooltipAnchor>
                    <Tooltip
                        style={{
                            backgroundColor: "var(--canvas)",
                            color: "var(--canvasText)",
                            border: "1px solid var(--canvasText)",
                            padding: "0.2em 0.5em",
                        }}
                    >
                        {isVisible ? "Hide" : "Show"} footnote
                    </Tooltip>
                </TooltipProvider>
            </sup>
            <span aria-live="polite">{footnoteMessage}</span>
        </span>
    );
});
