import { describe, expect, it } from "vitest";
import { setMinorTicks, type AxisJXG } from "./jsxgraph";

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
 * extent of the axis in user units.
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
        // always the self-consistent answer — see `tickMantissa`. Pinned here so
        // that revisiting how scaled axes are measured is a deliberate change.
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
