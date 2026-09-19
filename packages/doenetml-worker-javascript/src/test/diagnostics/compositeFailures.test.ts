import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The message the injected failures throw. What each test asserts is that this
 * string reaches the document's diagnostics, so it is distinctive enough that
 * nothing else could have produced it.
 */
const INJECTED = "Injected failure in replacement bookkeeping";

/**
 * When set, `addReplacementsToResolver` throws for composites of this type.
 */
let failRegistrationFor: string | null = null;

/**
 * When true, `determineParentAndIndexResolutionForResolver` throws.
 *
 * Only `CompositeReplacementUpdater.adjustReplacementsToWithhold` imports that
 * function across the module boundary, so this reaches the withholding path
 * and nothing else: `addReplacementsToResolver` calls it through the module's
 * own binding, which a module mock does not intercept.
 */
let failWithholdAdjustment = false;

vi.mock("../../core/ResolverAdapter", async (importOriginal) => {
    const actual =
        await importOriginal<typeof import("../../core/ResolverAdapter")>();
    return {
        ...actual,
        async addReplacementsToResolver(args: any) {
            if (
                failRegistrationFor !== null &&
                args.component.componentType === failRegistrationFor
            ) {
                throw Error(INJECTED);
            }
            return actual.addReplacementsToResolver(args);
        },
        async determineParentAndIndexResolutionForResolver(args: any) {
            if (failWithholdAdjustment) {
                throw Error(INJECTED);
            }
            return actual.determineParentAndIndexResolutionForResolver(args);
        },
    };
});

/**
 * A composite that cannot build its replacements reports itself, and the rest
 * of the document renders — the rule #1935 and #1941 stated for the parser and
 * for one element at a time, applied to the two paths a composite's
 * replacements travel.
 *
 * The two paths failed differently before this, and the tests below assert the
 * same outcome for both:
 *
 * - While the document is being **built**, the throw escaped construction and
 *   the reader got a blank page (#1950).
 * - While the document is being **updated**, `ProcessQueue.executeProcesses`
 *   caught it, so the page stayed up — but the update silently did not happen
 *   and the only trace was a `console.error` the author cannot see (#1952).
 *
 * The failures are injected rather than provoked with a document that really
 * fails, for the reason #1941 gave for the failure screen: a document that
 * fails this way is a bug to be removed, and a test driven by one would be
 * testing whether the bug survived. #1950's document is pinned in
 * `repeat.test.ts` as the working document it now is.
 *
 * Every test has a control that runs the same document with nothing injected,
 * so a pass cannot come from the document never building anything.
 */
describe("a composite reports its own failure rather than losing it @group4", () => {
    const buildDoenetML = `
<p name="before">before</p>
<sequence name="s" from="1" to="3" />
<p name="after">after</p>`;

    it("reports a failure registering replacements while building", async () => {
        failRegistrationFor = "sequence";
        let core, resolvePathToNodeIdx;
        try {
            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: buildDoenetML,
            }));
        } finally {
            failRegistrationFor = null;
        }

        const stateVariables = await core.returnAllStateVariables(false, true);

        // The document built, and everything around the composite is there.
        expect(
            stateVariables[await resolvePathToNodeIdx("before")].stateValues
                .text,
        ).eq("before");
        expect(
            stateVariables[await resolvePathToNodeIdx("after")].stateValues
                .text,
        ).eq("after");

        // The composite shows the message in place of the numbers it would
        // have produced.
        const replacements =
            stateVariables[await resolvePathToNodeIdx("s")].replacements!;
        expect(replacements.length).eq(1);
        expect(stateVariables[replacements[0].componentIdx].componentType).eq(
            "_error",
        );

        expect(
            getDiagnosticsByType(core).errors.filter((error) =>
                error.message.includes(INJECTED),
            ).length,
        ).eq(1);
    });

    it("control: the same document builds with nothing injected", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: buildDoenetML,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const replacements =
            stateVariables[await resolvePathToNodeIdx("s")].replacements!;
        expect(
            replacements.map(
                (replacement: any) =>
                    stateVariables[replacement.componentIdx].stateValues.value,
            ),
        ).eqls([1, 2, 3]);

        expect(getDiagnosticsByType(core).errors.length).eq(0);
    });

    // Growing the sequence makes it create replacements, which is the update
    // path's own call to `addReplacementsToResolver`.
    const growDoenetML = `
<mathInput name="n" prefill="3" />
<p name="after">after</p>
<sequence name="s" from="1" to="$n" />`;

    it("reports a failure registering replacements while updating", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: growDoenetML,
        });

        failRegistrationFor = "sequence";
        try {
            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
        } finally {
            failRegistrationFor = null;
        }

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("after")].stateValues
                .text,
        ).eq("after");

        expect(
            getDiagnosticsByType(core).errors.filter((error) =>
                error.message.includes(INJECTED),
            ).length,
        ).eq(1);
    });

    it("control: the same update with nothing injected", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: growDoenetML,
        });

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const replacements =
            stateVariables[await resolvePathToNodeIdx("s")].replacements!;
        expect(
            replacements.map(
                (replacement: any) =>
                    stateVariables[replacement.componentIdx].stateValues.value,
            ),
        ).eqls([1, 2, 3, 4, 5]);

        expect(getDiagnosticsByType(core).errors.length).eq(0);
    });

    // Shrinking the repeat makes it withhold replacements rather than create
    // them, which is the one path that reaches
    // `adjustReplacementsToWithhold`'s resolver adjustment — and the only
    // route these tests found to a throw escaping
    // `updateCompositeReplacements` itself, which is what the backstop in
    // `EssentialValueWriter` catches.
    const shrinkDoenetML = `
<mathInput name="n" prefill="5" />
<p name="after">after</p>
<p name="vals"><repeatForSequence name="s" from="1" to="$n" valueName="v"><number>$v</number> </repeatForSequence></p>`;

    it("reports a failure adjusting which replacements are withheld", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: shrinkDoenetML,
        });

        failWithholdAdjustment = true;
        try {
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
        } finally {
            failWithholdAdjustment = false;
        }

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("after")].stateValues
                .text,
        ).eq("after");

        // The withholding did not happen -- the page still shows all five --
        // which is the point of reporting it: the author is told that the
        // document is not showing what it says, rather than left to wonder.
        expect(
            stateVariables[await resolvePathToNodeIdx("vals")].stateValues.text,
        ).eq("1, 2, 3, 4, 5");

        expect(
            getDiagnosticsByType(core).errors.filter((error) =>
                error.message.includes(INJECTED),
            ).length,
        ).eq(1);
    });

    it("control: the same withholding with nothing injected", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: shrinkDoenetML,
        });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        // The replacements are withheld rather than deleted, so the array
        // still holds five; what changed is what reaches the page.
        expect(
            stateVariables[await resolvePathToNodeIdx("vals")].stateValues.text,
        ).eq("1, 2");

        expect(getDiagnosticsByType(core).errors.length).eq(0);
    });
});
