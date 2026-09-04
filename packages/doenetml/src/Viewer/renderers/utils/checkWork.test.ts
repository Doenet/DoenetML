import { describe, expect, it } from "vitest";
import { calculateValidationState } from "./checkWork";

/**
 * The state variables a submitted section-wide check-work button arrives with.
 * `creditAchievedForCheckWork` is the credit the button reports; it is `null`
 * for every container but one whose scored region carries no weight, and absent
 * altogether on an `<answer>` or an input.
 */
function submittedSVs(SVs: Record<string, any>) {
    return { justSubmitted: true, numAttemptsLeft: Infinity, ...SVs };
}

describe("calculateValidationState", () => {
    it("reports nothing until the work has been submitted", () => {
        expect(
            calculateValidationState({
                justSubmitted: false,
                numAttemptsLeft: 3,
                creditAchieved: 1,
            }),
        ).eq("unvalidated");
    });

    it("reads creditAchieved when there is no separate check-work credit", () => {
        // An `<answer>` or an input: the variable does not exist on it at all.
        expect(
            calculateValidationState(submittedSVs({ creditAchieved: 1 })),
        ).eq("correct");
        expect(
            calculateValidationState(submittedSVs({ creditAchieved: 0 })),
        ).eq("incorrect");
        expect(
            calculateValidationState(submittedSVs({ creditAchieved: 0.5 })),
        ).eq("partialcorrect");
    });

    it("falls back to creditAchieved when the check-work credit is null", () => {
        // The ordinary section: the core deliberately leaves the variable
        // `null` rather than building a second aggregation chain for it.
        expect(
            calculateValidationState(
                submittedSVs({
                    creditAchievedForCheckWork: null,
                    creditAchieved: 1,
                }),
            ),
        ).eq("correct");
        expect(
            calculateValidationState(
                submittedSVs({
                    creditAchievedForCheckWork: null,
                    creditAchieved: 0,
                }),
            ),
        ).eq("incorrect");
    });

    it("prefers the check-work credit over the score when the two disagree", () => {
        // A section-wide check work whose answers all carry `weight="0"`: it is
        // worth full marks because nothing in it can lose any, but the button
        // is being asked whether the answers are right.
        expect(
            calculateValidationState(
                submittedSVs({
                    creditAchievedForCheckWork: 0,
                    creditAchieved: 1,
                }),
            ),
        ).eq("incorrect");
        expect(
            calculateValidationState(
                submittedSVs({
                    creditAchievedForCheckWork: 0.5,
                    creditAchieved: 1,
                }),
            ),
        ).eq("partialcorrect");
        expect(
            calculateValidationState(
                submittedSVs({
                    creditAchievedForCheckWork: 1,
                    creditAchieved: 1,
                }),
            ),
        ).eq("correct");
    });

    it("uses the check-work credit once the attempts are exhausted too", () => {
        expect(
            calculateValidationState({
                justSubmitted: false,
                numAttemptsLeft: 0,
                creditAchievedForCheckWork: 0,
                creditAchieved: 1,
            }),
        ).eq("incorrect");
    });
});
