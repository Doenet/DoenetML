import { plainTextIncluding, stripBidiIsolates } from "../utils/bidi";
import {
    verifyListItemNumberGutterSide,
    verifyListItemNumbersAlign,
} from "../tagSpecific/utils/listItemNumberAlignment";

/** Any of the four Unicode bidi isolates Fluent wraps a placeable in. */
const ISOLATE = /[\u2066-\u2069]/;

// Covers both halves of the split: chrome, which follows the reader's
// `uiLocale`, and worker-computed content, which follows the document's.
describe("Translation Tests", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    function render({ doenetML, documentLocale, uiLocale }) {
        cy.window().then((win) => {
            win.postMessage({ doenetML, documentLocale, uiLocale }, "*");
        });
    }

    /**
     * A section-wide check-work button, which gives a stable `#prob_button`
     * to assert on without resolving the answer's input index, plus the
     * attempts-remaining message beside it.
     *
     * Both of those follow the *document's* language, not the reader's: an
     * author can name the button from their own prose ("press
     * $ans.submitLabel"), so the button, the sentence pointing at it and the
     * status beside it are one language whatever the reader asked for.
     * `uiLocale` is probed through `<solution>`'s disclosure label instead,
     * which nothing in the document refers to.
     */
    const problem = `
    <problem sectionWideCheckWork maxNumAttempts="2" name="prob">
      <p><answer name="ans"><textInput name="ti" /><award>hello</award></answer></p>
    </problem>`;

    /** A disclosure label, which does follow the reader. */
    const solution = `<solution name="sol"><p>respuesta</p></solution>`;

    function submitWrongAnswer() {
        cy.get("#ti_input").type("wrong");
        cy.get("#prob_button").click();
    }

    it("renders chrome in English by default", () => {
        // The point of shipping the `en` catalog as an exact copy of the
        // strings it replaced: with no locale configured, nothing changes.
        render({ doenetML: problem });

        cy.get("#prob_button").should("contain.text", "Check Work");
        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "2 attempts remaining",
        );

        submitWrongAnswer();

        cy.get("#prob_button").should("contain.text", "Incorrect");
        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "1 attempt remaining",
        );
    });

    it("translates chrome for a host-supplied uiLocale", () => {
        render({ doenetML: solution, uiLocale: "es" });

        cy.get("#sol_button").should("contain.text", "(clic para abrir)");
    });

    it("isolates an interpolated value in translated chrome", () => {
        // Pinned in the DOM, not only at the translator, and pinned as the
        // presence of the marks rather than their absence: every other
        // assertion in this file strips them, so nothing else here would
        // notice if isolation were turned back off.
        //
        // This is what keeps a Latin identifier from visually scrambling the
        // Arabic around it once a right-to-left catalog lands.
        render({ doenetML: problem, documentLocale: "es" });

        cy.get("[data-test=attempts-remaining]")
            .invoke("text")
            .should("match", ISOLATE);
    });

    it("leaves English free of isolation marks", () => {
        // The invariant every phase has held: with nothing configured, the
        // output is byte-identical to what it replaced.
        render({ doenetML: problem });

        cy.get("[data-test=attempts-remaining]")
            .invoke("text")
            .should("contain", "2 attempts remaining")
            .should("not.match", ISOLATE);
    });

    it("translates the check-work widget for the document's language", () => {
        // The whole widget follows the document, so a `documentLocale` with no
        // `uiLocale` moves it. The plural form is the target language's, not a
        // translation of English's: Spanish puts the verb first and inflects
        // it.
        render({ doenetML: problem, documentLocale: "es" });

        // The count is a placeable, so the rendered text carries isolation
        // marks on either side of it in every language but English.
        cy.get("[data-test=attempts-remaining]").should(
            plainTextIncluding("quedan 2 intentos"),
        );

        submitWrongAnswer();

        cy.get("#prob_button").should("contain.text", "Incorrecto");
        cy.get("[data-test=attempts-remaining]").should(
            plainTextIncluding("queda 1 intento"),
        );
    });

    it("follows an authored <document lang> when no uiLocale is set", () => {
        // A fully Spanish activity is fully Spanish without the host
        // configuring anything.
        render({ doenetML: `<document lang="es">${problem}</document>` });

        cy.get(".doenet-viewer").should("have.attr", "lang", "es");
        cy.get("[data-test=attempts-remaining]").should(
            plainTextIncluding("quedan 2 intentos"),
        );
    });

    it("lets uiLocale override the content's language", () => {
        // A Spanish-speaking student may work a French problem: the chrome
        // answers to the reader, the content to the author.
        render({
            doenetML: `<document lang="fr">${solution}</document>`,
            uiLocale: "es",
        });

        cy.get(".doenet-viewer").should("have.attr", "lang", "fr");
        cy.get("#sol_button").should("contain.text", "(clic para abrir)");
    });

    it("negotiates a regional tag down to the locale that exists", () => {
        render({ doenetML: solution, uiLocale: "es-MX" });

        cy.get("#sol_button").should("contain.text", "(clic para abrir)");
    });

    it("keeps English for a locale nothing is translated into", () => {
        // `qaa` is from the ISO 639-3 range reserved for local use (qaa-qtz),
        // so no catalog can ever claim it. This said `fr` until French became
        // a real catalog and started answering; a reserved tag is the version
        // of the assertion that cannot rot.
        render({ doenetML: solution, uiLocale: "qaa" });

        cy.get("#sol_button").should("contain.text", "(click to open)");
    });

    it("retranslates in place when uiLocale changes", () => {
        // `uiLocale` is main-thread only: no core rebuild, so whatever the
        // reader had typed survives the switch. Probed on a disclosure label
        // rather than the check-work button, which follows the document and so
        // does not move when the reader's language does.
        render({ doenetML: `${solution}${problem}` });

        submitWrongAnswer();
        cy.get("#sol_button").should("contain.text", "(click to open)");

        cy.window().then((win) => {
            win.postMessage({ uiLocale: "es" }, "*");
        });

        cy.get("#sol_button").should("contain.text", "(clic para abrir)");
        cy.get("#ti_input").should("have.value", "wrong");
        // The button did not follow: it answers to the document.
        cy.get("#prob_button").should("contain.text", "Incorrect");
    });

    it("translates disclosure panels", () => {
        render({
            doenetML: `
    <solution name="sol"><p>respuesta</p></solution>
    <feedback name="fb" condition="true"><p>bien</p></feedback>`,
            uiLocale: "es",
        });

        cy.get("#sol_button").should("contain.text", "(clic para abrir)");
        cy.get("#sol_button").click();
        cy.get("#sol_button").should("contain.text", "(clic para cerrar)");

        // The other disclosure panel: its heading is chrome, its body is the
        // author's.
        cy.get(".feedback").should("contain.text", "Comentarios");
        cy.get("#fb").should("have.text", "bien");
    });

    it("translates the other two panels that share the click-to-open label", () => {
        // `<hint>` and a collapsible `<section>` render the same parenthetical
        // `<solution>` does, from the same pair of keys.
        render({
            doenetML: `
    <hint name="h"><title>Pista</title><p>ayuda</p></hint>
    <section name="sec" collapsible><title>Parte</title><p>contenido</p></section>`,
            uiLocale: "es",
        });

        cy.get("#h [data-test=hint-heading]").should(
            "contain.text",
            "(clic para abrir)",
        );
        cy.get("#h [data-test=hint-heading]").click();
        cy.get("#h [data-test=hint-heading]").should(
            "contain.text",
            "(clic para cerrar)",
        );

        // A collapsible section starts open (`startOpen` defaults to true),
        // so this one runs the other way around.
        cy.get("#sec_title").should("contain.text", "(clic para cerrar)");
        cy.get("#sec_title").click();
        cy.get("#sec_title").should("contain.text", "(clic para abrir)");
    });

    it("translates the virtual keyboard tray, which lives in its own root", () => {
        // The tray is rendered into a separate React root shared by every
        // viewer on the page, so context cannot reach it — this asserts the
        // prop-drilled translator arrives.
        render({ doenetML: `<p name="p">hola</p>`, uiLocale: "es" });

        cy.get("#p").should("have.text", "hola");
        cy.get(".open-keyboard-button").should(
            "have.attr",
            "aria-label",
            "Abrir el teclado",
        );
        cy.get(".open-keyboard-button").click();
        cy.get(".close-keyboard-button").should(
            "have.attr",
            "aria-label",
            "Cerrar el teclado",
        );
    });

    describe("style descriptions", () => {
        // Content, not chrome: computed in the worker and following the
        // language the activity was written in. This is the whole path —
        // `setLocaleData`, the document's locale, the worker's translator —
        // rather than the composition, which the unit suites cover.
        const styled = `
        <setup>
          <styleDefinition styleNumber="1" lineColor="red" lineWidth="6"
            lineStyle="dashed" markerColor="green" markerStyle="square" />
        </setup>
        <graph>
          <line through="(0,0) (1,1)" name="l" />
          <point name="pt" />
        </graph>
        <p name="line">$l.styleDescriptionWithNoun</p>
        <p name="point">$pt.styleDescriptionWithNoun</p>`;

        it("describes graphics in English by default", () => {
            render({ doenetML: styled });

            cy.get("#line").should("have.text", "thick dashed red line");
            cy.get("#point").should("have.text", "green square");
        });

        it("describes graphics in the content's language", () => {
            render({ doenetML: styled, documentLocale: "es" });

            // Spanish orders the words its own way and agrees the adjectives
            // with the noun's gender — feminine for "línea", masculine for
            // "cuadrado".
            cy.get("#line").should(
                "have.text",
                "línea discontinua gruesa roja",
            );
            cy.get("#point").should("have.text", "cuadrado verde");
        });

        it("follows the content's language, not the reader's", () => {
            // A Spanish-speaking student working a French activity reads the
            // chrome in Spanish and the activity's own prose in French. The
            // description is content, so it answers to the document.
            //
            // This asserted English until French became a real catalog, when
            // "not the reader's" was all it could show. It now pins the whole
            // rule: French because the document is French, and *not* Spanish
            // even though the reader is. It also covers the catalog reaching
            // the worker for a language only an authored `<document lang>`
            // named — the one path where nothing knows the locale until the
            // source has been parsed.
            render({
                doenetML: `<document lang="fr">${styled}</document>`,
                uiLocale: "es",
            });

            cy.get("#line").should(
                "have.text",
                "ligne épaisse discontinue rouge",
            );
        });

        it("puts the noun first where the language does", () => {
            // Arabic's adjectives follow their noun instead of preceding it,
            // and agree with it in gender. Both halves are visible here:
            // «خط» leads its three adjectives, and each of them is the
            // masculine form the noun governs.
            render({ doenetML: styled, documentLocale: "ar" });

            cy.get("#line").should("have.text", "خط أحمر متقطع سميك");
            cy.get("#point").should("have.text", "مربع أخضر");
        });
    });

    describe("nested documents", () => {
        // A nested `<document lang>` resolves in the core and translates the
        // prose the core computes; this is the other half — the DOM has to say
        // so too, or a screen reader pronounces Spanish content with an
        // English voice.
        //
        // The inner document computes a style description, so one activity
        // exercises both halves at once: the prose the core translated, and
        // the language the DOM declares over it.
        function nested(innerLang) {
            const lang = innerLang ? ` lang="${innerLang}"` : "";
            return `
        <document lang="en">
          <document name="inner"${lang}>
            <setup>
              <styleDefinition styleNumber="1" lineColor="red" lineWidth="6"
                lineStyle="dashed" />
            </setup>
            <graph><line through="(0,0) (1,1)" name="l" /></graph>
            <p name="desc">$l.styleDescriptionWithNoun</p>
          </document>
        </document>`;
        }

        it("labels a nested document with its own language", () => {
            render({ doenetML: nested("es") });

            cy.get("#desc").should(
                "have.text",
                "línea discontinua gruesa roja",
            );
            // The wrapper still speaks for the activity as a whole; the inner
            // document declares the difference on its own subtree.
            cy.get(".doenet-viewer").should("have.attr", "lang", "en");
            cy.get("#inner").should("have.attr", "lang", "es");
        });

        it("says nothing where a nested document inherits", () => {
            // The wrapper already declares this subtree's language; repeating
            // it on every nested section would add nothing.
            render({ doenetML: nested() });

            cy.get("#desc").should("have.text", "thick dashed red line");
            cy.get("#inner").should("not.have.attr", "lang");
        });
    });

    describe("diagnostics", () => {
        // Neither chrome nor content: raised in the worker, read by whoever is
        // looking at the screen. So they follow `uiLocale` even though the
        // core produced them, which it can only do because the record carries
        // a code and its arguments rather than a finished sentence.
        const overprescribed = `
        <graph>
          <lineSegment name="l" endpoints="(1,2) (4,5)" slope="1" length="3" />
        </graph>
        <p name="ready">ready</p>`;

        const ignoredInEnglish =
            "slope and length are ignored when two endpoints are specified";
        const ignoredInSpanish =
            "slope y length se ignoran cuando se especifican los dos extremos";

        /**
         * Assert on a field of the diagnostics the viewer is holding.
         *
         * Through `should` rather than `then`, so it retries: the records
         * arrive with the core's first result, which is not tied to any
         * element being on screen.
         *
         * Bidi marks are stripped because a diagnostic in any language but
         * English isolates its placeables, and the ignored attributes here are
         * one. The comparison is exact once they are out.
         */
        function shouldHaveDiagnostic(field, value) {
            cy.window().should((win) => {
                const diagnostics = win.returnDiagnostics1?.() ?? [];
                expect(
                    diagnostics.map((d) => stripBidiIsolates(String(d[field]))),
                ).to.include(value);
            });
        }

        it("reports diagnostics in English by default", () => {
            render({ doenetML: overprescribed });

            cy.get("#ready").should("have.text", "ready");
            shouldHaveDiagnostic("message", ignoredInEnglish);
        });

        it("reports diagnostics in the reader's language", () => {
            render({ doenetML: overprescribed, uiLocale: "es" });

            cy.get("#ready").should("have.text", "ready");
            shouldHaveDiagnostic("message", ignoredInSpanish);
        });

        it("follows the reader's language, not the content's", () => {
            // The mirror image of the style-description case above: a Spanish
            // reader working a French activity gets the activity's prose in
            // French and its warnings in Spanish.
            render({
                doenetML: `<document lang="fr">${overprescribed}</document>`,
                uiLocale: "es",
            });

            cy.get("#ready").should("have.text", "ready");
            shouldHaveDiagnostic("message", ignoredInSpanish);
        });

        it("keeps the stable code on the record", () => {
            render({ doenetML: overprescribed, uiLocale: "es" });

            cy.get("#ready").should("have.text", "ready");
            shouldHaveDiagnostic("code", "doenet-i0001");
        });
    });

    describe("direction", () => {
        // `en-XB` renders exactly the text `en-XA` does and differs only in
        // being right-to-left, so anything that moves between the two runs
        // moved because of the layout and not because the words changed.
        // Everything here would otherwise have to wait on an Arabic catalog.
        const RTL = "en-XB";

        /**
         * Sections numbered as list items — the hanging-number layout that has
         * been the recurring alignment hotspot. Items of deliberately
         * different lengths, since the whole risk is that the number's
         * position ends up depending on the content beside it.
         */
        const listItems = `
        <problems name="problems">
          <problem name="p1"><p>short</p></problem>
          <problem name="p2"><p>a rather longer line of text that will wrap around onto a second line</p></problem>
          <problem name="p3"><p>medium length</p></problem>
        </problems>
        <p name="ready">ready</p>`;

        it("labels the document with its direction, beside its language", () => {
            render({ doenetML: solution, documentLocale: RTL });

            cy.get(".doenet-viewer").should("have.attr", "lang", RTL);
            cy.get(".doenet-viewer").should("have.attr", "dir", "rtl");
        });

        it("renders a real right-to-left language, not only the pseudo-locale", () => {
            // What the mechanics were built for. `en-XB` can only ever show
            // the layout half of this; the words being Arabic as well is the
            // part a catalog had to land for.
            //
            // The attempts count is Arabic's dual, a category English has no
            // branch for and whose variant carries no placeable at all — so
            // this also pins that the plural rules being consulted are the
            // reader's and not the source language's.
            render({ doenetML: problem, documentLocale: "ar" });

            cy.get(".doenet-viewer")
                .should("have.attr", "lang", "ar")
                .should("have.attr", "dir", "rtl");
            cy.get("#prob_button").should("contain.text", "تحقق من الإجابة");
            cy.get("[data-test=attempts-remaining]").should(
                plainTextIncluding("بقيت محاولتان"),
            );
        });

        it("says left-to-right for a left-to-right language", () => {
            // Not merely absent: an explicit `ltr` is what stops a
            // right-to-left host page from turning an English activity around.
            render({ doenetML: solution, documentLocale: "es" });

            cy.get(".doenet-viewer").should("have.attr", "dir", "ltr");
        });

        it("turns the chrome without turning the content", () => {
            // The two locales are separate attributes for this case: a reader
            // whose language runs the other way from the activity's.
            render({ doenetML: solution, documentLocale: "es", uiLocale: RTL });

            cy.get(".doenet-viewer").should("have.attr", "dir", "ltr");
            // The wrapper around the viewer is the chrome's root, and carries
            // the reader's tag. `closest` because it is the nearest ancestor
            // with a theme; nothing inside `.doenet-viewer` has one.
            cy.get(".doenet-viewer")
                .closest("[data-theme]")
                .should("have.attr", "lang", RTL)
                .should("have.attr", "dir", "rtl");
            // And the keyboard tray, which is outside the React tree entirely
            // and so has to be told rather than inherit.
            cy.get("#virtual-keyboard-tray").should("have.attr", "dir", "rtl");
        });

        it("keeps the notation left-to-right inside a right-to-left document", () => {
            // The reason this is a `dir` attribute per island rather than one
            // on the wrapper: mathematics does not mirror.
            render({
                doenetML: `
                <graph name="g"><point name="P">(1,2)</point></graph>
                <p><mathInput name="mi" /></p>
                <p><slider name="s" from="0" to="10" /></p>
                <p><subsetOfRealsInput name="sori" /></p>
                <orbitalDiagramInput name="od" />
                <p name="ready">ready</p>`,
                documentLocale: RTL,
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get(".doenet-viewer").should("have.attr", "dir", "rtl");
            // Asserting the *computed* direction, so an island that stopped
            // being pinned would fail here even if some ancestor still said
            // `ltr` for another reason. The slider, number line and orbital
            // diagram are the `ltrIslandProps()` sites; the rest pin
            // themselves.
            cy.get(".jxgbox").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
            cy.get("#mi .mq-editable-field").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
            cy.get("#s").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
            cy.get("#sori").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
            cy.get("#od").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
            cy.get(".virtual-keyboard").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
        });

        it("keeps the math input's preview left-to-right too", () => {
            // The preview draws the same notation as the field it previews,
            // and its popover does not portal — so inside a right-to-left
            // document this div is the sharp case among the islands: it is
            // the scroll container for a long expression, and an RTL scroll
            // container opens at the tail with `scrollLeft` running from the
            // negatives up to zero, which inverts the renderer's Home/End
            // handling.
            render({
                doenetML: `
                <p><mathInput name="mi" showPreview /></p>
                <p name="ready">ready</p>`,
                documentLocale: RTL,
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get("#mi textarea").type("x+1", { force: true });
            cy.get("#mi [data-test='MathInput Preview']").should("be.visible");
            cy.get("#mi-preview").should(($el) => {
                expect(getComputedStyle($el[0]).direction).to.equal("ltr");
            });
        });

        it("hangs list-item numbers off the side the text starts from", () => {
            // The layout that has been reworked five times. Asserted as the
            // outcome — sibling numbers line up — rather than as a technique,
            // and measured from the starting edge so it means the same thing
            // in both directions.
            render({ doenetML: listItems, documentLocale: RTL });

            cy.get("#ready").should("have.text", "ready");
            verifyListItemNumbersAlign(["p1", "p2", "p3"], {
                label: "right-to-left document",
            });
            // And the numbers really are on the other side: aligning with each
            // other is something a uniformly wrong layout would also manage.
            verifyListItemNumberGutterSide("p1", "rtl");
        });

        it("still hangs them off the left in a left-to-right document", () => {
            // The mirror of the assertion above, so a change that fixed one
            // direction by breaking the other cannot pass.
            render({ doenetML: listItems, documentLocale: "es" });

            cy.get("#ready").should("have.text", "ready");
            verifyListItemNumbersAlign(["p1", "p2", "p3"], {
                label: "left-to-right document",
            });
            verifyListItemNumberGutterSide("p1", "ltr");
        });

        it("re-declares chrome inside a nested right-to-left document", () => {
            // A nested `<document lang>` turns its own subtree around, so it
            // is what the chrome drawn inside *it* has to agree with — not the
            // activity, which is still left-to-right here and would report no
            // disagreement at all.
            render({
                doenetML: `
                <document lang="en">
                  <document name="inner" lang="${RTL}">
                    <solution name="sol"><p>answer</p></solution>
                  </document>
                </document>`,
            });

            cy.get(".doenet-viewer").should("have.attr", "dir", "ltr");
            cy.get("#inner").should("have.attr", "dir", "rtl");
            // The disclosure label is the reader's English inside that
            // right-to-left box, so it says so on its own span. The icon
            // beside it is an `<svg>`, so this is the only span in the
            // heading.
            cy.get("#sol_button span")
                .should("contain.text", "(click to open)")
                .should("have.attr", "dir", "ltr")
                .should("have.attr", "lang", "en");
        });

        it("republishes the direction at every level of nesting", () => {
            // Doubly nested: the middle document turns the subtree around and
            // the innermost turns it back. Chrome compares itself against the
            // box *nearest* to it, so the innermost document's disclosure
            // label — English chrome in an English box — has nothing to
            // re-declare, even though the document around that box runs the
            // other way. A `dir` on it here would mean the innermost document
            // failed to republish what it had just declared.
            render({
                doenetML: `
                <document lang="en">
                  <document name="mid" lang="${RTL}">
                    <document name="inner" lang="en">
                      <solution name="sol"><p>answer</p></solution>
                    </document>
                  </document>
                </document>`,
            });

            cy.get("#mid").should("have.attr", "dir", "rtl");
            cy.get("#inner").should("have.attr", "dir", "ltr");
            cy.get("#sol_button span")
                .should("contain.text", "(click to open)")
                .should("not.have.attr", "dir");
        });

        it("re-declares a pretzel's answer label in a right-to-left document", () => {
            // The same mixed-heading shape as a hint, at a different renderer:
            // the "Answer" label and its colon are the reader's English, the
            // answer beside them is the author's. Without the re-declaration
            // the colon lands on the wrong end of the label. `uiLocale` is
            // explicit because with nothing configured the chrome follows the
            // document — and then the two directions agree and nothing needs
            // saying.
            render({
                doenetML: `
                <pretzel name="pz">
                  <problem><statement>1</statement><answer>1</answer></problem>
                  <problem><statement>2</statement><answer>2</answer></problem>
                </pretzel>
                <p name="ready">ready</p>`,
                documentLocale: RTL,
                uiLocale: "en",
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get('[data-test="pretzel-row-answer"] > span')
                .first()
                .should("contain.text", "Answer")
                .should("have.attr", "dir", "ltr")
                .should("have.attr", "lang", "en");
        });
    });

    describe("pseudo-locale", () => {
        // `en-XA` accents every string that goes through the catalogs.
        // Anything still plain ASCII is a string that was never extracted —
        // the class of bug no key-based lint can see.
        it("accents extracted chrome", () => {
            // Both locales: the viewer draws from two now. The check-work
            // widget follows the document, and its renderer-side strings
            // resolve through the same chrome catalog the pseudo-locale is
            // derived from, so they accent when `documentLocale` does.
            render({
                doenetML: problem,
                uiLocale: "en-XA",
                documentLocale: "en-XA",
            });

            cy.get("[data-test=attempts-remaining]")
                .invoke("text")
                .should("include", "»")
                .and("include", "«")
                .and("not.include", "attempts remaining");

            cy.get("#ti_input").type("wrong");
            cy.get("#prob_button").click();

            cy.get("#prob_button")
                .invoke("text")
                .should("match", /[^\x00-\x7F]/)
                .and("not.include", "Incorrect");
        });

        it("leaves authored content alone", () => {
            // Only chrome goes through the catalogs; the author's own words
            // must come through exactly as written.
            render({
                doenetML: `<p name="p">plain content</p>`,
                uiLocale: "en-XA",
            });

            cy.get("#p").should("have.text", "plain content");
        });

        // The two tests above can only confirm that strings we already know
        // about were extracted. The bug they cannot see is the opposite one:
        // a string still hard-coded in a renderer, which no key-based lint can
        // detect either, because both directions of `lint:i18n` start from
        // something already in the catalogs. This sweep is the detector —
        // under `en-XA` every string that went through a catalog is accented
        // and bracketed, so any plain-ASCII word left in the chrome never did.
        describe("sweep", () => {
            // Authored text would be indistinguishable from unextracted
            // chrome, so this fixture writes none: its filler is `•`, its
            // inputs are left empty, and every English word the viewer
            // renders therefore belongs to us.
            const chromeFixture = `
    <problem sectionWideCheckWork maxNumAttempts="2" name="prob">
      <p><answer name="ans"><textInput name="ti" /><award>•</award></answer></p>
      <p><answer name="ans2"><choiceInput name="ci">
        <choice credit="1">•</choice><choice>••</choice>
      </choiceInput></answer></p>
      <p><matrixInput name="mx" numRows="2" numColumns="2" /></p>
      <solution name="sol"><p>•</p></solution>
      <hint name="h"><title>•</title><p>•</p></hint>
      <feedback name="fb" condition="true"><p>•</p></feedback>
      <section name="sec" collapsible><title>•</title><p>•</p></section>
    </problem>`;

            // Two or more consecutive ASCII letters. One letter is not enough
            // to judge: `R` (the reals) and a matrix's index labels are
            // mathematical notation, not prose, and are deliberately left
            // untranslated.
            const ASCII_WORD = /[A-Za-z]{2,}/;

            // Subtrees this sweep cannot judge, for two different reasons.
            //
            // Third-party widgets build their own DOM — MathQuill a math
            // field, JSXGraph and prefigure an SVG, MathJax its rendered
            // output — and whatever English is in there was never ours to
            // extract. `svg` also covers the graph controls, whose labels are
            // a documented Phase 1 deferral; when they move, drop it here and
            // this sweep starts guarding them.
            //
            // `style` and `script` hold code, not prose. Their text is full
            // of ASCII words and none of it reaches a reader.
            const FOREIGN_SUBTREES = [
                ".mq-editable-field",
                ".mq-math-mode",
                ".jxgbox",
                "svg",
                "mjx-container",
                "style",
                "script",
            ].join(",");

            // Attributes that reach a reader — through a screen reader or a
            // tooltip — and so have to be translated like visible text.
            const TEXT_ATTRIBUTES = [
                "aria-label",
                "title",
                "alt",
                "placeholder",
            ];

            // Reader-visible English this sweep tolerates, each for a stated
            // reason. Deleting an entry is how a later phase turns the sweep
            // into that string's guard, so the list is a deferral made
            // executable rather than a note in a PR description.
            //
            // Every entry is a string the *worker* computes, which is the
            // honest result of running this sweep: the renderers really are
            // extracted, and what is left belongs to the content locale. A
            // renderer-side string appearing here would be a miss and should
            // be extracted instead of listed.
            //
            // The sweep drives both locales at `en-XA`, so a string is only
            // left in English if the *worker* produced it: `createTranslator-
            // FromLocaleData` has no pseudo-locale, and the content catalogs
            // have no `en-XA`, so a content locale of `en-XA` negotiates
            // straight back to English. Renderer-side strings accent either
            // way, whichever locale they answer to.
            const KNOWN_UNTRANSLATED = [
                // `submitLabel` / `submitLabelNoCorrectness` — the check-work
                // button's resting label, computed by the worker. The rest of
                // that widget follows the document too but is drawn by the
                // renderer from the chrome catalog, so it accents and this
                // sweep guards it. Deleting these two entries needs a pseudo
                // content catalog, not another extraction.
                // (doenetml-worker-javascript/src/utils/answer.js)
                /Check Work/g,
                /Submit Response/g,

                // `sectionName`, with the auto-numbering a sectioning
                // component applies when the author writes no <title>.
                // (components/Solution.js, and its siblings)
                /Problem \d+/g,
                /Solution/g,

                // A matrix cell's accessible short description.
                // (components/MatrixInput.js)
                /row \d+, column \d+/g,
            ];

            const stripKnown = (text) =>
                KNOWN_UNTRANSLATED.reduce(
                    (rest, allowed) => rest.replace(allowed, ""),
                    text,
                );

            /** Whether `text` holds English that should have been translated. */
            const isUnextracted = (text) => ASCII_WORD.test(stripKnown(text));

            /**
             * Every reader-visible string in `root` that is still plain
             * English, as `{ where, text }` pairs.
             *
             * Returns the offenders rather than asserting, so a failure can
             * name them: "3 unextracted strings" is not actionable, but
             * `button#prob_button: "Check Work"` is.
             */
            function findUnextracted(root) {
                const foreign = new Set(
                    root.querySelectorAll(FOREIGN_SUBTREES),
                );
                const inForeignSubtree = (node) => {
                    for (let el = node; el && el !== root.parentElement;) {
                        if (foreign.has(el)) {
                            return true;
                        }
                        el = el.parentElement;
                    }
                    return false;
                };

                const describeNode = (el) =>
                    el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "");

                const offenders = [];

                // `root.ownerDocument`, not `document`: the app runs in
                // Cypress's iframe, and the spec's own document is a
                // different one.
                const walker = root.ownerDocument.createTreeWalker(
                    root,
                    NodeFilter.SHOW_TEXT,
                );
                for (
                    let node = walker.nextNode();
                    node;
                    node = walker.nextNode()
                ) {
                    if (
                        isUnextracted(node.nodeValue) &&
                        !inForeignSubtree(node)
                    ) {
                        offenders.push({
                            where: describeNode(node.parentElement),
                            text: node.nodeValue.trim(),
                        });
                    }
                }

                const attributeSelector = TEXT_ATTRIBUTES.map(
                    (name) => `[${name}]`,
                ).join(",");
                for (const el of root.querySelectorAll(attributeSelector)) {
                    if (inForeignSubtree(el)) {
                        continue;
                    }
                    for (const name of TEXT_ATTRIBUTES) {
                        const value = el.getAttribute(name);
                        if (value && isUnextracted(value)) {
                            offenders.push({
                                where: `${describeNode(el)}[${name}]`,
                                text: value,
                            });
                        }
                    }
                }

                return offenders;
            }

            /** How many strings in `root` did come from a catalog. */
            function countTranslated(root) {
                return (root.textContent.match(/»/g) ?? []).length;
            }

            function sweep(label) {
                cy.get(".doenet-viewer").then(([root]) => {
                    const offenders = findUnextracted(root);
                    const report = offenders
                        .map((o) => `  ${o.where}: ${JSON.stringify(o.text)}`)
                        .join("\n");
                    expect(
                        offenders,
                        `${label}: chrome still hard-coded in English —\n${report}\n`,
                    ).to.be.empty;

                    // Guard against a vacuous pass: a viewer that rendered
                    // nothing, or a locale that silently fell back to English,
                    // would have no ASCII words either.
                    expect(
                        countTranslated(root),
                        `${label}: strings that went through a catalog`,
                    ).to.be.greaterThan(4);
                });
            }

            it("finds no hard-coded English in the chrome as first rendered", () => {
                render({
                    doenetML: chromeFixture,
                    uiLocale: "en-XA",
                    documentLocale: "en-XA",
                });

                // Wait for a string only the catalogs can produce, so the
                // sweep cannot race the first paint.
                cy.get("[data-test=attempts-remaining]").should(
                    "contain.text",
                    "»",
                );
                sweep("initial render");
            });

            it("finds no hard-coded English in the chrome after submitting", () => {
                // Validation states, the attempts counter and the feedback a
                // submission reveals are chrome that does not exist until the
                // reader acts, so the first sweep cannot see them.
                render({
                    doenetML: chromeFixture,
                    uiLocale: "en-XA",
                    documentLocale: "en-XA",
                });

                cy.get("[data-test=attempts-remaining]").should(
                    "contain.text",
                    "»",
                );
                cy.get("#ti_input").type("wrong");
                cy.get("#prob_button").click();
                cy.get("#prob_button").should("contain.text", "»");

                sweep("after submitting");
            });
        });
    });
});
