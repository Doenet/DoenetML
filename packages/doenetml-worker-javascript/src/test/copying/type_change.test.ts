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

    it("type on a copy of another tag that reads its text as its type", async () => {
        const { texts } = await setup(`
<p name="pi"><indexOf name="io" target="1">01 1</indexOf></p>
<p name="pi1"><indexOf copy="$io" type="text"/></p>
<p name="pt"><tally name="t">1 01 1</tally></p>
<p name="pt1"><tally copy="$t" type="text"/></p>
<p name="psi"><sortIndices name="si">10 3 1</sortIndices></p>
<p name="psi1"><sortIndices copy="$si" type="text"/></p>
`);
        expect(await texts(["pi", "pi1", "pt", "pt1", "psi", "psi1"])).eqls({
            pi: "1",
            pi1: "2",
            pt: "3",
            pt1: "1, 2",
            psi: "3, 2, 1",
            psi1: "3, 1, 2",
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
  <angle name="ang">pi/2</angle>
  <label name="lab">hello</label>
  <ion name="ion" symbol="Na" charge="1"/>
</setup>
<p name="sp">hello <math>x</math></p>
<section name="sec"><p>hi</p></section>
<mathInput name="mi" prefill="2"/>
`;

    it("between related types, from a group that holds one component, and from content made at run time as on main", async () => {
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
            // what a component stands for elsewhere (its adapters)
            mathFromAngle: [`<math extend="$ang"/>`, "π/2"],
            textFromLabel: [`<text extend="$lab"/>`, "hello"],
            textFromIon: [`<text extend="$ion"/>`, "Sodium"],
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
<group name="g0"> </group>
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
<p name="mathFromEmptyGroup"><math extend="$g0"/></p>
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
            "mathFromEmptyGroup",
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
                    "A `<math>` can be made from a `<group>` only when it holds one component, and `$g2` holds 2. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$g2</math>`.",
            },
            {
                code: "doenet-e0064",
                type: "error",
                line: lineOf("textFromGroupOfTwo"),
                message:
                    "A `<text>` can be made from a `<group>` only when it holds one component, and `$g2` holds 2. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<text>$g2</text>`.",
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
            {
                code: "doenet-e0064",
                type: "error",
                line: lineOf("mathFromEmptyGroup"),
                message:
                    "A `<math>` can't be made from `$g0`, a `<group>` that holds nothing.",
            },
        ]);
    });

    it("an error in place of what is referenced is not reported again as a type change", async () => {
        const { texts, typeChangeDiagnostics } = await setup(`
<p name="p0"><count name="bad" value="1">1</count></p>
<group name="g"><count value="1">1</count></group>
<p name="p1"><count copy="$bad"/></p>
<p name="p2"><text extend="$bad"/></p>
<p name="p3"><text extend="$g"/></p>
<p name="p4"><collect copy="$bad"/></p>
`);
        expect(await texts(["p1", "p2", "p3", "p4"])).eqls({
            p1: "",
            p2: "",
            p3: "",
            p4: "",
        });
        expect(typeChangeDiagnostics()).eqls([]);
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

    it("a group whose content is written, through groups and references, is decided", async () => {
        // A `<setup>` shows nothing, so `g` holds two maths.
        const { texts, typeChangeDiagnostics } = await setup(`
<math name="m">x</math>
<point name="P">(1,2)</point>
<group name="g"><setup><math name="h">5</math></setup><math>1</math><math>2</math></group>
<group name="g1"><text>one</text></group>
<group name="g5">$P</group>
<group name="g7"><group>$m</group><text>t</text></group>
<p name="p1"><math extend="$g"/></p>
<p name="p2"><text extend="$g5"/></p>
<p name="p3"><math extend="$g7"/></p>
<p name="p4"><point extend="$g1"/></p>
<p name="p5"><collect copy="$g1"/></p>
`);
        expect(await texts(["p1", "p2", "p3", "p4", "p5"])).eqls({
            p1: "",
            p2: "",
            p3: "",
            p4: "",
            p5: "",
        });
        expect(
            typeChangeDiagnostics().map(({ code, type, line }) => [
                code,
                type,
                line,
            ]),
        ).eqls([
            ["doenet-e0064", "error", 8],
            ["doenet-e0065", "error", 9],
            ["doenet-e0064", "error", 10],
            ["doenet-e0065", "error", 11],
            ["doenet-e0065", "error", 12],
        ]);
    });

    it("a math's value that does not allow the type is an info, and nothing is shown", async () => {
        const { texts, typeChangeDiagnostics } = await setup(`
<math name="m">x+1</math>
<mathInput name="mi" prefill="x"/>
<p name="p1"><boolean extend="$m"/></p>
<p name="p2"><point extend="$m"/></p>
<p name="p3"><point copy="$m"/></p>
<p name="p4"><point extend="$mi"/></p>
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
                    "A `<boolean>` can't be made from `$m` while its value, x + 1, isn't true or false, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 5,
                message:
                    "A `<point>` can't be made from `$m` while its value, x + 1, isn't a tuple of coordinates, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 6,
                message:
                    "A `<point>` can't be made from `$m` while its value, x + 1, isn't a tuple of coordinates, so nothing is shown for it.",
            },
            {
                code: "doenet-i0053",
                type: "info",
                line: 7,
                message:
                    "A `<point>` can't be made from `$mi` while its value, x, isn't a tuple of coordinates, so nothing is shown for it.",
            },
        ]);
    });

    it("content made at run time is not decided, as on main", async () => {
        // What a repeat, select, conditionalContent or collect holds, an
        // iteration, a pick or a case, a list the document makes, and a group
        // holding any of these or a reference with an index, each made as on
        // main, with no type-change diagnostic.
        const { texts, typeChangeDiagnostics } = await setup(`
<repeat name="rep" for="1 2" valueName="i"><math>$i</math></repeat>
<repeat name="rep2" for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat>
<select name="s" numToSelect="2"><option><math>1</math><math>3</math></option><option><math>2</math><math>4</math></option></select>
<conditionalContent name="cc"><case condition="true"><math>a</math><math>b</math></case></conditionalContent>
<selectFromSequence name="sfs" from="1" to="9" numToSelect="2"/>
<sequence name="seq" from="1" to="3"/>
<sequence name="seq0" from="1" to="0"/>
<mathList name="ml">7 8</mathList>
<group name="g1">$rep[1]</group>
<group name="g2">$ml[5]</group>
<group name="g3"><text>a</text><conditionalContent><case condition="true"><text>b</text></case></conditionalContent></group>
<p name="p1"><math extend="$rep"/></p>
<p name="p2"><math extend="$rep2"/></p>
<p name="p3"><math extend="$rep2[1]"/></p>
<p name="p4"><math extend="$s"/></p>
<p name="p5"><math extend="$s[1]"/></p>
<p name="p6"><math extend="$cc"/></p>
<p name="p7"><math extend="$cc[1]"/></p>
<p name="p8"><math extend="$sfs"/></p>
<p name="p9"><math extend="$seq"/></p>
<p name="p10"><math extend="$seq0"/></p>
<p name="p11"><math extend="$g1"/></p>
<p name="p12"><math extend="$g2"/></p>
<p name="p13"><text extend="$g3"/></p>
`);
        const names = Array.from({ length: 13 }, (_, i) => `p${i + 1}`);
        const shown = await texts(names);
        expect(shown.p8.split(", ").length).eq(2);
        expect({ ...shown, p8: "" }).eqls({
            p1: "＿",
            p2: "＿",
            p3: "＿",
            p4: "＿",
            p5: "＿",
            p6: "＿",
            p7: "＿",
            p8: "",
            p9: "1, 2, 3",
            p10: "＿",
            p11: "1",
            p12: "＿",
            p13: "",
        });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("content that holds a list is not decided", async () => {
        // What a list stands for can change without the composite holding
        // it making new replacements, so it is left as it was: here each
        // shows its one entry. The inner `<repeatForSequence>`s are made
        // lists, whose type is not one the author wrote.
        const { texts, typeChangeDiagnostics } = await setup(`
<group name="g"><mathList>7</mathList></group>
<repeat name="rep" for="1 2" valueName="v"><repeatForSequence length="$v"><math>1</math></repeatForSequence></repeat>
<p name="p1"><math extend="$g"/></p>
<p name="p2"><math extend="$rep[1]"/></p>
`);
        expect(await texts(["p1", "p2"])).eqls({ p1: "7", p2: "1" });
        expect(typeChangeDiagnostics()).eqls([]);
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

    it("a math's value in a group is not decided, as on main", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="mi" prefill="x"/>
<group name="g"><math>$mi</math></group>
<p name="p1"><point extend="$g"/></p>
<p name="p2"><boolean extend="$g"/></p>
`);
        expect(await texts(["p1", "p2"])).eqls({ p1: "x", p2: "false" });

        const mi = await resolvePathToNodeIdx("mi");
        await updateMathInputValue({ latex: "(1,2)", componentIdx: mi, core });
        expect(await texts(["p1", "p2"])).eqls({ p1: "(1, 2)", p2: "false" });

        await updateMathInputValue({ latex: "1", componentIdx: mi, core });
        expect(await texts(["p1", "p2"])).eqls({ p1: "1", p2: "true" });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("a group holding a reference to content made at run time, or checked against a value, is not decided", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="n" prefill="1"/>
<mathList name="ml">7 8</mathList>
<group name="g1">$ml[$n]</group>
<select name="s"><option><group name="go"><text>a</text><text>b</text></group></option></select>
<group name="g2">$s.go</group>
<math name="m">x</math>
<group name="g3"><text>a</text><point extend="$m"/></group>
<p name="p1"><math extend="$g1"/></p>
<p name="p2"><text extend="$s.go"/></p>
<p name="p3"><point extend="$g2"/></p>
<p name="p4"><text extend="$g3"/></p>
`);
        expect(await texts(["p1", "p2", "p3", "p4"])).eqls({
            p1: "7",
            p2: "",
            p3: "(0, 0)",
            p4: "",
        });
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts(["p1"])).eqls({ p1: "＿" });
        // Only the info of the point made from `$m`.
        expect(typeChangeDiagnostics().map((d) => d.code)).eqls([
            "doenet-i0053",
        ]);
    });

    it("an extend of a group holding an extend follows it when what it holds changes, as on main", async () => {
        // What `g0` and `h0` hold is made at run time, so none of these is
        // decided.
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<booleanInput name="b"/>
<group name="g0"><conditionalContent><case condition="$b"><math>1</math></case><else><text>a</text></else></conditionalContent></group>
<group name="g1"><math extend="$g0"/></group>
<p name="p1"><math extend="$g1"/></p>
<group name="h0"><conditionalContent><case condition="$b"><point>(1,2)</point></case><else><point>(3,4)</point></else></conditionalContent></group>
<group name="h1"><point extend="$h0"/></group>
<p name="p2"><point extend="$h1"/></p>
`);
        expect(await texts(["p1", "p2"])).eqls({ p1: "＿", p2: "(3, 4)" });

        const b = await resolvePathToNodeIdx("b");
        await updateBooleanInputValue({ boolean: true, componentIdx: b, core });
        expect(await texts(["p1", "p2"])).eqls({ p1: "1", p2: "(1, 2)" });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: b,
            core,
        });
        expect(await texts(["p1", "p2"])).eqls({ p1: "＿", p2: "(3, 4)" });

        await updateBooleanInputValue({ boolean: true, componentIdx: b, core });
        expect(await texts(["p1", "p2"])).eqls({ p1: "1", p2: "(1, 2)" });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("content that changes inside an iteration or a pick is not decided, as on main", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="mi" prefill="1"/>
<select name="s"><option><repeatForSequence length="$mi"><text>a</text></repeatForSequence></option></select>
<group name="g"><repeatForSequence length="$mi"><text>b</text></repeatForSequence></group>
<p name="p1"><text extend="$s[1]"/></p>
<p name="p2"><text extend="$g"/></p>
`);
        expect(await texts(["p1", "p2"])).eqls({ p1: "a", p2: "b" });

        const mi = await resolvePathToNodeIdx("mi");
        await updateMathInputValue({ latex: "2", componentIdx: mi, core });
        expect(await texts(["p1", "p2"])).eqls({ p1: "a, a", p2: "b, b" });

        await updateMathInputValue({ latex: "1", componentIdx: mi, core });
        expect(await texts(["p1", "p2"])).eqls({ p1: "a", p2: "b" });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("an extend in the content it is of is a circular dependency, not a document that fails to load, as on main", async () => {
        const { core, texts } = await setup(`
<p name="p1"><group name="g"><text>a</text><math extend="$g"/></group></p>
<mathInput name="n" prefill="(1,2)"/>
<p name="p2"><group name="h"><conditionalContent><case condition="$n=(1,2)"><point extend="$h"/></case></conditionalContent></group></p>
<p name="p3"><group name="k"><math extend="$l"/></group><group name="l"><math extend="$k"/></group></p>
<p name="p4"><repeat name="r" for="1 2" valueName="v"><math extend="$r"/></repeat></p>
<p name="p5"><select name="s"><option><math extend="$s"/></option></select></p>
`);
        expect(await texts(["p1", "p2", "p3", "p4", "p5"])).eqls({
            p1: "a＿",
            p2: "",
            p3: "",
            p4: "＿, ＿",
            p5: "",
        });
        const circular = getDiagnosticsByType(core).errors.filter(
            (d: any) => d.code === "doenet-e0005",
        );
        expect(circular.map((d: any) => d.position?.start.line)).eqls([
            2, 4, 5, 5, 6, 7,
        ]);
    });

    it("a setup reached by the index of a child is not decided", async () => {
        const { texts, typeChangeDiagnostics } = await setup(`
<group name="g"><setup><number name="n">3</number></setup><math>x</math></group>
<p name="p1"><math extend="$g[1]"/></p>
`);
        expect(await texts(["p1"])).eqls({ p1: "＿" });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("the active case of a conditionalContent is not decided, as on main", async () => {
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

        const b = await resolvePathToNodeIdx("b");
        await updateBooleanInputValue({ boolean: true, componentIdx: b, core });
        expect(await texts(["p1"])).eqls({ p1: "" });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: b,
            core,
        });
        expect(await texts(["p1", "t"])).eqls({ p1: "no", t: "no" });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("how many components a collect holds is not decided, as on main", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="n" prefill="1"/>
<group name="g" hide><math>x</math><math>y</math></group>
<collect name="c" componentType="math" from="$g" maxNumber="$n"/>
<p name="p1"><math name="mc" extend="$c"/></p>
`);
        expect(await texts(["p1", "mc"])).eqls({ p1: "x", mc: "x" });

        const n = await resolvePathToNodeIdx("n");
        await updateMathInputValue({ latex: "2", componentIdx: n, core });
        expect(await texts(["p1"])).eqls({ p1: "x, y" });

        await updateMathInputValue({ latex: "1", componentIdx: n, core });
        expect(await texts(["p1", "mc"])).eqls({ p1: "x", mc: "x" });
        expect(typeChangeDiagnostics()).eqls([]);
    });

    it("a list whose entries are written is decided again when how many it holds changes", async () => {
        const { core, resolvePathToNodeIdx, texts, typeChangeDiagnostics } =
            await setup(`
<mathInput name="n" prefill="1"/>
<mathList name="ml" maxNumber="$n">1 2</mathList>
<p name="p1"><math extend="$ml"/></p>
`);
        expect(await texts(["p1"])).eqls({ p1: "1" });
        expect(typeChangeDiagnostics()).eqls([]);

        const n = await resolvePathToNodeIdx("n");
        await updateMathInputValue({ latex: "2", componentIdx: n, core });
        expect(await texts(["p1"])).eqls({ p1: "" });
        expect(typeChangeDiagnostics().map((d) => [d.code, d.type])).eqls([
            ["doenet-e0064", "error"],
        ]);

        await updateMathInputValue({ latex: "1", componentIdx: n, core });
        expect(await texts(["p1"])).eqls({ p1: "1" });
    });
});
