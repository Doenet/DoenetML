import React from "react";
import { setLocaleLoaders } from "@doenet/i18n";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// A language that is not inlined has to travel further than a bundled one: the
// main thread loads its catalog while the document is already rendering, and
// the core — which is where `<paginatorControls>`'s words are computed — has to
// end up holding it. Only English ships inside the bundle, and the language
// here is a stub installed through `setLocaleLoaders` rather than one this
// repository translates — so the test cannot pass by accident on a catalog
// that happens to be present. That is the same seam `@doenet/standalone` uses
// to point at the catalogs it serves.
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

/**
 * The same controls, inside a nested `<document lang>` rather than named by a
 * prop. Nothing outside the source says that language exists, so its catalog is
 * requested only if the source itself was read for it.
 */
const NESTED_DOENETML = `
<document>
  <p name="outer">outer</p>
  <document name="inner" lang="qq">${DOENETML}</document>
</document>
`;

/** A disclosure label (chrome) beside an answer the reader can type into. */
const READER_DOENETML = `
<solution name="sol"><p>respuesta</p></solution>
<p><answer name="ans"><textInput name="ti" /><award>hello</award></answer></p>
`;

/**
 * A viewer whose `uiLocale` the reader can change mid-session, the way a host
 * with a language picker would.
 */
function SwitchableUiLocale() {
    const [uiLocale, setUiLocale] = React.useState<string | undefined>(
        undefined,
    );
    return (
        <>
            <button id="switch-ui-locale" onClick={() => setUiLocale("qq")}>
                switch
            </button>
            <DoenetViewer
                doenetML={READER_DOENETML}
                uiLocale={uiLocale}
                addVirtualKeyboard={false}
            />
        </>
    );
}

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

    it("loads the catalog a nested document declares", () => {
        // A nested `<document lang>` is named nowhere but the source: it is in
        // neither prop, and the core settles it only while already computing
        // that subtree. Without reading the source for it, this subtree stays
        // English however long you wait.
        setLocaleLoaders({
            qq: async () => ({ content: "paginator-previous = Zyxwv\n" }),
        });

        cy.mount(
            <DoenetViewer
                doenetML={NESTED_DOENETML}
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#pc_previous", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Zyxwv",
        );
        // As above: the half this catalog does not translate falls back to
        // English rather than rendering blank or as its key.
        cy.get("#pc_next").should("have.text", "Next");
    });

    it("keeps the reader's work when their language loads", () => {
        // The chrome's catalogs and the content's share one map, so a catalog
        // fetched for a `uiLocale` switch used to re-key what gates the core
        // rebuild — throwing away every answer the reader had typed, for a
        // catalog the core never reads.
        setLocaleLoaders({
            qq: async () => ({
                chrome: "collapsible-click-to-open = (Zyxwv)\n",
            }),
        });

        cy.mount(<SwitchableUiLocale />);

        cy.get("#ti_input", { timeout: VIEWER_TIMEOUT }).type("wrong");
        cy.get("#sol_button").should("contain.text", "(click to open)");

        cy.get("#switch-ui-locale").click();

        cy.get("#sol_button").should("contain.text", "(Zyxwv)");
        cy.get("#ti_input").should("have.value", "wrong");
    });
});
