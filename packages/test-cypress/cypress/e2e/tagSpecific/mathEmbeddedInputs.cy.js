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

        // Nothing but the control is drawn inside the expression: no label,
        // and no button of any kind.
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

        // Nothing but the field is drawn inside the expression: no label,
        // and no button of any kind.
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

    it("the expression makes room in the same frame as the field grows", () => {
        // The reservation follows the field exactly, growing and shrinking,
        // and for an expression this small the re-typeset is cheap enough to
        // run in the layout phase, so the room reserved and the field are the
        // same width on every frame: the rest of the expression moves with the
        // field rather than behind it. A frame in which they differ is one the
        // reader sees the field overlapping, or short of, its room.
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
        cy.get(`${cesc("#mi")} textarea`).type("a", { force: true });
        cy.wait(300);

        cy.window().then((win) => {
            const root = win.document.querySelector(cesc("#m"));
            const field = root.querySelector(".doenet-math-slot");
            const gaps = [];
            function sample() {
                const reserved = root
                    .querySelector("[id*='_mathSlot_']")
                    .getBoundingClientRect().width;
                gaps.push(
                    Math.round(field.getBoundingClientRect().width - reserved),
                );
                win.requestAnimationFrame(sample);
            }
            sample();
            win.__gaps = gaps;
        });

        for (const character of "bcdefghijkl") {
            cy.get(`${cesc("#mi")} textarea`).type(character, { force: true });
            cy.wait(100);
        }
        let widest;
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).then(($reserved) => {
            widest = $reserved[0].getBoundingClientRect().width;
        });
        // Deleting closes the expression back up the same way, in step.
        for (let ind = 0; ind < 5; ind++) {
            cy.get(`${cesc("#mi")} textarea`).type("{backspace}", {
                force: true,
            });
            cy.wait(100);
        }
        cy.wait(300);

        cy.window().then((win) => {
            const behind = win.__gaps.filter((gap) => Math.abs(gap) > 1);
            expect(
                behind.length,
                `frames with the room behind the field: ${behind.join(",")}`,
            ).to.be.at.most(2);
            expect(win.__gaps[win.__gaps.length - 1]).to.eq(0);
        });
        cy.get(`${cesc("#m")} [id*='_mathSlot_']`).should(($reserved) => {
            expect($reserved[0].getBoundingClientRect().width).to.be.lessThan(
                widest,
            );
        });
    });

    it("the expression follows what the reader types, keystroke by keystroke", () => {
        // `$mi.immediateValue` changes with every keystroke, and the expression
        // shows it as it changes, as it would anywhere else on the page —
        // with the field moving over by the width of what it writes, since the
        // author put the reference before it.
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

        cy.get(`${cesc("#mi")} textarea`).type("7", { force: true });
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).to.contain("7");
        });
        cy.get(`${cesc("#mi")} textarea`).type("7", { force: true });
        cy.get(`${cesc("#m")} mjx-container`).should(($container) => {
            expect($container[0].textContent).to.contain("77");
        });
        cy.get(`${cesc("#mi")} textarea`).should("be.focused");
    });

    it("the expression shows a committed value the reader entered", () => {
        // `$mi` is the *committed* value, so the LaTeX that shows it does not
        // come back from core until the reader presses Enter — and the field
        // keeps its focus while the expression is re-typeset with it.
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
        // The same for a text input: `$ti` is its committed value, so the
        // expression shows it once the reader commits with Enter.
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
        // focus afterwards, so the expression shows the choice while the
        // reader is still on the control.
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

    it("a field growing taller moves once, with the room made for it", () => {
        // A fraction makes the field taller above its baseline. The display
        // reserves that room and the row's baseline comes down with it, so the
        // field's top is set from the new baseline and the new height together;
        // set from the old baseline first, it would rise and then fall.
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
        cy.get(`${cesc("#mi")} textarea`).type("a", { force: true });
        cy.wait(300);

        // Sample where the field's top is on every frame from here on.
        cy.window().then((win) => {
            const field = win.document.querySelector(
                `${cesc("#md")} .doenet-math-slot`,
            );
            const tops = [];
            function sample() {
                const top = Math.round(field.getBoundingClientRect().top);
                if (tops[tops.length - 1] !== top) {
                    tops.push(top);
                }
                win.requestAnimationFrame(sample);
            }
            sample();
            win.__fieldTops = tops;
        });

        cy.get(`${cesc("#mi")} textarea`).type("/", { force: true });
        cy.wait(600);

        cy.window().then((win) => {
            const tops = win.__fieldTops;
            expect(tops.length, `top went ${tops.join(" → ")}`).to.be.at.most(
                2,
            );
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
