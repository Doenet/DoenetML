import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    submitAnswer,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function run_tests({
    doenetML,
    responseCredits,
}: {
    doenetML: string;
    responseCredits: {
        responses: Record<string, { x: number; y: number } | number>;
        credit: number;
    }[];
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

    for (let responseObj of responseCredits) {
        await submit_check(responseObj);
    }

    async function submit_check({
        responses,
        credit,
    }: {
        responses: Record<string, { x: number; y: number } | number>;
        credit: number;
    }) {
        for (let name in responses) {
            let resp = responses[name];
            if (typeof resp === "number") {
                await updateMathInputValue({
                    latex: `${resp}`,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            } else {
                await movePoint({
                    componentIdx: await resolvePathToNodeIdx(name),
                    ...resp,
                    core,
                });
            }
        }
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(`ans`)].stateValues
                .justSubmitted,
        ).eq(false);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx(`ans`),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(`ans`)].stateValues
                .creditAchieved,
        ).eq(credit, `credit for response ${JSON.stringify(responses)}`);
        expect(
            stateVariables[await resolvePathToNodeIdx(`ans`)].stateValues
                .justSubmitted,
        ).eq(true);
    }
}

describe("point location validation tests", async () => {
    it("point in first quadrant", async () => {
        let doenetML = `
        <graph><point name="P">(-3.9,4.5)</point></graph>
        <p><answer name="ans">
          <award><when>
            $P.x > 0 and 
            $P.y > 0
          </when></award>
        </answer></p>
        `;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credit: 0,
                },
                {
                    responses: { P: { x: 5.9, y: 3.5 } },
                    credit: 1,
                },
                {
                    responses: { P: { x: -8.8, y: 1.3 } },
                    credit: 0,
                },
                {
                    responses: { P: { x: -9.4, y: -5.1 } },
                    credit: 0,
                },
                {
                    responses: { P: { x: 4.2, y: -2.9 } },
                    credit: 0,
                },
                {
                    responses: { P: { x: 4.6, y: 0.1 } },
                    credit: 1,
                },
            ],
        });
    });

    it("point at precise location with attract", async () => {
        let doenetML = `
        <point name="goal">(-4.1, 7.4)</point>
        <p>Move point to $goal.coords</p>
        <graph>
            <point name="A" x="4.9" y="-1.1">
                <attractTo>$goal</attractTo>
            </point>
        </graph>
        <p><answer name="ans"><award><when>
            $A.x{isResponse} = $goal.x and 
            $A.y{isResponse} = $goal.y
        </when></award></answer></p>
        `;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credit: 0,
                },
                {
                    responses: { A: { x: -4, y: 7.6 } },
                    credit: 1,
                },
                {
                    responses: { A: { x: -3.7, y: 7 } },
                    credit: 0,
                },
                {
                    responses: { A: { x: -3.8, y: 7.1 } },
                    credit: 1,
                },
            ],
        });
    });

    it("point close enough to precise location", async () => {
        let doenetML = `
    <point name="goal">(-4.1, 7.4)</point>

    <p>Criterion distance: <mathInput name="criterion" prefill="2"/></p>
    <p>Partial credit distance: <mathInput name="partialCriterion" prefill="3"/></p>

    <number hide name="criterion2">$criterion.value^2</number>
    <number hide name="partialCriterion2">$partialCriterion.value^2</number>
    <number hide name="distance2">($A.x - $goal.x)^2 + 
    ($A.y - $goal.y)^2</number>

    <p>Move point to within distance of $criterion.value to $goal.coords</p>
    <graph>
      <point name="A">(4.9, -1.1)</point>
    </graph>
    <p><answer name="ans">
      <award><when>
        $distance2 < $criterion2
      </when></award>
      <award credit="0.6"><when>
        $distance2 < $partialCriterion2
      </when></award>
      <considerAsResponses>$A</considerAsResponses>
    </answer></p>
        `;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credit: 0,
                },
                {
                    responses: { A: { x: -5, y: 6 } },
                    credit: 1,
                },
                {
                    responses: { criterion: 1 },
                    credit: 0.6,
                },
                {
                    responses: { A: { x: -5, y: 7 } },
                    credit: 1,
                },
                {
                    responses: { A: { x: -2.8, y: 9 } },
                    credit: 0.6,
                },
                {
                    responses: { partialCriterion: 2 },
                    credit: 0,
                },
                {
                    responses: { A: { x: -3, y: 9 } },
                    credit: 0.6,
                },
                {
                    responses: { A: { x: -3.5, y: 8 } },
                    credit: 1,
                },
            ],
        });
    });

    async function test_two_points(doenetML: string, ordered = false) {
        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credit: 0,
                },
                {
                    responses: { A: { x: -4, y: 7.6 } }, // A near first goal
                    credit: 0.5,
                },
                {
                    responses: { A: { x: -3.7, y: 7 } }, // A away
                    credit: 0,
                },
                {
                    responses: { B: { x: -3.8, y: 7.1 } }, // B near first goal
                    credit: 0.5,
                },
                {
                    responses: { A: { x: 6.9, y: 9.0 } }, // A near second goal
                    credit: ordered ? 0.5 : 1,
                },
                {
                    responses: { B: { x: -9.9, y: -8.8 } }, // B away
                    credit: 0.5,
                },
                {
                    responses: { B: { x: 6.7, y: 9 } }, // B near second goal
                    credit: 0.5,
                },
                {
                    responses: { A: { x: 0.1, y: -1.1 } }, // A away
                    credit: 0.5,
                },
                {
                    responses: { A: { x: -3.8, y: 7.6 } }, // A near first goal
                    credit: 1,
                },
            ],
        });
    }

    it("two points at precise locations, partial match", async () => {
        let doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
    </graph>
    <p><answer name="ans">
      <award matchPartial unorderedCompare referencesAreResponses="$A $B">
        <when>
          ($A, $B) = ($goal1, $goal2)
        </when>
      </award>
    </answer></p>
        `;

        await test_two_points(doenetML);
    });

    it("two points at precise locations, partial match, ordered", async () => {
        let doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
    </graph>
    <p><answer name="ans">
      <award matchPartial referencesAreResponses="$A $B">
        <when>
          ($A, $B) = ($goal1, $goal2)
        </when>
      </award>
    </answer></p>
        `;

        await test_two_points(doenetML, true);
    });

    it("two points at precise locations, award based as string literals, partial match", async () => {
        let doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
    </graph>
    <p><answer name="ans">
      <award matchPartial unorderedCompare referencesAreResponses="$A $B">
        <when>
          ($A, $B) = ((-4.1, 7.4), (6.8, 9.1))
        </when>
      </award>
    </answer></p>
        `;

        await test_two_points(doenetML);
    });

    it("two points at precise locations, award based as string literals, partial match, ordered", async () => {
        let doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
    </graph>
    <p><answer name="ans">
      <award matchPartial referencesAreResponses="$A $B">
        <when>
          ($A, $B) = ((-4.1, 7.4), (6.8, 9.1))
        </when>
      </award>
    </answer></p>
        `;

        await test_two_points(doenetML, true);
    });

    it("two points at precise locations, partial match, as math lists", async () => {
        let doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <attractTo>$goal1</attractTo>
        <attractTo>$goal2</attractTo>
      </point>
    </graph>
    <p><answer name="ans">
      <award matchPartial unorderedCompare referencesAreResponses="$A $B">
        <when>
          <mathList>$A $B</mathList> = <mathList>$goal1 $goal2</mathList>
        </when>
      </award>
    </answer></p>
    </answer></p>
        `;

        await test_two_points(doenetML);
    });

    it("dynamical number of points, partial match, as math lists", async () => {
        const doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <p>Number of points: <mathInput prefill="0" name="n" /></p>
    <graph>
      <setup><sequence fixed='false' from="1" to="$n" name="seq" /></setup>
      <repeat name="r" for="$seq" valueName="i">
        <point x='$i' y='1' name="P">
          <attractTo>$goal1</attractTo>
          <attractTo>$goal2</attractTo>
        </point>
      </repeat>
      
    </graph>
    <p><answer name="ans">
      <award matchPartial unorderedCompare referencesAreResponses="$r">
        <when>
          <mathList>$r</mathList> = <mathList>$goal1 $goal2</mathList>
        </when>
      </award>
    </answer></p>
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credit: 0,
                },
                {
                    responses: { n: 1 }, // create A
                    credit: 0,
                },
                {
                    responses: { "r[1].P": { x: -4, y: 7.6 } }, // A near first goal
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: -3.7, y: 7 } }, // A away
                    credit: 0,
                },
                {
                    responses: { n: 2 }, // create B
                    credit: 0,
                },
                {
                    responses: { "r[2].P": { x: -3.8, y: 7.1 } }, // B near first goal
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: 6.9, y: 9.0 } }, // A near second goal
                    credit: 1,
                },
                {
                    responses: { "r[2].P": { x: -9.9, y: -8.8 } }, // B away
                    credit: 0.5,
                },
                {
                    responses: { "r[2].P": { x: 6.7, y: 9 } }, // B near second goal
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: 0.1, y: -1.1 } }, // A away
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: -3.8, y: 7.6 } }, // A near first goal
                    credit: 1,
                },
                {
                    responses: { n: 3 }, // create C
                    credit: 2 / 3,
                },
                {
                    responses: { "r[3].P": { x: -3.8, y: 7.6 } }, // C near first goal
                    credit: 2 / 3,
                },
                {
                    responses: { n: 2 }, // remove C
                    credit: 1,
                },
            ],
        });
    });

    it("dynamical number of points, double repeat, partial match", async () => {
        const doenetML = `
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to $goal1.coords $goal2.coords</p>
    <p>Number of points: <mathInput prefill="0" name="n" /></p>
    <p>Number of points 2: <mathInput prefill="0" name="m" /></p>
    <graph>
      <setup><sequence name="seq1" fixed='false' from="1" to="$n" /></setup>
      <repeat name="r" for="$seq1" valueName="i">
        <point x='$i' y='1' name="P">
          <attractTo>$goal1</attractTo>
          <attractTo>$goal2</attractTo>
        </point>
        <setup><sequence name="seq2" fixed='false' from="1" to="$m" /></setup>
        <repeat name="r2" for="$seq2" valueName="j">
          <point x='$j' y='2' name="Q">
            <attractTo>$goal1</attractTo>
            <attractTo>$goal2</attractTo>
          </point>
        </repeat>
      </repeat>
    </graph>
    <p><answer name="ans">
      <award matchPartial unorderedCompare referencesAreResponses="$r">
        <when>
          <mathList>$r</mathList> = <mathList>$goal1 $goal2</mathList>
        </when>
      </award>
    </answer></p>
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credit: 0,
                },
                {
                    responses: { n: 1 }, // create A1
                    credit: 0,
                },
                {
                    responses: { "r[1].P": { x: -4, y: 7.6 } }, // A1 near first goal
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: -3.7, y: 7 } }, // A1 away
                    credit: 0,
                },
                {
                    responses: { m: 1 }, // create A2
                    credit: 0,
                },
                {
                    responses: { "r[1].r2[1].Q": { x: -3.8, y: 7.1 } }, // A2 near first goal
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: 6.9, y: 9.0 } }, // A1 near second goal
                    credit: 1,
                },
                {
                    responses: { "r[1].r2[1].Q": { x: -9.9, y: -8.8 } }, // A2 away
                    credit: 0.5,
                },
                {
                    responses: { "r[1].r2[1].Q": { x: 6.7, y: 9 } }, // A2 near second goal
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: 0.1, y: -1.1 } }, // A1 away
                    credit: 0.5,
                },
                {
                    responses: { "r[1].P": { x: -3.8, y: 7.6 } }, // A1 near first goal
                    credit: 1,
                },
                {
                    responses: { n: 2 }, // create B1 and B2
                    credit: 1 / 2,
                },
                {
                    responses: { "r[2].P": { x: 7, y: 9 } }, // B1 near second goal
                    credit: 1 / 2,
                },
                {
                    responses: { m: 0 }, // remove A2 and B2
                    credit: 1,
                },
            ],
        });
    });
});
