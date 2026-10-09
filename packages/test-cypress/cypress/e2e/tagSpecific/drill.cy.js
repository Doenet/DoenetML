// The drill's clock and its move to the next question run on real time in
// the worker, which `cy.clock` cannot reach, so these use short durations.

describe("Drill Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("asks questions until enough are right", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <drill name="d" timeLimit="60" numRequired="2" feedbackDelay="300">
      <answer><mathInput><label>Type 5</label></mathInput><award>5</award></answer>
    </drill>
    `,
                },
                "*",
            );
        });

        cy.get("#d [role=timer]").should("have.text", "1:00");
        cy.get("#d [data-test=drill-progress]").should(
            "contain.text",
            "0 of 2 correct",
        );
        cy.get("#d textarea").should("not.exist");

        cy.get("#d_start").click();
        cy.get("#d_start").should("not.exist");
        cy.get("#d [role=timer]").should("have.text", "0:59");

        cy.get("#d textarea").type("5{enter}", { force: true });
        cy.get("#d [data-test=drill-status]").should("have.text", "Correct");
        cy.get("#d [data-test=drill-progress]").should(
            "contain.text",
            "1 of 2 correct",
        );

        // the next question replaces this one, empty
        cy.get("#d [data-test=drill-status]").should("have.text", "");
        cy.get("#d .mq-root-block").should("have.text", "");

        cy.get("#d textarea").type("4{enter}", { force: true });
        cy.get("#d [data-test=drill-status]").should("have.text", "Not quite");
        cy.get("#d [data-test=drill-status]").should("have.text", "");

        cy.get("#d textarea").type("5{enter}", { force: true });
        cy.get("#d [data-test=drill-status]").should(
            "contain.text",
            "Done: 2 correct in 0:0",
        );
        cy.get("#d_start").should("have.text", "Try again");
        cy.get("#d textarea").should("not.exist");

        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            const d = stateVariables[await win.resolvePath1("d")].stateValues;
            expect(d.phase).eq("succeeded");
            expect(d.numAnswered).eq(3);
            expect(d.creditAchieved).eq(1);
            expect(stateVariables[0].stateValues.creditAchieved).eq(1);
        });
    });

    it("runs out of time, then tries again", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <drill name="d" timeLimit="3" numRequired="2">
      <answer><mathInput><label>Type 5</label></mathInput><award>5</award></answer>
    </drill>
    `,
                },
                "*",
            );
        });

        cy.get("#d_start").should("have.text", "Start").click();
        cy.get("#d [role=timer]").should("have.text", "0:02");
        cy.get("#d [role=timer]").should("have.text", "0:00");
        cy.get("#d [data-test=drill-status]").should(
            "have.text",
            "Time's up: 0 of 2 correct",
        );
        cy.get("#d textarea").should("not.exist");

        cy.get("#d_start").should("have.text", "Try again").click();
        cy.get("#d [role=timer]").should("have.text", "0:02");
        cy.get("#d textarea").should("exist");

        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            const d = stateVariables[await win.resolvePath1("d")].stateValues;
            expect(d.attemptNumber).eq(2);
            expect(d.creditAchieved).eq(0);
        });
    });
});
