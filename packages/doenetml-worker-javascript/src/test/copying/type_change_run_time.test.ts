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

/** The codes of the diagnostics a type change reports. */
const TYPE_CHANGE_CODES = [
    "doenet-e0062",
    "doenet-e0063",
    "doenet-e0064",
    "doenet-e0065",
    "doenet-i0053",
];

/**
 * A document whose references written as a different tag are decided as
 * what the document makes at run time changes (D26, DIAG-2), and what it
 * shows, saved and reloaded when `reload` is called.
 */
async function setup(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });
    let reported = 0;

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
     * The diagnostics of a type change reported since this was last
     * called, as code, level, line and message.
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
        const added = result.slice(reported);
        reported = result.length;
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
        reported = 0;
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

describe("A reference written as a different tag, of content made at run time (D26, DIAG-2) @group4", () => {
    it("the active case of a conditionalContent: shown while it matches, an info and nothing while it does not", async () => {
        const doc = setup(`
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><point>(1,2)</point></case>
  <else><text>no</text></else>
</conditionalContent>
<p name="p1"><text name="t" extend="$cc"/></p>
<p name="p2"><text copy="$cc"/></p>
<p name="p3">$t</p>
`);
        const d = await doc;
        expect(await d.texts(["p1", "t", "p2", "p3"])).eqls({
            p1: "no",
            t: "no",
            p2: "no",
            p3: "no",
        });
        expect(await d.replacedBy("p1")).eqls(["group"]);
        expect(d.newDiagnostics()).eqls([]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p2", "p3"])).eqls({
            p1: "",
            // a copy stays as it was made
            p2: "no",
            p3: "",
        });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0065",
                type: "info",
                line: 7,
                message:
                    "A `<text>` can't be made from `$cc`, which gives a `<point>` now, so nothing is shown for it. To show it as it is, write `$cc`.",
            },
        ]);

        await d.setBoolean("b", false);
        expect(await d.texts(["p1", "t", "p2", "p3"])).eqls({
            p1: "no",
            t: "no",
            p2: "no",
            p3: "no",
        });
        expect(await d.replacedBy("p1")).eqls(["group"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("how many components a collect holds", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<group name="g" hide><math>x</math><math>y</math></group>
<collect name="c" componentType="math" from="$g" maxNumber="$n"/>
<p name="p1"><math name="mc" extend="$c"/></p>
`);
        expect(await d.texts(["p1", "mc"])).eqls({ p1: "x", mc: "x" });
        expect(await d.replacedBy("p1")).eqls(["math"]);

        await d.setMath("n", "2");
        expect(await d.texts(["p1"])).eqls({ p1: "" });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 5,
                message:
                    "A `<math>` can be made from a `<collect>` only when it holds one component, and `$c` holds 2 now, so nothing is shown for it. To use one of them, write `$c[1]` or name it. To read them all as one value, write `<math>$c</math>`.",
            },
        ]);

        await d.setMath("n", "1");
        expect(await d.texts(["p1", "mc"])).eqls({ p1: "x", mc: "x" });
        expect(await d.replacedBy("p1")).eqls(["math"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("a repeat, a conditionalContent or a select holding several components", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<repeat name="rep" for="1 2" valueName="i"><math>$i</math></repeat>
<conditionalContent name="cc">
  <case condition="$b"><math>a</math><math>b</math></case>
  <else><math>c</math></else>
</conditionalContent>
<select name="s" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select>
<p name="p1"><math extend="$rep"/></p>
<p name="p2"><math name="m2" extend="$cc"/></p>
<p name="p3"><math extend="$s"/></p>
`);
        expect(await d.texts(["p1", "p2", "m2", "p3"])).eqls({
            p1: "",
            p2: "c",
            m2: "c",
            p3: "",
        });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(await d.replacedBy("p3")).eqls([]);
        // An index is suggested where it selects one component.
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 9,
                message:
                    "A `<math>` can be made from a `<repeat>` only when it holds one component, and `$rep` holds 2 now, so nothing is shown for it. To use one of them, write `$rep[1]` or name it. To read them all as one value, write `<math>$rep</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "info",
                line: 11,
                message:
                    "A `<math>` can be made from a `<select>` only when it holds one component, and `$s` holds 2 now, so nothing is shown for it. To use one of them, write `$s[1]` or name it. To read them all as one value, write `<math>$s</math>`.",
            },
        ]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p2"])).eqls({ p2: "" });
        expect(await d.replacedBy("p2")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 10,
                message:
                    "A `<math>` can be made from a `<conditionalContent>` only when it holds one component, and `$cc` holds 2 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$cc</math>`.",
            },
        ]);

        await d.setBoolean("b", false);
        expect(await d.texts(["p2", "m2"])).eqls({ p2: "c", m2: "c" });
        expect(await d.replacedBy("p2")).eqls(["group"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("an iteration, a pick or a case is named by what made it", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<repeat name="rep" for="1" valueName="v">
  <conditionalContent><case condition="$b"><math>$v</math><math>2$v</math></case><else><math>$v</math></else></conditionalContent>
</repeat>
<select name="s">
  <option><conditionalContent><case condition="$b"><math>1</math><math>3</math></case><else><math>1</math></else></conditionalContent></option>
</select>
<conditionalContent name="cc">
  <case condition="$b"><math>a</math><math>b</math></case>
  <else><math>c</math></else>
</conditionalContent>
<p name="p1"><math name="m1" extend="$rep[1]"/></p>
<p name="p2"><math name="m2" extend="$s[1]"/></p>
<p name="p3"><math name="m3" extend="$cc[1]"/></p>
`);
        const shown = { p1: "1", m1: "1", p2: "1", m2: "1", p3: "c", m3: "c" };
        expect(await d.texts(Object.keys(shown))).eqls(shown);
        expect(d.newDiagnostics()).eqls([]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p2", "p3"])).eqls({
            p1: "",
            p2: "",
            p3: "",
        });
        for (const p of ["p1", "p2", "p3"]) {
            expect(await d.replacedBy(p)).eqls([]);
        }
        // No index is suggested: one after an iteration, a pick or a case
        // selects a child of the group it is made as (DIAG-3).
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 13,
                message:
                    "A `<math>` can be made from an iteration of a `<repeat>` only when it holds one component, and `$rep[1]` holds 2 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$rep[1]</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "info",
                line: 14,
                message:
                    "A `<math>` can be made from what a `<select>` picked only when it holds one component, and `$s[1]` holds 2 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$s[1]</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "info",
                line: 15,
                message:
                    "A `<math>` can be made from what a `<conditionalContent>` shows only when it holds one component, and `$cc[1]` holds 2 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$cc[1]</math>`.",
            },
        ]);

        await d.setBoolean("b", false);
        expect(await d.texts(Object.keys(shown))).eqls(shown);
        expect([
            await d.replacedBy("p1"),
            await d.replacedBy("p2"),
            await d.replacedBy("p3"),
        ]).eqls([["group"], ["group"], ["math"]]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("the messages for an iteration or a pick holding nothing, for iterations holding several, and for an input or a container in what a conditionalContent shows", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<repeat name="rep" for="1" valueName="v"><conditionalContent><case condition="$b"><math>$v</math></case></conditionalContent></repeat>
<select name="s"><option><conditionalContent><case condition="$b"><math>1</math></case></conditionalContent></option></select>
<repeat name="rep2" for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat>
<conditionalContent name="cc">
  <case condition="$b"><p>hello</p></case>
  <else><math>x</math></else>
</conditionalContent>
<p name="p1"><math name="m1" extend="$rep[1]"/></p>
<p name="p2"><math name="m2" extend="$s[1]"/></p>
<p name="p3"><math extend="$rep2"/></p>
<p name="p4"><mathInput extend="$cc"/></p>
<p name="p5"><text extend="$cc"/></p>
`);
        expect(await d.texts(["p1", "p2", "p3"])).eqls({
            p1: "",
            p2: "",
            p3: "",
        });
        for (const p of ["p1", "p2", "p3", "p4"]) {
            expect(await d.replacedBy(p)).eqls([]);
        }
        // No index is suggested for `$rep2`, whose iterations each hold two
        // components. In what a conditionalContent shows, an input from a
        // value and a container as a value tag are not given the forms that
        // name the source (`doenet-e0062`, `doenet-e0063`).
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 10,
                message:
                    "A `<math>` can't be made from `$rep[1]`, an iteration of a `<repeat>` that holds nothing now, so nothing is shown for it.",
            },
            {
                code: "doenet-e0064",
                type: "info",
                line: 11,
                message:
                    "A `<math>` can't be made from `$s[1]`, what a `<select>` picked that holds nothing now, so nothing is shown for it.",
            },
            {
                code: "doenet-e0064",
                type: "info",
                line: 12,
                message:
                    "A `<math>` can be made from a `<repeat>` only when it holds one component, and `$rep2` holds 4 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$rep2</math>`.",
            },
            {
                code: "doenet-e0065",
                type: "info",
                line: 13,
                message:
                    "A `<mathInput>` can't be made from `$cc`, which gives a `<math>` now, so nothing is shown for it. To show it as it is, write `$cc`.",
            },
        ]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "m1", "p2", "m2"])).eqls({
            p1: "1",
            m1: "1",
            p2: "1",
            m2: "1",
        });
        expect(await d.replacedBy("p4")).eqls([]);
        expect(await d.replacedBy("p5")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0065",
                type: "info",
                line: 13,
                message:
                    "A `<mathInput>` can't be made from `$cc`, which gives a `<p>` now, so nothing is shown for it. To show it as it is, write `$cc`.",
            },
            {
                code: "doenet-e0065",
                type: "info",
                line: 14,
                message:
                    "A `<text>` can't be made from `$cc`, which gives a `<p>` now, so nothing is shown for it. To show it as it is, write `$cc`.",
            },
        ]);
        expect(d.errors()).eqls([]);
    });

    it("a list the document makes holding several entries", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<selectFromSequence name="sfs" from="1" to="9" numToSelect="2"/>
<sequence name="seq" to="$n"/>
<p name="p1"><number extend="$sfs"/></p>
<p name="p2"><number name="n2" extend="$seq"/></p>
`);
        expect(await d.texts(["p1", "p2", "n2"])).eqls({
            p1: "",
            p2: "1",
            n2: "1",
        });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(await d.replacedBy("p2")).eqls(["number"]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 5,
                message:
                    "A `<number>` can be made from a `<selectFromSequence>` only when it holds one component, and `$sfs` holds 2 now, so nothing is shown for it. To use one of them, write `$sfs[1]` or name it. To read them all as one value, write `<number>$sfs</number>`.",
            },
        ]);

        await d.setMath("n", "2");
        expect(await d.texts(["p2"])).eqls({ p2: "" });
        expect(await d.replacedBy("p2")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 6,
                message:
                    "A `<number>` can be made from a `<sequence>` only when it holds one component, and `$seq` holds 2 now, so nothing is shown for it. To use one of them, write `$seq[1]` or name it. To read them all as one value, write `<number>$seq</number>`.",
            },
        ]);

        await d.setMath("n", "1");
        expect(await d.texts(["p2", "n2"])).eqls({ p2: "1", n2: "1" });
        expect(await d.replacedBy("p2")).eqls(["number"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("the list form of a collect or a sort holds entries of the type it collects or sorts", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<group name="g" hide><math>(1,2)</math><math>(5,6)</math></group>
<collect name="c" componentType="math" from="$g" maxNumber="$n"/>
<group name="gp" hide><point>(3,4)</point><point>(7,8)</point></group>
<collect name="cp" componentType="point" from="$gp" maxNumber="$n"/>
<sort name="s"><math>(9,10)</math></sort>
<p name="p1"><point extend="$c"/></p>
<p name="p2"><vector extend="$cp"/></p>
<p name="p3"><point extend="$s"/></p>
`);
        const one = { p1: "(1, 2)", p2: "(3, 4)", p3: "(9, 10)" };
        expect(await d.texts(Object.keys(one))).eqls(one);
        expect(await d.replacedBy("p1")).eqls(["point"]);
        expect(await d.replacedBy("p2")).eqls(["vector"]);
        expect(await d.replacedBy("p3")).eqls(["point"]);
        expect(d.newDiagnostics()).eqls([]);

        await d.setMath("n", "2");
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "", p2: "" });
        expect(d.newDiagnostics().map((x) => [x.code, x.type, x.line])).eqls([
            ["doenet-e0064", "info", 8],
            ["doenet-e0064", "info", 9],
        ]);

        await d.setMath("n", "1");
        expect(await d.texts(Object.keys(one))).eqls(one);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("the value of a math in a group", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="x"/>
<group name="g"><math>$mi</math></group>
<p name="p1"><point name="P" extend="$g"/></p>
<p name="p2"><boolean name="B" extend="$g"/></p>
`);
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "", p2: "" });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(await d.replacedBy("p2")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-i0053",
                type: "info",
                line: 4,
                message:
                    "A `<point>` can't be made from `$g` while its value, x, isn't a tuple of coordinates, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 5,
                message:
                    "A `<boolean>` can't be made from `$g` while its value, x, isn't true or false, so nothing is shown for it.",
            },
        ]);

        await d.setMath("mi", "(1,2)");
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "(1, 2)", p2: "" });
        expect(await d.typeOf("P")).eq("point");
        expect(await d.replacedBy("p1")).eqls(["point"]);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0053", 5],
        ]);

        await d.setMath("mi", "1");
        expect(await d.texts(["p1", "p2", "B"])).eqls({
            p1: "",
            p2: "true",
            B: "true",
        });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(await d.replacedBy("p2")).eqls(["boolean"]);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0053", 4],
        ]);

        await d.setMath("mi", "(3,4)");
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "(3, 4)", p2: "" });
        expect(await d.typeOf("P")).eq("point");
        expect(d.errors()).eqls([]);
    });

    it("the value of the one entry of a list the document makes, as it changes", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="x"/>
<mathInput name="n" prefill="1"/>
<sort name="s"><math>$mi</math></sort>
<group name="g" hide><math>$mi</math></group>
<collect name="c" componentType="math" from="$g"/>
<sequence name="sq" type="math" from="$mi" length="$n"/>
<p name="p1"><point name="P" extend="$s"/></p>
<p name="p2"><boolean name="B" extend="$c"/></p>
<p name="p3"><vector extend="$sq"/></p>
<p name="p4"><point copy="$s"/></p>
`);
        const names = ["p1", "p2", "p3", "p4"];
        expect(await d.texts(names)).eqls({ p1: "", p2: "", p3: "", p4: "" });
        for (const name of names) {
            expect(await d.replacedBy(name)).eqls([]);
        }
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-i0053",
                type: "info",
                line: 8,
                message:
                    "A `<point>` can't be made from `$s` while its value, x, isn't a tuple of coordinates, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 9,
                message:
                    "A `<boolean>` can't be made from `$c` while its value, x, isn't true or false, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 10,
                message:
                    "A `<vector>` can't be made from `$sq` while its value, x, isn't a tuple of coordinates, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 11,
                message:
                    "A `<point>` can't be made from `$s` while its value, x, isn't a tuple of coordinates, so nothing is shown for it.",
            },
        ]);

        await d.setMath("mi", "(1,2)");
        expect(await d.texts(names)).eqls({
            p1: "(1, 2)",
            p2: "",
            p3: "(1, 2)",
            // a copy stays as it was made
            p4: "",
        });
        expect(await d.typeOf("P")).eq("point");
        expect(await d.replacedBy("p1")).eqls(["point"]);
        expect(await d.replacedBy("p3")).eqls(["vector"]);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0053", 9],
        ]);

        await d.setMath("mi", "1");
        expect(await d.texts(names)).eqls({
            p1: "",
            p2: "true",
            p3: "",
            p4: "",
        });
        expect(await d.texts(["B"])).eqls({ B: "true" });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(await d.replacedBy("p2")).eqls(["boolean"]);
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-i0053", 8],
            ["doenet-i0053", 10],
        ]);

        // how many entries the list holds is decided as before
        await d.setMath("n", "2");
        expect(await d.texts(["p3"])).eqls({ p3: "" });
        expect(d.newDiagnostics().map((x) => [x.code, x.line])).eqls([
            ["doenet-e0064", 10],
        ]);
        await d.setMath("mi", "(3,4)");
        await d.setMath("n", "1");
        expect(await d.texts(names)).eqls({
            p1: "(3, 4)",
            p2: "",
            p3: "(3, 4)",
            p4: "",
        });
        expect(await d.replacedBy("p3")).eqls(["vector"]);
        expect(d.errors()).eqls([]);
    });

    it("a pick holding a repeatForSequence whose length changes", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="1"/>
<select name="s"><option><repeatForSequence length="$mi"><text>a</text></repeatForSequence></option></select>
<p name="p1"><text name="t" extend="$s[1]"/></p>
`);
        expect(await d.texts(["p1", "t"])).eqls({ p1: "a", t: "a" });
        expect(await d.replacedBy("p1")).eqls(["text"]);

        await d.setMath("mi", "2");
        expect(await d.texts(["p1"])).eqls({ p1: "" });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 4,
                message:
                    "A `<text>` can be made from what a `<select>` picked only when it holds one component, and `$s[1]` holds 2 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<text>$s[1]</text>`.",
            },
        ]);

        await d.setMath("mi", "1");
        expect(await d.texts(["p1", "t"])).eqls({ p1: "a", t: "a" });
        expect(await d.replacedBy("p1")).eqls(["text"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("a group holding a conditionalContent whose case changes type or count", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<group name="g"><conditionalContent><case condition="$b"><text>a</text><text>b</text></case><else><text>c</text></else></conditionalContent></group>
<group name="h"><conditionalContent><case condition="$b"><point>(1,2)</point></case><else><text>c</text></else></conditionalContent></group>
<p name="p1"><text name="t1" extend="$g"/></p>
<p name="p2"><text name="t2" extend="$h"/></p>
`);
        const shown = { p1: "c", t1: "c", p2: "c", t2: "c" };
        expect(await d.texts(Object.keys(shown))).eqls(shown);
        expect(d.newDiagnostics()).eqls([]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "", p2: "" });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(await d.replacedBy("p2")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 5,
                message:
                    "A `<text>` can be made from a `<group>` only when it holds one component, and `$g` holds 2 now, so nothing is shown for it. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<text>$g</text>`.",
            },
            {
                code: "doenet-e0065",
                type: "info",
                line: 6,
                message:
                    "A `<text>` can't be made from `$h`, which gives a `<point>` now, so nothing is shown for it. To show it as it is, write `$h`.",
            },
        ]);

        await d.setBoolean("b", false);
        expect(await d.texts(Object.keys(shown))).eqls(shown);
        expect(await d.replacedBy("p1")).eqls(["group"]);
        expect(await d.replacedBy("p2")).eqls(["group"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("a group holding an entry of a list selected by an index past its end", async () => {
        const d = await setup(`
<mathInput name="n" prefill="1"/>
<mathList name="ml">7 8</mathList>
<group name="g2">$ml[$n]</group>
<p name="p1"><math name="m" extend="$g2"/></p>
`);
        expect(await d.texts(["p1", "m"])).eqls({ p1: "7", m: "7" });

        await d.setMath("n", "5");
        expect(await d.texts(["p1"])).eqls({ p1: "" });
        expect(await d.replacedBy("p1")).eqls([]);
        expect(d.newDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 5,
                message:
                    "A `<math>` can't be made from `$g2`, a `<group>` that holds nothing now, so nothing is shown for it.",
            },
        ]);

        await d.setMath("n", "2");
        expect(await d.texts(["p1", "m"])).eqls({ p1: "8", m: "8" });
        expect(await d.replacedBy("p1")).eqls(["_copy"]);
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });
});

