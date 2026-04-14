import { cesc } from "@doenet/utils";
import {
    installMockPrefigureModule,
    postDebounceTestDoenetML,
    visitWithMockPrefigureModule,
    PREFIGURE_BUILD_URL_PATTERN,
} from "../../support/prefigure";

describe(
    "PreFigure backend winner behavior @group4",
    { tags: ["@group4"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
        });

        it("uses local WASM when it becomes ready before a slow service response", () => {
            const modulePath = installMockPrefigureModule({
                modulePath: "/mock-prefigure-fast-local.js",
                initDelayMs: 40,
                renderLabel: "local-winner",
            });

            cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, {
                statusCode: 200,
                headers: { "content-type": "application/json" },
                delay: 800,
                body: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>service-slow</text></svg>',
                    annotationsXml:
                        "<diagram><annotation>service-slow</annotation></diagram>",
                },
            });

            visitWithMockPrefigureModule(modulePath);
            postDebounceTestDoenetML(cesc);

            cy.get(cesc("#prefig"), { timeout: 1400 }).should(
                "contain.text",
                "local-winner",
            );
            cy.get(cesc("#prefig")).should("not.contain.text", "service-slow");

            // Even after the delayed service response eventually settles, the
            // local winner should remain rendered.
            cy.wait(900);
            cy.get(cesc("#prefig")).should("contain.text", "local-winner");
            cy.get(cesc("#prefig")).should("not.contain.text", "service-slow");
        });

        it("recovers from service failure once local WASM warmup completes", () => {
            const modulePath = installMockPrefigureModule({
                modulePath: "/mock-prefigure-after-failure.js",
                initDelayMs: 120,
                renderLabel: "local-after-service-error",
            });

            cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, {
                statusCode: 503,
                headers: { "content-type": "application/json" },
                body: { message: "service unavailable" },
            });

            visitWithMockPrefigureModule(modulePath);
            postDebounceTestDoenetML(cesc);

            cy.get(cesc("#prefig"), { timeout: 2000 }).should(
                "contain.text",
                "local-after-service-error",
            );
            cy.get(cesc("#prefig")).should("not.contain.text", "Error:");
        });

        it("suppresses stale local compile result when request is aborted after warmup wins", () => {
            const modulePath = installMockPrefigureModule({
                modulePath: "/mock-prefigure-abort-during-compile.js",
                initDelayMs: 40,
                compileDelayMs: 450,
                renderLabel: "local-replacement-render-after-abort",
            });

            cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, {
                statusCode: 200,
                headers: { "content-type": "application/json" },
                delay: 900,
                body: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>service-slow</text></svg>',
                    annotationsXml:
                        "<diagram><annotation>service-slow</annotation></diagram>",
                },
            });

            visitWithMockPrefigureModule(modulePath);
            postDebounceTestDoenetML(cesc);

            // Trigger a new payload while the first local compile is still in
            // flight, which should abort and suppress the stale result.
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g2">
  <point name="Q">(1,1)</point>
</graph>
<graph name="prefig2" renderer="prefigure" extend="$g2" />
`,
                    },
                    "*",
                );
            });

            // The second payload replaces the first graph, so #prefig is
            // removed from the DOM. The key assertion is that this unmount-time
            // abort does not surface stale output or an error.
            cy.get(cesc("#prefig")).should("not.exist");
            cy.wait(550);
            cy.get(cesc("#prefig2"), { timeout: 2000 }).should(
                "contain.text",
                "local-replacement-render-after-abort",
            );
            cy.get(cesc("#prefig2")).should("not.contain.text", "Error:");
        });
    },
);
