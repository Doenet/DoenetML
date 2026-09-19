import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { moveParsonsBlock, submitAnswer } from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Four blocks: three correct steps in document order and one distractor.
 */
function basicParsons({
    attributes = "",
    label = "<label>Order the steps</label>",
}: { attributes?: string; label?: string } = {}) {
    return `
    <parsons name="p"${attributes ? " " + attributes : ""}>
        ${label}
        <statement name="st"><p>Start here</p></statement>
        <block name="b1"><p>first</p></block>
        <block name="b2"><p>second</p></block>
        <block name="b3"><p>third</p></block>
        <block name="b4" isDistractor><p>wrong</p></block>
    </parsons>
    <p>Credit: <number extend="$p.creditAchieved" name="ca" /></p>
    <p>Document credit: <number extend="$_document1.creditAchieved" name="dca" /></p>
    <p>Second response: <number extend="$p.currentResponse2" name="cr2" /></p>
    `;
}

async function getParsonsState({
    core,
    resolvePathToNodeIdx,
}: {
    core: any;
    resolvePathToNodeIdx: (name: string) => Promise<number>;
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    return {
        stateVariables,
        parsons: stateVariables[await resolvePathToNodeIdx("p")],
    };
}

/**
 * Put the given blocks into the solution area, in order, one move each.
 */
async function arrange({
    core,
    parsonsIdx,
    solution,
}: {
    core: any;
    parsonsIdx: number;
    solution: number[];
}) {
    for (const blockIndex of solution) {
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex,
            toArea: "solution",
            core,
        });
    }
}

