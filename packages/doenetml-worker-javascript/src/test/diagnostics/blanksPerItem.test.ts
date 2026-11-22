import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A property after a `<conditionalContent>` or a `<group>` whose items
 * include ones lacking it, or items that are wrappers of several components,
 * gives one blank `＿` per such item, in every parent (D40 decisions 1 and 5, D41 decision 3,
 * VAL-5): a `<p>`, a `<text>`, a `<math>` (which holds the blanks as it
 * holds the items' values), a `<mathList>`, a `<number>` (missing), an
 * attribute, `bindValueTo` and an `extend`. A collection with no items
 * gives nothing. After a collection (a repeat, a select that picks several,
 * a list), a property or a name names nothing, decided at load, as the
 * collection's own properties are the only ones after it (D59). At each
 * step, the same values and diagnostics after a reload (DIAG-6).
 */

/** Where `$R.x` is read, `R` replaced by the collection's name. */
const parents: Record<string, string> = {
    p: `<p name="p">$R.x</p>`,
    t: `<text name="t">$R.x</text>`,
    m: `<math name="m">$R.x+1</math>`,
    ml: `<mathList name="ml0">$R.x</mathList><p name="ml">$ml0</p>`,
    nm: `<number name="nm">$R.x</number>`,
    pQ: `<point name="Q" x="$R.x" y="3"/><p name="pQ">$Q</p>`,
    pL: `<line name="L" through="$R.x (5,6)"/><p name="pL">$L</p>`,
    bv: `<mathInput name="bvi" bindValueTo="$R.x"/><p name="bv">$bvi</p>`,
    me: `<math name="me" extend="$R.x"/>`,
    ne: `<number name="ne" extend="$R.x"/>`,
};

type Values = Record<keyof typeof parents, string>;

/**
 * The values when each item gives a blank: `n` blanks, or nothing when
 * `n` is 0. A math holds them as a tuple of `n` (one blank alone); a number
 * of a blank is missing (`NaN`); `<math extend>` of a property of several
 * items is a blank, and `<number extend>` `NaN`, whatever they hold
 * (not decided by the blanks).
 */
function blanks(n: number): Values {
    const list = Array(n).fill("＿").join(", ");
    const math = n === 1 ? "＿" : n === 0 ? "＿" : `(${list})`;
    return {
        p: list,
        t: list,
        m: `${math} + 1`,
        ml: list,
        nm: "NaN",
        pQ: `(${math}, 3)`,
        pL: n === 0 ? "0 = 6 x - 5 y" : "＿",
        bv: n === 0 ? "＿" : list,
        me: "＿",
        ne: "NaN",
    };
}

/** The values when the one item shown is the point `(1,2)`. */
const point12: Values = {
    p: "1",
    t: "1",
    m: "1 + 1",
    ml: "1",
    nm: "1",
    pQ: "(1, 3)",
    pL: "0 = -6 x + 4 y + 6",
    bv: "1",
    me: "1",
    ne: "1",
};

/**
 * The values of a reference that names nothing (`$nothing`), as one after a
 * collection does (D59, `doenet-w0199`): a blank, or missing in a parent
 * that needs a value, and a missing tag.
 */
const nothing: Values = {
    p: "＿",
    t: "＿",
    m: "＿ + 1",
    ml: "＿",
    nm: "NaN",
    pQ: "(＿, 3)",
    pL: "＿",
    bv: "＿",
    me: "＿",
    ne: "NaN",
};

/**
 * The values when the items are points with these x's: a `<number>` of
 * several is their product, and the line is through what `$R.x` and `(5,6)`
 * give.
 */
function points(pL: string, ...xs: string[]): Values {
    const list = xs.join(", ");
    return {
        p: list,
        t: list,
        m: `(${list}) + 1`,
        ml: list,
        nm: String(xs.reduce((a, x) => a * Number(x), 1)),
        pQ: `((${list}), 3)`,
        pL,
        bv: list,
        me: "＿",
        ne: "NaN",
    };
}

type Step = {
    /** the input set before checking, as `[name, value]` */
    set?: [string, string | boolean];
    values: Values;
    /** counts by `type code` */
    diagnostics: Record<string, number>;
};

const n = Object.keys(parents).length;
const severalWarning = { "warning doenet-w0193": n };
// A repeat's template holding several is decided at load, from the
// template, so its warning stays at 0 iterations (#2548 item 3, DIAG-7).
const repeat = (count: string, template: string) =>
    `<mathInput name="n" prefill="${count}"/><repeatForSequence name="r" length="$n" valueName="v">${template}</repeatForSequence>`;
const twoPoints = `<point>($v,1)</point><point>($v,2)</point>`;

const cases: {
    name: string;
    source: string;
    ref: string;
    steps: Step[];
}[] = [
    {
        name: "a group of several",
        source: `<group name="g"><point>(1,2)</point><point>(3,4)</point></group>`,
        ref: "g",
        steps: [{ values: blanks(1), diagnostics: severalWarning }],
    },
    {
        name: "a case shown in turn and an else lacking the property",
        source: `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><point>(1,2)</point></case><else><text>hi</text></else></conditionalContent>`,
        ref: "cc",
        steps: [
            {
                values: blanks(1),
                diagnostics: { "warning doenet-w0192": n },
            },
            {
                set: ["b", true],
                values: point12,
                diagnostics: { "warning doenet-w0192": n },
            },
            {
                set: ["b", false],
                values: blanks(1),
                diagnostics: { "warning doenet-w0192": n },
            },
        ],
    },
    {
        name: "a case shown in turn and an else holding several",
        source: `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><point>(1,2)</point></case><else><point>(3,4)</point><point>(5,6)</point></else></conditionalContent>`,
        ref: "cc",
        steps: [
            {
                values: blanks(1),
                diagnostics: {
                    "warning doenet-w0191": n,
                    "info doenet-w0193": n,
                },
            },
            {
                set: ["b", true],
                values: point12,
                diagnostics: { "warning doenet-w0191": n },
            },
            {
                set: ["b", false],
                values: blanks(1),
                diagnostics: {
                    "warning doenet-w0191": n,
                    "info doenet-w0193": n,
                },
            },
        ],
    },
    {
        name: "a case of several, shown after none and hidden again",
        source: `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><point>(1,2)</point><point>(3,4)</point></case></conditionalContent>`,
        ref: "cc",
        steps: [
            {
                values: blanks(0),
                diagnostics: { "warning doenet-w0191": n },
            },
            {
                set: ["b", true],
                values: blanks(1),
                diagnostics: { "warning doenet-w0191": n },
            },
            {
                set: ["b", false],
                values: blanks(0),
                diagnostics: { "warning doenet-w0191": n },
            },
        ],
    },
    // A name or a property after a collection is the collection's own
    // (D59): anything else names nothing, decided at load, whatever the
    // items hold and however many there are, as a reference that names
    // nothing does in every parent (`nothing`).
    ...[
        ["2", twoPoints, "r", "two points"],
        ["0", twoPoints, "r", "two points"],
        [
            "2",
            `<point name="P">($v,1)</point><text>a</text>`,
            "r.P",
            "a point and a text",
        ],
        ["2", `<point>($v,1)</point>`, "r", "one point"],
    ].map(([count, template, ref, holding]) => ({
        name: `after ${count} iterations of ${holding}: \`$${ref}.x\``,
        source: repeat(count, template),
        ref,
        steps: [
            {
                values: nothing,
                diagnostics: { "warning doenet-w0199": n },
            },
            {
                set: ["n", "3"] as [string, string],
                values: nothing,
                diagnostics: { "warning doenet-w0199": n },
            },
        ],
    })),
    ...[
        `<select name="s" numToSelect="2"><option><point>(1,2)</point></option><option><text>hi</text></option></select>`,
        `<select name="s" numToSelect="2"><option><point name="P">(1,2)</point><text>a</text></option><option><point name="P">(2,4)</point></option></select>`,
        `<pointList name="s">(1,2) (3,4)</pointList>`,
    ].map((source) => ({
        name: `after ${source}`,
        source,
        ref: source.includes('name="P"') ? "s.P" : "s",
        steps: [
            {
                values: nothing,
                diagnostics: { "warning doenet-w0199": n },
            },
        ],
    })),
];

async function state(core: any, resolvePathToNodeIdx: any) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    const values: Record<string, string> = {};
    for (const name of Object.keys(parents)) {
        const component = stateVariables[await resolvePathToNodeIdx(name)];
        const stateValues = component.stateValues;
        values[name] =
            component.componentType === "_error"
                ? "error"
                : String(stateValues.text ?? stateValues.value);
    }
    const diagnostics: Record<string, number> = {};
    for (const d of core.core.diagnostics) {
        if (d.code?.startsWith("doenet-a")) {
            continue;
        }
        const key = `${d.type} ${d.code}`;
        diagnostics[key] = (diagnostics[key] ?? 0) + 1;
    }
    return { values, diagnostics };
}

