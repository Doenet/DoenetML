import {
    createHtmlForDoenetEditor,
    createHtmlForDoenetViewer,
} from "../../../src/utils";

// Regression guard for the cold-boot hang: the srcdoc's inline boot module
// used to `import` Comlink from unpkg. An `import` declaration is resolved
// before any of the module body runs, so a CDN fetch that stalled left the
// whole boot script unexecuted and the `iframeReady` handshake unsent — the
// iframe sat on its loading placeholder forever, with no timeout, no error,
// and no console output. Comlink is compiled into the boot script now.
//
// The invariant held here: everything the boot script needs in order to reach
// `iframeReady` is already in the srcdoc. Two things are deliberately exempt.
// The standalone bundle at `standaloneUrl` is fetched over the network by
// design (the host picks its DoenetML version), but the boot script polls for
// it rather than importing it. The module body runs either way, so a fetch
// that never lands ends in a bounded timeout and an explicit error posted to
// the parent instead of permanent silence. The loading-placeholder logo is an
// `<img>`, so it blocks nothing at all.

// The inline boot script is the only `<script type="module">` with nothing
// after `module` — the standalone bundle's tag carries a `src=` attribute.
const INLINE_BOOT_SCRIPT = /<script type="module">([\s\S]*?)<\/script>/;

function bootScriptOf(html: string): string {
    const match = html.match(INLINE_BOOT_SCRIPT);
    expect(match, "srcdoc contains an inline boot script").to.not.be.null;
    return match![1];
}

const STANDALONE_URL = "https://example.com/doenet-standalone.js";
const CSS_URL = "https://example.com/style.css";

const SRCDOCS: [name: string, html: string][] = [
    [
        "viewer",
        createHtmlForDoenetViewer(
            "viewer-1",
            "<p>hello</p>",
            {},
            STANDALONE_URL,
            CSS_URL,
        ),
    ],
    [
        "editor",
        createHtmlForDoenetEditor(
            "editor-1",
            "<p>hello</p>",
            "100%",
            {},
            STANDALONE_URL,
            CSS_URL,
        ),
    ],
];

describe("iframe srcdoc is self-contained", () => {
    for (const [name, html] of SRCDOCS) {
        it(`${name}: nothing gates the boot script on the network`, () => {
            const script = bootScriptOf(html);
            // An `import`/`export` of any kind puts module resolution back in
            // front of the handshake, which is exactly what hung before.
            expect(
                script,
                "boot script has no import/export declaration",
            ).to.not.match(/^\s*(import|export)\b/m);
            expect(
                script,
                "boot script has no dynamic import()",
            ).to.not.include("import(");
            expect(script, "boot script names no URL").to.not.match(
                /https?:\/\//,
            );
            expect(html, "srcdoc never reaches for unpkg").to.not.include(
                "unpkg.com",
            );
        });

        it(`${name}: boot script carries its own copy of Comlink`, () => {
            // Comlink's module-scope symbols are compiled in, rather than
            // arriving as a free `Comlink*` binding supplied by the srcdoc.
            // If a Comlink upgrade ever renames this marker, re-point the
            // assertion at whatever the new compiled-in equivalent is — do
            // not drop it.
            expect(
                bootScriptOf(html),
                "Comlink's own source is compiled into the boot script",
            ).to.include('Symbol("Comlink.proxy")');
        });
    }
});
