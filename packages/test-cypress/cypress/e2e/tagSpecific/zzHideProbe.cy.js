function pegsOn(win) {
    const boards = Object.values(win.JXG?.boards || {});
    let total = 0,
        visible = 0;
    for (const b of boards) {
        for (const o of Object.values(b.objects || {})) {
            if (o?.elType === "point" && o?.visProp?.fillcolor === "darkgray") {
                total++;
                if (o.visProp.visible) visible++;
            }
        }
    }
    return { total, visible };
}

describe("hide probe", { tags: ["@group2"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("toggles hide", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="a">a</text>
<booleanInput name="bi" />
<graph>
  <pegboard hide="$bi"></pegboard>
</graph>
`,
                },
                "*",
            );
        });
        cy.get("#a").should("have.text", "a");
        const readings = {};
        cy.window().should((win) => {
            expect(pegsOn(win).total, "initial total").to.be.greaterThan(0);
        });
        cy.window().then((win) => {
            readings.initial = pegsOn(win);
        });

        cy.get("#bi").click();
        cy.wait(1500);
        cy.window().then((win) => {
            readings.hidden = pegsOn(win);
        });

        cy.get("#bi").click();
        cy.wait(1500);
        cy.window().then((win) => {
            readings.shown = pegsOn(win);
            expect(readings, "READINGS").to.deep.equal({});
        });
    });
});
