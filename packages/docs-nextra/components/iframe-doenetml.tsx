import React from "react";
import { DoenetViewer } from "@doenet/doenetml-iframe";
import "@doenet/virtual-keyboard/style.css";

/**
 * Render DoenetML in an iframe so that its styling/state is completely isolated from the page.
 */
export function IframeDoenetML({ children }: React.PropsWithChildren<{}>) {
    if (typeof children !== "string") {
        console.error(
            "Error with DoenetML component. Expected a string child containing DoenetML source code, but found",
            children,
        );
        return (
            <div className="docs-error">
                <em>Error with DoenetML component.</em> Expected a string child
                containing DoenetML source code, but found {typeof children}.
                Check the console for details
            </div>
        );
    }
    return <DoenetViewer doenetML={children} />;
}
