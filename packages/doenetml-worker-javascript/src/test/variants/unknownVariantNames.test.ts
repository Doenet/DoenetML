import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A name in `variantsToInclude` or `variantsToExclude` that is not a variant
 * is ignored, with an error at the attribute, and the other names are used,
 * so the document loads (DIAG-5, DIAG-7; Doenet/DoenetML#2536). When
 * `variantsToInclude` names no variant at all, every variant is included.
 */
async function load(doenetML: string, componentName = "_document1") {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const { errors } = getDiagnosticsByType(core);
    return {
        variants:
            stateVariables[await resolvePathToNodeIdx(componentName)]
                .sharedParameters.allPossibleVariants,
        errors,
    };
}

// enough unique variants that they don't limit the variants named
const select = `<selectFromSequence name="n" length="100000" />`;

describe("Unknown variant names @group1", async () => {
    it("variantsToInclude: an unknown name among names from variantNames", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="apple banana cherry" variantsToInclude="apple grape cherry" />
${select}
`);
        expect(variants).eqls(["apple", "cherry"]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0078");
        expect(errors[0].message).eq(
            "`variantsToInclude` names `grape`, which is not a variant of this document. Its 3 variants are named `apple`, `banana`, `cherry`. The name is ignored.",
        );
        // at the attribute
        expect(errors[0].position?.start.line).eq(2);
        expect(errors[0].position?.start.column).eq(68);
    });

    it("variantsToInclude: an unknown name among letter names", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="a d c" />
${select}
`);
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0078");
        expect(errors[0].message).eq(
            "`variantsToInclude` names `d`, which is not a variant of this document. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
    });

    it("variantsToInclude: several unknown names, named in one error", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="apple banana cherry" variantsToInclude="grape banana kiwi" />
${select}
`);
        expect(variants).eqls(["banana"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `grape` and `kiwi`, which are not variants of this document. Its 3 variants are named `apple`, `banana`, `cherry`. The names are ignored.",
        );
    });

    it("variantsToInclude: only an unknown name, from variantNames, includes every variant", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="apple banana cherry" variantsToInclude="grape" />
${select}
`);
        expect(variants).eqls(["apple", "banana", "cherry"]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0078");
        expect(errors[0].message).eq(
            "`variantsToInclude` names `grape`, which is not a variant of this document. Its 3 variants are named `apple`, `banana`, `cherry`. As `variantsToInclude` names no variant, every variant is included.",
        );
    });

    it("variantsToInclude: only an unknown name, among letter names, includes every variant", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="d" />
${select}
`);
        expect(variants).eqls(["a", "b", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `d`, which is not a variant of this document. Its 3 variants are named `a`, `b`, `c`. As `variantsToInclude` names no variant, every variant is included.",
        );
    });

    it("variantsToInclude: a name with a space, from a list separated by commas", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="a b,c" />
${select}
`);
        expect(variants).eqls(["c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `a b`, which is not a variant of this document. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
    });

    it("variantsToExclude: an unknown name among names from variantNames", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="apple banana cherry" variantsToExclude="banana grape" />
${select}
`);
        expect(variants).eqls(["apple", "cherry"]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0078");
        expect(errors[0].message).eq(
            "`variantsToExclude` names `grape`, which is not a variant of this document. Its 3 variants are named `apple`, `banana`, `cherry`. The name is ignored.",
        );
        expect(errors[0].position?.start.line).eq(2);
        expect(errors[0].position?.start.column).eq(68);
    });

    it("variantsToExclude: an unknown name among letter names", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToExclude="b d" />
${select}
`);
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToExclude` names `d`, which is not a variant of this document. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
    });

    it("variantsToExclude: only an unknown name, from variantNames, excludes nothing", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="apple banana cherry" variantsToExclude="grape" />
${select}
`);
        expect(variants).eqls(["apple", "banana", "cherry"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToExclude` names `grape`, which is not a variant of this document. Its 3 variants are named `apple`, `banana`, `cherry`. The name is ignored.",
        );
    });

    it("variantsToExclude: only an unknown name, among letter names, excludes nothing", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToExclude="d" />
${select}
`);
        expect(variants).eqls(["a", "b", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToExclude` names `d`, which is not a variant of this document. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
    });

    it("both attributes with unknown names give an error each", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="4" variantsToInclude="a b c x" variantsToExclude="b y" />
${select}
`);
        expect(variants).eqls(["a", "c"]);
        expect(errors.map((e) => e.code)).eqls([
            "doenet-e0078",
            "doenet-e0078",
        ]);
        expect(errors.map((e) => e.args?.attribute)).eqls([
            "variantsToInclude",
            "variantsToExclude",
        ]);
    });

    it("a name that differs only by case is the variant", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantNames="Apple banana cherry" variantsToInclude="APPLE Cherry" variantsToExclude="BANANA" />
${select}
`);
        expect(variants).eqls(["apple", "cherry"]);
        expect(errors.length).eq(0);
    });

    it("space around a name is not part of it", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude=" a ,  c " variantsToExclude="  b  " />
${select}
`);
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(0);
    });

    it("an unknown name keeps the case it was written in, and variant names theirs", async () => {
        const { errors } = await load(`
<variantControl numVariants="2" variantNames="Apple Banana" variantsToInclude="Grape apple" />
${select}
`);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `Grape`, which is not a variant of this document. Its 2 variants are named `Apple`, `Banana`. The name is ignored.",
        );
    });

    it("an unknown name written more than once, in any case, is named once", async () => {
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="a Grape grape GRAPE c a" />
${select}
`);
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `Grape`, which is not a variant of this document. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
    });

    it("without numVariants, the hundred letter names are listed by their first and last", async () => {
        const { variants, errors } = await load(`
<variantControl variantsToInclude="b zzz" />
${select}
`);
        expect(variants).eqls(["b"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `zzz`, which is not a variant of this document. Its 100 variants are named `a`, `b`, `c`, `d`, `e`, `f`, …, `cv`. The name is ignored.",
        );
    });

    it("one variant, and the list of nine shortened to its first six and last", async () => {
        let { variants, errors } = await load(`
<variantControl numVariants="1" variantsToInclude="z" />
${select}
`);
        expect(variants).eqls(["a"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `z`, which is not a variant of this document. Its one variant is named `a`. As `variantsToInclude` names no variant, every variant is included.",
        );

        ({ variants, errors } = await load(`
<variantControl numVariants="9" variantsToExclude="z" />
${select}
`));
        expect(variants.length).eq(9);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToExclude` names `z`, which is not a variant of this document. Its 9 variants are named `a`, `b`, `c`, `d`, `e`, `f`, …, `i`. The name is ignored.",
        );
    });

    it("a name past the unique variants is not a variant", async () => {
        // two unique variants, though three are named
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToInclude="c" />
<selectFromSequence name="n" from="1" to="2" />
`);
        expect(variants).eqls(["a", "b"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `c`, which is not a variant of this document. Its 2 variants are named `a`, `b`. As `variantsToInclude` names no variant, every variant is included.",
        );
    });

    it("a name past the unique variants is not a variant in variantsToExclude", async () => {
        // two unique variants, though three are named; excluding `c` did
        // nothing, silently, before
        const { variants, errors } = await load(`
<variantControl numVariants="3" variantsToExclude="c" />
<selectFromSequence name="n" from="1" to="2" />
`);
        expect(variants).eqls(["a", "b"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToExclude` names `c`, which is not a variant of this document. Its 2 variants are named `a`, `b`. The name is ignored.",
        );
    });

    it("in a problem that is the only child", async () => {
        const doenetML = (attributes: string) => `
<problem name="problem1">
    <variantControl numVariants="3" ${attributes} />
    ${select}
</problem>
`;
        let { variants, errors } = await load(
            doenetML(`variantsToInclude="a d c"`),
            "problem1",
        );
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `d`, which is not a variant of this `<problem>`. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
        expect(errors[0].position?.start.line).eq(3);

        ({ variants, errors } = await load(
            doenetML(`variantsToInclude="d"`),
            "problem1",
        ));
        expect(variants).eqls(["a", "b", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].args?.outcome).eq("allVariants");

        ({ variants, errors } = await load(
            doenetML(`variantsToExclude="b d"`),
            "problem1",
        ));
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].args?.attribute).eq("variantsToExclude");
    });

    it("in a problem beside other content", async () => {
        const { variants, errors } = await load(
            `
<p>Hello!</p>
<problem name="problem1">
    <variantControl numVariants="3" variantNames="x y z" variantsToInclude="x w" />
    ${select}
</problem>
`,
            "problem1",
        );
        expect(variants).eqls(["x"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToInclude` names `w`, which is not a variant of this `<problem>`. Its 3 variants are named `x`, `y`, `z`. The name is ignored.",
        );
        expect(errors[0].position?.start.line).eq(4);
    });

    it("in a section beside other content", async () => {
        const { variants, errors } = await load(
            `
<p>Hello!</p>
<section name="section1">
    <variantControl numVariants="3" variantsToExclude="b q" />
    ${select}
</section>
`,
            "section1",
        );
        expect(variants).eqls(["a", "c"]);
        expect(errors.length).eq(1);
        expect(errors[0].message).eq(
            "`variantsToExclude` names `q`, which is not a variant of this `<section>`. Its 3 variants are named `a`, `b`, `c`. The name is ignored.",
        );
        expect(errors[0].position?.start.line).eq(4);
    });
});
