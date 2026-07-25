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
    });
});
