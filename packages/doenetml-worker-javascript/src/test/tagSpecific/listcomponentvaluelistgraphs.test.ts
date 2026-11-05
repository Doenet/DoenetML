import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The entries of a `<numberList>`, `<mathList>`, `<textList>` or
 * `<intervalList>`, and of a `<collect>`, `<sort>` or `<shuffle>` of such
 * values, drawn in a `<graph>` (Doenet/DoenetML#2186): each at the anchor of
 * the component it comes from, and dragged there.
 */
describe("Value lists drawn in a graph @group4", async () => {
    /**
     * What the viewer draws in `name` for each math, number or text: its
     * renderer's index, its anchor and how it is placed and dragged, in the
     * order drawn, through any group or list between.
     */
    async function drawnIn(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        name: string,
    ) {
        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        function drawn(idx: number): any[] {
            return (rendererState[idx]?.childrenInstructions ?? [])
                .filter((child: any) => child && typeof child === "object")
                .flatMap((child: any) => {
                    if (
                        !["math", "number", "text"].includes(child.rendererType)
                    ) {
                        return drawn(child.componentIdx);
                    }
                    const stateValues =
                        rendererState[child.componentIdx].stateValues;
                    return [
                        {
                            componentIdx: child.componentIdx,
                            rendererType: child.rendererType,
                            text: stateValues.latex ?? stateValues.text,
                            anchor: stateValues.anchor,
                            positionFromAnchor: stateValues.positionFromAnchor,
                            draggable: stateValues.draggable,
                            layer: stateValues.layer,
                            fixed: stateValues.fixed,
                            fixLocation: stateValues.fixLocation,
                        },
                    ];
                });
        }
        return drawn(await resolvePathToNodeIdx(name));
    }

    async function anchorsDrawnIn(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        name: string,
    ) {
        return (await drawnIn(core, resolvePathToNodeIdx, name)).map(
            (entry) => entry.anchor,
        );
    }

    /** Drag what is drawn at `index` in `graph` to `(x, y)`. */
    async function drag({
        core,
        resolvePathToNodeIdx,
        graph,
        index,
        x,
        y,
        transient = false,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        graph: string;
        index: number;
        x: number;
        y: number;
        transient?: boolean;
    }) {
        const entry = (await drawnIn(core, resolvePathToNodeIdx, graph))[index];
        const actionName = {
            math: "moveMath",
            number: "moveNumber",
            text: "moveText",
        }[entry.rendererType as "math" | "number" | "text"];
        await core.requestAction({
            componentIdx: entry.componentIdx,
            actionName,
            args: {
                x,
                y,
                ...(transient ? { transient, skippable: true } : {}),
            },
        });
    }

    async function stateValuesOf(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        name: string,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues;
    }

    it("each entry is drawn as the component it comes from is placed", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <numberList><number anchor="(1,2)" draggable="false">5</number> 3</numberList>
      <mathList><math anchor="(4,5)" positionFromAnchor="upperRight" layer="2">x</math></mathList>
      <textList><text anchor="(-1,-2)" fixLocation>a</text></textList>
      <intervalList><interval anchor="(6,7)">(1,2)</interval></intervalList>
    </graph>
    `,
        });

        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((entry) => entry.anchor)).eqls([
            ["vector", 1, 2],
            ["vector", 0, 0],
            ["vector", 4, 5],
            ["vector", -1, -2],
            ["vector", 6, 7],
        ]);
        expect(drawn.map((entry) => entry.positionFromAnchor)).eqls([
            "center",
            "center",
            "upperright",
            "center",
            "center",
        ]);
        expect(drawn.map((entry) => entry.layer)).eqls([0, 0, 2, 0, 0]);
        // An entry from text has nothing that holds where it is moved.
        expect(drawn.map((entry) => entry.draggable)).eqls([
            false,
            false,
            true,
            true,
            true,
        ]);
        expect(drawn.map((entry) => entry.fixLocation)).eqls([
            false,
            false,
            false,
            true,
            false,
        ]);
    });

    it("dragging an entry moves the component it comes from", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <mathList name="ml"><math name="m" anchor="(4,5)">x</math> y</mathList>
      <numberList><number name="n">5</number></numberList>
      <textList><text name="t" anchor="(1,1)">a</text></textList>
      <intervalList><interval name="i">(1,2)</interval></intervalList>
    </graph>
    <p name="pm">$m.anchor</p>
    <p name="pEntry">$ml[1].anchor</p>
    `,
        });

        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            x: 7,
            y: 8,
        });
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            x: -3,
            y: 2,
        });
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 3,
            x: 0,
            y: 9,
        });
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 4,
            x: 5,
            y: 5,
        });
        // the entry from text stays where it is
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            x: 3,
            y: 3,
        });

        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            ["vector", 7, 8],
            ["vector", 0, 0],
            ["vector", -3, 2],
            ["vector", 0, 9],
            ["vector", 5, 5],
        ]);
        for (const [name, anchor] of [
            ["m", ["vector", 7, 8]],
            ["n", ["vector", -3, 2]],
            ["t", ["vector", 0, 9]],
            ["i", ["vector", 5, 5]],
        ] as const) {
            expect(
                (await stateValuesOf(core, resolvePathToNodeIdx, name)).anchor
                    .tree,
                name,
            ).eqls(anchor);
        }
        expect((await stateValuesOf(core, resolvePathToNodeIdx, "pm")).text).eq(
            "(7, 8)",
        );
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "pEntry")).text,
        ).eq("(7, 8)");

        // a transient drag moves it too
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            x: 1,
            y: 1,
            transient: true,
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "m")).anchor.tree,
        ).eqls(["vector", 1, 1]);
    });

    it("a property of an entry that places it is its component's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl"><number anchor="(1,2)" draggable="false" fixed>5</number> 3</numberList>
    <p name="pAnchor">$nl[1].anchor $nl[2].anchor</p>
    <p name="pDraggable">$nl[1].draggable $nl[2].draggable</p>
    <p name="pFixed">$nl[1].fixed $nl[2].fixed</p>
    <number name="n" anchor="(3,4)">5</number>
    <numberList name="nlFixed" fixed>$n 3</numberList>
    <p name="pListFixed">$nlFixed[1].fixed $nlFixed[2].fixed</p>
    `,
        });

        for (const [name, text] of [
            ["pAnchor", "(1, 2) (0, 0)"],
            ["pDraggable", "false false"],
            ["pFixed", "true false"],
            // an entry of a fixed list is fixed
            ["pListFixed", "true true"],
        ]) {
            expect(
                (await stateValuesOf(core, resolvePathToNodeIdx, name)).text,
                name,
            ).eq(text);
        }
    });

    it("an entry is not dragged when its component or the list is fixed", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m5" anchor="(5,5)">v</math>
    <math name="m6" anchor="(6,6)">u</math>
    <graph name="g">
      <mathList><math name="m1" anchor="(1,1)" fixed>x</math></mathList>
      <mathList fixed><math name="m2" anchor="(2,2)">y</math></mathList>
      <mathList><math name="m3" anchor="(3,3)" fixLocation>z</math></mathList>
      <mathList><math name="m4" anchor="(4,4)" draggable="false">w</math></mathList>
      <mathList fixed>$m5</mathList>
      <mathList fixLocation>$m6</mathList>
    </graph>
    `,
        });

        // an entry from a reference takes the list's fixed and fixLocation,
        // which its component does not inherit
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((entry) => entry.fixed)).eqls([
            true,
            true,
            false,
            false,
            true,
            false,
        ]);
        expect(drawn.map((entry) => entry.fixLocation)).eqls([
            false,
            false,
            true,
            false,
            false,
            true,
        ]);
        for (let index = 0; index < 6; index++) {
            await drag({
                core,
                resolvePathToNodeIdx,
                graph: "g",
                index,
                x: 9,
                y: 9,
            });
        }
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            ["vector", 1, 1],
            ["vector", 2, 2],
            ["vector", 3, 3],
            ["vector", 4, 4],
            ["vector", 5, 5],
            ["vector", 6, 6],
        ]);
        for (const [name, anchor] of [
            ["m5", ["vector", 5, 5]],
            ["m6", ["vector", 6, 6]],
        ] as const) {
            expect(
                (await stateValuesOf(core, resolvePathToNodeIdx, name)).anchor
                    .tree,
                name,
            ).eqls(anchor);
        }
    });

    it("an entry from a reference or a nested list is drawn and dragged as its component", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" anchor="(1,2)">x</math>
    <mathList name="inner"><math name="n" anchor="(3,4)">y</math></mathList>
    <graph name="g">
      <mathList>$m $inner</mathList>
      <mathList>$m.value $m.x</mathList>
    </graph>
    `,
        });

        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((entry) => entry.anchor)).eqls([
            ["vector", 1, 2],
            ["vector", 3, 4],
            ["vector", 1, 2],
            ["vector", 0, 0],
        ]);
        // a reference to a value other than the component's own is placed
        // as no component
        expect(drawn.map((entry) => entry.draggable)).eqls([
            true,
            true,
            true,
            false,
        ]);

        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            x: 5,
            y: 6,
        });
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            x: 7,
            y: 8,
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "m")).anchor.tree,
        ).eqls(["vector", 5, 6]);
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "n")).anchor.tree,
        ).eqls(["vector", 7, 8]);
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            ["vector", 5, 6],
            ["vector", 7, 8],
            ["vector", 5, 6],
            ["vector", 0, 0],
        ]);
    });

    it("an entry from a component of another type is drawn and dragged as that component", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <mathList name="ml"><number name="n" anchor="(1,2)" layer="3">5</number></mathList>
      <textList><math name="m" anchor="(3,4)" fixed>x</math></textList>
    </graph>
    <p name="p">$ml[1].anchor</p>
    `,
        });

        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((entry) => entry.anchor)).eqls([
            ["vector", 1, 2],
            ["vector", 3, 4],
        ]);
        expect(drawn.map((entry) => entry.layer)).eqls([3, 0]);
        expect(drawn.map((entry) => entry.fixed)).eqls([false, true]);

        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            x: 5,
            y: 6,
        });
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            x: 7,
            y: 8,
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "n")).anchor.tree,
        ).eqls(["vector", 5, 6]);
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "m")).anchor.tree,
        ).eqls(["vector", 3, 4]);
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            ["vector", 5, 6],
            ["vector", 3, 4],
        ]);
        expect((await stateValuesOf(core, resolvePathToNodeIdx, "p")).text).eq(
            "(5, 6)",
        );
    });

    it("a reference to the whole list drawn in a graph is placed and dragged as the list's entries", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl"><number name="n" anchor="(1,2)">5</number> 3</numberList>
    <graph name="g">$nl</graph>
    `,
        });

        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            ["vector", 1, 2],
            ["vector", 0, 0],
        ]);
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            x: -4,
            y: 3,
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "n")).anchor.tree,
        ).eqls(["vector", -4, 3]);
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            ["vector", -4, 3],
            ["vector", 0, 0],
        ]);
    });

    it("a collect, sort or shuffle of values in a graph is a list, drawn and dragged at its sources", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g1">
      <number name="a" anchor="(1,1)">3</number>
      <number name="b" anchor="(2,2)">1</number>
    </graph>
    <graph name="g2"><collect name="c" componentType="number" from="$g1" /></graph>
    <graph name="g3"><sort name="s">$a $b</sort></graph>
    <graph name="g4"><shuffle name="sh">$a $b</shuffle></graph>
    `,
        });

        for (const name of ["c", "s", "sh"]) {
            expect(
                (core as any).core._components[await resolvePathToNodeIdx(name)]
                    .constructor.listEntryComponentType,
                name,
            ).eq("number");
        }
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g2")).eqls([
            ["vector", 1, 1],
            ["vector", 2, 2],
        ]);
        // sorted by value: b, then a
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g3")).eqls([
            ["vector", 2, 2],
            ["vector", 1, 1],
        ]);

        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g2",
            index: 0,
            x: 5,
            y: 5,
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "a")).anchor.tree,
        ).eqls(["vector", 5, 5]);

        // dragging moves the source and leaves the order, which is by value
        await drag({
            core,
            resolvePathToNodeIdx,
            graph: "g3",
            index: 0,
            x: -6,
            y: 7,
        });
        expect(
            (await stateValuesOf(core, resolvePathToNodeIdx, "b")).anchor.tree,
        ).eqls(["vector", -6, 7]);
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g3")).eqls([
            ["vector", -6, 7],
            ["vector", 5, 5],
        ]);
        expect(await anchorsDrawnIn(core, resolvePathToNodeIdx, "g2")).eqls([
            ["vector", 5, 5],
            ["vector", -6, 7],
        ]);
        expect(
            (await anchorsDrawnIn(core, resolvePathToNodeIdx, "g4")).sort(),
        ).eqls([
            ["vector", -6, 7],
            ["vector", 5, 5],
        ]);
    });
});
