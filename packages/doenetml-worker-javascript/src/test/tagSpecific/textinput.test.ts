import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveInput,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputImmediateValue,
    updateTextInputValue,
    updateTextInputValueToImmediateValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // Type 2 in first textInput
        await updateTextInputImmediateValue({
            text: "hello2",
            name: "/ti1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // Update value (e.g., by pressing Enter) in first textInput
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello2");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello2");
        expect(stateVariables["/ti2"].stateValues.value).eq("");

        // erase "2" and type " you" in second input

        await updateTextInputImmediateValue({
            text: "hello",
            name: "/ti1a",
            core,
        });
        await updateTextInputImmediateValue({
            text: "hello you",
            name: "/ti1a",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1a",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1a",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // update value (e.g., blur) textInput 2
        await updateTextInputValueToImmediateValue({
            name: "/ti1a",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // delete and reenter abc in mathInput 1

        await updateTextInputImmediateValue({
            text: "",
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("");

        await updateTextInputImmediateValue({
            text: "a",
            name: "/ti1",
            core,
        });
        await updateTextInputImmediateValue({
            text: "ab",
            name: "/ti1",
            core,
        });
        await updateTextInputImmediateValue({
            text: "abc",
            name: "/ti1",
            core,
        });
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // type saludos in textInput 3

        await updateTextInputImmediateValue({
            text: "saludos",
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye");

        // blur textInput 2 and type d in textInput 1
        await updateTextInputValueToImmediateValue({
            name: "/ti2",
            core,
        });
        await updateTextInputImmediateValue({
            text: "abcd",
            name: "/ti1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abc");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");

        // Update value (e.g., blur) of first textInput
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");

        // Clearing second textInput
        await updateTextInputImmediateValue({
            text: "",
            name: "/ti1a",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
        expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
        expect(stateVariables["/ti2"].stateValues.value).eq("saludos");

        // update value (e.g., by blurring) of second textInput
        await updateTextInputValueToImmediateValue({
            name: "/ti1a",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `can't update me`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // enter new values
        await updateTextInputImmediateValue({
            text: "disappear",
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `disappear`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // values revert when press update value
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `can't update me`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // enter new values
        await updateTextInputImmediateValue({
            text: "disappear",
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.value).eq(`can't update me`);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq(
            `disappear`,
        );
        expect(stateVariables["/t1"].stateValues.value).eq(`can't update me`);

        // values revert when press update value
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "hello there",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("hello there");

        // update value
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // type values input second textInput
        await updateTextInputImmediateValue({
            text: "Hello again",
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // update value of second textInput
        await updateTextInputValueToImmediateValue({
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("hello there");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // update value
        await updateTextInputValueToImmediateValue({
            name: "/ti1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // type values input second textInput
        await updateTextInputImmediateValue({
            text: "Hello again",
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti1"].stateValues.immediateValue).eq("bye now");
        expect(stateVariables["/ti1"].stateValues.value).eq("bye now");
        expect(stateVariables["/ti2"].stateValues.immediateValue).eq(
            "Hello again",
        );
        expect(stateVariables["/ti2"].stateValues.value).eq("bye now");

        // update value of second textInput
        await updateTextInputValueToImmediateValue({
            name: "/ti2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/h"].stateValues.value).eq("hello");

        await updateTextInputImmediateValue({
            text: " bye",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq(" bye");
        expect(stateVariables["/h"].stateValues.value).eq("hello");

        await updateTextInputImmediateValue({
            text: " there",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq(" there");
        expect(stateVariables["/h"].stateValues.value).eq("hello");

        await updateTextInputValueToImmediateValue({
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq(" there");
        expect(stateVariables["/h"].stateValues.value).eq("hello there");

        await updateTextInputImmediateValue({
            text: "?",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq("?");
        expect(stateVariables["/h"].stateValues.value).eq("hello there");

        await updateTextInputImmediateValue({
            text: "!",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq("!");
        expect(stateVariables["/h"].stateValues.value).eq("hello there");

        await updateTextInputValueToImmediateValue({
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ti"].stateValues.immediateValue).eq("!");
        expect(stateVariables["/h"].stateValues.value).eq("hello there!");
    });

    it("text input in graph", async () => {
        const doenetMLsnippet = `
    <graph >
        <textInput anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1"><label>input 1</label></textInput>
        <textInput name="item2"><label>input 2</label></textInput>
    </graph>
                `;

        await test_in_graph(doenetMLsnippet, moveInput);
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/m1"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/m2"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n2"].stateValues.value).eqls(NaN);

        await updateTextInputValue({ text: "4/2", name: "/ti", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/m1"].stateValues.value.tree).eqls(["/", 4, 2]);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls(["/", 4, 2]);
        expect(stateVariables["/n1"].stateValues.value).eq(2);
        expect(stateVariables["/n2"].stateValues.value).eq(2);

        await updateTextInputValue({ text: "xy", name: "/ti", core });
        stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
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
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
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
            name: "/ti1",
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
            name: "/ti1",
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
            name: "/ti2",
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
            name: "/ti2",
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
            name: "/ti3",
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
            name: "/ti3",
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
            name: "/ti4",
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
            name: "/ti4",
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
            name: "/ti3",
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
            name: "/ti3",
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
            name: "/ti4",
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
            name: "/ti4",
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

        let stateVariables = await core.returnAllStateVariables(false, true);
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
    <p name="p7">List: $ti.list.</p>
    <p name="p8">Text list from list: <textList name="tl">$ti.list</textList>.</p>
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

            const list = string
                .trim()
                .split(",")
                .map((s) => s.trim());
            const numListItems = list.length;

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

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
                `List: ${list.join(", ")}.`,
            );
            expect(stateVariables["/p8"].stateValues.text).eq(
                `Text list from list: ${list.join(", ")}.`,
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
            expect(stateVariables["/ti"].stateValues.list).eqls(list);
            expect(stateVariables["/tl"].stateValues.texts).eqls(list);
        }

        let string = "";
        await check_items(string);

        string = "Rainbow room";

        await updateTextInputValue({
            text: string,
            name: "/ti",
            core,
        });
        await check_items(string);

        string = "black cat,   green  goblin,great big   red dog";
        await updateTextInputValue({
            text: string,
            name: "/ti",
            core,
        });
        await check_items(string);
    });
});
