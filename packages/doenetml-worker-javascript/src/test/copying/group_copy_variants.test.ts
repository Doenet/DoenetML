import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

const variantIndices = [1, 2, 3, 4, 5];

async function selectedValues({
    doenetML,
    requestedVariantIndex,
    names,
}: {
    doenetML: string;
    requestedVariantIndex: number;
    names: string[];
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        requestedVariantIndex,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const values: number[] = [];
    for (const name of names) {
        values.push(
            stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .selectedValues[0],
        );
    }
    return values;
}

describe("Unlinked group copies of random choices @group3", async () => {
    it("a group copy keeps random values nested inside a div and an inner group", async () => {
        const doenetML = `
<group name="g"><div><group><p><selectFromSequence name="n" from="1" to="1000"/></p></group></div></group>
<group copy="$g" name="g2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const [n, n2] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["g.n", "g2.n"],
            });
            expect(n2, `variant ${requestedVariantIndex}`).eq(n);
        }
    });

    it("a group copy keeps random values nested in groups inside divs", async () => {
        const doenetML = `
<group name="g"><div><group><div><group><selectFromSequence name="n" from="1" to="1000"/></group></div></group></div></group>
<group copy="$g" name="g2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const [n, n2] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["g.n", "g2.n"],
            });
            expect(n2, `variant ${requestedVariantIndex}`).eq(n);
        }
    });

    it("a random child added to a group copy gets its own value", async () => {
        const doenetML = `
<p name="a"><group name="g"><selectFromSequence name="x" from="1" to="1000"/> <selectFromSequence name="y" from="1" to="1000"/></group></p>
<p name="b"><group copy="$g" name="g2"> <selectFromSequence name="z" from="1" to="1000"/></group></p>
<p name="c"><group copy="$g2" name="g3"/></p>
`;
        const names = [
            "g.x",
            "g.y",
            "g2.x",
            "g2.y",
            "z",
            "g3.x",
            "g3.y",
            "g3.z",
        ];
        const addedValues: number[] = [];
        for (const requestedVariantIndex of variantIndices) {
            const [x, y, x2, y2, z, x3, y3, z3] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names,
            });
            const message = `variant ${requestedVariantIndex}`;

            // the copied children keep their source's values
            expect([x2, y2], message).eqls([x, y]);

            // the added child does not repeat a value of the source
            expect(z, message).not.eq(x);
            expect(z, message).not.eq(y);

            // a copy of the copy keeps the copy's values, the added one included
            expect([x3, y3, z3], message).eqls([x, y, z]);

            // the added child's value is the same for a given variant
            const [zAgain] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["z"],
            });
            expect(zAgain, message).eq(z);

            addedValues.push(z);
        }

        // and differs between variants
        expect(new Set(addedValues).size).eq(variantIndices.length);
    });
    it("a random child added to a group copy keeps its value through a reload", async () => {
        const doenetML = `
<p><group name="g"><selectFromSequence name="x" from="1" to="1000"/> <mathInput name="mi" prefill="1"/></group></p>
<p><group copy="$g" name="g2"> <selectFromSequence name="z" from="1" to="1000"/></group></p>
`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        });
        async function values() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            return {
                x: (await sv("g.x")).selectedValues[0],
                x2: (await sv("g2.x")).selectedValues[0],
                z: (await sv("z")).selectedValues[0],
                mi2: (await sv("g2.mi")).value.tree,
            };
        }
        const initial = await values();
        expect(initial.x2).eq(initial.x);
        expect(initial.z).not.eq(initial.x);

        // a change to the source makes the save hold the copy's snapshot
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("g.mi"),
            core,
        });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("g2.mi"),
            core,
        });
        await core.saveImmediately();

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
            initialState: scoreState.state,
        }));
        expect(await values()).eqls({ ...initial, mi2: 7 });
    });
});
