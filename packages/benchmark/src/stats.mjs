// The statistics every layer and page reports: medians and quantiles of
// the finite values of a sample.

/**
 * The median of the finite values of `xs`, or NaN when there are none.
 * @param {number[]} xs
 * @returns {number}
 */
export function median(xs) {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    if (!s.length) return NaN;
    return s.length % 2
        ? s[s.length >> 1]
        : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
}

/**
 * The `p` quantile (0 to 1) of the finite values of `xs`, taken as the
 * sample at that rank, or NaN when there are none.
 * @param {number[]} xs
 * @param {number} p
 * @returns {number}
 */
export function quantile(xs, p) {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    if (!s.length) return NaN;
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
}
