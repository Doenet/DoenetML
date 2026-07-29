describe("Document language Tests", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    function renderDoenetML(doenetML, documentLocale) {
        cy.window().then((win) => {
            win.postMessage({ doenetML, documentLocale }, "*");
        });
    }

    it("labels the rendered container with an authored lang", () => {
        // A screen reader needs the language to pronounce the content with
        // the right voice and rules — an accessibility win that applies
        // before anything is translated.
        renderDoenetML(
            `<document lang="es-MX"><p name="p">hola</p></document>`,
        );

        cy.get("#p").should("have.text", "hola");
        cy.get(".doenet-viewer").should("have.attr", "lang", "es-MX");
    });

    it("canonicalizes a hand-typed tag", () => {
        // Authors type `lang` by hand, so `ES-mx` has to end up as the tag
        // everything else negotiates against.
        renderDoenetML(
            `<document lang="ES-mx"><p name="p">hola</p></document>`,
        );

        cy.get("#p").should("have.text", "hola");
        cy.get(".doenet-viewer").should("have.attr", "lang", "es-MX");
    });

    it("labels an undeclared document English", () => {
        // The language the activity is actually rendered in: its computed
        // prose and its chrome are English when nobody declared otherwise, so
        // the container says so rather than inheriting the page's `lang`.
        renderDoenetML(`<p name="p">hello</p>`);

        cy.get("#p").should("have.text", "hello");
        cy.get(".doenet-viewer").should("have.attr", "lang", "en");
    });

    it("falls through a blank lang to the host's locale", () => {
        // A blank `lang` counts as unset all the way to the DOM: the label is
        // the host's tag, not the empty one the author typed.
        renderDoenetML(
            `<document lang="  "><p name="p">hallo</p></document>`,
            "de",
        );

        cy.get("#p").should("have.text", "hallo");
        cy.get(".doenet-viewer").should("have.attr", "lang", "de");
    });

    it("exposes the language in effect as the document's locale property", () => {
        renderDoenetML(
            `<document name="doc" lang="fr"><p name="p">bonjour</p><p name="loc">$doc.locale</p></document>`,
        );

        cy.get("#p").should("have.text", "bonjour");
        cy.get("#loc").should("have.text", "fr");
    });
});
