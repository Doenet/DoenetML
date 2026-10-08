import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    clickComponent,
    movePoint,
    updateBooleanInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `fixed` and `fixLocation` describe where a component is, so a reference
 * gets them the same way whatever its form: its own attribute decides;
 * otherwise it is fixed when its source is or where it sits is (its parent,
 * or a `<group>` it sits in). A `false` anywhere only stops that one from
 * fixing it. An unlinked copy takes what the document set on its source when
 * it was made, in place of its source.
 */

const SOURCES = `
    <math name="m" SRC>y</math>
    <number name="n" SRC>2</number>
    <text name="t" SRC>hi</text>
    <boolean name="b" SRC>true</boolean>
    <point name="P" SRC>(1,2)</point>
    <mathList name="ml" SRC>a b</mathList>
    <pointList name="pl" SRC>(1,2) (3,4)</pointList>
    <mathInput name="mi" SRC />
`;

// every form of reference, as `[tag, how, reference]`
const REFERENCES: [string, string, string][] = [
    ["math", "extend", "$m"],
    ["math", "extend", "$m.value"],
    ["math", "copy", "$m"],
    ["math", "copy", "$m.value"],
    ["number", "extend", "$n"],
    ["number", "extend", "$n.value"],
    ["text", "extend", "$t"],
    ["text", "extend", "$t.value"],
    ["boolean", "extend", "$b"],
    ["boolean", "extend", "$b.value"],
    ["boolean", "copy", "$b"],
    ["point", "extend", "$P"],
    ["point", "copy", "$P"],
    ["math", "extend", "$P.x"],
    ["math", "copy", "$P.x"],
    ["math", "extend", "$ml[1]"],
    ["math", "copy", "$ml[1]"],
    ["point", "extend", "$pl[1]"],
    ["point", "copy", "$pl[1]"],
    ["mathInput", "extend", "$mi"],
    ["math", "extend", "$mi"],
];

// where the references sit, and whether that fixes them
const CONTAINERS: [string, string, string, boolean][] = [
    ["none", "", "", false],
    ["fixedP", "<p ATTR>", "</p>", true],
    ["unfixedP", '<p ATTR="false">', "</p>", false],
    ["fixedGroup", "<group ATTR>", "</group>", true],
    ["fixedGraph", "<graph ATTR>", "</graph>", true],
];

// how the sources are written, and whether that fixes them
const SOURCE_SETTINGS: [string, string, boolean][] = [
    ["unset", "", false],
    ["fixed", "ATTR", true],
    ["unfixed", 'ATTR="false"', false],
];

async function referenceGrid(attribute: string) {
    const results: Record<string, boolean> = {};
    for (const [settingName, setting] of SOURCE_SETTINGS) {
        let doenetML = SOURCES.replaceAll("SRC", setting);
        for (const [containerName, open, close] of CONTAINERS) {
            doenetML += open;
            REFERENCES.forEach(([tag, how, reference], i) => {
                // a graph holds only what it can draw
                if (
                    containerName === "fixedGraph" &&
                    !["point", "math", "text", "number"].includes(tag)
                ) {
                    return;
                }
                doenetML += `<${tag} ${how}="${reference}" name="r_${containerName}_${i}" />`;
            });
            doenetML += close;
        }
        doenetML = doenetML.replaceAll("ATTR", attribute);

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const [containerName] of CONTAINERS) {
            for (let i = 0; i < REFERENCES.length; i++) {
                const name = `r_${containerName}_${i}`;
                let idx: number;
                try {
                    idx = await resolvePathToNodeIdx(name);
                } catch (e) {
                    continue;
                }
                if (!stateVariables[idx]) {
                    continue;
                }
                results[`${settingName} ${containerName} ${i}`] =
                    stateVariables[idx].stateValues[attribute];
            }
        }
    }
    return results;
}

