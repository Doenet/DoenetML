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

    it("an entry a choice may not select is nothing", async () => {
        // `b` selects one value when `a` is 1, so `$b[2]` is then nothing
        const fewer = await load(
            `<selectFromSequence name="a" to="2"/><selectFromSequence name="b" to="3" numToSelect="$a"/><selectFromSequence to="$b[2]+$a" numToSelect="2"/>`,
        );
        expect(fewer.errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$b[2]` is nothing, `$a` = 1, `to` isn't a number.",
        ]);
        // an index past the values selected
        const past = await load(
            `<selectFromSequence name="b" to="5" numToSelect="2"/><selectFromSequence name="k" to="3"/><selectFromSequence to="$b[$k]"/>`,
        );
        expect(past.errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$b[$k]` is nothing, `to` isn't a number.",
        ]);
        // a letters sequence reads nothing as the empty text
        const letters = await load(
            `<selectFromSequence name="b" type="letters" to="e" numToSelect="2"/><selectFromSequence type="letters" to="$b[3]"/>`,
        );
        expect(letters.errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$b[3]` is nothing, it has 0 values to select 1 from.",
        ]);
        // each entry is there: always selected, at an index always within
        for (const doenetML of [
            `<selectFromSequence name="a" from="2" to="3"/><selectFromSequence name="b" to="3" numToSelect="$a"/><selectFromSequence to="$b[2]+1" numToSelect="2"/>`,
            `<selectFromSequence name="b" to="5" numToSelect="2"/><selectFromSequence name="k" to="2"/><selectFromSequence to="$b[$k]"/>`,
            `<selectFromSequence name="b" to="5" numToSelect="3"/><repeat for="1 2 3" indexName="i"><selectFromSequence to="$b[$i]+1" numToSelect="2"/></repeat>`,
            // an exclude of nothing leaves nothing out
            `<selectFromSequence name="a" to="2"/><selectFromSequence name="b" to="3" numToSelect="$a"/><selectFromSequence to="5" exclude="$b[2]" numToSelect="4"/>`,
        ]) {
            expect((await load(doenetML)).errors, doenetML).eqls([]);
        }
    });

    it("a math sequence leaves out a value as it decides, with `equals`", async () => {
        // the sequence's 102nd value is -10 + 101 * 0.1, which `equals` 0.1:
        // left out when `a` is 1
        const { errors } = await load(
            `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence type="math" from="-10" step="0.1" length="102" exclude="$a/10" numToSelect="102"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 1, it has 101 values to select 102 from.",
        ]);
    });

    it("a value the check can't read is not shown as one", async () => {
        const { errors } = await load(
            `<select name="a"><option><number>1</number><number>2</number></option><option><number>3</number></option></select><selectFromSequence to="$a" numToSelect="2"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: DoenetML can't show that `<selectFromSequence>` can always select as written: it can't decide whether it can when `$a` is a value it can't read. Write its parameters so that it can, such as with `numToSelect` no larger than the fewest values it can have.",
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

    it("a math sequence with a length has that many values, whatever they are", async () => {
        // `a`'s values are maths (x, x + 1, x + 2), which the check doesn't
        // know; `s` has `length` values whatever they are
        const a = `<selectFromSequence name="a" type="math" from="x" step="1" length="3"/>`;
        for (const doenetML of [
            `${a}<selectFromSequence type="math" from="$a" step="1" length="2" numToSelect="2"/>`,
            `${a}<selectFromSequence type="math" from="y" step="$a" length="3" numToSelect="2"/>`,
            `${a}<selectFromSequence type="math" from="$a" length="3" numToSelect="2" exclude="$a"/>`,
            `<select name="b" type="math">x y</select><selectFromSequence type="math" from="$b" step="2" length="2" numToSelect="2"/>`,
        ]) {
            expect(await errorsInVariants(doenetML, [1, 2, 3])).eqls([
                [],
                [],
                [],
            ]);
        }
        // in a repeat with no end to its iterations (bounds), a length
        // alone says how many values it has
        const repeat = (attributes: string) =>
            `<mathInput name="n" prefill="3"/><repeatForSequence to="$n" indexName="i"><selectFromSequence type="math" ${attributes}/></repeatForSequence>`;
        expect(
            (await load(repeat(`from="$i/3" step="1/3" length="3"`))).errors,
        ).eqls([]);
        expect(
            (await load(repeat(`from="x" length="$i+1" numToSelect="2"`)))
                .errors,
        ).eqls([]);
        expect(
            (await load(repeat(`from="x" length="$i" numToSelect="2"`))).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$i` = 1, it has 1 value to select 2 from.",
        ]);
        // too few values whatever they are
        expect(
            (
                await load(
                    `${a}<selectFromSequence type="math" from="$a" length="2" numToSelect="3"/>`,
                )
            ).codes,
        ).eqls(["doenet-e0073"]);
    });

    it("a math sequence of numbers is bounded as a number sequence is", async () => {
        // in a repeat with no end to its iterations: `from` and `to` that are
        // numbers in every iteration
        const repeat = (attributes: string) =>
            `<mathInput name="n" prefill="3"/><repeatForSequence to="$n" indexName="i"><selectFromSequence type="math" ${attributes}/></repeatForSequence>`;
        for (const attributes of [
            `from="$i" to="$i+3" numToSelect="4"`,
            `from="$i/3" to="$i/3+1" step="1/3" numToSelect="4"`,
            `from="sqrt(2)+$i" to="sqrt(2)+$i+3" numToSelect="4"`,
            `from="$i" length="4" exclude="$i+1" numToSelect="3"`,
        ]) {
            expect((await load(repeat(attributes))).errors, attributes).eqls(
                [],
            );
        }
        for (const [attributes, problem] of [
            [`from="$i" to="$i+3" numToSelect="5"`, "4 values to select 5"],
            [
                `from="$i" length="4" exclude="$i+1" numToSelect="4"`,
                "3 values to select 4",
            ],
        ]) {
            expect((await load(repeat(attributes))).errors, attributes).eqls([
                `doenet-e0073: \`<selectFromSequence>\` can't always select as written: when \`$i\` = 1, it has ${problem} from.`,
            ]);
        }
    });

    it("an exclusion leaves out every value when the step is 0", async () => {
        // the bounds counted one exclusion as one value left out
        const repeat = (attributes: string) =>
            `<mathInput name="n" prefill="3"/><repeatForSequence to="$n" indexName="i"><selectFromSequence ${attributes}/></repeatForSequence>`;
        for (const [doenetML, when] of [
            [
                repeat(
                    `from="$i" step="0" length="5" exclude="$i" numToSelect="2"`,
                ),
                "`$i` = 1",
            ],
            [
                repeat(
                    `from="1" step="$i-1" length="5" exclude="1" numToSelect="2"`,
                ),
                "`$i` = 1",
            ],
            [
                `<selectFromSequence name="b" from="0" to="1"/><selectFromSequence from="3" step="$b" length="5" exclude="3" numToSelect="2"/>`,
                "`$b` = 0",
            ],
        ]) {
            expect((await load(doenetML)).errors, doenetML).eqls([
                `doenet-e0073: \`<selectFromSequence>\` can't always select as written: when ${when}, it has 0 values to select 2 from.`,
            ]);
        }
        // a math sequence whose values are the same symbol
        const b = `<select name="b"><option><math>x</math></option><option><math>y</math></option></select>`;
        for (const step of ["0", "x-x"]) {
            expect(
                (
                    await load(
                        `${b}<selectFromSequence type="math" from="x" step="${step}" length="5" exclude="$b" numToSelect="2"/>`,
                    )
                ).codes,
                step,
            ).eqls(["doenet-e0073"]);
        }
        // a step that isn't 0
        expect(
            (
                await load(
                    repeat(
                        `from="1" step="$i" length="5" exclude="1" numToSelect="4"`,
                    ),
                )
            ).codes,
        ).eqls([]);
    });

    it("a value a choice isn't known to take is not named as one that fails", async () => {
        // `a`'s `to` is 3 (`valueOnNaN`), which the check can't compute, so
        // it doesn't know what `a` can be: it can't show the selection,
        // and doesn't say `$a` can be 0
        const { errors } = await load(
            `<number name="n" valueOnNaN="3">x</number>
<selectFromSequence name="a" from="1" to="$n"/>
<selectFromSequence to="$a+1" numToSelect="2"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: DoenetML can't show that `<selectFromSequence>` can always select as written: it can't decide whether it can when `$a` ∈ [-∞, ∞]. Write its parameters so that it can, such as with `numToSelect` no larger than the fewest values it can have.",
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
        // a parameter compiled holds the letter `$a` holds: space around the
        // reference is no part of it, in the check and when the document
        // runs (`utils/selectionParameters.ts`)
        const spaced = await load(
            `<selectFromSequence name="a" type="letters" from="c" to="e"/><selectFromSequence name="s" type="letters" from="a" to="$a " numToSelect="3"/>`,
        );
        expect(spaced.errors).eqls([]);
        const stateVariables = await spaced.core.returnAllStateVariables(
            false,
            true,
        );
        expect(
            stateVariables[await spaced.resolvePathToNodeIdx("s")].stateValues
                .selectedValues,
        ).toHaveLength(3);
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

    it("a reference that names nothing is a blank, as the attribute written empty, and the choice's failure is an error", async () => {
        // `$nothing` names nothing in every variant (`doenet-w0104`): what
        // the choice can select is decided by the DoenetML, so a failure is
        // the choice's own error, as with `to=""`, not an info
        const length0 =
            "doenet-e0036: Cannot select 1 values from a sequence of length 0.";
        const primes0 =
            "doenet-e0047: Cannot select 1 values from a list of primes of length 0";
        for (const [doenetML, expected, reference] of [
            [`<selectFromSequence from="1" to=""/>`, length0, null],
            [
                `<selectFromSequence from="1" to="$nothing"/>`,
                length0,
                "$nothing",
            ],
            [
                `<selectFromSequence from="1" to="$nothing+1"/>`,
                length0,
                "$nothing",
            ],
            [
                `<selectFromSequence from="1" to="$nothing.x"/>`,
                length0,
                "$nothing.x",
            ],
            [
                `<selectFromSequence from="$nothing" to="5"/>`,
                length0,
                "$nothing",
            ],
            [
                `<selectFromSequence from="1" to="5" step="$nothing"/>`,
                length0,
                "$nothing",
            ],
            [
                `<selectFromSequence from="1" length="$nothing"/>`,
                length0,
                "$nothing",
            ],
            [
                `<selectFromSequence type="letters" from="a" to="$nothing"/>`,
                length0,
                "$nothing",
            ],
            [
                `<selectFromSequence type="math" from="1" to="$nothing"/>`,
                length0,
                "$nothing",
            ],
            [
                `<number name="k">$nothing</number><selectFromSequence from="1" to="$k"/>`,
                length0,
                "$nothing",
            ],
            [
                `<repeat for="1 2"><selectFromSequence name="q" to="5"/></repeat><selectFromSequence from="1" to="$q"/>`,
                length0,
                "$q",
            ],
            [
                `<selectFromSequence from="1" to="2" numToSelect="3" withReplacement="$nothing"/>`,
                "doenet-e0036: Cannot select 3 values from a sequence of length 2.",
                "$nothing",
            ],
            [
                `<selectPrimeNumbers from="$nothing" to="10"/>`,
                primes0,
                "$nothing",
            ],
            [`<selectPrimeNumbers maxValue="$nothing"/>`, primes0, "$nothing"],
        ] as const) {
            for (const variant of [1, 2]) {
                const { core, errors, infos } = await load(doenetML, variant);
                expect(errors, doenetML).eqls([expected]);
                expect(infos, doenetML).not.toContain(expected.split(":")[0]);
                const warnings = getDiagnosticsByType(core)
                    .warnings.map((d) => `${d.code}: ${d.message}`)
                    .filter((w) => w.startsWith("doenet-w0104"));
                expect(warnings, doenetML).eqls(
                    reference === null
                        ? []
                        : [
                              `doenet-w0104: No referent found for reference: \`${reference}\``,
                          ],
                );
            }
        }

        // one that still selects with the blank is unchanged
        for (const doenetML of [
            `<selectFromSequence from="1" to="$nothing" numToSelect="0"/>`,
            `<selectFromSequence from="1" to="5" exclude="$nothing" numToSelect="5"/>`,
        ]) {
            const { errors } = await load(doenetML);
            expect(errors, doenetML).eqls([]);
        }

        // a `numToSelect` that names nothing isn't a number: the choice
        // can't select as written, as `numToSelect=""`
        for (const [doenetML, tag] of [
            [
                `<selectFromSequence from="1" to="5" numToSelect="$nothing"/>`,
                "selectFromSequence",
            ],
            [
                `<select numToSelect="$nothing"><option>u</option></select>`,
                "select",
            ],
        ] as const) {
            const { errors } = await load(doenetML);
            expect(errors, doenetML).eqls([
                `doenet-e0075: \`<${tag}>\` can't select as written: \`numToSelect\` isn't a number.`,
            ]);
        }
    });

    it("a reference that names nothing, beside one that reads the variant, is a blank in each value checked", async () => {
        const a = `<selectFromSequence name="a" from="1" to="3"/>`;
        for (const [doenetML, message] of [
            [
                `${a}<selectFromSequence from="$a" to="$nothing"/>`,
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, `to` isn't a number.",
            ],
            [
                `${a}<selectFromSequence from="$a" to="$nothing+7"/>`,
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, `to` isn't a number.",
            ],
            [
                `${a}<selectFromSequence from="1" to="$a+$nothing"/>`,
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, `to` isn't a number.",
            ],
            [
                `${a}<selectFromSequence from="$a" to="5" numToSelect="$nothing"/>`,
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, `numToSelect` isn't a number.",
            ],
            [
                `${a}<selectFromSequence from="1" to="$a" numToSelect="3" withReplacement="$nothing"/>`,
                "`<selectFromSequence>` can't always select as written: when `$a` = 1, it has 1 value to select 3 from.",
            ],
        ] as const) {
            for (const errors of await errorsInVariants(doenetML, [1, 2])) {
                expect(errors, doenetML).eqls([`doenet-e0073: ${message}`]);
            }
        }

        // as `to=""` beside `from="$a"` is
        for (const errors of await errorsInVariants(
            `${a}<selectFromSequence from="$a" to=""/>`,
            [1, 2],
        )) {
            expect(errors).eqls([
                "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 1, `to` isn't a number.",
            ]);
        }

        // one that selects with the blank in every variant is unchanged
        for (const doenetML of [
            `${a}<selectFromSequence from="$a" to="$nothing" numToSelect="0"/>`,
            `${a}<selectFromSequence from="1" to="5" exclude="$a $nothing" numToSelect="4"/>`,
        ]) {
            for (const errors of await errorsInVariants(doenetML, [1, 2])) {
                expect(errors, doenetML).eqls([]);
            }
        }
    });

    it("a selection's failure is an error, never a missing selection with an info", async () => {
        // A selection's parameters are decided by the DoenetML or proven at
        // load over every value, and never change (SEL-1, SEL-5): one that
        // can't select as written is an error in every variant, wherever its
        // parameters come from. A `numToSelect` that isn't a number selects
        // nothing as written, so it is such a failure, as the check finds
        // in each value (`doenet-e0073`); `numToSelect="0"` asks for nothing.
        const notANumber = (tag: string, attribute: string) =>
            `doenet-e0075: \`<${tag}>\` can't select as written: \`${attribute}\` isn't a number.`;
        const length0 =
            "doenet-e0036: Cannot select 1 values from a sequence of length 0.";
        const options = "<option>u</option><option>v</option>";
        for (const [doenetML, expected] of [
            [
                `<select numToSelect="x">${options}</select>`,
                notANumber("select", "numToSelect"),
            ],
            [
                `<select numToSelect="">${options}</select>`,
                notANumber("select", "numToSelect"),
            ],
            [
                `<number name="k">5</number><select numToSelect="$k+">${options}</select>`,
                notANumber("select", "numToSelect"),
            ],
            [
                `<select numToSelect="-1/0">${options}</select>`,
                notANumber("select", "numToSelect"),
            ],
            [
                `<selectFromSequence to="5" numToSelect="x"/>`,
                notANumber("selectFromSequence", "numToSelect"),
            ],
            [
                `<selectPrimeNumbers to="20" numToSelect=""/>`,
                notANumber("selectPrimeNumbers", "numToSelect"),
            ],
            [
                `<selectRandomNumbers numToSelect="x"/>`,
                notANumber("selectRandomNumbers", "numToSelect"),
            ],
            // a sequence counted by its `length`, with a `from` or `step`
            // that isn't a number, has no value to select
            [
                `<selectFromSequence from="x" length="3"/>`,
                notANumber("selectFromSequence", "from"),
            ],
            [
                `<selectFromSequence step="x" length="3"/>`,
                notANumber("selectFromSequence", "step"),
            ],
            // `<selectRandomNumbers>` can fail too (D5 corrected): a
            // parameter that isn't a number, a discrete uniform distribution
            // with no value, or parameters it can't draw from
            [
                `<selectRandomNumbers type="uniform" from="x" to="1"/>`,
                notANumber("selectRandomNumbers", "from"),
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="1" to="$nothing"/>`,
                notANumber("selectRandomNumbers", "to"),
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="1" to="5" step="NaN"/>`,
                notANumber("selectRandomNumbers", "step"),
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="5" to="1"/>`,
                length0,
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="1" to="5" step="-1"/>`,
                length0,
            ],
            // a step of 0 counted without end before
            [
                `<selectRandomNumbers type="discreteUniform" from="1" to="5" step="0"/>`,
                length0,
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="3" step="0" exclude="3"/>`,
                length0,
            ],
            // and so did a `from` or `step` that isn't a finite number past
            // an excluded value that matches it
            [
                `<selectRandomNumbers type="discreteUniform" from="1" step="x" exclude="1 x"/>`,
                notANumber("selectRandomNumbers", "step"),
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="1/0" exclude="1/0"/>`,
                notANumber("selectRandomNumbers", "from"),
            ],
            // and a step too small to change a large excluded `from`
            [
                `<selectRandomNumbers type="discreteUniform" from="1e17" exclude="1e17"/>`,
                length0,
            ],
            [
                `<selectRandomNumbers type="discreteUniform" from="1" to="3" exclude="1 2 3"/>`,
                length0,
            ],
            [
                `<selectRandomNumbers type="gaussian" variance="-1"/>`,
                "doenet-w0126: Invalid mean (0) or standardDeviation (NaN) for a gaussian random variable. The mean must be a finite number, and the standardDeviation (or the variance it is derived from) must be finite and non-negative. No numbers can be sampled.",
            ],
        ] as const) {
            for (const variant of [1, 2]) {
                const { errors, infos } = await load(doenetML, variant);
                expect(errors, doenetML).eqls([expected]);
                expect(infos, doenetML).not.toContain(expected.split(":")[0]);
            }
        }

        // asking for none, or for a number below 1, selects nothing, with
        // no error
        for (const doenetML of [
            `<select numToSelect="0">${options}</select>`,
            `<selectFromSequence to="5" numToSelect="-2"/>`,
            `<selectPrimeNumbers to="20" numToSelect="0"/>`,
            `<selectRandomNumbers numToSelect="0"/>`,
            `<selectRandomNumbers type="gaussian" variance="-1" numToSelect="0"/>`,
            // a uniform distribution from above `to` draws between them
            `<selectRandomNumbers type="uniform" from="5" to="1"/>`,
            `<selectRandomNumbers type="discreteUniform" from="5" to="1" step="-1"/>`,
        ]) {
            const { errors } = await load(doenetML);
            expect(errors, doenetML).eqls([]);
        }

        // the selection that fails selects nothing
        const { core, resolvePathToNodeIdx } = await load(
            `<select name="s" numToSelect="x">${options}</select><selectFromSequence name="q" to="5" numToSelect="x"/>`,
        );
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("s")].stateValues
                .selectedIndices,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("q")].stateValues
                .selectedValues,
        ).eq(null);
    });

    it("text that doesn't parse, or loses a reference in parsing, is a blank in each value the reference reads", async () => {
        // `$a+` parses as the one symbol `math0+`, in which the reference's
        // value is lost, and `($a` doesn't parse: in every variant the
        // choice can't select. Each is checked as `$a*` is (`$a × ＿`)
        const a = `<selectFromSequence name="a" from="1" to="3"/>`;
        const toNaN =
            "`<selectFromSequence>` can't always select as written: when `$a` = 1, `to` isn't a number.";
        for (const [doenetML, message] of [
            [`${a}<selectFromSequence from="1" to="$a*"/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="$a+"/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="$a-"/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="$a−"/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="$a + "/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="min($a+)"/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="($a"/>`, toNaN],
            [`${a}<selectFromSequence from="1" to="$a)"/>`, toNaN],
            [
                `${a}<number name="n">$a+</number><selectFromSequence from="1" to="$n"/>`,
                toNaN,
            ],
            [
                `${a}<math name="n">$a+</math><selectFromSequence from="1" to="$n"/>`,
                toNaN,
            ],
            [
                `${a}<selectFromSequence type="math" from="$a+" to="5"/>`,
                "DoenetML can't show that `<selectFromSequence>` can always select as written: it can't decide whether it can when `$a` = 1. Write its parameters so that it can, such as with `numToSelect` no larger than the fewest values it can have.",
            ],
            [
                `${a}<select numToSelect="$a+"><option>x</option><option>y</option></select>`,
                "`<select>` can't always select as written: when `$a` = 1, `numToSelect` isn't a number.",
            ],
            [
                `<selectFromSequence name="a" from="10" to="12"/><selectPrimeNumbers from="2" to="$a+"/>`,
                "`<selectPrimeNumbers>` can't always select as written: when `$a` = 10, `to` isn't a number.",
            ],
        ] as const) {
            for (const errors of await errorsInVariants(doenetML, [1, 2])) {
                expect(errors, doenetML).eqls([`doenet-e0073: ${message}`]);
            }
        }

        // one that selects with the blank in every variant is unchanged,
        // and so is a reference the parse keeps
        for (const doenetML of [
            `${a}<selectFromSequence from="1" to="4" exclude="$a+"/>`,
            `${a}<selectFromSequence from="1" to="4" exclude="($a"/>`,
            `${a}<selectFromSequence from="1" to="$a 2"/>`,
            `${a}<selectFromSequence from="1" to="+$a"/>`,
        ]) {
            for (const errors of await errorsInVariants(doenetML, [1, 2])) {
                expect(errors, doenetML).eqls([]);
            }
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

    it("a value that may be no number or not finite has no bounds, and doesn't cancel", async () => {
        // each passed by its bounds, though it fails when the document runs
        // with the value named: `$a - $a` isn't 0, nor `0 * $a`, when `$a`
        // is `x`, nothing, or 1/0
        const cases: [string, string][] = [
            [
                `<select name="a"><option><math>x</math></option><option>1</option></select><selectFromSequence from="$a" to="$a+3"/>`,
                "when `$a` = x, `from` isn't a number.",
            ],
            [
                `<select name="a" type="text">x 1</select><selectFromSequence from="$a" to="$a+3"/>`,
                "when `$a` = x, `from` isn't a number.",
            ],
            [
                `<select name="a"><option><math>x</math></option><option>1</option></select><selectFromSequence from="0*$a+1" to="0*$a+4"/>`,
                "when `$a` = x, `from` isn't a number.",
            ],
            [
                `<select name="a"><option><math>x</math></option><option>1</option></select><selectPrimeNumbers minValue="0*$a+2" maxValue="20"/>`,
                "when `$a` = x, `from` isn't a number.",
            ],
            [
                `<selectFromSequence name="a" to="2"/><number name="m">($a-1)/($a-1)</number><selectFromSequence from="$m" to="$m+3"/>`,
                "when `$a` = 1, `from` isn't a number.",
            ],
            [
                `<selectFromSequence name="c" to="2"/><selectFromSequence name="b" to="9" numToSelect="$c"/><selectFromSequence from="$b[2]" to="$b[2]+3"/>`,
                "when `$b[2]` is nothing, `from` isn't a number.",
            ],
            [
                `<selectFromSequence name="k" to="4"/><numberList name="ns">5 6 7</numberList><selectFromSequence to="$ns[$k]"/>`,
                "when `$k` = 4, `to` isn't a number.",
            ],
        ];
        for (const [doenetML, when] of cases) {
            const tag = doenetML.includes("selectPrimeNumbers minValue")
                ? "selectPrimeNumbers"
                : "selectFromSequence";
            expect((await load(doenetML)).errors, doenetML).eqls([
                `doenet-e0073: \`<${tag}>\` can't always select as written: ${when}`,
            ]);
        }
        // a division by a value that may be 0 is no bound, and is decided
        // exactly
        expect(
            (
                await load(
                    `<selectFromSequence name="a" to="2"/><number name="m">1/($a-1)</number><selectFromSequence from="$m" to="$m+3"/>`,
                )
            ).codes,
        ).eqls(["doenet-e0073"]);
        // a finite value with no end still cancels
        expect(
            (
                await load(
                    `<mathInput name="n"/><repeatForSequence to="$n" indexName="i"><selectFromSequence name="b" from="$i" to="$i+9"/><selectFromSequence from="$b" to="$b+3" numToSelect="4"/></repeatForSequence>`,
                )
            ).codes,
        ).eqls([]);
    });

    it("a parameter that may be no number fails also where the count doesn't read it", async () => {
        // each passed by its bounds, though, when the document runs, it
        // selects nothing, or nothing but blanks (`from` and `step` with a
        // `length` aren't in the count; with replacement, `numToSelect` was
        // read only as at least 1; `1/$z` drew without end)
        const b = `<select name="b"><option><math>x</math></option><option><number>1</number></option></select>`;
        const repeat = (content: string) =>
            `<mathInput name="n" prefill="2"/>${b}<repeatForSequence to="$n" indexName="i">${content}</repeatForSequence>`;
        const cases: [string, string, string][] = [
            [
                `${b}<selectFromSequence from="$b" length="3"/>`,
                "selectFromSequence",
                "when `$b` = x, `from` isn't a number.",
            ],
            [
                `${b}<selectFromSequence step="$b" length="3"/>`,
                "selectFromSequence",
                "when `$b` = x, `step` isn't a number.",
            ],
            [
                `<selectFromSequence name="a" to="2"/><selectFromSequence name="c" from="5" to="9" numToSelect="$a"/><selectFromSequence from="$c[2]" length="2" numToSelect="2"/>`,
                "selectFromSequence",
                "when `$c[2]` is nothing, `from` isn't a number.",
            ],
            [
                repeat(`<selectFromSequence from="2$b" length="6"/>`),
                "selectFromSequence",
                "when `$b` = x, `from` isn't a number.",
            ],
            [
                `${b}<select numToSelect="$b" withReplacement>u v w</select>`,
                "select",
                "when `$b` = x, `numToSelect` isn't a number.",
            ],
            [
                repeat(
                    `<select numToSelect="min($b, 3)" withReplacement>u v w</select>`,
                ),
                "select",
                "when `$b` = x, `numToSelect` isn't a number.",
            ],
            [
                repeat(
                    `<selectFromSequence to="5" numToSelect="$b" withReplacement/>`,
                ),
                "selectFromSequence",
                "when `$b` = x, `numToSelect` isn't a number.",
            ],
            [
                repeat(
                    `<selectPrimeNumbers to="20" numToSelect="$b" withReplacement/>`,
                ),
                "selectPrimeNumbers",
                "when `$b` = x, `numToSelect` isn't a number.",
            ],
            [
                `<selectFromSequence name="z" from="0" to="1"/><select numToSelect="1/$z" withReplacement>u v</select>`,
                "select",
                "when `$z` = 0, `numToSelect` isn't a number.",
            ],
        ];
        for (const [doenetML, tag, when] of cases) {
            expect((await load(doenetML)).errors, doenetML).eqls([
                `doenet-e0073: \`<${tag}>\` can't always select as written: ${when}`,
            ]);
        }
        // a symbol where a math sequence starts is one of its values
        expect(
            (
                await load(
                    `${b}<selectFromSequence type="math" from="$b" length="3" numToSelect="3"/>`,
                )
            ).codes,
        ).eqls([]);
    });

    it("a letters sequence's parameter that may be no letters or no number fails also where the count doesn't read it", async () => {
        // each passed, though, when the document runs, it selects nothing
        // or blanks (a letters sequence is counted by its `length`, or 10,
        // without reading `from` or `step`)
        const t = `<select name="b" type="text">a %</select>`;
        const m = `<select name="b"><option><math>x</math></option><option><number>1</number></option></select>`;
        const repeat = (content: string) =>
            `<mathInput name="n" prefill="2"/><repeatForSequence to="$n" indexName="i">${content}</repeatForSequence>`;
        const cases: [string, string][] = [
            [
                `${t}<selectFromSequence type="letters" from="$b"/>`,
                "when `$b` = %, `from` isn't letters.",
            ],
            [
                `${t}<selectFromSequence type="letters" from="$b" length="3"/>`,
                "when `$b` = %, `from` isn't letters.",
            ],
            [
                `<select name="b" type="text">c %</select><selectFromSequence type="letters" to="$b" length="3"/>`,
                "when `$b` = %, `to` isn't letters.",
            ],
            [
                `${m}<selectFromSequence type="letters" from="a" step="$b" length="3"/>`,
                "when `$b` = x, `step` isn't a number.",
            ],
            [
                `${m}<selectFromSequence type="letters" from="a" step="$b" length="3" numToSelect="2" withReplacement/>`,
                "when `$b` = x, `step` isn't a number.",
            ],
            [
                `<selectFromSequence name="a" to="2"/><selectFromSequence name="c" from="5" to="9" numToSelect="$a"/><selectFromSequence type="letters" from="a" step="$c[2]" length="3"/>`,
                "when `$c[2]` is nothing, `step` isn't a number.",
            ],
            [
                repeat(
                    `<select name="b" type="text">% a</select><selectFromSequence type="letters" from="$b" length="$i+2"/>`,
                ),
                "when `$b` = %, `$i` = 1, `from` isn't letters.",
            ],
            [
                repeat(
                    `${m}<selectFromSequence type="letters" step="$b" length="$i+2"/>`,
                ),
                "when `$b` = x, `$i` = 1, `step` isn't a number.",
            ],
        ];
        for (const [doenetML, when] of cases) {
            expect((await load(doenetML)).errors, doenetML).eqls([
                `doenet-e0073: \`<selectFromSequence>\` can't always select as written: ${when}`,
            ]);
        }
        // letters, as written or as a choice selects them, under an index
        // with no end too
        for (const doenetML of [
            `<selectFromSequence type="letters" from="c" length="3" numToSelect="3"/>`,
            repeat(
                `<select name="b" type="text">c d</select><selectFromSequence type="letters" from="$b" length="$i+2"/>`,
            ),
            repeat(
                `<selectFromSequence name="b" type="letters" from="a" to="e"/><selectFromSequence type="letters" from="$b" step="$i" length="$i+2" numToSelect="$i+2"/>`,
            ),
            repeat(
                `<selectFromSequence type="letters" from="a" to="z" step="$i"/>`,
            ),
        ]) {
            expect((await load(doenetML)).codes, doenetML).eqls([]);
        }
    });

    it("a sequence is shown by its bounds only in a form whose count and values they model as the run time derives them", async () => {
        // each passed, though, when the document runs, it can't select: the
        // run time derives the count, step or values from the parameters
        // written (`calculateSequenceParameters`) otherwise than the bounds
        // counted them
        const cases: [string, string][] = [
            // a letters `to` and `length` with no `from`: the run time
            // shortens `length` when counting back from `to` would go
            // before `a`
            [
                `<selectFromSequence name="a" type="letters" from="a" to="e"/><selectFromSequence type="letters" to="$a" length="3" numToSelect="3"/>`,
                "when `$a` = a, it has 1 value to select 3 from.",
            ],
            [
                `<selectFromSequence name="n" from="1" to="5"/><selectFromSequence type="letters" to="c" length="$n" numToSelect="$n"/>`,
                "when `$n` = 4, it has 3 values to select 4 from.",
            ],
            [
                `<repeat for="1 2 3" indexName="i"><selectFromSequence type="letters" to="c" length="$i+1" numToSelect="$i+1"/></repeat>`,
                "when `$i` = 3, it has 3 values to select 4 from.",
            ],
            [
                `<module name="m"><moduleAttributes><text name="l">e</text></moduleAttributes><selectFromSequence type="letters" to="$l" length="3" numToSelect="3"/></module><module name="m2" copy="$m" l="b"/>`,
                "when `$l` = b, it has 2 values to select 3 from.",
            ],
            // a step derived from `from`, `to` and `length` is 0 when `to`
            // is `from`, and an exclusion then leaves out every value
            [
                `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence from="1" to="$a" length="3" exclude="1"/>`,
                "when `$a` = 1, it has 0 values to select 1 from.",
            ],
            [
                `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence type="math" from="1" to="$a" length="3" exclude="1"/>`,
                "when `$a` = 1, it has 0 values to select 1 from.",
            ],
            [
                `<repeat for="1 2" indexName="i"><selectFromSequence from="5" to="$i+4" length="3" exclude="5"/></repeat>`,
                "when `$i` = 1, it has 0 values to select 1 from.",
            ],
            // a letters step derived so is rounded down, to 0 here
            [
                `<selectFromSequence name="a" type="letters" from="a" to="c"/><selectFromSequence type="letters" from="a" to="$a" length="3" exclude="a"/>`,
                "when `$a` = a, it has 0 values to select 1 from.",
            ],
            [
                `<repeat for="1 2 3" indexName="i"><selectFromSequence type="letters" from="a" to="c" length="$i+1" exclude="a"/></repeat>`,
                "when `$i` = 3, it has 0 values to select 1 from.",
            ],
            // a letters choice that counts back before `a` selects `` ` ``,
            // which isn't letters
            [
                `<selectFromSequence name="a" type="letters" from="b" step="-1" length="3"/><selectFromSequence type="letters" from="$a" length="2"/>`,
                "when `$a` = `, `from` isn't letters.",
            ],
            [
                `<selectFromSequence name="a" type="letters" from="c" to="a" length="4"/><selectFromSequence type="letters" from="$a" length="2"/>`,
                "when `$a` = `, `from` isn't letters.",
            ],
            // a number `to` and `length` with no `from`: the values count
            // back from `to`, below 1 here
            [
                `<selectFromSequence name="a" to="3" length="5"/><selectFromSequence from="1" to="$a"/>`,
                "when `$a` = -1, it has 0 values to select 1 from.",
            ],
            [
                `<repeatForSequence to="3" length="5" valueName="v"><selectFromSequence from="1" to="$v"/></repeatForSequence>`,
                "when `$v` = -1, it has 0 values to select 1 from.",
            ],
        ];
        for (const [doenetML, when] of cases) {
            expect((await load(doenetML)).errors, doenetML).eqls([
                `doenet-e0073: \`<selectFromSequence>\` can't always select as written: ${when}`,
            ]);
        }

        // all four of `from`, `to`, `step` and `length`: the run time
        // throws making the sequence, even when it selects none; the choice
        // is an error instead
        for (const doenetML of [
            `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence from="1" to="5" step="$a" length="3"/>`,
            `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence type="math" from="1" to="5" step="$a" length="3"/>`,
            `<selectFromSequence name="a" from="1" to="2"/><selectFromSequence from="1" to="5" step="$a" length="3" numToSelect="$a-2"/>`,
            `<mathInput name="n" prefill="2"/><repeatForSequence to="$n" indexName="i"><selectFromSequence from="1" to="5" step="$i" length="2"/></repeatForSequence>`,
        ]) {
            const { errors } = await load(doenetML);
            expect(errors, doenetML).toHaveLength(1);
            expect(errors[0], doenetML).toMatch(
                /^doenet-e0073: DoenetML can't show that `<selectFromSequence>` can always select as written/,
            );
        }

        // the forms the bounds model, under an index with no end too
        const repeat = (content: string) =>
            `<mathInput name="n" prefill="2"/><repeatForSequence to="$n" indexName="i">${content}</repeatForSequence>`;
        for (const doenetML of [
            repeat(
                `<selectFromSequence from="$i" to="$i+9" length="4" exclude="$i" numToSelect="3"/>`,
            ),
            repeat(
                `<selectFromSequence to="$i+5" step="2" length="3" exclude="$i+5" numToSelect="2"/>`,
            ),
            repeat(
                `<selectFromSequence type="math" to="$i+3" length="4" numToSelect="4"/>`,
            ),
            repeat(
                `<selectFromSequence type="letters" from="a" to="z" length="$i+1" numToSelect="$i+1"/>`,
            ),
            repeat(
                `<selectFromSequence name="c" to="5" length="3"/><selectFromSequence from="1" to="$c+$i" numToSelect="3"/>`,
            ),
            `<selectFromSequence name="a" type="letters" from="c" to="a" length="3"/><selectFromSequence type="letters" from="$a" length="2"/>`,
        ]) {
            expect((await load(doenetML)).codes, doenetML).eqls([]);
        }
    });

    it("a sequence's values are those the run time computes when counted back from a `to` that isn't a whole number, and its count is a whole number within floating point", async () => {
        // each passed, though, when the document runs, it can't select
        const cases: [string, string][] = [
            // with a `to` and no `from` or `length`, the values count back
            // from `to` (`calculateSequenceParameters`): 1.6 and 2.6, not
            // whole numbers, so `numToSelect="$a"` rounds and doesn't cancel
            // with the count
            [
                `<selectFromSequence name="a" to="2.6"/><selectFromSequence from="1" to="$a" numToSelect="$a"/>`,
                "when `$a` = 1.6, it has 1 value to select 2 from.",
            ],
            [
                `<repeatForSequence to="2.6" valueName="v"><selectFromSequence from="1" to="$v" numToSelect="$v"/></repeatForSequence>`,
                "when `$v` = 1.6, it has 1 value to select 2 from.",
            ],
            [
                `<selectFromSequence name="b" from="1" to="3"/><selectFromSequence name="a" to="$b+2.6"/><selectFromSequence from="1" to="$a" numToSelect="$a"/>`,
                "when `$a` = 1.6, it has 1 value to select 2 from.",
            ],
            [
                `<selectFromSequence name="b" from="1" to="2"/><selectFromSequence name="a" to="2.6" step="$b"/><selectFromSequence from="1" to="$a" numToSelect="$a"/>`,
                "when `$a` = 1.6, it has 1 value to select 2 from.",
            ],
            [
                `<select name="b">0.5 1.5 2.5</select><selectFromSequence name="a" to="$b+4"/><selectFromSequence from="1" to="$a" numToSelect="$a"/>`,
                "when `$a` = 1.5, it has 1 value to select 2 from.",
            ],
        ];
        for (const [doenetML, when] of cases) {
            expect((await load(doenetML)).errors, doenetML).eqls([
                `doenet-e0073: \`<selectFromSequence>\` can't always select as written: ${when}`,
            ]);
        }

        // whole numbers, and fractional steps: the run time counts within a
        // floating-point tolerance of a whole number as that number
        // (`sequenceLengthOf`): `(1000.3 - 1000) / 0.1 + 1` is
        // 3.99999999999954, and 4 values; `382/3 + 1 - 382/3` is
        // 0.99999999999997
        const repeat = (content: string) =>
            `<mathInput name="n" prefill="2"/><repeatForSequence to="$n" indexName="i">${content}</repeatForSequence>`;
        for (const doenetML of [
            `<selectFromSequence name="a" to="3"/><selectFromSequence from="1" to="$a" numToSelect="$a"/>`,
            `<selectFromSequence name="a" to="3"/><selectFromSequence to="$a" numToSelect="$a"/>`,
            `<selectFromSequence name="t" from="1000" to="1001"/><selectFromSequence from="$t" to="$t+0.3" step="0.1" numToSelect="4"/>`,
            `<selectFromSequence name="t" from="1000" to="100000"/><selectFromSequence from="$t" to="$t+0.3" step="0.1" numToSelect="4"/>`,
            `<selectFromSequence name="t" from="1000" to="1001"/><selectFromSequence type="math" from="$t" to="$t+0.3" step="0.1" numToSelect="4"/>`,
            `<selectFromSequence name="j" from="1" to="100000"/><selectFromSequence from="$j*1000000" to="$j*1000000+2" step="0.1" numToSelect="21"/>`,
            repeat(
                `<selectFromSequence from="$i" to="$i+2" step="0.1" numToSelect="21"/>`,
            ),
            repeat(
                `<selectFromSequence from="0" to="$i" step="0.1" numToSelect="10$i+1"/>`,
            ),
            repeat(
                `<selectFromSequence from="$i" to="$i+0.3" step="0.1" numToSelect="4"/>`,
            ),
            repeat(
                `<selectFromSequence from="$i/3" to="$i/3+1" step="1/3" numToSelect="4"/>`,
            ),
            repeat(`<selectFromSequence to="$i+3" numToSelect="$i+3"/>`),
        ]) {
            expect((await load(doenetML)).errors, doenetML).eqls([]);
        }

        // a count that isn't near a whole number is rounded down
        expect(
            (
                await load(
                    `<selectFromSequence name="t" from="1000" to="1001"/><selectFromSequence from="$t" to="$t+0.25" step="0.1" numToSelect="4"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$t` = 1000, it has 3 values to select 4 from.",
        ]);
    });

    it("a count is rounded up only within the floating point of its parameters, so off-grid and whole-number counts are as written, and values never pass `to`", async () => {
        // A `to` just short of a whole number, off the step's grid, and
        // large whole numbers keep their counts (`sequenceCountTolerance`):
        // the run time can select, as the check finds, in each variant
        const counts: [string, number][] = [
            [
                `<selectFromSequence name="a" to="1000000000" step="1000000"/>`,
                1000,
            ],
            [
                `<selectFromSequence name="a" from="1" to="1000000000" step="1000000"/>`,
                1000,
            ],
            [
                `<selectFromSequence name="a" from="0.7" to="1000000000" step="1000000"/>`,
                1000,
            ],
            [
                `<selectFromSequence name="a" from="1" to="2000000000" step="1000000000"/>`,
                2,
            ],
            [
                `<selectFromSequence name="a" from="0" to="0.9999999999" step="1"/>`,
                1,
            ],
            [`<selectFromSequence name="a" from="0" to="2.9999999999"/>`, 3],
            [`<selectFromSequence name="a" to="2.9999999999"/>`, 2],
            [
                `<selectFromSequence name="a" from="1000" to="1000.3" step="0.1"/>`,
                4,
            ],
        ];
        for (const [doenetML, length] of counts) {
            const { core, resolvePathToNodeIdx, errors } = await load(doenetML);
            expect(errors, doenetML).eqls([]);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .length,
                doenetML,
            ).eq(length);
        }
        for (const doenetML of [
            `<selectFromSequence name="b" from="1" to="2"/><selectFromSequence name="a" to="$b+0.9999999999"/><selectFromSequence name="s" from="1" to="floor($a)"/>`,
            `<selectFromSequence name="b" from="1" to="2"/><selectFromSequence name="a" to="$b+999999999" step="1000000000"/><selectFromSequence name="s" from="1" to="$a"/>`,
            `<selectFromSequence name="a" from="0" to="2.9999999999"/><selectFromSequence name="s" from="1" to="1" numToSelect="ceil($a/2.9999999999)"/>`,
            `<selectFromSequence name="a" from="1" to="2000000000" step="1000000000"/><selectFromSequence name="s" from="1" to="1" numToSelect="ceil($a/2000000000)"/>`,
            `<selectFromSequence name="a" from="1" to="1000000000" step="1000000"/><selectFromSequence name="s" from="1" to="1" numToSelect="ceil($a/1000000000)"/>`,
            // the last value is `to`, 1000.3 (not past it)
            `<selectFromSequence name="t" from="1000" to="1003"/><selectFromSequence name="a" from="$t" to="$t+0.3" step="0.1"/><selectFromSequence name="s" from="$a" to="$t+0.3" step="0.1" numToSelect="1"/>`,
            // whole numbers within floating point past `to`: 1 to 8
            `<selectFromSequence name="a" from="1" to="(0.1+0.7)*10"/><selectFromSequence name="s" from="1" to="8" numToSelect="$a"/>`,
        ]) {
            expect(await errorsInVariants(doenetML), doenetML).eqls([
                [],
                [],
                [],
                [],
            ]);
        }

        // `<selectRandomNumbers type="discreteUniform">`: its values as the
        // run time computes them, `from + i step`: 1, not
        // 0.9999999999999999, the sum of ten steps of 0.1
        expect(
            (
                await load(
                    `<selectRandomNumbers name="a" type="discreteUniform" from="0" to="1" step="0.1"/><selectFromSequence name="s" from="1" to="9" numToSelect="floor($a*10)"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 1, it has 9 values to select 10 from.",
        ]);
        // with no `from`, counted back from `to`: 0.1, 0.4, 0.7, 1
        expect(
            (
                await load(
                    `<selectRandomNumbers name="a" type="discreteUniform" to="1" step="0.3"/><selectFromSequence name="s" from="1" to="9" numToSelect="ceil($a*10)"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 1, it has 9 values to select 10 from.",
        ]);
        // with no `to`: `from` and `from + step`
        expect(
            (
                await load(
                    `<selectRandomNumbers name="a" type="discreteUniform" step="2"/><selectFromSequence name="s" from="1" to="1" numToSelect="$a"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 2, it has 1 value to select 2 from.",
        ]);
    });

    it("a letters sequence that reads the variant leaves out the letters its exclude writes", async () => {
        // the letters were compiled as their numbers, which the selection
        // reads as no letters: it left out nothing
        const doenetML = `<selectFromSequence name="a" from="3" to="4"/><selectFromSequence name="s" type="letters" from="a" length="$a" exclude="a b" numToSelect="$a-2"/>`;
        for (const v of [1, 2, 3, 4]) {
            const { core, resolvePathToNodeIdx, codes } = await load(
                doenetML,
                v,
            );
            expect(codes).eqls([]);
            const s = (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("s")
            ];
            expect(s.stateValues.exclude).eqls([1, 2]);
            expect(s.stateValues.selectedValues).not.toContain("a");
            expect(s.stateValues.selectedValues).not.toContain("b");
        }
        expect(
            (
                await load(
                    `<selectFromSequence name="a" from="3" to="4"/><selectFromSequence type="letters" from="a" length="$a" exclude="a b" numToSelect="$a-1"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 3, it has 1 value to select 2 from.",
        ]);
        expect(
            (
                await load(
                    `<selectFromSequence name="a" type="letters" from="c" to="d"/><selectFromSequence type="letters" from="a" to="$a" excludeCombinations="(a b) (b a) (a c) (c a) (b c) (c b)" numToSelect="2"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = c, every combination of 2 values is excluded.",
        ]);
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

    it("a boolean written as an expression with no value from the variant is its value", async () => {
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
        // one computed from another choice's value is no form a parameter
        // takes (SEL-6): a boolean parameter reads a reference alone
        expect(
            (
                await load(
                    `<selectFromSequence name="x" from="1" to="2"/>${choices}<select numToSelect="$a" withReplacement="$x > 0">u</select>`,
                )
            ).codes,
        ).eqls(["doenet-e0074"]);
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

    it("a <boolean>, a <text> or an attribute that changes a value is no form a parameter takes (SEL-6)", async () => {
        // Each was read by imitating how the document computes it, which
        // differed from the document in places: now a parameter holds only
        // arithmetic of the values it reads, computed by the same function
        // in the check and when the document runs, and anything else that
        // reads a value from the variant is an error at load.
        const choices = `<selectFromSequence name="a" from="1" to="2"/><boolean name="w">$a > 1</boolean>`;
        for (const parameters of [
            // a `<boolean>` in a `<number>` or in arithmetic
            `<number name="x">$w + 3</number><selectFromSequence from="1" to="3" numToSelect="3" exclude="$x"/>`,
            `<selectFromSequence from="1" to="3" numToSelect="3" exclude="$w+3"/>`,
            `<number name="n">$w</number><selectFromSequence to="$n+3" numToSelect="3"/>`,
            // a `<boolean>` computed from a value
            `<number name="d">(1-$a)/0</number><boolean name="v">$d > 1</boolean><select numToSelect="2" withReplacement="$v">u</select>`,
            `<text name="t">$a</text><math name="m">$t</math><boolean name="b">$m != 1</boolean><select numToSelect="2" withReplacement="$b">u</select>`,
            // an attribute that changes how a component computes its value
            `<number name="x" valueOnNaN="3">$w</number><selectFromSequence from="1" to="3" numToSelect="3" exclude="$x"/>`,
            `<number name="x" convertBoolean>$w</number><selectFromSequence from="0" to="2" numToSelect="3" exclude="$x"/>`,
            `<math name="m" simplify>$a+2</math><selectFromSequence to="$m" numToSelect="3"/>`,
            `<number name="m" valueOnNaN="0">$a+2</number><selectFromSequence to="$m" numToSelect="3"/>`,
        ]) {
            expect(
                (await load(`${choices}${parameters}`)).codes,
                parameters,
            ).eqls(["doenet-e0074"]);
        }
    });

    it("a <text> read with no value from the variant is its value, held by the compiled parameter", async () => {
        const choices = `<selectFromSequence name="a" from="1" to="2"/>`;
        // `1e2` is `1·e2`, no number, in the check and when the document
        // runs, as the compiled parameter holds what it is now
        expect(
            (
                await load(
                    `${choices}<text name="t">1e2</text><selectFromSequence to="$t" numToSelect="$a"/>`,
                )
            ).errors,
        ).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 1, `to` isn't a number.",
        ]);
        // one whose attribute may change its value, which the check doesn't
        // compute, is an error too
        expect(
            (
                await load(
                    `${choices}<math name="m" simplify>x-x+3</math><selectFromSequence to="$m" numToSelect="$a"/>`,
                )
            ).codes,
        ).eqls(["doenet-e0074"]);
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

    it("the error names a component in the part as written", async () => {
        const choices = `<selectFromSequence name="a" to="2"/><selectFromSequence name="k" to="2"/>`;
        for (const [parameters, part] of [
            [
                `<number name="m">$a+<boolean>true</boolean></number><selectFromSequence to="$m"/>`,
                "$a+<boolean>true</boolean>",
            ],
            [
                `<number name="m"><number>$a</number>^2</number><selectFromSequence to="$m"/>`,
                "<number>$a</number>^2",
            ],
            [
                `<numberList name="ns"><sequence from="5" to="7"/></numberList><selectFromSequence to="$ns[$k]"/>`,
                `<sequence from="5" to="7"/>`,
            ],
        ]) {
            const { errors } = await load(`${choices}${parameters}`);
            expect(errors, parameters).toHaveLength(1);
            expect(errors[0], parameters).toContain(`\`${part}\`, `);
        }
    });

    it("an attribute that changes a value is named with the reference to its component", async () => {
        const a = `<selectFromSequence name="a" to="2"/>`;
        for (const [parameters, named] of [
            [
                `<number name="m" valueOnNaN="0">$a</number><selectFromSequence to="$m"/>`,
                "`to` of `<selectFromSequence>` reads `$m`, a `<number>` holding `$a`, ",
            ],
            [
                `<math name="m" simplify>$a+1</math><selectFromSequence to="$m"/>`,
                "`to` of `<selectFromSequence>` reads `$m`, a `<math>` holding `$a+1`, ",
            ],
            [
                // a constant whose value it changes, in a compiled parameter
                `<math name="m" simplify>2x-x</math><selectFromSequence type="math" from="$a" step="$m" length="2"/>`,
                "`step` of `<selectFromSequence>` reads `$m`, a `<math>` holding `2x-x`, ",
            ],
        ]) {
            const { errors } = await load(`${a}${parameters}`);
            expect(errors, parameters).toHaveLength(1);
            expect(errors[0], parameters).toContain(named);
        }
    });

    it("a math value is named as the document shows it", async () => {
        const { errors } = await load(
            `<select name="a" type="math"><option>2i</option><option>3</option></select><selectFromSequence to="$a" numToSelect="2"/>`,
        );
        expect(errors).eqls([
            "doenet-e0073: `<selectFromSequence>` can't always select as written: when `$a` = 2 i, `to` isn't a number.",
        ]);
    });

    it("content reading nothing from the variant is its value only as a whole or as a literal part", async () => {
        const choices = `<selectFromSequence name="a" to="2"/><number name="n">3</number>`;
        // `2^3` is a literal part, and `$n^2` the whole content of `m`
        for (const parameters of [
            `<selectFromSequence to="$a+2^3" numToSelect="9"/>`,
            `<number name="m">$n^2</number><selectFromSequence to="$a+$m" numToSelect="10"/>`,
        ]) {
            expect(
                (await load(`${choices}${parameters}`)).codes,
                parameters,
            ).eqls([]);
        }
        // a power of a reference is no form a parameter takes, even of one
        // that reads nothing from the variant
        expect(
            (
                await load(
                    `${choices}<selectFromSequence to="$a+$n^2" numToSelect="10"/>`,
                )
            ).codes,
        ).eqls(["doenet-e0074"]);
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
