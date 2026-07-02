import { cesc } from "@doenet/utils";
import { verifySideBySideColumnTopAlignment } from "./utils/listItemAlignment";

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

        cy.get("#swcw_input").should("not.be.checked");

        cy.get("#theProblem_button").should("not.exist");

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

            cy.get("#fruitInput_button").should("contain.text", "Check Work");

            cy.get("#fruitInput").contains(`banana`).click({ force: true });
            cy.get("#fruitInput_button").click();

            cy.get("#fruitInput_button").should("contain.text", "Correct");

            cy.get("#sum3_button").should("contain.text", "Check Work");

            cy.get("#n1" + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get("#n2" + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get("#sum3_button").should("contain.text", "Check Work");

            cy.get("#sum3_button").click();
            cy.get("#sum3_button").should("contain.text", "Correct");

            cy.log("switch to section wide check work");

            cy.get("#swcw").click();
            cy.get("#swcw_input").should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Correct");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Check Work");

            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "75% Correct");

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#theProblem_button").should("be.visible");

            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "50% Correct");

            cy.log("turn off section wide check work");

            cy.get("#swcw").click();
            cy.get("#swcw_input").should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get("#fruitInput_button").should("contain.text", "Correct");

            cy.get("#sum3_button").should("contain.text", "Correct");

            cy.get("#theProblem_button").should("not.exist");
        });
    });

    it("section wide check work with maxNumAttempts disables answers when exhausted", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem sectionWideCheckWork maxNumAttempts="2" name="theProblem">
        <title>Problem 1</title>
        <p>2x: <answer name="twox">2x</answer></p>
        <p>3x: <answer name="threex">3x</answer></p>
      </problem>
    `,
                },
                "*",
            );
        });

        // Two attempts remaining initially
        cy.get("#theProblem_button").should("contain.text", "Check Work");
        cy.get("[data-test=attempts-remaining]").should(
            "contain.text",
            "2 attempts remaining",
        );
        cy.get("#theProblem_button").should("not.be.disabled");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let twoxInputIdx =
                stateVariables[await win.resolvePath1("twox")].stateValues
                    .inputChildren[0].componentIdx;
            let twoxInputAnchor = cesc("#_id_" + twoxInputIdx) + " textarea";

            let threexInputIdx =
                stateVariables[await win.resolvePath1("threex")].stateValues
                    .inputChildren[0].componentIdx;
            let threexInputAnchor =
                cesc("#_id_" + threexInputIdx) + " textarea";

            // First section-wide submission validates but leaves one attempt.
            cy.get(twoxInputAnchor).type("y{enter}", { force: true });
            cy.get(threexInputAnchor).type("y{enter}", { force: true });
            cy.get("#theProblem_button").click();

            cy.get("#theProblem_button").should("contain.text", "Incorrect");
            cy.get("[data-test=attempts-remaining]").should(
                "contain.text",
                "1 attempt remaining",
            );
            cy.get("#theProblem_button").should("not.be.disabled");

            cy.window().then(async (win2) => {
                const problemIdx = await win2.resolvePath1("theProblem");
                const sv = await win2.returnAllStateVariables1();
                expect(sv[problemIdx].stateValues.numSubmissions).eq(1);
            });

            // Pressing the already-validated button does nothing: no new
            // submission, the button stays "Incorrect", and the attempt count
            // does not change until an input changes.
            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "Incorrect");
            cy.get("[data-test=attempts-remaining]").should(
                "contain.text",
                "1 attempt remaining",
            );
            cy.get("#theProblem_button").should("not.be.disabled");

            cy.window().then(async (win2) => {
                const problemIdx = await win2.resolvePath1("theProblem");
                const sv = await win2.returnAllStateVariables1();
                expect(sv[problemIdx].stateValues.numSubmissions).eq(1);
            });

            // Changing an input returns the button to "Check Work"; submitting
            // again exhausts the remaining attempt.
            cy.get(twoxInputAnchor).type("{backspace}z{enter}", {
                force: true,
            });
            cy.get("#theProblem_button").should("contain.text", "Check Work");
            cy.get("#theProblem_button").click();

            cy.get("[data-test=attempts-remaining]").should(
                "contain.text",
                "no attempts remaining",
            );
            cy.get("#theProblem_button").should("be.disabled");

            cy.window().then(async (win2) => {
                const problemIdx = await win2.resolvePath1("theProblem");
                const sv = await win2.returnAllStateVariables1();
                expect(sv[problemIdx].stateValues.numSubmissions).eq(2);
            });

            // Answer inputs are disabled once attempts are exhausted
            cy.get(twoxInputAnchor).should("be.disabled");
            cy.get(threexInputAnchor).should("be.disabled");
        });
    });

    it("section wide check work buttons render for ordered and unordered lists", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <ol name="ordered" sectionWideCheckWork>
          <li>1: <answer name="orderedAnswer">1</answer></li>
        </ol>
        <ul name="unordered" sectionWideCheckWork>
          <li>2: <answer name="unorderedAnswer">2</answer></li>
        </ul>
    `,
                },
                "*",
            );
        });

        cy.get("#ordered_button").should("contain.text", "Check Work");
        cy.get("#unordered_button").should("contain.text", "Check Work");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let orderedInputIdx =
                stateVariables[await win.resolvePath1("orderedAnswer")]
                    .stateValues.inputChildren[0].componentIdx;
            let orderedInputAnchor =
                cesc("#_id_" + orderedInputIdx) + " textarea";

            let unorderedInputIdx =
                stateVariables[await win.resolvePath1("unorderedAnswer")]
                    .stateValues.inputChildren[0].componentIdx;
            let unorderedInputAnchor =
                cesc("#_id_" + unorderedInputIdx) + " textarea";

            cy.get(orderedInputAnchor).type("1{enter}", { force: true });
            cy.get("#ordered_button").click();
            cy.get("#ordered_button").should("contain.text", "Correct");

            cy.get(unorderedInputAnchor).type("2{enter}", { force: true });
            cy.get("#unordered_button").click();
            cy.get("#unordered_button").should("contain.text", "Correct");
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

        cy.get("#swcw_input").should("not.be.checked");

        cy.get("#theProblem_button").should("not.exist");

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

            cy.get("#fruitInput_button").should("contain.text", "Check Work");

            cy.get("#fruitInput").contains(`banana`).click({ force: true });
            cy.get("#fruitInput_button").click();

            cy.get("#fruitInput_button").should("contain.text", "Correct");

            cy.get("#sum3_button").should("contain.text", "Check Work");

            cy.get("#n1" + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get("#n2" + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get("#sum3_button").should("contain.text", "Check Work");

            cy.get("#sum3_button").click();
            cy.get("#sum3_button").should("contain.text", "Correct");

            cy.log("switch to section wide check work");

            cy.get("#swcw").click();
            cy.get("#swcw_input").should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Correct");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Check Work");

            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "75% Correct");

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Check Work");

            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "50% Correct");

            cy.log("turn off section wide check work");

            cy.get("#swcw").click();
            cy.get("#swcw_input").should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get("#fruitInput_button").should("contain.text", "Correct");

            cy.get("#sum3_button").should("contain.text", "Correct");

            cy.get("#theProblem_button").should("not.exist");
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

        cy.get("#dwcw_input").should("not.be.checked");

        cy.get("#theDocument_button").should("not.exist");

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

            cy.get("#fruitInput_button").should("contain.text", "Check Work");

            cy.get("#fruitInput").contains(`banana`).click({ force: true });
            cy.get("#fruitInput_button").click();

            cy.get("#fruitInput_button").should("contain.text", "Correct");

            cy.get("#sum3_button").should("contain.text", "Check Work");

            cy.get("#n1" + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get("#n2" + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get("#sum3_button").should("contain.text", "Check Work");

            cy.get("#sum3_button").click();
            cy.get("#sum3_button").should("contain.text", "Correct");

            cy.log("switch to document wide check work");

            cy.get("#dwcw").click();
            cy.get("#dwcw_input").should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#theDocument_button").should("contain.text", "Correct");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get("#theDocument_button").should("contain.text", "Check Work");

            cy.get("#theDocument_button").click();
            cy.get("#theDocument_button").should("contain.text", "75% Correct");

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#theDocument_button").should("contain.text", "Check Work");

            cy.get("#theDocument_button").click();
            cy.get("#theDocument_button").should("contain.text", "50% Correct");

            cy.log("turn off document wide check work");

            cy.get("#dwcw").click();
            cy.get("#dwcw_input").should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get("#fruitInput_button").should("contain.text", "Correct");

            cy.get("#sum3_button").should("contain.text", "Correct");

            cy.get("#theDocument_button").should("not.exist");
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

        cy.get("#swcw_input").should("not.be.checked");

        cy.get("#theProblem_button").should("not.exist");

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

            cy.get("#fruitInput_button").should("not.exist");
            cy.get("#sum3_button").should("not.exist");

            cy.get("#subProblem_button").should("contain.text", "Check Work");

            cy.get("#fruitInput").contains(`banana`).click({ force: true });
            cy.get("#subProblem_button").click();

            cy.get("#subProblem_button").should("contain.text", "50% Correct");

            cy.get("#n1" + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get("#n2" + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get("#subProblem_button").should("contain.text", "Check Work");

            cy.get("#subProblem_button").click();

            cy.get("#subProblem_button").should("contain.text", "Correct");

            cy.log("switch to section wide check work");

            cy.get("#swcw").click();
            cy.get("#swcw_input").should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#subProblem_button").should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Correct");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Check Work");

            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "67% Correct");

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#theProblem_button").should("contain.text", "Check Work");

            cy.get("#theProblem_button").click();
            cy.get("#theProblem_button").should("contain.text", "33% Correct");

            cy.log("turn off section wide check work");

            cy.get("#swcw").click();
            cy.get("#swcw_input").should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#subProblem_button").should("contain.text", "Correct");

            cy.get("#theProblem_button").should("not.exist");
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

        cy.get("#dwcw_input").should("not.be.checked");

        cy.get("#theDocument_button").should("not.exist");

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

            cy.get("#fruitInput_button").should("not.exist");
            cy.get("#sum3_button").should("not.exist");

            cy.get("#subProblem_button").should("contain.text", "Check Work");

            cy.get("#fruitInput").contains(`banana`).click({ force: true });
            cy.get("#subProblem_button").click();

            cy.get("#subProblem_button").should("contain.text", "50% Correct");

            cy.get("#n1" + " textarea").type("2{enter}", {
                force: true,
            });
            cy.get("#n2" + " textarea").type("1{enter}", {
                force: true,
            });

            cy.get("#subProblem_button").should("contain.text", "Check Work");

            cy.get("#subProblem_button").click();

            cy.get("#subProblem_button").should("contain.text", "Correct");

            cy.log("switch to document wide check work");

            cy.get("#dwcw").click();
            cy.get("#dwcw_input").should("be.checked");

            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#subProblem_button").should("not.exist");

            cy.get("#theDocument_button").should("contain.text", "Correct");

            cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", {
                force: true,
            });
            cy.get(twoxInputButtonAnchor).should("not.exist");

            cy.get("#theDocument_button").should("contain.text", "Check Work");

            cy.get("#theDocument_button").click();
            cy.get("#theDocument_button").should("contain.text", "67% Correct");

            cy.get(helloInputAnchor).type("2{enter}");
            cy.get(helloInputButtonAnchor).should("not.exist");

            cy.get("#theDocument_button").should("contain.text", "Check Work");

            cy.get("#theDocument_button").click();
            cy.get("#theDocument_button").should("contain.text", "33% Correct");

            cy.log("turn off document wide check work");

            cy.get("#dwcw").click();
            cy.get("#dwcw_input").should("not.be.checked");

            cy.get(twoxInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get(helloInputButtonAnchor).should("contain.text", "Incorrect");

            cy.get("#fruitInput_button").should("not.exist");

            cy.get("#sum3_button").should("not.exist");

            cy.get("#subProblem_button").should("contain.text", "Correct");

            cy.get("#theDocument_button").should("not.exist");
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
        cy.get("#a").should("have.text", "a");

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

            cy.get("#prob1_button").should("contain.text", "Check Work");
            cy.get("#prob2_button").should("contain.text", "Hit it!");
            cy.get("#prob3_button").should("contain.text", "Check Work");
            cy.get("#prob4_button").should("contain.text", "Hit it!");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get("#prob1_button").click();
            cy.get("#prob2_button").click();
            cy.get("#prob3_button").click();
            cy.get("#prob4_button").click();

            cy.get("#prob1_button").should("contain.text", "Correct");
            cy.get("#prob2_button").should("contain.text", "Correct");
            cy.get("#prob3_button").should("contain.text", "Correct");
            cy.get("#prob4_button").should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get("#prob1_button").should("contain.text", "Submit Response");
            cy.get("#prob2_button").should("contain.text", "Submit Response");
            cy.get("#prob3_button").should("contain.text", "Guess");
            cy.get("#prob4_button").should("contain.text", "Guess");

            cy.get("#prob1_button").should("contain.text", "Submit Response");
            cy.get("#prob2_button").should("contain.text", "Submit Response");
            cy.get("#prob3_button").should("contain.text", "Guess");
            cy.get("#prob4_button").should("contain.text", "Guess");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });
            cy.get(mathInput2Anchor).type("x{enter}", { force: true });
            cy.get(mathInput3Anchor).type("x{enter}", { force: true });
            cy.get(mathInput4Anchor).type("x{enter}", { force: true });

            cy.get("#prob1_button").click();
            cy.get("#prob2_button").click();
            cy.get("#prob3_button").click();
            cy.get("#prob4_button").click();

            cy.get("#prob1_button").should("contain.text", "Response Saved");
            cy.get("#prob2_button").should("contain.text", "Response Saved");
            cy.get("#prob3_button").should("contain.text", "Response Saved");
            cy.get("#prob4_button").should("contain.text", "Response Saved");
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
        cy.get("#a").should("have.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput1Idx =
                stateVariables[await win.resolvePath1("ans1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput1Anchor = cesc("#_id_" + mathInput1Idx) + " textarea";

            cy.get("#doc_button").should("contain.text", "Hit it!");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });

            cy.get("#doc_button").click();

            cy.get("#doc_button").should("contain.text", "Correct");

            cy.get("#testRunner_toggleControls").click();
            cy.get("#testRunner_showCorrectness").click();
            cy.wait(100);
            cy.get("#testRunner_toggleControls").click();

            cy.get("#doc_button").should("contain.text", "Guess");

            cy.get("#doc_button").should("contain.text", "Guess");

            cy.get(mathInput1Anchor).type("x{enter}", { force: true });

            cy.get("#doc_button").click();

            cy.get("#doc_button").should("contain.text", "Response Saved");
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

        cy.get("#a").should("have.text", "a"); //wait for page to load

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

            cy.get("#ca").should("have.text", "0");

            cy.get("#input1_input").type(`${otherFruitName}{enter}`);
            cy.get("#input1_button").should("contain.text", "Incorrect");
            cy.get("#ca").should("have.text", "0");

            cy.get("#input2_button").should("contain.text", "Check Work");

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
            cy.get("#a").should("have.text", "a"); //wait for page to load

            cy.get("#input1_button").should("contain.text", "Incorrect");
            cy.get("#input2_button").should("contain.text", "Check Work");
            cy.get("#ca").should("have.text", "0");

            cy.get("#input1_input").clear().type(selectedFruitName);
            cy.get("#input1_button").click();
            cy.get("#input1_button").should("contain.text", "Correct");
            cy.get("#ca").should("have.text", "0.5");

            cy.get("#input2_input").clear().type(`${otherFruitColor}{enter}`);
            cy.get("#input2_button").should("contain.text", "Incorrect");
            cy.get("#ca").should("have.text", "0.5");

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
            cy.get("#a").should("have.text", "a"); //wait for page to load

            cy.get("#input1_button").should("contain.text", "Correct");
            cy.get("#input2_button").should("contain.text", "Incorrect");
            cy.get("#ca").should("have.text", "0.5");

            cy.get("#input2_input").clear().type(selectedFruitColor);
            cy.get("#input2_button").click();
            cy.get("#input2_button").should("contain.text", "Correct");
            cy.get("#ca").should("have.text", "1");

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
            cy.get("#a").should("have.text", "a"); //wait for page to load

            cy.get("#input1_button").should("contain.text", "Correct");
            cy.get("#input2_button").should("contain.text", "Correct");
            cy.get("#ca").should("have.text", "1");
        });
    });

    /** Run assertions against the CSS `::before` pseudo-element for an item. */
    function withBeforeStyle(itemId, callback) {
        const escapedItemId = cesc(itemId);

        cy.get(`#${escapedItemId}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            callback(win.getComputedStyle($el[0], "::before"));
        });
    }

    /** Assert the CSS list marker rendered through the item's `::before`. */
    function verifyBeforeContent(itemId, expectedContent) {
        withBeforeStyle(itemId, (before) => {
            expect(before.getPropertyValue("content")).to.equal(
                expectedContent,
            );
        });
    }

    /** Assert that an item does not render a CSS list marker. */
    function verifyNoBeforeContent(itemId) {
        withBeforeStyle(itemId, (before) => {
            const content = before.getPropertyValue("content");
            expect(content).to.be.oneOf(["none", '""', ""]);
        });
    }

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
        const escapedItem1Id = cesc(item1Id);
        const escapedItem2Id = cesc(item2Id);

        // Verify text content (no section numbers in text)
        cy.get(`#${escapedItem1Id}`).should("have.text", item1Text);
        cy.get(`#${escapedItem2Id}`).should("have.text", item2Text);

        // Verify section numbers are rendered via CSS ::before pseudo-elements
        verifyBeforeContent(item1Id, '"1."');
        verifyBeforeContent(item2Id, '"2."');

        // Introduction and conclusion should NOT have section numbers
        verifyNoBeforeContent("intro");
        verifyNoBeforeContent("conclusion");
    }

    /**
     * Verifies that a non-boxed list item uses inline-flow ::before numbering,
     * which is required for first-line baseline alignment with inline content
     * (e.g., choiceInput/math on the first rendered line).
     */
    function verifyNonBoxedListItemUsesInlineBefore(itemId, expectedNumber) {
        withBeforeStyle(itemId, (before) => {
            expect(before.getPropertyValue("content")).to.equal(
                `"${expectedNumber}."`,
            );
            expect(before.getPropertyValue("position")).to.not.equal(
                "absolute",
            );
            // Do not assert display/vertical-align details here.
            // Those are implementation choices that can vary between heading
            // and non-heading list-item paths while preserving numbering behavior.
        });
    }

    /**
     * Verifies boxed/collapsible-style numbering contract:
     * - outer section element has no ::before number,
     * - heading-box element owns the ::before number,
     * - horizontal anchor uses the expected alignment strategy.
     */
    function verifyBoxedListItemNumberInHeadingBox(itemId, expectedNumber) {
        const escapedItemId = cesc(itemId);
        const escapedHeadingClassName = cesc(`section-heading-${itemId}`);

        verifyNoBeforeContent(itemId);

        cy.get(`#${escapedItemId} .${escapedHeadingClassName}`).then(
            ($headingEl) => {
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
            },
        );
    }

    /**
     * Verifies untitled, unboxed list items use the flex-row layout that keeps
     * the section number and first child on the same line, even when first child
     * is a block-level renderer.
     */
    function verifyUntitledUnboxedListItemUsesFlexLayout(
        itemId,
        expectedNumber,
    ) {
        const escapedItemId = cesc(itemId);
        const escapedContentWrapperId = cesc(`${itemId}-content-wrapper`);

        cy.get(`#${escapedItemId}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const style = win.getComputedStyle($el[0]);
            expect(style.getPropertyValue("display")).to.equal("flex");
        });

        withBeforeStyle(itemId, (before) => {
            expect(before.getPropertyValue("content")).to.equal(
                `"${expectedNumber}."`,
            );
            expect(before.getPropertyValue("position")).to.not.equal(
                "absolute",
            );
        });

        cy.get(`#${escapedContentWrapperId}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const style = win.getComputedStyle($el[0]);
            expect(style.getPropertyValue("flex-grow")).to.equal("1");
            expect(style.getPropertyValue("min-width")).to.equal("0px");
        });
    }

    /** Assert that the section root itself owns the rendered list marker. */
    function verifySectionNumberRenderedOnRoot(itemId, expectedNumber) {
        withBeforeStyle(itemId, (rootBefore) => {
            expect(rootBefore.getPropertyValue("content")).to.equal(
                `"${expectedNumber}."`,
            );
        });
    }

    it("tasks with dotted ids still render section numbers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem>
            <section name="s1">
                <task name="t1">section 1 task 1</task>
                <task name="t2">section 1 task 2</task>
            </section>
            <section name="s2">
                <task name="t1">section 2 task 1</task>
                <task name="t2">section 2 task 2</task>
            </section>
        </problem>
    `,
                },
                "*",
            );
        });

        verifySectionNumberRenderedOnRoot("s1.t1", 1);
        verifySectionNumberRenderedOnRoot("s1.t2", 2);
        verifySectionNumberRenderedOnRoot("s2.t1", 1);
        verifySectionNumberRenderedOnRoot("s2.t2", 2);
    });

    it("boxed tasks with dotted ids still render section numbers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem>
            <section name="s1">
                <task name="t1" boxed>section 1 boxed task</task>
            </section>
            <section name="s2">
                <task name="t1" boxed>
                    <title>boxed task title</title>
                    section 2 boxed task
                </task>
            </section>
        </problem>
    `,
                },
                "*",
            );
        });

        verifyBoxedListItemNumberInHeadingBox("s1.t1", 1);
        verifyBoxedListItemNumberInHeadingBox("s2.t1", 1);
    });

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
            <task name="task6"><choiceInput inline><label>Pick one</label><choice>a</choice></choiceInput></task>
            <task name="task7"><answer inline><label>Pick one</label><choice>a</choice></answer></task>
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
        verifyNonBoxedListItemUsesInlineBefore("task6", 6);
        verifyNonBoxedListItemUsesInlineBefore("task7", 7);
    });

    it("untitled unboxed list items align numbering with block first children", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problem name="problem">
            <task name="task1"><p>Paragraph first child</p></task>
            <task name="task2"><sideBySide name="sbs"><p name="left">Left</p><pre name="mid">Middle</pre><p name="right">Right</p></sideBySide></task>
            <task name="task3"><blockQuote name="quote"><p name="quotedP">Quoted</p></blockQuote></task>
            <task name="task4"><div name="divBlock"><p name="divP">Div content</p></div></task>
            <task name="task5"><pre name="directPre">x+y</pre></task>

            <task name="task6"><title>Has title</title><p>Title case</p></task>
            <task name="task7" boxed><p>Boxed case</p></task>
            <task name="task8"><sideBySide name="sbsMixed"><blockQuote name="q8"><p>Blockquote</p></blockQuote><pre name="pre8">Pre</pre><div name="div8"><p>Div</p></div><stack name="stack8"><div><p>Div</p></div><p>Stacked</p></stack></sideBySide></task>
            <task name="task9"><choiceInput name="ci"><label>Pick one</label><choice>Choice 1</choice><choice>Choice 2</choice><choice>Choice 3</choice></choiceInput></task>
            <task name="task10"><answer name="ans"><label>Pick one</label><choice>Choice 1</choice><choice>Choice 2</choice><choice>Choice 3</choice></answer></task>
        </problem>
    `,
                },
                "*",
            );
        });

        verifyUntitledUnboxedListItemUsesFlexLayout("task1", 1);
        verifyUntitledUnboxedListItemUsesFlexLayout("task2", 2);
        verifyUntitledUnboxedListItemUsesFlexLayout("task3", 3);
        verifyUntitledUnboxedListItemUsesFlexLayout("task4", 4);
        verifyUntitledUnboxedListItemUsesFlexLayout("task5", 5);
        verifyUntitledUnboxedListItemUsesFlexLayout("task8", 8);
        verifyUntitledUnboxedListItemUsesFlexLayout("task9", 9);
        verifyUntitledUnboxedListItemUsesFlexLayout("task10", 10);
        verifySideBySideColumnTopAlignment({
            sideBySideId: "sbs",
            expectedAlignment: "baseline",
        });
        verifySideBySideColumnTopAlignment({
            sideBySideId: "sbsMixed",
            expectedAlignment: "flex-start",
        });

        cy.get(`#${cesc("directPre")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("q8")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("pre8")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("div8")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("stack8")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("ci")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("ans")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );

        cy.get(`#${cesc("task6")}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const style = win.getComputedStyle($el[0]);
            expect(style.getPropertyValue("display")).to.not.equal("flex");
        });

        verifyBoxedListItemNumberInHeadingBox("task7", 7);
    });

    it("answer list-item alignment only triggers flex-start for block choiceInput child", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="problem">
        <task name="task1"><answer name="a1"><mathInput name="mi1"/><award>x</award></answer></task>
        <task name="task2"><answer name="a2"><choiceInput inline name="ci2"><label>Pick one</label><choice>a</choice></choiceInput></answer></task>
        <task name="task3"><answer name="a3"><choiceInput name="ci3"><label>Pick one</label><choice>Choice 1</choice><choice>Choice 2</choice></choiceInput></answer></task>
    </problem>
`,
                },
                "*",
            );
        });

        // task1: answer with mathInput — section uses baseline alignment, not flex-start
        cy.get(`#${cesc("task1")}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const style = win.getComputedStyle($el[0]);
            expect(style.getPropertyValue("display")).to.equal("flex");
            expect(style.getPropertyValue("align-items")).to.equal("baseline");
        });

        // task2: answer with inline choiceInput — section uses baseline alignment, not flex-start
        cy.get(`#${cesc("task2")}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const style = win.getComputedStyle($el[0]);
            expect(style.getPropertyValue("display")).to.equal("flex");
            expect(style.getPropertyValue("align-items")).to.equal("baseline");
        });

        // task3: answer with block choiceInput — section uses flex-start, choiceInput margin is suppressed
        cy.get(`#${cesc("task3")}`).then(($el) => {
            const win = $el[0].ownerDocument.defaultView;
            const style = win.getComputedStyle($el[0]);
            expect(style.getPropertyValue("display")).to.equal("flex");
            expect(style.getPropertyValue("align-items")).to.equal(
                "flex-start",
            );
        });
        cy.get(`#${cesc("ci3")}`).should("have.css", "margin-top", "0px");
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

    it("problems render children as list through cascade", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <problems name="problems">
            <cascade name="cascade">
                <problem name="problem1">1+1=<answer>2</answer></problem>
                <problem name="problem2">2+1=<answer>3</answer></problem>
                <problem name="problem3">3+1=<answer>4</answer></problem>
            </cascade>
        </problems>
    `,
                },
                "*",
            );
        });

        // Wait for the document to render
        cy.get("#problem1").should("exist");

        verifyNoBeforeContent("cascade");
        verifyBeforeContent("problem1", '"1."');
        verifyBeforeContent("problem2", '"2."');
        verifyBeforeContent("problem3", '"3."');
    });
});
