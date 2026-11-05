import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `copy` writes its source's DoenetML again, with no reader state and its
 * own random choices; `copyWithState` duplicates the source with its state
 * and random choices (D33, #2459).
 */

/**
 * A document, its values by name, and the means to reload it from what a
 * save holds.
 */
async function loaded(doenetML: string, requestedVariantIndex = 1) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
        requestedVariantIndex,
    });
    async function sv(name: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const idx = await resolvePathToNodeIdx(name);
        if (!stateVariables[idx]) {
            throw Error(`${name} (${idx}) is not made`);
        }
        return stateVariables[idx].stateValues;
    }
    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            requestedVariantIndex,
            initialState: scoreState.state,
        }));
    }
    return {
        sv,
        reload,
        get core() {
            return core;
        },
        resolve: (name: string) => resolvePathToNodeIdx(name),
        diagnostics: () => getDiagnosticsByType(core),
    };
}

/** The choosing tags, each written so that two draws almost never agree. */
const CHOOSING_TAGS: {
    tag: string;
    source: string;
    value: string;
    /**
     * A sampler draws its values when it is first evaluated, on each load,
     * so neither a `copyWithState` made at load nor a reload keeps them.
     */
    sampler?: boolean;
}[] = [
    {
        tag: "select",
        source: `<select name="x" numToSelect="5">${[...Array(10).keys()]
            .map((i) => `<option><number>${i}</number></option>`)
            .join("")}</select>`,
        value: "text",
    },
    {
        tag: "selectFromSequence",
        source: `<selectFromSequence name="x" from="1" to="1000000" numToSelect="2"/>`,
        value: "text",
    },
    {
        tag: "selectRandomNumbers",
        source: `<selectRandomNumbers name="x" numToSelect="2"/>`,
        value: "text",
    },
    {
        tag: "sampleRandomNumbers",
        source: `<sampleRandomNumbers name="x" numSamples="2"/>`,
        value: "text",
        sampler: true,
    },
    {
        tag: "selectPrimeNumbers",
        source: `<selectPrimeNumbers name="x" to="100000" numToSelect="2"/>`,
        value: "text",
    },
    {
        tag: "samplePrimeNumbers",
        source: `<samplePrimeNumbers name="x" to="100000" numSamples="2"/>`,
        value: "text",
        sampler: true,
    },
    {
        tag: "shuffle",
        source: `<shuffle name="x">${[...Array(10).keys()]
            .map((i) => `<number>${i}</number>`)
            .join("")}</shuffle>`,
        value: "text",
    },
    {
        tag: "choiceInput",
        source: `<choiceInput name="x" shuffleOrder>${[...Array(10).keys()]
            .map((i) => `<choice>${i}</choice>`)
            .join("")}</choiceInput>`,
        value: "choiceOrder",
    },
];

