import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function expectStyleContrastError({
    error,
    styleNumber,
    context,
    line,
}: {
    error: any;
    styleNumber: number;
    context: string;
    line?: number;
}) {
    expect(error.message).toContain(`Style definition ${styleNumber}`);
    expect(error.message).toContain(context);
    expect(error.message).toContain("insufficient");
    expect(error.message).toContain("contrast");

    if (line !== undefined) {
        expect(error.position.start.line).eq(line);
    }
}

describe("Style definition accessibility errors when upgraded @group4", async () => {
    it("emits errors rather than warnings when flag is enabled", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="3" textColor="#ff9900" />
`,
            flags: { upgradeAccessibilityWarningsToErrors: true },
        });

        const errors = core.core!.diagnostics.filter((d) => d.type === "error");
        const warnings = core.core!.diagnostics.filter(
            (d) => d.type !== "error",
        );

        expect(errors.length).eq(1);
        expect(warnings.length).eq(0);

        expectStyleContrastError({
            error: errors[0],
            styleNumber: 3,
            context: "text color against the canvas",
            line: 2,
        });
    });

    it("does not duplicate upgraded error when style description variable is referenced", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" textColor="#ff9900"/>
<p>The color of <text name="t">Hello</text> is $t.textColor.</p>
`,
            flags: { upgradeAccessibilityWarningsToErrors: true },
        });

        const errors = core.core!.diagnostics.filter((d) => d.type === "error");
        const warnings = core.core!.diagnostics.filter(
            (d) => d.type !== "error",
        );

        expect(errors.length).eq(1);
        expect(warnings.length).eq(0);
        expectStyleContrastError({
            error: errors[0],
            styleNumber: 1,
            context: "text color against the canvas",
        });
    });

    it("emits all applicable upgraded errors for a style failing multiple checks", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition
  styleNumber="18"
  textColor="#777777"
  backgroundColor="#c8c8c8"
  highContrastColor="#f0f0f0"
  lineColor="#000000"
  lineOpacity="0.2"
  markerColor="#000000"
  markerOpacity="0.2"
/>
`,
            flags: { upgradeAccessibilityWarningsToErrors: true },
        });

        const errors = core.core!.diagnostics.filter((d) => d.type === "error");
        const warnings = core.core!.diagnostics.filter(
            (d) => d.type !== "error",
        );

        expect(errors.length).eq(4);
        expect(warnings.length).eq(0);

        const contexts = errors.map((x) => x.message);
        expect(
            contexts.some((m) =>
                m.includes("text color against background color"),
            ),
        ).eq(true);
        expect(
            contexts.some((m) =>
                m.includes("high-contrast color against canvas text"),
            ),
        ).eq(true);
        expect(
            contexts.some((m) => m.includes("line color against the canvas")),
        ).eq(true);
        expect(
            contexts.some((m) => m.includes("marker color against the canvas")),
        ).eq(true);
    });
});
