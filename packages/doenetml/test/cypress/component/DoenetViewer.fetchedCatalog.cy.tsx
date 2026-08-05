import React from "react";
import {
    DoenetViewer,
    fetchLocaleLoaders,
    setLocaleLoaders,
} from "../../../src/doenetml-inline-worker";

// The seam `@doenet/standalone` renders through, exercised end to end: install
// fetch loaders pointed at catalogs served somewhere, render a document in a
// language only those catalogs carry, and watch the request go out and the
// words come back.
//
// Both halves are imported from *this package's* entry point rather than from
// `@doenet/i18n`, which is the point of the spec. The loaders are module-level
// state, so a bundle holding two copies of `@doenet/i18n` — as
// `@doenet/standalone` did in 0.7.22 — installs them on an instance the viewer
// never reads and then requests no catalog at all, silently falling back to
// English.
//
// A source-built spec cannot reproduce the two instances; what it can do is
// hold the seam the fix rests on and assert the request that no other test
// looks for. `packages/standalone/scripts/check-bundle-size.mjs` counts the
// copies in the built bundle, which is the half this cannot see.

const VIEWER_TIMEOUT = 15_000;

/** Where the catalogs are served from, as a host would lay them out. */
const CATALOG_BASE = "https://catalogs.test/locales/";

/**
 * `<paginatorControls>`'s words are computed by the core, so a catalog that
 * reaches them reached the worker rather than only the chrome around it.
 */
const CONTROLS = `
<paginatorControls name="pc" paginator="$pgn" />
<paginator name="pgn">
  <section><p>one</p></section>
  <section><p>two</p></section>
</paginator>
`;

/** The language declared in the source, the way an author writes it. */
const DECLARED_DOENETML = `<document lang="qq">${CONTROLS}</document>`;

/**
 * Serve `qq`'s content catalog and nothing else, counting what was asked for.
 *
 * The other namespaces 404 the way a partially translated locale's would, so
 * the spec also covers a loader shrugging off the catalogs that are not there.
 */
function serveCatalogs(): string[] {
    const requested: string[] = [];
    cy.intercept("GET", `${CATALOG_BASE}qq/*.ftl`, (req) => {
        requested.push(req.url.slice(CATALOG_BASE.length));
        if (req.url.endsWith("/content.ftl")) {
            req.reply({
                statusCode: 200,
                body: "paginator-previous = Zyxwv\n",
            });
        } else {
            req.reply({ statusCode: 404, body: "" });
        }
    });
    return requested;
}

describe("catalogs fetched from where a host serves them", () => {
    beforeEach(() => {
        // `qq` is not a language this repository ships, so nothing here can
        // pass on a catalog that happened to be present. It has to be named
        // explicitly: `fetchLocaleLoaders` offers `SUPPORTED_LOCALES` by
        // default, and a made-up tag is not one of them.
        setLocaleLoaders(fetchLocaleLoaders(CATALOG_BASE, ["qq"]));
    });

    afterEach(() => {
        // Also empties the request cache, so no spec inherits another's.
        setLocaleLoaders(null);
    });

    it("requests the catalog for a language the document declares", () => {
        const requested = serveCatalogs();

        cy.mount(
            <DoenetViewer
                doenetML={DECLARED_DOENETML}
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#pc_previous", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Zyxwv",
        );
        // The half the served catalog does not translate falls back to English
        // rather than rendering blank or as its key.
        cy.get("#pc_next").should("have.text", "Next");
        // The words could only have come from the request, but assert it
        // directly: a bundle that installs loaders the viewer cannot see fails
        // by making no request, and that is the failure worth naming.
        cy.wrap(null).should(() => {
            expect(requested).to.include("qq/content.ftl");
        });
    });

    it("requests it for a language named by a prop", () => {
        const requested = serveCatalogs();

        cy.mount(
            <DoenetViewer
                doenetML={CONTROLS}
                documentLocale="qq"
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#pc_previous", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Zyxwv",
        );
        cy.wrap(null).should(() => {
            expect(requested).to.include("qq/content.ftl");
        });
    });

    it("asks for nothing when the document renders in English", () => {
        // English ends every fallback chain and is carried in the bundle, so a
        // document that needs no other language should cost no request at all.
        const requested = serveCatalogs();

        cy.mount(
            <DoenetViewer doenetML={CONTROLS} addVirtualKeyboard={false} />,
        );

        cy.get("#pc_previous", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Previous",
        );
        cy.wrap(null).should(() => {
            expect(requested).to.be.empty;
        });
    });
});
