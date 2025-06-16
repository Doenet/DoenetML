import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import { updateMathInputValue, updateSelectedIndices } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function createInterval(string: string) {
    return me.fromText(string).to_intervals().tree;
}

describe("SubsetOfReals tag tests", async () => {
    async function test_display_as_interval({
        core,
        resolvePathToNodeIdx,
        repeat = [],
        includeNe = false,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        repeat?: string[];
        includeNe?: boolean;
    }) {
        const limits: Record<string, (number | string)[]> = {
            "1": [4, 5],
            "2": [5, 4],
            "3": [5, 5],
            "4": [4, Infinity],
            "5": [4, -Infinity],
            "6": [-Infinity, 5],
            "7": [Infinity, 5],
            "8": [-Infinity, Infinity],
            "9": ["a", "b"],
        };

        for (let ind of repeat) {
            limits[`${ind}a`] = limits[ind];
        }

        let closedByPre = {
            o: [false, false],
            c: [true, true],
            oc: [false, true],
            co: [true, false],
        };
        let allPre = ["o", "c", "oc", "co"];

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let ind in limits) {
            let lim = limits[ind];
            if (typeof lim[0] === "string" || typeof lim[1] === "string") {
                for (let pre of allPre) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind}`)
                        ].stateValues.value.tree,
                    ).eq("\uff3f");
                }
            } else if (lim[0] === -Infinity && lim[1] === Infinity) {
                for (let pre of allPre) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind}`)
                        ].stateValues.value.tree,
                    ).eq("R");
                }
            } else if (lim[0] > lim[1]) {
                for (let pre of allPre) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind}`)
                        ].stateValues.value.tree,
                    ).eq("emptyset");
                }
            } else if (lim[0] < lim[1]) {
                for (let pre of allPre) {
                    let closed = [...closedByPre[pre]];
                    // don't have closed intervals at infinity
                    if (lim[0] === -Infinity) {
                        closed[0] = false;
                    }
                    if (lim[1] === Infinity) {
                        closed[1] = false;
                    }
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind}`)
                        ].stateValues.value.tree,
                    ).eqls([
                        "interval",
                        ["tuple", ...lim],
                        ["tuple", ...closed],
                    ]);
                }
            } else {
                // equal limits
                for (let pre of allPre) {
                    if (pre === "c") {
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind}`)
                            ].stateValues.value.tree,
                        ).eqls(["set", lim[0]]);
                    } else {
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind}`)
                            ].stateValues.value.tree,
                        ).eq("emptyset");
                    }
                }
            }
        }

        if (includeNe) {
            let neNumbers: Record<string, number> = {
                "1": 6,
                "2": Infinity,
                "3": -Infinity,
                "4": 6,
                "5": Infinity,
                "6": -Infinity,
            };

            for (let ind in neNumbers) {
                let num = neNumbers[ind];

                if (Number.isFinite(num)) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`ne${ind}`)]
                            .stateValues.value.tree,
                    ).eqls([
                        "union",
                        createInterval(`(-infinity, ${num})`),
                        createInterval(`(${num}, infinity)`),
                    ]);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`ne${ind}`)]
                            .stateValues.value.tree,
                    ).eq("R");
                }
            }
        }
    }

    it("single intervals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="o1">(4,5)</subsetOfReals></p>
  <p><subsetOfReals name="o2">(5,4)</subsetOfReals></p>
  <p><subsetOfReals name="o3">(5,5)</subsetOfReals></p>
  <p><subsetOfReals name="o4">(4,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="o5">(4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals name="o6">(-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="o7">(infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="o8">(-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="o9">(a,b)</subsetOfReals></p>

  <p><subsetOfReals name="c1">[4,5]</subsetOfReals></p>
  <p><subsetOfReals name="c2">[5,4]</subsetOfReals></p>
  <p><subsetOfReals name="c3">[5,5]</subsetOfReals></p>
  <p><subsetOfReals name="c4">[4,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="c5">[4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals name="c6">[-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="c7">[infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="c8">[-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="c9">[a,b]</subsetOfReals></p>

  <p><subsetOfReals name="oc1">(4,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc2">(5,4]</subsetOfReals></p>
  <p><subsetOfReals name="oc3">(5,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc4">(4,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="oc5">(4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals name="oc6">(-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc7">(infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc8">(-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="oc9">(a,b]</subsetOfReals></p>

  <p><subsetOfReals name="co1">[4,5)</subsetOfReals></p>
  <p><subsetOfReals name="co2">[5,4)</subsetOfReals></p>
  <p><subsetOfReals name="co3">[5,5)</subsetOfReals></p>
  <p><subsetOfReals name="co4">[4,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="co5">[4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals name="co6">[-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="co7">[infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="co8">[-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="co9">[a,b)</subsetOfReals></p>
  `,
        });

        await test_display_as_interval({ core, resolvePathToNodeIdx });
    });

    async function test_display_as_inequality(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        variable: string = "x",
    ) {
        const limits = [
            [4, 5],
            [5, 4],
            [5, 5],
            [4, Infinity],
            [4, -Infinity],
            [-Infinity, 5],
            [Infinity, 5],
            [-Infinity, Infinity],
            ["a", "b"],
        ];

        let closedByPre = {
            o: [false, false],
            c: [true, true],
            oc: [false, true],
            co: [true, false],
        };
        let allPre = ["o", "c", "oc", "co"];

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let [ind, lim] of limits.entries()) {
            if (typeof lim[0] === "string" || typeof lim[1] === "string") {
                for (let pre of allPre) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                        ].stateValues.value.tree,
                    ).eq("\uff3f");
                }
            } else if (lim[0] === -Infinity && lim[1] === Infinity) {
                for (let pre of allPre) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                        ].stateValues.value.tree,
                    ).eqls(["in", variable, "R"]);
                }
            } else if (lim[0] > lim[1]) {
                for (let pre of allPre) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                        ].stateValues.value.tree,
                    ).eqls(["in", variable, "emptyset"]);
                }
            } else if (lim[0] < lim[1]) {
                for (let pre of allPre) {
                    let strict = closedByPre[pre].map((v) => !v);
                    if (lim[0] === -Infinity) {
                        let op = strict[1] ? "<" : "le";
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                            ].stateValues.value.tree,
                        ).eqls([op, variable, lim[1]]);
                    } else if (lim[1] === Infinity) {
                        let op = strict[0] ? ">" : "ge";
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                            ].stateValues.value.tree,
                        ).eqls([op, variable, lim[0]]);
                    } else {
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                            ].stateValues.value.tree,
                        ).eqls([
                            "lts",
                            ["tuple", lim[0], variable, lim[1]],
                            ["tuple", ...strict],
                        ]);
                    }
                }
            } else {
                // equal limits
                for (let pre of allPre) {
                    if (pre === "c") {
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                            ].stateValues.value.tree,
                        ).eqls(["=", variable, lim[0]]);
                    } else {
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`${pre}${ind + 1}`)
                            ].stateValues.value.tree,
                        ).eqls(["in", variable, "emptyset"]);
                    }
                }
            }
        }
    }

    it("single intervals, display as inequality", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals displayMode="inequalities" name="o1">(4,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o2">(5,4)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o3">(5,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o4">(4,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o5">(4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o6">(-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o7">(infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o8">(-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o9">(a,b)</subsetOfReals></p>

  <p><subsetOfReals displayMode="inequalities" name="c1">[4,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c2">[5,4]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c3">[5,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c4">[4,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c5">[4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c6">[-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c7">[infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c8">[-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c9">[a,b]</subsetOfReals></p>

  <p><subsetOfReals displayMode="inequalities" name="oc1">(4,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc2">(5,4]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc3">(5,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc4">(4,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc5">(4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc6">(-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc7">(infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc8">(-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc9">(a,b]</subsetOfReals></p>

  <p><subsetOfReals displayMode="inequalities" name="co1">[4,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co2">[5,4)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co3">[5,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co4">[4,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co5">[4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co6">[-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co7">[infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co8">[-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co9">[a,b)</subsetOfReals></p>
  `,
        });

        await test_display_as_inequality(core, resolvePathToNodeIdx);
    });

    it("single intervals, display as inequality, change variable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o1">(4,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o2">(5,4)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o3">(5,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o4">(4,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o5">(4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o6">(-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o7">(infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o8">(-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o9">(a,b)</subsetOfReals></p>

  <p><subsetOfReals variable="v" displayMode="inequalities" name="c1">[4,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c2">[5,4]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c3">[5,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c4">[4,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c5">[4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c6">[-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c7">[infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c8">[-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c9">[a,b]</subsetOfReals></p>

  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc1">(4,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc2">(5,4]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc3">(5,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc4">(4,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc5">(4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc6">(-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc7">(infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc8">(-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc9">(a,b]</subsetOfReals></p>

  <p><subsetOfReals variable="v" displayMode="inequalities" name="co1">[4,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co2">[5,4)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co3">[5,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co4">[4,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co5">[4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co6">[-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co7">[infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co8">[-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co9">[a,b)</subsetOfReals></p>
  `,
        });

        await test_display_as_inequality(core, resolvePathToNodeIdx, "v");
    });

    it("single inequality", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="o1">4 < x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o2">5 < x < 4</subsetOfReals></p>
  <p><subsetOfReals name="o3">5 < x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o4">x > 4</subsetOfReals></p>
  <p><subsetOfReals name="o4a">infinity > x > 4</subsetOfReals></p>
  <p><subsetOfReals name="o5">x < -infinity</subsetOfReals></p>
  <p><subsetOfReals name="o6">x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o6a">-infinity < x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o7">x > infinity</subsetOfReals></p>
  <p><subsetOfReals name="o8">-infinity < x < infinity</subsetOfReals></p>
  <p><subsetOfReals name="o9">x < a</subsetOfReals></p>

  <p><subsetOfReals name="c1">4 <= x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c2">5 <= x <= 4</subsetOfReals></p>
  <p><subsetOfReals name="c3">5 <= x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c4">x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="c4a">infinity >= x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="c5">x <= -infinity</subsetOfReals></p>
  <p><subsetOfReals name="c6">x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c6a">-infinity <= x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c7">x >= infinity</subsetOfReals></p>
  <p><subsetOfReals name="c8">-infinity <= x <= infinity</subsetOfReals></p>
  <p><subsetOfReals name="c9">x <= a</subsetOfReals></p>

  <p><subsetOfReals name="oc1">4 < x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc2">5 < x <= 4</subsetOfReals></p>
  <p><subsetOfReals name="oc3">5 < x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc4">x > 4</subsetOfReals></p>
  <p><subsetOfReals name="oc4a">infinity >= x > 4</subsetOfReals></p>
  <p><subsetOfReals name="oc5">x <= -infinity</subsetOfReals></p>
  <p><subsetOfReals name="oc6">x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc6a">-infinity < x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc7">x > infinity</subsetOfReals></p>
  <p><subsetOfReals name="oc8">-infinity < x <= infinity</subsetOfReals></p>
  <p><subsetOfReals name="oc9">x <= a</subsetOfReals></p>

  <p><subsetOfReals name="co1">4 <= x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co2">5 <= x < 4</subsetOfReals></p>
  <p><subsetOfReals name="co3">5 <= x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co4">x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="co4a">infinity > x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="co5">x < -infinity</subsetOfReals></p>
  <p><subsetOfReals name="co6">x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co6a">-infinity <= x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co7">x >= infinity</subsetOfReals></p>
  <p><subsetOfReals name="co8">-infinity <= x < infinity</subsetOfReals></p>
  <p><subsetOfReals name="co9">x < a</subsetOfReals></p>

  <p><subsetOfReals name="ne1">x != 6</subsetOfReals></p>
  <p><subsetOfReals name="ne2">x != infinity</subsetOfReals></p>
  <p><subsetOfReals name="ne3">x != -infinity</subsetOfReals></p>
  <p><subsetOfReals name="ne4">6 != x</subsetOfReals></p>
  <p><subsetOfReals name="ne5">infinity != x</subsetOfReals></p>
  <p><subsetOfReals name="ne6">-infinity != x</subsetOfReals></p>
  `,
        });

        await test_display_as_interval({
            core,
            resolvePathToNodeIdx,
            repeat: ["4", "6"],
            includeNe: true,
        });
    });

    it("single inequality, change variable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals variable="q" name="o1">4 < q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o2">5 < q < 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o3">5 < q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o4">q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o4a">infinity > q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o5">q < -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o6">q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o6a">-infinity < q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o7">q > infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o8">-infinity < q < infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o9">q < a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="c1">4 <= q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c2">5 <= q <= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c3">5 <= q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c4">q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c4a">infinity >= q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c5">q <= -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c6">q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c6a">-infinity <= q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c7">q >= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c8">-infinity <= q <= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c9">q <= a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="oc1">4 < q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc2">5 < q <= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc3">5 < q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc4">q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc4a">infinity >= q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc5">q <= -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc6">q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc6a">-infinity < q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc7">q > infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc8">-infinity < q <= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc9">q <= a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="co1">4 <= q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co2">5 <= q < 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co3">5 <= q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co4">q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co4a">infinity > q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co5">q < -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co6">q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co6a">-infinity <= q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co7">q >= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co8">-infinity <= q < infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co9">q < a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="ne1">q != 6</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="ne2">q != infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="ne3">q != -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="ne4">6 != q</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="ne5">infinity != q</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="ne6">-infinity != q</subsetOfReals></p>
  `,
        });

        await test_display_as_interval({
            core,
            resolvePathToNodeIdx,
            repeat: ["4", "6"],
            includeNe: true,
        });
    });

    it("single inequality, in set notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="o1">{q | 4 < q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o2">{q | 5 < q < 4}</subsetOfReals></p>
  <p><subsetOfReals name="o3">{q | 5 < q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o4">{q | q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="o4a">{q | infinity > q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="o5">{q | q < -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="o6">{q | q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o6a">{q | -infinity < q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o7">{q | q > infinity}</subsetOfReals></p>
  <p><subsetOfReals name="o8">{q | -infinity < q < infinity}</subsetOfReals></p>
  <p><subsetOfReals name="o9">{q | q < a}</subsetOfReals></p>

  <p><subsetOfReals name="c1">{q | 4 <= q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c2">{q | 5 <= q <= 4}</subsetOfReals></p>
  <p><subsetOfReals name="c3">{q | 5 <= q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c4">{q | q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="c4a">{q | infinity >= q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="c5">{q | q <= -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="c6">{q | q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c6a">{q | -infinity <= q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c7">{q | q >= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="c8">{q | -infinity <= q <= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="c9">{q | q <= a}</subsetOfReals></p>

  <p><subsetOfReals name="oc1">{q | 4 < q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc2">{q | 5 < q <= 4}</subsetOfReals></p>
  <p><subsetOfReals name="oc3">{q | 5 < q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc4">{q | q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="oc4a">{q | infinity >= q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="oc5">{q | q <= -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="oc6">{q | q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc6a">{q | -infinity < q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc7">{q | q > infinity}</subsetOfReals></p>
  <p><subsetOfReals name="oc8">{q | -infinity < q <= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="oc9">{q | q <= a}</subsetOfReals></p>

  <p><subsetOfReals name="co1">{q | 4 <= q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co2">{q | 5 <= q < 4}</subsetOfReals></p>
  <p><subsetOfReals name="co3">{q | 5 <= q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co4">{q | q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="co4a">{q | infinity > q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="co5">{q | q < -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="co6">{q | q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co6a">{q | -infinity <= q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co7">{q | q >= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="co8">{q | -infinity <= q < infinity}</subsetOfReals></p>
  <p><subsetOfReals name="co9">{q | q < a}</subsetOfReals></p>

  <p><subsetOfReals name="ne1">{q | q != 6}</subsetOfReals></p>
  <p><subsetOfReals name="ne2">{q | q != infinity}</subsetOfReals></p>
  <p><subsetOfReals name="ne3">{q | q != -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="ne4">{q | 6 != q}</subsetOfReals></p>
  <p><subsetOfReals name="ne5">{q | infinity != q}</subsetOfReals></p>
  <p><subsetOfReals name="ne6">{q | -infinity != q}</subsetOfReals></p>
  `,
        });

        await test_display_as_interval({
            core,
            resolvePathToNodeIdx,
            repeat: ["4", "6"],
            includeNe: true,
        });
    });

    it("single equality", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="e1">x=5</subsetOfReals></p>
  <p><subsetOfReals name="e2">x=infinity</subsetOfReals></p>
  <p><subsetOfReals name="e3">x=-infinity</subsetOfReals></p>
  <p><subsetOfReals name="e4">x=a</subsetOfReals></p>


  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("e1")].stateValues.value
                .tree,
        ).eqls(["set", 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("e2")].stateValues.value
                .tree,
        ).eq("emptyset");
        expect(
            stateVariables[await resolvePathToNodeIdx("e3")].stateValues.value
                .tree,
        ).eq("emptyset");
        expect(
            stateVariables[await resolvePathToNodeIdx("e4")].stateValues.value
                .tree,
        ).eq("\uff3f");
    });

    async function test_union_interactions(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const res = {
            u1: ["union", createInterval("(4,5)"), createInterval("(6,7)")],
            u2: ["union", createInterval("(4,5)"), createInterval("(5,6)")],
            u3: createInterval("(4,6]"),
            u4: createInterval("(4,6]"),
            u5: createInterval("(4,7)"),
            u6: createInterval("(4,8)"),
            u7: createInterval("(4,7]"),
            u8: createInterval("[4,6)"),
            u9: createInterval("(4,6)"),
            u10: createInterval("(4,6]"),
            u11: ["union", createInterval("(4,6)"), ["set", 7]],
            u12: createInterval("(4,6)"),
            u13: "R",
            u14: "R",
            u15: "R",
            u16: "R",
            u17: "R",
            u18: createInterval("[-4,-2)"),
            i1: "emptyset",
            i2: "emptyset",
            i3: "emptyset",
            i4: ["set", 5],
            i5: createInterval("(5,6)"),
            i6: createInterval("(5,7)"),
            i7: createInterval("(5,7)"),
            i8: "emptyset",
            i9: ["set", 5],
            i10: "emptyset",
            i11: "emptyset",
            i12: "emptyset",
            i13: createInterval("(2,5)"),
            i14: createInterval("[2,5)"),
            i15: createInterval("(2,5]"),
            i16: createInterval("[2,5]"),
            i17: "emptyset",
            i18: ["set", -4],
        };

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let name in res) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value.tree,
            ).eqls(res[name]);
        }
    }

    it("union and intersections of intervals and singletons", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="u1">(4,5) union (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="u2">(4,5) union (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="u3">(4,5] union (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u4">(4,5] union [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u5">(4,6) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u6">(4,8) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u7">(4,7) union (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="u8">(4,6) union {4}</subsetOfReals></p>
  <p><subsetOfReals name="u9">(4,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u10">(4,6) union {6}</subsetOfReals></p>
  <p><subsetOfReals name="u11">(4,6) union {7}</subsetOfReals></p>
  <p><subsetOfReals name="u12">(4,5) union (5,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u13">(-infinity,5) union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u14">(-infinity,5) union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u15">(-infinity,5] union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u16">(-infinity,5] union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u17">(-infinity,5) union (9,infinity) union (4,10)</subsetOfReals></p>
  <p><subsetOfReals name="u18">[-4,-2) union {-4}</subsetOfReals></p>

  <p><subsetOfReals name="i1">(4,5) intersect (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="i2">(4,5) intersect (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="i3">(4,5] intersect (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i4">(4,5] intersect [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i5">(4,6) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i6">(4,8) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i7">(4,7) intersect (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="i8">(4,6) intersect {4}</subsetOfReals></p>
  <p><subsetOfReals name="i9">(4,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i10">(4,6) intersect {6}</subsetOfReals></p>
  <p><subsetOfReals name="i11">(4,6) intersect {7}</subsetOfReals></p>
  <p><subsetOfReals name="i12">(4,5) intersect (5,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i13">(-infinity,5) intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i14">(-infinity,5) intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i15">(-infinity,5] intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i16">(-infinity,5] intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i17">(-infinity,5) intersect (9,infinity) intersect (4,10)</subsetOfReals></p>
  <p><subsetOfReals name="i18">[-4,-2) intersect {-4}</subsetOfReals></p>
  `,
        });

        await test_union_interactions(core, resolvePathToNodeIdx);
    });

    it("union and intersections of intervals and singletons, latex format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals format="latex" name="u1">(4,5) \\cup (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u2">(4,5) \\cup (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u3">(4,5] \\cup (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u4">(4,5] \\cup [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u5">(4,6) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u6">(4,8) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u7">(4,7) \\cup (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u8">(4,6) \\cup {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u9">(4,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u10">(4,6) \\cup {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u11">(4,6) \\cup {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u12">(4,5) \\cup (5,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u13">(-\\infty,5) \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u14">(-\\infty,5) \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u15">(-\\infty,5] \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u16">(-\\infty,5] \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u17">(-\\infty,5) \\cup (9,\\infty) \\cup (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u18">[-4,-2) \\cup {-4}</subsetOfReals></p>

  <p><subsetOfReals format="latex" name="i1">(4,5) \\cap (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i2">(4,5) \\cap (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i3">(4,5] \\cap (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i4">(4,5] \\cap [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i5">(4,6) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i6">(4,8) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i7">(4,7) \\cap (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i8">(4,6) \\cap {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i9">(4,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i10">(4,6) \\cap {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i11">(4,6) \\cap {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i12">(4,5) \\cap (5,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i13">(-\\infty,5) \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i14">(-\\infty,5) \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i15">(-\\infty,5] \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i16">(-\\infty,5] \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i17">(-\\infty,5) \\cap (9,\\infty) \\cap (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i18">[-4,-2) \\cap {-4}</subsetOfReals></p>
  `,
        });

        await test_union_interactions(core, resolvePathToNodeIdx);
    });

    it("x element of union and intersections of intervals and singletons", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="u1">x elementof (4,5) union (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="u2">x elementof (4,5) union (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="u3">x elementof (4,5] union (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u4">x elementof (4,5] union [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u5">x elementof (4,6) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u6">x elementof (4,8) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u7">x elementof (4,7) union (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="u8">x elementof (4,6) union {4}</subsetOfReals></p>
  <p><subsetOfReals name="u9">x elementof (4,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u10">x elementof (4,6) union {6}</subsetOfReals></p>
  <p><subsetOfReals name="u11">x elementof (4,6) union {7}</subsetOfReals></p>
  <p><subsetOfReals name="u12">x elementof (4,5) union (5,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u13">x elementof (-infinity,5) union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u14">x elementof (-infinity,5) union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u15">x elementof (-infinity,5] union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u16">x elementof (-infinity,5] union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u17">x elementof (-infinity,5) union (9,infinity) union (4,10)</subsetOfReals></p>
  <p><subsetOfReals name="u18">x elementof [-4,-2) union {-4}</subsetOfReals></p>

  <p><subsetOfReals name="i1">x elementof (4,5) intersect (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="i2">x elementof (4,5) intersect (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="i3">x elementof (4,5] intersect (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i4">x elementof (4,5] intersect [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i5">x elementof (4,6) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i6">x elementof (4,8) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i7">x elementof (4,7) intersect (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="i8">x elementof (4,6) intersect {4}</subsetOfReals></p>
  <p><subsetOfReals name="i9">x elementof (4,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i10">x elementof (4,6) intersect {6}</subsetOfReals></p>
  <p><subsetOfReals name="i11">x elementof (4,6) intersect {7}</subsetOfReals></p>
  <p><subsetOfReals name="i12">x elementof (4,5) intersect (5,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i13">x elementof (-infinity,5) intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i14">x elementof (-infinity,5) intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i15">x elementof (-infinity,5] intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i16">x elementof (-infinity,5] intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i17">x elementof (-infinity,5) intersect (9,infinity) intersect (4,10)</subsetOfReals></p>
  <p><subsetOfReals name="i18">x elementof [-4,-2) intersect {-4}</subsetOfReals></p>
  `,
        });

        await test_union_interactions(core, resolvePathToNodeIdx);
    });

    it("union and intersections of intervals and singletons contains element x", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="u1">(4,5) union (6,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u2">(4,5) union (5,6) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u3">(4,5] union (5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u4">(4,5] union [5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u5">(4,6) union (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u6">(4,8) union (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u7">(4,7) union (5,7] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u8">(4,6) union {4} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u9">(4,6) union {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u10">(4,6) union {6} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u11">(4,6) union {7} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u12">(4,5) union (5,6) union {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u13">(-infinity,5) union (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u14">(-infinity,5) union [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u15">(-infinity,5] union (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u16">(-infinity,5] union [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u17">(-infinity,5) union (9,infinity) union (4,10) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u18">[-4,-2) union {-4} containselement x</subsetOfReals></p>

  <p><subsetOfReals name="i1">(4,5) intersect (6,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i2">(4,5) intersect (5,6) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i3">(4,5] intersect (5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i4">(4,5] intersect [5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i5">(4,6) intersect (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i6">(4,8) intersect (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i7">(4,7) intersect (5,7] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i8">(4,6) intersect {4} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i9">(4,6) intersect {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i10">(4,6) intersect {6} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i11">(4,6) intersect {7} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i12">(4,5) intersect (5,6) intersect {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i13">(-infinity,5) intersect (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i14">(-infinity,5) intersect [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i15">(-infinity,5] intersect (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i16">(-infinity,5] intersect [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i17">(-infinity,5) intersect (9,infinity) intersect (4,10) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i18">[-4,-2) intersect {-4} containselement x</subsetOfReals></p>
  `,
        });

        await test_union_interactions(core, resolvePathToNodeIdx);
    });

    it("x in union and intersections of intervals and singletons, latex format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals format="latex" name="u1">x \\in (4,5) \\cup (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u2">x \\in (4,5) \\cup (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u3">x \\in (4,5] \\cup (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u4">x \\in (4,5] \\cup [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u5">x \\in (4,6) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u6">x \\in (4,8) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u7">x \\in (4,7) \\cup (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u8">x \\in (4,6) \\cup {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u9">x \\in (4,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u10">x \\in (4,6) \\cup {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u11">x \\in (4,6) \\cup {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u12">x \\in (4,5) \\cup (5,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u13">x \\in (-\\infty,5) \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u14">x \\in (-\\infty,5) \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u15">x \\in (-\\infty,5] \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u16">x \\in (-\\infty,5] \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u17">x \\in (-\\infty,5) \\cup (9,\\infty) \\cup (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u18">x \\in [-4,-2) \\cup {-4}</subsetOfReals></p>

  <p><subsetOfReals format="latex" name="i1">x \\in (4,5) \\cap (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i2">x \\in (4,5) \\cap (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i3">x \\in (4,5] \\cap (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i4">x \\in (4,5] \\cap [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i5">x \\in (4,6) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i6">x \\in (4,8) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i7">x \\in (4,7) \\cap (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i8">x \\in (4,6) \\cap {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i9">x \\in (4,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i10">x \\in (4,6) \\cap {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i11">x \\in (4,6) \\cap {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i12">x \\in (4,5) \\cap (5,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i13">x \\in (-\\infty,5) \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i14">x \\in (-\\infty,5) \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i15">x \\in (-\\infty,5] \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i16">x \\in (-\\infty,5] \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i17">x \\in (-\\infty,5) \\cap (9,\\infty) \\cap (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i18">x \\in [-4,-2) \\cap {-4}</subsetOfReals></p>
  `,
        });

        await test_union_interactions(core, resolvePathToNodeIdx);
    });

    it("union and intersections of intervals and singletons ni x, latex format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals format="latex" name="u1">(4,5) \\cup (6,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u2">(4,5) \\cup (5,6) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u3">(4,5] \\cup (5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u4">(4,5] \\cup [5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u5">(4,6) \\cup (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u6">(4,8) \\cup (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u7">(4,7) \\cup (5,7] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u8">(4,6) \\cup {4} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u9">(4,6) \\cup {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u10">(4,6) \\cup {6} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u11">(4,6) \\cup {7} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u12">(4,5) \\cup (5,6) \\cup {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u13">(-\\infty,5) \\cup (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u14">(-\\infty,5) \\cup [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u15">(-\\infty,5] \\cup (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u16">(-\\infty,5] \\cup [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u17">(-\\infty,5) \\cup (9,\\infty) \\cup (4,10) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u18">[-4,-2) \\cup {-4} \\ni x</subsetOfReals></p>

  <p><subsetOfReals format="latex" name="i1">(4,5) \\cap (6,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i2">(4,5) \\cap (5,6) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i3">(4,5] \\cap (5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i4">(4,5] \\cap [5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i5">(4,6) \\cap (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i6">(4,8) \\cap (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i7">(4,7) \\cap (5,7] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i8">(4,6) \\cap {4} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i9">(4,6) \\cap {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i10">(4,6) \\cap {6} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i11">(4,6) \\cap {7} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i12">(4,5) \\cap (5,6) \\cap {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i13">(-\\infty,5) \\cap (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i14">(-\\infty,5) \\cap [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i15">(-\\infty,5] \\cap (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i16">(-\\infty,5] \\cap [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i17">(-\\infty,5) \\cap (9,\\infty) \\cap (4,10) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i18">[-4,-2) \\cap {-4} \\ni x</subsetOfReals></p>
  `,
        });

        await test_union_interactions(core, resolvePathToNodeIdx);
    });

    it("ands and ors with inequalities", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="o1">(4 < x < 5) or (6 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="o2">(4 < x < 5) or (5 < x < 6)</subsetOfReals></p>
  <p><subsetOfReals name="o3">(4 < x <= 5) or (5 < x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="o4">(4 < x <= 5) or (5 <= x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="o5">(4 < x < 6) or (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="o6">(4 < x < 8) or (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="o7">(4 < x < 7) or (5 < x <= 7)</subsetOfReals></p>
  <p><subsetOfReals name="o8">(4 < x < 6) or (x = 4)</subsetOfReals></p>
  <p><subsetOfReals name="o9">(4 < x < 6) or (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="o10">(4 < x < 6) or (x = 6)</subsetOfReals></p>
  <p><subsetOfReals name="o11">(4 < x < 6) or (x = 7)</subsetOfReals></p>
  <p><subsetOfReals name="o12">(4 < x < 5) or (5 < x < 6) or (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="o13">(x < 5) or (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="o14">(x < 5) or (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="o15">(x <= 5) or (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="o16">(x <= 5) or (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="o17">(x < 5) or (x > 9) or (4 < x < 10)</subsetOfReals></p>
  <p><subsetOfReals name="o18">(x != 5) or (4 < x < 10)</subsetOfReals></p>

  <p><subsetOfReals name="a1">(4 < x < 5) and (6 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="a2">(4 < x < 5) and (5 < x < 6)</subsetOfReals></p>
  <p><subsetOfReals name="a3">(4 < x <= 5) and (5 < x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="a4">(4 < x <= 5) and (5 <= x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="a5">(4 < x < 6) and (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="a6">(4 < x < 8) and (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="a7">(4 < x < 7) and (5 < x <= 7)</subsetOfReals></p>
  <p><subsetOfReals name="a8">(4 < x < 6) and (x = 4)</subsetOfReals></p>
  <p><subsetOfReals name="a9">(4 < x < 6) and (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="a10">(4 < x < 6) and (x = 6)</subsetOfReals></p>
  <p><subsetOfReals name="a11">(4 < x < 6) and (x = 7)</subsetOfReals></p>
  <p><subsetOfReals name="a12">(4 < x < 5) and (5 < x < 6) and (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="a13">(x < 5) and (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="a14">(x < 5) and (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="a15">(x <= 5) and (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="a16">(x <= 5) and (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="a17">(x < 5) and (x > 9) and (4 < x < 10)</subsetOfReals></p>
  <p><subsetOfReals name="a18">(x != 5) and (4 < x < 10)</subsetOfReals></p>


  `,
        });

        const res = {
            o1: ["union", createInterval("(4,5)"), createInterval("(6,7)")],
            o2: ["union", createInterval("(4,5)"), createInterval("(5,6)")],
            o3: createInterval("(4,6]"),
            o4: createInterval("(4,6]"),
            o5: createInterval("(4,7)"),
            o6: createInterval("(4,8)"),
            o7: createInterval("(4,7]"),
            o8: createInterval("[4,6)"),
            o9: createInterval("(4,6)"),
            o10: createInterval("(4,6]"),
            o11: ["union", createInterval("(4,6)"), ["set", 7]],
            o12: createInterval("(4,6)"),
            o13: "R",
            o14: "R",
            o15: "R",
            o16: "R",
            o17: "R",
            o18: "R",

            a1: "emptyset",
            a2: "emptyset",
            a3: "emptyset",
            a4: createInterval("{5}"),
            a5: createInterval("(5,6)"),
            a6: createInterval("(5,7)"),
            a7: createInterval("(5,7)"),
            a8: "emptyset",
            a9: ["set", 5],
            a10: "emptyset",
            a11: "emptyset",
            a12: "emptyset",
            a13: createInterval("(2,5)"),
            a14: createInterval("[2,5)"),
            a15: createInterval("(2,5]"),
            a16: createInterval("[2,5]"),
            a17: "emptyset",
            a18: ["union", createInterval("(4,5)"), createInterval("(5,10)")],
        };

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let name in res) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value.tree,
            ).eqls(res[name]);
        }
    });

    it("complements of intervals and singletons", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><subsetOfReals name="c1">(4,5)^c</subsetOfReals></p>
  <p><subsetOfReals name="c2">(4,5)^C</subsetOfReals></p>
  <p><subsetOfReals name="c3">(4,5]^c</subsetOfReals></p>
  <p><subsetOfReals name="c4">(4,5]^C</subsetOfReals></p>
  <p><subsetOfReals name="c5">[4,5)^c</subsetOfReals></p>
  <p><subsetOfReals name="c6">[4,5)^C</subsetOfReals></p>
  <p><subsetOfReals name="c7">[4,5]^c</subsetOfReals></p>
  <p><subsetOfReals name="c8">[4,5]^C</subsetOfReals></p>
  <p><subsetOfReals name="c9">{4}^c</subsetOfReals></p>
  <p><subsetOfReals name="c10">{4}^C</subsetOfReals></p>
  <p><subsetOfReals name="c11">((4,5) union (5,6))^c</subsetOfReals></p>
  <p><subsetOfReals name="c12">(4,6)^c or (5,7)^c</subsetOfReals></p>


  `,
        });

        const res = {
            c1: ["union", createInterval("(−∞,4]"), createInterval("[5,∞)")],
            c2: ["union", createInterval("(−∞,4]"), createInterval("[5,∞)")],
            c3: ["union", createInterval("(−∞,4]"), createInterval("(5,∞)")],
            c4: ["union", createInterval("(−∞,4]"), createInterval("(5,∞)")],
            c5: ["union", createInterval("(−∞,4)"), createInterval("[5,∞)")],
            c6: ["union", createInterval("(−∞,4)"), createInterval("[5,∞)")],
            c7: ["union", createInterval("(−∞,4)"), createInterval("(5,∞)")],
            c8: ["union", createInterval("(−∞,4)"), createInterval("(5,∞)")],
            c9: ["union", createInterval("(−∞,4)"), createInterval("(4,∞)")],
            c10: ["union", createInterval("(−∞,4)"), createInterval("(4,∞)")],
            c11: [
                "union",
                createInterval("(−∞,4]"),
                ["set", 5],
                createInterval("[6,∞)"),
            ],
            c12: ["union", createInterval("(−∞,5]"), createInterval("[6,∞)")],
        };

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let name in res) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value.tree,
            ).eqls(res[name]);
        }
    });

    it("dynamic subsets", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Variable: <mathInput name="variable" prefill="x" /></p>
  <p>Input: <mathInput name="input" prefill="x > 1" /></p>
  <p>Display mode:</p>
  <choiceInput name="displayMode" preselectChoice='1'>
    <choice>intervals</choice>
    <choice>inequalities</choice>
  </choiceInput>
  <p>Result: <subsetOfReals name="result" variable="$variable" displayMode="$displayMode">$input</subsetOfReals></p>
  

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("( 1, ∞ )");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("displayMode"),
            selectedIndices: [2],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("x > 1");

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("variable"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("＿");

        await updateMathInputValue({
            latex: "y>1",
            componentIdx: await resolvePathToNodeIdx("input"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("y > 1");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("displayMode"),
            selectedIndices: [1],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("( 1, ∞ )");

        await updateMathInputValue({
            latex: "y \\ne 1",
            componentIdx: await resolvePathToNodeIdx("input"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("( -∞, 1 ) ∪ ( 1, ∞ )");

        await updateMathInputValue({
            latex: "(y>1)\\land(y<3)",
            componentIdx: await resolvePathToNodeIdx("input"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("( 1, 3 )");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("displayMode"),
            selectedIndices: [2],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("1 < y < 3");

        await updateMathInputValue({
            latex: "(y>1)\\land(y<3)\\lor(y>6)",
            componentIdx: await resolvePathToNodeIdx("input"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("(1 < y < 3) or (y > 6)");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("displayMode"),
            selectedIndices: [1],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("result")].stateValues
                .text,
        ).eq("( 1, 3 ) ∪ ( 6, ∞ )");
    });

    it("modifying copies of subsets", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Enter subset: <mathInput name="input0" prefill="(0,1)" /></p>
  <p>Subset 1: <subsetOfReals name="s1">$input0</subsetOfReals></p>
  <p>Subset 2: <subsetOfReals extend="$s1" name="s2" /></p>
  <p>Subset 3: <subsetOfReals extend="$s1.value" name="s3"/></p>
  <p>Subset 4: <subsetOfReals extend="$s2" name="s4" /></p>
  <p>Subset 5: <subsetOfReals extend="$s2.value" name="s5"/></p>
  <p>Subset 6: <subsetOfReals extend="$s3" name="s6" /></p>
  <p>Subset 7: <subsetOfReals extend="$s3.value" name="s7"/></p>
  <p>Subset 8: <subsetOfReals name="s8">$s1</subsetOfReals></p>
  <p>Subset 9: <subsetOfReals name="s9">$(s1.value)</subsetOfReals></p>
  <p>Modify subset 1: <mathInput name="input1" bindValueTo="$s1" /></p>
  <p>Modify subset 2: <mathInput name="input2" bindValueTo="$s2" /></p>
  <p>Modify subset 3: <mathInput name="input3" bindValueTo="$s3" /></p>
  <p>Modify subset 4: <mathInput name="input4" bindValueTo="$s4" /></p>
  <p>Modify subset 5: <mathInput name="input5" bindValueTo="$s5" /></p>
  <p>Modify subset 6: <mathInput name="input6" bindValueTo="$s6" /></p>
  <p>Modify subset 7: <mathInput name="input7" bindValueTo="$s7" /></p>
  <p>Modify subset 8: <mathInput name="input8" bindValueTo="$s8" /></p>
  <p>Modify subset 9: <mathInput name="input9" bindValueTo="$s9" /></p>

  `,
        });

        async function check_items(str: string, str0?: string) {
            if (str0 === undefined) {
                str0 = str;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 1; i <= 9; i++) {
                expect(
                    cleanLatex(
                        stateVariables[await resolvePathToNodeIdx(`s${i}`)]
                            .stateValues.latex,
                    ),
                ).eq(str);

                expect(
                    cleanLatex(
                        stateVariables[await resolvePathToNodeIdx(`input${i}`)]
                            .stateValues.rawRendererValue,
                    ),
                ).eq(str);
            }

            expect(
                cleanLatex(
                    stateVariables[await resolvePathToNodeIdx(`input0`)]
                        .stateValues.rawRendererValue,
                ),
            ).eq(str0);
        }

        await check_items("(0,1)");

        await updateMathInputValue({
            latex: "x \\ge 3",
            componentIdx: await resolvePathToNodeIdx("input0"),
            core,
        });
        await check_items("[3,\\infty)", "x\\ge3");

        await updateMathInputValue({
            latex: "{q\\mid q=5}",
            componentIdx: await resolvePathToNodeIdx("input1"),
            core,
        });
        await check_items("\\{5\\}");

        await updateMathInputValue({
            latex: "[-\\infty, \\pi)",
            componentIdx: await resolvePathToNodeIdx("input2"),
            core,
        });
        await check_items("(-\\infty,3.141592654)");

        await updateMathInputValue({
            latex: "(-\\infty,\\infty)",
            componentIdx: await resolvePathToNodeIdx("input3"),
            core,
        });
        await check_items("R");

        await updateMathInputValue({
            latex: "x\\in \\emptyset",
            componentIdx: await resolvePathToNodeIdx("input4"),
            core,
        });
        await check_items("\\varnothing");

        await updateMathInputValue({
            latex: "x\\notin [9, \\infty)",
            componentIdx: await resolvePathToNodeIdx("input5"),
            core,
        });
        await check_items("(-\\infty,9)");

        await updateMathInputValue({
            latex: "{7}\\ni x",
            componentIdx: await resolvePathToNodeIdx("input6"),
            core,
        });
        await check_items("\\{7\\}");

        await updateMathInputValue({
            latex: "(-\\infty, -2) \\not\\ni x",
            componentIdx: await resolvePathToNodeIdx("input7"),
            core,
        });
        await check_items("[-2,\\infty)");

        await updateMathInputValue({
            latex: "\\{1\\}^c \\cap \\{v \\mid v \\ge 1 \\}",
            componentIdx: await resolvePathToNodeIdx("input8"),
            core,
        });
        await check_items("(1,\\infty)");

        await updateMathInputValue({
            latex: "x \\ne -6",
            componentIdx: await resolvePathToNodeIdx("input9"),
            core,
        });
        await check_items("(-\\infty,-6)\\cup(-6,\\infty)");
    });

    it("union of subset with numbers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number name="x1">-9</number>
  <number name="x2">-6</number>
  <number name="x3">-1</number>
  <number name="x4">8</number>
  <subsetOfReals name="S">
    ($x1,$x2) union ($x3,$x4)
  </subsetOfReals>
  <subsetOfReals name="Sclosed">$S union $x1 union $x2 union $x3 union $x4</subsetOfReals>


  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("S")].stateValues.text,
        ).eq("( -9, -6 ) ∪ ( -1, 8 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("Sclosed")].stateValues
                .text,
        ).eq("[ -9, -6 ] ∪ [ -1, 8 ]");
    });

    it("point and interval properties", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <subsetOfReals name="empty">emptyset</subsetOfReals>
  <subsetOfReals name="interval">[-1,2)</subsetOfReals>
  <subsetOfReals name="intervalSingleton">(-1,2] union {-5}</subsetOfReals>
  <subsetOfReals name="missPoint">(-infinity,3) union (3,infinity)</subsetOfReals>
  <subsetOfReals name="R">R</subsetOfReals>

  <p name="emptyPoints">empty points: $empty.points</p>
  <p name="emptyPointsClosed">empty points closed: $empty.pointsClosed</p>
  <p name="emptyIntervals">empty intervals: $empty.intervals</p>
  <p name="emptyIsolated">empty isolated points: $empty.isolatedPoints</p>

  <p name="intervalPoints">interval points: $interval.points</p>
  <p name="intervalPointsClosed">interval points closed: $interval.pointsClosed</p>
  <p name="intervalIntervals">interval intervals: $interval.intervals</p>
  <p name="intervalIsolated">interval isolated points: $interval.isolatedPoints</p>

  <p name="intervalSingletonPoints">intervalSingleton points: $intervalSingleton.points</p>
  <p name="intervalSingletonPointsClosed">intervalSingleton points closed: $intervalSingleton.pointsClosed</p>
  <p name="intervalSingletonIntervals">intervalSingleton intervals: $intervalSingleton.intervals</p>
  <p name="intervalSingletonIsolated">intervalSingleton isolated points: $intervalSingleton.isolatedPoints</p>

  <p name="missPointPoints">missPoint points: $missPoint.points</p>
  <p name="missPointPointsClosed">missPoint points closed: $missPoint.pointsClosed</p>
  <p name="missPointIntervals">missPoint intervals: $missPoint.intervals</p>
  <p name="missPointIsolated">missPoint isolated points: $missPoint.isolatedPoints</p>

  <p name="RPoints">R points: $R.points</p>
  <p name="RPointsClosed">R points closed: $R.pointsClosed</p>
  <p name="RIntervals">R intervals: $R.intervals</p>
  <p name="RIsolated">R isolated points: $R.isolatedPoints</p>


  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("emptyPoints")]
                .stateValues.text,
        ).eq("empty points: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("emptyPointsClosed")]
                .stateValues.text,
        ).eq("empty points closed: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("emptyIntervals")]
                .stateValues.text,
        ).eq("empty intervals: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("emptyIsolated")]
                .stateValues.text,
        ).eq("empty isolated points: ");

        expect(
            stateVariables[await resolvePathToNodeIdx("intervalPoints")]
                .stateValues.text,
        ).eq("interval points: -1, 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("intervalPointsClosed")]
                .stateValues.text,
        ).eq("interval points closed: true, false");
        expect(
            stateVariables[await resolvePathToNodeIdx("intervalIntervals")]
                .stateValues.text,
        ).eq("interval intervals: [ -1, 2 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("intervalIsolated")]
                .stateValues.text,
        ).eq("interval isolated points: ");

        expect(
            stateVariables[
                await resolvePathToNodeIdx("intervalSingletonPoints")
            ].stateValues.text,
        ).eq("intervalSingleton points: -5, -1, 2");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("intervalSingletonPointsClosed")
            ].stateValues.text,
        ).eq("intervalSingleton points closed: true, false, true");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("intervalSingletonIntervals")
            ].stateValues.text,
        ).eq("intervalSingleton intervals: ( -1, 2 ]");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("intervalSingletonIsolated")
            ].stateValues.text,
        ).eq("intervalSingleton isolated points: -5");

        expect(
            stateVariables[await resolvePathToNodeIdx("missPointPoints")]
                .stateValues.text,
        ).eq("missPoint points: 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("missPointPointsClosed")]
                .stateValues.text,
        ).eq("missPoint points closed: false");
        expect(
            stateVariables[await resolvePathToNodeIdx("missPointIntervals")]
                .stateValues.text,
        ).eq("missPoint intervals: ( -∞, 3 ), ( 3, ∞ )");
        expect(
            stateVariables[await resolvePathToNodeIdx("missPointIsolated")]
                .stateValues.text,
        ).eq("missPoint isolated points: ");

        expect(
            stateVariables[await resolvePathToNodeIdx("RPoints")].stateValues
                .text,
        ).eq("R points: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("RPointsClosed")]
                .stateValues.text,
        ).eq("R points closed: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("RIntervals")].stateValues
                .text,
        ).eq("R intervals: ( -∞, ∞ )");
        expect(
            stateVariables[await resolvePathToNodeIdx("RIsolated")].stateValues
                .text,
        ).eq("R isolated points: ");
    });
});
