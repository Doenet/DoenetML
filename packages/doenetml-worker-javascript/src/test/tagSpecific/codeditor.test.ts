import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateTextInputImmediateValue,
    updateTextInputValueToImmediateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Code Editor tag tests", async () => {
    it("code editor with no arguments", async () => {
        let core = await createTestCore({
            doenetML: `
    <codeEditor name="editor" />

    <p name="p1">$editor.immediateValue</p>
    <p name="p2">$editor.value</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p1"].stateValues.text).eq("");
        expect(stateVariables["/p2"].stateValues.text).eq("");
        expect(stateVariables["/editor"].stateValues.immediateValue).eq("");
        expect(stateVariables["/editor"].stateValues.value).eq("");

        await updateTextInputImmediateValue({
            text: "Hello",
            name: "/editor",
            core,
        });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hello");
        expect(stateVariables["/p2"].stateValues.text).eq("");
        expect(stateVariables["/editor"].stateValues.immediateValue).eq(
            "Hello",
        );
        expect(stateVariables["/editor"].stateValues.value).eq("");

        // No debouncing since that is initiated by the renderer.
        // Have to explicitly call update value
        await updateTextInputValueToImmediateValue({ name: "/editor", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hello");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello");
        expect(stateVariables["/editor"].stateValues.immediateValue).eq(
            "Hello",
        );
        expect(stateVariables["/editor"].stateValues.value).eq("Hello");

        // type more in editor
        await updateTextInputImmediateValue({
            text: "Hello\nMore here.",
            name: "/editor",
            core,
        });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hello\nMore here.");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello");
        expect(stateVariables["/editor"].stateValues.immediateValue).eq(
            "Hello\nMore here.",
        );
        expect(stateVariables["/editor"].stateValues.value).eq("Hello");

        // update value again
        await updateTextInputValueToImmediateValue({ name: "/editor", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hello\nMore here.");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello\nMore here.");
        expect(stateVariables["/editor"].stateValues.immediateValue).eq(
            "Hello\nMore here.",
        );
        expect(stateVariables["/editor"].stateValues.value).eq(
            "Hello\nMore here.",
        );
    });

    it("bind value to", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><codeEditor name="ce" bindValueTo="$ti" /></p>

    <p><textInput name="ti" expanded prefill="Hello!" /></p>

    <p name="pv">value: $ce</p>
    <p name="piv">immediate value: $ce.immediateValue</p>
    <p name="pv2">value: $ti</p>
    <p name="piv2">immediate value: $ti.immediateValue</p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            "immediate value: Hello!",
        );
        expect(stateVariables["/pv"].stateValues.text).eq("value: Hello!");
        expect(stateVariables["/piv2"].stateValues.text).eq(
            "immediate value: Hello!",
        );
        expect(stateVariables["/pv2"].stateValues.text).eq("value: Hello!");

        await updateTextInputImmediateValue({
            text: "Hello!\nSelam!",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            "immediate value: Hello!",
        );
        expect(stateVariables["/pv"].stateValues.text).eq("value: Hello!");
        expect(stateVariables["/piv2"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!",
        );
        expect(stateVariables["/pv2"].stateValues.text).eq("value: Hello!");

        await updateTextInputValueToImmediateValue({ name: "/ti", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!",
        );
        expect(stateVariables["/pv"].stateValues.text).eq(
            "value: Hello!\nSelam!",
        );
        expect(stateVariables["/piv2"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!",
        );
        expect(stateVariables["/pv2"].stateValues.text).eq(
            "value: Hello!\nSelam!",
        );

        await updateTextInputImmediateValue({
            text: "Hello!\nSelam!\nKaixo!",
            name: "/ce",
            core,
        });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!\nKaixo!",
        );
        expect(stateVariables["/pv"].stateValues.text).eq(
            "value: Hello!\nSelam!",
        );
        expect(stateVariables["/piv2"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!",
        );
        expect(stateVariables["/pv2"].stateValues.text).eq(
            "value: Hello!\nSelam!",
        );

        await updateTextInputValueToImmediateValue({ name: "/ce", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!\nKaixo!",
        );
        expect(stateVariables["/pv"].stateValues.text).eq(
            "value: Hello!\nSelam!\nKaixo!",
        );
        expect(stateVariables["/piv2"].stateValues.text).eq(
            "immediate value: Hello!\nSelam!\nKaixo!",
        );
        expect(stateVariables["/pv2"].stateValues.text).eq(
            "value: Hello!\nSelam!\nKaixo!",
        );
    });

    it("prefill from children, ignore indenting", async () => {
        let core = await createTestCore({
            doenetML: `
    <codeEditor name="ce">
        <text name="t1">hello</text> <text>there</text>
        <p name="p1">More</p>
    </codeEditor>

    <p name="pv">value: $ce</p>
    <p name="piv">immediate value: $ce.immediateValue</p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            'immediate value: <text name="t1">hello</text> <text>there</text>\n<p name="p1">More</p>\n',
        );
        expect(stateVariables["/pv"].stateValues.text).eq(
            'value: <text name="t1">hello</text> <text>there</text>\n<p name="p1">More</p>\n',
        );
        // child components not created
        expect(stateVariables["/t1"]).eq(undefined);
        expect(stateVariables["/p2"]).eq(undefined);

        await updateTextInputImmediateValue({
            text: '<text name="t1">hello</text> <text>there</text>\n<p name="p1">Change</p>\n',
            name: "/ce",
            core,
        });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            'immediate value: <text name="t1">hello</text> <text>there</text>\n<p name="p1">Change</p>\n',
        );
        expect(stateVariables["/pv"].stateValues.text).eq(
            'value: <text name="t1">hello</text> <text>there</text>\n<p name="p1">More</p>\n',
        );

        await updateTextInputValueToImmediateValue({ name: "/ce", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/piv"].stateValues.text).eq(
            'immediate value: <text name="t1">hello</text> <text>there</text>\n<p name="p1">Change</p>\n',
        );
        expect(stateVariables["/pv"].stateValues.text).eq(
            'value: <text name="t1">hello</text> <text>there</text>\n<p name="p1">Change</p>\n',
        );
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><codeEditor name="ce1" /> <text copySource="ce1" name="ce1a" /> <boolean copysource="ce1.valueChanged" name="ce1changed" /> <text copySource="ce1.immediateValue" name="ce1iva" /> <boolean copysource="ce1.immediateValueChanged" name="ce1ivchanged" /></p>
    <p><codeEditor name="ce2" prefill="apple" /> <text copySource="ce2" name="ce2a" /> <boolean copysource="ce2.valueChanged" name="ce2changed" /> <text copySource="ce2.immediateValue" name="ce2iva" /> <boolean copysource="ce2.immediateValueChanged" name="ce2ivchanged" /></p>
    <p><codeEditor name="ce3" bindValueTo="$ce1" /> <text copySource="ce3" name="ce3a" /> <boolean copysource="ce3.valueChanged" name="ce3changed" /> <text copySource="ce3.immediateValue" name="ce3iva" /> <boolean copysource="ce3.immediateValueChanged" name="ce3ivchanged" /></p>
    <p><codeEditor name="ce4" bindValueTo="$ce2.immediateValue" /> <text copySource="ce4" name="ce4a" /> <boolean copysource="ce4.valueChanged" name="ce4changed" /> <text copySource="ce4.immediateValue" name="ce4iva" /> <boolean copysource="ce4.immediateValueChanged" name="ce4ivchanged" /></p>

    `;

        async function check_items(
            [ce1, ce2, ce3, ce4]: [
                ce1: string,
                ce2: string,
                ce3: string,
                ce4: string,
            ],
            [ce1iv, ce2iv, ce3iv, ce4iv]: [
                ce1iv: string,
                ce2iv: string,
                ce3iv: string,
                ce4iv: string,
            ],
            [ce1changed, ce2changed, ce3changed, ce4changed]: [
                ce1changed: boolean,
                ce2changed: boolean,
                ce3changed: boolean,
                ce4changed: boolean,
            ],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged]: [
                ce1ivchanged: boolean,
                ce2ivchanged: boolean,
                ce3ivchanged: boolean,
                ce4ivchanged: boolean,
            ],
        ) {
            const stateVariables = await core.returnAllStateVariables(true);
            expect(stateVariables["/ce1"].stateValues.value).eq(ce1);
            expect(stateVariables["/ce2"].stateValues.value).eq(ce2);
            expect(stateVariables["/ce3"].stateValues.value).eq(ce3);
            expect(stateVariables["/ce4"].stateValues.value).eq(ce4);

            expect(stateVariables["/ce1a"].stateValues.value).eq(ce1);
            expect(stateVariables["/ce2a"].stateValues.value).eq(ce2);
            expect(stateVariables["/ce3a"].stateValues.value).eq(ce3);
            expect(stateVariables["/ce4a"].stateValues.value).eq(ce4);

            expect(stateVariables["/ce1iva"].stateValues.value).eq(ce1iv);
            expect(stateVariables["/ce2iva"].stateValues.value).eq(ce2iv);
            expect(stateVariables["/ce3iva"].stateValues.value).eq(ce3iv);
            expect(stateVariables["/ce4iva"].stateValues.value).eq(ce4iv);

            expect(stateVariables["/ce1changed"].stateValues.value).eq(
                ce1changed,
            );
            expect(stateVariables["/ce2changed"].stateValues.value).eq(
                ce2changed,
            );
            expect(stateVariables["/ce3changed"].stateValues.value).eq(
                ce3changed,
            );
            expect(stateVariables["/ce4changed"].stateValues.value).eq(
                ce4changed,
            );

            expect(stateVariables["/ce1ivchanged"].stateValues.value).eq(
                ce1ivchanged,
            );
            expect(stateVariables["/ce2ivchanged"].stateValues.value).eq(
                ce2ivchanged,
            );
            expect(stateVariables["/ce3ivchanged"].stateValues.value).eq(
                ce3ivchanged,
            );
            expect(stateVariables["/ce4ivchanged"].stateValues.value).eq(
                ce4ivchanged,
            );
        }

        let core = await createTestCore({
            doenetML,
        });

        let ce1 = "",
            ce2 = "apple",
            ce3 = "",
            ce4 = "apple";
        let ce1iv = "",
            ce2iv = "apple",
            ce3iv = "",
            ce4iv = "apple";
        let ce1changed = false,
            ce2changed = false,
            ce3changed = false,
            ce4changed = false;
        let ce1ivchanged = false,
            ce2ivchanged = false,
            ce3ivchanged = false,
            ce4ivchanged = false;

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // type in first marks only first immediate value as changed
        ce1iv = "banana";
        ce1ivchanged = true;
        await updateTextInputImmediateValue({
            text: ce1iv,
            name: "/ce1",
            core,
        });
        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // update value in first marks only first value as changed
        ce1 = ce3 = ce3iv = ce1iv;
        ce1changed = true;
        await updateTextInputValueToImmediateValue({
            name: "/ce1",
            core,
        });

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // type in second marks only second immediate value as changed

        ce4 = ce4iv = ce2iv = "cherry";
        ce2ivchanged = true;
        await updateTextInputImmediateValue({
            text: ce2iv,
            name: "/ce2",
            core,
        });
        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // update value in second marks only second value as changed
        ce2 = ce2iv;
        ce2changed = true;
        await updateTextInputValueToImmediateValue({
            name: "/ce2",
            core,
        });

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // type in third marks third immediate value as changed
        ce3iv = "dragonfruit";
        ce3ivchanged = true;
        await updateTextInputImmediateValue({
            text: ce3iv,
            name: "/ce3",
            core,
        });
        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // update value in third marks only third value as changed
        ce1 = ce1iv = ce3 = ce3iv;
        ce3changed = true;
        await updateTextInputValueToImmediateValue({
            name: "/ce3",
            core,
        });

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // type in fourth marks fourth immediate value as changed
        ce4iv = "eggplant";
        ce4ivchanged = true;
        await updateTextInputImmediateValue({
            text: ce4iv,
            name: "/ce4",
            core,
        });
        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // update value in fourth marks only fourth value as changed
        ce2 = ce2iv = ce4 = ce4iv;
        ce4changed = true;
        await updateTextInputValueToImmediateValue({
            name: "/ce4",
            core,
        });

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        ce1 = "";
        ce2 = "apple";
        ce3 = "";
        ce4 = "apple";
        ce1iv = "";
        ce2iv = "apple";
        ce3iv = "";
        ce4iv = "apple";
        ce1changed = false;
        ce2changed = false;
        ce3changed = false;
        ce4changed = false;
        ce1ivchanged = false;
        ce2ivchanged = false;
        ce3ivchanged = false;
        ce4ivchanged = false;

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // type in third marks only third immediate value as changed
        ce3iv = "banana";
        ce3ivchanged = true;
        await updateTextInputImmediateValue({
            text: ce3iv,
            name: "/ce3",
            core,
        });
        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // update value in third marks first and third value/immediateValue as changed
        ce1 = ce1iv = ce3 = ce3iv;
        ce1changed = true;
        ce1ivchanged = true;
        ce3changed = true;
        await updateTextInputValueToImmediateValue({
            name: "/ce3",
            core,
        });

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // type in fourth marks only fourth immediate value as changed
        ce4iv = "eggplant";
        ce4ivchanged = true;
        await updateTextInputImmediateValue({
            text: ce4iv,
            name: "/ce4",
            core,
        });
        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );

        // update value in fourth marks second and fourth value/immediateValue as changed
        ce2 = ce2iv = ce4 = ce4iv;
        ce2changed = true;
        ce2ivchanged = true;
        ce4changed = true;
        await updateTextInputValueToImmediateValue({
            name: "/ce4",
            core,
        });

        await check_items(
            [ce1, ce2, ce3, ce4],
            [ce1iv, ce2iv, ce3iv, ce4iv],
            [ce1changed, ce2changed, ce3changed, ce4changed],
            [ce1ivchanged, ce2ivchanged, ce3ivchanged, ce4ivchanged],
        );
    });

    it("ignore variants from children", async () => {
        let core = await createTestCore({
            doenetML: `
          <codeEditor name="ce1" showResults ><selectFromSequence/></codeEditor>
          `,
        });

        // Have only one variant despite selectFromSequence child
        let stateVariables = await core.returnAllStateVariables(true);

        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a"]);
    });
});