describe("Parsons tag tests @group1", async () => {
    it("structure: blocks, distractors, correct order, rendered children", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons(),
        });

        const { stateVariables, parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });

        expect(parsons.stateValues.numBlocks).eq(4);
        expect(parsons.stateValues.numDistractors).eq(1);
        expect(parsons.stateValues.correctOrder).eqls([1, 2, 3]);
        expect(parsons.stateValues.label).eq("Order the steps");
        expect(parsons.stateValues.solutionLabel).eq("Solution");
        expect(parsons.stateValues.unusedLabel).eq("Unused blocks");
        expect(parsons.stateValues.solutionIndices).eqls([]);
        expect(parsons.stateValues.currentResponses).eqls([]);
        expect(parsons.stateValues.creditAchieved).eq(0);

        // The block children are rendered, in document order, and the
        // statement precedes them; the label is not rendered as a child.
        const blockIndices = parsons.stateValues.blockChildIndices;
        expect(blockIndices.length).eq(4);
        const statementInd = parsons.stateValues.statementChildInd;
        expect(statementInd).not.eq(-1);
        expect(parsons.stateValues.childIndicesToRender).eqls([
            statementInd,
            ...blockIndices,
        ]);
        for (const [i, name] of ["b1", "b2", "b3", "b4"].entries()) {
            expect(parsons.activeChildren[blockIndices[i]].componentIdx).eq(
                await resolvePathToNodeIdx(name),
            );
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues
                .isDistractor,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues
                .isDistractor,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.text,
        ).eq("first");
    });

    it("author-supplied area labels", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({
                attributes: `solutionLabel="Correct steps" unusedLabel="Unused steps"`,
            }),
        });

        const { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });

        expect(parsons.stateValues.solutionLabel).eq("Correct steps");
        expect(parsons.stateValues.unusedLabel).eq("Unused steps");
    });

    it("block order is a variant-seeded permutation", async () => {
        const ordersByVariant: Record<number, number[]> = {};

        for (const requestedVariantIndex of [1, 2, 3, 4, 5]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: basicParsons(),
                requestedVariantIndex,
            });
            const { parsons } = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            const blockOrder = parsons.stateValues.blockOrder;
            expect([...blockOrder].sort()).eqls([1, 2, 3, 4]);
            expect(parsons.stateValues.unusedIndices).eqls(blockOrder);
            expect(parsons.stateValues.generatedVariantInfo.indices).eqls(
                blockOrder,
            );
            ordersByVariant[requestedVariantIndex] = blockOrder;
        }

        // Some variant shuffles differently from the first.
        expect(
            [2, 3, 4, 5].some(
                (v) =>
                    ordersByVariant[v].join(",") !==
                    ordersByVariant[1].join(","),
            ),
        ).eq(true);

        // The same variant reproduces the same order.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons(),
            requestedVariantIndex: 3,
        });
        const { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.blockOrder).eqls(ordersByVariant[3]);
    });

    it("shuffleOrder false keeps document order", async () => {
        for (const requestedVariantIndex of [1, 2]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: basicParsons({ attributes: `shuffleOrder="false"` }),
                requestedVariantIndex,
            });
            const { parsons } = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            expect(parsons.stateValues.blockOrder).eqls([1, 2, 3, 4]);
            expect(parsons.stateValues.generatedVariantInfo.indices).eq(
                undefined,
            );
        }
    });

    it("moveBlock: append, insert, reorder, remove, and ignore bad requests", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `shuffleOrder="false"` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        async function solution() {
            const { parsons } = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            return parsons.stateValues;
        }

        // append
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 2,
            toArea: "solution",
            core,
        });
        let sv = await solution();
        expect(sv.solutionIndices).eqls([2]);
        expect(sv.unusedIndices).eqls([1, 3, 4]);
        expect(sv.currentResponses).eqls([2]);

        // insert at the top
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 3,
            toArea: "solution",
            toPosition: 1,
            core,
        });
        sv = await solution();
        expect(sv.solutionIndices).eqls([3, 2]);

        // append via an out-of-range position
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            toPosition: 10,
            core,
        });
        sv = await solution();
        expect(sv.solutionIndices).eqls([3, 2, 1]);
        expect(sv.unusedIndices).eqls([4]);

        // reorder within the solution
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 3,
            toArea: "solution",
            toPosition: 3,
            core,
        });
        sv = await solution();
        expect(sv.solutionIndices).eqls([2, 1, 3]);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            toPosition: 1,
            core,
        });
        sv = await solution();
        expect(sv.solutionIndices).eqls([1, 2, 3]);
        expect(sv.currentResponses[1]).eq(2);
        {
            const { stateVariables } = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            expect(
                stateVariables[await resolvePathToNodeIdx("cr2")].stateValues
                    .value,
            ).eq(2);
        }

        // remove
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 2,
            toArea: "unused",
            core,
        });
        sv = await solution();
        expect(sv.solutionIndices).eqls([1, 3]);
        // the pile keeps document order
        expect(sv.unusedIndices).eqls([2, 4]);

        // bad requests change nothing
        for (const args of [
            { blockIndex: 0, toArea: "solution" as const },
            { blockIndex: 5, toArea: "solution" as const },
            { blockIndex: 1.5, toArea: "solution" as const },
            { blockIndex: 2, toArea: "sideways" as any },
        ]) {
            await moveParsonsBlock({ componentIdx: parsonsIdx, core, ...args });
            sv = await solution();
            expect(sv.solutionIndices).eqls([1, 3]);
        }
    });

    it("moveBlock is ignored when fixed", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `fixed` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            core,
        });
        const { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.solutionIndices).eqls([]);
    });

    it("grading is all-or-nothing on document order", async () => {
        const cases: { solution: number[]; credit: number }[] = [
            { solution: [1, 2, 3], credit: 1 },
            { solution: [1, 3, 2], credit: 0 },
            { solution: [2, 1, 3], credit: 0 },
            { solution: [1, 2], credit: 0 },
            { solution: [1, 2, 3, 4], credit: 0 },
            { solution: [4, 1, 2, 3], credit: 0 },
            { solution: [], credit: 0 },
            { solution: [4], credit: 0 },
        ];

        for (const { solution, credit } of cases) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: basicParsons(),
            });
            const parsonsIdx = await resolvePathToNodeIdx("p");
            await arrange({ core, parsonsIdx, solution });

            let { parsons } = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            expect(parsons.stateValues.creditAchievedIfSubmit).eq(credit);
            expect(parsons.stateValues.creditAchieved).eq(0);

            await submitAnswer({ componentIdx: parsonsIdx, core });

            const state = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            parsons = state.parsons;
            expect(parsons.stateValues.creditAchieved).eq(credit);
            expect(parsons.stateValues.submittedResponses).eqls(solution);
            expect(parsons.stateValues.numSubmittedResponses).eq(
                solution.length,
            );
            expect(
                state.stateVariables[await resolvePathToNodeIdx("ca")]
                    .stateValues.value,
            ).eq(credit);
        }
    });

    it("matchPartial has no effect: a near miss still earns nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `matchPartial` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");
        await arrange({ core, parsonsIdx, solution: [1, 2] });
        await submitAnswer({ componentIdx: parsonsIdx, core });

        const { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.creditAchieved).eq(0);
    });

    it("submit flow: counters, justSubmitted, document credit and weight", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <parsons name="p" weight="3">
        <label>Order the steps</label>
        <block name="b1"><p>first</p></block>
        <block name="b2"><p>second</p></block>
    </parsons>
    <answer name="a" weight="1"><mathInput name="mi"><label>x</label></mathInput><award>1</award></answer>
    <p>Document credit: <number extend="$_document1.creditAchieved" name="dca" /></p>
    `,
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        let { parsons, stateVariables } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.responseHasBeenSubmitted).eq(false);
        expect(parsons.stateValues.justSubmitted).eq(false);
        expect(parsons.stateValues.numSubmissions).eq(0);

        await arrange({ core, parsonsIdx, solution: [2, 1] });
        await submitAnswer({ componentIdx: parsonsIdx, core });

        ({ parsons, stateVariables } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        }));
        expect(parsons.stateValues.creditAchieved).eq(0);
        expect(parsons.stateValues.responseHasBeenSubmitted).eq(true);
        expect(parsons.stateValues.justSubmitted).eq(true);
        expect(parsons.stateValues.numSubmissions).eq(1);
        expect(parsons.stateValues.numIncorrectSubmissions).eq(1);
        expect(parsons.stateValues.submittedResponses).eqls([2, 1]);

        // a further move clears justSubmitted but keeps the submitted record
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            toPosition: 1,
            core,
        });
        ({ parsons, stateVariables } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        }));
        expect(parsons.stateValues.justSubmitted).eq(false);
        expect(parsons.stateValues.currentResponses).eqls([1, 2]);
        expect(parsons.stateValues.submittedResponses).eqls([2, 1]);

        await submitAnswer({ componentIdx: parsonsIdx, core });
        ({ parsons, stateVariables } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        }));
        expect(parsons.stateValues.creditAchieved).eq(1);
        expect(parsons.stateValues.justSubmitted).eq(true);
        expect(parsons.stateValues.numSubmissions).eq(2);
        expect(parsons.stateValues.numIncorrectSubmissions).eq(1);
        expect(parsons.stateValues.submittedResponses).eqls([1, 2]);

        // weight 3 against an unanswered answer of weight 1
        expect(
            stateVariables[await resolvePathToNodeIdx("dca")].stateValues.value,
        ).eq(0.75);
    });

    it("disableAfterCorrect freezes the arrangement", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `disableAfterCorrect` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await arrange({ core, parsonsIdx, solution: [1, 2, 3] });
        let { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.disabled).eq(false);

        await submitAnswer({ componentIdx: parsonsIdx, core });
        ({ parsons } = await getParsonsState({ core, resolvePathToNodeIdx }));
        expect(parsons.stateValues.creditAchieved).eq(1);
        expect(parsons.stateValues.disabled).eq(true);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "unused",
            core,
        });
        ({ parsons } = await getParsonsState({ core, resolvePathToNodeIdx }));
        expect(parsons.stateValues.solutionIndices).eqls([1, 2, 3]);
        expect(parsons.stateValues.numSubmissions).eq(1);
    });

    it("maxNumAttempts limits submissions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `maxNumAttempts="1"` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await arrange({ core, parsonsIdx, solution: [1, 3, 2] });
        await submitAnswer({ componentIdx: parsonsIdx, core });
        let { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.creditAchieved).eq(0);
        expect(parsons.stateValues.numAttemptsLeft).eq(0);
        expect(parsons.stateValues.disabled).eq(true);

        // fixing the order and submitting again changes nothing
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 2,
            toArea: "solution",
            toPosition: 2,
            core,
        });
        await submitAnswer({ componentIdx: parsonsIdx, core });
        ({ parsons } = await getParsonsState({ core, resolvePathToNodeIdx }));
        expect(parsons.stateValues.solutionIndices).eqls([1, 3, 2]);
        expect(parsons.stateValues.creditAchieved).eq(0);
        expect(parsons.stateValues.numSubmissions).eq(1);
    });

    it("handGraded submissions record no credit", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `handGraded` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await arrange({ core, parsonsIdx, solution: [1, 2, 3] });
        await submitAnswer({ componentIdx: parsonsIdx, core });
        const { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.creditAchieved).eq(0);
        expect(parsons.stateValues.submittedResponses).eqls([1, 2, 3]);
        expect(parsons.stateValues.showCorrectness).eq(false);
    });

    it("all-distractor parsons: leaving everything unused is correct, with a warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <parsons name="p">
        <label>Nothing belongs</label>
        <block isDistractor><p>no</p></block>
        <block isDistractor><p>nope</p></block>
    </parsons>
    `,
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        const warnings = getDiagnosticsByType(core).warnings;
        expect(warnings.length).eq(1);
        expect(warnings[0].message).toContain("distractor");

        let { parsons } = await getParsonsState({
            core,
            resolvePathToNodeIdx,
        });
        expect(parsons.stateValues.correctOrder).eqls([]);
        expect(parsons.stateValues.creditAchievedIfSubmit).eq(1);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            core,
        });
        ({ parsons } = await getParsonsState({ core, resolvePathToNodeIdx }));
        expect(parsons.stateValues.creditAchievedIfSubmit).eq(0);
    });

    it("a parsons with no blocks warns", async () => {
        const { core } = await createTestCore({
            doenetML: `
    <parsons name="p">
        <label>Empty</label>
    </parsons>
    `,
        });

        const warnings = getDiagnosticsByType(core).warnings;
        expect(warnings.length).eq(1);
        expect(warnings[0].message).toContain("no `<block>` children");
    });

    it("accessibility: a label or short description is required", async () => {
        const accessibilityMsg =
            "For accessibility, `<parsons>` must have a short description or a label.";

        // neither: a violation
        let { core } = await createTestCore({
            doenetML: basicParsons({ label: "" }),
        });
        let accessibility = getDiagnosticsByType(core).accessibility;
        expect(accessibility.length).eq(1);
        expect(accessibility[0].level).eq(1);
        expect(accessibility[0].message).toContain(accessibilityMsg);

        // a label
        ({ core } = await createTestCore({ doenetML: basicParsons() }));
        expect(getDiagnosticsByType(core).accessibility.length).eq(0);

        // a short description
        ({ core } = await createTestCore({
            doenetML: basicParsons({
                label: "<shortDescription>Order the steps</shortDescription>",
            }),
        }));
        expect(getDiagnosticsByType(core).accessibility.length).eq(0);
    });

    it("unique variants enumerate every block order", async () => {
        // Three blocks give 3! = 6 unique variants, one per permutation,
        // reached through `determineNumberOfUniqueVariants`/`getUniqueVariant`.
        const doenetML = `
    <parsons name="p">
        <label>Order the steps</label>
        <statement><p>Start here</p></statement>
        <block><p>first</p></block>
        <block><p>second</p></block>
        <block><p>third</p></block>
    </parsons>
    `;

        const orders = new Set<string>();
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const { parsons } = await getParsonsState({
                core,
                resolvePathToNodeIdx,
            });
            const blockOrder = parsons.stateValues.blockOrder;
            expect([...blockOrder].sort()).eqls([1, 2, 3]);
            orders.add(blockOrder.join(","));
        }
        expect(orders.size).eq(6);
    });
});
