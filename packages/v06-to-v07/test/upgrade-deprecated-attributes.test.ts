import { describe, expect, it } from "vitest";
import { updateSyntaxFromV06toV07 } from "../src/index";

async function convert(source: string) {
    const { xml, vfile } = await updateSyntaxFromV06toV07(source, {
        doNotUpgradeCopyTags: true,
    });
    return { xml, ruleIds: vfile.messages.map((m) => m.ruleId) };
}

describe("deprecated attribute upgrades", () => {
    it("renames response and function-symbol reference lists", async () => {
        // v0.6 renamed `targets*` to `sources*`; v0.7 renamed them to `references*` and
        // expects actual references, so each token needs a `$`.
        expect(
            (
                await convert(
                    `<award sourcesAreResponses="ans1 ans2"><when>$ans1 = 1</when></award>`,
                )
            ).xml,
        ).toEqual(
            `<award referencesAreResponses="$ans1 $ans2"><when>$ans1 = 1</when></award>`,
        );

        expect(
            (await convert(`<award targetsAreResponses="ans1" />`)).xml,
        ).toEqual(`<award referencesAreResponses="$ans1" />`);

        expect(
            (await convert(`<math sourcesAreFunctionSymbols="f">$f(x)</math>`))
                .xml,
        ).toEqual(`<math referencesAreFunctionSymbols="$f">$f(x)</math>`);
    });

    it("does not add a second dollar sign to a token that has one", async () => {
        expect(
            (await convert(`<award sourcesAreResponses="$ans1 ans2" />`)).xml,
        ).toEqual(`<award referencesAreResponses="$ans1 $ans2" />`);
    });

    it("renames tname to source on copying components and target elsewhere", async () => {
        expect((await convert(`<copy prop="x" tname="p" />`)).xml).toEqual(
            `<copy prop="x" source="p" />`,
        );
        expect(
            (await convert(`<updateValue tName="x" newValue="1" />`)).xml,
        ).toEqual(`<updateValue target="$x" newValue="1" />`);
    });

    it("merges an updateValue prop into its target path", async () => {
        expect(
            (
                await convert(
                    `<updateValue target="x" prop="value" newValue="1" />`,
                )
            ).xml,
        ).toEqual(`<updateValue target="$x.value" newValue="1" />`);
    });

    it("merges a prop into a target that is itself produced by a rename", async () => {
        // `tName` only becomes `target` during this same pass, so the merge has to happen
        // after it however the two attributes were ordered in the source.
        for (const source of [
            `<updateValue tName="x" prop="value" newValue="1" />`,
            `<updateValue prop="value" tName="x" newValue="1" />`,
        ]) {
            expect((await convert(source)).xml).toEqual(
                `<updateValue target="$x.value" newValue="1" />`,
            );
        }
    });

    it("turns graph label attributes into child elements, in attribute order", async () => {
        expect(
            (
                await convert(
                    `<graph xlabel="time" ylabel="pop"><point>(1,2)</point></graph>`,
                )
            ).xml,
        ).toEqual(
            `<graph><xLabel>time</xLabel><yLabel>pop</yLabel><point>(1,2)</point></graph>`,
        );
    });

    it("renames the remaining odds and ends", async () => {
        expect((await convert(`<variantControl nVariants="5" />`)).xml).toEqual(
            `<variantControl numVariants="5" />`,
        );
        expect(
            (await convert(`<option selectForVariantNames="a" />`)).xml,
        ).toEqual(`<option selectForVariants="a" />`);
        expect(
            (await convert(`<updateValue triggerWithTargets="b1 b2" />`)).xml,
        ).toEqual(`<updateValue triggerWith="$b1 $b2" />`);
    });

    it("removes attributes with no v0.7 equivalent and says so", async () => {
        let result = await convert(`<ref page="3" target="sec">go</ref>`);
        expect(result.xml).toEqual(`<ref to="$sec">go</ref>`);
        expect(result.ruleIds).toEqual(["deprecated/ref-page"]);

        result = await convert(
            `<conditionalContent maximumNumberToShow="1"><case condition="$c">x</case></conditionalContent>`,
        );
        expect(result.xml).toEqual(
            `<conditionalContent><case condition="$c">x</case></conditionalContent>`,
        );
        expect(result.ruleIds).toEqual(["deprecated/maximumnumbertoshow"]);
    });

    it("only removes `link` when it is not doing any work", async () => {
        // `link` alongside `copySource` decides between `extend` and `copy`...
        expect(
            (await convert(`<point copySource="P" link="false" />`)).xml,
        ).toEqual(`<point copy="$P" />`);
        // ...but on its own it means nothing in v0.7.
        const result = await convert(`<point link="false" x="1" />`);
        expect(result.xml).toEqual(`<point x="1" />`);
        expect(result.ruleIds).toEqual(["deprecated/link"]);
    });

    it("keeps GeoGebra embeds untouched but flags them", async () => {
        const source = `<embed width="100" encodedGeogebraContent="UEsD" />`;
        const result = await convert(source);
        expect(result.xml).toEqual(source);
        expect(result.ruleIds).toEqual(["no-v07-equivalent/embed-geogebra"]);
    });

    it("is idempotent: converting already-converted output changes nothing", async () => {
        for (const source of [
            `<award sourcesAreResponses="ans1 ans2" />`,
            `<updateValue target="x" prop="value" newValue="1" />`,
            `<graph xlabel="time"><point>(1,2)</point></graph>`,
            `<variantControl nVariants="5" />`,
        ]) {
            const once = (await convert(source)).xml;
            const twice = (await convert(once)).xml;
            expect(twice).toEqual(once);
        }
    });
});

