import React from "react";
import type {
    DoenetViewer as DoenetViewerOrig,
    DoenetEditor as DoenetEditorOrig,
} from "@doenet/doenetml";
// @ts-ignore
import viewerIframeJsSource from "../dist/iframe-viewer/iframe-viewer-index.iife.js?raw";
// @ts-ignore
import editorIframeJsSource from "../dist/iframe-editor/iframe-editor-index.iife.js?raw";
import { watchForResize } from "./resize-watcher";

export { mathjaxConfig } from "@doenet/utils";

type DoenetViewerProps = Omit<
    React.ComponentProps<typeof DoenetViewerOrig>,
    "doenetML" | "scrollableContainer"
>;
type DoenetEditorProps = Omit<
    React.ComponentProps<typeof DoenetEditorOrig>,
    "doenetML" | "width" | "height"
>;

/**
 * A message that is sent from an iframe to the parent window.
 */
type IframeMessage = {
    origin: string;
    data: Record<string, unknown>;
    subject?: string;
};

export type DoenetViewerIframeProps = DoenetViewerProps & {
    doenetML: string;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     */
    standaloneUrl: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     */
    cssUrl: string;
    scrollableContainer?: any;
};

export type DoenetEditorIframeProps = DoenetEditorProps & {
    doenetML: string;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     */
    standaloneUrl: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     */
    cssUrl: string;
    width?: string;
    height?: string;
};

/**
 * Render Doenet viewer constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `DoenetViewerProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetViewer` to communicate
 * with the underlying DoenetML component.
 */
export function DoenetViewer({
    doenetML,
    standaloneUrl,
    cssUrl,
    scrollableContainer: _scrollableContainer,
    ...doenetViewerProps
}: DoenetViewerIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = React.useState("0px");

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            console.log("got message", event.data);

            // forward response from SPLICE getState to iframe
            if (event.data.subject === "SPLICE.getState.response") {
                ref.current?.contentWindow?.postMessage(event.data);
                return;
            }
            if (
                event.origin !== window.location.origin ||
                event.data?.origin !== id
            ) {
                return;
            }

            const data = event.data.data;

            switch (data.callback) {
                case "updateCreditAchievedCallback": {
                    return doenetViewerProps.updateCreditAchievedCallback?.(
                        data.args,
                    );
                }
                case "updateActivityStatusCallback": {
                    return doenetViewerProps.updateActivityStatusCallback?.(
                        data.args,
                    );
                }
                case "updateAttemptNumber": {
                    return doenetViewerProps.updateAttemptNumber?.(data.args);
                }
                case "pageChangedCallback": {
                    return doenetViewerProps.pageChangedCallback?.(data.args);
                }
                case "cidChangedCallback": {
                    return doenetViewerProps.cidChangedCallback?.(data.args);
                }
                case "checkIfCidChanged": {
                    return doenetViewerProps.checkIfCidChanged?.(data.args);
                }
                case "setActivityAsCompleted": {
                    return doenetViewerProps.setActivityAsCompleted?.(
                        data.args,
                    );
                }
                case "setIsInErrorState": {
                    return doenetViewerProps.setIsInErrorState?.(data.args);
                }
                case "generatedVariantCallback": {
                    return doenetViewerProps.generatedVariantCallback?.(
                        data.args,
                    );
                }
                case "setErrorsAndWarningsCallback": {
                    return doenetViewerProps.setErrorsAndWarningsCallback?.(
                        data.args,
                    );
                }
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
            srcDoc={createHtmlForDoenetViewer(
                id,
                doenetML,
                doenetViewerProps,
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
function createHtmlForDoenetViewer(
    id: string,
    doenetML: string,
    doenetViewerProps: DoenetViewerProps,
    standaloneUrl: string,
    cssUrl: string,
) {
    return `
    <html style="overflow:hidden">
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body>
        <script type="module">
            const viewerId = "${id}";
            const doenetViewerProps = ${JSON.stringify(doenetViewerProps)};
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that id and doenetViewerProps are defined in the global scope.
            ${viewerIframeJsSource}
        </script>
        <div id="root">
            <script type="text/doenetml">${doenetML}</script>
        </div>
    </body>
    </html>
    `;
}

/**
 * Render Doenet Editor constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `DoenetEditorProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetEditor` to communicate
 * with the underlying DoenetML component.
 */
export function DoenetEditor({
    doenetML,
    standaloneUrl,
    cssUrl,
    width = "100%",
    height = "500px",
    ...doenetEditorProps
}: DoenetEditorIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (
                event.origin !== window.location.origin ||
                event.data?.origin !== id
            ) {
                return;
            }

            const data = event.data.data;

            switch (data.callback) {
                case "doenetmlChangeCallback": {
                    return doenetEditorProps.doenetmlChangeCallback?.(
                        data.args,
                    );
                }
                case "immediateDoenetmlChangeCallback": {
                    return doenetEditorProps.immediateDoenetmlChangeCallback?.(
                        data.args,
                    );
                }
            }
        };
        if (ref.current) {
            window.addEventListener("message", listener);
        }

        return () => {
            window.removeEventListener("message", listener);
        };
    }, []);

    return (
        <iframe
            ref={ref}
            srcDoc={createHtmlForDoenetEditor(
                id,
                doenetML,
                width,
                doenetEditorProps,
                standaloneUrl,
                cssUrl,
            )}
            style={{
                width,
                boxSizing: "content-box",
                overflow: "hidden",
                border: "none",
                height,
            }}
        />
    );
}

/**
 * Create HTML for a single page document that renders the given DoenetML editor.
 */
function createHtmlForDoenetEditor(
    id: string,
    doenetML: string,
    width: string,
    doenetEditorProps: DoenetEditorProps,
    standaloneUrl: string,
    cssUrl: string,
) {
    const augmentedProps = { width, height: "100vh", ...doenetEditorProps };

    return `
    <html style="overflow:hidden">
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body>
        <script type="module">
            const editorId = "${id}";
            const doenetEditorProps = ${JSON.stringify(augmentedProps)};
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that id and doenetEditorProps are defined in the global scope.
            ${editorIframeJsSource}
        </script>
        <div id="root">
            <script type="text/doenetml">${doenetML}</script>
        </div>
    </body>
    </html>
    `;
}