describe("Deciding again as content made at run time changes @group4", () => {
    it("a chain of extends, each of a group holding the one before, follows what the first holds", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<group name="g0"><conditionalContent><case condition="$b"><math>1</math></case><else><text>a</text><text>b</text></else></conditionalContent></group>
<group name="g1"><math extend="$g0"/></group>
<group name="g2"><math extend="$g1"/></group>
<p name="p1"><math extend="$g1"/></p>
<p name="p2"><math name="m2" extend="$g2"/></p>
<p name="p3">$g2</p>
<p name="p4" extend="$p2"/>
`);
        const nothing = { p1: "", p2: "", p3: "", p4: "" };
        const one = { p1: "1", p2: "1", m2: "1", p3: "1", p4: "1" };
        expect(await d.texts(Object.keys(nothing))).eqls(nothing);
        // Each says why it shows nothing, as an info: what it is of is made
        // at run time.
        expect(d.newDiagnostics().map((x) => [x.code, x.type, x.line])).eqls([
            ["doenet-e0064", "info", 4],
            ["doenet-e0064", "info", 5],
            ["doenet-e0064", "info", 6],
            ["doenet-e0064", "info", 7],
        ]);

        for (let i = 0; i < 2; i++) {
            await d.setBoolean("b", true);
            expect(await d.texts(Object.keys(one))).eqls(one);
            expect(await d.replacedBy("p2")).eqls(["_copy"]);

            await d.setBoolean("b", false);
            expect(await d.texts(Object.keys(nothing))).eqls(nothing);
            expect(await d.replacedBy("p2")).eqls([]);
        }
        expect(d.errors()).eqls([]);
    });

    it("a copy of a group holding an extend of content made at run time is content made at run time too", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<group name="g0"><conditionalContent><case condition="$b"><math>1</math></case><else><text>a</text><text>b</text></else></conditionalContent></group>
<group name="g1"><math extend="$g0"/></group>
<group name="g2" extend="$g1"/>
<group name="g3">$g1</group>
<p name="p1"><math extend="$g2"/></p>
<p name="p2"><math extend="$g3"/></p>
`);
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "", p2: "" });
        // Not an error: what `g2` and `g3` hold is made at run time.
        expect(d.newDiagnostics().map((x) => [x.code, x.type, x.line])).eqls([
            ["doenet-e0064", "info", 4],
            ["doenet-e0064", "info", 7],
            ["doenet-e0064", "info", 8],
        ]);

        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "1", p2: "1" });

        await d.setBoolean("b", false);
        expect(await d.texts(["p1", "p2"])).eqls({ p1: "", p2: "" });
        expect(d.errors()).eqls([]);
    });

    it("a copy of the content holding an extend that shows nothing for now follows it", async () => {
        const d = await setup(`
<mathInput name="mi" prefill="x"/>
<group name="h0"><math>$mi</math></group>
<group name="h1"><point name="q" extend="$h0"/></group>
<p name="p1"><point extend="$h1"/></p>
<p name="p2">$h1</p>
<p name="p3">$q</p>
<graph name="gr"><point extend="$h0"/></graph>
<graph name="gr2" extend="$gr"/>
<p name="pp"><point extend="$h0"/></p>
<p name="p4" extend="$pp"/>
`);
        const names = ["p1", "p2", "p3", "p4"];
        const nothing = { p1: "", p2: "", p3: "", p4: "" };
        expect(await d.texts(names)).eqls(nothing);

        for (const [value, text] of [
            ["(1,2)", "(1, 2)"],
            ["y", ""],
            ["(3,4)", "(3, 4)"],
            ["1", ""],
        ]) {
            await d.setMath("mi", value);
            expect(await d.texts(names)).eqls({
                p1: text,
                p2: text,
                p3: text,
                p4: text,
            });
        }
        expect(d.errors()).eqls([]);
    });

    it("an extend in what it is of, or extends of each other, load with a circular dependency as on main", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<p name="p1"><conditionalContent name="cc"><case condition="$b"><text extend="$cc"/></case><else><text>x</text><math extend="$cc"/></else></conditionalContent></p>
<p name="p2"><conditionalContent name="c1"><case condition="$b"><math extend="$c2"/></case><else><math>1</math></else></conditionalContent><conditionalContent name="c2"><case condition="$b"><math extend="$c1"/></case><else><math>2</math></else></conditionalContent></p>
<p name="p3"><group name="k1"><math extend="$k2"/></group><group name="k2"><math extend="$k3"/></group><group name="k3"><math extend="$k1"/></group></p>
`);
        expect(await d.texts(["p1", "p2", "p3"])).eqls({
            p1: "x",
            p2: "12",
            p3: "＿",
        });
        expect(d.errors()).eqls([
            "doenet-e0005",
            "doenet-e0005",
            "doenet-e0005",
        ]);

        // On main, the two conditionalContents showing extends of each
        // other made the update throw.
        await d.setBoolean("b", true);
        expect(await d.texts(["p1", "p2", "p3"])).eqls({
            p1: "",
            p2: "",
            p3: "＿",
        });

        await d.setBoolean("b", false);
        expect(await d.texts(["p2"])).eqls({ p2: "12" });
    });

    it("a conditionalContent whose active case holds one component of a related type is made the tag written from it, follows the case and writes back", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><math>(1,2)</math></case>
  <else><vector>(3,4)</vector></else>
</conditionalContent>
<conditionalContent name="cc2">
  <case condition="$b"><number>3.14159</number></case>
  <else><text>y</text></else>
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
            p2: "y",
            p3: "(3, 4)",
            p4: "false",
            p5: "(3, 4)",
            p6: "y",
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
            p2: "y",
            p7: "(3, 4)",
        });
        // and moving it changes the vector of the other case
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
            // a copy made again from what the case holds now
            p5: "(5, 6)",
            p6: "3.1",
            p7: "(5, 6)",
        });
        expect(await d.typeOf("P")).eqls("point");
        expect(d.newDiagnostics()).eqls([]);
        expect(d.errors()).eqls([]);
    });

    it("a select, a repeat and a group holding a conditionalContent of one component of a related type are made the tag written from it", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<mathInput name="n" prefill="1"/>
<select name="s"><option><math>(1,2)</math></option></select>
<select name="s2"><option><number>4</number></option></select>
<selectFromSequence name="sfs" from="5" to="5"/>
<repeatForSequence name="r" length="$n"><math>(3,4)</math></repeatForSequence>
<repeat name="r2" for="1" valueName="v"><math>($v,2)</math></repeat>
<group name="g">
  <conditionalContent>
    <case condition="$b"><math>(5,6)</math></case>
    <else><text>no</text></else>
  </conditionalContent>
</group>
<graph>
  <point name="Ps" extend="$s"/>
  <point name="Pr" extend="$r"/>
  <point name="Pr2" extend="$r2"/>
  <point name="Pg" extend="$g"/>
</graph>
<p name="p1">$Ps</p>
<p name="p2"><math extend="$s2"/></p>
<p name="p3"><number extend="$sfs"/></p>
<p name="p4">$Pr</p>
<p name="p5">$Pr2</p>
<p name="p6">$Pg</p>
`);
        const names = ["p1", "p2", "p3", "p4", "p5", "p6"];
        expect(await d.texts(names)).eqls({
            p1: "(1, 2)",
            p2: "4",
            p3: "5",
            p4: "(3, 4)",
            p5: "(1, 2)",
            p6: "",
        });
        expect(d.newDiagnostics().map((x) => x.code)).eqls(["doenet-e0065"]);

        await d.setBoolean("b", true);
        await d.setMath("n", "2");
        expect(await d.texts(["p4", "p6"])).eqls({ p4: "", p6: "(5, 6)" });
        expect(d.newDiagnostics().map((x) => x.code)).eqls(["doenet-e0064"]);
        await d.setMath("n", "1");
        expect(await d.texts(["p4"])).eqls({ p4: "(3, 4)" });

        await d.move("Ps", 1, 1);
        await d.move("Pr", 2, 2);
        await d.move("Pr2", 3, 3);
        await d.move("Pg", 4, 4);
        expect(await d.texts(names)).eqls({
            p1: "(1, 1)",
            p2: "4",
            p3: "5",
            p4: "(2, 2)",
            p5: "(3, 3)",
            p6: "(4, 4)",
        });

        await d.setBoolean("b", false);
        expect(await d.texts(["p6"])).eqls({ p6: "" });
        await d.setBoolean("b", true);
        expect(await d.texts(["p6"])).eqls({ p6: "(4, 4)" });

        await d.reload();
        expect(await d.texts(names)).eqls({
            p1: "(1, 1)",
            p2: "4",
            p3: "5",
            p4: "(2, 2)",
            p5: "(3, 3)",
            p6: "(4, 4)",
        });
        expect(d.errors()).eqls([]);
    });

    it("what is shown and what is decided are the same after a reload, in each state", async () => {
        const d = await setup(`
<booleanInput name="b"/>
<mathInput name="mi" prefill="x"/>
<conditionalContent name="cc">
  <case condition="$b"><point>(1,2)</point></case>
  <else><text>no</text></else>
</conditionalContent>
<group name="g"><math>$mi</math></group>
<p name="p1"><text name="t" extend="$cc"/></p>
<p name="p2"><point name="P" extend="$g"/></p>
<p name="p3" extend="$p2"/>
`);
        const names = ["p1", "p2", "p3"];
        const states: [() => Promise<void>, Record<string, string>][] = [
            [async () => {}, { p1: "no", p2: "", p3: "" }],
            [() => d.setBoolean("b", true), { p1: "", p2: "", p3: "" }],
            [
                () => d.setMath("mi", "(1,2)"),
                { p1: "", p2: "(1, 2)", p3: "(1, 2)" },
            ],
            [
                () => d.setBoolean("b", false),
                { p1: "no", p2: "(1, 2)", p3: "(1, 2)" },
            ],
            [() => d.setMath("mi", "y"), { p1: "no", p2: "", p3: "" }],
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
                [
                    shown.p1 === "" && "doenet-e0065",
                    shown.p2 === "" && "doenet-i0053",
                ].filter(Boolean),
            );
            expect(d.errors()).eqls([]);
        }
        // A named extend still names what it shows.
        expect(await d.texts(["t"])).eqls({ t: "no" });
    });
});
