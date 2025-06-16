import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Substitute tag tests", async () => {
    async function test_sub_alpha_x2(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["+", "alpha", ["^", "b", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["+", "alpha", ["^", "b", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value
                .tree,
        ).eqls(["+", "d", ["^", "b", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value.tree,
        ).eqls(["+", "d", ["^", "b", 2]]);
    }

    it("substitute into string sugared to math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute name="one" match="x" replacement="b">
      alpha+x^2
    </substitute>
    <substitute name="two" match="x" replacement="b">
      <substitute match="alpha" replacement="d">
        alpha+x^2
      </substitute>
    </substitute>
    `,
        });

        await test_sub_alpha_x2(core, resolvePathToNodeIdx);
    });

    it("substitute into string sugared to math, explicit type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute type="math" name="one" match="x" replacement="b">
      alpha+x^2
    </substitute>
    <substitute type="math" name="two" match="x" replacement="b">
      <substitute type="math" match="alpha" replacement="d">
        alpha+x^2
      </substitute>
    </substitute>
    `,
        });

        await test_sub_alpha_x2(core, resolvePathToNodeIdx);
    });

    it("substitute into math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute type="math" name="one" match="x" replacement="b">
      <math>alpha+x^2</math>
    </substitute>
    <substitute type="math" name="two" match="x" replacement="b">
      <substitute type="math" match="alpha" replacement="d">
        <math>alpha+x^2</math>
      </substitute>
    </substitute>
    `,
        });

        await test_sub_alpha_x2(core, resolvePathToNodeIdx);
    });

    it("change simplify", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <textInput name="simplify" prefill="false" />
    <substitute name="one" match="x" replacement="y" simplify="$simplify">
      x+y
    </substitute>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["+", "y", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["+", "y", "y"]);

        // set simplify to full
        await updateTextInputValue({
            text: "full",
            componentIdx: await resolvePathToNodeIdx("simplify"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["*", 2, "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["*", 2, "y"]);

        // set simplify back to none
        await updateTextInputValue({
            text: "none",
            componentIdx: await resolvePathToNodeIdx("simplify"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["+", "y", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["+", "y", "y"]);
    });

    it("substitute with math, is global substitution", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute type="math" name="one" match="x" replacement="b">
      <substitute type="math" match="alpha" replacement="d">
        <math>x^2+alpha + x/alpha</math>
      </substitute>
    </substitute>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["+", ["^", "b", 2], "d", ["/", "b", "d"]]);
    });

    it("dynamically change parameters, in math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="original" prefill="y+x^2"/>
    <mathInput name="match" prefill="x"/>
    <mathInput name="replacement" prefill="b"/>

    <substitute name="one" match="$match" replacement="$replacement">
      $original
    </substitute>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["+", "y", ["^", "b", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["+", "y", ["^", "b", 2]]);

        // change original
        await updateMathInputValue({
            latex: "q/x",
            componentIdx: await resolvePathToNodeIdx("original"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["/", "q", "b"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["/", "q", "b"]);

        // change match so does not match
        await updateMathInputValue({
            latex: "c",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["/", "q", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["/", "q", "x"]);

        // change match so matches again
        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["/", "b", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["/", "b", "x"]);

        // change replacement
        await updateMathInputValue({
            latex: "m^2",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["/", ["^", "m", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["/", ["^", "m", 2], "x"]);
    });

    // Is the desired behavior?  It is how substitute works in math-expressinons.
    it("substitute does not change numbers in math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute name="one" match="1" replacement="2">
      x+1
    </substitute>
    <substitute name="two" match="x" replacement="y">
      x+1
    </substitute>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value.tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value
                .tree,
        ).eqls(["+", "y", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value.tree,
        ).eqls(["+", "y", 1]);
    });

    it("substitute into string sugared to text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute name="one" type="text" match="Be" replacement="cHe">
      Big banana BerAtes brown bErry.
    </substitute>
    <substitute name="two" type="text" match="Be" replacement="cHe">
      <substitute type="text" match=" berateS " replacement=" chideS">
        Big banana BerAtes brown bErry.
      </substitute>
    </substitute>
    `,
        });

        let s1 = "Big banana cHerAtes brown cHerry.";
        let s2 = "Big banana chideSbrown cHerry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("one")
            ].stateValues.value.trim(),
        ).eq(s1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("one[1]")
            ].stateValues.value.trim(),
        ).eq(s1);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("two")
            ].stateValues.value.trim(),
        ).eq(s2);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("two[1]")
            ].stateValues.value.trim(),
        ).eq(s2);
    });

    it("substitute into text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute name="one" type="text" match="Be" replacement="cHe">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute name="two" type="text" match="Be" replacement="cHe">
      <substitute type="text" match=" berateS " replacement=" chideS">
        <text>Big banana BerAtes brown bErry.</text>
      </substitute>
    </substitute>
    `,
        });

        let s1 = "Big banana cHerAtes brown cHerry.";
        let s2 = "Big banana chideSbrown cHerry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value,
        ).eq(s2);
    });

    it("substitute into text, match case", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute matchCase name="one" type="text" match="Be" replacement="cHe">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute matchCase name="two" type="text" match="bE" replacement="cHe">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `,
        });

        let s1 = "Big banana cHerAtes brown bErry.";
        let s2 = "Big banana BerAtes brown cHerry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value,
        ).eq(s2);
    });

    it("substitute into text, preserve case", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute preserveCase name="one" type="text" match="word" replacement="new">
      <text>A word WORD Word wOrD WoRd.</text>
    </substitute>
    <substitute preserveCase name="two" type="text" match="word" replacement="NEW">
      <text>A word WORD Word wOrD WoRd.</text>
    </substitute>
    <substitute preserveCase name="three" type="text" match="word" replacement="NeW">
      <text>A word WORD Word wOrD WoRd.</text>
    </substitute>
    `,
        });

        let s1 = "A new NEW New new New.";
        let s2 = "A new NEW NEW nEW NEW.";
        let s3 = "A new NEW NeW neW NeW.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("three")].stateValues
                .value,
        ).eq(s3);
        expect(
            stateVariables[await resolvePathToNodeIdx("three[1]")].stateValues
                .value,
        ).eq(s3);
    });

    it("substitute into text, match whole word", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute matchWholeWord name="one" type="text" match="Be" replacement="cHe">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute matchWholeWord name="two" type="text" match="berateS" replacement="chideS">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `,
        });

        let s1 = "Big banana BerAtes brown bErry.";
        let s2 = "Big banana chideS brown bErry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value,
        ).eq(s2);
    });

    it("substitute into text, match whole word with spaces", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute matchWholeWord name="one" type="text" match=" Be" replacement="cHe">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute matchWholeWord name="two" type="text" match=" berateS " replacement="chideS">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `,
        });

        let s1 = "Big banana BerAtes brown bErry.";
        let s2 = "Big bananachideSbrown bErry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("two")].stateValues.value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("two[1]")].stateValues
                .value,
        ).eq(s2);
    });

    it("substitute into text, is global substitution", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>a</text>
    <substitute name="one" type="text" match="b" replacement="c">
      <text>Big babana BerAtes brown bErry.</text>
    </substitute>
    `,
        });

        let s1 = "cig cacana cerAtes crown cErry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);
    });

    it("change pattern and replaces in text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <textInput name="original" prefill="Big banana BerAtes brown bErry."/>
    <textInput name="match" prefill="Be"/>
    <textInput name="replacement" prefill="cHe"/>

    <substitute type="text" name="one" match="$match" replacement="$replacement">
      <text>$original</text>
    </substitute>

    `,
        });

        let s1 = "Big banana cHerAtes brown cHerry.";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s1);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s1);

        // change original
        await updateTextInputValue({
            text: "The bicycle belongs to me.",
            componentIdx: await resolvePathToNodeIdx("original"),
            core,
        });
        let s2 = "The bicycle cHelongs to me.";

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s2);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s2);

        // change match so does not match
        await updateTextInputValue({
            text: "bike",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });
        let s3 = "The bicycle belongs to me.";

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s3);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s3);

        // change match so matches again
        await updateTextInputValue({
            text: "e b",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });
        let s4 = "ThcHeicyclcHeelongs to me.";

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s4);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s4);

        // change match and replacement
        await updateTextInputValue({
            text: "bicycle",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });
        await updateTextInputValue({
            text: "scooter",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });
        let s5 = "The scooter belongs to me.";

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("one")].stateValues.value,
        ).eq(s5);
        expect(
            stateVariables[await resolvePathToNodeIdx("one[1]")].stateValues
                .value,
        ).eq(s5);
    });

    it("modify in inverse direction, math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original: <mathInput name="orig" prefill="x^2+2x+3y" /></p>
    <p>Original 2:<math name="orig2">$orig</math></p>

    <p>Match: <mathInput name="match" prefill="x"/></p>
    <p>Replacement: <mathInput name="replacement" prefill="b"/></p>

    <p>Substituted: <substitute match="$match" replacement="$replacement" name="subbed">$orig2</substitute></p>

    <p>Substituted 2: <mathInput name="subbed2" bindValueTo="$subbed" /></p>


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let origExpr = me.fromText("x^2+2x+3y").tree;
        let subbedExpr = me.fromText("b^2+2b+3y").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change original
        await updateMathInputValue({
            latex: "x^2+2x+3x",
            componentIdx: await resolvePathToNodeIdx("orig"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^2+2x+3x").tree;
        subbedExpr = me.fromText("b^2+2b+3b").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change subbed
        await updateMathInputValue({
            latex: "b^2+2b+3v/b",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^2+2x+3v/x").tree;
        subbedExpr = me.fromText("b^2+2b+3v/b").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change replacement so that it is in original
        await updateMathInputValue({
            latex: "v",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^2+2x+3v/x").tree;
        subbedExpr = me.fromText("v^2+2v+3v/v").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // Cannot modify subbed
        await updateMathInputValue({
            latex: "v^2+2v+3v/(v+1)",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^2+2x+3v/x").tree;
        subbedExpr = me.fromText("v^2+2v+3v/v").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change original to not contain replacement
        await updateMathInputValue({
            latex: "x^2+2x+3u/x",
            componentIdx: await resolvePathToNodeIdx("orig"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^2+2x+3u/x").tree;
        subbedExpr = me.fromText("v^2+2v+3u/v").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // Can modify subbed again
        await updateMathInputValue({
            latex: "v^5+2v+3u/v",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^5+2x+3u/x").tree;
        subbedExpr = me.fromText("v^5+2v+3u/v").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change replacement to be more than a variable
        await updateMathInputValue({
            latex: "v+1",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^5+2x+3u/x").tree;
        subbedExpr = me.fromText("(v+1)^5+2(v+1)+3u/(v+1)").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // Cannot modify subbed
        await updateMathInputValue({
            latex: "+7(v+1)^5+2(v+1)+3u/(v+1)",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^5+2x+3u/x").tree;
        subbedExpr = me.fromText("(v+1)^5+2(v+1)+3u/(v+1)").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change replacement to involve a subscript
        await updateMathInputValue({
            latex: "v_3",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("x^5+2x+3u/x").tree;
        subbedExpr = me.fromText("v_3^5+2v_3+3u/v_3").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // Can modify subbed once more
        await updateMathInputValue({
            latex: "v_9^5+2v_3+3u/v_3",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("v_9^5+2x+3u/x").tree;
        subbedExpr = me.fromText("v_9^5+2v_3+3u/v_3").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // change match to involve a subscript
        await updateMathInputValue({
            latex: "v_9",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("v_9^5+2x+3u/x").tree;
        subbedExpr = me.fromText("v_3^5+2x+3u/x").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // Can still modify subbed
        await updateMathInputValue({
            latex: "v_3^5+2x+3u/v_3",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("v_9^5+2x+3u/v_9").tree;
        subbedExpr = me.fromText("v_3^5+2x+3u/v_3").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);

        // Cannot modify subbed to include match
        await updateMathInputValue({
            latex: "v_3^5+2x+3u/v_3+v_9",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        origExpr = me.fromText("v_9^5+2x+3u/v_9").tree;
        subbedExpr = me.fromText("v_3^5+2x+3u/v_3").tree;
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.value
                .tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value.tree,
        ).eqls(origExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value.tree,
        ).eqls(subbedExpr);
    });

    it("modify in inverse direction, text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Original: <textInput name="orig" prefill="hello there" /></p>
    <p>Original 2:<text name="orig2">$orig</text></p>

    <p>Match: <textInput name="match" prefill="hello"/></p>
    <p>Match whole word: <booleanInput name="wholeWord"/></p>
    <p>Match case: <booleanInput name="matchCase"/></p>
    <p>Replacement: <textInput name="replacement" prefill="bye"/></p>
    <p>Preserve case: <booleanInput name="preserveCase"/></p>

    <p>Substituted: <substitute type="text" match="$match" replacement="$replacement" matchWholeWord="$wholeWord" matchCase="$matchCase" preserveCase="$preserveCase" name="subbed">$orig2</substitute></p>

    <p>Substituted 2: <textInput name="subbed2" bindValueTo="$subbed" /></p>

    <p><boolean extend="$matchCase.value" name="matchCase2" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello there");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello there");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("bye there");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("bye there");

        // change original
        await updateTextInputValue({
            text: "hello thereHello",
            componentIdx: await resolvePathToNodeIdx("orig"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thereHello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thereHello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("bye therebye");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("bye therebye");

        // change subbed
        await updateTextInputValue({
            text: "bye therebyeBye",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello therehellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello therehellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("bye therebyebye");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("bye therebyebye");

        // change replacement so that it is in original
        await updateTextInputValue({
            text: "There",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello therehellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello therehellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("There thereThereThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("There thereThereThere");

        // Cannot modify subbed
        await updateTextInputValue({
            text: "There thereThereThere extra",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello therehellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello therehellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("There thereThereThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("There thereThereThere");

        // change original to not contain replacement
        await updateTextInputValue({
            text: "hello thenhellohello",
            componentIdx: await resolvePathToNodeIdx("orig"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhellohello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("There thenThereThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("There thenThereThere");

        // Can modify subbed again
        await updateTextInputValue({
            text: "There thenThereThe",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("There thenThereThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("There thenThereThe");

        // Cannot modify subbed to include match
        await updateTextInputValue({
            text: "There thenThereTheHELLO",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("There thenThereThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("There thenThereThe");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("wholeWord"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("There thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("There thenhelloThe");

        //change replacement so matches original, but not as a whole word
        await updateTextInputValue({
            text: "Then",
            componentIdx: await resolvePathToNodeIdx("replacement"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then thenhelloThe");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then thenhelloThe");

        // Can still modify subbed
        await updateTextInputValue({
            text: "Then thenhelloThere",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhelloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhelloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then thenhelloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then thenhelloThere");

        // Cannot modify subbed by adding spaces to separate match
        await updateTextInputValue({
            text: "Then then hello There",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello thenhelloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello thenhelloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then thenhelloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then thenhelloThere");

        // change original so that replacement matches original as a whole word
        await updateTextInputValue({
            text: "hello then helloThere",
            componentIdx: await resolvePathToNodeIdx("orig"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then then helloThere");

        // Cannot modify subbed due to replacement match
        await updateTextInputValue({
            text: "Then then helloTherenothing",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then then helloThere");

        // match case
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("matchCase"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then then helloThere");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then then helloThere");

        // Now can modify subbed due to replacement not matching original case
        await updateTextInputValue({
            text: "Then then helloThere Hello",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then then helloThere Hello");

        // Cannot add match to subbed
        await updateTextInputValue({
            text: "Then then helloThere Hello hello",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("hello then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("hello then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then then helloThere Hello");

        // Change subbed to switch cases
        await updateTextInputValue({
            text: "then Then helloThere Hello",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("then Then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("then Then helloThere Hello");

        // preserve case
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("preserveCase"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("then then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("then then helloThere Hello");

        // Cannot change subbed since original contains effective replacement
        await updateTextInputValue({
            text: "then Then helloThere Hello more",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("then then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("then then helloThere Hello");

        // change case of match so that effective replacement is not in original
        await updateTextInputValue({
            text: "Hello",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("then hello helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("then hello helloThere Then");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("then hello helloThere Then");

        // Can now change subbed
        await updateTextInputValue({
            text: "Then HELLO THEN helloThere Then",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("Hello HELLO THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("Hello HELLO THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Then HELLO THEN helloThere Then");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Then HELLO THEN helloThere Then");

        // change case of match so that effective replacement is again in original
        await updateTextInputValue({
            text: "HELLO",
            componentIdx: await resolvePathToNodeIdx("match"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("Hello HELLO THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("Hello HELLO THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Hello THEN THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Hello THEN THEN helloThere Hello");

        // Cannot change subbed
        await updateTextInputValue({
            text: "Hello THEN THEN helloThere Hello ineffective",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("Hello HELLO THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("Hello HELLO THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Hello THEN THEN helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Hello THEN THEN helloThere Hello");

        // change original so no longer has effective replacement
        await updateTextInputValue({
            text: "Hello HELLO Then helloThere Hello",
            componentIdx: await resolvePathToNodeIdx("orig"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("Hello HELLO Then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("Hello HELLO Then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Hello THEN Then helloThere Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Hello THEN Then helloThere Hello");

        // Can change subbed once more
        await updateTextInputValue({
            text: "Hello THEN Then helloThere THEN",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("Hello HELLO Then helloThere HELLO");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("Hello HELLO Then helloThere HELLO");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Hello THEN Then helloThere THEN");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Hello THEN Then helloThere THEN");

        // Cannot add match to subbed
        await updateTextInputValue({
            text: "Hello THEN Then helloThere THEN HELLO",
            componentIdx: await resolvePathToNodeIdx("subbed2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues
                .value,
        ).eq("Hello HELLO Then helloThere HELLO");
        expect(
            stateVariables[await resolvePathToNodeIdx("orig2")].stateValues
                .value,
        ).eq("Hello HELLO Then helloThere HELLO");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed")].stateValues
                .value,
        ).eq("Hello THEN Then helloThere THEN");
        expect(
            stateVariables[await resolvePathToNodeIdx("subbed2")].stateValues
                .value,
        ).eq("Hello THEN Then helloThere THEN");
    });

    it("substitute with incomplete attributes does nothing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <substitute name="m1">x+1</substitute>
    <substitute name="m2" match="x">x+1</substitute>
    <substitute name="m3" replacement="y">x+1</substitute>
    <substitute type="text" name="t1">hello</substitute>
    <substitute type="text" name="t2" match="hello">hello</substitute>
    <substitute type="text" name="t3" replacement="bye">hello</substitute>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);

        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues.value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("t2")].stateValues.value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("t3")].stateValues.value,
        ).eq("hello");
    });

    it("rounding with math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="orig">ax+847.29418392+5y</math>
    <math name="origDig3" displayDigits="3">ax+847.29418392+5y</math>
    <math name="origDec3" displayDecimals="3">ax+847.29418392+5y</math>
    <math name="origPad" padZeros>ax+847.29418392+5y</math>

    <p><substitute match="a" replacement="0.07394918" name="e1">
      $orig
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e1Dig4" displayDigits="4">
      $orig
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e1Dec4" displayDecimals="4">
      $orig
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e1Pad" padZeros>
      $orig
    </substitute></p>
    <p>
      <math extend="$e1Dec4" name="e1Dig4a" displayDigits="4" />
      <math extend="$e1Dig4" name="e1Dec4a" displayDecimals="4" />
    </p>


    <p><substitute match="a" replacement="0.07394918" name="e2">
      $origDig3
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e2Dig4" displayDigits="4">
      $origDig3
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e2Dec4" displayDecimals="4">
      $origDig3
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e2Pad" padZeros>
      $origDig3
    </substitute></p>
    <p>
      <math extend="$e2Dec4" name="e2Dig4a" displayDigits="4" />
      <math extend="$e2Dig4" name="e2Dec4a" displayDecimals="4" />
    </p>

    <p><substitute match="a" replacement="0.07394918" name="e3">
      $origDec3
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e3Dig4" displayDigits="4" >
      $origDec3
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e3Dec4" displayDecimals="4" >
      $origDec3
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e3Pad" padZeros>
      $origDec3
    </substitute></p>
    <p>
      <math extend="$e3Dec4" name="e3Dig4a" displayDigits="4" />
      <math extend="$e3Dig4" name="e3Dec4a" displayDecimals="4" />
    </p>

    <p><substitute match="a" replacement="0.07394918" name="e4">
      $origPad
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e4Dig4" displayDigits="4" >
      $origPad
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e4Dec4" displayDecimals="4" >
      $origPad
    </substitute>
    <substitute match="a" replacement="0.07394918" name="e4NoPad" padZeros="false">
      $origPad
    </substitute></p>
    <p>
      <math extend="$e4Dec4" name="e4Dig4a" displayDigits="4" />
      <math extend="$e4Dig4" name="e4Dec4a" displayDecimals="4" />
    </p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1[1]")].stateValues
                    .latex,
            ),
        ).eq("0.0739x+847.29+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1Dig4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1Dec4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1Pad[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.29+5.00y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1Dig4a")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1Dec4a")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2[1]")].stateValues
                    .latex,
            ),
        ).eq("0.0739x+847+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2Dig4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2Dec4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2Pad[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847+5.00y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2Dig4a")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2Dec4a")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3[1]")].stateValues
                    .latex,
            ),
        ).eq("0.074x+847.294+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3Dig4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3Dec4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3Pad[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.074x+847.294+5.000y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3Dig4a")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3Dec4a")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4[1]")].stateValues
                    .latex,
            ),
        ).eq("0.0739x+847.29+5.00y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4Dig4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5.000y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4Dec4[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5.0000y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4NoPad[1]")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.29+5y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4Dig4a")]
                    .stateValues.latex,
            ),
        ).eq("0.07395x+847.3+5.000y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4Dec4a")]
                    .stateValues.latex,
            ),
        ).eq("0.0739x+847.2942+5.0000y");
    });
});
