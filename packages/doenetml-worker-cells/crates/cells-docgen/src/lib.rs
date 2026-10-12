//! Synthetic DoenetML documents along three scale axes: number of
//! independent points (N), chain length (L), and fan-out (K). Each generator
//! returns DoenetML text so the same documents can be fed to the current core.

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

/// One input feeding a chain of L operators, ending at a point's x.
/// Cells: L + 1 + 4. Derived: L. The chain alternates offset, scale and
/// negate so that every value changes when the input does; the last
/// operator is a clamp so the point stays inside the graph for dragging.
pub fn chain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let last = op_chain(&mut s, l, true);
    let _ = writeln!(
        s,
        "<graph name=\"g\"><point name=\"p\" x=\"${last}\" y=\"$n\"/></graph>"
    );
    s
}

/// L operators `c0..` from `$n`, alternating offset, scale and negate so
/// every value changes when the input does; with `clamp_last` the last is a
/// clamp, keeping a point inside the graph. Returns the last name.
fn op_chain(s: &mut String, l: usize, clamp_last: bool) -> String {
    let mut prev = "n".to_string();
    for i in 0..l {
        let name = format!("c{i}");
        let op = match i % 3 {
            _ if clamp_last && i + 1 == l => "kind=\"clamp\" lo=\"-9\" hi=\"9\"",
            0 => "kind=\"offset\" k=\"1\"",
            1 => "kind=\"scale\" k=\"1.0001\"",
            _ => "kind=\"negate\"",
        };
        let _ = writeln!(s, "<op name=\"{name}\" {op} args=\"${prev}\"/>");
        prev = name;
    }
    prev
}

/// One input feeding K operators, each driving one point's x.
/// Cells: 1 + K + K + 4. Derived: K.
pub fn fanout(k: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\">\n");
    for i in 0..k {
        let _ = writeln!(
            s,
            "  <op name=\"o{i}\" kind=\"scale\" k=\"{}\" args=\"$n\"/><point name=\"p{i}\" x=\"$o{i}\" y=\"{}\"/>",
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
            let op = if i % 2 == 0 {
                "kind=\"offset\" k=\"1\""
            } else {
                "kind=\"negate\""
            };
            let _ = writeln!(s, "<op name=\"{name}\" {op} args=\"${prev}\"/>");
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

/// A slider bound through a chain of L operators to an input, with a point
/// showing the slider's value. Dragging the slider inverts through the
/// slider's own snap chain and then through the L operators to the input.
/// Cells: L + 1 (chain) + 3 + 11 (slider) + 2 + 4.
pub fn slider_chain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let last = op_chain(&mut s, l, false);
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
    <op name=\"h\" kind=\"scale\" k=\"0.5\" args=\"$v\"/>\n\
    <point name=\"p\" x=\"$v\" y=\"$h\"/>\n\
    <point name=\"q\" x=\"0\" y=\"0\"/>\n\
  </repeatForSequence>\n\
</graph>\n\
<graph name=\"g2\"><collect name=\"c\" componentType=\"point\" from=\"$g\"/></graph>\n"
    )
}

/// A lagged recurrence: x_k = 1.001 * x_(k-2), seeded from an input where
/// the lag has no referent, with a point per iteration. Dragging the last
/// point inverts down the chain into the seed. Cells per iteration: 4.
pub fn recur(n: usize) -> String {
    let cap = n.max(10_000) * 2;
    format!(
        "<numberInput name=\"n\" value=\"{n}\"/>\n\
<numberInput name=\"seed\" value=\"1\"/>\n\
<graph name=\"g\">\n\
  <repeatForSequence name=\"r\" length=\"$n\" maxNumber=\"{cap}\" indexName=\"i\">\n\
    <op name=\"prev\" kind=\"default\" args=\"$r[$i-2].x $seed\"/>\n\
    <op name=\"x\" kind=\"scale\" k=\"1.001\" args=\"$prev\"/>\n\
    <point name=\"p\" x=\"$x\" y=\"0\"/>\n\
  </repeatForSequence>\n\
</graph>\n"
    )
}

