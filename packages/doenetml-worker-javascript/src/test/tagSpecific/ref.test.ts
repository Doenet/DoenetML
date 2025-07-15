import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("ref tag tests", async () => {
    it("reference to internal component", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <p name="p">A paragraph<p>

        <p><ref to="$p" name="ref">See paragraph</ref></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues.url,
        ).eq("#p");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .linkText,
        ).eq("See paragraph");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityId,
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityUrlPostfix,
        ).eq("");
    });

    it("reference to external doenetml", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <ref to="doenet:abc" name="ref">link</ref>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues.url,
        ).eq("doenet:abc");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityId,
        ).eq("abc");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityUrlPostfix,
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .linkText,
        ).eq("link");
    });

    it("reference to external doenetml with hash", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <ref to="doenet:abc#p" name="ref">link</ref>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues.url,
        ).eq("doenet:abc#p");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityId,
        ).eq("abc");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityUrlPostfix,
        ).eq("#p");
    });

    it("reference to external doenetml with parameters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <ref to="doenet:abc?cid=def" name="ref">link</ref>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues.url,
        ).eq("doenet:abc?cid=def");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityId,
        ).eq("abc");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityUrlPostfix,
        ).eq("?cid=def");
    });

    it("reference to url", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <ref to="https://doenet.org" name="ref">link</ref>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues.url,
        ).eq("https://doenet.org");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityId,
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityUrlPostfix,
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .linkText,
        ).eq("link");
    });

    it("reference to url with no link text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <ref to="https://doenet.org" name="ref"></ref>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues.url,
        ).eq("https://doenet.org");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityId,
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .activityUrlPostfix,
        ).eq("");

        expect(
            stateVariables[await resolvePathToNodeIdx("ref")].stateValues
                .linkText,
        ).eq("https://doenet.org");
    });

    it("referencing refs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <p name="p1">A ref to <ref name="ref1" to="https://doenet.org" />.</p>
        <p name="p2">Repeat ref: <ref extend="$ref1" name="ref2" />.</p>
        <p name="p3">The link address is: $ref1.url.</p>
        <p name="p4">The text reffed is: $ref1.linkText.</p>

        <p name="p5">A ref to <ref name="ref3" to="$p1">the first paragraph</ref>.</p>
        <p name="p6">Repeat ref: <ref extend="$ref3" name="ref4" />.</p>
        <p name="p7">The link address is: $ref3.url.</p>
        <p name="p8">The text reffed is: $ref3.linkText.</p>

        <p name="p9">A ref to <ref name="ref5" to="doenet:abc">another doc</ref>.</p>
        <p name="p10">Repeat ref: <ref extend="$ref5" name="ref6" />.</p>
        <p name="p11">The link address is: $ref5.url.</p>
        <p name="p12">The text reffed is: $ref5.linkText.</p>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("A ref to https://doenet.org.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref1")].stateValues.url,
        ).eq("https://doenet.org");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref1")].stateValues
                .linkText,
        ).eq("https://doenet.org");

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Repeat ref: https://doenet.org.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref2")].stateValues.url,
        ).eq("https://doenet.org");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref2")].stateValues
                .linkText,
        ).eq("https://doenet.org");

        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("The link address is: https://doenet.org.");

        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("The text reffed is: https://doenet.org.");

        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq("A ref to the first paragraph.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref3")].stateValues
                .linkText,
        ).eq("the first paragraph");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref3")].stateValues.url,
        ).eq("#p1");

        expect(
            stateVariables[await resolvePathToNodeIdx("p6")].stateValues.text,
        ).eq("Repeat ref: the first paragraph.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref4")].stateValues.url,
        ).eq("#p1");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref4")].stateValues
                .linkText,
        ).eq("the first paragraph");

        expect(
            stateVariables[await resolvePathToNodeIdx("p7")].stateValues.text,
        ).eq("The link address is: #p1.");

        expect(
            stateVariables[await resolvePathToNodeIdx("p8")].stateValues.text,
        ).eq("The text reffed is: the first paragraph.");

        expect(
            stateVariables[await resolvePathToNodeIdx("p9")].stateValues.text,
        ).eq("A ref to another doc.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref5")].stateValues
                .linkText,
        ).eq("another doc");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref5")].stateValues.url,
        ).eq("doenet:abc");

        expect(
            stateVariables[await resolvePathToNodeIdx("p10")].stateValues.text,
        ).eq("Repeat ref: another doc.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref6")].stateValues.url,
        ).eq("doenet:abc");
        expect(
            stateVariables[await resolvePathToNodeIdx("ref6")].stateValues
                .linkText,
        ).eq("another doc");

        expect(
            stateVariables[await resolvePathToNodeIdx("p11")].stateValues.text,
        ).eq("The link address is: doenet:abc.");

        expect(
            stateVariables[await resolvePathToNodeIdx("p12")].stateValues.text,
        ).eq("The text reffed is: another doc.");
    });
});
