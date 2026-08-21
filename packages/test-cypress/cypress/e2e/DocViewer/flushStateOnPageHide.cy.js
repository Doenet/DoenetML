// Flush pending state when the page goes away (Doenet/DoenetML#1726).
//
// The core throttles its `SPLICE.reportScoreAndState` saves at 60 seconds, and
// the only things that overrode that throttle were a host's explicit
// `SPLICE.flushState` and a submitted answer. A page can go away with neither —
// the tab is closed, a new URL is typed, an external link is followed — and a
// React effect cleanup does not run for any of those, so up to a minute of a
// reader's work was lost. This spec drives the real thing: a navigation away
// from the document, with work typed inside the throttle window.

describe("Flush state when the page hides", { tags: ["@group4"] }, function () {
    let savedState = null;

    function setUpStateListeners() {
        cy.window().then((win) => {
            win.addEventListener("message", (e) => {
                if (e.data.subject === "SPLICE.getState") {
                    if (savedState !== null) {
                        win.postMessage(
                            {
                                subject: "SPLICE.getState.response",
                                message_id: e.data.message_id,
                                state: savedState,
                            },
                            "*",
                        );
                    }
                } else if (e.data.subject === "SPLICE.reportScoreAndState") {
                    savedState = e.data.state;
                }
            });
        });
    }

    function saved() {
        return String(savedState?.coreState ?? "");
    }

    const doenetML = `
    <p>Enter text: <textInput name="ti" /></p>
    <p>You typed: <text name="tv" extend="$ti.value" /></p>
  `;

    function loadDocument() {
        setUpStateListeners();
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
    }

    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");

        savedState = null;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLoadState").click();
        cy.get("#testRunner_allowSaveState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
    });

    it("navigating away saves work done inside the throttle window", () => {
        loadDocument();
        cy.get("#tv").should("exist");

        // The document's first save reports right away and arms the
        // 60-second throttle on `StatePersistence.saveChangesToDatabase`.
        cy.wrap(null).should(() => {
            expect(savedState, "initial save reported").to.not.eq(null);
        });

        // Everything typed from here is stuck behind that throttle. This is
        // the work a reader would have lost by closing the tab.
        cy.get("#ti_input").type("work after last save{enter}");
        cy.get("#tv").should("have.text", "work after last save");

        // Past the one-second save debounce, and then some: no report can
        // carry this work until the throttle expires.
        cy.wait(3000);
        cy.then(() => {
            expect(
                saved().includes("work after last save"),
                "typed work reported before the page hid (should not be)",
            ).to.eq(false);
        });

        // A real unload — the page goes away without the viewer unmounting.
        cy.reload();

        cy.then(() => {
            expect(
                saved().includes("work after last save"),
                "hiding the page reported the pending work",
            ).to.eq(true);
        });

        // And the host's saved copy restores it, as it would on the reader's
        // next visit.
        loadDocument();
        cy.get("#tv").should("have.text", "work after last save");
        cy.get("#ti_input").should("have.value", "work after last save");
    });
});
