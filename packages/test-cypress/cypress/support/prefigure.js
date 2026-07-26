export const PREFIGURE_BUILD_DEBOUNCE_MS = 1000;
export const REQUEST_SETTLE_BUFFER_MS = 300;
export const PREFIGURE_BUILD_URL_PATTERN = "**/build";

export function installPrefigureBuildIntercept(responseForRequest) {
    const tracker = { count: 0 };

    cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, (req) => {
        tracker.count += 1;

        const customResponse = responseForRequest?.(tracker.count);

        req.reply({
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: {
                svg:
                    customResponse?.svg ??
                    `<svg xmlns=\"http://www.w3.org/2000/svg\"><text>${tracker.count}</text></svg>`,
                annotationsXml:
                    customResponse?.annotationsXml ??
                    "<annotations></annotations>",
            },
            delay: customResponse?.delay ?? 0,
        });
    });

    return tracker;
}

export function expectBuildRequestCount(tracker, count) {
    cy.then(() => {
        expect(tracker.count).eq(count);
    });
}

export function waitPastDebounceWindow() {
    cy.wait(PREFIGURE_BUILD_DEBOUNCE_MS + REQUEST_SETTLE_BUFFER_MS);
}

export function postDebounceTestDoenetML() {
    cy.window().then(async (win) => {
        win.postMessage(
            {
                doenetML: `
<text name="ready">ready</text>
<graph name="g">
  <point name="P">(0,0)</point>
</graph>
<graph name="prefig" renderer="prefigure" extend="$g" />
`,
            },
            "*",
        );
    });

    cy.get("#ready").should("have.text", "ready");
}

/**
 * Serve a fake `@doenet/prefigure` ES module so the page never downloads the
 * real pyodide runtime. Returns the path the stub is served from; pass it to
 * {@link visitWithMockPrefigureModule}, which points the renderer at it.
 */
export function installMockPrefigureModule({
    modulePath = "/mock-prefigure-module.js",
    initDelayMs = 0,
    compileDelayMs = 0,
    renderLabel = "local-render",
} = {}) {
    const serializedRenderLabel = JSON.stringify(renderLabel);

    const moduleBody = `
let isReady = false;
const renderLabelValue = ${serializedRenderLabel};

export async function initPrefigure() {
  await new Promise((resolve) => setTimeout(resolve, ${initDelayMs}));
  isReady = true;
}

export async function compilePrefigure(_diagramXML, _options) {
  if (!isReady) {
    throw new Error("compilePrefigure called before initPrefigure");
  }

    await new Promise((resolve) => setTimeout(resolve, ${compileDelayMs}));

  return {
        svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>' + renderLabelValue + '</text></svg>',
        annotationsXml: '<diagram><annotation>' + renderLabelValue + '-cml</annotation></diagram>',
  };
}
`;

    cy.intercept("GET", `**${modulePath}*`, {
        statusCode: 200,
        headers: { "content-type": "application/javascript" },
        body: moduleBody,
    });

    return modulePath;
}

/**
 * Serve an empty diagcess bundle instead of letting the page pull the real one
 * from the CDN. The stub still loads, so the renderer's one-time script-load
 * effect settles as usual, but `window.diagcess` is never defined and the
 * diagcess re-init is skipped.
 */
function installDiagcessScriptStub() {
    cy.intercept("GET", "**/diagcess*.js*", {
        statusCode: 200,
        headers: { "content-type": "application/javascript" },
        body: "",
    });
}

/**
 * Visit the harness with every prefigure CDN dependency stubbed out: the
 * renderer imports `modulePath` (see {@link installMockPrefigureModule})
 * instead of the published pyodide build, gets no pyodide index URL, and gets
 * an empty diagcess bundle.
 *
 * Because `window.diagcess` is never defined, the diagcess re-init is skipped.
 * Tests that exercise annotations should instead define `window.diagcess`
 * themselves in an `onBeforeLoad` hook, and tests that need the real diagcess
 * script should visit the harness directly.
 */
export function visitWithMockPrefigureModule(modulePath) {
    installDiagcessScriptStub();

    cy.visit("/", {
        onBeforeLoad(win) {
            win.__DOENET_PREFIGURE_MODULE_URL__ = new URL(
                modulePath,
                win.location.href,
            ).toString();
            win.__DOENET_PREFIGURE_INDEX_URL__ = "";
        },
    });
}
