describe("@doenet/prefigure browser smoke", () => {
    it("compiles a sample diagram in browser worker runtime", () => {
        cy.visit("/");

        cy.get("#status", { timeout: 120000 }).should("be.visible");

        cy.window()
            .its("__PREFIGURE_SMOKE__.ok", { timeout: 120000 })
            .should("eq", true);

        cy.window().then((win) => {
            const smoke = win.__PREFIGURE_SMOKE__;
            expect(smoke, "smoke object").to.exist;
            expect(smoke.ok, "smoke ok flag").to.eq(true);
            expect(smoke.svgLength, "svg length").to.be.greaterThan(0);
            expect(
                smoke.annotationsLength,
                "annotations length",
            ).to.be.greaterThan(0);
        });
    });
});
