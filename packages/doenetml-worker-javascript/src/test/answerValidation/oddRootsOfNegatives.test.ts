import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An odd root of a negative number must grade the same in every spelling:
 * `cbrt(-2)`, `nthroot(-2,3)`, `(-2)^(1/3)`, `\sqrt[3]{-2}` and the decimal
 * `-1.2599…` are all the real cube root of −2.
 *
 * Regression coverage for the engine switch: the Rust engine briefly read
 * `(-2)^(1/3)` as its principal complex value while reading `cbrt(-2)` as the
 * real root — and folded perfect powers like `(-8)^(1/3)` to the real `-2` —
 * so which branch a response landed on depended on how the root was spelled
 * and whether the radicand was a perfect power. Four of the cases below
 * scored 1 under the legacy JS engine and 0 under that split. The engine now
 * reads every odd root of a negative real on the real branch (see
 * `tests/odd_root_real_branch.rs` in the math-expressions crate).
 */
async function expect_credit(
    expected: string,
    responses: Record<string, number>,
) {
    const doenetML = `
    <mathInput name="mi" />
    <answer name="ans">
      <award><when>$mi = ${expected}</when></award>
    </answer>
    `;
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const ansIdx = await resolvePathToNodeIdx("ans");
    const miIdx = await resolvePathToNodeIdx("mi");

    for (const latex in responses) {
        await updateMathInputValue({ latex, componentIdx: miIdx, core });
        await submitAnswer({ componentIdx: ansIdx, core });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[ansIdx].stateValues.creditAchieved,
            `expected ${expected}, response ${latex}`,
        ).eq(responses[latex]);
    }
}

describe("odd roots of negative numbers grade alike in every spelling", () => {
    it("cbrt(-2) accepts the power and decimal spellings", async () => {
        await expect_credit("cbrt(-2)", {
            "(-2)^{1/3}": 1,
            "-\\sqrt[3]{2}": 1,
            "-1.2599210498948732": 1,
            // a control that must stay wrong: the positive root
            "1.2599210498948732": 0,
        });
    });

    it("(-2)^(1/3) accepts the radical and decimal spellings", async () => {
        await expect_credit("(-2)^(1/3)", {
            "\\sqrt[3]{-2}": 1,
            "-1.2599210498948732": 1,
            "1.2599210498948732": 0,
        });
    });

    it("nthroot(-2,3) accepts the power spelling", async () => {
        await expect_credit("nthroot(-2,3)", {
            "(-2)^{1/3}": 1,
            "\\sqrt[3]{-2}": 1,
        });
    });

    it("perfect powers still fold to the same real root", async () => {
        await expect_credit("(-8)^(1/3)", {
            "-2": 1,
            "(-2)^{1/3}\\cdot 4^{1/3}": 1,
            "2": 0,
        });
    });
});
