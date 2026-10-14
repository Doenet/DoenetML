//! Synthetic DoenetML documents along three scale axes: number of
//! independent points (N), chain length (L), and fan-out (K). Every
//! generator writes plain DoenetML (no prototype-only tags), so the same
//! documents can be fed to the current core.

use std::fmt::Write;

/// N free points in one graph. Cells: 2N + 4. No derived cells.
pub fn points(n: usize) -> String {
    let mut s = String::from("<graph name=\"g\">\n");
    for i in 0..n {
        let _ = writeln!(
            s,
            "  <point name=\"p{i}\" x=\"{}\" y=\"{}\"/>",
            i % 20,
            (i * 7) % 20
        );
    }
    s.push_str("</graph>\n");
    s
}

/// One input feeding a chain of L maths, ending at a point's x.
/// Cells: L + 1 + 4. Derived: L. The chain alternates offset, scale and
/// negate so that every value changes when the input does; the last link
/// is a `<clampNumber>` so the point stays inside the graph for dragging.
pub fn chain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let last = math_chain(&mut s, l, true);
    let _ = writeln!(
        s,
        "<graph name=\"g\"><point name=\"p\" x=\"${last}\" y=\"$n\"/></graph>"
    );
    s
}

/// L maths `c0..` from `$n`, alternating offset, scale and negate so every
/// value changes when the input does, each lowered to one numeric operator
/// at build time; with `clamp_last` the last is a `<clampNumber>`, keeping
/// a point inside the graph. Returns the last name.
fn math_chain(s: &mut String, l: usize, clamp_last: bool) -> String {
    let mut prev = "n".to_string();
    for i in 0..l {
        let name = format!("c{i}");
        if clamp_last && i + 1 == l {
            let _ = writeln!(s, "{}", clamp(&name, &prev));
        } else {
            let body = match i % 3 {
                0 => format!("${prev} + 1"),
                1 => format!("1.0001 ${prev}"),
                _ => format!("-${prev}"),
            };
            let _ = writeln!(s, "<math name=\"{name}\">{body}</math>");
        }
        prev = name;
    }
    prev
}

/// `$prev` held in the graph's range, as the last link of a chain.
fn clamp(name: &str, prev: &str) -> String {
    format!("<clampNumber name=\"{name}\" lowerValue=\"-9\" upperValue=\"9\">${prev}</clampNumber>")
}

/// One input feeding K maths, each driving one point's x.
/// Cells: 1 + K + K + 4. Derived: K.
pub fn fanout(k: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\">\n");
    for i in 0..k {
        let _ = writeln!(
            s,
            "  <math name=\"o{i}\">{} $n</math><point name=\"p{i}\" x=\"$o{i}\" y=\"{}\"/>",
            1.0 + (i % 10) as f64 / 10.0,
            i % 20
        );
    }
    s.push_str("</graph>\n");
    s
}

/// One point and N copies of it. Cells: 2 + 4 regardless of N; exercises
/// alias merging and the size of the render tree relative to the cell array.
pub fn aliases(n: usize) -> String {
    let mut s = String::from("<graph name=\"g\">\n  <point name=\"p\" x=\"1\" y=\"2\"/>\n");
    for _ in 0..n {
        s.push_str("  $p\n");
    }
    s.push_str("</graph>\n");
    s
}

/// N independent chains of length L, each from its own input to its own
/// point, all points in one graph. Cells: N(L + 2) + 4. Derived: NL.
pub fn grid(n: usize, l: usize) -> String {
    let mut s = String::new();
    let mut points = String::from("<graph name=\"g\">\n");
    for j in 0..n {
        let _ = writeln!(s, "<numberInput name=\"n{j}\" value=\"{}\"/>", j % 10);
        let mut prev = format!("n{j}");
        for i in 0..l {
            let name = format!("c{j}_{i}");
            let body = if i % 2 == 0 {
                format!("${prev} + 1")
            } else {
                format!("-${prev}")
            };
            let _ = writeln!(s, "<math name=\"{name}\">{body}</math>");
            prev = name;
        }
        let _ = writeln!(
            points,
            "  <point name=\"p{j}\" x=\"${prev}\" y=\"{}\"/>",
            j % 20
        );
    }
    points.push_str("</graph>\n");
    s + &points
}