/// Like `chain`, but every other operator is a `round`, so half the cells
/// carry an integer invariant and every drag inverts through L/2 projections.
/// Compared against `chain-L` to show integer-valued cells cost nothing.
pub fn intchain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let mut prev = "n".to_string();
    for i in 0..l {
        let name = format!("c{i}");
        let op = if i + 1 == l {
            "kind=\"clamp\" lo=\"-9\" hi=\"9\""
        } else if i % 2 == 0 {
            "kind=\"offset\" k=\"0.5\""
        } else {
            "kind=\"round\""
        };
        let _ = writeln!(s, "<op name=\"{name}\" {op} args=\"${prev}\"/>");
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

/// `chain`, written with `<math>` instead of `<op>`: the same three
/// operations as math text, lowered to the same operators at build time, so
/// the tick cost should match `chain-L` exactly. The final clamp stays an
/// `<op>`, as it was when math text had no `clamp`, so the measured
/// fixtures are unchanged.
pub fn mathchain(l: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n");
    let mut prev = "n".to_string();
    for i in 0..l {
        let name = format!("c{i}");
        if i + 1 == l {
            let _ = writeln!(
                s,
                "<op name=\"{name}\" kind=\"clamp\" lo=\"-9\" hi=\"9\" args=\"${prev}\"/>"
            );
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
    let _ = writeln!(
        s,
        "<graph name=\"g\"><point name=\"p\" x=\"${prev}\" y=\"$n\"/></graph>"
    );
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

/// Parse a CLI-style spec such as `chain-1000` or `grid-100x10`.
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

/// The mechanism threshold sweep: one reactive choice of 4 branches of
/// `size` points each (flipped by `n`, and each reading it), next to
/// `background` free points in their own graph.
pub fn choice_sweep(size: usize, background: usize) -> String {
    let mut s = String::from("<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\">");
    for i in 0..background.max(1) {
        let _ = write!(
            s,
            "<point name=\"p{i}\" x=\"{}\" y=\"{}\"/>",
            i % 20,
            (i * 7) % 20
        );
    }
    s.push_str("</graph>\n<conditionalContent name=\"cc\">");
    for b in 1..=4 {
        let open = if b == 4 {
            "<else>".to_string()
        } else {
            format!("<case condition=\"$n = {b}\">")
        };
        let _ = write!(s, "{open}<graph>");
        // Derived, so an inactive built branch costs work on every tick.
        for i in 0..size {
            let _ = write!(s, "<point x=\"$n + {}\" y=\"{}\"/>", (i * b) % 17, i % 13);
        }
        let _ = write!(s, "</graph>{}", if b == 4 { "</else>" } else { "</case>" });
    }
    s.push_str("</conditionalContent>\n");
    s
}

/// The worst case for keeping branches built: one reactive choice of 4
/// branches, each a graph of `n` curves that read `a`, so dragging `a`
/// resamples the inactive branches' curves too.
pub fn choice_curves(n: usize) -> String {
    let mut s = String::from(
        "<numberInput name=\"n\" value=\"1\"/>\n<graph name=\"g\"><point name=\"p0\" x=\"1\" y=\"1\"/></graph>\n<conditionalContent name=\"cc\">",
    );
    for b in 1..=4 {
        let open = if b == 4 {
            "<else>".to_string()
        } else {
            format!("<case condition=\"$n = {b}\">")
        };
        let _ = write!(s, "{open}<graph>");
        for i in 0..n {
            let _ = write!(s, "<function>$p0.x x^2 + {}</function>", (i * b) % 7);
        }
        let _ = write!(s, "</graph>{}", if b == 4 { "</else>" } else { "</case>" });
    }
    s.push_str("</conditionalContent>\n");
    s
}

pub fn from_spec(spec: &str) -> Option<String> {
    let (shape, size) = spec.split_once('-')?;
    // The size of the one-number shapes; `grid` and `choicesweep` take `NxM`.
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
        "mathchain" => mathchain(n?),
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
        "choicecurves" => choice_curves(n?),
        "select" => select(n?),
        "selectall" => select_all(n?),
        "selectflat" => select_flat(n?),
        "choicesweep" => {
            let (n, d) = size.split_once('x')?;
            choice_sweep(n.parse().ok()?, d.parse().ok()?)
        }
        _ => return None,
    })
}

/// The default sweep used by `scripts/gen-fixtures.sh` and the benches.
pub const DEFAULT_SWEEP: &[&str] = &[
    "points-10",
    "points-100",
    "points-1000",
    "points-10000",
    "points-50000",
    "chain-10",
    "chain-100",
    "chain-1000",
    "chain-10000",
    "chain-100000",
    "fanout-10",
    "fanout-100",
    "fanout-1000",
    "fanout-10000",
    "fanout-50000",
    "aliases-10",
    "aliases-1000",
    "aliases-10000",
    "grid-100x10",
    "grid-1000x10",
    "grid-100x100",
    "grid-1000x100",
    "sliderchain-10",
    "sliderchain-1000",
    "sliderchain-100000",
    "sliderstack-10",
    "sliderstack-1000",
    "repeat-100",
    "repeat-1000",
    "repeat-10000",
    "repeat-50000",
    "recur-100",
    "recur-1000",
    "recur-10000",
    "intchain-1000",
    "intchain-100000",
    "mathchain-1000",
    "mathchain-100000",
    "hidden-1000",
    "circles3-1000",
    "circles3-10000",
    "sticky-100",
    "sticky-1000",
    "stickyfree-100",
    "stickyfree-1000",
    "answers-10",
    "answers-100",
    "answers-1000",
    "answers-10000",
    "curves-10",
    "curves-100",
    "curves-1000",
    "symchain-10",
    "symchain-100",
    "symchain-1000",
    "symchain-10000",
    "wording-100",
    "wording-1000",
    "wording-10000",
    "wordingflat-100",
    "wordingflat-1000",
    "wordingflat-10000",
    "adventure-1",
    "adventure-3",
    "adventure-5",
    "select-100",
    "select-1000",
    "select-10000",
    "selectflat-100",
    "selectflat-1000",
    "selectflat-10000",
    "wordingall-100",
    "wordingall-1000",
    "wordingall-10000",
    "selectall-100",
    "selectall-1000",
    "selectall-10000",
];

/// The current-core counterpart of a spec, for the baseline measurement.
/// Shapes with a direct translation go through `to_legacy`; the slider and
/// repeat shapes are written for the current core directly so its actions
/// (`changeValue` on a slider) can drive them. See `web/baseline/measure.mjs`.
pub fn legacy_from_spec(spec: &str) -> Option<String> {
    let (shape, size) = spec.split_once('-')?;
    let n: usize = size.split('x').next()?.parse().ok()?;
    Some(match shape {
        // A slider bound through a chain of L numbers to a mathInput.
        "sliderchain" => {
            let mut s = String::from("<mathInput name=\"n\" prefill=\"1\"/>\n");
            let mut prev = "n".to_string();
            for i in 0..n {
                let name = format!("c{i}");
                let expr = match i % 3 {
                    0 => format!("${prev} + 1"),
                    1 => format!("1.0001 * ${prev}"),
                    _ => format!("-${prev}"),
                };
                let _ = writeln!(s, "<number name=\"{name}\">{expr}</number>");
                prev = name;
            }
            let _ = writeln!(s, "<slider name=\"s\" from=\"-9\" to=\"9\" step=\"0.5\" bindValueTo=\"${prev}\"/>");
            let _ = writeln!(s, "<graph name=\"g\"><point name=\"p\" x=\"$s\" y=\"0\"/></graph>");
            s
        }
        // N points from a repeat whose length a slider drives, as in `repeat`.
        "repeat" => {
            let step = 18.0 / n.max(2) as f64;
            format!(
                "<slider name=\"n\" from=\"0\" to=\"{max}\" step=\"1\" initialValue=\"{n}\"/>\n\
<graph name=\"g\">\n\
  <repeatForSequence name=\"r\" from=\"-9\" step=\"{step}\" length=\"$n\" valueName=\"v\">\n\
    <point name=\"p\">($v, 0.5$v)</point>\n\
    <point name=\"q\">(0, 0)</point>\n\
  </repeatForSequence>\n\
</graph>\n\
<graph name=\"g2\"><collect name=\"c\" componentType=\"point\" from=\"$g\"/></graph>\n",
                max = n * 2
            )
        }
        // The current core's own answer form: the input inside the answer,
        // the correct answer in an award.
        "answers" => (0..n).map(|i| format!("<answer name=\"a{i}\"><mathInput name=\"mi{i}\"/><award><math>{}</math></award></answer>\n", correct_answer(i))).collect(),
        _ => to_legacy(&from_spec(spec)?),
    })
}

/// Translate a generated document into DoenetML the current core accepts:
/// each `<op>` becomes a `<number>` with the equivalent math expression.
/// Clamp has no one-line equivalent and becomes a plain copy, so chains lose
/// their final clamp; the values differ but the dependency shape is the same.
pub fn to_legacy(doc: &str) -> String {
    let mut out = String::new();
    // The current core rejects non-graphical children of <graph>, so numbers
    // that the generator placed inside a graph are hoisted above it.
    let mut graph_lines: Vec<String> = Vec::new();
    let mut hoisted: Vec<String> = Vec::new();
    let mut in_graph = false;
    for line in doc.lines() {
        // Split lines that hold an <op .../> followed by another element.
        let mut pieces: Vec<&str> = Vec::new();
        let mut rest = line;
        while let Some(i) = rest.find("/><") {
            pieces.push(&rest[..i + 2]);
            rest = &rest[i + 2..];
        }
        pieces.push(rest);
        for piece in pieces {
            let t = piece.trim();
            if t.is_empty() {
                continue;
            }
            let translated = if let Some(rest) = t.strip_prefix("<op ") {
                let attr = |k: &str| -> Option<String> {
                    let pat = format!("{k}=\"");
                    let i = rest.find(&pat)? + pat.len();
                    let j = rest[i..].find('"')? + i;
                    Some(rest[i..j].to_string())
                };
                let name = attr("name").unwrap_or_default();
                let kind = attr("kind").unwrap_or_default();
                let args: Vec<String> = attr("args")
                    .unwrap_or_default()
                    .split_whitespace()
                    .map(String::from)
                    .collect();
                let a = args.first().cloned().unwrap_or_default();
                let b = args.get(1).cloned().unwrap_or_default();
                let expr = match kind.as_str() {
                    "add" => format!("{a} + {b}"),
                    "sub" => format!("{a} - {b}"),
                    "mul" => format!("{a} * {b}"),
                    "negate" => format!("-{a}"),
                    "round" => format!("round({a})"),
                    "floor" => format!("floor({a})"),
                    "div" => format!("{a} / {b}"),
                    "min" => format!("min({a}, {b})"),
                    "max" => format!("max({a}, {b})"),
                    "scale" => format!("{} * {a}", attr("k").unwrap_or_default()),
                    "offset" => format!("{a} + {}", attr("k").unwrap_or_default()),
                    "lerp" => {
                        let t = attr("t").unwrap_or_default();
                        format!("{a} + {t} * ({b} - {a})")
                    }
                    _ => a.clone(), // clamp and unknown: plain copy
                };
                Some(format!("<number name=\"{name}\">{expr}</number>"))
            } else {
                None
            };
            let is_number = translated.is_some();
            // The current core has no numberInput; mathInput with prefill is
            // the equivalent input.
            let text = translated.unwrap_or_else(|| {
                t.replace("<numberInput ", "<mathInput ")
                    .replace(" value=\"", " prefill=\"")
            });
            let starts_graph = t.starts_with("<graph");
            let ends_graph = t.contains("</graph>");
            if starts_graph {
                in_graph = true;
            }
            if in_graph && is_number {
                hoisted.push(text);
            } else if in_graph {
                graph_lines.push(text);
            } else {
                out.push_str(&text);
                out.push('\n');
            }
            if ends_graph {
                in_graph = false;
                for h in hoisted.drain(..) {
                    out.push_str(&h);
                    out.push('\n');
                }
                for g in graph_lines.drain(..) {
                    out.push_str(&g);
                    out.push('\n');
                }
            }
        }
    }
    out
}
