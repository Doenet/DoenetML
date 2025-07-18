import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import {
    callAction,
    moveLine,
    movePoint,
    updateMathInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("External References Tests", async () => {
    it("can retrieve and expand external DoenetML", async () => {
        const doenetMLs = {
            abc: `<section name="s"><title>My section</title><p name="p">Hello</p></section>`,
            def: `<p name="p">Bye</p>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s2"><p copy="doenet:def" name="p2"/></section>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.s.p")].stateValues
                .text,
        ).eq("Hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p2")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p2.p")].stateValues
                .text,
        ).eq("Bye");

        expect(
            stateVariables[await resolvePathToNodeIdx("s2")].stateValues.title,
        ).eq("My section");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.s")].stateValues
                .title,
        ).eq("My section");
    });

    it("overwrite title of external DoenetML", async () => {
        const doenetMLs = {
            abc: `<section name="s"><title>My section</title><p name="p">Hello</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s1" />
    <section copy="doenet:abc" name="s2"><title>New title</title></section>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s1.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s1")].stateValues.title,
        ).eq("My section");
        expect(
            stateVariables[await resolvePathToNodeIdx("s1.s")].stateValues
                .title,
        ).eq("My section");

        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2")].stateValues.title,
        ).eq("New title");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.s")].stateValues
                .title,
        ).eq("New title");
    });

    it("references to external content", async () => {
        const doenetMLs = {
            abc: `<section name="s1" copy="doenet:def"><p name="p1">Hello</p></section>`,
            def: `<section name="s2" copy="doenet:ghi"><p name="p2">Bye</p></section>`,
            ghi: `<section name="s3"><p name="p3">How</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s">
      <p name="p1" extend="$s.s1.p1"> world</p>
      <p name="p2" extend="$s.s1.p2"> there</p>
      <p name="p3" extend="$s.s1.s2.p3"> now</p>
    </section>
    <section name="s2">
      <p name="p1" extend="$s.s1.p1"> world</p>
      <p name="p2" extend="$s.s1.p2"> there</p>
      <p name="p3" extend="$s.s1.s2.p3"> now</p>
    </section>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p1")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p2")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.s2.p3")].stateValues
                .text,
        ).eq("How");

        expect(
            stateVariables[await resolvePathToNodeIdx("s.p1")].stateValues.text,
        ).eq("Hello world");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p2")].stateValues.text,
        ).eq("Bye there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p3")].stateValues.text,
        ).eq("How now");

        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p1")].stateValues
                .text,
        ).eq("Hello world");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p2")].stateValues
                .text,
        ).eq("Bye there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p3")].stateValues
                .text,
        ).eq("How now");
    });

    it("references to external content fail without parent name", async () => {
        const doenetMLs = {
            abc: `<section name="s1" copy="doenet:def"><p name="p1">Hello</p></section>`,
            def: `<section name="s2" copy="doenet:ghi"><p name="p2">Bye</p></section>`,
            ghi: `<section name="s3"><p name="p3">How</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s">
      <p name="p4" extend="$p1"> world</p>
      <p name="p5" extend="$s.p2"> there</p>
      <p name="p6" extend="$s.s1.p3"> now</p>
    </section>
    <section name="s2">
      <p name="p4" extend="$p1"> world</p>
      <p name="p5" extend="$s.p2"> there</p>
      <p name="p6" extend="$s.s1.p3"> now</p>
    </section>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p1")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p2")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.s2.p3")].stateValues
                .text,
        ).eq("How");

        expect(
            stateVariables[await resolvePathToNodeIdx("s.p4")].stateValues.text,
        ).eq(" world");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p5")].stateValues.text,
        ).eq(" there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p6")].stateValues.text,
        ).eq(" now");

        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p4")].stateValues
                .text,
        ).eq(" world");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p5")].stateValues
                .text,
        ).eq(" there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p6")].stateValues
                .text,
        ).eq(" now");
    });

    it("local names supersede external names in references", async () => {
        const doenetMLs = {
            abc: `<section name="s1"><p name="p1">Hello</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s">
      <p name="p1">Bye</p>
      <p name="p2" extend="$s.p1"> there</p>
      <p name="p3" extend="$p1"> there</p>
      <p name="p4" extend="$s.s1.p1"> world</p>
    </section>
    <section name="s2">
      <p name="p1" extend="$s.p1"> there</p>
      <p name="p2" extend="$s.s1.p1"> world</p>
    </section>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p1")].stateValues
                .text,
        ).eq("Hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("s.p1")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p2")].stateValues.text,
        ).eq("Bye there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p3")].stateValues.text,
        ).eq("Bye there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.p4")].stateValues.text,
        ).eq("Hello world");

        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p1")].stateValues
                .text,
        ).eq("Bye there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p2")].stateValues
                .text,
        ).eq("Hello world");
    });

    it("External content cannot reference local names", async () => {
        const doenetMLs = {
            abc: `
        <section name="s1">
            <p name="p3" extend="$p1"> world</p>
            <p name="p4" extend="$p2"> there</p>

            <p name="p5" extend="$s.p1"> world</p>
            <p name="p6" extend="$s2.p2"> there</p>
        </section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s">
      <p name="p1">Hello</p>
    </section>
    <section name="s2">
      <p name="p2">Bye</p>
    </section>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s.p1")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p2")].stateValues
                .text,
        ).eq("Bye");

        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p3")].stateValues
                .text,
        ).eq(" world");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p4")].stateValues
                .text,
        ).eq(" there");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p5")].stateValues
                .text,
        ).eq(" world");
        expect(
            stateVariables[await resolvePathToNodeIdx("s.s1.p6")].stateValues
                .text,
        ).eq(" there");
    });

    it("reference external content from within an extend or copy", async () => {
        const doenetMLs = {
            abc: `<section name="s"><p name="p">Hello</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section copy="doenet:abc" name="s1" />
    <section extend="$s1" name="s2" />
    <section copy="$s1" name="s3" />

    <p extend="$s1.p" name="p1" />
    <p copy="$s2.p" name="p2" />
    <p extend="$s3.p" name="p3" />
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s1.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s3.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("Hello");
    });

    it("reference external content from within an extend or copy of parent", async () => {
        const doenetMLs = {
            abc: `<section name="s"><p name="p">Hello</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s1">
        <section name="external" copy="doenet:abc" />
    </section>
    <section extend="$s1" name="s2" />
    <section copy="$s1" name="s3" />

    <p copy="$s1.external.p" name="p1" />
    <p extend="$s2.external.p" name="p2" />
    <p copy="$s3.external.p" name="p3" />
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s1.external.p")]
                .stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s2.external.p")]
                .stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s3.external.p")]
                .stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("Hello");
    });

    it("reference external content from within an extend or copy, multiple layers", async () => {
        const doenetMLs = {
            abc: `
            <section name="s1" copy="doenet:def">
                <p name="p1">Hello</p>
                <p name="p2" extend="$s1.p3" />
            </section>`,
            def: `<section name="s3"><p name="p3">Bye</p></section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s4" copy="doenet:abc" />
    <section extend="$s4" name="s5" />
    <section copy="$s5" name="s6" />

    <p copy="$s4.p1" name="p41" />
    <p extend="$s4.p2" name="p42" />
    <p copy="$s4.s1.p3" name="p43" />

    <p extend="$s5.p1" name="p51" />
    <p copy="$s5.p2" name="p52" />
    <p extend="$s5.s1.p3" name="p53" />

    <p copy="$s6.p1" name="p61" />
    <p extend="$s6.p2" name="p62" />
    <p copy="$s6.s1.p3" name="p63" />

    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("s4.p1")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s4.p2")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s4.s1.p3")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s5.p1")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s5.p2")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s5.s1.p3")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s6.p1")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("s6.p2")].stateValues
                .text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("s6.s1.p3")].stateValues
                .text,
        ).eq("Bye");

        expect(
            stateVariables[await resolvePathToNodeIdx("p41")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p42")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("p43")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("p51")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p52")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("p53")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("p61")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("p62")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("p63")].stateValues.text,
        ).eq("Bye");
    });

    it("change attributes to external content", async () => {
        const doenetMLs = {
            abc: `<problem><title>My problem</title>1+1=<answer>2</answer></problem>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <problem copy="doenet:abc" name="p" sectionWideCheckWork><title>Revised problem</title></problem>

    <p name="pt">Title: $p.title</p>
    <p name="pcw">Section-wide check work: $p.sectionWideCheckWork</p>
    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pt")].stateValues.text,
        ).eq("Title: Revised problem");
        expect(
            stateVariables[await resolvePathToNodeIdx("pcw")].stateValues.text,
        ).eq("Section-wide check work: true");

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.title,
        ).eq("Revised problem");

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .sectionWideCheckWork,
        ).eq(true);
    });

    it("external content with repeat", async () => {
        const doenetMLs = {
            rep: `<problem><p name="p"><repeat for="3 2" valueName="v" indexName="i"><number>$v^2+$i</number></repeat></p></problem>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <problem copy="doenet:rep" name="problem" />

    `,
            externalDoenetMLs: doenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("problem.p")].stateValues
                .text,
        ).eq("10, 6");
    });
});
