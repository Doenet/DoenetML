import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function textsOf(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    paths: string[],
) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    const texts: Record<string, string> = {};
    for (const path of paths) {
        texts[path] =
            stateVariables[await resolvePathToNodeIdx(path)].stateValues.text;
    }
    return texts;
}

function expectNoDiagnostics(core: PublicDoenetMLCore) {
    const diagnosticsByType = getDiagnosticsByType(core);
    expect(diagnosticsByType.errors).eqls([]);
    expect(diagnosticsByType.warnings).eqls([]);
}

/**
 * A copy (`copy=`) is its source's DoenetML pasted where it is written, with
 * the names in it still meaning what they meant in the source (D1). A
 * reference in what is copied keeps its referent: the copy's counterpart of
 * one inside what is copied, and the same component for one outside it,
 * which is not looked up again by name where the copy lands.
 */
describe("A copy's references keep their referents @group4", () => {
    it("a referent outside the copy is neither captured nor made ambiguous where the copy lands", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="T"><number name="n">2</number><group name="gc" copy="$A.g"/></section>
<section name="U"><group name="gu" copy="$A.g"/></section>
`,
        });

        expectNoDiagnostics(core);
        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "A.g.p",
                "T.gc.p",
                "U.gu.p",
            ]),
        ).eqls({ "A.g.p": "1", "T.gc.p": "1", "U.gu.p": "1" });
    });

    it("a chain of copies keeps the referent of the first, at each depth", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="B"><number name="n">2</number><group name="gB" copy="$A.g"/></section>
<section name="C"><number name="n">3</number><group name="gC" copy="$B.gB"/></section>
<section name="D"><number name="n">4</number><group name="gD" copy="$C.gC"/></section>
<section name="F"><group name="gF" copy="$D.gD"/></section>
`,
        });

        expectNoDiagnostics(core);
        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "B.gB.p",
                "C.gC.p",
                "D.gD.p",
                "F.gF.p",
            ]),
        ).eqls({
            "B.gB.p": "1",
            "C.gC.p": "1",
            "D.gD.p": "1",
            "F.gF.p": "1",
        });
    });

    it("a reference through the copied component's own name refers to the copy", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="P">
    <point name="h">(1,2)</point>
    <point name="q" x="$P.h.x" y="3" />
</graph>
<graph name="C" copy="$P" />
`,
        });

        expectNoDiagnostics(core);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("C.h"),
            x: 5,
            y: 6,
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const x = async (path: string) =>
            stateVariables[await resolvePathToNodeIdx(path)].stateValues.xs[0]
                .tree;
        expect(await x("P.q")).eq(1);
        expect(await x("C.q")).eq(5);
    });

    it("a property of the copied component, through its own name, is the copy's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="P"><title>t</title><p name="q">$P.sectionNumber $P.title</p></section>
<section name="C" copy="$P"><title>u</title></section>
`,
        });

        expectNoDiagnostics(core);
        expect(await textsOf(core, resolvePathToNodeIdx, ["P.q", "C.q"])).eqls({
            "P.q": "1 t",
            "C.q": "2 u",
        });
    });

    it("a reference in repeat content keeps its iteration's value in a copy", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<repeat name="r" for="5 6 7" valueName="i"><p name="p">$i</p></repeat>
<p name="c" copy="$r[2].p"/>
`,
        });

        expectNoDiagnostics(core);
        expect(await textsOf(core, resolvePathToNodeIdx, ["c"])).eqls({
            c: "6",
        });
    });

    it("an attribute of a copied reference keeps the reference's referent", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="S">
    <setup><number name="d">3</number></setup>
    <math name="m">1.23456</math>
    <math name="r" extend="$m" displayDigits="$d" />
</section>
<section name="T">
    <setup><number name="d">5</number></setup>
    <math name="c" copy="$S.r" />
</section>
`,
        });

        expectNoDiagnostics(core);
        const stateVariables = await core.returnAllStateVariables(false, true);
        const displayDigits = async (path: string) =>
            stateVariables[await resolvePathToNodeIdx(path)].stateValues
                .displayDigits;
        expect(await displayDigits("S.r")).eq(3);
        expect(await displayDigits("T.c")).eq(3);
    });

    it("a copy of a list entry keeps the referent of the list's fixed attribute", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A">
    <boolean name="b">true</boolean>
    <mathList name="l" fixed="$b">1 2 3</mathList>
</section>
<section name="T">
    <boolean name="b">false</boolean>
    <math name="c" copy="$A.l[2]" />
</section>
`,
        });

        expectNoDiagnostics(core);
        const stateVariables = await core.returnAllStateVariables(false, true);
        const c = stateVariables[await resolvePathToNodeIdx("T.c")];
        expect(c.stateValues.value.tree).eq(2);
        expect(c.stateValues.fixed).eq(true);
    });

    it("a copy of a list entry keeps the referent of the list's display attributes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A">
    <number name="dd">2</number>
    <mathList name="l" displayDigits="$dd">1.23456 2.3456789</mathList>
</section>
<section name="T">
    <number name="dd">5</number>
    <math name="c" copy="$A.l[2]" />
</section>
<section name="U">
    <math name="c" copy="$A.l[2]" />
</section>
`,
        });

        expectNoDiagnostics(core);
        expect(await textsOf(core, resolvePathToNodeIdx, ["T.c", "U.c"])).eqls({
            "T.c": "2.3",
            "U.c": "2.3",
        });
    });

    it("a copy of a property keeps the referent of the attributes it takes from its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A">
    <text name="s">full</text>
    <math name="m" simplify="$s">x+x</math>
</section>
<section name="T">
    <text name="s">none</text>
    <math name="c" copy="$A.m.value" />
</section>
<section name="U">
    <math name="c" copy="$A.m.value" />
</section>
`,
        });

        expectNoDiagnostics(core);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const path of ["T.c", "U.c"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(path)].stateValues
                    .simplify,
            ).eq("full");
        }
    });

    it("a copy made after interaction keeps its referents, through a save and reload", async () => {
        const doenetML = `
<section name="A"><mathInput name="n" prefill="1" /><group name="g"><p name="p">$n</p></group></section>
<section name="T">
    <mathInput name="n" prefill="2" />
    <booleanInput name="show" />
    <conditionalContent name="cc">
        <case condition="$show"><group name="gc" copy="$A.g"/></case>
    </conditionalContent>
</section>
<section name="U">
    <booleanInput name="show" />
    <conditionalContent name="cc">
        <case condition="$show"><group name="gu" copy="$A.g"/></case>
    </conditionalContent>
</section>
`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        for (const path of ["T.show", "U.show"]) {
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx(path),
                core,
            });
        }
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("A.n"),
            core,
        });

        expectNoDiagnostics(core);
        const expected = {
            "A.g.p": "3",
            "T.cc.gc.p": "3",
            "U.cc.gu.p": "3",
        };
        expect(
            await textsOf(core, resolvePathToNodeIdx, Object.keys(expected)),
        ).eqls(expected);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));

        expectNoDiagnostics(core);
        expect(
            await textsOf(core, resolvePathToNodeIdx, Object.keys(expected)),
        ).eqls(expected);
    });
    it("a copy of an extend keeps the referents of the extend's source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group><p name="q">$n</p></section>
<section name="B"><number name="n">2</number><group name="gB" extend="$A.g"/><p name="pB" extend="$A.q"/></section>
<section name="D"><number name="n">4</number><group name="gD" copy="$B.gB"/><p name="pD" copy="$B.pB"/></section>
<section name="U"><group name="gU" copy="$B.gB"/></section>
`,
        });

        expectNoDiagnostics(core);
        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "B.gB.p",
                "B.pB",
                "D.gD.p",
                "D.pD",
                "U.gU.p",
            ]),
        ).eqls({
            "B.gB.p": "1",
            "B.pB": "1",
            "D.gD.p": "1",
            "D.pD": "1",
            "U.gU.p": "1",
        });
    });

    it("a chain of extends and copies keeps the referent of the first, at each depth", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="B"><number name="n">2</number><group name="gB" extend="$A.g"/></section>
<section name="C"><number name="n">3</number><group name="gC" extend="$B.gB"/></section>
<section name="D"><number name="n">4</number><group name="gD" copy="$C.gC"/></section>
<section name="E"><number name="n">5</number><group name="gE" copy="$D.gD"/></section>
<section name="F"><number name="n">6</number><group name="gF" copy="$E.gE"/></section>
<section name="G"><number name="n">7</number><group name="gG" extend="$E.gE"/></section>
<section name="H"><number name="n">8</number><group name="gH" copy="$B.gB"/></section>
<section name="I"><number name="n">9</number><group name="gI" copy="$H.gH"/><group name="gJ" extend="$gI"/></section>
`,
        });

        expectNoDiagnostics(core);
        const paths = [
            "B.gB.p",
            "C.gC.p",
            "D.gD.p",
            "E.gE.p",
            "F.gF.p",
            "G.gG.p",
            "H.gH.p",
            "I.gI.p",
            "I.gJ.p",
        ];
        expect(await textsOf(core, resolvePathToNodeIdx, paths)).eqls(
            Object.fromEntries(paths.map((path) => [path, "1"])),
        );
    });

    it("a copy of an extend keeps the referent of an attribute of the extend's source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="m">-3</number><graph name="G1" decorative/><graph name="G2" copy="$G1" xMin="$m"/></section>
<section name="B"><number name="m">-5</number><graph name="G3" extend="$A.G2"/></section>
<section name="C"><number name="m">-7</number><graph name="G4" copy="$B.G3"/></section>
<section name="D"><graph name="G5" copy="$B.G3"/></section>
`,
        });

        expectNoDiagnostics(core);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const path of ["A.G2", "B.G3", "C.G4", "D.G5"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(path)].stateValues
                    .xMin,
            ).eq(-3);
        }
    });

    it("a copy of part of an extend keeps a referent elsewhere in the extend", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><group name="g"><mathInput name="x" prefill="7"/><p name="p">$x $n</p></group></section>
<section name="B"><number name="n">2</number><number name="x">8</number><group name="gB" extend="$A.g"/></section>
<section name="C"><number name="n">3</number><number name="x">9</number><p name="pc" copy="$B.gB.p"/><p name="pc2" copy="$pc"/></section>
`,
        });

        expectNoDiagnostics(core);
        // `B.gB.x` shadows `A.g.x`, which a copy of `B.gB.p` keeps through it
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("B.gB.x"),
            core,
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "A.g.p",
                "B.gB.p",
                "C.pc",
                "C.pc2",
            ]),
        ).eqls({
            "A.g.p": "5 1",
            "B.gB.p": "5 1",
            "C.pc": "5 1",
            "C.pc2": "5 1",
        });
    });

    it("in a copy of an extend, a reference through the source's own name refers to the copy", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><group name="g"><mathInput name="x" prefill="5"/><p name="p">$g.x $n</p></group></section>
<section name="B"><number name="n">2</number><group name="gB" extend="$A.g"/></section>
<section name="D"><number name="n">4</number><group name="gD" copy="$B.gB"/></section>
<section name="E"><number name="n">6</number><group name="gE" copy="$D.gD"/></section>
`,
        });

        expectNoDiagnostics(core);
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("D.gD.x"),
            core,
        });
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("E.gE.x"),
            core,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "A.g.p",
                "B.gB.p",
                "D.gD.p",
                "E.gE.p",
            ]),
        ).eqls({
            "A.g.p": "5 1",
            "B.gB.p": "5 1",
            "D.gD.p": "7 1",
            "E.gE.p": "8 1",
        });
    });

    it("a copy of an extend made after interaction keeps its referents, through a save and reload", async () => {
        const doenetML = `
<section name="A"><mathInput name="n" prefill="1" /><group name="g"><p name="p">$n</p></group></section>
<section name="B"><mathInput name="n" prefill="2" /><group name="gB" extend="$A.g"/></section>
<section name="T">
    <mathInput name="n" prefill="4" />
    <booleanInput name="show" />
    <conditionalContent name="cc">
        <case condition="$show"><group name="gc" copy="$B.gB"/></case>
    </conditionalContent>
</section>
`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("T.show"),
            core,
        });
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("A.n"),
            core,
        });

        expectNoDiagnostics(core);
        const expected = { "B.gB.p": "3", "T.cc.gc.p": "3" };
        expect(
            await textsOf(core, resolvePathToNodeIdx, Object.keys(expected)),
        ).eqls(expected);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));

        expectNoDiagnostics(core);
        expect(
            await textsOf(core, resolvePathToNodeIdx, Object.keys(expected)),
        ).eqls(expected);
    });

    it("a copy of an extend keeps the source's referents in the content of a repeat, a conditionalContent and a select", async () => {
        const doenetML = `
<section name="A">
    <number name="n">1</number>
    <booleanInput name="b" />
    <group name="g">
        <repeat name="r" for="1 2" valueName="v"><p>$v $n</p></repeat>
        <conditionalContent name="cc">
            <case condition="$b"><p name="p">yes $n</p></case>
            <else><p name="p">no $n</p></else>
        </conditionalContent>
        <select name="s"><option><p name="p">a $n</p></option></select>
    </group>
</section>
<section name="B"><number name="n">2</number><group name="gB" extend="$A.g"/></section>
<section name="C"><number name="n">3</number><group name="gC" extend="$B.gB"/></section>
<section name="D"><number name="n">4</number><group name="gD" copy="$C.gC"/></section>
<section name="E"><number name="n">5</number><group name="gE" copy="$D.gD"/><group name="gF" extend="$gE"/><group name="gG" copy="$gF"/></section>
<section name="U"><group name="gU" copy="$B.gB"/></section>
`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        const groups = ["B.gB", "C.gC", "D.gD", "E.gE", "E.gF", "E.gG", "U.gU"];
        async function expectTexts(cc: string) {
            const expected: Record<string, string> = {};
            for (const g of groups) {
                expected[`${g}.r[2][1]`] = "2 1";
                expected[`${g}.cc.p`] = `${cc} 1`;
                expected[`${g}.s[1].p`] = "a 1";
            }
            expect(
                await textsOf(
                    core,
                    resolvePathToNodeIdx,
                    Object.keys(expected),
                ),
            ).eqls(expected);
        }

        expectNoDiagnostics(core);
        await expectTexts("no");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("A.b"),
            core,
        });
        await expectTexts("yes");
    });

    /**
     * Section A holds `source`, a tag that makes its own content, which shows
     * A's `n`. Section B, with another `n`, extends it twice, each inside a
     * `<p>`: with a name, and with a name and an appearance attribute.
     * Sections D, with another `n`, and U, with none, copy both extends, and D
     * copies the `<p>` that holds the first.
     */
    function directExtendsDoenetML(tag: string, source: string) {
        return `
<section name="A"><number name="n">1</number>${source}</section>
<section name="B">
    <number name="n">2</number>
    <p name="pe"><${tag} name="e" extend="$A.x"/></p>
    <p name="pa"><${tag} name="ea" extend="$A.x" styleNumber="2"/></p>
</section>
<section name="D">
    <number name="n">4</number>
    <p name="c"><${tag} copy="$B.e"/></p>
    <p name="ca"><${tag} copy="$B.ea"/></p>
    <p name="cp" copy="$B.pe"/>
</section>
<section name="U">
    <p name="c"><${tag} copy="$B.e"/></p>
    <p name="ca"><${tag} copy="$B.ea"/></p>
</section>
`;
    }

    const directExtendPaths = [
        "B.pe",
        "B.pa",
        "D.c",
        "D.ca",
        "D.cp",
        "U.c",
        "U.ca",
    ];

    async function expectDirectExtendTexts(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        text: string,
    ) {
        expect(
            await textsOf(core, resolvePathToNodeIdx, directExtendPaths),
        ).eqls(
            Object.fromEntries(directExtendPaths.map((path) => [path, text])),
        );
    }

    it("a copy of an extend of a repeat keeps the source's referents", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: directExtendsDoenetML(
                "repeat",
                `<repeat name="x" for="5 6" valueName="v"><text>$v $n</text></repeat>`,
            ),
        });

        expectNoDiagnostics(core);
        await expectDirectExtendTexts(core, resolvePathToNodeIdx, "5 1, 6 1");
    });

    it("a copy of an extend of a select keeps the source's referents", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: directExtendsDoenetML(
                "select",
                `<select name="x"><option><text>a $n</text></option></select>`,
            ),
        });

        expectNoDiagnostics(core);
        await expectDirectExtendTexts(core, resolvePathToNodeIdx, "a 1");
    });

    it("a copy of an extend of a conditionalContent keeps the source's referents as its case switches", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: directExtendsDoenetML(
                "conditionalContent",
                `<booleanInput name="b" /><conditionalContent name="x">
    <case condition="$b"><text>yes $n</text></case>
    <else><text>no $n</text></else>
</conditionalContent>`,
            ),
        });

        expectNoDiagnostics(core);
        await expectDirectExtendTexts(core, resolvePathToNodeIdx, "no 1");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("A.b"),
            core,
        });
        await expectDirectExtendTexts(core, resolvePathToNodeIdx, "yes 1");
    });

    it("a copy of an extend of a collect keeps the source's referents", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: directExtendsDoenetML(
                "collect",
                `<group name="g"><text>c $n</text></group><collect name="x" componentType="text" from="$g"/>`,
            ),
        });

        expectNoDiagnostics(core);
        await expectDirectExtendTexts(core, resolvePathToNodeIdx, "c 1");
    });

    it("a copy or extend of a list-form collect, sort or shuffle inside an extend is that list", async () => {
        // The document pass makes `x`, `s` and `sh` list forms
        // (`utils/dast/listForms.ts`), but cannot see that `$B.gB.x` is one,
        // as `gB.x` is made by the `extend`. The copies are written as
        // `<collect>`, `<sort>` and `<shuffle>`, of which the list form is
        // one, so it is not wrapped in an empty composite of that type.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number>
  <group name="g">
    <group name="h"><text>c $n</text><text>d</text></group>
    <collect name="x" componentType="text" from="$h"/>
    <sort name="s"><number>3</number><number>$n</number></sort>
    <shuffle name="sh"><number>5</number></shuffle>
  </group>
</section>
<section name="B"><number name="n">2</number><group name="gB" extend="$A.g"/></section>
<section name="D">
  <number name="n">4</number>
  <p name="p1"><collect copy="$B.gB.x"/></p>
  <p name="p2"><collect copy="$A.g.x"/></p>
  <p name="p3">$B.gB.x</p>
  <p name="p4"><collect extend="$B.gB.x"/></p>
  <p name="p5"><collect name="y" copy="$B.gB.x"/>; <collect copy="$y"/></p>
  <p name="p6"><collect copy="$B.gB.x" maxNumber="1"/></p>
  <p name="p7"><sort copy="$B.gB.s"/>; <sort extend="$B.gB.s"/></p>
  <p name="p8"><shuffle copy="$B.gB.sh"/>; <shuffle extend="$B.gB.sh"/></p>
</section>
<section name="U">
  <p name="p1"><collect copy="$B.gB.x"/></p>
  <p name="p4"><collect extend="$B.gB.x"/></p>
</section>
`,
        });

        expectNoDiagnostics(core);
        const expected = {
            "D.p1": "c 1, d",
            "D.p2": "c 1, d",
            "D.p3": "c 1, d",
            "D.p4": "c 1, d",
            "D.p5": "c 1, d; c 1, d",
            "D.p6": "c 1",
            "D.p7": "1, 3; 1, 3",
            "D.p8": "5; 5",
            "U.p1": "c 1, d",
            "U.p4": "c 1, d",
        };
        expect(
            await textsOf(core, resolvePathToNodeIdx, Object.keys(expected)),
        ).eqls(expected);
    });

    it("an extend of a module has its module attributes, and a copy of its content keeps them", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="A"><number name="n">1</number><module name="m"><moduleAttributes><number name="a">10</number></moduleAttributes><p name="p">$a $n</p></module></section>
<section name="B"><number name="n">2</number><number name="a">20</number><module name="mc" copy="$A.m" a="30"/><module name="me" extend="$mc"/><module name="me2" extend="$A.m"/></section>
<section name="C">
    <number name="n">3</number><number name="a">21</number>
    <p name="pc" copy="$B.me.p"/><p name="pc2" copy="$B.me2.p"/>
    <p name="pa">$B.me.a $B.me2.a</p><number name="na" extend="$B.me.a"/>
    <module name="mce" copy="$B.me" a="40"/>
</section>
`,
        });

        expectNoDiagnostics(core);
        const expected = {
            "B.me.p": "30 1",
            "B.me2.p": "10 1",
            "C.pc": "30 1",
            "C.pc2": "10 1",
            "C.pa": "30 10",
            "C.na": "30",
            "C.mce.p": "40 1",
        };
        expect(
            await textsOf(core, resolvePathToNodeIdx, Object.keys(expected)),
        ).eqls(expected);
    });
});
