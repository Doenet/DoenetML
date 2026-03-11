import { cesc } from "@doenet/utils";

const PREFIGURE_BUILD_DEBOUNCE_MS = 1000;
const REQUEST_SETTLE_BUFFER_MS = 300;

describe("PreFigure debounce guards", { tags: ["@group1"] }, function () {
    let prefigureBuildRequestCount;

    function installPrefigureBuildIntercept(responseForRequest) {
        prefigureBuildRequestCount = 0;
        cy.intercept("POST", "https://prefigure.doenet.org/build", (req) => {
            prefigureBuildRequestCount += 1;

            const customResponse = responseForRequest?.(
                prefigureBuildRequestCount,
            );

            req.reply({
                statusCode: 200,
                headers: { "content-type": "application/json" },
                body: {
                    svg:
                        customResponse?.svg ??
                        `<svg xmlns=\"http://www.w3.org/2000/svg\"><text>${prefigureBuildRequestCount}</text></svg>`,
                    xml: "<annotations></annotations>",
                },
                delay: customResponse?.delay ?? 0,
            });
        });
    }

    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    function postDebounceTestDoenetML() {
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

    function expectBuildRequestCount(count) {
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(count);
        });
    }

    function waitPastDebounceWindow() {
        cy.wait(PREFIGURE_BUILD_DEBOUNCE_MS + REQUEST_SETTLE_BUFFER_MS);
    }

    it("sends initial PreFigure build request immediately", () => {
        installPrefigureBuildIntercept();
        postDebounceTestDoenetML();

        cy.wait(250);
        expectBuildRequestCount(1);

        cy.wait(PREFIGURE_BUILD_DEBOUNCE_MS - 100);
        expectBuildRequestCount(1);
    });

    it("coalesces rapid point updates into one additional build", () => {
        installPrefigureBuildIntercept();
        postDebounceTestDoenetML();

        waitPastDebounceWindow();
        expectBuildRequestCount(1);

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
        expectBuildRequestCount(1);

        cy.wait(PREFIGURE_BUILD_DEBOUNCE_MS - 650 + REQUEST_SETTLE_BUFFER_MS);
        expectBuildRequestCount(2);
    });

    it("renders only the latest build when an older response arrives later", () => {
        installPrefigureBuildIntercept((requestNumber) => {
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

        postDebounceTestDoenetML();

        waitPastDebounceWindow();
        expectBuildRequestCount(1);

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 3, y: 3, skippable: true },
            });
        });

        waitPastDebounceWindow();
        expectBuildRequestCount(2);

        cy.get(cesc("#prefig")).should("contain.text", "latest-response");
        cy.get(cesc("#prefig")).should("not.contain.text", "older-response");
    });
});
