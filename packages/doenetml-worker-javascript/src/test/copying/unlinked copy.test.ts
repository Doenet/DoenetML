import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import {
    callAction,
    moveLine,
    movePoint,
    updateMathInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function isUndefinedOrInactive(comp) {
    expect(
        comp === undefined || comp.stateValues.isInactiveCompositeReplacement,
    ).eq(true);
}

async function test_no_overwritten_attributes({
    core,
    resolvePathToNodeIdx,
    parentPrefix,
    addParentPrefixToInitialGraph = false,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    parentPrefix: string;
    addParentPrefixToInitialGraph?: boolean;
}) {
    const graphNamePostfix = addParentPrefixToInitialGraph ? ".g" : "";

    const stateVariables = await core.returnAllStateVariables(false, true);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${parentPrefix}${graphNamePostfix}`)
        ].stateValues.xMax,
    ).eq(5);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${parentPrefix}.A`)
        ].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}.A`)]
            .stateValues.styleNumber,
    ).eq(2);
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}.A`)]
            .stateValues.label,
    ).eq("A");
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}.A`)]
            .stateValues.labelPosition,
    ).eq("upperleft");

    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${parentPrefix}2${graphNamePostfix}`)
        ].stateValues.xMax,
    ).eq(5);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${parentPrefix}2.A`)
        ].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}2.A`)]
            .stateValues.styleNumber,
    ).eq(2);
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}2.A`)]
            .stateValues.label,
    ).eq("A");
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}2.A`)]
            .stateValues.labelPosition,
    ).eq("upperleft");

    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${parentPrefix}3${graphNamePostfix}`)
        ].stateValues.xMax,
    ).eq(5);
    expect(
        stateVariables[
            await resolvePathToNodeIdx(`${parentPrefix}3.A`)
        ].stateValues.xs.map((v) => v.tree),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}3.A`)]
            .stateValues.styleNumber,
    ).eq(2);
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}3.A`)]
            .stateValues.label,
    ).eq("A");
    expect(
        stateVariables[await resolvePathToNodeIdx(`${parentPrefix}3.A`)]
            .stateValues.labelPosition,
    ).eq("upperleft");
}

async function test_linked_copy_overwrites_attributes({
    core,
    resolvePathToNodeIdx,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
}) {
    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(stateVariables[await resolvePathToNodeIdx("g")].stateValues.xMin).eq(
        -10,
    );
    expect(stateVariables[await resolvePathToNodeIdx("g")].stateValues.xMax).eq(
        5,
    );
    expect(
        stateVariables[await resolvePathToNodeIdx("g.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g.A")].stateValues
            .styleNumber,
    ).eq(2);
    expect(
        stateVariables[await resolvePathToNodeIdx("g.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g.B")].stateValues
            .styleNumber,
    ).eq(1);

    expect(
        stateVariables[await resolvePathToNodeIdx("g2")].stateValues.xMin,
    ).eq(-3);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2")].stateValues.xMax,
    ).eq(7);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.A")].stateValues
            .styleNumber,
    ).eq(2);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.B")].stateValues
            .styleNumber,
    ).eq(3);

    expect(
        stateVariables[await resolvePathToNodeIdx("g3")].stateValues.xMin,
    ).eq(-3);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3")].stateValues.xMax,
    ).eq(7);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.A")].stateValues
            .styleNumber,
    ).eq(2);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.B")].stateValues
            .styleNumber,
    ).eq(3);
}

async function test_unlinked_copy_overwrites_attributes({
    core,
    resolvePathToNodeIdx,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
}) {
    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    let stateVariables = await core.returnAllStateVariables(false, true);
    expect(stateVariables[await resolvePathToNodeIdx("g")].stateValues.xMin).eq(
        -10,
    );
    expect(stateVariables[await resolvePathToNodeIdx("g")].stateValues.xMax).eq(
        5,
    );
    expect(stateVariables[await resolvePathToNodeIdx("g")].stateValues.yMax).eq(
        10,
    );
    expect(
        stateVariables[await resolvePathToNodeIdx("g.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g.A")].stateValues
            .styleNumber,
    ).eqls(2);
    expect(
        stateVariables[await resolvePathToNodeIdx("g.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g.B")].stateValues
            .styleNumber,
    ).eqls(1);

    expect(
        stateVariables[await resolvePathToNodeIdx("g2")].stateValues.xMax,
    ).eq(5);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2")].stateValues.xMin,
    ).eq(-3);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2")].stateValues.yMax,
    ).eq(10);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.A")].stateValues
            .styleNumber,
    ).eqls(2);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g2.B")].stateValues
            .styleNumber,
    ).eqls(1);

    expect(
        stateVariables[await resolvePathToNodeIdx("g3")].stateValues.xMax,
    ).eq(7);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3")].stateValues.xMin,
    ).eq(-5);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3")].stateValues.yMax,
    ).eq(8);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.A")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([1, 2]);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.A")].stateValues
            .styleNumber,
    ).eqls(2);
    expect(
        stateVariables[await resolvePathToNodeIdx("g3.B")].stateValues.xs.map(
            (v) => v.tree,
        ),
    ).eqls([3, 4]);
    // TODO: uncomment when fix the behavior so this passes
    // expect(stateVariables[await resolvePathToNodeIdx("g3.B")].stateValues.styleNumber).eqls(4);
}

describe("Unlinked Copying Tests", async () => {
    it("copy no link, base test", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Simplify of original: <textInput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textInput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <math copy="$m" simplify="$s2" name="m2" /></p>

    <p>Linked copy: <math extend="$m" simplify="$s2" name="m3" /></p>
    
    <p>Double value of original: <updateValue target="$m" newValue="2$m" name="doubleOriginal" >
      <label>double original</label>
    </updateValue></p>
    <p>Double value of copy 1: <updateValue target="$m2" newValue="2$m2" name="doubleCopy1" >
      <label>double copy 1</label>
    </updateValue></p>
    <p>Double value of copy 2: <updateValue target="$m3" newValue="2$m3" name="doubleCopy2" >
      <label>double copy 2</label>
    </updateValue></p>

    `,
        });

        async function check_maths(m, m2, m3) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .value.tree,
            ).eqls(m);
            expect(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .value.tree,
            ).eqls(m2);
            expect(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .value.tree,
            ).eqls(m3);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        let copy1Name =
            stateVariables[await resolvePathToNodeIdx("m2")].replacementOf!;
        let copy2Name =
            stateVariables[await resolvePathToNodeIdx("m3")].replacementOf!;
        expect(stateVariables[copy1Name].stateValues.link).eq(false);
        expect(stateVariables[copy2Name].stateValues.link).eq(true);

        await check_maths(["*", 2, "x"], ["+", "x", "x"], ["+", "x", "x"]);

        // simplify copies
        await updateTextInputValue({
            text: "full",
            componentIdx: await resolvePathToNodeIdx("s2"),
            core,
        });
        await check_maths(["*", 2, "x"], ["*", 2, "x"], ["*", 2, "x"]);

        // stop simplifying original
        await updateTextInputValue({
            text: "none",
            componentIdx: await resolvePathToNodeIdx("s1"),
            core,
        });
        await check_maths(["+", "x", "x"], ["*", 2, "x"], ["*", 2, "x"]);

        // double original
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("doubleOriginal"),
            core,
        });
        await check_maths(
            ["*", 2, ["+", "x", "x"]],
            ["*", 2, "x"],
            ["*", 4, "x"],
        );

        // double copy1
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("doubleCopy1"),
            core,
        });
        await check_maths(
            ["*", 2, ["+", "x", "x"]],
            ["*", 4, "x"],
            ["*", 4, "x"],
        );

        // double copy2
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("doubleCopy2"),
            core,
        });
        await check_maths(["*", 2, 4, "x"], ["*", 4, "x"], ["*", 8, "x"]);

        // stop simplifying copies
        await updateTextInputValue({
            text: "none",
            componentIdx: await resolvePathToNodeIdx("s2"),
            core,
        });
        await check_maths(["*", 2, 4, "x"], ["*", 2, 2, "x"], ["*", 2, 4, "x"]);
    });

    async function test_copy_points_lines_no_link(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("A")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(A);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("B")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(B);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l")
                ].stateValues.point1.map((x) => x.tree),
            ).eqls(A);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l")
                ].stateValues.point2.map((x) => x.tree),
            ).eqls(B);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("A2")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(A2);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l2")
                ].stateValues.point1.map((x) => x.tree),
            ).eqls(A);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l2")
                ].stateValues.point2.map((x) => x.tree),
            ).eqls(B);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("A3")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(A3);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("A4")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(A4);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("B4")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(B4);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("gnolink.A")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(gA);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("gnolink.B")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(gB);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("gnolink.l")
                ].stateValues.point1.map((x) => x.tree),
            ).eqls(gA);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("gnolink.l")
                ].stateValues.point2.map((x) => x.tree),
            ).eqls(gB);
            expect(
                stateVariables[await resolvePathToNodeIdx("Ax")].stateValues
                    .value.tree,
            ).eqls(Ax);
        }

        let A = [1, 2],
            B = [3, 4],
            A2 = [1, 2],
            A3 = [1, 2],
            A4 = [1, 2],
            B4 = [3, 4],
            gA = [1, 2],
            gB = [3, 4],
            Ax = 1;

        let stateVariables = await core.returnAllStateVariables(false, true);

        let copyForA2 =
            stateVariables[await resolvePathToNodeIdx("A2")].replacementOf!;
        let copyForl2 =
            stateVariables[await resolvePathToNodeIdx("l2")].replacementOf!;
        let copyForA3 =
            stateVariables[await resolvePathToNodeIdx("A3")].replacementOf!;
        let copyForA4B4 =
            stateVariables[await resolvePathToNodeIdx("A4")].replacementOf!;
        let copyForgnolink =
            stateVariables[await resolvePathToNodeIdx("gnolink")]
                .replacementOf!;
        let copyForAx =
            stateVariables[await resolvePathToNodeIdx("Ax")].replacementOf!;
        expect(stateVariables[copyForA2].stateValues.link).eq(false);
        expect(stateVariables[copyForl2].stateValues.link).eq(false);
        expect(stateVariables[copyForA3].stateValues.link).eq(false);
        expect(stateVariables[copyForA4B4].stateValues.link).eq(false);
        expect(stateVariables[copyForgnolink].stateValues.link).eq(false);
        expect(stateVariables[copyForAx].stateValues.link).eq(false);

        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move A
        A = [-9, -3];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: A[0],
            y: A[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move B
        B = [-2, 6];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: B[0],
            y: B[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move l
        A = [-7, -6];
        B = [8, 0];

        await moveLine({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: A,
            point2coords: B,
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move A2
        A2 = [5, 4];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: A2[0],
            y: A2[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move l2
        A = [-5, 9];
        B = [-4, -1];
        await moveLine({
            componentIdx: await resolvePathToNodeIdx("l2"),
            point1coords: A,
            point2coords: B,
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move A3
        A3 = [6, -3];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A3"),
            x: A3[0],
            y: A3[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move A4
        A4 = [-2, 7];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A4"),
            x: A4[0],
            y: A4[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move B4
        B4 = [-9, -8];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B4"),
            x: B4[0],
            y: B4[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move A5
        gA = [-10, -9];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("gnolink.A"),
            x: gA[0],
            y: gA[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move B5
        gB = [-8, -7];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("gnolink.B"),
            x: gB[0],
            y: gB[1],
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });

        // move l3
        gA = [6, 5];
        gB = [4, -3];
        await moveLine({
            componentIdx: await resolvePathToNodeIdx("gnolink.l"),
            point1coords: gA,
            point2coords: gB,
            core,
        });
        await check_items({ A, B, A2, A3, A4, B4, gA, gB, Ax });
    }

    it("copy points and lines with no link dot notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <point copy="$A" name="A2" />
      <line copy="$l" name="l2" />
    </graph>
    
    <graph>
      <point copy="$l.point1" name="A3" />
    </graph>
    <graph>
      <point copy="$l.point1" name="A4" />
      <point copy="$l.point2" name="B4" />
    </graph>

    <graph copy="$g" name="gnolink" />
    
    <math copy="$A.x" name="Ax" />

    <p>
      <point extend="$A" name="Ac" />
      <point extend="$B" name="Bc" />
      <point extend="$l.point1" name="lp1" />
      <point extend="$A2" name="A2c" />
      <point extend="$l2.point1" name="l2p1" />
      <point extend="$A3" name="A3c" />
      <point extend="$A4" name="A4c" />
      <point extend="$B4" name="B4c" />
      <point extend="$gnolink.A" name="A5c" />
      <point extend="$gnolink.B" name="B5c" />
      <point extend="$gnolink.l.point1" name="l3p1" />

    </p>
  
    `,
        });

        await test_copy_points_lines_no_link(core, resolvePathToNodeIdx);
    });

    it("copy string with no link", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1">Hello</p>
    <p copy="$p1" name="p2" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Hello");
    });

    // This was causing a duplicate component name error, which can't happen anymore.
    // But, we're just keeping the test around anyway since we have it.
    it("copy group inside with no link", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><group name="g"><text name="m">hello</text> <text extend="$m" name="q" /></group></p>
    <p name="p2"><group copy="$g" /></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("hello hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("hello hello");
    });

    // When unlinked copy was set not to `useReplacement` (in _copy component),
    // then this test would fail as `$g2[1]` would refer the the whole sequence
    // and `$g2[2]` would have no replacements
    it("copy group of sequence has same indexing as the original group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <sequence name="s" length="2" />
        <group name="g1">$s</group>
        <group copy="$g1" name="g2" />

        <p name="p1">g11: $g1[1], g12: $g1[2]</p>
        <p name="p2">g21: $g2[1], g22: $g2[2]</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("g11: 1, g12: 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("g21: 1, g22: 2");
    });

    async function test_copy_group_copies_no_link(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        const names = [
            "",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
        ].map((l) => `twox${l}`);

        for (let name of names) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value.tree,
            ).eqls(["+", "x", "x"]);
        }
    }

    it("copy group with copies with no link", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group>
      <p><math name="twox">x+x</math></p>
      <math extend="$twox" name="twoxa" />
      <math extend="$twox" name="twoxb" />
    </group>
    
    <math extend="$twox" name="twoxc" />
    <math copy="$twox" name="twoxd" />
    
    <math extend="$twoxa" name="twoxe" />
    <math copy="$twoxa" name="twoxf" />
    
    <math extend="$twoxe" name="twoxg" />
    <math copy="$twoxf" name="twoxh" />

    <math extend="$twoxb" name="twoxi" />
    <math copy="$twoxb" name="twoxj" />
    
    <math extend="$twoxi" name="twoxk" />
    <math copy="$twoxj" name="twoxl" />
  
    `,
        });

        await test_copy_group_copies_no_link(core, resolvePathToNodeIdx);
    });

    async function test_copy_group_overwrite_attributes_no_link(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(
            simplify1: "full" | "none",
            simplify2: "full" | "none",
            simplify3: "full" | "none",
        ) {
            const twoNone = ["+", "x", "x"];
            const twoSimp = ["*", 2, "x"];
            const threeNone = ["+", "x", "x", "x"];
            const threeSimp = ["*", 3, "x"];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("twox")].stateValues
                    .value.tree,
            ).eqls(twoNone);
            expect(
                stateVariables[await resolvePathToNodeIdx("twoxa")].stateValues
                    .value.tree,
            ).eqls(simplify1 === "full" ? twoSimp : twoNone);
            expect(
                stateVariables[await resolvePathToNodeIdx("threex")].stateValues
                    .value.tree,
            ).eqls(simplify1 === "full" ? threeSimp : threeNone);

            expect(
                stateVariables[await resolvePathToNodeIdx("g2.twox")]
                    .stateValues.value.tree,
            ).eqls(twoNone);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.twoxa")]
                    .stateValues.value.tree,
            ).eqls(simplify2 === "full" ? twoSimp : twoNone);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.threex")]
                    .stateValues.value.tree,
            ).eqls(simplify2 === "full" ? threeSimp : threeNone);

            expect(
                stateVariables[await resolvePathToNodeIdx("g3.twox")]
                    .stateValues.value.tree,
            ).eqls(twoNone);
            expect(
                stateVariables[await resolvePathToNodeIdx("g3.twoxa")]
                    .stateValues.value.tree,
            ).eqls(simplify3 === "full" ? twoSimp : twoNone);
            expect(
                stateVariables[await resolvePathToNodeIdx("g3.threex")]
                    .stateValues.value.tree,
            ).eqls(simplify3 === "full" ? threeSimp : threeNone);
        }

        let simplify1: "full" | "none" = "full";
        let simplify2: "full" | "none" = "full";
        let simplify3: "full" | "none" = "full";

        await check_items(simplify1, simplify2, simplify3);

        // change first simplify
        simplify1 = "none";
        await updateTextInputValue({
            text: simplify1,
            componentIdx: await resolvePathToNodeIdx("sim"),
            core,
        });

        await check_items(simplify1, simplify2, simplify3);

        // change second simplify
        simplify2 = "none";
        await updateTextInputValue({
            text: simplify1,
            componentIdx: await resolvePathToNodeIdx("g2.sim"),
            core,
        });
        await check_items(simplify1, simplify2, simplify3);

        // change third simplify
        simplify3 = "none";
        await updateTextInputValue({
            text: simplify1,
            componentIdx: await resolvePathToNodeIdx("g3.sim"),
            core,
        });
        await check_items(simplify1, simplify2, simplify3);
    }

    it("copy group with copy overwriting attribute, no link", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g">
      <textInput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <math extend="$twox" simplify="$sim" name="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <group copy="$g" name="g2" />
    <group copy="$g2" name="g3" />
    `,
        });

        await test_copy_group_overwrite_attributes_no_link(
            core,
            resolvePathToNodeIdx,
        );
    });

    it("copy group, no link, with function adapted to curve", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="text1">a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <group copy='$g' />

    `,
        });

        // just testing that page loads, i.e., that bug is removed so that don't get error
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("text1")].stateValues
                .text,
        ).eq("a");
    });

    async function test_no_link_outside_component_from_attribute(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(text1: string, text2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("g.w")].stateValues
                    .text,
            ).eq(text1);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.Plabel")]
                    .stateValues.text,
            ).eq(text1);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.P")].stateValues
                    .label,
            ).eq(text1);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.w")].stateValues
                    .text,
            ).eq(text2);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.Plabel")]
                    .stateValues.text,
            ).eq(text2);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.P")].stateValues
                    .label,
            ).eq(text2);
        }

        await check_items("bye", "bye");

        await updateTextInputValue({
            text: "hi",
            componentIdx: await resolvePathToNodeIdx("external"),
            core,
        });

        await check_items("hi", "hi");
    }

    it("copy group, no link, copy to outside component from attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <textInput name="external" prefill="bye" />

    <group name="g">
      <text extend="$external.value" name="w" />
      <point name="P">
        <label>$external</label>
        (a,b)
      </point>
      <label extend="$P.label" name="Plabel" />
    </group>
    
    <group copy="$g" name="g2" />
    `,
        });

        await test_no_link_outside_component_from_attribute(
            core,
            resolvePathToNodeIdx,
        );
    });

    async function test_no_link_copy_internal_copy_source_alias(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(text1: string, text2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("g.a[1].w")]
                    .stateValues.text,
            ).eq(text1);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.a[1].Plabel")]
                    .stateValues.text,
            ).eq(text1);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.a[1].P")]
                    .stateValues.label,
            ).eq(text1);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.a[1].w")]
                    .stateValues.text,
            ).eq(text2);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.a[1].Plabel")]
                    .stateValues.text,
            ).eq(text2);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.a[1].P")]
                    .stateValues.label,
            ).eq(text2);
        }

        await check_items("hello", "hello");

        await updateTextInputValue({
            text: "one",
            componentIdx: await resolvePathToNodeIdx("g.ti"),
            core,
        });
        await updateTextInputValue({
            text: "two",
            componentIdx: await resolvePathToNodeIdx("g2.ti"),
            core,
        });

        await check_items("one", "two");
    }

    it("copy group, no link, internal copy to source alias is linked, with copySource", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g">
      <textInput name="ti" prefill="hello" />
      <repeat name="a" for="$ti" valueName="x">
          <text extend="$x" name="w" />
          <point name="P">
            <label>$x</label>
            (a,b)
          </point>
          <label extend="$P.label" name="Plabel" />
      </repeat>
    </group>
    
    <group copy="$g" name="g2"/>
    `,
        });

        await test_no_link_copy_internal_copy_source_alias(
            core,
            resolvePathToNodeIdx,
        );
    });

    async function test_no_link_external_absolute_source(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.m1")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.m2")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.m1")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.m2")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.m1")].stateValues
                .value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.m2")].stateValues
                .value,
        ).eq(4);
    }

    it("copy no link containing external copies use absolute source", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group name="g">
      <p>m = <number extend="$m" name="m1" /></p>
      <p>m = <number copy="$m" name="m2" /></p>
    </group>
    
    <group extend="$g" name="g2" />
    <group copy="$g" name="g3" />
    `,
        });

        await test_no_link_external_absolute_source(core, resolvePathToNodeIdx);
    });

    async function test_dynamic_map_no_link_alias(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        async function check_items(n1: number, n2: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            if (n1 >= 1) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[1][1]")
                    ].stateValues.text,
                ).eq("i=1, v=11");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[1][1]")
                    ].stateValues.text,
                ).eq("i=1, v=11");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[1][1]")
                    ].stateValues.text,
                ).eq("i=1, v=11");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[1][1]")
                    ].stateValues.text,
                ).eq("i=1, v=11");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[1][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[1][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[1][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[1][1]")
                    ],
                );
            }
            if (n1 >= 2) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[2][1]")
                    ].stateValues.text,
                ).eq("i=2, v=12");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[2][1]")
                    ].stateValues.text,
                ).eq("i=2, v=12");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[2][1]")
                    ].stateValues.text,
                ).eq("i=2, v=12");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[2][1]")
                    ].stateValues.text,
                ).eq("i=2, v=12");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[2][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[2][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[2][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[2][1]")
                    ],
                );
            }
            if (n1 >= 3) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[3][1]")
                    ].stateValues.text,
                ).eq("i=3, v=13");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[3][1]")
                    ].stateValues.text,
                ).eq("i=3, v=13");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[3][1]")
                    ].stateValues.text,
                ).eq("i=3, v=13");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[3][1]")
                    ].stateValues.text,
                ).eq("i=3, v=13");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[3][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[3][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[3][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[3][1]")
                    ],
                );
            }
            if (n1 >= 4) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[4][1]")
                    ].stateValues.text,
                ).eq("i=4, v=14");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[4][1]")
                    ].stateValues.text,
                ).eq("i=4, v=14");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[4][1]")
                    ].stateValues.text,
                ).eq("i=4, v=14");
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[4][1]")
                    ].stateValues.text,
                ).eq("i=4, v=14");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section1.r[4][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section2.r[4][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section4.r[4][1]")
                    ],
                );
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section5.r[4][1]")
                    ],
                );
            }

            if (n2 >= 1) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[1][1]")
                    ].stateValues.text,
                ).eq("i=1, v=11");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[1][1]")
                    ],
                );
            }
            if (n2 >= 2) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[2][1]")
                    ].stateValues.text,
                ).eq("i=2, v=12");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[2][1]")
                    ],
                );
            }
            if (n2 >= 3) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[3][1]")
                    ].stateValues.text,
                ).eq("i=3, v=13");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[3][1]")
                    ],
                );
            }
            if (n2 >= 4) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[4][1]")
                    ].stateValues.text,
                ).eq("i=4, v=14");
            } else {
                isUndefinedOrInactive(
                    stateVariables[
                        await resolvePathToNodeIdx("section3.r[4][1]")
                    ],
                );
            }
        }

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("section1")].stateValues
                .title,
        ).eq("Section 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("section2")].stateValues
                .title,
        ).eq("Section 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("section3")].stateValues
                .title,
        ).eq("Section 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("section4")].stateValues
                .title,
        ).eq("Section 4");
        expect(
            stateVariables[await resolvePathToNodeIdx("section5")].stateValues
                .title,
        ).eq("Section 5");

        await check_items(2, 2);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("section1.addP"),
            core,
        });
        await check_items(3, 2);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("section5.removeP"),
            core,
        });
        await check_items(2, 2);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("section3.addP"),
            core,
        });
        await check_items(2, 3);

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("section3.removeP"),
            core,
        });
        await check_items(2, 2);
    }

    it("copy dynamic repeat no link, check aliases", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="section1">
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="$n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="$n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <setup><sequence name="seq" length="$n" from="11" /></setup>
      <repeat name="r" for="$seq" indexName="i" valueName="v">
        <p>i=$i, v=$v</p>
      </repeat>
    </section>
    
    <section name="section2">
      <repeat name="r" copy='$section1.r' />
    </section>


    <section copy='$section1' name="section3" />
    
    <section name="section4">
      <repeat name="r" extend='$section1.r' />
    </section>

    <section extend='$section1' name="section5" />
  
    `,
        });

        await test_dynamic_map_no_link_alias(core, resolvePathToNodeIdx);
    });

    it("copy dynamic repeatForSequence no link, check aliases", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="section1">
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="$n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="$n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <repeatForSequence name="r" length="$n" from="11" indexName="i" valueName="v">
        <p>i=$i, v=$v</p>
      </repeatForSequence>
    </section>
    
    <section name="section2">
      <repeatForSequence name="r" copy='$section1.r' />
    </section>


    <section copy='$section1' name="section3" />
    
    <section name="section4">
      <repeatForSequence name="r" extend='$section1.r' />
    </section>

    <section extend='$section1' name="section5" />
  
    `,
        });

        await test_dynamic_map_no_link_alias(core, resolvePathToNodeIdx);
    });

    it("copy repeat item with no link", async () => {
        // Note: in this example, the x-coordinate of `C` is fixed,
        // since it is a copy of `$i+4` and the link to the fixed `$i` is maintained.
        // On the other hand, it's y-coordinate is free to change,
        // since it is just an unlinked copy of the value of `ip4`.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of iterations: <mathInput name="n" /></p>

    <graph>
    
      <setup><sequence name="s" from="1" to="$n" /></setup>
      <repeat name="r" for="$s" valueName="i">
      <setup>
        <number copy="$i" name="i2" />
        <number copy="$i.value" name="i2value" />
        <number name="ip4">$i+4</number>
      </setup>
      <point name="A" x="$i2" y='$i2value+1'>
      </point>
      <point name="B">
        (<number copy="$i" /> + 2, <number copy="$i.value" /> +3)
      </point>
      <point name="C">
        (<number copy="$ip4" />, <number copy="$ip4.value" /> +1)
      </point>
      
      </repeat>
        
    </graph>
  
    `,
        });

        async function check_items(
            A?: number[],
            B?: number[],
            C?: number[],
            D?: number[],
            E?: number[],
            F?: number[],
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (A) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("r[1].A")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls(A);
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("r[1].A")],
                );
            }
            if (B) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("r[1].B")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls(B);
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("r[1].B")],
                );
            }
            if (C) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("r[1].C")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls(C);
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("r[1].C")],
                );
            }
            if (D) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("r[2].A")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls(D);
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("r[2].A")],
                );
            }
            if (E) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("r[2].B")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls(E);
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("r[2].B")],
                );
            }
            if (F) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("r[2].C")
                    ].stateValues.xs.map((x) => x.tree),
                ).eqls(F);
            } else {
                isUndefinedOrInactive(
                    stateVariables[await resolvePathToNodeIdx("r[2].C")],
                );
            }
        }

        await check_items();

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items([1, 2], [3, 4], [5, 6]);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[1].A"),
            x: 9,
            y: 0,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[1].B"),
            x: 1,
            y: 8,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[1].C"),
            x: 7,
            y: 2,
            core,
        });

        await check_items([9, 0], [1, 8], [5, 2]);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items([9, 0], [1, 8], [5, 2], [2, 3], [4, 5], [6, 7]);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[2].A"),
            x: 0,
            y: 10,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[2].B"),
            x: 9,
            y: 1,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[2].C"),
            x: 2,
            y: 8,
            core,
        });

        await check_items([9, 0], [1, 8], [5, 2], [0, 10], [9, 1], [6, 8]);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items();

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await check_items([9, 0], [1, 8], [5, 2], [0, 10], [9, 1], [6, 8]);
    });

    it("copy no-link of a copy prop", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="x">x</math>
    <math extend="$x.value" name="xval" />
    <math copy="$xval" name="xvalnl" />

    <mathInput name="mi1">$xval</mathInput>
    <mathInput name="mi2">$xvalnl</mathInput>
  
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("xval")].stateValues.value
                .tree,
        ).eq("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("xvalnl")].stateValues
                .value.tree,
        ).eq("x");

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("xval")].stateValues.value
                .tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("xvalnl")].stateValues
                .value.tree,
        ).eq("x");

        await updateMathInputValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("xval")].stateValues.value
                .tree,
        ).eq("y");
        expect(
            stateVariables[await resolvePathToNodeIdx("xvalnl")].stateValues
                .value.tree,
        ).eq("z");
    });

    it("copy no-link of a copy prop 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <triangle name="t"/>
    
      <point extend="$t.vertex1" name="v1" />
      <point name="v2" extend="$v1" />
      <point name="v3" extend="$v2" />
    </graph>
    
    <graph>
      <point copy="$v1" name="v1nl"  />
      <point copy="$v2" name="v2nl"  />
      <point copy="$v3" name="v3nl"  />
    </graph>



    `,
        });

        async function check_items({
            v1,
            v1nl,
            v2nl,
            v3nl,
        }: {
            v1: number[];
            v1nl: number[];
            v2nl: number[];
            v3nl: number[];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(v1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1nl")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(v1nl);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2nl")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(v2nl);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3nl")
                ].stateValues.xs.map((x) => x.tree),
            ).eqls(v3nl);
        }

        let v1 = [0, 1],
            v1nl = [0, 1],
            v2nl = [0, 1],
            v3nl = [0, 1];

        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v1
        v1 = [2, 3];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("v1"),
            x: v1[0],
            y: v1[1],
            core,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v1nl
        v1nl = [3, 4];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("v1nl"),
            x: v1nl[0],
            y: v1nl[1],
            core,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v2nl
        v2nl = [4, 5];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("v2nl"),
            x: v2nl[0],
            y: v2nl[1],
            core,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });

        // Move v3nl
        v3nl = [5, 6];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("v3nl"),
            x: v3nl[0],
            y: v3nl[1],
            core,
        });
        await check_items({ v1, v1nl, v2nl, v3nl });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes", async () => {
        // When extending, often children and attributes are not copied
        // but instead the resulting state variables are just shadowed.
        // Then, when subsequently creating an unlinked copy of that linked extend,
        // there are no children or attributes to copy.
        // Instead, the unlinked copy needs to copy the state variables values directly
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" xmax="5">
    <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
</graph>
<graph extend="$g" name="g2" />
<graph copy="$g2" name="g3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
            resolvePathToNodeIdx,
            parentPrefix: "g",
        });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group inside", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" xmax="5">
    <group>
        <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
    </group>
</graph>
<graph extend="$g" name="g2" />
<graph copy="$g2" name="g3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
            resolvePathToNodeIdx,
            parentPrefix: "g",
        });
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group outside", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="gr">
        <graph name="g" xmax="5">
            <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
        </graph>
    </group>
    <group extend="$gr" name="gr2" />
    <group copy="$gr2" name="gr3" />
  `,
        });

        await test_no_overwritten_attributes({
            core,
            resolvePathToNodeIdx,
            parentPrefix: "gr",
            addParentPrefixToInitialGraph: true,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" xmax="5">
    <point name="A" styleNumber="2">(1,2)</point>
    <point name="B">(3,4)</point>
</graph>
<graph extend="$g" name="g2" styleNumber="3" xmin="-3" xmax="7" />
<graph copy="$g2" name="g3" />
  `,
        });

        await test_linked_copy_overwrites_attributes({
            core,
            resolvePathToNodeIdx,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy, group inside", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g" xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
    </graph>
    <graph extend="$g" name="g2" styleNumber="3" xmin="-3" xmax="7" />
    <graph copy="$g2" name="g3" />
  `,
        });

        await test_linked_copy_overwrites_attributes({
            core,
            resolvePathToNodeIdx,
        });
    });

    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    it("unlinked copy of linked copy, overwrite attributes of unlinked copy", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g" xmax="5">
        <point name="A" styleNumber="2">(1,2)</point>
        <point name="B">(3,4)</point>
    </graph>
    <graph extend="$g" name="g2" xmin="-3" />
    <graph copy="$g2" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
        });

        await test_unlinked_copy_overwrites_attributes({
            core,
            resolvePathToNodeIdx,
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of unlinked copy, group inside", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g" xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
    </graph>
    <graph extend="$g" name="g2" xmin="-3" />
    <graph copy="$g2" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
        });

        await test_unlinked_copy_overwrites_attributes({
            core,
            resolvePathToNodeIdx,
        });
    });

    async function test_snapshot({
        core,
        resolvePathToNodeIdx,
        snapshotType,
        point_p_initialVal = [0, 0],
        point_q_initialVal = [0, 0],
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        snapshotType: "updateValue" | "callAction";
        point_p_initialVal?: number[];
        point_q_initialVal?: number[];
    }) {
        let p = point_p_initialVal;
        let q = point_q_initialVal;
        let p2 = [NaN, NaN];
        let q2 = [NaN, NaN];

        async function check_snapshot() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("P")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls(p);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("Q")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls(q);

            let graph2Children =
                stateVariables[await resolvePathToNodeIdx("graph2")]
                    .activeChildren;

            if (Number.isNaN(p2[0])) {
                // Unlinked copied content does not exist yet
                expect(graph2Children.length).eqls(0);
            } else {
                let P2 = graph2Children[0].componentIdx;
                let Q2 = graph2Children[1].componentIdx;
                expect(
                    stateVariables[P2].stateValues.xs.map((v) => v.tree),
                ).eqls(p2);
                expect(
                    stateVariables[Q2].stateValues.xs.map((v) => v.tree),
                ).eqls(q2);
            }
        }
        await check_snapshot();

        // move points
        p = [-1, 7];
        q = [5, 3];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: p[0],
            y: p[1],
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: q[0],
            y: q[1],
            core,
        });
        await check_snapshot();

        // Take snapshot, which should create conditional content using current
        // state var values of graph1
        p2 = p;
        q2 = q;
        if (snapshotType === "updateValue") {
            await updateValue({
                componentIdx: await resolvePathToNodeIdx("takeSnapshot"),
                core,
            });
        } else {
            await callAction({
                componentIdx: await resolvePathToNodeIdx("takeSnapshot"),
                core,
            });
        }
        await check_snapshot();

        // move points again, unlinked copied points should not move
        p = [2, -9];
        q = [1, 8];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: p[0],
            y: p[1],
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: q[0],
            y: q[1],
            core,
        });
        await check_snapshot();
    }

    it("create snapshot of group with conditionalContent", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <boolean name="copy">false</boolean>
    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            <group copy="$gr" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "updateValue",
        });
    });

    it("create snapshot of group with callAction", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <callAction name="takeSnapshot" target="$graph2" actionName="addChildren">
        <label>Take snapshot</label>
        <group copy="$gr" />
    </callAction>
    <updateValue triggerWith="$takeSnapshot" target="$takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2" />
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "callAction",
        });
    });

    it("create snapshot of repeat with conditionalContent", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <setup><sequence name="s" length="2" /></setup>
        <repeat name="mp" for="$s" valueName="i">
            <point>(1, <number copy="$i" />)</point>
        </repeat>
        <setup>
          <point extend="$mp[1]" name="P" />
          <point extend="$mp[2]" name="Q" />
        </setup>
    </graph>

    <boolean name="copy">false</boolean>
    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent name="cc" condition="$copy">
            <repeat copy="$mp" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of repeat with callAction", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <repeatForSequence name="mp" length="2" valueName="i">
            <point>(1, <number copy="$i" />)</point>
        </repeatForSequence>
        <setup>
          <point extend="$mp[1]" name="P" />
          <point extend="$mp[2]" name="Q" />
        </setup>
    </graph>

    <callAction name="takeSnapshot" target="$graph2" actionName="addChildren">
        <label>Take snapshot</label>
        <repeatForSequence copy="$mp" />
    </callAction>
    <updateValue triggerWith="$takeSnapshot" target="$takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "callAction",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of repeat in a group with conditionalContent", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <repeatForSequence name="mp" length="2" valueName="i">
                <point>(1, <number copy="$i" />)</point>
            </repeatForSequence>
            <setup>
                <point extend="$mp[1]" name="P" />
                <point extend="$mp[2]" name="Q" />
            </setup>
        </group>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            <group copy="$gr" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of repeat in a group with callAction", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <group name="gr">
            <setup><sequence name="s" length="2" /></setup>
            <repeat name="mp" for="$s" valueName="i">
                <point>(1, <number copy="$i" />)</point>
            </repeat>
            <setup>
                <point extend="$mp[1]" name="P" />
                <point extend="$mp[2]" name="Q" />
            </setup>
        </group>
    </graph>

    <callAction name="takeSnapshot" target="$graph2" actionName="addChildren">
        <label>Take snapshot</label>
            <group copy="$gr" />
    </callAction>
    <updateValue triggerWith="$takeSnapshot" target="$takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "callAction",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("create snapshot of repeat with conditionalContent", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
        <repeatForSequence name="mp" length="2" valueName="i">
            <group>
                <point>(1, <number copy="$i" />)</point>
            </group>
        </repeatForSequence>
        <setup>
            <point extend="$mp[1][1][1]" name="P" />
            <point extend="$mp[2][1][1]" name="Q" />
        </setup>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="$copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            <repeatForSequence copy="$mp" />
        </conditionalContent>
    </graph>
  `,
        });

        await test_snapshot({
            core,
            resolvePathToNodeIdx,
            snapshotType: "updateValue",
            point_p_initialVal: [1, 1],
            point_q_initialVal: [1, 2],
        });
    });

    it("unlinked copy inside a repeat with source and index depending on valueName and indexName", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="graph1">
      <setup>
        <sequence name="s1" from="2" to="3" />
        <sequence name="s2" from="4" to="5" />
      </setup>
      <repeat name="r" for="$s1" valueName="v" indexName="i">
         <point name="P">(<number copy="$s2[$i]" />, <number copy="$v" />)</point>
      </repeat>
    </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("r[1].P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([4, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("r[2].P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([5, 3]);

        // can move points
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[1].P"),
            x: 10,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r[2].P"),
            x: 8,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("r[1].P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([10, 9]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("r[2].P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([8, 7]);
    });
});
