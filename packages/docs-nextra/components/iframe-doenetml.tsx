import React from "react";

/**
 * Render DoenetML in an iframe so that its styling/state is completely isolated from the page.
 */
export function IframeDoenetML({ children }: React.PropsWithChildren<{}>) {
    const ref = React.useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = React.useState("0px");

    const onLoad = () => {
        const iframe =
            ref.current?.contentWindow?.document?.body?.parentElement;
        if (!iframe) {
            return;
        }
        setHeight(iframe.scrollHeight + "px");

        const updateHeight = () => {
            const iframe =
                ref.current?.contentWindow?.document?.body?.parentElement;
            if (!iframe) {
                return;
            }
            const newHeight = iframe.scrollHeight + "px";
            if (newHeight !== height) {
                setHeight(newHeight);
            }
        };

        const observer = new MutationObserver(updateHeight);
        observer.observe(iframe, {
            attributes: true,
            childList: true,
            subtree: true,
        });

        // The mutation observer might not catch all resize changes, so we poll as well.
        const interval = setInterval(updateHeight, 500);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    };
    React.useEffect(() => {
        return onLoad();
    }, []);

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
    return (
        <iframe
            ref={ref}
            srcDoc={createHtmlForDoenetML(children)}
            style={{
                width: "100%",
                boxSizing: "content-box",
                overflow: "hidden",
            }}
            height={height}
        />
    );
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
