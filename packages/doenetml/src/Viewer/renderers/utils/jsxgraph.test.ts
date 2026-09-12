import { describe, expect, it } from "vitest";
import { applyAxisTickHeights, setMinorTicks, type AxisJXG } from "./jsxgraph";

/** JSXGraph's `minTicksDistance` default for axis ticks (`src/options.js`). */
const MIN_TICKS_DISTANCE = 5;

/**
 * A stand-in for a JSXGraph axis whose `getDistanceMajorTicks` reproduces the
 * arithmetic of the real one (jsxgraph `src/base/ticks.js`) for an axis-aligned
 * axis with `insertTicks: true`. The point of interest is that it reads
 * `minorticks`: JSXGraph keeps `minTicksDistance` pixels between *minor* ticks,
 * so the major interval it settles on scales with the minor count.
 *
 * `unit` is the board's pixels per user unit along the axis, and `range` the
 * extent of the axis in user units. The real axis trims that extent slightly to
 * keep ticks out of its arrow heads, which only feeds the `maxDist` term below.
 */
function fakeAxis({
    unit,
    range,
    scale = 1,
}: {
    unit: number;
    range: number;
    scale?: number;
}): AxisJXG {
    // JSXGraph's own default; `setMinorTicks` overwrites it before reading.
    const visProp: Record<string, any> = { scale, minorticks: 4 };

    const ticks = {
        visProp,
        getDistanceMajorTicks() {
            const maxDist = range / 6 / scale;
            const minDist =
                (MIN_TICKS_DISTANCE / scale / unit) * (visProp.minorticks + 1);

            let delta = 10 ** Math.floor(Math.log10(minDist));
            if (2 * delta >= minDist) {
                delta *= 2;
            } else if (5 * delta >= minDist) {
                delta *= 5;
            }

            let delta2 = 10 ** Math.floor(Math.log10(maxDist));
            if (5 * delta2 < maxDist) {
                delta2 *= 5;
            } else if (2 * delta2 < maxDist) {
                delta2 *= 2;
            }

            return Math.max(delta, delta2);
        },
        setAttribute() {},
        fullUpdate() {},
    };

    return { defaultTicks: ticks } as unknown as AxisJXG;
}

/** The state a viewer would see: minor-tick count and the interval it yields. */
function tickState(axis: AxisJXG) {
    return {
        minorTicks: axis.defaultTicks.visProp.minorticks,
        interval: axis.defaultTicks.getDistanceMajorTicks(),
    };
}

