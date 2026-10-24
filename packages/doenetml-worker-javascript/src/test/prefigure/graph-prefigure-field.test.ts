import { describe, expect, it } from "vitest";
import { getPrefigureXML, getWarnings } from "./graph-prefigure.helpers";
import {
    prefigureGraph,
    withStyleDefinitions,
} from "./graph-prefigure.fixtures";

/** The value of `attribute` on the first `element` in `xml`. */
function attributeOf(xml: string, element: string, attribute: string) {
    const tag = xml.match(new RegExp(`<${element} [^>]*>`))?.[0];
    expect(tag, `a <${element}> element`).toBeDefined();
    return tag!.match(new RegExp(` ${attribute}="([^"]*)"`))?.[1];
}

async function warningCodes(doenetML: string) {
    const diagnostics = await getWarnings(doenetML);
    return diagnostics.warnings.map((w) => w.code);
}

/** Pixels per graph unit on the default 425-pixel, 20-unit-wide graph. */
const UNIT = 425 / 20;

describe("Graph prefigure renderer slope and vector fields @group4", () => {
    it("draws a slopeField as a PreFigure slope-field with its function defined", async () => {
        const doenetML = prefigureGraph("<slopeField>y - x</slopeField>");
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(prefigureXML).toContain(
            "<definition>slopefield_0_f_formula(x,y)=y - x</definition>",
        );
        expect(prefigureXML).toContain(
            '<slope-field at="slopefield_0" function="slopefield_0_f" spacings="((-10.0,1.0,10.5),(-10.0,1.0,10.5))"',
        );
        expect(attributeOf(prefigureXML, "slope-field", "stroke")).toBeTruthy();
        expect(
            attributeOf(prefigureXML, "slope-field", "thickness"),
        ).toBeTruthy();
        // PreFigure copies only stroke and thickness onto the marks.
        expect(
            attributeOf(prefigureXML, "slope-field", "fill"),
        ).toBeUndefined();
        expect(
            attributeOf(prefigureXML, "slope-field", "stroke-opacity"),
        ).toBeUndefined();

        expect(await warningCodes(doenetML)).toEqual([]);
    });

    it("defines a one-input function of both inputs", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("<slopeField><function>x^2</function></slopeField>"),
        );

        expect(prefigureXML).toContain(
            "<definition>slopefield_0_f_formula(x,y)=x^2</definition>",
        );
    });

    it("renames the function's variables to x and y, all at once", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <slopeField><function variables="s t">t - s</function></slopeField>
  <slopeField><function variables="y x">x - 2y</function></slopeField>`),
        );

        expect(prefigureXML).toContain(
            "<definition>slopefield_0_f_formula(x,y)=y - x</definition>",
        );
        expect(prefigureXML).toContain(
            "<definition>slopefield_1_f_formula(x,y)=y - 2*x</definition>",
        );
    });

    it("places the lattice by dx, dy, xoffset and yoffset", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <slopeField dx="2" dy="0.5" xoffset="1" yoffset="0.25">y</slopeField>
  <slopeField dx="-2" dy="-0.5" xoffset="1" yoffset="0.25">y</slopeField>`),
        );

        const spacings = [...prefigureXML.matchAll(/spacings="([^"]*)"/g)].map(
            (m) => m[1],
        );
        expect(spacings).toEqual([
            "((-9.0,2.0,10.0),(-9.75,0.5,10.0))",
            // A negative spacing is the same lattice.
            "((-9.0,2.0,10.0),(-9.75,0.5,10.0))",
        ]);
    });

    it("coarsens the lattice to maxMarks as the JSXGraph renderer does", async () => {
        // 21 x 21 lines is 441 marks; a stride of 3 keeps lines -9, -6, ...,
        // 9, or 7 x 7 = 49, where a stride of 2 would keep 121.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<slopeField maxMarks="100">y</slopeField>'),
        );

        expect(attributeOf(prefigureXML, "slope-field", "spacings")).toBe(
            "((-9.0,3.0,10.5),(-9.0,3.0,10.5))",
        );
    });

    it("keeps only the lattice points inside the function's domain", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <slopeField><function variables="x y" domain="[0,5) (-2,2]">x y</function></slopeField>
  <slopeField><function domain="[1.5, 3]">x</function></slopeField>`),
        );

        const spacings = [...prefigureXML.matchAll(/spacings="([^"]*)"/g)].map(
            (m) => m[1],
        );
        expect(spacings).toEqual([
            "((0.0,1.0,4.5),(-1.0,1.0,2.5))",
            // A one-input function's domain restricts only x.
            "((2.0,1.0,3.5),(-10.0,1.0,10.5))",
        ]);
    });

    it("draws an empty group, silently, when there is nothing to draw", async () => {
        const doenetML = prefigureGraph(`
  <slopeField />
  <slopeField><function domain="[20,30]">x</function></slopeField>
  <vectorField>(0, 0)</vectorField>
  <slopeField dx="1e-20">y</slopeField>
  <slopeField>ln(-1 - x^2)</slopeField>
  <vectorField>(sqrt(-1 - x^2), 1)</vectorField>
  <slopeField dx="1e-12" dy="25" yoffset="12.5">y</slopeField>`);
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(prefigureXML).toContain('<group at="slopefield_0" />');
        expect(prefigureXML).toContain('<group at="slopefield_1" />');
        expect(prefigureXML).toContain('<group at="vectorfield_2" />');
        // A lattice too fine to walk, rather than a hang.
        expect(prefigureXML).toContain('<group at="slopefield_3" />');
        // Undefined everywhere, so no warning that PreFigure may lose marks.
        expect(prefigureXML).toContain('<group at="slopefield_4" />');
        expect(prefigureXML).toContain('<group at="vectorfield_5" />');
        // No row in view, beside 2e13 columns: no point, so no walk of them.
        expect(prefigureXML).toContain('<group at="slopefield_6" />');
        expect(prefigureXML).not.toContain("<slope-field");
        expect(prefigureXML).not.toContain("<vector-field");
        expect(await warningCodes(doenetML)).toEqual([]);
    });

    it("draws nothing for a formula with a symbol that is not a variable", async () => {
        // Undefined everywhere, so the JSXGraph renderer draws nothing; renaming
        // `t` to `x` must not make PreFigure draw the field of `x + x`.
        const doenetML = prefigureGraph(
            '<slopeField><function variables="t s">x + t</function></slopeField>',
        );
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(prefigureXML).toContain('<group at="slopefield_0" />');
        expect(prefigureXML).not.toContain("<slope-field");
    });

    it("draws nothing for a hidden field", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("<slopeField hide>y</slopeField>"),
        );

        expect(prefigureXML).not.toContain("slopefield_0");
    });

    it("warns that a slopeField's markLength is not honored", async () => {
        const doenetML = prefigureGraph(
            '<slopeField markLength="30">y</slopeField>',
        );

        expect(await getPrefigureXML(doenetML)).toContain("<slope-field");
        expect(await warningCodes(doenetML)).toEqual(["doenet-w0173"]);
    });

    it("warns that a dashed lineStyle is not honored", async () => {
        const doenetML = withStyleDefinitions(
            '    <styleDefinition styleNumber="1" lineStyle="dashed" />',
            prefigureGraph("<slopeField>y</slopeField>"),
        );
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(
            attributeOf(prefigureXML, "slope-field", "dash"),
        ).toBeUndefined();
        expect(await warningCodes(doenetML)).toEqual(["doenet-w0175"]);
    });

    it("skips, with a warning, a function not given by a formula", async () => {
        const doenetML = prefigureGraph(
            '<slopeField><function through="(0,0) (1,1) (2,0)" /></slopeField>',
        );
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(prefigureXML).not.toContain("<slope-field");
        expect(prefigureXML).not.toContain("<definition>");
        const diagnostics = await getWarnings(doenetML);
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0171",
        ]);
        expect(diagnostics.warnings[0].message).toContain("interpolated");
    });

    it("skips, with a warning, a piecewise function", async () => {
        const doenetML = prefigureGraph(`
  <slopeField>
    <piecewiseFunction>
      <function domain="(-inf, 0]">x</function>
      <function domain="(0, inf)">-x</function>
    </piecewiseFunction>
  </slopeField>`);
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(prefigureXML).not.toContain("<slope-field");
        const diagnostics = await getWarnings(doenetML);
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0171",
        ]);
        expect(diagnostics.warnings[0].message).toContain("piecewise");
    });

    it("warns when a function such as sqrt is undefined at a lattice point", async () => {
        const doenetML = prefigureGraph(`
  <slopeField>sqrt(y)</slopeField>
  <slopeField><function variables="x y" domain="(-inf, inf) [0, inf)">sqrt(y)</function></slopeField>
  <slopeField>y/x</slopeField>`);
        const diagnostics = await getWarnings(doenetML);

        // Only the first: the second is restricted to where it is defined, and
        // the third is undefined only by division, which loses PreFigure no
        // more than a mark.
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0172",
        ]);
        expect(diagnostics.warnings[0].message).toContain("(-10, -10)");
    });

    it("names the undefined lattice point without floating-point dust", async () => {
        // The first lattice point is -96 * 0.1, which is -9.600000000000001.
        const doenetML = prefigureGraph(
            '<slopeField dx="0.1" dy="0.1" maxMarks="100000">sqrt(y)</slopeField>',
            { attrs: 'xMin="-9.7" yMin="-9.7"' },
        );
        const diagnostics = await getWarnings(doenetML);

        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0172",
        ]);
        expect(diagnostics.warnings[0].message).toContain("(-9.6, -9.6)");
    });

    it("warns when a vectorField's function is undefined at a lattice point", async () => {
        const doenetML = prefigureGraph(`
  <vectorField>(1, sqrt(y))</vectorField>
  <vectorField><function variables="x y" domain="(-inf, inf) [0, inf)">(1, sqrt(y))</function></vectorField>`);
        const diagnostics = await getWarnings(doenetML);

        // Only the first: the second is restricted to where it is defined.
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0172",
        ]);
        expect(diagnostics.warnings[0].message).toContain("(-10, -10)");
        // Both are still drawn; the second only from y = 0 up.
        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML.match(/<vector-field /g)).toHaveLength(2);
        expect(prefigureXML).toContain(
            'spacings="((-10.0,1.0,10.5),(0.0,1.0,10.5))"',
        );
    });

    it("draws a vectorField with the longest arrow markLength pixels long", async () => {
        const doenetML = prefigureGraph(`
  <vectorField>(y, -x)</vectorField>
  <vectorField markLength="48">(y, -x)</vectorField>`);
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(prefigureXML).toContain(
            "<definition>vectorfield_0_f_formula(x,y)=(y,-x)</definition>",
        );
        expect(prefigureXML).toContain(
            '<vector-field at="vectorfield_0" function="vectorfield_0_f" spacings="((-10.0,1.0,10.5),(-10.0,1.0,10.5))"',
        );

        // The longest vector is at a corner, sqrt(200) graph units long.
        const scales = [...prefigureXML.matchAll(/ scale="([^"]*)"/g)].map(
            (m) => Number(m[1]),
        );
        expect(scales[0]).toBeCloseTo(24 / (Math.sqrt(200) * UNIT), 10);
        expect(scales[1]).toBeCloseTo(48 / (Math.sqrt(200) * UNIT), 10);
        expect(prefigureXML).not.toContain("exponent=");

        expect(await warningCodes(doenetML)).toEqual([]);
    });

    it("draws normalized arrows as unit vectors scaled to markLength", async () => {
        const doenetML = prefigureGraph(
            "<vectorField normalize>(y, -x)</vectorField>",
        );
        const prefigureXML = await getPrefigureXML(doenetML);

        expect(attributeOf(prefigureXML, "vector-field", "exponent")).toBe("0");
        expect(
            Number(attributeOf(prefigureXML, "vector-field", "scale")),
        ).toBeCloseTo(24 / UNIT, 10);
        expect(await warningCodes(doenetML)).toEqual([]);
    });

    it("sizes arrowheads for an arrow markLength long, on a whole-pixel line", async () => {
        // PreFigure's default head, about 4.5 line widths long, would be 18 of
        // the longest arrow's 24 pixels. The JSXGraph head along the shaft is
        // 0.3 * markLength * cos(0.44); PreFigure's reaches back
        // (arrow-width / 2) / tan(24 degrees) line widths. It is never given
        // an arrow-width under 2, or the head barely stands out from the line.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <vectorField>(y, -x)</vectorField>
  <vectorField markLength="40">(y, -x)</vectorField>
  <vectorField lineWidth="2" normalize>(y, -x)</vectorField>
  <vectorField lineWidth="2.5">(y, -x)</vectorField>
  <vectorField lineWidth="0">(y, -x)</vectorField>`),
        );

        const fields = [...prefigureXML.matchAll(/<vector-field [^>]*>/g)].map(
            (m) => m[0],
        );
        const attribute = (tag: string, name: string) =>
            tag.match(new RegExp(` ${name}="([^"]*)"`))?.[1];
        const expectedWidth = (markLength: number, thickness: number) =>
            Math.max(
                2,
                (2 *
                    Math.tan((24 * Math.PI) / 180) *
                    0.3 *
                    markLength *
                    Math.cos(0.44)) /
                    thickness,
            );

        expect(fields.map((tag) => attribute(tag, "thickness"))).toEqual([
            "4",
            "4",
            "2",
            // PreFigure reads an arrow's line width as an integer and fails on
            // 2.5, so it is rounded.
            "3",
        ]);
        // A line width of 0 draws nothing, as in the JSXGraph renderer;
        // PreFigure would divide by it and lose the field.
        expect(prefigureXML).toContain('<group at="vectorfield_4" />');
        expect(Number(attribute(fields[0], "arrow-width"))).toBe(2);
        expect(Number(attribute(fields[1], "arrow-width"))).toBeCloseTo(
            expectedWidth(40, 4),
            3,
        );
        expect(Number(attribute(fields[2], "arrow-width"))).toBeCloseTo(
            expectedWidth(24, 2),
            3,
        );
        expect(Number(attribute(fields[3], "arrow-width"))).toBe(2);
    });

    it("warns that normalized arrows vary in length on unequally scaled axes", async () => {
        const doenetML = prefigureGraph(
            "<vectorField normalize>(y, -x)</vectorField>",
            { attrs: 'yMin="-5" yMax="5"' },
        );

        expect(await getPrefigureXML(doenetML)).toContain("<vector-field");
        expect(await warningCodes(doenetML)).toEqual(["doenet-w0174"]);
    });

    it("renames a vectorField's variables in both components", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<vectorField><function variables="s t">(t, s^2)</function></vectorField>',
            ),
        );

        expect(prefigureXML).toContain(
            "<definition>vectorfield_0_f_formula(x,y)=(y,x^2)</definition>",
        );
    });

    it("snaps PreFigure's running sum back to the lattice it was checked at", async () => {
        // PreFigure adds the step to a running sum: a tenth added twenty times
        // is 2.0000000000000004, past a closed endpoint at 2 where
        // sqrt(2 - x) raises, and a sum of fifths meant to reach 0 stops at
        // -2e-15, where 1/x is an arrow longer than any screen. The function
        // PreFigure calls rounds each input to the nearest lattice index first,
        // keeping it a numpy float with `0*x` so 1/0 stays an infinity.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <slopeField dx="0.1"><function domain="[0,2]">sqrt(2-x)</function></slopeField>
  <vectorField dx="-0.5" dy="2" xoffset="0.25" yoffset="1">(1/x, 0)</vectorField>`),
        );

        // 201 x 21 lattice points exceed maxMarks, so the slope field keeps
        // every second line, and the snap rounds to an index the lattice kept:
        // a multiple of the stride, 2.
        expect(prefigureXML).toContain(
            "<definition>slopefield_0_f(x,y)=slopefield_0_f_formula(0*x+round((x-0.0)/0.2)*2*0.1+0.0,0*y+round((y-0.0)/2.0)*2*1.0+0.0)</definition>",
        );
        // Snapped with the spacing and offset as written, a negative spacing
        // included, which is the arithmetic that placed the lattice's points.
        expect(prefigureXML).toContain(
            "<definition>vectorfield_1_f(x,y)=vectorfield_1_f_formula(0*x+round((x-0.25)/-0.5)*1*-0.5+0.25,0*y+round((y-1.0)/2.0)*1*2.0+1.0)</definition>",
        );
        expect(attributeOf(prefigureXML, "slope-field", "function")).toBe(
            "slopefield_0_f",
        );
        expect(attributeOf(prefigureXML, "vector-field", "function")).toBe(
            "vectorfield_1_f",
        );
    });

    it("snaps a coarsened lattice to the lines it kept", async () => {
        // dx="1e-14" is coarsened by a stride of 8e11, and a walk of that many
        // steps drifts by far more than 1e-14: rounding to the nearest index
        // rather than the nearest kept one took x = 0 to -1.1e-13, where 1/x
        // drew an arrow 1.7e12 pixels long.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<vectorField dx="1e-14">(1/x, 0)</vectorField>'),
        );

        expect(prefigureXML).toMatch(
            /vectorfield_0_f_formula\(0\*x\+round\(\(x-0\.0\)\/[0-9.e-]+\)\*800000000001\*1e-14\+0\.0,/,
        );
    });

    it("warns when ln is given zero, which is an infinity here but raises in PreFigure", async () => {
        const doenetML = prefigureGraph(`
  <slopeField><function domain="[0,10]">ln(x)</function></slopeField>
  <slopeField><function domain="(0,10]">ln(x)</function></slopeField>
  <vectorField><function variables="x y" domain="[0,10] (-inf,inf)">(1, ln(x))</function></vectorField>`);
        const diagnostics = await getWarnings(doenetML);

        // The second is restricted to where ln is defined.
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0172",
            "doenet-w0172",
        ]);
        for (const warning of diagnostics.warnings) {
            expect(warning.message).toContain("(0, -10)");
        }
    });

    it("warns only where PreFigure raises, not wherever the function is infinite", async () => {
        const doenetML = prefigureGraph(`
  <slopeField><function variables="x y" domain="(-inf,inf) (0,inf)">sqrt(y)/x</function></slopeField>
  <slopeField>1/sin(x)</slopeField>
  <vectorField>(1/x, 0)</vectorField>
  <vectorField>(1, 1/sin(x))</vectorField>
  <vectorField>(sqrt(x^2+y^2), 1/sqrt(x^2+y^2))</vectorField>`);
        const diagnostics = await getWarnings(doenetML);

        // sqrt(y)/x on y > 0 is infinite at x = 0, which PreFigure draws as a
        // vertical mark. A slope field also catches the ZeroDivisionError of
        // 1/sin(x) at x = 0, and 1/x divides a numpy float, giving an
        // infinity, so neither loses more than a mark. But sin returns a
        // Python float, and a vector field does not catch the division by
        // it, so (1, 1/sin(x)) loses the whole field, and so does dividing
        // by sqrt(x^2 + y^2) at the origin.
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0172",
            "doenet-w0172",
        ]);
        expect(diagnostics.warnings[0].message).toContain("(0, -10)");
        expect(diagnostics.warnings[1].message).toContain("(0, 0)");
    });

    it("warns on division only when both sides are Python numbers, on csc and cot, and on exp overflow", async () => {
        const doenetML = prefigureGraph(`
  <vectorField>(1, x/sin(y))</vectorField>
  <vectorField>(1, csc(x))</vectorField>
  <slopeField>cot(x)</slopeField>
  <vectorField>(1, cot(x))</vectorField>
  <slopeField>exp(x^3)</slopeField>
  <vectorField lineWidth="0">(1, 1/sin(x))</vectorField>
  <vectorField>(1, exp(x^3))</vectorField>
  <vectorField>(1, 2/sin(x))</vectorField>
  <vectorField>(1, e/sin(x))</vectorField>
  <slopeField>exp(1/x)</slopeField>
  <vectorField>(1, exp(1/x))</vectorField>
  <slopeField>exp(1/sin(x))</slopeField>`);
        const diagnostics = await getWarnings(doenetML);

        // x/sin(y) divides a numpy float by sin(y), which gives an infinity.
        // PreFigure defines csc and cot as 1/sin and 1/tan in Python floats,
        // which a vector field does not survive at x = 0 but a slope field
        // does. exp(1000) overflows in either. A field with a line width of 0
        // draws nothing, so there is nothing to warn about losing. A constant
        // over sin(x) is a Python division too. But exp of an infinite
        // argument does not raise: exp(1/x) divides a numpy float, and
        // math.exp(inf) is inf, and a slope field catches the division in
        // exp(1/sin(x)) before exp is reached.
        expect(diagnostics.warnings.map((w) => w.code)).toEqual([
            "doenet-w0172",
            "doenet-w0172",
            "doenet-w0172",
            "doenet-w0172",
            "doenet-w0172",
            "doenet-w0172",
        ]);
        expect(diagnostics.warnings[0].message).toContain("(0, -10)");
        expect(diagnostics.warnings[1].message).toContain("(0, -10)");
        // The first lattice point where x^3 exceeds about 709.8.
        expect(diagnostics.warnings[2].message).toContain("(9, -10)");
        expect(diagnostics.warnings[3].message).toContain("(9, -10)");
        expect(diagnostics.warnings[4].message).toContain("(0, -10)");
        expect(diagnostics.warnings[5].message).toContain("(0, -10)");
    });

    it("draws the component a one-output function selects from a tuple", async () => {
        // The numerical function takes the first entry of `(x, y)` as the
        // slope, so PreFigure must be given `x`, not the tuple.
        const doenetML = prefigureGraph(
            '<slopeField><function numOutputs="1">(x, y)</function></slopeField>',
        );

        expect(await getPrefigureXML(doenetML)).toContain(
            "<definition>slopefield_0_f_formula(x,y)=x</definition>",
        );
        expect(await warningCodes(doenetML)).toEqual([]);
    });

    it("draws nothing for a lattice whose step PreFigure's running sum would lose", async () => {
        // At 1e17, 1e17 + 1 is 1e17, so PreFigure's `x += step` would never
        // reach the end of the lattice, and the whole diagram would hang. The
        // offsets keep the lattice indices at 0 to 32, well inside the range
        // of the safe-integer guard, so this is the running-sum check.
        for (const [axis, field, fn] of [
            ["x", "slopeField", "1"],
            ["x", "vectorField", "(1, 1)"],
            ["y", "slopeField", "1"],
            ["y", "vectorField", "(1, 1)"],
        ]) {
            const doenetML = prefigureGraph(
                `<${field} ${axis}offset="100000000000000000">${fn}</${field}>`,
                {
                    attrs: `${axis}Min="100000000000000000" ${axis}Max="100000000000000032"`,
                },
            );
            const prefigureXML = await getPrefigureXML(doenetML);

            expect(prefigureXML, `${field} on ${axis}`).toContain(
                `<group at="${field.toLowerCase()}_0" />`,
            );
            expect(prefigureXML, `${field} on ${axis}`).not.toMatch(
                /<(slope|vector)-field/,
            );
            expect(await warningCodes(doenetML)).toEqual([]);
        }
    });

    it("lets an annotation refer to a field", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(`
  <slopeField name="sf">y - x</slopeField>
  <annotations><annotation ref="$sf" text="slopes of y minus x" /></annotations>`),
        );

        expect(prefigureXML).toContain(
            '<annotation ref="slopefield_0" text="slopes of y minus x"></annotation>',
        );
    });
});
