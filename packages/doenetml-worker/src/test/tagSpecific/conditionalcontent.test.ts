import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Conditional content tag tests", async () => {
    // tests without cases or else

    async function check_inline_sign_number(core) {
        async function check_text(description: string) {
            let stateVariables = await returnAllStateVariables(core);

            expect(
                stateVariables["/p"].stateValues.text
                    .replace(/\s+/g, " ")
                    .trim(),
            ).eq(`You typed ${description}.`);
        }

        await check_text("something else");

        await updateMathInputValue({ latex: "10", name: "/n", core });
        await check_text("a positive number");

        await updateMathInputValue({
            latex: "-5/9",
            name: "/n",
            core,
        });
        await check_text("a negative number");

        await updateMathInputValue({ latex: "5-5", name: "/n", core });
        await check_text("zero");

        await updateMathInputValue({ latex: "x", name: "/n", core });
        await check_text("something else");
    }

    it("inline content containing sign of number", async () => {
        let core = await createTestCore({
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

        await check_inline_sign_number(core);
    });

    it("inline content containing sign of number, use XML entities", async () => {
        let core = await createTestCore({
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

        await check_inline_sign_number(core);
    });

    it("block content containing sign of number", async () => {
        let core = await createTestCore({
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
            let stateVariables = await returnAllStateVariables(core);

            for (let i = 1; i <= 4; i++) {
                expect(stateVariables[`/section${i}`].activeChildren.length).eq(
                    i === index ? 3 : 0,
                );
            }

            let p =
                stateVariables[`/section${index}`].activeChildren[1]
                    .componentName;

            expect(
                stateVariables[p].stateValues.text.replace(/\s+/g, " ").trim(),
            ).eq(`You typed ${options[index - 1]}.`);
        }

        await check_text(4);

        await updateMathInputValue({ latex: "10", name: "/n", core });
        await check_text(1);

        await updateMathInputValue({
            latex: "-5/9",
            name: "/n",
            core,
        });
        await check_text(2);

        await updateMathInputValue({ latex: "5-5", name: "/n", core });
        await check_text(3);

        await updateMathInputValue({ latex: "x", name: "/n", core });
        await check_text(4);
    });

    it("include blank string between tags", async () => {
        let core = await createTestCore({
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq("");

        await updateBooleanInputValue({
            boolean: true,
            name: "/b",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq("The fox jumps.");
    });

    it("assignNames gives blanks for strings but strings still displayed", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="p1"><conditionalContent name="cc" condition="$n > 0" assignNames="a b c">
      <text>dog</text> mouse <text>cat</text>
    </conditionalContent></p>

    <p name="pa">$a</p>
    
    <p name="pb">$b</p>

    <p name="pc">$c</p>

    <p name="p2" ><copy source="cc" assignNames="d e f" /></p>

    <p name="pd">$d</p>

    <p name="pe">$e</p>

    <p name="pf">$f</p>

    `,
        });

        async function check_text(names: string[]) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/p1"].stateValues.text).contain(
                names.join(" "),
            );
            expect(stateVariables["/pa"].stateValues.text).eq(names[0] || "");
            expect(stateVariables["/pb"].stateValues.text).eq("");
            expect(stateVariables["/pc"].stateValues.text).eq(names[2] || "");
            expect(stateVariables["/p2"].stateValues.text).contain(
                names.join(" "),
            );
            expect(stateVariables["/pd"].stateValues.text).eq(names[0] || "");
            expect(stateVariables["/pe"].stateValues.text).eq("");
            expect(stateVariables["/pf"].stateValues.text).eq(names[2] || "");
        }

        await check_text([]);

        // enter 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_text(["dog", "mouse", "cat"]);

        // enter 0
        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_text([]);
    });

    it("correctly withhold replacements when shadowing", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Hide greeting:
    <booleanInput name="hide" />
    </p>
    
    <p name="p">Greeting is hidden: $hide. Greeting: <conditionalContent condition="not $hide">Hello!</conditionalContent></p>
    
    <p>Show copy:
      <booleanInput name="show_copy" />
    </p>
    <conditionalContent condition="$show_copy" assignNames="p2">
      $p
    </conditionalContent>
    
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq(
            "Greeting is hidden: false. Greeting: Hello!",
        );

        expect(stateVariables["/p2"]).eq(undefined);

        await updateBooleanInputValue({
            boolean: true,
            name: "/hide",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq(
            "Greeting is hidden: true. Greeting: ",
        );

        expect(stateVariables["/p2"]).eq(undefined);

        await updateBooleanInputValue({
            boolean: true,
            name: "/show_copy",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p2"].stateValues.text).eq(
            "Greeting is hidden: true. Greeting: ",
        );

        await updateBooleanInputValue({
            boolean: false,
            name: "/hide",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq(
            "Greeting is hidden: false. Greeting: Hello!",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Greeting is hidden: false. Greeting: Hello!",
        );
    });

    // tests with cases or else

    it("case/else with single text, assign sub on copy", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent name="cc" assignNames="a">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: $a{assignNames="a1"}</p>

    <p name="pb" >b: $cc{assignNames="(b)"}</p>

    <p name="pb1">b1: $b{name="b1"}</p>

    `,
        });

        async function check_text(name: string) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/pa"].stateValues.text).eq(`a: ${name}`);
            expect(stateVariables["/pa1"].stateValues.text).eq(`a1: ${name}`);
            expect(stateVariables["/pb"].stateValues.text).eq(`b: ${name}`);
            expect(stateVariables["/pb1"].stateValues.text).eq(`b1: ${name}`);

            expect(stateVariables["/a1"].stateValues.text).eq(`${name}`);
            expect(stateVariables["/b"].stateValues.text).eq(`${name}`);
            expect(stateVariables["/b1"].stateValues.text).eq(`${name}`);
        }

        // enter 1

        await updateMathInputValue({ name: "/n", latex: "1", core });
        await check_text("cat");

        // enter 10

        await updateMathInputValue({ name: "/n", latex: "10", core });
        await check_text("mouse");

        // enter -1

        await updateMathInputValue({ name: "/n", latex: "-1", core });
        await check_text("dog");

        // enter x

        await updateMathInputValue({ name: "/n", latex: "x", core });
        await check_text("mouse");
    });

    it("case/else with single text, initially assign sub", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent name="cc" assignNames="(a)">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: $a{name="a1"}</p>

    <p name="pb" >b: $cc{assignNames="b"}</p>

    <p name="pb1">b1: $b{assignNames="b1"}</p>

    `,
        });

        async function check_text(name: string) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/pa"].stateValues.text).eq(`a: ${name}`);
            expect(stateVariables["/pa1"].stateValues.text).eq(`a1: ${name}`);
            expect(stateVariables["/pb"].stateValues.text).eq(`b: ${name}`);
            expect(stateVariables["/pb1"].stateValues.text).eq(`b1: ${name}`);

            expect(stateVariables["/a"].stateValues.text).eq(`${name}`);
            expect(stateVariables["/a1"].stateValues.text).eq(`${name}`);
            expect(stateVariables["/b1"].stateValues.text).eq(`${name}`);
        }

        // enter 1

        await updateMathInputValue({ name: "/n", latex: "1", core });
        await check_text("cat");

        // enter 10

        await updateMathInputValue({ name: "/n", latex: "10", core });
        await check_text("mouse");

        // enter -1

        await updateMathInputValue({ name: "/n", latex: "-1", core });
        await check_text("dog");

        // enter x

        await updateMathInputValue({ name: "/n", latex: "x", core });
        await check_text("mouse");
    });

    async function check_test_math_optional(core, namespaces = ["", "", ""]) {
        async function check_items(text: string, math: any, optional?: string) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables[`${namespaces[0]}/a`].stateValues.text).eq(
                text,
            );
            expect(stateVariables[`/a1`].stateValues.text).eq(text);
            expect(stateVariables[`${namespaces[1]}/e`].stateValues.text).eq(
                text,
            );
            expect(stateVariables[`/e1`].stateValues.text).eq(text);
            expect(stateVariables[`${namespaces[2]}/j`].stateValues.text).eq(
                text,
            );
            expect(stateVariables[`/j1`].stateValues.text).eq(text);

            expect(
                stateVariables[`${namespaces[0]}/b`].stateValues.value.tree,
            ).eqls(math);
            expect(stateVariables[`/b1`].stateValues.value.tree).eqls(math);
            expect(
                stateVariables[`${namespaces[1]}/f`].stateValues.value.tree,
            ).eqls(math);
            expect(stateVariables[`/f1`].stateValues.value.tree).eqls(math);
            expect(
                stateVariables[`${namespaces[2]}/k`].stateValues.value.tree,
            ).eqls(math);
            expect(stateVariables[`/k1`].stateValues.value.tree).eqls(math);

            if (optional) {
                expect(
                    stateVariables[`${namespaces[0]}/c`].stateValues.text,
                ).eq(optional);
                expect(stateVariables[`/c1`].stateValues.text).eq(optional);
                expect(
                    stateVariables[`${namespaces[1]}/g`].stateValues.text,
                ).eq(optional);
                expect(stateVariables[`/g1`].stateValues.text).eq(optional);
                expect(
                    stateVariables[`${namespaces[2]}/l`].stateValues.text,
                ).eq(optional);
                expect(stateVariables[`/l1`].stateValues.text).eq(optional);
            } else {
                expect(stateVariables[`${namespaces[0]}/c`] === undefined).eq(
                    true,
                );
                expect(stateVariables[`/c1`] === undefined).eq(true);
                expect(stateVariables[`${namespaces[1]}/g`] === undefined).eq(
                    true,
                );
                expect(stateVariables[`/g1`] === undefined).eq(true);
                expect(stateVariables[`${namespaces[2]}/l`] === undefined).eq(
                    true,
                );
                expect(stateVariables[`/l1`] === undefined).eq(true);
            }

            expect(stateVariables[`${namespaces[0]}/d`]).eq(undefined);
            expect(stateVariables[`/d1`]).eq(undefined);
            expect(stateVariables[`${namespaces[1]}/h`]).eq(undefined);
            expect(stateVariables[`/h1`]).eq(undefined);
            expect(stateVariables[`${namespaces[2]}/i`]).eq(undefined);
            expect(stateVariables[`/i1`]).eq(undefined);
        }

        await check_items("mouse", "z");

        // enter 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items("cat", "y");

        // enter 10
        await updateMathInputValue({ latex: "10", name: "/n", core });
        await check_items("mouse", "z");

        // enter -1
        await updateMathInputValue({ latex: "-1", name: "/n", core });
        await check_items("dog", "x", "optional text!");

        // enter x
        await updateMathInputValue({ latex: "x", name: "/n", core });
        await check_items("mouse", "z");
    }

    it("case/else with text, math, and optional", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p>original: <conditionalContent assignNames="(a b c d)">
      <case condition="$n<0" ><text>dog</text>  <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$n <= 1" ><text>cat</text>  <math>y</math>
      </case>
      <else><text>mouse</text>  <math>z</math>
      </else>
    </conditionalContent></p>

    <p>a1: $a{name="a1"}</p>
    <p>b1: $b{name="b1"}</p>
    <p>c1: $c{name="c1"}</p>
    <p>d1: $d{name="d1"}</p>

    <p>copy: <copy name="cnd2" source="_conditionalcontent1" assignNames="(e f g h i)" /></p>

    <p>e1: $e{name="e1"}</p>
    <p>f1: $f{name="f1"}</p>
    <p>g1: $g{name="g1"}</p>
    <p>h1: $h{name="h1"}</p>
    <p>i1: $i{name="i1"}</p>

    <p>copied copy: <copy source="cnd2" assignNames="(j k l)" /></p>

    <p>j1: $j{name="j1"}</p>
    <p>k1: $k{name="k1"}</p>
    <p>l1: $l{name="l1"}</p>
    `,
        });

        await check_test_math_optional(core);
    });

    it("case/else with text, math, and optional, new namespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p>original: <conditionalContent assignNames="(a b c d)" name="s1" newNameSpace>
      <case condition="$(../n)<0" ><text>dog</text>  <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$(../n) <= 1" ><text>cat</text>  <math>y</math>
      </case>
      <else><text>mouse</text>  <math>z</math>
      </else>
    </conditionalContent></p>

    <p>a1: $(s1/a{name="a1"})</p>
    <p>b1: $(s1/b{name="b1"})</p>
    <p>c1: $(s1/c{name="c1"})</p>
    <p>d1: $(s1/d{name="d1"})</p>

    <p>copy: <conditionalContent name="s2" copySource="s1" assignNames="(e f g h i)" /></p>

    <p>e1: $(s2/e{name="e1"})</p>
    <p>f1: $(s2/f{name="f1"})</p>
    <p>g1: $(s2/g{name="g1"})</p>
    <p>h1: $(s2/h{name="h1"})</p>
    <p>i1: $(s2/i{name="i1"})</p>

    <p>copied copy: <conditionalContent name="s3" copySource="s2" assignNames="(j k l)" newNameSpace /></p>

    <p>j1: $(s3/j{name="j1"})</p>
    <p>k1: $(s3/k{name="k1"})</p>
    <p>l1: $(s3/l{name="l1"})</p>
    `,
        });

        await check_test_math_optional(core, ["/s1", "/s2", "/s3"]);
    });

    async function check_internal_external({
        core,
        namePrefixes,
        skipSingletons = false,
        calcNegativeFromContainers,
    }: {
        core: Core;
        namePrefixes: string[];
        skipSingletons?: boolean;
        calcNegativeFromContainers?: string[];
    }) {
        async function check_items({
            animal,
            plant,
            num,
            x,
            a,
            calcFromContainers,
        }: {
            animal: string;
            plant: string;
            num: number;
            x: any;
            a: any;
            calcFromContainers?: string[];
        }) {
            const p = ["*", num, a, x];

            let stateVariables = await returnAllStateVariables(core);

            if (calcFromContainers) {
                // special case where didn't add a namespace and didn't name sub-components.
                // We can get some components from the containers,
                // and the other components just were not created

                // first none of the regular items exist
                for (let item of [
                    `${namePrefixes[0]}animal`,
                    `${namePrefixes[0]}plant`,
                    `${namePrefixes[0]}p`,
                    `/animal`,
                    `/plant`,
                    `/p`,
                    `/xx`,
                    `/aa`,
                    `${namePrefixes[1]}animal`,
                    `${namePrefixes[1]}plant`,
                    `${namePrefixes[1]}p`,
                    `/animalCopy`,
                    `/plantCopy`,
                    `/pCopy`,
                    `/xxCopy`,
                    `/aaCopy`,
                ]) {
                    expect(stateVariables[item]).eq(undefined);
                }

                let names1 = stateVariables[
                    calcFromContainers[0]
                ].activeChildren
                    .map((x) => x.componentName)
                    .filter((x) => x);

                expect(stateVariables[names1[0]].stateValues.text).eq(animal);
                expect(stateVariables[names1[1]].stateValues.text).eq(plant);
                expect(stateVariables[names1[2]].stateValues.value.tree).eqls(
                    p,
                );

                let names2 = stateVariables[
                    calcFromContainers[1]
                ].activeChildren
                    .map((x) => x.componentName)
                    .filter((x) => x);

                expect(stateVariables[names2[0]].stateValues.text).eq(animal);
                expect(stateVariables[names2[1]].stateValues.text).eq(plant);
                expect(stateVariables[names2[2]].stateValues.value.tree).eqls(
                    p,
                );
            } else {
                expect(
                    stateVariables[`${namePrefixes[0]}animal`].stateValues.text,
                ).eq(animal);
                expect(
                    stateVariables[`${namePrefixes[0]}plant`].stateValues.text,
                ).eq(plant);
                expect(
                    stateVariables[`${namePrefixes[0]}p`].stateValues.value
                        .tree,
                ).eqls(p);

                expect(stateVariables[`/animal`].stateValues.text).eq(animal);
                expect(stateVariables[`/plant`].stateValues.text).eq(plant);
                expect(stateVariables[`/p`].stateValues.value.tree).eqls(p);

                if (!skipSingletons) {
                    expect(stateVariables[`/xx`].stateValues.value.tree).eqls(
                        x,
                    );
                    expect(stateVariables[`/aa`].stateValues.value.tree).eqls(
                        a,
                    );
                }

                expect(
                    stateVariables[`${namePrefixes[1]}animal`].stateValues.text,
                ).eq(animal);
                expect(
                    stateVariables[`${namePrefixes[1]}plant`].stateValues.text,
                ).eq(plant);
                expect(
                    stateVariables[`${namePrefixes[1]}p`].stateValues.value
                        .tree,
                ).eqls(p);

                expect(stateVariables[`/animalCopy`].stateValues.text).eq(
                    animal,
                );
                expect(stateVariables[`/plantCopy`].stateValues.text).eq(plant);
                expect(stateVariables[`/pCopy`].stateValues.value.tree).eqls(p);

                if (!skipSingletons) {
                    expect(
                        stateVariables[`/xxCopy`].stateValues.value.tree,
                    ).eqls(x);
                    expect(
                        stateVariables[`/aaCopy`].stateValues.value.tree,
                    ).eqls(a);
                }
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
        await updateMathInputValue({ latex: "1", name: "/n", core });

        await check_items({
            animal: "cat",
            plant: "shrub",
            num: 5,
            x: "y",
            a: "b",
        });

        // enter -1
        await updateMathInputValue({ latex: "-1", name: "/n", core });

        await check_items({
            animal: "dog",
            plant: "tree",
            num: 4,
            x: "x",
            a: "a",
            calcFromContainers: calcNegativeFromContainers,
        });

        // enter 10
        await updateMathInputValue({ latex: "10", name: "/n", core });

        await check_items({
            animal: "mouse",
            plant: "bush",
            num: 6,
            x: "z",
            a: "c",
        });
    }

    it("references to internal and external components", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathInput name="n" />
    <p>original: <conditionalContent name="cc" assignNames="(a_animal a_plant a_p)">
      <case condition="$n<0" >
        $x1
        $y1
        <math simplify>3<math name="a1">x</math><math name="b1">a</math> + $a1$b1</math>
      </case>
      <case condition="$n <= 1" >
        $x2
        $y2
        <math simplify>4<math name="a2">y</math><math name="b2">b</math> + $a2$b2</math>
      </case>
      <else>
        $x3
        $y3
        <math simplify>5<math name="a3">z</math><math name="b3">c</math> + $a3$b3</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $a_animal{name="animal"}
    $a_plant{name="plant"}
    $a_p{name="p"}

    <p>Whole thing repeated</p>
    <conditionalContent copySource="cc" assignNames="(b_animal b_plant b_p)" />

    <p>Selected options repeated from copy</p>
    $b_animal{name="animalCopy"}
    $b_plant{name="plantCopy"}
    $b_p{name="pCopy"}


    `,
        });

        await check_internal_external({
            core,
            namePrefixes: ["/a_", "/b_"],
            skipSingletons: true,
        });
    });

    it("references to internal and external components, new namespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathInput name="n" />
    <p>original: <conditionalContent name="cc" assignNames="a">
      <case condition="$n<0" newNamespace >
        $(../x1{name="animal"})
        $(../y1{name="plant"})
        <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + $x$a</math>
      </case>
      <case condition="$n <= 1" newNamespace >
        $(../x2{name="animal"})
        $(../y2{name="plant"})
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + $x$a</math>
      </case>
      <else newNamespace>
        $(../x3{name="animal"})
        $(../y3{name="plant"})
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + $x$a</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $(a/animal{name="animal"})
    $(a/plant{name="plant"})
    $(a/p{name="p"})
    $(a/x{name="xx"})
    $(a/a{name="aa"})

    <p>Whole thing repeated</p>
    <conditionalContent copySource="cc" assignNames="b" />

    <p>Selected options repeated from copy</p>
    $(b/animal{name="animalCopy"})
    $(b/plant{name="plantCopy"})
    $(b/p{name="pCopy"})
    $(b/x{name="xxCopy"})
    $(b/a{name="aaCopy"})

    `,
        });

        await check_internal_external({ core, namePrefixes: ["/a/", "/b/"] });
    });

    it("references to internal and external components, multiple layers of new namespaces", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathInput name="n" />
    <p>original: <conditionalContent name="s" assignNames="a" newNamespace>
      <case newNamespace condition="$(../n) < 0" >
        $(../../x1{name="animal"})
        $(../../y1{name="plant"})
        <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + $x$a</math>
      </case>
      <case newNamespace condition="$(../n) <= 1" >
        $(../../x2{name="animal"})
        $(../../y2{name="plant"})
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + $x$a</math>
      </case>
      <else newNamespace>
        $(../../x3{name="animal"})
        $(../../y3{name="plant"})
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + $x$a</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $(s/a/animal{name="animal"})
    $(s/a/plant{name="plant"})
    $(s/a/p{name="p"})
    $(s/a/x{name="xx"})
    $(s/a/a{name="aa"})

    <p>Whole thing repeated</p>
    <conditionalContent copySource="s" name="s2" assignNames="b" />

    <p>Selected options repeated from copy</p>
    $(s2/b/animal{name="animalCopy"})
    $(s2/b/plant{name="plantCopy"})
    $(s2/b/p{name="pCopy"})
    $(s2/b/x{name="xxCopy"})
    $(s2/b/a{name="aaCopy"})

    `,
        });
        await check_internal_external({
            core,
            namePrefixes: ["/s/a/", "/s2/b/"],
        });
    });

    it("references to internal and external components, inconsistent new namespaces", async () => {
        // not sure why would want to do this, as give inconsistent behavior
        // depending on which option is chosen
        // but, we handle it gracefully
        let core = await createTestCore({
            doenetML: `
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathInput name="n" />
    <p name="p1">original: <conditionalContent name="cc" assignNames="a">
      <case condition="$n<0" >
        $x1{name="theanimal"}
        $y1{name="theplant"}
        <math simplify name="thep">3<math name="thex">x</math><math name="thea">a</math> + $thex$thea</math>
      </case>
      <case newNamespace condition="$n <= 1" >
        $(../x2{name="animal"})
        $(../y2{name="plant"})
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + $x$a</math>
      </case>
      <else newNamespace>
        $(../x3{name="animal"})
        $(../y3{name="plant"})
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + $x$a</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $(a/animal{name="animal"})
    $(a/plant{name="plant"})
    $(a/p{name="p"})
    $(a/x{name="xx"})
    $(a/a{name="aa"})

    <p>Whole thing repeated</p>
    <p name="repeat"><conditionalContent name="s2" copySource="cc" assignNames="b" /></p>

    <p>Selected options repeated from copy</p>
    $(b/animal{name="animalCopy"})
    $(b/plant{name="plantCopy"})
    $(b/p{name="pCopy"})
    $(b/x{name="xxCopy"})
    $(b/a{name="aaCopy"})

    `,
        });

        await check_internal_external({
            core,
            namePrefixes: ["/a/", "/b/"],
            calcNegativeFromContainers: ["/p1", "/repeat"],
        });
    });

    async function check_dynamic_refs({
        core,
        namePrefixes,
        inputName,
    }: {
        core: Core;
        namePrefixes: string[];
        inputName: string;
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
            const stateVariables = await returnAllStateVariables(core);

            expect(
                stateVariables[`${namePrefixes[0]}question`].stateValues.text,
            ).eq(question);
            expect(
                stateVariables[`${namePrefixes[0]}comeback`].stateValues.text,
            ).eq(comeback);
            expect(stateVariables[`/pResponse`].stateValues.text).eq(
                `The response: ${response}`,
            );

            expect(
                stateVariables[`${namePrefixes[1]}question`].stateValues.text,
            ).eq(question);
            expect(
                stateVariables[`${namePrefixes[1]}comeback`].stateValues.text,
            ).eq(comeback);
            expect(stateVariables[`/pResponse2`].stateValues.text).eq(
                `The response one more time: ${response}`,
            );
        }

        await check_items({
            question: "What is your name? ",
            comeback: "Hello, !",
            response: "",
        });

        await updateTextInputValue({
            text: "Fred",
            name: inputName,
            core,
        });
        await check_items({
            question: "What is your name? Fred",
            comeback: "Hello, Fred!",
            response: "Fred",
        });

        await updateMathInputValue({ latex: "-1", name: "/n", core });
        await check_items({
            question: "What is your favorite animal? ",
            comeback: "I like , too.",
            response: "",
        });

        await updateTextInputValue({
            text: "dogs",
            name: inputName,
            core,
        });
        await check_items({
            question: "What is your favorite animal? dogs",
            comeback: "I like dogs, too.",
            response: "dogs",
        });

        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items({
            question: "Anything else? ",
            comeback: "To repeat: .",
            response: "",
        });

        await updateTextInputValue({
            text: "Goodbye",
            name: inputName,
            core,
        });
        await check_items({
            question: "Anything else? Goodbye",
            comeback: "To repeat: Goodbye.",
            response: "Goodbye",
        });
    }

    it("dynamic internal references", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="1" />
    <conditionalContent assignNames="a">
      <case condition="$n<0" newNamespace>
        <p name="question">What is your favorite animal? <textinput name="response" /></p>
        <p name="comeback">I like <copy prop="value" source="response" />, too.</p>
      </case>
      <case condition="$n <= 1" newNamespace >
        <p name="question">What is your name? <textinput name="response" /></p>
        <p name="comeback">Hello, <copy prop="value" source="response" />!</p>
      </case>
      <else newNamespace>
        <p name="question">Anything else? <textinput name="response" /></p>
        <p name="comeback">To repeat: <copy prop="value" source="response" />.</p>
      </else>
    </conditionalContent>
    
    <p name="pResponse">The response: <copy source="a/response" prop="value" /></p>
    
    <conditionalContent name="sc2" copysource="_conditionalcontent1" assignNames="b" />
    
    <p name="pResponse2">The response one more time: <copy source="b/response" prop="value" /></p>
    `,
        });

        await check_dynamic_refs({
            core,
            namePrefixes: ["/a/", "/b/"],
            inputName: "/a/response",
        });
    });

    it("dynamic internal references, assign pieces", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="1" />
    <conditionalContent name="cc" assignNames="(a_question a_comeback)">
      <case condition="$n<0" >
        <p newNamespace name="panimal">What is your favorite animal? <textinput name="response" /></p>
        <p newNamespace>I like <copy prop="value" source="../panimal/response" />, too.</p>
      </case>
      <case condition="$n <= 1" >
        <p newNamespace name="pname">What is your name? <textinput name="response" /></p>
        <p newNamespace>Hello, <copy prop="value" source="../pname/response" />!</p>
      </case>
      <else>
        <p newNamespace name="pelse">Anything else? <textinput name="response" /></p>
        <p newNamespace>To repeat: <copy prop="value" source="../pelse/response" />.</p>
      </else>
    </conditionalContent>
    
    <p name="pResponse">The response: <copy source="a_question/response" prop="value" /></p>
    
    <conditionalContent name="sc2" copySource="cc" assignNames="(b_question b_comeback)" />
    
    <p name="pResponse2">The response one more time: <copy source="b_question/response" prop="value" /></p>
    `,
        });

        await check_dynamic_refs({
            core,
            namePrefixes: ["/a_", "/b_"],
            inputName: "/a_question/response",
        });
    });

    it("copy case", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />

    <p name="p1"><conditionalContent name="cc1">
      <case name="positiveCase" condition="$n>0" ><text>positive</text></case>
      <else><text>non-positive</text></else>
    </conditionalContent></p>
    
    <p name="p2"><conditionalContent name="cc2">
      <case copySource="positiveCase" />
      <case condition="$n<0" ><text>negative</text></case>
      <else><text>neither</text></else>
    </conditionalContent></p>
    
    
    <p name="p3">$cc1</p>

    <p name="p4">$cc2</p>

    `,
        });

        async function check_items(item1: string, item2: string) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables[`/p1`].stateValues.text).eq(item1);
            expect(stateVariables[`/p3`].stateValues.text).eq(item1);
            expect(stateVariables[`/p2`].stateValues.text).eq(item2);
            expect(stateVariables[`/p4`].stateValues.text).eq(item2);
        }

        await check_items("non-positive", "neither");

        // enter 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items("positive", "positive");

        // enter -1
        await updateMathInputValue({ latex: "-1", name: "/n", core });
        await check_items("non-positive", "negative");

        // enter 0
        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_items("non-positive", "neither");
    });

    it("copy else", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="n" />

    <p name="p1"><conditionalContent name="cc1">
      <case condition="$n>0" ><text>hello</text></case>
      <else name="bye"><text>bye</text></else>
    </conditionalContent></p>
    
    <p name="p2"><conditionalContent name="cc2">
      <case condition="$n<0" ><text>hello</text></case>
      <case condition="$n>0" ><text>oops</text></case>
      <else copySource="bye" />
    </conditionalContent></p>
    
    <p name="p3">$cc1</p>

    <p name="p4">$cc2</p>

    `,
        });

        async function check_items(item1: string, item2: string) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables[`/p1`].stateValues.text).eq(item1);
            expect(stateVariables[`/p3`].stateValues.text).eq(item1);
            expect(stateVariables[`/p2`].stateValues.text).eq(item2);
            expect(stateVariables[`/p4`].stateValues.text).eq(item2);
        }

        await check_items("bye", "bye");

        // enter 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items("hello", "oops");

        // enter -1
        await updateMathInputValue({ latex: "-1", name: "/n", core });
        await check_items("bye", "hello");

        // enter 0
        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_items("bye", "bye");
    });

    it("conditional contents hide dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first conditionalContent</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second conditionalContent</label>
    </booleanInput>
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent assignNames="a" hide="$h1">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pb">b: <conditionalContent assignNames="b" hide="$h2">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pa1">a1: <copy source="a" assignNames="(a1)" /></p>
    <p name="pb1">b1: <copy source="b" assignNames="(b1)" /></p>
    `,
        });

        async function check_items(item: string, hidden: string[]) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables[`/pa`].stateValues.text).eq(
                `a: ${hidden.includes("a") ? "" : item}`,
            );
            expect(stateVariables[`/pa1`].stateValues.text).eq(`a1: ${item}`);
            expect(stateVariables[`/pb`].stateValues.text).eq(
                `b: ${hidden.includes("b") ? "" : item}`,
            );
            expect(stateVariables[`/pb1`].stateValues.text).eq(`b1: ${item}`);
        }

        await check_items("mouse", ["b"]);

        // enter 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items("cat", ["b"]);

        await updateBooleanInputValue({
            boolean: true,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/h2",
            core,
        });
        await check_items("cat", ["a"]);

        // enter -3
        await updateMathInputValue({ latex: "-3", name: "/n", core });
        await check_items("dog", ["a"]);

        await updateBooleanInputValue({
            boolean: false,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/h2",
            core,
        });

        await check_items("dog", ["b"]);
    });

    it("string and blank strings in case and else", async () => {
        let core = await createTestCore({
            doenetML: `
  <setup>
    <text name="animal1">fox</text><text name="verb1">jumps</text>
    <text name="animal2">elephant</text><text name="verb2">trumpets</text>
  </setup>

  <mathInput name="n" />
  <p name="pa">a: <conditionalContent name="cc" assignNames="a">
    <case condition="$n > 0">The $animal1 $verb1.</case>
    <else>The $animal2 $verb2.</else>
  </conditionalContent></p>

  <p name="pa1">a1: $a{assignNames="a11 a12 a13 a14"}</p>

  <p name="pPieces" >pieces: <conditionalContent copySource="cc" assignNames="(b c d e)" /></p>

  <p name="pb1">b1: $b{name="b1"}</p>
  <p name="pc1">c1: $c{name="c1"}</p>
  <p name="pd1">d1: $d{name="d1"}</p>
  <p name="pe1">e1: $e{name="e1"}</p>

  `,
        });

        async function check_items(animal: string, verb: string) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/pa"].stateValues.text).eq(
                `a: The ${animal} ${verb}.`,
            );
            expect(stateVariables["/pa1"].stateValues.text).eq(
                `a1: The ${animal} ${verb}.`,
            );
            expect(stateVariables["/pPieces"].stateValues.text).eq(
                `pieces: The ${animal} ${verb}.`,
            );

            expect(stateVariables["/pb1"].stateValues.text).eq("b1: ");
            expect(stateVariables["/pc1"].stateValues.text).eq(`c1: ${animal}`);
            expect(stateVariables["/pd1"].stateValues.text).eq(`d1: ${verb}`);
            expect(stateVariables["/pe1"].stateValues.text).eq("e1: ");

            expect(stateVariables["/a11"]).eq(undefined);
            expect(stateVariables["/a12"].stateValues.text).eq(animal);
            expect(stateVariables["/a13"].stateValues.text).eq(verb);
            expect(stateVariables["/a14"]).eq(undefined);

            expect(stateVariables["/b1"]).eq(undefined);
            expect(stateVariables["/c1"].stateValues.text).eq(animal);
            expect(stateVariables["/d1"].stateValues.text).eq(verb);
            expect(stateVariables["/e1"]).eq(undefined);
        }

        await check_items("elephant", "trumpets");

        // enter 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items("fox", "jumps");

        // enter 0
        await updateMathInputValue({ latex: "0", name: "/n", core });
        await check_items("elephant", "trumpets");
    });

    it("copy with invalid source gets expanded", async () => {
        let core = await createTestCore({
            doenetML: `
<section name="s">
  <mathInput name="n" />
  before
  <conditionalContent assignNames='a' name="cc">
    <case condition="$n=1" newNamespace>nothing: $nada</case>
  </conditionalContent>
  after
</section>
  `,
        });

        await updateMathInputValue({ latex: "1", name: "/n", core });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/s"].activeChildren).eqls([
            "\n  ",
            { componentName: "/n", componentType: "mathInput" },
            "\n  before\n  ",
            "nothing: ",
            "\n  after\n",
        ]);
    });

    it("use original names if no assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" />

  <conditionalContent condition="$n > 0">
    <p name="p1">We have a <text name="winner1">first winner</text>!</p>
  </conditionalContent>
  
  <conditionalContent>
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
            const stateVariables = await returnAllStateVariables(core);

            if (num_winners > 0) {
                expect(stateVariables["/winner1"].stateValues.text).eq(
                    "first winner",
                );
                expect(stateVariables["/p1"].stateValues.text).eq(
                    "We have a first winner!",
                );
            } else {
                expect(
                    stateVariables["/winner1"] === undefined ||
                        stateVariables["/winner1"].stateValues
                            .isInactiveCompositeReplacement,
                ).eq(true);
                expect(
                    stateVariables["/p1"] === undefined ||
                        stateVariables["/p1"].stateValues
                            .isInactiveCompositeReplacement,
                ).eq(true);
            }

            if (num_winners === 1) {
                expect(stateVariables["/winner1b"].stateValues.text).eq(
                    "first winner",
                );
                expect(stateVariables["/p2"].stateValues.text).eq(
                    "Just emphasizing that we have that first winner!",
                );
            } else {
                expect(stateVariables["/winner1b"]).eq(undefined);
                expect(stateVariables["/p2"]).eq(undefined);
            }

            if (num_winners === 2) {
                expect(stateVariables["/winner2"].stateValues.text).eq(
                    "second winner",
                );
                expect(stateVariables["/p3"].stateValues.text).eq(
                    "We have a second winner!",
                );
            } else {
                expect(stateVariables["/winner2"]).eq(undefined);
                expect(stateVariables["/p3"]).eq(undefined);
            }

            if (num_winners > 2) {
                expect(stateVariables["/winner3"].stateValues.text).eq(
                    "third winner",
                );
                expect(stateVariables["/p4"].stateValues.text).eq(
                    "We have a third winner!",
                );
            } else {
                expect(stateVariables["/winner3"]).eq(undefined);
                expect(stateVariables["/p4"]).eq(undefined);
            }

            if (num_winners === 0) {
                expect(stateVariables["/winner0"].stateValues.text).eq(
                    "no winner",
                );
                expect(stateVariables["/p5"].stateValues.text).eq(
                    "We have no winner.",
                );
            } else {
                expect(stateVariables["/winner0"]).eq(undefined);
                expect(stateVariables["/p5"]).eq(undefined);
            }
        }

        await check_items(0);

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items(1);

        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(2);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items(3);

        await updateMathInputValue({ latex: "x", name: "/n", core });
        await check_items(0);
    });

    it("primitive replacements removed from text when conditional content is hidden", async () => {
        let core = await createTestCore({
            doenetML: `
<booleanInput name="h">true</booleanInput>

<p name="p">We have <conditionalContent hide="$h" condition="true">apples, </conditionalContent>bananas, <conditionalContent condition="true" hide="!$h">pineapples, </conditionalContent>and mangos.</p>

<text name="text" copySource="p.text" />
  `,
        });

        async function check_items(h: boolean) {
            const stateVariables = await returnAllStateVariables(core);

            let phrase = h
                ? "We have bananas, pineapples, and mangos."
                : "We have apples, bananas, and mangos.";

            expect(stateVariables["/p"].stateValues.text).eq(phrase);
            expect(stateVariables["/text"].stateValues.text).eq(phrase);
        }

        await check_items(true);

        await updateBooleanInputValue({
            boolean: false,
            name: "/h",
            core,
        });
        await check_items(false);

        await updateBooleanInputValue({
            boolean: true,
            name: "/h",
            core,
        });
        await check_items(true);
    });
});