describe("setMinorTicks", () => {
    it("keeps the settled pairing of 3 minor ticks under a 2·10^k interval", () => {
        // A board scale where 3 minor ticks and an interval of 2 agree.
        const axis = fakeAxis({ unit: 17.75, range: 12 });
        setMinorTicks(axis);
        expect(tickState(axis)).toEqual({ minorTicks: 3, interval: 2 });
    });

    it("keeps the settled pairing of 4 minor ticks under a 1·10^k interval", () => {
        const axis = fakeAxis({ unit: 49.58, range: 12 });
        setMinorTicks(axis);
        expect(tickState(axis)).toEqual({ minorTicks: 4, interval: 1 });
    });

    it("keeps the coarser spacing where both pairings agree with themselves", () => {
        // At 11 px per unit, 4 minor ticks yield an interval of 5, which
        // asks for 4, and 3 minor ticks yield 2, which asks for 3: both agree
        // with themselves. The coarser one wins, matching what the old code
        // produced from JSXGraph's default of 4 minor ticks.
        const axis = fakeAxis({ unit: 11, range: 12 });
        setMinorTicks(axis);
        expect(tickState(axis)).toEqual({ minorTicks: 4, interval: 5 });
    });

    it("settles a scale where no pairing agrees with itself", () => {
        // 595x298 px with y from -6 to 6 — <graph aspectRatio="2" size="large">.
        // Here 4 minor ticks produce an interval of 2, which asks for 3, which
        // produces an interval of 1, which asks for 4 again. Repeated calls
        // used to walk that cycle, flipping the y axis between ticks every 2
        // and ticks every 1 for as long as the graph kept re-rendering.
        const axis = fakeAxis({ unit: 298 / 12, range: 12 });

        setMinorTicks(axis);
        const settled = tickState(axis);

        for (let i = 0; i < 5; i++) {
            setMinorTicks(axis);
            expect(tickState(axis)).toEqual(settled);
        }

        // Of the two reachable states, minor ticks every 0.25 read better than
        // every 0.4, so that is the one to settle on.
        expect(settled).toEqual({ minorTicks: 3, interval: 1 });
    });

    it("takes the coarser interval where neither pairing reads well", () => {
        // An 80 px axis over a range of 20, the scale of a `size="tiny"` graph.
        // Again neither pairing agrees with itself, and this time neither divides
        // into readable minor ticks either: 4 minor ticks give an interval of 2
        // (minors every 0.4) and 3 give one of 5 (minors every 1.25). The coarser
        // interval wins, which is also the only one whose minor ticks clear
        // JSXGraph's 5 px minimum — under the finer one they would sit 1.6 px
        // apart. Note that here the *smaller* minor count carries the coarser
        // interval, so the two candidates cannot be ordered in advance.
        const axis = fakeAxis({ unit: 4, range: 20 });

        setMinorTicks(axis);
        const settled = tickState(axis);
        setMinorTicks(axis);

        expect(tickState(axis)).toEqual(settled);
        expect(settled).toEqual({ minorTicks: 3, interval: 5 });
    });

    it("is idempotent across board scales", () => {
        for (let height = 100; height <= 800; height += 1) {
            for (const range of [1, 4, 12, 20, 100]) {
                const axis = fakeAxis({ unit: height / range, range });

                setMinorTicks(axis);
                const settled = tickState(axis);
                setMinorTicks(axis);

                expect(
                    tickState(axis),
                    `height ${height}, range ${range}`,
                ).toEqual(settled);
            }
        }
    });

    it("settles a tick scale factor on 4 minor ticks at every height", () => {
        // <graph yTickScaleFactor="pi"> measures the interval in multiples of
        // pi. The readability test divides the interval by that factor, so on a
        // scaled axis it never matches a round number and 4 minor ticks is
        // always the self-consistent answer — see `scaledMantissaIsOneOf`.
        // Pinned here so that revisiting how scaled axes are measured is a
        // deliberate change.
        for (let height = 100; height <= 800; height += 1) {
            const axis = fakeAxis({
                unit: height / 12,
                range: 12,
                scale: Math.PI,
            });

            setMinorTicks(axis);
            const settled = tickState(axis);
            setMinorTicks(axis);

            expect(tickState(axis), `height ${height}`).toEqual(settled);
            expect(settled.minorTicks, `height ${height}`).toBe(4);
        }
    });
});

describe("applyAxisTickHeights", () => {
    it("shows minor ticks on visible axes for a dense grid", () => {
        const xAxis = fakeAxis({ unit: 20, range: 12 });
        const yAxis = fakeAxis({ unit: 20, range: 12 });
        const xAttributes: Record<string, unknown>[] = [];
        const yAttributes: Record<string, unknown>[] = [];
        xAxis.defaultTicks.setAttribute = (attributes) =>
            xAttributes.push(attributes);
        yAxis.defaultTicks.setAttribute = (attributes) =>
            yAttributes.push(attributes);

        applyAxisTickHeights({
            grid: "dense",
            xaxisRef: { current: xAxis },
            yaxisRef: { current: yAxis },
            displayXAxisTicks: true,
            displayYAxisTicks: false,
        });

        expect(xAttributes).toEqual([{ majorHeight: 0 }, { minorHeight: 10 }]);
        expect(yAttributes).toEqual([{ majorHeight: 0 }, { minorHeight: 0 }]);
    });
});
