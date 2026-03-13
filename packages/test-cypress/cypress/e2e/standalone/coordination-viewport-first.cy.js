describe(
    "Standalone parent coordination viewport-first",
    { tags: ["@group5"] },
    () => {
        const scrollToFrame = (frameIndex) => {
            cy.get(`#frame-${frameIndex}`).scrollIntoView({
                block: "center",
                inline: "center",
            });
        };

        it("prioritizes visible iframes when starting at top", () => {
            cy.visit("/coordination-viewport-first.html");

            // Wait for frame 1 to initialize
            cy.getIframeBody("#frame-1", "#hello")
                .find("#hello")
                .should("contain", "Hello world");

            // Check that frame 2 has NOT initialized yet
            cy.getIframeBody("#frame-2").find("#hello").should("not.exist");

            // Wait for frame 2 to initialize
            cy.getIframeBody("#frame-2", "#hello")
                .find("#hello")
                .should("contain", "Hello world");

            // Check that bottom frames have NOT initialized yet
            // Must scroll them into view first, otherwise they won't render at all
            scrollToFrame(5);
            cy.wait(500); // Give already-granted frames time to render
            cy.getIframeBody("#frame-5").find("#hello").should("not.exist");

            scrollToFrame(6);
            cy.wait(500); // Give already-granted frames time to render
            cy.getIframeBody("#frame-6").find("#hello").should("not.exist");
        });

        it("prioritizes visible iframes when starting at bottom", () => {
            cy.visit("/coordination-viewport-first.html?start=bottom");

            // Wait for frame 5 to initialize
            cy.getIframeBody("#frame-5", "#hello")
                .find("#hello")
                .should("contain", "Hello world");

            // Check that frame 6 has NOT initialized yet
            cy.getIframeBody("#frame-6").find("#hello").should("not.exist");

            // Wait for frame 6 to initialize
            cy.getIframeBody("#frame-6", "#hello")
                .find("#hello")
                .should("contain", "Hello world");

            // Check that top frames have NOT initialized yet
            // Must scroll them into view first, otherwise they won't render at all
            scrollToFrame(1);
            cy.wait(500); // Give already-granted frames time to render
            cy.getIframeBody("#frame-1").find("#hello").should("not.exist");

            scrollToFrame(2);
            cy.wait(500); // Give already-granted frames time to render
            cy.getIframeBody("#frame-2").find("#hello").should("not.exist");
        });
    },
);
