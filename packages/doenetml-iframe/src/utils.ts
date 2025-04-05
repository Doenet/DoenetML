import type {
    DoenetViewer as DoenetViewerOrig,
    DoenetEditor as DoenetEditorOrig,
} from "@doenet/doenetml";
// @ts-ignore
import viewerIframeJsSource from "../dist/iframe-viewer/iframe-viewer-index.iife.js?raw";
// @ts-ignore
import editorIframeJsSource from "../dist/iframe-editor/iframe-editor-index.iife.js?raw";
import { parseAndCompile } from "@doenet/parser";

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
    <body>
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
    <body>
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

/**
 * If doenetML consists of a single `<document>` component with an xmlns prop,
 * attempt to extract the DoenetML version from that prop.
 * Returns the version if found, else returns null.
 */
export function detectVersionFromDoenetML(doenetML: string) {
    let result = parseAndCompile(doenetML);

    let serializedComponents = result.components;

    let firstNonBlankComponent;
    let firstNonBlankInd, lastNonBlankInd;

    // find any beginning or ending blank strings;
    for (let ind = 0; ind < serializedComponents.length; ind++) {
        let comp = serializedComponents[ind];
        if (typeof comp !== "string" || /\S/.test(comp)) {
            if (firstNonBlankInd === undefined) {
                firstNonBlankInd = ind;
                firstNonBlankComponent = comp;
            }
            lastNonBlankInd = ind;
            break;
        }
    }

    // Check if we have a single `<document>` component that has props.
    if (
        lastNonBlankInd === firstNonBlankInd &&
        typeof firstNonBlankComponent !== "string" &&
        firstNonBlankComponent?.componentType === "document" &&
        "props" in firstNonBlankComponent
    ) {
        for (let prop in firstNonBlankComponent.props) {
            if (prop.toLowerCase() === "xmlns") {
                // We found the xmlns attribute. Check if it is of the right form.
                let xmlns = firstNonBlankComponent.props[prop];

                if (
                    typeof xmlns === "string" &&
                    xmlns.slice(0, 34) === "https://doenet.org/spec/doenetml/v"
                ) {
                    return {
                        version: xmlns.slice(34),
                        doenetMLrange: firstNonBlankComponent.doenetMLrange,
                    };
                } else {
                    return {};
                }
            }
        }
    }

    return {};
}
