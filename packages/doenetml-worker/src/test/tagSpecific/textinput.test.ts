import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputImmediateValue,
    updateTextInputValue,
    updateTextInputValueToImmediateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("TextInput tag tests", async () => {
    it("textInput references", async () => {
        // A fairly involved test
        // to check for bugs that have shown up only after multiple manipulations

        // Initial doenet code

        let core = await createTestCore({
            doenetML: `
    <textInput prefill='hello' name="ti1" />
    <textInput copySource="ti1" name="ti1a" />
    $ti1.value{assignNames="v1"}
    $ti1.immediateValue{assignNames="iv1"}
    $ti1a.value{assignNames="v1a"}
    $ti1a.immediateValue{assignNames="iv1a"}
    <textInput name="ti2" />
    $ti2.value{assignNames="v2"}
    $ti2.immediateValue{assignNames="iv2"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // Type 2 in first textInput
        await updateTextInputImmediateValue({
            text: "hello2",
            componentName: "/ti1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // Update value (e.g., by pressing Enter) in first textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // erase "2" and type " you" in second input

        await updateTextInputImmediateValue({
            text: "hello",
            componentName: "/ti1a",
            core,
        });
        await updateTextInputImmediateValue({
            text: "hello you",
            componentName: "/ti1a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // Update value (e.g., by changing focus) of second textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // bye in third input
        await updateTextInputImmediateValue({
            text: "bye",
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // update value (e.g., press enter) in third textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
            "hello you",
        );
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // Type abc in second textInput
        await updateTextInputImmediateValue({
            text: "abc",
            componentName: "/ti1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // update value (e.g., blur) textInput 2
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // delete and reenter abc in mathInput 1

        await updateTextInputImmediateValue({
            text: "",
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("");

        await updateTextInputImmediateValue({
            text: "a",
            componentName: "/ti1",
            core,
        });
        await updateTextInputImmediateValue({
            text: "ab",
            componentName: "/ti1",
            core,
        });
        await updateTextInputImmediateValue({
            text: "abc",
            componentName: "/ti1",
            core,
        });
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // type saludos in textInput 3

        await updateTextInputImmediateValue({
            text: "saludos",
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // blur textInput 2 and type d in textInput 1
        await updateTextInputValueToImmediateValue({
            componentName: "/ti2",
            core,
        });
        await updateTextInputImmediateValue({
            text: "abcd",
            componentName: "/ti1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");

        // Update value (e.g., blur) of first textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");

        // Clearing second textInput
        await updateTextInputImmediateValue({
            text: "",
            componentName: "/ti1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");

        // update value (e.g., by blurring) of second textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1a",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("");
        expect(stateVariables["/ti1a"].stateValues.value).eq("");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    it("downstream from textInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">hello there</text></p>
    <p>textInput based on text: <textInput name="ti1" bindValueTo="$t1" /></p>
    <p>Copied textInput: <textInput copySource="ti1" name="ti2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/t1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );

        // enter new values
        await updateTextInputValue({
            text: "bye now",
            componentName: "/ti1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/t1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
    });

    it("downstream from textInput prefill ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">hello there</text></p>
    <p>textInput based on text: <textInput name="ti1" prefill="bye now" bindValueTo="$t1" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/t1"].stateValues.value).eq("hello there");
    });

    it("downstream from textInput, values revert if not updatable", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">can't <text>update</text> <text>me</text></text></p>
    <p>textInput based on text: <textInput name="ti1" bindValueTo="$t1" /></p>
    <p>immediate value: $ti1.immediateValue{assignNames="iv"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `can't update me`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // enter new values
        await updateTextInputImmediateValue({
            text: "disappear",
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `disappear`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // values revert when press update value
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `can't update me`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);
    });

    it("downstream from textInput via child", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">hello there</text></p>
    <p>textInput based on text: <textInput name="ti1">$t1</textInput></p>
    <p>Copied textInput: <textInput copySource="ti1" name="ti2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/t1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );

        // enter new values
        await updateTextInputValue({
            text: "bye now",
            componentName: "/ti1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/t1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
    });

    it("downstream from textInput prefill ignored, via child", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">hello there</text></p>
    <p>textInput based on text: <textInput name="ti1" prefill="bye now" >$t1</textInput></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/t1"].stateValues.value).eq("hello there");
    });

    it("downstream from textInput via child, values revert if not updatable", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">can't <text>update</text> <text>me</text></text></p>
    <p>textInput based on text: <textInput name="ti1">$t1</textInput></p>
    <p>immediate value: $ti1.immediateValue{assignNames="iv"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `can't update me`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // enter new values
        await updateTextInputImmediateValue({
            text: "disappear",
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `disappear`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // values revert when press update value
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `can't update me`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);
    });

    it("downstream from textInput via child, bindValueTo ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original text: <text name="t1">hello there</text></p>
    <p>Not bound: <text name="tIgnored">ignore me</text></p>
    <p>textInput based on text: <textInput name="ti1" bindValueTo="$tIgnored">$t1</textInput></p>
    <p>Copied textInput: <textInput copySource="ti1" name="ti2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/t1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/tIgnored"].stateValues.value).eq("ignore me");

        // enter new values
        await updateTextInputValue({
            text: "bye now",
            componentName: "/ti1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/t1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/tIgnored"].stateValues.value).eq("ignore me");
    });

    it("textInput based on value of textInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original textInput: <textInput name="ti1" prefill="hello there"/></p>
    <p>textInput based on textInput: <textInput name="ti2" bindValueTo="$ti1" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");

        // type new values in first textInput
        await updateTextInputImmediateValue({
            text: "bye now",
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");

        // update value
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // type values input second textInput
        await updateTextInputImmediateValue({
            text: "Hello again",
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // update value of second textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti1"].stateValues.value).eq("Hello again");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("Hello again");
    });

    it("textInput based on immediateValue of textInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original textInput: <textInput name="ti1" prefill="hello there"/></p>
    <p>textInput based on textInput: <textInput name="ti2" bindValueTo="$ti1.immediateValue" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");

        // type new values in first textInput
        await updateTextInputImmediateValue({
            text: "bye now",
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // update value
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // type values input second textInput
        await updateTextInputImmediateValue({
            text: "Hello again",
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // update value of second textInput
        await updateTextInputValueToImmediateValue({
            componentName: "/ti2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti1"].stateValues.value).eq("Hello again");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("Hello again");
    });

    it("chain update off textInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <textInput name="ti" />

    <text name="h">hello</text>
    <updateValue triggerWith="ti" target="h" newValue="$h$ti" type="text" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/h"].stateValues.value).eq("hello");

        await updateTextInputImmediateValue({
            text: " bye",
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq(" bye");
        expect(stateVariables["/h"].stateValues.value).eq("hello");

        await updateTextInputImmediateValue({
            text: " there",
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq(" there");
        expect(stateVariables["/h"].stateValues.value).eq("hello");

        await updateTextInputValueToImmediateValue({
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq(" there");
        expect(stateVariables["/h"].stateValues.value).eq("hello there");

        await updateTextInputImmediateValue({
            text: "?",
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq("?");
        expect(stateVariables["/h"].stateValues.value).eq("hello there");

        await updateTextInputImmediateValue({
            text: "!",
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq("!");
        expect(stateVariables["/h"].stateValues.value).eq("hello there");

        await updateTextInputValueToImmediateValue({
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq("!");
        expect(stateVariables["/h"].stateValues.value).eq("hello there!");
    });

    it("text input in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph >
        <textInput anchor="$anchorCoords1" name="textInput1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1"><label>input 1</label></textInput>
        <textInput name="textInput2"><label>input 2</label></textInput>
    </graph>
        
    <p name="pAnchor1">Anchor 1 coordinates: <point copySource="textInput1.anchor" name="textInput1anchor" /></p>
    <p name="pAnchor2">Anchor 2 coordinates: <point copySource="textInput2.anchor" name="textInput2anchor" /></p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathInput name="anchorCoords2" bindValueTo="$textInput2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $textInput1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $textInput2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceInput inline preselectChoice="1" name="positionFromAnchor1">
        <choice>upperRight</choice>
        <choice>upperLeft</choice>
        <choice>lowerRight</choice>
        <choice>lowerLeft</choice>
        <choice>left</choice>
        <choice>right</choice>
        <choice>top</choice>
        <choice>bottom</choice>
        <choice>center</choice>
    </choiceInput>
    </p>
    <p>Change position from anchor 2
    <choiceInput inline name="positionFromAnchor2" bindValueTo="$textInput2.positionFromAnchor">
        <choice>upperRight</choice>
        <choice>upperLeft</choice>
        <choice>lowerRight</choice>
        <choice>lowerLeft</choice>
        <choice>left</choice>
        <choice>right</choice>
        <choice>top</choice>
        <choice>bottom</choice>
        <choice>center</choice>
    </choiceInput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$textInput2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$textInput2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$textInput2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$textInput2.fixLocation" /></p>
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(1,3)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(0,0)");

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: upperright",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: center",
        );
        expect(
            stateVariables["/positionFromAnchor1"].stateValues.selectedIndices,
        ).eqls([1]);
        expect(
            stateVariables["/positionFromAnchor2"].stateValues.selectedIndices,
        ).eqls([9]);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );
        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: false",
        );
        expect(stateVariables["/pFixed1"].stateValues.text).eq(
            "Fixed 1: false",
        );
        expect(stateVariables["/pFixed2"].stateValues.text).eq(
            "Fixed 2: false",
        );
        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: false",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: false",
        );

        // move textInputs by dragging
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput1",
            args: { x: -2, y: 3 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput2",
            args: { x: 4, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(-2,3)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(4,-5)");

        // move textInputs by entering coordinates

        await updateMathInputValue({
            latex: "(6,7)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(8,9)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(6,7)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(8,9)");

        // change position from anchor
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor1",
            args: { selectedIndices: [4] },
            event: null,
        });
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor2",
            args: { selectedIndices: [3] },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: lowerleft",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // make not draggable
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: false",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: false",
        );

        // cannot move textInputs by dragging
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput2",
            args: { x: -8, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(6,7)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(8,9)");

        // make draggable again
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );

        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput2",
            args: { x: -8, y: -7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(-10,-9)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(-8,-7)");

        // fix location
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: true",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: true",
        );

        // can change coordinates entering coordinates only for input 1
        await updateMathInputValue({
            latex: "(3,4)",
            componentName: "/anchorCoords2",
            core,
        });
        await updateMathInputValue({
            latex: "(1,2)",
            componentName: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(1,2)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(-8,-7)");

        // cannot move textInputs by dragging
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput1",
            args: { x: 4, y: 6 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/textInput2",
            args: { x: 7, y: 8 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(1,2)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(-8,-7)");

        // can change position from anchor only for input 1
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor2",
            args: { selectedIndices: [8] },
            event: null,
        });
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor1",
            args: { selectedIndices: [7] },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: top",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: false",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );

        // make completely fixed
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: true");
        expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: true");

        // can change coordinates entering coordinates only for input 1
        await updateMathInputValue({
            latex: "(7,8)",
            componentName: "/anchorCoords2",
            core,
        });
        await updateMathInputValue({
            latex: "(5,6)",
            componentName: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/textInput1anchor"].stateValues.latex),
        ).eq("(5,6)");
        expect(
            cleanLatex(stateVariables["/textInput2anchor"].stateValues.latex),
        ).eq("(-8,-7)");

        // can change position from anchor only for math 1
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor2",
            args: { selectedIndices: [5] },
            event: null,
        });
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor1",
            args: { selectedIndices: [6] },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: right",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute only for input 1

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );
    });

    it("use textInput as basic math input", async () => {
        let core = await createTestCore({
            doenetML: `
    <textInput name="ti" />

    <p>Math from text input: <math name="m1">$ti</math></p>
    <p>Number from text input: <number name="n1">$ti</number></p>
    <p>Math via latex from text input: <math name="m2">$ti.value{isLatex}</math></p>
    <p>Number via latex from text input: <number name="n2">$ti.value{isLatex}</number></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/m2"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n2"].stateValues.value).eqls(NaN);

        await updateTextInputValue({ text: "4/2", componentName: "/ti", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.value.tree).eqls(["/", 4, 2]);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls(["/", 4, 2]);
        expect(stateVariables["/n1"].stateValues.value).eq(2);
        expect(stateVariables["/n2"].stateValues.value).eq(2);

        await updateTextInputValue({ text: "xy", componentName: "/ti", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls([
            "*",
            "x",
            "y",
        ]);
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n2"].stateValues.value).eqls(NaN);

        await updateTextInputValue({
            text: "\\frac{a}{b}",
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/m2"].stateValues.value.tree).eqls([
            "/",
            "a",
            "b",
        ]);
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n2"].stateValues.value).eqls(NaN);

        await updateTextInputValue({
            text: "\\frac{6}{2}",
            componentName: "/ti",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/m2"].stateValues.value.tree).eqls(["/", 6, 2]);
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n2"].stateValues.value).eq(3);
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><textInput name="ti1" /> <text copySource="ti1" name="ti1a" /> <boolean copysource="ti1.valueChanged" name="ti1changed" /> <text copySource="ti1.immediateValue" name="ti1iva" /> <boolean copysource="ti1.immediateValueChanged" name="ti1ivchanged" /></p>
    <p><textInput name="ti2" prefill="apple" /> <text copySource="ti2" name="ti2a" /> <boolean copysource="ti2.valueChanged" name="ti2changed" /> <text copySource="ti2.immediateValue" name="ti2iva" /> <boolean copysource="ti2.immediateValueChanged" name="ti2ivchanged" /></p>
    <p><textInput name="ti3" bindValueTo="$ti1" /> <text copySource="ti3" name="ti3a" /> <boolean copysource="ti3.valueChanged" name="ti3changed" /> <text copySource="ti3.immediateValue" name="ti3iva" /> <boolean copysource="ti3.immediateValueChanged" name="ti3ivchanged" /></p>
    <p><textInput name="ti4">$ti2.immediateValue</textInput> <text copySource="ti4" name="ti4a" /> <boolean copysource="ti4.valueChanged" name="ti4changed" /> <text copySource="ti4.immediateValue" name="ti4iva" /> <boolean copysource="ti4.immediateValueChanged" name="ti4ivchanged" /></p>

    `;

        async function check_items(
            [ti1, ti2, ti3, ti4]: [
                ti1: string,
                ti2: string,
                ti3: string,
                ti4: string,
            ],
            [ti1iv, ti2iv, ti3iv, ti4iv]: [
                ti1iv: string,
                ti2iv: string,
                ti3iv: string,
                ti4iv: string,
            ],
            [ti1changed, ti2changed, ti3changed, ti4changed]: [
                ti1changed: boolean,
                ti2changed: boolean,
                ti3changed: boolean,
                ti4changed: boolean,
            ],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged]: [
                ti1ivchanged: boolean,
                ti2ivchanged: boolean,
                ti3ivchanged: boolean,
                ti4ivchanged: boolean,
            ],
        ) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ti1"].stateValues.value).eq(ti1);
            expect(stateVariables["/ti2"].stateValues.value).eq(ti2);
            expect(stateVariables["/ti3"].stateValues.value).eq(ti3);
            expect(stateVariables["/ti4"].stateValues.value).eq(ti4);

            expect(stateVariables["/ti1a"].stateValues.value).eq(ti1);
            expect(stateVariables["/ti2a"].stateValues.value).eq(ti2);
            expect(stateVariables["/ti3a"].stateValues.value).eq(ti3);
            expect(stateVariables["/ti4a"].stateValues.value).eq(ti4);

            expect(stateVariables["/ti1iva"].stateValues.value).eq(ti1iv);
            expect(stateVariables["/ti2iva"].stateValues.value).eq(ti2iv);
            expect(stateVariables["/ti3iva"].stateValues.value).eq(ti3iv);
            expect(stateVariables["/ti4iva"].stateValues.value).eq(ti4iv);

            expect(stateVariables["/ti1changed"].stateValues.value).eq(
                ti1changed,
            );
            expect(stateVariables["/ti2changed"].stateValues.value).eq(
                ti2changed,
            );
            expect(stateVariables["/ti3changed"].stateValues.value).eq(
                ti3changed,
            );
            expect(stateVariables["/ti4changed"].stateValues.value).eq(
                ti4changed,
            );

            expect(stateVariables["/ti1ivchanged"].stateValues.value).eq(
                ti1ivchanged,
            );
            expect(stateVariables["/ti2ivchanged"].stateValues.value).eq(
                ti2ivchanged,
            );
            expect(stateVariables["/ti3ivchanged"].stateValues.value).eq(
                ti3ivchanged,
            );
            expect(stateVariables["/ti4ivchanged"].stateValues.value).eq(
                ti4ivchanged,
            );
        }

        let core = await createTestCore({
            doenetML,
        });

        let ti1 = "",
            ti2 = "apple",
            ti3 = "",
            ti4 = "apple";
        let ti1iv = "",
            ti2iv = "apple",
            ti3iv = "",
            ti4iv = "apple";
        let ti1changed = false,
            ti2changed = false,
            ti3changed = false,
            ti4changed = false;
        let ti1ivchanged = false,
            ti2ivchanged = false,
            ti3ivchanged = false,
            ti4ivchanged = false;

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // type in first marks only first immediate value as changed
        ti1iv = "banana";
        ti1ivchanged = true;
        await updateTextInputImmediateValue({
            text: ti1iv,
            componentName: "/ti1",
            core,
        });
        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // update value in first marks only first value as changed
        ti1 = ti3 = ti3iv = ti1iv;
        ti1changed = true;
        await updateTextInputValueToImmediateValue({
            componentName: "/ti1",
            core,
        });

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // type in second marks only second immediate value as changed

        ti4 = ti4iv = ti2iv = "cherry";
        ti2ivchanged = true;
        await updateTextInputImmediateValue({
            text: ti2iv,
            componentName: "/ti2",
            core,
        });
        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // update value in second marks only second value as changed
        ti2 = ti2iv;
        ti2changed = true;
        await updateTextInputValueToImmediateValue({
            componentName: "/ti2",
            core,
        });

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // type in third marks third immediate value as changed
        ti3iv = "dragonfruit";
        ti3ivchanged = true;
        await updateTextInputImmediateValue({
            text: ti3iv,
            componentName: "/ti3",
            core,
        });
        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // update value in third marks only third value as changed
        ti1 = ti1iv = ti3 = ti3iv;
        ti3changed = true;
        await updateTextInputValueToImmediateValue({
            componentName: "/ti3",
            core,
        });

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // type in fourth marks fourth immediate value as changed
        ti4iv = "eggplant";
        ti4ivchanged = true;
        await updateTextInputImmediateValue({
            text: ti4iv,
            componentName: "/ti4",
            core,
        });
        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // update value in fourth marks only fourth value as changed
        ti2 = ti2iv = ti4 = ti4iv;
        ti4changed = true;
        await updateTextInputValueToImmediateValue({
            componentName: "/ti4",
            core,
        });

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        ti1 = "";
        ti2 = "apple";
        ti3 = "";
        ti4 = "apple";
        ti1iv = "";
        ti2iv = "apple";
        ti3iv = "";
        ti4iv = "apple";
        ti1changed = false;
        ti2changed = false;
        ti3changed = false;
        ti4changed = false;
        ti1ivchanged = false;
        ti2ivchanged = false;
        ti3ivchanged = false;
        ti4ivchanged = false;

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // type in third marks only third immediate value as changed
        ti3iv = "banana";
        ti3ivchanged = true;
        await updateTextInputImmediateValue({
            text: ti3iv,
            componentName: "/ti3",
            core,
        });
        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // update value in third marks first and third value/immediateValue as changed
        ti1 = ti1iv = ti3 = ti3iv;
        ti1changed = true;
        ti1ivchanged = true;
        ti3changed = true;
        await updateTextInputValueToImmediateValue({
            componentName: "/ti3",
            core,
        });

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // type in fourth marks only fourth immediate value as changed
        ti4iv = "eggplant";
        ti4ivchanged = true;
        await updateTextInputImmediateValue({
            text: ti4iv,
            componentName: "/ti4",
            core,
        });
        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );

        // update value in fourth marks second and fourth value/immediateValue as changed
        ti2 = ti2iv = ti4 = ti4iv;
        ti2changed = true;
        ti2ivchanged = true;
        ti4changed = true;
        await updateTextInputValueToImmediateValue({
            componentName: "/ti4",
            core,
        });

        await check_items(
            [ti1, ti2, ti3, ti4],
            [ti1iv, ti2iv, ti3iv, ti4iv],
            [ti1changed, ti2changed, ti3changed, ti4changed],
            [ti1ivchanged, ti2ivchanged, ti3ivchanged, ti4ivchanged],
        );
    });

    it("text input with label", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><textInput name="ti1" ><label>Type something</label></textInput></p>
    <p><textInput name="ti2"><label>Hello <math>a/b</math></label></textInput></p>

     `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ti1"].stateValues.label).eq("Type something");
        expect(stateVariables["/ti2"].stateValues.label).eq(
            "Hello \\(\\frac{a}{b}\\)",
        );
    });

    it("characters, words, and list items", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><textInput name="ti" /></p>

    <p name="p2">Number of characters is $ti.numCharacters.</p>
    <p name="p3">Characters: $ti.characters.</p>
    <p name="p4">Number of words is $ti.numWords.</p>
    <p name="p5">Words: $ti.words.</p>
    <p name="p6">Number of list items is $ti.numListItems.</p>
    <p name="p7">List items: $ti.listItems.</p>
     `,
        });

        async function check_items(string: string) {
            //@ts-ignore
            const itr = new Intl.Segmenter("en", {
                granularity: "grapheme",
            }).segment(string);

            const characters = Array.from(itr, ({ segment }) => segment);
            const numCharacters = characters.length;

            const words = string.trim().split(/\s+/);
            const numWords = words.length;

            const listItems = string
                .trim()
                .split(",")
                .map((s) => s.trim());
            const numListItems = listItems.length;

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/p2"].stateValues.text).eq(
                `Number of characters is ${numCharacters}.`,
            );
            expect(stateVariables["/p3"].stateValues.text).eq(
                `Characters: ${characters.map((v) => v.trim()).join(", ")}.`,
            );
            expect(stateVariables["/p4"].stateValues.text).eq(
                `Number of words is ${numWords}.`,
            );
            expect(stateVariables["/p5"].stateValues.text).eq(
                `Words: ${words.join(", ")}.`,
            );
            expect(stateVariables["/p6"].stateValues.text).eq(
                `Number of list items is ${numListItems}.`,
            );
            expect(stateVariables["/p7"].stateValues.text).eq(
                `List items: ${listItems.join(", ")}.`,
            );

            expect(stateVariables["/ti"].stateValues.numCharacters).eq(
                numCharacters,
            );
            expect(stateVariables["/ti"].stateValues.characters).eqls(
                characters,
            );
            expect(stateVariables["/ti"].stateValues.numWords).eq(numWords);
            expect(stateVariables["/ti"].stateValues.words).eqls(words);
            expect(stateVariables["/ti"].stateValues.numListItems).eq(
                numListItems,
            );
            expect(stateVariables["/ti"].stateValues.listItems).eqls(listItems);
        }

        let string = "";
        await check_items(string);

        string = "Rainbow room";

        await updateTextInputValue({
            text: string,
            componentName: "/ti",
            core,
        });
        await check_items(string);

        string = "black cat,   green  goblin,great big   red dog";
        await updateTextInputValue({
            text: string,
            componentName: "/ti",
            core,
        });
        await check_items(string);
    });
});
