describe(
    "Standalone parent coordination dom-order",
    { tags: ["@group5"] },
    () => {
        const scrollToFrame = (frameIndex) => {
            cy.get(`#frame-${frameIndex}`).scrollIntoView({
                block: "center",
                inline: "center",
            });
        };

        const waitForReady = (frameIndex) => {
            scrollToFrame(frameIndex);
            cy.getIframeBody(`#frame-${frameIndex}`, "#hello")
                .find("#hello")
                .should("contain", "Hello world");
        };

        const expectNotReady = (frameIndex) => {
            scrollToFrame(frameIndex);
            cy.getIframeBody(`#frame-${frameIndex}`)
                .find("#hello")
                .should("not.exist");
        };

        it("initializes iframes strictly in DOM order with DOM probes", () => {
            cy.visit("/coordination-dom-order.html");

            // DOM probe: verify ordering constraint is maintained
            waitForReady(1);
            for (let i = 2; i <= 6; i++) {
                expectNotReady(i);
            }

            waitForReady(2);
            for (let i = 3; i <= 6; i++) {
                expectNotReady(i);
            }

            waitForReady(3);
            for (let i = 4; i <= 6; i++) {
                expectNotReady(i);
            }

            waitForReady(4);
            for (let i = 5; i <= 6; i++) {
                expectNotReady(i);
            }

            waitForReady(5);
            expectNotReady(6);

            waitForReady(6);
        });
    },
);
