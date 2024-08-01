import React from "react";
import { DoenetViewer } from "@doenet/doenetml-iframe";

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

/**
 * Create HTML for a single page document that renders the given DoenetML.
 */
function createHtmlForDoenetML(doenetML: string) {
    return `
    <html>
    <head>
        <script type="module" src="/bundle/doenet-standalone.js"></script>
        <link rel="stylesheet" href="/bundle/style.css">
    </head>
    <body>
        <script type="module">
            document.addEventListener("DOMContentLoaded", () => {
                window.renderDoenetToContainer(document.getElementById("root"));
            });
        </script>
        <div id="root" data-doenet-add-virtual-keyboard="false">
            <script type="text/doenetml">
                ${doenetML}
            </script>
        </div>
    </body>
    </html>
    `;
}
