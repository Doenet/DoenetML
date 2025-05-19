import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Error(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer(props);

    let displayedMessage = null;

    if (SVs.showMessage) {
        let errorStyle: React.CSSProperties = {
            backgroundColor: "#ff9999",
            textAlign: "center",
            borderWidth: 3,
            borderStyle: "solid",
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
