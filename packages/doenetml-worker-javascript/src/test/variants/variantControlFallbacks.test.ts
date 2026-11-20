import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `<variantControl>` never stops the document (DIAG-5, D47 decision 1,
 * Doenet/DoenetML#2579). What it can't follow is an error at the attribute,
 * with a fallback, and the document loads:
 * - names that exclude every variant: every variant is included (`e0087`);
 * - a name repeated in `variantNames`: the first is kept (`e0086`);
 * - an empty `variantsToInclude`: ignored (`e0072`);
 * - a reference in any of its attributes: ignored (`e0085`), as variants are
 *   decided before a reference can be read.
 *
 * And a section's `<variantControl>` is followed in a document without
 * unique variants.
 */
async function load(
    doenetML: string,
    {
        componentName = "_document1",
        requestedVariantIndex,
    }: { componentName?: string; requestedVariantIndex?: number } = {},
) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        requestedVariantIndex,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const { errors, warnings } = getDiagnosticsByType(core);
    const sharedParameters =
        stateVariables[await resolvePathToNodeIdx(componentName)]
            .sharedParameters;
    return {
        variants: sharedParameters.allPossibleVariants,
        variantName: sharedParameters.variantName,
        errors,
        warnings,
        stateVariables,
        resolvePathToNodeIdx,
    };
}

// enough unique variants that they don't limit the variants named
const select = `<selectFromSequence name="n" length="100000" />`;