describe("copy and copyWithState @group3", () => {
    describe("a choosing tag", () => {
        for (const { tag, source, value, sampler } of CHOOSING_TAGS) {
            const doenetML = `
<p name="p0">${source}</p>
<p name="p1"><${tag} name="c1" copy="$x"/></p>
<p name="p2"><${tag} name="c2" copy="$x"/></p>
<p name="pw"><${tag} name="w" copyWithState="$x"/></p>
`;
            /** What each of the source, the two copies and the `copyWithState` chose. */
            async function choices(doc: Awaited<ReturnType<typeof loaded>>) {
                const result: string[] = [];
                // one at a time: the core evaluates one request at a time
                for (const name of value === "text"
                    ? ["p0", "p1", "p2", "pw"]
                    : ["x", "c1", "c2", "w"]) {
                    const stateValues = await doc.sv(name);
                    result.push(
                        value === "text"
                            ? stateValues.text
                            : JSON.stringify(stateValues[value]),
                    );
                }
                return result;
            }

            it(`${tag}: copy draws its own values, fixed for a variant and kept through a reload; copyWithState keeps the source's`, async () => {
                for (const variant of [1, 2, 3]) {
                    const doc = await loaded(doenetML, variant);
                    const [x, c1, c2, w] = await choices(doc);
                    expect(c1, `variant ${variant}`).not.eq(x);
                    expect(c2, `variant ${variant}`).not.eq(x);
                    expect(c1, `variant ${variant}`).not.eq(c2);
                    if (!sampler) {
                        expect(w, `variant ${variant}`).eq(x);
                    }

                    // the same for a given variant (a sampler draws anew on
                    // each load, as its source does)
                    if (!sampler) {
                        const again = await loaded(doenetML, variant);
                        expect(await choices(again)).eqls([x, c1, c2, w]);
                    }

                    // and kept through a reload (a sampler's values are
                    // drawn anew on a reload, its source's too)
                    if (!sampler) {
                        await doc.reload();
                        expect(await choices(doc)).eqls([x, c1, c2, w]);
                    }
                }
            });
        }
    });

    it("an input: copy starts at the prefill, copyWithState where the reader left it, each kept through a reload", async () => {
        const doc = await loaded(`
<mathInput name="mi" prefill="1"/>
<graph><point name="P">(1,2)</point></graph>
<booleanInput name="show"/>
<conditionalContent condition="$show">
  <mathInput name="mic" copy="$mi"/>
  <mathInput name="miw" copyWithState="$mi"/>
  <graph><point name="Pc" copy="$P"/><point name="Pw" copyWithState="$P"/></graph>
</conditionalContent>
`);
        await updateMathInputValue({
            latex: "5",
            componentIdx: await doc.resolve("mi"),
            core: doc.core,
        });
        await movePoint({
            componentIdx: await doc.resolve("P"),
            x: 7,
            y: 8,
            core: doc.core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await doc.resolve("show"),
            core: doc.core,
        });

        async function check() {
            expect((await doc.sv("mic")).value.tree).eq(1);
            expect((await doc.sv("miw")).value.tree).eq(5);
            expect((await doc.sv("Pc")).xs.map((x) => x.tree)).eqls([1, 2]);
            expect((await doc.sv("Pw")).xs.map((x) => x.tree)).eqls([7, 8]);
        }
        await check();

        // a copy is changed on its own, and keeps the change through a reload
        await updateMathInputValue({
            latex: "3",
            componentIdx: await doc.resolve("mic"),
            core: doc.core,
        });
        expect((await doc.sv("mic")).value.tree).eq(3);
        expect((await doc.sv("mi")).value.tree).eq(5);

        await doc.reload();
        expect((await doc.sv("mic")).value.tree).eq(3);
        expect((await doc.sv("miw")).value.tree).eq(5);
        expect((await doc.sv("Pc")).xs.map((x) => x.tree)).eqls([1, 2]);
        expect((await doc.sv("Pw")).xs.map((x) => x.tree)).eqls([7, 8]);
    });

    it("a copy of a select that picks more makes four new picks", async () => {
        const doc = await loaded(`
<p name="p0"><select name="x" numToSelect="2">${[...Array(10).keys()]
            .map((i) => `<option><number>${i}</number></option>`)
            .join("")}</select></p>
<p name="p1"><select copy="$x" numToSelect="4"/></p>
`);
        expect((await doc.sv("p0")).text.split(", ").length).eq(2);
        expect((await doc.sv("p1")).text.split(", ").length).eq(4);
        expect(doc.diagnostics().errors).eqls([]);
    });

    describe("copyWithState: what decides what a choosing tag chooses is an error", () => {
        const attributeCases: {
            source: string;
            copy: string;
            attribute: string;
        }[] = [
            {
                source: `<select name="x" numToSelect="2"><option>a</option><option>b</option><option>c</option></select>`,
                copy: `<select copyWithState="$x" numToSelect="3"/>`,
                attribute: "numToSelect",
            },
            {
                source: `<select name="x" numToSelect="2"><option>a</option><option>b</option><option>c</option></select>`,
                copy: `<select copyWithState="$x" numToSelect="2"/>`,
                attribute: "numToSelect",
            },
            {
                source: `<select name="x" numToSelect="2"><option>a</option><option>b</option><option>c</option></select>`,
                copy: `<select copyWithState="$x" numToSelect="$n"/>`,
                attribute: "numToSelect",
            },
            {
                source: `<select name="x"><option>a</option><option>b</option><option>c</option></select>`,
                copy: `<select copyWithState="$x" withReplacement/>`,
                attribute: "withReplacement",
            },
            {
                source: `<selectFromSequence name="x" to="10"/>`,
                copy: `<selectFromSequence copyWithState="$x" to="20"/>`,
                attribute: "to",
            },
            {
                source: `<selectFromSequence name="x" to="10"/>`,
                copy: `<selectFromSequence copyWithState="$x" exclude="3"/>`,
                attribute: "exclude",
            },
            {
                source: `<sampleRandomNumbers name="x"/>`,
                copy: `<sampleRandomNumbers copyWithState="$x" numSamples="3"/>`,
                attribute: "numSamples",
            },
            {
                source: `<sampleRandomNumbers name="x"/>`,
                copy: `<sampleRandomNumbers copyWithState="$x" type="gaussian"/>`,
                attribute: "type",
            },
            {
                source: `<choiceInput name="x"><choice>a</choice><choice>b</choice></choiceInput>`,
                copy: `<choiceInput copyWithState="$x" shuffleOrder/>`,
                attribute: "shuffleOrder",
            },
        ];
        for (const { source, copy, attribute } of attributeCases) {
            it(copy, async () => {
                const doc = await loaded(`
<number name="n">2</number>
<p name="p0">${source}</p>
<p name="p1">${copy}</p>
<p name="p2">${copy.replace("copyWithState", "copy")}</p>
`);
                const errors = doc.diagnostics().errors;
                expect(errors.map((e: any) => e.code)).eqls(["doenet-e0068"]);
                expect(errors[0].args.attribute).eq(attribute);
                expect(errors[0].message).contain("Use `copy`");
                expect(errors[0].position.start.line).eq(4);
                // `copy` makes a new one, which chooses again
                expect((await doc.sv("p2")).text).not.eq("");
            });
        }

        const childCases = [
            {
                source: `<select name="x"><option>a</option><option>b</option></select>`,
                copy: `<select copyWithState="$x"><option>c</option></select>`,
                childType: "option",
            },
            {
                source: `<choiceInput name="x" shuffleOrder><choice>a</choice><choice>b</choice></choiceInput>`,
                copy: `<choiceInput copyWithState="$x"><choice>c</choice></choiceInput>`,
                childType: "choice",
            },
            {
                source: `<shuffle name="x"><text>a</text><text>b</text></shuffle>`,
                copy: `<shuffle copyWithState="$x"><text>c</text></shuffle>`,
                childType: "text",
            },
        ];
        for (const { source, copy, childType } of childCases) {
            it(copy, async () => {
                const doc = await loaded(`
<p name="p0">${source}</p>
<p name="p1">${copy}</p>
<p name="p2">${copy.replace("copyWithState", "copy")}</p>
`);
                const errors = doc.diagnostics().errors;
                expect(errors.map((e: any) => e.code)).eqls(["doenet-e0069"]);
                expect(errors[0].args.childType).eq(childType);
                expect(errors[0].position.start.line).eq(3);
            });
        }

        it("a choice added to a choiceInput that does not shuffle is allowed", async () => {
            const doc = await loaded(`
<choiceInput name="x"><choice>a</choice><choice>b</choice></choiceInput>
<choiceInput name="w" copyWithState="$x"><choice>c</choice></choiceInput>
`);
            expect(doc.diagnostics().errors).eqls([]);
            expect((await doc.sv("w")).choiceTexts).eqls(["a", "b", "c"]);
        });

        it("appearance attributes are allowed and take precedence over carried state", async () => {
            const doc = await loaded(`
<p name="p0"><select name="x" numToSelect="2"><option><number>1</number></option><option><number>2</number></option><option><number>3</number></option></select></p>
<p name="pw"><select copyWithState="$x" hide/></p>
<graph><point name="P">(1,2)</point><point name="Pw" copyWithState="$P" x="3"/></graph>
`);
            expect(doc.diagnostics().errors).eqls([]);
            expect((await doc.sv("pw")).text).eq("");
            expect((await doc.sv("Pw")).xs.map((x) => x.tree)).eqls([3, 2]);
        });
    });

    it("copyWithState of a module: a module attribute reaching a nested choice keeps the carried choices, with a warning", async () => {
        const doc = await loaded(`
<setup>
  <module name="m">
    <moduleAttributes><integer name="k">2</integer></moduleAttributes>
    <p name="picks"><select numToSelect="$k">${[...Array(10).keys()]
        .map((i) => `<option><number>${i}</number></option>`)
        .join("")}</select></p>
    <p name="kp">$k</p>
  </module>
</setup>
<module name="m1" copy="$m"/>
<module name="mw" copyWithState="$m1" k="4"/>
<module name="mc" copy="$m1" k="4"/>
`);
        const source = (await doc.sv("m1.picks")).text;
        expect(source.split(", ").length).eq(2);
        // the carried choices win, and `k` takes the written value
        expect((await doc.sv("mw.picks")).text).eq(source);
        expect((await doc.sv("mw.kp")).text).eq("4");
        // a copy chooses again
        expect((await doc.sv("mc.picks")).text.split(", ").length).eq(4);

        const warnings = doc
            .diagnostics()
            .warnings.filter((w: any) => w.code === "doenet-w0186");
        expect(warnings.length).eq(1);
        expect(warnings[0].args.attribute).eq("k");
        expect(warnings[0].position.start.line).eq(10);
        expect(doc.diagnostics().errors).eqls([]);
    });

    it("each copy of a module draws its own values", async () => {
        const doc = await loaded(`
<setup>
  <module name="m">
    <p name="v"><selectFromSequence from="1" to="1000000" /></p>
  </module>
</setup>
<module name="a" copy="$m"/>
<module name="b" copy="$m"/>
<module name="c" copyWithState="$a"/>
`);
        const a = (await doc.sv("a.v")).text;
        expect((await doc.sv("b.v")).text).not.eq(a);
        expect((await doc.sv("c.v")).text).eq(a);
    });
});
