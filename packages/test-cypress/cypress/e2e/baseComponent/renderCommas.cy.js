import { cesc2 } from "@doenet/utils";

describe("Render commas tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("render commas accounts for hidden and components without renderers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<function name="f">x+5</function>
<number hide>5</number>
<functionIterates name="fi" function="$f" numIterates="3" initialValue="4" />
$fi.iterates
  `,
                },
                "*",
            );
        });

        cy.get(".doenet-viewer").should("contain.text", "9, 14, 19");
    });

    it("commas when extend array prop, test renderers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <choiceInput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceInput>

    In document: $ci.choiceTexts
    <alert name="in_alert">$ci.choiceTexts</alert>
    <blockQuote name="in_blockQuote">$ci.choiceTexts</blockQuote>
    <c name="in_c">$ci.choiceTexts</c>
    <caption name="in_caption">$ci.choiceTexts</caption>
    <cell name="in_cell">$ci.choiceTexts</cell>
    <choice name="in_choice">$ci.choiceTexts</choice>
    <span name="in_span">$ci.choiceTexts</span>
    <em name="in_em">$ci.choiceTexts</em>
    <feedback name="in_feedback">$ci.choiceTexts</feedback>
    <footnote name="in_footnote">$ci.choiceTexts</footnote>
    <hint name="in_hint_w_title"><title>A title</title>$ci.choiceTexts</hint>
    <hint name="in_hint_wo_title">$ci.choiceTexts</hint>
    <label name="in_label">$ci.choiceTexts</label>
    <ol>
      <li name="in_li">$ci.choiceTexts</li>
    </ol>
    <ul>
      <li name="in_li2">$ci.choiceTexts</li>
    </ul>
    <p name="in_p">$ci.choiceTexts</p>
    <pre name="in_pre">$ci.choiceTexts</pre>
    <p name="in_q"><q>$ci.choiceTexts</q></p>
    <section name="in_section_w_title"><title name="sec_title">Title: $ci.choiceTexts</title>Text: $ci.choiceTexts</section>
    <section name="in_section_wo_title">$ci.choiceTexts</section>
    <solution name="in_solution">$ci.choiceTexts</solution>
    <p name="in_sq"><sq>$ci.choiceTexts</sq></p>
    <text name="in_text">$ci.choiceTexts</text>

    `,
                },
                "*",
            );
        });

        cy.get(cesc2("#0")).should(
            "contain.text",
            "In document: yes, no, maybe",
        );
        cy.get(cesc2("#in_alert")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_blockQuote")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_c")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_caption")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_cell")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_choice")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_span")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_em")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_feedback")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_footnote")).click();
        cy.get(cesc2("#in_footnote")).should("contain.text", "yes, no, maybe");
        cy.get(cesc2("#in_hint_w_title")).click();
        cy.get(cesc2("#in_hint_w_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc2("#in_hint_wo_title")).click();
        cy.get(cesc2("#in_hint_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc2("#in_label")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_li")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_li2")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_p")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_pre")).should("have.text", "yes, no, maybe");
        cy.get(cesc2("#in_q")).should("have.text", "“yes, no, maybe”");
        cy.get(cesc2("#in_section_w_title")).should(
            "contain.text",
            "Title: yes, no, maybe",
        );
        cy.get(cesc2("#in_section_w_title")).should(
            "contain.text",
            "Text: yes, no, maybe",
        );
        cy.get(cesc2("#in_section_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc2("#in_solution")).click();
        cy.get(cesc2("#in_solution")).should("contain.text", "yes, no, maybe");
        cy.get(cesc2("#in_sq")).should("have.text", "‘yes, no, maybe’");
        cy.get(cesc2("#in_text")).should("have.text", "yes, no, maybe");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            expect(
                stateVariables[await win.resolvePath1("in_alert")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_c")].stateValues.text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_caption")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_cell")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_choice")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_em")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_footnote")]
                    .stateValues.text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_label")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_p")].stateValues.text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("in_text")].stateValues
                    .text,
            ).eq("yes, no, maybe");
            expect(
                stateVariables[await win.resolvePath1("sec_title")].stateValues
                    .text,
            ).eq("Title: yes, no, maybe");
        });
    });
});
