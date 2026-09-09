/**
 * The numbers behind a chart's axes: rounding, tick steps and automatic bounds.
 *
 * Shared by every chart type that has an axis, and by the pie for its
 * saturating total. Nothing here knows what a mark looks like or how a diagram
 * is assembled — it is arithmetic, and it is separate because the same
 * arithmetic decides a bar chart's vertical scale and a scatter's two.
 */

/**
 * One series' values, as the geometry needs them.
 *
 * The label rides along because it is what a bar's annotation names the bar's
 * group by, and an annotation is part of the drawing rather than part of how it
 * is styled.
 */
export type ChartSeriesValues = {
    /** The name of the group, or `""` when the series has none. */
    label: string;
    values: number[];
};

/** How many labeled intervals the vertical axis aims to be divided into. */
const TARGET_TICK_INTERVALS = 5;

/**
 * The point halfway between `low` and `high`, without overflowing on the way.
 *
 * `(low + high) / 2` is the obvious form and it is wrong at the top of the
 * range: two finite bounds can sum to `Infinity`, which `formatNumber` writes
 * as `null` — and `anchor="(null,10)"` is not XML PreFigure can read. Halving
 * first cannot overflow, because neither half is larger than the value it came
 * from. Only a numeric horizontal axis gets near this; a bar chart's runs from
 * zero to the number of categories.
 */
export function midpoint(low: number, high: number): number {
    return low / 2 + high / 2;
}

/**
 * Rounds away the dust a floating-point multiplication leaves behind, so that
 * `3 * 0.1` is written as `0.3` rather than `0.30000000000000004`.
 *
 * Twelve significant digits is far more than any tick a reader will look at and
 * far fewer than the seventeen it takes to expose binary rounding.
 */
export function snapNumber(value: number): number {
    return Number.isFinite(value) ? Number(value.toPrecision(12)) : value;
}

/**
 * A running total kept inside the range a double can hold.
 *
 * A stack's height is the sum of its segments, and a sum of finite values need
 * not be finite: two series of `1e308` stack to `Infinity`, which
 * `formatNumber` writes as `null` — a literal `null` in the bounding box, in
 * the axis labels, and in the lower-left corner of every segment stacked above
 * the overflow. Saturating at the largest representable value keeps all three
 * drawable.
 *
 * Saturating the running total is not on its own enough, which is why the
 * segment heights below are measured from it rather than from the values: a
 * rectangle drawn at a saturated base with its own value as its height has a
 * *far corner* that overflows even though both attributes are finite, and
 * PreFigure computes that corner rather than reading it. It came out as
 * `L nan -inf` in the path data of a diagram that otherwise compiled, which is
 * the shape of bug that a check on the emitted XML cannot see.
 */
export function saturatingAdd(total: number, value: number): number {
    const sum = total + value;
    if (Number.isFinite(sum)) {
        return sum;
    }
    return sum > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE;
}

/**
 * A tick step that divides `span` into a handful of intervals and lands on
 * numbers a reader recognizes — 1, 2, 5 and their powers of ten, the same
 * ladder every plotting library climbs.
 *
 * `minStep` is 1 for a chart whose scale is whole numbers, so that counts are
 * never labeled 0, 0.5, 1 — which would invite reading half a thing — and 0
 * for one that is not, so that a chart of proportions gets ticks inside the
 * unit interval rather than only at its ends.
 */
function niceTickStep(span: number, minStep: number): number {
    if (Number.isNaN(span) || span <= 0) {
        return Math.max(minStep, 1);
    }

    // A span of `Infinity` is reachable from finite data: values at opposite
    // ends of the double range overflow when subtracted. Falling through to a
    // step of 1 would ask for an impossible number of labels, so scale to the
    // largest magnitude the range can actually hold.
    if (!Number.isFinite(span)) {
        return Math.max(
            minStep,
            snapNumber(Number.MAX_VALUE / TARGET_TICK_INTERVALS),
        );
    }

    const rough = span / TARGET_TICK_INTERVALS;
    const magnitude = 10 ** Math.floor(Math.log10(rough));
    // A subnormal span underflows the power of ten to 0, which would make the
    // step 0 and every tick `NaN`. There is no representable round step below
    // the smallest positive double, so use the value itself.
    if (!(magnitude > 0)) {
        return Math.max(minStep, rough) || Number.MIN_VALUE;
    }
    const normalized = rough / magnitude;

    let step;
    if (normalized <= 1) {
        step = 1;
    } else if (normalized <= 2) {
        step = 2;
    } else if (normalized <= 5) {
        step = 5;
    } else {
        step = 10;
    }

    return Math.max(minStep, snapNumber(step * magnitude));
}

/**
 * The first multiple of `step` at or beyond `value` in `direction`.
 *
 * The division is snapped before it is rounded, so that a value already sitting
 * on a tick is recognized as doing so however the multiplication that produced
 * the step came out in binary.
 */
export function tickAtOrBeyond(value: number, step: number, direction: 1 | -1) {
    const ratio = snapNumber(value / step);
    const index = direction === 1 ? Math.ceil(ratio) : Math.floor(ratio);
    return snapNumber(index * step);
}

/**
 * The first multiple of `step` strictly beyond `value` in `direction`, moving
 * one further when `value` already sits exactly on a tick.
 *
 * That last part is what keeps the tallest bar off the frame: a chart of a
 * single value of 80 with a step of 20 goes to 100, not to 80.
 */
