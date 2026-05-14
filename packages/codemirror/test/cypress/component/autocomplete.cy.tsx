import React, { useRef } from "react";
import { CodeMirror } from "../../../src/CodeMirror";
// @ts-ignore — ?raw loads the pre-built inline core worker as a string so we
// can create a blob: URL Worker.  The LSP spawns this worker behind the scenes
// to power $ref / member completions; without a URL the LSP marks the rust
// resolver "unavailable" and every ref test in this spec would fail.
import coreWorkerSource from "@doenet/doenetml-worker/index.js?raw";

const doenetWorkerUrl = URL.createObjectURL(
    new Blob([coreWorkerSource], { type: "application/javascript" }),
);

type LspInstance =
    typeof import("../../../src/extensions/lsp/plugin").uniqueLanguageServerInstance;

type LspRef = {
    lsp: LspInstance;
    documentUri: string;
};

type WindowWithLspRef = Window & {
    __getLspRef?: () => LspRef | null;
};

const AutocompleteTestHarness = ({
    initialValue,
}: {
    initialValue: string;
}) => {
    const lspRef = useRef<LspRef | null>(null);

    React.useEffect(() => {
        (window as WindowWithLspRef).__getLspRef = () => lspRef.current;
        return () => {
            delete (window as WindowWithLspRef).__getLspRef;
        };
    }, []);

    return (
        <div style={{ height: "400px", width: "600px" }}>
            <CodeMirror
                value={initialValue}
                languageServerRef={lspRef}
                doenetWorkerUrl={doenetWorkerUrl}
            />
        </div>
    );
};

/**
 * Tests for the LSP autocomplete plugin (snippets and completions)
 *
 * These tests verify that the CodeMirror editor with LSP plugin is properly
 * set up to provide autocomplete suggestions when typing trigger characters
 * and that snippets are correctly applied with proper indentation.
 */
