import { cesc, cesc2 } from "@doenet/utils";

describe("Problem Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("section wide checkwork in problem", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <problem sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </problem>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

        cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
        cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
        cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
        cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputName =
                stateVariables["/twox"].stateValues.inputChildren[0]
                    .componentName;
            let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
            let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
            let twoxInputCorrectAnchor = cesc2(
                "#" + twoxInputName + "_correct",
            );
            let twoxInputIncorrectAnchor = cesc2(
                "#" + twoxInputName + "_incorrect",
            );

            cy.get(twoxInputSubmitAnchor).should("be.visible");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("be.visible");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            let helloInputName =
                stateVariables["/hello"].stateValues.inputChildren[0]
                    .componentName;
            let helloInputAnchor = cesc2("#" + helloInputName + "_input");
            let helloInputSubmitAnchor = cesc2(
                "#" + helloInputName + "_submit",
            );
            let helloInputCorrectAnchor = cesc2(
                "#" + helloInputName + "_correct",
            );
            let helloInputIncorrectAnchor = cesc2(
                "#" + helloInputName + "_incorrect",
            );

            cy.get(helloInputSubmitAnchor).should("be.visible");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("be.visible");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#\\/fruitInput_submit")).click();

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("be.visible");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#\\/sum3_submit")).should("be.visible");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).click();
            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("be.visible");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.log("switch to section wide checkwork");

            cy.get(cesc("#\\/swcw")).click();
            cy.get(cesc("#\\/swcw_input")).should("be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).click();
            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("75% correct");
                });

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).click();
            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.log("turn off section wide checkwork");

            cy.get(cesc("#\\/swcw")).click();
            cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("be.visible");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("be.visible");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("be.visible");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");
        });
    });

    it("section wide checkwork in section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <section aggregateScores sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </section>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

        cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
        cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
        cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
        cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputName =
                stateVariables["/twox"].stateValues.inputChildren[0]
                    .componentName;
            let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
            let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
            let twoxInputCorrectAnchor = cesc2(
                "#" + twoxInputName + "_correct",
            );
            let twoxInputIncorrectAnchor = cesc2(
                "#" + twoxInputName + "_incorrect",
            );

            cy.get(twoxInputSubmitAnchor).should("be.visible");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("be.visible");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            let helloInputName =
                stateVariables["/hello"].stateValues.inputChildren[0]
                    .componentName;
            let helloInputAnchor = cesc2("#" + helloInputName + "_input");
            let helloInputSubmitAnchor = cesc2(
                "#" + helloInputName + "_submit",
            );
            let helloInputCorrectAnchor = cesc2(
                "#" + helloInputName + "_correct",
            );
            let helloInputIncorrectAnchor = cesc2(
                "#" + helloInputName + "_incorrect",
            );

            cy.get(helloInputSubmitAnchor).should("be.visible");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("be.visible");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#\\/fruitInput_submit")).click();

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("be.visible");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#\\/sum3_submit")).should("be.visible");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).click();
            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("be.visible");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.log("switch to section wide checkwork");

            cy.get(cesc("#\\/swcw")).click();
            cy.get(cesc("#\\/swcw_input")).should("be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).click();
            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("75% correct");
                });

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).click();
            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.log("turn off section wide checkwork");

            cy.get(cesc("#\\/swcw")).click();
            cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("be.visible");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("be.visible");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("be.visible");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");
        });
    });

    it("document wide checkwork", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <document documentWideCheckwork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkwork: <booleaninput name="dwcw" /></p>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
        </document>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

        cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
        cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
        cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
        cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputName =
                stateVariables["/twox"].stateValues.inputChildren[0]
                    .componentName;
            let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
            let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
            let twoxInputCorrectAnchor = cesc2(
                "#" + twoxInputName + "_correct",
            );
            let twoxInputIncorrectAnchor = cesc2(
                "#" + twoxInputName + "_incorrect",
            );

            cy.get(twoxInputSubmitAnchor).should("be.visible");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("be.visible");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            let helloInputName =
                stateVariables["/hello"].stateValues.inputChildren[0]
                    .componentName;
            let helloInputAnchor = cesc2("#" + helloInputName + "_input");
            let helloInputSubmitAnchor = cesc2(
                "#" + helloInputName + "_submit",
            );
            let helloInputCorrectAnchor = cesc2(
                "#" + helloInputName + "_correct",
            );
            let helloInputIncorrectAnchor = cesc2(
                "#" + helloInputName + "_incorrect",
            );

            cy.get(helloInputSubmitAnchor).should("be.visible");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("be.visible");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#\\/fruitInput_submit")).click();

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("be.visible");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#\\/sum3_submit")).should("be.visible");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).click();
            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("be.visible");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.log("switch to document wide checkwork");

            cy.get(cesc("#\\/dwcw")).click();
            cy.get(cesc("#\\/dwcw_input")).should("be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("be.visible");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).click();
            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("75% correct");
                });

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).click();
            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.log("turn off document wide checkwork");

            cy.get(cesc("#\\/dwcw")).click();
            cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("be.visible");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("be.visible");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("be.visible");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");
        });
    });

    it("outer section wide checkwork supercedes inner section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <section aggregateScores sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>

        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <subsection aggregateScores sectionWideCheckwork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceinput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceinput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
          <answer name="sum3">
            <award sourcesAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </subsection>
      
      </section>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

        cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
        cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
        cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
        cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputName =
                stateVariables["/twox"].stateValues.inputChildren[0]
                    .componentName;
            let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
            let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
            let twoxInputCorrectAnchor = cesc2(
                "#" + twoxInputName + "_correct",
            );
            let twoxInputIncorrectAnchor = cesc2(
                "#" + twoxInputName + "_incorrect",
            );

            cy.get(twoxInputSubmitAnchor).should("be.visible");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("be.visible");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            let helloInputName =
                stateVariables["/hello"].stateValues.inputChildren[0]
                    .componentName;
            let helloInputAnchor = cesc2("#" + helloInputName + "_input");
            let helloInputSubmitAnchor = cesc2(
                "#" + helloInputName + "_submit",
            );
            let helloInputCorrectAnchor = cesc2(
                "#" + helloInputName + "_correct",
            );
            let helloInputIncorrectAnchor = cesc2(
                "#" + helloInputName + "_incorrect",
            );

            cy.get(helloInputSubmitAnchor).should("be.visible");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("be.visible");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");
            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#\\/subProblem_submit")).click();

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).click();

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.log("switch to section wide checkwork");

            cy.get(cesc("#\\/swcw")).click();
            cy.get(cesc("#\\/swcw_input")).should("be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).click();
            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("67% correct");
                });

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).click();
            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("33% correct");
                });

            cy.log("turn off section wide checkwork");

            cy.get(cesc("#\\/swcw")).click();
            cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("be.visible");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("be.visible");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theProblem_partial")).should("not.exist");
        });
    });

    it("document wide checkwork supercedes section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <document documentWideCheckwork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkwork: <booleaninput name="dwcw" /></p>
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <section aggregateScores sectionWideCheckwork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceinput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceinput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
          <answer name="sum3">
            <award sourcesAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </section>
      
      </document>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

        cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
        cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
        cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
        cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputName =
                stateVariables["/twox"].stateValues.inputChildren[0]
                    .componentName;
            let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
            let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
            let twoxInputCorrectAnchor = cesc2(
                "#" + twoxInputName + "_correct",
            );
            let twoxInputIncorrectAnchor = cesc2(
                "#" + twoxInputName + "_incorrect",
            );

            cy.get(twoxInputSubmitAnchor).should("be.visible");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("be.visible");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            let helloInputName =
                stateVariables["/hello"].stateValues.inputChildren[0]
                    .componentName;
            let helloInputAnchor = cesc2("#" + helloInputName + "_input");
            let helloInputSubmitAnchor = cesc2(
                "#" + helloInputName + "_submit",
            );
            let helloInputCorrectAnchor = cesc2(
                "#" + helloInputName + "_correct",
            );
            let helloInputIncorrectAnchor = cesc2(
                "#" + helloInputName + "_incorrect",
            );

            cy.get(helloInputSubmitAnchor).should("be.visible");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("be.visible");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");
            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#\\/subProblem_submit")).click();

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("50% correct");
                });

            cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).click();

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.log("switch to document wide checkwork");

            cy.get(cesc("#\\/dwcw")).click();
            cy.get(cesc("#\\/dwcw_input")).should("be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("be.visible");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).click();
            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("67% correct");
                });

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).click();
            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim().toLowerCase()).equal("33% correct");
                });

            cy.log("turn off document wide checkwork");

            cy.get(cesc("#\\/dwcw")).click();
            cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

            cy.get(twoxInputSubmitAnchor).should("not.exist");
            cy.get(twoxInputCorrectAnchor).should("not.exist");
            cy.get(twoxInputIncorrectAnchor).should("be.visible");

            cy.get(helloInputSubmitAnchor).should("not.exist");
            cy.get(helloInputCorrectAnchor).should("not.exist");
            cy.get(helloInputIncorrectAnchor).should("be.visible");

            cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
            cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

            cy.get(cesc("#\\/sum3_submit")).should("not.exist");
            cy.get(cesc("#\\/sum3_correct")).should("not.exist");
            cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

            cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
            cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
            cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
            cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

            cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
            cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
            cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
            cy.get(cesc("#\\/theDocument_partial")).should("not.exist");
        });
    });

    it("section wide checkwork, submit label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text>a</text>
      <problem sectionWideCheckwork name="prob1">
        <answer name="ans1">x</answer>
      </problem>
      <problem sectionWideCheckwork name="prob2" submitLabel="Hit it!">
        <answer name="ans2">x</answer>
      </problem>
      <problem sectionWideCheckwork name="prob3" submitLabelNoCorrectness="Guess">
        <answer name="ans3">x</answer>
      </problem>
      <problem sectionWideCheckwork name="prob4" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <answer name="ans4">x</answer>
      </problem>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathinput1Name =
                stateVariables["/ans1"].stateValues.inputChildren[0]
                    .componentName;
            let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";

            let mathinput2Name =
                stateVariables["/ans2"].stateValues.inputChildren[0]
                    .componentName;
            let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

            let mathinput3Name =
                stateVariables["/ans3"].stateValues.inputChildren[0]
                    .componentName;
            let mathinput3Anchor = cesc2("#" + mathinput3Name) + " textarea";

            let mathinput4Name =
                stateVariables["/ans4"].stateValues.inputChildren[0]
                    .componentName;
            let mathinput4Anchor = cesc2("#" + mathinput4Name) + " textarea";

            cy.get(cesc("#\\/prob1_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Check Work");
                });
            cy.get(cesc("#\\/prob2_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });
            cy.get(cesc("#\\/prob3_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Check Work");
                });
            cy.get(cesc("#\\/prob4_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });

            cy.get(mathinput1Anchor).type("x{enter}", { force: true });
            cy.get(mathinput2Anchor).type("x{enter}", { force: true });
            cy.get(mathinput3Anchor).type("x{enter}", { force: true });
            cy.get(mathinput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#\\/prob1_submit")).click();
            cy.get(cesc("#\\/prob2_submit")).click();
            cy.get(cesc("#\\/prob3_submit")).click();
            cy.get(cesc("#\\/prob4_submit")).click();

            cy.get(cesc("#\\/prob1_correct")).should("contain.text", "Correct");
            cy.get(cesc("#\\/prob2_correct")).should("contain.text", "Correct");
            cy.get(cesc("#\\/prob3_correct")).should("contain.text", "Correct");
            cy.get(cesc("#\\/prob4_correct")).should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get(cesc("#\\/prob1_submit")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#\\/prob2_submit")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#\\/prob3_submit")).should("contain.text", "Guess");
            cy.get(cesc("#\\/prob4_submit")).should("contain.text", "Guess");

            cy.get(cesc("#\\/prob1_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Submit Response");
                });
            cy.get(cesc("#\\/prob2_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Submit Response");
                });
            cy.get(cesc("#\\/prob3_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });
            cy.get(cesc("#\\/prob4_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });

            cy.get(mathinput1Anchor).type("x{enter}", { force: true });
            cy.get(mathinput2Anchor).type("x{enter}", { force: true });
            cy.get(mathinput3Anchor).type("x{enter}", { force: true });
            cy.get(mathinput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#\\/prob1_submit")).click();
            cy.get(cesc("#\\/prob2_submit")).click();
            cy.get(cesc("#\\/prob3_submit")).click();
            cy.get(cesc("#\\/prob4_submit")).click();

            cy.get(cesc("#\\/prob1_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#\\/prob2_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#\\/prob3_saved")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#\\/prob4_saved")).should(
                "contain.text",
                "Response Saved",
            );
        });
    });

    it("document wide checkwork, submit label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <document documentWideCheckwork name="doc" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <text>a</text>
        <answer name="ans1">x</answer>
      </document>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathinput1Name =
                stateVariables["/ans1"].stateValues.inputChildren[0]
                    .componentName;
            let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";

            cy.get(cesc("#\\/doc_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Hit it!");
                });

            cy.get(mathinput1Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#\\/doc_submit")).click();

            cy.get(cesc("#\\/doc_correct")).should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get(cesc("#\\/doc_submit")).should("contain.text", "Guess");

            cy.get(cesc("#\\/doc_submit"))
                .invoke("text")
                .then((text) => {
                    expect(text.trim()).equal("Guess");
                });

            cy.get(mathinput1Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#\\/doc_submit")).click();

            cy.get(cesc("#\\/doc_saved")).should(
                "contain.text",
                "Response Saved",
            );
        });
    });

    it("maintain state while reloading problem", () => {
        let doenetML = `
    <text>a</text>
    <problem name="problem1" newNamespace>
      <variantControl numVariants="2" variantNames="apple banana" />
      <select assignNames="fruit" hide>
        <option selectForVariants="apple" newNamespace>
          <text name="name">apple</text>
          <text name="color">red</text>
        </option>
        <option selectForVariants="banana" newNamespace>
          <text name="name">banana</text>
          <text name="color">yellow</text>
          </option>
      </select>
      <p>Enter $(fruit/name{name="e"}): 
        <answer type="text">
          <textinput name="input1" />
          <award>$(fruit/name)</award>
        </answer>
      </p>
      <p>Enter $(fruit/color): 
      <answer type="text">
        <textinput name="input2" />
        <award>$(fruit/color)</award>
      </answer>
    </p>
    </problem>
  
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                    requestedVariantIndex: 1,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let selectedFruitName =
                stateVariables["/problem1/fruit/name"].stateValues.value;
            let otherFruitName =
                selectedFruitName === "apple" ? "banana" : "apple";
            let selectedFruitColor =
                stateVariables["/problem1/fruit/color"].stateValues.value;
            let otherFruitColor =
                selectedFruitColor === "red" ? "yellow" : "red";

            cy.get(cesc2("#/ca")).should("have.text", "0");

            cy.get(cesc2("#/problem1/input1_input")).type(
                `${otherFruitName}{enter}`,
            );
            cy.get(cesc2("#/problem1/input1_incorrect")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "0");

            cy.get(cesc2("#/problem1/input2_submit")).should("be.visible");

            cy.wait(2000); // wait to make sure debounce save happened

            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc2("#/problem1/input1_incorrect")).should("be.visible");
            cy.get(cesc2("#/problem1/input2_submit")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "0");

            cy.get(cesc2("#/problem1/input1_input"))
                .clear()
                .type(selectedFruitName);
            cy.get(cesc2("#/problem1/input1_submit")).click();
            cy.get(cesc2("#/problem1/input1_correct")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "0.5");

            cy.get(cesc2("#/problem1/input2_input"))
                .clear()
                .type(`${otherFruitColor}{enter}`);
            cy.get(cesc2("#/problem1/input2_incorrect")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "0.5");

            cy.wait(2000); // wait to make sure debounce save happened

            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc2("#/problem1/input1_correct")).should("be.visible");
            cy.get(cesc2("#/problem1/input2_incorrect")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "0.5");

            cy.get(cesc2("#/problem1/input2_input"))
                .clear()
                .type(selectedFruitColor);
            cy.get(cesc2("#/problem1/input2_submit")).click();
            cy.get(cesc2("#/problem1/input2_correct")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "1");

            cy.wait(2000); // wait to make sure debounce save happened

            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc2("#/problem1/input1_correct")).should("be.visible");
            cy.get(cesc2("#/problem1/input2_correct")).should("be.visible");
            cy.get(cesc2("#/ca")).should("have.text", "1");
        });
    });
});
