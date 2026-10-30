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
});
