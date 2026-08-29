import { cesc } from "@doenet/utils";

/**
 * Inputs drawn inside typeset math.
 *
 * The geometry assertions here are all *relative* — one element against another
 * — never absolute coordinates, which would move with the font, the platform,
 * and any MathJax patch release. What is worth pinning is that the reserved box
 * and the control agree, and that the control survives the expression being
 * re-typeset around it.
 */
describe("Math embedded input tests", { tags: ["@group2"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("an embedded text input renders in place and reaches core", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <textInput name="ti" /> + 3</m></p>
    <p>Value: <text extend="$ti" name="echo" /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#m")).should("have.class", "doenet-math-root");
        cy.get(`${cesc("#m")} .doenet-math-slot input`).should("exist");

        // The typed value goes to core on blur, exactly as it would outside math.
        cy.get(`${cesc("#m")} .doenet-math-slot input`).type("2x{enter}");
        cy.get(cesc("#echo")).should("have.text", "2x");
    });

    it("the control lands on the space reserved for it", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <textInput name="ti" /> + 3</m></p>
    `,
                },
                "*",
            );
        });

        // The reserved box only exists once MathJax has typeset the expression,
        // which is a beat after the control itself renders.
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        cy.get(cesc("#m")).then(($root) => {
            const root = $root[0];
            const slot = root.querySelector(".doenet-math-slot");
            const reserved = root.querySelector("[id*='_mathSlot_']");

            const slotRect = slot.getBoundingClientRect();
            const reservedRect = reserved.getBoundingClientRect();

            // The reservation was made *from* this control's measurement, so
            // the two boxes should coincide, not merely overlap.
            expect(Math.abs(slotRect.left - reservedRect.left)).to.be.lessThan(
                2,
            );
            expect(Math.abs(slotRect.top - reservedRect.top)).to.be.lessThan(2);
            expect(
                Math.abs(slotRect.width - reservedRect.width),
            ).to.be.lessThan(2);
        });
    });

    it("the input survives the expression being re-typeset around it", () => {
        // The reason the controls live in a layer of their own rather than
        // inside the typeset output: that output is replaced wholesale on every
        // re-typeset, which would unmount a focused field.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><mathInput name="coef" prefill="1" /></p>
    <p><m name="m">$coef x = <textInput name="ti" /> + 3</m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} .doenet-math-slot input`).type("abc");

        let fieldBefore;
        cy.get(`${cesc("#m")} .doenet-math-slot input`).then(($input) => {
            fieldBefore = $input[0];
        });

        // Change something the expression depends on, forcing a re-typeset.
        cy.get(`${cesc("#coef")} textarea`).type("{end}7{enter}", {
            force: true,
        });
        cy.get(cesc("#m")).should("contain.html", "7");

        // The very same element is still in the document, still holding what
        // was typed — it was never unmounted and remounted, which is what would
        // have cost a reader their caret and their open dropdown.
        cy.get(`${cesc("#m")} .doenet-math-slot input`).then(($input) => {
            expect($input[0], "the field is the same element").to.equal(
                fieldBefore,
            );
            expect($input[0].value).to.equal("abc");
        });
    });

    it("an embedded input is named by the expression it sits in", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <textInput name="ti" /> + 3</m></p>
    `,
                },
                "*",
            );
        });

        // MathJax reads a reserved space as nothing, so the control has to carry
        // the expression itself as its accessible name.
        cy.get(`${cesc("#m")} .doenet-math-slot input`)
            .invoke("attr", "aria-label")
            .should("contain", "blank");
    });

    it("a label names an embedded input and its short description describes it", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <textInput name="ti">
      <label>the missing term</label>
      <shortDescription>a monomial in x</shortDescription>
    </textInput> + 3</m></p>
    `,
                },
                "*",
            );
        });

        // The label is kept out of sight, not left out: it still names the
        // input through `aria-labelledby`, and the short description keeps its
        // usual role as the description.
        cy.get(`${cesc("#m")} .doenet-math-slot label`)
            .should("have.class", "visually-hidden")
            .and("have.text", "the missing term")
            .invoke("attr", "id")
            .then((labelId) => {
                cy.get(`${cesc("#m")} .doenet-math-slot input`)
                    .should("have.attr", "aria-labelledby", labelId)
                    .and("have.attr", "aria-description", "a monomial in x")
                    .and("not.have.attr", "aria-label");
            });
    });

    it("a math label kept out of sight is not a tab stop", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">y = <textInput name="ti">
      <label>the <m>x^2</m> coefficient</label>
    </textInput> x^2</m></p>
    `,
                },
                "*",
            );
        });

        // MathJax gives every expression it typesets a tab stop; the hidden
        // label's is taken away, so a keyboard user does not land on nothing.
        cy.get(`${cesc("#m")} .doenet-math-slot label mjx-container`).should(
            "have.attr",
            "tabindex",
            "-1",
        );
        cy.get(`${cesc("#m")} .doenet-math-slot input`).should(
            "have.attr",
            "aria-labelledby",
        );
    });

    it("an aligned display keeps its rows aligned around a blank", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <md name="md">
      <mrow>f(x) &amp;= x^2</mrow>
      <mrow>g(x) &amp;= <textInput name="ti" /></mrow>
      <mrow>h(x) &amp;= 2</mrow>
    </md>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#md")} [id*='_mathSlot_']`).should("exist");

        cy.get(cesc("#md")).then(($root) => {
            const root = $root[0];
            const slot = root.querySelector(".doenet-math-slot");
            const reserved = root.querySelector("[id*='_mathSlot_']");
            // The typeset output, not the root span: the root is an inline box
            // wrapping display math, so its own border box says little about
            // where the rows are.
            const display = root.querySelector("mjx-container");

            const slotRect = slot.getBoundingClientRect();
            const reservedRect = reserved.getBoundingClientRect();
            const displayRect = display.getBoundingClientRect();

            // The blank sits on the space the middle row reserved for it, and
            // that space is inside the aligned display.
            expect(Math.abs(slotRect.left - reservedRect.left)).to.be.lessThan(
                2,
            );
            expect(Math.abs(slotRect.top - reservedRect.top)).to.be.lessThan(2);
            expect(reservedRect.top).to.be.greaterThan(displayRect.top - 2);
            expect(reservedRect.bottom).to.be.lessThan(displayRect.bottom + 2);
        });
    });

    it("math with no embedded input keeps its plain markup", () => {
        // The guard on every existing document: nothing about the old path
        // changes just because this feature exists.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">\\sin(x)</m></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#m")).should("exist");
        cy.get(cesc("#m")).should("not.have.class", "doenet-math-root");
        cy.get(`${cesc("#m")} .doenet-math-slot`).should("not.exist");
    });
});
