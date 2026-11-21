import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { createComponentInfoObjects } from "../../utils/componentInfoObjects";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Compound attribute and property names are camelCase (D60, #2627 item 1).
 * The names some components declared in all lowercase (`halign`,
 * `xintercept`, `circumradius`, `xoffset`, …) are renamed (`hAlign`,
 * `xIntercept`, `circumRadius`, `xOffset`, …). Since names are matched
 * exactly (NAME-0, D51):
 *
 * - an old attribute spelling differs from the new one only in case, so for
 *   one release it is applied with `doenet-w0197`, as any attribute in
 *   another case is;
 * - an old property spelling names nothing (`doenet-w0104`), with the new
 *   one suggested.
 */
async function load(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    async function text(name: string) {
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues
            .text;
    }
    const { errors, warnings } = getDiagnosticsByType(core);
    return { text, errors, warnings };
}

/**
 * For each renamed attribute: a document setting it under its new name and
 * reading it back in `<p name="p">`, the text that shows, and the component
 * it is written on. The same document with the old spelling is applied the
 * same, with `doenet-w0197`.
 */
const RENAMED_ATTRIBUTES: {
    newName: string;
    oldName: string;
    componentType: string;
    doenetML: string;
    text: string;
}[] = [
    {
        newName: "circumRadius",
        oldName: "circumradius",
        componentType: "regularPolygon",
        doenetML: `<graph><regularPolygon name="rp" numVertices="4" circumRadius="3"/></graph><p name="p">$rp.circumRadius</p>`,
        text: "3",
    },
    {
        newName: "inRadius",
        oldName: "inradius",
        componentType: "regularPolygon",
        doenetML: `<graph><regularPolygon name="rp" numVertices="4" inRadius="3"/></graph><p name="p">$rp.inRadius</p>`,
        text: "3",
    },
    {
        newName: "hAlign",
        oldName: "halign",
        componentType: "cell",
        doenetML: `<tabular><row><cell name="c" hAlign="center">a</cell></row></tabular><p name="p">$c.hAlign</p>`,
        text: "center",
    },
    {
        newName: "hAlign",
        oldName: "halign",
        componentType: "tabular",
        doenetML: `<tabular name="t" hAlign="end"><row><cell>a</cell></row></tabular><p name="p">$t.hAlign</p>`,
        text: "end",
    },
    {
        newName: "vAlign",
        oldName: "valign",
        componentType: "row",
        doenetML: `<tabular><row name="r" vAlign="top"><cell>a</cell></row></tabular><p name="p">$r.vAlign</p>`,
        text: "top",
    },
    {
        newName: "vAligns",
        oldName: "valigns",
        componentType: "sideBySide",
        doenetML: `<sideBySide name="s" vAligns="top bottom"><p>a</p><p>b</p></sideBySide><p name="p">$s.vAligns</p>`,
        text: "top, bottom",
    },
    {
        newName: "xOffset",
        oldName: "xoffset",
        componentType: "pegboard",
        doenetML: `<graph><pegboard name="pb" xOffset="0.5"/></graph><p name="p">$pb.xOffset</p>`,
        text: "0.5",
    },
    {
        newName: "zOffset",
        oldName: "zoffset",
        componentType: "constrainToGrid",
        doenetML: `<graph><point><constrainToGrid name="c" zOffset="0.5"/></point></graph><p name="p">$c.zOffset</p>`,
        text: "0.5",
    },
    {
        newName: "xThreshold",
        oldName: "xthreshold",
        componentType: "attractToGrid",
        doenetML: `<graph><point><attractToGrid name="a" xThreshold="0.1"/></point></graph><p name="p">$a.xThreshold</p>`,
        text: "0.1",
    },
    {
        newName: "xScale",
        oldName: "xscale",
        componentType: "function",
        doenetML: `<function name="f" xScale="4">x^2</function><p name="p">$f.xScale</p>`,
        text: "4",
    },
    {
        // an attribute the schema hides, renamed by the core's backstop
        newName: "xLabel",
        oldName: "xlabel",
        componentType: "subsetOfRealsInput",
        doenetML: `<subsetOfRealsInput name="s" xLabel="t"/><p name="p">$s.xLabel</p>`,
        text: "t",
    },
];

/**
 * For each renamed property, a document and the reference to it: written
 * with the new name it shows `text`; with the old, it names nothing.
 */
const RENAMED_PROPERTIES: {
    setup: string;
    newReference: string;
    oldReference: string;
    text: string;
    /**
     * `false` where no spelling is suggested yet: an array entry in another
     * case (#2627 item 4, PR 42 of #2509).
     */
    suggested?: false;
}[] = [
    {
        setup: `<line name="l" through="(0,1) (1,0)"/>`,
        newReference: "$l.xIntercept",
        oldReference: "$l.xintercept",
        text: "1",
    },
    {
        setup: `<line name="l" through="(0,1) (1,0)"/>`,
        newReference: "$l.yIntercept",
        oldReference: "$l.yintercept",
        text: "1",
    },
    {
        setup: `<line name="l">y = 2x + 1</line>`,
        newReference: "$l.coeffVar1",
        oldReference: "$l.coeffvar1",
        text: "-2",
    },
    {
        setup: `<line name="l">y = 2x + 1</line>`,
        newReference: "$l.coeffVar2",
        oldReference: "$l.coeffvar2",
        text: "1",
    },
    {
        setup: `<odeSystem name="o"><rightHandSide>x</rightHandSide></odeSystem>`,
        newReference: "$o.rightHandSide",
        oldReference: "$o.righthandside",
        text: "x",
    },
    {
        setup: `<odeSystem name="o"><rightHandSide>x</rightHandSide></odeSystem>`,
        newReference: "$o.rightHandSides",
        oldReference: "$o.righthandsides",
        text: "x",
    },
    {
        // an array entry
        setup: `<odeSystem name="o"><rightHandSide>x</rightHandSide></odeSystem>`,
        newReference: "$o.rightHandSide1",
        oldReference: "$o.righthandside1",
        text: "x",
        suggested: false,
    },
    {
        setup: `<graph><regularPolygon name="rp" numVertices="4" circumRadius="3"/></graph>`,
        newReference: "$rp.circumRadius",
        oldReference: "$rp.circumradius",
        text: "3",
    },
    {
        setup: `<tabular><row><cell name="c" hAlign="center">a</cell></row></tabular>`,
        newReference: "$c.hAlign",
        oldReference: "$c.halign",
        text: "center",
    },
    {
        setup: `<function name="f" yScale="4">x^2</function>`,
        newReference: "$f.yScale",
        oldReference: "$f.yscale",
        text: "4",
    },
    {
        setup: `<graph><point><attractToGrid name="a" yOffset="0.5"/></point></graph>`,
        newReference: "$a.yOffset",
        oldReference: "$a.yoffset",
        text: "0.5",
    },
];

describe("Compound names are camelCase (D60) @group4", async () => {
    it("a renamed attribute works under its new name", async () => {
        for (const c of RENAMED_ATTRIBUTES) {
            const { text, errors, warnings } = await load(c.doenetML);
            expect(errors, c.doenetML).toHaveLength(0);
            expect(warnings, c.doenetML).toHaveLength(0);
            expect(await text("p"), c.doenetML).eq(c.text);
        }
    });

    it("a renamed attribute's old spelling is applied, with a warning, for now", async () => {
        for (const c of RENAMED_ATTRIBUTES) {
            const doenetML = c.doenetML.replace(
                ` ${c.newName}="`,
                ` ${c.oldName}="`,
            );
            expect(doenetML, c.doenetML).not.eq(c.doenetML);
            const { text, errors, warnings } = await load(doenetML);
            expect(errors, doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                doenetML,
            ).toEqual(["doenet-w0197"]);
            expect(warnings[0].message, doenetML).eq(
                `Attribute names are case-sensitive: write \`${c.newName}\`, not \`${c.oldName}\`, on a \`<${c.componentType}>\`. It is applied for now, but will be an error in a later release.`,
            );
            expect(await text("p"), doenetML).eq(c.text);
        }
    });

    it("a renamed property works under its new name", async () => {
        for (const c of RENAMED_PROPERTIES) {
            const doenetML = `${c.setup}<p name="p">${c.newReference}</p>`;
            const { text, errors, warnings } = await load(doenetML);
            expect(errors, doenetML).toHaveLength(0);
            expect(warnings, doenetML).toHaveLength(0);
            expect(await text("p"), doenetML).eq(c.text);
        }
    });

    it("a renamed property's old spelling names nothing, with the new one suggested", async () => {
        for (const c of RENAMED_PROPERTIES) {
            const doenetML = `${c.setup}<p name="p">${c.oldReference}</p>`;
            const { text, errors, warnings } = await load(doenetML);
            expect(errors, doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                doenetML,
            ).toEqual(["doenet-w0104"]);
            expect(warnings[0].message, doenetML).toContain(
                `No referent found for reference: \`${c.oldReference}\``,
            );
            if (c.suggested === false) {
                expect(warnings[0].message, doenetML).not.toContain(
                    "Did you mean",
                );
            } else {
                expect(warnings[0].message, doenetML).toContain(
                    `Did you mean \`${c.newReference}\`?`,
                );
            }
            expect(await text("p"), doenetML).eq("＿");
        }
    });

    /**
     * Every attribute, public property, array entry prefix and alias written
     * in all lowercase, of every component, the schema's hidden ones
     * included. Each is a single word, a word and a number (`coeff0`), a
     * symbol or its plural (`dx`, `xs`), an abbreviation (`rhs`, `stdev`), a
     * name (`geogebra`, `youtube`), or a PreTeXt attribute kept in PreTeXt's
     * spelling (`permid`, `sortby`).
     *
     * A compound name is camelCase (D60), so a new all-lowercase name fails
     * this test: write it in camelCase, or, if it is one word, add it here.
     */
    const LOWERCASE_NAMES = [
        "a",
        "anchor",
        "angle",
        "apothem",
        "area",
        "assumptions",
        "awarded",
        "b",
        "bins",
        "boxed",
        "buffer",
        "c",
        "caption",
        "categories",
        "category",
        "cell",
        "cells",
        "center",
        "character",
        "characters",
        "charge",
        "circular",
        "circumference",
        "closed",
        "code",
        "coeff0",
        "collapsible",
        "cols",
        "column",
        "columns",
        "condition",
        "coords",
        "coprime",
        "copy",
        "count",
        "credit",
        "data",
        "datum",
        "decorative",
        "degrees",
        "denominator",
        "density",
        "description",
        "diameter",
        "direction",
        "disabled",
        "displacement",
        "domain",
        "draggable",
        "duration",
        "dx",
        "dy",
        "dz",
        "eigenvalue",
        "eigenvalues",
        "eigenvector",
        "eigenvectors",
        "electronegativity",
        "endpoint",
        "endpoints",
        "equation",
        "exclude",
        "expand",
        "expanded",
        "extend",
        "extrema",
        "extremum",
        "f",
        "feedback",
        "feedbacks",
        "filled",
        "fixed",
        "focused",
        "for",
        "format",
        "formula",
        "from",
        "fs",
        "function",
        "geogebra",
        "grid",
        "group",
        "head",
        "header",
        "height",
        "hidden",
        "hide",
        "horizontal",
        "inline",
        "input",
        "interval",
        "intervals",
        "item",
        "items",
        "iterate",
        "iterates",
        "label",
        "labels",
        "lang",
        "latex",
        "layer",
        "layout",
        "legend",
        "length",
        "level",
        "limits",
        "list",
        "locale",
        "location",
        "magnitude",
        "margin",
        "margins",
        "marker",
        "markers",
        "match",
        "math",
        "matrix",
        "maxima",
        "maximum",
        "mean",
        "means",
        "median",
        "message",
        "midpoint",
        "minima",
        "minimum",
        "mode",
        "name",
        "normalize",
        "number",
        "numbers",
        "numerator",
        "offsets",
        "open",
        "outlier",
        "outliers",
        "paginator",
        "palette",
        "parameters",
        "part",
        "pattern",
        "perimeter",
        "period",
        "periodic",
        "permid",
        "point",
        "points",
        "population",
        "position",
        "prefill",
        "probability",
        "quartile1",
        "quartile3",
        "radians",
        "radius",
        "range",
        "ref",
        "rendered",
        "renderer",
        "replacement",
        "rhs",
        "rhss",
        "rigid",
        "rotate",
        "row",
        "rows",
        "seeds",
        "selected",
        "side",
        "simplify",
        "size",
        "slope",
        "solution",
        "solutions",
        "sonify",
        "sort",
        "sortby",
        "source",
        "speech",
        "stable",
        "state",
        "stderr",
        "stdev",
        "step",
        "strict",
        "submitted",
        "sum",
        "switchable",
        "symbol",
        "symbolic",
        "symbolicf",
        "tail",
        "target",
        "text",
        "texts",
        "threshold",
        "through",
        "time",
        "title",
        "to",
        "tolerance",
        "type",
        "unordered",
        "url",
        "value",
        "values",
        "var",
        "variable",
        "variables",
        "variance",
        "variances",
        "vector",
        "vertex",
        "vertices",
        "video",
        "weight",
        "weights",
        "width",
        "widths",
        "word",
        "words",
        "x",
        "xmlns",
        "xs",
        "y",
        "youtube",
        "z",
    ];

    it("every all-lowercase name is one word, not a compound", async () => {
        const componentInfoObjects = createComponentInfoObjects();
        const found = new Set<string>();
        function add(name: string) {
            if (name === name.toLowerCase() && !name.startsWith("_")) {
                found.add(name);
            }
        }
        for (const componentType in componentInfoObjects.allComponentClasses) {
            const componentClass =
                componentInfoObjects.allComponentClasses[componentType];
            for (const name in componentClass.createAttributesObject()) {
                add(name);
            }
            const info: any =
                componentInfoObjects.publicStateVariableInfo[componentType];
            for (const name in info.stateVariableDescriptions) {
                add(name);
            }
            for (const name in info.arrayEntryPrefixes) {
                add(name);
            }
            for (const name in info.aliases) {
                add(name);
            }
        }
        expect([...found].sort()).toEqual([...LOWERCASE_NAMES].sort());
    });
});
