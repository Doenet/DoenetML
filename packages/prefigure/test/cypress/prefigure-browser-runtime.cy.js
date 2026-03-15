describe("@doenet/prefigure browser runtime check", () => {
    it("compiles a sample diagram in browser worker runtime", () => {
        cy.visit("/");

        cy.get("#status", { timeout: 120000 }).should("be.visible");

        cy.window()
            .its("__PREFIGURE_BROWSER_RUNTIME_CHECK__.ok", {
                timeout: 120000,
            })
            .should("eq", true);

        cy.window().then((win) => {
            const runtimeCheck = win.__PREFIGURE_BROWSER_RUNTIME_CHECK__;
            expect(runtimeCheck, "browser runtime check object").to.exist;
            expect(runtimeCheck.ok, "browser runtime check ok flag").to.eq(
                true,
            );
            expect(
                runtimeCheck.svgLength,
                "browser runtime check svg length",
            ).to.be.greaterThan(0);
            expect(
                runtimeCheck.annotationsLength,
                "browser runtime check annotations length",
            ).to.be.greaterThan(0);
        });
    });
});
