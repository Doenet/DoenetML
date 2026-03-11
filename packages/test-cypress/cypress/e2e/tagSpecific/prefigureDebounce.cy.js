import { cesc } from "@doenet/utils";

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

    it("sends initial PreFigure build request immediately", () => {
        installPrefigureBuildIntercept();
        postDebounceTestDoenetML();

        cy.wait(250);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(1);
        });

        cy.wait(900);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(1);
        });
    });

    it("coalesces rapid point updates into one additional build", () => {
        installPrefigureBuildIntercept();
        postDebounceTestDoenetML();

        cy.wait(1300);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(1);
        });

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

        cy.wait(700);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(1);
        });

        cy.wait(450);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(2);
        });
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

        cy.wait(1300);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(1);
        });

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 3, y: 3, skippable: true },
            });
        });

        cy.wait(1300);
        cy.then(() => {
            expect(prefigureBuildRequestCount).eq(2);
        });

        cy.get(cesc("#prefig")).should("contain.text", "latest-response");
        cy.get(cesc("#prefig")).should("not.contain.text", "older-response");
    });
});
