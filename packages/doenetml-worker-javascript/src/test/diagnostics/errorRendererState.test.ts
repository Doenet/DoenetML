import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The red box an error is rendered as, in the reader's language.
 *
 * `_error` has carried the code and arguments of the diagnostic it came from
 * since #1556, but only on its `state`, where the renderer could not see them
 * — so the box showed the English the worker wrote while the Diagnostics panel
 * beside it showed the reader's language (#1568). These are the state
 * variables that close that gap; `_error.tsx` renders `message` through them
 * and falls back to the English when there is nothing to render from.
 *
 * The rendering itself is a Cypress test
 * (`packages/doenetml/test/cypress/component/DoenetViewer.errorLocale.cy.tsx`).
 * What is checked here is that the worker hands over everything that test
 * needs, since a value missing here is invisible from the other side.
 */
describe("the error component carries its diagnostic to the renderer @group4", () => {
    it("exposes the code and arguments a coded error arrived with", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="bad" bogusAttribute="x">Unhappy</p>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const error = stateVariables[await resolvePathToNodeIdx("bad")];

        expect(error.componentType).eq("_error");
        expect(error.stateValues.code).eq("doenet-e0004");
        expect(error.stateValues.args).eqls({
            attribute: "bogusAttribute",
            componentType: "p",
        });
        // The English is still there: it is what the renderer falls back to
        // when the reader's catalogs have no answer for the code.
        expect(error.stateValues.message).eq(
            'Invalid attribute "bogusAttribute" for a component of type `<p>`.',
        );
    });

    it("codes the box a `<select>` replaces itself with", async () => {
        // This was the last `_error` that arrived with nothing but English:
        // `<select>`'s `errorMessage` was a state variable holding a finished
        // sentence, so a Spanish reader got one English box on an otherwise
        // Spanish page. It carries its code now, like every other error
        // (#1581). The English stays as the fallback, and is what the existing
        // `<select>` suite asserts on.
        const { core } = await createTestCore({
            doenetML: `
<variantControl variantNames="uno dos" />
<select numToSelect="1">
  <option selectForVariants="uno"><p>x</p></option>
</select>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const errors = Object.values(stateVariables).filter(
            (component: any) => component.componentType === "_error",
        ) as any[];

        expect(errors.length).eq(1);
        expect(errors[0].stateValues.code).eq("doenet-e0033");
        expect(errors[0].stateValues.args).eqls({ variantName: "dos" });
        expect(errors[0].stateValues.showMessage).eq(true);
        expect(errors[0].stateValues.message).eq(
            "Some variants are specified for select but no options are specified for possible variant name: dos.",
        );
    });

    it("takes the source location apart instead of only spelling it out", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="bad" bogusAttribute="x">Unhappy</p>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const error = stateVariables[await resolvePathToNodeIdx("bad")];

        // The English sentence stays: `rangeMessage` is public, so
        // `$err.rangeMessage` has to keep working, and it is the fallback.
        expect(error.stateValues.rangeMessage).eq("Found on line 2.");
        // Line numbers as strings, so Fluent does not group line 1234 as
        // "1,234" on its way through `Intl.NumberFormat`.
        expect(error.stateValues.rangeArgs).eqls({
            span: "line",
            startLine: "2",
            endLine: "2",
        });
    });

    it("says when an error spans more than one line", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="bad"
   bogusAttribute="x"
>Unhappy</p>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const error = stateVariables[await resolvePathToNodeIdx("bad")];

        expect(error.stateValues.rangeMessage).eq("Found on lines 2–4.");
        expect(error.stateValues.rangeArgs).eqls({
            span: "lines",
            startLine: "2",
            endLine: "4",
        });
    });
});
