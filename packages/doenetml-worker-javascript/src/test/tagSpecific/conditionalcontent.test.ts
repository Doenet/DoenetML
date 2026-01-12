import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Conditional content tag tests", async () => {
    // tests without cases or else

    async function check_inline_sign_number(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_text(description: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues.text
                    .replace(/\s+/g, " ")
                    .trim(),
            ).eq(`You typed ${description}.`);
        }

        await check_text("something else");

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text("a positive number");

        await updateMathInputValue({
            latex: "-5/9",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text("a negative number");

        await updateMathInputValue({
            latex: "5-5",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text("zero");

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text("something else");
    }

    it("inline content containing sign of number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="n" />

  <p name="p">You typed 
    <conditionalContent condition="$n > 0">
      a positive number.
    </conditionalContent>
    <conditionalContent condition="$n < 0">
      a negative number.
    </conditionalContent>
    <conditionalContent condition="$n=0">
      zero.
    </conditionalContent>
    <conditionalContent condition="not ($n>0 or $n<0 or $n=0)" >
      something else.
    </conditionalContent>
  </p>
  `,
        });

        await check_inline_sign_number(core, resolvePathToNodeIdx);
    });

    it("inline content containing sign of number, use XML entities", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="n" />

  <p name="p">You typed 
    <conditionalContent condition="$n &gt; 0">
      a positive number.
    </conditionalContent>
    <conditionalContent condition="$n &lt; 0">
      a negative number.
    </conditionalContent>
    <conditionalContent condition="$n=0">
      zero.
    </conditionalContent>
    <conditionalContent condition="not ($n&gt;0 or $n&lt;0 or $n=0)" >
      something else.
    </conditionalContent>
  </p>
  `,
        });

        await check_inline_sign_number(core, resolvePathToNodeIdx);
    });

    it("block content containing sign of number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />

    <section name="section1"><conditionalContent condition="$n>0" >
      <p>You typed a positive number.</p>
    </conditionalContent></section>
    <section name="section2"><conditionalContent condition="$n<0" >
      <p>You typed a negative number.</p>
    </conditionalContent></section>
    <section name="section3"><conditionalContent condition="$n=0" >
      <p>You typed zero.</p>
    </conditionalContent></section>
    <section name="section4"><conditionalContent condition="not ($n>0 or $n<0 or $n=0)" >
      <p>You typed something else.</p>
    </conditionalContent></section>
  `,
        });

        const options = [
            "a positive number",
            "a negative number",
            "zero",
            "something else",
        ];
        async function check_text(index: number) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 1; i <= 4; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`section${i}`)]
                        .activeChildren.length,
                ).eq(i === index ? 3 : 0);
            }

            let p =
                stateVariables[await resolvePathToNodeIdx(`section${index}`)]
                    .activeChildren[1].componentIdx;

            expect(
                stateVariables[p].stateValues.text.replace(/\s+/g, " ").trim(),
            ).eq(`You typed ${options[index - 1]}.`);
        }

        await check_text(4);

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text(1);

        await updateMathInputValue({
            latex: "-5/9",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text(2);

        await updateMathInputValue({
            latex: "5-5",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text(3);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text(4);
    });

    it("include blank string between tags", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <text name="animal">fox</text><text name="verb">jumps</text>
  </setup>
  <booleanInput name="b" >
    <label>animal phrase</label>
  </booleanInput>

  <p name="p"><conditionalContent condition="$b">The $animal $verb.</conditionalContent></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The fox jumps.");
    });

    it("reference names of children, including an extended conditional content", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="p1"><conditionalContent name="cc" condition="$n > 0">
      <text name="a">dog</text> mouse <text name="b">cat</text>
    </conditionalContent></p>

    <p name="pa">$cc.a</p>
    
    <p name="pb">$cc.b</p>


    <p name="p2" ><conditionalContent extend="$cc" name="cc2" /></p>

    <p name="pa2">$cc2.a</p>

    <p name="pb2">$cc2.b</p>


    `,
        });

        async function check_text(names: string[]) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).contain(names.join(" "));
            expect(
                stateVariables[await resolvePathToNodeIdx("pa")].stateValues
                    .text,
            ).eq(names[0] || "");
            expect(
                stateVariables[await resolvePathToNodeIdx("pb")].stateValues
                    .text,
            ).eq(names[2] || "");
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).contain(names.join(" "));
            expect(
                stateVariables[await resolvePathToNodeIdx("pa2")].stateValues
                    .text,
            ).eq(names[0] || "");
            expect(
                stateVariables[await resolvePathToNodeIdx("pb2")].stateValues
                    .text,
            ).eq(names[2] || "");
        }

        await check_text([]);

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text(["dog", "mouse", "cat"]);

        // enter 0
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text([]);
    });

    it("correctly withhold replacements when shadowing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Hide greeting:
    <booleanInput name="hide" />
    </p>
    
    <p name="p"><group name="g">Greeting is hidden: $hide. Greeting: <conditionalContent condition="not $hide">Hello!</conditionalContent></group></p>
    
    <p>Show copy:
      <booleanInput name="show_copy" />
    </p>
    <p name="p2"><conditionalContent condition="$show_copy">$g</conditionalContent></p>
    
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("Greeting is hidden: false. Greeting: Hello!");

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("hide"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("Greeting is hidden: true. Greeting: ");

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("show_copy"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Greeting is hidden: true. Greeting: ");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("hide"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("Greeting is hidden: false. Greeting: Hello!");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Greeting is hidden: false. Greeting: Hello!");
    });

    // tests with cases or else

    it("case/else with single text, copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent name="cc">
      <case condition="$n < 0"><text name="t">dog</text></case>
      <case condition="$n <=1"><text name="t">cat</text></case>
      <else><text name="t">mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: <text extend="$cc" name="a1" /></p>

    <p name="pa2">value of a1: $a1.value</p>

    <p name="pb">b: <conditionalContent extend="$cc" name="cc2" /></p>

    <p name="pb1">b1: <text extend="$cc2.t" name="b1" /></p>

    <p name="pb2">value of b1: $b1.value</p>


    `,
        });

        async function check_text(name: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("pa")].stateValues
                    .text,
            ).eq(`a: ${name}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pa1")].stateValues
                    .text,
            ).eq(`a1: ${name}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pa2")].stateValues
                    .text,
            ).eq(`value of a1: ${name}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pb")].stateValues
                    .text,
            ).eq(`b: ${name}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pb1")].stateValues
                    .text,
            ).eq(`b1: ${name}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pb2")].stateValues
                    .text,
            ).eq(`value of b1: ${name}`);

            expect(
                stateVariables[await resolvePathToNodeIdx("b1")].stateValues
                    .text,
            ).eq(`${name}`);
        }

        await check_text("mouse");

        // enter 1

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "1",
            core,
        });
        await check_text("cat");

        // enter 10

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "10",
            core,
        });
        await check_text("mouse");

        // enter -1

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "-1",
            core,
        });
        await check_text("dog");

        // enter x

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "x",
            core,
        });
        await check_text("mouse");
    });

    async function check_test_math_optional(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(text: string, math: any, optional?: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.a`)].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx(`a1`)].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.a`)].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pa2`)].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc3.a`)].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pa3`)].stateValues
                    .text,
            ).eq(text);

            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.b`)].stateValues
                    .value.tree,
            ).eqls(math);
            expect(
                stateVariables[await resolvePathToNodeIdx(`b1`)].stateValues
                    .value.tree,
            ).eqls(math);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.b`)].stateValues
                    .value.tree,
            ).eqls(math);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pb2`)].stateValues
                    .text,
            ).eqls(math);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc3.b`)].stateValues
                    .value.tree,
            ).eqls(math);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pb3`)].stateValues
                    .text,
            ).eqls(math);

            if (optional) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`cc.c`)]
                        .stateValues.text,
                ).eq(optional);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`c1`)].stateValues
                        .text,
                ).eq(optional);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`cc2.c`)]
                        .stateValues.text,
                ).eq(optional);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pc2`)]
                        .stateValues.text,
                ).eq(optional);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`cc3.c`)]
                        .stateValues.text,
                ).eq(optional);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pc3`)]
                        .stateValues.text,
                ).eq(optional);
            } else {
                expect(stateVariables[await resolvePathToNodeIdx(`cc.c`)]).eq(
                    undefined,
                );

                expect(
                    stateVariables[await resolvePathToNodeIdx(`c1`)].stateValues
                        .text,
                ).eq("");
                expect(stateVariables[await resolvePathToNodeIdx(`cc2.c`)]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pc2`)]
                        .stateValues.text,
                ).eq("");
                expect(stateVariables[await resolvePathToNodeIdx(`cc3.c`)]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pc3`)]
                        .stateValues.text,
                ).eq("");
            }

            expect(stateVariables[await resolvePathToNodeIdx(`cc3.d`)]).eq(
                undefined,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx(`pd2`)].stateValues
                    .text,
            ).eq("");
        }

        await check_items("mouse", "z");

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("cat", "y");

        // enter 10
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("mouse", "z");

        // enter -1
        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("dog", "x", "optional text!");

        // enter x
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("mouse", "z");
    }

    it("case/else with text, math, and optional", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p>original: <conditionalContent name="cc">
      <case condition="$n<0" ><text name="a">dog</text>  <math name="b">x</math>
        <text name="c">optional text!</text>
      </case>
      <case condition="$n <= 1" ><text name="a">cat</text>  <math name="b">y</math>
      </case>
      <else><text name="a">mouse</text>  <math name="b">z</math>
      </else>
    </conditionalContent></p>

    <p>a1: <text extend="$cc.a" name="a1" /></p>
    <p>b1: <math extend="$cc.b" name="b1" /></p>
    <p>c1: <text extend="$cc.c" name="c1" /></p>
    <p>d1: <text extend="$cc.d" name="d1" /></p>

    <p>copy: <conditionalContent name="cc2" extend="$cc" /></p>

    <p name="pa2">$cc2.a</p>
    <p name="pb2">$cc2.b</p>
    <p name="pc2">$cc2.c</p>
    <p name="pd2">$cc2.d</p>

    <p>copied copy: <conditionalContent extend="$cc2" name="cc3" /></p>

    <p name="pa3">$cc3.a</p>
    <p name="pb3">$cc3.b</p>
    <p name="pc3">$cc3.c</p>
    `,
        });

        await check_test_math_optional(core, resolvePathToNodeIdx);
    });

    async function check_internal_external({
        core,
        skipSingletons = false,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        skipSingletons?: boolean;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        async function check_items({
            animal,
            plant,
            num,
            x,
            a,
        }: {
            animal: string;
            plant: string;
            num: number;
            x: any;
            a: any;
        }) {
            const p = ["*", num, a, x];

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.animal`)]
                    .stateValues.text,
            ).eq(animal);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.plant`)]
                    .stateValues.text,
            ).eq(plant);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.p`)].stateValues
                    .value.tree,
            ).eqls(p);

            expect(
                stateVariables[await resolvePathToNodeIdx(`animal`)].stateValues
                    .text,
            ).eq(animal);
            expect(
                stateVariables[await resolvePathToNodeIdx(`plant`)].stateValues
                    .text,
            ).eq(plant);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p`)].stateValues
                    .value.tree,
            ).eqls(p);

            if (!skipSingletons) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`xx`)].stateValues
                        .value.tree,
                ).eqls(x);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`aa`)].stateValues
                        .value.tree,
                ).eqls(a);
            }

            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.animal`)]
                    .stateValues.text,
            ).eq(animal);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.plant`)]
                    .stateValues.text,
            ).eq(plant);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.p`)].stateValues
                    .value.tree,
            ).eqls(p);

            expect(
                stateVariables[await resolvePathToNodeIdx(`animalCopy`)]
                    .stateValues.text,
            ).eq(animal);
            expect(
                stateVariables[await resolvePathToNodeIdx(`plantCopy`)]
                    .stateValues.text,
            ).eq(plant);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pCopy`)].stateValues
                    .value.tree,
            ).eqls(p);

            if (!skipSingletons) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`xxCopy`)]
                        .stateValues.value.tree,
                ).eqls(x);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`aaCopy`)]
                        .stateValues.value.tree,
                ).eqls(a);
            }
        }

        await check_items({
            animal: "mouse",
            plant: "bush",
            num: 6,
            x: "z",
            a: "c",
        });

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({
            animal: "cat",
            plant: "shrub",
            num: 5,
            x: "y",
            a: "b",
        });

        // enter -1
        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({
            animal: "dog",
            plant: "tree",
            num: 4,
            x: "x",
            a: "a",
        });

        // enter 10
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items({
            animal: "mouse",
            plant: "bush",
            num: 6,
            x: "z",
            a: "c",
        });
    }

    it("references to internal and external components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathInput name="n" />
    <p>original: <conditionalContent name="cc">
      <case condition="$n<0" >
        <text name="animal" extend="$x1" /> 
        <text name="plant" extend="$y1" />
        <math name="p" simplify>3<math name="a1">x</math><math name="b1">a</math> + $a1$b1</math>
      </case>
      <case condition="$n <= 1" >
        <text name="animal" extend="$x2" /> 
        <text name="plant" extend="$y2" />
        <math simplify name="p">4<math name="a2">y</math><math name="b2">b</math> + $a2$b2</math>
      </case>
      <else>
        <text name="animal" extend="$x3" /> 
        <text name="plant" extend="$y3" />
        <math simplify name="p">5<math name="a3">z</math><math name="b3">c</math> + $a3$b3</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <text extend="$cc.animal" name="animal" />
    <text extend="$cc.plant" name="plant" />
    <math extend="$cc.p" name="p" />

    <p>Whole thing repeated</p>
    <conditionalContent extend="$cc" name="cc2" />

    <p>Selected options repeated from copy</p>
    <text extend="$cc2.animal" name="animalCopy" />
    <text extend="$cc2.plant" name="plantCopy" />
    <math extend="$cc2.p" name="pCopy" />

    `,
        });

        await check_internal_external({
            core,
            skipSingletons: true,
            resolvePathToNodeIdx,
        });
    });

    async function check_dynamic_refs({
        core,
        inputName,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        inputName: string;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        async function check_items({
            question,
            comeback,
            response,
        }: {
            question: string;
            comeback: string;
            response: string;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.question`)]
                    .stateValues.text,
            ).eq(question);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc.comeback`)]
                    .stateValues.text,
            ).eq(comeback);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pResponse`)]
                    .stateValues.text,
            ).eq(`The response: ${response}`);

            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.question`)]
                    .stateValues.text,
            ).eq(question);
            expect(
                stateVariables[await resolvePathToNodeIdx(`cc2.comeback`)]
                    .stateValues.text,
            ).eq(comeback);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pResponse2`)]
                    .stateValues.text,
            ).eq(`The response one more time: ${response}`);
        }

        await check_items({
            question: "What is your name? ",
            comeback: "Hello, !",
            response: "",
        });

        await updateTextInputValue({
            text: "Fred",
            componentIdx: await resolvePathToNodeIdx(inputName),
            core,
        });
        await check_items({
            question: "What is your name? Fred",
            comeback: "Hello, Fred!",
            response: "Fred",
        });

        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items({
            question: "What is your favorite animal? ",
            comeback: "I like , too.",
            response: "",
        });

        await updateTextInputValue({
            text: "dogs",
            componentIdx: await resolvePathToNodeIdx(inputName),
            core,
        });
        await check_items({
            question: "What is your favorite animal? dogs",
            comeback: "I like dogs, too.",
            response: "dogs",
        });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items({
            question: "Anything else? ",
            comeback: "To repeat: .",
            response: "",
        });

        await updateTextInputValue({
            text: "Goodbye",
            componentIdx: await resolvePathToNodeIdx(inputName),
            core,
        });
        await check_items({
            question: "Anything else? Goodbye",
            comeback: "To repeat: Goodbye.",
            response: "Goodbye",
        });
    }

    it("dynamic internal references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="1" />
    <conditionalContent name="cc">
      <case condition="$n<0">
        <p name="question">What is your favorite animal? <textInput name="response" /></p>
        <p name="comeback">I like $response, too.</p>
      </case>
      <case condition="$n <= 1" >
        <p name="question">What is your name? <textInput name="response" /></p>
        <p name="comeback">Hello, $response!</p>
      </case>
      <else>
        <p name="question">Anything else? <textInput name="response" /></p>
        <p name="comeback">To repeat: $response.</p>
      </else>
    </conditionalContent>
    
    <p name="pResponse">The response: $cc.response</p>
    
    <conditionalContent name="cc2" extend="$cc" />
    
    <p name="pResponse2">The response one more time: $cc2.response</p>
    `,
        });

        await check_dynamic_refs({
            core,
            inputName: "cc.response",
            resolvePathToNodeIdx,
        });
    });

    it("copy case", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />

    <p name="p1"><conditionalContent name="cc1">
      <case name="positiveCase" condition="$n>0" ><text>positive</text></case>
      <else><text>non-positive</text></else>
    </conditionalContent></p>
    
    <p name="p2"><conditionalContent name="cc2">
      <case extend="$positiveCase" />
      <case condition="$n<0" ><text>negative</text></case>
      <else><text>neither</text></else>
    </conditionalContent></p>
    
    
    <p name="p3">$cc1</p>

    <p name="p4">$cc2</p>

    `,
        });

        async function check_items(item1: string, item2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`p1`)].stateValues
                    .text,
            ).eq(item1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p3`)].stateValues
                    .text,
            ).eq(item1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p2`)].stateValues
                    .text,
            ).eq(item2);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p4`)].stateValues
                    .text,
            ).eq(item2);
        }

        await check_items("non-positive", "neither");

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("positive", "positive");

        // enter -1
        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("non-positive", "negative");

        // enter 0
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("non-positive", "neither");
    });

    it("copy else", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />

    <p name="p1"><conditionalContent name="cc1">
      <case condition="$n>0" ><text>hello</text></case>
      <else name="bye"><text>bye</text></else>
    </conditionalContent></p>
    
    <p name="p2"><conditionalContent name="cc2">
      <case condition="$n<0" ><text>hello</text></case>
      <case condition="$n>0" ><text>oops</text></case>
      <else extend="$bye" />
    </conditionalContent></p>
    
    <p name="p3">$cc1</p>

    <p name="p4">$cc2</p>

    `,
        });

        async function check_items(item1: string, item2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`p1`)].stateValues
                    .text,
            ).eq(item1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p3`)].stateValues
                    .text,
            ).eq(item1);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p2`)].stateValues
                    .text,
            ).eq(item2);
            expect(
                stateVariables[await resolvePathToNodeIdx(`p4`)].stateValues
                    .text,
            ).eq(item2);
        }

        await check_items("bye", "bye");

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("hello", "oops");

        // enter -1
        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("bye", "hello");

        // enter 0
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("bye", "bye");
    });

    it("conditional contents hide dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first conditionalContent</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second conditionalContent</label>
    </booleanInput>
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent hide="$h1" name="cc1">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pb">b: <conditionalContent hide="$h2" name="cc2">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pa1">a1: <text extend="$cc1" /></p>
    <p name="pb1">b1: <text extend="$cc1" /></p>
    `,
        });

        async function check_items(item: string, hidden: string[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx(`pa`)].stateValues
                    .text,
            ).eq(`a: ${hidden.includes("a") ? "" : item}`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pa1`)].stateValues
                    .text,
            ).eq(`a1: ${item}`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pb`)].stateValues
                    .text,
            ).eq(`b: ${hidden.includes("b") ? "" : item}`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`pb1`)].stateValues
                    .text,
            ).eq(`b1: ${item}`);
        }

        await check_items("mouse", ["b"]);

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("cat", ["b"]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        await check_items("cat", ["a"]);

        // enter -3
        await updateMathInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("dog", ["a"]);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });

        await check_items("dog", ["b"]);
    });

    it("string and blank strings in case and else", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <text name="animal1">fox</text><text name="verb1">jumps</text>
    <text name="animal2">elephant</text><text name="verb2">trumpets</text>
  </setup>

  <mathInput name="n" />
  <p name="pa">a: <conditionalContent name="cc" >
    <case condition="$n > 0">The $animal1 $verb1.</case>
    <else>The $animal2 $verb2.</else>
  </conditionalContent></p>

  <p name="pa1">a1: $cc</p>

  <p name="pPieces" >pieces: <conditionalContent extend="$cc" name="cc2" /></p>

  <p name="pb1">b1: <text extend="$cc[1][1]" name="b1" /></p>
  <p name="pc1">c1: <text extend="$cc[1][2]" name="c1" /></p>
  <p name="pd1">d1: <text extend="$cc[1][3]" name="d1" /></p>
  <p name="pe1">e1: <text extend="$cc[1][4]" name="e1" /></p>

  `,
        });

        async function check_items(animal: string, verb: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("pa")].stateValues
                    .text,
            ).eq(`a: The ${animal} ${verb}.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pa1")].stateValues
                    .text,
            ).eq(`a1: The ${animal} ${verb}.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pPieces")]
                    .stateValues.text,
            ).eq(`pieces: The ${animal} ${verb}.`);

            expect(
                stateVariables[await resolvePathToNodeIdx("pb1")].stateValues
                    .text,
            ).eq("b1: ");
            expect(
                stateVariables[await resolvePathToNodeIdx("pc1")].stateValues
                    .text,
            ).eq(`c1: ${animal}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pd1")].stateValues
                    .text,
            ).eq(`d1: ${verb}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pe1")].stateValues
                    .text,
            ).eq("e1: ");

            expect(
                stateVariables[await resolvePathToNodeIdx("b1")].stateValues
                    .text,
            ).eq("");
            expect(
                stateVariables[await resolvePathToNodeIdx("c1")].stateValues
                    .text,
            ).eq(animal);
            expect(
                stateVariables[await resolvePathToNodeIdx("d1")].stateValues
                    .text,
            ).eq(verb);
            expect(
                stateVariables[await resolvePathToNodeIdx("e1")].stateValues
                    .text,
            ).eq("");
        }

        await check_items("elephant", "trumpets");

        // enter 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("fox", "jumps");

        // enter 0
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("elephant", "trumpets");
    });

    it("copy with invalid source gets expanded", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s">
  <mathInput name="n" />
  before
  <conditionalContent name="cc">
    <case condition="$n=1">nothing: $nada</case>
  </conditionalContent>
  after
</section>
  `,
        });

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s")].activeChildren,
        ).eqls([
            "\n  ",
            {
                componentIdx: await resolvePathToNodeIdx("n"),
                componentType: "mathInput",
            },
            "\n  before\n  ",
            "nothing: ",
            "\n  after\n",
        ]);
    });

    it("use original names if no assignNames", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="n" />

  <conditionalContent condition="$n > 0" name="cc1">
    <p name="p1">We have a <text name="winner1">first winner</text>!</p>
  </conditionalContent>
  
  <conditionalContent name="cc2">
    <case condition="$n > 0 && $n<=1">
      <p name="p2">Just emphasizing that we have that <text name="winner1b">first winner</text>!</p>
    </case>
    <case condition="$n > 1 && $n <= 2">
      <p name="p3">We have a <text name="winner2">second winner</text>!</p>
    </case>
    <case condition="$n > 2">
      <p name="p4">We have a <text name="winner3">third winner</text>!</p>
    </case>
    <else>
      <p name="p5">We have <text name="winner0">no winner</text>.</p>
    </else>
  </conditionalContent>
  `,
        });

        async function check_items(num_winners: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (num_winners > 0) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc1.winner1")]
                        .stateValues.text,
                ).eq("first winner");
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc1.p1")]
                        .stateValues.text,
                ).eq("We have a first winner!");
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("cc1.winner1")
                    ] === undefined ||
                        stateVariables[
                            await resolvePathToNodeIdx("cc1.winner1")
                        ].stateValues.isInactiveCompositeReplacement,
                ).eq(true);
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc1.p1")] ===
                        undefined ||
                        stateVariables[await resolvePathToNodeIdx("cc1.p1")]
                            .stateValues.isInactiveCompositeReplacement,
                ).eq(true);
            }

            if (num_winners === 1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner1b")]
                        .stateValues.text,
                ).eq("first winner");
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.p2")]
                        .stateValues.text,
                ).eq("Just emphasizing that we have that first winner!");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner1b")],
                ).eq(undefined);
                expect(stateVariables[await resolvePathToNodeIdx("cc2.p2")]).eq(
                    undefined,
                );
            }

            if (num_winners === 2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner2")]
                        .stateValues.text,
                ).eq("second winner");
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.p3")]
                        .stateValues.text,
                ).eq("We have a second winner!");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner2")],
                ).eq(undefined);
                expect(stateVariables[await resolvePathToNodeIdx("cc2.p3")]).eq(
                    undefined,
                );
            }

            if (num_winners > 2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner3")]
                        .stateValues.text,
                ).eq("third winner");
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.p4")]
                        .stateValues.text,
                ).eq("We have a third winner!");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner3")],
                ).eq(undefined);
                expect(stateVariables[await resolvePathToNodeIdx("cc2.p4")]).eq(
                    undefined,
                );
            }

            if (num_winners === 0) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner0")]
                        .stateValues.text,
                ).eq("no winner");
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.p5")]
                        .stateValues.text,
                ).eq("We have no winner.");
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("cc2.winner0")],
                ).eq(undefined);
                expect(stateVariables[await resolvePathToNodeIdx("cc2.p5")]).eq(
                    undefined,
                );
            }
        }

        await check_items(0);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(1);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(2);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(3);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(0);
    });

    it("primitive replacements removed from text when conditional content is hidden", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="h">true</booleanInput>

<p name="p">We have <conditionalContent hide="$h" condition="true">apples, </conditionalContent>bananas, <conditionalContent condition="true" hide="!$h">pineapples, </conditionalContent>and mangos.</p>

<text name="text" extend="$p.text" />
  `,
        });

        async function check_items(h: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let phrase = h
                ? "We have bananas, pineapples, and mangos."
                : "We have apples, bananas, and mangos.";

            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq(phrase);
            expect(
                stateVariables[await resolvePathToNodeIdx("text")].stateValues
                    .text,
            ).eq(phrase);
        }

        await check_items(true);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        await check_items(false);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        await check_items(true);
    });

    it("No duplicate component index with reference", async () => {
        // Fix a bug where the target of an `<updateValue>` (which is a references attribute)
        // caused a duplicate component index
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <booleanInput name="bi" />

        <p name="p"><conditionalContent>
            <case condition="$bi">A</case>
            <else>B<updateValue name="addPoint1" target="$bi" newValue="true" type="boolean" /></else>
        </conditionalContent></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("B ");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("A");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("B ");
    });

    it("warning if add a condition attribute with case children", async () => {
        let { core } = await createTestCore({
            doenetML: `
        <conditionalContent condition="true">
            <case condition="true">A</case>
            <else>B</else>
        </conditionalContent>

        <conditionalContent condition="true">
            C
        </conditionalContent>
  `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Attribute \`condition\` is ignored on a <conditionalContent> component with case or else children`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.line).eq(5);
    });
});
