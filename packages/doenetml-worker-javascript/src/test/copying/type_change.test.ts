import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
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

async function setup(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const diagnostics = getDiagnosticsByType(core);

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

    /** The diagnostics of a type change, as code, level and line. */
    function typeChangeDiagnostics() {
        return [
            ...diagnostics.errors,
            ...diagnostics.warnings,
            ...diagnostics.infos,
        ]
            .filter((d: any) => TYPE_CHANGE_CODES.includes(d.code))
            .map((d: any) => ({
                code: d.code,
                type: d.type,
                line: d.position?.start.line,
                message: d.message,
            }));
    }

    return { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics };
}

describe("A copy of a <sort> reads the text written in it as its own type (#2414) @group4", () => {
    it("type on a copy of a sort", async () => {
        const { texts } = await setup(`
<p name="ps"><sort name="s">10 3 1</sort></p>
<p name="p1"><sort copy="$s" type="text"/></p>
<p name="p2"><sort type="text">10 3 1</sort></p>
<p name="p3"><sort copy="$s"/></p>
<p name="p4"><sort copy="$s" type="number"/></p>
`);
        expect(await texts(["ps", "p1", "p2", "p3", "p4"])).eqls({
            ps: "1, 3, 10",
            p1: "1, 10, 3",
            p2: "1, 10, 3",
            p3: "1, 3, 10",
            p4: "1, 3, 10",
        });
    });

    it("type on a copy of a sort made by an extend", async () => {
        const { texts } = await setup(`
<group name="A"><group name="g"><sort name="s">10 3 1</sort></group></group>
<group name="B"><group name="gB" extend="$A.g"/></group>
<p name="p1"><sort copy="$B.gB.s" type="text"/></p>
`);
        expect(await texts(["p1"])).eqls({ p1: "1, 10, 3" });
    });

    it("references beside the text keep their place", async () => {
        const { texts } = await setup(`
<number name="x">5</number>
<number name="y">20</number>
<p name="ps"><sort name="s">10 $x 3 1</sort></p>
<p name="p1"><sort copy="$s" type="text"/></p>
<p name="pt"><sort name="t" type="text">$x 10 3 $y</sort></p>
<p name="p2"><sort copy="$t" type="number"/></p>
`);
        expect(await texts(["ps", "p1", "pt", "p2"])).eqls({
            ps: "1, 3, 5, 10",
            p1: "1, 10, 3, 5",
            pt: "10, 20, 3, 5",
            p2: "3, 5, 10, 20",
        });
    });

    it("a sort of text read as numbers by a copy", async () => {
        const { texts } = await setup(`
<p name="ps"><sort name="s" type="text">10 3 1</sort></p>
<p name="p1"><sort copy="$s" type="number"/></p>
`);
        expect(await texts(["ps", "p1"])).eqls({
            ps: "1, 10, 3",
            p1: "1, 3, 10",
        });
    });
});

