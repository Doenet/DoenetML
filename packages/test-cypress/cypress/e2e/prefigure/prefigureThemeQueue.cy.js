import {
    installMockPrefigureModule,
    PREFIGURE_BUILD_URL_PATTERN,
    visitWithMockPrefigureModule,
} from "../../support/prefigure";

const PREFIGURE_EDITOR_DOENETML = `
<text name="ready">ready</text>
<graph name="g">
  <line styleNumber="2" through="(1,2) (3,4)" />
</graph>
<graph name="prefig" renderer="prefigure" extend="$g" />
`;

function themeFromBuildRequestBody(body) {
    const xml = typeof body === "string" ? body : String(body ?? "");

    if (xml.includes('<axes axes="all" stroke="#ffffff" />')) {
        return "dark";
    }

    if (xml.includes('<axes axes="all" />')) {
        return "light";
    }

    return "unknown";
}

describe(
    "PreFigure theme queue refresh regression @group4",
    { tags: ["@group4"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();

            const modulePath = installMockPrefigureModule({
                modulePath: "/mock-prefigure-never-ready-theme-queue.js",
                initDelayMs: 60000,
                renderLabel: "unused-local-render",
            });

            visitWithMockPrefigureModule(modulePath);

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showEditor").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();
        });

        it("does not replay a stale light-theme action after Ctrl+S rebuilds a dark-mode viewer", () => {
            const requestThemes = [];

            cy.intercept("POST", PREFIGURE_BUILD_URL_PATTERN, (req) => {
                const theme = themeFromBuildRequestBody(req.body);
                requestThemes.push(theme);

                req.reply({
                    statusCode: 200,
                    headers: { "content-type": "application/json" },
                    body: {
                        svg: `<svg xmlns="http://www.w3.org/2000/svg"><text>${theme}-${requestThemes.length}</text></svg>`,
                        annotationsXml: "<annotations></annotations>",
                    },
                });
            }).as("prefigureBuild");

            cy.window().then((win) => {
                win.postMessage({ doenetML: PREFIGURE_EDITOR_DOENETML }, "*");
            });

            cy.get("#ready").should("have.text", "ready");
            cy.wait("@prefigureBuild");
            cy.get("#prefig").should("contain.text", "light-1");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_darkMode").click();
            cy.get("#testRunner_toggleControls").click();

            cy.wrap(null).should(() => {
                expect(requestThemes).to.include("dark");
            });
            cy.get("#prefig").should("contain.text", "dark");

            cy.then(() => requestThemes.length).then((refreshStartIndex) => {
                cy.get(".cm-content")
                    .click()
                    .type("{ctrl}{end}", { force: true })
                    .type('\n<p name="after">after</p>', { force: true });

                cy.get(".cm-activeLine").type("{ctrl+s}");

                cy.wrap(null).should(() => {
                    expect(requestThemes.length).to.be.greaterThan(
                        refreshStartIndex,
                    );
                });

                cy.wait(1300);

                cy.then(() => {
                    const themesAfterRefresh =
                        requestThemes.slice(refreshStartIndex);
                    expect(themesAfterRefresh.length).to.be.greaterThan(0);
                    expect(themesAfterRefresh).to.not.include("light");
                    expect(themesAfterRefresh.at(-1)).to.equal("dark");
                });

                cy.get("#prefig").should("contain.text", "dark");
                cy.get("#prefig").should("not.contain.text", "light");
                cy.get("#after").should("have.text", "after");
            });
        });
    },
);
