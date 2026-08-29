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

    it("an inline choice input sits in its slot and its selection reaches core", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <choiceInput inline name="ci">
      <choice>1</choice><choice>2</choice>
    </choiceInput> + 3</m></p>
    <p name="chosen">$ci.selectedValue</p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        // Nothing but the control is drawn inside the expression: no label and
        // no check-work button.
        cy.get(`${cesc("#m")} .doenet-math-slot`).within(() => {
            cy.get("label").should("not.exist");
            cy.get("button").should("not.exist");
        });

        cy.get(cesc("#m")).then(($root) => {
            const root = $root[0];
            const slotRect = root
                .querySelector(".doenet-math-slot")
                .getBoundingClientRect();
            const reservedRect = root
                .querySelector("[id*='_mathSlot_']")
                .getBoundingClientRect();
            expect(Math.abs(slotRect.left - reservedRect.left)).to.be.lessThan(
                2,
            );
            expect(Math.abs(slotRect.top - reservedRect.top)).to.be.lessThan(2);
        });

        // The dropdown is portaled to the body, so it opens over the page
        // rather than being clipped by the expression.
        cy.get("#ci_input").type("{downarrow}", { force: true });
        cy.get('[id^="react-select-"][id$="-option-1"]:visible').click();

        cy.get("#chosen").should("have.text", "2");
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
        // Wait for the re-typeset itself: the new coefficient is in the
        // rendered math only once the swap has happened.
        cy.get(`${cesc("#m")} mjx-mn`).should(($mn) => {
            expect([...$mn].map((e) => e.textContent)).to.include("17");
        });

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

    it("a math input sits in its slot and its value reaches core", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <mathInput name="mi" /> + 3</m></p>
    <p name="entered">$mi.latex</p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        // Nothing but the field is drawn inside the expression: no label and
        // no check-work button.
        cy.get(`${cesc("#m")} .doenet-math-slot`).within(() => {
            cy.get("label").should("not.exist");
            cy.get("button").should("not.exist");
        });

        cy.get(cesc("#m")).then(($root) => {
            const root = $root[0];
            const slotRect = root
                .querySelector(".doenet-math-slot")
                .getBoundingClientRect();
            const reservedRect = root
                .querySelector("[id*='_mathSlot_']")
                .getBoundingClientRect();
            expect(Math.abs(slotRect.left - reservedRect.left)).to.be.lessThan(
                2,
            );
            expect(Math.abs(slotRect.top - reservedRect.top)).to.be.lessThan(2);
        });

        // The value reaches core as LaTeX, so the expression it sits in can
        // report it as the mathematics it is rather than as plain text.
        cy.get(`${cesc("#mi")} textarea`).type("\\sqrt{2}{rightarrow}{enter}", {
            force: true,
        });
        cy.get("#entered").should("have.text", "\\sqrt{2}");
    });

    it("the expression makes room in steps, not on every keystroke", () => {
        // The claim the whole growth policy rests on. A math field grows on
        // nearly every keystroke; re-typesetting the expression around each new
        // size would reflow the equation under the reader's hands, so the room
        // reserved for it is given out in steps that several keystrokes fit
        // inside.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <mathInput name="mi" /> + 3</m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        const reserved = [];
        const field = [];
        for (const character of "abcdefghijkl") {
            cy.get(`${cesc("#mi")} textarea`).type(character, { force: true });
            // A re-typeset is asynchronous and throttled, so let one happen if
            // it is going to: the point is how few of them there are.
            cy.wait(150);
            cy.get(cesc("#m")).then(($root) => {
                const root = $root[0];
                reserved.push(
                    Math.round(
                        root
                            .querySelector("[id*='_mathSlot_']")
                            .getBoundingClientRect().width,
                    ),
                );
                field.push(
                    Math.round(
                        root
                            .querySelector(".mq-editable-field")
                            .getBoundingClientRect().width,
                    ),
                );
            });
        }

        cy.then(() => {
            expect(
                new Set(field).size,
                "the field itself grew as the reader typed",
            ).to.be.greaterThan(5);
            expect(
                new Set(reserved).size,
                "but the expression was typeset again only a few times",
            ).to.be.lessThan(5);
            expect(
                reserved.every(
                    (width, ind) => ind === 0 || width >= reserved[ind - 1],
                ),
                "and the room it reserved only ever grew",
            ).to.eq(true);
        });
    });

    it("the expression is held still until the value is committed", () => {
        // `$mi.immediateValue` changes on every keystroke, so without the hold
        // core would push new LaTeX — and MathJax would re-typeset the
        // expression — under the reader's cursor.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">$mi.immediateValue = <mathInput name="mi" /></m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        cy.get(`${cesc("#mi")} textarea`).type("77", { force: true });
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            // The left-hand side is still the blank it started as.
            expect($container[0].textContent).not.to.contain("77");
        });

        cy.get(`${cesc("#mi")} textarea`).type("{enter}", { force: true });

        // Committing lets the expression catch up, without the field having
        // been blurred to do it.
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).to.contain("77");
        });
        cy.get(`${cesc("#mi")} textarea`).should("be.focused");
    });

    it("the expression shows a committed value the reader entered", () => {
        // `$mi` is the *committed* value, so the LaTeX that shows it does not
        // come back from core until after the commit. Catching up therefore
        // means taking whatever core sends next, not what it had already sent
        // when Enter was pressed.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">$mi = <mathInput name="mi" /></m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        cy.get(`${cesc("#mi")} textarea`).type("77", { force: true });
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).not.to.contain("77");
        });

        cy.get(`${cesc("#mi")} textarea`).type("{enter}", { force: true });
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).to.contain("77");
        });
        cy.get(`${cesc("#mi")} textarea`).should("be.focused");
    });

    it("the expression shows a committed text value the reader entered", () => {
        // A text input is held still for the same reason, so it needs the same
        // catching up when the reader commits with Enter.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">$ti = <textInput name="ti" /></m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        cy.get(`${cesc("#m")} .doenet-math-slot input`).type("77");
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).not.to.contain("77");
        });

        cy.get(`${cesc("#m")} .doenet-math-slot input`).type("{enter}");
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).to.contain("77");
        });
        cy.get(`${cesc("#m")} .doenet-math-slot input`).should("be.focused");
    });

    it("the expression shows a choice the reader picked", () => {
        // Picking from the list is itself the commit, and the list keeps the
        // focus afterwards, so the expression has to catch up there too.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">$ci.selectedValue = <choiceInput inline name="ci">
      <choice>7</choice><choice>8</choice>
    </choiceInput></m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        cy.get("#ci_input").type("{downarrow}", { force: true });
        cy.get('[id^="react-select-"][id$="-option-1"]:visible').click();

        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).to.contain("8");
        });
    });

    it("the room a field is given is not taken back while it is being used", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <mathInput name="mi" /> + 3</m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        // Long enough to outgrow the field's own minimum width, which four
        // characters do not.
        cy.get(`${cesc("#mi")} textarea`).type("abcdefghijklmn", {
            force: true,
        });

        let reservedWhileTyping;
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            reservedWhileTyping = $reserved[0].getBoundingClientRect().width;
        });

        // Deleting what was typed must not close the expression back up around
        // a field the reader is still in the middle of using.
        cy.get(`${cesc("#mi")} textarea`).type("{backspace}".repeat(14), {
            force: true,
        });
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            expect($reserved[0].getBoundingClientRect().width).to.be.closeTo(
                reservedWhileTyping,
                1,
            );
        });

        // Leaving does close it up.
        cy.get(`${cesc("#mi")} textarea`).blur();
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            expect($reserved[0].getBoundingClientRect().width).to.be.lessThan(
                reservedWhileTyping,
            );
        });
    });

    it("the room survives focus passing through the keyboard tray", () => {
        // Tapping a key on the virtual keyboard takes focus out of the field,
        // but the reader is still using it — so the expression must not settle
        // yet. This is why the field reports editing from its own focus
        // handling rather than from raw focus events on the slot.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = <mathInput name="mi" /> + 3</m></p>
    <p name="elsewhere">elsewhere</p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");

        cy.get(`${cesc("#mi")} textarea`).type("abcdefghijklmn", {
            force: true,
        });

        let reservedWhileEditing;
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            reservedWhileEditing = $reserved[0].getBoundingClientRect().width;
        });

        cy.get("#virtual-keyboard-tray button").first().focus({ force: true });
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            expect($reserved[0].getBoundingClientRect().width).to.be.closeTo(
                reservedWhileEditing,
                1,
            );
        });

        // Focus leaving both the field and the tray is what ends the editing.
        cy.get(cesc("#elsewhere")).click({ force: true });
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            expect($reserved[0].getBoundingClientRect().width).to.be.lessThan(
                reservedWhileEditing,
            );
        });
    });

    it("a math input fills in a row of an aligned display", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <md name="md">
      <mrow>f(x) \\amp = x^2</mrow>
      <mrow>f'(x) \\amp = <mathInput name="mi" /></mrow>
      <mrow>f''(x) \\amp = 2</mrow>
    </md>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#md")} [id*='_mathSlot_']`).should("exist");

        cy.get(cesc("#md")).then(($root) => {
            const root = $root[0];
            const slotRect = root
                .querySelector(".doenet-math-slot")
                .getBoundingClientRect();
            const reservedRect = root
                .querySelector("[id*='_mathSlot_']")
                .getBoundingClientRect();
            expect(Math.abs(slotRect.left - reservedRect.left)).to.be.lessThan(
                2,
            );
            expect(Math.abs(slotRect.top - reservedRect.top)).to.be.lessThan(2);
        });

        // The whole display is one expression, so the field sits inside the
        // single container the `<md>` typesets.
        cy.get(`${cesc("#md")} mjx-container`).should("have.length", 1);
    });

    it("an aligned display makes room above and below a growing field", () => {
        // The hard direction. A fraction grows the field into the rows the
        // reader is working from, so the display has to spread them rather than
        // let the field cover them.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <md name="md">
      <mrow>f(x) \\amp = x^2</mrow>
      <mrow>f'(x) \\amp = <mathInput name="mi" /></mrow>
      <mrow>f''(x) \\amp = 2</mrow>
    </md>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#md")} [id*='_mathSlot_']`).should("exist");

        let heightBefore;
        let displayBefore;
        cy.get(cesc("#md")).should(($root) => {
            heightBefore = $root[0]
                .querySelector("[id*='_mathSlot_']")
                .getBoundingClientRect().height;
            displayBefore = $root[0]
                .querySelector("mjx-container")
                .getBoundingClientRect().height;
        });

        // MathQuill turns this into a fraction, which is taller and deeper than
        // the line it sits on.
        cy.get(`${cesc("#mi")} textarea`).type("1/2", { force: true });

        cy.get(cesc("#md")).should(($root) => {
            const root = $root[0];
            const reserved = root.querySelector("[id*='_mathSlot_']");
            const reservedRect = reserved.getBoundingClientRect();
            expect(
                reservedRect.height,
                "the display reserved more room for the field",
            ).to.be.greaterThan(heightBefore);
            expect(
                root.querySelector("mjx-container").getBoundingClientRect()
                    .height,
                "so the rows moved apart",
            ).to.be.greaterThan(displayBefore);

            // And the field is still sitting on the room reserved for it,
            // rather than having been carried up with it.
            const slotRect = root
                .querySelector(".doenet-math-slot")
                .getBoundingClientRect();
            expect(Math.abs(slotRect.left - reservedRect.left)).to.be.lessThan(
                2,
            );
            expect(slotRect.bottom).to.be.at.most(reservedRect.bottom + 2);
            expect(slotRect.top).to.be.at.least(reservedRect.top - 2);
        });
    });

    it("an input can sit in a subscript or a superscript", () => {
        // Filling in the bounds of an integral: the reserved box is typeset in
        // the script position, so the field lands above and below the integral
        // sign rather than beside it.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <me name="me">
      \\int_{<mathInput name="lower" minWidth="20" />}^{<mathInput name="upper" minWidth="20" />}
      <mathInput name="integrand" /> \\, dx
    </me>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#me")} [id*='_mathSlot_']`).should("have.length", 3);

        cy.get(cesc("#me")).should(($root) => {
            const root = $root[0];
            const slots = [...root.querySelectorAll(".doenet-math-slot")];
            const reserved = [
                ...root.querySelectorAll("[id*='_mathSlot_']"),
            ].map((box) => box.getBoundingClientRect());

            // Every field is on a reserved box of its own.
            for (const slot of slots) {
                const slotRect = slot.getBoundingClientRect();
                expect(
                    reserved.some(
                        (box) =>
                            Math.abs(box.left - slotRect.left) < 2 &&
                            Math.abs(box.top - slotRect.top) < 2,
                    ),
                    "a field is on a reserved box",
                ).to.eq(true);
            }

            // And the bounds are stacked around the integrand rather than in
            // line with it.
            const slotTop = (name) =>
                root
                    .querySelector(cesc(`#${name}`))
                    .closest(".doenet-math-slot")
                    .getBoundingClientRect().top;
            expect(
                slotTop("upper"),
                "the upper bound is above the integrand",
            ).to.be.lessThan(slotTop("integrand"));
            expect(
                slotTop("integrand"),
                "the lower bound is below the integrand",
            ).to.be.lessThan(slotTop("lower"));
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

    it("a marker written by the author is typeset, not treated as a slot", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><m name="m">x = \\doenetInputSlot{1} + 3</m></p>
    `,
                },
                "*",
            );
        });

        // Core embedded nothing, so the plain path: MathJax gets the text as
        // written (an undefined macro renders as an error node, but renders),
        // and there is no slot layer waiting for a size that never comes.
        cy.get(`${cesc("#m")} mjx-container`).should("exist");
        cy.get(`${cesc("#m")} .doenet-math-slot-layer`).should("not.exist");
    });

    it("the control follows the reserved box when the page narrows", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <md name="md">
      <mrow>f(x) \\amp = a + b + c + d + e + f + g + h</mrow>
      <mrow>\\amp = <textInput name="ti" /> + 3</mrow>
    </md>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#md")} [id*='_mathSlot_']`).should("exist");

        const expectAligned = () =>
            cy.get(cesc("#md")).should(($root) => {
                const root = $root[0];
                const slotRect = root
                    .querySelector(".doenet-math-slot")
                    .getBoundingClientRect();
                const reservedRect = root
                    .querySelector("[id*='_mathSlot_']")
                    .getBoundingClientRect();
                expect(
                    Math.abs(slotRect.left - reservedRect.left),
                ).to.be.lessThan(2);
                expect(
                    Math.abs(slotRect.top - reservedRect.top),
                ).to.be.lessThan(2);
            });

        expectAligned();
        // A centered display moves sideways as its container narrows, with no
        // re-typeset to read the new position from.
        cy.viewport(500, 800);
        expectAligned();
        cy.viewport(1000, 800);
        expectAligned();
    });

    it("hiding the input leaves the expression on the page", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><booleanInput name="h"><label>hide</label></booleanInput></p>
    <p><m name="m">x = <textInput name="ti" hide="$h" /> + 3</m></p>
    `,
                },
                "*",
            );
        });

        cy.get(`${cesc("#m")} .doenet-math-slot input`).should("exist");

        // Hidden, the input is flattened into the expression rather than
        // leaving a marker no control could fill; the math still typesets.
        cy.get("#h_input").click({ force: true });
        cy.get(`${cesc("#m")} .doenet-math-slot`).should("not.exist");
        cy.get(`${cesc("#m")} mjx-container`).should("exist");

        cy.get("#h_input").click({ force: true });
        cy.get(`${cesc("#m")} .doenet-math-slot input`).should("exist");
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should("exist");
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
