import { cesc } from "@doenet/utils";

describe("Problem Tag Tests", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("section wide check work in problem", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p>Section wide check work: <booleanInput name="swcw" /></p>
        <problem sectionWideCheckWork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceInput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceInput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
        <answer name="sum3">
          <award referencesAreResponses="$n1 $n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </problem>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#swcw_input")).should("not.be.checked");

        cy.get(cesc("#theProblem_button")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputIdx =
                stateVariables[await win.resolvePath1("twox")].stateValues
                    .inputChildren[0].componentIdx;
            let twoxInputAnchor = cesc("#_id_" + twoxInputIdx) + " textarea";
            let twoxInputButtonAnchor = cesc(
                "#_id_" + twoxInputIdx + "_button",
            );

            cy.get(twoxInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputButtonAnchor).should("contain.text", "Correct");

            let helloInputIdx =
                stateVariables[await win.resolvePath1("hello")].stateValues
                    .inputChildren[0].componentIdx;
            let helloInputAnchor = cesc("#_id_" + helloInputIdx + "_input");
            let helloInputButtonAnchor = cesc(
                "#_id_" + helloInputIdx + "_button",
            );

            cy.get(helloInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputButtonAnchor).should("contain.text", "Correct");

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#fruitInput_button")).click();

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#sum3_button")).should("contain.text", "Check Work");

            cy.get(cesc("#n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#sum3_button")).should("contain.text", "Check Work");

            cy.get(cesc("#sum3_button")).click();
            cy.get(cesc("#sum3_button")).should("contain.text", "Correct");

            cy.log("switch to section wide check work");

            cy.get(cesc("#swcw")).click();
            cy.get(cesc("#swcw_input")).should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theProblem_button")).click();
            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "75% Correct",
            );

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theProblem_button")).should("be.visible");

            cy.get(cesc("#theProblem_button")).click();
            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "50% Correct",
            );

            cy.log("turn off section wide check work");

            cy.get(cesc("#swcw")).click();
            cy.get(cesc("#swcw_input")).should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#sum3_button")).should("contain.text", "Correct");

            cy.get(cesc("#theProblem_button")).should("not.exist");
        });
    });

    it("section wide check work in section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p>Section wide check work: <booleanInput name="swcw" /></p>
        <section aggregateScores sectionWideCheckWork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceInput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceInput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
        <answer name="sum3">
          <award referencesAreResponses="$n1 $n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </section>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#swcw_input")).should("not.be.checked");

        cy.get(cesc("#theProblem_button")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputIdx =
                stateVariables[await win.resolvePath1("twox")].stateValues
                    .inputChildren[0].componentIdx;
            let twoxInputAnchor = cesc("#_id_" + twoxInputIdx) + " textarea";
            let twoxInputButtonAnchor = cesc(
                "#_id_" + twoxInputIdx + "_button",
            );

            cy.get(twoxInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputButtonAnchor).should("contain.text", "Correct");

            let helloInputIdx =
                stateVariables[await win.resolvePath1("hello")].stateValues
                    .inputChildren[0].componentIdx;
            let helloInputAnchor = cesc("#_id_" + helloInputIdx + "_input");
            let helloInputButtonAnchor = cesc(
                "#_id_" + helloInputIdx + "_button",
            );

            cy.get(helloInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputButtonAnchor).should("contain.text", "Correct");

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#fruitInput_button")).click();

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#sum3_button")).should("contain.text", "Check Work");

            cy.get(cesc("#n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#sum3_button")).should("contain.text", "Check Work");

            cy.get(cesc("#sum3_button")).click();
            cy.get(cesc("#sum3_button")).should("contain.text", "Correct");

            cy.log("switch to section wide check work");

            cy.get(cesc("#swcw")).click();
            cy.get(cesc("#swcw_input")).should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theProblem_button")).click();
            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "75% Correct",
            );

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theProblem_button")).click();
            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "50% Correct",
            );

            cy.log("turn off section wide check work");

            cy.get(cesc("#swcw")).click();
            cy.get(cesc("#swcw_input")).should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#sum3_button")).should("contain.text", "Correct");

            cy.get(cesc("#theProblem_button")).should("not.exist");
        });
    });

    it("document wide check work", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <document documentWideCheckWork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide check work: <booleanInput name="dwcw" /></p>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceInput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceInput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
        <answer name="sum3">
          <award referencesAreResponses="$n1 $n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
        </document>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#dwcw_input")).should("not.be.checked");

        cy.get(cesc("#theDocument_button")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputIdx =
                stateVariables[await win.resolvePath1("twox")].stateValues
                    .inputChildren[0].componentIdx;
            let twoxInputAnchor = cesc("#_id_" + twoxInputIdx) + " textarea";
            let twoxInputButtonAnchor = cesc(
                "#_id_" + twoxInputIdx + "_button",
            );

            cy.get(twoxInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputButtonAnchor).should("contain.text", "Correct");

            let helloInputIdx =
                stateVariables[await win.resolvePath1("hello")].stateValues
                    .inputChildren[0].componentIdx;
            let helloInputAnchor = cesc("#_id_" + helloInputIdx + "_input");
            let helloInputButtonAnchor = cesc(
                "#_id_" + helloInputIdx + "_button",
            );

            cy.get(helloInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputButtonAnchor).should("contain.text", "Correct");

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#fruitInput_button")).click();

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#sum3_button")).should("contain.text", "Check Work");

            cy.get(cesc("#n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#sum3_button")).should("contain.text", "Check Work");

            cy.get(cesc("#sum3_button")).click();
            cy.get(cesc("#sum3_button")).should("contain.text", "Correct");

            cy.log("switch to document wide check work");

            cy.get(cesc("#dwcw")).click();
            cy.get(cesc("#dwcw_input")).should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theDocument_button")).click();
            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "75% Correct",
            );

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theDocument_button")).click();
            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "50% Correct",
            );

            cy.log("turn off document wide check work");

            cy.get(cesc("#dwcw")).click();
            cy.get(cesc("#dwcw_input")).should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(cesc("#fruitInput_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#sum3_button")).should("contain.text", "Correct");

            cy.get(cesc("#theDocument_button")).should("not.exist");
        });
    });

    it("outer section wide check work supersedes inner section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <p>Section wide check work: <booleanInput name="swcw" /></p>
        <section aggregateScores sectionWideCheckWork="$swcw" name="theProblem">
        <title>Problem 1</title>

        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <subsection aggregateScores sectionWideCheckWork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceInput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceInput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
          <answer name="sum3">
            <award referencesAreResponses="$n1 $n2">
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

        cy.get(cesc("#swcw_input")).should("not.be.checked");

        cy.get(cesc("#theProblem_button")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputIdx =
                stateVariables[await win.resolvePath1("twox")].stateValues
                    .inputChildren[0].componentIdx;
            let twoxInputAnchor = cesc("#_id_" + twoxInputIdx) + " textarea";
            let twoxInputButtonAnchor = cesc(
                "#_id_" + twoxInputIdx + "_button",
            );

            cy.get(twoxInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputButtonAnchor).should("contain.text", "Correct");

            let helloInputIdx =
                stateVariables[await win.resolvePath1("hello")].stateValues
                    .inputChildren[0].componentIdx;
            let helloInputAnchor = cesc("#_id_" + helloInputIdx + "_input");
            let helloInputButtonAnchor = cesc(
                "#_id_" + helloInputIdx + "_button",
            );

            cy.get(helloInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputButtonAnchor).should("contain.text", "Correct");

            cy.get(cesc("#fruitInput_button")).should("not.exist");
            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#subProblem_button")).click();

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "50% Correct",
            );

            cy.get(cesc("#n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#subProblem_button")).click();

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.log("switch to section wide check work");

            cy.get(cesc("#swcw")).click();
            cy.get(cesc("#swcw_input")).should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#subProblem_button")).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theProblem_button")).click();
            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "67% Correct",
            );

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theProblem_button")).click();
            cy.get(cesc("#theProblem_button")).should(
                "contain.text",
                "33% Correct",
            );

            cy.log("turn off section wide check work");

            cy.get(cesc("#swcw")).click();
            cy.get(cesc("#swcw_input")).should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#theProblem_button")).should("not.exist");
        });
    });

    it("document wide check work supersedes section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <document documentWideCheckWork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide check work: <booleanInput name="dwcw" /></p>
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <section aggregateScores sectionWideCheckWork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceInput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceInput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathInput name="n1" /> <mathInput name="n2" />
          <answer name="sum3">
            <award referencesAreResponses="$n1 $n2">
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

        cy.get(cesc("#dwcw_input")).should("not.be.checked");

        cy.get(cesc("#theDocument_button")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputIdx =
                stateVariables[await win.resolvePath1("twox")].stateValues
                    .inputChildren[0].componentIdx;
            let twoxInputAnchor = cesc("#_id_" + twoxInputIdx) + " textarea";
            let twoxInputButtonAnchor = cesc(
                "#_id_" + twoxInputIdx + "_button",
            );

            cy.get(twoxInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
            cy.get(twoxInputButtonAnchor).should("contain.text", "Correct");

            let helloInputIdx =
                stateVariables[await win.resolvePath1("hello")].stateValues
                    .inputChildren[0].componentIdx;
            let helloInputAnchor = cesc("#_id_" + helloInputIdx + "_input");
            let helloInputButtonAnchor = cesc(
                "#_id_" + helloInputIdx + "_button",
            );

            cy.get(helloInputButtonAnchor).should("contain.text", "Check Work");

            cy.get(helloInputAnchor).type("hello{enter}");
            cy.get(helloInputButtonAnchor).should("contain.text", "Correct");

            cy.get(cesc("#fruitInput_button")).should("not.exist");
            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#fruitInput"))
                .contains(`banana`)
                .click({ force: true });
            cy.get(cesc("#subProblem_button")).click();

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "50% Correct",
            );

            cy.get(cesc("#n1") + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get(cesc("#n2") + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#subProblem_button")).click();

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.log("switch to document wide check work");

            cy.get(cesc("#dwcw")).click();
            cy.get(cesc("#dwcw_input")).should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#subProblem_button")).should("not.exist");

            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theDocument_button")).click();
            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "67% Correct",
            );

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "Check Work",
            );

            cy.get(cesc("#theDocument_button")).click();
            cy.get(cesc("#theDocument_button")).should(
                "contain.text",
                "33% Correct",
            );

            cy.log("turn off document wide check work");

            cy.get(cesc("#dwcw")).click();
            cy.get(cesc("#dwcw_input")).should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(cesc("#fruitInput_button")).should("not.exist");

            cy.get(cesc("#sum3_button")).should("not.exist");

            cy.get(cesc("#subProblem_button")).should(
                "contain.text",
                "Correct",
            );

            cy.get(cesc("#theDocument_button")).should("not.exist");
        });
    });

    it("section wide check work, submit label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text name="a">a</text>
      <problem sectionWideCheckWork name="prob1">
        <answer name="ans1">x</answer>
      </problem>
      <problem sectionWideCheckWork name="prob2" submitLabel="Hit it!">
        <answer name="ans2">x</answer>
      </problem>
      <problem sectionWideCheckWork name="prob3" submitLabelNoCorrectness="Guess">
        <answer name="ans3">x</answer>
      </problem>
      <problem sectionWideCheckWork name="prob4" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <answer name="ans4">x</answer>
      </problem>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#a")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput1Idx =
                stateVariables[await win.resolvePath1("ans1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput1Anchor = cesc("#_id_" + mathInput1Idx) + " textarea";

            let mathInput2Idx =
                stateVariables[await win.resolvePath1("ans2")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput2Anchor = cesc("#_id_" + mathInput2Idx) + " textarea";

            let mathInput3Idx =
                stateVariables[await win.resolvePath1("ans3")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput3Anchor = cesc("#_id_" + mathInput3Idx) + " textarea";

            let mathInput4Idx =
                stateVariables[await win.resolvePath1("ans4")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Anchor = cesc("#_id_" + mathInput4Idx) + " textarea";

            cy.get(cesc("#prob1_button")).should("contain.text", "Check Work");
            cy.get(cesc("#prob2_button")).should("contain.text", "Hit it!");
            cy.get(cesc("#prob3_button")).should("contain.text", "Check Work");
            cy.get(cesc("#prob4_button")).should("contain.text", "Hit it!");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#prob1_button")).click();
            cy.get(cesc("#prob2_button")).click();
            cy.get(cesc("#prob3_button")).click();
            cy.get(cesc("#prob4_button")).click();

            cy.get(cesc("#prob1_button")).should("contain.text", "Correct");
            cy.get(cesc("#prob2_button")).should("contain.text", "Correct");
            cy.get(cesc("#prob3_button")).should("contain.text", "Correct");
            cy.get(cesc("#prob4_button")).should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get(cesc("#prob1_button")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#prob2_button")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#prob3_button")).should("contain.text", "Guess");
            cy.get(cesc("#prob4_button")).should("contain.text", "Guess");

            cy.get(cesc("#prob1_button")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#prob2_button")).should(
                "contain.text",
                "Submit Response",
            );
            cy.get(cesc("#prob3_button")).should("contain.text", "Guess");
            cy.get(cesc("#prob4_button")).should("contain.text", "Guess");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#prob1_button")).click();
            cy.get(cesc("#prob2_button")).click();
            cy.get(cesc("#prob3_button")).click();
            cy.get(cesc("#prob4_button")).click();

            cy.get(cesc("#prob1_button")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#prob2_button")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#prob3_button")).should(
                "contain.text",
                "Response Saved",
            );
            cy.get(cesc("#prob4_button")).should(
                "contain.text",
                "Response Saved",
            );
        });
    });

    it("document wide check work, submit label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <document documentWideCheckWork name="doc" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <text name="a">a</text>
        <answer name="ans1">x</answer>
      </document>
    `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#a")).should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput1Idx =
                stateVariables[await win.resolvePath1("ans1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput1Anchor = cesc("#_id_" + mathInput1Idx) + " textarea";

            cy.get(cesc("#doc_button")).should("contain.text", "Hit it!");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#doc_button")).click();

            cy.get(cesc("#doc_button")).should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get(cesc("#doc_button")).should("contain.text", "Guess");

            cy.get(cesc("#doc_button")).should("contain.text", "Guess");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });

            cy.get(cesc("#doc_button")).click();

            cy.get(cesc("#doc_button")).should(
                "contain.text",
                "Response Saved",
            );
        });
    });

    it("maintain state while reloading problem", () => {
        let doenetML = `
    <text name="a">a</text>
    <problem name="problem1">
      <variantControl numVariants="2" variantNames="apple banana" />
      <select name="fruit" hide>
        <option selectForVariants="apple">
          <text name="name">apple</text>
          <text name="color">red</text>
        </option>
        <option selectForVariants="banana">
          <text name="name">banana</text>
          <text name="color">yellow</text>
          </option>
      </select>
      <p>Enter $fruit.name: 
        <answer type="text">
          <textInput name="input1" />
          <award>$fruit.name</award>
        </answer>
      </p>
      <p>Enter $fruit.color: 
      <answer type="text">
        <textInput name="input2" />
        <award>$fruit.color</award>
      </answer>
    </p>
    </problem>
  
    <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
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

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let selectedFruitName =
                stateVariables[await win.resolvePath1("problem1.fruit.name")]
                    .stateValues.value;
            let otherFruitName =
                selectedFruitName === "apple" ? "banana" : "apple";
            let selectedFruitColor =
                stateVariables[await win.resolvePath1("problem1.fruit.color")]
                    .stateValues.value;
            let otherFruitColor =
                selectedFruitColor === "red" ? "yellow" : "red";

            cy.get(cesc("#ca")).should("have.text", "0");

            cy.get(cesc("#input1_input")).type(`${otherFruitName}{enter}`);
            cy.get(cesc("#input1_button")).should("contain.text", "Incorrect");
            cy.get(cesc("#ca")).should("have.text", "0");

            cy.get(cesc("#input2_button")).should("contain.text", "Check Work");

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
            cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#input1_button")).should("contain.text", "Incorrect");
            cy.get(cesc("#input2_button")).should("contain.text", "Check Work");
            cy.get(cesc("#ca")).should("have.text", "0");

            cy.get(cesc("#input1_input")).clear().type(selectedFruitName);
            cy.get(cesc("#input1_button")).click();
            cy.get(cesc("#input1_button")).should("contain.text", "Correct");
            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.get(cesc("#input2_input"))
                .clear()
                .type(`${otherFruitColor}{enter}`);
            cy.get(cesc("#input2_button")).should("contain.text", "Incorrect");
            cy.get(cesc("#ca")).should("have.text", "0.5");

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
            cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#input1_button")).should("contain.text", "Correct");
            cy.get(cesc("#input2_button")).should("contain.text", "Incorrect");
            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.get(cesc("#input2_input")).clear().type(selectedFruitColor);
            cy.get(cesc("#input2_button")).click();
            cy.get(cesc("#input2_button")).should("contain.text", "Correct");
            cy.get(cesc("#ca")).should("have.text", "1");

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
            cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#input1_button")).should("contain.text", "Correct");
            cy.get(cesc("#input2_button")).should("contain.text", "Correct");
            cy.get(cesc("#ca")).should("have.text", "1");
        });
    });

    /**
     * Verifies baseline list-item numbering behavior for two non-boxed items.
     *
     * Asserts that:
     * - visible text content excludes numbering glyphs,
     * - numbering is provided via CSS ::before content on each list item,
     * - introduction/conclusion elements do not receive list-item numbering.
     */
    function verifyListItemSectionNumbers(
        item1Id,
        item2Id,
        item1Text,
        item2Text,
    ) {
        // Verify text content (no section numbers in text)
        cy.get(`#${item1Id}`).should("have.text", item1Text);
        cy.get(`#${item2Id}`).should("have.text", item2Text);

        // Verify section numbers are rendered via CSS ::before pseudo-elements
        cy.get(`#${item1Id}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const before = win.getComputedStyle($el[0], "::before");
            const content = before.getPropertyValue("content");
            expect(content).to.equal('"1."');
        });

        cy.get(`#${item2Id}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const before = win.getComputedStyle($el[0], "::before");
            const content = before.getPropertyValue("content");
            expect(content).to.equal('"2."');
        });

        // Introduction and conclusion should NOT have section numbers
        cy.get("#intro").then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const before = win.getComputedStyle($el[0], "::before");
            const content = before.getPropertyValue("content");
            expect(content).to.be.oneOf(["none", '""', ""]);
        });

        cy.get("#conclusion").then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const before = win.getComputedStyle($el[0], "::before");
            const content = before.getPropertyValue("content");
            expect(content).to.be.oneOf(["none", '""', ""]);
        });
    }

    /**
     * Verifies that a non-boxed list item uses inline-flow ::before numbering,
     * which is required for first-line baseline alignment with inline content
     * (e.g., choiceInput/math on the first rendered line).
     */
    function verifyNonBoxedListItemUsesInlineBefore(itemId, expectedNumber) {
        cy.get(`#${itemId}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const before = win.getComputedStyle($el[0], "::before");
            expect(before.getPropertyValue("content")).to.equal(
                `"${expectedNumber}."`,
            );
            expect(before.getPropertyValue("position")).to.not.equal(
                "absolute",
            );
            expect(before.getPropertyValue("display")).to.equal("inline-block");
            expect(before.getPropertyValue("vertical-align")).to.equal(
                "baseline",
            );
        });
    }

    /**
     * Verifies boxed/collapsible-style numbering contract:
     * - outer section element has no ::before number,
     * - heading-box element owns the ::before number,
     * - horizontal anchor uses the expected alignment strategy.
     */
    function verifyBoxedListItemNumberInHeadingBox(itemId, expectedNumber) {
        cy.get(`#${itemId}`).then(($sectionEl) => {
            const win = $sectionEl[0].ownerDocument.defaultView;
            const sectionBefore = win.getComputedStyle(
                $sectionEl[0],
                "::before",
            );
            expect(sectionBefore.getPropertyValue("content")).to.be.oneOf([
                "none",
                '""',
                "",
            ]);
        });

        cy.get(`#${itemId} .section-heading-${itemId}`).then(($headingEl) => {
            const win = $headingEl[0].ownerDocument.defaultView;
            const before = win.getComputedStyle($headingEl[0], "::before");
            expect(before.getPropertyValue("content")).to.equal(
                `"${expectedNumber}."`,
            );

            const left = before.getPropertyValue("left");
            const marginLeft = before.getPropertyValue("margin-left");

            if (left && left !== "auto") {
                expect(left).to.equal("0px");
            } else {
                expect(marginLeft).to.not.equal("0px");
            }
        });
    }

    it("tasks render as list", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem name="problem">
            <introduction name="intro">List of tasks</introduction>
            <task name="task1">Do this</task>
            <task name="task2">Do that</task>
            <conclusion name="conclusion">Finished</conclusion>
        </problem>
    `,
                },
                "*",
            );
        });

        verifyListItemSectionNumbers("task1", "task2", "Do this", "Do that");
    });

    it("parts render as list", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem name="problem">
            <introduction name="intro">List of parts</introduction>
            <part name="part1">Do this</part>
            <part name="part2">Do that</part>
            <conclusion name="conclusion">Finished</conclusion>
        </problem>
    `,
                },
                "*",
            );
        });

        verifyListItemSectionNumbers("part1", "part2", "Do this", "Do that");
    });

    it("tasks with inline choiceInput and math keep list-item numbering behavior", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem name="problem">
            <introduction name="intro">List of tasks</introduction>
            <task name="task1">plain text task</task>
            <task name="task2">inline choiceInput <choiceInput inline><choice>a</choice></choiceInput></task>
            <task name="task3">inline math <math>x</math></task>
            <task name="task4" boxed>boxed task with math <math>x</math></task>
            <task name="task5" boxed>
                <title>boxed task with title</title>
                boxed content
            </task>
            <conclusion name="conclusion">Finished</conclusion>
        </problem>
    `,
                },
                "*",
            );
        });

        verifyNonBoxedListItemUsesInlineBefore("task1", 1);
        verifyNonBoxedListItemUsesInlineBefore("task2", 2);
        verifyNonBoxedListItemUsesInlineBefore("task3", 3);
        verifyBoxedListItemNumberInHeadingBox("task4", 4);
        verifyBoxedListItemNumberInHeadingBox("task5", 5);
    });

    it("problems render children as list", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problems name="problems">
            <introduction name="intro">List of problems</introduction>
            <problem name="problem1">Do this</problem>
            <problem name="problem2">Do that</problem>
            <conclusion name="conclusion">Finished</conclusion>
        </problems>

    `,
                },
                "*",
            );
        });

        verifyListItemSectionNumbers(
            "problem1",
            "problem2",
            "Do this",
            "Do that",
        );
    });
});
