import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Piecewise Function Tag Tests", async () => {
    async function check_heaviside(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    1 & \\text{if } x > 0\\\\
    0 & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("mef2")].stateValues
                .latex,
        ).eq(`f_2(x)= \\begin{cases}
    0 & \\text{if } x \\le 0\\\\
    1 & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meg")].stateValues.latex,
        ).eq(`g(x)= \\begin{cases}
    1 & \\text{if } x \\ge 0\\\\
    0 & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meg2")].stateValues
                .latex,
        ).eq(`g_2(x)= \\begin{cases}
    0 & \\text{if } x < 0\\\\
    1 & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meh")].stateValues.latex,
        ).eq(`h(x)= \\begin{cases}
    \\frac{1}{2} & \\text{if } x = 0\\\\
    1 & \\text{if } x > 0\\\\
    0 & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meh2")].stateValues
                .latex,
        ).eq(`h_2(x)= \\begin{cases}
    1 & \\text{if } x > 0\\\\
    0 & \\text{if } x < 0\\\\
    \\frac{1}{2} & \\text{otherwise}
\\end{cases}`);

        let fs = ["f", "f2"];
        let gs = ["g", "g2"];
        let hs = ["h", "h2"];

        for (let fsym of fs) {
            let f =
                stateVariables[await resolvePathToNodeIdx(fsym)].stateValues
                    .numericalfs[0];
            expect(f(-2)).closeTo(0, 1e-12);
            expect(f(-1)).closeTo(0, 1e-12);
            expect(f(-1e-6)).closeTo(0, 1e-12);
            expect(f(0)).closeTo(0, 1e-12);
            expect(f(1e-6)).closeTo(1, 1e-12);
            expect(f(1)).closeTo(1, 1e-12);
            expect(f(2)).closeTo(1, 1e-12);

            expect(
                stateVariables[await resolvePathToNodeIdx(fsym)].stateValues
                    .globalMinimum[1],
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx(fsym)].stateValues
                    .globalInfimum[1],
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx(fsym)].stateValues
                    .globalMaximum[1],
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx(fsym)].stateValues
                    .globalSupremum[1],
            ).eq(1);
        }

        for (let gsym of gs) {
            let g =
                stateVariables[await resolvePathToNodeIdx(gsym)].stateValues
                    .numericalfs[0];
            expect(g(-2)).closeTo(0, 1e-12);
            expect(g(-1)).closeTo(0, 1e-12);
            expect(g(-1e-6)).closeTo(0, 1e-12);
            expect(g(0)).closeTo(1, 1e-12);
            expect(g(1e-6)).closeTo(1, 1e-12);
            expect(g(1)).closeTo(1, 1e-12);
            expect(g(2)).closeTo(1, 1e-12);

            expect(
                stateVariables[await resolvePathToNodeIdx(gsym)].stateValues
                    .globalMinimum[1],
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx(gsym)].stateValues
                    .globalInfimum[1],
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx(gsym)].stateValues
                    .globalMaximum[1],
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx(gsym)].stateValues
                    .globalSupremum[1],
            ).eq(1);
        }

        for (let hsym of hs) {
            let h =
                stateVariables[await resolvePathToNodeIdx(hsym)].stateValues
                    .numericalfs[0];
            expect(h(-2)).closeTo(0, 1e-12);
            expect(h(-1)).closeTo(0, 1e-12);
            expect(h(-1e-6)).closeTo(0, 1e-12);
            expect(h(0)).closeTo(0.5, 1e-12);
            expect(h(1e-6)).closeTo(1, 1e-12);
            expect(h(1)).closeTo(1, 1e-12);
            expect(h(2)).closeTo(1, 1e-12);

            expect(
                stateVariables[await resolvePathToNodeIdx(hsym)].stateValues
                    .globalMinimum[1],
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx(hsym)].stateValues
                    .globalInfimum[1],
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx(hsym)].stateValues
                    .globalMaximum[1],
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx(hsym)].stateValues
                    .globalSupremum[1],
            ).eq(1);
        }
    }

    it("heaviside function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f">
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
    </piecewiseFunction>
    <piecewiseFunction name="f2">
      <function domain="(-Infinity,0]">0</function>
      <function>1</function>
    </piecewiseFunction>
    <piecewiseFunction name="g">
      <function domain="[0,Infinity)">1</function>
      <function>0</function>
    </piecewiseFunction>
    <piecewiseFunction name="g2">
      <function domain="(-Infinity,0)">0</function>
      <function>1</function>
    </piecewiseFunction>
    <piecewiseFunction name="h">
      <function domain="[0,0]">1/2</function>
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
    </piecewiseFunction>
    <piecewiseFunction name="h2">
      <function domain="(0,Infinity)">1</function>
      <function domain="(-Infinity,0)">0</function>
      <function>1/2</function>
    </piecewiseFunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    `,
        });

        await check_heaviside(core, resolvePathToNodeIdx);
    });

    it("heaviside function, ignore extra pieces", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f">
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
      <function>x^2</function>
    </piecewiseFunction>
    <piecewiseFunction name="f2">
      <function domain="(-Infinity,0]">0</function>
      <function>1</function>
      <function domain="(-1,1)">x^2</function>
    </piecewiseFunction>
    <piecewiseFunction name="g">
      <function domain="[0,Infinity)">1</function>
      <function>0</function>
      <function domain="(-1,1]">x^2</function>
    </piecewiseFunction>
    <piecewiseFunction name="g2">
      <function domain="(-Infinity,0)">0</function>
      <function>1</function>
      <function domain="[-1,1)">x^2</function>
    </piecewiseFunction>
    <piecewiseFunction name="h">
      <function domain="[0,0]">1/2</function>
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
      <function domain="(-3,-1]">x^2</function>
      <function domain="(1,3)">x^3</function>
    </piecewiseFunction>
    <piecewiseFunction name="h2">
      <function domain="(0,Infinity)">1</function>
      <function domain="(-Infinity,0)">0</function>
      <function>1/2</function>
      <function domain="[-3,-1)">x^2</function>
      <function domain="[1,3]">x^3</function>
    </piecewiseFunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    `,
        });

        await check_heaviside(core, resolvePathToNodeIdx);
    });

    it("different variables", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f" variables="t">
      <function domain="(0,Infinity)">x</function>
      <function domain="(-Infinity, 0]" variables="y">2-y</function>
    </piecewiseFunction>
    <piecewiseFunction name="g">
      <function domain="(0,Infinity)" variables="q">q</function>
      <function domain="(-Infinity, 0)" variables="y">2-y</function>
    </piecewiseFunction>
    <piecewiseFunction name="h" variables="s">
      <function domain="[0,10)" variables="q">q</function>
      <function domain="[-10, 0)" variables="y">2-y</function>
    </piecewiseFunction>
    <piecewiseFunction name="k" domain="(-10,10]" variables="u">
      <function domain="(0,Infinity)" variables="q">q</function>
      <function domain="(-Infinity, 0)" variables="y">2-y</function>
    </piecewiseFunction>
    </graph>
    <me name="mef">f(t)=$f</me>
    <me name="meg">g(q)=$g</me>
    <me name="meh">h(s)=$h</me>
    <me name="mek">k(u)=$k</me>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(t)= \\begin{cases}
    t & \\text{if } t > 0\\\\
    2 - t & \\text{if } t \\le 0
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meg")].stateValues.latex,
        ).eq(`g(q)= \\begin{cases}
    q & \\text{if } q > 0\\\\
    2 - q & \\text{if } q < 0
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meh")].stateValues.latex,
        ).eq(`h(s)= \\begin{cases}
    s & \\text{if } 0 \\le s < 10\\\\
    2 - s & \\text{if } -10 \\le s < 0
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("mek")].stateValues.latex,
        ).eq(`k(u)= \\begin{cases}
    u & \\text{if } u > 0\\\\
    2 - u & \\text{if } u < 0
\\end{cases}`);

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        expect(f(-2)).closeTo(4, 1e-12);
        expect(f(-1)).closeTo(3, 1e-12);
        expect(f(-1e-6)).closeTo(2.000001, 1e-12);
        expect(f(0)).closeTo(2, 1e-12);
        expect(f(1e-6)).closeTo(1e-6, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(2, 1e-12);

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([-200, 202]);

        let g =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .numericalfs[0];
        expect(g(-2)).closeTo(4, 1e-12);
        expect(g(-1)).closeTo(3, 1e-12);
        expect(g(-1e-6)).closeTo(2.000001, 1e-12);
        expect(g(0)).eqls(NaN);
        expect(g(1e-6)).closeTo(1e-6, 1e-12);
        expect(g(1)).closeTo(1, 1e-12);
        expect(g(2)).closeTo(2, 1e-12);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalSupremum,
        ).eqls([-200, 202]);

        let h =
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .numericalfs[0];
        expect(h(-10.000001)).eqls(NaN);
        expect(h(-10)).closeTo(12, 1e-12);
        expect(h(-2)).closeTo(4, 1e-12);
        expect(h(-1)).closeTo(3, 1e-12);
        expect(h(-1e-6)).closeTo(2.000001, 1e-12);
        expect(h(0)).closeTo(0, 1e-12);
        expect(h(1e-6)).closeTo(1e-6, 1e-12);
        expect(h(1)).closeTo(1, 1e-12);
        expect(h(2)).closeTo(2, 1e-12);
        expect(h(9.99999)).closeTo(9.99999, 1e-12);
        expect(h(10)).eqls(NaN);

        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalMaximum,
        ).eqls([-10, 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalSupremum,
        ).eqls([-10, 12]);

        let k =
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .numericalfs[0];
        expect(k(-10)).eqls(NaN);
        expect(k(-9.99999)).closeTo(11.99999, 1e-12);
        expect(k(-2)).closeTo(4, 1e-12);
        expect(k(-1)).closeTo(3, 1e-12);
        expect(k(-1e-6)).closeTo(2.000001, 1e-12);
        expect(k(0)).eqls(NaN);
        expect(k(1e-6)).closeTo(1e-6, 1e-12);
        expect(k(1)).closeTo(1, 1e-12);
        expect(k(2)).closeTo(2, 1e-12);
        expect(k(10)).closeTo(10, 1e-12);
        expect(k(10.0000001)).eqls(NaN);

        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalSupremum,
        ).eqls([-10, 12]);
    });

    it("extrema", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <piecewiseFunction name="f">
        <function domain="(0,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewiseFunction>
      <piecewiseFunction name="f2">
        <function domain="[0,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewiseFunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <p name="pfmin">Minima of f: $f.minima</p>
    <p name="pfmax">Maxima of f: $f.maxima</p>
    <p name="pf2min">Minima of f_2: $f2.minima</p>
    <p name="pf2max">Maxima of f_2: $f2.maxima</p>

    <graph size="small">
      <piecewiseFunction name="g">
        <function domain="(0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewiseFunction>
      <piecewiseFunction name="g2">
        <function domain="[0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewiseFunction>
    </graph>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <p name="pgmin">Minima of g: $g.minima</p>
    <p name="pgmax">Maxima of g: $g.maxima</p>
    <p name="pg2min">Minima of g_2: $g2.minima</p>
    <p name="pg2max">Maxima of g_2: $g2.maxima</p>

    <graph size="small">
      <piecewiseFunction name="h" displaySmallAsZero>
        <function domain="(-0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewiseFunction>
      <piecewiseFunction name="h2" displaySmallAsZero>
        <function domain="[-0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewiseFunction>
    </graph>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    <p name="phmin">Minima of h: $h.minima</p>
    <p name="phmax">Maxima of h: $h.maxima</p>
    <p name="ph2min">Minima of h_2: $h2.minima</p>
    <p name="ph2max">Maxima of h_2: $h2.maxima</p>

    <graph size="small">
      <piecewiseFunction name="k" displaySmallAsZero="10^(-13)" displayDigits="5">
        <function domain="(1,Infinity)">(x-2)^2</function>
        <function domain="(-Infinity, -1)">(x+2)^2</function>
        <function>cos(pi*x/2)</function>
      </piecewiseFunction>
      <piecewiseFunction name="k2" displaySmallAsZero="10^(-13)" displayDigits="5">
        <function domain="[1,Infinity)">(x-2)^2</function>
        <function domain="(-Infinity, -1]">(x+2)^2</function>
        <function>cos(pi*x/2)</function>
      </piecewiseFunction>
    </graph>
    <me name="mek">k(x)=$k</me>
    <me name="mek2">k_2(x)=$k2</me>
    <p name="pkmin">Minima of k: $k.minima</p>
    <p name="pkmax">Maxima of k: $k.maxima</p>
    <p name="pk2min">Minima of k_2: $k2.minima</p>
    <p name="pk2max">Maxima of k_2: $k2.maxima</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    x^{2} & \\text{if } x > 0\\\\
    -x^{2} & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("mef2")].stateValues
                .latex,
        ).eq(`f_2(x)= \\begin{cases}
    x^{2} & \\text{if } x \\ge 0\\\\
    -x^{2} & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("pfmin")].stateValues
                .text,
        ).eq("Minima of f: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pfmax")].stateValues
                .text,
        ).eq("Maxima of f: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pf2min")].stateValues
                .text,
        ).eq("Minima of f_2: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pf2max")].stateValues
                .text,
        ).eq("Maxima of f_2: ");

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.minima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.maxima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.minima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.maxima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([-200, -(200 ** 2)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([200, 200 ** 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalInfimum,
        ).eqls([-200, -(200 ** 2)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalSupremum,
        ).eqls([200, 200 ** 2]);

        expect(
            stateVariables[await resolvePathToNodeIdx("meg")].stateValues.latex,
        ).eq(`g(x)= \\begin{cases}
    x^{2} & \\text{if } x > 0.1\\\\
    -x^{2} & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meg2")].stateValues
                .latex,
        ).eq(`g_2(x)= \\begin{cases}
    x^{2} & \\text{if } x \\ge 0.1\\\\
    -x^{2} & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("pgmin")].stateValues
                .text,
        ).eq("Minima of g: ( 0.1, -0.01 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pgmax")].stateValues
                .text,
        ).eq("Maxima of g: ( 0, 0 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pg2min")].stateValues
                .text,
        ).eq("Minima of g_2: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pg2max")].stateValues
                .text,
        ).eq("Maxima of g_2: ( 0, 0 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.minima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[0][0],
        ).closeTo(0.1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[0][1],
        ).closeTo(-0.01, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.maxima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .maxima[0][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .maxima[0][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues.minima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues.maxima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .maxima[0][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .maxima[0][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalInfimum,
        ).eqls([-199.9, -(199.9 ** 2)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalSupremum,
        ).eqls([200.1, 200.1 ** 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalInfimum,
        ).eqls([-199.9, -(199.9 ** 2)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalSupremum,
        ).eqls([200.1, 200.1 ** 2]);

        expect(
            stateVariables[await resolvePathToNodeIdx("meh")].stateValues.latex,
        ).eq(`h(x)= \\begin{cases}
    x^{2} & \\text{if } x > -0.1\\\\
    -x^{2} & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("meh2")].stateValues
                .latex,
        ).eq(`h_2(x)= \\begin{cases}
    x^{2} & \\text{if } x \\ge -0.1\\\\
    -x^{2} & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("phmin")].stateValues
                .text,
        ).eq("Minima of h: ( 0, 0 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("phmax")].stateValues
                .text,
        ).eq("Maxima of h: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("ph2min")].stateValues
                .text,
        ).eq("Minima of h_2: ( 0, 0 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("ph2max")].stateValues
                .text,
        ).eq("Maxima of h_2: ( -0.1, 0.01 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues.minima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[0][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[0][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues.maxima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues.minima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[0][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[0][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues.maxima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .maxima[0][0],
        ).closeTo(-0.1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .maxima[0][1],
        ).closeTo(0.01, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalInfimum,
        ).eqls([-200.1, -(200.1 ** 2)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalSupremum,
        ).eqls([199.9, 199.9 ** 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalInfimum,
        ).eqls([-200.1, -(200.1 ** 2)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalSupremum,
        ).eqls([199.9, 199.9 ** 2]);

        expect(
            stateVariables[await resolvePathToNodeIdx("mek")].stateValues.latex,
        ).eq(`k(x)= \\begin{cases}
    \\left(x - 2\\right)^{2} & \\text{if } x > 1\\\\
    \\left(x + 2\\right)^{2} & \\text{if } x < -1\\\\
    \\cos\\left(\\frac{\\pi x}{2}\\right) & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("mek2")].stateValues
                .latex,
        ).eq(`k_2(x)= \\begin{cases}
    \\left(x - 2\\right)^{2} & \\text{if } x \\ge 1\\\\
    \\left(x + 2\\right)^{2} & \\text{if } x \\le -1\\\\
    \\cos\\left(\\frac{\\pi x}{2}\\right) & \\text{otherwise}
\\end{cases}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("pkmin")].stateValues
                .text,
        ).eq("Minima of k: ( -2, 0 ), ( -1, 0 ), ( 1, 0 ), ( 2, 0 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pkmax")].stateValues
                .text,
        ).eq("Maxima of k: ( 0, 1 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pk2min")].stateValues
                .text,
        ).eq("Minima of k_2: ( -2, 0 ), ( 2, 0 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pk2max")].stateValues
                .text,
        ).eq("Maxima of k_2: ( -1, 1 ), ( 0, 1 ), ( 1, 1 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues.minima
                .length,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[0][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[1][0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[2][0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[2][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[3][0],
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[3][1],
        ).closeTo(0, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues.maxima
                .length,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .maxima[0][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .maxima[0][1],
        ).closeTo(1, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues.minima
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[0][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[1][0],
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues.maxima
                .length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[0][0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[0][1],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[1][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[1][1],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[2][0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[2][1],
        ).closeTo(1, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalMinimum,
        ).eqls([2, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalInfimum,
        ).eqls([2, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalSupremum,
        ).eqls([201, 199 ** 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalMinimum,
        ).eqls([2, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalInfimum,
        ).eqls([2, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalSupremum,
        ).eqls([201, 199 ** 2]);
    });

    it("extrema 2, overlap in domains", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph size="small">
      <piecewiseFunction name="f">
        <function domain="(-1,1)">x^2</function>
        <function domain="(0,Infinity)">(x-1)^2+1</function>
        <function>(x+1)^2+1</function>
      </piecewiseFunction>
      <piecewiseFunction name="f2">
      <function domain="[-1,1]">x^2</function>
      <function domain="(0,Infinity)">(x-1)^2+1</function>
      <function>(x+1)^2+1</function>
      </piecewiseFunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <p name="pfmin">Minima of f: $f.minima</p>
    <p name="pfmax">Maxima of f: $f.maxima</p>
    <p name="pf2min">Minima of f_2: $f2.minima</p>
    <p name="pf2max">Maxima of f_2: $f2.maxima</p>

    <graph size="small">
      <piecewiseFunction name="g">
      <function domain="(-1,1)">x^2</function>
      <function domain="(0,Infinity)">(x-2)^2+1</function>
      <function>(x+2)^2+1</function>
      </piecewiseFunction>
      <piecewiseFunction name="g2">
      <function domain="[-1,1]">x^2</function>
      <function domain="(0,Infinity)">(x-2)^2+1</function>
      <function>(x+2)^2+1</function>
      </piecewiseFunction>
    </graph>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <p name="pgmin">Minima of g: $g.minima</p>
    <p name="pgmax">Maxima of g: $g.maxima</p>
    <p name="pg2min">Minima of g_2: $g2.minima</p>
    <p name="pg2max">Maxima of g_2: $g2.maxima</p>



    <graph size="small">
      <piecewiseFunction name="h" >
        <function domain="(-1,1)">x^2</function>
        <function domain="(-3,3)">x^4/4-2x^2</function>
        <function>abs(x)</function>
      </piecewiseFunction>
      <piecewiseFunction name="h2" >
        <function domain="[-1,1]">x^2</function>
        <function domain="[-3,3]">x^4/4-2x^2</function>
        <function>abs(x)</function>
      </piecewiseFunction>
    </graph>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    <p name="phmin">Minima of h: $h.minima</p>
    <p name="phmax">Maxima of h: $h.maxima</p>
    <p name="ph2min">Minima of h_2: $h2.minima</p>
    <p name="ph2max">Maxima of h_2: $h2.maxima</p>

    <graph size="small">
      <piecewiseFunction name="k" >
        <function domain="(-1,1)">x^2</function>
        <function domain="(-3,3)">x^4/4-2x^2+4</function>
        <function>abs(x)</function>
      </piecewiseFunction>
      <piecewiseFunction name="k2" >
        <function domain="[-1,1]">x^2</function>
        <function domain="[-3,3]">x^4/4-2x^2+4</function>
        <function>abs(x)</function>
      </piecewiseFunction>
    </graph>
    <me name="mek">k(x)=$k</me>
    <me name="mek2">k_2(x)=$k2</me>
    <p name="pkmin">Minima of k: $k.minima</p>
    <p name="pkmax">Maxima of k: $k.maxima</p>
    <p name="pk2min">Minima of k_2: $k2.minima</p>
    <p name="pk2max">Maxima of k_2: $k2.maxima</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.minima,
        ).eqls([[0, 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.maxima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.minima,
        ).eqls([[0, 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.maxima,
        ).eqls([]);

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([201, 200 ** 2 + 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalSupremum,
        ).eqls([201, 200 ** 2 + 1]);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.minima
                .length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[0][1],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[1][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[2][0],
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .minima[2][1],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.maxima
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .maxima[0][0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .maxima[0][1],
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .maxima[1][0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .maxima[1][1],
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues.minima
                .length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .minima[0][1],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .minima[1][0],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .minima[2][0],
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .minima[2][1],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues.maxima,
        ).eqls([]);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .globalSupremum,
        ).eqls([201, 199 ** 2 + 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .globalSupremum,
        ).eqls([201, 199 ** 2 + 1]);

        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues.minima
                .length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[0][1],
        ).closeTo(-4, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[1][0],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[2][0],
        ).closeTo(2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .minima[2][1],
        ).closeTo(-4, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues.maxima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues.minima
                .length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[0][1],
        ).closeTo(-4, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[1][0],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[2][0],
        ).closeTo(2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .minima[2][1],
        ).closeTo(-4, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues.maxima
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .maxima[0][0],
        ).closeTo(-1, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .maxima[0][1],
        ).closeTo(1, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .maxima[1][0],
        ).closeTo(1, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .maxima[1][1],
        ).closeTo(1, 1e-8);

        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalMinimum,
        ).eqls([-2, -4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalInfimum,
        ).eqls([-2, -4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues
                .globalSupremum,
        ).eqls([-203, 203]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalMinimum,
        ).eqls([-2, -4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalInfimum,
        ).eqls([-2, -4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("h2")].stateValues
                .globalSupremum,
        ).eqls([-203, 203]);

        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues.minima
                .length,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[0][0],
        ).closeTo(-3, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[0][1],
        ).closeTo(3, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[1][0],
        ).closeTo(-2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[2][0],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[2][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[3][0],
        ).closeTo(2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[3][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[4][0],
        ).closeTo(3, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .minima[4][1],
        ).closeTo(3, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues.maxima
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .maxima[0][0],
        ).closeTo(-1, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .maxima[0][1],
        ).closeTo(2.25, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .maxima[1][0],
        ).closeTo(1, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .maxima[1][1],
        ).closeTo(2.25, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues.minima
                .length,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[0][0],
        ).closeTo(-2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[0][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[1][0],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[1][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[2][0],
        ).closeTo(2, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .minima[2][1],
        ).closeTo(0, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues.maxima
                .length,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[0][0],
        ).closeTo(-3, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[0][1],
        ).closeTo(6.25, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[1][0],
        ).closeTo(3, 1e-8);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .maxima[1][1],
        ).closeTo(6.25, 1e-8);

        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k")].stateValues
                .globalSupremum,
        ).eqls([-203, 203]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalMinimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalInfimum,
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalMaximum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("k2")].stateValues
                .globalSupremum,
        ).eqls([-203, 203]);
    });

    it("ignore function pieces with non-numerical domain when evaluating numerically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f" symbolic="false">
      <function domain="[a,a]">1</function>
      <function domain="(s,t)">x</function>
      <function domain="[1,q)">x^2/10</function>
      <function domain="(z,5)">x^3/100</function>
      <function domain="[8,10]">x^4/1000</function>
      <function domain="(20,-10)">x^5/10000</function>
    </piecewiseFunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <p name="p7">$$f(7)</p>
    <p name="p8">$$f(8)</p>
    <p name="p9">$$f(9)</p>
    <p name="p10">$$f(10)</p>
    <p name="p11">$$f(11)</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    1 & \\text{if } x = a\\\\
    x & \\text{if } {s} < x < t\\\\
    \\frac{x^{2}}{10} & \\text{if } {1} \\le x < q\\\\
    \\frac{x^{3}}{100} & \\text{if } {z} < x < 5\\\\
    \\frac{x^{4}}{1000} & \\text{if } 8 \\le x \\le 10
\\end{cases}`);

        expect(
            stateVariables[await resolvePathToNodeIdx("p7")].stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("p8")].stateValues.text,
        ).eq("4.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p9")].stateValues.text,
        ).eq("6.56");
        expect(
            stateVariables[await resolvePathToNodeIdx("p10")].stateValues.text,
        ).eq("10");
        expect(
            stateVariables[await resolvePathToNodeIdx("p11")].stateValues.text,
        ).eq("NaN");

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        for (let i = -10; i <= 15; i++) {
            if (i >= 8 && i <= 10) {
                expect(f(i)).closeTo(i ** 4 / 1000, 1e-14);
            } else {
                expect(f(i)).eqls(NaN);
            }
        }

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([8, f(8)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([8, f(8)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum,
        ).eqls([10, f(10)]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([10, f(10)]);
    });

    it("use single point notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f">
      <function domain="[1, sin(pi/2)]">x</function>
      <function domain="[sqrt(4), 2]">x^2/10</function>
      <function domain="(sin(5pi/2),3)">x^3/100</function>
    </piecewiseFunction>
    $f.extrema
    $f.globalMaximum{styleNumber="2"}
    $f.globalInfimum{styleNumber="3"}
    </graph>
    <me name="mef">f(x)=$f</me>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    x & \\text{if } x = 1\\\\
    \\frac{x^{2}}{10} & \\text{if } x = 2\\\\
    \\frac{x^{3}}{100} & \\text{if } 1 < x < 2 \\text{ or }2 < x < 3
\\end{cases}`);

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        expect(f(0)).eqls(NaN);
        expect(f(0.999)).eqls(NaN);
        expect(f(1)).eq(1);
        expect(f(1.0001)).closeTo(1.0001 ** 3 / 100, 1e-14);
        expect(f(1.9999)).closeTo(1.9999 ** 3 / 100, 1e-14);
        expect(f(2)).eq(4 / 10);
        expect(f(2.0001)).closeTo(2.0001 ** 3 / 100, 1e-14);
        expect(f(2.9999)).closeTo(2.9999 ** 3 / 100, 1e-14);
        expect(f(3)).eqls(NaN);
        expect(f(4)).eqls(NaN);

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.maxima,
        ).eqls([[2, 4 / 10]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.minima,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum,
        ).eqls([1, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([1, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([1, 1 / 100]);
    });

    it("global extrema, find single points from gaps", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f" domain="(-5,5)">
      <function domain="(-1,0.1)">3</function>
      <function domain="(3,4)">1/x-1</function>
      <function domain="(4,5)">1/x-1</function>
      <function domain="(-6,Infinity)">-2-(x+4)^2</function>
    </piecewiseFunction>
    $f.extrema
    $f.globalMaximum{styleNumber="2"}
    $f.globalInfimum{styleNumber="3"}
    </graph>
    <me name="mef">f(x)=$f</me>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    3 & \\text{if } -1 < x < 0.1\\\\
    \\frac{1}{x} - 1 & \\text{if } 3 < x < 4 \\text{ or }4 < x < 5\\\\
    -2 - \\left(x + 4\\right)^{2} & \\text{if } -6 < x \\le -1 \\text{ or }0.1 \\le x \\le 3 \\text{ or }x = 4 \\text{ or }x \\ge 5
\\end{cases}`);

        let f =
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .numericalfs[0];
        expect(f(-5)).eqls(NaN);
        expect(f(-4.999)).closeTo(-2 - 0.999 ** 2, 1e-14);
        expect(f(-1)).eq(-2 - 3 ** 2);
        expect(f(-0.999)).eq(3);
        expect(f(0.0999)).eq(3);
        expect(f(0.1)).eq(-2 - 4.1 ** 2);
        expect(f(3)).eq(-2 - 7 ** 2);
        expect(f(3.001)).eq(1 / 3.001 - 1);
        expect(f(3.999)).eq(1 / 3.999 - 1);
        expect(f(4)).eq(-2 - 8 ** 2);
        expect(f(4.001)).eq(1 / 4.001 - 1);
        expect(f(4.999)).eq(1 / 4.999 - 1);
        expect(f(5)).eqls(NaN);

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.maxima,
        ).eqls([[-4, -2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.minima,
        ).eqls([
            [-1, -2 - 3 ** 2],
            [3, -2 - 7 ** 2],
            [4, -2 - 8 ** 2],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum[0],
        ).within(-1, -0.9);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum[1],
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([-1, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([4, -2 - 8 ** 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([4, -2 - 8 ** 2]);
    });

    it("latex combines pieces", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <piecewiseFunction name="f">
      <function domain="(1,3)">x</function>
      <function domain="(s,t)">x</function>
      <function domain="(2,4)">x</function>
      <function domain="[1,q)">x^2</function>
      <function domain="[4,5)">x^2</function>
      <function domain="[b,1)">x^2</function>
      <function domain="[5,6)">x^2</function>
      <function domain="(8,9)">x</function>
    </piecewiseFunction>
    </graph>
    <me name="mef">f(x)=$f</me>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    x & \\text{if } {s} < x < t \\text{ or } 1 < x < 4\\\\
    x^{2} & \\text{if } {1} \\le x < q \\text{ or } {b} \\le x < 1 \\text{ or } 4 \\le x < 6\\\\
    x & \\text{if } 8 < x < 9
\\end{cases}`);
    });

    it("latex is marked forRenderer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <piecewiseFunction name="f">
      <function domain="(1,3)">x</function>
      <function domain="[4,5)">x^2</function>
    </piecewiseFunction>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const fIdx = await resolvePathToNodeIdx("f");

        expect(core.core?._components![fIdx].state.latex.forRenderer).eq(true);
    });

    it("extrema of a function with piecewise function child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <function name="f">
    <piecewiseFunction domain="(-5,8]">
      <function domain="(-1,1]">x^2</function>
      <function domain="(-4,4]">1-x^2/4</function>
      <function>cos(pi x)</function>
    </piecewiseFunction>
    </function>
    $f.extrema
    $f.globalSupremum{styleNumber="2"}
    $f.globalMaximum{styleNumber="3"}
    $f.globalInfimum{styleNumber="4"}
    $f.globalMinimum{styleNumber="5"}
    </graph>
    <me name="mef">f(x)=$f</me>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mef")].stateValues.latex,
        ).eq(`f(x)= \\begin{cases}
    x^{2} & \\text{if } -1 < x \\le 1\\\\
    1 - \\frac{x^{2}}{4} & \\text{if } -4 < x \\le -1 \\text{ or }1 < x \\le 4\\\\
    \\cos\\left(\\pi x\\right) & \\text{otherwise}
\\end{cases}`);

        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.maxima,
        ).eqls([
            [-4, 1],
            [1, 1],
            [6, 1],
            [8, 1],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues.minima,
        ).eqls([
            [0, 0],
            [4, -3],
            [5, -1],
            [7, -1],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMaximum,
        ).eqls([1, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalSupremum,
        ).eqls([-1, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalMinimum,
        ).eqls([4, -3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f")].stateValues
                .globalInfimum,
        ).eqls([-4, -3]);
    });

    it("extrema of piecewise functions with piecewise function children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <piecewiseFunction name="f1">
        <function domain="(-Infinity,0)">0</function>
        <function>x^2</function>
      </piecewiseFunction>
      $f1.extrema
    </graph>
    
    <graph>
      <piecewiseFunction name="f2">
        <piecewiseFunction extend="$f1" domain="(-3,2]" />
        <function>1/x</function>
      </piecewiseFunction>
      $f2.extrema
    </graph>
    
    <graph>
      <piecewiseFunction name="f3">
        <function domain="(3,Infinity)">9*e^(-(x-3))</function>
        <function domain="[1,2)">8-x</function>
        $f1
      </piecewiseFunction>
      $f3.extrema
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let f2 =
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .numericalfs[0];

        expect(f2(-4)).eq(-1 / 4);
        expect(f2(-3)).eq(-1 / 3);
        expect(f2(-2)).eq(0);
        expect(f2(-1)).eq(0);
        expect(f2(0)).eq(0);
        expect(f2(1)).eq(1);
        expect(f2(2)).eq(4);
        expect(f2(3)).eq(1 / 3);
        expect(f2(4)).eq(1 / 4);

        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.maxima,
        ).eqls([[2, 4]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.minima,
        ).eqls([[-3, -1 / 3]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalMaximum,
        ).eqls([2, 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalSupremum,
        ).eqls([2, 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalMinimum,
        ).eqls([-3, -1 / 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues
                .globalInfimum,
        ).eqls([-3, -1 / 3]);

        let f3 =
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues
                .numericalfs[0];

        expect(f3(-4)).eq(0);
        expect(f3(0)).eq(0);
        expect(f3(0.5)).eq(0.25);
        expect(f3(1)).eq(7);
        expect(f3(1.5)).eq(6.5);
        expect(f3(2)).eq(4);
        expect(f3(3)).eq(9);
        expect(f3(4)).eq(9 * Math.exp(-1));

        expect(
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues.maxima,
        ).eqls([
            [1, 7],
            [3, 9],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues.minima,
        ).eqls([[2, 4]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues
                .globalMaximum,
        ).eqls([3, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues
                .globalSupremum,
        ).eqls([3, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues
                .globalMinimum[1],
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("f3")].stateValues
                .globalInfimum[1],
        ).eq(0);
    });
});
