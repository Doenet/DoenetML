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
 * The codes of the diagnostics a reference written as a tag reports: a type
 * change (D26), a reference that names nothing (D36), an index that
 * names nothing, and a composite that holds nothing now (D37).
 */
const TYPE_CHANGE_CODES = [
    "doenet-e0062",
    "doenet-e0063",
    "doenet-e0064",
    "doenet-e0065",
    "doenet-e0066",
    "doenet-e0067",
    "doenet-i0053",
    "doenet-i0054",
    "doenet-i0055",
    "doenet-w0104",
    "doenet-w0105",
    "doenet-w0181",
];

/**
 * A document whose references are written as tags (D26, D36), and what it
 * shows, saved and reloaded when `reload` is called.
 */
async function setup(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });
    let reported = new Set<string>();

    /** The text of each named component. */
    async function texts(names: string[]) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const result: Record<string, string> = {};
        for (const name of names) {
            result[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return result;
    }

    /**
     * What the reference in `<p name="{pName}">` is replaced by: the types
     * of its replacements shown, `[]` while it shows nothing.
     */
    async function replacedBy(pName: string) {
        const components = (core as any).core._components;
        const p = components[await resolvePathToNodeIdx(pName)];
        const copy = p.definingChildren.find(
            (x: any) => x.componentType === "_copy",
        );
        const shown = copy.replacements.slice(
            0,
            copy.replacements.length - (copy.replacementsToWithhold ?? 0),
        );
        return shown.map((x: any) =>
            typeof x === "string" ? "string" : x.componentType,
        );
    }

    /**
     * The diagnostics of a type change reported now that were not when this
     * was last called, as code, level, line and message. One that ended is
     * no longer reported (B33).
     */
    function newDiagnostics() {
        const all = getDiagnosticsByType(core);
        const result = [...all.errors, ...all.warnings, ...all.infos]
            .filter((d: any) => TYPE_CHANGE_CODES.includes(d.code))
            .map((d: any) => ({
                code: d.code,
                type: d.type,
                line: d.position?.start.line,
                message: d.message,
            }));
        const keys = result.map((d: any) =>
            JSON.stringify([d.line, d.message]),
        );
        const added = result.filter(
            (_: any, i: number) => !reported.has(keys[i]),
        );
        reported = new Set(keys);
        return added;
    }

    /** The type of the component `name` names. */
    async function typeOf(name: string) {
        return (core as any).core._components[await resolvePathToNodeIdx(name)]
            ?.componentType;
    }

    /** All errors reported, of any code. */
    function errors() {
        return getDiagnosticsByType(core).errors.map((d: any) => d.code);
    }

    /** Save the document's state and load it again from what was saved. */
    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        reported = new Set<string>();
    }

    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    async function move(name: string, x: number, y: number) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(name),
            x,
            y,
            core,
        });
    }

    return {
        core: async () => core,
        texts,
        typeOf,
        move,
        replacedBy,
        newDiagnostics,
        errors,
        reload,
        setBoolean,
        setMath,
        resolvePathToNodeIdx: (name: string) => resolvePathToNodeIdx(name),
    };
}

