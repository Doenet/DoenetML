import { describe, expect, it, vi } from "vitest";
import { formatEnglishDiagnostic } from "@doenet/i18n";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { DiagnosticError, diagnosticCodeFrom } from "../../utils/diagnostics";
import {
    convertToErrorComponent,
    errorComponentState,
} from "../../utils/dast/errors";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Errors are the one diagnostic family that does not reach `addDiagnostic` as
 * a record. They are *thrown* while the source is being turned into
 * components; the thrower is caught, the component becomes an `_error`, and
 * `ComponentBuilder` raises the diagnostic from that component. The record
 * built at the `catch` is discarded — `DiagnosticsManager` drops preliminary
 * errors on purpose, because the dast pass is what gathers them — so the
 * `_error` component is the *only* thing carrying the diagnostic across.
 *
 * That makes its `state` the slot everything here is about: whatever isn't on
 * it is gone by the time the main thread could render it in `uiLocale`.
 */
describe("a thrown error keeps its code @group4", () => {
    it("carries the code and arguments onto the `_error` it becomes", () => {
        const thrown = new DiagnosticError({
            code: "doenet-e0004",
            args: { attribute: "bad", componentType: "p" },
        });

        const { component, message, code, args } = convertToErrorComponent(
            {
                type: "unflattened",
                componentType: "p",
                componentIdx: 7,
                attributes: {},
                children: [],
                state: {},
            } as any,
            thrown,
        );

        expect(component.componentType).eq("_error");
        expect(component.state.message).eq(
            'Invalid attribute "bad" for a component of type `<p>`.',
        );
        expect(component.state.code).eq("doenet-e0004");
        expect(component.state.args).eqls({
            attribute: "bad",
            componentType: "p",
        });
        // Returned as well as stored: the `catch` blocks build a record from
        // this result, and it has to be the same diagnostic.
        expect({ message, code, args }).eqls({
            message: 'Invalid attribute "bad" for a component of type `<p>`.',
            code: "doenet-e0004",
            args: { attribute: "bad", componentType: "p" },
        });
    });

    it("leaves an uncoded error uncoded rather than inventing a code", () => {
        const { component, ...rest } = convertToErrorComponent(
            {
                type: "unflattened",
                componentType: "p",
                componentIdx: 7,
                attributes: {},
                children: [],
                state: {},
            } as any,
            Error("Something a call site still spells out in English."),
        );

        expect(component.state).eqls({
            message: "Something a call site still spells out in English.",
        });
        expect(rest).eqls({
            message: "Something a call site still spells out in English.",
        });
    });

    it("renders its message from the English catalog", () => {
        // Same source as `codedDiagnostic`, so the thrown and the built form
        // of one situation cannot drift, and a `catch` reading `e.message`
        // sees what it saw before the site was migrated.
        const thrown = new DiagnosticError({
            code: "doenet-e0003",
            args: { attribute: "name" },
        });
        expect(thrown).toBeInstanceOf(Error);
        expect(thrown.message).eq(
            formatEnglishDiagnostic("doenet-e0003", { attribute: "name" }),
        );
        expect(thrown.message).eq("Cannot repeat attribute name.");
    });
});

describe("errorComponentState @group4", () => {
    // Three places build an `_error`, and each is the sole carrier of the
    // diagnostic it holds. They share this so none of them can quietly ship
    // one without its code.
    it("adds nothing when the source has no code to give", () => {
        expect(
            errorComponentState("Something went wrong.", Error("ignored")),
        ).eqls({ message: "Something went wrong." });
    });

    it("takes the code from a diagnostic record", () => {
        // The shape the state-variable queue hands it: the record itself.
        expect(
            errorComponentState("Cannot repeat attribute name.", {
                type: "error",
                message: "Cannot repeat attribute name.",
                code: "doenet-e0003",
                args: { attribute: "name" },
            }),
        ).eqls({
            message: "Cannot repeat attribute name.",
            code: "doenet-e0003",
            args: { attribute: "name" },
        });
    });
});

describe("diagnosticCodeFrom @group4", () => {
    it("reads the slot off an `_error` component's state", () => {
        // The shape `ComponentBuilder` passes it: a plain object, not a
        // `DiagnosticError`, which is why the check is structural.
        expect(
            diagnosticCodeFrom({
                message: "Cannot repeat attribute name.",
                code: "doenet-e0003",
                args: { attribute: "name" },
            }),
        ).eqls({ code: "doenet-e0003", args: { attribute: "name" } });
    });

    it("ignores a code no registry entry defines", () => {
        // A stray `code` property on some unrelated thrown object must not
        // ride out to a formatter that will never resolve it.
        expect(diagnosticCodeFrom({ code: "doenet-e9999" })).eqls({});
        expect(diagnosticCodeFrom({ code: "HTTP 500" })).eqls({});
        expect(diagnosticCodeFrom({ code: 42 })).eqls({});
        expect(diagnosticCodeFrom(Error("plain"))).eqls({});
        expect(diagnosticCodeFrom(undefined)).eqls({});
        expect(diagnosticCodeFrom("doenet-e0003")).eqls({});
    });

    it("drops arguments that aren't a record", () => {
        expect(diagnosticCodeFrom({ code: "doenet-e0003", args: [1, 2] })).eqls(
            { code: "doenet-e0003" },
        );
        expect(
            diagnosticCodeFrom({ code: "doenet-e0003", args: "attribute" }),
        ).eqls({ code: "doenet-e0003" });
    });
});

describe("the code survives the whole trip through the component @group4", () => {
    it("reaches the record for an attribute a component doesn't have", async () => {
        const { core } = await createTestCore({
            doenetML: `
    <p>Good</p>
    <p bad="not good">Unhappy</p>
    `,
        });

        const { errors } = getDiagnosticsByType(core);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0004");
        expect(errors[0].args).eqls({ attribute: "bad", componentType: "p" });
        // The English is unchanged, which is what the assertions in
        // `errors.test.ts` depend on.
        expect(errors[0].message).eq(
            'Invalid attribute "bad" for a component of type `<p>`.',
        );
        // Still positioned: the code rides alongside the location rather than
        // replacing anything the editor needs to draw a squiggle.
        expect(errors[0].position?.start.line).eq(3);
    });

    it("reaches the record for an unknown component type", async () => {
        const { core } = await createTestCore({
            doenetML: `<p><apple /></p>`,
        });

        const { errors } = getDiagnosticsByType(core);
        const invalidType = errors.filter(
            (error) => error.code === "doenet-e0002",
        );
        expect(invalidType.length).eq(1);
        expect(invalidType[0].args).eqls({ componentType: "apple" });
        expect(invalidType[0].message).eq("Invalid component type: `<apple>`");
    });

    it("reaches the record for a repeated attribute", async () => {
        // Spelled with different capitalization on purpose: two identical
        // attribute names never reach the worker (the parser folds them), so
        // the repeat this catches is one that only collides after the
        // case-insensitive mapping.
        const { core } = await createTestCore({
            doenetML: `<p name="a" NAME="b">Hello</p>`,
        });

        const { errors } = getDiagnosticsByType(core);
        const repeated = errors.filter(
            (error) => error.code === "doenet-e0003",
        );
        expect(repeated.length).eq(1);
        expect(repeated[0].args).eqls({ attribute: "name" });
        expect(repeated[0].message).eq("Cannot repeat attribute name.");
    });
});
