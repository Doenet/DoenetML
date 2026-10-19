// The synthetic shapes: one mechanism each, at any size. Each shape gives
// the DoenetML text, the primary action (two drags, alternated so every
// tick changes something), where the dragged point starts (`start`, so a
// page can find it on screen without asking the core) and a value check:
// one more drag to a known place, and the values the document must then
// hold, which the shape computes itself. Every shape is driven by dragging a point, which every
// core supports; only `symbolic` needs math the Rust core does not have.
//
// `n` is the number of elements the mechanism runs through: the chain's
// links, the fan's numbers, the repeat's iterations.

// `BENCH_SIZES=10,100` overrides them, for a quick check of the harness;
// such a run is not one to compare.
export const SIZES = process.env.BENCH_SIZES
    ? process.env.BENCH_SIZES.split(",").map(Number)
    : [1000, 10000, 100000];

/** A free point `p` at (x, 0) in a graph. */
const point = (name, x) =>
    `<graph name="g"><point name="${name}" x="${x}" y="0"/></graph>`;
const drag = (target, x) => ({ action: "movePoint", target, x, y: 0 });

export const shapes = {
    depth: {
        mechanism:
            "forward propagation through a long serial path: a dragged point feeds a chain of n numbers",
        generate(n) {
            const lines = [
                point("p", 1),
                '<number name="c0">$p.x + 1</number>',
            ];
            for (let i = 1; i < n; i++)
                lines.push(`<number name="c${i}">$c${i - 1} + 1</number>`);
            return {
                text: lines.join("\n") + "\n",
                steps: [drag("p", 2), drag("p", 3)],
                start: [1, 0],
                check: {
                    step: drag("p", 5),
                    values: { c0: 6, [`c${n - 1}`]: 5 + n },
                },
            };
        },
    },
    breadth: {
        mechanism:
            "forward propagation across a wide set: a dragged point feeds n independent numbers",
        generate(n) {
            const lines = [point("p", 1)];
            for (let i = 0; i < n; i++)
                lines.push(`<number name="o${i}">$p.x + ${i}</number>`);
            return {
                text: lines.join("\n") + "\n",
                steps: [drag("p", 2), drag("p", 3)],
                start: [1, 0],
                check: {
                    step: drag("p", 5),
                    values: { o0: 5, [`o${n - 1}`]: 5 + n - 1 },
                },
            };
        },
    },
    inversion: {
        mechanism:
            "a request walked back through n operators: dragging the point at the end of a chain moves the free point at its start",
        generate(n) {
            // The chain starts n - 1 below s, so p lands on s's x, in view
            // beside it (s at y = 1, p at y = 0), where a pointer can drag it.
            const lines = [
                '<graph name="g">',
                '<point name="s" x="1" y="1"/>',
                `<point name="p" x="$c${n - 1}" y="0"/>`,
                "</graph>",
                `<number name="c0">$s.x - ${n - 1}</number>`,
            ];
            for (let i = 1; i < n; i++)
                lines.push(`<number name="c${i}">$c${i - 1} + 1</number>`);
            return {
                text: lines.join("\n") + "\n",
                steps: [drag("p", 2), drag("p", 3)],
                start: [1, 0],
                check: {
                    step: drag("p", 5),
                    values: { c0: 6 - n, [`c${n - 1}`]: 5 },
                },
            };
        },
    },
    symbolic: {
        mechanism:
            "symbolic work: a chain of n simplified expressions in x, fed by a dragged point and evaluated at its end",
        generate(n) {
            const coef = [1, 2, 4, 5, 2, 3, 5];
            const lines = [
                point("p", 1),
                '<math name="m0" simplify>$p.x x^2 + 1</math>',
            ];
            // m(n-1) = p.x x^2 + 1 + k x, so its value at x = 1 is p.x + 1 + k.
            let k = 0;
            for (let i = 1; i < n; i++) {
                const c = coef[i % coef.length];
                const sign = i % 2 === 0 ? "+" : "-";
                k += sign === "+" ? c : -c;
                lines.push(
                    `<math name="m${i}" simplify>$m${i - 1} ${sign} ${c} x</math>`,
                );
            }
            // Read through a number: not every adapter exposes an evaluate's value.
            lines.push(
                `<evaluate name="e" function="$m${n - 1}" input="1"/>`,
                '<number name="ev">$e</number>',
            );
            return {
                text: lines.join("\n") + "\n",
                steps: [drag("p", 2), drag("p", 3)],
                start: [1, 0],
                check: { step: drag("p", 5), values: { ev: 5 + 1 + k } },
            };
        },
    },
    rebuild: {
        mechanism:
            "a structural change: dragging a point sets a repeat's length, between n and n - 1 iterations of a number and a point",
        generate(n) {
            // The length is p's x plus n, so p sits at the origin, in view,
            // where a pointer can drag it.
            const lines = [
                point("p", 0),
                `<number name="len">$p.x + ${n}</number>`,
                `<repeatForSequence name="r" length="$len" valueName="v">`,
                // Two elements: a body of one value is a value list in the JS
                // core, whose iterations are not components.
                '<number name="h">2 $v</number><point name="q" x="$h" y="1"/>',
                "</repeatForSequence>",
            ];
            return {
                text: lines.join("\n") + "\n",
                steps: [drag("p", -1), drag("p", 0)],
                start: [0, 0],
                check: {
                    step: drag("p", -1),
                    values: { [`r[${n - 1}].h`]: 2 * (n - 1) },
                },
            };
        },
    },
};

/**
 * The adapter floor: the primary action on a document of one free point,
 * what a tick costs through a core's adapter when it changes nothing else.
 */
export const floor = {
    mechanism: "the adapter floor: the drag on a document of one free point",
    generate() {
        return {
            text: point("p", 1) + "\n",
            steps: [drag("p", 2), drag("p", 3)],
            start: [1, 0],
            check: { step: drag("p", 5), values: {} },
        };
    },
};

const made = new Map();

/** The text, steps and check of `shape-n`, made once per process. */
export function generate(spec) {
    if (spec === "floor") return floor.generate();
    const m = /^([a-z]+)-(\d+)$/.exec(spec);
    if (!m || !(m[1] in shapes)) throw new Error(`no generator for ${spec}`);
    if (!made.has(spec)) made.set(spec, shapes[m[1]].generate(Number(m[2])));
    return made.get(spec);
}
