import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A reference to one entry of a list component (`$pl[2]`;
 * Doenet/DoenetML#2181) as the target of a chained action, a legend's label,
 * a `<ref>`, a `<callAction>` and a PreFigure annotation. The list holds its
 * entries in arrays and has no component per entry; the entry is named by the
 * index its renderer is given.
 */
describe("An entry of a list component as a target @group4", async () => {
    /** The children drawn in graph `name`, as its renderer is sent them. */
    async function drawnIn(core: any, resolvePathToNodeIdx: any, name: string) {
        const rendererState =
            core.core.rendererInstructionBuilder.rendererState;
        return rendererState[
            await resolvePathToNodeIdx(name)
        ].childrenInstructions.filter(
            (child: any) =>
                typeof child === "object" && child?.componentType !== "legend",
        );
    }

    /** Send `actionName` from the renderer of entry `index` (from 1). */
    async function actOnEntry({
        core,
        resolvePathToNodeIdx,
        graph,
        index,
        actionName,
    }: {
        core: any;
        resolvePathToNodeIdx: any;
        graph: string;
        index: number;
        actionName: string;
    }) {
        const drawn = await drawnIn(core, resolvePathToNodeIdx, graph);
        const componentIdx = drawn[index - 1].componentIdx;
        await core.requestAction({
            componentIdx,
            actionName,
            args: { componentIdx },
        });
    }

    async function valuesOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const values: Record<string, any> = {};
        for (const name of names) {
            values[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.value;
        }
        return values;
    }

    it("a click on an entry fires what names the entry, and what names the list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl"><point name="A">(1,2)</point> (3,4) (5,6)</pointList>
    </graph>
    <number name="nA">0</number>
    <number name="n1">0</number>
    <number name="n2">0</number>
    <number name="nAll">0</number>
    <number name="nBoth">0</number>
    <number name="nFocus">0</number>
    <updateValue target="$nA" newValue="$nA+1" triggerWhenObjectsClicked="$A" />
    <updateValue target="$n1" newValue="$n1+1" triggerWhenObjectsClicked="$pl[1]" />
    <updateValue target="$n2" newValue="$n2+1" triggerWhenObjectsClicked="$pl[2]" />
    <updateValue target="$nAll" newValue="$nAll+1" triggerWhenObjectsClicked="$pl" />
    <updateValue target="$nBoth" newValue="$nBoth+1" triggerWhenObjectsClicked="$pl $pl[2]" />
    <updateValue target="$nFocus" newValue="$nFocus+1" triggerWhenObjectsFocused="$pl[1]" />
    `,
        });
        const names = ["nA", "n1", "n2", "nAll", "nBoth", "nFocus"];

        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            actionName: "pointClicked",
        });
        expect(await valuesOf(core, resolvePathToNodeIdx, names)).eqls({
            nA: 0,
            n1: 0,
            n2: 1,
            nAll: 1,
            nBoth: 1,
            nFocus: 0,
        });

        // the entry from the authored point is the point, too
        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "pointClicked",
        });
        expect(await valuesOf(core, resolvePathToNodeIdx, names)).eqls({
            nA: 1,
            n1: 1,
            n2: 1,
            nAll: 2,
            nBoth: 2,
            nFocus: 0,
        });

        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 3,
            actionName: "pointClicked",
        });
        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "pointFocused",
        });
        expect(await valuesOf(core, resolvePathToNodeIdx, names)).eqls({
            nA: 1,
            n1: 1,
            n2: 1,
            nAll: 3,
            nBoth: 3,
            nFocus: 1,
        });
    });

    it("a click on an entry of a vector list, of a reference to the list, and of a fixed list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <vectorList name="vl">(1,2) (3,4)</vectorList>
    </graph>
    <graph name="g2">
      $vl
    </graph>
    <graph name="g3">
      <pointList name="fl" fixed>(1,2) (3,4)</pointList>
    </graph>
    <number name="n">0</number>
    <number name="nf">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$vl[2]" />
    <updateValue target="$nf" newValue="$nf+1" triggerWhenObjectsClicked="$fl[2] $fl" />
    `,
        });

        for (const [graph, index] of [
            ["g", 1],
            ["g", 2],
            ["g2", 1],
            ["g2", 2],
        ] as const) {
            await actOnEntry({
                core,
                resolvePathToNodeIdx,
                graph,
                index,
                actionName: "vectorClicked",
            });
        }
        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g3",
            index: 2,
            actionName: "pointClicked",
        });
        expect(await valuesOf(core, resolvePathToNodeIdx, ["n", "nf"])).eqls({
            n: 2,
            nf: 0,
        });
    });

    it("an entry named by an index that changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) (3,4) (5,6)</pointList>
    </graph>
    <integer name="i">2</integer>
    <number name="n">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$pl[$i]" />
    <updateValue name="setI" target="$i" newValue="3" />
    `,
        });

        async function clickEach() {
            for (const index of [1, 2, 3]) {
                await actOnEntry({
                    core,
                    resolvePathToNodeIdx,
                    graph: "g",
                    index,
                    actionName: "pointClicked",
                });
            }
        }

        await clickEach();
        expect((await valuesOf(core, resolvePathToNodeIdx, ["n"])).n).eq(1);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("setI"),
            actionName: "updateValue",
            args: {},
        });
        expect((await valuesOf(core, resolvePathToNodeIdx, ["i"])).i).eq(3);

        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            actionName: "pointClicked",
        });
        expect((await valuesOf(core, resolvePathToNodeIdx, ["n"])).n).eq(1);
        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 3,
            actionName: "pointClicked",
        });
        expect((await valuesOf(core, resolvePathToNodeIdx, ["n"])).n).eq(2);
    });

    it("an entry the list grows to, and indices that name no entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl"><repeatForSequence length="$k" valueName="v"><point>($v,1)</point></repeatForSequence></pointList>
      <legend name="legend"><label forObject="$pl[3]">third</label></legend>
    </graph>
    <integer name="k">2</integer>
    <number name="n">0</number>
    <number name="nBad">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$pl[3]" />
    <updateValue target="$nBad" newValue="$nBad+1" triggerWhenObjectsClicked="$pl[0] $pl[2.5] $pl[2][1] $pl[2].x" />
    <updateValue name="grow" target="$k" newValue="3" />
    <updateValue name="shrink" target="$k" newValue="2" />
    `,
        });

        async function legendLabels() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[
                await resolvePathToNodeIdx("legend")
            ].stateValues.legendElements.map((x: any) => x.label.value);
        }

        expect(await legendLabels()).eqls([]);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("grow"),
            actionName: "updateValue",
            args: {},
        });
        expect(await legendLabels()).eqls(["third"]);
        for (const index of [1, 2, 3]) {
            await actOnEntry({
                core,
                resolvePathToNodeIdx,
                graph: "g",
                index,
                actionName: "pointClicked",
            });
        }
        expect(await valuesOf(core, resolvePathToNodeIdx, ["n", "nBad"])).eqls({
            n: 1,
            nBad: 0,
        });

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("shrink"),
            actionName: "updateValue",
            args: {},
        });
        expect(await legendLabels()).eqls([]);
    });

    it("an entry named far past the end of the list does not slow it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) (3,4)</pointList>
    </graph>
    <number name="n">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$pl[4000000000]" />
    `,
        });

        // Each move of an entry updates the list's entries; only those drawn
        // or named are visited, not every index up to the one named.
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        for (const x of [5, 6, 7]) {
            await core.requestAction({
                componentIdx: drawn[0].componentIdx,
                actionName: "movePoint",
                args: { x, y: 2 },
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("pl")
            ].stateValues.points[0].map((x: any) => x.tree),
        ).eqls([7, 2]);
        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "pointClicked",
        });
        expect((await valuesOf(core, resolvePathToNodeIdx, ["n"])).n).eq(0);
    });

    it("a click or focus on an entry of a math, number or text list in a graph", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <mathList name="ml"><math name="a">x</math> y</mathList>
    </graph>
    <graph name="g2">
      <numberList name="nl">1 2</numberList>
      <textList name="tl">a b</textList>
    </graph>
    <number name="na">0</number>
    <number name="n1">0</number>
    <number name="n2">0</number>
    <number name="nn">0</number>
    <number name="nt">0</number>
    <updateValue target="$na" newValue="$na+1" triggerWhenObjectsClicked="$a" />
    <updateValue target="$n1" newValue="$n1+1" triggerWhenObjectsClicked="$ml[1]" />
    <updateValue target="$n2" newValue="$n2+1" triggerWhenObjectsClicked="$ml[2]" />
    <updateValue target="$nn" newValue="$nn+1" triggerWhenObjectsFocused="$nl[2]" />
    <updateValue target="$nt" newValue="$nt+1" triggerWhenObjectsClicked="$tl" />
    `,
        });
        const names = ["na", "n1", "n2", "nn", "nt"];

        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "mathClicked",
        });
        expect(await valuesOf(core, resolvePathToNodeIdx, names)).eqls({
            na: 1,
            n1: 1,
            n2: 0,
            nn: 0,
            nt: 0,
        });

        await actOnEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            actionName: "mathClicked",
        });
        expect(await valuesOf(core, resolvePathToNodeIdx, names)).eqls({
            na: 1,
            n1: 1,
            n2: 1,
            nn: 0,
            nt: 0,
        });

        // entries 1 and 2 of nl, then 1 and 2 of tl
        for (const [index, actionName] of [
            [2, "numberClicked"],
            [1, "numberFocused"],
            [2, "numberFocused"],
            [3, "textFocused"],
            [4, "textClicked"],
        ] as const) {
            await actOnEntry({
                core,
                resolvePathToNodeIdx,
                graph: "g2",
                index,
                actionName,
            });
        }
        expect(await valuesOf(core, resolvePathToNodeIdx, names)).eqls({
            na: 1,
            n1: 1,
            n2: 1,
            nn: 1,
            nt: 1,
        });
    });

    it("a legend's label for an entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl"><point styleNumber="2">(1,2)</point> (3,4)</pointList>
      <legend name="legend">
        <label forObject="$pl[2]">second</label>
        <label forObject="$pl[1]">first</label>
        <label forObject="$pl[5]">none</label>
      </legend>
    </graph>
    <graph name="g2">
      <pointList name="pl2">(1,2) (3,4)</pointList>
      <legend name="legend2">
        <label forObject="$pl[2]">elsewhere</label>
      </legend>
    </graph>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const legendElements =
            stateVariables[await resolvePathToNodeIdx("legend")].stateValues
                .legendElements;
        expect(legendElements.map((x: any) => x.label.value)).eqls([
            "second",
            "first",
        ]);
        const list = stateVariables[await resolvePathToNodeIdx("pl")];
        expect(legendElements[0].markerColor).eq(
            list.stateValues.selectedStyle.markerColor,
        );
        expect(legendElements[1].markerColor).eq(
            list.stateValues.entrySelectedStyle[0].markerColor,
        );
        expect(legendElements[1].markerColor).not.eq(
            legendElements[0].markerColor,
        );

        expect(
            stateVariables[await resolvePathToNodeIdx("legend2")].stateValues
                .legendElements,
        ).eqls([]);
    });

    it("a ref to an entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) (3,4)</pointList>
    </graph>
    <p><ref name="r" to="$pl[2]">second</ref></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const ref = stateVariables[await resolvePathToNodeIdx("r")];
        expect(ref.stateValues.url).eq("#pl:2");
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn[1].id).eq("pl:2");
    });

    it("a callAction on an entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) (3,4)</pointList>
    </graph>
    <number name="n">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$pl[2]" />
    <callAction name="ca" target="$pl[2]" actionName="POINTclicked" />
    <callAction name="bad" target="$pl[2]" actionName="noSuchAction" />
    `,
        });

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("ca"),
            actionName: "callAction",
            args: {},
        });
        expect((await valuesOf(core, resolvePathToNodeIdx, ["n"])).n).eq(1);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("bad"),
            actionName: "callAction",
            args: {},
        });
        const { warnings } = getDiagnosticsByType(core);
        expect(
            warnings.some(
                (x) =>
                    x.message.includes("noSuchAction") &&
                    x.message.includes("$pl[2]"),
            ),
        ).eq(true);
    });

    it("a PreFigure annotation of an entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g" renderer="prefigure">
      <pointList name="pl">(1,2) (3,4)</pointList>
      <vectorList name="vl">(1,0) (0,1)</vectorList>
      <annotations>
        <annotation ref="$pl[2]" text="second point" />
        <annotation ref="$vl[1]" text="first vector" />
      </annotations>
    </graph>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const xml: string =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;
        const pointHandles = [...xml.matchAll(/<point at="([^"]+)"/g)].map(
            (m) => m[1],
        );
        const vectorHandles = [...xml.matchAll(/<vector at="([^"]+)"/g)].map(
            (m) => m[1],
        );
        expect(pointHandles.length).eq(2);
        expect(vectorHandles.length).eq(2);
        expect(xml).toContain(
            `<annotation ref="${pointHandles[1]}" text="second point"></annotation>`,
        );
        expect(xml).toContain(
            `<annotation ref="${vectorHandles[0]}" text="first vector"></annotation>`,
        );
        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.filter((x) => x.message.includes("<annotation>"))).eqls(
            [],
        );
    });
});
