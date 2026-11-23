describe("Action results", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // `callAction` resolves with whether the action succeeded; the host hears
    // the same through `SPLICE.submitAllAnswers.response`. An action core
    // fails replies `success: false` and sends no renderer update, so the
    // reply is all that settles it, and it must settle it as failed.
    it("an action core fails resolves as false", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<graph><point name="P">(1,2)</point></graph><p name="px">$P.x</p>`,
                },
                "*",
            );
        });
        cy.get("#px").should("have.text", "1");

        cy.window().then(async (win) => {
            const P = await win.resolvePath1("P");
            const moved = await win.callAction1({
                actionName: "movePoint",
                componentIdx: P,
                args: { x: 3, y: 4 },
            });
            expect(moved, "an action that succeeds").eq(true);

            // Not a number core can read, so the action throws.
            const failed = await win.callAction1({
                actionName: "movePoint",
                componentIdx: P,
                args: { x: { notAMath: true }, y: 5 },
            });
            expect(failed, "an action that fails").eq(false);
        });
        cy.get("#px").should("have.text", "3");
    });
});
