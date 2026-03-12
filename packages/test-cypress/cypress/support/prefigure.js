export const PREFIGURE_BUILD_DEBOUNCE_MS = 1000;
export const REQUEST_SETTLE_BUFFER_MS = 300;
const PREFIGURE_BUILD_URL_PATTERN = "**/build";

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
                xml: "<annotations></annotations>",
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

export function postDebounceTestDoenetML(cesc) {
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

    cy.get(cesc("#ready")).should("have.text", "ready");
}
