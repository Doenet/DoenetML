import { describe, expect, it, vi } from "vitest";
import {
    DIAGNOSTIC_CODES,
    createDiagnosticFormatter,
    createTranslator,
} from "@doenet/i18n";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * i18n Phase 3 (#1518): diagnostics carry a stable code and the values that
 * fill their message in, alongside the English.
 *
 * Unlike the style descriptions of Phase 2, these are *not* translated in the
 * worker. A diagnostic is addressed to whoever is looking at the screen, so it
 * follows `uiLocale`, which the core has no business knowing — the worker's
 * job is to emit the code and the arguments, and the English that renders when
 * nothing better is available. What is checked here is the worker's half: that
 * the code and arguments survive to the record, and that the English is
 * byte-for-byte what the concatenated version produced.
 */
describe("coded diagnostics reach the record", () => {
    it("attaches a code to a message with no arguments", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <ray name="r" through="(1,2)" endpoint="(0,0)" direction="(1,1)" />
</graph>
`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0005");
        expect(warnings[0].message).eq(
            "Ray is prescribed by through, endpoint, and direction.  Ignoring specified through.",
        );
        expect(warnings[0].args).eq(undefined);
    });

    it("carries the list a message names, not the sentence it built", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" slope="1" length="3" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0001");
        expect(infos[0].args).eqls({ attributes: ["slope", "length"] });
        // The English is still what the hand-written phrase builder produced,
        // verb agreement and all — assertions elsewhere depend on it.
        expect(infos[0].message).eq(
            "slope and length are ignored when two endpoints are specified",
        );
    });

    // The plural selector's singular branch, through a real component rather
    // than a hand-built record — one attribute ignored, so the catalog has to
    // say "is" where the two-attribute case says "are".
    it("agrees the verb with a one-attribute list", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2)" midpoint="(4,6)" slope="1" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0003");
        expect(infos[0].args).eqls({ attributes: ["slope"] });
        expect(infos[0].message).eq(
            "slope is ignored when an endpoint and a midpoint are both specified",
        );
    });

    it("attaches a code to the midpointOffset notice", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" midpointOffset="0.3" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0002");
        expect(infos[0].message).eq(
            "midpointOffset has no effect without a midpoint",
        );
    });

    it("carries interpolated values as data", async () => {
        const { core } = await createTestCore({
            doenetML: `<line name="l" equation="x^2 + y = 1" />`,
        });

        const { warnings } = getDiagnosticsByType(core);
        const invalidFormat = warnings.filter(
            (warning) => warning.code === "doenet-w0004",
        );
        expect(invalidFormat.length).toBeGreaterThan(0);
        expect(invalidFormat[0].args).eqls({ variable1: "x", variable2: "y" });
        expect(invalidFormat[0].message).eq(
            "Invalid format for equation of line in variables x and y.",
        );
    });

    // The point of carrying code and arguments rather than a finished string:
    // the main thread can render the message again in a language the worker
    // never saw. This is that step, run against the record the worker emitted.
    it("lets the main thread re-render the record in another language", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" slope="1" length="3" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        const formatEs = createDiagnosticFormatter(
            createTranslator(["es"], {
                es: "line-segment-attributes-ignored-with-endpoints = { $attributesCount ->\n        [one] { $attributes } se ignora\n       *[other] { $attributes } se ignoran\n    }",
            }),
            "es",
        );
        expect(formatEs(infos[0])).eq("slope y length se ignoran");
    });

    it("leaves a diagnostic that has not migrated untouched", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <point name="p" />
</graph>
<sort name="s">a b c</sort>
`,
        });

        const { warnings } = getDiagnosticsByType(core);
        const legacy = warnings.filter((warning) => warning.code === undefined);
        expect(legacy.length).toBeGreaterThan(0);
        expect(legacy[0].message.length).toBeGreaterThan(0);
    });

    it("emits only codes the registry defines", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <ray name="r" through="(1,2)" endpoint="(0,0)" direction="(1,1)" />
  <lineSegment name="l" midpointOffset="1" />
</graph>
`,
        });

        const { warnings, infos } = getDiagnosticsByType(core);
        for (const diagnostic of [...warnings, ...infos]) {
            if (diagnostic.code !== undefined) {
                expect(
                    Object.keys(DIAGNOSTIC_CODES),
                    diagnostic.code,
                ).toContain(diagnostic.code);
            }
        }
    });
});