function nextTickBeyond(value: number, step: number, direction: 1 | -1) {
    const rounded = tickAtOrBeyond(value, step, direction);
    // Against the *snapped* value: `tickAtOrBeyond` snaps what it returns, so
    // comparing it with the raw datum makes `0.1 + 0.2` look like it is not on
    // the 0.3 tick it was rounded onto. The bound would then be 0.3 — below the
    // value — and the bar would poke out of the top of the box.
    const beyond =
        rounded === snapNumber(value)
            ? snapNumber(rounded + direction * step)
            : rounded;
    // Adding a step to a value near the top of the double range overflows to
    // `Infinity`, which `formatNumber` writes as `null` — so a bar of
    // `Number.MAX_VALUE` would put a literal `null` in the bounding box. Stay
    // at the value itself rather than leave the box unrepresentable; the bar
    // then touches the frame, which is a far smaller problem.
    return Number.isFinite(beyond) ? beyond : value;
}

/**
 * An axis wide enough for the data, ending on values a reader recognizes.
 *
 * Run twice, because the box is wider than the data it was built around: a step
 * chosen from the data alone can be a magnitude too small for the box it ends up
 * in, which would leave the axis labeled far more finely than the five-or-so
 * intervals asked for.
 *
 * `baseline` is the value the axis has to contain, and to sit exactly on when
 * the data is all to one side of it. That is zero for a bar chart, whose bars
 * are measured from it and would otherwise be drawn as lengths that mean
 * nothing; it is `null` for a scatter or a line, whose points are measured from
 * nothing, so the axis is free to start where the data does. Forcing zero into
 * the axis of a scatter of adult heights would push every point into the top
 * fifth of the picture and leave four-fifths of it empty.
 */
export function autoAxisBounds({
    low,
    high,
    minStep,
    baseline,
}: {
    low: number;
    high: number;
    minStep: number;
    baseline: number | null;
}): [number, number] {
    function boundsFor(step: number): [number, number] {
        if (baseline === null) {
            // A run of identical values has no span to divide, so the axis is
            // one step either side of them rather than a line of no height at
            // all — which is the same reason an empty bar chart still gets a
            // box one tick tall.
            if (!(high > low)) {
                // The step has to be one the value can be moved by. A step
                // below the value's own precision leaves the bound exactly
                // where it started — `1e20 - 1` is `1e20` — and the box comes
                // out with no extent at all, which PreFigure resolves to `nan`
                // in every coordinate it draws: a chart of `1e20 1e20` rendered
                // as an empty picture. Where that happens the step grows to the
                // magnitude of the data, which is the smallest separation a
                // double still represents there. A bar chart never reaches
                // this, since its axis runs from the baseline to the data and
                // so always has a span.
                const spread =
                    low - step < low && high + step > high
                        ? step
                        : Math.max(
                              step,
                              niceTickStep(Math.abs(low) || 1, minStep),
                          );
                const lowBound = snapNumber(low - spread);
                const highBound = snapNumber(high + spread);
                // Widening past the top of the double range overflows to
                // `Infinity`, which `formatNumber` writes as `null`. Staying at
                // the value leaves the data on the frame, and the other bound
                // has already moved, so there is still a box.
                return [
                    Number.isFinite(lowBound) ? lowBound : low,
                    Number.isFinite(highBound) ? highBound : high,
                ];
            }
            return [
                nextTickBeyond(low, step, -1),
                nextTickBeyond(high, step, 1),
            ];
        }
        return [
            low >= baseline ? baseline : nextTickBeyond(low, step, -1),
            high <= baseline
                ? snapNumber(baseline + step)
                : nextTickBeyond(high, step, 1),
        ];
    }

    const [firstMin, firstMax] = boundsFor(
        niceTickStep(high - low || 1, minStep),
    );
    return boundsFor(niceTickStep(firstMax - firstMin, minStep));
}

/**
 * The author's bounds when they describe a box there is room to draw in, and
 * the automatic ones otherwise.
 *
 * A box of zero or negative height has no drawing in it to be worth honoring
 * the author's request over. `NaN` fails the comparison on its own, but an
 * infinity does not: `yMin="-Infinity"` compares as below every `yMax` and
 * would reach `formatNumber`, which answers `null` for anything non-finite and
 * would write the literal `null` into the bounding box.
 */
export function reconcileBounds(
    requestedMin: number | null,
    requestedMax: number | null,
    autoMin: number,
    autoMax: number,
): [number, number] {
    const min = requestedMin ?? autoMin;
    const max = requestedMax ?? autoMax;
    if (!Number.isFinite(min) || !Number.isFinite(max) || !(min < max)) {
        return [autoMin, autoMax];
    }
    return [min, max];
}

/**
 * The spacing between labeled values on an axis that ended up spanning
 * `min` to `max`.
 *
 * Settled against the box that was drawn rather than against the data alone:
 * `yMin="0" yMax="1000"` over a single bar of height 1 would otherwise keep the
 * step the data asked for and label the axis a thousand times.
 */
export function tickStepForBounds(
    min: number,
    max: number,
    wholeValues: boolean,
) {
    return niceTickStep(
        max - min,
        wholeValues && Number.isInteger(min) && Number.isInteger(max) ? 1 : 0,
    );
}
