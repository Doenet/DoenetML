// The wrapper the viewer renders around the whole activity scrolls sideways
// for content too wide for it (#876), but must never be scrollable vertically
// by the reader. On iOS WebKit a drag goes to the first scrollable ancestor of
// the touch point, so even a few pixels of vertical scroll range on the
// wrapper captures every drag and the host page can't be scrolled (#2300).
// Chrome can't reproduce the drag latching, so this checks the overflow the
// latching depends on.
describe("Viewer scrolling Tests", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    function renderDoenetML(doenetML) {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
    }

    it("is not vertically scrollable even when its content overflows", () => {
        renderDoenetML(`<p name="p">hello</p>`);
        cy.get("#p").should("have.text", "hello");

        // Push the content a few pixels past the wrapper's bottom edge, the
        // way the iPad measurements showed (scrollHeight 4px > clientHeight).
        cy.get(".doenet-viewer").then(($viewer) => {
            const viewer = $viewer[0];
            const poke = viewer.ownerDocument.createElement("div");
            poke.style.cssText = "position: relative; top: 20px; height: 1px";
            viewer.appendChild(poke);
            expect(viewer.scrollHeight).to.be.greaterThan(viewer.clientHeight);
        });

        cy.get(".doenet-viewer")
            .should("have.css", "overflow-y", "hidden")
            .and("have.css", "overflow-x", "auto");
    });
});
