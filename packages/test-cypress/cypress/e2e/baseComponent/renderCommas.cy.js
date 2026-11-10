import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Render commas tests", { tags: ["@group3"] }, function () {
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

        cy.get("#_id_0").should("contain.text", "In document: yes, no, maybe");
        cy.get("#in_alert").should("have.text", "yes, no, maybe");
        cy.get("#in_blockQuote").should("have.text", "yes, no, maybe");
        cy.get("#in_c").should("have.text", "yes, no, maybe");
        cy.get("#in_caption").should("have.text", "yes, no, maybe");
        cy.get("#in_cell").should("have.text", "yes, no, maybe");
        cy.get("#in_choice").should("have.text", "yes, no, maybe");
        cy.get("#in_span").should("have.text", "yes, no, maybe");
        cy.get("#in_em").should("have.text", "yes, no, maybe");
        cy.get("#in_feedback").should("have.text", "yes, no, maybe");
        cy.get("#in_footnote").click();
        cy.get("#in_footnote").should("contain.text", "yes, no, maybe");
        cy.get("#in_hint_w_title").click();
        cy.get("#in_hint_w_title").should("contain.text", "yes, no, maybe");
        cy.get("#in_hint_wo_title").click();
        cy.get("#in_hint_wo_title").should("contain.text", "yes, no, maybe");
        cy.get("#in_label").should("have.text", "yes, no, maybe");
        cy.get("#in_li").should("have.text", "yes, no, maybe");
        cy.get("#in_li2").should("have.text", "yes, no, maybe");
        cy.get("#in_p").should("have.text", "yes, no, maybe");
        cy.get("#in_pre").should("have.text", "yes, no, maybe");
        cy.get("#in_q").should("have.text", "“yes, no, maybe”");
        cy.get("#in_section_w_title").should(
            "contain.text",
            "Title: yes, no, maybe",
        );
        cy.get("#in_section_w_title").should(
            "contain.text",
            "Text: yes, no, maybe",
        );
        cy.get("#in_section_wo_title").should("contain.text", "yes, no, maybe");
        cy.get("#in_solution").click();
        cy.get("#in_solution").should("contain.text", "yes, no, maybe");
        cy.get("#in_sq").should("have.text", "‘yes, no, maybe’");
        cy.get("#in_text").should("have.text", "yes, no, maybe");

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
        // An index after a `<group>` names nothing (D27), whatever it holds;
        // an iteration whose whole content is one reference to a list
        // selects among the list's entries, which change as the list does.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  
    <mathInput name="n">1</mathInput>
    <sequence name="s" length="$n" />

    <section name="sec1">
        <p name="p"><group name="g" asList>-6 $s-8</group></p>

        <p name="p3">3rd entry: $g[3]</p>
    </section>

    <section name="sec2">
        <repeatForSequence name="r" length="1">$s</repeatForSequence>

        <p name="p3">2nd entry: $r[1][2]</p>
        <p extend="$p3" name="p4" />
    </section>

    `,
                },
                "*",
            );
        });

        function check(n) {
            const entries = [...Array(n).keys()].map((i) => i + 1);
            // `p` and `p4` are unique names, so their ids are not qualified
            // by the section, as `p3`, written in both, is
            cy.get(cesc("#p")).should(
                "have.text",
                [-6, ...entries, -8].join(", "),
            );
            cy.get(cesc("#sec1.p3")).should("have.text", "3rd entry: ＿");
            for (const name of ["#sec2.p3", "#p4"]) {
                cy.get(cesc(name)).should(
                    "have.text",
                    `2nd entry: ${n >= 2 ? 2 : "＿"}`,
                );
            }
        }

        check(1);

        for (const n of [2, 0, 3, 1]) {
            cy.get("#n" + " textarea")
                .type(`{end}{backspace}${n}{enter}`, {
                    force: true,
                })
                .then(() => {
                    check(n);
                });
        }
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

        cy.get("#s").should(
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

        cy.get("#p").should(
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
        cy.get("#in_alert").should("have.text", "yes, no, maybe");
        cy.get("#in_blockquote").should("have.text", "yes, no, maybe");
        cy.get("#in_c").should("have.text", "yes, no, maybe");
        cy.get("#in_caption").should("have.text", "yes, no, maybe");
        cy.get("#in_cell").should("have.text", "yes, no, maybe");
        cy.get("#in_choice").should("have.text", "yes, no, maybe");
        cy.get("#in_span").should("have.text", "yes, no, maybe");
        cy.get("#in_em").should("have.text", "yes, no, maybe");
        cy.get("#in_feedback").should("have.text", "yes, no, maybe");
        cy.get("#in_footnote").click();
        cy.get("#in_footnote").should("contain.text", "yes, no, maybe");
        cy.get("#in_hint_w_title").click();
        cy.get("#in_hint_w_title").should("contain.text", "yes, no, maybe");
        cy.get("#in_hint_wo_title").click();
        cy.get("#in_hint_wo_title").should("contain.text", "yes, no, maybe");
        cy.get("#in_label").should("have.text", "yes, no, maybe");
        cy.get("#in_li").should("have.text", "yes, no, maybe");
        cy.get("#in_li2").should("have.text", "yes, no, maybe");
        cy.get("#in_p").should("have.text", "yes, no, maybe");
        cy.get("#in_pre").should("have.text", "yes, no, maybe");
        cy.get("#in_q").should("have.text", "“yes, no, maybe”");
        cy.get("#in_section_w_title").should(
            "contain.text",
            "Title: yes, no, maybe",
        );
        cy.get("#in_section_w_title").should(
            "contain.text",
            "Text: yes, no, maybe",
        );
        cy.get("#in_section_wo_title").should("contain.text", "yes, no, maybe");
        cy.get("#in_solution").click();
        cy.get("#in_solution").should("contain.text", "yes, no, maybe");
        cy.get("#in_sq").should("have.text", "‘yes, no, maybe’");
        cy.get("#in_text").should("have.text", "yes, no, maybe");

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

    it("commas follow the innermost composite", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<p name="listOnly"><numberList>1 2 3</numberList></p>
<p name="listOff"><numberList asList="false">1 2 3</numberList></p>
<p name="listInsideGroup"><group><numberList>1 2 3</numberList></group></p>
<p name="listInsideGroupNoList"><group asList="false"><numberList>1 2 3</numberList></group></p>
<p name="noListInsideList"><group asList><numberList asList="false">1 2 3</numberList></group></p>
<p name="groupIsOneItem"><group asList><group><number>1</number><number>2</number></group><number>3</number></group></p>
<p name="twoLists"><group><numberList>1 2</numberList><numberList>3 4</numberList></group></p>
  `,
                },
                "*",
            );
        });

        cy.get("#listOnly").should("have.text", "1, 2, 3");
        cy.get("#listOff").should("have.text", "123");
        cy.get("#listInsideGroup").should("have.text", "1, 2, 3");
        cy.get("#listInsideGroupNoList").should("have.text", "1, 2, 3");
        cy.get("#noListInsideList").should("have.text", "123");
        cy.get("#groupIsOneItem").should("have.text", "12, 3");
        cy.get("#twoLists").should("have.text", "1, 23, 4");
    });

    it("skips empty and hidden replacements", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<p name="emptyInMiddle"><group asList><number>1</number><sequence length="0" /><number>2</number></group></p>
<p name="emptyAtStart"><group asList><sequence length="0" /><number>1</number><number>2</number></group></p>
<p name="hiddenItem"><group asList><number hide>1</number><number>2</number><number>3</number></group></p>
  `,
                },
                "*",
            );
        });

        cy.get("#emptyInMiddle").should("have.text", "1, 2");
        cy.get("#emptyAtStart").should("have.text", "1, 2");
        cy.get("#hiddenItem").should("have.text", "2, 3");
    });

    it("keeps the commas through a reference to a list, a group, or a repeat", () => {
        // A reference to a composite shows the same commas the composite
        // itself shows: a reference that lands on a composite copies its
        // replacements, keeping whole any composite among them that can be a
        // list of its own.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<setup>
    <numberList name="nl">1 2 3 4</numberList>
    <group name="g"><numberList>1 2 3 4</numberList></group>
    <repeatForSequence name="r" from="1" to="2">$nl</repeatForSequence>
</setup>
<p name="toList">$nl</p>
<p name="extendList"><numberList extend="$nl" /></p>
<p name="toGroup">$g</p>
<p name="toRepeat">$r</p>
<p name="toRepeatItem">$r[1]</p>
  `,
                },
                "*",
            );
        });

        cy.get("#toList").should("have.text", "1, 2, 3, 4");
        cy.get("#extendList").should("have.text", "1, 2, 3, 4");
        cy.get("#toGroup").should("have.text", "1, 2, 3, 4");
        cy.get("#toRepeat").should("have.text", "1, 2, 3, 4, 1, 2, 3, 4");
        cy.get("#toRepeatItem").should("have.text", "1, 2, 3, 4");
    });

    it("puts the comma where the whitespace between two items was", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<setup><sequence name="s" length="0" /><sequence name="s2" length="0" /></setup>
<p name="spaced"><group asList><number>1</number> <number>2</number> <number>3</number></group></p>
<p name="withEmpty"><group asList><number>1</number> <number>2</number> $s $s2 <number>3</number></group></p>
<repeatForSequence from="1" to="2" name="a" valueName="x">
  <repeatForSequence from="5" to="7" step="2" name="b" valueName="y">
    <number>$x+$y</number>
  </repeatForSequence>
</repeatForSequence>
<p name="nestedRepeatItem">$a[1]</p>
  `,
                },
                "*",
            );
        });

        cy.get("#spaced").should("have.text", "1, 2, 3");
        cy.get("#withEmpty").should("have.text", "1, 2, 3");
        cy.get("#nestedRepeatItem").should("have.text", "6, 8");
    });
});
