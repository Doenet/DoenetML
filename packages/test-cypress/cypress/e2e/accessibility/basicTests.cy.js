import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Render commas tests", function () {
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
<p name="p">Hello!</p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should("contain.text", "Hello!");

        cy.checkAccessibility(null, {
            onlyWarnImpacts: ["moderate", "minor"],
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
                    <image name="image1" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" description="A giant anteater" />
                    <image name="image2" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" decorative />
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
    <video name="video1" youtube="tJ4ypc5L6uU" description="Intro to Doenet" />
    <video name="video2" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4" description="Earth" />
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
    <graph name="graph2" description="A graph" />
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
    <p name="p">1+1 = <answer description="1+1">2</answer></p>
    <p>1+1 = <answer forceFullCheckWorkButton description="1+1">2</answer></p>
    <p>hello: <answer type="text" description="hello">hello</answer></p>
    <p>bye: <answer type="text" forceFullCheckWorkButton description="bye">bye</answer></p>
    <p>now: <answer type="text" expanded forceFullCheckWorkButton description="now">now</answer></p>
    <p>Favorite animal:
        <answer description="Favorite animal">
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>Favorite animal:
        <answer selectMultiple description="Favorite animal">
            <choice credit="1">dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </answer>
    </p>
    <p>Favorite fruit:
        <answer inline description="Favorite fruit">
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p>Favorite fruit:
        <answer inline selectMultiple description="Favorite fruit">
            <choice credit="1">apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </answer>
    </p>
    <p><answer type="boolean" description="yes">true</answer></p>


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
    <p name="p"><mathInput description="1+1"></mathInput></p>
    <p><textInput description="hello"></textInput></p>
    <p><textInput expanded description="now"></textInput></p>
    <p>
        <choiceInput description="Favorite animal">
            <choice>dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput selectMultiple description="Favorite animal">
            <choice>dog</choice>
            <choice>cat</choice>
            <choice>monkey</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput inline description="Favorite fruit">
            <choice>apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </choiceInput>
    </p>
    <p>
        <choiceInput inline selectMultiple description="Favorite fruit">
            <choice>apple</choice>
            <choice>banana</choice>
            <choice>grape</choice>
        </choiceInput>
    </p>
    <p><booleanInput description="yes"></booleanInput></p>
    <p><matrixInput description="A"></matrixInput></p>

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

    it("check work buttons", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p"><answer name="a1"><mathInput name="m1" ><label>x</label></mathInput>x</answer></p>
    <p><answer name="a2"><mathInput name="m2" ><label>x</label></mathInput>x</answer></p>
    <p><answer name="a3"><mathInput name="m3" ><label>x</label></mathInput>x</answer></p>
    <p><answer name="a4" forceFullCheckWorkButton><mathInput name="m4" ><label>x</label></mathInput>x</answer></p>
    <p><answer name="a5" forceFullCheckWorkButton><mathInput name="m5" ><label>x</label></mathInput>x</answer></p>
    <p><answer name="a6" forceFullCheckWorkButton><mathInput name="m6" ><label>x</label></mathInput>x</answer></p>
    <p><answer name="a7"><mathInput name="m7" ><label>x</label></mathInput><award credit="0.5">x</award></answer></p>
    <p><answer name="a8" forceFullCheckWorkButton><mathInput name="m8" ><label>x</label></mathInput><award credit="0.5">x</award></answer></p>

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
});
