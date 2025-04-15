import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { numberToLetters } from "@doenet/utils";
import { updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("sequence and map assign name tests", async () => {
    async function test_dynamic_copied_sequence(
        core: PublicDoenetMLCore,
        check_items: (arg: number) => Promise<void>,
    ) {
        let n = 1;
        await check_items(n);

        // change n to 2
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n back to 1
        n = 1;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n back to 2
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 3
        n = 3;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n back to 1 again
        n = 1;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 5
        n = 5;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 4
        n = 4;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 10
        n = 10;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n back to 2 again
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 0
        n = 0;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n back to 4
        n = 4;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);
    }

    it("assignNames to dynamic copied sequence", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <p name="s1"><asList>
  <sequence name="sequence1" assignNames="a b" type="letters" length="$n" />
  </asList></p>

  <p name="pa">a: $a{name="cpa"}</p>
  <p name="pb">b: $b{name="cpb"}</p>

  <p name="s2"><asList>
  <sequence name="cpAll" copySource="sequence1" assignNames="a1 b1 c1" />
  </asList></p>
  <p name="pa1">a1: $a1{name="cpa1"}</p>
  <p name="pb1">b1: $b1{name="cpb1"}</p>
  <p name="pc1">c1: $c1{name="cpc1"}</p>

  <p name="s3"><asList>
  <sequence name="cpAll2" copySource="cpAll" assignNames="a2 b2 c2 d2 e2" />
  </asList></p>
  <p name="pa2">a2: $a2{name="cpa2"}</p>
  <p name="pb2">b2: $b2{name="cpb2"}</p>
  <p name="pc2">c2: $c2{name="cpc2"}</p>
  <p name="pd2">d2: $d2{name="cpd2"}</p>
  <p name="pe2">e2: $e2{name="cpe2"}</p>

  <p name="s4"><asList>
  <sequence name="cpAll3" copySource="cpAll2" assignNames="a3 b3 c3 d3" />
  </asList></p>
  <p name="pa3">a3: $a3{name="cpa3"}</p>
  <p name="pb3">b3: $b3{name="cpb3"}</p>
  <p name="pc3">c3: $c3{name="cpc3"}</p>
  <p name="pd3">d3: $d3{name="cpd3"}</p>
  `,
        });

        async function check_items(n: number) {
            let allLetters = [...Array(n).keys()]
                .map((v) => numberToLetters(v + 1, true))
                .join(", ");

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/s1"].stateValues.text).eq(allLetters);
            expect(stateVariables["/s2"].stateValues.text).eq(allLetters);
            expect(stateVariables["/s3"].stateValues.text).eq(allLetters);
            expect(stateVariables["/s4"].stateValues.text).eq(allLetters);

            for (let name of ["/a", "/a1", "/a2", "/a3"]) {
                if (n >= 1) {
                    expect(stateVariables[name].stateValues.value).eq("a");
                } else {
                    expect(
                        stateVariables[name] === undefined ||
                            stateVariables[name].stateValues
                                .isInactiveCompositeReplacement,
                    ).eq(true);
                }
            }
            let aText = n >= 1 ? "a" : "";
            for (let suffix of ["", "1", "2", "3"]) {
                expect(stateVariables[`/pa${suffix}`].stateValues.text).eq(
                    `a${suffix}: ${aText}`,
                );
            }

            for (let name of ["/b", "/b1", "/b2", "/b3"]) {
                if (n >= 2) {
                    expect(stateVariables[name].stateValues.value).eq("b");
                } else {
                    expect(
                        stateVariables[name] === undefined ||
                            stateVariables[name].stateValues
                                .isInactiveCompositeReplacement,
                    ).eq(true);
                }
            }
            let bText = n >= 2 ? "b" : "";
            for (let suffix of ["", "1", "2", "3"]) {
                expect(stateVariables[`/pb${suffix}`].stateValues.text).eq(
                    `b${suffix}: ${bText}`,
                );
            }

            for (let name of ["/c1", "/c2", "/c3"]) {
                if (n >= 3) {
                    expect(stateVariables[name].stateValues.value).eq("c");
                } else {
                    expect(
                        stateVariables[name] === undefined ||
                            stateVariables[name].stateValues
                                .isInactiveCompositeReplacement,
                    ).eq(true);
                }
            }
            let cText = n >= 3 ? "c" : "";
            for (let suffix of ["1", "2", "3"]) {
                expect(stateVariables[`/pc${suffix}`].stateValues.text).eq(
                    `c${suffix}: ${cText}`,
                );
            }
            for (let name of ["/d2", "/d3"]) {
                if (n >= 4) {
                    expect(stateVariables[name].stateValues.value).eq("d");
                } else {
                    expect(
                        stateVariables[name] === undefined ||
                            stateVariables[name].stateValues
                                .isInactiveCompositeReplacement,
                    ).eq(true);
                }
            }
            let dText = n >= 4 ? "d" : "";
            for (let suffix of ["2", "3"]) {
                expect(stateVariables[`/pd${suffix}`].stateValues.text).eq(
                    `d${suffix}: ${dText}`,
                );
            }

            if (n >= 5) {
                expect(stateVariables["/e2"].stateValues.value).eq("e");
            } else {
                expect(
                    stateVariables["/e2"] === undefined ||
                        stateVariables["/e2"].stateValues
                            .isInactiveCompositeReplacement,
                ).eq(true);
            }
            expect(stateVariables[`/pe2`].stateValues.text).eq(
                `e2: ${n >= 5 ? "e" : ""}`,
            );
        }
        await test_dynamic_copied_sequence(core, check_items);
    });

    it("assignNames to dynamic copied map of sequence", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <p name="m1"><map name="map1" assignNames="a b" asList="false">
    <template newNamespace>Letter $i{name="n"} is $l{name="v"}. </template>
    <sources alias="l" indexAlias="i">
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>

  <p name="pa">a: $a{name="cpa"}</p>
  <p name="pb">b: $b{name="cpb"}</p>

  <p name="pan">a/n: $(a/n{name="cpan"})</p>
  <p name="pbn">b/n: $(b/n{name="cpbn"})</p>

  <p name="pav">a/v: $(a/v{name="cpav"})</p>
  <p name="pbv">b/v: $(b/v{name="cpbv"})</p>


  <p name="m2"><map name="cpAll" copySource="map1" assignNames="a1 b1 c1" /></p>
  <p name="pa1">a1: $a1{name="cpa1"}</p>
  <p name="pb1">b1: $b1{name="cpb1"}</p>
  <p name="pc1">c1: $c1{name="cpc1"}</p>

  <p name="pan1">a1/n: $(a1/n{name="cpan1"})</p>
  <p name="pbn1">b1/n: $(b1/n{name="cpbn1"})</p>
  <p name="pcn1">c1/n: $(c1/n{name="cpcn1"})</p>

  <p name="pav1">a1/v: $(a1/v{name="cpav1"})</p>
  <p name="pbv1">b1/v: $(b1/v{name="cpbv1"})</p>
  <p name="pcv1">c1/v: $(c1/v{name="cpcv1"})</p>


  <p name="m3"><map name="cpAll2" copySource="cpAll" assignNames="a2 b2 c2 d2 e2" /></p>
  <p name="pa2">a2: $a2{name="cpa2"}</p>
  <p name="pb2">b2: $b2{name="cpb2"}</p>
  <p name="pc2">c2: $c2{name="cpc2"}</p>
  <p name="pd2">d2: $d2{name="cpd2"}</p>
  <p name="pe2">e2: $e2{name="cpe2"}</p>
  
  <p name="pan2">a2/n: $(a2/n{name="cpan2"})</p>
  <p name="pbn2">b2/n: $(b2/n{name="cpbn2"})</p>
  <p name="pcn2">c2/n: $(c2/n{name="cpcn2"})</p>
  <p name="pdn2">d2/n: $(d2/n{name="cpdn2"})</p>
  <p name="pen2">e2/n: $(e2/n{name="cpen2"})</p>

  <p name="pav2">a2/v: $(a2/v{name="cpav2"})</p>
  <p name="pbv2">b2/v: $(b2/v{name="cpbv2"})</p>
  <p name="pcv2">c2/v: $(c2/v{name="cpcv2"})</p>
  <p name="pdv2">d2/v: $(d2/v{name="cpdv2"})</p>
  <p name="pev2">e2/v: $(e2/v{name="cpev2"})</p>


  <p name="m4"><map name="cpAll3" copySource="cpAll2" assignNames="a3 b3 c3 d3" /></p>
  <p name="pa3">a3: $a3{name="cpa3"}</p>
  <p name="pb3">b3: $b3{name="cpb3"}</p>
  <p name="pc3">c3: $c3{name="cpc3"}</p>
  <p name="pd3">d3: $d3{name="cpd3"}</p>

  <p name="pan3">a3/n: $(a3/n{name="cpan3"})</p>
  <p name="pbn3">b3/n: $(b3/n{name="cpbn3"})</p>
  <p name="pcn3">c3/n: $(c3/n{name="cpcn3"})</p>
  <p name="pdn3">d3/n: $(d3/n{name="cpdn3"})</p>

  <p name="pav3">a3/v: $(a3/v{name="cpav3"})</p>
  <p name="pbv3">b3/v: $(b3/v{name="cpbv3"})</p>
  <p name="pcv3">c3/v: $(c3/v{name="cpcv3"})</p>
  <p name="pdv3">d3/v: $(d3/v{name="cpdv3"})</p>
  `,
        });

        async function check_items(n: number) {
            let letterPhrases = [...Array(n).keys()].map(
                (i) => `Letter ${i + 1} is ${numberToLetters(i + 1, true)}. `,
            );

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let name of ["/m1", "/m2", "/m3", "/m4"]) {
                expect(stateVariables[name].stateValues.text).eq(
                    letterPhrases.join(""),
                );
            }

            for (let letterInd = 0; letterInd < 5; letterInd++) {
                let letter = numberToLetters(letterInd + 1, true);

                let suffixes = ["", "1", "2", "3"];
                if (letter === "c") {
                    suffixes = suffixes.slice(1);
                } else if (letter === "d") {
                    suffixes = suffixes.slice(2);
                } else if (letter === "e") {
                    suffixes = ["2"];
                }

                let indText = "";
                let letterText = "";
                if (n >= letterInd + 1) {
                    indText = `${letterInd + 1}`;
                    letterText = letter;
                }

                for (let suffix of suffixes) {
                    expect(
                        stateVariables[`/p${letter}${suffix}`].stateValues.text,
                    ).eq(
                        `${letter}${suffix}: ${letterPhrases[letterInd] || ""}`,
                    );

                    expect(
                        stateVariables[`/p${letter}n${suffix}`].stateValues
                            .text,
                    ).eq(`${letter}${suffix}/n: ${indText}`);
                    expect(
                        stateVariables[`/p${letter}v${suffix}`].stateValues
                            .text,
                    ).eq(`${letter}${suffix}/v: ${letterText}`);
                }
            }
        }

        await test_dynamic_copied_sequence(core, check_items);
    });

    it("copy alias and index alias with names", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <p name="m1"><map name="map1" assignNames="a b" asList="false">
    <template newNamespace>Letter $i{name="n1"} is $m{name="v1"}. </template>
    <sources alias="m" indexAlias="i">
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>


  <p name="pa">a: $a{name="cpa"}</p>
  <p name="pb">b: $b{name="cpb"}</p>

  <p name="pan1">a/n1: $(a/n1{name="cpan1"})</p>
  <p name="pbn1">b/n1: $(b/n1{name="cpbn1"})</p>

  <p name="pav1">a/v1: $(a/v1{name="cpav1"})</p>
  <p name="pbv1">b/v1: $(b/v1{name="cpbv1"})</p>


  <p name="m2">$map1{name="cpAll" assignNames="a1 b1 c1"}</p>
  <p name="pa1">a1: $a1{name="cpa1"}</p>
  <p name="pb1">b1: $b1{name="cpb1"}</p>
  <p name="pc1">c1: $c1{name="cpc1"}</p>

  <p name="pan11">a1/n1: $(a1/n1{name="cpan11"})</p>
  <p name="pbn11">b1/n1: $(b1/n1{name="cpbn11"})</p>
  <p name="pcn11">c1/n1: $(c1/n1{name="cpcn11"})</p>

  <p name="pav11">a1/v1: $(a1/v1{name="cpav11"})</p>
  <p name="pbv11">b1/v1: $(b1/v1{name="cpbv11"})</p>
  <p name="pcv11">c1/v1: $(c1/v1{name="cpcv11"})</p>
  `,
        });

        async function check_items(n: number) {
            let letterPhrases = [...Array(n).keys()].map(
                (i) => `Letter ${i + 1} is ${numberToLetters(i + 1, true)}. `,
            );

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/m1"].stateValues.text).eq(
                letterPhrases.join(""),
            );
            expect(stateVariables["/m2"].stateValues.text).eq(
                letterPhrases.join(""),
            );

            for (let letterInd = 0; letterInd < 3; letterInd++) {
                let letter = numberToLetters(letterInd + 1, true);

                let indText = "";
                let letterText = "";
                if (n >= letterInd + 1) {
                    indText = `${letterInd + 1}`;
                    letterText = letter;
                }

                if (letterInd < 2) {
                    expect(stateVariables[`/p${letter}`].stateValues.text).eq(
                        `${letter}: ${letterPhrases[letterInd] || ""}`,
                    );
                    expect(stateVariables[`/p${letter}n1`].stateValues.text).eq(
                        `${letter}/n1: ${indText}`,
                    );
                    expect(stateVariables[`/p${letter}v1`].stateValues.text).eq(
                        `${letter}/v1: ${letterText}`,
                    );
                }
                expect(stateVariables[`/p${letter}1`].stateValues.text).eq(
                    `${letter}1: ${letterPhrases[letterInd] || ""}`,
                );

                expect(stateVariables[`/p${letter}n11`].stateValues.text).eq(
                    `${letter}1/n1: ${indText}`,
                );
                expect(stateVariables[`/p${letter}v11`].stateValues.text).eq(
                    `${letter}1/v1: ${letterText}`,
                );
            }
        }

        let n = 1;
        await check_items(n);

        // change n to 2
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 0
        n = 0;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 3
        n = 3;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 5
        n = 5;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);
    });

    async function test_copy_alias_index(core: PublicDoenetMLCore) {
        async function check_items(n: number) {
            let letterPhrases = [...Array(n).keys()].map(
                (i) =>
                    `Letter ${i + 1} is ${numberToLetters(i + 1, true)}. Repeat: letter ${i + 1} is ${numberToLetters(i + 1, true)}. `,
            );

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/m1"].stateValues.text).eq(
                letterPhrases.join(""),
            );
            expect(stateVariables["/m2"].stateValues.text).eq(
                letterPhrases.join(""),
            );
        }

        let n = 1;
        await check_items(n);

        // change n to 2
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 0
        n = 0;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);

        // change n to 3
        n = 3;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(n);
    }

    it("copy alias and index alias with names, no new template namespace", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <p name="m1"><map name="map1" asList="false">
    <template>Letter $i{name="n1"} is $m{name="v1"}. Repeat: letter $n1 is $v1. </template>
    <sources alias='m' indexAlias='i'>
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>

  <p name="m2">$map1{name="cpAll"}</p>
  `,
        });

        await test_copy_alias_index(core);
    });

    it("copy source and index assign names, no new template namespace, inside namespace", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  <p name="m1" newNamespace><map asList="false">
    <template>Letter $i{name="n1"} is $m{name="v1"}. Repeat: letter $n1 is $v1. </template>
    <sources alias="m" indexAlias="i">
      <sequence type="letters" length="$(../n)" />
   </sources>
  </map></p>

  <p name="m2">$(m1/_map1{name="cpAll"})</p>
  `,
        });

        await test_copy_alias_index(core);
    });
});