/// A slider bound through a chain of L maths to an input, with a point
/// showing the slider's value. Dragging the slider inverts through the
/// slider's own snap chain and then through the L maths to the input.
/// Cells: L + 1 (chain) + 3 + 11 (slider) + 2 + 4.
pub fn slider_chain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let last = math_chain(&mut s, l, false);
    let _ = writeln!(
        s,
        "<slider name=\"s\" from=\"-9\" to=\"9\" step=\"0.5\" bindValueTo=\"${last}\"/>"
    );
    let _ = writeln!(
        s,
        "<graph name=\"g\"><point name=\"p\" x=\"$s\" y=\"0\"/></graph>"
    );
    s
}

/// K sliders, each bound to the previous one with a different step, the
/// first holding the stored value; a point shows the last. Dragging the
/// last slider runs K snap chains in sequence.
pub fn slider_stack(k: usize) -> String {
    let mut s = String::from(
        "<slider name=\"s0\" from=\"-9\" to=\"9\" step=\"0.25\" initialValue=\"1\"/>\n",
    );
    for i in 1..k {
        let step = if i % 2 == 0 { "0.25" } else { "0.5" };
        let _ = writeln!(
            s,
            "<slider name=\"s{i}\" from=\"-9\" to=\"9\" step=\"{step}\" bindValueTo=\"$s{}\"/>",
            i - 1
        );
    }
    let _ = writeln!(
        s,
        "<graph name=\"g\"><point name=\"p\" x=\"$s{}\" y=\"0\"/></graph>",
        k.saturating_sub(1)
    );
    s
}

/// N points from a repeat whose length is a numberInput, each with a
/// derived y, plus a collect of the points into a second graph. Changing the
/// input rebuilds the document; dragging a point goes through the alias
/// into the iteration's own essential cells. Cells per iteration: x, y,
/// scaled y (3) plus the hidden sequence value chain (4).
pub fn repeat(n: usize) -> String {
    // Spread the points across the graph whatever N is.
    let step = 18.0 / n.max(2) as f64;
    // The default cap is 10,000 iterations; lift it for the larger sizes.
    let cap = n.max(10_000) * 2;
    format!(
        "<numberInput name=\"n\" value=\"{n}\"/>\n\
<graph name=\"g\">\n\
  <repeatForSequence name=\"r\" from=\"-9\" step=\"{step}\" length=\"$n\" maxNumber=\"{cap}\" valueName=\"v\">\n\
    <math name=\"h\">0.5 $v</math>\n\
    <point name=\"p\" x=\"$v\" y=\"$h\"/>\n\
    <point name=\"q\" x=\"0\" y=\"0\"/>\n\
  </repeatForSequence>\n\
</graph>\n\
<graph name=\"g2\"><collect name=\"c\" componentType=\"point\" from=\"$g\"/></graph>\n"
    )
}

/// A lagged recurrence: x_k = 1.001 * x_(k-2), seeded from an input, with a
/// point per iteration. Written as a `<functionIterates>` over pairs,
/// `(a, b) -> (b, 1.001 a)` from `(seed, seed)`, whose second entry is
/// x_k; a `<repeat>` over the iterates places the points. Dragging the last
/// point inverts down the chain of iterates into the seed. Cells per
/// iteration: the hidden tuple (9) + the point (3).
pub fn recur(n: usize) -> String {
    format!(
        "<numberInput name=\"n\" value=\"{n}\"/>\n\
<numberInput name=\"seed\" value=\"1\"/>\n\
<setup>\n\
  <function name=\"f\" variables=\"a b\">(b, 1.001 a)</function>\n\
  <math name=\"x0\">($seed, $seed)</math>\n\
  <functionIterates name=\"it\" function=\"$f\" initialValue=\"$x0\" numIterates=\"$n\"/>\n\
</setup>\n\
<graph name=\"g\">\n\
  <repeat name=\"r\" for=\"$it.iterates\" valueName=\"t\">\n\
    <point name=\"p\" x=\"$t[2]\" y=\"0\"/>\n\
  </repeat>\n\
</graph>\n"
    )
}