describe("A blank for each item lacking a property, in every parent (#2452, D40, D41, D59)", () => {
    for (const { name, source, ref, steps } of cases) {
        it(name, async () => {
            const doenetML =
                source +
                Object.values(parents)
                    .map((parent) => parent.replaceAll("$R", `$${ref}`))
                    .join("\n");
            const { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });
            for (const [ind, step] of steps.entries()) {
                if (step.set) {
                    const [input, value] = step.set;
                    const componentIdx = await resolvePathToNodeIdx(input);
                    if (typeof value === "boolean") {
                        await updateBooleanInputValue({
                            boolean: value,
                            componentIdx,
                            core,
                        });
                    } else {
                        await updateMathInputValue({
                            latex: value,
                            componentIdx,
                            core,
                        });
                    }
                }
                const expected = {
                    values: step.values,
                    diagnostics: step.diagnostics,
                };
                const label = `step ${ind}${step.set ? ` (${step.set.join(" = ")})` : ""}`;
                expect(
                    await state(core, resolvePathToNodeIdx),
                    `${label}, live`,
                ).eqls(expected);

                await core.saveImmediately();
                const reloaded = await createTestCore({
                    doenetML,
                    initialState: scoreState.state,
                });
                expect(
                    await state(reloaded.core, reloaded.resolvePathToNodeIdx),
                    `${label}, after a reload`,
                ).eqls(expected);
            }
        });
    }
});
