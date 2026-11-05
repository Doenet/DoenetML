import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

const variantIndices = [1, 2, 3, 4, 5];

/**
 * The random value of each named component (its first selected value, or
 * the problem order of a pretzel), and the variant the document generated.
 */
async function randomValues({
    doenetML,
    requestedVariantIndex,
    requestedVariant,
    initialState,
    names,
}: {
    doenetML: string;
    requestedVariantIndex: number;
    requestedVariant?: Record<string, any>;
    initialState?: string;
    names: string[];
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        requestedVariantIndex,
        requestedVariant,
        initialState,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const values: Record<string, any> = {};
    for (const name of names) {
        const stateValues =
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        values[name] =
            stateValues.selectedValues?.[0] ?? stateValues.problemOrder;
    }
    const document = Object.values(stateVariables).find(
        (component: any) => component.componentType === "document",
    ) as any;
    return {
        values,
        generatedVariant: document.stateValues.generatedVariantInfo,
    };
}

/**
 * Check, for several variants, that each named component of the container's
 * copy `s2` has the value of the same component of `s`.
 */
async function checkContainerCopyKeepsValues({
    doenetML,
    names,
}: {
    doenetML: string;
    names: string[];
}) {
    for (const requestedVariantIndex of variantIndices) {
        const { values } = await randomValues({
            doenetML,
            requestedVariantIndex,
            names: names.flatMap((name) => [`s.${name}`, `s2.${name}`]),
        });
        for (const name of names) {
            expect(
                values[`s2.${name}`],
                `${name}, variant ${requestedVariantIndex}`,
            ).eqls(values[`s.${name}`]);
        }
    }
}

/**
 * Check, for several variants, that loading the page again with the variant
 * it generated gives each named component the same value.
 */
async function checkReloadKeepsValues({
    doenetML,
    names,
}: {
    doenetML: string;
    names: string[];
}) {
    for (const requestedVariantIndex of variantIndices) {
        const { values, generatedVariant } = await randomValues({
            doenetML,
            requestedVariantIndex,
            names,
        });
        const { values: reloadedValues } = await randomValues({
            doenetML,
            requestedVariantIndex,
            requestedVariant: generatedVariant,
            names,
        });
        expect(reloadedValues, `variant ${requestedVariantIndex}`).eqls(values);
    }
}

const pretzelProblems = `
    <problem><statement><p>P1 <selectFromSequence name="n" from="1" to="100"/></p></statement><answer>A1</answer></problem>
    <problem><statement><p>P2</p></statement><answer>A2</answer></problem>
    <problem><statement><p>P3</p></statement><answer>A3</answer></problem>`;

const addedPretzelProblem = `
    <problem><statement><p>P4 <selectFromSequence name="m" from="1" to="100"/></p></statement><answer>A4</answer></problem>`;

describe("Copies of containers holding copies with added random children @group3", async () => {
    it("a copied section keeps the random child added to a group copy inside it", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<section name="s">
  <group name="g"><selectFromSequence name="x" from="1" to="1000"/></group>
  <group copy="$g" name="g2"><selectFromSequence name="z" from="1" to="1000"/></group>
</section>
<section copy="$s" name="s2"/>
`,
            names: ["g.x", "g2.x", "g2.z"],
        });
    });

    it("a copied group keeps the random child added to a group copy inside it", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<group name="s">
  <group name="g"><selectFromSequence name="x" from="1" to="1000"/></group>
  <group copy="$g" name="g2"><selectFromSequence name="z" from="1" to="1000"/></group>
</group>
<group copy="$s" name="s2"/>
`,
            names: ["g.x", "g2.x", "g2.z"],
        });
    });

    it("a copied div keeps the random child added to a p copy inside it, and a random value after it", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<div name="s">
  <p name="g"><selectFromSequence name="x" from="1" to="1000"/></p>
  <p copy="$g" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
  <selectFromSequence name="w" from="1" to="1000"/>
</div>
<div copy="$s" name="s2"/>
`,
            names: ["g.x", "g2.x", "g2.z", "w"],
        });
    });

    it("a copied section keeps the random child added to a p copy inside it, and a random value after it", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<section name="s">
  <p name="g"><selectFromSequence name="x" from="1" to="1000"/></p>
  <p copy="$g" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
  <selectFromSequence name="w" from="1" to="1000"/>
</section>
<section copy="$s" name="s2"/>
`,
            names: ["g.x", "g2.x", "g2.z", "w"],
        });
    });

    it("a copied section keeps the problem added to a pretzel copy inside it, and the copy's problem order", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<section name="s">
  <pretzel name="p">${pretzelProblems}
  </pretzel>
  <pretzel copy="$p" name="p2">${addedPretzelProblem}
  </pretzel>
</section>
<section copy="$s" name="s2"/>
`,
            names: ["p.n", "p", "p2.n", "p2.m", "p2"],
        });
    });

    it("a copied div keeps the random child added to a copy in a repeatForSequence inside it, and a random value after the copy", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<div name="s">
  <p name="a"><selectFromSequence name="x" from="1" to="1000"/></p>
  <repeatForSequence name="r" from="1" to="2">
    <p copy="$a" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
    <selectFromSequence name="q" from="1" to="1000"/>
  </repeatForSequence>
</div>
<div copy="$s" name="s2"/>
`,
            names: ["r[1].g2.z", "r[1].q", "r[2].g2.z", "r[2].q"],
        });
    });

    it("a copied div keeps the random child added to a copy in a repeat inside it, and a random value after the copy", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<div name="s">
  <p name="a"><selectFromSequence name="x" from="1" to="1000"/></p>
  <repeat name="r" for="1 2" valueName="v">
    <p copy="$a" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
    <selectFromSequence name="q" from="1" to="1000"/>
  </repeat>
</div>
<div copy="$s" name="s2"/>
`,
            names: ["r[1].g2.z", "r[1].q", "r[2].g2.z", "r[2].q"],
        });
    });

    it("a copied div keeps the random child added to a copy in a conditionalContent inside it, and a random value after the copy", async () => {
        await checkContainerCopyKeepsValues({
            doenetML: `
<div name="s">
  <p name="a"><selectFromSequence name="x" from="1" to="1000"/></p>
  <conditionalContent name="c">
    <case condition="false"><selectFromSequence name="v" from="1" to="1000"/></case>
    <case condition="true">
      <p copy="$a" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
      <selectFromSequence name="q" from="1" to="1000"/>
    </case>
  </conditionalContent>
  <selectFromSequence name="u" from="1" to="1000"/>
</div>
<div copy="$s" name="s2"/>
`,
            names: ["c.g2.z", "c.q", "u"],
        });
    });

    it("a page loaded again with its generated variant keeps the random child added to a copy, and a random value after it", async () => {
        await checkReloadKeepsValues({
            doenetML: `
<p name="g"><selectFromSequence name="x" from="1" to="1000"/></p>
<p copy="$g" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
<selectFromSequence name="w" from="1" to="1000"/>
`,
            names: ["g.x", "g2.x", "g2.z", "w"],
        });
    });

    it("a page loaded again with its generated variant keeps the problem added to a pretzel copy, and the copy's problem order", async () => {
        await checkReloadKeepsValues({
            doenetML: `
<pretzel name="p">${pretzelProblems}
</pretzel>
<pretzel copy="$p" name="p2">${addedPretzelProblem}
</pretzel>
<selectFromSequence name="w" from="1" to="1000"/>
`,
            names: ["p.n", "p", "p2.n", "p2.m", "p2", "w"],
        });
    });

    it("a page loaded again with its generated variant keeps the values of a copied section", async () => {
        await checkReloadKeepsValues({
            doenetML: `
<section name="s">
  <p name="g"><selectFromSequence name="x" from="1" to="1000"/></p>
  <p copy="$g" name="g2"><selectFromSequence name="z" from="1" to="1000"/></p>
  <pretzel name="p">${pretzelProblems}
  </pretzel>
  <pretzel copy="$p" name="p2">${addedPretzelProblem}
  </pretzel>
</section>
<section copy="$s" name="s2"/>
`,
            names: ["s.g2.z", "s.p2.m", "s.p2", "s2.g2.z", "s2.p2.m", "s2.p2"],
        });
    });

    it("a saved page loaded again keeps the random child added to a copy", async () => {
        // As the viewer loads a saved page: with the saved state and the
        // variant the page generated, passed back as `requestedVariant`
        const documents = [
            `
<mathInput name="mi"/>
<p name="a"><selectFromSequence name="x" from="1" to="1000"/></p>
<p copy="$a" name="b"> <selectFromSequence name="z" from="1" to="1000"/></p>
`,
            `
<mathInput name="mi"/>
<section name="a"><p><selectFromSequence name="x" from="1" to="1000"/></p></section>
<section copy="$a" name="b"><p><selectFromSequence name="z" from="1" to="1000"/></p></section>
`,
            `
<mathInput name="mi"/>
<group name="a"><p><selectFromSequence name="x" from="1" to="1000"/></p></group>
<group copy="$a" name="b"><p><selectFromSequence name="z" from="1" to="1000"/></p></group>
`,
        ];
        const names = ["a.x", "b.x", "z"];
        for (const doenetML of documents) {
            for (const requestedVariantIndex of variantIndices) {
                const message = `variant ${requestedVariantIndex} of ${doenetML}`;
                const { core, resolvePathToNodeIdx, scoreState } =
                    await createTestCore({ doenetML, requestedVariantIndex });
                await updateMathInputValue({
                    latex: "y",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const values: number[] = [];
                for (const name of names) {
                    values.push(
                        stateVariables[await resolvePathToNodeIdx(name)]
                            .stateValues.selectedValues[0],
                    );
                }
                const document = Object.values(stateVariables).find(
                    (component: any) => component.componentType === "document",
                ) as any;
                const requestedVariant = JSON.parse(
                    JSON.stringify(document.stateValues.generatedVariantInfo),
                );
                await core.saveImmediately();

                const { values: reloadedValues } = await randomValues({
                    doenetML,
                    requestedVariantIndex,
                    requestedVariant,
                    initialState: scoreState.state,
                    names,
                });
                expect(
                    names.map((name) => reloadedValues[name]),
                    message,
                ).eqls(values);
            }
        }
    });
});