/// Like `chain`, but every other math is a `round`, so half the cells
/// carry an integer invariant and every drag inverts through L/2 projections.
/// Compared against `chain-L` to show integer-valued cells cost nothing.
pub fn intchain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let mut prev = "n".to_string();
    for i in 0..l {
        let name = format!("c{i}");
        if i + 1 == l {
            let _ = writeln!(s, "{}", clamp(&name, &prev));
        } else {
            let body = if i % 2 == 0 {
                format!("${prev} + 0.5")
            } else {
                format!("round(${prev})")
            };
            let _ = writeln!(s, "<math name=\"{name}\">{body}</math>");
        }
        prev = name;
    }
    let _ = writeln!(
        s,
        "<graph name=\"g\"><point name=\"p\" x=\"${prev}\" y=\"$n\"/></graph>"
    );
    s
}

/// N points whose `hide` is bound to one booleanInput. Toggling it changes
/// N cells and mounts or unmounts N circles.
pub fn hidden(n: usize) -> String {
    let mut s = String::from("<booleanInput name=\"b\" value=\"false\"/>\n<graph name=\"g\">\n");
    for i in 0..n {
        let _ = writeln!(
            s,
            "  <point name=\"p{i}\" x=\"{}\" y=\"{}\" hide=\"$b\"/>",
            (i % 17) as i64 - 8,
            ((i * 7) % 17) as i64 - 8
        );
    }
    s.push_str("</graph>\n");
    s
}

/// N circles, each through three of its own points, in one graph; a
/// numberInput drives the x of every first point so one request moves N
/// circumcenters. Dragging a circle's center fans out to its three points
/// (plan 3 sanity run). Cells per circle: 6 point cells + 3 derived.
pub fn circles3(n: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"0\"/>\n<graph name=\"g\">\n");
    for i in 0..n {
        let (x, y) = ((i % 17) as f64 - 8.0, ((i * 7) % 17) as f64 - 8.0);
        let _ = writeln!(
            s,
            "  <point name=\"a{i}\" x=\"$n\" y=\"{y}\"/><point name=\"b{i}\" x=\"{}\" y=\"{}\"/><point name=\"c{i}\" x=\"{}\" y=\"{}\"/><circle name=\"k{i}\" through=\"$a{i} $b{i} $c{i}\"/>",
            x + 1.0,
            y,
            x,
            y + 1.0
        );
    }
    s.push_str("</graph>\n");
    s
}

/// Plan 4: `n` free polygons of 4 to 6 vertices on a grid, in one sticky
/// group (or, with `sticky` false, the same polygons with no group, as the
/// baseline). Every fourth polygon is rigid. Polygon `p0` is the one dragged.
pub fn sticky(n: usize, sticky: bool) -> String {
    let mut s = String::from("<graph name=\"g\">\n");
    if sticky {
        s.push_str("<stickyGroup name=\"sg\">\n");
    }
    let side = (n as f64).sqrt().ceil() as usize;
    for i in 0..n {
        let (cx, cy) = ((i % side) as f64 * 3.0, (i / side) as f64 * 3.0);
        let k = 4 + i % 3;
        let verts: Vec<String> = (0..k)
            .map(|j| {
                let t = std::f64::consts::TAU * j as f64 / k as f64;
                format!(
                    "({},{})",
                    cx + (t.cos() * 100.0).round() / 100.0,
                    cy + (t.sin() * 100.0).round() / 100.0
                )
            })
            .collect();
        let rigid = if i % 4 == 3 { " rigid" } else { "" };
        let _ = writeln!(
            s,
            "  <polygon name=\"p{i}\" vertices=\"{}\"{rigid}/>",
            verts.join(" ")
        );
    }
    if sticky {
        s.push_str("</stickyGroup>\n");
    }
    s.push_str("</graph>\n");
    s
}

