import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");

const OUT = process.env.RV1_OUT!;

type Step =
    | { drag: string; args: any; action?: string }
    | { restore: true };

const coordVariants = [
    "(1,2)",
    "(-1.5, .5)",
    "( 1 , 2 )",
    " (1,2) ",
    "(-0,2)",
    "(1.,2)",
    "(-.5,-0.25)",
    "(- 1, 2)",
    "3",
    "-2.5",
    "(1,2,3)",
    "(a,2)",
    "(1e3,2)",
    "(1E3,2)",
    "(2pi,1)",
    "(2 3,1)",
    "(1,)",
    "()",
    "(,)",
    "(1,2",
    "1,2",
    "[1,2]",
    "<1,2>",
    "(0.1,2)",
    "(00.10,2)",
    "$P",
    "($x,1)",
    "($x)",
    "(1,2) ",
];

const scenarios: { name: string; doc: string; steps: Step[] }[] = [];

for (const v of coordVariants) {
    scenarios.push({
        name: `coords ${JSON.stringify(v)}`,
        doc: `<graph><point name="P">(5,6)</point><number name="x">7</number>
<math name="m" anchor="${v}" draggable>x</math></graph>
<point name="ap" extend="$m.anchor"/><math name="ax" extend="$m.anchor.x"/><math name="ay" extend="$m.anchor.y"/>`,
        steps: [
            { drag: "m", args: { x: 3, y: -5 } },
            { drag: "m", args: { x: 8 } },
            { drag: "m", args: { y: 9 } },
            { restore: true },
            { drag: "m", args: { x: 4, y: 4 } },
            { restore: true },
        ],
    });
}

for (const [label, doc] of [
    ["draggable false", `<graph><text name="m" anchor="(1,2)" draggable="false">a</text></graph>`],
    ["fixed owner", `<graph><text name="m" anchor="(1,2)" fixed>a</text></graph>`],
    ["fixed graph", `<graph fixed><text name="m" anchor="(1,2)">a</text></graph>`],
    ["fixLocation", `<graph><text name="m" anchor="(1,2)" fixLocation>a</text></graph>`],
    ["number", `<graph><number name="m" anchor="(1,2)">5</number></graph>`],
    ["label", `<graph><label name="m" anchor="(1,2)">hi</label></graph>`],
    ["image", `<graph><image name="m" anchor="(1,2)" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" /></graph>`],
    ["3d anchor", `<graph><text name="m" anchor="(1,2,3)">a</text></graph>`],
    ["1d anchor", `<graph><text name="m" anchor="4">a</text></graph>`],
    ["splitSymbols false", `<graph><math name="m" anchor="(1,2)" splitSymbols="false">xy</math></graph>`],
    ["sci notation", `<graph><math name="m" anchor="(1,2)" parseScientificNotation>xy</math></graph>`],
]) {
    scenarios.push({
        name: label,
        doc,
        steps: [
            { drag: "m", args: { x: 3, y: -5 } },
            { drag: "m", args: { x: 8 } },
            { restore: true },
            { drag: "m", args: { x: 4, y: 4 } },
            { restore: true },
        ],
    });
}

scenarios.push({
    name: "copies",
    doc: `<graph>
<math name="m" anchor="(1,2)">x</math>
<math name="e" extend="$m"/>
<math name="c" copy="$m"/>
<math name="e2" extend="$m" anchor="(7,8)"/>
<math name="c2" copy="$m" anchor="(7,8)"/>
<math name="ee" extend="$e"/>
</graph>
<math name="outside" extend="$m"/>`,
    steps: [
        { drag: "m", args: { x: 3, y: -5 } },
        { drag: "e", args: { x: 4, y: 6 } },
        { drag: "c", args: { x: -1, y: -1 } },
        { drag: "e2", args: { x: 10, y: 11 } },
        { drag: "c2", args: { x: 12, y: 13 } },
        { drag: "ee", args: { x: 0, y: 1 } },
        { restore: true },
        { drag: "m", args: { x: 2, y: 2 } },
        { drag: "c", args: { x: 5 } },
        { restore: true },
    ],
});

scenarios.push({
    name: "copy after drag",
    doc: `<graph>
<math name="m" anchor="(1,2)">x</math>
</graph>
<graph><math name="e" extend="$m"/><math name="c" copy="$m"/></graph>`,
    steps: [
        { drag: "m", args: { x: 3, y: -5 } },
        { restore: true },
        { drag: "c", args: { x: 6, y: 6 } },
        { restore: true },
    ],
});

