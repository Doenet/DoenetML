describe("Standalone uncoordinated iframes", { tags: ["@group5"] }, () => {
    it("renders all iframe documents without parent coordinator", () => {
        const scrollToFrame = (frameIndex) => {
            cy.get(`#frame-${frameIndex}`).scrollIntoView({
                block: "center",
                inline: "center",
            });
        };

        cy.visit("/uncoordinated-iframes.html");

        for (let i = 1; i <= 6; i++) {
            scrollToFrame(i);
            cy.getIframeBody(`#frame-${i}`)
                .find('[id$="hello"]')
                .should("contain", "Hello world");
        }
    });
});