describe("variantControl fallbacks @group1", async () => {
    describe("names that exclude every variant", () => {
        it("variantsToExclude names every variant: every variant is included", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="2" variantsToExclude="a b" />
${select}
`);
            expect(variants).eqls(["a", "b"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0087");
            expect(errors[0].message).eq(
                "`variantsToExclude` excludes every variant of this document, which leaves none. Every variant is included.",
            );
            // at the attribute
            expect(errors[0].position?.start.line).eq(2);
            expect(errors[0].position?.start.column).eq(33);
        });

        it("variantsToExclude excludes what variantsToInclude names: every variant is included", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="a" variantsToExclude="A" />
${select}
`);
            expect(variants).eqls(["a", "b", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0087");
            expect(errors[0].message).eq(
                "`variantsToExclude` excludes every variant of this document that `variantsToInclude` names, which leaves none. Every variant is included.",
            );
            expect(errors[0].position?.start.column).eq(55);
        });

        it("with an unknown name too, each gets its error", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="2" variantsToExclude="a b grape" />
${select}
`);
            expect(variants).eqls(["a", "b"]);
            expect(errors.map((e) => e.code)).eqls([
                "doenet-e0079",
                "doenet-e0087",
            ]);
        });

        it("with unique variants, excluding every unique variant", async () => {
            // two unique variants, though three are named
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToExclude="a b" />
<selectFromSequence name="n" from="1" to="2" />
`);
            expect(variants).eqls(["a", "b"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0087");
        });

        it("in a problem", async () => {
            const { variants, errors } = await load(
                `
<p>Hello!</p>
<problem name="problem1">
    <variantControl numVariants="2" variantsToExclude="a b" />
    ${select}
</problem>
`,
                { componentName: "problem1" },
            );
            expect(variants).eqls(["a", "b"]);
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(
                "`variantsToExclude` excludes every variant of this `<problem>`, which leaves none. Every variant is included.",
            );
            expect(errors[0].position?.start.line).eq(4);
        });
    });

    describe("a name repeated in variantNames", () => {
        it("the first is kept", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="x X y" />
${select}
`);
            // `X` is ignored, so the third variant gets a letter name
            expect(variants).eqls(["x", "y", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0086");
            expect(errors[0].message).eq(
                "`variantNames` names `X` again. Variant names are compared without case, so each must be different. The name is kept where it is first written, and the repeat is ignored.",
            );
            expect(errors[0].position?.start.line).eq(2);
            expect(errors[0].position?.start.column).eq(33);
        });

        it("several repeats, each named once, as first repeated", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="Apple banana APPLE Banana apple cherry" />
${select}
`);
            expect(variants).eqls(["apple", "banana", "cherry"]);
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(
                "`variantNames` names `APPLE` and `Banana` again. Variant names are compared without case, so each must be different. Each name is kept where it is first written, and the repeats are ignored.",
            );
        });

        it("a variant is named as first written", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="2" variantNames="Apple apple Banana" variantsToInclude="grape" />
${select}
`);
            expect(variants).eqls(["apple", "banana"]);
            expect(errors.map((e) => e.code)).eqls([
                "doenet-e0086",
                "doenet-e0079",
            ]);
            expect(errors[1].message).eq(
                "`variantsToInclude` names `grape`, which is not a variant of this document. Its 2 variants are named `Apple`, `Banana`. As `variantsToInclude` names no variant, every variant is included.",
            );
        });

        it("a name repeated after numVariants is still a repeat", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="2" variantNames="x y X" />
${select}
`);
            expect(variants).eqls(["x", "y"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0086");
        });
    });

    describe("an empty variantsToInclude", () => {
        for (const value of ["", "   "]) {
            it(`variantsToInclude="${value}" is ignored`, async () => {
                const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="${value}" variantsToExclude="b" />
${select}
`);
                expect(variants).eqls(["a", "c"]);
                expect(errors.length).eq(1);
                expect(errors[0].code).eq("doenet-e0072");
                expect(errors[0].message).eq(
                    'The `variantsToInclude` attribute is empty, and it needs a value. Write one, as `variantsToInclude="…"`, or remove the attribute.',
                );
                expect(errors[0].position?.start.line).eq(2);
                expect(errors[0].position?.start.column).eq(33);
            });
        }
    });

    describe("a reference is ignored", () => {
        const message = (attribute: string) =>
            `\`${attribute}\` of \`<variantControl>\` holds a reference, which is ignored. A document's variants are decided before anything else in it, so a reference can't be read there. Write the value itself.`;

        it("variantsToInclude", async () => {
            let { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="$v" />
<text name="v">b</text>
${select}
`);
            expect(variants).eqls(["a", "b", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0085");
            expect(errors[0].message).eq(message("variantsToInclude"));
            expect(errors[0].position?.start.line).eq(2);
            expect(errors[0].position?.start.column).eq(33);

            // the names written beside it are kept
            ({ variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="a $v c" />
<text name="v">b</text>
${select}
`));
            expect(variants).eqls(["a", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0085");
        });

        it("variantsToExclude", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToExclude="b, $v" />
<text name="v">a</text>
${select}
`);
            expect(variants).eqls(["a", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(message("variantsToExclude"));
        });

        it("variantNames", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="x $v" />
<text name="v">y</text>
${select}
`);
            expect(variants).eqls(["x", "b", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(message("variantNames"));
        });

        it("numVariants, with the other attributes followed", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="$n" variantNames="x y" variantsToExclude="y" />
<number name="n">3</number>
${select}
`);
            // the default number of variants
            expect(variants.length).eq(99);
            expect(variants.slice(0, 3)).eqls(["x", "c", "d"]);
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(message("numVariants"));
            expect(errors[0].position?.start.column).eq(17);
        });

        it("seeds", async () => {
            const doenetML = (seeds: string) => `
<variantControl numVariants="2" seeds="${seeds}" />
<text name="v">7</text>
${select}
`;
            let { errors, stateVariables, resolvePathToNodeIdx } = await load(
                doenetML("5 $v"),
            );
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(message("seeds"));
            // with fewer seeds than variants, the seeds are 1, 2, …
            const { stateVariables: stateVariables2 } = await load(
                doenetML("1 2"),
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantSeed,
            ).eq(
                stateVariables2[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantSeed,
            );
        });

        it("uniqueVariants", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" uniqueVariants="$b" variantsToInclude="a c" />
<boolean name="b">false</boolean>
${select}
`);
            expect(variants).eqls(["a", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].message).eq(message("uniqueVariants"));
        });

        it("one error for each attribute that holds one", async () => {
            const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="$v $w" variantsToInclude="$v" />
<text name="v">x</text>
<text name="w">y</text>
${select}
`);
            expect(variants).eqls(["a", "b", "c"]);
            expect(errors.map((e) => e.args?.attribute)).eqls([
                "variantNames",
                "variantsToInclude",
            ]);
            expect(errors.every((e) => e.code === "doenet-e0085")).eq(true);
        });

        it("in a problem", async () => {
            const { variants, errors } = await load(
                `
<p>Hello!</p>
<problem name="problem1">
    <variantControl numVariants="3" variantsToInclude="$v c" />
    ${select}
</problem>
<text name="v">a</text>
`,
                { componentName: "problem1" },
            );
            expect(variants).eqls(["c"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0085");
            expect(errors[0].position?.start.line).eq(4);
        });
    });

    describe("a problem's variantControl, in a document without unique variants", () => {
        const doenetML = (problemAttributes: string) => `
<variantControl numVariants="30" uniqueVariants="false" />
<selectFromSequence name="m" from="1" to="2" />
<problem name="p">
    <variantControl numVariants="3" ${problemAttributes} />
    <selectFromSequence name="n" from="1" to="3" />
    <number name="nn">$n</number>
</problem>
`;

        it("is followed", async () => {
            const { variants, errors } = await load(
                doenetML(`variantsToInclude="b"`),
                { componentName: "p" },
            );
            expect(variants).eqls(["b"]);
            expect(errors.length).eq(0);
        });

        it("an unknown name in it is an error", async () => {
            const { variants, errors } = await load(
                doenetML(`variantsToInclude="q"`),
                { componentName: "p" },
            );
            expect(variants).eqls(["a", "b", "c"]);
            expect(errors.length).eq(1);
            expect(errors[0].code).eq("doenet-e0079");
            expect(errors[0].message).eq(
                "`variantsToInclude` names `q`, which is not a variant of this `<problem>`. Its 3 variants are named `a`, `b`, `c`. As `variantsToInclude` names no variant, every variant is included.",
            );
        });

        it("its variants are unique, and the same as in a document with unique variants", async () => {
            // each variant of the problem selects the same `n` in any variant
            // of the document, and the three select different ones
            const nByVariant: Record<string, Set<number>> = {};
            for (let ind = 1; ind <= 30; ind++) {
                const { variantName, stateVariables, resolvePathToNodeIdx } =
                    await load(doenetML(""), {
                        componentName: "p",
                        requestedVariantIndex: ind,
                    });
                const n =
                    stateVariables[await resolvePathToNodeIdx("nn")].stateValues
                        .value;
                (nByVariant[variantName] ??= new Set()).add(n);
            }
            expect(Object.keys(nByVariant).sort()).eqls(["a", "b", "c"]);
            const ns = Object.values(nByVariant).map((s) => [...s]);
            expect(ns.every((s) => s.length === 1)).eq(true);
            expect(new Set(ns.flat()).size).eq(3);

            // in a document with unique variants, each problem variant
            // selects the same `n` as above
            for (const variantName of ["a", "b", "c"]) {
                const { stateVariables, resolvePathToNodeIdx } = await load(
                    `
<problem name="p">
    <variantControl numVariants="3" variantsToInclude="${variantName}" />
    <selectFromSequence name="n" from="1" to="3" />
    <number name="nn">$n</number>
</problem>
`,
                    { componentName: "p" },
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("nn")].stateValues
                        .value,
                ).eq([...nByVariant[variantName]][0]);
            }
        });
    });

    it("a saved attempt still shows the content it was saved with", async () => {
        // SAVE-1. Before #2579, the problem's `<variantControl>` was ignored
        // in this document, and its selection was made at random: the
        // document's variant `h` was saved with the problem as its variant
        // `h` (from the document's variants) and `n` as 1. The problem's own
        // variants now read that index 8 as its variant `b`, which selects
        // `n` as 3, but a saved attempt carries what each selection was, so
        // it still shows `n` as 1.
        const doenetML = `
<variantControl numVariants="30" uniqueVariants="false" />
<selectFromSequence name="m" from="1" to="2" />
<problem name="p">
    <variantControl numVariants="3" />
    <selectFromSequence name="n" from="1" to="3" />
    <number name="nn">$n</number>
</problem>
`;
        const nOf = async (requestedVariant?: Record<string, any>) => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: 8,
                requestedVariant,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return {
                n: stateVariables[await resolvePathToNodeIdx("nn")].stateValues
                    .value,
                generatedVariantInfo:
                    stateVariables[await resolvePathToNodeIdx("_document1")]
                        .stateValues.generatedVariantInfo,
            };
        };

        const savedBefore = {
            index: 8,
            name: "h",
            meta: { createdBy: 0 },
            subvariants: [
                { indices: [1], meta: { createdBy: 2 } },
                {
                    index: 8,
                    name: "h",
                    meta: { createdBy: 3 },
                    subvariants: [{ indices: [1], meta: { createdBy: 5 } }],
                },
            ],
        };
        expect((await nOf()).n).not.eq(1);
        expect((await nOf(savedBefore)).n).eq(1);

        // and one saved now comes back the same
        const now = await nOf();
        const reloaded = await nOf(
            JSON.parse(JSON.stringify(now.generatedVariantInfo)),
        );
        expect(reloaded.n).eq(now.n);
        expect(reloaded.generatedVariantInfo).eqls(now.generatedVariantInfo);
    });

    it("a problem's variantControl after a selection whose variants can't be counted", async () => {
        // The selection's `to` is a reference, so the document's unique
        // variants can't be counted, and the count stopped before the
        // problem.
        const { variants, errors } = await load(
            `
<number name="k">5</number>
<selectFromSequence name="m" from="1" to="$k" />
<problem name="p">
    <variantControl numVariants="3" variantsToInclude="b q" />
    <selectFromSequence name="n" from="1" to="3" />
</problem>
`,
            { componentName: "p" },
        );
        expect(variants).eqls(["b"]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0079");
    });

    it("a problem's variants are unique in a document with too many variants to be unique", async () => {
        // The document's variants are counted, but there are too many of
        // them for unique variants, so the problem isn't handed its
        // subvariants with its variant.
        const nByVariant: Record<string, Set<number>> = {};
        for (let ind = 1; ind <= 8; ind++) {
            const {
                variants,
                variantName,
                stateVariables,
                resolvePathToNodeIdx,
            } = await load(
                `
<selectFromSequence length="100000" />
<selectFromSequence length="100000" />
<problem name="p">
    <variantControl numVariants="3" />
    <selectFromSequence name="n" from="1" to="3" />
    <number name="nn">$n</number>
</problem>
`,
                { componentName: "p", requestedVariantIndex: ind },
            );
            expect(variants).eqls(["a", "b", "c"]);
            const n =
                stateVariables[await resolvePathToNodeIdx("nn")].stateValues
                    .value;
            (nByVariant[variantName] ??= new Set()).add(n);
        }
        const ns = Object.values(nByVariant).map((s) => [...s]);
        expect(ns.length).greaterThan(1);
        expect(ns.every((s) => s.length === 1)).eq(true);
        expect(new Set(ns.flat()).size).eq(ns.length);
    });

    it("a problem's error is reported once in a document with unique variants", async () => {
        const { variants, errors } = await load(
            `
<p>Hello!</p>
<problem name="p">
    <variantControl numVariants="3" variantsToInclude="b q" />
    <selectFromSequence name="n" from="1" to="3" />
</problem>
`,
            { componentName: "p" },
        );
        expect(variants).eqls(["b"]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0079");
    });
});
