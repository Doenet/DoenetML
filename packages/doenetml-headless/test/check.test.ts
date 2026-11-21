import { describe, expect, it } from "vitest";
import { check } from "../src";

describe("check", () => {
    it("returns diagnostics of every type", async () => {
        const result = await check(`
    <answer>x</answer>
    <p>$nothing</p>
    <bogus />
    <sequence from="y" />
    `);
        const types = new Set(result.diagnostics.map((d) => d.type));
        expect([...types].sort()).toEqual([
            "accessibility",
            "error",
            "info",
            "warning",
        ]);
        const accessibility = result.diagnostics.find(
            (d) => d.type === "accessibility",
        );
        expect(accessibility?.message).toContain(
            "short description or a label",
        );
    });

    it("reports the answers with and without a stable key, and the variant count", async () => {
        const result = await check(`
    <selectFromSequence name="n" from="1" to="3" />
    <answer name="a">$n</answer>
    <repeatForSequence name="r" length="2">
      <group name="g"><answer name="inRepeat">1</answer></group>
    </repeatForSequence>
    <p><answer>x</answer></p>
    <p name="p1"><answer name="same">1</answer></p>
    <p name="p2"><answer name="same">2</answer></p>
    `);
        expect(result.numVariants).toBe(3);
        expect(result.answers.map((a) => a.stableKey)).toEqual([
            "a",
            // The shortest path that reaches it, which skips the group
            "r[1].inRepeat",
            "r[2].inRepeat",
            null,
            "p1.same",
            "p2.same",
        ]);
        expect(result.answersWithoutStableKey).toHaveLength(1);
        expect(result.answersWithoutStableKey[0].position?.start.line).toBe(7);
        expect(result.answers[0].inputs).toEqual([
            { componentType: "mathInput" },
        ]);
    });
});
