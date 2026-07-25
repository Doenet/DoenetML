describe("Chrome translation Tests", { tags: ["@group5"] }, function () {
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
     * attempts-remaining message.
     */
    const problem = `
    <problem sectionWideCheckWork maxNumAttempts="2" name="prob">
      <p><answer name="ans"><textInput name="ti" /><award>hello</award></answer></p>
    </problem>`;

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
        render({ doenetML: problem, uiLocale: "es" });

        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "quedan 2 intentos",
        );

        submitWrongAnswer();

        cy.get("#prob_button").should("contain.text", "Incorrecto");
        // The plural form is the target language's, not a translation of
        // English's: Spanish puts the verb first and inflects it.
        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "queda 1 intento",
        );
    });

    it("follows an authored <document lang> when no uiLocale is set", () => {
        // A fully Spanish activity is fully Spanish without the host
        // configuring anything.
        render({ doenetML: `<document lang="es">${problem}</document>` });

        cy.get(".doenet-viewer").should("have.attr", "lang", "es");
        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "quedan 2 intentos",
        );
    });

    it("lets uiLocale override the content's language", () => {
        // A Spanish-speaking student may work a French problem: the chrome
        // answers to the reader, the content to the author.
        render({
            doenetML: `<document lang="fr">${problem}</document>`,
            uiLocale: "es",
        });

        cy.get(".doenet-viewer").should("have.attr", "lang", "fr");
        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "quedan 2 intentos",
        );
    });

    it("negotiates a regional tag down to the locale that exists", () => {
        render({ doenetML: problem, uiLocale: "es-MX" });

        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "quedan 2 intentos",
        );
    });

    it("keeps English for a locale nothing is translated into", () => {
        render({ doenetML: problem, uiLocale: "fr" });

        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "2 attempts remaining",
        );
    });

    it("retranslates in place when uiLocale changes", () => {
        // `uiLocale` is main-thread only: no core rebuild, so the submitted
        // response survives the switch.
        render({ doenetML: problem });

        submitWrongAnswer();
        cy.get("#prob_button").should("contain.text", "Incorrect");

        cy.window().then((win) => {
            win.postMessage({ uiLocale: "es" }, "*");
        });

        cy.get("#prob_button").should("contain.text", "Incorrecto");
        cy.get("#ti_input").should("have.value", "wrong");
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
            // chrome in Spanish and the activity's own prose in French. Here
            // there is no French catalog, so the description stays English
            // rather than being dragged into the reader's language.
            render({
                doenetML: `<document lang="fr">${styled}</document>`,
                uiLocale: "es",
            });

            cy.get("#line").should("have.text", "thick dashed red line");
        });
    });

    describe("pseudo-locale", () => {
        // `en-XA` accents every string that goes through the catalogs.
        // Anything still plain ASCII is a string that was never extracted —
        // the class of bug no key-based lint can see.
        it("accents extracted chrome", () => {
            render({ doenetML: problem, uiLocale: "en-XA" });

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
            // Every entry so far is a string the *worker* computes, which is
            // the honest result of running this sweep: the renderers really
            // are extracted, and what is left belongs to the content locale,
            // a later phase. A renderer-side string appearing here would be a
            // Phase 1 miss and should be extracted instead of listed.
            const KNOWN_UNTRANSLATED = [
                // `submitLabel` / `submitLabelNoCorrectness` — the check-work
                // button's resting label. Public authorable attributes, so
                // translating the default also needs a rule for not
                // overwriting a label the author wrote.
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
                render({ doenetML: chromeFixture, uiLocale: "en-XA" });

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
                render({ doenetML: chromeFixture, uiLocale: "en-XA" });

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
