//! A lone request inverts by walking straight down its chain; two requests
//! go through the gathering queue. A request sent twice to one cell must
//! resolve exactly as it does alone, for every cell of documents that use
//! every kind of inverse.

use cells_core::CellIdx;
use cells_core::Request;
use cells_core::program::SymRun;
use cells_core::testing::test_utils::load;

const DOCS: &[&str] = &[
    r#"<numberInput name="n" value="1"/><number name="a">$n + 1</number><number name="b">2 * $a</number><number name="c">-$b</number><number name="d">clamp($c, -9, 9)</number><number name="e">round($d)</number><number name="f">$e + $n</number><number name="g">$f / $b</number><number name="h">max($g, $n)</number><number name="i">$h + $a</number><graph><point name="p" x="$i" y="$e"/></graph>"#,
    r#"<numberInput name="n" value="1"/><math name="m">3$n + 2</math><slider name="s" from="-9" to="9" step="0.5" bindValueTo="$m"/><graph><point name="p" x="$s" y="0"/></graph>"#,
    r#"<graph name="g"><point name="a">(1,2)</point><point name="b">(4,7)</point><line name="l" through="$a $b"/><circle name="c" center="$a" through="$b"/><polygon name="pg" vertices="(0,0) (2,0) (1,2)" rigid/></graph>"#,
    r#"<mathInput name="mi" prefill="x+1"/><numberInput name="t" value="2"/><evaluate name="e" function="$mi" input="$t"/><math name="m" simplify>$e x + $mi</math><graph><point name="p" x="$t" y="$e"/></graph>"#,
];

#[test]
fn the_walk_matches_the_queue() {
    let mut checked = 0;
    for src in DOCS {
        let mut doc = load(src).unwrap();
        let engine = doc.session.engine.clone();
        for cell in CellIdx::below(doc.cells.len()) {
            for value in [0.5, -3.0, 7.25] {
                let r = Request { cell, value };
                let alone = cells_core::tick::invert::invert_requests(
                    &doc.program,
                    &mut SymRun {
                        state: &mut doc.sym,
                        engine: &mut engine.borrow_mut(),
                    },
                    &doc.cells,
                    doc.n_essential,
                    &[r],
                    &[],
                );
                let twice = cells_core::tick::invert::invert_requests(
                    &doc.program,
                    &mut SymRun {
                        state: &mut doc.sym,
                        engine: &mut engine.borrow_mut(),
                    },
                    &doc.cells,
                    doc.n_essential,
                    &[r, r],
                    &[],
                );
                // A write into a math cell is a handle; the engine makes a
                // new one each time, so compare what the handles say.
                let shown = |writes: &[(CellIdx, f64)]| {
                    writes
                        .iter()
                        .map(|&(c, v)| {
                            let engine = doc.session.engine.borrow();
                            if doc.value_types[c.index()] == cells_core::ValueType::Math
                                && v.fract() == 0.0
                                && (0.0..engine.len() as f64).contains(&v)
                            {
                                (c, engine.text(cells_core::sym::Handle::from_value(v)))
                            } else {
                                (c, v.to_string())
                            }
                        })
                        .collect::<Vec<_>>()
                };
                assert_eq!(
                    shown(&alone.writes),
                    shown(&twice.writes),
                    "cell {cell} <- {value} in {src}"
                );
                assert_eq!(
                    alone.dropped.is_empty(),
                    twice.dropped.is_empty(),
                    "cell {cell} <- {value} in {src}"
                );
                checked += 1;
            }
        }
    }
    assert!(checked > 100);
}
