import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Accessibility diagnostics @group4", async () => {
    it("emits level 1 accessibility diagnostics for missing or blank short description in graph, image, video", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <graph name="g1"></graph>
    <graph name="g2"><shortDescription></shortDescription></graph>
    <graph name="g3"><shortDescription>   </shortDescription></graph>
    <graph name="g4"><shortDescription>Valid short description</shortDescription></graph>

    <image name="i1"></image>
    <image name="i2"><shortDescription></shortDescription></image>
    <image name="i3"><shortDescription>   </shortDescription></image>
    <image name="i4"><shortDescription>Valid short description</shortDescription></image>

    <video name="v1"></video>
    <video name="v2"><shortDescription></shortDescription></video>
    <video name="v3"><shortDescription>   </shortDescription></video>
    <video name="v4"><shortDescription>Valid short description</shortDescription></video>

    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(9);
        expect(
            diagnosticsByType.accessibility.every(
                (diagnostic) => diagnostic.level === 1,
            ),
        ).eq(true);

        const expectedMessageByLine: Record<string, string> = {
            2: "`<graph>` must either have a short description or be specified as decorative",
            3: "`<graph>` must either have a short description or be specified as decorative",
            4: "`<graph>` must either have a short description or be specified as decorative",
            7: "`<image>` must either have a short description or be specified as decorative",
            8: "`<image>` must either have a short description or be specified as decorative",
            9: "`<image>` must either have a short description or be specified as decorative",
            12: "`<video>` must have a short description",
            13: "`<video>` must have a short description",
            14: "`<video>` must have a short description",
        };

        for (const lineNum in expectedMessageByLine) {
            const expectedMessage = expectedMessageByLine[lineNum];
            const diagnostic = diagnosticsByType.accessibility.find(
                (d) => d.position.start.line === parseInt(lineNum),
            );
            expect(diagnostic!.message).toContain(expectedMessage);
        }
    });

    it("emits level 1 accessibility diagnostics for missing or blank short description and label in input", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <mathInput></mathInput>
    <mathInput><shortDescription></shortDescription></mathInput>
    <mathInput><shortDescription>   </shortDescription></mathInput>
    <mathInput><shortDescription>Valid short description</shortDescription></mathInput>

    <mathInput><label></label></mathInput>
    <mathInput><label>   </label></mathInput>
    <mathInput><label>Valid text label</label></mathInput>
    <mathInput><label><m>   </m></label></mathInput>
    <mathInput><label><m>x</m></label></mathInput>

    <mathInput labelIsName></mathInput>
    <mathInput name="namedA" labelIsName></mathInput>
    <mathInput name="namedB" labelIsName="false"></mathInput>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(8);
        expect(
            diagnosticsByType.accessibility.every(
                (diagnostic) => diagnostic.level === 1,
            ),
        ).eq(true);

        const accessibilityMsg =
            "For accessibility, `<mathInput>` must have a short description or a label";

        const diagnosticOnLines = [2, 3, 4, 7, 8, 10, 13, 15];

        for (const lineNum of diagnosticOnLines) {
            const diagnostic = diagnosticsByType.accessibility.find(
                (d) => d.position.start.line === lineNum,
            );
            expect(diagnostic!.message).toContain(accessibilityMsg);
        }
    });

    it("emits level 2 accessibility diagnostics if short description contains math", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <graph><shortDescription>Note that <math>y=x</math></shortDescription></graph>
    <graph><shortDescription>Note that <m>y=x</m></shortDescription></graph>
    <graph><shortDescription>Note that y=x</shortDescription></graph>
    <graph><shortDescription>Note that <text><math>y=x</math></text></shortDescription></graph>
    <graph><shortDescription>Note that $int</shortDescription></graph>
    <graph><shortDescription>Note that <number displayDecimals="$m1">$m1</number></shortDescription></graph>

    <interval name="int">(3,4)</interval>
    <math name="m1">4</math>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(3);
        expect(
            diagnosticsByType.accessibility.every(
                (diagnostic) => diagnostic.level === 2,
            ),
        ).eq(true);

        const expectedMessageByLine: Record<string, string> = {
            2: "Short descriptions should not contain math components such as `<math>`",
            3: "Short descriptions should not contain math components such as `<m>`",
            6: "Short descriptions should not contain math components such as `<interval>`",
        };

        for (const lineNum in expectedMessageByLine) {
            const expectedMessage = expectedMessageByLine[lineNum];
            const diagnostic = diagnosticsByType.accessibility.find(
                (d) => d.position.start.line === parseInt(lineNum),
            );
            expect(diagnostic!.message).toContain(expectedMessage);
        }
    });

    it("follows references when determining accessibility diagnostics", async () => {
        const { core } = await createTestCore({
            doenetML: `
<textInput name="ti1"><label>$ti1</label></textInput>
<textInput name="ti2" prefill="my label"><label>$ti2</label></textInput>
`,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(1);
        expect(diagnosticsByType.accessibility[0].level).eq(1);

        const accessibilityMsg =
            "For accessibility, `<textInput>` must have a short description or a label";

        const diagnostic = diagnosticsByType.accessibility.find(
            (d) => d.position.start.line === 2,
        );
        expect(diagnostic!.message).toContain(accessibilityMsg);
    });

    it("external labels with `for` attribute satisfy input accessibility requirements", async () => {
        const { core } = await createTestCore({
            doenetML: `
<textInput name="tiMissing" />
<label for="$tiLabeled">Your name</label>
<textInput name="tiLabeled" />

<choiceInput name="ciMissing">
    <choice>A</choice>
    <choice>B</choice>
</choiceInput>
<label for="$ciLabeled">Pick one</label>
<choiceInput name="ciLabeled">
    <choice>A</choice>
    <choice>B</choice>
</choiceInput>

<matrixInput name="miMissing" />
<label for="$miLabeled">Matrix A</label>
<matrixInput name="miLabeled" />

<answer name="ansMissing">2</answer>
<label for="$ansLabeled">1+1=</label>
<answer name="ansLabeled">2</answer>
`,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(4);
        expect(
            diagnosticsByType.accessibility.every(
                (diagnostic) => diagnostic.level === 1,
            ),
        ).eq(true);

        const diagnosticLines = diagnosticsByType.accessibility
            .map((d) => d.position.start.line)
            .sort((a, b) => a - b);
        expect(diagnosticLines).eql([2, 6, 16, 20]);

        const textInputDiagnostic = diagnosticsByType.accessibility.find((d) =>
            d.message.includes("`<textInput>`"),
        );
        expect(textInputDiagnostic).toBeDefined();
        expect(textInputDiagnostic!.message).toContain("`<textInput>`");

        const answerDiagnostic = diagnosticsByType.accessibility.find((d) =>
            d.message.includes("an `<answer>` creating an input"),
        );
        expect(answerDiagnostic).toBeDefined();
        expect(answerDiagnostic!.message).toContain(
            "an `<answer>` creating an input",
        );

        const choiceInputDiagnostic = diagnosticsByType.accessibility.find(
            (d) => d.message.includes("`<choiceInput>`"),
        );
        expect(choiceInputDiagnostic).toBeDefined();
        expect(choiceInputDiagnostic!.message).toContain("`<choiceInput>`");

        const matrixInputDiagnostic = diagnosticsByType.accessibility.find(
            (d) => d.message.includes("`<matrixInput>`"),
        );
        expect(matrixInputDiagnostic).toBeDefined();
        expect(matrixInputDiagnostic!.message).toContain("`<matrixInput>`");
    });

    it("rejects accessibility diagnostics without a level", async () => {
        const { core } = await createTestCore({
            doenetML: `<text>hello</text>`,
        });
        const workerCore = core.core!;

        expect(() =>
            workerCore.addDiagnostic({
                type: "accessibility",
                message: "Missing accessibility level",
            } as unknown as {
                type: any;
                level: any;
                message: any;
                position: any;
                sourceDoc: any;
            }),
        ).toThrow("Missing accessibility diagnostic level");
    });
});
