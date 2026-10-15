// The synthetic shapes, one mechanism each, written in the DoenetML every
// core reads: `<mathInput>` for inputs, `<number>` for numeric dependency
// (a `<math>` chain is a symbolic expression in every core and measures
// something else), `<math>` only where the mechanism is symbolic.
export function generate(spec) {
    const m = /^([a-z]+)-(\d+)$/.exec(spec);
    if (!m || !(m[1] in shapes)) throw new Error(`no generator for ${spec}`);
    return shapes[m[1]](Number(m[2]));
}

const shapes = {
    /** One input through N serial numeric operators to a draggable point. */
    chain(n) {
        const ops = ["$prev + 1", "1.0001 $prev", "-$prev", "$prev - 1"];
        const lines = ['<mathInput name="n" prefill="1"/>'];
        for (let i = 0; i < n; i++) {
            const prev = i === 0 ? "$n" : `$c${i - 1}`;
            lines.push(`<number name="c${i}">${ops[i % ops.length].replace("$prev", prev)}</number>`);
        }
        lines.push(`<graph name="g"><point name="p" x="$c${n - 1}" y="$n"/></graph>`);
        return lines.join("\n") + "\n";
    },
    /** N free points in one graph; the first is dragged. The one shape every core can run. */
    points(n) {
        const lines = ['<graph name="g">'];
        for (let i = 0; i < n; i++) lines.push(`  <point name="p${i}" x="${(i % 19) - 9}" y="${(Math.floor(i / 19) % 19) - 9}"/>`);
        lines.push("</graph>");
        return lines.join("\n") + "\n";
    },
    /** One input read by N numbers, each positioning a point. */
    fanout(n) {
        const lines = ['<mathInput name="n" prefill="1"/>', '<graph name="g">'];
        for (let i = 0; i < n; i++) {
            lines.push(`  <number name="o${i}">${(1 + (i % 10) / 10).toFixed(1)} $n</number><point name="p${i}" x="$o${i}" y="${i}"/>`);
        }
        lines.push("</graph>");
        return lines.join("\n") + "\n";
    },
    /**
     * A repeat whose length is an input, with one free point beside it: the
     * drag measures a tick in a document of N iterations (points inside the
     * repeat sit too close together for a pointer to pick one by name).
     */
    repeat(n) {
        return [
            `<mathInput name="n" prefill="${n}"/>`,
            '<graph name="g">',
            // Off the line y = x/2 the repeat's points lie on, so a pointer
            // at q finds q.
            '<point name="q" x="5" y="-5"/>',
            '<repeatForSequence name="r" from="-9" step="0.18" length="$n" valueName="v">',
            '<number name="h">0.5 $v</number>',
            '<point name="p" x="$v" y="$h"/>',
            "</repeatForSequence>",
            "</graph>",
        ].join("\n") + "\n";
    },
    /** A chain of simplified symbolic expressions with a free variable, evaluated every third step. */
    symchain(n) {
        const lines = ['<mathInput name="mi" prefill="x^2+1"/>', '<mathInput name="t" prefill="1"/>'];
        const coef = [1, 2, 4, 5, 2, 3, 5];
        for (let i = 0; i < n; i++) {
            const prev = i === 0 ? "$mi" : `$m${i - 1}`;
            const sign = i % 2 === 0 ? "+" : "-";
            if (i % 3 === 2) {
                lines.push(`<evaluate name="e${i}" function="${prev}" input="$t"/>`);
                lines.push(`<math name="m${i}" simplify>${prev} + 0.001 $e${i}</math>`);
            } else {
                lines.push(`<math name="m${i}" simplify>${prev} ${sign} ${coef[i % coef.length]} x</math>`);
            }
        }
        return lines.join("\n") + "\n";
    },
    /** N math inputs, each checked by an answer. */
    answers(n) {
        const correct = ["(x+1)^2", "2x^2-3x+1", "sin(x)^2+3", "(x-4)(x+4)", "e^x + 5"];
        const lines = [];
        for (let i = 0; i < n; i++) {
            lines.push(`<p><answer name="a${i}"><mathInput name="mi${i}"/><award>${correct[i % correct.length]}</award></answer></p>`);
        }
        return lines.join("\n") + "\n";
    },
    /** A three-way conditional over graphs of N points each, chosen by an input. */
    adventure(n) {
        const lines = ['<mathInput name="path" prefill="1"/>'];
        for (let c = 1; c <= 3; c++) {
            const pts = Array.from({ length: n }, (_, i) => `<point x="${i % 17}" y="${(i * 7 + c) % 17}"/>`).join("");
            lines.push(`<conditionalContent name="a${c}"><case condition="$path = ${c}"><number name="score">${c}</number><graph>${pts}</graph></case></conditionalContent>`);
        }
        return lines.join("\n") + "\n";
    },
};
