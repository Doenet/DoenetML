import { cesc } from "@doenet/utils";
import {
    installPrefigureBuildIntercept,
    waitPastDebounceWindow,
} from "../../support/prefigure";

describe(
    "PreFigure annotations and accessibility @group4",
    { tags: ["@group4"] },
    () => {
        it("sanitizes annotation markup and re-inits diagcess cleanly after a graph update", () => {
            const requestBodies = [];

            cy.clearIndexedDB();
            cy.visit("/", {
                onBeforeLoad(win) {
                    win.__diagcessInitCount = 0;
                    win.diagcess = {
                        Base: {
                            molMap: {},
                            init() {
                                win.__diagcessInitCount += 1;

                                const container =
                                    win.document.querySelector("#prefig");
                                if (!container) {
                                    return;
                                }

                                const message = win.document.createElement("p");
                                message.className = "cacc-message";
                                message.textContent = `diagcess init ${win.__diagcessInitCount}`;
                                container.appendChild(message);
                            },
                        },
                    };
                },
            });

            cy.intercept("POST", "**/build", (req) => {
                requestBodies.push(String(req.body));

                const requestNumber = requestBodies.length;

                req.reply({
                    statusCode: 200,
                    headers: { "content-type": "application/json" },
                    body: {
                        svg: `<svg xmlns="http://www.w3.org/2000/svg"><text>svg-${requestNumber}</text></svg>`,
                        annotationsXml: `<?xml version="1.0"?><annotations onclick="alert('xss')"><annotation style="color:red" onclick="alert('bad')">safe-cml-${requestNumber}</annotation></annotations>`,
                    },
                });
            }).as("prefigureBuild");

            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="prefig" renderer="prefigure">
  <point name="P">(0,0)</point>
  <annotations>
    <annotation ref="$P" text="point summary" />
  </annotations>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get(cesc("#ready")).should("have.text", "ready");
            cy.wait("@prefigureBuild");
            cy.wait(450);

            cy.then(() => {
                expect(requestBodies[0]).to.include("<annotations>");
                expect(requestBodies[0]).to.include(`text="point summary"`);
            });

            cy.get(cesc("#prefig"))
                .find(".svg")
                .should("contain.text", "svg-1");
            cy.get(cesc("#prefig"))
                .find(".cml")
                .should("contain.text", "safe-cml-1");
            cy.get(cesc("#prefig"))
                .find(".cml [onclick], .cml [style]")
                .should("not.exist");
            cy.window().its("__diagcessInitCount").should("eq", 1);
            cy.get(cesc("#prefig"))
                .children("p.cacc-message")
                .should("have.length", 1)
                .and("contain.text", "diagcess init 1");

            cy.window().then(async (win) => {
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: await win.resolvePath1("P"),
                    args: { x: 2, y: 1, skippable: true },
                });
            });

            waitPastDebounceWindow();
            cy.wait(450);

            cy.then(() => {
                expect(requestBodies).to.have.length(2);
                expect(requestBodies[1]).to.include("<annotations>");
                expect(requestBodies[1]).to.include(`text="point summary"`);
            });

            cy.get(cesc("#prefig"))
                .find(".svg")
                .should("contain.text", "svg-2");
            cy.get(cesc("#prefig"))
                .find(".cml")
                .should("contain.text", "safe-cml-2");
            cy.get(cesc("#prefig"))
                .find(".cml [onclick], .cml [style]")
                .should("not.exist");
            cy.window().its("__diagcessInitCount").should("eq", 2);
            cy.get(cesc("#prefig"))
                .children("p.cacc-message")
                .should("have.length", 1)
                .and("contain.text", "diagcess init 2");
        });

        it("applies shortDescription and aria-details to a prefigure graph", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            installPrefigureBuildIntercept();

            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<graph name="prefig" renderer="prefigure">
  <shortDescription>PreFigure graph</shortDescription>
  <description>
    <p>Accessible PreFigure description.</p>
  </description>
  <point>(0,0)</point>
</graph>
`,
                    },
                    "*",
                );
            });

            waitPastDebounceWindow();

            cy.get("#prefig-description")
                .should("have.attr", "role", "group")
                .and("have.attr", "aria-label", "PreFigure graph")
                .and("have.attr", "aria-details", "prefig-description-content");

            cy.get("#prefig-description-content").should(
                "contain.text",
                "Accessible PreFigure description.",
            );
            cy.get("#prefig-container [data-test='Description']").should(
                "not.have.attr",
                "open",
            );
            cy.get(cesc("#prefig")).find(".svg").should("exist");
        });
    },
);