/// Plan 5, fixture 1: N answers, each a mathInput response checked against
/// a symbolic correct answer. Typing into one costs a parse; submitting one
/// costs one `equals`.
pub fn answers(n: usize) -> String {
    let mut s = String::new();
    for i in 0..n {
        let _ = writeln!(
            s,
            "<mathInput name=\"mi{i}\"/><answer name=\"a{i}\" response=\"$mi{i}\">{}</answer>",
            correct_answer(i)
        );
    }
    s
}

/// The correct answer of `answers`' i-th question.
pub fn correct_answer(i: usize) -> String {
    let k = i % 7 + 1;
    match i % 4 {
        0 => format!("(x+{k})^2"),
        1 => format!("{k}x^2-{}x+1", k + 1),
        2 => format!("sin(x)^2+{k}"),
        _ => format!("(x-{k})(x+{k})"),
    }
}

/// Plan 5, fixture 2: N functions with cell leaves, each with its
/// derivative, all drawn as curves in one graph. `a` is shared by every
/// function (dragging it re-derives and resamples all N); `b{i}` belongs to
/// one.
pub fn curves(n: usize) -> String {
    let mut s = String::from("<numberInput name=\"a\" value=\"1\"/>\n");
    for i in 0..n {
        let _ = writeln!(s, "<numberInput name=\"b{i}\" value=\"{}\"/>", i % 5);
    }
    s.push_str("<graph name=\"g\" xmin=\"-5\" xmax=\"5\">\n");
    for i in 0..n {
        let _ = writeln!(
            s,
            "  <function name=\"f{i}\">$a x^2 + $b{i} x + {}</function><derivative name=\"df{i}\">$f{i}</derivative>",
            i % 7
        );
    }
    s.push_str("</graph>\n");
    s
}

/// Plan 5, fixture 3: a mathInput feeding a chain of N simplified maths
/// and a fan-out of N more. Every third chain link goes through a number:
/// the previous math evaluated at `t`, fed back into the next math (math →
/// number → math). Typing reruns everything; dragging `t` reruns the chain
/// from the first evaluate on.
pub fn symchain(n: usize) -> String {
    let mut s = String::from(
        "<mathInput name=\"mi\" prefill=\"x^2+1\"/>\n<numberInput name=\"t\" value=\"1\"/>\n",
    );
    let mut prev = "mi".to_string();
    for i in 0..n {
        let k = i % 5 + 1;
        let body = match i % 3 {
            0 => format!("${prev} + {k} x"),
            1 => format!("${prev} - {k} x"),
            _ => {
                let _ = writeln!(
                    s,
                    "<evaluate name=\"e{i}\" function=\"${prev}\" input=\"$t\"/>"
                );
                format!("${prev} + 0.001 $e{i}")
            }
        };
        let _ = writeln!(s, "<math name=\"m{i}\" simplify>{body}</math>");
        prev = format!("m{i}");
    }
    for i in 0..n {
        let _ = writeln!(
            s,
            "<math name=\"f{i}\" simplify>{} $mi + x</math>",
            i % 9 + 1
        );
    }
    s
}

