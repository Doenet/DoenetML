import { cesc } from "@doenet/utils";

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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInputName =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInputAnchor = cesc("#" + mathInputName) + " textarea";
            let mathInputSubmitAnchor = cesc("#" + mathInputName + "_submit");
            let mathInputCorrectAnchor = cesc("#" + mathInputName + "_correct");
            let mathInputIncorrectAnchor = cesc(
                "#" + mathInputName + "_incorrect",
            );
            let mathInputPartialAnchor = cesc("#" + mathInputName + "_partial");

            // cy.get(mathInputAnchor).should('have.value', '');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Type correct answer in");
            cy.get(mathInputAnchor).type(`x+y`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Correct",
            );
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Add space");
            cy.get(mathInputAnchor).type(`{end} `, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+yz');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Correct",
            );
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete space");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+yz');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Correct",
            );
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(mathInputAnchor).type(`{end}z`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+yz');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying correct)");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(mathInputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Back to correct (no longer goes back to saying correct)");
            cy.get(mathInputAnchor).type(`{end}+y`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathInputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+y');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Correct",
            );
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete again");
            cy.get(mathInputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Press enter on submit button");
            cy.get(mathInputSubmitAnchor).type(`{enter}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Incorrect",
            );
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(mathInputAnchor).type(`{end}a`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'xa');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying incorrect)");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete all");
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', '');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log(
                "Restore incorrect submitted answer (no longer goes back to saying incorrect)",
            );
            cy.get(mathInputAnchor).type(`x`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathInputSubmitAnchor).click();
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Incorrect",
            );
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Enter partially correct answer");
            cy.get(mathInputAnchor).type(`{end}+z`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+z');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathInputSubmitAnchor).click();
            // cy.get(mathInputAnchor).should('have.value', 'x+z');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor)
                .should("have.text", "32 %")
                .should("have.attr", "aria-label", "32% Correct");

            cy.log("Add letter");
            cy.get(mathInputAnchor).type(`{end}z`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+zz');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log(
                "Delete letter (no longer goes back to saying partially correct)",
            );
            cy.get(mathInputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+z');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(mathInputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            // cy.get(mathInputAnchor).should('have.value', 'x');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log(
                "Back to partial (no longer goes back to saying partially correct)",
            );
            cy.get(mathInputAnchor).type(`{end}+z`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+z');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathInputSubmitAnchor).click();
            // cy.get(mathInputAnchor).should('have.value', 'x+z');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor)
                .should("have.text", "32 %")
                .should("have.attr", "aria-label", "32% Correct");

            cy.log("Enter invalid answer");
            cy.get(mathInputAnchor).type(`{end}/`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+z');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathInputSubmitAnchor).click();
            // cy.get(mathInputAnchor).should('have.value', 'x+z/');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Incorrect",
            );
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Another invalid answer shows submit button again");
            cy.get(mathInputAnchor).type(`{end}^`, { force: true });
            // cy.get(mathInputAnchor).should('have.value', 'x+z/^');
            cy.get(mathInputSubmitAnchor).should(
                "have.attr",
                "aria-label",
                "Check Work",
            );
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should("not.exist");
            cy.get(mathInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathInputSubmitAnchor).click();
            // cy.get(mathInputAnchor).should('have.value', 'x+z/^');
            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(mathInputCorrectAnchor).should("not.exist");
            cy.get(mathInputIncorrectAnchor).should(
                "have.attr",
                "aria-label",
                "Incorrect",
            );
            cy.get(mathInputPartialAnchor).should("not.exist");
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let textInputName =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let textInputAnchor = cesc("#" + textInputName + "_input");
            let textInputSubmitAnchor = cesc("#" + textInputName + "_submit");
            let textInputCorrectAnchor = cesc("#" + textInputName + "_correct");
            let textInputIncorrectAnchor = cesc(
                "#" + textInputName + "_incorrect",
            );
            let textInputPartialAnchor = cesc("#" + textInputName + "_partial");

            cy.get(textInputAnchor).should("have.value", "");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Type correct answer in");
            cy.get(textInputAnchor).type(`hello there`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("be.visible");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(textInputAnchor).type(`z`);
            cy.get(textInputAnchor).should("have.value", "hello therez");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying correct)");
            cy.get(textInputAnchor).type(`{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(textInputAnchor).type(`{backspace}{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Back to correct");
            cy.get(textInputAnchor).type(`re`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello there");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("be.visible");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Add a space");
            cy.get(textInputAnchor).type(` `);
            cy.get(textInputAnchor).should("have.value", "hello there ");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello there ");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("be.visible");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Delete again");
            cy.get(textInputAnchor).type(`{backspace}{backspace}{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Press enter on submit button");
            cy.get(textInputSubmitAnchor).type(`{enter}`, { force: true });
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("be.visible");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(textInputAnchor).type(`a`);
            cy.get(textInputAnchor).should("have.value", "hello thea");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying incorrect)");
            cy.get(textInputAnchor).type(`{backspace}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Delete all");
            cy.get(textInputAnchor).clear();
            cy.get(textInputAnchor).should("have.value", "");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log(
                "Restore incorrect submitted answer (no longer goes back to saying incorrect)",
            );
            cy.get(textInputAnchor).type(`hello the`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textInputAnchor).type(`{enter}`);
            cy.get(textInputAnchor).should("have.value", "hello the");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("be.visible");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Enter partially correct answer");
            cy.get(textInputAnchor).clear().type(`bye`);
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(textInputSubmitAnchor).click();
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("have.text", "32 %");

            cy.log("Add letter");
            cy.get(textInputAnchor).type(`z`);
            cy.get(textInputAnchor).should("have.value", "byez");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log(
                "Delete letter (no longer goes back to saying partially correct)",
            );
            cy.get(textInputAnchor).type(`{backspace}`);
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(textInputAnchor).type(`{backspace}{backspace}`);
            cy.get(textInputAnchor).should("have.value", "b");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log(
                "Back to partial (no longer goes back to saying partially correct)",
            );
            cy.get(textInputAnchor).type(`ye`);
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputSubmitAnchor).should("be.visible");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(textInputSubmitAnchor).click();
            cy.get(textInputAnchor).should("have.value", "bye");
            cy.get(textInputSubmitAnchor).should("not.exist");
            cy.get(textInputCorrectAnchor).should("not.exist");
            cy.get(textInputIncorrectAnchor).should("not.exist");
            cy.get(textInputPartialAnchor).should("have.text", "32 %");
        });
    });

    it("submit buttons with two answer blanks", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text name="a">a</text>
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Enter correct answer");
        cy.get(cesc("#mi1") + " textarea").type(`x+y`, {
            force: true,
        });
        cy.get(cesc("#mi2") + " textarea").type(`2x-y`, {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#mi2") + " textarea").blur();
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#mi1") + " textarea").type("{end}z", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#mi1") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#mi1") + " textarea").blur();
        cy.get(cesc("#mi2") + " textarea").type("{end}q", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#mi2") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#mi1") + " textarea").type("{end}z", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#mi1") + " textarea").blur();
        cy.get(cesc("#mi2") + " textarea").type("{end}q", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter in input1");
        cy.get(cesc("#mi1") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Don't go back to saying correct if return to previous answer");
        cy.get(cesc("#mi1") + " textarea").blur();
        cy.get(cesc("#mi2") + " textarea")
            .type("{end}{backspace}", { force: true })
            .blur();
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Enter partially correct answer");
        cy.get(cesc("#mi1") + " textarea")
            .type(`{ctrl+home}{shift+end}{backspace}x`, { force: true })
            .blur();
        cy.get(cesc("#mi2") + " textarea")
            .type(`{ctrl+home}{shift+end}{backspace}3-x`, { force: true })
            .blur();
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Delete letter in input1");
        cy.get(cesc("#mi1") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log(
            "Add letter back (no longer goes back to saying partially correct)",
        );
        cy.get(cesc("#mi1") + " textarea").type("{end}x", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Enter incorrect answer");
        cy.get(cesc("#mi1") + " textarea")
            .type(`{end}{backspace}y`, { force: true })
            .blur();
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter in input2");
        cy.get(cesc("#mi2") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Add letter back (no longer goes back to saying incorrect)");
        cy.get(cesc("#mi2") + " textarea").type("{end}x", {
            force: true,
        });
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#answer1_partial")).should("not.exist");
    });

    it("submit buttons with two text answer blanks", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text name="a">a</text>
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");
        cy.get(cesc("#ti1_input")).should("have.value", "");
        cy.get(cesc("#ti2_input")).should("have.value", "");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Enter a correct answer");
        cy.get(cesc("#ti1_input")).type(`rain`);
        cy.get(cesc("#ti2_input")).type(`snow`).blur();
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#ti1_input")).type("z");
        cy.get(cesc("#ti1_input")).should("have.value", "rainz");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#ti1_input")).type("{backspace}");
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#ti1_input")).blur();
        cy.get(cesc("#ti2_input")).type("q");
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snowq");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#ti2_input")).type("{backspace}");
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#ti1_input")).type("z");
        cy.get(cesc("#ti1_input")).should("have.value", "rainz");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#ti2_input")).type("q");
        cy.get(cesc("#ti1_input")).should("have.value", "rainz");
        cy.get(cesc("#ti2_input")).should("have.value", "snowq");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter in input1");
        cy.get(cesc("#ti1_input")).type("{backspace}");
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snowq");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Don't go back to saying correct if return to previous answer");
        cy.get(cesc("#ti2_input")).type("{backspace}").blur();
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#ti1_input")).should("have.value", "rain");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Enter partially correct answer");
        cy.get(cesc("#ti1_input")).clear().type(`x`).blur();
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Delete letter in input2");
        cy.get(cesc("#ti2_input")).type("{backspace}");
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "sno");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log(
            "Add letter back (no longer to back to saying partially correct)",
        );
        cy.get(cesc("#ti2_input")).type("w");
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "snow");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).click();
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Enter incorrect answer");
        cy.get(cesc("#ti2_input")).clear().type(`y`).blur();
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "y");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "y");
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Delete letter in input2");
        cy.get(cesc("#ti2_input")).type("{backspace}");
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Add letter back (no longer go back to saying incorrect");
        cy.get(cesc("#ti2_input")).type("y");
        cy.get(cesc("#ti1_input")).should("have.value", "x");
        cy.get(cesc("#ti2_input")).should("have.value", "y");
        cy.get(cesc("#answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect")).should("not.exist");
        cy.get(cesc("#answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#answer1_submit")).should("not.exist");
        cy.get(cesc("#answer1_correct")).should("not.exist");
        cy.get(cesc("#answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#answer1_partial")).should("not.exist");
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        // cy.get(cesc('#var') + ' textarea').should('have.value', 'x');
        // cy.get(cesc('#var2') + ' textarea').should('have.value', 'y');
        // cy.get(cesc('#ans') + ' textarea').should('have.value', '');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Type correct answer in");
        cy.get(cesc("#ans") + " textarea").type(`x`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("be.visible");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Change correct answer");
        cy.get(cesc("#var") + " textarea").type(`{end}{backspace}u{enter}`, {
            force: true,
        });
        // cy.get(cesc('#var') + ' textarea').should('have.value', 'u');
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("be.visible");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Change to new correct answer");
        cy.get(cesc("#ans") + " textarea").type(`{end}{backspace}u`, {
            force: true,
        });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("be.visible");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Change partial credit answer");
        cy.get(cesc("#var2") + " textarea").type(`{end}{backspace}v{enter}`, {
            force: true,
        });
        // cy.get(cesc('#var2') + ' textarea').should('have.value', 'v');
        // cy.get(cesc('#var') + ' textarea').should('have.value', 'u');
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("be.visible");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Change to new partial correct answer");
        cy.get(cesc("#ans") + " textarea").type(`{end}{backspace}v`, {
            force: true,
        });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("be.visible");

        cy.log("Change correct answer");
        cy.get(cesc("#var") + " textarea").type(`{end}{backspace}w{enter}`, {
            force: true,
        });
        // cy.get(cesc('#var') + ' textarea').should('have.value', 'w');
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'v');
        // cy.get(cesc('#var2') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("be.visible");

        cy.log("Change to new correct answer");
        cy.get(cesc("#ans") + " textarea").type(`{end}{backspace}w`, {
            force: true,
        });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'w');
        cy.get(cesc("#ans_submit")).should("be.visible");
        cy.get(cesc("#ans_correct")).should("not.exist");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#ans') + ' textarea').should('have.value', 'w');
        cy.get(cesc("#ans_submit")).should("not.exist");
        cy.get(cesc("#ans_correct")).should("be.visible");
        cy.get(cesc("#ans_incorrect")).should("not.exist");
        cy.get(cesc("#ans_partial")).should("not.exist");
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let choiceInputName =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let choiceInputAnchor = "#" + choiceInputName;
            let choiceInputSubmitAnchor = "#" + choiceInputName + "_submit";
            let choiceInputCorrectAnchor = "#" + choiceInputName + "_correct";
            let choiceInputIncorrectAnchor =
                "#" + choiceInputName + "_incorrect";
            let choiceInputPartialAnchor = "#" + choiceInputName + "_partial";

            cy.get(choiceInputAnchor).should("have.value", "");
            cy.get(choiceInputSubmitAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("check work");
                });
            cy.get(choiceInputCorrectAnchor).should("not.exist");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("not.exist");

            cy.log("toggle inline");
            cy.get(cesc("#inline")).click();
            cy.get(`${choiceInputAnchor} option:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceInputAnchor).should("have.value", "");
            cy.get(choiceInputSubmitAnchor).should("be.visible");
            cy.get(choiceInputCorrectAnchor).should("not.exist");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("not.exist");

            cy.log("Select correct answer");
            cy.get(choiceInputAnchor).select(`dog`);
            cy.get(choiceInputSubmitAnchor).should("be.visible");
            cy.get(choiceInputCorrectAnchor).should("not.exist");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(choiceInputSubmitAnchor).click();
            cy.get(choiceInputSubmitAnchor).should("not.exist");
            cy.get(choiceInputCorrectAnchor).should("be.visible");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("not.exist");

            cy.log("toggle inline");
            cy.get(cesc("#inline")).click();
            cy.get(`${choiceInputAnchor} label:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceInputSubmitAnchor).should("not.exist");
            cy.get(choiceInputCorrectAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("correct");
                });
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("not.exist");

            cy.log("Select partial credit answer");
            cy.get(choiceInputAnchor).contains(`cat`).click({ force: true });
            cy.get(choiceInputSubmitAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("check work");
                });
            cy.get(choiceInputCorrectAnchor).should("not.exist");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(choiceInputSubmitAnchor).click();
            cy.get(choiceInputSubmitAnchor).should("not.exist");
            cy.get(choiceInputCorrectAnchor).should("not.exist");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.log("toggle inline");
            cy.get(cesc("#inline")).click();
            cy.get(`${choiceInputAnchor} option:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceInputSubmitAnchor).should("not.exist");
            cy.get(choiceInputCorrectAnchor).should("not.exist");
            cy.get(choiceInputIncorrectAnchor).should("not.exist");
            cy.get(choiceInputPartialAnchor).should("have.text", "50 %");
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

        let submitAnchor = cesc("#a_submit");
        let correctAnchor = cesc("#a_correct");
        let incorrectAnchor = cesc("#a_incorrect");

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("contain.text", "＿");
        cy.get(cesc(`#sr`)).should("contain.text", "＿");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#val") + " textarea").type("3{enter}", { force: true });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("have.text", "3");
        cy.get(cesc(`#sr`)).should("contain.text", "＿");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#a_submit")).click();

        cy.get(submitAnchor).should("not.exist");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("be.visible");

        cy.get(cesc(`#cr`)).should("have.text", "3");
        cy.get(cesc(`#sr`)).should("have.text", "3");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#val") + " textarea").type("{end}{backspace}4", {
            force: true,
        });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("have.text", "3");
        cy.get(cesc(`#sr`)).should("have.text", "3");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#val") + " textarea").type("{end}{backspace}3", {
            force: true,
        });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("have.text", "3");
        cy.get(cesc(`#sr`)).should("have.text", "3");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#a_submit")).click();
        cy.get(submitAnchor).should("not.exist");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("be.visible");

        cy.get(cesc(`#cr`)).should("have.text", "3");
        cy.get(cesc(`#sr`)).should("have.text", "3");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#val") + " textarea").type("{end}{backspace}5", {
            force: true,
        });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("have.text", "3");
        cy.get(cesc(`#sr`)).should("have.text", "3");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#val") + " textarea").blur();

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("have.text", "5");
        cy.get(cesc(`#sr`)).should("have.text", "3");
        cy.get(cesc(`#ca`)).should("have.text", "0");

        cy.get(cesc("#a_submit")).click();
        cy.get(submitAnchor).should("not.exist");
        cy.get(correctAnchor).should("be.visible");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#cr`)).should("have.text", "5");
        cy.get(cesc(`#sr`)).should("have.text", "5");
        cy.get(cesc(`#ca`)).should("have.text", "1");
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let inputNames = [];
            for (let n of [...Array(20).keys()]) {
                inputNames.push(
                    stateVariables[await win.resolvePath1(`answer${n + 1}`)]
                        .stateValues.inputChildren[0].componentIdx,
                );
            }

            cy.log("Submit correct answers");
            cy.get(cesc("#" + inputNames[0]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc("#" + inputNames[1]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc("#" + inputNames[2]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc("#" + inputNames[3]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc("#answer3_submit")).click();
            cy.get(cesc("#answer4_submit")).click();
            cy.get(cesc("#" + inputNames[0]) + "_correct").should("be.visible");
            cy.get(cesc("#" + inputNames[1]) + "_correct").should("be.visible");
            cy.get(cesc("#answer3_correct")).should("be.visible");
            cy.get(cesc("#answer4_correct")).should("be.visible");

            cy.get(cesc("#" + inputNames[4]) + "_input").type("hello{enter}");
            cy.get(cesc("#" + inputNames[5]) + "_input").type("hello{enter}");
            cy.get(cesc("#" + inputNames[6]) + "_input").type("hello{enter}");
            cy.get(cesc("#" + inputNames[7]) + "_input").type("hello{enter}");
            cy.get(cesc("#answer7_submit")).click();
            cy.get(cesc("#answer8_submit")).click();
            cy.get(cesc("#" + inputNames[4]) + "_correct").should("be.visible");
            cy.get(cesc("#" + inputNames[5]) + "_correct").should("be.visible");
            cy.get(cesc("#answer7_correct")).should("be.visible");
            cy.get(cesc("#answer8_correct")).should("be.visible");

            cy.get(cesc("#choiceInput1"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput2"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput3"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput4"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput1_submit")).click();
            cy.get(cesc("#choiceInput2_submit")).click();
            cy.get(cesc("#answer11_submit")).click();
            cy.get(cesc("#answer12_submit")).click();
            cy.get(cesc("#choiceInput1_correct")).should("be.visible");
            cy.get(cesc("#choiceInput2_correct")).should("be.visible");
            cy.get(cesc("#answer11_correct")).should("be.visible");
            cy.get(cesc("#answer12_correct")).should("be.visible");

            cy.get(cesc("#choiceInput5")).select(`yes`);
            cy.get(cesc("#choiceInput6")).select(`yes`);
            cy.get(cesc("#choiceInput7")).select(`yes`);
            cy.get(cesc("#choiceInput8")).select(`yes`);
            cy.get(cesc("#choiceInput5_submit")).click();
            cy.get(cesc("#choiceInput6_submit")).click();
            cy.get(cesc("#answer15_submit")).click();
            cy.get(cesc("#answer16_submit")).click();
            cy.get(cesc("#choiceInput5_correct")).should("be.visible");
            cy.get(cesc("#choiceInput6_correct")).should("be.visible");
            cy.get(cesc("#answer15_correct")).should("be.visible");
            cy.get(cesc("#answer16_correct")).should("be.visible");

            cy.get(cesc("#" + inputNames[16])).click();
            cy.get(cesc("#" + inputNames[17])).click();
            cy.get(cesc("#" + inputNames[18])).click();
            cy.get(cesc("#" + inputNames[19])).click();
            cy.get(cesc("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc("#answer19_submit")).click();
            cy.get(cesc("#answer20_submit")).click();
            cy.get(cesc("#" + inputNames[16]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[17]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc("#answer19_correct")).should("be.visible");
            cy.get(cesc("#answer20_correct")).should("be.visible");

            cy.log("Submit incorrect answers");
            cy.get(cesc("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc("#" + inputNames[1]) + "_submit").click();
            cy.get(cesc("#answer3_submit")).click();
            cy.get(cesc("#answer4_submit")).click();
            cy.get(cesc("#" + inputNames[0]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[1]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer3_incorrect")).should("be.visible");
            cy.get(cesc("#answer4_incorrect")).should("be.visible");

            cy.get(cesc("#" + inputNames[4]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc("#" + inputNames[5]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc("#" + inputNames[6]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc("#" + inputNames[7]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc("#" + inputNames[5]) + "_submit").click();
            cy.get(cesc("#answer7_submit")).click();
            cy.get(cesc("#answer8_submit")).click();
            cy.get(cesc("#" + inputNames[4]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[5]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer7_incorrect")).should("be.visible");
            cy.get(cesc("#answer8_incorrect")).should("be.visible");

            cy.get(cesc("#choiceInput1")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput2")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput3")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput4")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput1_submit")).click();
            cy.get(cesc("#choiceInput2_submit")).click();
            cy.get(cesc("#answer11_submit")).click();
            cy.get(cesc("#answer12_submit")).click();
            cy.get(cesc("#choiceInput1_incorrect")).should("be.visible");
            cy.get(cesc("#choiceInput2_incorrect")).should("be.visible");
            cy.get(cesc("#answer11_incorrect")).should("be.visible");
            cy.get(cesc("#answer12_incorrect")).should("be.visible");

            cy.get(cesc("#choiceInput5")).select(`no`);
            cy.get(cesc("#choiceInput6")).select(`no`);
            cy.get(cesc("#choiceInput7")).select(`no`);
            cy.get(cesc("#choiceInput8")).select(`no`);
            cy.get(cesc("#choiceInput5_submit")).click();
            cy.get(cesc("#choiceInput6_submit")).click();
            cy.get(cesc("#answer15_submit")).click();
            cy.get(cesc("#answer16_submit")).click();
            cy.get(cesc("#choiceInput5_incorrect")).should("be.visible");
            cy.get(cesc("#choiceInput6_incorrect")).should("be.visible");
            cy.get(cesc("#answer15_incorrect")).should("be.visible");
            cy.get(cesc("#answer16_incorrect")).should("be.visible");

            cy.get(cesc("#" + inputNames[16])).click();
            cy.get(cesc("#" + inputNames[17])).click();
            cy.get(cesc("#" + inputNames[18])).click();
            cy.get(cesc("#" + inputNames[19])).click();
            cy.get(cesc("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc("#answer19_submit")).click();
            cy.get(cesc("#answer20_submit")).click();
            cy.get(cesc("#" + inputNames[16]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[17]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer19_incorrect")).should("be.visible");
            cy.get(cesc("#answer20_incorrect")).should("be.visible");

            cy.log("Type to submit correct answers again");

            // the 2nd and 4th input should be disabled,
            // but this isn't working yet.
            // For now, best we can do is make sure button still say incorrect
            cy.get(cesc("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc("#answer3_submit")).click();
            cy.get(cesc("#" + inputNames[0]) + "_correct").should("be.visible");
            cy.get(cesc("#" + inputNames[1]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer3_correct")).should("be.visible");
            cy.get(cesc("#answer4_incorrect")).should("be.visible");

            cy.get(cesc("#" + inputNames[4]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc("#" + inputNames[5]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[6]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc("#" + inputNames[7]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc("#answer7_submit")).click();
            cy.get(cesc("#" + inputNames[4]) + "_correct").should("be.visible");
            cy.get(cesc("#" + inputNames[5]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer7_correct")).should("be.visible");
            cy.get(cesc("#answer8_incorrect")).should("be.visible");

            cy.get(cesc("#choiceInput1"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput2"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput3"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput4"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput1_submit")).click();
            cy.get(cesc("#answer11_submit")).click();
            cy.get(cesc("#choiceInput1_correct")).should("be.visible");
            cy.get(cesc("#choiceInput2_incorrect")).should("be.visible");
            cy.get(cesc("#answer11_correct")).should("be.visible");
            cy.get(cesc("#answer12_incorrect")).should("be.visible");

            cy.get(cesc("#choiceInput5")).select(`yes`);
            cy.get(cesc("#choiceInput6")).should("be.disabled");
            cy.get(cesc("#choiceInput7")).select(`yes`);
            cy.get(cesc("#choiceInput8")).should("be.disabled");
            cy.get(cesc("#choiceInput5_submit")).click();
            cy.get(cesc("#answer15_submit")).click();
            cy.get(cesc("#choiceInput5_correct")).should("be.visible");
            cy.get(cesc("#choiceInput6_incorrect")).should("be.visible");
            cy.get(cesc("#answer15_correct")).should("be.visible");
            cy.get(cesc("#answer16_incorrect")).should("be.visible");

            cy.get(cesc("#" + inputNames[16])).click();
            cy.get(cesc("#" + inputNames[17]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[18])).click();
            cy.get(cesc("#" + inputNames[19]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc("#answer19_submit")).click();
            cy.get(cesc("#" + inputNames[16]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[17]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer19_correct")).should("be.visible");
            cy.get(cesc("#answer20_incorrect")).should("be.visible");
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let inputNames = [];
            for (let n of [...Array(20).keys()]) {
                inputNames.push(
                    stateVariables[await win.resolvePath1(`answer${n + 1}`)]
                        .stateValues.inputChildren[0].componentIdx,
                );
            }

            cy.log("Submit incorrect answers");
            cy.get(cesc("#" + inputNames[0]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc("#" + inputNames[1]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc("#" + inputNames[2]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc("#" + inputNames[3]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc("#answer3_submit")).click();
            cy.get(cesc("#answer4_submit")).click();
            cy.get(cesc("#" + inputNames[0]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[1]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer3_incorrect")).should("be.visible");
            cy.get(cesc("#answer4_incorrect")).should("be.visible");

            cy.get(cesc("#" + inputNames[4]) + "_input").type("bye{enter}");
            cy.get(cesc("#" + inputNames[5]) + "_input").type("bye{enter}");
            cy.get(cesc("#" + inputNames[6]) + "_input").type("bye{enter}");
            cy.get(cesc("#" + inputNames[7]) + "_input").type("bye{enter}");
            cy.get(cesc("#answer7_submit")).click();
            cy.get(cesc("#answer8_submit")).click();
            cy.get(cesc("#" + inputNames[4]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[5]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer7_incorrect")).should("be.visible");
            cy.get(cesc("#answer8_incorrect")).should("be.visible");

            cy.get(cesc("#choiceInput1")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput2")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput3")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput4")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput1_submit")).click();
            cy.get(cesc("#choiceInput2_submit")).click();
            cy.get(cesc("#answer11_submit")).click();
            cy.get(cesc("#answer12_submit")).click();
            cy.get(cesc("#choiceInput1_incorrect")).should("be.visible");
            cy.get(cesc("#choiceInput2_incorrect")).should("be.visible");
            cy.get(cesc("#answer11_incorrect")).should("be.visible");
            cy.get(cesc("#answer12_incorrect")).should("be.visible");

            cy.get(cesc("#choiceInput5")).select(`no`);
            cy.get(cesc("#choiceInput6")).select(`no`);
            cy.get(cesc("#choiceInput7")).select(`no`);
            cy.get(cesc("#choiceInput8")).select(`no`);
            cy.get(cesc("#choiceInput5_submit")).click();
            cy.get(cesc("#choiceInput6_submit")).click();
            cy.get(cesc("#answer15_submit")).click();
            cy.get(cesc("#answer16_submit")).click();
            cy.get(cesc("#choiceInput5_incorrect")).should("be.visible");
            cy.get(cesc("#choiceInput6_incorrect")).should("be.visible");
            cy.get(cesc("#answer15_incorrect")).should("be.visible");
            cy.get(cesc("#answer16_incorrect")).should("be.visible");

            cy.get(cesc("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc("#answer19_submit")).click();
            cy.get(cesc("#answer20_submit")).click();
            cy.get(cesc("#" + inputNames[16]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[17]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#answer19_incorrect")).should("be.visible");
            cy.get(cesc("#answer20_incorrect")).should("be.visible");

            cy.log("Submit correct answers");
            cy.get(cesc("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc("#" + inputNames[1]) + "_submit").click();
            cy.get(cesc("#answer3_submit")).click();
            cy.get(cesc("#answer4_submit")).click();
            cy.get(cesc("#" + inputNames[0]) + "_correct").should("be.visible");
            cy.get(cesc("#" + inputNames[1]) + "_correct").should("be.visible");
            cy.get(cesc("#answer3_correct")).should("be.visible");
            cy.get(cesc("#answer4_correct")).should("be.visible");

            cy.get(cesc("#" + inputNames[4]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc("#" + inputNames[5]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc("#" + inputNames[6]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc("#" + inputNames[7]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc("#" + inputNames[5]) + "_submit").click();
            cy.get(cesc("#answer7_submit")).click();
            cy.get(cesc("#answer8_submit")).click();
            cy.get(cesc("#" + inputNames[4]) + "_correct").should("be.visible");
            cy.get(cesc("#" + inputNames[5]) + "_correct").should("be.visible");
            cy.get(cesc("#answer7_correct")).should("be.visible");
            cy.get(cesc("#answer8_correct")).should("be.visible");

            cy.get(cesc("#choiceInput1"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput2"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput3"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput4"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc("#choiceInput1_submit")).click();
            cy.get(cesc("#choiceInput2_submit")).click();
            cy.get(cesc("#answer11_submit")).click();
            cy.get(cesc("#answer12_submit")).click();
            cy.get(cesc("#choiceInput1_correct")).should("be.visible");
            cy.get(cesc("#choiceInput2_correct")).should("be.visible");
            cy.get(cesc("#answer11_correct")).should("be.visible");
            cy.get(cesc("#answer12_correct")).should("be.visible");

            cy.get(cesc("#choiceInput5")).select(`yes`);
            cy.get(cesc("#choiceInput6")).select(`yes`);
            cy.get(cesc("#choiceInput7")).select(`yes`);
            cy.get(cesc("#choiceInput8")).select(`yes`);
            cy.get(cesc("#choiceInput5_submit")).click();
            cy.get(cesc("#choiceInput6_submit")).click();
            cy.get(cesc("#answer15_submit")).click();
            cy.get(cesc("#answer16_submit")).click();
            cy.get(cesc("#choiceInput5_correct")).should("be.visible");
            cy.get(cesc("#choiceInput6_correct")).should("be.visible");
            cy.get(cesc("#answer15_correct")).should("be.visible");
            cy.get(cesc("#answer16_correct")).should("be.visible");

            cy.get(cesc("#" + inputNames[16])).click();
            cy.get(cesc("#" + inputNames[17])).click();
            cy.get(cesc("#" + inputNames[18])).click();
            cy.get(cesc("#" + inputNames[19])).click();
            cy.get(cesc("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc("#answer19_submit")).click();
            cy.get(cesc("#answer20_submit")).click();
            cy.get(cesc("#" + inputNames[16]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[17]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc("#answer19_correct")).should("be.visible");
            cy.get(cesc("#answer20_correct")).should("be.visible");

            cy.log("Type to submit incorrect answers again");

            // the 2nd and 4th input should be disabled,
            // but this isn't working yet.
            // For now, best we can do is make sure button still say incorrect
            cy.get(cesc("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc("#answer3_submit")).click();
            cy.get(cesc("#" + inputNames[0]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[1]) + "_correct").should("be.visible");
            cy.get(cesc("#answer3_incorrect")).should("be.visible");
            cy.get(cesc("#answer4_correct")).should("be.visible");

            cy.get(cesc("#" + inputNames[4]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc("#" + inputNames[5]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[6]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc("#" + inputNames[7]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc("#answer7_submit")).click();
            cy.get(cesc("#" + inputNames[4]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[5]) + "_correct").should("be.visible");
            cy.get(cesc("#answer7_incorrect")).should("be.visible");
            cy.get(cesc("#answer8_correct")).should("be.visible");

            cy.get(cesc("#choiceInput1")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput2")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput3")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput4")).contains("no").click({ force: true });
            cy.get(cesc("#choiceInput1_submit")).click();
            cy.get(cesc("#answer11_submit")).click();
            cy.get(cesc("#choiceInput1_incorrect")).should("be.visible");
            cy.get(cesc("#choiceInput2_correct")).should("be.visible");
            cy.get(cesc("#answer11_incorrect")).should("be.visible");
            cy.get(cesc("#answer12_correct")).should("be.visible");

            cy.get(cesc("#choiceInput5")).select(`no`);
            cy.get(cesc("#choiceInput6")).should("be.disabled");
            cy.get(cesc("#choiceInput7")).select(`no`);
            cy.get(cesc("#choiceInput8")).should("be.disabled");
            cy.get(cesc("#choiceInput5_submit")).click();
            cy.get(cesc("#answer15_submit")).click();
            cy.get(cesc("#choiceInput5_incorrect")).should("be.visible");
            cy.get(cesc("#choiceInput6_correct")).should("be.visible");
            cy.get(cesc("#answer15_incorrect")).should("be.visible");
            cy.get(cesc("#answer16_correct")).should("be.visible");

            cy.get(cesc("#" + inputNames[16])).click();
            cy.get(cesc("#" + inputNames[17]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[18])).click();
            cy.get(cesc("#" + inputNames[19]) + "_input").should("be.disabled");
            cy.get(cesc("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc("#answer19_submit")).click();
            cy.get(cesc("#" + inputNames[16]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc("#" + inputNames[17]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc("#answer19_incorrect")).should("be.visible");
            cy.get(cesc("#answer20_correct")).should("be.visible");
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
      <constraints>
        <attractTo><point>(3,4)</point></attractTo>
        <attractTo><point>(-5,6)</point></attractTo>
      </constraints>
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.log("Submit incorrect answers");
        for (let i = 1; i <= 8; i++) {
            cy.get(cesc(`#answer${i}_submit`)).click();
            cy.get(cesc(`#answer${i}_incorrect`)).should("be.visible");
        }

        cy.log("submit first correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 3, y: 4 },
            });
        });
        cy.get(cesc("#mi") + " textarea").type("x{enter}", { force: true });

        for (let i = 1; i <= 8; i++) {
            cy.get(cesc(`#answer${i}_submit`)).click();
            if (i % 4 === 1 || i % 4 == 2) {
                cy.get(cesc(`#answer${i}_correct`)).should("be.visible");
            } else {
                cy.get(cesc(`#answer${i}_incorrect`)).should("be.visible");
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
        cy.get(cesc("#mi") + " textarea").type("{end}{backspace}y{enter}", {
            force: true,
        });

        for (let i = 1; i <= 8; i++) {
            if (i % 4 !== 2) {
                cy.get(cesc(`#answer${i}_submit`)).click();
            }
            if (i % 4 === 1) {
                cy.get(cesc(`#answer${i}_incorrect`)).should("be.visible");
            } else {
                cy.get(cesc(`#answer${i}_correct`)).should("be.visible");
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
        cy.get(cesc("#mi") + " textarea").type("{end}{backspace}z{enter}", {
            force: true,
        });

        for (let i = 1; i <= 8; i++) {
            if (i % 4 === 2 || i % 4 === 0) {
                cy.get(cesc(`#answer${i}_correct`)).should("be.visible");
            } else {
                cy.get(cesc(`#answer${i}_submit`)).click();
                cy.get(cesc(`#answer${i}_incorrect`)).should("be.visible");
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput1Name =
                stateVariables[await win.resolvePath1("ans1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput1Anchor = cesc("#" + mathInput1Name) + " textarea";

            let mathInput2Name =
                stateVariables[await win.resolvePath1("ans2")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput2Anchor = cesc("#" + mathInput2Name) + " textarea";

            let mathInput3Name =
                stateVariables[await win.resolvePath1("ans3")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput3Anchor = cesc("#" + mathInput3Name) + " textarea";

            let mathInput4Name =
                stateVariables[await win.resolvePath1("ans4")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Anchor = cesc("#" + mathInput4Name) + " textarea";

            cy.get(cesc("#ans1_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Check Work");
                });
            cy.get(cesc("#ans2_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });
            cy.get(cesc("#ans3_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Check Work");
                });
            cy.get(cesc("#ans4_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#ans1_submit")).click();
            cy.get(cesc("#ans2_submit")).click();
            cy.get(cesc("#ans3_submit")).click();
            cy.get(cesc("#ans4_submit")).click();

            cy.get(cesc("#ans1_correct")).should("contain.text", "Correct");
            cy.get(cesc("#ans2_correct")).should("contain.text", "Correct");
            cy.get(cesc("#ans3_correct")).should("contain.text", "Correct");
            cy.get(cesc("#ans4_correct")).should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get(cesc("#ans1_submit")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#ans2_submit")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#ans3_submit")).should("contain.text", "Guess");
            cy.get(cesc("#ans4_submit")).should("contain.text", "Guess");

            cy.get(cesc("#ans1_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Submit Response");
                });
            cy.get(cesc("#ans2_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Submit Response");
                });
            cy.get(cesc("#ans3_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });
            cy.get(cesc("#ans4_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#ans1_submit")).click();
            cy.get(cesc("#ans2_submit")).click();
            cy.get(cesc("#ans3_submit")).click();
            cy.get(cesc("#ans4_submit")).click();

            cy.get(cesc("#ans1_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#ans2_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#ans3_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#ans4_saved")).should(
                "contain.text",
                "Response Saved",
            );
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.get(cesc("#choiceInput1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Check Work");
            });
        cy.get(cesc("#choiceInput2_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Hit it!");
            });
        cy.get(cesc("#choiceInput3_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Check Work");
            });
        cy.get(cesc("#choiceInput4_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Hit it!");
            });

        cy.get(cesc("#choiceInput1")).contains(`yes`).click({ force: true });
        cy.get(cesc("#choiceInput2")).contains(`yes`).click({ force: true });
        cy.get(cesc("#choiceInput3")).contains(`yes`).click({ force: true });
        cy.get(cesc("#choiceInput4")).contains(`yes`).click({ force: true });

        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#choiceInput2_submit")).click();
        cy.get(cesc("#choiceInput3_submit")).click();
        cy.get(cesc("#choiceInput4_submit")).click();

        cy.get(cesc("#choiceInput1_correct")).should("contain.text", "Correct");
        cy.get(cesc("#choiceInput2_correct")).should("contain.text", "Correct");
        cy.get(cesc("#choiceInput3_correct")).should("contain.text", "Correct");
        cy.get(cesc("#choiceInput4_correct")).should("contain.text", "Correct");

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showCorrectness").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#choiceInput1_submit")).should(
            "contain.text",
            "Submit Response",
        );
        cy.get(cesc("#choiceInput2_submit")).should(
            "contain.text",
            "Submit Response",
        );
        cy.get(cesc("#choiceInput3_submit")).should("contain.text", "Guess");
        cy.get(cesc("#choiceInput4_submit")).should("contain.text", "Guess");

        cy.get(cesc("#choiceInput1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Submit Response");
            });
        cy.get(cesc("#choiceInput2_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Submit Response");
            });
        cy.get(cesc("#choiceInput3_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Guess");
            });
        cy.get(cesc("#choiceInput4_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Guess");
            });

        cy.get(cesc("#choiceInput1")).contains(`yes`).click({ force: true });
        cy.get(cesc("#choiceInput2")).contains(`yes`).click({ force: true });
        cy.get(cesc("#choiceInput3")).contains(`yes`).click({ force: true });
        cy.get(cesc("#choiceInput4")).contains(`yes`).click({ force: true });

        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#choiceInput2_submit")).click();
        cy.get(cesc("#choiceInput3_submit")).click();
        cy.get(cesc("#choiceInput4_submit")).click();

        cy.get(cesc("#choiceInput1_saved")).should(
            "contain.text",
            "Response Saved",
        );
        cy.get(cesc("#choiceInput2_saved")).should(
            "contain.text",
            "Response Saved",
        );
        cy.get(cesc("#choiceInput3_saved")).should(
            "contain.text",
            "Response Saved",
        );
        cy.get(cesc("#choiceInput4_saved")).should(
            "contain.text",
            "Response Saved",
        );
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

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInputName =
                stateVariables[await win.resolvePath1("x")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInputSubmitAnchor = cesc("#" + mathInputName + "_submit");

            let choiceInputName =
                stateVariables[await win.resolvePath1("correct")].stateValues
                    .inputChildren[0].componentIdx;
            let choiceInputSubmitAnchor = cesc(
                "#" + choiceInputName + "_submit",
            );

            cy.get(mathInputSubmitAnchor).should("be.visible");
            cy.get(choiceInputSubmitAnchor).should("be.visible");
            cy.get(cesc("#firstQuad_submit")).should("be.visible");
        });

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_autoSubmit").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInputName =
                stateVariables[await win.resolvePath1("x")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInputSubmitAnchor = cesc("#" + mathInputName + "_submit");

            let choiceInputName =
                stateVariables[await win.resolvePath1("correct")].stateValues
                    .inputChildren[0].componentIdx;
            let choiceInputSubmitAnchor = cesc(
                "#" + choiceInputName + "_submit",
            );

            cy.get(mathInputSubmitAnchor).should("not.exist");
            cy.get(choiceInputSubmitAnchor).should("not.exist");
            cy.get(cesc("#firstQuad_submit")).should("not.exist");
        });

        cy.get(cesc("#pSubX")).should("have.text", "Submitted response: ");
        cy.get(cesc("#pCreditX")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pSubCorrect")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get(cesc("#x") + " textarea").type("y", { force: true });

        cy.wait(1500); // wait for debounce

        cy.get(cesc("#pSubX")).should("have.text", "Submitted response: ");
        cy.get(cesc("#pCreditX")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get(cesc("#x") + " textarea").blur();
        cy.get(cesc("#pSubX")).should("contain.text", "y");
        cy.get(cesc("#pCreditX")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get(cesc("#x") + " textarea").type("{end}{backspace}x{enter}", {
            force: true,
        });
        cy.get(cesc("#pSubX")).should("contain.text", "x");
        cy.get(cesc("#pCreditX")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.333",
        );

        cy.get(cesc("#choice1")).click();
        cy.get(cesc("#pSubCorrect")).should(
            "have.text",
            "Submitted response: correct",
        );
        cy.get(cesc("#pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.get(cesc("#choice2")).click();
        cy.get(cesc("#pSubCorrect")).should(
            "have.text",
            "Submitted response: incorrect",
        );
        cy.get(cesc("#pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.333",
        );

        cy.get(cesc("#choice1")).click();
        cy.get(cesc("#pSubCorrect")).should(
            "have.text",
            "Submitted response: correct",
        );
        cy.get(cesc("#pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#pCreditDoc")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
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
        cy.get(cesc("#pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.get(cesc("#pSubFirstQuad")).should("contain.text", "3, −5");

        cy.get(cesc("#pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#pCreditDoc")).should(
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

        cy.get(cesc("#pSubFirstQuad")).should("contain.text", "9, 8");

        cy.get(cesc("#pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#pCreditDoc")).should(
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

        cy.get(cesc("#n") + " textarea").type("1", { force: true });

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

        cy.get(cesc("#n_submit")).click();
        cy.get(cesc("#n_correct")).should("be.visible");
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

        cy.get(cesc("#ti_input")).type("hello", { force: true });

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

        cy.get(cesc("#ti_submit")).click();
        cy.get(cesc("#ti_correct")).should("be.visible");
    });

    it("credit factor by attempt and disable wrong choices", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

  <p><answer name="answer1" inline creditFactorByAttempt="1 0.6 0.4" disableWrongChoices>
    <choiceInput name="choiceInput1">
      <choice credit="1">A</choice>
      <choice>B</choice>
      <choice>C</choice>
      <choice>D</choice>
    </choiceInput>
  </answer></p>
  <p><answer name="answer2" inline creditFactorByAttempt="1 0.6 0.4" disableWrongChoices forceFullCheckworkButton>
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

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "wrong answers reduce credit",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "wrong answers reduce credit",
        );

        cy.log("Submit correct answers");
        cy.get(cesc("#choiceInput1")).select(`A`);
        cy.get(cesc("#choiceInput2")).select(`A`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_correct")).should("be.visible");
        cy.get(cesc("#answer2_correct")).should("be.visible");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "wrong answers reduce credit",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "wrong answers reduce credit",
        );

        cy.log("Submit incorrect answers");
        cy.get(cesc("#choiceInput1")).select(`B`);
        cy.get(cesc("#choiceInput2")).select(`B`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_incorrect")).should("be.visible");
        cy.get(cesc("#answer2_incorrect")).should("be.visible");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "credit will be reduced by 60% due to 1 wrong answer",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "credit will be reduced by 60% due to 1 wrong answer",
        );
        cy.get(cesc("#choiceInput1")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="2"]`).should("be.disabled");

        cy.log("Submit correct answers for reduced credit");
        cy.get(cesc("#choiceInput1")).select(`A`);
        cy.get(cesc("#choiceInput2")).select(`A`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_partial")).should("have.text", "60 %");
        cy.get(cesc("#answer2_partial")).should("contain.text", "60% Credit");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "credit reduced by 60% due to 1 wrong answer",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "credit reduced by 60% due to 1 wrong answer",
        );
        cy.get(cesc("#choiceInput1")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="2"]`).should("be.disabled");

        cy.log("Submit second incorrect answers");
        cy.get(cesc("#choiceInput1")).select(`D`);
        cy.get(cesc("#choiceInput2")).select(`D`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_incorrect")).should("be.visible");
        cy.get(cesc("#answer2_incorrect")).should("be.visible");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "credit will be reduced by 40% due to 2 wrong answers",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "credit will be reduced by 40% due to 2 wrong answers",
        );
        cy.get(cesc("#choiceInput1")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput1")).get(`[value="4"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="4"]`).should("be.disabled");

        cy.log("Submit correct answers for further reduced credit");
        cy.get(cesc("#choiceInput1")).select(`A`);
        cy.get(cesc("#choiceInput2")).select(`A`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_partial")).should("have.text", "40 %");
        cy.get(cesc("#answer2_partial")).should("contain.text", "40% Credit");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "credit reduced by 40% due to 2 wrong answers",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "credit reduced by 40% due to 2 wrong answers",
        );
        cy.get(cesc("#choiceInput1")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput1")).get(`[value="4"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="4"]`).should("be.disabled");

        cy.log("Submit third incorrect answers");
        cy.get(cesc("#choiceInput1")).select(`C`);
        cy.get(cesc("#choiceInput2")).select(`C`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_incorrect")).should("be.visible");
        cy.get(cesc("#answer2_incorrect")).should("be.visible");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "credit will be reduced by 40% due to 3 wrong answers",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "credit will be reduced by 40% due to 3 wrong answers",
        );
        cy.get(cesc("#choiceInput1")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput1")).get(`[value="3"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="3"]`).should("be.disabled");
        cy.get(cesc("#choiceInput1")).get(`[value="4"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="4"]`).should("be.disabled");

        cy.log("Submit correct answers, credit not further reduced");
        cy.get(cesc("#choiceInput1")).select(`A`);
        cy.get(cesc("#choiceInput2")).select(`A`);
        cy.get(cesc("#choiceInput1_submit")).click();
        cy.get(cesc("#answer2_submit")).click();
        cy.get(cesc("#choiceInput1_partial")).should("have.text", "40 %");
        cy.get(cesc("#answer2_partial")).should("contain.text", "40% Credit");

        cy.get(cesc("#answer1")).should(
            "contain.text",
            "credit reduced by 40% due to 3 wrong answers",
        );
        cy.get(cesc("#answer2")).should(
            "contain.text",
            "credit reduced by 40% due to 3 wrong answers",
        );
        cy.get(cesc("#choiceInput1")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="2"]`).should("be.disabled");
        cy.get(cesc("#choiceInput1")).get(`[value="3"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="3"]`).should("be.disabled");
        cy.get(cesc("#choiceInput1")).get(`[value="4"]`).should("be.disabled");
        cy.get(cesc("#choiceInput2")).get(`[value="4"]`).should("be.disabled");
    });
});
