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
    blocks = "",
}: { attributes?: string; label?: string; blocks?: string } = {}) {
    return `
    <parsons name="p"${attributes ? " " + attributes : ""}>
        ${label}
        <statement name="st"><p>Start here</p></statement>
        <block name="b1"><p>first</p></block>
        <block name="b2"><p>second</p></block>
        <block name="b3"><p>third</p></block>
        <block name="b4" isDistractor><p>wrong</p></block>
        ${blocks}
    </parsons>
    <p>Credit: <number extend="$p.creditAchieved" name="ca" /></p>
    <p>Document credit: <number extend="$_document1.creditAchieved" name="dca" /></p>
    <p>Second response: <number extend="$p.currentResponse2" name="cr2" /></p>
    `;
}

/** The state values of one component. */
async function stateValuesOf(core: any, componentIdx: number) {
    return (await core.returnAllStateVariables(false, true))[componentIdx]
        .stateValues;
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
        const parsonsIdx = await resolvePathToNodeIdx("p");
        const stateVariables = await core.returnAllStateVariables(false, true);
        const parsons = stateVariables[parsonsIdx];
        const sv = parsons.stateValues;

        expect(sv.numBlocks).eq(4);
        expect(sv.numDistractors).eq(1);
        expect(sv.correctOrder).eqls([1, 2, 3]);
        expect(sv.label).eq("Order the steps");
        expect(sv.solutionLabel).eq("Solution");
        expect(sv.unusedLabel).eq("Unused blocks");
        expect(sv.solutionIndices).eqls([]);
        expect(sv.currentResponses).eqls([]);
        expect(sv.creditAchieved).eq(0);
        expect(sv.showCheckWork).eq(true);
        expect(sv.descriptionChildInd).eq(-1);

        // The block children are rendered, in document order, and the
        // statement precedes them; the label is not rendered as a child.
        const blockIndices = sv.blockChildIndices;
        expect(blockIndices.length).eq(4);
        const statementInd = sv.statementChildInd;
        expect(statementInd).not.eq(-1);
        expect(sv.childIndicesToRender).eqls([statementInd, ...blockIndices]);
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

    it("a description child is rendered last", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({
                blocks: "<description>Drag the steps into place.</description>",
            }),
        });
        const sv = await stateValuesOf(core, await resolvePathToNodeIdx("p"));

        expect(sv.descriptionChildInd).not.eq(-1);
        expect(sv.childIndicesToRender).eqls([
            sv.statementChildInd,
            ...sv.blockChildIndices,
            sv.descriptionChildInd,
        ]);
    });

    it("author-supplied area labels", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({
                attributes: `solutionLabel="Correct steps" unusedLabel="Unused steps"`,
            }),
        });
        const sv = await stateValuesOf(core, await resolvePathToNodeIdx("p"));

        expect(sv.solutionLabel).eq("Correct steps");
        expect(sv.unusedLabel).eq("Unused steps");
    });

    it("block order is a variant-seeded permutation", async () => {
        const ordersByVariant: Record<number, number[]> = {};

        for (const requestedVariantIndex of [1, 2, 3, 4, 5]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: basicParsons(),
                requestedVariantIndex,
            });
            const sv = await stateValuesOf(
                core,
                await resolvePathToNodeIdx("p"),
            );
            const blockOrder = sv.blockOrder;
            expect([...blockOrder].sort()).eqls([1, 2, 3, 4]);
            expect(sv.unusedIndices).eqls(blockOrder);
            expect(sv.generatedVariantInfo.indices).eqls(blockOrder);
            ordersByVariant[requestedVariantIndex] = blockOrder;
        }

        // Five variants are five different permutations.
        expect(
            new Set(Object.values(ordersByVariant).map((o) => o.join(",")))
                .size,
        ).eq(5);

        // The same variant reproduces the same order.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons(),
            requestedVariantIndex: 3,
        });
        const sv = await stateValuesOf(core, await resolvePathToNodeIdx("p"));
        expect(sv.blockOrder).eqls(ordersByVariant[3]);
    });

    it("shuffleOrder false keeps document order", async () => {
        for (const requestedVariantIndex of [1, 2]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: basicParsons({ attributes: `shuffleOrder="false"` }),
                requestedVariantIndex,
            });
            const sv = await stateValuesOf(
                core,
                await resolvePathToNodeIdx("p"),
            );
            expect(sv.blockOrder).eqls([1, 2, 3, 4]);
            expect(sv.generatedVariantInfo.indices).eq(undefined);
        }
    });

    it("moveBlock: append, insert, reorder, remove, and ignore bad requests", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `shuffleOrder="false"` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        // append
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 2,
            toArea: "solution",
            core,
        });
        let sv = await stateValuesOf(core, parsonsIdx);
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
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([3, 2]);

        // append via an out-of-range position
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            toPosition: 10,
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
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
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([2, 1, 3]);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            toPosition: 1,
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([1, 2, 3]);
        expect(sv.currentResponses[1]).eq(2);
        expect(
            (await stateValuesOf(core, await resolvePathToNodeIdx("cr2")))
                .value,
        ).eq(2);

        // remove
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 2,
            toArea: "unused",
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([1, 3]);
        // the pile keeps document order
        expect(sv.unusedIndices).eqls([2, 4]);

        // bad requests change nothing
        for (const args of [
            { blockIndex: 0, toArea: "solution" as const },
            { blockIndex: 5, toArea: "solution" as const },
            { blockIndex: 1.5, toArea: "solution" as const },
            { blockIndex: 2, toArea: "sideways" as any },
            { blockIndex: 2, toArea: "solution" as const, toPosition: 1.5 },
            {
                blockIndex: 2,
                toArea: "solution" as const,
                toPosition: "1" as any,
            },
        ]) {
            await moveParsonsBlock({ componentIdx: parsonsIdx, core, ...args });
            sv = await stateValuesOf(core, parsonsIdx);
            expect(sv.solutionIndices).eqls([1, 3]);
        }
    });

    it("moveBlock is ignored when fixed or disabled", async () => {
        for (const attributes of ["fixed", "disabled"]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: basicParsons({ attributes }),
            });
            const parsonsIdx = await resolvePathToNodeIdx("p");

            await moveParsonsBlock({
                componentIdx: parsonsIdx,
                blockIndex: 1,
                toArea: "solution",
                core,
            });
            const sv = await stateValuesOf(core, parsonsIdx);
            expect(sv.solutionIndices).eqls([]);
        }
    });

    it("a hidden block takes no part", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({
                attributes: `shuffleOrder="false"`,
                blocks: `<block name="b5" hide><p>unseen</p></block>`,
            }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        let sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.numBlocks).eq(5);
        expect(sv.blockOrder).eqls([1, 2, 3, 4, 5]);
        expect(sv.unusedIndices).eqls([1, 2, 3, 4]);
        expect(sv.correctOrder).eqls([1, 2, 3]);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 5,
            toArea: "solution",
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([]);

        await arrange({ core, parsonsIdx, solution: [1, 2, 3] });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchievedIfSubmit).eq(1);
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

            let sv = await stateValuesOf(core, parsonsIdx);
            expect(sv.creditAchievedIfSubmit).eq(credit);
            expect(sv.creditAchieved).eq(0);

            await submitAnswer({ componentIdx: parsonsIdx, core });

            sv = await stateValuesOf(core, parsonsIdx);
            expect(sv.creditAchieved).eq(credit);
            expect(sv.submittedResponses).eqls(solution);
            expect(sv.numSubmittedResponses).eq(solution.length);
            expect(
                (await stateValuesOf(core, await resolvePathToNodeIdx("ca")))
                    .value,
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

        const sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(0);
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

        let sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.responseHasBeenSubmitted).eq(false);
        expect(sv.justSubmitted).eq(false);
        expect(sv.numSubmissions).eq(0);

        await arrange({ core, parsonsIdx, solution: [2, 1] });
        await submitAnswer({ componentIdx: parsonsIdx, core });

        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(0);
        expect(sv.responseHasBeenSubmitted).eq(true);
        expect(sv.justSubmitted).eq(true);
        expect(sv.numSubmissions).eq(1);
        expect(sv.numIncorrectSubmissions).eq(1);
        expect(sv.submittedResponses).eqls([2, 1]);

        // a further move clears justSubmitted but keeps the submitted record
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            toPosition: 1,
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.justSubmitted).eq(false);
        expect(sv.currentResponses).eqls([1, 2]);
        expect(sv.submittedResponses).eqls([2, 1]);

        await submitAnswer({ componentIdx: parsonsIdx, core });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(1);
        expect(sv.justSubmitted).eq(true);
        expect(sv.numSubmissions).eq(2);
        expect(sv.numIncorrectSubmissions).eq(1);
        expect(sv.submittedResponses).eqls([1, 2]);

        // weight 3 against an unanswered answer of weight 1
        expect(
            (await stateValuesOf(core, await resolvePathToNodeIdx("dca")))
                .value,
        ).eq(0.75);
    });

    it("a section-wide check work button replaces the parsons' own", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <problem name="prob" sectionWideCheckWork>
        <parsons name="p">
            <label>Order the steps</label>
            <block name="b1"><p>first</p></block>
            <block name="b2"><p>second</p></block>
        </parsons>
    </problem>
    `,
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");
        const problemIdx = await resolvePathToNodeIdx("prob");

        let sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.showCheckWork).eq(false);

        await arrange({ core, parsonsIdx, solution: [1, 2] });
        await core.requestAction({
            componentIdx: problemIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(1);
        expect(sv.justSubmitted).eq(true);
        expect((await stateValuesOf(core, problemIdx)).creditAchieved).eq(1);
    });

    it("disableAfterCorrect freezes the arrangement", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `disableAfterCorrect` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await arrange({ core, parsonsIdx, solution: [1, 2, 3] });
        let sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.disabled).eq(false);

        await submitAnswer({ componentIdx: parsonsIdx, core });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(1);
        expect(sv.disabled).eq(true);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "unused",
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([1, 2, 3]);
        expect(sv.numSubmissions).eq(1);
    });

    it("maxNumAttempts limits submissions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `maxNumAttempts="1"` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await arrange({ core, parsonsIdx, solution: [1, 3, 2] });
        await submitAnswer({ componentIdx: parsonsIdx, core });
        let sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(0);
        expect(sv.numAttemptsLeft).eq(0);
        expect(sv.disabled).eq(true);

        // fixing the order and submitting again changes nothing
        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 2,
            toArea: "solution",
            toPosition: 2,
            core,
        });
        await submitAnswer({ componentIdx: parsonsIdx, core });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.solutionIndices).eqls([1, 3, 2]);
        expect(sv.creditAchieved).eq(0);
        expect(sv.numSubmissions).eq(1);
    });

    it("handGraded submissions record no credit", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: basicParsons({ attributes: `handGraded` }),
        });
        const parsonsIdx = await resolvePathToNodeIdx("p");

        await arrange({ core, parsonsIdx, solution: [1, 2, 3] });
        await submitAnswer({ componentIdx: parsonsIdx, core });
        const sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchieved).eq(0);
        expect(sv.submittedResponses).eqls([1, 2, 3]);
        expect(sv.showCorrectness).eq(false);
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

        let sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.correctOrder).eqls([]);
        expect(sv.creditAchievedIfSubmit).eq(1);

        await moveParsonsBlock({
            componentIdx: parsonsIdx,
            blockIndex: 1,
            toArea: "solution",
            core,
        });
        sv = await stateValuesOf(core, parsonsIdx);
        expect(sv.creditAchievedIfSubmit).eq(0);
    });

    it("a parsons with no blocks warns and earns nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <parsons name="p">
        <label>Empty</label>
    </parsons>
    `,
        });

        const warnings = getDiagnosticsByType(core).warnings;
        expect(warnings.length).eq(1);
        expect(warnings[0].message).toContain("no `<block>` children");

        const parsonsIdx = await resolvePathToNodeIdx("p");
        expect(
            (await stateValuesOf(core, parsonsIdx)).creditAchievedIfSubmit,
        ).eq(0);
        await submitAnswer({ componentIdx: parsonsIdx, core });
        expect((await stateValuesOf(core, parsonsIdx)).creditAchieved).eq(0);
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

        // a hidden label does not count
        ({ core } = await createTestCore({
            doenetML: basicParsons({
                label: "<label hide>Order the steps</label>",
            }),
        }));
        expect(getDiagnosticsByType(core).accessibility.length).eq(1);

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

    it("unique variants enumerate every block order, with a <setup> present", async () => {
        // Three blocks give 3! = 6 unique variants, one per permutation,
        // reached through `determineNumberOfUniqueVariants`/`getUniqueVariant`.
        // The `<setup>` must not defeat that.
        const doenetML = `
    <parsons name="p">
        <label>Order the steps</label>
        <setup><number name="k">2</number></setup>
        <statement><p>Start here</p></statement>
        <block><p>first</p></block>
        <block><p>second: $k</p></block>
        <block><p>third</p></block>
    </parsons>
    `;

        const orders = new Set<string>();
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const sv = await stateValuesOf(
                core,
                await resolvePathToNodeIdx("p"),
            );
            expect([...sv.blockOrder].sort()).eqls([1, 2, 3]);
            orders.add(sv.blockOrder.join(","));
        }
        expect(orders.size).eq(6);
    });
});