describe("A reference written as a tag of a composite is decided when the document loads (D36) @group4", () => {
    it("a conditionalContent with no else is missing while no case is true, and each case and the else need one component of one type", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<conditionalContent name="noElse"><case condition="$b"><math>x</math></case></conditionalContent>
<conditionalContent name="two"><case condition="$b"><math>a</math><math>b</math></case><else><math>c</math></else></conditionalContent>
<conditionalContent name="mixed"><case condition="$b"><math>1</math></case><else><number>2</number></else></conditionalContent>
<conditionalContent name="unrelated"><case condition="$b"><point>(1,2)</point></case><else><text>no</text></else></conditionalContent>
<conditionalContent name="one"><case condition="$b"><number>1</number></case><else><number>2</number></else></conditionalContent>
<p name="p1"><math extend="$noElse"/></p>
<p name="p2"><math extend="$two"/></p>
<p name="p3"><math extend="$mixed"/></p>
<p name="p4"><text extend="$unrelated"/></p>
<p name="p5"><math name="m5" extend="$one"/></p>
<p name="p6"><math>$mixed</math></p>
<p name="p7"><math copy="$mixed"/></p>
`);
        const errors = [
            {
                code: "doenet-e0064",
                type: "error",
                line: 9,
                message:
                    "A `<math>` can be made from `$two` only when it always holds one component, and a case of the `<conditionalContent>` holds 2. To read what it holds as one value, write `<math>$two</math>`.",
            },
            {
                code: "doenet-e0066",
                type: "error",
                line: 10,
                message:
                    "A `<math>` can be made from `$mixed` only when what it holds is always of one type, and it can hold `<math>`, `<number>`. To read what it holds as one value, write `<math>$mixed</math>`.",
            },
            {
                code: "doenet-e0065",
                type: "error",
                line: 11,
                message:
                    "A `<text>` can't be made from `$unrelated`, which gives a `<point>`. To show it as it is, write `$unrelated`.",
            },
            {
                code: "doenet-e0066",
                type: "error",
                line: 14,
                message:
                    "A `<math>` can be made from `$mixed` only when what it holds is always of one type, and it can hold `<math>`, `<number>`. To read what it holds as one value, write `<math>$mixed</math>`.",
            },
            {
                code: "doenet-i0055",
                type: "info",
                line: 8,
                message:
                    "`$noElse` holds nothing now, so this `<math>` is missing until it holds one component.",
            },
        ];
        expect(await d.texts(["p5", "m5", "p6"])).eqls({
            p5: "2",
            m5: "2",
            p6: "2",
        });
        for (const p of ["p2", "p3", "p4", "p7"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        // A conditionalContent with no else is missing while no case is
        // true (D37).
        expect(await d.replacedBy("p1")).eqls(["math"]);
        expect(await d.texts(["p1"])).eqls({ p1: "＿" });
        expect(d.newDiagnostics()).eqls(errors);

        // What is shown as a case becomes active does not change what the
        // errors are.
        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p5", "m5", "p6"])).eqls({
            p1: "x",
            p5: "1",
            m5: "1",
            p6: "1",
        });
        for (const p of ["p2", "p3", "p4", "p7"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        expect(d.newDiagnostics()).eqls([]);
        expect(await d.typeOf("m5")).eq("math");
    });

    it("a case holding a bare string holds a text, and one holding a reference holds its tag", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<number name="n">5</number>
<conditionalContent name="cc"><case condition="$b">hi</case><else>bye</else></conditionalContent>
<conditionalContent name="cc2"><case condition="$b">$n</case><else><number>2</number></else></conditionalContent>
<conditionalContent name="cc3"><case condition="$b">$n</case><else>two</else></conditionalContent>
<p name="p1"><text name="t" extend="$cc"/></p>
<p name="p2"><math name="m" extend="$cc2"/></p>
<p name="p3"><math extend="$cc3"/></p>
`);
        expect(await d.texts(["p1", "t", "p2", "m"])).eqls({
            p1: "bye",
            t: "bye",
            p2: "2",
            m: "2",
        });
        expect(await d.replacedBy("p3")).eqls(["_error"]);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0066", 9],
        ]);

        // A case holding a bare string (#2433). What is shown of a case
        // holding `$n` is #2437.
        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "t"])).eqls({ p1: "hi", t: "hi" });
        expect(await d.typeOf("m")).eq("math");
        expect(d.errors()).eqls(["doenet-e0066"]);
    });

    it("a select and the other selectors need numToSelect written as 1, or left out", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<select name="s1"><option><math>x</math></option></select>
<select name="s2" numToSelect="2"><option><math>x</math></option><option><math>y</math></option></select>
<select name="s3" numToSelect="$n"><option><math>x</math></option></select>
<select name="s4"><option><math>x</math></option><option><number>1</number></option></select>
<selectFromSequence name="sfs" from="5" to="5"/>
<selectFromSequence name="sfs2" from="1" to="9" numToSelect="2"/>
<p name="p1"><math name="m1" extend="$s1"/></p>
<p name="p2"><math extend="$s2"/></p>
<p name="p3"><math extend="$s3"/></p>
<p name="p4"><math extend="$s4"/></p>
<p name="p5"><number name="n5" extend="$sfs"/></p>
<p name="p6"><number extend="$sfs2"/></p>
<p name="p7"><math name="m7" extend="$s2[1]"/></p>
<p name="p8"><math extend="$s1[2]"/></p>
`);
        expect(await d.texts(["p1", "m1", "p5", "n5"])).eqls({
            p1: "x",
            m1: "x",
            p5: "5",
            n5: "5",
        });
        expect(await d.typeOf("m7")).eq("math");
        for (const p of ["p2", "p3", "p4", "p6"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        expect(await d.replacedBy("p8")).eqls(["math"]);
        // A reference is an error, even while its value is 1. A literal
        // index past what is picked names nothing whatever happens: the tag
        // is missing, with a warning (D37).
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "error",
                line: 10,
                message:
                    "A `<math>` can be made from `$s2` only when it always holds one component, and a `<select>` holds one only when its `numToSelect` is written as 1 or left out. To use its first pick, write `$s2[1]`. To read all it picks as one value, write `<math>$s2</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: 11,
                message:
                    "A `<math>` can be made from `$s3` only when it always holds one component, and a `<select>` holds one only when its `numToSelect` is written as 1 or left out. To use its first pick, write `$s3[1]`. To read all it picks as one value, write `<math>$s3</math>`.",
            },
            {
                code: "doenet-e0066",
                type: "error",
                line: 12,
                message:
                    "A `<math>` can be made from `$s4` only when what it holds is always of one type, and it can hold `<math>`, `<number>`. To read what it holds as one value, write `<math>$s4</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: 14,
                message:
                    "A `<number>` can be made from `$sfs2` only when it always holds one component, and a `<selectFromSequence>` holds one only when its `numToSelect` is written as 1 or left out. To use its first pick, write `$sfs2[1]`. To read all it picks as one value, write `<number>$sfs2</number>`.",
            },
            {
                code: "doenet-w0181",
                type: "warning",
                line: 16,
                message: "`$s1[2]`: the `<select>` made only 1 pick.",
            },
        ]);
    });

    it("a repeat, a collect, a sequence or an intersection can hold any number, so an index picks one", async () => {
        const d = await setup(`
<repeat name="r" for="1" valueName="v"><math>$v</math></repeat>
<group name="g" hide><math>x</math></group>
<collect name="c" componentType="math" from="$g"/>
<sequence name="seq" length="1"/>
<intersection name="i"><line through="(0,0) (1,1)"/><line through="(0,1) (1,0)"/></intersection>
<p name="p1"><math extend="$r"/></p>
<p name="p2"><math extend="$c"/></p>
<p name="p3"><number extend="$seq"/></p>
<p name="p4"><point extend="$i"/></p>
<p name="p5"><math name="m5" extend="$r[1]"/></p>
<p name="p6"><math name="m6" extend="$c[1]"/></p>
<p name="p7"><number name="n7" extend="$seq[1]"/></p>
<p name="p8"><point name="P8" extend="$i[1]"/></p>
`);
        // Even while each holds one component.
        for (const p of ["p1", "p2", "p3", "p4"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        expect(d.newDiagnostics()).eqls(
            [
                ["math", "r", "repeat", 7],
                ["math", "c", "collect", 8],
                ["number", "seq", "sequence", 9],
                ["point", "i", "intersection", 10],
            ].map(([T, x, tag, line]) => ({
                code: "doenet-e0064",
                type: "error",
                line,
                message: `A \`<${T}>\` can be made from \`$${x}\` only when it always holds one component, and a \`<${tag}>\` can hold any number. To use the first, write \`$${x}[1]\`. To read them all as one value, write \`<${T}>$${x}</${T}>\`.`,
            })),
        );
        expect(await d.texts(["m5", "m6", "n7", "p8"])).eqls({
            m5: "1",
            m6: "x",
            n7: "1",
            p8: "(0.5, 0.5)",
        });
        expect(await d.typeOf("P8")).eq("point");
    });

    it("a group, a sort or a shuffle needs one component, and what each part holds is its tag", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<math name="y">x+1</math>
<point name="P">(1,2)</point>
<mathList name="ml">7 8</mathList>
<group name="g1">$y</group>
<group name="g2">hello</group>
<group name="g3">$P.x</group>
<group name="g4"><conditionalContent><case condition="$b"><math>1</math></case><else><math>2</math></else></conditionalContent></group>
<group name="g5"><math>1</math><math>2</math></group>
<group name="g6">$ml[1]</group>
<group name="g7"><conditionalContent><case condition="$b"><math>1</math></case></conditionalContent></group>
<sort name="s"><number>3</number></sort>
<p name="p1"><math name="m1" extend="$g1"/></p>
<p name="p2"><text name="t2" extend="$g2"/></p>
<p name="p3"><math extend="$g3"/></p>
<p name="p4"><math name="m4" extend="$g4"/></p>
<p name="p5"><math extend="$g5"/></p>
<p name="p6"><math name="m6" extend="$g6"/></p>
<p name="p7"><math extend="$g7"/></p>
<p name="p8"><math name="m8" extend="$s"/></p>
`);
        expect(await d.texts(["m1", "t2", "m4", "m6", "m8"])).eqls({
            m1: "x + 1",
            t2: "hello",
            m4: "2",
            m6: "7",
            m8: "3",
        });
        for (const p of ["p3", "p5"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        expect(await d.replacedBy("p7")).eqls(["math"]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0067",
                type: "error",
                line: 16,
                message:
                    "A `<math>` can be made from `$g3` only when the type of what it holds is known from the DoenetML, and it holds a property, whose type isn't. To read what it holds as one value, write `<math>$g3</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: 18,
                message:
                    "A `<math>` can be made from a `<group>` only when it holds one component, and `$g5` holds 2. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$g5</math>`.",
            },
            {
                code: "doenet-i0055",
                type: "info",
                line: 20,
                message:
                    "`$g7` holds nothing now, so this `<math>` is missing until it holds one component.",
            },
        ]);
        await d.setBoolean("b", true);
        expect(await d.texts(["m4", "p7"])).eqls({ m4: "1", p7: "1" });
        expect(d.newDiagnostics()).eqls([]);
    });

    it("an iteration or a pick is held to the same rules", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<repeat name="rep" for="1" valueName="v">
  <conditionalContent><case condition="$b"><math>$v</math></case></conditionalContent>
</repeat>
<repeat name="rep2" for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat>
<select name="s">
  <option><conditionalContent><case condition="$b"><math>1</math></case><else><math>3</math></else></conditionalContent></option>
</select>
<p name="p1"><math extend="$rep[1]"/></p>
<p name="p2"><math extend="$rep2[1]"/></p>
<p name="p3"><math name="m3" extend="$s[1]"/></p>
`);
        expect(await d.replacedBy("p1")).eqls(["math"]);
        expect(await d.replacedBy("p2")).eqls(["_error"]);
        expect(await d.texts(["p1", "m3"])).eqls({ p1: "＿", m3: "3" });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 11],
            ["doenet-i0054", 10],
        ]);
        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "m3"])).eqls({ p1: "1", m3: "1" });
        expect(d.newDiagnostics()).eqls([]);
    });

    it("a name in what a copy copies is found there", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<module name="mod">
  <conditionalContent name="one"><case condition="$b"><math>1</math></case><else><math>2</math></else></conditionalContent>
  <conditionalContent name="none"><case condition="$b"><math>1</math></case></conditionalContent>
</module>
<module name="m2" extend="$mod"/>
<conditionalContent name="c1"><case condition="$b">$m2.one</case><else><math>3</math></else></conditionalContent>
<conditionalContent name="c2"><case condition="$b">$m2.none</case><else><math>3</math></else></conditionalContent>
<p name="p1"><math name="m1" extend="$c1"/></p>
<p name="p2"><math extend="$c2"/></p>
`);
        // A case holding what can hold nothing is allowed (D37).
        expect(await d.texts(["m1", "p2"])).eqls({ m1: "3", p2: "3" });
        expect(d.newDiagnostics()).eqls([]);
        await d.setBoolean("b", true);
        expect(await d.texts(["m1", "p2"])).eqls({ m1: "1", p2: "1" });
        expect(d.newDiagnostics()).eqls([]);
    });

    it("a name written on a tag made with extend is found in what a copy copies", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<math name="n">5</math>
<module name="mod"><math name="go" extend="$n"/></module>
<module name="m2" extend="$mod"/>
<conditionalContent name="c"><case condition="$b">$m2.go</case><else><math>3</math></else></conditionalContent>
<p name="p1"><math name="m1" extend="$c"/></p>
`);
        expect(await d.texts(["m1"])).eqls({ m1: "3" });
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("a copy of a group holds what it copies and what is written in it", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<group name="g"><math>1</math></group>
<group name="h" extend="$g"><math>2</math></group>
<group name="e"/>
<group name="h2" extend="$e"><math>7</math></group>
<group name="h3" extend="$g"><text>q</text></group>
<conditionalContent name="cc"><case condition="$b">$h</case><else><math>3</math></else></conditionalContent>
<p name="p1"><math extend="$h"/></p>
<p name="p2"><math extend="$cc"/></p>
<p name="p3"><math name="m3" extend="$h2"/></p>
<p name="p4"><mathList extend="$h"/></p>
<p name="p5"><mathList extend="$h3"/></p>
`);
        for (const p of ["p1", "p2"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        expect(await d.texts(["m3", "p4", "p5"])).eqls({
            m3: "7",
            p4: "1, 2",
            p5: "",
        });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 9],
            ["doenet-e0064", 10],
            ["doenet-e0066", 13],
        ]);
    });

    it("a part that does not hold one component is named as the part of the composite it is of", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<group name="g"><conditionalContent><case condition="$b"><math>1</math><math>2</math></case><else><math>3</math></else></conditionalContent></group>
<conditionalContent name="cc1"><case condition="$b"><group><math>1</math><math>2</math></group></case><else><math>3</math></else></conditionalContent>
<conditionalContent name="cc2"><case condition="$b"><select><option><math>1</math><math>2</math></option></select></case><else><math>3</math></else></conditionalContent>
<conditionalContent name="cc3"><case condition="$b"><math>1</math></case><else></else></conditionalContent>
<repeat name="r" for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat>
<repeatForSequence name="rs" length="2"><math>1</math><math>2</math></repeatForSequence>
<p name="p1"><math extend="$g"/></p>
<p name="p2"><math extend="$cc1"/></p>
<p name="p3"><math extend="$cc2"/></p>
<p name="p4"><math extend="$cc3"/></p>
<p name="p5"><math extend="$r[1]"/></p>
<p name="p6"><math extend="$rs[1]"/></p>
`);
        for (const p of ["p1", "p2", "p3", "p5", "p6"]) {
            expect(await d.replacedBy(p), p).eqls(["_error"]);
        }
        // A case holding nothing is allowed: the math is missing while it
        // is active (D37).
        expect(await d.texts(["p4"])).eqls({ p4: "＿" });
        expect(d.newDiagnostics().map((x) => x.message)).eqls([
            "A `<math>` can be made from `$g` only when it always holds one component, and a case of the `<conditionalContent>` holds 2. To read what it holds as one value, write `<math>$g</math>`.",
            "A `<math>` can be made from `$cc1` only when it always holds one component, and a case of the `<conditionalContent>` holds 2. To read what it holds as one value, write `<math>$cc1</math>`.",
            "A `<math>` can be made from `$cc2` only when it always holds one component, and an option of the `<select>` holds 2. To read what it holds as one value, write `<math>$cc2</math>`.",
            "A `<math>` can be made from `$r[1]` only when it always holds one component, and an iteration of the `<repeat>` holds 2. To read what it holds as one value, write `<math>$r[1]</math>`.",
            "A `<math>` can be made from `$rs[1]` only when it always holds one component, and an iteration of the `<repeatForSequence>` holds 2. To read what it holds as one value, write `<math>$rs[1]</math>`.",
        ]);
        await d.setBoolean("b", true);
        expect(await d.texts(["p4"])).eqls({ p4: "1" });
    });

    it("a list tag takes any number of components, including none, all of one type", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<mathInput name="n" prefill="2"/>
<conditionalContent name="cc"><case condition="$b"><math>x</math></case></conditionalContent>
<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat>
<group name="g" hide><math>a</math><math>b</math></group>
<collect name="c" componentType="math" from="$g"/>
<select name="s" numToSelect="$n"><option><math>p</math></option><option><math>p</math></option></select>
<group name="mixed"><math>1</math><text>t</text></group>
<p name="p1"><mathList extend="$cc"/></p>
<p name="p2"><mathList extend="$r"/></p>
<p name="p3"><mathList extend="$c"/></p>
<p name="p4"><mathList extend="$s"/></p>
<p name="p5"><mathList extend="$mixed"/></p>
<p name="p6"><mathList>$mixed</mathList></p>
`);
        expect(await d.texts(["p1", "p2", "p3", "p4"])).eqls({
            p1: "",
            p2: "1, 2",
            p3: "a, b",
            p4: "p, p",
        });
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0066",
                type: "error",
                line: 14,
                message:
                    "A `<mathList>` can be made from `$mixed` only when what it holds is all of one type, and it holds `<math>`, `<text>`. To read them all as one list, write `<mathList>$mixed</mathList>`.",
            },
        ]);
        expect(await d.texts(["p6"])).eqls({ p6: "1, t" });

        await d.setBoolean("b", true);
        expect(await d.texts(["p1"])).eqls({ p1: "x" });
        expect(d.newDiagnostics()).eqls([]);
    });

    it("a type that already is the tag written counts as that tag", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><integer>3</integer></case><else><number>0.5</number></else></conditionalContent>
<group name="g"><integer>3</integer><number>0.5</number></group>
<p name="p1"><number extend="$cc"/></p>
<p name="p2"><numberList extend="$g"/></p>
<p name="p3"><integer extend="$cc"/></p>
`);
        // An `<integer>` is a `<number>`, so both hold numbers only. As an
        // `<integer>`, a `<number>` is a different type.
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "0.5", p2: "3, 0.5" });
        expect(await d.replacedBy("p3")).eqls(["_error"]);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0066", 7],
        ]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p1"])).eqls({ p1: "3" });
    });

    it("a tag made from a name in the cases follows the case when one type already is the tag written", async () => {
        // When the case changes, the `<number>` made from the `x` of the
        // branch left is deleted with it, and the one made from an
        // `<integer>` is a `<number>` holding it, not a blank `<number>`
        // (`NaN`, `verifyReplacementsMatchSpecifiedType`).
        for (const [caseX, elseX] of [
            ['<integer name="x">3</integer>', '<number name="x">0.5</number>'],
            ['<number name="x">0.5</number>', '<integer name="x">3</integer>'],
        ]) {
            const d = await setup(`
<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b">${caseX}</case><else>${elseX}</else></conditionalContent>
<p name="p1"><number extend="$cc.x"/></p>
<p name="p2"><number extend="$x"/></p>
`);
            const inCase = caseX.includes("integer") ? "3" : "0.5";
            const inElse = inCase === "3" ? "0.5" : "3";
            const both = (value: string) => ({ p1: value, p2: value });
            expect(await d.texts(["p1", "p2"])).eqls(both(inElse));
            await d.setBoolean("b", true);
            expect(await d.texts(["p1", "p2"])).eqls(both(inCase));
            await d.setBoolean("b", false);
            expect(await d.texts(["p1", "p2"])).eqls(both(inElse));
            await d.setBoolean("b", true);
            expect(await d.texts(["p1", "p2"])).eqls(both(inCase));
            expect(d.errors()).eqls([]);
            expect(d.newDiagnostics()).eqls([]);
        }
    });

    it("a tag whose reference names nothing, more than one thing, or a property its source does not have is missing, with a warning, as a bare one is", async () => {
        const d = await setup(`
<group><text name="t">a</text><text name="t">b</text></group>
<section name="sec"><title>A</title></section>
<p name="p1"><math extend="$nothing"/></p>
<p name="p2"><text extend="$t"/></p>
<p name="p3"><text extend="$sec.nothing"/></p>
<p name="p4"><text copy="$nothing">x</text></p>
<p name="p5">$nothing</p>
`);
        expect(await d.texts(["p1", "p2", "p3", "p4", "p5"])).eqls({
            p1: "＿",
            p2: "＿",
            p3: "＿",
            p4: "＿",
            p5: "＿",
        });
        expect(
            d.newDiagnostics().sort((a: any, b: any) => a.line - b.line),
        ).eqls([
            {
                code: "doenet-w0104",
                type: "warning",
                line: 4,
                message: "No referent found for reference: `$nothing`",
            },
            {
                code: "doenet-w0105",
                type: "warning",
                line: 5,
                message: "Multiple referents found for reference: `$t`",
            },
            {
                code: "doenet-w0104",
                type: "warning",
                line: 6,
                message: "No referent found for reference: `$sec.nothing`",
            },
            {
                code: "doenet-w0104",
                type: "warning",
                line: 7,
                message: "No referent found for reference: `$nothing`",
            },
            {
                code: "doenet-w0104",
                type: "warning",
                line: 8,
                message: "No referent found for reference: `$nothing`",
            },
        ]);
    });

    it("a property none of the components a composite holds has is missing, with a warning, for a scalar or a list tag", async () => {
        const d = await setup(`
<group name="g"><text>a</text></group>
<group name="pg"><point>(1,2)</point></group>
<number name="n">1</number>
<mathInput name="k"/>
<repeat name="r" for="1 2" valueName="v"><point>($v, 0)</point></repeat>
<p name="p1"><text extend="$g.nothing"/></p>
<p name="p2"><mathList extend="$n.nothing"/></p>
<p name="p3"><math name="m3" extend="$pg.x"/></p>
<p name="p4"><math extend="$r[$k].x"/></p>
`);
        expect(await d.replacedBy("p1")).eqls(["text"]);
        expect(await d.texts(["p1", "m3", "p4"])).eqls({
            p1: "＿",
            m3: "1",
            p4: "＿",
        });
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-w0104",
                type: "warning",
                line: 7,
                message: "No referent found for reference: `$g.nothing`",
            },
            {
                code: "doenet-w0104",
                type: "warning",
                line: 8,
                message: "No referent found for reference: `$n.nothing`",
            },
            {
                code: "doenet-i0054",
                type: "info",
                line: 10,
                message:
                    "`$r[$k].x` names nothing now, so this `<math>` is missing until it does.",
            },
        ]);
        // An index that names nothing yet is the info alone.
        await d.setMath("k", "2");
        expect(await d.texts(["p4"])).eqls({ p4: "2" });
        expect(d.newDiagnostics()).eqls([]);
    });

    it("a composite named by several parts is read once, so composites nested by reference load in time", async () => {
        // Each case and else names the next composite, so following every
        // path would read the innermost group 2^24 times.
        const depth = 24;
        let doenetML = `<booleanInput name="b"/>\n<group name="g${depth}"><math>x</math></group>\n`;
        for (let k = depth - 1; k >= 0; k--) {
            doenetML += `<conditionalContent name="g${k}"><case condition="$b">$g${k + 1}</case><else>$g${k + 1}</else></conditionalContent>\n`;
        }
        doenetML += `<p name="p"><math extend="$g0"/></p>`;
        const d = await setup(doenetML);
        expect(await d.texts(["p"])).eqls({ p: "x" });
        expect(d.newDiagnostics()).eqls([]);
        // About 3 seconds; reading every path took about 30.
    }, 15000);

    it("what a composite read once holds is read again from inside a cycle through it", async () => {
        // `$X` is read first for `$W`, where it holds `<math>` (`c2`) or
        // `<text>`. For `c2`, X's case holds `c2` itself, so what Y holds
        // is not decided, whether or not `$W` is written.
        const cycle = `
<booleanInput name="b"/>
<conditionalContent name="X"><case condition="$b">$c2</case><else><text>t</text></else></conditionalContent>
<conditionalContent name="Y"><case condition="$b">$X</case><else><math>2</math></else></conditionalContent>
<p name="p2"><math name="c2" extend="$Y"/></p>`;
        const d1 = await setup(cycle);
        expect(await d1.texts(["p2"])).eqls({ p2: "2" });
        expect(d1.newDiagnostics()).eqls([]);

        const d2 = await setup(
            `<conditionalContent name="W"><case condition="$b">$X</case><else><math>3</math></else></conditionalContent><p name="p1"><text extend="$W"/></p>` +
                cycle,
        );
        expect(await d2.texts(["p2"])).eqls({ p2: "2" });
        expect(d2.newDiagnostics()).eqls([
            {
                code: "doenet-e0066",
                type: "error",
                line: 1,
                message:
                    "A `<text>` can be made from `$W` only when what it holds is always of one type, and it can hold `<math>`, `<text>`. To read what it holds as one value, write `<text>$W</text>`.",
            },
        ]);
    });
    it("an iteration holding an index into its own repeat holds itself, and is not decided", async () => {
        const d = await setup(`
<repeat name="r" for="1 2" valueName="v">$r[1]</repeat>
<p name="p"><math extend="$r[1]"/></p>
`);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls(["doenet-e0005"]);
    });

    it("an index into a selector or a repeat named by several parts is read once", async () => {
        // Each option names a pick of the next select, so following every
        // path would read the innermost select 2^30 times.
        const depth = 30;
        let doenetML = `<select name="s${depth}"><option><math>x</math></option></select>\n`;
        for (let k = depth - 1; k >= 0; k--) {
            doenetML += `<select name="s${k}"><option>$s${k + 1}[1]</option><option>$s${k + 1}[1]</option></select>\n`;
        }
        doenetML += `<p name="p"><math extend="$s0[1]"/></p>`;
        const d = await setup(doenetML);
        expect(await d.texts(["p"])).eqls({ p: "x" });
        expect(d.newDiagnostics()).eqls([]);
    }, 15000);

    it("what holds nothing counts as nothing beside what holds one component", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<group name="g1"><group/><math>7</math><math>8</math></group>
<group name="g2"><group/><group/></group>
<group name="g3"><group/><repeat for="1 2" valueName="v"><math>$v</math></repeat></group>
<group name="g4"><group/><math>7</math></group>
<p name="p1"><math extend="$g1"/></p>
<p name="p2"><math extend="$g2"/></p>
<p name="p3"><math extend="$g3"/></p>
<p name="p4"><math extend="$g4"/></p>
`);
        // `g2` holds nothing, so its math is missing (D37).
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 7],
            ["doenet-e0064", 9],
        ]);
        expect(await d.replacedBy("p1")).eqls(["_error"]);
        expect(await d.replacedBy("p2")).eqls(["math"]);
        expect(await d.texts(["p2"])).eqls({ p2: "＿" });
        expect(d.newDiagnostics()).eqls([]);
        // One component beside an empty group is not decided when the
        // document loads: no error that it holds two.
        expect(await d.replacedBy("p4")).eqls(["math"]);
    });

    it("a name, then an index, in what a copy copies", async () => {
        const d = await setup(`
<module name="m"><mathList name="l">1 2</mathList></module>
<module name="m2" extend="$m"/>
<conditionalContent name="cc"><case condition="false"><math>3</math></case><else>$m2.l[1]</else></conditionalContent>
<p name="p"><math extend="$cc"/></p>
`);
        expect(await d.texts(["p"])).eqls({ p: "1" });
        expect(d.newDiagnostics()).eqls([]);
    });

    it("a name of components in different options names any of them", async () => {
        const d = await setup(`
<select name="s1"><option><group name="go"><math>1</math></group></option><option><group name="go"><math>1</math><math>2</math></group></option></select>
<select name="s2"><option><group name="gt"><math>1</math></group></option><option><group name="gt"><text>a</text></group></option></select>
<conditionalContent name="cc"><case condition="false"><math>3</math></case><else>$s1.go</else></conditionalContent>
<p name="p1"><math extend="$s1.go"/></p>
<p name="p2"><math extend="$s2.gt"/></p>
<p name="p3"><math extend="$cc"/></p>
`);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 5],
            ["doenet-e0066", 6],
            ["doenet-e0064", 7],
        ]);
    });

    it("types that are known and differ are an error, whatever an unknown one would be", async () => {
        const d = await setup(`
<point name="P">(1,2)</point>
<group name="g"><math>1</math><text>a</text>$P.x</group>
<conditionalContent name="cc"><case condition="true"><math>1</math></case><case condition="false"><text>a</text></case><else>$P.x</else></conditionalContent>
<group name="h"><math>1</math>$P.x</group>
<p name="p1"><mathList extend="$g"/></p>
<p name="p2"><math extend="$cc"/></p>
<p name="p3"><mathList extend="$h"/></p>
`);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0066", 6],
            ["doenet-e0066", 7],
        ]);
        // An unknown type beside one known type is not decided for a list.
        expect(await d.texts(["p3"])).eqls({ p3: "1, 1" });
    });

    it("a case, an else or an option written with copy is the one it copies", async () => {
        const d = await setup(`
<conditionalContent name="c0"><case name="c" condition="true"><text>a</text></case><else name="e"><math>2</math></else></conditionalContent>
<conditionalContent name="cc1"><case condition="false"><math>1</math></case><else copy="$e"/></conditionalContent>
<conditionalContent name="cc2"><case copy="$c"/><else><math>2</math></else></conditionalContent>
<select name="s0"><option name="o"><text>a</text></option></select>
<select name="s"><option><math>1</math></option><option copy="$o"/></select>
<p name="p1"><math extend="$cc1"/></p>
<p name="p2"><math extend="$cc2"/></p>
<p name="p3"><math extend="$s"/></p>
<p name="p4"><math extend="$s[1]"/></p>
`);
        // A copied else is an else; a copied case or option holding a text
        // is one of the types the composite can hold.
        expect(await d.texts(["p1"])).eqls({ p1: "2" });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0066", 8],
            ["doenet-e0066", 9],
            ["doenet-e0066", 10],
        ]);
    });

    it("names, then an index, in what a copy copies, decided as for the composite named", async () => {
        const d = await setup(`
<module name="m">
  <select name="s"><option><math>1</math><math>2</math></option></select>
  <repeat name="r" for="1 2" valueName="v"><math>$v</math><math>2</math></repeat>
</module>
<module name="m2" extend="$m"/>
<p name="p1"><math extend="$m2.s[1]"/></p>
<p name="p2"><math extend="$m2.r[1]"/></p>
<p name="p3"><math extend="$m2.s[2]"/></p>
`);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 7],
            ["doenet-e0064", 8],
            ["doenet-w0181", 9],
        ]);
    });

    it("components of one name that are not composites, of different types, are an error", async () => {
        const d = await setup(`
<select name="s"><option><math name="go">1</math></option><option><number name="go">2</number></option></select>
<select name="t"><option><math name="go">1</math></option><option><math name="go">2</math></option></select>
<p name="p1"><math extend="$s.go"/></p>
<p name="p2"><mathList extend="$s.go"/></p>
<p name="p3"><math extend="$t.go"/></p>
`);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0066", 4],
            ["doenet-e0066", 5],
        ]);
        expect(await d.texts(["p3"])).eqls({ p3: "2" });
    });

    it("a list tag made from an index into a repeat holds what an iteration holds", async () => {
        const d = await setup(`
<repeat name="r" for="1 2" valueName="v"><math>$v</math><text>a</text></repeat>
<repeat name="r2" for="1 2" valueName="v"><math>$v</math><math>2</math></repeat>
<p name="p1"><mathList extend="$r[1]"/></p>
<p name="p2"><mathList extend="$r2[2]"/></p>
`);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0066", 4],
        ]);
        expect(await d.texts(["p2"])).eqls({ p2: "2, 2" });
    });

    it("a reference to a list is not decided, as a list written there is not", async () => {
        const d = await setup(`
<mathList name="l">7</mathList>
<group name="g">$l</group>
<p name="p1"><math extend="$g"/></p>
`);
        expect(d.newDiagnostics()).eqls([]);
    });

    it("an index into a collect holds one component of the type it collects", async () => {
        const d = await setup(`
<group name="src"><math>1</math><group><math>2</math><math>3</math></group></group>
<collect name="c" componentType="math" from="$src"/>
<collect name="cg" componentType="group" from="$src"/>
<group name="h">$c[1]</group>
<group name="hg">$cg[1]</group>
<p name="p1"><math extend="$h"/></p>
<p name="p2"><math extend="$hg"/></p>
<p name="p3"><text extend="$h"/></p>
`);
        expect(await d.texts(["p1"])).eqls({ p1: "1" });
        // A math becomes a text; a group collected is not decided.
        expect(d.newDiagnostics()).eqls([]);
    });

    it("a tag written in an index is decided too, and is missing while no case is true", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<mathList name="l">1 2</mathList>
<conditionalContent name="cc"><case condition="$b"><integer>1</integer></case></conditionalContent>
<p name="p">$l[<integer extend="$cc"/>]</p>
`);
        expect(
            d
                .newDiagnostics()
                .filter((x) => x.type === "error")
                .map((x) => [x.code, x.line]),
        ).eqls([]);
    });

    it("a name in what a copied part copies is one the reference can name", async () => {
        const d = await setup(`
<select name="s0"><option name="o"><group name="go"><math>1</math><math>2</math></group></option></select>
<select name="s"><option><group name="go"><math>1</math></group></option><option copy="$o"/></select>
<p name="p1"><math extend="$s.go"/></p>
`);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 4],
        ]);
    });
});

describe("What still changes at run time, without changing what the component is (D36) @group4", () => {
    it("a value that does not convert: the component is missing, with an info, until it does", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="x"/>
<booleanInput name="b"/>
<group name="g"><math>$mi</math></group>
<conditionalContent name="cc"><case condition="$b"><math>(5,6)</math></case><else><math>$mi</math></else></conditionalContent>
<p name="p1"><point name="P" extend="$g"/></p>
<p name="p2"><boolean name="B" extend="$g"/></p>
<p name="p3"><point name="Q" extend="$cc"/></p>
<p name="p5" extend="$p1"/>
`);
        const names = ["p1", "p2", "p3", "p5"];
        expect(await d.texts(names)).eqls({
            p1: "＿",
            p2: "＿",
            p3: "＿",
            p5: "＿",
        });
        for (const name of ["P", "Q"]) {
            expect(await d.typeOf(name), name).eq("point");
        }
        expect(await d.typeOf("B")).eq("boolean");
        expect(d.newDiagnostics()).eqls(
            [
                ["point", "g", 6],
                ["boolean", "g", 7],
                ["point", "cc", 8],
            ].map(([T, x, line]) => ({
                code: "doenet-i0053",
                type: "info",
                line,
                message:
                    T === "point"
                        ? `A \`<point>\` can't be made from \`$${x}\` while its value, x, isn't a tuple of coordinates, so it is missing until it is.`
                        : `A \`<boolean>\` can't be made from \`$${x}\` while its value, x, isn't true or false, so it is missing until it is.`,
            })),
        );

        await d.setMath("mi", "(1,2)");
        expect(await d.texts(names)).eqls({
            p1: "(1, 2)",
            p2: "＿",
            p3: "(1, 2)",
            p5: "(1, 2)",
        });
        expect(await d.typeOf("P")).eq("point");
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-i0053",
                type: "info",
                line: 7,
                message:
                    "A `<boolean>` can't be made from `$g` while its value, (1, 2), isn't true or false, so it is missing until it is.",
            },
        ]);

        // A case of the same type: only the value is checked.
        await d.setBoolean("b", true);
        expect(await d.texts(["p3"])).eqls({ p3: "(5, 6)" });
        await d.move("Q", 7, 8);
        expect(await d.texts(["p3"])).eqls({ p3: "(7, 8)" });

        await d.setMath("mi", "1");
        expect(await d.texts(["p1", "p2", "B"])).eqls({
            p1: "＿",
            p2: "true",
            B: "true",
        });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0053", 6],
        ]);
        expect(d.errors()).eqls([]);
    });

    it("an index that names nothing because of its value: a missing tag with an info, until it names a component again", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<repeat name="r" for="a b" valueName="v"><text>$v</text></repeat>
<mathList name="ml">7 8</mathList>
<p name="p1"><text name="t" extend="$r[$n]"/></p>
<p name="p2"><math name="m" extend="$ml[$n]"/></p>
`);
        expect(await d.texts(["p1", "t", "p2", "m"])).eqls({
            p1: "a",
            t: "a",
            p2: "7",
            m: "7",
        });
        expect(d.newDiagnostics()).eqls([]);

        await d.setMath("n", "3");
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "＿", p2: "＿" });
        expect(await d.typeOf("t")).eq("text");
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-i0054",
                type: "info",
                line: 5,
                message:
                    "`$r[$n]` names nothing now, so this `<text>` is missing until it does.",
            },
            {
                code: "doenet-i0054",
                type: "info",
                line: 6,
                message:
                    "`$ml[$n]` names nothing now, so this `<math>` is missing until it does.",
            },
        ]);

        await d.setMath("n", "2");
        expect(await d.texts(["p1", "t", "p2", "m"])).eqls({
            p1: "b",
            t: "b",
            p2: "8",
            m: "8",
        });
        expect(d.newDiagnostics()).eqls([]);
        expect(
            [...getDiagnosticsByType((await d.core()) as any).infos].map(
                (x: any) => x.code,
            ),
        ).eqls([]);

        // A blank index names nothing, too: the info alone, and no warning
        // that would outlast it.
        await d.setMath("n", "");
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "＿", p2: "＿" });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0054", 5],
            ["doenet-i0054", 6],
        ]);
        await d.setMath("n", "1");
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "a", p2: "7" });
        expect(d.newDiagnostics()).eqls([]);
        const { warnings, infos } = getDiagnosticsByType(
            (await d.core()) as any,
        );
        expect([...warnings, ...infos].map((x: any) => x.code)).eqls([]);
    });

    it("an index that names nothing does not hide an error found when the document loaded", async () => {
        const d = await setup(`
<mathInput name="k"/>
<repeat name="r" for="1 2" valueName="v"><math>$v</math><math>2</math></repeat>
<p name="p"><math extend="$r[$k]"/></p>
`);
        const error = [
            {
                code: "doenet-e0064",
                type: "error",
                line: 4,
                message:
                    "A `<math>` can be made from `$r[$k]` only when it always holds one component, and an iteration of the `<repeat>` holds 2. To read what it holds as one value, write `<math>$r[$k]</math>`.",
            },
        ];
        expect(await d.replacedBy("p")).eqls(["_error"]);
        expect(d.newDiagnostics()).eqls(error);
        for (const k of ["1", "2", "0", ""]) {
            await d.setMath("k", k);
            expect(await d.replacedBy("p"), k).eqls(["_error"]);
            expect(d.newDiagnostics(), k).eqls([]);
        }
        const { infos } = getDiagnosticsByType((await d.core()) as any);
        expect(infos.map((x: any) => x.code)).eqls([]);
    });

    it("an index that names nothing makes the tag missing, without its own children, however the index came to name nothing", async () => {
        const d = await setup(`
<mathInput name="n"/>
<repeat name="r" for="a b" valueName="v"><text>$v</text></repeat>
<p name="p1"><text name="t" extend="$r[$n]">!</text></p>
`);
        const names = ["p1"];
        const steps: [string, string, boolean][] = [
            ["", "＿", true],
            ["1", "a!", false],
            ["", "＿", true],
            ["5", "＿", true],
            ["2", "b!", false],
            ["3", "＿", true],
        ];
        for (const [step, [index, shown, info]] of steps.entries()) {
            if (step > 0) {
                await d.setMath("n", index);
            }
            expect(await d.texts(names), `n=${index}`).eqls({ p1: shown });
            expect(await d.typeOf("t")).eq("text");
            const infos = getDiagnosticsByType((await d.core()) as any).infos;
            expect(
                [...infos].map((x: any) => x.code),
                `n=${index}`,
            ).eqls(info ? ["doenet-i0054"] : []);
        }
    });

    it("an unlinked copy made while its index names nothing is made so again after a reload", async () => {
        const d = await setup(`
<mathInput name="n"/>
<repeat name="r" for="a b" valueName="v"><text>$v</text></repeat>
<p name="p1"><text copy="$r[$n]">!</text></p>
`);
        expect(await d.texts(["p1"])).eqls({ p1: "＿" });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0054", 4],
        ]);
        // A copy stays as it was made.
        await d.setMath("n", "1");
        expect(await d.texts(["p1"])).eqls({ p1: "＿" });

        await d.reload();
        expect(await d.texts(["p1"])).eqls({ p1: "＿" });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0054", 4],
        ]);
    });

    it("an input reached by an index is a missing input while the index names nothing, and the link wins when the iteration returns", async () => {
        const d = await setup(`
<mathInput name="k" prefill="1"/>
<repeat name="r" for="5 6" valueName="v"><mathInput prefill="$v"/></repeat>
<p name="p1"><mathInput name="ex" extend="$r[$k]"/></p>
`);
        /** The value of the input the extend makes. */
        async function exValue() {
            const components = (await d.core()).core!._components as any;
            return (
                await components[await d.resolvePathToNodeIdx("ex")].stateValues
                    .value
            ).toString();
        }
        expect(await d.typeOf("ex")).eq("mathInput");
        expect(await exValue()).eq("5");

        await d.setMath("k", "3");
        expect(await d.typeOf("ex")).eq("mathInput");
        expect(await exValue()).eq("＿");
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0054", 4],
        ]);
        await d.setMath("ex", "9");
        expect(await exValue()).eq("9");

        await d.setMath("k", "2");
        expect(await d.typeOf("ex")).eq("mathInput");
        expect(await exValue()).eq("6");
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("a conditionalContent of one type is made the tag written from it, follows the case and writes back", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><math>(1,2)</math></case>
  <else><math>(3,4)</math></else>
</conditionalContent>
<conditionalContent name="cc2">
  <case condition="$b"><number>3.14159</number></case>
  <else><number>2</number></else>
</conditionalContent>
<graph><point name="P" extend="$cc"/></graph>
<p name="p1">$P</p>
<p name="p2"><math name="m" extend="$cc2" displayDigits="2"/></p>
<p name="p3"><math extend="$cc"/></p>
<p name="p4"><boolean extend="$cc2"/></p>
<p name="p5"><point copy="$cc"/></p>
<p name="p6" extend="$p2"/>
<p name="p7">$cc</p>
`);
        const names = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
        expect(await d.texts(names)).eqls({
            p1: "(3, 4)",
            p2: "2",
            p3: "(3, 4)",
            p4: "true",
            p5: "(3, 4)",
            p6: "2",
            p7: "(3, 4)",
        });
        expect(await d.typeOf("P")).eqls("point");
        expect(await d.typeOf("m")).eqls("math");

        await d.setBoolean("b", true);
        expect(await d.texts(names)).eqls({
            p1: "(1, 2)",
            p2: "3.1",
            p3: "(1, 2)",
            p4: "true",
            // a copy stays as it was made
            p5: "(3, 4)",
            p6: "3.1",
            p7: "(1, 2)",
        });

        // The point is made from the case's math, and moving it changes it.
        await d.move("P", 5, 6);
        expect(await d.texts(["p1", "p3", "p7"])).eqls({
            p1: "(5, 6)",
            p3: "(5, 6)",
            p7: "(5, 6)",
        });

        await d.setBoolean("b", false);
        expect(await d.texts(["p1", "p2", "p7"])).eqls({
            p1: "(3, 4)",
            p2: "2",
            p7: "(3, 4)",
        });
        await d.move("P", 7, 8);
        expect(await d.texts(["p1", "p7"])).eqls({
            p1: "(7, 8)",
            p7: "(7, 8)",
        });

        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p2", "p7"])).eqls({
            p1: "(5, 6)",
            p2: "3.1",
            p7: "(5, 6)",
        });

        await d.reload();
        expect(await d.texts(names)).eqls({
            p1: "(5, 6)",
            p2: "3.1",
            p3: "(5, 6)",
            p4: "true",
            // a copy made again from the case it was made from (#2441)
            p5: "(3, 4)",
            p6: "3.1",
            p7: "(5, 6)",
        });
        expect(await d.typeOf("P")).eqls("point");
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("an extend in what it is of, or extends of each other", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<p name="p1"><conditionalContent name="cc"><case condition="$b"><text extend="$cc"/></case><else><text>x</text><math extend="$cc"/></else></conditionalContent></p>
<p name="p2"><conditionalContent name="c1"><case condition="$b"><math extend="$c2"/></case><else><math>1</math></else></conditionalContent><conditionalContent name="c2"><case condition="$b"><math extend="$c1"/></case><else><math>2</math></else></conditionalContent></p>
<p name="p3"><group name="k1"><math extend="$k2"/></group><group name="k2"><math extend="$k3"/></group><group name="k3"><math extend="$k1"/></group></p>
`);
        // The else of `cc` holds two components, decided when the document
        // loads; the others are circular, as on main, reported once for
        // each cycle.
        expect(await d.texts(["p1", "p2", "p3"])).eqls({
            p1: "x",
            p2: "12",
            p3: "",
        });
        expect(d.errors().sort()).eqls([
            "doenet-e0005",
            "doenet-e0005",
            "doenet-e0064",
        ]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p2", "p3"])).eqls({ p2: "＿", p3: "" });

        await d.setBoolean("b", false);
        expect(await d.texts(["p2"])).eqls({ p2: "12" });
    });

    it("what is shown and what is decided are the same after a reload, in each state", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<mathInput name="mi" prefill="x"/>
<conditionalContent name="cc">
  <case condition="$b"><text>yes</text></case>
  <else><text>no</text></else>
</conditionalContent>
<group name="g"><math>$mi</math></group>
<p name="p1"><text name="t" extend="$cc"/></p>
<p name="p2"><point name="P" extend="$g"/></p>
<p name="p3" extend="$p2"/>
`);
        const names = ["p1", "p2", "p3"];
        const states: [() => Promise<void>, Record<string, string>][] = [
            [async () => {}, { p1: "no", p2: "＿", p3: "＿" }],
            [() => d.setBoolean("b", true), { p1: "yes", p2: "＿", p3: "＿" }],
            [
                () => d.setMath("mi", "(1,2)"),
                { p1: "yes", p2: "(1, 2)", p3: "(1, 2)" },
            ],
            [
                () => d.setBoolean("b", false),
                { p1: "no", p2: "(1, 2)", p3: "(1, 2)" },
            ],
            [() => d.setMath("mi", "y"), { p1: "no", p2: "＿", p3: "＿" }],
        ];
        for (const [change, shown] of states) {
            await change();
            expect(await d.texts(names)).eqls(shown);
            const replaced = [
                await d.replacedBy("p1"),
                await d.replacedBy("p2"),
            ];
            await d.reload();
            expect(await d.texts(names)).eqls(shown);
            expect([await d.replacedBy("p1"), await d.replacedBy("p2")]).eqls(
                replaced,
            );
            // An info is reported again where it lasts.
            expect(d.newDiagnostics().map((x) => x.code)).eqls(
                shown.p2 === "＿" ? ["doenet-i0053"] : [],
            );
            expect(d.errors()).eqls([]);
        }
        // A named extend still names what it shows.
        expect(await d.texts(["t"])).eqls({ t: "no" });
    });
});
