import { afterEach, describe, expect, it, vi } from "vitest";
import seedrandom from "seedrandom";
import me from "math-expressions";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";
import { setBoundsObserver } from "../../utils/dast/choiceFeasibilityAtLoad";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/** The state of the named components, after loading `doenetML`. */
async function load(
    doenetML: string,
    {
        requestedVariantIndex = 1,
        requestedVariant,
        initialState,
    }: {
        requestedVariantIndex?: number;
        requestedVariant?: any;
        initialState?: any;
    } = {},
) {
    const result = await createTestCore({
        doenetML,
        requestedVariantIndex,
        requestedVariant,
        initialState,
    });
    const stateVariables = await result.core.returnAllStateVariables(
        false,
        true,
    );
    const sv = async (name: string) =>
        stateVariables[await result.resolvePathToNodeIdx(name)]?.stateValues;
    const generatedVariantInfo = JSON.parse(
        JSON.stringify(
            stateVariables[await result.resolvePathToNodeIdx("_document1")]
                .stateValues.generatedVariantInfo,
        ),
    );
    return {
        ...result,
        sv,
        codes: getDiagnosticsByType(result.core).errors.map((d) => d.code),
        generatedVariantInfo,
    };
}

/**
 * A selection whose parameters read the variant or an iteration holds each
 * compiled (`utils/selectionParameters.ts`), and computes it, when the
 * document runs, with the function the load-time check proved it with: the
 * two can't read a parameter differently.
 */
