import React from "react";
import { setLocaleLoaders } from "@doenet/i18n";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// A language that is not inlined has to travel further than a bundled one: the
// main thread loads its catalog while the document is already rendering, and
// the core — which is where `<paginatorControls>`'s words are computed — has to
// end up holding it. Only English and Spanish ship inside the bundle, so the
// language here is a stub installed through `setLocaleLoaders`, the same seam
// `@doenet/standalone` uses to point at the catalogs it serves.
//
// What that covers is the half the `@doenet/i18n` unit tests cannot see:
// `useLocaleCatalogs` merging what it loaded into `localeResources`, and the
// core being rebuilt with it if the catalog lands after the core was created.

const VIEWER_TIMEOUT = 15_000;

const DOENETML = `
<paginatorControls name="pc" paginator="$pgn" />
<paginator name="pgn">
  <section><p>one</p></section>
  <section><p>two</p></section>
</paginator>
`;

describe("a language the bundle does not carry", () => {
    afterEach(() => {
        // Also empties the request cache, so no spec inherits another's.
        setLocaleLoaders(null);
    });

    it("reaches the core once its catalog has loaded", () => {
        setLocaleLoaders({
            qq: async () => ({
                // Deliberately partial: `paginator-next` is left untranslated,
                // so the other half of the same control has to fall through to
                // English rather than render blank or as its key.
                content: "paginator-previous = Zyxwv\n",
            }),
        });

        cy.mount(
            <DoenetViewer
                doenetML={DOENETML}
                documentLocale="qq"
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#pc_previous", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Zyxwv",
        );
        cy.get("#pc_next").should("have.text", "Next");
    });

    it("renders in English when nothing can load it", () => {
        cy.mount(
            <DoenetViewer
                doenetML={DOENETML}
                documentLocale="qq"
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#pc_previous", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Previous",
        );
    });
});
