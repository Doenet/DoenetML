import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Answer Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("integrated submit buttons", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p><answer name="answer1">
    <award><math>x+y</math></award>
    <award credit="0.3215"><math>x+z</math></award>
  </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            const mathInputIdx =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            const mathInputAnchor = "#_id_" + mathInputIdx + " textarea";
            const mathInputButtonAnchor = "#_id_" + mathInputIdx + "_button";

            const mathInputEditableAnchor =
                "#_id_" + mathInputIdx + " .mq-editable-field";

            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Type correct answer in");
            cy.get(mathInputAnchor).type(`x+y`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x+y");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Add space");
            cy.get(mathInputAnchor).type(`{end} `, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Delete space");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Add letter");
            cy.get(mathInputAnchor).type(`{end}z`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x+yz");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete letter (no longer goes back to saying correct)");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            cy.get(mathInputEditableAnchor).should("not.contain.text", "x+yz");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete more");
            cy.get(mathInputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            cy.get(mathInputEditableAnchor).should("not.contain.text", "x+");
            cy.get(mathInputEditableAnchor).should("contain.text", "x");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Back to correct (no longer goes back to saying correct)");
            cy.get(mathInputAnchor).type(`{end}+y`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x+y");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Delete again");
            cy.get(mathInputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            cy.get(mathInputEditableAnchor).should("not.contain.text", "x+");
            cy.get(mathInputEditableAnchor).should("contain.text", "x");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter on submit button");
            cy.get(mathInputButtonAnchor).type(`{enter}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Incorrect");

            cy.log("Add letter");
            cy.get(mathInputAnchor).type(`{end}a`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "xa");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete letter (no longer goes back to saying incorrect)");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            cy.get(mathInputEditableAnchor).should("not.contain.text", "xa");
            cy.get(mathInputEditableAnchor).should("contain.text", "x");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete all");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log(
                "Restore incorrect submitted answer (no longer goes back to saying incorrect)",
            );
            cy.get(mathInputAnchor).type(`x`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(mathInputButtonAnchor).click();
            cy.get(mathInputButtonAnchor).should("contain.text", "Incorrect");

            cy.log("Enter partially correct answer");
            cy.get(mathInputAnchor).type(`{end}+z`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x+z");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(mathInputButtonAnchor).click();
            cy.get(mathInputButtonAnchor)
                .should("contain.text", "32 %")
                .should("contain.text", "32% Correct");

            cy.log("Add letter");
            cy.get(mathInputAnchor).type(`{end}z`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x+zz");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log(
                "Delete letter (no longer goes back to saying partially correct)",
            );
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            cy.get(mathInputEditableAnchor).should("not.contain.text", "x+zz");
            cy.get(mathInputEditableAnchor).should("contain.text", "x+z");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete more");
            cy.get(mathInputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            cy.get(mathInputEditableAnchor).should("not.contain.text", "x+");
            cy.get(mathInputEditableAnchor).should("contain.text", "x");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log(
                "Back to partial (no longer goes back to saying partially correct)",
            );
            cy.get(mathInputAnchor).type(`{end}+z`, { force: true });
            cy.get(mathInputEditableAnchor).should("contain.text", "x+z");
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(mathInputButtonAnchor).click();
            cy.get(mathInputButtonAnchor)
                .should("contain.text", "32 %")
                .should("contain.text", "32% Correct");

            cy.log("Enter invalid answer");
            cy.get(mathInputAnchor).type(`{end}/`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(mathInputButtonAnchor).click();
            cy.get(mathInputButtonAnchor).should("contain.text", "Incorrect");

            cy.log("Another invalid answer shows submit button again");
            cy.get(mathInputAnchor).type(`{end}^`, { force: true });
            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(mathInputButtonAnchor).click();
            cy.get(mathInputButtonAnchor).should("contain.text", "Incorrect");
        });
    });

    it("integrated submit buttons, text", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p><answer type="text" name="answer1">
    <award><text>hello there</text></award>
    <award credit="0.3215"><text>bye</text></award>
  </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let textInputIdx =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let textInputAnchor = "#_id_" + textInputIdx + "_input";
            let textInputButtonAnchor = "#_id_" + textInputIdx + "_button";

            cy.get(textInputAnchor).should("have.value", "");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Type correct answer in");
            cy.get(textInputAnchor).type(`hello there`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Add letter");
            cy.get(textInputAnchor).type(`z`);
            cy.get(textInputAnchor).should("have.value", "hello therez");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete letter (no longer goes back to saying correct)");
            cy.get(textInputAnchor).type(`{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete more");
            cy.get(textInputAnchor).type(`{backspace}{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Back to correct");
            cy.get(textInputAnchor).type(`re`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");
            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Add a space");
            cy.get(textInputAnchor).type(` `);
            cy.get(textInputAnchor).should("have.value", "hello there ");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello there ");
            cy.get(textInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Delete again");
            cy.get(textInputAnchor).type(`{backspace}{backspace}{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter on submit button");
            cy.get(textInputButtonAnchor).type(`{enter}`, { force: true });
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputButtonAnchor).should("contain.text", "Incorrect");

            cy.log("Add letter");
            cy.get(textInputAnchor).type(`a`);
            cy.get(textInputAnchor).should("have.value", "hello thea");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete letter (no longer goes back to saying incorrect)");
            cy.get(textInputAnchor).type(`{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete all");
            cy.get(textInputAnchor).clear();
            cy.get(textInputAnchor).should("have.value", "");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log(
                "Restore incorrect submitted answer (no longer goes back to saying incorrect)",
            );
            cy.get(textInputAnchor).type(`hello the`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputButtonAnchor).should("contain.text", "Incorrect");

            cy.log("Enter partially correct answer");
            cy.get(textInputAnchor).clear().type(`bye`);
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(textInputButtonAnchor).click();
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputButtonAnchor)
                .should("contain.text", "32 %")
                .should("contain.text", "32% Correct");

            cy.log("Add letter");
            cy.get(textInputAnchor).type(`z`);
            cy.get(textInputAnchor).should("have.value", "byez");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log(
                "Delete letter (no longer goes back to saying partially correct)",
            );
            cy.get(textInputAnchor).type(`{backspace}`);
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Delete more");
            cy.get(textInputAnchor).type(`{backspace}{backspace}`);
            cy.get(textInputAnchor).should("have.value", "b");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log(
                "Back to partial (no longer goes back to saying partially correct)",
            );
            cy.get(textInputAnchor).type(`ye`);
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputButtonAnchor).should("contain.text", "Check Work");

            cy.log("Click submit button");
            cy.get(textInputButtonAnchor).click();
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputButtonAnchor)
                .should("contain.text", "32 %")
                .should("contain.text", "32% Correct");
        });
    });

    it("submit buttons with two answer blanks", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p>Enter values that sum to <m>3x</m>: <mathInput name="mi1"/> <mathInput name="mi2" />
  <answer name="answer1">
  <award><when><math><math isResponse extend="$mi1" />+<math isResponse extend="$mi2" /></math> = <math>3x</math></when></award>
  <award credit="0.5"><when><math>$mi1+$mi2</math> = <math>3</math></when></award>
  </answer></p>

  `,
                },
                "*",
            );
        });

        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Enter correct answer");
        cy.get("#mi1" + " textarea").type(`x+y`, {
            force: true,
        });
        cy.get("#mi2" + " textarea").type(`2x-y`, {
            force: true,
        });

        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "2x−y");

        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#mi2" + " textarea").blur();
        cy.get("#answer1_button").click();
        cy.get("#answer1_button").should("contain.text", "Correct");

        cy.log("Type letter in input1");
        cy.get("#mi1" + " textarea").type("{end}z", {
            force: true,
        });

        cy.get("#mi1" + " .mq-editable-field").should("contain.text", "x+yz");

        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get("#mi1" + " textarea").type("{end}{backspace}", {
            force: true,
        });

        cy.get("#mi1" + " .mq-editable-field").should(
            "not.contain.text",
            "x+yz",
        );

        cy.get("#mi1" + " .mq-editable-field").should("contain.text", "x+y");

        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Type letter in input2");
        cy.get("#mi1" + " textarea").blur();
        cy.get("#mi2" + " textarea").type("{end}q", {
            force: true,
        });

        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "2x−yq");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get("#mi2" + " textarea").type("{end}{backspace}", {
            force: true,
        });

        cy.get("#mi2" + " .mq-editable-field").should(
            "not.contain.text",
            "2x−yq",
        );
        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "2x−y");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#answer1_button").should("contain.text", "Correct");

        cy.log("Type letter in input1");
        cy.get("#mi1" + " textarea").type("{end}z", {
            force: true,
        });
        cy.get("#mi1" + " .mq-editable-field").should("contain.text", "x+yz");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Type letter in input2");
        cy.get("#mi1" + " textarea").blur();
        cy.get("#mi2" + " textarea").type("{end}q", {
            force: true,
        });

        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "2x−yq");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Delete letter in input1");
        cy.get("#mi1" + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get("#mi1" + " .mq-editable-field").should(
            "not.contain.text",
            "x+yz",
        );
        cy.get("#mi1" + " .mq-editable-field").should("contain.text", "x+y");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Don't go back to saying correct if return to previous answer");
        cy.get("#mi1" + " textarea").blur();
        cy.get("#mi2" + " textarea")
            .type("{end}{backspace}", { force: true })
            .blur();

        cy.get("#mi2" + " .mq-editable-field").should(
            "not.contain.text",
            "2x−yq",
        );
        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "2x−y");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#answer1_button").should("contain.text", "Correct");

        cy.log("Enter partially correct answer");
        cy.get("#mi1" + " textarea")
            .type(`{ctrl+home}{shift+end}{backspace}x`, { force: true })
            .blur();
        cy.get("#mi2" + " textarea")
            .type(`{ctrl+home}{shift+end}{backspace}3-x`, { force: true })
            .blur();

        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "3−x");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#answer1_button").should("contain.text", "50% Correct");

        cy.log("Delete letter in input1");
        cy.get("#mi1" + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log(
            "Add letter back (no longer goes back to saying partially correct)",
        );
        cy.get("#mi1" + " textarea").type("{end}x", {
            force: true,
        });

        cy.get("#mi1" + " .mq-editable-field").should("contain.text", "x");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#answer1_button").should("contain.text", "50% Correct");

        cy.log("Enter incorrect answer");
        cy.get("#mi1" + " textarea")
            .type(`{end}{backspace}y`, { force: true })
            .blur();
        cy.get("#mi1" + " .mq-editable-field").should("contain.text", "y");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").type("{enter}", { force: true });
        cy.get("#answer1_button").should("contain.text", "Incorrect");

        cy.log("Delete letter in input2");
        cy.get("#mi2" + " textarea").type("{end}{backspace}", {
            force: true,
        });

        cy.get("#mi2" + " .mq-editable-field").should(
            "not.contain.text",
            "3−x",
        );
        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "3−");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Add letter back (no longer goes back to saying incorrect)");
        cy.get("#mi2" + " textarea").type("{end}x", {
            force: true,
        });
        cy.get("#mi2" + " .mq-editable-field").should("contain.text", "3−x");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").type("{enter}", { force: true });
        cy.get("#answer1_button").should("contain.text", "Incorrect");
    });

    it("submit buttons with two text answer blanks", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p>Enter rain and snow in either order: <textInput name="ti1" /> <textInput name="ti2" />
        <answer name="answer1">
        <award><when><text><text isResponse extend="$ti1" /> <text isResponse extend="$ti2" /></text> = <text>rain snow</text></when></award>
        <award><when><text>$ti1 $ti2</text> = <text>snow rain</text></when></award>
        <award credit="0.5"><when>$ti1 = rain</when></award>
        <award credit="0.5"><when>$ti1 = snow</when></award>
        <award credit="0.5"><when>$ti2 = rain</when></award>
        <award credit="0.5"><when>$ti2 = snow</when></award>
        </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get("#ti1_input").should("have.value", "");
        cy.get("#ti2_input").should("have.value", "");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Enter a correct answer");
        cy.get("#ti1_input").type(`rain`);
        cy.get("#ti2_input").type(`snow`).blur();
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Correct");

        cy.log("Type letter in input1");
        cy.get("#ti1_input").type("z");
        cy.get("#ti1_input").should("have.value", "rainz");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get("#ti1_input").type("{backspace}");
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Type letter in input2");
        cy.get("#ti1_input").blur();
        cy.get("#ti2_input").type("q");
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snowq");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get("#ti2_input").type("{backspace}");
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Type letter in input1");
        cy.get("#ti1_input").type("z");
        cy.get("#ti1_input").should("have.value", "rainz");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Type letter in input2");
        cy.get("#ti2_input").type("q");
        cy.get("#ti1_input").should("have.value", "rainz");
        cy.get("#ti2_input").should("have.value", "snowq");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Delete letter in input1");
        cy.get("#ti1_input").type("{backspace}");
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snowq");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Don't go back to saying correct if return to previous answer");
        cy.get("#ti2_input").type("{backspace}").blur();
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#ti1_input").should("have.value", "rain");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Correct");

        cy.log("Enter partially correct answer");
        cy.get("#ti1_input").clear().type(`x`).blur();
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "50% Correct");

        cy.log("Delete letter in input2");
        cy.get("#ti2_input").type("{backspace}");
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "sno");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log(
            "Add letter back (no longer to back to saying partially correct)",
        );
        cy.get("#ti2_input").type("w");
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "snow");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").click();
        cy.get("#answer1_button").should("contain.text", "50% Correct");

        cy.log("Enter incorrect answer");
        cy.get("#ti2_input").clear().type(`y`).blur();
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "y");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").type("{enter}", { force: true });
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "y");
        cy.get("#answer1_button").should("contain.text", "Incorrect");

        cy.log("Delete letter in input2");
        cy.get("#ti2_input").type("{backspace}");
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Add letter back (no longer go back to saying incorrect");
        cy.get("#ti2_input").type("y");
        cy.get("#ti1_input").should("have.value", "x");
        cy.get("#ti2_input").should("have.value", "y");
        cy.get("#answer1_button").should("contain.text", "Check Work");

        cy.log("Submit answer");
        cy.get("#answer1_button").type("{enter}", { force: true });
        cy.get("#answer1_button").should("contain.text", "Incorrect");
    });

    it("submit button with external inputs", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <p>Favorite variable: <mathInput name="var" prefill="x"/></p>
    <p>Second favorite variable: <mathInput name="var2" prefill="y"/></p>
    <p>Enter variable:
    <answer>
      <mathInput name="ans"/>
      <award><when><math extend="$ans" isResponse /> = $var</when></award>
      <award credit="0.5"><when>$ans = $var2</when></award>
    </answer>
    </p>
  `,
                },
                "*",
            );
        });

        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Type correct answer in");
        cy.get("#ans" + " textarea").type(`x`, { force: true });
        cy.get("#ans" + " .mq-editable-field").should("contain.text", "x");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button").should("contain.text", "Correct");

        cy.log("Change correct answer");
        cy.get("#var" + " textarea").type(`{end}{backspace}u{enter}`, {
            force: true,
        });
        cy.get("#var" + " .mq-editable-field").should("contain.text", "u");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button").should("contain.text", "Incorrect");

        cy.log("Change to new correct answer");
        cy.get("#ans" + " textarea").type(`{end}{backspace}u`, {
            force: true,
        });
        cy.get("#ans" + " .mq-editable-field").should("contain.text", "u");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button").should("contain.text", "Correct");

        cy.log("Change partial credit answer");
        cy.get("#var2" + " textarea").type(`{end}{backspace}v{enter}`, {
            force: true,
        });
        cy.get("#var2" + " .mq-editable-field").should("contain.text", "y");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button").should("contain.text", "Correct");

        cy.log("Change to new partial correct answer");
        cy.get("#ans" + " textarea").type(`{end}{backspace}v`, {
            force: true,
        });
        cy.get("#ans" + " .mq-editable-field").should("contain.text", "v");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button")
            .should("contain.text", "50 %")
            .should("contain.text", "50% Correct");

        cy.log("Change correct answer");
        cy.get("#var" + " textarea").type(`{end}{backspace}w{enter}`, {
            force: true,
        });
        cy.get("#var" + " .mq-editable-field").should("contain.text", "w");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button")
            .should("contain.text", "50 %")
            .should("contain.text", "50% Correct");

        cy.log("Change to new correct answer");
        cy.get("#ans" + " textarea").type(`{end}{backspace}w`, {
            force: true,
        });
        cy.get("#ans" + " .mq-editable-field").should("contain.text", "w");
        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.log("Press enter");
        cy.get("#ans" + " textarea").type(`{enter}`, { force: true });
        cy.get("#ans_button").should("contain.text", "Correct");
    });

    // actually test the interface of block versus inline choice inputs

    it("switch answer between inline and block", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text name="a">a</text>
      <p>Inline: <booleanInput name="inline" /> </p>
      <answer inline="$inline" name="answer1">
        <choiceInput shuffleOrder>
        <choice credit="0.5">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        </choiceInput>
      </answer>
  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let choiceInputIdx =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let choiceInputAnchor = "#_id_" + choiceInputIdx;
            let choiceInputButtonAnchor = "#_id_" + choiceInputIdx + "_button";

            cy.get(choiceInputAnchor).should("have.value", "");
            cy.get(choiceInputButtonAnchor).should(
                "contain.text",
                "Check Work",
            );

            cy.log("toggle inline");
            cy.get("#inline").click();
            cy.get(`${choiceInputAnchor} input`).should("be.visible");
            cy.get(choiceInputButtonAnchor).should(
                "contain.text",
                "Check Work",
            );

            cy.log("Select correct answer");
            cy.get(choiceInputAnchor).click();
            cy.get(`${choiceInputAnchor} [class*="menu"]`)
                .contains("dog")
                .parent()
                .parent()
                .click();

            cy.get(choiceInputButtonAnchor).should(
                "contain.text",
                "Check Work",
            );

            cy.log("Click submit button");
            cy.get(choiceInputButtonAnchor).click();
            cy.get(choiceInputButtonAnchor).should("contain.text", "Correct");

            cy.log("toggle inline");
            cy.get("#inline").click();
            cy.get(`${choiceInputAnchor} li:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceInputButtonAnchor).should("contain.text", "Correct");

            cy.log("Select partial credit answer");
            cy.get(choiceInputAnchor).contains(`cat`).click({ force: true });
            cy.get(choiceInputButtonAnchor).should(
                "contain.text",
                "Check Work",
            );

            cy.log("Click submit button");
            cy.get(choiceInputButtonAnchor).click();
            cy.get(choiceInputButtonAnchor).should(
                "contain.text",
                "50% Correct",
            );

            cy.log("toggle inline");
            cy.get("#inline").click();
            cy.get(`${choiceInputAnchor} input`).should("be.visible");

            cy.get(choiceInputButtonAnchor)
                .should("contain.text", "50 %")
                .should("contain.text", "50% Correct");
        });
    });

    it("immediate value used for submit button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p>Enter value larger than 3: <mathInput name="val" /></p>
        
        <answer name="a"> 
        <award referencesAreResponses="$val"><when>$val > 3</when></award>
        </answer>
        
        <p>Current response: <math extend="$a.currentResponses" name="cr" /></p>
        <p>Submitted response: <math extend="$a.submittedResponses" name="sr" /></p>
        <p>Credit: <number extend="$a.creditAchieved" name="ca" /></p>
 `,
                },
                "*",
            );
        });

        let button = "#a_button";

        cy.get(button).should("contain.text", "Check Work");
        cy.get(`#cr`).should("contain.text", "＿");
        cy.get(`#sr`).should("contain.text", "＿");
        cy.get(`#ca`).should("have.text", "0");

        cy.get("#val" + " textarea").type("3{enter}", { force: true });
        cy.get("#val" + " .mq-editable-field").should("contain.text", "3");
        cy.get(`#cr`).should("have.text", "3");
        cy.get(`#sr`).should("contain.text", "＿");
        cy.get(`#ca`).should("have.text", "0");
        cy.get(button).should("contain.text", "Check Work");

        cy.get("#a_button").click();
        cy.get(button).should("contain.text", "Incorrect");
        cy.get(`#cr`).should("have.text", "3");
        cy.get(`#sr`).should("have.text", "3");
        cy.get(`#ca`).should("have.text", "0");

        cy.get("#val" + " textarea").type("{end}{backspace}4", {
            force: true,
        });
        cy.get("#val" + " .mq-editable-field").should("contain.text", "4");
        cy.get(button).should("contain.text", "Check Work");
        cy.get(`#cr`).should("have.text", "3");
        cy.get(`#sr`).should("have.text", "3");
        cy.get(`#ca`).should("have.text", "0");

        cy.get("#val" + " textarea").type("{end}{backspace}3", {
            force: true,
        });
        cy.get("#val" + " .mq-editable-field").should("contain.text", "3");
        cy.get(button).should("contain.text", "Check Work");
        cy.get(`#cr`).should("have.text", "3");
        cy.get(`#sr`).should("have.text", "3");
        cy.get(`#ca`).should("have.text", "0");

        cy.get("#a_button").click();
        cy.get(button).should("contain.text", "Incorrect");
        cy.get(`#cr`).should("have.text", "3");
        cy.get(`#sr`).should("have.text", "3");
        cy.get(`#ca`).should("have.text", "0");

        cy.get("#val" + " textarea").type("{end}{backspace}5", {
            force: true,
        });
        cy.get("#val" + " .mq-editable-field").should("contain.text", "5");
        cy.get(button).should("contain.text", "Check Work");
        cy.get(`#cr`).should("have.text", "3");
        cy.get(`#sr`).should("have.text", "3");
        cy.get(`#ca`).should("have.text", "0");

        cy.get("#val" + " textarea").blur();
        cy.get(`#cr`).should("have.text", "5");
        cy.get(`#sr`).should("have.text", "3");
        cy.get(`#ca`).should("have.text", "0");
        cy.get(button).should("contain.text", "Check Work");

        cy.get("#a_button").click();
        cy.get(button).should("contain.text", "Correct");
        cy.get(`#cr`).should("have.text", "5");
        cy.get(`#sr`).should("have.text", "5");
        cy.get(`#ca`).should("have.text", "1");
    });

    it("maximum number of attempts", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p><answer name="answer1">x</answer></p>
  <p><answer name="answer2" maxNumAttempts="2">x</answer></p>
  <p><answer name="answer3" forceFullCheckworkButton>x</answer></p>
  <p><answer name="answer4" forceFullCheckworkButton maxNumAttempts="2">x</answer></p>
  
  <p><answer name="answer5" type="text">hello</answer></p>
  <p><answer name="answer6" type="text" maxNumAttempts="2">hello</answer></p>
  <p><answer name="answer7" type="text" forceFullCheckworkButton>hello</answer></p>
  <p><answer name="answer8" type="text" forceFullCheckworkButton maxNumAttempts="2">hello</answer></p>
    
  <p><answer name="answer9">
    <choiceInput name="choiceInput1">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer10" maxNumAttempts="2">
    <choiceInput name="choiceInput2">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer11" forceFullCheckworkButton>
    <choiceInput name="choiceInput3">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer12" forceFullCheckworkButton maxNumAttempts="2">
    <choiceInput name="choiceInput4">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  
  <p><answer name="answer13">
    <choiceInput name="choiceInput5" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer14" maxNumAttempts="2">
    <choiceInput name="choiceInput6" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer15" forceFullCheckworkButton>
    <choiceInput name="choiceInput7" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer16" forceFullCheckworkButton maxNumAttempts="2">
    <choiceInput name="choiceInput8" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
d
  <p><answer name="answer17" type="boolean">true</answer></p>
  <p><answer name="answer18" type="boolean" maxNumAttempts="2">true</answer></p>
  <p><answer name="answer19" type="boolean" forceFullCheckworkButton>true</answer></p>
  <p><answer name="answer20" type="boolean" forceFullCheckworkButton maxNumAttempts="2">true</answer></p>
   `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let inputIndices = [];
            for (let n of [...Array(20).keys()]) {
                inputIndices.push(
                    stateVariables[await win.resolvePath1(`answer${n + 1}`)]
                        .stateValues.inputChildren[0].componentIdx,
                );
            }

            cy.log("Submit correct answers");
            cy.get("#_id_" + inputIndices[0] + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get("#_id_" + inputIndices[1] + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get("#_id_" + inputIndices[2] + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get("#_id_" + inputIndices[3] + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get("#answer3_button").click();
            cy.get("#answer4_button").click();
            cy.get("#_id_" + inputIndices[0] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[1] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer3_button").should("contain.text", "Correct");
            cy.get("#answer4_button").should("contain.text", "Correct");

            cy.get("#_id_" + inputIndices[4] + "_input").type("hello{enter}");
            cy.get("#_id_" + inputIndices[5] + "_input").type("hello{enter}");
            cy.get("#_id_" + inputIndices[6] + "_input").type("hello{enter}");
            cy.get("#_id_" + inputIndices[7] + "_input").type("hello{enter}");
            cy.get("#answer7_button").click();
            cy.get("#answer8_button").click();
            cy.get("#_id_" + inputIndices[4] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[5] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer7_button").should("contain.text", "Correct");
            cy.get("#answer8_button").should("contain.text", "Correct");

            cy.get("#choiceInput1").contains("yes").click({ force: true });
            cy.get("#choiceInput2").contains("yes").click({ force: true });
            cy.get("#choiceInput3").contains("yes").click({ force: true });
            cy.get("#choiceInput4").contains("yes").click({ force: true });
            cy.get("#choiceInput1_button").click();
            cy.get("#choiceInput2_button").click();
            cy.get("#answer11_button").click();
            cy.get("#answer12_button").click();
            cy.get("#choiceInput1_button").should("contain.text", "Correct");
            cy.get("#choiceInput2_button").should("contain.text", "Correct");
            cy.get("#answer11_button").should("contain.text", "Correct");
            cy.get("#answer12_button").should("contain.text", "Correct");

            cy.get("#choiceInput5").click();
            cy.get(`${"#choiceInput5"} [class*="menu"]`)
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput6").click();
            cy.get(`${"#choiceInput6"} [class*="menu"]`)
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput7").click();
            cy.get(`${"#choiceInput7"} [class*="menu"]`)
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput8").click();
            cy.get(`${"#choiceInput8"} [class*="menu"]`)
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput5_button").click();
            cy.get("#choiceInput6_button").click();
            cy.get("#answer15_button").click();
            cy.get("#answer16_button").click();
            cy.get("#choiceInput5_button").should("contain.text", "Correct");
            cy.get("#choiceInput6_button").should("contain.text", "Correct");
            cy.get("#answer15_button").should("contain.text", "Correct");
            cy.get("#answer16_button").should("contain.text", "Correct");

            cy.get("#_id_" + inputIndices[16] + "-label").click();
            cy.get("#_id_" + inputIndices[17] + "-label").click();
            cy.get("#_id_" + inputIndices[18] + "-label").click();
            cy.get("#_id_" + inputIndices[19] + "-label").click();
            cy.get("#_id_" + inputIndices[16] + "_button").click();
            cy.get("#_id_" + inputIndices[17] + "_button").click();
            cy.get("#answer19_button").click();
            cy.get("#answer20_button").click();
            cy.get("#_id_" + inputIndices[16] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer19_button").should("contain.text", "Correct");
            cy.get("#answer20_button").should("contain.text", "Correct");

            cy.log("Submit incorrect answers");
            cy.get("#_id_" + inputIndices[0] + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[1] + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[2] + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[3] + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[0] + "_button").click();
            cy.get("#_id_" + inputIndices[1] + "_button").click();
            cy.get("#answer3_button").click();
            cy.get("#answer4_button").click();
            cy.get("#_id_" + inputIndices[0] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[1] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer3_button").should("contain.text", "Incorrect");
            cy.get("#answer4_button").should("contain.text", "Incorrect");

            cy.get("#_id_" + inputIndices[4] + "_input")
                .clear()
                .type("bye");
            cy.get("#_id_" + inputIndices[5] + "_input")
                .clear()
                .type("bye");
            cy.get("#_id_" + inputIndices[6] + "_input")
                .clear()
                .type("bye");
            cy.get("#_id_" + inputIndices[7] + "_input")
                .clear()
                .type("bye");
            cy.get("#_id_" + inputIndices[4] + "_button").click();
            cy.get("#_id_" + inputIndices[5] + "_button").click();
            cy.get("#answer7_button").click();
            cy.get("#answer8_button").click();
            cy.get("#_id_" + inputIndices[4] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[5] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer7_button").should("contain.text", "Incorrect");
            cy.get("#answer8_button").should("contain.text", "Incorrect");

            cy.get("#choiceInput1").contains("no").click({ force: true });
            cy.get("#choiceInput2").contains("no").click({ force: true });
            cy.get("#choiceInput3").contains("no").click({ force: true });
            cy.get("#choiceInput4").contains("no").click({ force: true });
            cy.get("#choiceInput1_button").click();
            cy.get("#choiceInput2_button").click();
            cy.get("#answer11_button").click();
            cy.get("#answer12_button").click();
            cy.get("#choiceInput1_button").should("contain.text", "Incorrect");
            cy.get("#answer12_button").should("contain.text", "Incorrect");
            cy.get("#choiceInput2_button").should("contain.text", "Incorrect");
            cy.get("#answer12_button").should("contain.text", "Incorrect");
            cy.get("#answer11_button").should("contain.text", "Incorrect");
            cy.get("#answer12_button").should("contain.text", "Incorrect");

            cy.get("#choiceInput5").click();
            cy.get(`${"#choiceInput5"} [class*="menu"]`)
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput6").click();
            cy.get(`${"#choiceInput6"} [class*="menu"]`)
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput7").click();
            cy.get(`${"#choiceInput7"} [class*="menu"]`)
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput8").click();
            cy.get(`${"#choiceInput8"} [class*="menu"]`)
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput5_button").click();
            cy.get("#choiceInput6_button").click();
            cy.get("#answer15_button").click();
            cy.get("#answer16_button").click();
            cy.get("#choiceInput5_button").should("contain.text", "Incorrect");
            cy.get("#choiceInput6_button").should("contain.text", "Incorrect");
            cy.get("#answer15_button").should("contain.text", "Incorrect");
            cy.get("#answer16_button").should("contain.text", "Incorrect");

            cy.get("#_id_" + inputIndices[16] + "-label").click();
            cy.get("#_id_" + inputIndices[17] + "-label").click();
            cy.get("#_id_" + inputIndices[18] + "-label").click();
            cy.get("#_id_" + inputIndices[19] + "-label").click();
            cy.get("#_id_" + inputIndices[16] + "_button").click();
            cy.get("#_id_" + inputIndices[17] + "_button").click();
            cy.get("#answer19_button").click();
            cy.get("#answer20_button").click();
            cy.get("#_id_" + inputIndices[16] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer19_button").should("contain.text", "Incorrect");
            cy.get("#answer20_button").should("contain.text", "Incorrect");

            cy.log("Type to submit correct answers again");

            // Every other input should be disabled
            cy.get("#_id_" + inputIndices[0] + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[1] + " textarea").should(
                "be.disabled",
            );
            cy.get("#_id_" + inputIndices[2] + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[3] + " textarea").should(
                "be.disabled",
            );
            cy.get("#_id_" + inputIndices[0] + "_button").click();
            cy.get("#_id_" + inputIndices[1] + "_button").should("be.disabled");
            cy.get("#answer3_button").click();
            cy.get("#answer4_button").should("be.disabled");
            cy.get("#_id_" + inputIndices[0] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[1] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer3_button").should("contain.text", "Correct");
            cy.get("#answer4_button").should("contain.text", "Incorrect");

            cy.get("#_id_" + inputIndices[4] + "_input")
                .clear()
                .type("hello");
            cy.get("#_id_" + inputIndices[5] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[6] + "_input")
                .clear()
                .type("hello");
            cy.get("#_id_" + inputIndices[7] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[4] + "_button").click();
            cy.get("#_id_" + inputIndices[5] + "_button").should("be.disabled");
            cy.get("#answer7_button").click();
            cy.get("#answer8_button").should("be.disabled");
            cy.get("#_id_" + inputIndices[4] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[5] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer7_button").should("contain.text", "Correct");
            cy.get("#answer8_button").should("contain.text", "Incorrect");

            cy.get("#choiceInput1").contains("yes").click({ force: true });
            cy.get("#choiceInput2").contains("yes").click({ force: true });
            cy.get("#choiceInput3").contains("yes").click({ force: true });
            cy.get("#choiceInput4").contains("yes").click({ force: true });
            cy.get("#choiceInput1_button").click();
            cy.get("#choiceInput2_button").should("be.disabled");
            cy.get("#answer11_button").click();
            cy.get("#answer12_button").should("be.disabled");
            cy.get("#choiceInput1_button").should("contain.text", "Correct");
            cy.get("#choiceInput2_button").should("contain.text", "Incorrect");
            cy.get("#answer11_button").should("contain.text", "Correct");
            cy.get("#answer12_button").should("contain.text", "Incorrect");

            cy.get("#choiceInput5").click();
            cy.get(`${"#choiceInput5"} [class*="menu"]`)
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput6 input").should("be.disabled");
            cy.get("#choiceInput7").click();
            cy.get(`${"#choiceInput7"} [class*="menu"]`)
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput8 input").should("be.disabled");
            cy.get("#choiceInput5_button").click();
            cy.get("#choiceInput6_button").should("be.disabled");
            cy.get("#answer15_button").click();
            cy.get("#answer16_button").should("be.disabled");
            cy.get("#choiceInput5_button").should("contain.text", "Correct");
            cy.get("#choiceInput6_button").should("contain.text", "Incorrect");
            cy.get("#answer15_button").should("contain.text", "Correct");
            cy.get("#answer16_button").should("contain.text", "Incorrect");

            cy.get("#_id_" + inputIndices[16] + "-label").click();
            cy.get("#_id_" + inputIndices[17] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[18] + "-label").click();
            cy.get("#_id_" + inputIndices[19] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[16] + "_button").click();
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "be.disabled",
            );
            cy.get("#answer19_button").click();
            cy.get("#answer20_button").should("be.disabled");
            cy.get("#_id_" + inputIndices[16] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer19_button").should("contain.text", "Correct");
            cy.get("#answer20_button").should("contain.text", "Incorrect");
        });
    });

    it("disable after correct", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p><answer name="answer1">x</answer></p>
  <p><answer name="answer2" disableAfterCorrect>x</answer></p>
  <p><answer name="answer3" forceFullCheckworkButton>x</answer></p>
  <p><answer name="answer4" forceFullCheckworkButton disableAfterCorrect>x</answer></p>
  
  <p><answer name="answer5" type="text">hello</answer></p>
  <p><answer name="answer6" type="text" disableAfterCorrect>hello</answer></p>
  <p><answer name="answer7" type="text" forceFullCheckworkButton>hello</answer></p>
  <p><answer name="answer8" type="text" forceFullCheckworkButton disableAfterCorrect>hello</answer></p>
    
  <p><answer name="answer9">
    <choiceInput name="choiceInput1">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer10" disableAfterCorrect>
    <choiceInput name="choiceInput2">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer11" forceFullCheckworkButton>
    <choiceInput name="choiceInput3">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer12" forceFullCheckworkButton disableAfterCorrect>
    <choiceInput name="choiceInput4">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  
  <p><answer name="answer13">
    <choiceInput name="choiceInput5" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer14" disableAfterCorrect>
    <choiceInput name="choiceInput6" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer15" forceFullCheckworkButton>
    <choiceInput name="choiceInput7" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer16" forceFullCheckworkButton disableAfterCorrect>
    <choiceInput name="choiceInput8" inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>

  <p><answer name="answer17" type="boolean">true</answer></p>
  <p><answer name="answer18" type="boolean" disableAfterCorrect>true</answer></p>
  <p><answer name="answer19" type="boolean" forceFullCheckworkButton>true</answer></p>
  <p><answer name="answer20" type="boolean" forceFullCheckworkButton disableAfterCorrect>true</answer></p>
   `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let inputIndices = [];
            for (let n of [...Array(20).keys()]) {
                inputIndices.push(
                    stateVariables[await win.resolvePath1(`answer${n + 1}`)]
                        .stateValues.inputChildren[0].componentIdx,
                );
            }

            cy.log("Submit incorrect answers");
            cy.get("#_id_" + inputIndices[0] + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get("#_id_" + inputIndices[1] + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get("#_id_" + inputIndices[2] + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get("#_id_" + inputIndices[3] + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get("#answer3_button").click();
            cy.get("#answer4_button").click();
            cy.get("#_id_" + inputIndices[0] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[1] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer3_button").should("contain.text", "Incorrect");
            cy.get("#answer4_button").should("contain.text", "Incorrect");

            cy.get("#_id_" + inputIndices[4] + "_input").type("bye{enter}");
            cy.get("#_id_" + inputIndices[5] + "_input").type("bye{enter}");
            cy.get("#_id_" + inputIndices[6] + "_input").type("bye{enter}");
            cy.get("#_id_" + inputIndices[7] + "_input").type("bye{enter}");
            cy.get("#answer7_button").click();
            cy.get("#answer8_button").click();
            cy.get("#_id_" + inputIndices[4] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[5] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer7_button").should("contain.text", "Incorrect");
            cy.get("#answer8_button").should("contain.text", "Incorrect");

            cy.get("#choiceInput1").contains("no").click({ force: true });
            cy.get("#choiceInput2").contains("no").click({ force: true });
            cy.get("#choiceInput3").contains("no").click({ force: true });
            cy.get("#choiceInput4").contains("no").click({ force: true });
            cy.get("#choiceInput1_button").click();
            cy.get("#choiceInput2_button").click();
            cy.get("#answer11_button").click();
            cy.get("#answer12_button").click();
            cy.get("#choiceInput1_button").should("contain.text", "Incorrect");
            cy.get("#choiceInput2_button").should("contain.text", "Incorrect");
            cy.get("#answer11_button").should("contain.text", "Incorrect");
            cy.get("#answer12_button").should("contain.text", "Incorrect");

            cy.get("#choiceInput5").click();
            cy.get("#choiceInput5 [class*='menu']")
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput6").click();
            cy.get("#choiceInput6 [class*='menu']")
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput7").click();
            cy.get("#choiceInput7 [class*='menu']")
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput8").click();
            cy.get("#choiceInput8 [class*='menu']")
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput5_button").click();
            cy.get("#choiceInput6_button").click();
            cy.get("#answer15_button").click();
            cy.get("#answer16_button").click();
            cy.get("#choiceInput5_button").should("contain.text", "Incorrect");
            cy.get("#choiceInput6_button").should("contain.text", "Incorrect");
            cy.get("#answer15_button").should("contain.text", "Incorrect");
            cy.get("#answer16_button").should("contain.text", "Incorrect");

            cy.get("#_id_" + inputIndices[16] + "_button").click();
            cy.get("#_id_" + inputIndices[17] + "_button").click();
            cy.get("#answer19_button").click();
            cy.get("#answer20_button").click();
            cy.get("#_id_" + inputIndices[16] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#answer19_button").should("contain.text", "Incorrect");
            cy.get("#answer20_button").should("contain.text", "Incorrect");

            cy.log("Submit correct answers");
            cy.get("#_id_" + inputIndices[0] + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[1] + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[2] + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[3] + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[0] + "_button").click();
            cy.get("#_id_" + inputIndices[1] + "_button").click();
            cy.get("#answer3_button").click();
            cy.get("#answer4_button").click();
            cy.get("#_id_" + inputIndices[0] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[1] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer3_button").should("contain.text", "Correct");
            cy.get("#answer4_button").should("contain.text", "Correct");

            cy.get("#_id_" + inputIndices[4] + "_input")
                .clear()
                .type("hello");
            cy.get("#_id_" + inputIndices[5] + "_input")
                .clear()
                .type("hello");
            cy.get("#_id_" + inputIndices[6] + "_input")
                .clear()
                .type("hello");
            cy.get("#_id_" + inputIndices[7] + "_input")
                .clear()
                .type("hello");
            cy.get("#_id_" + inputIndices[4] + "_button").click();
            cy.get("#_id_" + inputIndices[5] + "_button").click();
            cy.get("#answer7_button").click();
            cy.get("#answer8_button").click();
            cy.get("#_id_" + inputIndices[4] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[5] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer7_button").should("contain.text", "Correct");
            cy.get("#answer8_button").should("contain.text", "Correct");

            cy.get("#choiceInput1").contains("yes").click({ force: true });
            cy.get("#choiceInput2").contains("yes").click({ force: true });
            cy.get("#choiceInput3").contains("yes").click({ force: true });
            cy.get("#choiceInput4").contains("yes").click({ force: true });
            cy.get("#choiceInput1_button").click();
            cy.get("#choiceInput2_button").click();
            cy.get("#answer11_button").click();
            cy.get("#answer12_button").click();
            cy.get("#choiceInput1_button").should("contain.text", "Correct");
            cy.get("#choiceInput2_button").should("contain.text", "Correct");
            cy.get("#answer11_button").should("contain.text", "Correct");
            cy.get("#answer12_button").should("contain.text", "Correct");

            cy.get("#choiceInput5").click();
            cy.get("#choiceInput5 [class*='menu']")
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput6").click();
            cy.get("#choiceInput6 [class*='menu']")
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput7").click();
            cy.get("#choiceInput7 [class*='menu']")
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput8").click();
            cy.get("#choiceInput8 [class*='menu']")
                .contains("yes")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput5_button").click();
            cy.get("#choiceInput6_button").click();
            cy.get("#answer15_button").click();
            cy.get("#answer16_button").click();
            cy.get("#choiceInput5_button").should("contain.text", "Correct");
            cy.get("#choiceInput6_button").should("contain.text", "Correct");
            cy.get("#answer15_button").should("contain.text", "Correct");
            cy.get("#answer16_button").should("contain.text", "Correct");

            cy.get("#_id_" + inputIndices[16] + "-label").click();
            cy.get("#_id_" + inputIndices[17] + "-label").click();
            cy.get("#_id_" + inputIndices[18] + "-label").click();
            cy.get("#_id_" + inputIndices[19] + "-label").click();
            cy.get("#_id_" + inputIndices[16] + "_button").click();
            cy.get("#_id_" + inputIndices[17] + "_button").click();
            cy.get("#answer19_button").click();
            cy.get("#answer20_button").click();
            cy.get("#_id_" + inputIndices[16] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer19_button").should("contain.text", "Correct");
            cy.get("#answer20_button").should("contain.text", "Correct");

            cy.log("Type to submit incorrect answers again");

            // Every other input should be disabled
            cy.get("#_id_" + inputIndices[0] + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[1] + " textarea").should(
                "be.disabled",
            );
            cy.get("#_id_" + inputIndices[2] + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get("#_id_" + inputIndices[3] + " textarea").should(
                "be.disabled",
            );
            cy.get("#_id_" + inputIndices[0] + "_button").click();
            cy.get("#_id_" + inputIndices[1] + "_button").should("be.disabled");
            cy.get("#answer3_button").click();
            cy.get("#answer4_button").should("be.disabled");
            cy.get("#_id_" + inputIndices[0] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[1] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer3_button").should("contain.text", "Incorrect");
            cy.get("#answer4_button").should("contain.text", "Correct");

            cy.get("#_id_" + inputIndices[4] + "_input")
                .clear()
                .type("bye");
            cy.get("#_id_" + inputIndices[5] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[6] + "_input")
                .clear()
                .type("bye");
            cy.get("#_id_" + inputIndices[7] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[4] + "_button").click();
            cy.get("#_id_" + inputIndices[5] + "_button").should("be.disabled");
            cy.get("#answer7_button").click();
            cy.get("#answer8_button").should("be.disabled");
            cy.get("#_id_" + inputIndices[4] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[5] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer7_button").should("contain.text", "Incorrect");
            cy.get("#answer8_button").should("contain.text", "Correct");

            cy.get("#choiceInput1").contains("no").click({ force: true });
            cy.get("#choiceInput2").contains("no").click({ force: true });
            cy.get("#choiceInput3").contains("no").click({ force: true });
            cy.get("#choiceInput4").contains("no").click({ force: true });
            cy.get("#choiceInput1_button").click();
            cy.get("#choiceInput2_button").should("be.disabled");
            cy.get("#answer11_button").click();
            cy.get("#answer12_button").should("be.disabled");
            cy.get("#choiceInput1_button").should("contain.text", "Incorrect");
            cy.get("#choiceInput2_button").should("contain.text", "Correct");
            cy.get("#answer11_button").should("contain.text", "Incorrect");
            cy.get("#answer12_button").should("contain.text", "Correct");

            cy.get("#choiceInput5").click();
            cy.get("#choiceInput5 [class*='menu']")
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput6 input").should("be.disabled");
            cy.get("#choiceInput7").click();
            cy.get("#choiceInput7 [class*='menu']")
                .contains("no")
                .parent()
                .parent()
                .click();
            cy.get("#choiceInput8 input").should("be.disabled");
            cy.get("#choiceInput5_button").click();
            cy.get("#choiceInput6_button").should("be.disabled");
            cy.get("#answer15_button").click();
            cy.get("#answer16_button").should("be.disabled");
            cy.get("#choiceInput5_button").should("contain.text", "Incorrect");
            cy.get("#choiceInput6_button").should("contain.text", "Correct");
            cy.get("#answer15_button").should("contain.text", "Incorrect");
            cy.get("#answer16_button").should("contain.text", "Correct");

            cy.get("#_id_" + inputIndices[16] + "-label").click();
            cy.get("#_id_" + inputIndices[17] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[18] + "-label").click();
            cy.get("#_id_" + inputIndices[19] + "_input").should("be.disabled");
            cy.get("#_id_" + inputIndices[16] + "_button").click();
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "be.disabled",
            );
            cy.get("#answer19_button").click();
            cy.get("#answer20_button").should("be.disabled");
            cy.get("#_id_" + inputIndices[16] + "_button").should(
                "contain.text",
                "Incorrect",
            );
            cy.get("#_id_" + inputIndices[17] + "_button").should(
                "contain.text",
                "Correct",
            );
            cy.get("#answer19_button").should("contain.text", "Incorrect");
            cy.get("#answer20_button").should("contain.text", "Correct");
        });
    });

    it("disable after correct, depends on external", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>

  <graph>
    <point name="A" x="0" y="0">
        <attractTo><point>(3,4)</point></attractTo>
        <attractTo><point>(-5,6)</point></attractTo>
    </point>
  </graph>

  <p>Move point to <m>(3,4)</m>: </p>
  <p><answer name="answer1">
    <award referencesAreResponses="$A">
      <when>$A = (3,4)</when>
    </award>
  </answer></p>
  <p><answer name="answer2" disableAfterCorrect>
    <award referencesAreResponses="$A">
      <when>$A = (3,4)</when>
    </award>
  </answer></p>

  <p>Move point to <m>(-5,6)</m>: </p>
  <p><answer name="answer3">
    <award referencesAreResponses="$A">
      <when>$A = (-5,6)</when>
    </award>
  </answer></p>
  <p><answer name="answer4" disableAfterCorrect>
    <award referencesAreResponses="$A">
      <when>$A = (-5,6)</when>
    </award>
  </answer></p>

  <p><mathInput name="mi" /></p>

  <p>Enter <m>x</m> in above blank.</p>
  <p><answer name="answer5">
    <award referencesAreResponses="$mi"><when>$mi=x</when></award>
  </answer></p>
  <p><answer name="answer6" disableAfterCorrect>
    <award referencesAreResponses="$mi"><when>$mi=x</when></award>
  </answer></p>

  <p>Enter <m>y</m> in above blank.</p>
  <p><answer name="answer7">
    <award referencesAreResponses="$mi"><when>$mi=y</when></award>
  </answer></p>
  <p><answer name="answer8" disableAfterCorrect>
    <award referencesAreResponses="$mi"><when>$mi=y</when></award>
  </answer></p>

   `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.log("Submit incorrect answers");
        for (let i = 1; i <= 8; i++) {
            cy.get(`#answer${i}_button`).click();
            cy.get(`#answer${i}_button`).should("contain.text", "Incorrect");
        }

        cy.log("submit first correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 3, y: 4 },
            });
        });
        cy.get("#mi" + " textarea").type("x{enter}", { force: true });

        for (let i = 1; i <= 8; i++) {
            cy.get(`#answer${i}_button`).click();
            if (i % 4 === 1 || i % 4 == 2) {
                cy.get(`#answer${i}_button`).should("contain.text", "Correct");
            } else {
                cy.get(`#answer${i}_button`).should(
                    "contain.text",
                    "Incorrect",
                );
            }
        }

        cy.log("submit second correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: -5, y: 6 },
            });
        });
        cy.get("#mi" + " textarea").type("{end}{backspace}y{enter}", {
            force: true,
        });

        for (let i = 1; i <= 8; i++) {
            if (i % 4 !== 2) {
                cy.get(`#answer${i}_button`).click();
            }
            if (i % 4 === 1) {
                cy.get(`#answer${i}_button`).should(
                    "contain.text",
                    "Incorrect",
                );
            } else {
                cy.get(`#answer${i}_button`).should("contain.text", "Correct");
            }
        }

        cy.log("submit second incorrect answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 1, y: -1 },
            });
        });
        cy.get("#mi" + " textarea").type("{end}{backspace}z{enter}", {
            force: true,
        });

        for (let i = 1; i <= 8; i++) {
            if (i % 4 === 2 || i % 4 === 0) {
                cy.get(`#answer${i}_button`).should("contain.text", "Correct");
            } else {
                cy.get(`#answer${i}_button`).click();
                cy.get(`#answer${i}_button`).should(
                    "contain.text",
                    "Incorrect",
                );
            }
        }
    });

    it("submit label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p><answer name="ans1" forceFullCheckworkButton>x</answer></p>
  <p><answer name="ans2" forceFullCheckworkButton submitLabel="Hit it!">x</answer></p>
  <p><answer name="ans3" forceFullCheckworkButton submitLabelNoCorrectness="Guess">x</answer></p>
  <p><answer name="ans4" forceFullCheckworkButton submitLabel="Hit it!" submitLabelNoCorrectness="Guess">x</answer></p>
  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput1Idx =
                stateVariables[await win.resolvePath1("ans1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput1Anchor = "#_id_" + mathInput1Idx + " textarea";

            let mathInput2Idx =
                stateVariables[await win.resolvePath1("ans2")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput2Anchor = "#_id_" + mathInput2Idx + " textarea";

            let mathInput3Idx =
                stateVariables[await win.resolvePath1("ans3")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput3Anchor = "#_id_" + mathInput3Idx + " textarea";

            let mathInput4Idx =
                stateVariables[await win.resolvePath1("ans4")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Anchor = "#_id_" + mathInput4Idx + " textarea";

            cy.get("#ans1_button").should("contain.text", "Check Work");
            cy.get("#ans2_button").should("contain.text", "Hit it!");
            cy.get("#ans3_button").should("contain.text", "Check Work");
            cy.get("#ans4_button").should("contain.text", "Hit it!");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get("#ans1_button").click();
            cy.get("#ans2_button").click();
            cy.get("#ans3_button").click();
            cy.get("#ans4_button").click();

            cy.get("#ans1_button").should("contain.text", "Correct");
            cy.get("#ans2_button").should("contain.text", "Correct");
            cy.get("#ans3_button").should("contain.text", "Correct");
            cy.get("#ans4_button").should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get("#ans1_button").should("contain.text", "Submit Response");
            cy.get("#ans2_button").should("contain.text", "Submit Response");
            cy.get("#ans3_button").should("contain.text", "Guess");
            cy.get("#ans4_button").should("contain.text", "Guess");

            cy.get("#ans1_button").should("contain.text", "Submit Response");
            cy.get("#ans2_button").should("contain.text", "Submit Response");
            cy.get("#ans3_button").should("contain.text", "Guess");
            cy.get("#ans4_button").should("contain.text", "Guess");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get("#ans1_button").click();
            cy.get("#ans2_button").click();
            cy.get("#ans3_button").click();
            cy.get("#ans4_button").click();

            cy.get("#ans1_button").should("contain.text", "Response Saved");
            cy.get("#ans2_button").should("contain.text", "Response Saved");
            cy.get("#ans3_button").should("contain.text", "Response Saved");
            cy.get("#ans4_button").should("contain.text", "Response Saved");
        });
    });

    it("submit label, choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p><answer name="ans1">
    <choiceInput name="choiceInput1">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="ans2" submitLabel="Hit it!">
    <choiceInput name="choiceInput2">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="ans3" submitLabelNoCorrectness="Guess">
    <choiceInput name="choiceInput3">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="ans4" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
    <choiceInput name="choiceInput4">
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.get("#choiceInput1_button").should("contain.text", "Check Work");
        cy.get("#choiceInput2_button").should("contain.text", "Hit it!");
        cy.get("#choiceInput3_button").should("contain.text", "Check Work");
        cy.get("#choiceInput4_button").should("contain.text", "Hit it!");

        cy.get("#choiceInput1").contains(`yes`).click({ force: true });
        cy.get("#choiceInput2").contains(`yes`).click({ force: true });
        cy.get("#choiceInput3").contains(`yes`).click({ force: true });
        cy.get("#choiceInput4").contains(`yes`).click({ force: true });

        cy.get("#choiceInput1_button").click();
        cy.get("#choiceInput2_button").click();
        cy.get("#choiceInput3_button").click();
        cy.get("#choiceInput4_button").click();

        cy.get("#choiceInput1_button").should("contain.text", "Correct");
        cy.get("#choiceInput2_button").should("contain.text", "Correct");
        cy.get("#choiceInput3_button").should("contain.text", "Correct");
        cy.get("#choiceInput4_button").should("contain.text", "Correct");

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showCorrectness").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get("#choiceInput1_button").should(
            "contain.text",
            "Submit Response",
        );
        cy.get("#choiceInput2_button").should(
            "contain.text",
            "Submit Response",
        );
        cy.get("#choiceInput3_button").should("contain.text", "Guess");
        cy.get("#choiceInput4_button").should("contain.text", "Guess");

        cy.get("#choiceInput1_button").should(
            "contain.text",
            "Submit Response",
        );
        cy.get("#choiceInput2_button").should(
            "contain.text",
            "Submit Response",
        );
        cy.get("#choiceInput3_button").should("contain.text", "Guess");
        cy.get("#choiceInput4_button").should("contain.text", "Guess");

        cy.get("#choiceInput1").contains(`yes`).click({ force: true });
        cy.get("#choiceInput2").contains(`yes`).click({ force: true });
        cy.get("#choiceInput3").contains(`yes`).click({ force: true });
        cy.get("#choiceInput4").contains(`yes`).click({ force: true });

        cy.get("#choiceInput1_button").click();
        cy.get("#choiceInput2_button").click();
        cy.get("#choiceInput3_button").click();
        cy.get("#choiceInput4_button").click();

        cy.get("#choiceInput1_button").should("contain.text", "Response Saved");
        cy.get("#choiceInput2_button").should("contain.text", "Response Saved");
        cy.get("#choiceInput3_button").should("contain.text", "Response Saved");
        cy.get("#choiceInput4_button").should("contain.text", "Response Saved");
    });

    it("auto submit", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
  <p>Enter x: <answer name="x">x</answer></p>
  <p name="pSubX">Submitted response: $x</p>
  <p name="pCreditX">Credit for this answer: $x.creditAchieved</p>
  
  <p>Select the correct answer:
  <answer name="correct">
    <choice name="choice1" credit="1">correct</choice>
    <choice name="choice2">incorrect</choice>
  </answer></p>
  <p name="pSubCorrect">Submitted response: $correct</p>
  <p name="pCreditCorrect">Credit for this answer: $correct.creditAchieved</p>
  
  <graph size="small">
    <point name="P" labelIsName />
  </graph>
  
  <p>Move point P into first quadrant
    <answer name="firstQuad"><award><when>$P.x > 0 and $P.y > 0</when></award></answer>
  </p>
  
  <p name="pSubFirstQuad">Submitted response: $firstQuad.submittedResponses</p>
  <p name="pCreditFirstQuad">Credit for this answer: $firstQuad.creditAchieved</p>

  <p name="pCreditDoc">Document credit achieved: $_document1.creditAchieved</p>
  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInputIdx =
                stateVariables[await win.resolvePath1("x")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInputButtonAnchor = "#_id_" + mathInputIdx + "_button";

            let choiceInputIdx =
                stateVariables[await win.resolvePath1("correct")].stateValues
                    .inputChildren[0].componentIdx;
            let choiceInputButtonAnchor = "#_id_" + choiceInputIdx + "_button";

            cy.get(mathInputButtonAnchor).should("contain.text", "Check Work");
            cy.get(choiceInputButtonAnchor).should(
                "contain.text",
                "Check Work",
            );
            cy.get("#firstQuad_button").should("contain.text", "Check Work");
        });

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_autoSubmit").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get("#a").should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInputIdx =
                stateVariables[await win.resolvePath1("x")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInputButtonAnchor = "#_id_" + mathInputIdx + "_button";

            let choiceInputIdx =
                stateVariables[await win.resolvePath1("correct")].stateValues
                    .inputChildren[0].componentIdx;
            let choiceInputButtonAnchor = "#_id_" + choiceInputIdx + "_button";

            cy.get(mathInputButtonAnchor).should("not.exist");
            cy.get(choiceInputButtonAnchor).should("not.exist");
            cy.get("#firstQuad_button").should("not.exist");
        });

        cy.get("#pSubX").should("have.text", "Submitted response: ");
        cy.get("#pCreditX").should("have.text", "Credit for this answer: 0");
        cy.get("#pSubCorrect").should("have.text", "Submitted response: ");
        cy.get("#pCreditCorrect").should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get("#x" + " textarea").type("y", { force: true });

        cy.wait(1500); // wait for debounce

        cy.get("#pSubX").should("have.text", "Submitted response: ");
        cy.get("#pCreditX").should("have.text", "Credit for this answer: 0");
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get("#x" + " textarea").blur();
        cy.get("#pSubX").should("contain.text", toMathJaxString("y"));
        cy.get("#pCreditX").should("have.text", "Credit for this answer: 0");
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get("#x" + " textarea").type("{end}{backspace}x{enter}", {
            force: true,
        });
        cy.get("#pSubX").should("contain.text", toMathJaxString("x"));
        cy.get("#pCreditX").should("have.text", "Credit for this answer: 1");
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0.333",
        );

        cy.get("#choice1").click();
        cy.get("#pSubCorrect").should(
            "have.text",
            "Submitted response: correct",
        );
        cy.get("#pCreditCorrect").should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.get("#choice2").click();
        cy.get("#pSubCorrect").should(
            "have.text",
            "Submitted response: incorrect",
        );
        cy.get("#pCreditCorrect").should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0.333",
        );

        cy.get("#choice1").click();
        cy.get("#pSubCorrect").should(
            "have.text",
            "Submitted response: correct",
        );
        cy.get("#pCreditCorrect").should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 3, y: 1 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 4, y: 2 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 5, y: 3 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 6, y: 4 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 7, y: 5 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 8, y: 6 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 9, y: 7 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 3, y: -5 },
            });
        });

        cy.wait(200);
        cy.get("#pSubFirstQuad").should("have.text", "Submitted response: ");
        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.get("#pSubFirstQuad").should("contain.text", "3, −5");

        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 9, y: 8 },
            });
        });

        cy.get("#pSubFirstQuad").should("contain.text", "9, 8");

        cy.get("#pCreditFirstQuad").should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get("#pCreditDoc").should(
            "have.text",
            "Document credit achieved: 1",
        );
    });

    it("reload math answer without blurring or hitting enter", () => {
        let doenetML = `
    <p>Enter 1: <answer>
      <mathInput name="n" />
      <award><when>$n=1</when></award>
    </answer>
    </p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#n" + " textarea").type("1", { force: true });

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#n_button").click();
        cy.get("#n_button").should("contain.text", "Correct");
    });

    it("reload text answer without blurring or hitting enter", () => {
        let doenetML = `
    <p>Enter 1: <answer>
      <textInput name="ti" />
      <award><when>$ti=hello</when></award>
    </answer>
    </p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#ti_input").type("hello", { force: true });

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#ti_button").click();
        cy.get("#ti_button").should("contain.text", "Correct");
    });

    it("credit factor by attempt and disable wrong choices", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

  <p><answer name="answer1" inline creditByAttempt="1 0.6 0.4" disableWrongChoices>
    <choiceInput name="choiceInput1">
      <choice credit="1">A</choice>
      <choice>B</choice>
      <choice>C</choice>
      <choice>D</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer2" inline creditByAttempt="1 0.6 0.4" disableWrongChoices forceFullCheckworkButton>
    <choiceInput name="choiceInput2">
      <choice credit="1">A</choice>
      <choice>B</choice>
      <choice>C</choice>
      <choice>D</choice>
    </choiceInput>
  </answer></p>
   `,
                },
                "*",
            );
        });

        cy.get("#answer1").should("contain.text", "Max credit available: 100%");
        cy.get("#answer2").should("contain.text", "Max credit available: 100%");

        cy.log("Submit correct answers");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button").should("contain.text", "Correct");
        cy.get("#answer2_button").should("contain.text", "Correct");

        cy.get("#answer1").should("contain.text", "Max credit available: 100%");
        cy.get("#answer2").should("contain.text", "Max credit available: 100%");

        cy.log("Submit incorrect answers");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button").should("contain.text", "Incorrect");
        cy.get("#answer2_button").should("contain.text", "Incorrect");

        cy.get("#answer1").should("contain.text", "Max credit available: 60%");
        cy.get("#answer2").should("contain.text", "Max credit available: 60%");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2").click();

        cy.log("Submit correct answers for reduced credit");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button")
            .should("contain.text", "60 %")
            .should("contain.text", "60% Credit");
        cy.get("#answer2_button").should("contain.text", "60% Credit");

        cy.get("#answer1").should("contain.text", "Max credit available: 60%");
        cy.get("#answer2").should("contain.text", "Max credit available: 60%");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2").click();

        cy.log("Submit second incorrect answers");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button").should("contain.text", "Incorrect");
        cy.get("#answer2_button").should("contain.text", "Incorrect");

        cy.get("#answer1").should("contain.text", "Max credit available: 40%");
        cy.get("#answer2").should("contain.text", "Max credit available: 40%");

        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2").click();

        cy.log("Submit correct answers for further reduced credit");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button")
            .should("contain.text", "40 %")
            .should("contain.text", "40% Credit");
        cy.get("#answer2_button").should("contain.text", "40% Credit");

        cy.get("#answer1").should("contain.text", "Max credit available: 40%");
        cy.get("#answer2").should("contain.text", "Max credit available: 40%");

        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2").click();

        cy.log("Submit third incorrect answers");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`C`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`C`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button").should("contain.text", "Incorrect");
        cy.get("#answer2_button").should("contain.text", "Incorrect");

        cy.get("#answer1").should("contain.text", "Max credit available: 40%");
        cy.get("#answer2").should("contain.text", "Max credit available: 40%");

        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`C`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`C`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2").click();

        cy.log("Submit correct answers, credit not further reduced");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`A`)
            .parent()
            .parent()
            .click();
        cy.get("#choiceInput1_button").click();
        cy.get("#answer2_button").click();
        cy.get("#choiceInput1_button")
            .should("contain.text", "40 %")
            .should("contain.text", "40% Credit");
        cy.get("#answer2_button").should("contain.text", "40% Credit");

        cy.get("#answer1").should("contain.text", "Max credit available: 40%");
        cy.get("#answer2").should("contain.text", "Max credit available: 40%");

        cy.get("#choiceInput1").click();
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`C`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput1").click();
        cy.get("#choiceInput2").click();
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`B`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`C`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2 [class*='menu']")
            .contains(`D`)
            .parent()
            .parent()
            .should("have.attr", "aria-disabled", "true");
        cy.get("#choiceInput2").click();
    });

    it("just submitted retained after reload, feedback condition edge case", () => {
        // A regressions test for an edge case where the justSubmitted state variable
        // of an answer was set to false when reloading the state.
        // This DoenetML is a MWE where the combination of an award
        // and a feedback condition triggered the bug.
        let doenetML = `

    <graph name="g">
        <point name="A" />
    </graph>

    <answer name="ans">
        <award>
            <when>$A.y = $A.x</when>
        </award>
    </answer>
    <feedback condition="$A.y != $A.x and $ans.justSubmitted">
        hi
    </feedback>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#ans_button").should("contain.text", "Check Work");

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 3, y: 4 },
            });
        });

        cy.get("#ans_button").click();
        cy.get("#ans_button").should("contain.text", "Incorrect");

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#ans_button").should("contain.text", "Incorrect");
    });

    it("with description, math", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans">
        x
        <shortDescription>Enter something</shortDescription>
        <description>
            <p>Type what you like.</p>
            <p>Including math: <m name="m">x^2+1</m></p>
        </description>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans [data-test='Description Button']").should("be.visible");
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#m").should("not.be.visible");
        cy.get("#ans .mq-editable-field")
            .should("have.attr", "aria-details")
            .then((ariaDetailsId) => {
                cy.get(`#${ariaDetailsId}`).should(
                    "contain.text",
                    "Type what you like.",
                );
            });

        cy.get("#ans [data-test='Description Button']").click();

        cy.get("#ans [data-test='Description']").should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#m").should("have.text", toMathJaxString("x2+1"));

        cy.get("#ans textarea").focus();
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#m").should("not.be.visible");
    });

    it("with description, text", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans" type="text">
        x
        <shortDescription>Enter something</shortDescription>
        <description>
            <p>Type what you like.</p>
        </description>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans [data-test='Description Button']").should("be.visible");
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#ans input")
            .should("have.attr", "aria-details")
            .then((ariaDetailsId) => {
                cy.get(`#${ariaDetailsId}`).should(
                    "contain.text",
                    "Type what you like.",
                );
            });
        cy.get("#ans [data-test='Description Button']").click();

        cy.get("#ans [data-test='Description']").should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#ans input").focus();
        cy.get("#ans [data-test='Description']").should("not.be.visible");
    });

    it("with description, boolean", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans" type="boolean">
        true
        <shortDescription>Click something</shortDescription>
        <description>
            <p>Click when you like.</p>
        </description>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans [data-test='Description Button']").should("be.visible");
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#ans input")
            .should("have.attr", "aria-details")
            .then((ariaDetailsId) => {
                cy.get(`#${ariaDetailsId}`).should(
                    "contain.text",
                    "Click when you like.",
                );
            });

        cy.get("#ans [data-test='Description Button']").click();

        cy.get("#ans [data-test='Description']").should(
            "contain.text",
            "Click when you like.",
        );

        cy.get("#ans input").focus();
        cy.get("#ans [data-test='Description']").should("not.be.visible");
    });

    it("with description, choices", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans">
        <shortDescription>Select something</shortDescription>
        <choice>a</choice>
        <choice>b</choice>
        <description>
            <p>Select what you like.</p>
        </description>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans [data-test='Description Button']").should("be.visible");
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#ans ul")
            .should("have.attr", "aria-details")
            .then((ariaDetailsId) => {
                cy.get(`#${ariaDetailsId}`).should(
                    "contain.text",
                    "Select what you like.",
                );
            });

        cy.get("#ans [data-test='Description Button']").click();

        cy.get("#ans [data-test='Description']").should(
            "contain.text",
            "Select what you like.",
        );

        cy.get("#ans input").eq(0).focus();
        cy.get("#ans [data-test='Description']").should("not.be.visible");
    });

    it("with description, choices, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans" inline>
        <shortDescription>Select something</shortDescription>
        <choice>a</choice>
        <choice>b</choice>
        <description>
            <p>Select what you like.</p>
        </description>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans [data-test='Description Button']").should("be.visible");
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#ans input")
            .should("have.attr", "aria-details")
            .then((ariaDetailsId) => {
                cy.get(`#${ariaDetailsId}`).should(
                    "contain.text",
                    "Select what you like.",
                );
            });

        cy.get("#ans [data-test='Description Button']").click();

        cy.get("#ans [data-test='Description']").should(
            "contain.text",
            "Select what you like.",
        );

        cy.get("#ans input").focus();
        cy.get("#ans [data-test='Description']").should("not.be.visible");
    });

    it("with description, full answer button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans" inline>
        <shortDescription>Click something</shortDescription>
        <award><when>true</when></award>
        <description>
            <p>Click when you like.</p>
        </description>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans [data-test='Description Button']").should("be.visible");
        cy.get("#ans [data-test='Description']").should("not.be.visible");
        cy.get("#ans [data-test='Details Associated")
            .should("have.attr", "aria-details")
            .then((ariaDetailsId) => {
                cy.get(`#${ariaDetailsId}`).should(
                    "contain.text",
                    "Click when you like.",
                );
            });

        cy.get("#ans [data-test='Description Button']").click();

        cy.get("#ans [data-test='Description']").should(
            "contain.text",
            "Click when you like.",
        );

        cy.get("#ans_button").focus();
        cy.get("#ans [data-test='Description']").should("not.be.visible");
    });

    it("without description, full answer button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans" inline>
        <shortDescription>Click something</shortDescription>
        <award><when>true</when></award>
    </answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans_button").should("be.visible");

        cy.get("#ans [data-test='Description Button']").should("not.exist");
        cy.get("#ans [data-test='Description']").should("not.exist");
        cy.get("#ans [data-test='Details Associated").should("not.exist");
    });

    it("answer display mode changes with block choiceInput children", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <answer name="ans1" inline>
        <choice>a</choice>
        <choice>b</choice>
    </answer>
    <answer name="ans2">
        <choice>1</choice>
        <choice>2</choice>
    </answer>
    <answer name="ans3">
        <choiceInput inline>
            <choice>x</choice>
            <choice>y</choice>
        </choiceInput>
    </answer>
    <answer name="ans4">
        <choiceInput>
            <choice>m</choice>
            <choice>n</choice>
        </choiceInput>
    </answer>
    <answer name="ans5" inline>
        <choiceInput inline="false">
            <choice>m</choice>
            <choice>n</choice>
        </choiceInput>
    </answer>
    <answer name="ans6">x</answer>

    `,
                },
                "*",
            );
        });

        cy.get("#ans1").should("have.css", "display", "inline-flex");
        cy.get("#ans2").should("have.css", "display", "flex");
        cy.get("#ans3").should("have.css", "display", "inline-flex");
        cy.get("#ans4").should("have.css", "display", "flex");
        cy.get("#ans5").should("have.css", "display", "inline-flex");
        cy.get("#ans6").should("have.css", "display", "inline-flex");
    });
});
