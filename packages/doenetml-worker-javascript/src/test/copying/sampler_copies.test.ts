import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A sampler's draws are made once and never again (COMP-8): a
 * `copyWithState` carries them, as it carries a selection (CPY-8), and both
 * keep them through a reload. A `copy` draws its own (D33) (#2477).
 */
describe("Copies of a sampler @group4", () => {
    const samplers = [
        {
            tag: "sampleRandomNumbers",
            attributes: 'numSamples="3"',
            variable: "sampledValues",
            copyDrawsDiffer: true,
        },
        {
            tag: "samplePrimeNumbers",
            attributes: 'numSamples="3" maxValue="100000"',
            variable: "sampledValues",
            copyDrawsDiffer: true,
        },
        {
            tag: "sampleMultivariateRandomNumber",
            attributes:
                'type="hypergeometric" numInCategories="1000 1000 1000" numDraws="100"',
            variable: "sampledValues",
            // a few counts, which another draw can match by chance
            copyDrawsDiffer: false,
        },
    ];

    for (const { tag, attributes, variable, copyDrawsDiffer } of samplers) {
        it(`${tag}: copyWithState shows its source's draws, copy draws its own, and both keep them through a reload`, async () => {
            const doenetML = `
    <${tag} name="s" ${attributes}/>
    <${tag} name="cs" copyWithState="$s"/>
    <${tag} name="c" copy="$s"/>
    <section><${tag} name="cs2" copyWithState="$s"/></section>
    `;
            let { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });
            async function draws() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const result: Record<string, any> = {};
                for (const name of ["s", "cs", "c", "cs2"]) {
                    result[name] =
                        stateVariables[
                            await resolvePathToNodeIdx(name)
                        ].stateValues[variable];
                }
                return result;
            }

            const before = await draws();
            expect(before.s.length).greaterThan(0);
            expect(before.cs).eqls(before.s);
            expect(before.cs2).eqls(before.s);
            if (copyDrawsDiffer) {
                expect(before.c).not.eqls(before.s);
            }

            await core.saveImmediately();
            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            }));
            expect(await draws()).eqls(before);
        });
    }
});
