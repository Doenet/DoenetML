import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface ErrorSVs {
    hidden: boolean;
    showMessage: boolean;
    rangeMessage?: string;
    message: string;
}

export default React.memo(function Error(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<ErrorSVs>(props);

    let displayedMessage = null;

    if (SVs.showMessage) {
        let errorStyle: React.CSSProperties = {
            backgroundColor: "var(--lightRed)",
            color: "var(--canvasText)",
            textAlign: "center",
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "var(--mainRed)",
        };
        let rangeMessage = null;
        if (SVs.rangeMessage) {
            rangeMessage = (
                <>
                    <br />
                    <em>{SVs.rangeMessage}</em>
                </>
            );
        }
        displayedMessage = (
            <div style={errorStyle}>
                <b>Error</b>: {SVs.message}
                {rangeMessage}
            </div>
        );
    }

    return (
        <div id={id}>
            {displayedMessage}
            {children}
        </div>
    );
});
