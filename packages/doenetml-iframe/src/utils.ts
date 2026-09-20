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

type IframeDarkMode =
    DoenetViewerProps["darkMode"] | DoenetEditorProps["darkMode"];
type BodyBackgroundMode = "dark" | "light" | "system";

const DARK_CANVAS = "#121212";
const LIGHT_CANVAS = "white";
const BODY_BACKGROUND_ATTRIBUTE = "data-doenet-body-background";
const BODY_BACKGROUND_STYLE_BLOCK = `<style>
body[${BODY_BACKGROUND_ATTRIBUTE}="light"],
body[${BODY_BACKGROUND_ATTRIBUTE}="system"] {
    background-color: ${LIGHT_CANVAS};
}
body[${BODY_BACKGROUND_ATTRIBUTE}="dark"] {
    background-color: ${DARK_CANVAS};
}
@media (prefers-color-scheme: dark) {
    body[${BODY_BACKGROUND_ATTRIBUTE}="system"] {
        background-color: ${DARK_CANVAS};
    }
}
</style>`;

/**
 * Normalize the public dark-mode prop to the subset used for the iframe body.
 * Omitted values follow the public component default of `"system"`.
 */
function bodyBackgroundMode(darkMode: IframeDarkMode): BodyBackgroundMode {
    if (darkMode === "dark") {
        return "dark";
    }
    if (darkMode === undefined || darkMode === "system") {
        return "system";
    }
    return "light";
}

/**
 * Update the iframe body's theme attribute without rebuilding the document.
 */
export function setIframeBodyBackground(
    body: HTMLElement,
    darkMode: IframeDarkMode,
) {
    body.setAttribute(BODY_BACKGROUND_ATTRIBUTE, bodyBackgroundMode(darkMode));
}

function createIframeHead(standaloneUrl: string, cssUrl: string) {
    return `
    <head>
        <script type="module" src="${standaloneUrl}"></script>
        <link rel="stylesheet" href="${cssUrl}">
        ${BODY_BACKGROUND_STYLE_BLOCK}
    </head>`;
}

function createIframeBodyOpenTag(darkMode: IframeDarkMode) {
    return `<body style="margin:0" ${BODY_BACKGROUND_ATTRIBUTE}="${bodyBackgroundMode(darkMode)}">`;
}

/**
 * Build the srcdoc's inline boot script: the `const` declarations the compiled
 * entry point reads out of the surrounding module scope, followed by that entry
 * point (`iframe-{viewer,editor}-index.iife.js`) inlined verbatim.
 *
 * The entry point carries its own compiled-in copy of Comlink, so nothing this
 * script needs in order to reach `iframeReady` comes off the network. Keep it
 * that way: an `import` declaration is resolved before any of a module's body
 * runs, so a fetch that stalls leaves the whole boot script unexecuted, the
 * handshake unsent, and the iframe parked on its loading placeholder with no
 * timeout and no error. `test/cypress/component/srcdocSelfContained.cy.ts`
 * guards the invariant.
 */
function createBootScript(
    boundConsts: Record<string, unknown>,
    compiledEntryPoint: string,
) {
    const declarations = Object.entries(boundConsts)
        .map(([name, value]) => `const ${name} = ${JSON.stringify(value)};`)
        .join("\n            ");
    return `<script type="module">
            ${declarations}
            ${compiledEntryPoint}
        </script>`;
}

/**
 * The two ways a viewer's boot can conclude, both of which must free that
 * viewer's boot slot: the document initialized, or the core could not be
 * started at all (#1709). Without the latter a failed boot holds its slot
 * until `BOOT_SLOT_WATCHDOG_MS` (90 s), starving the queue on exactly the
 * pages where boots are already failing.
 */
export const BOOT_CONCLUDING_CALLBACKS = [
    "initializedCallback",
    "coreStartFailedCallback",
] as const;

/**
 * Create HTML for a single page document that renders the given DoenetML.
 */
export function createHtmlForDoenetViewer(
    id: string,
    doenetML: string,
    doenetViewerProps: DoenetViewerProps,
    standaloneUrl: string,
    cssUrl: string,
    useSharedCoreWorker = false,
    windowed = false,
) {
    // Since function props disappear when stringifying
    // and we'll have access to them only via proxying with ComLink,
    // whether or not a function prop was specified is masked.
    // Since for some callbacks, we have different behavior whether or not it was specified,
    // we pass an extra variable of the props that were specified.
    const doenetViewerPropsSpecified: string[] = Object.keys(doenetViewerProps);
    // The wrapper may supply its own composed boot-concluding callbacks (the
    // windowed-mounting boot-slot release, on success and on failure alike)
    // even when the host specified neither; list them so the in-iframe entry
    // adopts the proxies when sent.
    for (const key of BOOT_CONCLUDING_CALLBACKS) {
        if (!doenetViewerPropsSpecified.includes(key)) {
            doenetViewerPropsSpecified.push(key);
        }
    }

    // TODO: rather than load the Doenet logo from doenet.org, serve it directly
    return `
    <html style="overflow:hidden">
    ${createIframeHead(standaloneUrl, cssUrl)}
    ${createIframeBodyOpenTag(doenetViewerProps.darkMode)}
        ${createBootScript(
            {
                viewerId: id,
                doenetViewerProps,
                doenetViewerPropsSpecified,
                doenetSharedCoreWorker: !!useSharedCoreWorker,
                doenetWindowedViewer: !!windowed,
            },
            viewerIframeJsSource,
        )}
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
    // and we'll have access to them only via proxying with ComLink,
    // whether or not a function prop was specified is masked.
    // Since for some callbacks, we have different behavior whether or not it was specified,
    // we pass an extra variable of the props that were specified.
    const doenetEditorPropsSpecified: string[] = Object.keys(augmentedProps);

    return `
    <html style="overflow:hidden">
    ${createIframeHead(standaloneUrl, cssUrl)}
    ${createIframeBodyOpenTag(doenetEditorProps.darkMode)}
        ${createBootScript(
            {
                editorId: id,
                doenetEditorProps: augmentedProps,
                doenetEditorPropsSpecified,
            },
            editorIframeJsSource,
        )}
        <div id="root" data-doenet-message-parent="true">
            <script type="text/doenetml">${doenetML}</script>
        </div>
    </body>
    </html>
    `;
}
