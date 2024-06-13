import React from "react";
import type { DoenetML } from "@doenet/doenetml";
// @ts-ignore
import iframeJsSource from "../dist/iframe/iframe-index.iife.js?raw";
import { watchForResize } from "./resize-watcher";

type DoenetMLProps = React.ComponentProps<typeof DoenetML>;

/**
 * A message that is sent from an iframe to the parent window.
 */
type IframeMessage = {
    origin: string;
    data: Record<string, unknown>;
};

export type DoenetMLIframeProps = {
    doenetML: string;
    doenetMLProps: DoenetMLProps;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     */
    standaloneUrl: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     */
    cssUrl: string;
    /**
     * Callback that is called when a message is received from the DoenetML component embedded in the iframe.
     */
    onMessage?: (message: any) => void;
};

/**
 * Render DoenetML constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `doenetMLProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetMLIframe` to communicate
 * with the underlying DoenetML component.
 */
export function DoenetMLIframe({
    doenetML,
    doenetMLProps,
    standaloneUrl,
    cssUrl,
    onMessage,
}: DoenetMLIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = React.useState("0px");

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (
                event.origin !== window.location.origin ||
                event.data?.origin !== id
            ) {
                return;
            }
            if (onMessage) {
                onMessage(event.data.data);
            }
        };
        if (ref.current) {
            window.addEventListener("message", listener);
        }
        const clearResize = watchForResize(ref, () => height, setHeight);

        return () => {
            window.removeEventListener("message", listener);
            clearResize();
        };
    }, []);

    return (
        <iframe
            ref={ref}
            srcDoc={createHtmlForDoenetML(
                id,
                doenetML,
                doenetMLProps,
                standaloneUrl,
                cssUrl,
            )}
            style={{
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
                border: "none",
                minHeight: 200,
            }}
            height={height}
        />
    );
}

/**
 * Create HTML for a single page document that renders the given DoenetML.
 */
function createHtmlForDoenetML(
    id: string,
    doenetML: string,
    doenetMLProps: DoenetMLProps,
    standaloneUrl: string,
    cssUrl: string,
) {
    return `
    <html>
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body>
        <script type="module">
            const id = "${id}";
            const doenetMLProps = ${JSON.stringify(doenetMLProps)};
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that id and doenetMLProps are defined in the global scope.
            ${iframeJsSource}
        </script>
        <div id="root">
            <script type="text/doenetml">
                ${doenetML}
            </script>
        </div>
    </body>
    </html>
    `;
}
