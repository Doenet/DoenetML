describe("Label Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("markup in the labels of inputs, buttons, and sliders", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><booleanInput name="bi"><label>Keep <delete name="d1">A</delete> <insert name="i1">B</insert></label></booleanInput></p>
  <p><textInput name="ti"><label>Text <em name="em1">C</em></label></textInput></p>
  <p><mathInput name="mi"><label>Math <delete name="d2"><m>x^2</m></delete></label></mathInput></p>
  <p><choiceInput name="ci" inline><label>Choose <delete name="d3">D</delete></label><choice>a</choice><choice>b</choice></choiceInput></p>
  <p><matrixInput name="mxi"><label>Matrix <insert name="i2">E</insert></label></matrixInput></p>
  <p><slider name="s"><label>Slide <delete name="d4">F</delete></label></slider></p>
  <p><updateValue name="uv" target="$n" newValue="$n+1"><label>Add <insert name="i3">one</insert> <m name="m1">x</m></label></updateValue>
  <number name="n">0</number></p>
  `,
                },
                "*",
            );
        });

        cy.get("#bi-label del#d1").should("have.text", "A");
        cy.get("#bi-label ins#i1").should("have.text", "B");
        cy.get("#bi-label").should("have.text", "Keep A B");

        cy.get("#ti-input-label em#em1").should("have.text", "C");

        cy.get("#mi-input-label del#d2 mjx-container").should("exist");

        cy.get("#ci-label del#d3").should("have.text", "D");

        cy.get("#mxi-label ins#i2").should("have.text", "E");

        cy.get("#s-label del#d4").should("have.text", "F");

        cy.get("#uv_button ins#i3").should("have.text", "one");
        // math in a button's label takes the button's text color
        cy.get("#uv_button").then(($button) => {
            cy.get("#m1").should("have.css", "color", $button.css("color"));
        });
        cy.get("#uv_button").click();
        cy.get("#n").should("have.text", "1");
        // the label's text can be clicked; its math lets clicks through to
        // the button
        cy.get("#uv_button ins#i3").click();
        cy.get("#n").should("have.text", "2");
        cy.get("#m1 mjx-container").should(
            "have.css",
            "pointer-events",
            "none",
        );
    });

    it("markup in the label of an answer's input", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><answer name="ans"><label>Enter <delete name="d1">y</delete> <insert name="i1">x</insert></label>x</answer></p>
  `,
                },
                "*",
            );
        });

        cy.get("#ans del#d1").should("have.text", "y");
        cy.get("#ans ins#i1").should("have.text", "x");
        // the markup appears once, as the label of the input
        cy.get("#ans del").should("have.length", 1);
        cy.get("#ans label[id$='-input-label'] del#d1").should("exist");
    });

    it("a label with a description, and labels that only have a string", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><booleanInput name="bi"><label><delete name="d1">Label</delete></label><description><p name="descP">Details</p></description></booleanInput></p>
  <p><booleanInput name="named" labelIsName /></p>
  <p><booleanInput name="copy" extend="$bi" /></p>
  `,
                },
                "*",
            );
        });

        cy.get("#bi-label del#d1").should("have.text", "Label");
        // the description is still shown as the description, not the label
        cy.get("#bi-label").should("have.text", "Label");

        cy.get("#named-label").should("have.text", "named");
        cy.get("#copy-label").should("have.text", "Label");
    });

    it("markup in the label of a math input in a graph", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <graph>
    <mathInput name="mi"><label><delete name="d1">old</delete> <m name="m1">w</m> <text name="t1">tt</text> <number name="n1">7</number></label></mathInput>
  </graph>
  `,
                },
                "*",
            );
        });

        cy.get("#mi-input-label del#d1").should("have.text", "old");
        // math, text, and numbers in the label are shown in the label, not
        // drawn on the graph
        cy.get("#mi-input-label #m1 mjx-container").should("exist");
        cy.get("#mi-input-label #t1").should("have.text", "tt");
        cy.get("#mi-input-label #n1").should("have.text", "7");
    });

    it("markup in a label shown on its own", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><label name="l1">Before <delete name="d1">gone</delete></label></p>
  <p><label for="$ti" name="l2"><insert name="i1">Name</insert></label> <textInput name="ti" /></p>
  `,
                },
                "*",
            );
        });

        cy.get("#l1 del#d1").should("have.text", "gone");
        cy.get("#l1").should("have.text", "Before gone");
        cy.get("label#l2 ins#i1").should("have.text", "Name");
    });
    it("markup in more labels, and a copy of a label's value", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p><answer name="ans"><label>Q <delete name="d1">q</delete></label><award><when>$mi=x</when></award></answer> <mathInput name="mi"/></p>
  <p><booleanInput asToggleButton name="tb"><label>Toggle <m name="m1">x</m></label></booleanInput></p>
  <p><fractionInput name="fi"><label>Fraction <insert name="i1">f</insert></label></fractionInput></p>
  <p><callAction name="ca" actionName="nothing"><label><delete name="d2">Call</delete></label></callAction></p>
  <p><booleanInput name="trim"><label>  Lead <em>x</em> trail  </label></booleanInput></p>
  <p><textInput name="ti"><label>T <delete>A</delete></label></textInput></p>
  <p name="pCopy">$ti.label</p>
  `,
                },
                "*",
            );
        });

        // an answer without an input shows its label beside its check-work button
        cy.get("#ans del#d1").should("have.text", "q");
        cy.get("#ans label #ans_button").should("exist");

        // math in a toggle button's label takes the button's text color
        cy.get("#m1 mjx-container").should("exist");
        cy.get("#m1").then(($m) => {
            cy.wrap($m.closest("label")).should(
                "have.css",
                "color",
                $m.css("color"),
            );
        });

        cy.get("#fi-label ins#i1").should("have.text", "f");
        cy.get("#ca_button del#d2").should("have.text", "Call");

        // the outer whitespace is trimmed, as it is from the label's value
        cy.get("#trim-label").should("have.text", "Lead x trail");

        // a copy of a label's value has only its text
        cy.get("#pCopy").should("have.text", "T A");
        cy.get("#pCopy del").should("not.exist");
    });
});
