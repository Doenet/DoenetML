describe("Basic accessibility tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
        cy.injectAxe();
    });

    it("Virtual keyboard passes accessibility tests", () => {
        // Makes sure keyboard passes basic tests, like color contrast
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<title>Let's test the keyboard</title>       
<p name="p">Hello!</p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should("contain.text", "Hello!");

        cy.checkAccessibility(null, {
            // onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Sections", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <title name="title">This document</title>
                    <section>
                        <title>My first section</title>

                        <p>A paragraph</p>

                        <section>

                            <p>No title in this sub-section.</p>
                        </section>

                        <section>
                            <title>Another sub-section</title>

                            <section>
                                <title>Next further</title>

                                Hello from here, no paragraph.

                            </section>

                            <section>
                                <p>This sub-sub-section has no title</p>
                            </section>

                            <p>Extra text in sub-section</p>
                        </section>

                        End for first section
                    </section>

                    <section>
                        <span>One more thing</span>
                    </section>

                    <div>Bye</div>
  `,
                },
                "*",
            );
        });

        cy.get("#title").should("contain.text", "This document");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Problem list in problems tag", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    
    <problems>
        <problem name="prob1">
            <title>First problem</title>
            <p>Content of first problem.</p>
        </problem>

        <problem name="prob2">
            <p>Content of second problem.</p>
        </problem>
    </problems>`,
                },
                "*",
            );
        });

        cy.get("#prob1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Section types", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

        <problem>
            <title>This is a problem</title>
            <p>Problem content</p>
        </problem>

        <problem boxed>
            <title>This is a boxed problem</title>
            <p>Problem content</p>
        </problem>

        <problem boxed>
            <title>This is a boxed problem with an answer</title>
            <p><answer><label>1+1=</label>2</answer></p>
        </problem>

        <exercise>
            <title>This is an exercise</title>
            <p>Exercise content</p>
        </exercise>

        <example>
            <title>This is an example</title>
            <p>Example content</p>
        </example>

        <theorem>
            <title>This is a theorem</title>
            <p>Theorem content</p>
        </theorem>

        <definition>
            <title>This is a definition</title>
            <p>Definition content</p>
        </definition>

        <aside>
            <title>This is an aside</title>
            <p>Aside content</p>
        </aside>

        <aside>
            <p>This aside has no title</p>
        </aside>

        <aside name="aside2">
            <title>Another aside</title>
            <p>Another aside content</p>
        </aside>

        <theorem>
            <title>My Theorem</title>
            <statement>
                <p>This is the statement of my theorem.</p>
            </statement>
            <proof>
                <p>This is the proof of my theorem.</p>
            </proof>
        </theorem>

        <section>
            <title>Section with parts</title>
            <introduction>
                <p>This is the introduction to my section with parts.</p>
            </introduction>

            <part>
                <title>Part 1</title>
                <p>Content of part 1.</p>
            </part>
            <part>
                <p>Content of part 2.</p>
            </part>
            <conclusion>
                <p>This is the conclusion of my section with parts.</p>
            </conclusion>
        </section>

  `,
                },
                "*",
            );
        });

        cy.get("#aside2").click();
        cy.get("#aside2").should("contain.text", "Another aside content");

        cy.checkAccessibility([".doenet-viewer"], {
            // onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Lists", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <ol>
                        <li>apple</li>
                        <li><p>banana</p></li>
                        <li><ul>
                            <li>alpha</li>
                            <li>beta</li>
                            <li><ol>
                                <li><p>one</p></li>
                                <li><p>two</p></li>
                            </ol></li>
                            <li>gamma</li>
                        </ul></li>
                        <li>cherry</li>
                    </ol>

                    <ul>
                        <li>cat</li>
                        <li><p>dog</p>
                            <ol>
                                <li>walk</li>
                                <li>run</li>
                            </ol>
                        </li>
                    </ul>
  `,
                },
                "*",
            );
        });

        cy.get(".doenet-viewer").should("contain.text", "apple");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Images", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <image name="image1" source="./Doenet_Logo_Frontpage.png">
                        <shortDescription>The Doenet logo</shortDescription>
                    </image>
                    <image name="image2" source="./Doenet_Logo_Frontpage.png" decorative />
  `,
                },
                "*",
            );
        });

        cy.get("#image1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Videos", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <video name="video1" youtube="tJ4ypc5L6uU"><shortDescription>Intro to Doenet</shortDescription></video>
    <video name="video2" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4">
        <shortDescription>Earth</shortDescription>
    </video>
  `,
                },
                "*",
            );
        });

        cy.get("#video1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Graph", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="graph1" decorative />
    <graph name="graph2"><shortDescription>A graph</shortDescription></graph>
  `,
                },
                "*",
            );
        });

        cy.get("#graph1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Displayed math", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p">We like <m>x^2</m>!</p>
    <p><m>\\frac{3}{4}</m></p>
    <me>\\int_a^b f(x) \\, dx</me>
    <men>\\vec{a} \\times \\vec{b} = \\vec{c}</men>
    <md>
      <mrow>(x+3)(x-1) \\amp= x^2 -x + 3x -3</mrow>
      <mrow> \\amp= x^2+3x-3</mrow>
    </md>
    <mdn>
      <mrow>(x+3)(x-1) \\amp= x^2 -x + 3x -3</mrow>
      <mrow> \\amp= x^2+3x-3</mrow>
    </mdn>


  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("answers with labels", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p"><answer><label>1+1=</label>2</answer></p>
    <p><answer forceFullCheckWorkButton><label>1+1=</label>2</answer></p>
    <p><answer type="text"><label>hello:</label>hello</answer></p>
    <p><answer type="text" forceFullCheckWorkButton><label>bye:</label>bye</answer></p>
    <p><answer type="text" expanded forceFullCheckWorkButton><label>now:</label>now</answer></p>
    <p>
        <answer>
            <label>Favorite animal:</label>
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>
        <answer selectMultiple>
            <label>Favorite animal:</label>
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>
        <answer inline>
            <label>Favorite fruit:</label>
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p>
        <answer inline selectMultiple>
            <label>Favorite fruit:</label>
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p><answer type="boolean"><label>yes</label>true</answer></p>


  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("answers with descriptions", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p">1+1 = <answer><shortDescription>1+1</shortDescription>2</answer></p>
    <p>1+1 = <answer forceFullCheckWorkButton><shortDescription>1+1</shortDescription>2</answer></p>
    <p>hello: <answer type="text"><shortDescription>hello</shortDescription>hello</answer></p>
    <p>bye: <answer type="text" forceFullCheckWorkButton><shortDescription>bye</shortDescription>bye</answer></p>
    <p>now: <answer type="text" expanded forceFullCheckWorkButton><shortDescription>now</shortDescription>now</answer></p>
    <p>Favorite animal:
        <answer><shortDescription>Favorite animal</shortDescription>
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>Favorite animal:
        <answer selectMultiple><shortDescription>Favorite animal</shortDescription>
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>Favorite fruit:
        <answer inline><shortDescription>Favorite fruit</shortDescription>
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p>Favorite fruit:
        <answer inline selectMultiple><shortDescription>Favorite fruit</shortDescription>
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p><answer type="boolean"><shortDescription>yes</shortDescription>true</answer></p>


  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("disabled answers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p"><answer disabled><label>1+1=</label>2</answer></p>
    <p><answer disabled forceFullCheckWorkButton><label>1+1=</label>2</answer></p>
    <p><answer disabled type="text"><label>hello:</label>hello</answer></p>
    <p><answer disabled type="text" forceFullCheckWorkButton><label>bye:</label>bye</answer></p>
    <p><answer disabled type="text" expanded forceFullCheckWorkButton><label>now:</label>now</answer></p>
    <p>
        <answer disabled>
            <label>Favorite animal:</label>
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>
        <answer disabled selectMultiple>
            <label>Favorite animal:</label>
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>
        <answer disabled inline>
            <label>Favorite fruit:</label>
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p>
        <answer disabled inline selectMultiple>
            <label>Favorite fruit:</label>
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p><answer disabled type="boolean"><label>yes</label>true</answer></p>


  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("inputs with labels", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p"><mathInput><label>1+1=</label></mathInput></p>
    <p><textInput><label>hello:</label>hello</textInput></p>
    <p><textInput expanded><label>now:</label></textInput></p>
    <p>
        <choiceInput>
            <label>Favorite animal:</label>
            <choice>dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput selectMultiple>
            <label>Favorite animal:</label>
            <choice>dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput inline>
            <label>Favorite fruit:</label>
            <choice>apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput inline selectMultiple>
            <label>Favorite fruit:</label>
            <choice>apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </choiceInput>
    </p>
    <p><booleanInput><label>yes</label></booleanInput></p>
    <p><matrixInput><label>A:</label></matrixInput></p>

  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("inputs with descriptions", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p"><mathInput><shortDescription>1+1</shortDescription></mathInput></p>
    <p><textInput><shortDescription>hello</shortDescription></textInput></p>
    <p><textInput expanded><shortDescription>now</shortDescription></textInput></p>
    <p>
        <choiceInput><shortDescription>Favorite animal</shortDescription>
            <choice>dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput selectMultiple><shortDescription>Favorite animal</shortDescription>
            <choice>dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput inline><shortDescription>Favorite fruit</shortDescription>
            <choice>apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput inline selectMultiple><shortDescription>Favorite fruit</shortDescription>
            <choice>apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </choiceInput>
    </p>
    <p><booleanInput><shortDescription>yes</shortDescription></booleanInput></p>
    <p><matrixInput><shortDescription>A</shortDescription></matrixInput></p>

  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("inline choice input menu with selected items", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>
        <choiceInput inline name="ci1"><shortDescription>Favorite fruit</shortDescription>
            <choice>apple 
                <text>and</text>
                <math>x^2</math>
                <number>3</number>
                <point>(3,4)</point>
                <vector>(5,6)</vector>
                <angle>pi</angle>
                <line>y=4x+1</line>
                <label>hi <m>\\frac{y}{x}</m></label>
            </choice>
            <choice>banana
                <text>and</text>
                <math>x^2</math>
                <number>3</number>
                <point>(3,4)</point>
                <vector>(5,6)</vector>
                <angle>pi</angle>
                <line>y=4x+1</line>
                <label>hi <m>\\frac{y}{x}</m></label>
            </choice>
            <choice>grape
                <text>and</text>
                <math>x^2</math>
                <number>3</number>
                <point>(3,4)</point>
                <vector>(5,6)</vector>
                <angle>pi</angle>
                <line>y=4x+1</line>
                <label>hi <m>\\frac{y}{x}</m></label>
            </choice>
        </choiceInput>
    </p>


  `,
                },
                "*",
            );
        });

        cy.get(`#ci1`).click();
        cy.get('#ci1 [class*="menu"]').within(() => {
            cy.contains("apple").click({ force: true });
        });
        cy.get(`#ci1`).click();

        // Hover over the banana option
        cy.get('#ci1 [class*="menu"]')
            .contains("banana")
            .parent()
            .parent()
            .trigger("mouseover");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("check work buttons", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p"><answer name="a1">
        <mathInput name="m1"><label>x</label></mathInput>x</answer></p>
    <p><answer name="a2">
        <mathInput name="m2"><label>x</label></mathInput>x
    </answer></p>
    <p><answer name="a3">
        <mathInput name="m3"><label>x</label></mathInput>
        x
    </answer></p>
    <p><answer name="a4" forceFullCheckWorkButton>
        <mathInput name="m4"><label>x</label></mathInput>
        x
    </answer></p>
    <p><answer name="a5" forceFullCheckWorkButton>
        <mathInput name="m5"><label>x</label></mathInput>
        x
    </answer></p>
    <p><answer name="a6" forceFullCheckWorkButton>
        <mathInput name="m6"><label>x</label></mathInput>
        x
    </answer></p>
    <p><answer name="a7">
        <mathInput name="m7"><label>x</label></mathInput>
        <award credit="0.5">x</award>
    </answer></p>
    <p><answer name="a8" forceFullCheckWorkButton>
        <mathInput name="m8"><label>x</label></mathInput>
        <award credit="0.5">x</award>
    </answer></p>
    <p><answer name="a9" showCorrectness="false">
        <mathInput name="m9"><label>x</label></mathInput>
        x
    </answer></p>
    <p><answer name="a10" forceFullCheckWorkButton showCorrectness="false">
        <mathInput name="m10"><label>x</label></mathInput>
        x
    </answer></p>

  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.get("#m2 textarea").type("x{enter}", { force: true });
        cy.get("#m3 textarea").type("{enter}", { force: true });

        cy.get("#m5 textarea").type("x{enter}", { force: true });
        cy.get("#a5_button").click();
        cy.get("#m6 textarea").type("{enter}", { force: true });
        cy.get("#a6_button").click();
        cy.get("#m7 textarea").type("x{enter}", { force: true });
        cy.get("#m8 textarea").type("x{enter}", { force: true });
        cy.get("#a8_button").click();

        cy.get("#m9 textarea").type("{enter}", { force: true });
        cy.get("#a10_button").click();

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("completed sections", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem boxed name="prob">
        <title>Auto completed as no answers</title>
    </problem>
  `,
                },
                "*",
            );
        });

        cy.get("#prob").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("refs", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="prob1">
        <title>A problem</title>

        <p>There is <ref to="$prob2">a second problem</ref>.</p>
    </problem>

    <problem name="prob2">
        <title>Another problem</title>

        <p>See <ref to="$prob1" createButton> first problem</ref>.</p>
    </problem>
  `,
                },
                "*",
            );
        });

        cy.get("#prob1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("slider", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p">Set value: <slider name="s1" from="0" to="10" step="1" /></p>
    <p><slider name="s2" from="0" to="10" step="1">
        <label>my label</label>
    </slider></p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("basic text components", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p">1 <ndash /> 2 <mdash/> hi<nbsp/>there<ellipsis/></p>

    <p>I <em>only</em> want to <alert>emphasize</alert> this.</p>
    <p><lq/>This is a quote.<rq/><br/>
    <q>This is another quote.</q></p>
    <p><lsq/>This is a single quote.<rsq/><br/>
    <sq>This is another single quote.</sq></p>

    <hr/>

    <blockQuote name="bq">
        For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.
    </blockquote>

    <pre><displayDoenetML>
        <title>Title in pre</title>
        <p>Paragraph in pre</p>
    </displayDoenetML></pre>  

    <p><c>This is code</c></p>

    <p>The <tag>math</tag> has a <attr>format</attr> attribute.</p>
    <p>The <tag>title</tag> or <tagc>title</tagc> or <tage>title</tage> tag. <term>DoenetML</term></p>

    <p>Use &amp; to represent an ampersand, &lt; for less than, &gt; for greater than, and &dollar; for a dollar sign.</p>

    <p>Do we have <number>1</number> <text>dog</text>? <boolean>true</boolean>.</p>

    <p><textList>cat dog mouse</textList></p>
    `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");
        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("table with tabular", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<table name="table1">
    <tabular>
    <row header>
        <cell>Heading 1</cell>
        <cell>Heading 2</cell>
    </row>
    <row>
        <cell>🟣</cell>
        <cell>🔴</cell>
    </row>
    <row>
        <cell><lorem generateWords="10" /></cell>
        <cell><lorem generateWords="5" /></cell>
    </row>
    </tabular>
    <title>My table</title>
</table>
`,
                },
                "*",
            );
        });

        cy.get("#table1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("spreadsheet", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<spreadsheet name="ss">
    <row header>
        <cell>Heading 1</cell>
        <cell>Heading 2</cell>
    </row>
    <row>
        <cell>🟣</cell>
        <cell>🔴</cell>
    </row>
    <row>
        <cell><lorem generateWords="10" /></cell>
        <cell><lorem generateWords="5" /></cell>
    </row>
</spreadsheet>
`,
                },
                "*",
            );
        });

        cy.get("#ss").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            // onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("figure", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <figure name="fig1">
        <image source="./Doenet_Logo_Frontpage.png">
            <shortDescription>logo</shortDescription>
        </image>
        <caption>The Doenet logo</caption>
    </figure>`,
                },
                "*",
            );
        });

        cy.get("#fig1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("footnotes", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p">This is some text with a footnote.<footnote name="fn1">This is the footnote text.</footnote></p>
    <p>Another footnote here.<footnote>Second footnote text.</footnote></p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");
        cy.get("#fn1").click();
        cy.get("#fn1").should("contain.text", "This is the footnote text.");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("pretzel", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <pretzel name="p">
        <problem>
            <statement name="s1"><p>What is 1+1?</p></statement>
            <givenAnswer name="a1"><p>2</p></givenAnswer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <givenAnswer name="a2"><p>3</p></givenAnswer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <givenAnswer name="a3"><p>4</p></givenAnswer>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <givenAnswer name="a4"><p>5</p></givenAnswer>
        </problem>
    </pretzel>

  `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("feedback, solution, hint", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="prob1">
        <answer name="ans"><label>What is 2+2?</label>4</answer>
        <feedback name="feedback1" condition="$ans = 4">Good job!</feedback>
        <hint>Think about pairs.</hint>
        <solution>The solution is 4 because 2 plus 2 equals 4.</solution>
    </problem>

    <problem name="prob2">
        <answer name="ans2"><label>What is 3+3?</label>6</answer>

        <hint name="hint2">
            <title>Clever hint</title>
            <p>Remember your addition.</p>
        </hint>

        <solution name="solution2">
            <p>The solution is 6 because 3 plus 3 equals 6.</p>
        </solution>

    </problem>
  `,
                },
                "*",
            );
        });

        cy.get("#prob1").should("be.visible");

        cy.get("#ans textarea").type("4{enter}", { force: true });

        cy.get("#feedback1").should("contain.text", "Good job!");

        cy.get("#hint2").click();
        cy.get("#hint2").should("contain.text", "Remember your addition.");

        cy.get("#solution2").click();
        cy.get("#solution2").should(
            "contain.text",
            "The solution is 6 because 3 plus 3 equals 6.",
        );

        cy.checkAccessibility([".doenet-viewer"], {
            // onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("sideBySide", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <sideBySide>
        <p><mathInput name="mi1">
            <label>Enter math here:</label>
        </mathInput></p>
        <p>This is some explanatory text next to the math input.</p>
    </sideBySide>

    <sbsGroup>
        <sideBySide>
            <p><mathInput name="mi2">
                <label>Another math input:</label>
            </mathInput></p>
            <p>More explanatory text.</p>
        </sideBySide>

        <sideBySide>
            <p><textInput name="ti1">
                <label>Enter text here:</label>
            </textInput></p>
            <p>Explanatory text for text input.</p>
        </sideBySide>
    </sbsGroup>
  `,
                },
                "*",
            );
        });

        cy.get("#mi1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("subsetOfRealsInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <subsetOfRealsInput name="sofri1">
        <label>Enter subset of reals:</label>
    </subsetOfRealsInput>`,
                },
                "*",
            );
        });

        cy.get("#sofri1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("orbitalDiagram", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <atom atomicNumber="6" name="carbon" />

    $carbon.orbitalDiagram

    <orbitalDiagramInput name="od1"/>

    `,
                },
                "*",
            );
        });

        cy.get("#od1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("paginator", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <paginatorControls paginator="$paginator1" />
    <paginator name="paginator1">
        <section name="section1">
            <title>Section 1</title>
            <p>Content of section 1.</p>
        </section>
        <section>
            <title>Section 2</title>
            <p>Content of section 2.</p>
        </section>
    </paginator>
    `,
                },
                "*",
            );
        });

        cy.get("#section1").should("contain.text", "Section 1");
        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("buttons", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <math name="x">0</math>

    <p name="p">
        <updateValue target="$x" newValue="$x+1"><label>Increment x</label></updateValue>
        <updateValue target="$x" newValue="$x+1" styleNumber="2"><label>Increment x</label></updateValue>
        <updateValue target="$x" newValue="$x+1" styleNumber="3"><label>Increment x</label></updateValue>
        <updateValue target="$x" newValue="$x+1" styleNumber="4"><label>Increment x</label></updateValue>
        <updateValue target="$x" newValue="$x+1" styleNumber="5"><label>Increment x</label></updateValue>
        <updateValue target="$x" newValue="$x+1" styleNumber="6"><label>Increment x</label></updateValue>
    </p>
    `,
                },
                "*",
            );
        });

        cy.get("#p").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("text color contrast", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="text1" styleNumber="1">Style 1 text</text>
    <text name="text2" styleNumber="2">Style 2 text</text>
    <text name="text3" styleNumber="3">Style 3 text</text>
    <text name="text4" styleNumber="4">Style 4 text</text>
    <text name="text5" styleNumber="5">Style 5 text</text>
    <text name="text6" styleNumber="6">Style 6 text</text>
    `,
                },
                "*",
            );
        });

        cy.get("#text1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("code editor", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    
    <codeEditor name="ce">
        <title>Example Test Content</title>

        <math name="x">5</math>
        <p>The value of x is: $x.value </p>

        <!-- Commented out -->

        Invalid closing tag: </section>

        Missing closing tag: <section>
        <invalidTag />
    </codeEditor>
    `,
                },
                "*",
            );
        });

        cy.get("#ce").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("DoenetEditor", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <title>Example Test Content</title>

        <math name="x">5</math>
        <p>The value of x is: $x.value </p>

        <!-- Commented out -->

        Invalid closing tag: </section>

        Missing closing tag: <section>
        <invalidTag />
    `,
                },
                "*",
            );
        });

        cy.get("#x").should("be.visible");

        cy.checkAccessibility(null, {
            // onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("DoenetEditor - read only", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_showEditor").click();
        cy.get("#testRunner_readOnly").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <title>Example Test Content</title>

        <math name="x">5</math>
        <p>The value of x is: $x.value </p>

        <!-- Commented out -->

        Invalid closing tag: </section>

        Missing closing tag: <section>
        <invalidTag />
    `,
                },
                "*",
            );
        });

        cy.get("#x").should("be.visible");

        cy.checkAccessibility(null, {
            // onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
