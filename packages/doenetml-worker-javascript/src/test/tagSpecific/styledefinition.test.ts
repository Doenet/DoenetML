import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Style definition tag tests", async () => {
    it("child of document", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" markerColor="green" />
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The green point.");
    });

    it("In setup", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinition styleNumber="1" markerColor="green" />
</setup>
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The green point.");
    });

    it("Section overrides document", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinition styleNumber="1" markerColor="green" />
</setup>
<section name="s1">
    <styleDefinition styleNumber="1" markerColor="red" />
    <point name="P" />
    <p name="p">The $P.styleDescription point.</p>
</section>

<section name="s2">
    <point name="P" />
    <p name="p">Back to $P.styleDescription point.</p>
</section>

<section name="s3">
    <setup>
        <styleDefinition styleNumber="1" markerColor="yello" />
    </setup>
    <point name="P" />
    <p name="p">Now a $P.styleDescription point.</p>
</section>

`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("s1.p")].stateValues.text,
        ).eq("The red point.");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p")].stateValues.text,
        ).eq("Back to green point.");
        expect(
            stateVariables[await resolvePathToNodeIdx("s3.p")].stateValues.text,
        ).eq("Now a yello point.");
    });

    it("Last wins", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinition styleNumber="1" markerColor="green" />
    <styleDefinition styleNumber="1" markerColor="brown" />
</setup>
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The brown point.");
    });
});