/// Plan 6, use case 1: N small reactive choices that change wording, all
/// driven by one input `n` (1, -1 or 0 flips every one of them), plus a
/// point `p0` to drag that no choice reads. Each choice's interface is a
/// `<math>` and a `<number>`, both copied outside it.
pub fn wording(n: usize) -> String {
    let mut s = String::from(
        "<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\"><point name=\"p0\" x=\"1\" y=\"2\"/></graph>\n",
    );
    for i in 0..n {
        let a = i % 9 + 1;
        let _ = writeln!(
            s,
            "<p><conditionalContent name=\"c{i}\"><case condition=\"$n > 0\">Positive: <math name=\"m\">{a}x+1</math> and <number name=\"k\">{i}</number>.</case><case condition=\"$n < 0\">Negative: <math name=\"m\">x-{a}</math> and <number name=\"k\">-{i}</number>.</case><else>Zero: <math name=\"m\">0</math> and <number name=\"k\">0</number>.</else></conditionalContent></p><p>$c{i}.m, $c{i}.k</p>"
        );
    }
    s
}

/// `wording` with the first case's content written out and no choices: the
/// same visible document, for comparison.
pub fn wording_flat(n: usize) -> String {
    let mut s = String::from(
        "<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\"><point name=\"p0\" x=\"1\" y=\"2\"/></graph>\n",
    );
    for i in 0..n {
        let a = i % 9 + 1;
        let _ = writeln!(
            s,
            "<p>Positive: <math name=\"m{i}\">{a}x+1</math> and <number name=\"k{i}\">{i}</number>.</p><p>$m{i}, $k{i}</p>"
        );
    }
    s
}

/// `wording` with all three cases' content written out and no choices:
/// the same content the built mechanism holds, without the machinery.
pub fn wording_all(n: usize) -> String {
    let mut s = String::from(
        "<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\"><point name=\"p0\" x=\"1\" y=\"2\"/></graph>\n",
    );
    for i in 0..n {
        let a = i % 9 + 1;
        let _ = writeln!(
            s,
            "<p>Positive: <math name=\"m{i}\">{a}x+1</math> and <number name=\"k{i}\">{i}</number>. Negative: <math name=\"mn{i}\">x-{a}</math> and <number name=\"kn{i}\">-{i}</number>. Zero: <math name=\"mz{i}\">0</math> and <number name=\"kz{i}\">0</number>.</p><p>$m{i}, $k{i}</p>"
        );
    }
    s
}

/// `select` with every option's content written out and no select.
pub fn select_all(n: usize) -> String {
    let mut s = String::new();
    for i in 0..n {
        s.push_str("<p>");
        for o in 1..=4 {
            let _ = write!(
                s,
                "Pick {o}: <number name=\"v{i}_{o}\">{}</number> <math name=\"m{i}_{o}\">x+{o}</math>",
                i * 4 + o
            );
        }
        let _ = writeln!(s, " $v{i}_1</p>");
    }
    s
}

/// Plan 6, use case 2: a chain of K reactive choices of 4 branches, each
/// branch a graph of `size - 2` points and a `score` in the interface;
/// choice j's conditions read choice j-1's score, so changing `path`
/// flips the whole chain.
pub fn adventure(k: usize, size: usize) -> String {
    let mut s = String::from("<numberInput name=\"path\" value=\"1\"/>\n");
    for j in 0..k {
        let _ = write!(s, "<conditionalContent name=\"a{j}\">");
        for b in 1..=4 {
            let cond = if j == 0 {
                format!("$path = {b}")
            } else {
                format!("$a{}.score = {b}", j - 1)
            };
            let open = if b == 4 {
                "<else>".to_string()
            } else {
                format!("<case condition=\"{cond}\">")
            };
            let _ = write!(s, "{open}<number name=\"score\">{b}</number><graph>");
            for i in 0..size.saturating_sub(2) {
                let _ = write!(
                    s,
                    "<point x=\"{}\" y=\"{}\"/>",
                    (i * b) % 17,
                    (i * 7 + j) % 17
                );
            }
            let _ = write!(s, "</graph>{}", if b == 4 { "</else>" } else { "</case>" });
        }
        s.push_str("</conditionalContent>\n");
    }
    let _ = writeln!(
        s,
        "<number name=\"end\">$a{}.score</number>",
        k.saturating_sub(1)
    );
    s
}

