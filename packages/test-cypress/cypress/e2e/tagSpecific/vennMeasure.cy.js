// Temporary measurement spec for MEMORY_REDUCTION_LOG.md: loads the Venn
// diagram profiling document, activates all regions, and records the number
// of JSXGraph elements and the JS heap size.
describe("venn measure", { tags: ["@group1"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("counts JSXGraph elements for the Venn document", () => {
        cy.readFile(
            "../doenetml-worker-javascript/src/test/memory-bench-doc.xml",
        ).then((doenetML) => {
            cy.window().then(async (win) => {
                win.postMessage({ doenetML }, "*");
            });
        });

        // wait for the graph to render
        cy.get(".jxgbox", { timeout: 60000 }).should("exist");

        // activate all seven region polygons
        cy.contains("button", "Invert all shading", { timeout: 30000 }).click();

        // all regions shaded: the reset button appears
        cy.contains("button", "Clear All Shading", {
            timeout: 30000,
        }).should("exist");

        cy.window().then((win) => {
            const board = Object.values(win.JXG.boards).find(
                (b) => b.objectsList.length > 10,
            );
            const counts = {};
            for (const obj of board.objectsList) {
                counts[obj.elType] = (counts[obj.elType] || 0) + 1;
            }
            const result = {
                totalElements: board.objectsList.length,
                counts,
                usedJSHeapSizeMB: win.performance?.memory
                    ? (win.performance.memory.usedJSHeapSize / 1048576).toFixed(
                          1,
                      )
                    : null,
            };
            cy.writeFile("venn-measure-result.json", result);
        });
    });
});
