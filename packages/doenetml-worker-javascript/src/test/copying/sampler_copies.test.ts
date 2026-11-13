import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

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

    it("an extend of a sampler drawing from what is written after it keeps the draws through a reload", async () => {
        // An extend shows the sampler's draws as they are, so they are not
        // made before what they are drawn from is all there, which would
        // draw them again once it is, at each reload (COMP-8).
        const doenetML = `
    <sampleRandomNumbers name="s" numSamples="$g.n" />
    <sampleRandomNumbers name="e" extend="$s" />
    <group name="g"><number name="n">2</number></group>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function draws() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result = [];
            for (const name of ["s", "e"]) {
                result.push(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .sampledValues,
                );
            }
            return result;
        }
        const before = await draws();
        expect(before[0].length).eq(2);
        expect(before[1]).eqls(before[0]);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect(await draws()).eqls(before);
    });

    it("a copyWithState of a sampler drawing from what is written after both draws its own", async () => {
        // The source's draws are made when it is copied, before the group
        // is there, from a count the group then changes, so they are not
        // carried: the copy draws its own and keeps them through a reload.
        // The source draws again once the group is there, as on a reload.
        const doenetML = `
    <sampleRandomNumbers name="s" numSamples="$g.n" />
    <sampleRandomNumbers name="c" copyWithState="$s" />
    <group name="g"><number name="n">2</number></group>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function draws() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result = [];
            for (const name of ["s", "c"]) {
                result.push(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .sampledValues,
                );
            }
            return result;
        }
        const before = await draws();
        expect(before[0].length).eq(2);
        expect(before[1].length).eq(2);

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect((await draws())[1]).eqls(before[1]);
    });

    describe("a copyWithState of a sampler whose other parameters come from what is written after both draws from them", () => {
        // The source's draws are made when it is copied, before the group is
        // there, from parameters the group then changes. The copy carries
        // them only if they were made from the parameters it has, so it
        // draws its own from what the group gives, and keeps them through a
        // reload.
        const layouts = [
            {
                name: "exclude",
                doenetML: `
    <sampleRandomNumbers name="s" numSamples="3" type="discreteUniform" from="1" to="3" exclude="$g.e" />
    <sampleRandomNumbers name="c" copyWithState="$s" />
    <group name="g"><numberList name="e">1 2</numberList></group>
    `,
                check: (draws: number[]) => expect(draws).eqls([3, 3, 3]),
            },
            {
                name: "type",
                doenetML: `
    <sampleRandomNumbers name="s" numSamples="2" type="$g.t" mean="1000" />
    <sampleRandomNumbers name="c" copyWithState="$s" />
    <group name="g"><text name="t">gaussian</text></group>
    `,
                check: (draws: number[]) => {
                    expect(draws.length).eq(2);
                    for (const x of draws) {
                        expect(Math.abs(x - 1000)).lessThan(10);
                    }
                },
            },
            {
                name: "a range for primes",
                doenetML: `
    <samplePrimeNumbers name="s" numSamples="2" minValue="$g.a" maxValue="$g.b" />
    <samplePrimeNumbers name="c" copyWithState="$s" />
    <group name="g"><number name="a">100000</number><number name="b">100100</number></group>
    `,
                check: (draws: number[]) => {
                    expect(draws.length).eq(2);
                    for (const x of draws) {
                        expect(x).within(100000, 100100);
                    }
                },
            },
            {
                name: "a multivariate count",
                doenetML: `
    <sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="1000 1000 1000" numDraws="$g.a" />
    <sampleMultivariateRandomNumber name="c" copyWithState="$s" />
    <group name="g"><number name="a">100</number></group>
    `,
                check: (draws: number[]) =>
                    expect(draws.reduce((a, b) => a + b, 0)).eq(100),
            },
        ];
        for (const { name, doenetML, check } of layouts) {
            it(name, async () => {
                let { core, resolvePathToNodeIdx, scoreState } =
                    await createTestCore({ doenetML });
                async function copyDraws() {
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    return stateVariables[await resolvePathToNodeIdx("c")]
                        .stateValues.sampledValues;
                }
                const before = await copyDraws();
                check(before);

                await core.saveImmediately();
                ({ core, resolvePathToNodeIdx, scoreState } =
                    await createTestCore({
                        doenetML,
                        initialState: scoreState.state,
                    }));
                expect(await copyDraws()).eqls(before);
            });
        }
    });

    it("a copyWithState of a sampler with a fractional numSamples shows its source's draws", async () => {
        // The sampler draws the ceiling of a fractional count.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sampleRandomNumbers name="s" numSamples="2.5" />
    <sampleRandomNumbers name="c" copyWithState="$s" />
    <samplePrimeNumbers name="ps" numSamples="2.5" maxValue="100000" />
    <samplePrimeNumbers name="pc" copyWithState="$ps" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        async function draws(name: string) {
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .sampledValues;
        }
        expect((await draws("s")).length).eq(3);
        expect(await draws("c")).eqls(await draws("s"));
        expect((await draws("ps")).length).eq(3);
        expect(await draws("pc")).eqls(await draws("ps"));
    });

    it("a copyWithState of a group whose sampler draws from that copy reports the cycle", async () => {
        // Making the sampler's draws before it is copied reaches the copy
        // being made.
        const { core } = await createTestCore({
            doenetML: `
    <group name="g"><sampleRandomNumbers name="s" numSamples="$g2.s.numSamples" /></group>
    <group name="g2" copyWithState="$g" />
    `,
        });
        expect(
            getDiagnosticsByType(core).errors.map((e: any) => e.message),
        ).eqls(["Circular dependency detected involving `<group>` component."]);
    });
});