describe("A selection computes a compiled parameter as the check does @group4", () => {
    const variants = [1, 2, 3, 4, 5, 6];

    it("arithmetic of another selection's value, in an attribute and through a <number>", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="3" to="6"/>
<number name="m">$a + 1</number>
<selectFromSequence name="s" to="$a+2" numToSelect="$m" exclude="$a 11"/>
<selectFromSequence name="t" to="12" numToSelect="$a/2"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            expect(s.specifiedTo).eq(a + 2);
            expect(s.specifiedNumToSelect).eq(a + 1);
            expect(s.specifiedExclude).eqls([a, 11]);
            expect(s.selectedValues).toHaveLength(a + 1);
            expect(s.selectedValues).not.toContain(a);
            // an integer parameter rounds as the template's `round` does
            expect((await sv("t")).specifiedNumToSelect).eq(Math.round(a / 2));
        }
    });

    it("a prime's range, a <select>'s count, and a boolean read from a selection", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="2" to="3"/>
<select name="b"><option><boolean>true</boolean></option><option><boolean>false</boolean></option></select>
<selectPrimeNumbers name="p" to="$a*10" numToSelect="$a"/>
<select name="s" numToSelect="$a" withReplacement="$b">u v w</select>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const p = await sv("p");
            expect(p.to).eq(a * 10);
            expect(p.selectedValues).toHaveLength(a);
            const s = await sv("s");
            expect(s.specifiedNumToSelect).eq(a);
            expect(typeof s.withReplacement).eq("boolean");
        }
    });

    it("a letters sequence reads the letter a selection holds", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" type="letters" from="c" to="e"/>
<selectFromSequence name="s" type="letters" from="a" to="$a" numToSelect="3"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            expect(s.specifiedTo).eq(a);
            expect(s.selectedValues).toHaveLength(3);
        }
    });

    it("a text read as a number is the text parsed as math", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<select name="a" type="text">2 2+1</select>
<selectFromSequence name="s" to="5" numToSelect="$a" exclude="$a"/>
<setup><module name="m"><moduleAttributes><text name="k">2</text></moduleAttributes><selectFromSequence name="t" to="$k+$a" numToSelect="$k"/></module></setup>
<module name="m1" copy="$m"/><module name="m2" copy="$m" k="3"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("s")).specifiedNumToSelect;
            expect([2, 3]).toContain(a);
            const s = await sv("s");
            expect(s.specifiedExclude).eqls([a]);
            expect(s.selectedValues).toHaveLength(a);
            expect(s.selectedValues).not.toContain(a);
            for (const [name, k] of [
                ["m1.t", 2],
                ["m2.t", 3],
            ] as const) {
                const t = await sv(name);
                expect(t.specifiedTo).eq(k + a);
                expect(t.selectedValues).toHaveLength(k);
            }
        }
    });

    it("a math sequence excludes a value read from a selection", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="1" to="3"/>
<selectFromSequence name="s" type="math" from="1" to="4" exclude="$a" numToSelect="3"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            expect(s.selectedValues.map((v: any) => v.tree).sort()).eqls(
                [1, 2, 3, 4].filter((v) => v !== a),
            );
        }
    });

    it("a math sequence holds the math its parameters are written as", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="4" to="6"/>
<selectFromSequence name="s" type="math" from="$a/3" step="1/3" length="4" numToSelect="4"/>
<selectFromSequence name="t" type="math" from="sqrt(2)+$a" step="$a" length="3" numToSelect="2" exclude="2$a+sqrt(2)"/>
<selectFromSequence name="u" type="math" from="pi" to="$a+5" numToSelect="2"/>
<selectFromSequence name="b" type="math" from="sqrt(2)" step="1/2" length="3"/>
<selectFromSequence name="v" type="math" from="$b" step="1/2" length="2" numToSelect="2"/>
<selectFromSequence name="w" type="math" from="x+$a" step="1" length="3" numToSelect="2" exclude="y+$a"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const texts = (values: any[]) =>
                values.map((v: any) => v.toString()).sort();

            // as when the parameters were `<math>`s: 5/3, not 1.666…
            const s = await sv("s");
            expect(s.from.tree).eqls(["/", a, 3]);
            expect(s.step.tree).eqls(["/", 1, 3]);
            expect(texts(s.selectedValues)).eqls(
                texts(
                    [a, a + 1, a + 2, a + 3].map((n) =>
                        me.fromText(`${n}/3`).simplify(),
                    ),
                ),
            );

            const t = await sv("t");
            expect(t.from.tree).eqls(["+", ["apply", "sqrt", 2], a]);
            expect(t.exclude.map((v: any) => v.tree)).eqls([
                ["+", ["*", 2, a], ["apply", "sqrt", 2]],
            ]);
            expect(t.selectedValues).toHaveLength(2);
            for (const v of t.selectedValues) {
                expect(v.toString()).toContain("sqrt(2)");
            }

            const u = await sv("u");
            expect(u.from.tree).eq("pi");
            for (const v of u.selectedValues) {
                expect(v.toString()).toMatch(/^π( \+ \d)?$/);
            }

            // a math sequence another reads holds its math too, and so does
            // the one that reads it
            const b = (await sv("b")).selectedValues[0];
            expect(b.toString()).toContain("sqrt(2)");
            const v = await sv("v");
            expect(v.from.tree).eqls(b.tree);
            for (const w of v.selectedValues) {
                expect(w.toString()).toContain("sqrt(2)");
            }

            // a literal written with a symbol, combined with a reference,
            // is the math it is written as
            const w = await sv("w");
            expect(w.from.tree).eqls(["+", "x", a]);
            expect(w.exclude.map((e: any) => e.tree)).eqls([["+", "y", a]]);
            const sequence = texts(
                [0, 1, 2].map((k) => me.fromText(`x+${a + k}`)),
            );
            expect(w.selectedValues).toHaveLength(2);
            for (const value of texts(w.selectedValues)) {
                expect(sequence).toContain(value);
            }
        }
    });

    it("in each iteration of a repeat, and in each copy of a module", async () => {
        const { sv, codes } = await load(
            `<repeatForSequence name="r" to="3" indexName="i"><selectFromSequence name="s" to="$i+2" numToSelect="$i"/></repeatForSequence>
<setup><module name="m"><moduleAttributes><integer name="k">2</integer></moduleAttributes><select name="s" numToSelect="$k">a b c</select></module></setup>
<module name="m1" copy="$m"/><module name="m2" copy="$m" k="3"/>`,
        );
        expect(codes).eqls([]);
        for (const i of [1, 2, 3]) {
            const s = await sv(`r[${i}].s`);
            expect(s.specifiedTo).eq(i + 2);
            expect(s.selectedValues).toHaveLength(i);
        }
        expect((await sv("m1.s")).specifiedNumToSelect).eq(2);
        expect((await sv("m2.s")).specifiedNumToSelect).eq(3);
    });

    it("a copy chooses again from the same parameters, and an extend shows the same selection", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="3" to="6"/>
<selectFromSequence name="s" to="$a+2" numToSelect="2"/>
<selectFromSequence name="c" copy="$s"/>
<selectFromSequence name="e" extend="$s"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            const c = await sv("c");
            expect(c.specifiedTo).eq(a + 2);
            expect(c.selectedValues).toHaveLength(2);
            expect((await sv("e")).selectedValues).eqls(s.selectedValues);
        }
    });

    it("keeps its selection and its parameters through a reload of its state", async () => {
        const doenetML = `<mathInput name="mi"/>
<selectFromSequence name="a" from="3" to="6"/>
<selectFromSequence name="s" to="$a+2" numToSelect="$a-1"/>`;
        const first = await load(doenetML, { requestedVariantIndex: 3 });
        expect(first.codes).eqls([]);
        await updateMathInputValue({
            latex: "x",
            componentIdx: await first.resolvePathToNodeIdx("mi"),
            core: first.core,
        });
        await first.core.saveImmediately();
        const saved = first.scoreState.state;
        expect(saved).toBeTruthy();
        const before = await first.sv("s");
        const reloaded = await load(doenetML, {
            requestedVariant: first.generatedVariantInfo,
            initialState: saved,
        });
        expect(reloaded.codes).eqls([]);
        const after = await reloaded.sv("s");
        expect(after.selectedValues).eqls(before.selectedValues);
        expect(after.specifiedTo).eq(before.specifiedTo);
        expect(after.specifiedNumToSelect).eq(before.specifiedNumToSelect);
    });
});

