import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Select tag tests", async () => {
    async function test_values_separately({
        doenetML,
        componentNames,
        selectName,
        valid_values,
        num_samples,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        componentNames: string[];
        selectName?: string;
        valid_values: any[][];
        num_samples: number;
        must_be_distinct?: boolean;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const s = stateVariables[selectName ?? ""];
            for (let [ind, name] of componentNames.entries()) {
                let value = name
                    ? stateVariables[name].stateValues.value
                    : stateVariables[
                          stateVariables[s.replacements![ind].componentName]
                              .replacements![0].componentName
                      ].stateValues.value;
                expect(
                    is_math
                        ? valid_values[ind].some((v) => v.equals(value))
                        : valid_values[ind].includes(value),
                ).eq(true, `Expected ${value} to be in ${valid_values[ind]}`);
            }

            if (must_be_distinct) {
                for (let name1 of componentNames) {
                    let val1 = stateVariables[name1].stateValues.value;
                    for (let name2 of componentNames) {
                        if (name2 !== name1) {
                            let val2 = stateVariables[name2].stateValues.value;
                            if (is_math) {
                                expect(val2.equals(val1)).eq(false);
                            } else {
                                expect(val2).not.eq(val1);
                            }
                        }
                    }
                }
            }
        }
    }

    async function test_combined_values({
        doenetML,
        componentNames,
        valid_combinations,
        num_samples,
        is_math = false,
    }: {
        doenetML: string;
        componentNames: string[];
        valid_combinations: any[][];
        num_samples: number;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let values = componentNames.map(
                (name) => stateVariables[name].stateValues.value,
            );

            expect(
                valid_combinations.some((comb) =>
                    comb.every((v, i) =>
                        is_math ? v.equals(values[i]) : v === values[i],
                    ),
                ),
            ).eq(
                true,
                `Expected (${values}) to be in ${valid_combinations.map((comb) => `(${comb})`)}`,
            );
        }
    }

    it("no parameters, select doesn't do anything", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><select/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p"].activeChildren.length).eq(0);
    });

    it("select single math", async () => {
        const doenetML = `
    <select assignNames="(res)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>`;
        const valid_values = [
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
        ];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
            is_math: true,
        });
    });

    it("select multiple maths", async () => {
        const doenetML = `
    <select assignNames="(res1) (res2) (res3)" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>`;

        const vals = [
            me.fromText("u"),
            me.fromText("v"),
            me.fromText("w"),
            me.fromText("x"),
            me.fromText("y"),
            me.fromText("z"),
        ];
        const valid_values = Array(3).fill(vals);
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select multiple maths, initially unresolved", async () => {
        const doenetML = `
    <select assignNames="(res1) (res2) (res3)" numToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>

    $n3{name="n2"}
    $num1{name="n"}
    <math name="num1" simplify>$n2+$num2</math>
    <math name="num2" simplify>$n3+$num3</math>
    $num3{name="n3"}
    <number name="num3">1</number>`;
        const valid_values = [
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select multiple maths with namespace", async () => {
        const doenetML = `
    <select name="s" assignNames="(res1) (res2) (res3)" numToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>`;
        const vals = [
            me.fromText("u"),
            me.fromText("v"),
            me.fromText("w"),
            me.fromText("x"),
            me.fromText("y"),
            me.fromText("z"),
        ];
        const valid_values = Array(3).fill(vals);
        const componentNames = ["/s/res1", "/s/res2", "/s/res3"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select multiple maths, with replacement", async () => {
        const doenetML = `
    <select name="s" assignNames="(res1) (res2) (res3)" numToSelect="5" withReplacement>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>`;
        const vals = [
            me.fromText("u"),
            me.fromText("v"),
            me.fromText("w"),
            me.fromText("x"),
            me.fromText("y"),
            me.fromText("z"),
        ];
        const valid_values = Array(5).fill(vals);
        const componentNames = ["/res1", "/res2", "/res3", "", ""];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            selectName: "/s",
            num_samples: 10,
            is_math: true,
        });
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><select name="s" assignNames="u v w x y" numToSelect="5" type="number">175 176 177 178 179 180 181</select></p>
    <p name="p2"><select copySource="s" name="s2" asList="false" /></p>

    `,
        });

        let results: number[] = [];

        let stateVariables = await core.returnAllStateVariables(false, true);

        results.push(stateVariables["/u"].stateValues.value);
        results.push(stateVariables["/v"].stateValues.value);
        results.push(stateVariables["/w"].stateValues.value);
        results.push(stateVariables["/x"].stateValues.value);
        results.push(stateVariables["/y"].stateValues.value);

        for (let num of results) {
            expect([175, 176, 177, 178, 179, 180, 181].includes(num)).eq(true);
        }
        expect(stateVariables["/p1"].stateValues.text).eq(results.join(", "));
        expect(stateVariables["/p2"].stateValues.text).eq(results.join(""));
    });

    it("copies don't resample", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">
    <select name="sample1" assignNames="n1" type="number">1 2 3 4 5 6 7</select>
    <select name="sample2" assignNames="n2" type="number">1 2 3 4 5 6 7</select>
    </p>

    <p>
    $sample1{name="noresample1"}
    $sample2{name="noresample2"}
    $noresample1{name="noreresample1"}
    $noresample2{name="noreresample2"}
    </p>

    <p copySource="p1" name="noresamplep"/>

    <p copySource="noresamplep" name="noreresamplep"/>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let num1 = stateVariables["/n1"].stateValues.value;
        let num2 = stateVariables["/n2"].stateValues.value;
        expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 7).eq(true);
        expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 7).eq(true);
        expect(
            stateVariables[
                stateVariables[
                    stateVariables["/noresample1"].replacements![0]
                        .componentName
                ].replacements![0].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[
                    stateVariables["/noresample2"].replacements![0]
                        .componentName
                ].replacements![0].componentName
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables[
                    stateVariables["/noreresample1"].replacements![0]
                        .componentName
                ].replacements![0].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[
                    stateVariables["/noreresample2"].replacements![0]
                        .componentName
                ].replacements![0].componentName
            ].stateValues.value,
        ).eq(num2);

        expect(
            stateVariables[
                stateVariables["/noresamplep"].activeChildren[1].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noresamplep"].activeChildren[3].componentName
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables["/noreresamplep"].activeChildren[1].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noreresamplep"].activeChildren[3].componentName
            ].stateValues.value,
        ).eq(num2);
    });

    it("select doesn't change dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="5" name="numToSelect"/>
    <mathInput prefill="a" name="x"/>
    <mathInput prefill="b" name="y"/>
    <mathInput prefill="c" name="z"/>
    <p>
    <select name="sample1" withReplacement numToSelect="$numToSelect">
        <option>$x</option>
        <option>$y</option>
        <option>$z</option>
    </select>
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let sampleReplacements = stateVariables["/sample1"].replacements!;
        expect(sampleReplacements.length).eq(5);

        let sampleMaths = sampleReplacements.map(
            (x) =>
                stateVariables[
                    stateVariables[
                        stateVariables[x.componentName].replacements![0]
                            .componentName
                    ].replacements![0].componentName
                ].stateValues.value.tree,
        );

        for (let val of sampleMaths) {
            expect(["a", "b", "c"].includes(val)).eq(true);
        }

        // Nothing changes when change number to select
        await updateMathInputValue({
            latex: "7",
            name: "/numToSelect",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sampleReplacements = stateVariables["/sample1"].replacements!;

        expect(
            sampleReplacements.map(
                (x) =>
                    stateVariables[
                        stateVariables[
                            stateVariables[x.componentName].replacements![0]
                                .componentName
                        ].replacements![0].componentName
                    ].stateValues.value.tree,
            ),
        ).eqls(sampleMaths);

        // Values change to reflect copy sources

        let newValues = {
            a: "q",
            b: "r",
            c: "s",
        };
        await updateMathInputValue({
            latex: newValues.a,
            name: "/x",
            core,
        });
        await updateMathInputValue({
            latex: newValues.b,
            name: "/y",
            core,
        });
        await updateMathInputValue({
            latex: newValues.c,
            name: "/z",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sampleReplacements = stateVariables["/sample1"].replacements!;

        let sampleMaths2 = sampleReplacements.map(
            (x) =>
                stateVariables[
                    stateVariables[
                        stateVariables[x.componentName].replacements![0]
                            .componentName
                    ].replacements![0].componentName
                ].stateValues.value.tree,
        );

        expect(sampleMaths2).eqls(sampleMaths.map((x) => newValues[x]));
    });

    it("select doesn't resample in dynamic map", async () => {
        let core = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <p name="p1"><map assignNames="a b c d e f" name="map1">
      <template newNamespace><select assignNames="n" type="number">1 2 3 4 5 6 7 8 9 10 11 12</select></template>
      <sources>
          <sequence length="$mi1" />
      </sources>
    </map></p>
    
    <p name="p2">$map1</p>

    $p1{name="p3"}
    $p2{name="p4"}

    $p3{name="p5"}
    $p4{name="p6"}
    `,
        });

        async function check_sampled_numbers(sampledNumbers: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables["/p1"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p2"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p3"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p4"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p5"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p6"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);
        }

        let sampledNumbers: number[] = [];

        // initially nothing
        await check_sampled_numbers([]);

        // sample one variable
        await updateMathInputValue({ latex: "1", name: "/mi1", core });

        let stateVariables = await core.returnAllStateVariables(false, true);
        sampledNumbers.push(stateVariables["/a/n"].stateValues.value);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get same number back
        await updateMathInputValue({ latex: "1", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);

        // get two more samples
        await updateMathInputValue({ latex: "3", name: "/mi1", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        let n1 = stateVariables["/a/n"].stateValues.value;
        let n2 = stateVariables["/b/n"].stateValues.value;
        let n3 = stateVariables["/c/n"].stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        sampledNumbers.push(n2);
        sampledNumbers.push(n3);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get first two numbers back
        await updateMathInputValue({ latex: "2", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers.slice(0, 2));

        // get six total samples
        await updateMathInputValue({ latex: "6", name: "/mi1", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        n1 = stateVariables["/a/n"].stateValues.value;
        n2 = stateVariables["/b/n"].stateValues.value;
        n3 = stateVariables["/c/n"].stateValues.value;
        let n4 = stateVariables["/d/n"].stateValues.value;
        let n5 = stateVariables["/e/n"].stateValues.value;
        let n6 = stateVariables["/f/n"].stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        expect(n2).eq(sampledNumbers[1]);
        expect(n3).eq(sampledNumbers[2]);
        sampledNumbers.push(n4);
        sampledNumbers.push(n5);
        sampledNumbers.push(n6);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get all six back
        await updateMathInputValue({ latex: "6", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);
    });

    it("select single group of maths, assign names to grandchildren", async () => {
        const doenetML = `
    <select assignNames="(res1 res2 res3)">
        <option><math>u</math><math>v</math><math>w</math></option>
        <option><math>x</math><math>y</math><math>z</math></option>
        <option><math>a</math><math>b</math><math>c</math></option>
        <option><math>q</math><math>r</math><math>s</math></option>
    </select>`;

        const valid_combinations = [
            ["x", "y", "z"].map((x) => me.fromText(x)),
            ["u", "v", "w"].map((x) => me.fromText(x)),
            ["a", "b", "c"].map((x) => me.fromText(x)),
            ["q", "r", "s"].map((x) => me.fromText(x)),
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 5,
            is_math: true,
        });
    });

    it("select single group of maths, assign names with namespace to grandchildren", async () => {
        const doenetML = `
    <select assignNames="(res1 res2 res3)" name="s" newNamespace>
        <option><math>u</math><math>v</math><math>w</math></option>
        <option><math>x</math><math>y</math><math>z</math></option>
        <option><math>a</math><math>b</math><math>c</math></option>
        <option><math>q</math><math>r</math><math>s</math></option>
    </select>`;

        const valid_combinations = [
            ["x", "y", "z"].map((x) => me.fromText(x)),
            ["u", "v", "w"].map((x) => me.fromText(x)),
            ["a", "b", "c"].map((x) => me.fromText(x)),
            ["q", "r", "s"].map((x) => me.fromText(x)),
        ];
        const componentNames = ["/s/res1", "/s/res2", "/s/res3"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 5,
            is_math: true,
        });
    });

    it("select multiple group of maths, assign names to grandchildren", async () => {
        const doenetML = `
    <select assignNames="(x1 y1 z1) (x2 y2 z2) (x3 y3 z3)" numToSelect="3">
        <option><math>u</math><math>v</math><math>w</math></option>
        <option><math>x</math><math>y</math><math>z</math></option>
        <option><math>a</math><math>b</math><math>c</math></option>
        <option><math>q</math><math>r</math><math>s</math></option>
    </select>`;

        const valid_combinations = [
            ["x", "y", "z"].map((x) => me.fromText(x)),
            ["u", "v", "w"].map((x) => me.fromText(x)),
            ["a", "b", "c"].map((x) => me.fromText(x)),
            ["q", "r", "s"].map((x) => me.fromText(x)),
        ];

        const allNames = [
            ["/x1", "/y1", "/z1"],
            ["/x2", "/y2", "/z2"],
            ["/x3", "/y3", "/z3"],
        ];

        for (let componentNames of allNames) {
            await test_combined_values({
                doenetML,
                valid_combinations,
                componentNames,
                num_samples: 4,
                is_math: true,
            });
        }
    });

    it("references to outside components", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select assignnames="q r s t u" numToSelect="5" withreplacement>
      <option newNamespace><p>Option 1: <math>3$(../x1)$(../y1)</math></p></option>
      <option><p name="h" newnamespace>Option 2: <math>4$(../x2)$(../y2)</math></p></option>
      <option newNamespace><p name="l">Option 3: <math>5$(../x3)$(../y3)</math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

    `,
        });

        let option = {
            "Option 1: ": me.fromText("3xa"),
            "Option 2: ": me.fromText("4yb"),
            "Option 3: ": me.fromText("5zc"),
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        let q2 =
            stateVariables[stateVariables["/q2"].replacements![0].componentName]
                .activeChildren;
        let q2string = q2[0];
        let q2math = me.fromAst(
            stateVariables[q2[1].componentName].stateValues.value,
        );
        expect(q2math.equals(option[q2string])).eq(true);

        let r2 =
            stateVariables[stateVariables["/r2"].replacements![0].componentName]
                .activeChildren;
        let r2string = r2[0];
        let r2math = me.fromAst(
            stateVariables[r2[1].componentName].stateValues.value,
        );
        expect(r2math.equals(option[r2string])).eq(true);

        let s2 =
            stateVariables[stateVariables["/s2"].replacements![0].componentName]
                .activeChildren;
        let s2string = s2[0];
        let s2math = me.fromAst(
            stateVariables[s2[1].componentName].stateValues.value,
        );
        expect(s2math.equals(option[s2string])).eq(true);

        let t2 =
            stateVariables[stateVariables["/t2"].replacements![0].componentName]
                .activeChildren;
        let t2string = t2[0];
        let t2math = me.fromAst(
            stateVariables[t2[1].componentName].stateValues.value,
        );
        expect(t2math.equals(option[t2string])).eq(true);

        let u2 =
            stateVariables[stateVariables["/u2"].replacements![0].componentName]
                .activeChildren;
        let u2string = u2[0];
        let u2math = me.fromAst(
            stateVariables[u2[1].componentName].stateValues.value,
        );
        expect(u2math.equals(option[u2string])).eq(true);
    });

    it("references to outside components, no new namespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select assignnames="q r s t u" numToSelect="5" withreplacement>
      <option><p>Option 1: <math>3$x1$y1</math></p></option>
      <option><p name="h">Option 2: <math>4$x2$y2</math></p></option>
      <option><p name="l">Option 3: <math>5$x3$y3</math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

    `,
        });

        let option = {
            "Option 1: ": me.fromText("3xa"),
            "Option 2: ": me.fromText("4yb"),
            "Option 3: ": me.fromText("5zc"),
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        let q2 =
            stateVariables[stateVariables["/q2"].replacements![0].componentName]
                .activeChildren;
        let q2string = q2[0];
        let q2math = me.fromAst(
            stateVariables[q2[1].componentName].stateValues.value,
        );
        expect(q2math.equals(option[q2string])).eq(true);

        let r2 =
            stateVariables[stateVariables["/r2"].replacements![0].componentName]
                .activeChildren;
        let r2string = r2[0];
        let r2math = me.fromAst(
            stateVariables[r2[1].componentName].stateValues.value,
        );
        expect(r2math.equals(option[r2string])).eq(true);

        let s2 =
            stateVariables[stateVariables["/s2"].replacements![0].componentName]
                .activeChildren;
        let s2string = s2[0];
        let s2math = me.fromAst(
            stateVariables[s2[1].componentName].stateValues.value,
        );
        expect(s2math.equals(option[s2string])).eq(true);

        let t2 =
            stateVariables[stateVariables["/t2"].replacements![0].componentName]
                .activeChildren;
        let t2string = t2[0];
        let t2math = me.fromAst(
            stateVariables[t2[1].componentName].stateValues.value,
        );
        expect(t2math.equals(option[t2string])).eq(true);

        let u2 =
            stateVariables[stateVariables["/u2"].replacements![0].componentName]
                .activeChildren;
        let u2string = u2[0];
        let u2math = me.fromAst(
            stateVariables[u2[1].componentName].stateValues.value,
        );
        expect(u2math.equals(option[u2string])).eq(true);
    });

    it("internal references", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="s1" assignnames="q r s t u" numToSelect="5" withreplacement>
      <option newNamespace><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + $x^2$z1^3</math></p></option>
      <option newNamespace><p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + $x^2$z2^3</math></p></option>
      <option newNamespace><p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + $x^2$z3^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

    <p>Copy x from within selection options</p>
    <p>$(q/x{name="qx"})</p>
    <p>$(r/x{name="rx"})</p>
    <p>$(s/x{name="sx"})</p>
    <p>$(t/x{name="tx"})</p>
    <p>$(u/x{name="ux"})</p>

    <p>Copy select itself</p>
    <section name="repeat">$s1</section>

    `,
        });

        let option = {
            "Option 1: ": me.fromText("3x+a+x^2a^3"),
            "Option 2: ": me.fromText("4y+b+y^2b^3"),
            "Option 3: ": me.fromText("5z+c+z^2c^3"),
        };

        let xoption = {
            "Option 1: ": "x",
            "Option 2: ": "y",
            "Option 3: ": "z",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        let q2 =
            stateVariables[stateVariables["/q2"].replacements![0].componentName]
                .activeChildren;
        let q2string = q2[0];
        let q2math = stateVariables[q2[1].componentName].stateValues.value;
        expect(q2math.equals(option[q2string])).eq(true);
        let qx = stateVariables["/qx"].stateValues.value.tree;
        expect(qx).eq(xoption[q2string]);
        let repeatqmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[0].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatqmath.equals(option[q2string])).eq(true);

        let r2 =
            stateVariables[stateVariables["/r2"].replacements![0].componentName]
                .activeChildren;
        let r2string = r2[0];
        let r2math = stateVariables[r2[1].componentName].stateValues.value;
        expect(r2math.equals(option[r2string])).eq(true);
        let rx = stateVariables["/rx"].stateValues.value.tree;
        expect(rx).eq(xoption[r2string]);
        let repeatrmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[1].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatrmath.equals(option[r2string])).eq(true);

        let s2 =
            stateVariables[stateVariables["/s2"].replacements![0].componentName]
                .activeChildren;
        let s2string = s2[0];
        let s2math = stateVariables[s2[1].componentName].stateValues.value;
        expect(s2math.equals(option[s2string])).eq(true);
        let sx = stateVariables["/sx"].stateValues.value.tree;
        expect(sx).eq(xoption[s2string]);
        let repeatsmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[2].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatsmath.equals(option[s2string])).eq(true);

        let t2 =
            stateVariables[stateVariables["/t2"].replacements![0].componentName]
                .activeChildren;
        let t2string = t2[0];
        let t2math = stateVariables[t2[1].componentName].stateValues.value;
        expect(t2math.equals(option[t2string])).eq(true);
        let tx = stateVariables["/tx"].stateValues.value.tree;
        expect(tx).eq(xoption[t2string]);
        let repeattmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[3].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeattmath.equals(option[t2string])).eq(true);

        let u2 =
            stateVariables[stateVariables["/u2"].replacements![0].componentName]
                .activeChildren;
        let u2string = u2[0];
        let u2math = stateVariables[u2[1].componentName].stateValues.value;
        expect(u2math.equals(option[u2string])).eq(true);
        let ux = stateVariables["/ux"].stateValues.value.tree;
        expect(ux).eq(xoption[u2string]);
        let repeatumath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[4].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatumath.equals(option[u2string])).eq(true);
    });

    it("internal references with no new namespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="s1" assignnames="q r s t u" numToSelect="5" withreplacement>
      <option><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + $x^2$z1^3</math></p></option>
      <option><p>Option 2: <math>4<math name="y">y</math> + <math name="z2">b</math> + $y^2$z2^3</math></p></option>
      <option><p>Option 3: <math>5<math name="z">z</math> + <math name="z3">c</math> + $z^2$z3^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

    <p>Copy select itself</p>
    <section name="repeat">$s1</section>

    `,
        });

        let option = {
            "Option 1: ": me.fromText("3x+a+x^2a^3"),
            "Option 2: ": me.fromText("4y+b+y^2b^3"),
            "Option 3: ": me.fromText("5z+c+z^2c^3"),
        };

        let xoption = {
            "Option 1: ": "x",
            "Option 2: ": "y",
            "Option 3: ": "z",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        let q2 =
            stateVariables[stateVariables["/q2"].replacements![0].componentName]
                .activeChildren;
        let q2string = q2[0];
        let q2math = stateVariables[q2[1].componentName].stateValues.value;
        expect(q2math.equals(option[q2string])).eq(true);
        let repeatqmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[0].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatqmath.equals(option[q2string])).eq(true);

        let r2 =
            stateVariables[stateVariables["/r2"].replacements![0].componentName]
                .activeChildren;
        let r2string = r2[0];
        let r2math = stateVariables[r2[1].componentName].stateValues.value;
        expect(r2math.equals(option[r2string])).eq(true);
        let repeatrmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[1].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatrmath.equals(option[r2string])).eq(true);

        let s2 =
            stateVariables[stateVariables["/s2"].replacements![0].componentName]
                .activeChildren;
        let s2string = s2[0];
        let s2math = stateVariables[s2[1].componentName].stateValues.value;
        expect(s2math.equals(option[s2string])).eq(true);
        let repeatsmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[2].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatsmath.equals(option[s2string])).eq(true);

        let t2 =
            stateVariables[stateVariables["/t2"].replacements![0].componentName]
                .activeChildren;
        let t2string = t2[0];
        let t2math = stateVariables[t2[1].componentName].stateValues.value;
        expect(t2math.equals(option[t2string])).eq(true);
        let repeattmath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[3].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeattmath.equals(option[t2string])).eq(true);

        let u2 =
            stateVariables[stateVariables["/u2"].replacements![0].componentName]
                .activeChildren;
        let u2string = u2[0];
        let u2math = stateVariables[u2[1].componentName].stateValues.value;
        expect(u2math.equals(option[u2string])).eq(true);
        let repeatumath =
            stateVariables[
                stateVariables[
                    stateVariables["/repeat"].activeChildren[4].componentName
                ].activeChildren[1].componentName
            ].stateValues.value;
        expect(repeatumath.equals(option[u2string])).eq(true);
    });

    it("variant names specified, select single", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl numVariants="5" variantNames="aVocado  broCColi   carrot  Dill eggplanT"/>

    <p>Selected variable:
    <select name="s1" assignnames="(x)">
      <option selectForVariants="dill"><math>d</math></option>
      <option selectForVariants="Carrot"><math>c</math></option>
      <option selectForVariants="eggPlant"><math>e</math></option>
      <option selectForVariants="avocadO"><math>a</math></option>
      <option selectForVariants="broccOli"><math>b</math></option>
    </select>
    </p>

    <p>Selected variable repeated: $x{name="x2"}</p>
    <p>Selected variable repeated again: $s1{name="x3"}</p>
    `,
            requestedVariantIndex: 2,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // let variantName = stateVariables['/x'].sharedParameters.variantName;
        // let expectedx = variantName.substring(0, 1);
        let expectedx = "b";

        let x = stateVariables["/x"].stateValues.value.tree;

        expect(x).eq(expectedx);

        let xorig =
            stateVariables[
                stateVariables[
                    stateVariables["/s1"].replacements![0].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(xorig).eq(expectedx);

        let x2 = stateVariables["/x2"].stateValues.value.tree;
        expect(x2).eq(expectedx);

        let x3 =
            stateVariables[
                stateVariables[
                    stateVariables["/x3"].replacements![0].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(x3).eq(expectedx);
    });

    it("variant names specified, select multiple", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl numVariants="5" variantNames="avocado  brOccoli   carrot  dill    eggPlant  "/>

    <p>Selected variables:
    <select name="s1" assignnames="(x)  (y)  (z)" numToSelect="3">
      <option selectForVariants="dill  carrot  avocado"><math>d</math></option>
      <option selectForVariants="cArrOt eggplant eggplant"><math>c</math></option>
      <option selectForVariants="eggplant  broccoli  dilL"><math>e</math></option>
      <option selectForVariants="aVocado   avocado   broccoli"><math>a</math></option>
      <option selectForVariants="  broccoli     caRRot     dill    "><math>b</math></option>
    </select>
    </p>

    <p>Selected first variable: $x{name="x2"}</p>
    <p>Selected second variable: $y{name="y2"}</p>
    <p>Selected third variable: $z{name="z2"}</p>
    <p>Selected variables repeated: $s1{name="s2"}</p>

    `,
            requestedVariantIndex: 3,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let variantMap = {
            avocado: ["d", "a", "a"],
            broccoli: ["e", "a", "b"],
            carrot: ["d", "c", "b"],
            dill: ["d", "e", "b"],
            eggplant: ["c", "c", "e"],
        };

        // let variantName = stateVariables['/x'].sharedParameters.variantName;
        let variantName = "carrot";
        let variantVars = variantMap[variantName];

        let x = stateVariables["/x"].stateValues.value.tree;

        expect(variantVars.includes(x)).eq(true);
        variantVars.splice(variantVars.indexOf(x), 1);

        let y = stateVariables["/y"].stateValues.value.tree;
        expect(variantVars.includes(y)).eq(true);
        variantVars.splice(variantVars.indexOf(y), 1);

        let z = stateVariables["/z"].stateValues.value.tree;
        expect(z).eq(variantVars[0]);

        let xorig =
            stateVariables[
                stateVariables[
                    stateVariables["/s1"].replacements![0].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(xorig).eq(x);
        let yorig =
            stateVariables[
                stateVariables[
                    stateVariables["/s1"].replacements![1].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(yorig).eq(y);
        let zorig =
            stateVariables[
                stateVariables[
                    stateVariables["/s1"].replacements![2].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(zorig).eq(z);

        let x2 = stateVariables["/x2"].stateValues.value.tree;
        expect(x2).eq(x);
        let y2 = stateVariables["/y2"].stateValues.value.tree;
        expect(y2).eq(y);
        let z2 = stateVariables["/z2"].stateValues.value.tree;
        expect(z2).eq(z);

        let x3 =
            stateVariables[
                stateVariables[
                    stateVariables["/s2"].replacements![0].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(x3).eq(x);
        let y3 =
            stateVariables[
                stateVariables[
                    stateVariables["/s2"].replacements![1].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(y3).eq(y);
        let z3 =
            stateVariables[
                stateVariables[
                    stateVariables["/s2"].replacements![2].componentName
                ].replacements![0].componentName
            ].stateValues.value.tree;
        expect(z3).eq(z);
    });

    it("select math as sugared string", async () => {
        const doenetML = `
    <select type="math" assignnames="m1 m2 m3 m4 m5" numToSelect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>`;

        const vals = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map(
            (x) => me.fromText(x),
        );

        const valid_values = Array(5).fill(vals);
        const componentNames = ["/m1", "/m2", "/m3", "/m4", "/m5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select math as sugared string, no type specified", async () => {
        const doenetML = `
    <select assignnames="m1 m2 m3 m4 m5" numToSelect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>`;

        const vals = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map(
            (x) => me.fromText(x),
        );

        const valid_values = Array(5).fill(vals);
        const componentNames = ["/m1", "/m2", "/m3", "/m4", "/m5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select math as sugared strings and macros", async () => {
        const doenetML = `
    <setup>
      <math name="var1">x</math>
      <math name="var2">y</math>
      <number name="a">7</number>
      <math name="b">-3</math>
    </setup>
    <select assignnames="m1 m2 m3 m4 m5 m6" numToSelect="6">
      $a$var1^2  $b$var1/$var2  u-$b  $a  $var1-c $(var2{createComponentOfType="math"})
    </select>`;

        const vals = ["7x^2", "(-3)x/y", "u-(-3)", "7", "x-c", "y"].map((x) =>
            me.fromText(x),
        );

        const valid_values = Array(6).fill(vals);
        const componentNames = ["/m1", "/m2", "/m3", "/m4", "/m5", "/m6"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select text as sugared string", async () => {
        const doenetML = `
    <select type="text" assignnames="w1 w2 w3 w4 w5" numToSelect="5">
      Lorem  ipsum  dolor  sit  amet  consectetur  adipiscing  elit
    </select>`;

        const vals = [
            "Lorem",
            "ipsum",
            "dolor",
            "sit",
            "amet",
            "consectetur",
            "adipiscing",
            "elit",
        ];

        const valid_values = Array(5).fill(vals);
        const componentNames = ["/w1", "/w2", "/w3", "/w4", "/w5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            must_be_distinct: true,
        });
    });

    it("select text as sugared strings and macros", async () => {
        const doenetML = `
    <setup>
      <text name="a">amet</text>
      <text name="cSpace">consectetur </text>
      <text name="spaceD"> dolor</text>
    </setup>
    <select type="text" assignnames="w1 w2 w3 w4 w5" numToSelect="5">
      Lorem  ipsum$spaceD  sit  $(a{createComponentOfType="text"})  $(cSpace)adipiscing
    </select>`;

        const vals = [
            "Lorem",
            "ipsum dolor",
            "sit",
            "amet",
            "consectetur adipiscing",
        ];

        const valid_values = Array(5).fill(vals);
        const componentNames = ["/w1", "/w2", "/w3", "/w4", "/w5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            must_be_distinct: true,
        });
    });

    it("select number as sugared string", async () => {
        const doenetML = `
    <select type="number" assignnames="n1 n2 n3 n4 n5 n6 n7 n8 n9 n10" numToSelect="10" withReplacement>
      2 3 5 7 11 13 17 19
    </select>`;

        const vals = [2, 3, 5, 7, 11, 13, 17, 19];
        const valid_values = Array(10).fill(vals);

        const componentNames = [
            "/n1",
            "/n2",
            "/n3",
            "/n4",
            "/n5",
            "/n6",
            "/n7",
            "/n8",
            "/n9",
            "/n10",
        ];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
        });
    });

    it("select number as sugared strings and macros", async () => {
        const doenetML = `
    <setup>
      <number name="a">5</number>
      <math name="b">-7</math>
      <math name="c">6+2</math>
    </setup>
    <select type="number" assignnames="n1 n2 n3 n4 n5 n6" numToSelect="6">
      2 $a+$b 3-$c $(a{createComponentOfType="number"}) $b-1 $c
    </select>`;

        const vals = [2, -2, -5, 5, -8, 8];
        const valid_values = Array(6).fill(vals);

        const componentNames = ["/n1", "/n2", "/n3", "/n4", "/n5", "/n6"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            must_be_distinct: true,
        });
    });

    it("select boolean as sugared string", async () => {
        const doenetML = `
    <select type="boolean" assignnames="b1 b2 b3 b4 b5 b6 b7 b8 b9 b10" numToSelect="10" withReplacement>
      true false
    </select>`;

        const vals = [true, false];
        const valid_values = Array(10).fill(vals);

        const componentNames = [
            "/b1",
            "/b2",
            "/b3",
            "/b4",
            "/b5",
            "/b6",
            "/b7",
            "/b8",
            "/b9",
            "/b10",
        ];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 1,
        });
    });

    it("select boolean as sugared strings and macros", async () => {
        const doenetML = `
    <setup>
      <boolean name="t">true</boolean>
      <boolean name="f">false</boolean>
    </setup>
    <select type="boolean" assignnames="b1 b2 b3 b4 b5 b6 b7 b8 b9 b10" numToSelect="10" withReplacement>
       true false $t $f $(t{createComponentOfType="boolean"}) $(f{createComponentOfType="boolean"})
    </select>`;

        const vals = [true, false];
        const valid_values = Array(10).fill(vals);

        const componentNames = [
            "/b1",
            "/b2",
            "/b3",
            "/b4",
            "/b5",
            "/b6",
            "/b7",
            "/b8",
            "/b9",
            "/b10",
        ];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 1,
        });
    });

    it("select invalid type with sugared string, becomes math with warning", async () => {
        const doenetML = `
    <select type="nothing" assignnames="m1 m2 m3 m4 m5" numToSelect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>`;

        const vals = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map(
            (x) => me.fromText(x),
        );

        const valid_values = Array(5).fill(vals);
        const componentNames = ["/m1", "/m2", "/m3", "/m4", "/m5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });

        let core = await createTestCore({ doenetML });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid type for select: nothing",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(13);
    });

    it("select weighted", async () => {
        // TODO: this test seems to fail with num Y < 17 once in awhile
        // even though it should fail less than 0.1% of the time
        // Is there a flaw?

        let core = await createTestCore({
            doenetML: `
        <map>
          <template>
          <select>
            <option selectweight="0.2"><text>x</text></option>
            <option><text>y</text></option>
            <option selectweight="5"><text>z</text></option>
            </select>
          </template>
          <sources><sequence length="200" /></sources>
        </map>
        `,
        });

        let numX = 0,
            numY = 0,
            numZ = 0;

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let ind = 0; ind < 200; ind++) {
            let theText =
                stateVariables[
                    stateVariables[
                        stateVariables[
                            stateVariables[
                                stateVariables["/_map1"].replacements![ind]
                                    .componentName
                            ].replacements![1].componentName
                        ].replacements![0].componentName
                    ].replacements![0].componentName
                ];
            let x = theText.stateValues.value;
            if (x === "z") {
                numZ++;
            } else if (x === "y") {
                numY++;
            } else {
                numX++;
            }
        }

        expect(numX).greaterThan(0);
        expect(numX).lessThan(15);
        expect(numY).greaterThan(17);
        expect(numY).lessThan(50);
        expect(numZ).greaterThan(140);
    });

    it("select weighted with replacement", async () => {
        let core = await createTestCore({
            doenetML: `
    <select numToSelect="200" withreplacement>
      <option selectweight="0.2"><text>x</text></option>
      <option><text>y</text></option>
      <option selectweight="5"><text>z</text></option>
    </select>
    `,
            requestedVariantIndex: 0,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let numX = 0,
            numY = 0,
            numZ = 0;
        let selectReplacements = stateVariables["/_select1"].replacements!;
        for (let ind = 0; ind < 200; ind++) {
            let x =
                stateVariables[
                    stateVariables[selectReplacements[ind].componentName]
                        .replacements![0].componentName
                ].stateValues.value;
            if (x === "x") {
                numX++;
            } else if (x === "y") {
                numY++;
            } else {
                numZ++;
            }
        }
        expect(numX).greaterThan(0);
        expect(numX).lessThan(15);
        expect(numY).greaterThan(20);
        expect(numY).lessThan(50);
        expect(numZ).greaterThan(150);
    });

    it("select weighted without replacement", async () => {
        let core = await createTestCore({
            doenetML: `
        <map>
          <template>
          <select numToSelect="2">
            <option selectweight="0.1"><text>u</text></option>
            <option selectweight="0.1"><text>v</text></option>
            <option selectweight="0.1"><text>w</text></option>
            <option selectweight="5"><text>x</text></option>
            <option><text>y</text></option>
            <option selectweight="10"><text>z</text></option>
          </select>
          </template>
          <sources><sequence length="200" /></sources>
        </map>
        `,
        });

        let numX = 0,
            numY = 0,
            numZ = 0,
            numUVW = 0;

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let ind = 0; ind < 200; ind++) {
            let theSelect =
                stateVariables[
                    stateVariables[
                        stateVariables["/_map1"].replacements![ind]
                            .componentName
                    ].replacements![1].componentName
                ];
            let theText1 =
                stateVariables[
                    stateVariables[theSelect.replacements![0].componentName]
                        .replacements![0].componentName
                ];
            let x = theText1.stateValues.value;

            if (x === "z") {
                numZ++;
            } else if (x === "y") {
                numY++;
            } else if (x === "x") {
                numX++;
            } else {
                numUVW++;
            }
            let theText2 =
                stateVariables[
                    stateVariables[theSelect.replacements![1].componentName]
                        .replacements![0].componentName
                ];
            let y = theText2.stateValues.value;
            if (y === "z") {
                numZ++;
            } else if (y === "y") {
                numY++;
            } else if (y === "x") {
                numX++;
            } else {
                numUVW++;
            }
        }

        expect(numUVW).greaterThan(0);
        expect(numUVW).lessThan(20);
        expect(numX).greaterThan(150);
        expect(numY).greaterThan(10);
        expect(numY).lessThan(50);
        expect(numZ).greaterThan(170);
    });

    it("references to internal assignnames", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="original" assignnames="(q) (r) (s) (t) (u) (v) (w)" numToSelect="7" withreplacement>
      <option><p newNamespace><select assignnames="q r" numToSelect="2">a e i o u</select>$q{name="q2"}$r{name="r2"}</p></option>
      <option><p newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="a" to="z" />$q{name="q2"}$r{name="r2"}</p></option>
      <option><p newNamespace><text name="q">z</text><selectfromsequence type="letters" assignnames="r" numToSelect="1" from="u" to="z" />$q{name="q2"}$r{name="r2"}</p></option>
      <option><p newNamespace><text name="q">q</text><text name="r">r</text>$q{name="q2"}$r{name="r2"}</p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}
    $v{name="v2"}
    $w{name="w2"}

    <p>Copy q and r and their copies from within selected options</p>
    <p>$(q/q{name="qq"})$(q/r{name="qr"})$(q/q2{name="qq2"})$(q/r2{name="qr2"})</p>
    <p>$(r/q{name="rq"})$(r/r{name="rr"})$(r/q2{name="rq2"})$(r/r2{name="rr2"})</p>
    <p>$(s/q{name="sq"})$(s/r{name="sr"})$(s/q2{name="sq2"})$(s/r2{name="sr2"})</p>
    <p>$(t/q{name="tq"})$(t/r{name="tr"})$(t/q2{name="tq2"})$(t/r2{name="tr2"})</p>
    <p>$(u/q{name="uq"})$(u/r{name="ur"})$(u/q2{name="uq2"})$(u/r2{name="ur2"})</p>
    <p>$(v/q{name="vq"})$(v/r{name="vr"})$(v/q2{name="vq2"})$(v/r2{name="vr2"})</p>
    <p>$(w/q{name="wq"})$(w/r{name="wr"})$(w/q2{name="wq2"})$(w/r2{name="wr2"})</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let qs = stateVariables["/q"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let rs = stateVariables["/r"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let ss = stateVariables["/s"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let ts = stateVariables["/t"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let us = stateVariables["/u"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let vs = stateVariables["/v"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let ws = stateVariables["/w"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        let q2s = stateVariables["/q2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let r2s = stateVariables["/r2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let s2s = stateVariables["/s2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let t2s = stateVariables["/t2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let u2s = stateVariables["/u2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let v2s = stateVariables["/v2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let w2s = stateVariables["/w2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        const getTree = (x) => x.tree ?? x;

        expect(q2s.map(getTree)).eqls(qs.map(getTree));
        expect(r2s.map(getTree)).eqls(rs.map(getTree));
        expect(s2s.map(getTree)).eqls(ss.map(getTree));
        expect(t2s.map(getTree)).eqls(ts.map(getTree));
        expect(u2s.map(getTree)).eqls(us.map(getTree));
        expect(v2s.map(getTree)).eqls(vs.map(getTree));
        expect(w2s.map(getTree)).eqls(ws.map(getTree));

        let q3s = [
            stateVariables["/qq"].stateValues.value,
            stateVariables["/qr"].stateValues.value,
            stateVariables["/qq2"].stateValues.value,
            stateVariables["/qr2"].stateValues.value,
        ];
        let r3s = [
            stateVariables["/rq"].stateValues.value,
            stateVariables["/rr"].stateValues.value,
            stateVariables["/rq2"].stateValues.value,
            stateVariables["/rr2"].stateValues.value,
        ];
        let s3s = [
            stateVariables["/sq"].stateValues.value,
            stateVariables["/sr"].stateValues.value,
            stateVariables["/sq2"].stateValues.value,
            stateVariables["/sr2"].stateValues.value,
        ];
        let t3s = [
            stateVariables["/tq"].stateValues.value,
            stateVariables["/tr"].stateValues.value,
            stateVariables["/tq2"].stateValues.value,
            stateVariables["/tr2"].stateValues.value,
        ];
        let u3s = [
            stateVariables["/uq"].stateValues.value,
            stateVariables["/ur"].stateValues.value,
            stateVariables["/uq2"].stateValues.value,
            stateVariables["/ur2"].stateValues.value,
        ];
        let v3s = [
            stateVariables["/vq"].stateValues.value,
            stateVariables["/vr"].stateValues.value,
            stateVariables["/vq2"].stateValues.value,
            stateVariables["/vr2"].stateValues.value,
        ];
        let w3s = [
            stateVariables["/wq"].stateValues.value,
            stateVariables["/wr"].stateValues.value,
            stateVariables["/wq2"].stateValues.value,
            stateVariables["/wr2"].stateValues.value,
        ];

        expect(q3s.map(getTree)).eqls(qs.map(getTree));
        expect(r3s.map(getTree)).eqls(rs.map(getTree));
        expect(s3s.map(getTree)).eqls(ss.map(getTree));
        expect(t3s.map(getTree)).eqls(ts.map(getTree));
        expect(u3s.map(getTree)).eqls(us.map(getTree));
        expect(v3s.map(getTree)).eqls(vs.map(getTree));
        expect(w3s.map(getTree)).eqls(ws.map(getTree));
    });

    it("references to internal assignnames, newnamespaces", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="original" assignnames="(q) (r) (s) (t) (u) (v) (w)" numToSelect="7" withreplacement>
      <option><p newNamespace><select name="s" newnamespace assignnames="q r" numToSelect="2">a e i o u</select>$(s/q{name="q2"})$(s/r{name="r2"})</p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numToSelect="2" from="a" to="z" />$(s/q{name="q2"})$(s/r{name="r2"})</p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numToSelect="2" withreplacement from="u" to="z" />$(s/q{name="q2"})$(s/r{name="r2"})</p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}
    $v{name="v2"}
    $w{name="w2"}

    <p>Selected options repeated, no p</p>
    <p>$(q/s{name="q3"})</p>
    <p>$(r/s{name="r3"})</p>
    <p>$(s/s{name="s3"})</p>
    <p>$(t/s{name="t3"})</p>
    <p>$(u/s{name="u3"})</p>
    <p>$(v/s{name="v3"})</p>
    <p>$(w/s{name="w3"})</p>

    <p>Copy q and r from within selected options</p>
    <p>$(q/s/q{name="qq"})$(q/s/r{name="qr"})$(q/q2{name="qq2"})$(q/r2{name="qr2"})</p>
    <p>$(r/s/q{name="rq"})$(r/s/r{name="rr"})$(r/q2{name="rq2"})$(r/r2{name="rr2"})</p>
    <p>$(s/s/q{name="sq"})$(s/s/r{name="sr"})$(s/q2{name="sq2"})$(s/r2{name="sr2"})</p>
    <p>$(t/s/q{name="tq"})$(t/s/r{name="tr"})$(t/q2{name="tq2"})$(t/r2{name="tr2"})</p>
    <p>$(u/s/q{name="uq"})$(u/s/r{name="ur"})$(u/q2{name="uq2"})$(u/r2{name="ur2"})</p>
    <p>$(v/s/q{name="vq"})$(v/s/r{name="vr"})$(v/q2{name="vq2"})$(v/r2{name="vr2"})</p>
    <p>$(w/s/q{name="wq"})$(w/s/r{name="wr"})$(w/q2{name="wq2"})$(w/r2{name="wr2"})</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let qs = stateVariables["/q"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let rs = stateVariables["/r"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let ss = stateVariables["/s"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let ts = stateVariables["/t"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let us = stateVariables["/u"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let vs = stateVariables["/v"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let ws = stateVariables["/w"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        let q2s = stateVariables["/q2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let r2s = stateVariables["/r2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let s2s = stateVariables["/s2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let t2s = stateVariables["/t2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let u2s = stateVariables["/u2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let v2s = stateVariables["/v2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let w2s = stateVariables["/w2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        const getTree = (x) => x.tree ?? x;

        expect(q2s.map(getTree)).eqls(qs.map(getTree));
        expect(r2s.map(getTree)).eqls(rs.map(getTree));
        expect(s2s.map(getTree)).eqls(ss.map(getTree));
        expect(t2s.map(getTree)).eqls(ts.map(getTree));
        expect(u2s.map(getTree)).eqls(us.map(getTree));
        expect(v2s.map(getTree)).eqls(vs.map(getTree));
        expect(w2s.map(getTree)).eqls(ws.map(getTree));

        let q3s = stateVariables["/q3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let r3s = stateVariables["/r3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let s3s = stateVariables["/s3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let t3s = stateVariables["/t3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let u3s = stateVariables["/u3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let v3s = stateVariables["/v3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let w3s = stateVariables["/w3"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );

        expect(q3s.map(getTree)).eqls(qs.slice(0, 2).map(getTree));
        expect(r3s.map(getTree)).eqls(rs.slice(0, 2).map(getTree));
        expect(s3s.map(getTree)).eqls(ss.slice(0, 2).map(getTree));
        expect(t3s.map(getTree)).eqls(ts.slice(0, 2).map(getTree));
        expect(u3s.map(getTree)).eqls(us.slice(0, 2).map(getTree));
        expect(v3s.map(getTree)).eqls(vs.slice(0, 2).map(getTree));
        expect(w3s.map(getTree)).eqls(ws.slice(0, 2).map(getTree));

        let q4s = [
            stateVariables["/qq"].stateValues.value,
            stateVariables["/qr"].stateValues.value,
            stateVariables["/qq2"].stateValues.value,
            stateVariables["/qr2"].stateValues.value,
        ];
        let r4s = [
            stateVariables["/rq"].stateValues.value,
            stateVariables["/rr"].stateValues.value,
            stateVariables["/rq2"].stateValues.value,
            stateVariables["/rr2"].stateValues.value,
        ];
        let s4s = [
            stateVariables["/sq"].stateValues.value,
            stateVariables["/sr"].stateValues.value,
            stateVariables["/sq2"].stateValues.value,
            stateVariables["/sr2"].stateValues.value,
        ];
        let t4s = [
            stateVariables["/tq"].stateValues.value,
            stateVariables["/tr"].stateValues.value,
            stateVariables["/tq2"].stateValues.value,
            stateVariables["/tr2"].stateValues.value,
        ];
        let u4s = [
            stateVariables["/uq"].stateValues.value,
            stateVariables["/ur"].stateValues.value,
            stateVariables["/uq2"].stateValues.value,
            stateVariables["/ur2"].stateValues.value,
        ];
        let v4s = [
            stateVariables["/vq"].stateValues.value,
            stateVariables["/vr"].stateValues.value,
            stateVariables["/vq2"].stateValues.value,
            stateVariables["/vr2"].stateValues.value,
        ];
        let w4s = [
            stateVariables["/wq"].stateValues.value,
            stateVariables["/wr"].stateValues.value,
            stateVariables["/wq2"].stateValues.value,
            stateVariables["/wr2"].stateValues.value,
        ];

        expect(q4s.map(getTree)).eqls(qs.map(getTree));
        expect(r4s.map(getTree)).eqls(rs.map(getTree));
        expect(s4s.map(getTree)).eqls(ss.map(getTree));
        expect(t4s.map(getTree)).eqls(ts.map(getTree));
        expect(u4s.map(getTree)).eqls(us.map(getTree));
        expect(v4s.map(getTree)).eqls(vs.map(getTree));
        expect(w4s.map(getTree)).eqls(ws.map(getTree));
    });

    it("references to select of selects", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="original" assignnames="(q) (r) (s) (t) (u)" numToSelect="5" withreplacement>
      <option><select newNamespace assignnames="q r" numToSelect="2">a e i o u</select></option>
      <option><selectfromsequence type="letters" newNamespace assignnames="q r" numToSelect="2" from="a" to="z" /></option>
    </select>

    <p>Selected options repeated</p>
    <p>$q{name="q2"}</p>
    <p>$r{name="r2"}</p>
    <p>$s{name="s2"}</p>
    <p>$t{name="t2"}</p>
    <p>$u{name="u2"}</p>

    <p>Copy x/q and x/r</p>
    <p>$(q/q{name="qq"})$(q/r{name="qr"})</p>
    <p>$(r/q{name="rq"})$(r/r{name="rr"})</p>
    <p>$(s/q{name="sq"})$(s/r{name="sr"})</p>
    <p>$(t/q{name="tq"})$(t/r{name="tr"})</p>
    <p>$(u/q{name="uq"})$(u/r{name="ur"})</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let qs = stateVariables["/q"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let rs = stateVariables["/r"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let ss = stateVariables["/s"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let ts = stateVariables["/t"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let us = stateVariables["/u"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );

        let q2s = stateVariables["/q2"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let r2s = stateVariables["/r2"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let s2s = stateVariables["/s2"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let t2s = stateVariables["/t2"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );
        let u2s = stateVariables["/u2"]
            .replacements!.map((x) => stateVariables[x.componentName])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentName]
                          .stateValues.value
                    : x.stateValues.value,
            );

        const getTree = (x) => x.tree ?? x;

        expect(q2s.map(getTree)).eqls(qs.map(getTree));
        expect(r2s.map(getTree)).eqls(rs.map(getTree));
        expect(s2s.map(getTree)).eqls(ss.map(getTree));
        expect(t2s.map(getTree)).eqls(ts.map(getTree));
        expect(u2s.map(getTree)).eqls(us.map(getTree));

        let q3s = [
            stateVariables["/qq"].stateValues.value,
            stateVariables["/qr"].stateValues.value,
        ];
        let r3s = [
            stateVariables["/rq"].stateValues.value,
            stateVariables["/rr"].stateValues.value,
        ];
        let s3s = [
            stateVariables["/sq"].stateValues.value,
            stateVariables["/sr"].stateValues.value,
        ];
        let t3s = [
            stateVariables["/tq"].stateValues.value,
            stateVariables["/tr"].stateValues.value,
        ];
        let u3s = [
            stateVariables["/uq"].stateValues.value,
            stateVariables["/ur"].stateValues.value,
        ];

        expect(q3s.map(getTree)).eqls(qs.map(getTree));
        expect(r3s.map(getTree)).eqls(rs.map(getTree));
        expect(s3s.map(getTree)).eqls(ss.map(getTree));
        expect(t3s.map(getTree)).eqls(ts.map(getTree));
        expect(u3s.map(getTree)).eqls(us.map(getTree));
    });

    it("references to select of selects of selects", async () => {
        let core = await createTestCore({
            doenetML: `
    <select assignnames="q r s" numToSelect="3" withreplacement>
      <option newNamespace><select assignnames="q r s" numToSelect="3" withreplacement>
        <option newNamespace><select type="text" assignnames="q r" numToSelect="2">a e i o u</select></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="a" to="j" /></option>
      </select></option>
      <option newNamespace><select assignnames="q r s" numToSelect="3">
        <option newNamespace><select type="text" assignnames="q r" numToSelect="2">v w x y z</select></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="k" to="n" /></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="x" to="z" /></option>
        <option newNamespace><select type="text" assignnames="q r" numToSelect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2">$q{name="q2"}</p>
    <p name="pr2">$r{name="r2"}</p>
    <p name="ps2">$s{name="s2"}</p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3">$(q/q{name="qq"})$(q/r{name="qr"})$(q/s{name="qs"})</p>
    <p name="pr3">$(r/q{name="rq"})$(r/r{name="rr"})$(r/s{name="rs"})</p>
    <p name="ps3">$(s/q{name="sq"})$(s/r{name="sr"})$(s/s{name="ss"})</p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4">$(q/q/q{name="qqq"})$(q/q/r{name="qqr"})$(q/r/q{name="qrq"})$(q/r/r{name="qrr"})$(q/s/q{name="qsq"})$(q/s/r{name="qsr"})</p>
    <p name="pr4">$(r/q/q{name="rqq"})$(r/q/r{name="rqr"})$(r/r/q{name="rrq"})$(r/r/r{name="rrr"})$(r/s/q{name="rsq"})$(r/s/r{name="rsr"})</p>
    <p name="ps4">$(s/q/q{name="sqq"})$(s/q/r{name="sqr"})$(s/r/q{name="srq"})$(s/r/r{name="srr"})$(s/s/q{name="ssq"})$(s/s/r{name="ssr"})</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let qs = [
            "/q/q/q",
            "/q/q/r",
            "/q/r/q",
            "/q/r/r",
            "/q/s/q",
            "/q/s/r",
        ].map((x) =>
            stateVariables[x].replacements
                ? stateVariables[
                      stateVariables[x].replacements[0].componentName
                  ].stateValues.value
                : stateVariables[x].stateValues.value,
        );
        let rs = [
            "/r/q/q",
            "/r/q/r",
            "/r/r/q",
            "/r/r/r",
            "/r/s/q",
            "/r/s/r",
        ].map((x) =>
            stateVariables[x].replacements
                ? stateVariables[
                      stateVariables[x].replacements[0].componentName
                  ].stateValues.value
                : stateVariables[x].stateValues.value,
        );
        let ss = [
            "/s/q/q",
            "/s/q/r",
            "/s/r/q",
            "/s/r/r",
            "/s/s/q",
            "/s/s/r",
        ].map((x) =>
            stateVariables[x].replacements
                ? stateVariables[
                      stateVariables[x].replacements[0].componentName
                  ].stateValues.value
                : stateVariables[x].stateValues.value,
        );

        expect(stateVariables["/pq2"].stateValues.text.replace(/, /g, "")).eq(
            qs.join(""),
        );
        expect(stateVariables["/pr2"].stateValues.text.replace(/, /g, "")).eq(
            rs.join(""),
        );
        expect(stateVariables["/ps2"].stateValues.text.replace(/, /g, "")).eq(
            ss.join(""),
        );

        expect(stateVariables["/pq3"].stateValues.text.replace(/, /g, "")).eq(
            qs.join(""),
        );
        expect(stateVariables["/pr3"].stateValues.text.replace(/, /g, "")).eq(
            rs.join(""),
        );
        expect(stateVariables["/ps3"].stateValues.text.replace(/, /g, "")).eq(
            ss.join(""),
        );

        expect(stateVariables["/pq4"].stateValues.text.replace(/, /g, "")).eq(
            qs.join(""),
        );
        expect(stateVariables["/pr4"].stateValues.text.replace(/, /g, "")).eq(
            rs.join(""),
        );
        expect(stateVariables["/ps4"].stateValues.text.replace(/, /g, "")).eq(
            ss.join(""),
        );
    });

    it("references to select of selects of selects, newnamespaces", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="a" newnamespace assignnames="(q) (r) (s)" numToSelect="3" withreplacement>
      <option><select name="b" newnamespace assignnames="(q) (r) (s)" numToSelect="3" withreplacement>
        <option><select name="c" newnamespace type="text" assignnames="q r" numToSelect="2">a e i o u</select></option>
        <option><selectfromsequence type="letters" name="d" newnamespace assignnames="q r" numToSelect="2" from="a" to="j" /></option>
      </select></option>
      <option><select name="e" newnamespace assignnames="(q) (r) (s)" numToSelect="3">
        <option><select name="f" newnamespace type="text" assignnames="q r" numToSelect="2">v w x y z</select></option>
        <option><selectfromsequence type="letters" name="g" newnamespace assignnames="q r" numToSelect="2" from="k" to="n" /></option>
        <option><selectfromsequence type="letters" name="h" newnamespace assignnames="q r" numToSelect="2" from="x" to="z" /></option>
        <option><select name="i" newnamespace type="text" assignnames="q r" numToSelect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2">$(a/q{name="q2"})</p>
    <p name="pr2">$(a/r{name="r2"})</p>
    <p name="ps2">$(a/s{name="s2"})</p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3">$(a/q/q{name="qq"})$(a/q/r{name="qr"})$(a/q/s{name="qs"})</p>
    <p name="pr3">$(a/r/q{name="rq"})$(a/r/r{name="rr"})$(a/r/s{name="rs"})</p>
    <p name="ps3">$(a/s/q{name="sq"})$(a/s/r{name="sr"})$(a/s/s{name="ss"})</p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4">$(a/q/q/q{name="qqq"})$(a/q/q/r{name="qqr"})$(a/q/r/q{name="qrq"})$(a/q/r/r{name="qrr"})$(a/q/s/q{name="qsq"})$(a/q/s/r{name="qsr"})</p>
    <p name="pr4">$(a/r/q/q{name="rqq"})$(a/r/q/r{name="rqr"})$(a/r/r/q{name="rrq"})$(a/r/r/r{name="rrr"})$(a/r/s/q{name="rsq"})$(a/r/s/r{name="rsr"})</p>
    <p name="ps4">$(a/s/q/q{name="sqq"})$(a/s/q/r{name="sqr"})$(a/s/r/q{name="srq"})$(a/s/r/r{name="srr"})$(a/s/s/q{name="ssq"})$(a/s/s/r{name="ssr"})</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let qs = [
            "/a/q/q/q",
            "/a/q/q/r",
            "/a/q/r/q",
            "/a/q/r/r",
            "/a/q/s/q",
            "/a/q/s/r",
        ].map((x) =>
            stateVariables[x].replacements
                ? stateVariables[
                      stateVariables[x].replacements[0].componentName
                  ].stateValues.value
                : stateVariables[x].stateValues.value,
        );
        let rs = [
            "/a/r/q/q",
            "/a/r/q/r",
            "/a/r/r/q",
            "/a/r/r/r",
            "/a/r/s/q",
            "/a/r/s/r",
        ].map((x) =>
            stateVariables[x].replacements
                ? stateVariables[
                      stateVariables[x].replacements[0].componentName
                  ].stateValues.value
                : stateVariables[x].stateValues.value,
        );
        let ss = [
            "/a/s/q/q",
            "/a/s/q/r",
            "/a/s/r/q",
            "/a/s/r/r",
            "/a/s/s/q",
            "/a/s/s/r",
        ].map((x) =>
            stateVariables[x].replacements
                ? stateVariables[
                      stateVariables[x].replacements[0].componentName
                  ].stateValues.value
                : stateVariables[x].stateValues.value,
        );

        expect(stateVariables["/pq2"].stateValues.text.replace(/, /g, "")).eq(
            qs.join(""),
        );
        expect(stateVariables["/pr2"].stateValues.text.replace(/, /g, "")).eq(
            rs.join(""),
        );
        expect(stateVariables["/ps2"].stateValues.text.replace(/, /g, "")).eq(
            ss.join(""),
        );

        expect(stateVariables["/pq3"].stateValues.text.replace(/, /g, "")).eq(
            qs.join(""),
        );
        expect(stateVariables["/pr3"].stateValues.text.replace(/, /g, "")).eq(
            rs.join(""),
        );
        expect(stateVariables["/ps3"].stateValues.text.replace(/, /g, "")).eq(
            ss.join(""),
        );

        expect(stateVariables["/pq4"].stateValues.text.replace(/, /g, "")).eq(
            qs.join(""),
        );
        expect(stateVariables["/pr4"].stateValues.text.replace(/, /g, "")).eq(
            rs.join(""),
        );
        expect(stateVariables["/ps4"].stateValues.text.replace(/, /g, "")).eq(
            ss.join(""),
        );
    });

    it("references to named grandchildren's children", async () => {
        let core = await createTestCore({
            doenetML: `
    <select assignnames="(a b c d)">
    <option>
      <math name="h1" newNamespace><math name="w">x</math><math>y</math></math>
      <math simplify newNamespace><math name="q">z</math> + 2$q{name="v"}</math>
      $(a/w)
      $(b/q)
    </option>
    <option>
      <math name="h2" newNamespace><math name="w">u</math><math>v</math></math>
      <math simplify newNamespace><math name="q">t</math> + 2$q{name="v"}</math>
      $(a/w)
      $(b/q)
    </option>
    </select>
    
    <p>Copy grandchidren</p>
    <p>$a{name="a2"}</p>
    <p>$b{name="b2"}</p>
    <p>$c{name="c2"}</p>
    <p>$d{name="d2"}</p>
    
    <p>Copy named children of grandchild</p>
    <p>$(a/w{name="w2"})</p>
    <p>$(b/v{name="v2"})</p>
    
    `,
        });

        let options = [
            {
                a: "x y",
                b: "3 z",
                c: "x",
                d: "z",
                v: "z",
                w: "x",
            },
            {
                a: "u v",
                b: "3 t",
                c: "u",
                d: "t",
                v: "t",
                w: "u",
            },
        ];

        let stateVariables = await core.returnAllStateVariables(false, true);

        let chosenChildren = stateVariables[
            stateVariables["/_select1"].replacements![0].componentName
        ]
            .replacements!.filter((x) => typeof x !== "string")
            .map((x) => stateVariables[x.componentName])
            .map((v, i) =>
                i < 2 ? v : stateVariables[v.replacements![0].componentName],
            );
        let option =
            options[
                stateVariables["/_select1"].stateValues.selectedIndices[0] - 1
            ];

        expect(me.fromAst(chosenChildren[0].stateValues.value).toString()).eq(
            option.a,
        );
        expect(me.fromAst(chosenChildren[1].stateValues.value).toString()).eq(
            option.b,
        );
        expect(me.fromAst(chosenChildren[2].stateValues.value).toString()).eq(
            option.c,
        );
        expect(me.fromAst(chosenChildren[3].stateValues.value).toString()).eq(
            option.d,
        );

        let a2 = me.fromAst(stateVariables["/a2"].stateValues.value).toString();
        let b2 = me.fromAst(stateVariables["/b2"].stateValues.value).toString();
        let c2 = me.fromAst(stateVariables["/c2"].stateValues.value).toString();
        let d2 = me.fromAst(stateVariables["/d2"].stateValues.value).toString();
        let v2 = me.fromAst(stateVariables["/v2"].stateValues.value).toString();
        let w2 = me.fromAst(stateVariables["/w2"].stateValues.value).toString();

        expect(a2).eq(option.a);
        expect(b2).eq(option.b);
        expect(c2).eq(option.c);
        expect(d2).eq(option.d);
        expect(v2).eq(option.v);
        expect(w2).eq(option.w);
    });

    it("select of a map of a select, with references", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><aslist name="list1">
    <select assignnames="(j) (k) (l)" numToSelect="3" withreplacement>
    <option><map assignnames="a b" newNamespace>
      <template newNamespace>
        <select assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x^2</math><math>$x^6</math></option>
          <option><math>$x^3</math><math>$x^7</math></option>
          <option><math>$x^4</math><math>$x^8</math></option>
          <option><math>$x^5</math><math>$x^9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>x</math><math>y</math>
      </sources>
    </map></option>
    <option><map assignnames="a b" newNamespace>
      <template newNamespace>
        <select assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x 2</math><math>$x 6</math></option>
          <option><math>$x 3</math><math>$x 7</math></option>
          <option><math>$x 4</math><math>$x 8</math></option>
          <option><math>$x 5</math><math>$x 9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>u</math><math>v</math>
      </sources>
    </map></option>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2">$_select1{name="s2"}</aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    $j{name="j2"}
    $k{name="k2"}
    $l{name="l2"}
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    $(j/a/p{name="p1"})$(j/a/q{name="p2"})$(j/a/r{name="p3"})$(j/a/s{name="p4"})$(j/b/p{name="p5"})$(j/b/q{name="p6"})$(j/b/r{name="p7"})$(j/b/s{name="p8"})
    $(k/a/p{name="p9"})$(k/a/q{name="p10"})$(k/a/r{name="p11"})$(k/a/s{name="p12"})$(k/b/p{name="p13"})$(k/b/q{name="p14"})$(k/b/r{name="p15"})$(k/b/s{name="p16"})
    $(l/a/p{name="p17"})$(l/a/q{name="p18"})$(l/a/r{name="p19"})$(l/a/s{name="p20"})$(l/b/p{name="p21"})$(l/b/q{name="p22"})$(l/b/r{name="p23"})$(l/b/s{name="p24"})
    </aslist></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let theList1 = stateVariables["/list1"].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentName].stateValues.value)
                .toString(),
        );
        let theList2 = stateVariables["/list2"].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentName].stateValues.value)
                .toString(),
        );
        let theList3 = stateVariables["/list3"].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentName].stateValues.value)
                .toString(),
        );

        expect(theList2).eqls(theList1);
        expect(theList3).eqls(theList1);

        let theList4 = [...Array(24).keys()].map((i) =>
            me
                .fromAst(stateVariables["/p" + (i + 1)].stateValues.value)
                .toString(),
        );

        expect(theList4).eqls(theList1);
    });

    it("select of a map of a select, new namespaces", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><aslist name="list1">
    <select name="s" newnamespace assignnames="(j) (k) (l)" numToSelect="3" withreplacement>
    <option><map name="m" newnamespace assignnames="a b">
      <template newnamespace>
        <select name="v" newnamespace assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x^2</math><math>$x^6</math></option>
          <option><math>$x^3</math><math>$x^7</math></option>
          <option><math>$x^4</math><math>$x^8</math></option>
          <option><math>$x^5</math><math>$x^9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>x</math><math>y</math>
      </sources>
    </map></option>
    <option><map name="n" newnamespace assignnames="a b">
      <template newnamespace>
        <select name="v" newnamespace assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x 2</math><math>$x 6</math></option>
          <option><math>$x 3</math><math>$x 7</math></option>
          <option><math>$x 4</math><math>$x 8</math></option>
          <option><math>$x 5</math><math>$x 9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>u</math><math>v</math>
      </sources>
    </map></option>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2">$s{name="s2"}</aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    $(s/j{name="j2"})
    $(s/k{name="k2"})
    $(s/l{name="l2"})
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    $(s/j/a/v/p{name="p1"})$(s/j/a/v/q{name="p2"})$(s/j/a/v/r{name="p3"})$(s/j/a/v/s{name="p4"})$(s/j/b/v/p{name="p5"})$(s/j/b/v/q{name="p6"})$(s/j/b/v/r{name="p7"})$(s/j/b/v/s{name="p8"})
    $(s/k/a/v/p{name="p9"})$(s/k/a/v/q{name="p10"})$(s/k/a/v/r{name="p11"})$(s/k/a/v/s{name="p12"})$(s/k/b/v/p{name="p13"})$(s/k/b/v/q{name="p14"})$(s/k/b/v/r{name="p15"})$(s/k/b/v/s{name="p16"})
    $(s/l/a/v/p{name="p17"})$(s/l/a/v/q{name="p18"})$(s/l/a/v/r{name="p19"})$(s/l/a/v/s{name="p20"})$(s/l/b/v/p{name="p21"})$(s/l/b/v/q{name="p22"})$(s/l/b/v/r{name="p23"})$(s/l/b/v/s{name="p24"})
    </aslist></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let theList1 = stateVariables["/list1"].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentName].stateValues.value)
                .toString(),
        );
        let theList2 = stateVariables["/list2"].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentName].stateValues.value)
                .toString(),
        );
        let theList3 = stateVariables["/list3"].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentName].stateValues.value)
                .toString(),
        );

        expect(theList2).eqls(theList1);
        expect(theList3).eqls(theList1);

        let theList4 = [...Array(24).keys()].map((i) =>
            me
                .fromAst(stateVariables["/p" + (i + 1)].stateValues.value)
                .toString(),
        );

        expect(theList4).eqls(theList1);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("select with hide will hide replacements but not copies", async () => {
        let core = await createTestCore({
            doenetML: `
      <p>Selects and hide</p>
      <p name="p1"><select assignnames="(c)">
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select>, <select assignnames="(d)" hide>
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select></p>
      <p name="p2">$c, $d</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c = await stateVariables["/c"].stateValues.value;
        let d = await stateVariables["/d"].stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("select with hide will hide named grandchildren replacements but not copies", async () => {
        let core = await createTestCore({
            doenetML: `
      <p>Selects and hide</p>
      <p name="p1"><asList><select assignnames="(a b c)">
        <option>
          <text>a</text>
          <text>b</text>
          <text>c</text>
        </option>
        <option>
          <text>d</text>
          <text>e</text>
          <text>f</text>
        </option>
      </select><select assignnames="(d e)" hide>
        <option>
          <text>a</text>
          <text>b</text>
        </option>
        <option>
          <text>c</text>
          <text>d</text>
        </option>
        <option>
          <text>e</text>
          <text>f</text>
        </option>
      </select></asList></p>
      <p name="p2">$a, <copy hide="true" target="b" />, $c, <copy hide="false" target="d" />, $e</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let a = stateVariables["/a"].stateValues.value;
        let b = stateVariables["/b"].stateValues.value;
        let c = stateVariables["/c"].stateValues.value;
        let d = stateVariables["/d"].stateValues.value;
        let e = stateVariables["/e"].stateValues.value;
        expect(["a", "d"].includes(a)).eq(true);
        expect(["b", "e"].includes(b)).eq(true);
        expect(["c", "f"].includes(c)).eq(true);
        expect(["a", "c", "e"].includes(d)).eq(true);
        expect(["b", "d", "f"].includes(e)).eq(true);

        expect(stateVariables["/p1"].stateValues.text).eq(`${a}, ${b}, ${c}`);
        expect(stateVariables["/p2"].stateValues.text).eq(
            `${a}, , ${c}, ${d}, ${e}`,
        );
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("select with hide will hide named grandchildren replacements but not copies", async () => {
        let core = await createTestCore({
            doenetML: `
      <p>Selects and hide</p>
      <p name="p1"><aslist><select assignnames="(a b c)">
        <option>
          <text>a</text>
          <text>b</text>
          <text>c</text>
        </option>
        <option>
          <text>d</text>
          <text>e</text>
          <text>f</text>
        </option>
      </select><select assignnames="(d e)" hide>
        <option>
          <text>a</text>
          <text>b</text>
        </option>
        <option>
          <text>c</text>
          <text>d</text>
        </option>
        <option>
          <text>e</text>
          <text>f</text>
        </option>
      </select></aslist></p>
      <p name="p2">$a, <copy hide="true" target="b" />, $c, <copy hide="false" target="d" />, $e</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let a = stateVariables["/a"].stateValues.value;
        let b = stateVariables["/b"].stateValues.value;
        let c = stateVariables["/c"].stateValues.value;
        let d = stateVariables["/d"].stateValues.value;
        let e = stateVariables["/e"].stateValues.value;
        expect(["a", "d"].includes(a)).eq(true);
        expect(["b", "e"].includes(b)).eq(true);
        expect(["c", "f"].includes(c)).eq(true);
        expect(["a", "c", "e"].includes(d)).eq(true);
        expect(["b", "d", "f"].includes(e)).eq(true);

        expect(stateVariables["/p1"].stateValues.text).eq(`${a}, ${b}, ${c}`);
        expect(stateVariables["/p2"].stateValues.text).eq(
            `${a}, , ${c}, ${d}, ${e}`,
        );
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("selects hide dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleanInput>
    <p name="p1"><select assignnames="(c)" hide="$h1">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select>, <select assignnames="(d)" hide="$h2">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select></p>
    <p name="p2">$c, $d</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c = await stateVariables["/c"].stateValues.value;
        let d = await stateVariables["/d"].stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);

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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(`, ${d}`);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);

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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);
    });

    it("string and blank strings in options", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <text name="animal1">fox</text><text name="verb1">jumps</text>
      <text name="animal2">elephant</text><text name="verb2">trumpets</text>
    </setup>

    <p name="pa">a: <select assignnames="a">
      <option>The $animal1 $verb1.</option>
      <option>The $animal2 $verb2.</option>
    </select></p>

    <p name="pa1">a1: $a{assignNames="a11 a12 a13 a14"}</p>

    <p name="ppieces" >pieces: <select copySource="_select1" assignNames="(b c d e)" /></p>
  
    <p name="pb1">b1: $b{name="b1"}</p>
    <p name="pc1">c1: $c{name="c1"}</p>
    <p name="pd1">d1: $d{name="d1"}</p>
    <p name="pe1">e1: $e{name="e1"}</p>
  
    
    `,
        });

        let options = [
            {
                animal: "fox",
                verb: "jumps",
            },
            {
                animal: "elephant",
                verb: "trumpets",
            },
        ];

        let stateVariables = await core.returnAllStateVariables(false, true);

        let option =
            options[
                stateVariables["/_select1"].stateValues.selectedIndices[0] - 1
            ];

        expect(stateVariables["/pa"].stateValues.text).eq(
            `a: The ${option.animal} ${option.verb}.`,
        );
        expect(stateVariables["/pa1"].stateValues.text).eq(
            `a1: The ${option.animal} ${option.verb}.`,
        );
        expect(stateVariables["/ppieces"].stateValues.text).eq(
            `pieces: The ${option.animal} ${option.verb}.`,
        );

        expect(stateVariables["/pb1"].stateValues.text).eq(`b1: `);
        expect(stateVariables["/pc1"].stateValues.text).eq(
            `c1: ${option.animal}`,
        );
        expect(stateVariables["/pd1"].stateValues.text).eq(
            `d1: ${option.verb}`,
        );
        expect(stateVariables["/pe1"].stateValues.text).eq(`e1: `);

        expect(stateVariables["/a11"]).eq(undefined);
        expect(stateVariables["/a12"].stateValues.text).eq(`${option.animal}`);
        expect(stateVariables["/a13"].stateValues.text).eq(`${option.verb}`);
        expect(stateVariables["/a14"]).eq(undefined);
        expect(stateVariables["/b1"]).eq(undefined);
        expect(stateVariables["/c1"].stateValues.text).eq(`${option.animal}`);
        expect(stateVariables["/d1"].stateValues.text).eq(`${option.verb}`);
        expect(stateVariables["/e1"]).eq(undefined);
    });

    it("correctly rename assignNames of multiple levels", async () => {
        let core = await createTestCore({
            doenetML: `
    <select name="select1">
      <option>
    
        <p>q,r = <select assignNames='(q  r)'>
          <option><text>a</text><text>b</text></option>
        </select></p>
    
    
        <p>q2 = $q</p>
        <p>r2 = $r</p>
      </option>
    </select>
    
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let replacements =
            stateVariables[
                stateVariables["/select1"].replacements![0].componentName
            ].replacements!;

        let p1 = replacements[1].componentName;
        let p2 = replacements[3].componentName;
        let p3 = replacements[5].componentName;

        expect(stateVariables[p1].stateValues.text).eq(`q,r = ab`);
        expect(stateVariables[p2].stateValues.text).eq(`q2 = a`);
        expect(stateVariables[p3].stateValues.text).eq(`r2 = b`);
    });

    it("display error when miss a name in selectForVariants, inside text", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl variantNames="apple banana cherry" numVariants="3" />
    
    <p>We have a <text><select>
      <option selectForVariants="apple">apple</option>
      <option selectForVariants="cherry">cherry</option>
    </select></text>!</p>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Some variants are specified for select but no options are specified for possible variant name: banana",
        );
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(24);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });

    it("display error when repeat name in selectForVariants more times than numToSelect, inside p", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl variantNames="apple banana cherry" numVariants="3" />
    
    <p>We have a <select>
      <option selectForVariants="apple">apple</option>
      <option selectForVariants="apple">cherry</option>
    </select>!</p>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Invalid variant name for select.  Variant name apple appears in 2 options but number to select is 1",
        );
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(18);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });

    it("display error when repeat name in selectForVariants more times than numToSelect, inside document", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl variantNames="apple banana" numVariants="2" />
    
    We have a <select>
      <option selectForVariants="apple">apple</option>
      <option selectForVariants="banana">banana</option>
      <option selectForVariants="donut">donut</option>
    </select>!
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Variant name donut that is specified for select is not a possible variant name",
        );
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(15);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(8);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });

    it("display error when numToSelect is larger than number of options, inside graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>No points for graph!</p>

    <graph><select numToSelect="3">
      <option><point>(3,4)</point></option>
      <option><point>(5,6)</point></option>
    </select></graph>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Cannot select 3 components from only 2",
        );
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(12);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });

    it("numToSelect from selectFromSequence", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>vars = <select type="text" name="vars1" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1">u v w x y z</select></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>vars = <select type="text" name="vars2" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2">u v w x y z</select></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>vars = <select type="text" name="vars3" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3">u v w x y z</select></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>vars = <select type="text" name="vars4" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4">u v w x y z</select></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>vars = <select type="text" name="vars5" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5">u v w x y z</select></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let n1 = stateVariables["/n1"].stateValues.value;
        let n2 = stateVariables["/n2"].stateValues.value;
        let n3 = stateVariables["/n3"].stateValues.value;
        let n4 = stateVariables["/n4"].stateValues.value;
        let n5 = stateVariables["/n5"].stateValues.value;

        let vars1 = stateVariables["/vars1"].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentName].replacements![0]
                        .componentName
                ].stateValues.value,
        );
        let vars2 = stateVariables["/vars2"].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentName].replacements![0]
                        .componentName
                ].stateValues.value,
        );
        let vars3 = stateVariables["/vars3"].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentName].replacements![0]
                        .componentName
                ].stateValues.value,
        );
        let vars4 = stateVariables["/vars4"].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentName].replacements![0]
                        .componentName
                ].stateValues.value,
        );
        let vars5 = stateVariables["/vars5"].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentName].replacements![0]
                        .componentName
                ].stateValues.value,
        );

        expect(vars1.length).eq(n1);
        expect(vars2.length).eq(n2);
        expect(vars3.length).eq(n3);
        expect(vars4.length).eq(n4);
        expect(vars5.length).eq(n5);

        vars1.length = 5;
        vars2.length = 5;
        vars3.length = 5;
        vars4.length = 5;
        vars5.length = 5;

        vars1.fill("", n1);
        vars2.fill("", n2);
        vars3.fill("", n3);
        vars4.fill("", n4);
        vars5.fill("", n5);

        let l = ["a", "b", "c", "d", "e"];

        expect(stateVariables["/p1"].stateValues.text).eq(
            vars1.map((v, i) => `${l[i]}1=${v}`).join(", "),
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            vars2.map((v, i) => `${l[i]}2=${v}`).join(", "),
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            vars3.map((v, i) => `${l[i]}3=${v}`).join(", "),
        );
        expect(stateVariables["/p4"].stateValues.text).eq(
            vars4.map((v, i) => `${l[i]}4=${v}`).join(", "),
        );
        expect(stateVariables["/p5"].stateValues.text).eq(
            vars5.map((v, i) => `${l[i]}5=${v}`).join(", "),
        );
    });

    it("add level to assign names even in shadow", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><select name="s" assignnames="q">a b</select></p>
    <copy target="p1" name="c" newNamespace />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let q = stateVariables["/q"].stateValues.value.tree;

        expect(stateVariables["/c/q"].stateValues.value.tree).eq(q);
    });

    it("ensure unique names", async () => {
        let core = await createTestCore({
            doenetML: `
    <select numToSelect="3" withReplacement>
      <option><p>What is <text>this</text>?</p></option>
    </select>
    
    <select numToSelect="3" withReplacement assignNames="A B C">
      <option><p>What is <text>this</text>?</p></option>
    </select>
    
    <select numToSelect="3" withReplacement assignNames="(D) (E) (F)">
      <option><p>What is <text>this</text>?</p></option>
    </select>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let pNames1 = stateVariables["/_select1"].replacements!.map(
            (x) =>
                stateVariables[x.componentName].replacements![0].componentName,
        );
        for (let pn of pNames1) {
            expect(stateVariables[pn].stateValues.text).eq("What is this?");
        }

        let pNames2 = ["/A", "/B", "/C"].map(
            (x) => stateVariables[x].replacements![0].componentName,
        );
        for (let pn of pNames2) {
            expect(stateVariables[pn].stateValues.text).eq("What is this?");
        }

        for (let pn of ["/D", "/E", "/F"]) {
            expect(stateVariables[pn].stateValues.text).eq("What is this?");
        }
    });
});
