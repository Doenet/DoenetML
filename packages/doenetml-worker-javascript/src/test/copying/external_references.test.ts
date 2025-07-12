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
});
