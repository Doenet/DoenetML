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
    "doenetML" | "externalVirtualKeyboardProvided"
>;
export type DoenetEditorProps = Omit<
    React.ComponentProps<typeof DoenetEditorOrig>,
    "doenetML" | "width" | "height" | "externalVirtualKeyboardProvided"
>;

const DARK_CANVAS = "#121212";
const LIGHT_CANVAS = "white";

/**
 * Return an inline style string and optional <style> block that set the body
 * background colour to match the requested dark-mode setting.
 *
 * - "dark"   → always dark
 * - "light"  → always light (white)
 * - "system" → follow the OS preference via a CSS media query
 */
function bodyBackgroundStyle(darkMode: string | undefined): {
    inlineStyle: string;
    styleBlock: string;
} {
    if (darkMode === "dark") {
        return {
            inlineStyle: `background-color:${DARK_CANVAS}`,
            styleBlock: "",
        };
    }
    if (darkMode === "system") {
        return {
            inlineStyle: `background-color:${LIGHT_CANVAS}`,
            styleBlock: `<style>@media (prefers-color-scheme: dark) { body { background-color: ${DARK_CANVAS}; } }</style>`,
        };
    }
    // "light" or unset
    return { inlineStyle: `background-color:${LIGHT_CANVAS}`, styleBlock: "" };
}

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

    const { inlineStyle: bgStyle, styleBlock: bgStyleBlock } =
        bodyBackgroundStyle((doenetViewerProps as any).darkMode);

    // XXX: rather than serving Comlink from the cdn, below, serve it directly
    // TODO: rather tha load the doenet logo from doenet.org, serve it directly
    return `
    <html style="overflow:hidden">
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
        ${bgStyleBlock}
    </head>
    <body style="margin:0; ${bgStyle}">
        <script type="module">
            const viewerId = "${id}";
            const doenetViewerProps = ${JSON.stringify(doenetViewerProps)};
            const doenetViewerPropsSpecified = ${JSON.stringify(doenetViewerPropsSpecified)};
            import * as ComlinkViewer from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

            // This source code has been compiled by vite and should be directly included.
            // It assumes that viewerId, doenetViewerProps, doenetViewerPropsSpecified, and ComlinkViewer are defined in the global scope.
            ${viewerIframeJsSource}
        </script>
        <div id="root" data-doenet-message-parent="true" data-doenet-send-resize-events="true">
            <div class="doenet-loading" style="text-align:center">
                <p><img src="https://www.doenet.org/Doenet_Logo_Frontpage.png"/></p>
                <p>Waiting on the page to load...</p>
            </div>
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

    const { inlineStyle: bgStyle, styleBlock: bgStyleBlock } =
        bodyBackgroundStyle((doenetEditorProps as any).darkMode);

    return `
    <html style="overflow:hidden">
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
        ${bgStyleBlock}
    </head>
    <body style="margin:0; ${bgStyle}">
        <script type="module">
            const editorId = "${id}";
            const doenetEditorProps = ${JSON.stringify(augmentedProps)};
            const doenetEditorPropsSpecified = ${JSON.stringify(doenetEditorPropsSpecified)};
            import * as ComlinkEditor from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
            
            // This source code has been compiled by vite and should be directly included.
            // It assumes that editorId, doenetEditorProps, doenetEditorPropsSpecified, and ComlinkEditor are defined in the global scope.
            ${editorIframeJsSource}
        </script>
        <div id="root" data-doenet-message-parent="true">
            <script type="text/doenetml">${doenetML}</script>
        </div>
    </body>
    </html>
    `;
}
