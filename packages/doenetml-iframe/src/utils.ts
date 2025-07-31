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
    const haveViewerCallbacks: string[] = [];
    const callbackNames = [
        "reportScoreAndStateCallback",
        "setIsInErrorState",
        "generatedVariantCallback",
        "documentStructureCallback",
        "initializedCallback",
        "setErrorsAndWarningsCallback",
    ];
    for (const callback of callbackNames) {
        if (callback in doenetViewerProps) {
            haveViewerCallbacks.push(callback);
        }
    }

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
            const haveViewerCallbacks = ${JSON.stringify(haveViewerCallbacks)};
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that viewerId, doenetViewerProps, and haveViewerCallbacks are defined in the global scope.
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

    const haveEditorCallbacks: string[] = [];
    const callbackNames = [
        "doenetmlChangeCallback",
        "immediateDoenetmlChangeCallback",
        "documentStructureCallback",
    ];
    for (const callback of callbackNames) {
        if (callback in doenetEditorProps) {
            haveEditorCallbacks.push(callback);
        }
    }

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
            const haveEditorCallbacks = ${JSON.stringify(haveEditorCallbacks)};
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that editorId, doenetEditorProps, and have EditorCallbacks are defined in the global scope.
            ${editorIframeJsSource}
        </script>
        <div id="root">
            <script type="text/doenetml">${doenetML}</script>
        </div>
    </body>
    </html>
    `;
}
