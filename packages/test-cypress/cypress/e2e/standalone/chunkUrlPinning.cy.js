// E2E proof of the standalone bundle's runtime chunk-URL pinning
// (packages/standalone/scripts/pin-chunk-urls-plugin.ts), exercised against
// the emitted artifact, not the source helper.
//
// public/pinned-cdn-page.html loads `doenet-standalone.js` from a
// jsDelivr-style floating-tag URL. The serving side (standaloneCdnPathsPlugin
// in vite.config.ts) answers floating-specifier requests for the entry ONLY:
// chunks, the worker, the core `.wasm` the worker fetches from beside its own
// script — everything the entry goes on to load — exist solely
// under the exact-version path, exactly like a CDN edge that already resolves
// the floating tag to a newer release than the cached entry came from. So the
// two assertions back each other up: the document can only render if every
// follow-on request was pinned, and the request log shows each one going to
// the exact-version path.

const EXACT_VERSION_PATH = /^\/npm\/@doenet\/standalone@\d+\.\d+\.\d+[^/]*\//;

describe(
    "standalone chunk-URL pinning",
    { tags: ["@group1"], retries: 1 },
    () => {
        it("boots from a floating CDN tag by loading every chunk from the exact-version path", () => {
            /** Pathnames of every CDN-style request the page makes. */
            const requested = [];
            // (Matched against the full URL, hence no ^ anchor.)
            cy.intercept(/\/npm\/@doenet\/standalone@/, (req) => {
                requested.push(new URL(req.url).pathname);
                req.continue();
            });

            cy.visit("/pinned-cdn-page.html");

            // The document renders: the eager chunk and the lazy renderer
            // chunks all loaded even though only the entry exists under the
            // floating tag. (Interaction, not just static text, so the core
            // worker and its `.wasm` — both resolved through the same pinned
            // root — are proven too.)
            cy.get(".doenetml-applet input").first().type("pinned{enter}");
            cy.get(".doenetml-applet").should("contain.text", "Typed: pinned");

            cy.then(() => {
                const entry = "/npm/@doenet/standalone@latest";
                const floating = requested.filter(
                    (p) => !EXACT_VERSION_PATH.test(p),
                );
                const pinnedChunks = requested.filter(
                    (p) => EXACT_VERSION_PATH.test(p) && p.includes("/chunks/"),
                );
                const pinnedWorker = requested.filter(
                    (p) =>
                        EXACT_VERSION_PATH.test(p) &&
                        p.endsWith("/doenetml-worker/index.js"),
                );
                // The core `.wasm` is fetched from inside the worker, beside
                // the worker's own (pinned) script URL — see the loading
                // ladder in @doenet/doenetml-worker's src/wasmLoading.ts.
                const pinnedWasm = requested.filter(
                    (p) =>
                        EXACT_VERSION_PATH.test(p) &&
                        p.endsWith(
                            "/doenetml-worker/lib_doenetml_worker_bg.wasm",
                        ),
                );
                // The floating tag served the entry and nothing else.
                expect(
                    floating.length,
                    "the entry was requested through the floating tag",
                ).to.be.gte(1);
                for (const p of floating) {
                    expect(p, "floating-tag requests beyond the entry").to.eq(
                        `${entry}/doenet-standalone.js`,
                    );
                }
                // The eager chunk plus at least one lazy renderer chunk came
                // from the exact-version path, as did the core worker.
                expect(
                    pinnedChunks.length,
                    `pinned chunk requests (${JSON.stringify(requested)})`,
                ).to.be.gte(2);
                expect(pinnedWorker.length, "pinned worker requests").to.eq(1);
                expect(pinnedWasm.length, "pinned core wasm requests").to.eq(1);
            });
        });
    },
);
