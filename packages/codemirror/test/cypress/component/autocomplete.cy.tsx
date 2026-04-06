import React, { useRef } from "react";
import { CodeMirror } from "../../../src/CodeMirror";

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
            <CodeMirror value={initialValue} languageServerRef={lspRef} />
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
                <CodeMirror value="" />
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
                <CodeMirror value={`<matrix>`} />
            </div>,
        );

        cy.get(".cm-content").click().type("<", { force: true });
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel").first().click();
        cy.get(".cm-line").should("have.text", `<matrix></matrix>`);
    });

    it("inserts element snippets", () => {
        cy.mount(
            <div style={{ height: "400px", width: "600px" }}>
                <CodeMirror value="" />
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
                <CodeMirror value="" />
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
                <CodeMirror value="" />
            </div>,
        );

        cy.get(".cm-content").click().type('<title hide="', { force: true });
        openAutocomplete();
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("true")
            .click();
        cy.get(".cm-line").should("contain.text", 'hide="true"');
    });

    it("keeps cursor at end of completed reference when stale response arrives late", () => {
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
});
