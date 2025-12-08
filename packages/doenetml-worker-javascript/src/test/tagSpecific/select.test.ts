import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
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
        select_name,
        num_to_select,
        num_option_children,
        option_child_names,
        valid_values_by_option_child,
        num_samples,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        select_name: string;
        num_to_select: number;
        num_option_children: number;
        option_child_names?: string[];
        valid_values_by_option_child: any[][];
        num_samples: number;
        must_be_distinct?: boolean;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let select_num = 0; select_num < num_to_select; select_num++) {
                for (
                    let option_num = 0;
                    option_num < num_option_children;
                    option_num++
                ) {
                    const child_idx = await resolvePathToNodeIdx(
                        `${select_name}[${select_num + 1}][${option_num + 1}]`,
                    );
                    const value = stateVariables[child_idx].stateValues.value;

                    expect(
                        is_math
                            ? valid_values_by_option_child[option_num].some(
                                  (v) => v.equals(value),
                              )
                            : valid_values_by_option_child[option_num].includes(
                                  value,
                              ),
                    ).eq(
                        true,
                        `Expected ${value} to be in ${valid_values_by_option_child[option_num]}`,
                    );

                    let option_child_idx = option_child_names
                        ? await resolvePathToNodeIdx(
                              `${select_name}[${select_num + 1}].${option_child_names[option_num]}`,
                          )
                        : null;

                    if (option_child_idx != null) {
                        expect(option_child_idx).eq(child_idx);
                    }
                }
            }

            if (must_be_distinct) {
                for (
                    let option_num = 0;
                    option_num < num_option_children;
                    option_num++
                ) {
                    for (
                        let select_num1 = 0;
                        select_num1 < num_to_select;
                        select_num1++
                    ) {
                        const val1 =
                            stateVariables[
                                await resolvePathToNodeIdx(
                                    `${select_name}[${select_num1 + 1}][${option_num + 1}]`,
                                )
                            ].stateValues.value;
                        for (
                            let select_num2 = 0;
                            select_num2 < num_to_select;
                            select_num2++
                        ) {
                            if (select_num2 !== select_num1) {
                                const val2 =
                                    stateVariables[
                                        await resolvePathToNodeIdx(
                                            `${select_name}[${select_num2 + 1}][${option_num + 1}]`,
                                        )
                                    ].stateValues.value;
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
    }

    async function test_combined_values({
        doenetML,
        select_name,
        num_to_select,
        num_option_children,
        option_child_names,
        valid_combinations,
        num_samples,
        is_math = false,
    }: {
        doenetML: string;
        select_name: string;
        num_to_select: number;
        num_option_children: number;
        option_child_names?: string[];
        valid_combinations: any[][];
        num_samples: number;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let select_num = 0; select_num < num_to_select; select_num++) {
                const values: any[] = [];

                for (
                    let option_num = 0;
                    option_num < num_option_children;
                    option_num++
                ) {
                    const child_idx = await resolvePathToNodeIdx(
                        `${select_name}[${select_num + 1}][${option_num + 1}]`,
                    );
                    values.push(stateVariables[child_idx].stateValues.value);

                    let option_child_idx = option_child_names
                        ? await resolvePathToNodeIdx(
                              `${select_name}[${select_num + 1}].${option_child_names[option_num]}`,
                          )
                        : null;

                    if (option_child_idx != null) {
                        expect(option_child_idx).eq(child_idx);
                    }
                }

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
    }

    it("no parameters, select doesn't do anything", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><select/></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].activeChildren
                .length,
        ).eq(0);
    });

    it("select single math", async () => {
        const doenetML = `
    <select name="sel">
      <option><math name="x">u</math></option>
      <option><math name="x">v</math></option>
      <option><math name="x">w</math></option>
      <option><math name="x">x</math></option>
      <option><math name="x">y</math></option>
      <option><math name="x">z</math></option>
    </select>`;
        const valid_values_by_option_child = [
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
        ];

        await test_values_separately({
            doenetML,
            valid_values_by_option_child,
            select_name: "sel",
            num_to_select: 1,
            num_option_children: 1,
            option_child_names: ["x"],
            num_samples: 10,
            is_math: true,
        });
    });

    it("select multiple maths", async () => {
        const doenetML = `
    <select name="sel" numToSelect="3">
      <option><math name="x">u</math></option>
      <option><math name="x">v</math></option>
      <option><math name="x">w</math></option>
      <option><math name="x">x</math></option>
      <option><math name="x">y</math></option>
      <option><math name="x">z</math></option>
    </select>`;

        const valid_values_by_option_child = [
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
        ];

        await test_values_separately({
            doenetML,
            valid_values_by_option_child,
            select_name: "sel",
            num_to_select: 3,
            num_option_children: 1,
            option_child_names: ["x"],
            num_samples: 10,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select multiple maths, initially unresolved", async () => {
        const doenetML = `
    <select name="sel" numToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>

    <number extend="$n3" name="n2" />
    <math extend="$num1" name="n" />
    <math name="num1">$n2+$num2</math>
    <math name="num2">$n3+$num3</math>
    <number extend="$num3" name="n3" />
    <number name="num3">1</number>`;

        const valid_values_by_option_child = [
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
        ];

        await test_values_separately({
            doenetML,
            valid_values_by_option_child,
            select_name: "sel",
            num_to_select: 3,
            num_option_children: 1,
            num_samples: 10,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select multiple maths, with replacement", async () => {
        const doenetML = `
    <select name="s" numToSelect="5" withReplacement>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>`;

        const valid_values_by_option_child = [
            [
                me.fromText("u"),
                me.fromText("v"),
                me.fromText("w"),
                me.fromText("x"),
                me.fromText("y"),
                me.fromText("z"),
            ],
        ];

        await test_values_separately({
            doenetML,
            valid_values_by_option_child,
            select_name: "s",
            num_option_children: 1,
            num_to_select: 5,
            num_samples: 10,
            is_math: true,
        });
    });

    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><select name="s" numToSelect="5" type="number">175 176 177 178 179 180 181</select></p>
    <p name="p2"><select extend="$s" name="s2" asList="false" /></p>

    `,
        });

        let results: number[] = [];

        let stateVariables = await core.returnAllStateVariables(false, true);

        results.push(
            stateVariables[await resolvePathToNodeIdx("s[1][1]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[2][1]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[3][1]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[4][1]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[5][1]")].stateValues
                .value,
        );

        for (let num of results) {
            expect([175, 176, 177, 178, 179, 180, 181].includes(num)).eq(true);
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(results.join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(results.join(""));
    });

    it("copies don't resample", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1">
    <select name="sample1" type="number">1 2 3 4 5 6 7</select>
    <select name="sample2" type="number">1 2 3 4 5 6 7</select>
    </p>

    <p>
        <select extend="$sample1" name="noresample1" />
        <select extend="$sample2" name="noresample2" />
        <select extend="$noresample1" name="noreresample1" />
        <select extend="$noresample2" name="noreresample2" />
    </p>

    <p extend="$p1" name="noresamplep"/>

    <p extend="$noresamplep" name="noreresamplep"/>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let num1 =
            stateVariables[await resolvePathToNodeIdx("sample1[1][1]")]
                .stateValues.value;
        let num2 =
            stateVariables[await resolvePathToNodeIdx("sample2[1][1]")]
                .stateValues.value;
        expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 7).eq(true);
        expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 7).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("noresample1[1][1]")]
                .stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[await resolvePathToNodeIdx("noresample2[1][1]")]
                .stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[await resolvePathToNodeIdx("noreresample1[1][1]")]
                .stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[await resolvePathToNodeIdx("noreresample2[1][1]")]
                .stateValues.value,
        ).eq(num2);

        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noresamplep")]
                    .activeChildren[1].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noresamplep")]
                    .activeChildren[3].componentIdx
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noreresamplep")]
                    .activeChildren[1].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noreresamplep")]
                    .activeChildren[3].componentIdx
            ].stateValues.value,
        ).eq(num2);
    });

    it("select doesn't change dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
        let sampleReplacements =
            stateVariables[await resolvePathToNodeIdx("sample1")].replacements!;
        expect(sampleReplacements.length).eq(5);

        let sampleMaths = sampleReplacements.map(
            (x) =>
                stateVariables[
                    stateVariables[
                        stateVariables[x.componentIdx].replacements![0]
                            .componentIdx
                    ].replacements![0].componentIdx
                ].stateValues.value.tree,
        );

        for (let val of sampleMaths) {
            expect(["a", "b", "c"].includes(val)).eq(true);
        }

        // Nothing changes when change number to select
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("numToSelect"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sampleReplacements =
            stateVariables[await resolvePathToNodeIdx("sample1")].replacements!;

        expect(
            sampleReplacements.map(
                (x) =>
                    stateVariables[
                        stateVariables[
                            stateVariables[x.componentIdx].replacements![0]
                                .componentIdx
                        ].replacements![0].componentIdx
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
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        await updateMathInputValue({
            latex: newValues.b,
            componentIdx: await resolvePathToNodeIdx("y"),
            core,
        });
        await updateMathInputValue({
            latex: newValues.c,
            componentIdx: await resolvePathToNodeIdx("z"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sampleReplacements =
            stateVariables[await resolvePathToNodeIdx("sample1")].replacements!;

        let sampleMaths2 = sampleReplacements.map(
            (x) =>
                stateVariables[
                    stateVariables[
                        stateVariables[x.componentIdx].replacements![0]
                            .componentIdx
                    ].replacements![0].componentIdx
                ].stateValues.value.tree,
        );

        expect(sampleMaths2).eqls(sampleMaths.map((x) => newValues[x]));
    });

    it("select doesn't resample in dynamic repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <setup><sequence length="$mi1" name="s" /></setup>
    <p name="p1"><repeat name="repeat1" for="$s">
     <select name="n" type="number">1 2 3 4 5 6 7 8 9 10 11 12</select>
    </repeat></p>
    
    <p name="p2">$repeat1</p>

    <p extend="$p1" name="p3" />
    <p extend="$p2" name="p4" />

    <p extend="$p3" name="p5" />
    <p extend="$p4" name="p6" />
    `,
        });

        async function check_sampled_numbers(sampledNumbers: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p1")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p2")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p3")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p4")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p5")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p6")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);
        }

        let sampledNumbers: number[] = [];

        // initially nothing
        await check_sampled_numbers([]);

        // sample one variable
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        sampledNumbers.push(
            stateVariables[await resolvePathToNodeIdx("repeat1[1].n[1][1]")]
                .stateValues.value,
        );
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers([]);

        // get same number back
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers(sampledNumbers);

        // get two more samples
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        let n1 =
            stateVariables[await resolvePathToNodeIdx("repeat1[1].n[1][1]")]
                .stateValues.value;
        let n2 =
            stateVariables[await resolvePathToNodeIdx("repeat1[2].n[1][1]")]
                .stateValues.value;
        let n3 =
            stateVariables[await resolvePathToNodeIdx("repeat1[3].n[1][1]")]
                .stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        sampledNumbers.push(n2);
        sampledNumbers.push(n3);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers([]);

        // get first two numbers back
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers(sampledNumbers.slice(0, 2));

        // get six total samples
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        n1 =
            stateVariables[await resolvePathToNodeIdx("repeat1[1].n[1][1]")]
                .stateValues.value;
        n2 =
            stateVariables[await resolvePathToNodeIdx("repeat1[2].n[1][1]")]
                .stateValues.value;
        n3 =
            stateVariables[await resolvePathToNodeIdx("repeat1[3].n[1][1]")]
                .stateValues.value;
        let n4 =
            stateVariables[await resolvePathToNodeIdx("repeat1[4].n[1][1]")]
                .stateValues.value;
        let n5 =
            stateVariables[await resolvePathToNodeIdx("repeat1[5].n[1][1]")]
                .stateValues.value;
        let n6 =
            stateVariables[await resolvePathToNodeIdx("repeat1[6].n[1][1]")]
                .stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        expect(n2).eq(sampledNumbers[1]);
        expect(n3).eq(sampledNumbers[2]);
        sampledNumbers.push(n4);
        sampledNumbers.push(n5);
        sampledNumbers.push(n6);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers([]);

        // get all six back
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers(sampledNumbers);
    });

    it("select single group of maths", async () => {
        const doenetML = `
    <select name="sel">
        <option><math name="res1">u</math><math name="res2">v</math><math name="res3">w</math></option>
        <option><math name="res1">x</math><math name="res2">y</math><math name="res3">z</math></option>
        <option><math name="res1">a</math><math name="res2">b</math><math name="res3">c</math></option>
        <option><math name="res1">q</math><math name="res2">r</math><math name="res3">s</math></option>
    </select>`;

        const valid_combinations = [
            ["x", "y", "z"].map((x) => me.fromText(x)),
            ["u", "v", "w"].map((x) => me.fromText(x)),
            ["a", "b", "c"].map((x) => me.fromText(x)),
            ["q", "r", "s"].map((x) => me.fromText(x)),
        ];

        await test_combined_values({
            doenetML,
            select_name: "sel",
            num_to_select: 1,
            num_option_children: 3,
            option_child_names: ["res1", "res2", "res3"],
            valid_combinations,
            num_samples: 5,
            is_math: true,
        });
    });

    it("select multiple groups of math", async () => {
        const doenetML = `
    <select name="sel" numToSelect="3">
        <option><math name="res1">u</math><math name="res2">v</math><math name="res3">w</math></option>
        <option><math name="res1">x</math><math name="res2">y</math><math name="res3">z</math></option>
        <option><math name="res1">a</math><math name="res2">b</math><math name="res3">c</math></option>
        <option><math name="res1">q</math><math name="res2">r</math><math name="res3">s</math></option>
    </select>`;

        const valid_combinations = [
            ["x", "y", "z"].map((x) => me.fromText(x)),
            ["u", "v", "w"].map((x) => me.fromText(x)),
            ["a", "b", "c"].map((x) => me.fromText(x)),
            ["q", "r", "s"].map((x) => me.fromText(x)),
        ];

        await test_combined_values({
            doenetML,
            select_name: "sel",
            num_to_select: 3,
            num_option_children: 3,
            option_child_names: ["res1", "res2", "res3"],
            valid_combinations,
            num_samples: 4,
            is_math: true,
        });
    });

    it("references to outside components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select name="sel" numToSelect="5" withreplacement>
      <option><p>Option 1: <math>3$x1$y1</math></p></option>
      <option><p name="h">Option 2: <math>4$x2$y2</math></p></option>
      <option><p name="l">Option 3: <math>5$x3$y3</math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    <p extend="$sel[1]" name="q2" />
    <p extend="$sel[2]" name="r2" />
    <p extend="$sel[3]" name="s2" />
    <p extend="$sel[4]" name="t2" />
    <p extend="$sel[5]" name="u2" />

    `,
        });

        let option = {
            "Option 1: ": me.fromText("3xa"),
            "Option 2: ": me.fromText("4yb"),
            "Option 3: ": me.fromText("5zc"),
        };

        let stateVariables = await core.returnAllStateVariables(false, true);

        let q2 =
            stateVariables[await resolvePathToNodeIdx("q2")].activeChildren;
        let q2string = q2[0];
        let q2math = me.fromAst(
            stateVariables[q2[1].componentIdx].stateValues.value,
        );
        expect(q2math.equals(option[q2string])).eq(true);

        let r2 =
            stateVariables[await resolvePathToNodeIdx("r2")].activeChildren;
        let r2string = r2[0];
        let r2math = me.fromAst(
            stateVariables[r2[1].componentIdx].stateValues.value,
        );
        expect(r2math.equals(option[r2string])).eq(true);

        let s2 =
            stateVariables[await resolvePathToNodeIdx("s2")].activeChildren;
        let s2string = s2[0];
        let s2math = me.fromAst(
            stateVariables[s2[1].componentIdx].stateValues.value,
        );
        expect(s2math.equals(option[s2string])).eq(true);

        let t2 =
            stateVariables[await resolvePathToNodeIdx("t2")].activeChildren;
        let t2string = t2[0];
        let t2math = me.fromAst(
            stateVariables[t2[1].componentIdx].stateValues.value,
        );
        expect(t2math.equals(option[t2string])).eq(true);

        let u2 =
            stateVariables[await resolvePathToNodeIdx("u2")].activeChildren;
        let u2string = u2[0];
        let u2math = me.fromAst(
            stateVariables[u2[1].componentIdx].stateValues.value,
        );
        expect(u2math.equals(option[u2string])).eq(true);
    });

    it("internal references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="s1" numToSelect="5" withreplacement>
      <option><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + $x^2$z1^3</math></p></option>
      <option><p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + $x^2$z2^3</math></p></option>
      <option><p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + $x^2$z3^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    <p extend="$s1[1]" name="q2" />
    <p extend="$s1[2]" name="r2" />
    <p extend="$s1[3]" name="s2" />
    <p extend="$s1[4]" name="t2" />
    <p extend="$s1[5]" name="u2" />

    <p>Copy x from within selection options</p>
    <p><math extend="$s1[1].x" name="qx" /></p>
    <p><math extend="$s1[2].x" name="rx" /></p>
    <p><math extend="$s1[3].x" name="sx" /></p>
    <p><math extend="$s1[4].x" name="tx" /></p>
    <p><math extend="$s1[5].x" name="ux" /></p>

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
            stateVariables[await resolvePathToNodeIdx("q2")].activeChildren;
        let q2string = q2[0];
        let q2math = stateVariables[q2[1].componentIdx].stateValues.value;
        expect(q2math.equals(option[q2string])).eq(true);
        let qx =
            stateVariables[await resolvePathToNodeIdx("qx")].stateValues.value
                .tree;
        expect(qx).eq(xoption[q2string]);
        let repeatqmath =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("repeat")]
                        .activeChildren[0].componentIdx
                ].activeChildren[1].componentIdx
            ].stateValues.value;
        expect(repeatqmath.equals(option[q2string])).eq(true);

        let r2 =
            stateVariables[await resolvePathToNodeIdx("r2")].activeChildren;
        let r2string = r2[0];
        let r2math = stateVariables[r2[1].componentIdx].stateValues.value;
        expect(r2math.equals(option[r2string])).eq(true);
        let rx =
            stateVariables[await resolvePathToNodeIdx("rx")].stateValues.value
                .tree;
        expect(rx).eq(xoption[r2string]);
        let repeatrmath =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("repeat")]
                        .activeChildren[1].componentIdx
                ].activeChildren[1].componentIdx
            ].stateValues.value;
        expect(repeatrmath.equals(option[r2string])).eq(true);

        let s2 =
            stateVariables[await resolvePathToNodeIdx("s2")].activeChildren;
        let s2string = s2[0];
        let s2math = stateVariables[s2[1].componentIdx].stateValues.value;
        expect(s2math.equals(option[s2string])).eq(true);
        let sx =
            stateVariables[await resolvePathToNodeIdx("sx")].stateValues.value
                .tree;
        expect(sx).eq(xoption[s2string]);
        let repeatsmath =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("repeat")]
                        .activeChildren[2].componentIdx
                ].activeChildren[1].componentIdx
            ].stateValues.value;
        expect(repeatsmath.equals(option[s2string])).eq(true);

        let t2 =
            stateVariables[await resolvePathToNodeIdx("t2")].activeChildren;
        let t2string = t2[0];
        let t2math = stateVariables[t2[1].componentIdx].stateValues.value;
        expect(t2math.equals(option[t2string])).eq(true);
        let tx =
            stateVariables[await resolvePathToNodeIdx("tx")].stateValues.value
                .tree;
        expect(tx).eq(xoption[t2string]);
        let repeattmath =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("repeat")]
                        .activeChildren[3].componentIdx
                ].activeChildren[1].componentIdx
            ].stateValues.value;
        expect(repeattmath.equals(option[t2string])).eq(true);

        let u2 =
            stateVariables[await resolvePathToNodeIdx("u2")].activeChildren;
        let u2string = u2[0];
        let u2math = stateVariables[u2[1].componentIdx].stateValues.value;
        expect(u2math.equals(option[u2string])).eq(true);
        let ux =
            stateVariables[await resolvePathToNodeIdx("ux")].stateValues.value
                .tree;
        expect(ux).eq(xoption[u2string]);
        let repeatumath =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("repeat")]
                        .activeChildren[4].componentIdx
                ].activeChildren[1].componentIdx
            ].stateValues.value;
        expect(repeatumath.equals(option[u2string])).eq(true);
    });

    it("variant names specified, select single", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <variantControl numVariants="5" variantNames="aVocado  broCColi   carrot  Dill eggplanT"/>

    <p>Selected variable:
    <select name="s1">
      <option selectForVariants="dill"><math>d</math></option>
      <option selectForVariants="Carrot"><math>c</math></option>
      <option selectForVariants="eggPlant"><math>e</math></option>
      <option selectForVariants="avocadO"><math>a</math></option>
      <option selectForVariants="broccOli"><math>b</math></option>
    </select>
    </p>

    <p>Selected variable repeated: <math extend="$s1" name="x2" /></p>
    <p>Selected variable repeated again: <select extend="$s1" name="s3" /></p>
    `,
            requestedVariantIndex: 2,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // let variantName = stateVariables[0].sharedParameters.variantName;
        // let expectedx = variantName.substring(0, 1);
        let expectedx = "b";

        let x =
            stateVariables[await resolvePathToNodeIdx("s1[1][1]")].stateValues
                .value.tree;

        expect(x).eq(expectedx);

        let xorig =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s1")]
                        .replacements![0].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(xorig).eq(expectedx);

        let x2 =
            stateVariables[await resolvePathToNodeIdx("x2")].stateValues.value
                .tree;
        expect(x2).eq(expectedx);

        let s3 =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s3")]
                        .replacements![0].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(s3).eq(expectedx);
    });

    it("variant names specified, select multiple", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <variantControl numVariants="5" variantNames="avocado  brOccoli   carrot  dill    eggPlant  "/>

    <p>Selected variables:
    <select name="s1" numToSelect="3">
      <option selectForVariants="dill  carrot  avocado"><math>d</math></option>
      <option selectForVariants="cArrOt eggplant eggplant"><math>c</math></option>
      <option selectForVariants="eggplant  broccoli  dilL"><math>e</math></option>
      <option selectForVariants="aVocado   avocado   broccoli"><math>a</math></option>
      <option selectForVariants="  broccoli     caRRot     dill    "><math>b</math></option>
    </select>
    </p>

    <p>Selected first variable: <math extend="$s1[1]" name="x2" /></p>
    <p>Selected second variable: <math extend="$s1[2]" name="y2" /></p>
    <p>Selected third variable: <math extend="$s1[3]" name="z2" /></p>
    <p>Selected variables repeated: <select extend="$s1" name="s2" /></p>

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

        // let variantName = stateVariables[0].sharedParameters.variantName;
        let variantName = "carrot";
        let variantVars = variantMap[variantName];

        let x =
            stateVariables[await resolvePathToNodeIdx("s1[1][1]")].stateValues
                .value.tree;

        expect(variantVars.includes(x)).eq(true);
        variantVars.splice(variantVars.indexOf(x), 1);

        let y =
            stateVariables[await resolvePathToNodeIdx("s1[2][1]")].stateValues
                .value.tree;
        expect(variantVars.includes(y)).eq(true);
        variantVars.splice(variantVars.indexOf(y), 1);

        let z =
            stateVariables[await resolvePathToNodeIdx("s1[3][1]")].stateValues
                .value.tree;
        expect(z).eq(variantVars[0]);

        let xorig =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s1")]
                        .replacements![0].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(xorig).eq(x);
        let yorig =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s1")]
                        .replacements![1].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(yorig).eq(y);
        let zorig =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s1")]
                        .replacements![2].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(zorig).eq(z);

        let x2 =
            stateVariables[await resolvePathToNodeIdx("x2")].stateValues.value
                .tree;
        expect(x2).eq(x);
        let y2 =
            stateVariables[await resolvePathToNodeIdx("y2")].stateValues.value
                .tree;
        expect(y2).eq(y);
        let z2 =
            stateVariables[await resolvePathToNodeIdx("z2")].stateValues.value
                .tree;
        expect(z2).eq(z);

        let x3 =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s2")]
                        .replacements![0].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(x3).eq(x);
        let y3 =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s2")]
                        .replacements![1].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(y3).eq(y);
        let z3 =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("s2")]
                        .replacements![2].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value.tree;
        expect(z3).eq(z);
    });

    it("select math as sugared string", async () => {
        const doenetML = `
    <select type="math" numToSelect="5" name="sel">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>`;

        const valid_values_by_option_child = [
            ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map((x) =>
                me.fromText(x),
            ),
        ];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 5,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select math as sugared string, no type specified", async () => {
        const doenetML = `
    <select numToSelect="5" name="sel">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>`;

        const valid_values_by_option_child = [
            ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map((x) =>
                me.fromText(x),
            ),
        ];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 5,
            num_option_children: 1,
            valid_values_by_option_child,
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
    <select numToSelect="6" name="sel">
      $a$var1^2  $b$var1/$var2  u-$b  $a  $var1-c $var2
    </select>`;

        const valid_values_by_option_child = [
            ["7x^2", "(-3)x/y", "u-(-3)", "7", "x-c", "y"].map((x) =>
                me.fromText(x),
            ),
        ];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 6,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select text as sugared string", async () => {
        const doenetML = `
    <select type="text" numToSelect="5" name="sel">
      Lorem  ipsum  dolor  sit  amet  consectetur  adipiscing  elit
    </select>`;

        const valid_values_by_option_child = [
            [
                "Lorem",
                "ipsum",
                "dolor",
                "sit",
                "amet",
                "consectetur",
                "adipiscing",
                "elit",
            ],
        ];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 5,
            num_option_children: 1,
            valid_values_by_option_child,
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
    <select type="text" name="sel" numToSelect="5">
      Lorem  ipsum$spaceD  sit  $a  $cSpace
    </select>`;

        const valid_values_by_option_child = [
            ["Lorem", "ipsum dolor", "sit", "amet", "consectetur "],
        ];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 5,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 2,
            must_be_distinct: true,
        });
    });

    it("select number as sugared string", async () => {
        const doenetML = `
    <select type="number" name="sel" numToSelect="10" withReplacement>
      2 3 5 7 11 13 17 19
    </select>`;

        const valid_values_by_option_child = [[2, 3, 5, 7, 11, 13, 17, 19]];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 10,
            num_option_children: 1,
            valid_values_by_option_child,
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
    <select type="number" name="sel" numToSelect="6">
      2 $a+$b 3-$c $a $b-1 $c
    </select>`;

        const valid_values_by_option_child = [[2, -2, -5, 5, -8, 8]];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 6,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 2,
            must_be_distinct: true,
        });
    });

    it("select boolean as sugared string", async () => {
        const doenetML = `
    <select type="boolean" name="sel" numToSelect="10" withReplacement>
      true false
    </select>`;

        const valid_values_by_option_child = [[true, false]];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 10,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 1,
        });
    });

    it("select boolean as sugared strings and macros", async () => {
        const doenetML = `
    <setup>
      <boolean name="t">true</boolean>
      <boolean name="f">false</boolean>
    </setup>
    <select type="boolean" name="sel" numToSelect="10" withReplacement>
       true false $t $f
    </select>`;

        const valid_values_by_option_child = [[true, false]];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 10,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 1,
        });
    });

    it("select invalid type with sugared string, becomes math with warning", async () => {
        const doenetML = `
    <select type="nothing" name="sel" numToSelect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>`;

        const valid_values_by_option_child = [
            ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map((x) =>
                me.fromText(x),
            ),
        ];

        await test_values_separately({
            doenetML,
            select_name: "sel",
            num_to_select: 5,
            num_option_children: 1,
            valid_values_by_option_child,
            num_samples: 2,
            is_math: true,
            must_be_distinct: true,
        });

        // TODO: uncomment the rest of the test when have have warnings in new sugar and implemented for select sugar.
        // See issue #476.

        // let { core } = await createTestCore({ doenetML });

        // let errorWarnings = core.core!.errorWarnings;

        // expect(errorWarnings.errors.length).eq(0);
        // expect(errorWarnings.warnings.length).eq(1);

        // expect(errorWarnings.warnings[0].message).contain(
        //     "Invalid type for select: nothing",
        // );
        // expect(errorWarnings.warnings[0].position.start.line).eq(2);
        // expect(errorWarnings.warnings[0].position.start.column).eq(5);
        // expect(errorWarnings.warnings[0].position.end.line).eq(4);
        // expect(errorWarnings.warnings[0].position.end.column).eq(13);
    });

    it("select weighted", async () => {
        // TODO: this test seems to fail with num Y < 17 once in awhile
        // even though it should fail less than 0.1% of the time
        // Is there a flaw?

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <setup><sequence length="200" name="s" /></setup>
        <repeat for="$s" name="repeat1">
          <select>
            <option selectweight="0.2"><text>x</text></option>
            <option><text>y</text></option>
            <option selectweight="5"><text>z</text></option>
          </select>
        </repeat>
        `,
        });

        let numX = 0,
            numY = 0,
            numZ = 0;

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let ind = 0; ind < 200; ind++) {
            let theText =
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${ind + 1}][1][1][1]`)
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select numToSelect="200" withreplacement name="sel">
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
        for (let ind = 0; ind < 200; ind++) {
            let x =
                stateVariables[await resolvePathToNodeIdx(`sel[${ind + 1}][1]`)]
                    .stateValues.value;
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <setup><sequence length="200" name="s" /></setup>
        <repeat for="$s" name="repeat1">
          <select numToSelect="2">
            <option selectweight="0.1"><text>u</text></option>
            <option selectweight="0.1"><text>v</text></option>
            <option selectweight="0.1"><text>w</text></option>
            <option selectweight="5"><text>x</text></option>
            <option><text>y</text></option>
            <option selectweight="10"><text>z</text></option>
          </select>
        </repeat>
        `,
        });

        let numX = 0,
            numY = 0,
            numZ = 0,
            numUVW = 0;

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let ind = 0; ind < 200; ind++) {
            let theText1 =
                stateVariables[
                    await resolvePathToNodeIdx(`repeat1[${ind + 1}][1][1][1]`)
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
                    await resolvePathToNodeIdx(`repeat1[${ind + 1}][1][2][1]`)
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

    it("references to internal components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="o" numToSelect="7" withreplacement>
      <option><p><setup><select name="s" type="text" numToSelect="2">a e i o u</select></setup><text extend="$s[1]" name="q" /><text extend="$s[2]" name="r" /><text extend="$q" name="q2" /><text extend="$r" name="r2" /></p></option>
      <option><p><setup><selectFromSequence type="letters" name="s" numToSelect="2" from="a" to="z" /></setup><text extend="$s[1]" name="q" /><text extend="$s[2]" name="r" /><text extend="$q" name="q2" /><text extend="$r" name="r2" /></p></option>
      <option><p><text name="q">z</text><selectFromSequence type="letters" name="r" numToSelect="1" from="u" to="z" /><text extend="$q" name="q2" /><text extend="$r" name="r2" /></p></option>
      <option><p><text name="q">q</text><text name="r">r</text><text extend="$q" name="q2" /><text extend="$r" name="r2" /></p></option>
    </select>

    <p>Selected options repeated</p>
    <p extend="$o[1]" name="q2" />
    <p extend="$o[2]" name="r2" />
    <p extend="$o[3]" name="s2" />
    <p extend="$o[4]" name="t2" />
    <p extend="$o[5]" name="u2" />
    <p extend="$o[6]" name="v2" />
    <p extend="$o[7]" name="w2" />

    <p>Copy q and r and their copies from within selected options</p>
    <p><text extend="$o[1].q" name="qq"/><text extend="$o[1].r" name="qr"/><text extend="$o[1].q2" name="qq2"/><text extend="$o[1].r2" name="qr2"/></p>
    <p><text extend="$o[2].q" name="rq"/><text extend="$o[2].r" name="rr"/><text extend="$o[2].q2" name="rq2"/><text extend="$o[2].r2" name="rr2"/></p>
    <p><text extend="$o[3].q" name="sq"/><text extend="$o[3].r" name="sr"/><text extend="$o[3].q2" name="sq2"/><text extend="$o[3].r2" name="sr2"/></p>
    <p><text extend="$o[4].q" name="tq"/><text extend="$o[4].r" name="tr"/><text extend="$o[4].q2" name="tq2"/><text extend="$o[4].r2" name="tr2"/></p>
    <p><text extend="$o[5].q" name="uq"/><text extend="$o[5].r" name="ur"/><text extend="$o[5].q2" name="uq2"/><text extend="$o[5].r2" name="ur2"/></p>
    <p><text extend="$o[6].q" name="vq"/><text extend="$o[6].r" name="vr"/><text extend="$o[6].q2" name="vq2"/><text extend="$o[6].r2" name="vr2"/></p>
    <p><text extend="$o[7].q" name="wq"/><text extend="$o[7].r" name="wr"/><text extend="$o[7].q2" name="wq2"/><text extend="$o[7].r2" name="wr2"/></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let qs = stateVariables[
            await resolvePathToNodeIdx("o[1][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        //console.log({ qs });
        let rs = stateVariables[
            await resolvePathToNodeIdx("o[2][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        //console.log({ rs });
        let ss = stateVariables[
            await resolvePathToNodeIdx("o[3][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let ts = stateVariables[
            await resolvePathToNodeIdx("o[4][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let us = stateVariables[
            await resolvePathToNodeIdx("o[5][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let vs = stateVariables[
            await resolvePathToNodeIdx("o[6][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let ws = stateVariables[
            await resolvePathToNodeIdx("o[7][1]")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        let q2s = stateVariables[
            await resolvePathToNodeIdx("q2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let r2s = stateVariables[
            await resolvePathToNodeIdx("r2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let s2s = stateVariables[
            await resolvePathToNodeIdx("s2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let t2s = stateVariables[
            await resolvePathToNodeIdx("t2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let u2s = stateVariables[
            await resolvePathToNodeIdx("u2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let v2s = stateVariables[
            await resolvePathToNodeIdx("v2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let w2s = stateVariables[
            await resolvePathToNodeIdx("w2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect(q2s).eqls(qs);
        expect(r2s).eqls(rs);
        expect(s2s).eqls(ss);
        expect(t2s).eqls(ts);
        expect(u2s).eqls(us);
        expect(v2s).eqls(vs);
        expect(w2s).eqls(ws);

        let q3s = [
            stateVariables[await resolvePathToNodeIdx("qq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("qr")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("qq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("qr2")].stateValues.value,
        ];
        let r3s = [
            stateVariables[await resolvePathToNodeIdx("rq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("rr")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("rq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("rr2")].stateValues.value,
        ];
        let s3s = [
            stateVariables[await resolvePathToNodeIdx("sq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("sr")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("sq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("sr2")].stateValues.value,
        ];
        let t3s = [
            stateVariables[await resolvePathToNodeIdx("tq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("tr")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("tq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("tr2")].stateValues.value,
        ];
        let u3s = [
            stateVariables[await resolvePathToNodeIdx("uq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("ur")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("uq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("ur2")].stateValues.value,
        ];
        let v3s = [
            stateVariables[await resolvePathToNodeIdx("vq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("vr")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("vq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("vr2")].stateValues.value,
        ];
        let w3s = [
            stateVariables[await resolvePathToNodeIdx("wq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("wr")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("wq2")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("wr2")].stateValues.value,
        ];

        expect(q3s).eqls(qs);
        expect(r3s).eqls(rs);
        expect(s3s).eqls(ss);
        expect(t3s).eqls(ts);
        expect(u3s).eqls(us);
        expect(v3s).eqls(vs);
        expect(w3s).eqls(ws);
    });

    it("references to select of selects", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="o" numToSelect="5" withreplacement>
      <option><select name="s" numToSelect="2" type="text">a e i o u</select></option>
      <option><selectFromSequence type="letters" name="s" numToSelect="2" from="a" to="z" /></option>
    </select>

    <p>Selected options repeated</p>
    <group extend="$o[1]" name="q2" />
    <group extend="$o[2]" name="r2" />
    <group extend="$o[3]" name="s2" />
    <group extend="$o[4]" name="t2" />
    <group extend="$o[5]" name="u2" />

    <p>Copy x/q and x/r</p>
    <p><text extend="$o[1].s[1]" name="qq" /><text extend="$o[1].s[2]" name="qr" /></p>
    <p><text extend="$o[2].s[1]" name="rq" /><text extend="$o[2].s[2]" name="rr" /></p>
    <p><text extend="$o[3].s[1]" name="sq" /><text extend="$o[3].s[2]" name="sr" /></p>
    <p><text extend="$o[4].s[1]" name="tq" /><text extend="$o[4].s[2]" name="tr" /></p>
    <p><text extend="$o[5].s[1]" name="uq" /><text extend="$o[5].s[2]" name="ur" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        console.log("o[1][1] idx", await resolvePathToNodeIdx("o[1][1]"));
        let qs = stateVariables[await resolvePathToNodeIdx("o[1][1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );

        let rs = stateVariables[await resolvePathToNodeIdx("o[2][1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let ss = stateVariables[await resolvePathToNodeIdx("o[3][1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let ts = stateVariables[await resolvePathToNodeIdx("o[4][1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let us = stateVariables[await resolvePathToNodeIdx("o[5][1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );

        let q2s = stateVariables[await resolvePathToNodeIdx("q2[1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let r2s = stateVariables[await resolvePathToNodeIdx("r2[1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let s2s = stateVariables[await resolvePathToNodeIdx("s2[1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let t2s = stateVariables[await resolvePathToNodeIdx("t2[1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );
        let u2s = stateVariables[await resolvePathToNodeIdx("u2[1]")]
            .replacements!.map((x) => stateVariables[x.componentIdx])
            .map((x) =>
                x.replacements
                    ? stateVariables[x.replacements[0].componentIdx].stateValues
                          .value
                    : x.stateValues.value,
            );

        expect(q2s).eqls(qs);
        expect(r2s).eqls(rs);
        expect(s2s).eqls(ss);
        expect(t2s).eqls(ts);
        expect(u2s).eqls(us);

        let q3s = [
            stateVariables[await resolvePathToNodeIdx("qq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("qr")].stateValues.value,
        ];
        let r3s = [
            stateVariables[await resolvePathToNodeIdx("rq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("rr")].stateValues.value,
        ];
        let s3s = [
            stateVariables[await resolvePathToNodeIdx("sq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("sr")].stateValues.value,
        ];
        let t3s = [
            stateVariables[await resolvePathToNodeIdx("tq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("tr")].stateValues.value,
        ];
        let u3s = [
            stateVariables[await resolvePathToNodeIdx("uq")].stateValues.value,
            stateVariables[await resolvePathToNodeIdx("ur")].stateValues.value,
        ];

        expect(q3s).eqls(qs);
        expect(r3s).eqls(rs);
        expect(s3s).eqls(ss);
        expect(t3s).eqls(ts);
        expect(u3s).eqls(us);
    });

    it("references to select of selects of selects", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="o" numToSelect="3" withreplacement>
      <option><select name="p" numToSelect="3" withreplacement>
        <option><select type="text" name="s" numToSelect="2">a e i o u</select></option>
        <option><selectFromSequence type="letters" name="s" numToSelect="2" from="a" to="j" /></option>
      </select></option>
      <option><select name="p" numToSelect="3">
        <option><select type="text" name="s" numToSelect="2">v w x y z</select></option>
        <option><selectFromSequence type="letters" name="s" numToSelect="2" from="k" to="n" /></option>
        <option><selectFromSequence type="letters" name="s" numToSelect="2" from="x" to="z" /></option>
        <option><select type="text" name="s" numToSelect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2"><group extend="$o[1]" name="q2" /></p>
    <p name="pr2"><group extend="$o[2]" name="r2" /></p>
    <p name="ps2"><group extend="$o[3]" name="s2" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3"><group extend="$o[1].p[1]" name="qq" /><group extend="$o[1].p[2]" name="qr" /><group extend="$o[1].p[3]" name="qs" /></p>
    <p name="pr3"><group extend="$o[2].p[1]" name="rq" /><group extend="$o[2].p[2]" name="rr" /><group extend="$o[2].p[3]" name="rs" /></p>
    <p name="ps3"><group extend="$o[3].p[1]" name="sq" /><group extend="$o[3].p[2]" name="sr" /><group extend="$o[3].p[3]" name="ss" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4"><text extend="$o[1].p[1].s[1]" name="qqq" /><text extend="$o[1].p[1].s[2]" name="qqr" /><text extend="$o[1].p[2].s[1]" name="qrq" /><text extend="$o[1].p[2].s[2]" name="qrr" /><text extend="$o[1].p[3].s[1]" name="qsq" /><text extend="$o[1].p[3].s[2]" name="qsr" /></p>
    <p name="pr4"><text extend="$o[2].p[1].s[1]" name="rqq" /><text extend="$o[2].p[1].s[2]" name="rqr" /><text extend="$o[2].p[2].s[1]" name="rrq" /><text extend="$o[2].p[2].s[2]" name="rrr" /><text extend="$o[2].p[3].s[1]" name="rsq" /><text extend="$o[2].p[3].s[2]" name="rsr" /></p>
    <p name="ps4"><text extend="$o[3].p[1].s[1]" name="sqq" /><text extend="$o[3].p[1].s[2]" name="sqr" /><text extend="$o[3].p[2].s[1]" name="srq" /><text extend="$o[3].p[2].s[2]" name="srr" /><text extend="$o[3].p[3].s[1]" name="ssq" /><text extend="$o[3].p[3].s[2]" name="ssr" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const qs: any[] = [];

        for (let name of [
            "o[1].p[1].s[1]",
            "o[1].p[1].s[2]",
            "o[1].p[2].s[1]",
            "o[1].p[2].s[2]",
            "o[1].p[3].s[1]",
            "o[1].p[3].s[2]",
        ]) {
            const cIdx = await resolvePathToNodeIdx(name);
            qs.push(
                stateVariables[cIdx].replacements
                    ? stateVariables[
                          stateVariables[cIdx].replacements[0].componentIdx
                      ].stateValues.value
                    : stateVariables[cIdx].stateValues.value,
            );
        }

        const rs: any[] = [];

        for (let name of [
            "o[2].p[1].s[1]",
            "o[2].p[1].s[2]",
            "o[2].p[2].s[1]",
            "o[2].p[2].s[2]",
            "o[2].p[3].s[1]",
            "o[2].p[3].s[2]",
        ]) {
            const cIdx = await resolvePathToNodeIdx(name);
            rs.push(
                stateVariables[cIdx].replacements
                    ? stateVariables[
                          stateVariables[cIdx].replacements[0].componentIdx
                      ].stateValues.value
                    : stateVariables[cIdx].stateValues.value,
            );
        }

        const ss: any[] = [];

        for (let name of [
            "o[3].p[1].s[1]",
            "o[3].p[1].s[2]",
            "o[3].p[2].s[1]",
            "o[3].p[2].s[2]",
            "o[3].p[3].s[1]",
            "o[3].p[3].s[2]",
        ]) {
            const cIdx = await resolvePathToNodeIdx(name);
            ss.push(
                stateVariables[cIdx].replacements
                    ? stateVariables[
                          stateVariables[cIdx].replacements[0].componentIdx
                      ].stateValues.value
                    : stateVariables[cIdx].stateValues.value,
            );
        }

        expect(
            stateVariables[
                await resolvePathToNodeIdx("pq2")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(qs.join(""));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("pr2")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(rs.join(""));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ps2")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(ss.join(""));

        expect(
            stateVariables[
                await resolvePathToNodeIdx("pq3")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(qs.join(""));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("pr3")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(rs.join(""));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ps3")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(ss.join(""));

        expect(
            stateVariables[
                await resolvePathToNodeIdx("pq4")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(qs.join(""));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("pr4")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(rs.join(""));
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ps4")
            ].stateValues.text.replace(/, /g, ""),
        ).eq(ss.join(""));
    });

    it("references to named grandchildren's children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="o">
    <option>
      <math name="h1"><math name="w">x</math><math>y</math></math>
      <math simplify><math name="q">z</math> + 2<math extend="$q" name="v"/></math>
      $o.w
      $o.q
    </option>
    <option>
      <math name="h2"><math name="w">u</math><math>v</math></math>
      <math simplify><math name="q">t</math> + 2<math extend="$q" name="v"/></math>
      $o.w
      $o.q
    </option>
    </select>
    
    <p>Copy grandchidren</p>
    <p><math extend="$o[1][1]" name="a2" /></p>
    <p><math extend="$o[1][2]" name="b2" /></p>
    <p><math extend="$o[1][3]" name="c2" /></p>
    <p><math extend="$o[1][4]" name="d2" /></p>
    
    <p>Copy named children of grandchild</p>
    <p><math extend="$o.w" name="w2" /></p>
    <p><math extend="$o.v" name="v2" /></p>
    <p><math extend="$o[1].w" name="w3" /></p>
    <p><math extend="$o[1].v" name="v3" /></p>
    <p><math extend="$o[1][1].w" name="w4" /></p>
    <p><math extend="$o[1][2].v" name="v4" /></p>
    
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

        let chosenChildren = stateVariables[await resolvePathToNodeIdx("o[1]")]
            .replacements!.filter((x) => typeof x !== "string")
            .map((x) => stateVariables[x.componentIdx])
            .map((v, i) =>
                i < 2 ? v : stateVariables[v.replacements![0].componentIdx],
            );

        let option =
            options[
                stateVariables[await resolvePathToNodeIdx("o")].stateValues
                    .selectedIndices[0] - 1
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

        let a2 = me
            .fromAst(
                stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                    .value,
            )
            .toString();
        let b2 = me
            .fromAst(
                stateVariables[await resolvePathToNodeIdx("b2")].stateValues
                    .value,
            )
            .toString();
        let c2 = me
            .fromAst(
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .value,
            )
            .toString();
        let d2 = me
            .fromAst(
                stateVariables[await resolvePathToNodeIdx("d2")].stateValues
                    .value,
            )
            .toString();

        expect(a2).eq(option.a);
        expect(b2).eq(option.b);
        expect(c2).eq(option.c);
        expect(d2).eq(option.d);

        for (let i = 2; i <= 4; i++) {
            let v2 = me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx(`v${i}`)]
                        .stateValues.value,
                )
                .toString();
            let w2 = me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx(`w${i}`)]
                        .stateValues.value,
                )
                .toString();
            expect(v2).eq(option.v);
            expect(w2).eq(option.w);
        }
    });

    it("select of a repeat of a select, with references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><asList name="list1">
    <select name="o" numToSelect="3" withReplacement>
    <option><repeat name="r" for="x y" valueName="x">
        <select numToSelect="2" name="s">
          <option><math name="p">$x^2</math><math name="q">$x^6</math></option>
          <option><math name="p">$x^3</math><math name="q">$x^7</math></option>
          <option><math name="p">$x^4</math><math name="q">$x^8</math></option>
          <option><math name="p">$x^5</math><math name="q">$x^9</math></option>
        </select>
    </repeat></option>
    <option><repeat name="r" for="u v" valueName="x">
        <select numToSelect="2" name="s">
          <option><math name="p">$x 2</math><math name="q">$x 6</math></option>
          <option><math name="p">$x 3</math><math name="q">$x 7</math></option>
          <option><math name="p">$x 4</math><math name="q">$x 8</math></option>
          <option><math name="p">$x 5</math><math name="q">$x 9</math></option>
        </select>
    </repeat></option>
    </select>
    </asList></p>

    <p>Copy whole select again</p>
    <p><asList name="list2"><select extend="$o" name="o2" /></asList></p>

    <p>Copy individual selections</p>
    <p><asList name="list3">
    <repeat extend="$o[1].r" name="j2" />
    <repeat extend="$o[2].r" name="k2" />
    <repeat extend="$o[3].r" name="l2" />
    </asList></p>

    <p>Copy individual pieces</p>
    <p><asList name="list4">
    <math extend="$o[1].r[1].s[1].p" name="p1" /><math extend="$o[1].r[1].s[1].q" name="p2" /><math extend="$o[1].r[1].s[2].p" name="p3" /><math extend="$o[1].r[1].s[2].q" name="p4" />
    <math extend="$o[1].r[2].s[1].p" name="p5" /><math extend="$o[1].r[2].s[1].q" name="p6" /><math extend="$o[1].r[2].s[2].p" name="p7" /><math extend="$o[1].r[2].s[2].q" name="p8" />
    <math extend="$o[2].r[1].s[1].p" name="p9" /><math extend="$o[2].r[1].s[1].q" name="p10" /><math extend="$o[2].r[1].s[2].p" name="p11" /><math extend="$o[2].r[1].s[2].q" name="p12" />
    <math extend="$o[2].r[2].s[1].p" name="p13" /><math extend="$o[2].r[2].s[1].q" name="p14" /><math extend="$o[2].r[2].s[2].p" name="p15" /><math extend="$o[2].r[2].s[2].q" name="p16" />
    <math extend="$o[3].r[1].s[1].p" name="p17" /><math extend="$o[3].r[1].s[1].q" name="p18" /><math extend="$o[3].r[1].s[2].p" name="p19" /><math extend="$o[3].r[1].s[2].q" name="p20" />
    <math extend="$o[3].r[2].s[1].p" name="p21" /><math extend="$o[3].r[2].s[1].q" name="p22" /><math extend="$o[3].r[2].s[2].p" name="p23" /><math extend="$o[3].r[2].s[2].q" name="p24" />
    </asList></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let theList1 = stateVariables[
            await resolvePathToNodeIdx("list1")
        ].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentIdx].stateValues.value)
                .toString(),
        );
        let theList2 = stateVariables[
            await resolvePathToNodeIdx("list2")
        ].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentIdx].stateValues.value)
                .toString(),
        );
        let theList3 = stateVariables[
            await resolvePathToNodeIdx("list3")
        ].activeChildren.map((x) =>
            me
                .fromAst(stateVariables[x.componentIdx].stateValues.value)
                .toString(),
        );

        expect(theList2).eqls(theList1);
        expect(theList3).eqls(theList1);

        const theList4: any[] = [];

        for (let i = 0; i < 24; i++) {
            theList4.push(
                me
                    .fromAst(
                        stateVariables[
                            await resolvePathToNodeIdx("p" + (i + 1))
                        ].stateValues.value,
                    )
                    .toString(),
            );
        }

        expect(theList4).eqls(theList1);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("select with hide will hide replacements but not copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p>Selects and hide</p>
      <p name="p1"><select name="s1">
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select>, <select name="s2" hide>
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select></p>
      <p name="p2">$s1, $s2</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c =
            await stateVariables[await resolvePathToNodeIdx("s1[1][1]")]
                .stateValues.value;
        let d =
            await stateVariables[await resolvePathToNodeIdx("s2[1][1]")]
                .stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${c}, `);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("select with hide will hide named grandchildren replacements but not copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p>Selects and hide</p>
      <p name="p1"><asList><select name="s1">
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
      </select><select name="s2" hide>
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
      <p name="p2">$s1[1][1], <text extend="$s1[1][2]" hide="true" />, $s1[1][3], <text extend="$s2[1][1]" hide="false" />, $s2[1][2]</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let a =
            stateVariables[await resolvePathToNodeIdx("s1[1][1]")].stateValues
                .value;
        let b =
            stateVariables[await resolvePathToNodeIdx("s1[1][2]")].stateValues
                .value;
        let c =
            stateVariables[await resolvePathToNodeIdx("s1[1][3]")].stateValues
                .value;
        let d =
            stateVariables[await resolvePathToNodeIdx("s2[1][1]")].stateValues
                .value;
        let e =
            stateVariables[await resolvePathToNodeIdx("s2[1][2]")].stateValues
                .value;
        expect(["a", "d"].includes(a)).eq(true);
        expect(["b", "e"].includes(b)).eq(true);
        expect(["c", "f"].includes(c)).eq(true);
        expect(["a", "c", "e"].includes(d)).eq(true);
        expect(["b", "d", "f"].includes(e)).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${a}, ${b}, ${c}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${a}, , ${c}, ${d}, ${e}`);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("select with hide will hide named grandchildren replacements but not copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p>Selects and hide</p>
      <p name="p1"><asList><select name="s1">
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
      </select><select name="s2" hide>
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
      <p name="p2">$s1[1][1], <text extend="$s1[1][2]" hide="true" />, $s1[1][3], <text extend="$s2[1][1]" hide="false" />, $s2[1][2]</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let a =
            stateVariables[await resolvePathToNodeIdx("s1[1][1]")].stateValues
                .value;
        let b =
            stateVariables[await resolvePathToNodeIdx("s1[1][2]")].stateValues
                .value;
        let c =
            stateVariables[await resolvePathToNodeIdx("s1[1][3]")].stateValues
                .value;
        let d =
            stateVariables[await resolvePathToNodeIdx("s2[1][1]")].stateValues
                .value;
        let e =
            stateVariables[await resolvePathToNodeIdx("s2[1][2]")].stateValues
                .value;
        expect(["a", "d"].includes(a)).eq(true);
        expect(["b", "e"].includes(b)).eq(true);
        expect(["c", "f"].includes(c)).eq(true);
        expect(["a", "c", "e"].includes(d)).eq(true);
        expect(["b", "d", "f"].includes(e)).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${a}, ${b}, ${c}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${a}, , ${c}, ${d}, ${e}`);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the select is hidden
    it("selects hide dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleanInput>
    <p name="p1"><select name="c" hide="$h1">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select>, <select name="d" hide="$h2">
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
        let c =
            await stateVariables[await resolvePathToNodeIdx("c[1][1]")]
                .stateValues.value;
        let d =
            await stateVariables[await resolvePathToNodeIdx("d[1][1]")]
                .stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${c}, `);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);

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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`, ${d}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);

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

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${c}, `);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);
    });

    it("string and blank strings in options", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <text name="animal1">fox</text><text name="verb1">jumps</text>
      <text name="animal2">elephant</text><text name="verb2">trumpets</text>
    </setup>

    <p name="pa">a: <select name="a">
      <option>The $animal1 $verb1.</option>
      <option>The $animal2 $verb2.</option>
    </select></p>

    <p name="pa1">a1: <group extend="$a" name="a1" /></p>

    <p name="pb1">b1: <text extend="$a1[1]" name="b1" /></p>
    <p name="pc1">c1: <text extend="$a1[2]" name="c1" /></p>
    <p name="pd1">d1: <text extend="$a1[3]" name="d1" /></p>
    <p name="pe1">e1: <text extend="$a1[4]" name="e1" /></p>
  
    
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
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .selectedIndices[0] - 1
            ];

        expect(
            stateVariables[await resolvePathToNodeIdx("pa")].stateValues.text,
        ).eq(`a: The ${option.animal} ${option.verb}.`);
        expect(
            stateVariables[await resolvePathToNodeIdx("pa1")].stateValues.text,
        ).eq(`a1: The ${option.animal} ${option.verb}.`);

        expect(
            stateVariables[await resolvePathToNodeIdx("pb1")].stateValues.text,
        ).eq(`b1: `);
        expect(
            stateVariables[await resolvePathToNodeIdx("pc1")].stateValues.text,
        ).eq(`c1: ${option.animal}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("pd1")].stateValues.text,
        ).eq(`d1: ${option.verb}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("pe1")].stateValues.text,
        ).eq(`e1: `);

        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1")].stateValues.text,
        ).eq(`${option.animal}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("d1")].stateValues.text,
        ).eq(`${option.verb}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("e1")].stateValues.text,
        ).eq("");
    });

    it("correctly reference select inside another select", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="select1">
      <option>
    
        <p>q,r = <select name="s">
          <option><text>a</text><text>b</text></option>
        </select></p>
    
    
        <p>q2 = $s[1][1]</p>
        <p>r2 = $s[1][2]</p>
      </option>
    </select>
    
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let replacements =
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("select1")]
                    .replacements![0].componentIdx
            ].replacements!;

        let p1 = replacements[1].componentIdx;
        let p2 = replacements[3].componentIdx;
        let p3 = replacements[5].componentIdx;

        expect(stateVariables[p1].stateValues.text).eq(`q,r = ab`);
        expect(stateVariables[p2].stateValues.text).eq(`q2 = a`);
        expect(stateVariables[p3].stateValues.text).eq(`r2 = b`);
    });

    it("display error when miss a name in selectForVariants, inside text", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(24);
        expect(errorWarnings.errors[0].position.end.line).eq(7);
        expect(errorWarnings.errors[0].position.end.column).eq(14);
    });

    it("display error when repeat name in selectForVariants more times than numToSelect, inside p", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(18);
        expect(errorWarnings.errors[0].position.end.line).eq(7);
        expect(errorWarnings.errors[0].position.end.column).eq(14);
    });

    it("display error when repeat name in selectForVariants more times than numToSelect, inside document", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(15);
        expect(errorWarnings.errors[0].position.end.line).eq(8);
        expect(errorWarnings.errors[0].position.end.column).eq(14);
    });

    it("display error when numToSelect is larger than number of options, inside graph", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <p>No points for graph!</p>

    <graph description="A graph"><select numToSelect="3">
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
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(34);
        expect(errorWarnings.errors[0].position.end.line).eq(7);
        expect(errorWarnings.errors[0].position.end.column).eq(14);
    });

    it("numToSelect from selectFromSequence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" name="n1" /></p>
    <p>vars = <select type="text" name="vars1" numToSelect="$n1">u v w x y z</select></p>
    <p name="p1">a1=$vars1[1], b1=$vars1[2], c1=$vars1[3], d1=$vars1[4], e1=$vars1[5]</p>

    <p>n2 = <selectFromSequence from="1" to="5" name="n2" /></p>
    <p>vars = <select type="text" name="vars2" numToSelect="$n2">u v w x y z</select></p>
    <p name="p2">a2=$vars2[1], b2=$vars2[2], c2=$vars2[3], d2=$vars2[4], e2=$vars2[5]</p>

    <p>n3 = <selectFromSequence from="1" to="5" name="n3" /></p>
    <p>vars = <select type="text" name="vars3" numToSelect="$n3">u v w x y z</select></p>
    <p name="p3">a3=$vars3[1], b3=$vars3[2], c3=$vars3[3], d3=$vars3[4], e3=$vars3[5]</p>

    <p>n4 = <selectFromSequence from="1" to="5" name="n4" /></p>
    <p>vars = <select type="text" name="vars4" numToSelect="$n4">u v w x y z</select></p>
    <p name="p4">a4=$vars4[1], b4=$vars4[2], c4=$vars4[3], d4=$vars4[4], e4=$vars4[5]</p>

    <p>n5 = <selectFromSequence from="1" to="5" name="n5" /></p>
    <p>vars = <select type="text" name="vars5" numToSelect="$n5">u v w x y z</select></p>
    <p name="p5">a5=$vars5[1], b5=$vars5[2], c5=$vars5[3], d5=$vars5[4], e5=$vars5[5]</p>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let n1 =
            stateVariables[await resolvePathToNodeIdx("n1[1]")].stateValues
                .value;
        let n2 =
            stateVariables[await resolvePathToNodeIdx("n2[1]")].stateValues
                .value;
        let n3 =
            stateVariables[await resolvePathToNodeIdx("n3[1]")].stateValues
                .value;
        let n4 =
            stateVariables[await resolvePathToNodeIdx("n4[1]")].stateValues
                .value;
        let n5 =
            stateVariables[await resolvePathToNodeIdx("n5[1]")].stateValues
                .value;

        let vars1 = stateVariables[
            await resolvePathToNodeIdx("vars1")
        ].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentIdx].replacements![0].componentIdx
                ].stateValues.value,
        );
        let vars2 = stateVariables[
            await resolvePathToNodeIdx("vars2")
        ].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentIdx].replacements![0].componentIdx
                ].stateValues.value,
        );
        let vars3 = stateVariables[
            await resolvePathToNodeIdx("vars3")
        ].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentIdx].replacements![0].componentIdx
                ].stateValues.value,
        );
        let vars4 = stateVariables[
            await resolvePathToNodeIdx("vars4")
        ].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentIdx].replacements![0].componentIdx
                ].stateValues.value,
        );
        let vars5 = stateVariables[
            await resolvePathToNodeIdx("vars5")
        ].replacements!.map(
            (x) =>
                stateVariables[
                    stateVariables[x.componentIdx].replacements![0].componentIdx
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

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(vars1.map((v, i) => `${l[i]}1=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(vars2.map((v, i) => `${l[i]}2=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(vars3.map((v, i) => `${l[i]}3=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq(vars4.map((v, i) => `${l[i]}4=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq(vars5.map((v, i) => `${l[i]}5=${v}`).join(", "));
    });
});
