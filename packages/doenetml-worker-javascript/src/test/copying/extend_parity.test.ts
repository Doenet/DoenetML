import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A bare reference (`$m`) is a shortcut for the `extend` written out with
 * nothing else on it (`<math extend="$m"/>`): an `extend` is needed only to
 * change the type, or to add a name, another attribute or a child. Where
 * the two would be the same, they are made the same way, so that they
 * behave the same.
 */

const SOURCES = `
    <booleanInput name="h" />
    <math name="m" displayDigits="5" hide="$h">1.23456789</math>
    <number name="n" displayDigits="5">1.23456789</number>
    <text name="t" hide="$h">hi</text>
    <boolean name="b">true</boolean>
    <point name="P">(1,2)</point>
`;

// `[tag, reference]`: the tag is the type of what the reference reads
const REFERENCES: [string, string][] = [
    ["math", "$m"],
    ["number", "$n"],
    ["text", "$t"],
    ["boolean", "$b"],
    ["math", "$m.value"],
    ["number", "$n.value"],
    ["math", "$P.x"],
];

// `[open, close]`, around the reference
const CONTAINERS: [string, string][] = [
    ["<p NAME>", "</p>"],
    ["<p fixed NAME>", "</p>"],
    ["<math NAME>", "+1</math>"],
    ["<text NAME>", "!</text>"],
];

describe("A bare reference and the extend written out @group4", () => {
    it("are made and shown the same way", async () => {
        let doenetML = SOURCES;
        const cases: string[] = [];
        REFERENCES.forEach(([tag, reference], i) =>
            CONTAINERS.forEach(([open, close], j) => {
                doenetML +=
                    open.replace("NAME", `name="bare_${i}_${j}"`) +
                    reference +
                    close;
                doenetML +=
                    open.replace("NAME", `name="extend_${i}_${j}"`) +
                    `<${tag} extend="${reference}" />` +
                    close;
                cases.push(`${i}_${j}`);
            }),
        );
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function compare() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const firstChild = (container: any) => {
                const child = container.activeChildren.find(
                    (child: any) => typeof child === "object",
                );
                return child ? stateVariables[child.componentIdx] : undefined;
            };
            for (const name of cases) {
                const [i, j] = name.split("_").map(Number);
                const label = `${REFERENCES[i][1]} in ${CONTAINERS[j][0]}`;
                const bare =
                    stateVariables[await resolvePathToNodeIdx(`bare_${name}`)];
                const extend =
                    stateVariables[
                        await resolvePathToNodeIdx(`extend_${name}`)
                    ];
                expect(extend.stateValues.text, label).eq(
                    bare.stateValues.text,
                );
                expect(firstChild(extend)?.componentType, label).eq(
                    firstChild(bare)?.componentType,
                );
            }
        }

        await compare();

        // a hidden source hides both or neither
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h"),
            core,
        });
        await compare();
    });

    it("an extend that changes the type, or adds anything, stays a component", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m">1.5</math>
    <p name="p1"><number extend="$m" /></p>
    <p name="p2"><math extend="$m" name="named" /></p>
    <p name="p3"><math extend="$m" displayDigits="1" /></p>
    <p name="p4"><math copy="$m" /></p>
    <p name="p5">$m</p>
    <p name="p6"><math extend="$m" /></p>
    <p name="p9"><math extend="$m"><math>2</math></math></p>
    <section name="s"><math renderMode="display">2</math></section>
    <collect componentType="math" from="$s" name="c" />
    <p name="p7"><math extend="$c[1]" /></p>
    <p name="p8"><math extend="$c[1].value" /></p>
    <graph name="g"><point name="P">(1,2)</point><point extend="$P" /></graph>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const firstChildType = async (name: string) => {
            const child = stateVariables[
                await resolvePathToNodeIdx(name)
            ].activeChildren.find((child: any) => typeof child === "object");
            return stateVariables[child.componentIdx].componentType;
        };
        expect(await firstChildType("p1")).eq("number");
        expect(await firstChildType("p2")).eq("math");
        expect(await firstChildType("p3")).eq("math");
        expect(await firstChildType("p4")).eq("math");
        expect(await firstChildType("p5")).eq("_ref");
        expect(await firstChildType("p6")).eq("_ref");
        // one with a child keeps it
        expect(await firstChildType("p9")).eq("math");
        expect(
            stateVariables[await resolvePathToNodeIdx("p9")].stateValues.text,
        ).eq("1.5 * 2");
        // a copy of a list's entry, typeset as the entry is, which a
        // reference to the entry is not
        expect(await firstChildType("p7")).eq("math");
        expect(await firstChildType("p8")).eq("math");
        // a graph draws a point, not a value reference
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].activeChildren.map(
                (child: any) =>
                    stateVariables[child.componentIdx].componentType,
            ),
        ).eqls(["point", "point"]);
    });
    it("are the same in an answer that records the references in its awards", async () => {
        // An answer with no input of its own marks every reference in its
        // awards as a potential response, which an extend with nothing else
        // on it takes as the bare reference does. One whose mark the author
        // wrote stays a component.
        const award = (mi: string, ti: string) =>
            `<award><when>${mi} = x and ${ti} = hello</when></award>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" /> <textInput name="ti" />
    <answer name="bare">${award("$mi", "$ti")}</answer>
    <answer name="extend">${award('<math extend="$mi" />', '<text extend="$ti" />')}</answer>
    <answer name="marked">${award('<math extend="$mi" isResponse />', "$ti")}</answer>
    `,
        });

        async function answer(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const ans = stateVariables[await resolvePathToNodeIdx(name)];
            const when =
                stateVariables[
                    stateVariables[ans.activeChildren[0].componentIdx]
                        .activeChildren[0].componentIdx
                ];
            const references = when.activeChildren
                .filter((child: any) => typeof child === "object")
                .map((child: any) => stateVariables[child.componentIdx]);
            return {
                types: references.map((c: any) => c.componentType),
                marks: references.map((c: any) => [
                    c.stateValues.isResponse,
                    c.stateValues.isPotentialResponse,
                ]),
                responses: ans.stateValues.submittedResponses.map((r: any) =>
                    r?.tree !== undefined ? r.tree : r,
                ),
                responseTypes: ans.stateValues.submittedResponsesComponentType,
                credit: ans.stateValues.creditAchieved,
            };
        }

        expect((await answer("bare")).types).eqls(["_ref", "_ref"]);
        expect((await answer("extend")).types).eqls(["_ref", "_ref"]);
        expect((await answer("marked")).types).eqls(["math", "_ref"]);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateTextInputValue({
            text: "hello",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        for (const name of ["bare", "extend", "marked"]) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        }
        const bare = await answer("bare");
        expect(bare.marks).eqls([
            [false, true],
            [false, true],
        ]);
        expect(bare.responses).eqls(["x", "hello"]);
        expect(bare.responseTypes).eqls(["math", "text"]);
        expect(bare.credit).eq(1);
        expect(await answer("extend")).eqls(bare);
        const marked = await answer("marked");
        // what the author marks a response is the only one recorded
        expect(marked.marks[0][0]).eq(true);
        expect(marked.responses).eqls(["x"]);
        expect(marked.credit).eq(1);
    });
});