scenarios.push({
    name: "value lists",
    doc: `<graph name="g">
<numberList name="nl"><number name="n1" anchor="(1,2)">5</number> 3</numberList>
<mathList name="ml"><math name="m1" anchor="(4,5)">x</math><math name="m2" anchor="(a,5)">y</math></mathList>
<textList name="tl"><text name="m" anchor="(-1,-2)">a</text></textList>
</graph>`,
    steps: [
        { drag: "n1", args: { x: 3, y: -5 } },
        { drag: "m1", args: { x: 7 } },
        { drag: "m", args: { x: 2, y: 2 } },
        { restore: true },
        { drag: "n1", args: { x: 0, y: 0 } },
    ],
});

scenarios.push({
    name: "repeat",
    doc: `<graph><repeat name="r" for="1 2" valueName="v"><text anchor="(1,2)">a</text></repeat></graph>`,
    steps: [],
});

scenarios.push({ name: "y only first", doc: `<graph><text name="m" anchor="(1,2)">a</text></graph>`, steps: [{ drag: "m", args: { y: 9 } }, { restore: true }, { drag: "m", args: { x: 7 } }] });
scenarios.push({ name: "3d y only", doc: `<graph><text name="m" anchor="(1,2,3)">a</text></graph>`, steps: [{ drag: "m", args: { y: 9 } }, { drag: "m", args: { z: 5 } }, { drag: "m", args: { x: 1, y:1, z: 1 } }] });
scenarios.push({ name: "linked point", doc: `<graph><text name="m" anchor="(1,2)">a</text><point name="ap" extend="$m.anchor"/></graph>`, steps: [{ drag: "ap", args: { x: 3, y: 4 } }, { drag: "ap", args: { x: 5 } }, { restore: true }, { drag: "ap", args: { x: -1, y: -2 } }] });
scenarios.push({ name: "linked point 1d", doc: `<graph><text name="m" anchor="4">a</text><point name="ap" extend="$m.anchor"/></graph>`, steps: [{ drag: "ap", args: { x: 3, y: 4 } }, { restore: true }] });
const ACTION: Record<string, string> = {
    point: "movePoint",
    math: "moveMath",
    number: "moveNumber",
    text: "moveText",
    label: "moveLabel",
    image: "moveImage",
};

it("probe", async () => {
    const L: string[] = [];
    const fmt = (v: any): string => {
        if (v === undefined) return "undef";
        if (v?.tree !== undefined) return JSON.stringify(v.tree);
        if (Array.isArray(v)) return "[" + v.map(fmt).join(",") + "]";
        return JSON.stringify(v);
    };
    for (const sc of scenarios) {
        L.push(`=== ${sc.name}`);
        try {
            let tc: any = await createTestCore({ doenetML: sc.doc });
            const dump = async (tag: string) => {
                const sv = await tc.core.returnAllStateVariables(false, true);
                const parts: string[] = [];
                const rs = tc.core.core.rendererInstructionBuilder?.rendererState;
                for (const n of ["m","e","c","e2","c2","ee","outside","n1","m1","m2","g","nl","ml","tl","ap"]) {
                    let idx;
                    try { idx = await tc.resolvePathToNodeIdx(n); } catch { continue; }
                    const s = sv[idx]?.stateValues;
                    if (!s) continue;
                    for (const v of ["anchor","entryAnchor","coords"]) if (v in s) parts.push(`${n}.${v}=${(s[v]?.tree === undefined && Array.isArray(s[v]) && s[v][0]==="vector" ? "RAW" : "") + fmt(s[v])}`);
                    const r = rs?.[idx]?.stateValues;
                    if (r) for (const v of ["anchor","entryAnchor"]) if (v in r) parts.push(`R:${n}.${v}=${(r[v]?.tree === undefined && Array.isArray(r[v]) && r[v][0]==="vector" ? "RAW" : "") + fmt(r[v])}`);
                }
                L.push(`  [${tag}] ` + parts.join(" "));
            };
            await dump("init");
            for (const step of sc.steps) {
                try {
                    if ("restore" in step) {
                        await tc.core.saveImmediately();
                        const state = tc.scoreState.state;
                        tc = await createTestCore({
                            doenetML: sc.doc,
                            initialState: state,
                        });
                        await dump("restored");
                    } else {
                        const idx = await tc.resolvePathToNodeIdx(step.drag);
                        const ct = tc.core.core._components[idx].componentType;
                        await tc.core.requestAction({
                            componentIdx: idx,
                            actionName: ACTION[ct],
                            args: step.args,
                        });
                        await dump(`drag ${step.drag} ${JSON.stringify(step.args)}`);
                    }
                } catch (e: any) {
                    L.push(`  step ERROR ${e?.message}`);
                }
            }
        } catch (e: any) {
            L.push(`  ERROR ${e?.message}`);
        }
    }
    require("fs").writeFileSync(OUT, L.join("\n"));
}, 1800000);
