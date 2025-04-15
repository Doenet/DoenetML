import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Pluralize tag tests", async () => {
    it("number followed by noun", async () => {
        let core = await createTestCore({
            doenetML: `

    <p name="p1"><pluralize>one dog</pluralize></p>
    <p name="p2"><pluralize>two dog</pluralize></p>
    <p name="p3"><pluralize>zero dog</pluralize></p>
    <p name="p4"><pluralize>1 mouse</pluralize></p>
    <p name="p5"><pluralize>2 mouse</pluralize></p>
    <p name="p6"><pluralize>0 mouse</pluralize></p>
    <p name="p7"><pluralize>one thousand bus</pluralize></p>
    <p name="p8"><pluralize>0.5 bus</pluralize></p>
    <p name="p9"><pluralize>1 bus</pluralize></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("one dog");
        expect(stateVariables["/p2"].stateValues.text).eq("two dogs");
        expect(stateVariables["/p3"].stateValues.text).eq("zero dogs");
        expect(stateVariables["/p4"].stateValues.text).eq("1 mouse");
        expect(stateVariables["/p5"].stateValues.text).eq("2 mice");
        expect(stateVariables["/p6"].stateValues.text).eq("0 mice");
        expect(stateVariables["/p7"].stateValues.text).eq("one thousand buses");
        expect(stateVariables["/p8"].stateValues.text).eq("0.5 buses");
        expect(stateVariables["/p9"].stateValues.text).eq("1 bus");
    });

    it("single word", async () => {
        let core = await createTestCore({
            doenetML: `

    <p name="p1"><pluralize>dog</pluralize></p>
    <p name="p2"><pluralize>mouse</pluralize></p>
    <p name="p3"><pluralize>bus</pluralize></p>
    <p name="p4"><pluralize>goose</pluralize></p>
    <p name="p5"><pluralize>pony</pluralize></p>
    <p name="p6"><pluralize>only</pluralize></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("dogs");
        expect(stateVariables["/p2"].stateValues.text).eq("mice");
        expect(stateVariables["/p3"].stateValues.text).eq("buses");
        expect(stateVariables["/p4"].stateValues.text).eq("geese");
        expect(stateVariables["/p5"].stateValues.text).eq("ponies");
        expect(stateVariables["/p6"].stateValues.text).eq("only");
    });

    it("number followed by noun with plural form", async () => {
        let core = await createTestCore({
            doenetML: `
  
      <p name="p1"><pluralize pluralForm="cheetahs">one dog</pluralize></p>
      <p name="p2"><pluralize pluralForm="cheetahs">two dog</pluralize></p>
      <p name="p3"><pluralize pluralForm="cheetahs">zero dog</pluralize></p>
      <p name="p4"><pluralize pluralForm="cheetahs">1 mouse</pluralize></p>
      <p name="p5"><pluralize pluralForm="cheetahs">2 mouse</pluralize></p>
      <p name="p6"><pluralize pluralForm="cheetahs">0 mouse</pluralize></p>
      <p name="p7"><pluralize pluralForm="cheetahs">one thousand bus</pluralize></p>
      <p name="p8"><pluralize pluralForm="cheetahs">0.5 bus</pluralize></p>
      <p name="p9"><pluralize pluralForm="cheetahs">1 bus</pluralize></p>
      `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("one dog");
        expect(stateVariables["/p2"].stateValues.text).eq("two cheetahs");
        expect(stateVariables["/p3"].stateValues.text).eq("zero cheetahs");
        expect(stateVariables["/p4"].stateValues.text).eq("1 mouse");
        expect(stateVariables["/p5"].stateValues.text).eq("2 cheetahs");
        expect(stateVariables["/p6"].stateValues.text).eq("0 cheetahs");
        expect(stateVariables["/p7"].stateValues.text).eq(
            "one thousand cheetahs",
        );
        expect(stateVariables["/p8"].stateValues.text).eq("0.5 cheetahs");
        expect(stateVariables["/p9"].stateValues.text).eq("1 bus");
    });

    it("single word, with plural form", async () => {
        let core = await createTestCore({
            doenetML: `

    <p name="p1"><pluralize pluralForm="cheetahs">dog</pluralize></p>
    <p name="p2"><pluralize pluralForm="cheetahs">mouse</pluralize></p>
    <p name="p3"><pluralize pluralForm="cheetahs">bus</pluralize></p>
    <p name="p4"><pluralize pluralForm="cheetahs">goose</pluralize></p>
    <p name="p5"><pluralize pluralForm="cheetahs">pony</pluralize></p>
    <p name="p6"><pluralize pluralForm="cheetahs">only</pluralize></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("cheetahs");
        expect(stateVariables["/p2"].stateValues.text).eq("cheetahs");
        expect(stateVariables["/p3"].stateValues.text).eq("cheetahs");
        expect(stateVariables["/p4"].stateValues.text).eq("cheetahs");
        expect(stateVariables["/p5"].stateValues.text).eq("cheetahs");
        expect(stateVariables["/p6"].stateValues.text).eq("cheetahs");
    });

    it("number followed by noun, based on number", async () => {
        let core = await createTestCore({
            doenetML: `

    <p name="p1"><pluralize basedOnNumber="3">one dog</pluralize></p>
    <p name="p2"><pluralize basedOnNumber="1">two dog</pluralize></p>
    <p name="p3"><pluralize basedOnNumber="5">zero dog</pluralize></p>
    <p name="p4"><pluralize basedOnNumber="3">1 mouse</pluralize></p>
    <p name="p5"><pluralize basedOnNumber="8">2 mouse</pluralize></p>
    <p name="p6"><pluralize basedOnNumber="1">0 mouse</pluralize></p>
    <p name="p7"><pluralize basedOnNumber="1">one thousand bus</pluralize></p>
    <p name="p8"><pluralize basedOnNumber="2">0.5 bus</pluralize></p>
    <p name="p9"><pluralize basedOnNumber="3">1 bus</pluralize></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("one dogs");
        expect(stateVariables["/p2"].stateValues.text).eq("two dog");
        expect(stateVariables["/p3"].stateValues.text).eq("zero dogs");
        expect(stateVariables["/p4"].stateValues.text).eq("1 mice");
        expect(stateVariables["/p5"].stateValues.text).eq("2 mice");
        expect(stateVariables["/p6"].stateValues.text).eq("0 mouse");
        expect(stateVariables["/p7"].stateValues.text).eq("one thousand bus");
        expect(stateVariables["/p8"].stateValues.text).eq("0.5 buses");
        expect(stateVariables["/p9"].stateValues.text).eq("1 buses");
    });

    it("single word, based on number", async () => {
        let core = await createTestCore({
            doenetML: `

    <p name="p1"><pluralize basedOnNumber="7">dog</pluralize></p>
    <p name="p2"><pluralize basedOnNumber="1">dog</pluralize></p>
    <p name="p3"><pluralize basedOnNumber="1.6">mouse</pluralize></p>
    <p name="p4"><pluralize basedOnNumber="1">mouse</pluralize></p>
    <p name="p5"><pluralize basedOnNumber="0">bus</pluralize></p>
    <p name="p6"><pluralize basedOnNumber="1">bus</pluralize></p>
    <p name="p7"><pluralize basedOnNumber="0.5">goose</pluralize></p>
    <p name="p8"><pluralize basedOnNumber="1">goose</pluralize></p>
    <p name="p9"><pluralize basedOnNumber="-1">pony</pluralize></p>
    <p name="p10"><pluralize basedOnNumber="1">pony</pluralize></p>
    <p name="p11"><pluralize basedOnNumber="3">only</pluralize></p>
    <p name="p12"><pluralize basedOnNumber="1">only</pluralize></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("dogs");
        expect(stateVariables["/p2"].stateValues.text).eq("dog");
        expect(stateVariables["/p3"].stateValues.text).eq("mice");
        expect(stateVariables["/p4"].stateValues.text).eq("mouse");
        expect(stateVariables["/p5"].stateValues.text).eq("buses");
        expect(stateVariables["/p6"].stateValues.text).eq("bus");
        expect(stateVariables["/p7"].stateValues.text).eq("geese");
        expect(stateVariables["/p8"].stateValues.text).eq("goose");
        expect(stateVariables["/p9"].stateValues.text).eq("ponies");
        expect(stateVariables["/p10"].stateValues.text).eq("pony");
        expect(stateVariables["/p11"].stateValues.text).eq("only");
        expect(stateVariables["/p12"].stateValues.text).eq("only");
    });

    it("phrases", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><pluralize>one dog three cat two squirrel or 1 cat plus 7 goose</pluralize></p>
    <p name="p2"><pluralize>one hundred green plane flew through one big sky, rather than six shiny sky</pluralize></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "one dog three cats two squirrels or 1 cat plus 7 geese",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "one hundred green planes flew through one big sky, rather than six shiny skies",
        );
    });

    it("dynamic", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>How many geese? <textInput name="nGeese" prefill="1" /></p>
    <p>How many teeth? <textInput name="nTeeth" prefill="1" /></p>

    <p name="p3"><pluralize>I have $nGeese.value goose even if one doesn't have $nTeeth.value tooth</pluralize></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have 1 goose even if one doesn't have 1 tooth",
        );

        await updateTextInputValue({ name: "/nGeese", text: "three", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have three geese even if one doesn't have 1 tooth",
        );

        await updateTextInputValue({ name: "/nTeeth", text: "0", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have three geese even if one doesn't have 0 teeth",
        );

        await updateTextInputValue({ name: "/nTeeth", text: "one", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have three geese even if one doesn't have one tooth",
        );

        await updateTextInputValue({
            name: "/nTeeth",
            text: "one thousand",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have three geese even if one doesn't have one thousand teeth",
        );

        await updateTextInputValue({ name: "/nGeese", text: "-1", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have -1 geese even if one doesn't have one thousand teeth",
        );

        await updateTextInputValue({ name: "/nGeese", text: "-2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p3"].stateValues.text).eq(
            "I have -2 geese even if one doesn't have one thousand teeth",
        );
    });
});
