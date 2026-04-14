import { cesc } from "@doenet/utils";
import { removeSpaces, toMathJaxString } from "../../../src/util/mathDisplay";

describe("Sectioning Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("prefill mathInput in aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <aside name="aside1">
      <title>Starting closed</title>
      <p>An expression: <mathInput name="expr1" prefill="(x+1)(x^2-1)" /></p>
      <p>The value of the expression is <math extend="$expr1.value" name="expr1a" /></p>
    </aside>
    <aside name="aside2" startOpen>
      <title>Starting open</title>
      <p>An expression: <mathInput name="expr2" prefill="(x-1)(x^2+1)" /></p>
      <p>The value of the expression is <math extend="$expr2.value" name="expr2a" /></p>
    </aside>
  
    <p>The first expression is <math extend="$expr1.value" name="expr1b" /></p>
    <p>The second expression is <math extend="$expr2.value" name="expr2b" /></p>

    `,
                },
                "*",
            );
        });

        cy.get("#expr1b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−1)")), // not sure why don't have space in from of +s here
        );
        cy.get("#expr2b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+1)")),
        );
        cy.get("#expr1a").should("not.exist");
        cy.get("#expr2a").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+1)")),
        );

        cy.get("#expr1").should("not.exist");
        // cy.get("#expr2" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.trim()).eq("(x−1)(x2+1)");
        //     });

        cy.get("#aside1_title").click();

        cy.get("#expr1a").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−1)")),
        );
        // cy.get("#expr1" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.trim()).eq("(x+1)(x2−1)");
        //     });

        cy.get("#aside2_title").click();
        cy.get("#expr2a").should("not.exist");
        cy.get("#expr2").should("not.exist");

        cy.get("#expr1b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−1)")),
        );
        cy.get("#expr2b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+1)")),
        );

        cy.get("#expr1" + " textarea")
            .type("{end}{leftArrow}{backspace}4{enter}", { force: true })
            .blur();

        cy.get("#expr1a").should(
            "contain.text",
            removeSpaces(toMathJaxString("(x+1)(x2−4)")),
        );
        cy.get("#expr1a").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−4)")),
        );
        // cy.get("#expr1" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq(
        //             "(x+1)(x2−4)",
        //         );
        //     });

        cy.get("#expr1b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−4)")),
        );
        cy.get("#expr2b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+1)")),
        );

        cy.get("#aside1_title").click();
        cy.get("#expr1a").should("not.exist");
        cy.get("#expr1").should("not.exist");

        cy.get("#expr1b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−4)")),
        );
        cy.get("#expr2b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+1)")),
        );

        cy.get("#aside2_title").click();

        cy.get("#expr2a").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+1)")),
        );
        // cy.get("#expr2" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.trim()).eq("(x−1)(x2+1)");
        //     });

        cy.get("#expr2" + " textarea")
            .type("{end}{leftArrow}{backspace}4{enter}", { force: true })
            .blur();

        cy.get("#expr2a").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+4)")),
        );
        // cy.get("#expr2" + " .mq-editable-field")
        //     .invoke("text")
        //     .then((text) => {
        //         expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq(
        //             "(x−1)(x2+4)",
        //         );
        //     });

        cy.get("#expr1b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x+1)(x2−4)")),
        );
        cy.get("#expr2b").should(
            "have.text",
            removeSpaces(toMathJaxString("(x−1)(x2+4)")),
        );
    });

    it("copy and overwrite title", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <section includeAutoName includeAutoNumber name="sec">
        <title>A title</title>
        <p name="p1">Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" extend="$sec">
        <title>A better title</title>
        <p name="p2">Good day!</p>
      </section>

      <p>Copy of original title: <text extend="$sec.title" name="title1" /></p>
      <p>Copy of revised title: <text extend="$revised.title" name="title2" /></p>
      <p>Original section number: <text extend="$sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text extend="$revised.sectionNumber" name="sectionNumber2" /></p>
   
    `,
                },
                "*",
            );
        });

        cy.get("#sec_title").should("have.text", "Section 1: A title");
        cy.get("#revised_title").should(
            "have.text",
            "Section 2: A better title",
        );
        cy.get("#title1").should("have.text", "A title");
        cy.get("#title2").should("have.text", "A better title");
        cy.get("#sectionNumber1").should("have.text", "1");
        cy.get("#sectionNumber2").should("have.text", "2");

        cy.get("#p1").should("have.text", "Hello");
        cy.get("#revised .para").eq(0).should("have.text", "Hello");
        cy.get("#p2").should("have.text", "Good day!");
    });

    it("copy and overwrite title,s", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <section includeAutoName includeAutoNumber name="sec">
        <title name="title1">A title</title>
        <p name="p1">Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" extend="$sec">
        <title name="title2">A better title</title>
        <p name="p2">Good day!</p>
      </section>

      <p name="p3">Copy of original title: <text extend="$sec.title" name="title1" /></p>
      <p name="p4">Copy of revised title: <text extend="$revised.title" name="title2" /></p>
      <p>Original section number: <text extend="$sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text extend="$revised.sectionNumber" name="sectionNumber2" /></p>
    
    `,
                },
                "*",
            );
        });

        cy.get("#sec_title").should("have.text", "Section 1: A title");
        cy.get("#revised_title").should(
            "have.text",
            "Section 2: A better title",
        );
        cy.get(cesc("#sec.title1")).should("have.text", "A title");
        cy.get(cesc("#revised.title")).should("not.exist");
        cy.get(cesc("#revised.title2")).should("have.text", "A better title");
        cy.get(cesc("#p3.title1")).should("have.text", "A title");
        cy.get(cesc("#p4.title2")).should("have.text", "A better title");
        cy.get("#sectionNumber1").should("have.text", "1");
        cy.get("#sectionNumber2").should("have.text", "2");

        cy.get("#p1").should("have.text", "Hello");
        cy.get(cesc("#revised.p1")).should("have.text", "Hello");
        cy.get("#p2").should("have.text", "Good day!");
    });

    // TODO: reinstate this test
    // Temporarily skipping due to stopgap solution of reverting new type of section
    it.skip("Add auto name to aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <aside name="aside1">
        <p><lorem generateSentences="1" /></p>
      </aside>
      <aside includeAutoName name="aside2">
        <title>Side point</title>
        <p><lorem generateSentences="1" /></p>
      </aside>
      <aside includeAutoName name="aside3" includeAutoNumber>
        <title>Another side point</title>
        <p><lorem generateSentences="1" /></p>
        <aside name="aside31">
          <title>Subpoint</title>
          <p><lorem generateSentences="1" /></p>
        </aside>
        <aside name="aside32">
          <p><lorem generateSentences="1" /></p>
        </aside>
      </aside>
  
      <p>Title 1: <text name="title1" extend="$aside1.title" /></p>
      <p>Title 2: <text name="title2" extend="$aside2.title" /></p>
      <p>Title 3: <text name="title3" extend="$aside3.title" /></p>
      <p>Title 3.1: <text name="title31" extend="$aside31.title" /></p>
      <p>Title 3.2: <text name="title32" extend="$aside32.title" /></p>

    `,
                },
                "*",
            );
        });

        cy.get("#aside1_title").should("contain.text", "Aside 1");
        cy.get("#aside1_title").should("not.contain.text", ":");
        cy.get("#aside2_title").should("contain.text", "Aside: Side point");
        cy.get("#aside3_title").should(
            "contain.text",
            "Aside 3: Another side point",
        );
        cy.get("#title1").should("have.text", "Aside 1");
        cy.get("#title2").should("have.text", "Side point");
        cy.get("#title3").should("have.text", "Another side point");

        cy.get("#aside3_title").click();

        cy.get("#aside31_title").should("contain.text", "Subpoint");
        cy.get("#aside31_title").should("not.contain.text", "1");
        cy.get("#aside31_title").should("not.contain.text", ":");
        cy.get("#aside32_title").should("contain.text", "Aside 5 ");
        cy.get("#aside32_title").should("not.contain.text", ":");

        cy.get("#title31").should("have.text", "Subpoint");
        cy.get("#title32").should("have.text", "Aside 5");
    });

    it("Aside with postpone rendering opens before initializing", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<aside name="aside" postponeRendering>
  <title>An aside</title>
  <p>The aside</p>
  <samplePrimeNumbers from="1" to="10000000" />
</aside>

`,
                },
                "*",
            );
        });

        cy.get("#aside").should("contain.text", "An aside");
        cy.get("#aside").should("not.contain.text", "The aside");

        cy.get("#aside").click();
        cy.get("#aside").should("contain.text", "Initializing");
        cy.get("#aside").should("not.contain.text", "The aside");

        cy.log("Eventually aside finishes rendering");
        cy.get("#aside").should("contain.text", "The aside");
        cy.get("#aside").should("not.contain.text", "Initializing");
    });

    it("Proof with postpone rendering opens before initializing", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<proof name="proof" postponeRendering>
<title>An proof</title>
<p>The proof</p>
<samplePrimeNumbers from="1" to="10000000" />
</proof>

`,
                },
                "*",
            );
        });

        cy.get("#proof").should("contain.text", "An proof");
        cy.get("#proof").should("not.contain.text", "The proof");

        cy.get("#proof").click();
        cy.get("#proof").should("contain.text", "Initializing");
        cy.get("#proof").should("not.contain.text", "The proof");

        cy.log("Eventually proof finishes rendering");
        cy.get("#proof").should("contain.text", "The proof");
        cy.get("#proof").should("not.contain.text", "Initializing");
    });

    it("Exercise with statement, hint, givenanswer, and solution", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

    <exercise name="exer">
      <title name="title">An exercise</title>
      <statement name="statement">The exercise</statement>
      <hint name="hint">
        <p>Try harder</p>
      </hint>
      <givenAnswer name="givenAnswer">
        <p>The correct answer</p>
      </givenAnswer>
      <solution name="solution">
        <p>Here's how you do it.</p>
      </solution>
    </exercise>

    `,
                },
                "*",
            );
        });

        cy.get("#title").should("have.text", "An exercise");

        cy.get("#statement").should("have.text", "The exercise");

        cy.get("#hint" + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get("#hint").should("not.contain.text", "Try harder");
        cy.get("#givenAnswer").should("contain.text", "Answer");
        cy.get("#givenAnswer").should("not.contain.text", "The correct answer");
        cy.get("#solution").should("contain.text", "Solution");
        cy.get("#solution").should("not.contain.text", "Here's how you do it.");

        cy.get("#hint" + " [data-test=hint-heading]").click();
        cy.get("#hint").should("contain.text", "Try harder");
        cy.get("#givenAnswer").should("not.contain.text", "The correct answer");
        cy.get("#solution").should("not.contain.text", "Here's how you do it.");

        cy.get("#givenAnswer_button").click();
        cy.get("#givenAnswer").should("contain.text", "The correct answer");
        cy.get("#hint").should("contain.text", "Try harder");
        cy.get("#solution").should("not.contain.text", "Here's how you do it.");

        cy.get("#solution_button").click();
        cy.get("#solution").should("contain.text", "Here's how you do it.");
        cy.get("#hint").should("contain.text", "Try harder");
        cy.get("#givenAnswer").should("contain.text", "The correct answer");
    });

    it("Section with introduction, subsections and conclusion", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title name="title">A section</title>
  <introduction name="introduction">
    <p>First this</p>
    <p>Then that</p>
    <text>Hello</text> <text>World</text>
  </introduction>
  <subsection name="subsection1">
    <title>Point 1</title>
    <p>Make the first point</p>
  </subsection>
  <subsection name="subsection2">
    <title>Point 2</title>
    <p>Make the second point</p>
  </subsection>
  <conclusion name="conclusion">
    Wrap <text>it</text> <text>up</text>!
  </conclusion>
</section>

    `,
                },
                "*",
            );
        });

        cy.get("#title").should("have.text", "A section");

        cy.get("#introduction").should(
            "have.text",
            "\n    First this\n    Then that\n    Hello World\n  ",
        );

        cy.get("#subsection1").should(
            "have.text",
            "Point 1\n    \n    Make the first point\n  ",
        );
        cy.get("#subsection2").should(
            "have.text",
            "Point 2\n    \n    Make the second point\n  ",
        );

        cy.get("#conclusion").should("have.text", "\n    Wrap it up!\n  ");
    });

    it("Objectives", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title name="title">A section</title>
  <objectives name="objectives">
    <text>Hello</text> <text>World</text>
  </objectives>
  <p name="p">Is objectives boxed? $objectives.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get("#title").should("have.text", "A section");

        cy.get("#objectives_title").should("have.text", "Objectives 1");
        cy.get("#objectives").should("contain.text", "Hello World");

        cy.get("#p").should("have.text", "Is objectives boxed? true");
    });

    it("Activity", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title name="title">A section</title>
  <activity name="activity">
    <text>Hello</text> <text>World</text>
  </activity>
  <p name="p">Is activity boxed? $activity.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get("#title").should("have.text", "A section");

        cy.get("#activity_title").should("have.text", "Activity 1");
        cy.get("#activity").should("contain.text", "Hello World");

        cy.get("#p").should("have.text", "Is activity boxed? false");
    });

    it("Definition", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title name="title">A section</title>
  <definition name="definition">
    <text>Hello</text> <text>World</text>
  </definition>
  <p name="p">Is definition boxed? $definition.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get("#title").should("have.text", "A section");

        cy.get("#definition_title").should("have.text", "Definition 1");
        cy.get("#definition").should("contain.text", "Hello World");

        cy.get("#p").should("have.text", "Is definition boxed? false");
    });

    it("Note", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title name="title">A section</title>
  <note name="note">
    <text>Hello</text> <text>World</text>
  </note>
  <p name="p">Is note boxed? $note.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get("#title").should("have.text", "A section");

        cy.get("#note_title").should("have.text", "Note 1");
        cy.get("#note").should("contain.text", "Hello World");

        cy.get("#p").should("have.text", "Is note boxed? false");
    });

    // TODO: reinstate this test
    // Temporarily skipping due to stopgap solution of reverting new type of section
    it.skip("Theorem elements", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title>A section</title>
  <theorem>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </theorem>
  <theorem renameTo="Corollary">
    <statement>The statement</statement>
    <proof>The proof</proof>
  </theorem>
</section>

    `,
                },
                "*",
            );
        });

        cy.get("#title1").should("have.text", "A section");

        cy.get("#theorem1_title").should("have.text", "Theorem 1");
        cy.get("#statement1").should("have.text", "The statement");
        cy.get("#proof1_title").should("contain.text", "Proof");
        cy.get("#proof1_title").should("contain.text", "Proof");
        cy.get("#proof1").should("not.contain.text", "The proof");
        cy.get("#proof1_title").click();
        cy.get("#proof1").should("contain.text", "The proof");

        cy.get("#theorem2_title").should("have.text", "Corollary 2");
        cy.get("#statement2").should("have.text", "The statement");
        cy.get("#proof2_title").should("contain.text", "Proof");
        cy.get("#proof2").should("not.contain.text", "The proof");
        cy.get("#proof2_title").click();
        cy.get("#proof2").should("contain.text", "The proof");
    });

    // TODO: reinstate this test
    // Temporarily skipping due to stopgap solution of reverting new type of section
    it.skip("Sections number independently of other sectioning elements", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section name="sec1">
  <objectives name="obj1">
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </objectives>
  <definition name="exp2">
    An definition
  </definition>
  <subsection name="sec1-1">
    <activity name="act3">
      Activity inside a subsection.
    </activity>
  </subsection>
  <section name="sec1-2">
    <aside name="aside4">
      An aside
    </aside>
  </section>
  <activity name="act5">
    Final activity
  </activity>
  <objectives renameTo="Outcomes" name="out6">
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </objectives>
</section>
<section name="sec2">
  <objectives name="obj7">
  <ul>
    <li>First 2</li>
    <li>Second 2</li>
  </ul>
  </objectives>
  <section name="sec2-1">
    <definition name="exp8">
      Another definition
    </definition>
  </section>
</section>

    `,
                },
                "*",
            );
        });

        // Note: not sure if this is how we want numbering to work long term,
        // but this test at least documents how it is working now.

        cy.get("#sec1_title").should("have.text", "Section 1");

        cy.get("#obj1_title").should("have.text", "Objectives 1");
        cy.get("#exp2_title").should("have.text", "Definition 2");
        cy.get("#sec1-1_title").should("have.text", "Section 1.1");
        cy.get("#act3_title").should("have.text", "Activity 3");
        cy.get("#sec1-2_title").should("have.text", "Section 1.2");
        cy.get("#aside4_title").should("contain.text", "Aside 4");
        cy.get("#act5_title").should("have.text", "Activity 5");
        cy.get("#out6_title").should("have.text", "Outcomes 6");

        cy.get("#sec2_title").should("have.text", "Section 2");

        cy.get("#obj7_title").should("have.text", "Objectives 7");
        cy.get("#sec2-1_title").should("have.text", "Section 2.1");
    });

    it("Problems tag causes child sections to be rendered as a list", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="aProb">
      <title>This is a problem</title>
      <p>Here is a problem!</p>
  
      <ol name="ol">
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>
    </problem>
  
    <exercises name="exercises">
      <problem name="prob1">
        <p>We don't have a title, but we have a list.</p>
          
        <ol name="ol">
          <li>Item A</li>
          <li>Item B</li>
        </ol>
      </problem>
      <problem name="prob2">
      <title>A titled problem</title>
        <p>Work hard</p>
      </problem>
  
      <problem extend="$aProb" name='aProbb' />
    </exercises>

    `,
                },
                "*",
            );
        });

        cy.get("#aProb_title").should("have.text", "This is a problem");
        cy.get(cesc("#aProb.ol")).should(
            "have.css",
            "list-style-type",
            "decimal",
        );

        cy.get("#exercises" + " article")
            .eq(0)
            .should(
                "contain.text",
                "We don't have a title, but we have a list.",
            );

        cy.get("#prob1_title").should("not.exist");
        cy.get(cesc("#prob1.ol")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );

        cy.get("#prob2_title").should("have.text", "A titled problem");

        cy.get("#aProbb_title").should("have.text", "This is a problem");
        cy.get(cesc("#aProbb.ol")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );
    });

    it("As list attribute causes child sections to be rendered as a list", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="aProb">
      <title>This is a problem</title>
      <p>Here is a problem!</p>
  
      <ol name="ol">
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>
    </problem>
  
    <section name="exercises" asList>
      <problem name="prob1">
        <p>We don't have a title, but we have a list.</p>
          
        <ol name="ol">
          <li>Item A</li>
          <li>Item B</li>
        </ol>
      </problem>
      <problem name="prob2">
      <title>A titled problem</title>
        <p>Work hard</p>
      </problem>
  
      <problem extend="$aProb" name='aProbb' />
    </section>

    `,
                },
                "*",
            );
        });

        cy.get("#aProb_title").should("have.text", "This is a problem");
        cy.get(cesc("#aProb.ol")).should(
            "have.css",
            "list-style-type",
            "decimal",
        );

        cy.get("#exercises" + " article")
            .eq(0)
            .should(
                "contain.text",
                "We don't have a title, but we have a list.",
            );

        cy.get("#prob1_title").should("not.exist");
        cy.get(cesc("#prob1.ol")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );

        cy.get("#prob2_title").should("have.text", "A titled problem");

        cy.get("#aProbb_title").should("have.text", "This is a problem");
        cy.get(cesc("#aProbb.ol")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );
    });
});
