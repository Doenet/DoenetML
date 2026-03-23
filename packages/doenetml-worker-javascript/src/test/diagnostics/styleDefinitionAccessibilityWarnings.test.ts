import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function expectStyleContrastWarning({
    warning,
    styleNumber,
    context,
    line,
}: {
    warning: any;
    styleNumber: number;
    context: string;
    line?: number;
}) {
    expect(warning.message).toContain(`Style definition ${styleNumber}`);
    expect(warning.message).toContain(context);
    expect(warning.message).toContain("insufficient");
    expect(warning.message).toContain("contrast");

    if (line !== undefined) {
        expect(warning.position.start.line).eq(line);
    }
}

describe("Style definition accessibility warnings @group4", async () => {
    it("warns for failing accumulated text/background contrast with position of latest contributor", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="3" textColor="#555555" />
<section>
  <styleDefinition styleNumber="3" backgroundColor="#cacaca" />
  <subsection>
    <styleDefinition styleNumber="3" backgroundColor="#c8c8c8" />
  </subsection>
  <subsection>
    <styleDefinition styleNumber="3" textColor="#444444" backgroundColor="#c8c8c8" />
  </subsection>
</section>
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 3,
            context: "text color against background color",
            line: 6,
        });
    });

    it("does not warn when overwritten text restores sufficient contrast", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="3" textColor="#555555" />
<section>
  <styleDefinition styleNumber="3" backgroundColor="#cacaca" />
  <subsection>
    <styleDefinition styleNumber="3" textColor="#444444" backgroundColor="#c8c8c8" />
  </subsection>
</section>
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(0);
    });

    it("warns for line contrast failure when opacity lowers contrast", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="9" lineColor="#000000" />
<styleDefinition styleNumber="9" lineOpacity="0.2" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 9,
            context: "line color against the canvas",
            line: 3,
        });
    });

    it("warns for high-contrast color that fails against canvas text", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="10" highContrastColor="#f0f0f0" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 10,
            context: "high-contrast color against canvas text",
            line: 2,
        });
    });

    it("evaluates style definitions even when no rendered component uses the style number", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="15" textColor="#777777" backgroundColor="#c8c8c8" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 15,
            context: "text color against background color",
        });
    });

    it("does not duplicate warning when style description variable is referenced", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" textColor="#ff9900"/>
<p>The color of <text name="t">Hello</text> is $t.textColor.</p>
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 1,
            context: "text color against the canvas",
        });
    });

    it("does not warn for near-threshold text contrast that is above 4.5:1", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="16" textColor="#767676" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(0);
    });

    it("does not warn for near-threshold line contrast that is above 3:1", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="17" lineColor="#949494" lineOpacity="1" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(0);
    });

    it("emits all applicable warnings when one style fails multiple contrast checks", async () => {
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
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(4);

        const contexts = warnings.map((x) => x.message);
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

    it("warns for marker contrast failure when markerOpacity lowers contrast", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="19" markerColor="#000000" />
<styleDefinition styleNumber="19" markerOpacity="0.2" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 19,
            context: "marker color against the canvas",
            line: 3,
        });
    });

    it("does not warn or crash when color values are not parseable", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="20" textColor="notARealColor" />
<styleDefinition styleNumber="20" lineColor="stillNotAColor" />
<styleDefinition styleNumber="20" markerColor="nope" />
<styleDefinition styleNumber="20" highContrastColor="badColor" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(0);
    });

    it("uses the latest contributing source position when text and background both contribute", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="21" textColor="#777777" />
<styleDefinition styleNumber="21" backgroundColor="#c8c8c8" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 21,
            context: "text color against background color",
            line: 3,
        });
    });

    it("does not duplicate non-text warning when line style values are referenced", async () => {
        const { core } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="22" lineColor="#000000" lineOpacity="0.2" />
<graph>
  <shortDescription>Graph to activate style usage</shortDescription>
  <line name="l" styleNumber="22" through="(0,0) (1,1)" />
</graph>
<p>The line uses color $l.lineColor and opacity $l.lineOpacity.</p>
`,
        });

        const { warnings } = getDiagnosticsByType(core);

        expect(warnings.length).eq(1);
        expectStyleContrastWarning({
            warning: warnings[0],
            styleNumber: 22,
            context: "line color against the canvas",
        });
    });
});
