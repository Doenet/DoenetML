import type {
    DoenetViewer as DoenetViewerOrig,
    DoenetEditor as DoenetEditorOrig,
} from "@doenet/doenetml";
// @ts-ignore
import viewerIframeJsSource from "../dist/iframe-viewer/iframe-viewer-index.iife.js?raw";
// @ts-ignore
import editorIframeJsSource from "../dist/iframe-editor/iframe-editor-index.iife.js?raw";

export type DoenetViewerProps = Omit<
    React.ComponentProps<typeof DoenetViewerOrig>,
    "doenetML" | "scrollableContainer" | "externalVirtualKeyboardProvided"
>;
export type DoenetEditorProps = Omit<
    React.ComponentProps<typeof DoenetEditorOrig>,
    "doenetML" | "width" | "height" | "externalVirtualKeyboardProvided"
>;

/**
 * Create HTML for a single page document that renders the given DoenetML.
 */
export function createHtmlForDoenetViewer(
    id: string,
    doenetML: string,
    doenetViewerProps: DoenetViewerProps,
    standaloneUrl: string,
    cssUrl: string,
) {
    // Since function props disappear when stringifying
    // and we'll have access tot them only via proxying with ComLink,
    // whether or not a function prop was specified is masked.
    // Since for some callbacks, we have different behavior whether or not it was specified,
    // we pass an extra variable of the props that were specified.
    const doenetViewerPropsSpecified: string[] = Object.keys(doenetViewerProps);

    return `
    <html style="overflow:hidden">
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body style="margin:0; background-color:white">
        <script type="module">
            const viewerId = "${id}";
            const doenetViewerProps = ${JSON.stringify(doenetViewerProps)};
            const doenetViewerPropsSpecified = ${JSON.stringify(doenetViewerPropsSpecified)};
            import * as ComlinkViewer from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

            // This source code has been compiled by vite and should be directly included.
            // It assumes that viewerId, doenetViewerProps, doenetViewerPropsSpecified, and ComlinkViewer are defined in the global scope.
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
 * Create HTML for a single page document that renders the given DoenetML editor.
 */
export function createHtmlForDoenetEditor(
    id: string,
    doenetML: string,
    width: string,
    doenetEditorProps: DoenetEditorProps,
    standaloneUrl: string,
    cssUrl: string,
) {
    const augmentedProps = { width, height: "100vh", ...doenetEditorProps };

    // Since function props disappear when stringifying
    // and we'll have access tot them only via proxying with ComLink,
    // whether or not a function prop was specified is masked.
    // Since for some callbacks, we have different behavior whether or not it was specified,
    // we pass an extra variable of the props that were specified.
    const doenetEditorPropsSpecified: string[] = Object.keys(augmentedProps);

    return `
    <html style="overflow:hidden">
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body style="margin:0; background-color:white">
        <script type="module">
            const editorId = "${id}";
            const doenetEditorProps = ${JSON.stringify(augmentedProps)};
            const doenetEditorPropsSpecified = ${JSON.stringify(doenetEditorPropsSpecified)};
            import * as ComlinkEditor from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that editorId, doenetEditorProps, doenetEditorPropsSpecified, and ComlinkEditor are defined in the global scope.
            ${editorIframeJsSource}
        </script>
        <div id="root">
            <script type="text/doenetml">${doenetML}</script>
        </div>
    </body>
    </html>
    `;
}