describe("external content references", () => {
    it("turns a parameterized <copy uri> into a <module copy>", async () => {
        const result = await convert(
            `<copy uri="doenet:cid=bafkreiabc" vmin="-1" var="u" assignNames="a" />`,
        );
        expect(result.xml).toEqual(
            `<module copy="doenet:cid=bafkreiabc" vmin="-1" var="u" name="a" />`,
        );
        expect(result.ruleIds).toEqual(["external-copy/needs-new-content-id"]);
    });

    it("leaves a <copy uri> that passes no attributes for a human", async () => {
        // Nothing in the document says what component type the target is, so only the
        // `assignNames` (which becomes `name` whatever the type turns out to be) changes.
        const source = `<copy uri="doenet:doenetId=_abc&amp;cid=bafkreiabc" assignNames="a" />`;
        const result = await convert(source);
        expect(result.xml).toEqual(
            `<copy uri="doenet:doenetId=_abc&amp;cid=bafkreiabc" name="a" />`,
        );
        expect(result.ruleIds).toEqual([
            "external-copy/unknown-component-type",
        ]);
    });

    it("points an external copy's assigned name at the name it kept", async () => {
        // Deleting `assignNames` here used to leave `$a` referring to nothing.
        const result = await convert(
            `<copy uri="doenet:cid=abc" name="c" vmin="1" assignNames="a" /> $a`,
        );
        expect(result.xml).toEqual(
            `<module copy="doenet:cid=abc" name="c" vmin="1" /> $c`,
        );
        expect(result.ruleIds).toEqual(["external-copy/needs-new-content-id"]);
    });

    it("reports assigned names on an external copy that cannot be mapped", async () => {
        // More than one name addressed the replacements of a document this converter
        // cannot read, so there is nothing to say which index each one became. Writing
        // them into a single `name` produced an invalid one.
        const result = await convert(
            `<copy uri="doenet:cid=abc" vmin="1" assignNames="a b" /> $a $b`,
        );
        expect(result.xml).toEqual(
            `<module copy="doenet:cid=abc" vmin="1" /> $a $b`,
        );
        expect(result.ruleIds).toEqual([
            "copy/unmapped-assign-names",
            "external-copy/needs-new-content-id",
        ]);
    });

    it("flags a <ref> that points at a v0.6 activity", async () => {
        const result = await convert(
            `<ref uri="doenet:activityId=7LcTY65nnUMEoyV5Usapwz">link</ref>`,
        );
        expect(result.xml).toEqual(
            `<ref to="doenet:activityId=7LcTY65nnUMEoyV5Usapwz">link</ref>`,
        );
        expect(result.ruleIds).toEqual(["external-ref/needs-new-content-id"]);
    });

    it("leaves an ordinary <ref> alone", async () => {
        const result = await convert(`<ref to="https://doenet.org">link</ref>`);
        expect(result.xml).toEqual(`<ref to="https://doenet.org">link</ref>`);
        expect(result.ruleIds).toEqual([]);
    });
});

describe("copy naming", () => {
    it("reports a local copy whose assigned names cannot be mapped", async () => {
        // How many replacements a `<copy>` has depends on what it copied, so several
        // names cannot be turned into indices. Writing them all into one `name` produced
        // an invalid one.
        const result = await convert(
            `<math name="m">5</math><copy source="m" assignNames="a b" /> $a $b`,
        );
        expect(result.xml).toEqual(
            `<math name="m">5</math><copy source="m" /> $a $b`,
        );
        expect(result.ruleIds).toEqual(["copy/unmapped-assign-names"]);
    });

    it("does not let two copies take the same assigned name", async () => {
        const result = await convert(
            `<copy uri="doenet:cid=x" vmin="1" assignNames="a" /><copy uri="doenet:cid=y" vmin="2" assignNames="a" /> $a`,
        );
        // The first keeps the name and the references; the second is given its own.
        expect(result.xml).toEqual(
            `<module copy="doenet:cid=x" vmin="1" name="a" /><module copy="doenet:cid=y" vmin="2" name="copy" /> $a`,
        );
        // Both are at the same level, so this is a genuine clash rather than two
        // namespaces that happened to use the same name.
        expect(result.ruleIds).toContain("assign-names/duplicate-name");
    });

    it("does not let a copy take a name another component already has", async () => {
        // v0.6 namespaces allowed the same assigned name to appear more than once, so a
        // collision here says nothing about which one `$a` meant. The reference is left
        // where it was rather than redirected at the copy.
        const result = await convert(
            `<point name="a">(1,2)</point><copy uri="doenet:cid=x" vmin="1" assignNames="a" /> $a`,
        );
        expect(result.xml).toEqual(
            `<point name="a">(1,2)</point><module copy="doenet:cid=x" vmin="1" name="copy" /> $a`,
        );
        expect(result.ruleIds).toContain("copy/name-already-taken");
    });
});
