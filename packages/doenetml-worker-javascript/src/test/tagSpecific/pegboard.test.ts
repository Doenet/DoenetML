import { describe, expect, it } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

describe("Pegboard tag tests", async () => {
    it("refuses a label child rather than accepting one it cannot draw", async () => {
        // A pegboard fills the whole visible region, so there is nowhere to
        // put a label and the renderer draws none.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <pegboard name="pb"><label>a pegboard</label></pegboard>
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const pb = stateVariables[await resolvePathToNodeIdx("pb")];

        expect(pb.stateValues.label).eq(undefined);

        const { errors, warnings } = getDiagnosticsByType(core);
        expect(errors.length).eq(0);
        expect(warnings.length).eq(1);
        expect(warnings[0].message).contain(
            "Invalid children for `<pegboard>`",
        );
        expect(warnings[0].message).contain("`<label>`");
    });

    // Moved here from the `<graph>` tests, now that a pegboard has a home of
    // its own.
    it("exposes its lattice attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <pegboard name="a" />
    <pegboard name="b" dx="0.5" dy="2" xoffset="0.25" yoffset="-1" />
  </graph>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const a = stateVariables[await resolvePathToNodeIdx("a")];
        const b = stateVariables[await resolvePathToNodeIdx("b")];

        expect(a.stateValues.dx).eq(1);
        expect(a.stateValues.dy).eq(1);
        expect(a.stateValues.xoffset).eq(0);
        expect(a.stateValues.yoffset).eq(0);

        expect(b.stateValues.dx).eq(0.5);
        expect(b.stateValues.dy).eq(2);
        expect(b.stateValues.xoffset).eq(0.25);
        expect(b.stateValues.yoffset).eq(-1);
    });
});
