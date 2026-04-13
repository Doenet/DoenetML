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
                initDelayMs: 120,
                renderLabel: "local-winner",
            });

            cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, {
                statusCode: 200,
                headers: { "content-type": "application/json" },
                delay: 4500,
                body: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>service-slow</text></svg>',
                    annotationsXml:
                        "<diagram><annotation>service-slow</annotation></diagram>",
                },
            });

            visitWithMockPrefigureModule(modulePath);
            postDebounceTestDoenetML(cesc);

            cy.get(cesc("#prefig"), { timeout: 1800 }).should(
                "contain.text",
                "local-winner",
            );
            cy.get(cesc("#prefig")).should("not.contain.text", "service-slow");

            // Even after the delayed service response eventually settles, the
            // local winner should remain rendered.
            cy.wait(4700);
            cy.get(cesc("#prefig")).should("contain.text", "local-winner");
            cy.get(cesc("#prefig")).should("not.contain.text", "service-slow");
        });

        it("recovers from service failure once local WASM warmup completes", () => {
            const modulePath = installMockPrefigureModule({
                modulePath: "/mock-prefigure-after-failure.js",
                initDelayMs: 350,
                renderLabel: "local-after-service-error",
            });

            cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, {
                statusCode: 503,
                headers: { "content-type": "application/json" },
                body: { message: "service unavailable" },
            });

            visitWithMockPrefigureModule(modulePath);
            postDebounceTestDoenetML(cesc);

            cy.get(cesc("#prefig"), { timeout: 3000 }).should(
                "contain.text",
                "local-after-service-error",
            );
            cy.get(cesc("#prefig")).should("not.contain.text", "Error:");
        });
    },
);
