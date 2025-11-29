import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Render commas tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
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

        cy.get(cesc("#0")).should(
            "contain.text",
            "In document: yes, no, maybe",
        );
        cy.get(cesc("#in_alert")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_blockQuote")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_c")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_caption")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_cell")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_choice")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_span")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_em")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_feedback")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_footnote")).click();
        cy.get(cesc("#in_footnote")).should("contain.text", "yes, no, maybe");
        cy.get(cesc("#in_hint_w_title")).click();
        cy.get(cesc("#in_hint_w_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc("#in_hint_wo_title")).click();
        cy.get(cesc("#in_hint_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc("#in_label")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_li")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_li2")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_p")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_pre")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_q")).should("have.text", "“yes, no, maybe”");
        cy.get(cesc("#in_section_w_title")).should(
            "contain.text",
            "Title: yes, no, maybe",
        );
        cy.get(cesc("#in_section_w_title")).should(
            "contain.text",
            "Text: yes, no, maybe",
        );
        cy.get(cesc("#in_section_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc("#in_solution")).click();
        cy.get(cesc("#in_solution")).should("contain.text", "yes, no, maybe");
        cy.get(cesc("#in_sq")).should("have.text", "‘yes, no, maybe’");
        cy.get(cesc("#in_text")).should("have.text", "yes, no, maybe");

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

    it("dynamically change index resolutions with reference inside composite", () => {
        // Note: this tests the DOM, corresponding to test of same name in `extend_references.test.ts`
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  
    <mathInput name="n">1</mathInput>
    <sequence name="s" length="$n" />

    <section name="sec1">
        <p name="p"><group name="g" asList>-6 $s-8</group></p>

        <p extend="$p" name="p2" />

        <p name="p3">3rd entry: $g[3], $p2.g[3]</p>
    </section>

    <section name="sec2">
        <p name="p"><group name="g" asList><number>-6</number>$s<number>-8</number></group></p>

        <p extend="$p" name="p2" />

        <p name="p3">3rd entry: $g[3], $p2.g[3]</p>
    </section>
    <text name="in_text">$ci.choiceTexts</text>

    `,
                },
                "*",
            );
        });

        const pText = "-6, 1, -8";
        cy.get(cesc("#sec1.p")).should("have.text", pText);
        cy.get(cesc("#sec1.p2")).should("have.text", pText);
        cy.get(cesc("#sec2.p")).should("have.text", pText);
        cy.get(cesc("#sec2.p2")).should("have.text", pText);
        cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: , ");
        cy.get(cesc("#sec2.p3")).should("have.text", "3rd entry: -8, -8");

        // Add another replacement, shifting so that the third entry comes from the sequence
        cy.get("#n" + " textarea")
            .type("{end}{backspace}2{enter}", {
                force: true,
            })
            .then(() => {
                const pText = "-6, 1, 2, -8";
                cy.get(cesc("#sec1.p")).should("have.text", pText);
                cy.get(cesc("#sec1.p2")).should("have.text", pText);
                cy.get(cesc("#sec2.p")).should("have.text", pText);
                cy.get(cesc("#sec2.p2")).should("have.text", pText);
                cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: 2, 2");
                cy.get(cesc("#sec2.p3")).should("have.text", "3rd entry: 2, 2");
            });

        // Remove all replacements, shifting so that there is no longer a third entry
        cy.get("#n" + " textarea")
            .type("{end}{backspace}0{enter}", {
                force: true,
            })
            .then(() => {
                const pText = "-6, -8";
                cy.get(cesc("#sec1.p")).should("have.text", pText);
                cy.get(cesc("#sec1.p2")).should("have.text", pText);
                cy.get(cesc("#sec2.p")).should("have.text", pText);
                cy.get(cesc("#sec2.p2")).should("have.text", pText);
                cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: , ");
                cy.get(cesc("#sec2.p3")).should("have.text", "3rd entry: , ");
            });

        // Add three replacements, so that third entry is again a number
        cy.get("#n" + " textarea")
            .type("{end}{backspace}3{enter}", {
                force: true,
            })
            .then(() => {
                const pText = "-6, 1, 2, 3, -8";
                cy.get(cesc("#sec1.p")).should("have.text", pText);
                cy.get(cesc("#sec1.p2")).should("have.text", pText);
                cy.get(cesc("#sec2.p")).should("have.text", pText);
                cy.get(cesc("#sec2.p2")).should("have.text", pText);
                cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: 2, 2");
                cy.get(cesc("#sec2.p3")).should("have.text", "3rd entry: 2, 2");
            });

        // Back to one replacements, so that third entry is back to a string for first section
        cy.get("#n" + " textarea")
            .type("{end}{backspace}1{enter}", {
                force: true,
            })
            .then(() => {
                const pText = "-6, 1, -8";
                cy.get(cesc("#sec1.p")).should("have.text", pText);
                cy.get(cesc("#sec1.p2")).should("have.text", pText);
                cy.get(cesc("#sec2.p")).should("have.text", pText);
                cy.get(cesc("#sec2.p2")).should("have.text", pText);
                cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: , ");
                cy.get(cesc("#sec2.p3")).should(
                    "have.text",
                    "3rd entry: -8, -8",
                );
            });

        // Back to 2 replacements
        cy.get("#n" + " textarea")
            .type("{end}{backspace}2{enter}", {
                force: true,
            })
            .then(() => {
                const pText = "-6, 1, 2, -8";
                cy.get(cesc("#sec1.p")).should("have.text", pText);
                cy.get(cesc("#sec1.p2")).should("have.text", pText);
                cy.get(cesc("#sec2.p")).should("have.text", pText);
                cy.get(cesc("#sec2.p2")).should("have.text", pText);
                cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: 2, 2");
                cy.get(cesc("#sec2.p3")).should("have.text", "3rd entry: 2, 2");
            });
    });

    it("render commas around repeat inside document", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<mathList name="mL">a b c</mathList>

<repeat name="doublingLoop" for="$mL" valueName="v">
   <math>2 $v</math>
</repeat>

  `,
                },
                "*",
            );
        });

        cy.get(".doenet-viewer").should(
            "contain.text",
            toMathJaxString("a, b, c\n\n2a, 2b, 2c"),
        );
    });

    it("render commas around repeat inside section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<section name="s">
    <mathList name="mL">a b c</mathList>

    <repeat name="doublingLoop" for="$mL" valueName="v">
    <math>2 $v</math>
    </repeat>
</section>

  `,
                },
                "*",
            );
        });

        cy.get(cesc("#s")).should(
            "contain.text",
            toMathJaxString("a, b, c\n\n    2a, 2b, 2c"),
        );
    });

    it("render commas around repeat inside paragraph", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<p name="p">
    <mathList name="mL">a b c</mathList>

    <repeat name="doublingLoop" for="$mL" valueName="v">
    <math>2 $v</math>
    </repeat>
</p>

  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p")).should(
            "contain.text",
            toMathJaxString("a, b, c\n\n    2a, 2b, 2c"),
        );
    });

    it("asList when copy array prop, test renderers", () => {
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
    <blockQuote name="in_blockquote">$ci.choiceTexts</blockQuote>
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

        cy.get(".doenet-viewer").should(
            "contain.text",
            "In document: yes, no, maybe",
        );
        cy.get(cesc("#in_alert")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_blockquote")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_c")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_caption")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_cell")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_choice")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_span")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_em")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_feedback")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_footnote")).click();
        cy.get(cesc("#in_footnote")).should("contain.text", "yes, no, maybe");
        cy.get(cesc("#in_hint_w_title")).click();
        cy.get(cesc("#in_hint_w_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc("#in_hint_wo_title")).click();
        cy.get(cesc("#in_hint_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc("#in_label")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_li")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_li2")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_p")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_pre")).should("have.text", "yes, no, maybe");
        cy.get(cesc("#in_q")).should("have.text", "“yes, no, maybe”");
        cy.get(cesc("#in_section_w_title")).should(
            "contain.text",
            "Title: yes, no, maybe",
        );
        cy.get(cesc("#in_section_w_title")).should(
            "contain.text",
            "Text: yes, no, maybe",
        );
        cy.get(cesc("#in_section_wo_title")).should(
            "contain.text",
            "yes, no, maybe",
        );
        cy.get(cesc("#in_solution")).click();
        cy.get(cesc("#in_solution")).should("contain.text", "yes, no, maybe");
        cy.get(cesc("#in_sq")).should("have.text", "‘yes, no, maybe’");
        cy.get(cesc("#in_text")).should("have.text", "yes, no, maybe");

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
