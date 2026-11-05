/**
 * Search checks for the DoenetML documentation site.
 *
 * The docs site searches with [Pagefind](https://pagefind.app), which indexes
 * the *built HTML* of `packages/docs-nextra/out` (the index is produced by that
 * package's `postbuild` script). That is the whole point of the Nextra 4
 * migration (#2001): the previous search was fed from the MDX source at compile
 * time, so it could not see anything rendered by `<ComponentDisplay>` /
 * `<AttrPropDisplay>` from the schema — which is most of the reference docs.
 *
 * These tests therefore cover two things that break in different ways:
 *   1. the search box is wired to an index that actually loads, and
 *   2. that index contains schema-rendered text, not just MDX prose.
 *
 * Like the accessibility suite, this requires the built docs to be served at
 * the configured baseUrl (`npm run build:docs`, then `npm exec serve --
 * --no-port-switching -l 3000 packages/docs-nextra/out/`). Running against
 * `next dev` will fail: the dev server never writes `out/`, so there is no
 * index to load.
 */

/**
 * Type a query into the visible search box. The page renders two `.nextra-search`
 * widgets — one in the desktop navbar and one in the mobile navigation — and only
 * one of them is visible at a given viewport width.
 */
function search(query) {
    cy.get('.nextra-search input[type="search"]')
        .filter(":visible")
        .first()
        .type(query);
}

/** The results popover is rendered in a portal, outside `<main>`. */
function resultLinks() {
    return cy.get(".nextra-search-results a", { timeout: 20000 });
}

describe("Documentation search", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit("/");
    });

    it("finds a reference page by component name", () => {
        search("cobwebPolyline");
        resultLinks()
            .filter('[href*="/reference/cobwebPolyline"]')
            .should("have.length.at.least", 1);
    });

    /**
     * `defaultPoint` is an attribute of `<cobwebPolyline>`. Neither its name nor
     * the wording below appears in `content/reference/cobwebPolyline.mdx`: both
     * come from the schema, injected at build time and rendered by
     * `<AttrPropDisplay>`. Matching them is what the old FlexSearch index could
     * not do, and it is the acceptance criterion for #2001.
     */
    it("indexes attribute descriptions that only the schema-driven components render", () => {
        search("newly added points on the cobweb");
        resultLinks()
            .filter('[href*="/reference/cobwebPolyline"]')
            .should("have.length.at.least", 1);
    });
});