describe("Fixed and fixLocation of references @group4", () => {
    for (const attribute of ["fixed", "fixLocation"]) {
        it(`every form of reference has the ${attribute} of its source or where it sits`, async () => {
            const results = await referenceGrid(attribute);
            for (const [settingName, , sourceFixed] of SOURCE_SETTINGS) {
                for (const [containerName, , , containerFixes] of CONTAINERS) {
                    REFERENCES.forEach(([tag, how, reference], i) => {
                        const key = `${settingName} ${containerName} ${i}`;
                        if (!(key in results)) {
                            return;
                        }
                        expect(
                            results[key],
                            `<${tag} ${how}="${reference}"/>, source ${settingName}, in ${containerName}`,
                        ).eq(sourceFixed || containerFixes);
                    });
                }
            }
        });
    }

    it("a reference's own attribute decides, as a component's does", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m">y</math>
    <math name="mf" fixed>y</math>
    <p fixed>
        <math extend="$m" fixed="false" name="a" />
        <math extend="$m.value" fixed="false" name="b" />
        <math copy="$mf" fixed="false" name="c" />
    </p>
    <math extend="$mf" fixed="false" name="d" />
    <math extend="$m" fixed name="e" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const [name, fixed] of [
            ["a", false],
            ["b", false],
            ["c", false],
            ["d", false],
            ["e", true],
        ] as const) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .fixed,
                name,
            ).eq(fixed);
        }
    });

    it("a reference reads the fixed of a reference it extends, not its attribute", async () => {
        // `c` is not fixed by its own attribute; `d` and `e` read that, and
        // `d` is fixed by its paragraph
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" fixed>y</math>
    <math extend="$m" fixed="false" name="c" />
    <p fixed><math extend="$c" name="d" /></p>
    <math extend="$c" name="e" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const fixed = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.fixed;
        expect(await fixed("c")).eq(false);
        expect(await fixed("d")).eq(true);
        expect(await fixed("e")).eq(false);
    });

    it("a component inside a copied one keeps the attribute written on it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p" fixed><math name="inner" fixed="false">y</math> <math name="other">z</math></p>
    <p extend="$p" name="q" />
    <p copy="$p" name="r" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const fixed = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.fixed;
        for (const p of ["p", "q", "r"]) {
            expect(await fixed(p), p).eq(true);
            expect(await fixed(`${p}.inner`), `${p}.inner`).eq(false);
            expect(await fixed(`${p}.other`), `${p}.other`).eq(true);
        }
    });

    it("a reference inside a copied component is fixed with what it references, whatever the copy's container sets", async () => {
        // `s.i` is a reference to the fixed `mf`; the `i` of an extend or
        // a copy of `s` stands for that reference too, so a fixed="false"
        // on the extend only stops it from fixing `i`
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="mf" fixed>y</math>
    <math name="m">y</math>
    <section name="s"><math extend="$mf" name="i" /><math extend="$m" name="j" /></section>
    <section extend="$s" fixed="false" name="s2" />
    <section copy="$s" fixed="false" name="s3" />
    <section extend="$s" name="s4" fixed />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const fixed = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.fixed;
        for (const s of ["s", "s2", "s3", "s4"]) {
            expect(await fixed(`${s}.i`), `${s}.i`).eq(true);
        }
        expect(await fixed("s.j")).eq(false);
        expect(await fixed("s2.j")).eq(false);
        expect(await fixed("s3.j")).eq(false);
        expect(await fixed("s4.j")).eq(true);
    });

    it("a reference to fixed itself can change it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" fixed>y</math>
    <booleanInput name="bi" extend="$m.fixed" />
    `,
        });
        const biIdx = await resolvePathToNodeIdx("bi");
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[biIdx].stateValues.value).eq(true);
        expect(stateVariables[biIdx].stateValues.fixed).eq(false);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: biIdx,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.fixed,
        ).eq(false);
    });

    it("a container's fixed=false does not unfix a reference to a fixed source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph fixed><point name="P">(1,2)</point></graph>
    <graph fixed="false"><point extend="$P" name="Q" /></graph>
    <graph fixed="false"><point extend="$P" fixed="false" name="R" /></graph>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.fixed,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("R")].stateValues.fixed,
        ).eq(false);
    });

    it("a reference drawn in a fixed paragraph is fixed, so a click on it does not fire", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup><text name="t">hello</text></setup>
    <p name="p1" fixed>$t</p>
    <p name="p2">$t</p>
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t" />
    `,
        });
        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        const nIdx = await resolvePathToNodeIdx("n");

        for (const [p, fires] of [
            ["p1", false],
            ["p2", true],
        ] as const) {
            const drawn = rendererState[
                await resolvePathToNodeIdx(p)
            ].childrenInstructions.find((child: any) => child?.componentType);
            expect(rendererState[drawn.componentIdx].stateValues.fixed, p).eq(
                !fires,
            );
            const before = (await core.returnAllStateVariables(false, true))[
                nIdx
            ].stateValues.value;
            await clickComponent({
                componentIdx: drawn.actions.textClicked.componentIdx,
                actionName: "textClicked",
                core,
            });
            const after = (await core.returnAllStateVariables(false, true))[
                nIdx
            ].stateValues.value;
            expect(after - before, p).eq(fires ? 1 : 0);
        }
    });

    it("an unlinked copy keeps what fixed its source when it was made", async () => {
        const doenetML = `
    <booleanInput name="bi" />
    <math name="m" fixed="$bi" fixLocation="$bi">x</math>
    <math copy="$m" name="c" />
    <p fixed><math copy="$m" name="d" /></p>
    <booleanInput name="bi2" prefill="true" />
    <math name="m2" fixed="$bi2">x</math>
    <math copy="$m2" name="c2" />
    <p fixed="false"><math copy="$m2" name="d2" /></p>
    `;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function check(expected: Record<string, boolean>) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name in expected) {
                const stateValues =
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .stateValues;
                expect(stateValues.fixed, name).eq(expected[name]);
                // `m` has fixLocation as it has fixed, and `c` keeps it
                if (name === "m" || name === "c") {
                    expect(stateValues.fixLocation, name).eq(expected[name]);
                }
            }
        }

        await check({
            m: false,
            c: false,
            d: true,
            m2: true,
            c2: true,
            d2: true,
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi2"),
            core,
        });
        await check({
            m: true,
            c: false,
            d: true,
            m2: false,
            c2: true,
            d2: true,
        });
    });

    it("an unlinked copy of a prop or list entry keeps what fixed its source's container", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p fixed>
        <math name="m">x</math>
        <point name="P">(1,2)</point>
        <mathList name="ml">a b</mathList>
        <sequence name="s" length="2" />
    </p>
    <math copy="$m.value" name="a" />
    <math copy="$P.x" name="b" />
    <math copy="$ml[1]" name="c" />
    <number copy="$s[1]" name="d" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["a", "b", "c", "d"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .fixed,
                name,
            ).eq(true);
        }
    });

    it("an unlinked copy of what a composite fixed is not fixed", async () => {
        // the entries of a sequence and a repeat's value are fixed by what
        // made them; a reference to one is, an unlinked copy is not
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sequence name="s" length="2" />
    <number extend="$s[1]" name="e" />
    <number copy="$s[1]" name="c" />
    <number copy="$e" name="ce" />
    <graph>
        <repeatForSequence name="r" length="1" valueName="i">
            <point name="A" x="1" y="2" />
            <number extend="$i" name="ei" />
            <number copy="$i" name="ci" />
        </repeatForSequence>
    </graph>
    <sequence name="sf" length="2" fixed="false" />
    <number extend="$sf[1]" name="ef" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const fixed = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.fixed;
        expect(await fixed("e")).eq(true);
        expect(await fixed("c")).eq(false);
        expect(await fixed("ce")).eq(false);
        expect(await fixed("r[1].ei")).eq(true);
        expect(await fixed("r[1].ci")).eq(false);
        expect(await fixed("ef")).eq(false);
    });

    it("a point extended into a fixed group cannot be dragged", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="P">(1,2)</point>
        <group fixed><point extend="$P" name="Q" /></group>
    </graph>
    `,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: 5,
            y: 6,
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.fixed,
        ).eq(true);
    });
});
