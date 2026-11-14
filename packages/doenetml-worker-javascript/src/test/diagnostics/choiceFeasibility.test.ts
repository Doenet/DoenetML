import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Load `doenetML` and return its errors, as `code: message`, and the codes
 * of its infos.
 */
async function load(doenetML: string, requestedVariantIndex = 1) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        requestedVariantIndex,
    });
    await core.returnAllStateVariables(false, true);
    const diagnostics = getDiagnosticsByType(core);
    return {
        core,
        resolvePathToNodeIdx,
        errors: diagnostics.errors.map((d) => `${d.code}: ${d.message}`),
        codes: diagnostics.errors.map((d) => d.code),
        infos: diagnostics.infos.map((d) => d.code),
    };
}

/** The errors of `doenetML` in each of the first few variants. */
async function errorsInVariants(doenetML: string, variants = [1, 2, 3, 4]) {
    const all: string[][] = [];
    for (const v of variants) {
        all.push((await load(doenetML, v)).errors);
    }
    return all;
}

/**
 * Every choice that can appear can be made as written (D39, SEL-5): proven
 * at load over every value its parameters can take, or an error in every
 * variant that names the value that fails.
 */
describe("Feasibility is proven at load (SEL-5) @group4", () => {
    const cases: {
        tag: string;
        proven: string;
        fails: string;
        message: string;
    }[] = [
        {
            tag: "<selectFromSequence>, a range from another choice",
            proven: `<selectFromSequence name="a" from="5" to="10"/><selectFromSequence to="$a" numToSelect="3"/>`,
            fails: `<selectFromSequence name="a" from="1" to="10"/><selectFromSequence to="$a" numToSelect="3"/>`,
            message:
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, it has 1 value to select 3 from.",
        },
        {
            tag: "<selectFromSequence>, an exclude from another choice",
            proven: `<selectFromSequence name="a" to="10"/><selectFromSequence to="10" exclude="$a" numToSelect="9"/>`,
            fails: `<selectFromSequence name="a" to="10"/><selectFromSequence to="10" exclude="$a" numToSelect="10"/>`,
            message:
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, it has 9 values to select 10 from.",
        },
        {
            tag: "<selectPrimeNumbers>, a range from another choice",
            proven: `<selectPrimeNumbers name="a" from="10" to="20"/><selectPrimeNumbers to="$a" numToSelect="3"/>`,
            fails: `<selectPrimeNumbers name="a" to="20"/><selectPrimeNumbers to="$a" numToSelect="3"/>`,
            message:
                "`<selectPrimeNumbers>` can't always select as written: when `$a` = 2, it has 1 prime to select 3 from.",
        },
        {
            tag: "<select>, numToSelect from another choice",
            proven: `<selectFromSequence name="a" from="1" to="3"/><select numToSelect="$a">u v w</select>`,
            fails: `<selectFromSequence name="a" from="3" to="4"/><select numToSelect="$a">u v w</select>`,
            message:
                "`<select>` can't always select as written: when `$a` = 4, it has 3 options to select 4 from.",
        },
        {
            tag: "<select>, options for variants",
            proven: `<variantControl numVariants="2" variantNames="a b"/><selectFromSequence name="n" from="2" to="2"/><select numToSelect="$n"><option selectForVariants="a b">u</option><option selectForVariants="a b">v</option></select>`,
            fails: `<variantControl numVariants="2" variantNames="a b"/><selectFromSequence name="n" from="1" to="2"/><select numToSelect="$n"><option selectForVariants="a b">u</option><option selectForVariants="a b">v</option></select>`,
            message:
                "`<select>` can't always select as written: when `$n` = 1, `numToSelect` is 1, but variant a has 2 options.",
        },
        {
            tag: "<selectFromSequence coprime>, a range from another choice",
            proven: `<selectFromSequence name="a" from="1" to="3"/><selectFromSequence from="$a" to="9" numToSelect="2" coprime/>`,
            fails: `<selectFromSequence name="a" from="0" to="2"/><selectFromSequence from="$a" to="5" numToSelect="2" coprime/>`,
            message:
                "`<selectFromSequence>` can't always select as written: when `$a` = 0, no 2 of its values have no common factor.",
        },
        {
            tag: "<selectFromSequence excludeCombinations>, a range from another choice",
            proven: `<selectFromSequence name="a" from="2" to="3"/><selectFromSequence to="$a" numToSelect="2" withReplacement excludeCombinations="(1 1) (2 2)"/>`,
            fails: `<selectFromSequence name="a" from="1" to="3"/><selectFromSequence to="$a" numToSelect="2" withReplacement excludeCombinations="(1 1) (2 2)"/>`,
            message:
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, every combination of 2 values is excluded.",
        },
    ];

    for (const { tag, proven, fails, message } of cases) {
        it(`${tag}: proven`, async () => {
            for (const errors of await errorsInVariants(proven)) {
                expect(errors).eqls([]);
            }
        });
        it(`${tag}: an error in every variant, naming the value`, async () => {
            for (const errors of await errorsInVariants(fails)) {
                expect(errors).eqls([`doenet-e0073: ${message}`]);
            }
        });
    }

    it("values that depend on each other are taken together, never as if independent", async () => {
        // `to` is always 2 more than `from`, so 3 values, whatever `a` is
        const { errors } = await load(
            `<selectFromSequence name="a" to="5"/><selectFromSequence from="$a" to="$a+2" numToSelect="3"/>`,
        );
        expect(errors).eqls([]);
        // `a` is never above `b`, as `a` ranges up to `b`
        const nested = await load(
            `<selectFromSequence name="b" to="5"/><selectFromSequence name="a" to="$b"/><selectFromSequence from="$a" to="$b"/>`,
        );
        expect(nested.errors).eqls([]);
    });

    it("an entry of a choice of several", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" to="3" numToSelect="2"/><selectFromSequence to="$a[1]" numToSelect="$a[2]"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a[2]` = 2, `$a[1]` = 1, it has 1 value to select 2 from.",
        ]);
    });

    it("entries of a choice without replacement are different values", async () => {
        // `$a[1]` and `$a[2]` are never equal, so `d` is at least 1
        const distinct = await load(
            `<selectFromSequence name="a" to="9" numToSelect="2"/><number name="d">abs($a[1]-$a[2])</number><selectFromSequence to="$d"/>`,
        );
        expect(distinct.errors).eqls([]);
        // with replacement they can be equal, and `d` is then 0
        const same = await load(
            `<selectFromSequence name="a" to="9" numToSelect="2" withReplacement/><number name="d">abs($a[1]-$a[2])</number><selectFromSequence to="$d"/>`,
        );
        expect(same.errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a[1]` = 1, `$a[2]` = 1, it has 0 values to select 1 from.",
        ]);
    });

    it("options for variants must match numToSelect even when it is 0", async () => {
        const { errors } = await load(
            `<variantControl numVariants="2" variantNames="a b"/><selectFromSequence name="n" from="0" to="1"/><select numToSelect="$n"><option selectForVariants="a">u</option><option selectForVariants="b">v</option></select>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$n` = 0, `numToSelect` is 0, but variant a has 1 option.",
        ]);
    });

    it("an exclude of a choice of several leaves out only values the choice has", async () => {
        // `b` is never 1, 2, 3 or 4, so nothing is left out
        const outside = await load(
            `<selectFromSequence name="b" from="20" to="30" numToSelect="2"/><selectFromSequence name="a" from="3" to="4"/><selectFromSequence to="$a" exclude="$b" numToSelect="$a-1"/>`,
        );
        expect(outside.errors).eqls([]);
        // `b` can be 1 and 2
        const inside = await load(
            `<selectFromSequence name="b" to="10" numToSelect="2"/><selectFromSequence name="a" from="3" to="4"/><selectFromSequence to="$a" exclude="$b" numToSelect="$a-1"/>`,
        );
        expect(inside.errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 3, it has 1 value to select 2 from.",
        ]);
    });

    it("an exclude that may not be a value of the choice is not said to leave one out", async () => {
        // the same value excluded twice leaves out one
        const twice = await load(
            `<selectFromSequence name="a" from="3" to="4"/><selectFromSequence type="math" from="x" length="$a" exclude="x+1 x+1" numToSelect="2"/>`,
        );
        expect(twice.errors).eqls([]);
        // `y` may or may not be a value: it can't be shown, which isn't
        // said to be too few values
        const symbol = await load(
            `<selectFromSequence name="a" from="3" to="4"/><selectFromSequence type="math" from="x" length="$a" exclude="y" numToSelect="3"/>`,
        );
        expect(symbol.errors).eqls([
            "doenet-e0073: DoenetML can't show that `<selectFromSequence>` can always select as written: it can't decide whether it can when `$a` = 3. Write its parameters so that it can, such as with `numToSelect` no larger than the fewest values it can have.",
        ]);
    });

    it("a letters choice's value in another letters choice's from or to", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" type="letters" from="a" to="c"/><selectFromSequence type="letters" from="a" to="$a" numToSelect="2"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = a, it has 1 value to select 2 from.",
        ]);
        const proven = await load(
            `<selectFromSequence name="a" type="letters" from="c" to="e"/><selectFromSequence type="letters" from="$a" to="z" numToSelect="2"/>`,
        );
        expect(proven.errors).eqls([]);
        // with space around it, the text isn't letters when the document
        // runs (it then has no values), and the check reads it as the
        // document does
        const spaced = await load(
            `<selectFromSequence name="a" type="letters" from="c" to="e"/><selectFromSequence type="letters" from="a" to="$a " numToSelect="3"/>`,
        );
        expect(spaced.errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = c, `to` isn't letters.",
        ]);
    });

    it("a letter is named as a letter", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" to="c" type="letters"/><selectFromSequence type="letters" from="a" to="c" exclude="$a" numToSelect="3"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = a, it has 2 values to select 3 from.",
        ]);
    });

    // a time limit: going through each value took near a minute
    it("long ranges are checked without going through their values", async () => {
        // 20000 combinations of values, each with a range of 40001 values,
        // gone through one by one: the bounds don't prove it, as `$b/$b`
        // has no bound when `b` can be -1 or 1
        const { errors } = await load(
            `<selectFromSequence name="a" to="1250"/><selectFromSequence name="b" from="-1" to="1" exclude="0"/><selectFromSequence name="c" to="8"/><selectFromSequence from="$a+$c" to="$a+$c+40000*$b/$b" exclude="3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20" numToSelect="2"/>`,
        );
        expect(errors).eqls([]);
    }, 20000);

    // a time limit: each choice went through every value assigned to
    // every choice before it, then through 20000 combinations of them
    // before the bounds; the check took seconds, and now takes milliseconds.
    // The choices are in a case not shown, which the check reads but the
    // document doesn't make, so the time is the check's.
    it("many choices that exclude the ones before are each checked quickly", async () => {
        let choices = `<selectFromSequence name="c0" to="100"/>`;
        for (let k = 1; k < 300; k++) {
            choices += `<selectFromSequence name="c${k}" to="100" exclude="$c${k - 1} $c${Math.max(0, k - 2)}"/>`;
        }
        // about 0.5 s each, where the check alone took 2.5 s
        let start = Date.now();
        const { errors } = await load(
            `<conditionalContent><case condition="false">${choices}</case></conditionalContent>`,
        );
        expect(errors).eqls([]);
        expect(Date.now() - start).lessThan(2000);
        // and one too many is still found, after the chain
        start = Date.now();
        const { codes } = await load(
            `<conditionalContent><case condition="false">${choices}<selectFromSequence to="3" exclude="$c298 $c299" numToSelect="2"/></case></conditionalContent>`,
        );
        expect(codes).eqls(["doenet-e0073"]);
        expect(Date.now() - start).lessThan(2000);
    }, 20000);

    it("a selection reading an extend in error is not an error of its own", async () => {
        // `b` is an `_error` (`doenet-e0056`), which `$b` reads as blank
        const { codes } = await load(
            `<selectFromSequence name="a" from="5" to="6"/><selectFromSequence name="b" extend="$a" from="5" to="6"/><selectFromSequence name="c" to="$b"/>`,
        );
        expect(codes).eqls(["doenet-e0056", "doenet-e0056"]);
    });

    it("with replacement, one value is enough", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" to="5"/><selectFromSequence to="$a" numToSelect="4" withReplacement/>`,
        );
        expect(errors).eqls([]);
    });

    it("a boolean parameter that reads a choice is what it reads, for each value", async () => {
        const { errors } = await load(
            `<select name="b"><option><boolean>true</boolean></option><option><boolean>false</boolean></option></select><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$b">u</select>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$a` = 2, `$b` = false, it has 1 option to select 2 from.",
        ]);
    });

    it("a boolean parameter that references a literal <boolean> is its value", async () => {
        const { errors } = await load(
            `<boolean name="b">true</boolean><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$b">u</select>`,
        );
        expect(errors).eqls([]);
        const isFalse = await load(
            `<boolean name="b">false</boolean><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$b">u</select>`,
        );
        expect(isFalse.errors).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$a` = 2, it has 1 option to select 2 from.",
        ]);
    });

    it("a boolean parameter reads a <boolean> through a chain, and a module attribute", async () => {
        // `c` is `b`, which is true: the document always selects
        const chain = await load(
            `<boolean name="b">true</boolean><boolean name="c">$b</boolean><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$c">u</select>`,
        );
        expect(chain.errors).eqls([]);
        // a `<number>` not 0 is true
        const number = await load(
            `<number name="n">2</number><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$n">u</select>`,
        );
        expect(number.errors).eqls([]);
        const isFalse = await load(
            `<boolean name="b">false</boolean><boolean name="c">$b</boolean><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$c">u</select>`,
        );
        expect(isFalse.errors).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$a` = 2, it has 1 option to select 2 from.",
        ]);
        // written only in the module, the same in every instance
        const module = await load(
            `<module name="m"><moduleAttributes><boolean name="wr">true</boolean></moduleAttributes><select numToSelect="3" withReplacement="$wr">u v</select></module>`,
        );
        expect(module.errors).eqls([]);
    });

    it("a boolean parameter reading a choice in error is that error", async () => {
        // `x` has no value when `a` is 1; `withReplacement` reads it
        const { errors } = await load(
            `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence name="x" from="0" to="$a" exclude="0 1"/><select numToSelect="3" withReplacement="$x">u v</select>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 1, it has 0 values to select 1 from.",
        ]);
    });

    it("a boolean written as an expression with no reference is its value", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="1>0">u</select>`,
        );
        expect(errors).eqls([]);
    });

    it("a <selectRandomNumbers> ranges over what it can draw", async () => {
        const discrete = await load(
            `<selectRandomNumbers name="r" type="discreteUniform" from="3" to="5"/><selectFromSequence to="$r" numToSelect="3"/>`,
        );
        expect(discrete.errors).eqls([]);
        const uniform = await load(
            `<selectRandomNumbers name="r" from="1" to="5"/><selectFromSequence to="$r"/>`,
        );
        expect(uniform.errors).eqls([]);
        const tooFew = await load(
            `<selectRandomNumbers name="r" from="1" to="5"/><selectFromSequence to="$r" numToSelect="2"/>`,
        );
        expect(tooFew.codes).eqls(["doenet-e0073"]);
    });

    it("a choice in error is reported in place of the choice, and the rest renders", async () => {
        const { core, resolvePathToNodeIdx, codes } = await load(
            `<selectFromSequence name="a" from="1" to="10"/><p name="p">A <selectFromSequence name="s" to="$a" numToSelect="3"/> B</p>`,
        );
        expect(codes).eqls(["doenet-e0073"]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("s")].componentType,
        ).eq("_error");
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).contains("A");
    });

    it("a choice in error adds no variants", async () => {
        for (const [doenetML, numVariants] of [
            [`<selectFromSequence name="a" from="1" to="10"/>`, 10],
            [
                `<selectFromSequence name="a" from="1" to="10"/><selectFromSequence to="$a" numToSelect="3"/>`,
                10,
            ],
        ] as const) {
            const { core, resolvePathToNodeIdx } = await load(doenetML);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
                doenetML,
            ).toHaveLength(numVariants);
        }
    });

    it("a copy or an extend of a choice in error is the same error, reported once", async () => {
        for (const reference of [
            `<selectFromSequence copy="$s"/>`,
            `<selectFromSequence extend="$s"/>`,
        ]) {
            const { codes } = await load(
                `<selectFromSequence name="a" from="1" to="10"/><selectFromSequence name="s" to="$a" numToSelect="3"/>${reference}`,
            );
            expect(codes, reference).eqls(["doenet-e0073"]);
        }
    });

    it("a choice that reads a choice in error is the same error, reported once", async () => {
        const { codes } = await load(
            `<selectFromSequence name="a" from="1" to="10"/><selectFromSequence name="s" to="$a" numToSelect="3"/><selectFromSequence to="$s[1]" numToSelect="2"/>`,
        );
        expect(codes).eqls(["doenet-e0073"]);
    });

    it("a choice that reads a choice whose parameter can't be analysed is the same error, reported once", async () => {
        const { codes } = await load(
            `<function name="f">x^2</function><selectFromSequence name="s" to="$$f(3)"/><selectFromSequence to="$s" numToSelect="2"/>`,
        );
        expect(codes).eqls(["doenet-e0074"]);
    });

    it("a choice whose parameters read no value from the variant is left to the choice", async () => {
        // its own error, the same in every variant
        for (const errors of await errorsInVariants(
            `<number name="n">4</number><select numToSelect="$n">u v w</select>`,
        )) {
            expect(errors).eqls([
                "doenet-e0035: Cannot select 4 components from only 3.",
            ]);
        }
    });

    it("a choice in a case not shown is checked too", async () => {
        const { codes } = await load(
            `<booleanInput name="b"/><selectFromSequence name="a" from="1" to="10"/><conditionalContent condition="$b"><selectFromSequence to="$a" numToSelect="3"/></conditionalContent>`,
        );
        expect(codes).eqls(["doenet-e0073"]);
    });
});

/**
 * An iteration index ranges over every iteration that can exist: 1 to the
 * count, or 1, 2, 3, … with no end when the count comes from an input
 * (SEL-5, SEL-2).
 */
describe("An iteration index ranges over every iteration (SEL-5) @group4", () => {
    it("a literal count", async () => {
        expect(
            (
                await load(
                    `<repeatForSequence to="10" indexName="i"><selectFromSequence to="$i"/></repeatForSequence>`,
                )
            ).errors,
        ).eqls([]);
        expect(
            (
                await load(
                    `<repeatForSequence to="10" indexName="i"><selectFromSequence to="$i" numToSelect="3"/></repeatForSequence>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$i` = 1, it has 1 value to select 3 from.",
        ]);
    });

    it("a count from an input, with no end", async () => {
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><selectFromSequence to="$i"/></repeatForSequence>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><selectFromSequence to="$i" numToSelect="3"/></repeatForSequence>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$i` = 1, it has 1 value to select 3 from.",
        ]);
        // the same index on both ends cancels: 6 values in every iteration
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><selectFromSequence from="$i" to="$i+5" numToSelect="3"/></repeatForSequence>`,
                )
            ).codes,
        ).eqls([]);
        // and so does the index read as numToSelect
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><selectFromSequence to="$i" numToSelect="$i"/></repeatForSequence>`,
                )
            ).codes,
        ).eqls([]);
    });

    it("an iteration far along with no end is named", async () => {
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><selectFromSequence from="$i" to="1000000"/></repeatForSequence>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$i` = 1000001, it has 0 values to select 1 from.",
        ]);
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><select numToSelect="$i">a b c</select></repeatForSequence>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$i` = 4, it has 3 options to select 4 from.",
        ]);
    });

    it("iterations a reader makes later give no error when every one can select", async () => {
        const { core, resolvePathToNodeIdx, codes } = await load(
            `<mathInput name="n" prefill="0"/><repeatForSequence to="$n" indexName="i"><selectFromSequence to="$i+1" numToSelect="2"/></repeatForSequence>`,
        );
        expect(codes).eqls([]);
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(getDiagnosticsByType(core).errors).eqls([]);
    });

    it("a repeat's valueName", async () => {
        expect(
            (
                await load(
                    `<repeat for="3 4 5" valueName="v"><selectFromSequence to="$v" numToSelect="3"/></repeat>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `<repeat for="1 3 5" valueName="v"><selectFromSequence to="$v" numToSelect="3"/></repeat>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$v` = 1, it has 1 value to select 3 from.",
        ]);
        // a `<repeatForSequence>` whose count comes from an input: its
        // values are still 2, 3, 4, …
        expect(
            (
                await load(
                    `<mathInput name="n" prefill="3"/><repeatForSequence from="2" to="$n" valueName="v"><selectFromSequence to="$v" numToSelect="3"/></repeatForSequence>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$v` = 2, it has 2 values to select 3 from.",
        ]);
        // of another choice
        expect(
            (
                await load(
                    `<selectFromSequence name="a" from="1" to="9" numToSelect="2"/><repeat for="$a" valueName="v"><selectFromSequence to="$v" numToSelect="2"/></repeat>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$v` = 1, it has 1 value to select 2 from.",
        ]);
    });
});

/**
 * A parameter is in an analysable form (SEL-6): literals, references SEL-1
 * allows, a `<number>` of these, and `+ − × /`, `min`, `max`, `abs`,
 * `floor`, `ceil`, `round` of them. Anything else is an error at load.
 */
describe("A parameter is in an analysable form (SEL-6) @group4", () => {
    it("a <number> or <integer> whose content is in these forms", async () => {
        expect(
            (
                await load(
                    `<selectFromSequence name="a" to="5"/><number name="m">$a + 2</number><selectFromSequence to="10" numToSelect="$m"/>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `<selectFromSequence name="a" to="5"/><integer name="m">max(2, $a) - 1</integer><selectFromSequence to="3" numToSelect="$m"/>`,
                )
            ).codes,
        ).eqls(["doenet-e0073"]);
    });

    it("a literal is the value the document gives it (pi, e, 3!)", async () => {
        const choices = `<selectFromSequence name="a" to="3"/>`;
        // pi is 3.14..., so 1 to pi has 3 values, and 3! has 6; content
        // that reads nothing from the variant is its value in any form
        for (const literal of ["pi", "3!", "10/3", "$n^2"]) {
            expect(
                (
                    await load(
                        `${choices}<number name="n">2</number><number name="m">${literal}</number><selectFromSequence to="$m" numToSelect="$a"/>`,
                    )
                ).codes,
                literal,
            ).eqls([]);
        }
        // e is 2.71..., so 1 to e has 2 values
        expect(
            (
                await load(
                    `${choices}<number name="m">e</number><selectFromSequence to="$m" numToSelect="$a"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 3, it has 2 values to select 3 from.",
        ]);
    });

    it("a boolean written as an expression is the value the document gives it", async () => {
        const choices = `<selectFromSequence name="a" to="3"/>`;
        // `$n > 1` with n 2 is true: with replacement
        expect(
            (
                await load(
                    `<number name="n">2</number>${choices}<select numToSelect="$a" withReplacement="$n > 1">u</select>`,
                )
            ).codes,
        ).eqls([]);
        // with n 0 it is false
        expect(
            (
                await load(
                    `<number name="n">0</number>${choices}<select numToSelect="$a" withReplacement="$n > 1">u</select>`,
                )
            ).codes,
        ).eqls(["doenet-e0073"]);
        // with another choice in it, it is what that choice's value makes it
        expect(
            (
                await load(
                    `<selectFromSequence name="x" from="1" to="2"/>${choices}<select numToSelect="$a" withReplacement="$x > 0">u</select>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `<selectFromSequence name="x" from="0" to="1"/>${choices}<select numToSelect="$a" withReplacement="$x > 0">u</select>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$a` = 2, `$x` = 0, it has 1 option to select 2 from.",
        ]);
    });

    it("an option the check can't know decides nothing", async () => {
        // `$o` is an option that isn't one value: whether it is true isn't
        // known, so the select can't be shown to always select, rather
        // than taken as true or false
        const { errors } = await load(
            `<select name="o"><option><group><number>1</number></group></option></select><selectFromSequence name="a" to="3"/><select numToSelect="$a" withReplacement="$o">u</select>`,
        );
        expect(errors).toHaveLength(1);
        expect(errors[0]).toMatch(/^doenet-e0073: DoenetML can't show/);
    });

    it("an <integer> is its content rounded, as the document has it", async () => {
        const fails =
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 2, it has 1 value to select 2 from.";
        const choices = `<selectFromSequence name="a" from="2" to="3"/>`;
        // 2.4 is 2, which the exclude removes from 1, 2
        for (const integer of [
            `<integer name="k">2.4</integer>`,
            `<number name="n">2.4</number><integer name="k" extend="$n"/>`,
            `<number name="k"><integer>2.4</integer></number>`,
        ]) {
            expect(
                (
                    await load(
                        `${choices}${integer}<selectFromSequence to="$a" exclude="$k" numToSelect="2"/>`,
                    )
                ).errors,
                integer,
            ).eqls([fails]);
        }
        // a module attribute, as the module and a copy of it write it
        expect(
            (
                await load(
                    `${choices}<module name="m"><moduleAttributes><integer name="k">5</integer></moduleAttributes><selectFromSequence to="$a" exclude="$k" numToSelect="2"/></module><module copy="$m" k="2.4"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 2, `$k` = 2, it has 1 value to select 2 from.",
        ]);
        // 0.4 is 0, false
        expect(
            (
                await load(
                    `${choices}<integer name="k">0.4</integer><selectFromSequence to="2" numToSelect="$a" withReplacement="$k"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 3, it has 2 values to select 3 from.",
        ]);
        // from 1.4 or 2.4 is from 1 or 2: always 2 values or more
        expect(
            (
                await load(
                    `${choices}<integer name="k">$a-0.6</integer><selectFromSequence from="$k" to="3" numToSelect="2"/>`,
                )
            ).codes,
        ).eqls([]);
    });

    it("operators", async () => {
        for (const [numToSelect, codes] of [
            ["$a + 1", []],
            ["2$a", ["doenet-e0073"]],
            ["min($a, 2)", []],
            ["abs($a - 3)", []],
            ["floor($a / 2)", []],
            ["round($a/2) + 4", ["doenet-e0073"]],
        ] as const) {
            const { codes: found } = await load(
                `<selectFromSequence name="a" to="5"/><selectFromSequence to="6" numToSelect="${numToSelect}"/>`,
            );
            expect(found, numToSelect).eqls(codes);
        }
    });

    it("a function evaluated is not, and the error names it", async () => {
        const { errors } = await load(
            `<function name="f">x^2</function><selectFromSequence name="a" to="5"/><selectFromSequence to="$$f($a)"/>`,
        );
        expect(errors).eqls([
            "doenet-e0074: `to` of `<selectFromSequence>` reads `$$f($a)`, which DoenetML can't analyse to show that the selection can always be made. A parameter can be a literal; a reference to one value another random selection selects, a repeat's index or value, a module attribute, or a `<number>`, `<integer>` or `<math>` of these; and these combined with `+`, `-`, `*`, `/`, `min`, `max`, `abs`, `floor`, `ceil` and `round`.",
        ]);
    });

    it("a power in a <number> is not, and the error names the <number>", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" to="5"/><number name="m">$a^2</number><selectFromSequence to="30" numToSelect="$m"/>`,
        );
        expect(errors).toHaveLength(1);
        expect(errors[0]).toMatch(
            /^doenet-e0074: `numToSelect` of `<selectFromSequence>` reads `\$m`, a `<number>` holding `\$a\^2`/,
        );
    });

    it("references through extends and copies of literals are", async () => {
        const { codes } = await load(
            `<select numToSelect="$n">u v w x y z</select><number extend="$n3" name="n2"/><math extend="$num1" name="n"/><math name="num1">$n2+$num2</math><number name="num2">2</number><number name="n3">1</number>`,
        );
        expect(codes).eqls([]);
    });

    it("a component in an iteration, and a <sequence> in an exclude, are", async () => {
        expect(
            (
                await load(
                    `<repeat name="r" for="1" valueName="v"><number name="n">2</number></repeat><select numToSelect="$r[1].n">u v w</select>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `<sequence name="odds" from="1" to="9" step="2" hide/><selectFromSequence name="a" to="2"/><selectFromSequence to="10" exclude="$odds" numToSelect="$a+3"/>`,
                )
            ).codes,
        ).eqls([]);
    });

    it("an entry of a list written as literals, at an index in these forms", async () => {
        expect(
            (
                await load(
                    `<numberList name="ns">1 2</numberList><selectFromSequence name="k" to="2"/><select numToSelect="$ns[$k]">a b</select>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `<numberList name="ns">1 3</numberList><selectFromSequence name="k" to="2"/><select numToSelect="$ns[$k]">a b</select>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$k` = 2, it has 2 options to select 3 from.",
        ]);
    });

    it("a module attribute ranges over what the module and each copy of it write", async () => {
        const module = `<setup><module name="m"><moduleAttributes><integer name="k">2</integer></moduleAttributes><select numToSelect="$k">a b c</select></module></setup>`;
        expect(
            (
                await load(
                    `${module}<module copy="$m"/><module copy="$m" k="3"/>`,
                )
            ).codes,
        ).eqls([]);
        expect(
            (
                await load(
                    `${module}<module copy="$m"/><module copy="$m" k="4"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<select>` can't always select as written: when `$k` = 4, it has 3 options to select 4 from.",
        ]);
        // through a chain of copies, and from another choice
        expect(
            (
                await load(
                    `${module}<selectFromSequence name="a" to="4"/><module name="m1" copy="$m"/><module copy="$m1" k="$a"/>`,
                )
            ).codes,
        ).eqls(["doenet-e0073"]);
    });

    it("a choice in error for its form is an _error, and the rest renders", async () => {
        const { core, resolvePathToNodeIdx, codes } = await load(
            `<function name="f">x^2</function><p name="p">A <selectFromSequence name="s" to="$$f(2)"/> B</p>`,
        );
        expect(codes).eqls(["doenet-e0074"]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("s")].componentType,
        ).eq("_error");
    });
});

/**
 * Choices depending on each other are checked in order, with no cycle
 * (SEL-7): ranges flow forward.
 */
describe("Choices depending on each other (SEL-7) @group4", () => {
    it("a range flows forward through a chain", async () => {
        const { errors } = await load(
            `<selectFromSequence name="a" to="5"/><selectFromSequence name="b" to="$a"/><selectFromSequence to="3" numToSelect="$b"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$b` = 4, it has 3 values to select 4 from.",
        ]);
    });

    it("a choice written later is checked first", async () => {
        const { errors } = await load(
            `<selectFromSequence to="3" numToSelect="$b"/><selectFromSequence name="b" to="$a"/><selectFromSequence name="a" from="1" to="2"/>`,
        );
        expect(errors).eqls([]);
    });

    it("a cycle is a circular dependency, and no error of this check", async () => {
        const { codes } = await load(
            `<selectFromSequence name="c" to="$d"/><selectFromSequence name="d" to="$c"/>`,
        );
        expect(codes.every((c) => c === "doenet-e0005")).eq(true);
        expect(codes).not.toContain("doenet-e0073");
        expect(codes).not.toContain("doenet-e0074");
    });
});
