const RUN_LIVE_PREFIGURE_ACCESSIBILITY = Boolean(
    Cypress.env("RUN_LIVE_PREFIGURE_ACCESSIBILITY"),
);

const liveDescribe = RUN_LIVE_PREFIGURE_ACCESSIBILITY
    ? describe
    : describe.skip;

liveDescribe(
    "Live PreFigure accessibility smoke @group4",
    { tags: ["@group4"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        it("loads real prefigure and diagcess, then passes the accessibility checker", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="prefig" renderer="prefigure">
  <shortDescription>Accessible live PreFigure graph</shortDescription>
  <description>
    <p>Live accessibility smoke test for a PreFigure graph with annotations.</p>
  </description>
  <point name="P">(2,3)</point>
  <line name="L" through="(0,0) (4,4)">
    <label>diagonal line</label>
  </line>
  <annotations>
    <annotation ref="$prefig" text="overall graph">
      <annotation ref="$P" text="highlighted point" />
      <annotation ref="$L" text="diagonal line" speech="A line through the origin" />
    </annotation>
  </annotations>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get("#ready").should("have.text", "ready");

            cy.get("#prefig .svg svg", { timeout: 30000 }).should("exist");
            cy.get('script[src*="diagcess"]', { timeout: 30000 }).should(
                "have.length.at.least",
                1,
            );

            cy.get("#prefig .ChemAccess-element", { timeout: 30000 })
                .should("have.attr", "has-svg", "true")
                .and("have.attr", "has-cml", "true")
                .and("have.attr", "tabindex", "0")
                .and("have.attr", "role", "application");

            cy.get("#prefig .cml", { timeout: 30000 }).should("not.be.empty");

            cy.get("#prefig-description")
                .should("have.attr", "role", "group")
                .and(
                    "have.attr",
                    "aria-label",
                    "Accessible live PreFigure graph",
                )
                .and("have.attr", "aria-details", "prefig-description-content");

            cy.get("#prefig-description-content").should(
                "contain.text",
                "Live accessibility smoke test for a PreFigure graph with annotations.",
            );

            cy.get("#prefig .ChemAccess-element").click({ force: true });
            cy.get("#prefig .cacc-message", { timeout: 30000 })
                .should("exist")
                .and("contain.text", "overall graph");

            cy.checkAccessibility([".doenet-viewer"], {
                onlyWarnImpacts: ["moderate", "minor"],
            });
        });
    },
);
