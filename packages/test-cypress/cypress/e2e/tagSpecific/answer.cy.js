import { cesc, cesc2 } from "@doenet/utils";

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
  <text>a</text>
  <p><answer>
    <award><math>x+y</math></award>
    <award credit="0.3215"><math>x+z</math></award>
  </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/_answer1"].stateValues.inputChildren[0]
                    .componentIdx;
            let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
            let mathinputCorrectAnchor = cesc2(
                "#" + mathinputName + "_correct",
            );
            let mathinputIncorrectAnchor = cesc2(
                "#" + mathinputName + "_incorrect",
            );
            let mathinputPartialAnchor = cesc2(
                "#" + mathinputName + "_partial",
            );

            // cy.get(mathinputAnchor).should('have.value', '');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Type correct answer in");
            cy.get(mathinputAnchor).type(`x+y`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathinputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Add space");
            cy.get(mathinputAnchor).type(`{end} `, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+yz');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathinputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete space");
            cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+yz');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathinputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(mathinputAnchor).type(`{end}z`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+yz');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying correct)");
            cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Back to correct (no longer goes back to saying correct)");
            cy.get(mathinputAnchor).type(`{end}+y`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(mathinputAnchor).type(`{enter}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+y');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("be.visible");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete again");
            cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Press enter on submit button");
            cy.get(mathinputSubmitAnchor).type(`{enter}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(mathinputAnchor).type(`{end}a`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'xa');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying incorrect)");
            cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete all");
            cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', '');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log(
                "Restore incorrect submitted answer (no longer goes back to saying incorrect)",
            );
            cy.get(mathinputAnchor).type(`x`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathinputSubmitAnchor).click();
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Enter partially correct answer");
            cy.get(mathinputAnchor).type(`{end}+z`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+z');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathinputSubmitAnchor).click();
            // cy.get(mathinputAnchor).should('have.value', 'x+z');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("have.text", "32 %");

            cy.log("Add letter");
            cy.get(mathinputAnchor).type(`{end}z`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+zz');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log(
                "Delete letter (no longer goes back to saying partially correct)",
            );
            cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+z');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, {
                force: true,
            });
            // cy.get(mathinputAnchor).should('have.value', 'x');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log(
                "Back to partial (no longer goes back to saying partially correct)",
            );
            cy.get(mathinputAnchor).type(`{end}+z`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+z');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathinputSubmitAnchor).click();
            // cy.get(mathinputAnchor).should('have.value', 'x+z');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("have.text", "32 %");

            cy.log("Enter invalid answer");
            cy.get(mathinputAnchor).type(`{end}/`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+z');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathinputSubmitAnchor).click();
            // cy.get(mathinputAnchor).should('have.value', 'x+z/');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Another invalid answer shows submit button again");
            cy.get(mathinputAnchor).type(`{end}^`, { force: true });
            // cy.get(mathinputAnchor).should('have.value', 'x+z/^');
            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("not.exist");
            cy.get(mathinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(mathinputSubmitAnchor).click();
            // cy.get(mathinputAnchor).should('have.value', 'x+z/^');
            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(mathinputCorrectAnchor).should("not.exist");
            cy.get(mathinputIncorrectAnchor).should("be.visible");
            cy.get(mathinputPartialAnchor).should("not.exist");
        });
    });

    it("integrated submit buttons, text", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p><answer type="text">
    <award><text>hello there</text></award>
    <award credit="0.3215"><text>bye</text></award>
  </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let textinputName =
                stateVariables["/_answer1"].stateValues.inputChildren[0]
                    .componentIdx;
            let textinputAnchor = cesc2("#" + textinputName + "_input");
            let textinputSubmitAnchor = cesc2("#" + textinputName + "_submit");
            let textinputCorrectAnchor = cesc2(
                "#" + textinputName + "_correct",
            );
            let textinputIncorrectAnchor = cesc2(
                "#" + textinputName + "_incorrect",
            );
            let textinputPartialAnchor = cesc2(
                "#" + textinputName + "_partial",
            );

            cy.get(textinputAnchor).should("have.value", "");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Type correct answer in");
            cy.get(textinputAnchor).type(`hello there`);
            cy.get(textinputAnchor).should("have.value", "hello there");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textinputAnchor).type(`{enter}`);
            cy.get(textinputAnchor).should("have.value", "hello there");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("be.visible");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(textinputAnchor).type(`z`);
            cy.get(textinputAnchor).should("have.value", "hello therez");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying correct)");
            cy.get(textinputAnchor).type(`{backspace}`);
            cy.get(textinputAnchor).should("have.value", "hello there");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(textinputAnchor).type(`{backspace}{backspace}`);
            cy.get(textinputAnchor).should("have.value", "hello the");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Back to correct");
            cy.get(textinputAnchor).type(`re`);
            cy.get(textinputAnchor).should("have.value", "hello there");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textinputAnchor).type(`{enter}`);
            cy.get(textinputAnchor).should("have.value", "hello there");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("be.visible");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Add a space");
            cy.get(textinputAnchor).type(` `);
            cy.get(textinputAnchor).should("have.value", "hello there ");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textinputAnchor).type(`{enter}`);
            cy.get(textinputAnchor).should("have.value", "hello there ");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("be.visible");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Delete again");
            cy.get(textinputAnchor).type(`{backspace}{backspace}{backspace}`);
            cy.get(textinputAnchor).should("have.value", "hello the");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Press enter on submit button");
            cy.get(textinputSubmitAnchor).type(`{enter}`, { force: true });
            cy.get(textinputAnchor).should("have.value", "hello the");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("be.visible");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Add letter");
            cy.get(textinputAnchor).type(`a`);
            cy.get(textinputAnchor).should("have.value", "hello thea");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Delete letter (no longer goes back to saying incorrect)");
            cy.get(textinputAnchor).type(`{backspace}`);
            cy.get(textinputAnchor).should("have.value", "hello the");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Delete all");
            cy.get(textinputAnchor).clear();
            cy.get(textinputAnchor).should("have.value", "");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log(
                "Restore incorrect submitted answer (no longer goes back to saying incorrect)",
            );
            cy.get(textinputAnchor).type(`hello the`);
            cy.get(textinputAnchor).should("have.value", "hello the");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Press enter");
            cy.get(textinputAnchor).type(`{enter}`);
            cy.get(textinputAnchor).should("have.value", "hello the");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("be.visible");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Enter partially correct answer");
            cy.get(textinputAnchor).clear().type(`bye`);
            cy.get(textinputAnchor).should("have.value", "bye");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(textinputSubmitAnchor).click();
            cy.get(textinputAnchor).should("have.value", "bye");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("have.text", "32 %");

            cy.log("Add letter");
            cy.get(textinputAnchor).type(`z`);
            cy.get(textinputAnchor).should("have.value", "byez");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log(
                "Delete letter (no longer goes back to saying partially correct)",
            );
            cy.get(textinputAnchor).type(`{backspace}`);
            cy.get(textinputAnchor).should("have.value", "bye");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Delete more");
            cy.get(textinputAnchor).type(`{backspace}{backspace}`);
            cy.get(textinputAnchor).should("have.value", "b");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log(
                "Back to partial (no longer goes back to saying partially correct)",
            );
            cy.get(textinputAnchor).type(`ye`);
            cy.get(textinputAnchor).should("have.value", "bye");
            cy.get(textinputSubmitAnchor).should("be.visible");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(textinputSubmitAnchor).click();
            cy.get(textinputAnchor).should("have.value", "bye");
            cy.get(textinputSubmitAnchor).should("not.exist");
            cy.get(textinputCorrectAnchor).should("not.exist");
            cy.get(textinputIncorrectAnchor).should("not.exist");
            cy.get(textinputPartialAnchor).should("have.text", "32 %");
        });
    });

    it("submit buttons with two answer blanks", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <answer>
  <award><when><math>$_mathinput1.immediateValue{isResponse}+$_mathinput2.immediateValue{isResponse}</math> = <math>3x</math></when></award>
  <award credit="0.5"><when><math>$_mathinput1.immediateValue+$_mathinput2.immediateValue</math> = <math>3</math></when></award>
  </answer></p>

  <p>$_mathinput1.immediateValue</p>
  <p>$_mathinput2.immediateValue</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Enter correct answer");
        cy.get(cesc("#\\/_mathinput1") + " textarea").type(`x+y`, {
            force: true,
        });
        cy.get(cesc("#\\/_mathinput2") + " textarea").type(`2x-y`, {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_mathinput2") + " textarea").blur();
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}z", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#\\/_mathinput1") + " textarea").blur();
        cy.get(cesc("#\\/_mathinput2") + " textarea").type("{end}q", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#\\/_mathinput2") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}z", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#\\/_mathinput1") + " textarea").blur();
        cy.get(cesc("#\\/_mathinput2") + " textarea").type("{end}q", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter in input1");
        cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Don't go back to saying correct if return to previous answer");
        cy.get(cesc("#\\/_mathinput1") + " textarea").blur();
        cy.get(cesc("#\\/_mathinput2") + " textarea")
            .type("{end}{backspace}", { force: true })
            .blur();
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Enter partially correct answer");
        cy.get(cesc("#\\/_mathinput1") + " textarea")
            .type(`{ctrl+home}{shift+end}{backspace}x`, { force: true })
            .blur();
        cy.get(cesc("#\\/_mathinput2") + " textarea")
            .type(`{ctrl+home}{shift+end}{backspace}3-x`, { force: true })
            .blur();
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Delete letter in input1");
        cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log(
            "Add letter back (no longer goes back to saying partially correct)",
        );
        cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}x", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Enter incorrect answer");
        cy.get(cesc("#\\/_mathinput1") + " textarea")
            .type(`{end}{backspace}y`, { force: true })
            .blur();
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter in input2");
        cy.get(cesc("#\\/_mathinput2") + " textarea").type("{end}{backspace}", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Add letter back (no longer goes back to saying incorrect)");
        cy.get(cesc("#\\/_mathinput2") + " textarea").type("{end}x", {
            force: true,
        });
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");
    });

    it("submit buttons with two text answer blanks", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <p>Enter rain and snow in either order: <textinput/> <textinput/>
        <answer>
        <award><when><text>$_textinput1.immediateValue{isResponse} $_textinput2.immediateValue{isResponse}</text> = <text>rain snow</text></when></award>
        <award><when><text>$_textinput1.immediateValue $_textinput2.immediateValue</text> = <text>snow rain</text></when></award>
        <award credit="0.5"><when>$_textinput1.immediateValue = rain</when></award>
        <award credit="0.5"><when>$_textinput1.immediateValue = snow</when></award>
        <award credit="0.5"><when>$_textinput2.immediateValue = rain</when></award>
        <award credit="0.5"><when>$_textinput2.immediateValue = snow</when></award>
        </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Enter a correct answer");
        cy.get(cesc("#\\/_textinput1_input")).type(`rain`);
        cy.get(cesc("#\\/_textinput2_input")).type(`snow`).blur();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#\\/_textinput1_input")).type("z");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rainz");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#\\/_textinput1_input")).type("{backspace}");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#\\/_textinput1_input")).blur();
        cy.get(cesc("#\\/_textinput2_input")).type("q");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snowq");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter (no longer goes back to saying correct)");
        cy.get(cesc("#\\/_textinput2_input")).type("{backspace}");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input1");
        cy.get(cesc("#\\/_textinput1_input")).type("z");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rainz");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Type letter in input2");
        cy.get(cesc("#\\/_textinput2_input")).type("q");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rainz");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snowq");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter in input1");
        cy.get(cesc("#\\/_textinput1_input")).type("{backspace}");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snowq");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Don't go back to saying correct if return to previous answer");
        cy.get(cesc("#\\/_textinput2_input")).type("{backspace}").blur();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "rain");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("correct");
            });
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Enter partially correct answer");
        cy.get(cesc("#\\/_textinput1_input")).clear().type(`x`).blur();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Delete letter in input2");
        cy.get(cesc("#\\/_textinput2_input")).type("{backspace}");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "sno");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log(
            "Add letter back (no longer to back to saying partially correct)",
        );
        cy.get(cesc("#\\/_textinput2_input")).type("w");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "snow");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).click();
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("50% correct");
            });

        cy.log("Enter incorrect answer");
        cy.get(cesc("#\\/_textinput2_input")).clear().type(`y`).blur();
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "y");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "y");
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Delete letter in input2");
        cy.get(cesc("#\\/_textinput2_input")).type("{backspace}");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Add letter back (no longer go back to saying incorrect");
        cy.get(cesc("#\\/_textinput2_input")).type("y");
        cy.get(cesc("#\\/_textinput1_input")).should("have.value", "x");
        cy.get(cesc("#\\/_textinput2_input")).should("have.value", "y");
        cy.get(cesc("#\\/_answer1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("check work");
            });
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect")).should("not.exist");
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");

        cy.log("Submit answer");
        cy.get(cesc("#\\/_answer1_submit")).type("{enter}", { force: true });
        cy.get(cesc("#\\/_answer1_submit")).should("not.exist");
        cy.get(cesc("#\\/_answer1_correct")).should("not.exist");
        cy.get(cesc("#\\/_answer1_incorrect"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("incorrect");
            });
        cy.get(cesc("#\\/_answer1_partial")).should("not.exist");
    });

    it("submit button with external inputs", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p>Favorite variable: <mathinput name="var" prefill="x"/></p>
    <p>Second favorite variable: <mathinput name="var2" prefill="y"/></p>
    <p>Enter variable:
    <answer>
      <mathinput name="ans"/>
      <award><when>$ans.immediatevalue{isResponse} = $var.immediatevalue</when></award>
      <award credit="0.5"><when>$ans.immediatevalue = $var2.immediatevalue</when></award>
    </answer>
    </p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        // cy.get(cesc('#\\/var') + ' textarea').should('have.value', 'x');
        // cy.get(cesc('#\\/var2') + ' textarea').should('have.value', 'y');
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', '');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Type correct answer in");
        cy.get(cesc("#\\/ans") + " textarea").type(`x`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("be.visible");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Change correct answer");
        cy.get(cesc("#\\/var") + " textarea").type(`{end}{backspace}u{enter}`, {
            force: true,
        });
        // cy.get(cesc('#\\/var') + ' textarea').should('have.value', 'u');
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'x');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Change to new correct answer");
        cy.get(cesc("#\\/ans") + " textarea").type(`{end}{backspace}u`, {
            force: true,
        });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("be.visible");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Change partial credit answer");
        cy.get(cesc("#\\/var2") + " textarea").type(
            `{end}{backspace}v{enter}`,
            {
                force: true,
            },
        );
        // cy.get(cesc('#\\/var2') + ' textarea').should('have.value', 'v');
        // cy.get(cesc('#\\/var') + ' textarea').should('have.value', 'u');
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'u');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("be.visible");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Change to new partial correct answer");
        cy.get(cesc("#\\/ans") + " textarea").type(`{end}{backspace}v`, {
            force: true,
        });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("be.visible");

        cy.log("Change correct answer");
        cy.get(cesc("#\\/var") + " textarea").type(`{end}{backspace}w{enter}`, {
            force: true,
        });
        // cy.get(cesc('#\\/var') + ' textarea').should('have.value', 'w');
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'v');
        // cy.get(cesc('#\\/var2') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'v');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("be.visible");

        cy.log("Change to new correct answer");
        cy.get(cesc("#\\/ans") + " textarea").type(`{end}{backspace}w`, {
            force: true,
        });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'w');
        cy.get(cesc("#\\/ans_submit")).should("be.visible");
        cy.get(cesc("#\\/ans_correct")).should("not.exist");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");

        cy.log("Press enter");
        cy.get(cesc("#\\/ans") + " textarea").type(`{enter}`, { force: true });
        // cy.get(cesc('#\\/ans') + ' textarea').should('have.value', 'w');
        cy.get(cesc("#\\/ans_submit")).should("not.exist");
        cy.get(cesc("#\\/ans_correct")).should("be.visible");
        cy.get(cesc("#\\/ans_incorrect")).should("not.exist");
        cy.get(cesc("#\\/ans_partial")).should("not.exist");
    });

    // actually test the interface of block versus inline choice inputs

    it("switch answer between inline and block", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text>a</text>
      <p>Inline: <booleaninput name="inline" /> </p>
      <answer inline="$inline">
        <choiceinput shuffleOrder>
        <choice credit="0.5">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        </choiceinput>
      </answer>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let choiceinputName = cesc2(
                stateVariables["/_answer1"].stateValues.inputChildren[0]
                    .componentIdx,
            );
            let choiceinputAnchor = "#" + choiceinputName;
            let choiceinputSubmitAnchor = "#" + choiceinputName + "_submit";
            let choiceinputCorrectAnchor = "#" + choiceinputName + "_correct";
            let choiceinputIncorrectAnchor =
                "#" + choiceinputName + "_incorrect";
            let choiceinputPartialAnchor = "#" + choiceinputName + "_partial";

            cy.get(choiceinputAnchor).should("have.value", "");
            cy.get(choiceinputSubmitAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("check work");
                });
            cy.get(choiceinputCorrectAnchor).should("not.exist");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("not.exist");

            cy.log("toggle inline");
            cy.get(cesc("#\\/inline")).click();
            cy.get(`${choiceinputAnchor} option:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceinputAnchor).should("have.value", "");
            cy.get(choiceinputSubmitAnchor).should("be.visible");
            cy.get(choiceinputCorrectAnchor).should("not.exist");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("not.exist");

            cy.log("Select correct answer");
            cy.get(choiceinputAnchor).select(`dog`);
            cy.get(choiceinputSubmitAnchor).should("be.visible");
            cy.get(choiceinputCorrectAnchor).should("not.exist");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(choiceinputSubmitAnchor).click();
            cy.get(choiceinputSubmitAnchor).should("not.exist");
            cy.get(choiceinputCorrectAnchor).should("be.visible");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("not.exist");

            cy.log("toggle inline");
            cy.get(cesc("#\\/inline")).click();
            cy.get(`${choiceinputAnchor} label:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceinputSubmitAnchor).should("not.exist");
            cy.get(choiceinputCorrectAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("correct");
                });
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("not.exist");

            cy.log("Select partial credit answer");
            cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
            cy.get(choiceinputSubmitAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("check work");
                });
            cy.get(choiceinputCorrectAnchor).should("not.exist");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("not.exist");

            cy.log("Click submit button");
            cy.get(choiceinputSubmitAnchor).click();
            cy.get(choiceinputSubmitAnchor).should("not.exist");
            cy.get(choiceinputCorrectAnchor).should("not.exist");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.log("toggle inline");
            cy.get(cesc("#\\/inline")).click();
            cy.get(`${choiceinputAnchor} option:nth-of-type(3)`).should(
                "be.visible",
            );
            cy.get(choiceinputSubmitAnchor).should("not.exist");
            cy.get(choiceinputCorrectAnchor).should("not.exist");
            cy.get(choiceinputIncorrectAnchor).should("not.exist");
            cy.get(choiceinputPartialAnchor).should("have.text", "50 %");
        });
    });

    it("immediate value used for submit button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <p>Enter value larger than 3: <mathinput name="val" /></p>
        
        <answer name="a"> 
         <award sourcesAreResponses="val"><when>$val > 3</when></award>
        </answer>
        
        <p>Current response: <math copySource="a.currentResponses" name="cr" /></p>
        <p>Submitted response: <math copySource="a.submittedResponses" name="sr" /></p>
        <p>Credit: $a.creditAchieved{assignNames="ca"}</p>
 `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        let submitAnchor = cesc2("#/a_submit");
        let correctAnchor = cesc2("#/a_correct");
        let incorrectAnchor = cesc2("#/a_incorrect");

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("contain.text", "＿");
        cy.get(cesc(`#\\/sr`)).should("contain.text", "＿");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/val") + " textarea").type("3{enter}", { force: true });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("have.text", "3");
        cy.get(cesc(`#\\/sr`)).should("contain.text", "＿");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/a_submit")).click();

        cy.get(submitAnchor).should("not.exist");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("be.visible");

        cy.get(cesc(`#\\/cr`)).should("have.text", "3");
        cy.get(cesc(`#\\/sr`)).should("have.text", "3");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/val") + " textarea").type("{end}{backspace}4", {
            force: true,
        });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("have.text", "3");
        cy.get(cesc(`#\\/sr`)).should("have.text", "3");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/val") + " textarea").type("{end}{backspace}3", {
            force: true,
        });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("have.text", "3");
        cy.get(cesc(`#\\/sr`)).should("have.text", "3");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/a_submit")).click();
        cy.get(submitAnchor).should("not.exist");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("be.visible");

        cy.get(cesc(`#\\/cr`)).should("have.text", "3");
        cy.get(cesc(`#\\/sr`)).should("have.text", "3");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/val") + " textarea").type("{end}{backspace}5", {
            force: true,
        });

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("have.text", "3");
        cy.get(cesc(`#\\/sr`)).should("have.text", "3");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/val") + " textarea").blur();

        cy.get(submitAnchor).should("be.visible");
        cy.get(correctAnchor).should("not.exist");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("have.text", "5");
        cy.get(cesc(`#\\/sr`)).should("have.text", "3");
        cy.get(cesc(`#\\/ca`)).should("have.text", "0");

        cy.get(cesc("#\\/a_submit")).click();
        cy.get(submitAnchor).should("not.exist");
        cy.get(correctAnchor).should("be.visible");
        cy.get(incorrectAnchor).should("not.exist");

        cy.get(cesc(`#\\/cr`)).should("have.text", "5");
        cy.get(cesc(`#\\/sr`)).should("have.text", "5");
        cy.get(cesc(`#\\/ca`)).should("have.text", "1");
    });

    it("maximum number of attempts", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p><answer>x</answer></p>
  <p><answer maxNumAttempts="2">x</answer></p>
  <p><answer forceFullCheckworkButton>x</answer></p>
  <p><answer forceFullCheckworkButton maxNumAttempts="2">x</answer></p>
  
  <p><answer type="text">hello</answer></p>
  <p><answer type="text" maxNumAttempts="2">hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton>hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton maxNumAttempts="2">hello</answer></p>
    
  <p><answer>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer maxNumAttempts="2">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton maxNumAttempts="2">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  
  <p><answer>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer maxNumAttempts="2">
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton maxNumAttempts="2">
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>

  <p><answer type="boolean">true</answer></p>
  <p><answer type="boolean" maxNumAttempts="2">true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton>true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton maxNumAttempts="2">true</answer></p>
   `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let inputNames = [...Array(20).keys()].map(
                (n) =>
                    stateVariables[`/_answer${n + 1}`].stateValues
                        .inputChildren[0].componentIdx,
            );

            cy.log("Submit correct answers");
            cy.get(cesc2("#" + inputNames[0]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc2("#" + inputNames[1]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc2("#" + inputNames[2]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc2("#" + inputNames[3]) + " textarea").type("x{enter}", {
                force: true,
            });
            cy.get(cesc2("#/_answer3_submit")).click();
            cy.get(cesc2("#/_answer4_submit")).click();
            cy.get(cesc2("#" + inputNames[0]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[1]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer3_correct")).should("be.visible");
            cy.get(cesc2("#/_answer4_correct")).should("be.visible");

            cy.get(cesc2("#" + inputNames[4]) + "_input").type("hello{enter}");
            cy.get(cesc2("#" + inputNames[5]) + "_input").type("hello{enter}");
            cy.get(cesc2("#" + inputNames[6]) + "_input").type("hello{enter}");
            cy.get(cesc2("#" + inputNames[7]) + "_input").type("hello{enter}");
            cy.get(cesc2("#/_answer7_submit")).click();
            cy.get(cesc2("#/_answer8_submit")).click();
            cy.get(cesc2("#" + inputNames[4]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[5]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer7_correct")).should("be.visible");
            cy.get(cesc2("#/_answer8_correct")).should("be.visible");

            cy.get(cesc2("#/_choiceinput1"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput2"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput3"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput4"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput1_submit")).click();
            cy.get(cesc2("#/_choiceinput2_submit")).click();
            cy.get(cesc2("#/_answer11_submit")).click();
            cy.get(cesc2("#/_answer12_submit")).click();
            cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");
            cy.get(cesc2("#/_choiceinput2_correct")).should("be.visible");
            cy.get(cesc2("#/_answer11_correct")).should("be.visible");
            cy.get(cesc2("#/_answer12_correct")).should("be.visible");

            cy.get(cesc("#\\/_choiceinput5")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput6")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput7")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput8")).select(`yes`);
            cy.get(cesc2("#/_choiceinput5_submit")).click();
            cy.get(cesc2("#/_choiceinput6_submit")).click();
            cy.get(cesc2("#/_answer15_submit")).click();
            cy.get(cesc2("#/_answer16_submit")).click();
            cy.get(cesc2("#/_choiceinput5_correct")).should("be.visible");
            cy.get(cesc2("#/_choiceinput6_correct")).should("be.visible");
            cy.get(cesc2("#/_answer15_correct")).should("be.visible");
            cy.get(cesc2("#/_answer16_correct")).should("be.visible");

            cy.get(cesc2("#" + inputNames[16])).click();
            cy.get(cesc2("#" + inputNames[17])).click();
            cy.get(cesc2("#" + inputNames[18])).click();
            cy.get(cesc2("#" + inputNames[19])).click();
            cy.get(cesc2("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc2("#/_answer19_submit")).click();
            cy.get(cesc2("#/_answer20_submit")).click();
            cy.get(cesc2("#" + inputNames[16]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[17]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer19_correct")).should("be.visible");
            cy.get(cesc2("#/_answer20_correct")).should("be.visible");

            cy.log("Submit incorrect answers");
            cy.get(cesc2("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[1]) + "_submit").click();
            cy.get(cesc2("#/_answer3_submit")).click();
            cy.get(cesc2("#/_answer4_submit")).click();
            cy.get(cesc2("#" + inputNames[0]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[1]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer3_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer4_incorrect")).should("be.visible");

            cy.get(cesc2("#" + inputNames[4]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc2("#" + inputNames[5]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc2("#" + inputNames[6]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc2("#" + inputNames[7]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc2("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[5]) + "_submit").click();
            cy.get(cesc2("#/_answer7_submit")).click();
            cy.get(cesc2("#/_answer8_submit")).click();
            cy.get(cesc2("#" + inputNames[4]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[5]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer7_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer8_incorrect")).should("be.visible");

            cy.get(cesc2("#/_choiceinput1"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput2"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput3"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput4"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput1_submit")).click();
            cy.get(cesc2("#/_choiceinput2_submit")).click();
            cy.get(cesc2("#/_answer11_submit")).click();
            cy.get(cesc2("#/_answer12_submit")).click();
            cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
            cy.get(cesc2("#/_choiceinput2_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer11_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer12_incorrect")).should("be.visible");

            cy.get(cesc("#\\/_choiceinput5")).select(`no`);
            cy.get(cesc("#\\/_choiceinput6")).select(`no`);
            cy.get(cesc("#\\/_choiceinput7")).select(`no`);
            cy.get(cesc("#\\/_choiceinput8")).select(`no`);
            cy.get(cesc2("#/_choiceinput5_submit")).click();
            cy.get(cesc2("#/_choiceinput6_submit")).click();
            cy.get(cesc2("#/_answer15_submit")).click();
            cy.get(cesc2("#/_answer16_submit")).click();
            cy.get(cesc2("#/_choiceinput5_incorrect")).should("be.visible");
            cy.get(cesc2("#/_choiceinput6_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer15_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer16_incorrect")).should("be.visible");

            cy.get(cesc2("#" + inputNames[16])).click();
            cy.get(cesc2("#" + inputNames[17])).click();
            cy.get(cesc2("#" + inputNames[18])).click();
            cy.get(cesc2("#" + inputNames[19])).click();
            cy.get(cesc2("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc2("#/_answer19_submit")).click();
            cy.get(cesc2("#/_answer20_submit")).click();
            cy.get(cesc2("#" + inputNames[16]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[17]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer19_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer20_incorrect")).should("be.visible");

            cy.log("Type to submit correct answers again");

            // the 2nd and 4th input should be disabled,
            // but this isn't working yet.
            // For now, best we can do is make sure button still say incorrect
            cy.get(cesc2("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc2("#/_answer3_submit")).click();
            cy.get(cesc2("#" + inputNames[0]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[1]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer3_correct")).should("be.visible");
            cy.get(cesc2("#/_answer4_incorrect")).should("be.visible");

            cy.get(cesc2("#" + inputNames[4]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc2("#" + inputNames[5]) + "_input").should("be.disabled");
            cy.get(cesc2("#" + inputNames[6]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc2("#" + inputNames[7]) + "_input").should("be.disabled");
            cy.get(cesc2("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc2("#/_answer7_submit")).click();
            cy.get(cesc2("#" + inputNames[4]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[5]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer7_correct")).should("be.visible");
            cy.get(cesc2("#/_answer8_incorrect")).should("be.visible");

            cy.get(cesc2("#/_choiceinput1"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput2"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput3"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput4"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput1_submit")).click();
            cy.get(cesc2("#/_answer11_submit")).click();
            cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");
            cy.get(cesc2("#/_choiceinput2_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer11_correct")).should("be.visible");
            cy.get(cesc2("#/_answer12_incorrect")).should("be.visible");

            cy.get(cesc("#\\/_choiceinput5")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput6")).should("be.disabled");
            cy.get(cesc("#\\/_choiceinput7")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput8")).should("be.disabled");
            cy.get(cesc2("#/_choiceinput5_submit")).click();
            cy.get(cesc2("#/_answer15_submit")).click();
            cy.get(cesc2("#/_choiceinput5_correct")).should("be.visible");
            cy.get(cesc2("#/_choiceinput6_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer15_correct")).should("be.visible");
            cy.get(cesc2("#/_answer16_incorrect")).should("be.visible");

            cy.get(cesc2("#" + inputNames[16])).click();
            cy.get(cesc2("#" + inputNames[17]) + "_input").should(
                "be.disabled",
            );
            cy.get(cesc2("#" + inputNames[18])).click();
            cy.get(cesc2("#" + inputNames[19]) + "_input").should(
                "be.disabled",
            );
            cy.get(cesc2("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc2("#/_answer19_submit")).click();
            cy.get(cesc2("#" + inputNames[16]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[17]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer19_correct")).should("be.visible");
            cy.get(cesc2("#/_answer20_incorrect")).should("be.visible");
        });
    });

    it("disable after correct", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p><answer>x</answer></p>
  <p><answer disableAfterCorrect>x</answer></p>
  <p><answer forceFullCheckworkButton>x</answer></p>
  <p><answer forceFullCheckworkButton disableAfterCorrect>x</answer></p>
  
  <p><answer type="text">hello</answer></p>
  <p><answer type="text" disableAfterCorrect>hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton>hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton disableAfterCorrect>hello</answer></p>
    
  <p><answer>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer disableAfterCorrect>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton disableAfterCorrect>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  
  <p><answer>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer disableAfterCorrect>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton disableAfterCorrect>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>

  <p><answer type="boolean">true</answer></p>
  <p><answer type="boolean" disableAfterCorrect>true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton>true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton disableAfterCorrect>true</answer></p>
   `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let inputNames = [...Array(20).keys()].map(
                (n) =>
                    stateVariables[`/_answer${n + 1}`].stateValues
                        .inputChildren[0].componentIdx,
            );

            cy.log("Submit incorrect answers");
            cy.get(cesc2("#" + inputNames[0]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc2("#" + inputNames[1]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc2("#" + inputNames[2]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc2("#" + inputNames[3]) + " textarea").type("y{enter}", {
                force: true,
            });
            cy.get(cesc2("#/_answer3_submit")).click();
            cy.get(cesc2("#/_answer4_submit")).click();
            cy.get(cesc2("#" + inputNames[0]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[1]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer3_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer4_incorrect")).should("be.visible");

            cy.get(cesc2("#" + inputNames[4]) + "_input").type("bye{enter}");
            cy.get(cesc2("#" + inputNames[5]) + "_input").type("bye{enter}");
            cy.get(cesc2("#" + inputNames[6]) + "_input").type("bye{enter}");
            cy.get(cesc2("#" + inputNames[7]) + "_input").type("bye{enter}");
            cy.get(cesc2("#/_answer7_submit")).click();
            cy.get(cesc2("#/_answer8_submit")).click();
            cy.get(cesc2("#" + inputNames[4]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[5]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer7_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer8_incorrect")).should("be.visible");

            cy.get(cesc2("#/_choiceinput1"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput2"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput3"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput4"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput1_submit")).click();
            cy.get(cesc2("#/_choiceinput2_submit")).click();
            cy.get(cesc2("#/_answer11_submit")).click();
            cy.get(cesc2("#/_answer12_submit")).click();
            cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
            cy.get(cesc2("#/_choiceinput2_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer11_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer12_incorrect")).should("be.visible");

            cy.get(cesc("#\\/_choiceinput5")).select(`no`);
            cy.get(cesc("#\\/_choiceinput6")).select(`no`);
            cy.get(cesc("#\\/_choiceinput7")).select(`no`);
            cy.get(cesc("#\\/_choiceinput8")).select(`no`);
            cy.get(cesc2("#/_choiceinput5_submit")).click();
            cy.get(cesc2("#/_choiceinput6_submit")).click();
            cy.get(cesc2("#/_answer15_submit")).click();
            cy.get(cesc2("#/_answer16_submit")).click();
            cy.get(cesc2("#/_choiceinput5_incorrect")).should("be.visible");
            cy.get(cesc2("#/_choiceinput6_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer15_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer16_incorrect")).should("be.visible");

            cy.get(cesc2("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc2("#/_answer19_submit")).click();
            cy.get(cesc2("#/_answer20_submit")).click();
            cy.get(cesc2("#" + inputNames[16]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[17]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer19_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer20_incorrect")).should("be.visible");

            cy.log("Submit correct answers");
            cy.get(cesc2("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}x",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[1]) + "_submit").click();
            cy.get(cesc2("#/_answer3_submit")).click();
            cy.get(cesc2("#/_answer4_submit")).click();
            cy.get(cesc2("#" + inputNames[0]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[1]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer3_correct")).should("be.visible");
            cy.get(cesc2("#/_answer4_correct")).should("be.visible");

            cy.get(cesc2("#" + inputNames[4]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc2("#" + inputNames[5]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc2("#" + inputNames[6]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc2("#" + inputNames[7]) + "_input")
                .clear()
                .type("hello");
            cy.get(cesc2("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[5]) + "_submit").click();
            cy.get(cesc2("#/_answer7_submit")).click();
            cy.get(cesc2("#/_answer8_submit")).click();
            cy.get(cesc2("#" + inputNames[4]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[5]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer7_correct")).should("be.visible");
            cy.get(cesc2("#/_answer8_correct")).should("be.visible");

            cy.get(cesc2("#/_choiceinput1"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput2"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput3"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput4"))
                .contains("yes")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput1_submit")).click();
            cy.get(cesc2("#/_choiceinput2_submit")).click();
            cy.get(cesc2("#/_answer11_submit")).click();
            cy.get(cesc2("#/_answer12_submit")).click();
            cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");
            cy.get(cesc2("#/_choiceinput2_correct")).should("be.visible");
            cy.get(cesc2("#/_answer11_correct")).should("be.visible");
            cy.get(cesc2("#/_answer12_correct")).should("be.visible");

            cy.get(cesc("#\\/_choiceinput5")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput6")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput7")).select(`yes`);
            cy.get(cesc("#\\/_choiceinput8")).select(`yes`);
            cy.get(cesc2("#/_choiceinput5_submit")).click();
            cy.get(cesc2("#/_choiceinput6_submit")).click();
            cy.get(cesc2("#/_answer15_submit")).click();
            cy.get(cesc2("#/_answer16_submit")).click();
            cy.get(cesc2("#/_choiceinput5_correct")).should("be.visible");
            cy.get(cesc2("#/_choiceinput6_correct")).should("be.visible");
            cy.get(cesc2("#/_answer15_correct")).should("be.visible");
            cy.get(cesc2("#/_answer16_correct")).should("be.visible");

            cy.get(cesc2("#" + inputNames[16])).click();
            cy.get(cesc2("#" + inputNames[17])).click();
            cy.get(cesc2("#" + inputNames[18])).click();
            cy.get(cesc2("#" + inputNames[19])).click();
            cy.get(cesc2("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc2("#" + inputNames[17]) + "_submit").click();
            cy.get(cesc2("#/_answer19_submit")).click();
            cy.get(cesc2("#/_answer20_submit")).click();
            cy.get(cesc2("#" + inputNames[16]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[17]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer19_correct")).should("be.visible");
            cy.get(cesc2("#/_answer20_correct")).should("be.visible");

            cy.log("Type to submit incorrect answers again");

            // the 2nd and 4th input should be disabled,
            // but this isn't working yet.
            // For now, best we can do is make sure button still say incorrect
            cy.get(cesc2("#" + inputNames[0]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[1]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[2]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[3]) + " textarea").type(
                "{end}{backspace}y",
                { force: true },
            );
            cy.get(cesc2("#" + inputNames[0]) + "_submit").click();
            cy.get(cesc2("#/_answer3_submit")).click();
            cy.get(cesc2("#" + inputNames[0]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[1]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer3_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer4_correct")).should("be.visible");

            cy.get(cesc2("#" + inputNames[4]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc2("#" + inputNames[5]) + "_input").should("be.disabled");
            cy.get(cesc2("#" + inputNames[6]) + "_input")
                .clear()
                .type("bye");
            cy.get(cesc2("#" + inputNames[7]) + "_input").should("be.disabled");
            cy.get(cesc2("#" + inputNames[4]) + "_submit").click();
            cy.get(cesc2("#/_answer7_submit")).click();
            cy.get(cesc2("#" + inputNames[4]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[5]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer7_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer8_correct")).should("be.visible");

            cy.get(cesc2("#/_choiceinput1"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput2"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput3"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput4"))
                .contains("no")
                .click({ force: true });
            cy.get(cesc2("#/_choiceinput1_submit")).click();
            cy.get(cesc2("#/_answer11_submit")).click();
            cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
            cy.get(cesc2("#/_choiceinput2_correct")).should("be.visible");
            cy.get(cesc2("#/_answer11_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer12_correct")).should("be.visible");

            cy.get(cesc("#\\/_choiceinput5")).select(`no`);
            cy.get(cesc("#\\/_choiceinput6")).should("be.disabled");
            cy.get(cesc("#\\/_choiceinput7")).select(`no`);
            cy.get(cesc("#\\/_choiceinput8")).should("be.disabled");
            cy.get(cesc2("#/_choiceinput5_submit")).click();
            cy.get(cesc2("#/_answer15_submit")).click();
            cy.get(cesc2("#/_choiceinput5_incorrect")).should("be.visible");
            cy.get(cesc2("#/_choiceinput6_correct")).should("be.visible");
            cy.get(cesc2("#/_answer15_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer16_correct")).should("be.visible");

            cy.get(cesc2("#" + inputNames[16])).click();
            cy.get(cesc2("#" + inputNames[17]) + "_input").should(
                "be.disabled",
            );
            cy.get(cesc2("#" + inputNames[18])).click();
            cy.get(cesc2("#" + inputNames[19]) + "_input").should(
                "be.disabled",
            );
            cy.get(cesc2("#" + inputNames[16]) + "_submit").click();
            cy.get(cesc2("#/_answer19_submit")).click();
            cy.get(cesc2("#" + inputNames[16]) + "_incorrect").should(
                "be.visible",
            );
            cy.get(cesc2("#" + inputNames[17]) + "_correct").should(
                "be.visible",
            );
            cy.get(cesc2("#/_answer19_incorrect")).should("be.visible");
            cy.get(cesc2("#/_answer20_correct")).should("be.visible");
        });
    });

    it("disable after correct, depends on external", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>

  <graph>
    <point name="A" x="0" y="0">
      <constraints>
        <attractTo><point>(3,4)</point></attractTo>
        <attractTo><point>(-5,6)</point></attractTo>
      </constraints>
    </point>
  </graph>

  <p>Move point to <m>(3,4)</m>: </p>
  <p><answer>
    <award sourcesAreResponses="A">
      <when>$A = (3,4)</when>
    </award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award sourcesAreResponses="A">
      <when>$A = (3,4)</when>
    </award>
  </answer></p>

  <p>Move point to <m>(-5,6)</m>: </p>
  <p><answer>
    <award sourcesAreResponses="A">
      <when>$A = (-5,6)</when>
    </award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award sourcesAreResponses="A">
      <when>$A = (-5,6)</when>
    </award>
  </answer></p>

  <p><mathinput name="mi" /></p>

  <p>Enter <m>x</m> in above blank.</p>
  <p><answer>
    <award sourcesAreResponses="mi"><when>$mi=x</when></award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award sourcesAreResponses="mi"><when>$mi=x</when></award>
  </answer></p>

  <p>Enter <m>y</m> in above blank.</p>
  <p><answer>
    <award sourcesAreResponses="mi"><when>$mi=y</when></award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award sourcesAreResponses="mi"><when>$mi=y</when></award>
  </answer></p>

   `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Submit incorrect answers");
        for (let i = 1; i <= 8; i++) {
            cy.get(cesc(`#\\/_answer${i}_submit`)).click();
            cy.get(cesc(`#\\/_answer${i}_incorrect`)).should("be.visible");
        }

        cy.log("submit first correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/A",
                args: { x: 3, y: 4 },
            });
        });
        cy.get(cesc("#\\/mi") + " textarea").type("x{enter}", { force: true });

        for (let i = 1; i <= 8; i++) {
            cy.get(cesc(`#\\/_answer${i}_submit`)).click();
            if (i % 4 === 1 || i % 4 == 2) {
                cy.get(cesc(`#\\/_answer${i}_correct`)).should("be.visible");
            } else {
                cy.get(cesc(`#\\/_answer${i}_incorrect`)).should("be.visible");
            }
        }

        cy.log("submit second correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/A",
                args: { x: -5, y: 6 },
            });
        });
        cy.get(cesc("#\\/mi") + " textarea").type("{end}{backspace}y{enter}", {
            force: true,
        });

        for (let i = 1; i <= 8; i++) {
            if (i % 4 !== 2) {
                cy.get(cesc(`#\\/_answer${i}_submit`)).click();
            }
            if (i % 4 === 1) {
                cy.get(cesc(`#\\/_answer${i}_incorrect`)).should("be.visible");
            } else {
                cy.get(cesc(`#\\/_answer${i}_correct`)).should("be.visible");
            }
        }

        cy.log("submit second incorrect answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/A",
                args: { x: 1, y: -1 },
            });
        });
        cy.get(cesc("#\\/mi") + " textarea").type("{end}{backspace}z{enter}", {
            force: true,
        });

        for (let i = 1; i <= 8; i++) {
            if (i % 4 === 2 || i % 4 === 0) {
                cy.get(cesc(`#\\/_answer${i}_correct`)).should("be.visible");
            } else {
                cy.get(cesc(`#\\/_answer${i}_submit`)).click();
                cy.get(cesc(`#\\/_answer${i}_incorrect`)).should("be.visible");
            }
        }
    });

    it("submit label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p><answer name="ans1" forceFullCheckworkButton>x</answer></p>
  <p><answer name="ans2" forceFullCheckworkButton submitLabel="Hit it!">x</answer></p>
  <p><answer name="ans3" forceFullCheckworkButton submitLabelNoCorrectness="Guess">x</answer></p>
  <p><answer name="ans4" forceFullCheckworkButton submitLabel="Hit it!" submitLabelNoCorrectness="Guess">x</answer></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathinput1Name =
                stateVariables["/ans1"].stateValues.inputChildren[0]
                    .componentIdx;
            let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";

            let mathinput2Name =
                stateVariables["/ans2"].stateValues.inputChildren[0]
                    .componentIdx;
            let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

            let mathinput3Name =
                stateVariables["/ans3"].stateValues.inputChildren[0]
                    .componentIdx;
            let mathinput3Anchor = cesc2("#" + mathinput3Name) + " textarea";

            let mathinput4Name =
                stateVariables["/ans4"].stateValues.inputChildren[0]
                    .componentIdx;
            let mathinput4Anchor = cesc2("#" + mathinput4Name) + " textarea";

            cy.get(cesc("#\\/ans1_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Check Work");
                });
            cy.get(cesc("#\\/ans2_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });
            cy.get(cesc("#\\/ans3_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Check Work");
                });
            cy.get(cesc("#\\/ans4_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });

            cy.get(mathinput1Anchor).type("x{enter}", { force: true });
            cy.get(mathinput2Anchor).type("x{enter}", { force: true });
            cy.get(mathinput3Anchor).type("x{enter}", { force: true });
            cy.get(mathinput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#\\/ans1_submit")).click();
            cy.get(cesc("#\\/ans2_submit")).click();
            cy.get(cesc("#\\/ans3_submit")).click();
            cy.get(cesc("#\\/ans4_submit")).click();

            cy.get(cesc("#\\/ans1_correct")).should("contain.text", "Correct");
            cy.get(cesc("#\\/ans2_correct")).should("contain.text", "Correct");
            cy.get(cesc("#\\/ans3_correct")).should("contain.text", "Correct");
            cy.get(cesc("#\\/ans4_correct")).should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get(cesc("#\\/ans1_submit")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#\\/ans2_submit")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#\\/ans3_submit")).should("contain.text", "Guess");
            cy.get(cesc("#\\/ans4_submit")).should("contain.text", "Guess");

            cy.get(cesc("#\\/ans1_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Submit Response");
                });
            cy.get(cesc("#\\/ans2_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Submit Response");
                });
            cy.get(cesc("#\\/ans3_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });
            cy.get(cesc("#\\/ans4_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });

            cy.get(mathinput1Anchor).type("x{enter}", { force: true });
            cy.get(mathinput2Anchor).type("x{enter}", { force: true });
            cy.get(mathinput3Anchor).type("x{enter}", { force: true });
            cy.get(mathinput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#\\/ans1_submit")).click();
            cy.get(cesc("#\\/ans2_submit")).click();
            cy.get(cesc("#\\/ans3_submit")).click();
            cy.get(cesc("#\\/ans4_submit")).click();

            cy.get(cesc("#\\/ans1_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#\\/ans2_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#\\/ans3_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#\\/ans4_saved")).should(
                "contain.text",
                "Response Saved",
            );
        });
    });

    it("submit label, choiceinput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p><answer name="ans1">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer name="ans2" submitLabel="Hit it!">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer name="ans3" submitLabelNoCorrectness="Guess">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer name="ans4" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.get(cesc("#\\/_choiceinput1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Check Work");
            });
        cy.get(cesc("#\\/_choiceinput2_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Hit it!");
            });
        cy.get(cesc("#\\/_choiceinput3_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Check Work");
            });
        cy.get(cesc("#\\/_choiceinput4_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Hit it!");
            });

        cy.get(cesc("#\\/_choiceinput1"))
            .contains(`yes`)
            .click({ force: true });
        cy.get(cesc("#\\/_choiceinput2"))
            .contains(`yes`)
            .click({ force: true });
        cy.get(cesc("#\\/_choiceinput3"))
            .contains(`yes`)
            .click({ force: true });
        cy.get(cesc("#\\/_choiceinput4"))
            .contains(`yes`)
            .click({ force: true });

        cy.get(cesc("#\\/_choiceinput1_submit")).click();
        cy.get(cesc("#\\/_choiceinput2_submit")).click();
        cy.get(cesc("#\\/_choiceinput3_submit")).click();
        cy.get(cesc("#\\/_choiceinput4_submit")).click();

        cy.get(cesc("#\\/_choiceinput1_correct")).should(
            "contain.text",
            "Correct",
        );
        cy.get(cesc("#\\/_choiceinput2_correct")).should(
            "contain.text",
            "Correct",
        );
        cy.get(cesc("#\\/_choiceinput3_correct")).should(
            "contain.text",
            "Correct",
        );
        cy.get(cesc("#\\/_choiceinput4_correct")).should(
            "contain.text",
            "Correct",
        );

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showCorrectness").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/_choiceinput1_submit")).should(
            "contain.text",
            "Submit Response",
        );
        cy.get(cesc("#\\/_choiceinput2_submit")).should(
            "contain.text",
            "Submit Response",
        );
        cy.get(cesc("#\\/_choiceinput3_submit")).should(
            "contain.text",
            "Guess",
        );
        cy.get(cesc("#\\/_choiceinput4_submit")).should(
            "contain.text",
            "Guess",
        );

        cy.get(cesc("#\\/_choiceinput1_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Submit Response");
            });
        cy.get(cesc("#\\/_choiceinput2_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Submit Response");
            });
        cy.get(cesc("#\\/_choiceinput3_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Guess");
            });
        cy.get(cesc("#\\/_choiceinput4_submit"))
            .invoke("text")
            .then((text) => {
                expect(text.trim()).equal("Guess");
            });

        cy.get(cesc("#\\/_choiceinput1"))
            .contains(`yes`)
            .click({ force: true });
        cy.get(cesc("#\\/_choiceinput2"))
            .contains(`yes`)
            .click({ force: true });
        cy.get(cesc("#\\/_choiceinput3"))
            .contains(`yes`)
            .click({ force: true });
        cy.get(cesc("#\\/_choiceinput4"))
            .contains(`yes`)
            .click({ force: true });

        cy.get(cesc("#\\/_choiceinput1_submit")).click();
        cy.get(cesc("#\\/_choiceinput2_submit")).click();
        cy.get(cesc("#\\/_choiceinput3_submit")).click();
        cy.get(cesc("#\\/_choiceinput4_submit")).click();

        cy.get(cesc("#\\/_choiceinput1_saved")).should(
            "contain.text",
            "Response Saved",
        );
        cy.get(cesc("#\\/_choiceinput2_saved")).should(
            "contain.text",
            "Response Saved",
        );
        cy.get(cesc("#\\/_choiceinput3_saved")).should(
            "contain.text",
            "Response Saved",
        );
        cy.get(cesc("#\\/_choiceinput4_saved")).should(
            "contain.text",
            "Response Saved",
        );
    });

    it("auto submit", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <p>Enter x: <answer name="x">x</answer></p>
  <p name="pSubX">Submitted response: $x</p>
  <p name="pCreditX">Credit for this answer: $x.creditAchieved</p>
  
  <p>Select the correct answer:
  <answer name="correct">
    <choice credit="1">correct</choice>
    <choice>incorrect</choice>
  </answer></p>
  <p name="pSubCorrect">Submitted response: $correct</p>
  <p name="pCreditCorrect">Credit for this answer: $correct.creditAchieved</p>
  
  <graph size="small">
    <point name="P" labelIsName />
  </graph>
  
  <p>Move point P into first quadrant
    <answer name="firstQuad"><award><when>$P.x > 0 and $P.y > 0</when></award></answer>
  </p>
  
  <p name="pSubFirstQuad">Submitted response: <aslist>$firstQuad.submittedResponses</aslist></p>
  <p name="pCreditFirstQuad">Credit for this answer: $firstQuad.creditAchieved</p>

  <p name="pCreditDoc">Document credit achieved: $_document1.creditAchieved</p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/x"].stateValues.inputChildren[0].componentIdx;
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");

            let choiceinputName =
                stateVariables["/correct"].stateValues.inputChildren[0]
                    .componentIdx;
            let choiceinputSubmitAnchor = cesc2(
                "#" + choiceinputName + "_submit",
            );

            cy.get(mathinputSubmitAnchor).should("be.visible");
            cy.get(choiceinputSubmitAnchor).should("be.visible");
            cy.get(cesc2("#/firstQuad_submit")).should("be.visible");
        });

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_autoSubmit").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathinputName =
                stateVariables["/x"].stateValues.inputChildren[0].componentIdx;
            let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");

            let choiceinputName =
                stateVariables["/correct"].stateValues.inputChildren[0]
                    .componentIdx;
            let choiceinputSubmitAnchor = cesc2(
                "#" + choiceinputName + "_submit",
            );

            cy.get(mathinputSubmitAnchor).should("not.exist");
            cy.get(choiceinputSubmitAnchor).should("not.exist");
            cy.get(cesc2("#/firstQuad_submit")).should("not.exist");
        });

        cy.get(cesc("#\\/pSubX")).should("have.text", "Submitted response: ");
        cy.get(cesc("#\\/pCreditX")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pSubCorrect")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get(cesc("#\\/x") + " textarea").type("y", { force: true });

        cy.wait(1500); // wait for debounce

        cy.get(cesc("#\\/pSubX")).should("have.text", "Submitted response: ");
        cy.get(cesc("#\\/pCreditX")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get(cesc("#\\/x") + " textarea").blur();
        cy.get(cesc("#\\/pSubX")).should("contain.text", "y");
        cy.get(cesc("#\\/pCreditX")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0",
        );

        cy.get(cesc("#\\/x") + " textarea").type("{end}{backspace}x{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/pSubX")).should("contain.text", "x");
        cy.get(cesc("#\\/pCreditX")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.333",
        );

        cy.get(cesc("#\\/_choice1")).click();
        cy.get(cesc("#\\/pSubCorrect")).should(
            "have.text",
            "Submitted response: correct",
        );
        cy.get(cesc("#\\/pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.get(cesc("#\\/_choice2")).click();
        cy.get(cesc("#\\/pSubCorrect")).should(
            "have.text",
            "Submitted response: incorrect",
        );
        cy.get(cesc("#\\/pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.333",
        );

        cy.get(cesc("#\\/_choice1")).click();
        cy.get(cesc("#\\/pSubCorrect")).should(
            "have.text",
            "Submitted response: correct",
        );
        cy.get(cesc("#\\/pCreditCorrect")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 3, y: 1 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 4, y: 2 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 5, y: 3 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 6, y: 4 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 7, y: 5 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 8, y: 6 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 9, y: 7 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 3, y: -5 },
            });
        });

        cy.wait(200);
        cy.get(cesc("#\\/pSubFirstQuad")).should(
            "have.text",
            "Submitted response: ",
        );
        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );

        cy.get(cesc("#\\/pSubFirstQuad")).should("contain.text", "3, −5");

        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 0",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 0.667",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: "/P",
                args: { x: 9, y: 8 },
            });
        });

        cy.get(cesc("#\\/pSubFirstQuad")).should("contain.text", "9, 8");

        cy.get(cesc("#\\/pCreditFirstQuad")).should(
            "have.text",
            "Credit for this answer: 1",
        );
        cy.get(cesc("#\\/pCreditDoc")).should(
            "have.text",
            "Document credit achieved: 1",
        );
    });

    it("reload math answer without blurring or hitting enter", () => {
        let doenetML = `
    <p>Enter 1: <answer>
      <mathinput name="n" />
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

        cy.get(cesc("#\\/n") + " textarea").type("1", { force: true });

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

        // cy.get(cesc("#\\/n_submit")).click();
        // cy.get(cesc("#\\/n_correct")).should("be.visible");
    });

    it("reload text answer without blurring or hitting enter", () => {
        let doenetML = `
    <p>Enter 1: <answer>
      <textinput name="ti" />
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

        cy.get(cesc("#\\/ti_input")).type("hello", { force: true });

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

        cy.get(cesc("#\\/ti_submit")).click();
        cy.get(cesc("#\\/ti_correct")).should("be.visible");
    });
});
