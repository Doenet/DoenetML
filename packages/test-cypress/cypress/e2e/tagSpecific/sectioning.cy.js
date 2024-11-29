import { cesc, cesc2 } from "@doenet/utils";

describe("Sectioning Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("prefill mathinput in aside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <aside name="aside1">
      <title>Starting closed</title>
      <p>An expression: <mathinput name="expr1" prefill="(x+1)(x^2-1)" /></p>
      <p>The value of the expression is $expr1.value{assignNames="expr1a"}</p>
    </aside>
    <aside name="aside2" startOpen>
      <title>Starting open</title>
      <p>An expression: <mathinput name="expr2" prefill="(x-1)(x^2+1)" /></p>
      <p>The value of the expression is $expr2.value{assignNames="expr2a"}</p>
    </aside>
  
    <p>The first expression is $expr1.value{assignNames="expr1b"}</p>
    <p>The second expression is $expr2.value{assignNames="expr2b"}</p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−1)");
            });
        cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });
        cy.get(cesc("#\\/expr1a")).should("not.exist");
        cy.get(cesc("#\\/expr2a") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });

        cy.get(cesc("#\\/expr1")).should("not.exist");
        cy.get(cesc("#\\/expr2") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });

        cy.get(cesc("#\\/aside1_title")).click();

        cy.get(cesc("#\\/expr1a") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−1)");
            });
        cy.get(cesc("#\\/expr1") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−1)");
            });

        cy.get(cesc("#\\/aside2_title")).click();
        cy.get(cesc("#\\/expr2a")).should("not.exist");
        cy.get(cesc("#\\/expr2")).should("not.exist");

        cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−1)");
            });
        cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });

        cy.get(cesc("#\\/expr1") + " textarea")
            .type("{end}{leftArrow}{backspace}4{enter}", { force: true })
            .blur();

        cy.get(cesc("#\\/expr1a")).should("contain.text", "(x+1)(x2−4)");
        cy.get(cesc("#\\/expr1a") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−4)");
            });
        cy.get(cesc("#\\/expr1") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq(
                    "(x+1)(x2−4)",
                );
            });

        cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−4)");
            });
        cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });

        cy.get(cesc("#\\/aside1_title")).click();
        cy.get(cesc("#\\/expr1a")).should("not.exist");
        cy.get(cesc("#\\/expr1")).should("not.exist");

        cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−4)");
            });
        cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });

        cy.get(cesc("#\\/aside2_title")).click();

        cy.get(cesc("#\\/expr2a") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });
        cy.get(cesc("#\\/expr2") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+1)");
            });

        cy.get(cesc("#\\/expr2") + " textarea")
            .type("{end}{leftArrow}{backspace}4{enter}", { force: true })
            .blur();

        cy.get(cesc("#\\/expr2a") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+4)");
            });
        cy.get(cesc("#\\/expr2") + " .mq-editable-field")
            .invoke("text")
            .then((text) => {
                expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq(
                    "(x−1)(x2+4)",
                );
            });

        cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x+1)(x2−4)");
            });
        cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim()).eq("(x−1)(x2+4)");
            });
    });

    it("copy and overwrite title", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <section includeAutoName includeAutoNumber name="sec">
        <title>A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" copySource="sec">
        <title>A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text copySource="sec.title" name="title1" /></p>
      <p>Copy of revised title: <text copySource="revised.title" name="title2" /></p>
      <p>Original section number: <text copySource="sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text copySource="revised.sectionNumber" name="sectionNumber2" /></p>
   
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/sec_title")).should("have.text", "Section 1: A title");
        cy.get(cesc("#\\/revised_title")).should(
            "have.text",
            "Section 2: A better title",
        );
        cy.get(cesc("#\\/title1")).should("have.text", "A title");
        cy.get(cesc("#\\/title2")).should("have.text", "A better title");
        cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
        cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");

        cy.get(cesc("#\\/_p1")).should("have.text", "Hello");
        cy.get(cesc("#\\/revised") + " p:first-of-type").should(
            "have.text",
            "Hello",
        );
        cy.get(cesc("#\\/_p2")).should("have.text", "Good day!");
    });

    it("copy and overwrite title, newNamespaces", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <section includeAutoName includeAutoNumber name="sec" newNamespace>
        <title>A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" copySource="sec" newNamespace>
        <title>A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text copySource="sec.title" name="title1" /></p>
      <p>Copy of revised title: <text copySource="revised.title" name="title2" /></p>
      <p>Original section number: <text copySource="sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text copySource="revised.sectionNumber" name="sectionNumber2" /></p>
    
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/sec_title")).should("have.text", "Section 1: A title");
        cy.get(cesc("#\\/revised_title")).should(
            "have.text",
            "Section 2: A better title",
        );
        cy.get(cesc("#\\/sec\\/_title1")).should("have.text", "A title");
        cy.get(cesc("#\\/revised\\/_title")).should("not.exist");
        cy.get(cesc("#\\/revised\\/_title2")).should(
            "have.text",
            "A better title",
        );
        cy.get(cesc("#\\/title1")).should("have.text", "A title");
        cy.get(cesc("#\\/title2")).should("have.text", "A better title");
        cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
        cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");

        cy.get(cesc("#\\/sec\\/_p1")).should("have.text", "Hello");
        cy.get(cesc("#\\/revised\\/_p1")).should("have.text", "Hello");
        cy.get(cesc("#\\/revised\\/_p2")).should("have.text", "Good day!");
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
  
      <p>Title 1: <text name="title1" copySource="aside1.title" /></p>
      <p>Title 2: <text name="title2" copySource="aside2.title" /></p>
      <p>Title 3: <text name="title3" copySource="aside3.title" /></p>
      <p>Title 3.1: <text name="title31" copySource="aside31.title" /></p>
      <p>Title 3.2: <text name="title32" copySource="aside32.title" /></p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/aside1_title")).should("contain.text", "Aside 1");
        cy.get(cesc("#\\/aside1_title")).should("not.contain.text", ":");
        cy.get(cesc("#\\/aside2_title")).should(
            "contain.text",
            "Aside: Side point",
        );
        cy.get(cesc("#\\/aside3_title")).should(
            "contain.text",
            "Aside 3: Another side point",
        );
        cy.get(cesc("#\\/title1")).should("have.text", "Aside 1");
        cy.get(cesc("#\\/title2")).should("have.text", "Side point");
        cy.get(cesc("#\\/title3")).should("have.text", "Another side point");

        cy.get(cesc("#\\/aside3_title")).click();

        cy.get(cesc("#\\/aside31_title")).should("contain.text", "Subpoint");
        cy.get(cesc("#\\/aside31_title")).should("not.contain.text", "1");
        cy.get(cesc("#\\/aside31_title")).should("not.contain.text", ":");
        cy.get(cesc("#\\/aside32_title")).should("contain.text", "Aside 5 ");
        cy.get(cesc("#\\/aside32_title")).should("not.contain.text", ":");

        cy.get(cesc("#\\/title31")).should("have.text", "Subpoint");
        cy.get(cesc("#\\/title32")).should("have.text", "Aside 5");
    });

    it("Exercise with statement, hint, givenanswer, and solution", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

    <exercise name="exer">
      <title>An exercise</title>
      <statement>The exercise</statement>
      <hint>
        <p>Try harder</p>
      </hint>
      <givenAnswer>
        <p>The correct answer</p>
      </givenAnswer>
      <solution>
        <p>Here's how you do it.</p>
      </solution>
    </exercise>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "An exercise");

        cy.get(cesc("#\\/_statement1")).should("have.text", "The exercise");

        cy.get(cesc("#\\/_hint1") + " [data-test=hint-heading]").should(
            "contain.text",
            "Hint",
        );
        cy.get(cesc("#\\/_hint1")).should("not.contain.text", "Try harder");
        cy.get(cesc("#\\/_givenanswer1")).should("contain.text", "Answer");
        cy.get(cesc("#\\/_givenanswer1")).should(
            "not.contain.text",
            "The correct answer",
        );
        cy.get(cesc("#\\/_solution1")).should("contain.text", "Solution");
        cy.get(cesc("#\\/_solution1")).should(
            "not.contain.text",
            "Here's how you do it.",
        );

        cy.get(cesc("#\\/_hint1") + " [data-test=hint-heading]").click();
        cy.get(cesc("#\\/_hint1")).should("contain.text", "Try harder");
        cy.get(cesc("#\\/_givenanswer1")).should(
            "not.contain.text",
            "The correct answer",
        );
        cy.get(cesc("#\\/_solution1")).should(
            "not.contain.text",
            "Here's how you do it.",
        );

        cy.get(cesc("#\\/_givenanswer1_button")).click();
        cy.get(cesc("#\\/_givenanswer1")).should(
            "contain.text",
            "The correct answer",
        );
        cy.get(cesc("#\\/_hint1")).should("contain.text", "Try harder");
        cy.get(cesc("#\\/_solution1")).should(
            "not.contain.text",
            "Here's how you do it.",
        );

        cy.get(cesc("#\\/_solution1_button")).click();
        cy.get(cesc("#\\/_solution1")).should(
            "contain.text",
            "Here's how you do it.",
        );
        cy.get(cesc("#\\/_hint1")).should("contain.text", "Try harder");
        cy.get(cesc("#\\/_givenanswer1")).should(
            "contain.text",
            "The correct answer",
        );
    });

    it("Section with introduction, subsections and conclusion", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title>A section</title>
  <introduction>
    <p>First this</p>
    <p>Then that</p>
    <text>Hello</text> <text>World</text>
  </introduction>
  <subsection>
    <title>Point 1</title>
    <p>Make the first point</p>
  </subsection>
  <subsection>
    <title>Point 2</title>
    <p>Make the second point</p>
  </subsection>
  <conclusion>
    Wrap <text>it</text> <text>up</text>!
  </conclusion>
</section>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "A section");

        cy.get(cesc("#\\/_introduction1")).should(
            "have.text",
            "\n    First this\n    Then that\n    Hello World\n  ",
        );

        cy.get(cesc("#\\/_subsection1")).should(
            "have.text",
            " Point 1\n    \n    Make the first point\n   ",
        );
        cy.get(cesc("#\\/_subsection2")).should(
            "have.text",
            " Point 2\n    \n    Make the second point\n   ",
        );

        cy.get(cesc("#\\/_conclusion1")).should(
            "have.text",
            "\n    Wrap it up!\n  ",
        );
    });

    it("Objectives", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title>A section</title>
  <objectives>
    <text>Hello</text> <text>World</text>
  </objectives>
  <p>Is objectives boxed? $_objectives1.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "A section");

        cy.get(cesc("#\\/_objectives1_title")).should(
            "have.text",
            "Objectives 1",
        );
        cy.get(cesc("#\\/_objectives1")).should("contain.text", "Hello World");

        cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Is objectives boxed? true",
        );
    });

    it("Activity", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title>A section</title>
  <activity>
    <text>Hello</text> <text>World</text>
  </activity>
  <p>Is activity boxed? $_activity1.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "A section");

        cy.get(cesc("#\\/_activity1_title")).should("have.text", "Activity 1");
        cy.get(cesc("#\\/_activity1")).should("contain.text", "Hello World");

        cy.get(cesc("#\\/_p1")).should("have.text", "Is activity boxed? false");
    });

    it("Definition", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title>A section</title>
  <definition>
    <text>Hello</text> <text>World</text>
  </definition>
  <p>Is definition boxed? $_definition1.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "A section");

        cy.get(cesc("#\\/_definition1_title")).should(
            "have.text",
            "Definition 1",
        );
        cy.get(cesc("#\\/_definition1")).should("contain.text", "Hello World");

        cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Is definition boxed? false",
        );
    });

    it("Note", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<section>
  <title>A section</title>
  <note>
    <text>Hello</text> <text>World</text>
  </note>
  <p>Is note boxed? $_note1.boxed</p>
</section>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_title1")).should("have.text", "A section");

        cy.get(cesc("#\\/_note1_title")).should("have.text", "Note 1");
        cy.get(cesc("#\\/_note1")).should("contain.text", "Hello World");

        cy.get(cesc("#\\/_p1")).should("have.text", "Is note boxed? false");
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

        cy.get(cesc("#\\/_title1")).should("have.text", "A section");

        cy.get(cesc("#\\/_theorem1_title")).should("have.text", "Theorem 1");
        cy.get(cesc("#\\/_statement1")).should("have.text", "The statement");
        cy.get(cesc("#\\/_proof1_title")).should("contain.text", "Proof");
        cy.get(cesc("#\\/_proof1_title")).should("contain.text", "Proof");
        cy.get(cesc("#\\/_proof1")).should("not.contain.text", "The proof");
        cy.get(cesc("#\\/_proof1_title")).click();
        cy.get(cesc("#\\/_proof1")).should("contain.text", "The proof");

        cy.get(cesc("#\\/_theorem2_title")).should("have.text", "Corollary 2");
        cy.get(cesc("#\\/_statement2")).should("have.text", "The statement");
        cy.get(cesc("#\\/_proof2_title")).should("contain.text", "Proof");
        cy.get(cesc("#\\/_proof2")).should("not.contain.text", "The proof");
        cy.get(cesc("#\\/_proof2_title")).click();
        cy.get(cesc("#\\/_proof2")).should("contain.text", "The proof");
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

        cy.get(cesc("#\\/sec1_title")).should("have.text", "Section 1");

        cy.get(cesc("#\\/obj1_title")).should("have.text", "Objectives 1");
        cy.get(cesc("#\\/exp2_title")).should("have.text", "Definition 2");
        cy.get(cesc("#\\/sec1-1_title")).should("have.text", "Section 1.1");
        cy.get(cesc("#\\/act3_title")).should("have.text", "Activity 3");
        cy.get(cesc("#\\/sec1-2_title")).should("have.text", "Section 1.2");
        cy.get(cesc("#\\/aside4_title")).should("contain.text", "Aside 4");
        cy.get(cesc("#\\/act5_title")).should("have.text", "Activity 5");
        cy.get(cesc("#\\/out6_title")).should("have.text", "Outcomes 6");

        cy.get(cesc("#\\/sec2_title")).should("have.text", "Section 2");

        cy.get(cesc("#\\/obj7_title")).should("have.text", "Objectives 7");
        cy.get(cesc("#\\/sec2-1_title")).should("have.text", "Section 2.1");
    });

    it("Problems tag causes child sections to be rendered as a list", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="aProb" newNamespace>
      <title>This is a problem</title>
      <p>Here is a problem!</p>
  
      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>
    </problem>
  
    <exercises name="exercises">
      <problem name="prob1" newNamespace>
        <p>We don't have a title, but we have a list.</p>
          
        <ol>
          <li>Item A</li>
          <li>Item B</li>
        </ol>
      </problem>
      <problem name="prob2" newNamespace>
      <title>A titled problem</title>
        <p>Work hard</p>
      </problem>
  
      $aProb{name='aProbb'}
    </exercises>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/aProb_title")).should(
            "have.text",
            "This is a problem",
        );
        cy.get(cesc("#\\/aProb\\/_ol1")).should(
            "have.css",
            "list-style-type",
            "decimal",
        );

        cy.get(cesc("#\\/exercises") + " li")
            .eq(0)
            .should(
                "contain.text",
                "We don't have a title, but we have a list.",
            );

        cy.get(cesc("#\\/prob1_title")).should("have.text", "");
        cy.get(cesc("#\\/prob1\\/_ol1")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );

        cy.get(cesc("#\\/prob2_title")).should("have.text", "A titled problem");

        cy.get(cesc("#\\/aProbb_title")).should(
            "have.text",
            "This is a problem",
        );
        cy.get(cesc("#\\/aProbb\\/_ol1")).should(
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
    <problem name="aProb" newNamespace>
      <title>This is a problem</title>
      <p>Here is a problem!</p>
  
      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>
    </problem>
  
    <section name="exercises" asList>
      <problem name="prob1" newNamespace>
        <p>We don't have a title, but we have a list.</p>
          
        <ol>
          <li>Item A</li>
          <li>Item B</li>
        </ol>
      </problem>
      <problem name="prob2" newNamespace>
      <title>A titled problem</title>
        <p>Work hard</p>
      </problem>
  
      $aProb{name='aProbb'}
    </section>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/aProb_title")).should(
            "have.text",
            "This is a problem",
        );
        cy.get(cesc("#\\/aProb\\/_ol1")).should(
            "have.css",
            "list-style-type",
            "decimal",
        );

        cy.get(cesc("#\\/exercises") + " li")
            .eq(0)
            .should(
                "contain.text",
                "We don't have a title, but we have a list.",
            );

        cy.get(cesc("#\\/prob1_title")).should("have.text", "");
        cy.get(cesc("#\\/prob1\\/_ol1")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );

        cy.get(cesc("#\\/prob2_title")).should("have.text", "A titled problem");

        cy.get(cesc("#\\/aProbb_title")).should(
            "have.text",
            "This is a problem",
        );
        cy.get(cesc("#\\/aProbb\\/_ol1")).should(
            "have.css",
            "list-style-type",
            "lower-alpha",
        );
    });
});
