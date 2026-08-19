import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";
import { acquireBootSlot, type BootSlot } from "../../../src/utils/bootGate";

// Regression coverage: the in-realm boot gate (#1710) holds back a document's
// FIRST core boot only, never its rebuilds.
//
// The stampede the gate bounds is N documents starting at once on page load.
// A rebuild is one already-visible document replacing its core, and it does
// not multiply with page size the way first boots do — so gating it buys
// nothing and costs a great deal: an on-screen document had to queue behind
// other documents' first boots merely to show its own update, and an editor,
// which rebuilds on every recompile, serialized its whole startup through one
// page-wide slot. That regression reached CI (it broke
// `DoenetEditor.diagnosticHoverLocale` and `DocViewer/i18n`) rather than any
// test written for the gate, which is what this spec closes.
//
// Shape of the test: let the viewer boot, then take the page's only boot slot
// away from outside and rebuild. A gated rebuild would wait for the slot —
// which this test never gives back — until the gate's own 60 s fail-open
// backstop. An ungated one renders straight away.

/** Drives a document rebuild by changing `doenetML`. */
function Rebuildable() {
    const [generation, setGeneration] = React.useState(0);
    return (
        <div>
            <button
                data-test="rebuild"
                onClick={() => setGeneration((g) => g + 1)}
            >
                rebuild
            </button>
            <DoenetViewer
                doenetML={
                    generation === 0
                        ? "<p>first document</p>"
                        : "<p>rebuilt document</p>"
                }
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetViewer rebuilds are not boot-gated (#1710)", () => {
    let heldSlot: BootSlot | null = null;

    afterEach(() => {
        // The slot locks are origin-scoped and outlive the spec's realm, so a
        // slot left held here would stall the first boot of every later test.
        heldSlot?.release();
        heldSlot = null;
        delete doenetGlobalConfig.maxConcurrentBoots;
    });

    it("rebuilds while another document holds the page's only boot slot", () => {
        // One slot page-wide, so "taken" and "unavailable" are the same thing
        // and the assertion cannot be satisfied by a second slot being free.
        doenetGlobalConfig.maxConcurrentBoots = 1;

        cy.mount(<Rebuildable />);
        cy.contains("first document", { timeout: 20000 }).should("exist");

        // Stand in for a sibling document that is booting: take the only slot
        // and keep it for the rest of the test.
        cy.then(() =>
            acquireBootSlot().then((slot) => {
                heldSlot = slot;
            }),
        );

        // The assertion. A gated rebuild would render nothing until the gate
        // gave up waiting (60 s), well past this timeout.
        cy.get("[data-test=rebuild]").click();
        cy.contains("rebuilt document", { timeout: 15000 }).should("exist");
    });
});