/**
 * When the bounds show a selection can always select (with an index with no
 * end, or too many combinations to go through), every combination of values
 * its parameters can take agrees: each parameter is within the bounds found
 * for it, and the exact test, the selection's own
 * (`utils/selectionFailure.ts`), finds nothing that keeps it from selecting.
 */
describe("A pass by bounds is never contradicted by the exact check @group4", () => {
    afterEach(() => setBoundsObserver(undefined));

    /** Random documents whose selections the bounds decide. */
    function documents(random: () => number) {
        const pick = <T>(xs: T[]) => xs[Math.floor(random() * xs.length)];
        const int = (lo: number, hi: number) =>
            lo + Math.floor(random() * (hi - lo + 1));
        const terms = [
            "$i",
            "$a",
            "$i + $a",
            "2$i",
            "$i/2",
            "floor($i/2)",
            "ceil($i/3)",
            "round($a/2)",
            "min($i, $a)",
            "max($i, 3)",
            "abs($a - $i)",
            "$i*$a",
            "-$i",
        ];
        const docs: string[] = [];
        for (let n = 0; n < 40; n++) {
            const from = pick(["1", "$i", `$i - ${int(0, 3)}`, "-$a"]);
            const to = `${pick(terms)} + ${int(0, 30)}`;
            const numToSelect = pick([
                "1",
                String(int(1, 3)),
                "min($i, 2)",
                "floor($a/3)",
                "1",
            ]);
            const extra = pick([
                "",
                ` exclude="${int(1, 5)}"`,
                ` exclude="$a"`,
                ` withReplacement`,
                ` step="${pick(["1", "2", "3"])}"`,
            ]);
            docs.push(`<mathInput name="n" prefill="2"/>
<selectFromSequence name="a" from="${int(1, 3)}" to="${int(4, 9)}"/>
<repeatForSequence to="$n" indexName="i"><selectFromSequence from="${from}" to="${to}" numToSelect="${numToSelect}"${extra}/></repeatForSequence>`);
            docs.push(`<mathInput name="n" prefill="2"/>
<selectFromSequence name="a" from="${int(1, 3)}" to="${int(4, 9)}"/>
<repeatForSequence to="$n" indexName="i"><selectPrimeNumbers from="${pick(["2", "$i", "$a"])}" to="${to}" numToSelect="${numToSelect}"/></repeatForSequence>`);
        }
        return docs;
    }

    /**
     * Random documents whose parameters read values that may be no number
     * (a `<math>x</math>` or text option), an entry that may be nothing
     * (`$c[2]` of a choice that may select one), an index into a list
     * (`$ns[$i]`), a division by what may be 0, a step that may be 0, or
     * exclusions, of number and math sequences, primes and options. The
     * sequences take each form the run time derives a count from: `to` or
     * `length` with or without `from`, `to` and `length` together (a step
     * derived from `from` and `to`, or values counted back from `to`), all
     * four, and a letters selection read as letters that may count back
     * before `a`. With `"fractional"`, a choice `f` counting back from a `to`
     * that isn't a whole number (some just short of one, off the step's
     * grid), a choice `w` of large whole numbers, and sequences with a
     * fractional step from a large `$t`.
     */
    function widerDocuments(
        random: () => number,
        kinds = ["seq", "seq", "seq", "math", "primes", "select", "letters"],
    ) {
        const pick = <T>(xs: T[]) => xs[Math.floor(random() * xs.length)];
        const int = (lo: number, hi: number) =>
            lo + Math.floor(random() * (hi - lo + 1));
        const others = [
            `<selectFromSequence name="c" from="1" to="9" numToSelect="$a"/>`,
            `<numberList name="ns">1 5 9</numberList>`,
            `<selectFromSequence name="m" type="math" from="1" to="${int(3, 6)}"/>`,
            `<selectPrimeNumbers name="p" from="2" to="${int(5, 20)}"/>`,
            `<selectFromSequence name="z" from="0" to="1"/>`,
            // counts back from `to`: values may be 0 or less
            `<selectFromSequence name="d" to="${int(2, 5)}" length="${int(3, 6)}"/>`,
        ];
        const bs = [
            `<select name="b"><option><math>x</math></option><option><number>${int(1, 4)}</number></option></select>`,
            `<select name="b"><option><number>0</number></option><option><number>${int(1, 3)}</number></option></select>`,
            `<select name="b" type="text">x ${int(1, 3)}</select>`,
        ];
        // what a letters sequence reads: letters, a letters choice, texts
        // that are letters or may not be
        const letters = [
            pick([
                `<selectFromSequence name="l" type="letters" from="a" to="${pick(["c", "e", "h"])}"/>`,
                // may count back before `a`
                `<selectFromSequence name="l" type="letters" from="${pick(["b", "c"])}" step="-1" length="${int(2, 4)}"/>`,
                `<selectFromSequence name="l" type="letters" from="c" to="a" length="${int(3, 4)}"/>`,
            ]),
            `<select name="t" type="text">c ${pick(["d", "%", "2", "e"])}</select>`,
        ];
        const atoms = [
            "$i",
            "$a",
            "$b",
            "$c[1]",
            "$c[2]",
            "$ns[$a]",
            "$ns[$i]",
            "$m",
            "$p",
            "$z",
            "($a-1)",
            "($z-1)",
            "$d",
        ];
        const fractional = kinds.includes("fractional");
        const atomsHere = fractional ? [...atoms, "$f", "$t"] : atoms;
        const docs: string[] = [];
        while (docs.length < 120) {
            const base = pick([1, 1000, 100000]);
            const context = [
                `<selectFromSequence name="a" from="1" to="${int(3, 6)}"/>`,
                ...others.filter(() => random() < 0.6),
                ...(random() < 0.7 ? [pick(bs)] : []),
                ...letters.filter(() => random() < 0.6),
                ...(fractional
                    ? [
                          // its values count back from `to`: 1.6, 2.6, …
                          // or from a `to` just short of a whole number, off
                          // the step's grid, whose count isn't rounded up
                          `<selectFromSequence name="f" to="${pick(["2.6", "3.5", "4.25", "$a+0.5", "$a+1.6", "$a+0.9999999999", "2.9999999999"])}"${pick(["", ` step="${pick(["1", "2", "$a"])}"`])}/>`,
                          `<selectFromSequence name="t" from="${base}" to="${base + pick([1, 1000, 100000])}"/>`,
                          // large whole numbers, whose counts are exact
                          `<selectFromSequence name="w" ${pick([`to="1000000000" step="1000000"`, `from="1" to="1000000000" step="1000000"`, `from="1" to="2000000000" step="1000000000"`, `from="$a" to="$a+999999999" step="1000000000"`, `from="0.7" to="1000000000" step="1000000"`])}/>`,
                      ]
                    : []),
            ];
            const has = (s: string) =>
                [...s.matchAll(/\$(\w+)/g)].every(
                    ([, name]) =>
                        name === "i" ||
                        context.some((c) => c.includes(`name="${name}"`)),
                );
            const term = (): string => {
                for (let tries = 0; tries < 100; tries++) {
                    const x = pick(atomsHere);
                    const y = pick(atomsHere);
                    const t = pick([
                        x,
                        `${x}+${y}`,
                        `${x}-${y}`,
                        `${x}*${y}`,
                        `${x}/${y}`,
                        `${x}/2`,
                        `2${x}`,
                        `-${x}`,
                        `${x}-${x}`,
                        `0*${x}`,
                        `floor(${x}/2)`,
                        `max(${x},${y})`,
                        `abs(${x}-${y})`,
                    ]);
                    if (has(t)) {
                        return t;
                    }
                }
                return "$i";
            };
            const kind = pick(kinds);
            let target: string;
            if (kind === "fractional") {
                // `to - from` in floating point, off by more than the run
                // time allows when `$t` is large, against as many values as
                // there are exactly, or one fewer
                const span = pick([0.3, 0.5, 0.7, 1.1, 2]);
                const step = pick([0.1, 0.2, 0.5]);
                const count = Math.floor(span / step + 1e-9) + 1;
                target = pick([
                    `<selectFromSequence${pick(["", ` from="1"`, ` from="$f"`])} to="${pick(["$f", "$f+1", "$f-1", term()])}" numToSelect="${pick(["$f", "$f-1", "round($f)", "2", term()])}"/>`,
                    `<selectFromSequence from="$t" to="$t+${span}" step="${step}" numToSelect="${pick([String(count), String(count - 1), term()])}"/>`,
                    `<selectFromSequence from="$t" to="$t+${pick(["0.9999999999", "1.9999999999", "2"])}" numToSelect="${pick(["2", "3", term()])}"/>`,
                    `<selectFromSequence from="1" to="${pick(["floor($f)", "ceil($w/1000000000)", "2"])}" numToSelect="${pick(["1", "2", "floor($f)", "ceil($w/1000000000)", "ceil($w/2000000000)"])}"/>`,
                ]);
            } else if (kind === "letters") {
                const letter = () => pick(["c", "A", "$l", "$t", "$b"]);
                const length = () =>
                    ` length="${pick([String(int(1, 6)), term(), `${term()}+${int(1, 5)}`])}"`;
                const range = pick([
                    "",
                    length(),
                    ` to="${pick(["z", letter()])}"`,
                    // the run time shortens `length` when counting back
                    // from `to` would go before `a`, or rounds the step down
                    ` to="${pick(["z", letter()])}"${length()}`,
                ]);
                target = `<selectFromSequence type="letters"${pick(["", ` from="${letter()}"`])}${range}${pick(["", ` step="${pick(["2", "-1", "$z", term()])}"`])}${pick(["", ` exclude="${letter()}"`])} numToSelect="${pick(["1", "2", term()])}"${pick(["", " withReplacement"])}/>`;
            } else if (kind === "select") {
                target = `<select numToSelect="${pick(["1", "2", term(), `min(${term()},3)`])}"${pick(["", " withReplacement"])}>u v w</select>`;
            } else if (kind === "primes") {
                target = `<selectPrimeNumbers from="${pick(["2", term()])}" to="${term()} + ${int(0, 30)}" numToSelect="${pick(["1", "2", term()])}"${pick(["", ` exclude="${term()}"`, ` exclude="${int(2, 7)}"`])}/>`;
            } else {
                const length = ` length="${pick([String(int(1, 6)), term(), `${term()}+${int(1, 5)}`])}"`;
                const to = ` to="${term()} + ${int(0, 20)}"`;
                // `to` and `length`: the step derived from `from` and `to`
                // (with no step), or the first value counted back from `to`
                // (with no `from`); with all four the run time can't make it
                const range = pick([to, to, length, `${to}${length}`]);
                const step = pick([
                    "",
                    "",
                    ` step="${pick(["0", "2", "0.5", "-1", "1/3", "$z", "$i-1", term(), `1/${term()}`])}"`,
                ]);
                const exclude = pick([
                    "",
                    "",
                    ` exclude="${term()}"`,
                    ` exclude="${int(1, 5)} ${term()}"`,
                    ` exclude="$c"`,
                    ` exclude="$b"`,
                    ` exclude="$b $a"`,
                    ` exclude="$ns"`,
                ]);
                const from = pick([
                    "",
                    ` from="${pick(["1", "$i", term()])}"`,
                    ` from="${pick(["1", "$i", term()])}"`,
                    ` from="${pick(["1", "$i", term()])}"`,
                ]);
                target = `<selectFromSequence${kind === "math" ? ` type="math"` : ""}${from}${range}${step}${exclude} numToSelect="${pick(["1", "2", String(int(1, 4)), term(), `min(${term()}, 2)`])}"${pick(["", "", " withReplacement"])}/>`;
            }
            if (
                [" from=", " to=", " step=", " length="].every((a) =>
                    target.includes(a),
                ) &&
                !/ (from|to|step|length)="[^"]*\$/.test(target)
            ) {
                // all four written as constants fail to load as they did
                // before this check (not checked: the same in every
                // variant); one reading the iteration is checked
                target = target.replace(/ step="[^"]*"/, ` step="$i"`);
            }
            if (has(target)) {
                docs.push(`<mathInput name="n" prefill="2"/>
${context.join("\n")}
<repeatForSequence to="$n" indexName="i">${target}</repeatForSequence>`);
            }
        }
        return docs;
    }

    async function checkPasses(
        docs: string[],
        random: () => number,
    ): Promise<{ passes: number; samples: number }> {
        let passes = 0;
        let samples = 0;
        for (const doenetML of docs) {
            const observed: Parameters<
                Parameters<typeof setBoundsObserver>[0] & {}
            >[0][] = [];
            setBoundsObserver((pass) => observed.push(pass));
            await createTestCore({ doenetML });
            setBoundsObserver(undefined);
            for (const pass of observed) {
                passes++;
                for (let k = 0; k < 200; k++) {
                    const found = pass.sample(random);
                    if (!found) {
                        continue;
                    }
                    samples++;
                    for (const { value, lo, hi } of found.values) {
                        if (Number.isNaN(value)) {
                            // a value that may be no number has no bounds
                            expect([lo, hi], doenetML).eqls([
                                -Infinity,
                                Infinity,
                            ]);
                        } else {
                            expect(value, doenetML).toBeGreaterThanOrEqual(
                                lo - 1e-9,
                            );
                            expect(value, doenetML).toBeLessThanOrEqual(
                                hi + 1e-9,
                            );
                        }
                    }
                    expect(found.problem, doenetML).toBeNull();
                }
            }
        }
        return { passes, samples };
    }

    it("on random documents of symbols, entries, list indices, divisions, steps and exclusions", async () => {
        const random = seedrandom("wider bounds");
        const { passes, samples } = await checkPasses(
            widerDocuments(random),
            random,
        );
        expect(passes).toBeGreaterThan(50);
        expect(samples).toBeGreaterThan(10000);
    }, 600000);

    it("on random documents of sequences counting back from a `to` that isn't a whole number, and of fractional steps", async () => {
        const random = seedrandom("fractional bounds");
        const { passes, samples } = await checkPasses(
            widerDocuments(random, ["fractional"]),
            random,
        );
        expect(passes).toBeGreaterThan(50);
        expect(samples).toBeGreaterThan(10000);
    }, 600000);

    it("on random documents of letters sequences", async () => {
        const random = seedrandom("letters bounds");
        const { passes, samples } = await checkPasses(
            widerDocuments(random, ["letters"]),
            random,
        );
        expect(passes).toBeGreaterThan(50);
        expect(samples).toBeGreaterThan(10000);
    }, 600000);

    it("on random documents", async () => {
        const random = seedrandom("bounds");
        let passes = 0;
        let samples = 0;
        for (const doenetML of documents(random)) {
            const observed: Parameters<
                Parameters<typeof setBoundsObserver>[0] & {}
            >[0][] = [];
            setBoundsObserver((pass) => observed.push(pass));
            await createTestCore({ doenetML });
            setBoundsObserver(undefined);
            for (const pass of observed) {
                passes++;
                for (let k = 0; k < 200; k++) {
                    const found = pass.sample(random);
                    if (!found) {
                        continue;
                    }
                    samples++;
                    for (const { value, lo, hi } of found.values) {
                        if (!Number.isNaN(value)) {
                            expect(value, doenetML).toBeGreaterThanOrEqual(
                                lo - 1e-9,
                            );
                            expect(value, doenetML).toBeLessThanOrEqual(
                                hi + 1e-9,
                            );
                        }
                    }
                    expect(found.problem, doenetML).toBeNull();
                }
            }
        }
        // the bounds decided a good share of them
        expect(passes).toBeGreaterThan(10);
        expect(samples).toBeGreaterThan(1000);
    });
});
