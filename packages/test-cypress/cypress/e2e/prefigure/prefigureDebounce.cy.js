import {
    PREFIGURE_BUILD_DEBOUNCE_MS,
    REQUEST_SETTLE_BUFFER_MS,
    expectBuildRequestCount,
    installPrefigureBuildIntercept,
    postDebounceTestDoenetML,
    waitPastDebounceWindow,
} from "../../support/prefigure";

describe(
    "PreFigure debounce guards @group4",
    { tags: ["@group4"] },
    function () {
        let requestTracker;

        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        it("sends initial PreFigure build request immediately", () => {
            requestTracker = installPrefigureBuildIntercept();
            postDebounceTestDoenetML(cesc);

            cy.wait(250);
            expectBuildRequestCount(requestTracker, 1);

            cy.wait(PREFIGURE_BUILD_DEBOUNCE_MS - 100);
            expectBuildRequestCount(requestTracker, 1);
        });

        it("coalesces rapid point updates into one additional build", () => {
            requestTracker = installPrefigureBuildIntercept();
            postDebounceTestDoenetML(cesc);

            waitPastDebounceWindow();
            expectBuildRequestCount(requestTracker, 1);

            cy.window().then(async (win) => {
                const pointIdx = await win.resolvePath1("P");
                const actions = [];

                for (let ind = 0; ind < 8; ind++) {
                    actions.push(
                        win.callAction1({
                            actionName: "movePoint",
                            componentIdx: pointIdx,
                            args: {
                                x: ind * 0.5,
                                y: ind * 0.5,
                                skippable: true,
                            },
                        }),
                    );
                }

                await Promise.all(actions);
            });

            cy.wait(REQUEST_SETTLE_BUFFER_MS + 400);
            expectBuildRequestCount(requestTracker, 1);

            cy.wait(
                PREFIGURE_BUILD_DEBOUNCE_MS - 650 + REQUEST_SETTLE_BUFFER_MS,
            );
            expectBuildRequestCount(requestTracker, 2);
        });

        it("renders only the latest build when an older response arrives later", () => {
            requestTracker = installPrefigureBuildIntercept((requestNumber) => {
                if (requestNumber === 1) {
                    return {
                        delay: 1800,
                        svg: `<svg xmlns=\"http://www.w3.org/2000/svg\"><text>older-response</text></svg>`,
                    };
                }

                return {
                    delay: 50,
                    svg: `<svg xmlns=\"http://www.w3.org/2000/svg\"><text>latest-response</text></svg>`,
                };
            });

            postDebounceTestDoenetML(cesc);

            waitPastDebounceWindow();
            expectBuildRequestCount(requestTracker, 1);

            cy.window().then(async (win) => {
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: await win.resolvePath1("P"),
                    args: { x: 3, y: 3, skippable: true },
                });
            });

            waitPastDebounceWindow();
            expectBuildRequestCount(requestTracker, 2);

            cy.get("#prefig").should("contain.text", "latest-response");
            cy.get("#prefig").should("not.contain.text", "older-response");
        });

        it("reintroduced prefigure graph builds immediately after being absent", () => {
            requestTracker = installPrefigureBuildIntercept();

            postDebounceTestDoenetML(cesc);
            cy.wait(250);
            expectBuildRequestCount(requestTracker, 1);

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g">
  <point name="P">(0,0)</point>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get("#ready").should("have.text", "ready");
            cy.wait(PREFIGURE_BUILD_DEBOUNCE_MS + REQUEST_SETTLE_BUFFER_MS);
            expectBuildRequestCount(requestTracker, 1);

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
            cy.wait(250);
            expectBuildRequestCount(requestTracker, 2);
        });
    },
);