describe("A reference written as a different tag is allowed only between related types (D26) @group4", () => {
    const SOURCES = `
<setup>
  <text name="t5">5</text>
  <math name="m">x+1</math>
  <math name="tup">(5,6)</math>
  <number name="n3">3</number>
  <boolean name="bt">true</boolean>
  <vector name="v">(1,2)</vector>
  <point name="P">(3,4)</point>
  <group name="g1"><text>one</text></group>
  <group name="gm"><math>y</math></group>
  <group name="g2"><math>a</math><math>b</math></group>
  <select name="sel"><option><number>7</number></option></select>
  <repeat name="rep" for="1 2" valueName="i"><math>$i</math></repeat>
  <selectFromSequence name="sfs" from="4" to="4"/>
  <substitute name="sub" type="math" match="b" replacement="a">b+1</substitute>
  <line name="l1" through="(0,0) (1,0)"/>
  <line name="l2" through="(0,0) (0,1)"/>
  <intersection name="i">$l1 $l2</intersection>
  <group name="gc" hide><math>x</math></group>
  <collect name="c" componentType="math" from="$gc"/>
  <sort name="srt"><math>3</math></sort>
  <conditionalContent name="cc"><case condition="false"><math>1</math></case><else><text>no</text></else></conditionalContent>
  <mathList name="ml">1 2</mathList>
</setup>
<p name="sp">hello <math>x</math></p>
<section name="sec"><p>hi</p></section>
<mathInput name="mi" prefill="2"/>
`;

    it("between related types and from a composite that stands for one component", async () => {
        const allowed: Record<string, [string, string]> = {
            numberFromText: [`<number extend="$t5"/>`, "5"],
            textFromMath: [`<text extend="$m"/>`, "x + 1"],
            mathFromNumber: [`<math extend="$n3"/>`, "3"],
            booleanFromNumber: [`<boolean extend="$n3"/>`, "true"],
            textFromBoolean: [`<text extend="$bt"/>`, "true"],
            pointFromVector: [`<point extend="$v"/>`, "(1, 2)"],
            vectorFromPoint: [`<vector extend="$P"/>`, "(3, 4)"],
            coordsFromVector: [`<coords extend="$v"/>`, "(1, 2)"],
            mathFromPoint: [`<math extend="$P"/>`, "(3, 4)"],
            pointFromTuple: [`<point extend="$tup"/>`, "(5, 6)"],
            mathFromInput: [`<math extend="$mi"/>`, "2"],
            numberFromInput: [`<number extend="$mi"/>`, "2"],
            textFromGroup: [`<text extend="$g1"/>`, "one"],
            mathFromGroup: [`<math extend="$gm"/>`, "y"],
            numberFromSelect: [`<number extend="$sel"/>`, "7"],
            mathFromIteration: [`<math extend="$rep[1]"/>`, "1"],
            numberFromSelectFromSequence: [`<number extend="$sfs"/>`, "4"],
            mathFromSubstitute: [`<math extend="$sub"/>`, "a + 1"],
            pointFromIntersection: [`<point extend="$i"/>`, "(0, 0)"],
            mathFromCollect: [`<math extend="$c"/>`, "x"],
            mathFromSort: [`<math extend="$srt"/>`, "3"],
            textFromConditionalContent: [`<text extend="$cc"/>`, "no"],
            textCopyFromGroup: [`<text copy="$g1"/>`, "one"],
            numberCopyFromSelect: [`<number copy="$sel"/>`, "7"],
            mathCopyFromPoint: [`<math copy="$P"/>`, "(3, 4)"],
            textCopyFromConditionalContent: [`<text copy="$cc"/>`, "no"],
            pointCopyFromTuple: [`<point copy="$tup"/>`, "(5, 6)"],
        };
        const { texts, typeChangeDiagnostics } = await setup(
            SOURCES +
                Object.entries(allowed)
                    .map(([name, [tag]]) => `<p name="${name}">${tag}</p>`)
                    .join("\n"),
        );

        expect(await texts(Object.keys(allowed))).eqls(
            Object.fromEntries(
                Object.entries(allowed).map(([name, [, text]]) => [name, text]),
            ),
        );
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("any other pair is an error, located on the reference, shown in its place", async () => {
        const doenetML = `<p name="before">before</p>
<p name="sp">hello <math>x</math></p>
<section name="sec"><p>hi</p></section>
<math name="m">x+1</math>
<text name="t">5</text>
<point name="P">(3,4)</point>
<group name="g2"><math>a</math><math>b</math></group>
<mathList name="ml">1 2</mathList>
<p name="textFromP"><text extend="$sp"/></p>
<p name="textCopyFromP"><text copy="$sp"/></p>
<p name="mathFromSection"><math extend="$sec"/></p>
<p name="mathInputFromMath"><mathInput extend="$m"/></p>
<p name="choiceInputFromText"><choiceInput extend="$t"/></p>
<p name="mathFromGroupOfTwo"><math extend="$g2"/></p>
<p name="textFromGroupOfTwo"><text extend="$g2"/></p>
<p name="textFromPoint"><text extend="$P"/></p>
<p name="pointFromText"><point copy="$t"/></p>
<p name="mathFromList"><math extend="$ml"/></p>
<p name="after">after</p>
`;
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(doenetML);

        const names = [
            "textFromP",
            "textCopyFromP",
            "mathFromSection",
            "mathInputFromMath",
            "choiceInputFromText",
            "mathFromGroupOfTwo",
            "textFromGroupOfTwo",
            "textFromPoint",
            "pointFromText",
            "mathFromList",
        ];
        const shown = await texts(["before", "after", ...names]);
        expect(shown.before).eq("before");
        expect(shown.after).eq("after");
        for (const name of names) {
            expect(shown[name], name).eq("");
        }

        // The error is shown in place of the reference.
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of names) {
            const children =
                stateVariables[await resolvePathToNodeIdx(name)].activeChildren;
            expect(
                children.map(
                    (child: any) =>
                        stateVariables[child.componentIdx].componentType,
                ),
                name,
            ).eqls(["_error"]);
        }

        const lines = doenetML.split("\n");
        const lineOf = (name: string) =>
            lines.findIndex((line) => line.includes(`name="${name}"`)) + 1;

        expect(typeChangeDiagnostics()).eqls([
            {
                code: "doenet-e0063",
                type: "error",
                line: lineOf("textFromP"),
                message:
                    "A `<text>` can't be made from `$sp`, a `<p>` holding other content. To use its text, write `$sp.text`.",
            },
            {
                code: "doenet-e0063",
                type: "error",
                line: lineOf("textCopyFromP"),
                message:
                    "A `<text>` can't be made from `$sp`, a `<p>` holding other content. To use its text, write `$sp.text`.",
            },
            {
                code: "doenet-e0063",
                type: "error",
                line: lineOf("mathFromSection"),
                message:
                    "A `<math>` can't be made from `$sec`, a `<section>` holding other content. To use its text, write `$sec.text`.",
            },
            {
                code: "doenet-e0062",
                type: "error",
                line: lineOf("mathInputFromMath"),
                message:
                    'A `<mathInput>` can\'t be made from `$m`, a `<math>`: an input isn\'t the same thing as its value. To edit `$m`, write `<mathInput bindValueTo="$m"/>`. To start from its value, write `<mathInput prefill="$m"/>`.',
            },
            {
                code: "doenet-e0062",
                type: "error",
                line: lineOf("choiceInputFromText"),
                message:
                    "A `<choiceInput>` can't be made from `$t`, a `<text>`: an input isn't the same thing as its value. To edit `$t`, write `<choiceInput bindValueTo=\"$t\"/>`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: lineOf("mathFromGroupOfTwo"),
                message:
                    "A `<math>` can be made from a `<group>` only when it holds one component, and `$g2` holds 2. To use one of them, write `$g2[1]` or name it. To read them all as one value, write `<math>$g2</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: lineOf("textFromGroupOfTwo"),
                message:
                    "A `<text>` can be made from a `<group>` only when it holds one component, and `$g2` holds 2. To use one of them, write `$g2[1]` or name it. To read them all as one value, write `<text>$g2</text>`.",
            },
            {
                code: "doenet-e0065",
                type: "error",
                line: lineOf("textFromPoint"),
                message:
                    "A `<text>` can't be made from `$P`, which gives a `<point>`. To show it as it is, write `$P`.",
            },
            {
                code: "doenet-e0065",
                type: "error",
                line: lineOf("pointFromText"),
                message:
                    "A `<point>` can't be made from `$t`, which gives a `<text>`. To show it as it is, write `$t`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: lineOf("mathFromList"),
                message:
                    "A `<math>` can be made from a `<mathList>` only when it holds one component, and `$ml` holds 2. To use one of them, write `$ml[1]` or name it. To read them all as one value, write `<math>$ml</math>`.",
            },
        ]);
    });

    it("a collect copied from a conditionalContent is an error (#2415)", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<booleanInput name="b"/>
<group name="G">
  <conditionalContent name="cc">
    <case condition="$b"><text>yes</text></case>
    <else><text>no</text></else>
  </conditionalContent>
</group>
<p name="p1"><collect copy="$G.cc"/></p>
<p name="p2"><text copy="$G.cc"/></p>
<p name="p3"><conditionalContent copy="$G.cc"/></p>
<p name="p4"><text extend="$G.cc"/></p>
`);
        expect(await texts(["p1", "p2", "p3", "p4"])).eqls({
            p1: "",
            p2: "no",
            p3: "no",
            p4: "no",
        });
        expect(typeChangeDiagnostics()).eqls([
            {
                code: "doenet-e0065",
                type: "error",
                line: 9,
                message:
                    "A `<collect>` can't be made from `$G.cc`, which gives a `<conditionalContent>`. To show it as it is, write `$G.cc`.",
            },
        ]);
        // No longer the warning that blamed a missing source.
        expect(
            getDiagnosticsByType(core).warnings.filter(
                (d: any) => d.code === "doenet-w0072",
            ),
        ).eqls([]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        // The copy `p2` is a snapshot of the text; the copy `p3` is a new
        // conditionalContent, with its own cases.
        expect(await texts(["p1", "p2", "p3", "p4"])).eqls({
            p1: "",
            p2: "no",
            p3: "yes",
            p4: "yes",
        });
    });

    it("a mismatch that depends on what the document makes is an info, and nothing is shown", async () => {
        const { texts, typeChangeDiagnostics } = await setup(`
<math name="m">x+1</math>
<repeat name="rep" for="1 2" valueName="i"><math>$i</math></repeat>
<p name="p1"><boolean extend="$m"/></p>
<p name="p2"><point extend="$m"/></p>
<p name="p3"><math extend="$rep"/></p>
<p name="p4"><point copy="$m"/></p>
`);
        expect(await texts(["p1", "p2", "p3", "p4"])).eqls({
            p1: "",
            p2: "",
            p3: "",
            p4: "",
        });
        expect(typeChangeDiagnostics()).eqls([
            {
                code: "doenet-i0053",
                type: "info",
                line: 4,
                message:
                    "A `<boolean>` can't be made from `$m` while its value, x + 1, isn't true or false. Nothing is shown for it until it is.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 5,
                message:
                    "A `<point>` can't be made from `$m` while its value, x + 1, isn't a tuple of coordinates. Nothing is shown for it until it is.",
            },
            {
                code: "doenet-e0064",
                type: "info",
                line: 6,
                message:
                    "A `<math>` can be made from a `<repeat>` only when it holds one component, and `$rep` holds 2. To use one of them, write `$rep[1]` or name it. To read them all as one value, write `<math>$rep</math>`.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 7,
                message:
                    "A `<point>` can't be made from `$m` while its value, x + 1, isn't a tuple of coordinates. Nothing is shown for it until it is.",
            },
        ]);
    });

    it("a point made from a math is shown while its value is a tuple", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="mi" prefill="x"/>
<math name="m">$mi</math>
<p name="p1"><point extend="$m"/></p>
`);
        expect(await texts(["p1"])).eqls({ p1: "" });
        expect(typeChangeDiagnostics().map((d) => [d.code, d.type])).eqls([
            ["doenet-i0053", "info"],
        ]);

        await updateMathInputValue({
            latex: "(1,2)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await texts(["p1"])).eqls({ p1: "(1, 2)" });

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await texts(["p1"])).eqls({ p1: "" });
    });

    it("a point made from a math is kept, not made again, while its value stays a tuple", async () => {
        const { core, resolvePathToNodeIdx } = await setup(`
<mathInput name="mi" prefill="(1,2)"/>
<math name="m">$mi</math>
<graph><point extend="$m" name="P"/></graph>
`);
        /** The point the extend shows. */
        async function pointShown() {
            return (core as any).core._components[
                await resolvePathToNodeIdx("P")
            ];
        }
        const before = await pointShown();
        expect(before.componentType).eq("point");
        expect((await before.stateValues.coords).toString()).eq("(1, 2)");

        await updateMathInputValue({
            latex: "(3,4)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        const after = await pointShown();
        expect(after === before).eq(true);
        expect((await after.stateValues.coords).toString()).eq("(3, 4)");
    });

    it("the active case decides whether a conditionalContent stands for the written type", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><point>(1,2)</point></case>
  <else><text>no</text></else>
</conditionalContent>
<p name="p1"><text name="t" extend="$cc"/></p>
`);
        expect(await texts(["p1", "t"])).eqls({ p1: "no", t: "no" });
        expect(typeChangeDiagnostics()).eqls([]);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await texts(["p1"])).eqls({ p1: "" });
        expect(typeChangeDiagnostics()).eqls([
            {
                code: "doenet-e0065",
                type: "info",
                line: 7,
                message:
                    "A `<text>` can't be made from `$cc`, which gives a `<point>`. To show it as it is, write `$cc`.",
            },
        ]);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await texts(["p1", "t"])).eqls({ p1: "no", t: "no" });
    });

    it("how many components a collect holds decides whether it stands for one", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="n" prefill="1"/>
<group name="g" hide><math>x</math><math>y</math></group>
<collect name="c" componentType="math" from="$g" maxNumber="$n"/>
<p name="p1"><math name="mc" extend="$c"/></p>
`);
        expect(await texts(["p1", "mc"])).eqls({ p1: "x", mc: "x" });
        expect(typeChangeDiagnostics()).eqls([]);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts(["p1"])).eqls({ p1: "" });
        expect(typeChangeDiagnostics()).eqls([
            {
                code: "doenet-e0064",
                type: "info",
                line: 5,
                message:
                    "A `<math>` can be made from a `<collect>` only when it holds one component, and `$c` holds 2. To use one of them, write `$c[1]` or name it. To read them all as one value, write `<math>$c</math>`.",
            },
        ]);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts(["p1", "mc"])).eqls({ p1: "x", mc: "x" });
    });
});