/// Plan 6, load-time choices: N selects of 4 options, each option a
/// sentence with a `<number>` and a `<math>`, the number copied outside.
pub fn select(n: usize) -> String {
    let mut s = String::new();
    for i in 0..n {
        let _ = write!(s, "<p><select name=\"s{i}\">");
        for o in 1..=4 {
            let _ = write!(
                s,
                "<option>Pick {o}: <number name=\"v\">{}</number> <math name=\"m\">x+{o}</math></option>",
                i * 4 + o
            );
        }
        let _ = writeln!(s, "</select> $s{i}.v</p>");
    }
    s
}

/// `select` with only one option's content written out.
pub fn select_flat(n: usize) -> String {
    let mut s = String::new();
    for i in 0..n {
        let _ = writeln!(
            s,
            "<p>Pick 1: <number name=\"v{i}\">{}</number> <math name=\"m{i}\">x+1</math> $v{i}</p>",
            i * 4 + 1
        );
    }
    s
}

/// Parse a CLI-style spec such as `chain-1000` or `grid-100x10`.
pub fn from_spec(spec: &str) -> Option<String> {
    let (shape, size) = spec.split_once('-')?;
    // The size of the one-number shapes; `grid` takes `NxL`.
    let n = size.parse::<usize>().ok();
    Some(match shape {
        "points" => points(n?),
        "chain" => chain(n?),
        "fanout" => fanout(n?),
        "aliases" => aliases(n?),
        "sliderchain" => slider_chain(n?),
        "sliderstack" => slider_stack(n?),
        "repeat" => repeat(n?),
        "recur" => recur(n?),
        "intchain" => intchain(n?),
        "hidden" => hidden(n?),
        "circles3" => circles3(n?),
        "sticky" => sticky(n?, true),
        "stickyfree" => sticky(n?, false),
        "answers" => answers(n?),
        "curves" => curves(n?),
        "symchain" => symchain(n?),
        "grid" => {
            let (n, l) = size.split_once('x')?;
            grid(n.parse().ok()?, l.parse().ok()?)
        }
        "wording" => wording(n?),
        "wordingflat" => wording_flat(n?),
        "adventure" => adventure(n?, 2000),
        "wordingall" => wording_all(n?),
        "select" => select(n?),
        "selectall" => select_all(n?),
        "selectflat" => select_flat(n?),
        _ => return None,
    })
}

/// The bench set used by `scripts/gen-fixtures.sh` and the benches: one to
/// three sizes per shape, small enough that a criterion run takes minutes.
/// The smallest size of each shape is also a golden document
/// (`crates/cells-bench/examples/golden.rs`).
pub const DEFAULT_SWEEP: &[&str] = &[
    "points-100",
    "points-1000",
    "points-10000",
    "chain-100",
    "chain-1000",
    "chain-100000",
    "fanout-100",
    "fanout-1000",
    "fanout-10000",
    "aliases-1000",
    "grid-100x10",
    "grid-1000x10",
    "sliderchain-10",
    "sliderchain-1000",
    "sliderstack-10",
    "sliderstack-1000",
    "repeat-100",
    "repeat-1000",
    "repeat-10000",
    "recur-100",
    "recur-1000",
    "intchain-1000",
    "hidden-1000",
    "circles3-1000",
    "sticky-100",
    "sticky-1000",
    "stickyfree-100",
    "stickyfree-1000",
    "answers-10",
    "answers-100",
    "curves-10",
    "curves-100",
    "symchain-10",
    "symchain-1000",
    "wording-100",
    "wording-1000",
    "wordingflat-100",
    "wordingflat-1000",
    "adventure-1",
    "adventure-3",
    "select-100",
    "select-1000",
    "selectflat-100",
    "selectflat-1000",
    "wordingall-100",
    "wordingall-1000",
    "selectall-100",
    "selectall-1000",
];