describe("CodeMirror LSP Autocomplete Plugin", () => {
    let restorePatchedLspMethod: (() => void) | null = null;

    beforeEach(() => {
        restorePatchedLspMethod?.();
        restorePatchedLspMethod = null;
    });

    // Note: this openAutocomplete function repeatedly tries
    // because sometime for the first test of a spec we need to wait on the language server.
    const openAutocomplete = (timeoutMs = 8000): Cypress.Chainable<void> => {
        const start = Date.now();

        const attempt = (): Cypress.Chainable<any> => {
            return cy.get("body").then(($body) => {
                if ($body.find(".cm-tooltip-autocomplete").length > 0) {
                    return;
                }

                if (Date.now() - start > timeoutMs) {
                    throw new Error(
                        "Timed out waiting for autocomplete tooltip",
                    );
                }

                cy.get(".cm-content").type("{ctrl} ", { force: true });
                return cy.wait(250).then(attempt);
            });
        };

        return cy.then(attempt).then(() => {
            cy.get(".cm-tooltip-autocomplete").should("be.visible");
        }) as Cypress.Chainable<void>;
    };

    const waitForLspRef = (): Cypress.Chainable<LspRef> => {
        return cy.window().then((win) => {
            const startTime = Date.now();
            const attempt = (): Promise<LspRef> => {
                const getter = (win as WindowWithLspRef).__getLspRef;
                const ref = typeof getter === "function" ? getter() : null;
                if (ref && ref.lsp) {
                    return Promise.resolve(ref);
                }
                if (Date.now() - startTime > 5000) {
                    throw new Error("Timeout waiting for LSP ref");
                }
                return new Promise((resolve) =>
                    setTimeout(() => resolve(attempt()), 100),
                );
            };
            return attempt();
        });
    };

    it("completes element names in a blank document", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .first()
            .invoke("text")
            .then((label) => {
                const trimmed = label.trim();
                expect(trimmed).to.not.equal("");
                cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
                    .first()
                    .click();
                cy.get(".cm-line").should("contain.text", `<${trimmed}`);
            });
    });

    it("completes element names inside parent", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror
                    value={`
<matrix>
  
</matrix>`}
                    doenetWorkerUrl={doenetWorkerUrl}
                />
            </div>,
        );

        // It works even without openAutocomplete().
        cy.get(".cm-content").click().type("{upArrow}<", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").first().click();
        cy.get(".cm-line").should("contain.text", `<column`);
    });

    it("completes closing tag", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror
                    value={`<matrix>`}
                    doenetWorkerUrl={doenetWorkerUrl}
                />
            </div>,
        );

        cy.get(".cm-content").click().type("<", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").first().click();
        cy.get(".cm-line").should("have.text", `<matrix></matrix>`);
    });

    it("inserts element snippets", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<mul", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("multiple-choice-answer")
            .click();
        cy.get(".cm-content").invoke("text").should("contain", "<answer");
        cy.get(".cm-content").invoke("text").should("contain", "<choice");

        // The snippet should leave "mcq" selected so typing replaces it.
        cy.get(".cm-content").type("quiz", { force: true });
        cy.get(".cm-content").invoke("text").should("contain", 'name="quiz"');
        cy.get(".cm-content")
            .invoke("text")
            .should("not.contain", 'name="mcq"');
    });

    it("completes attribute names", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<title ", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("hide")
            .click();
        cy.get(".cm-line").should("contain.text", "hide");
    });

    it("completes attribute values", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type('<title hide="', { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("true")
            .click();
        cy.get(".cm-line").should("contain.text", 'hide="true"');
    });

    it("offers a wrap-in-quotes hint for a free-text attribute and preserves every typed character", () => {
        // `name` on `<math>` is free-text (no enumerated values). Typing a
        // bare prefix after `=` must pop a single hint whose display label
        // previews the typed value wrapped in quotes -- and accepting it
        // must wrap exactly what was typed, with no characters dropped.
        //
        // Regression: an earlier version anchored the result's `from` at
        // the cursor (one past the first typed character) because the
        // plugin's default `prefixMatch` regex required a literal `"` the
        // user hadn't typed. The menu then read `"ello"` instead of
        // `"hello"` and accepting yielded `name=h"ello"`.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<math name=hello", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").should(
            "have.text",
            '"hello"',
        );
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains('"hello"')
            .click();
        cy.get(".cm-line").should("contain.text", 'name="hello"');
        cy.get(".cm-line").should("not.contain.text", 'name=h"ello"');
    });

    it("shows enumerated attribute values with quoted displayLabel when anchored to `=`", () => {
        // When the cursor is at `=` (no opening `"` yet), the dropdown
        // should preview the canonical quoted form (e.g. `"true"`) since
        // accepting will insert the value wrapped in quotes. The existing
        // `completes attribute values` test only exercises the
        // inside-`"..."` path where the dropdown stays bare; without this
        // test, regressing the displayLabel for the bare-`=` path would
        // go undetected.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<title hide=", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains('"true"')
            .should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains('"true"')
            .click();
        cy.get(".cm-line").should("contain.text", 'hide="true"');
    });

    it("filters enumerated values as a bare prefix is typed past `=`", () => {
        // Typing a bare prefix (no opening `"`) past `=` should narrow the
        // dropdown and accept-with-quotes. Bare matching against the
        // `label` while displaying the quoted form is the core "show this,
        // filter on that" pair introduced in this PR.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<title hide=tr", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").should(
            "have.text",
            '"true"',
        );
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").click();
        cy.get(".cm-line").should("contain.text", 'hide="true"');
    });

    it("does not pop a menu when only `=` has been typed for a free-text attribute", () => {
        // B' design: bare `=` must NOT pop the wrap-in-quotes hint -- an
        // expert who reflexively types `"` right after `=` should never
        // see a stray menu. The hint only fires once the author has typed
        // at least one bare character.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<math name=", { force: true });
        // Wait past the LSP debounce so any (mis)triggered menu would
        // have time to appear.
        cy.wait(400);
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("swallows whitespace between `=` and a bare value on accept", () => {
        // The LSP-side textEdit range anchors at `=+1`, and the plugin's
        // update-generated apply walks back over whitespace to the
        // anchoring `=`. Either path must produce a clean `name="hello"`
        // with no residual spaces. Vitest covers the LSP range; this
        // covers the plugin's document edit end-to-end.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content")
            .click()
            .type("<math name=   hello", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains('"hello"')
            .click();
        cy.get(".cm-line").should("contain.text", 'name="hello"');
        cy.get(".cm-line").should("not.contain.text", 'name=   "hello"');
    });

    it("keeps the value popup open across whitespace between `=` and a bare value", () => {
        // Regression: typing `<math simplify=` opens the value popup, then
        // typing a single space used to close it (gate at `plugin.ts:335`
        // returned `null` because space isn't a server trigger char and
        // there's no preceding identifier), only to reopen on the next
        // keystroke. The popup must stay open continuously while the user
        // types ` full` after `=`.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content").click().type("<math simplify=", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete").should("be.visible");

        cy.get(".cm-content").type(" ", { force: true });
        // The flap: without the post-whitespace-trigger heuristic the popup
        // would briefly close here.
        cy.get(".cm-tooltip-autocomplete").should("be.visible");

        cy.get(".cm-content").type("full", { force: true });
        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").should(
            "have.text",
            '"full"',
        );
    });

    it("does not pop attribute completions on the closing quote of a value", () => {
        // `"` and `'` are server trigger characters because typing the
        // *opening* quote of a value should pop a value popup (e.g.
        // `<math name="`). Typing the *closing* quote (e.g.
        // `<math name="hello"`) used to also pop the popup — showing
        // attribute names — because the gate only looked at the single
        // char before the cursor. That is inconsistent with `<math `
        // (which waits for a letter). The gate now counts prior
        // occurrences of the typed quote between the last `<` and the
        // cursor: an odd count means the typed quote is a closer, so
        // the trigger is suppressed.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content")
            .click()
            .type('<math name="hello"', { force: true });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
        // And a trailing space should keep it closed, matching `<math `.
        cy.get(".cm-content").type(" ", { force: true });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("pops the value popup on the opening quote of a *second* attribute on the same tag", () => {
        // Regression guard for the closing-quote heuristic. An earlier
        // walk-back-to-matching-quote implementation incorrectly classified
        // the opening `"` of `simplify="` here as a closer because the
        // scan found the closing `"` of `name="hello"`. The parity-based
        // heuristic counts prior `"` chars (two, from `name="hello"`) and
        // correctly identifies the typed quote as an opener, so the
        // server trigger fires and value completions surface.
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" doenetWorkerUrl={doenetWorkerUrl} />
            </div>,
        );

        cy.get(".cm-content")
            .click()
            .type('<math name="hello" simplify="', { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        // The `simplify` attribute is boolean-like; expect at least one
        // value completion (e.g. `full`) — anchoring on a specific label
        // would couple the test to schema details, so we just assert the
        // popup has some completion row.
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").should(
            "have.length.greaterThan",
            0,
        );
    });

    it("accepts a ref completion with correct cursor placement when the LSP response is delayed", () => {
        // Smoke test for the end-to-end ref-completion accept flow when
        // the first LSP response is slow. Originally named for a
        // staleness-guard regression, but @codemirror/autocomplete
        // coalesces source calls so only one LSP call fires for the
        // whole `$my` typing burst — there is no second response to
        // race against, so this test does not independently exercise
        // the stale-response handling removed in 488a9b51. Kept as a
        // smoke test that the apply-function's range merge (Math.min /
        // Math.max with the LSP-side textEdit range) places the cursor
        // at the end of the inserted ref even when the response arrives
        // after the typing has moved past the original cursor position.
        cy.mount(
            <AutocompleteTestHarness
                initialValue={'<section name="mySection" />\n'}
            />,
        );

        waitForLspRef().then((ref) => {
            const originalGetCompletionItems = ref.lsp.getCompletionItems.bind(
                ref.lsp,
            );
            let callCount = 0;

            ref.lsp.getCompletionItems = (async (
                ...args: Parameters<typeof originalGetCompletionItems>
            ) => {
                callCount += 1;
                if (callCount === 1) {
                    await new Promise((resolve) => setTimeout(resolve, 300));
                }
                return originalGetCompletionItems(...args);
            }) as typeof ref.lsp.getCompletionItems;

            restorePatchedLspMethod = () => {
                ref.lsp.getCompletionItems = originalGetCompletionItems;
            };
        });

        cy.get(".cm-content").click().type("{ctrl}{end}$my", { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("mySection")
            .click();

        // If cursor placement is wrong (after $), this inserts as "$ZmySection".
        cy.get(".cm-content").type("Z", { force: true });
        cy.get(".cm-content")
            .invoke("text")
            .then((text) => {
                expect(text).to.contain("$mySectionZ");
                expect(text).to.not.contain("$ZmySection");
            });

        cy.then(() => {
            restorePatchedLspMethod?.();
            restorePatchedLspMethod = null;
        });
    });

    it("keeps autocomplete open when backspacing to trigger characters", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n$P.c'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        openAutocomplete();
        cy.get(".cm-content").type("oords", { force: true });

        // Backspace to "$P." and confirm trigger-character completion remains visible.
        cy.get(".cm-content").type(
            "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}",
            {
                force: true,
            },
        );
        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").contains(
            "coords",
        );

        // Backspace to "$" and confirm root ref-name completion remains visible.
        cy.get(".cm-content").type("{backspace}{backspace}", { force: true });
        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").contains("P");
    });

    it("does not duplicate typed suffix when accepting ref completion with Enter", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={'<math name="myMath" />\n'}
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$my{enter}", { force: true, delay: 400 });

        cy.get(".cm-content")
            .invoke("text")
            .then((text) => {
                expect(text).to.contain("$myMath");
                expect(text).to.not.contain("$myMathy");
                expect(text).to.not.contain("$myMathmy");
            });
    });

    it("shows member autocomplete when typing a ref at the start of the file", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '\n<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{home}$P.", { force: true });

        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").contains(
            "coords",
        );
    });

    it("shows member autocomplete after delete-then-dot on a completed ref", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={'<math name="myMath" />\n$my'}
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        openAutocomplete();
        cy.get(".cm-content").type("{enter}", { force: true });

        // Reproduce a delete-then-dot transition ending at the same final text.
        cy.get(".cm-content").type("x{backspace}.", { force: true });
        cy.get(".cm-content").invoke("text").should("contain", "$myMath.");

        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .its("length")
            .should("be.greaterThan", 0);
    });

    it("shows member autocomplete after .( transition on a completed ref", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n$P.'
                }
            />,
        );

        cy.get(".cm-content")
            .click()
            .type("{ctrl}{end}(co", { force: true, delay: 200 });

        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").contains(
            "coords",
        );
    });

    it("reopens autocomplete after deleting back from an unmatched suffix in the same token", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coorx", {
            force: true,
            delay: 200,
        });

        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        cy.get(".cm-content").type("{backspace}", { force: true });

        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").contains(
            "coords",
        );
    });

    it("reopens autocomplete after typing multiple unmatched chars and backspacing to the match", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coorxyz", {
            force: true,
            delay: 120,
        });

        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        cy.get(".cm-content").type("{backspace}{backspace}{backspace}", {
            force: true,
        });

        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").contains(
            "coords",
        );
    });

    it("does not reopen autocomplete after cursor movement away and back", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coorx", {
            force: true,
            delay: 200,
        });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        cy.get(".cm-content").type("{leftArrow}{rightArrow}", {
            force: true,
        });
        cy.get(".cm-content").type("{backspace}", { force: true });

        cy.wait(300);
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("does not reopen autocomplete after a non-tail edit in the token", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coorx", {
            force: true,
            delay: 200,
        });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        // Make and then undo an edit earlier in the token, restoring the same text.
        cy.get(".cm-content").type("{leftArrow}{leftArrow}z{backspace}{end}", {
            force: true,
        });
        cy.get(".cm-content").type("{backspace}", { force: true });

        cy.wait(300);
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("does not reopen autocomplete after edits elsewhere", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coorx", {
            force: true,
            delay: 200,
        });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        cy.get(".cm-content").type("{ctrl}{home}", { force: true });
        cy.get(".cm-content").type(" ", { force: true });
        cy.get(".cm-content").type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("{backspace}", { force: true });

        cy.wait(300);
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("does not reopen autocomplete after explicit dismissal", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coor", {
            force: true,
            delay: 200,
        });
        cy.get(".cm-tooltip-autocomplete").should("be.visible");
        cy.get(".cm-content").type("{esc}", { force: true });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        cy.get(".cm-content").type("x", {
            force: true,
            delay: 200,
        });
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
        cy.get(".cm-content").type("{backspace}", { force: true });

        cy.wait(300);
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("does not reopen autocomplete after typing space then backspacing space and suffix", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<point name="P"><math name="coords">(3,4)</math></point>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$P.coorx ", {
            force: true,
            delay: 200,
        });

        cy.get(".cm-tooltip-autocomplete").should("not.exist");

        cy.get(".cm-content").type("{backspace}{backspace}", { force: true });

        cy.wait(300);
        cy.get(".cm-tooltip-autocomplete").should("not.exist");
    });

    it("inserts $name[] snippet with cursor between brackets for takesIndex elements", () => {
        cy.mount(
            <AutocompleteTestHarness
                initialValue={
                    '<repeat name="rep" numRepetitions="3"><math>x</math></repeat>\n'
                }
            />,
        );

        cy.get(".cm-content").click().type("{ctrl}{end}", { force: true });
        cy.get(".cm-content").type("$re", { force: true });
        openAutocomplete();

        // Select the "rep[]" indexed completion item
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("rep[]")
            .click();

        cy.get(".cm-content")
            .invoke("text")
            .then((text) => {
                // Should insert $rep[], NOT $rep[$1]
                expect(text).to.contain("$rep[");
                expect(text).to.contain("]");
                expect(text).to.not.contain("$1");
            });

        // The cursor should be between the brackets, so typing inserts there.
        cy.get(".cm-content").type("1", { force: true });

        cy.get(".cm-content")
            .invoke("text")
            .then((text) => {
                expect(text).to.contain("$rep[1]");
            });
    });
});
