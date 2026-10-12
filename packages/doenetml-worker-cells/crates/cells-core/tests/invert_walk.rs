//! A lone request inverts by walking straight down its chain; two requests
//! go through the gathering queue. A request sent twice to one cell must
//! resolve exactly as it does alone, for every cell of documents that use
//! every kind of inverse.

use cells_core::Request;
use cells_core::testing::test_utils::load;

const DOCS: &[&str] = &[
    r#"<numberInput name="n" value="1"/><op name="a" kind="offset" k="1" args="$n"/><op name="b" kind="scale" k="2" args="$a"/><op name="c" kind="negate" args="$b"/><op name="d" kind="clamp" lo="-9" hi="9" args="$c"/><op name="e" kind="round" args="$d"/><op name="f" kind="add" args="$e $n"/><op name="g" kind="div" args="$f $b"/><op name="h" kind="default" args="$g $n"/><op name="i" kind="lerp" t="0.25" args="$h $a"/><graph><point name="p" x="$i" y="$e"/></graph>"#,
    r#"<numberInput name="n" value="1"/><math name="m">3$n + 2</math><slider name="s" from="-9" to="9" step="0.5" bindValueTo="$m"/><graph><point name="p" x="$s" y="0"/></graph>"#,
    r#"<graph name="g"><point name="a">(1,2)</point><point name="b">(4,7)</point><line name="l" through="$a $b"/><circle name="c" center="$a" through="$b"/><polygon name="pg" vertices="(0,0) (2,0) (1,2)" rigid/></graph>"#,
    r#"<mathInput name="mi" prefill="x+1"/><numberInput name="t" value="2"/><evaluate name="e" function="$mi" input="$t"/><math name="m" simplify>$e x + $mi</math><graph><point name="p" x="$t" y="$e"/></graph>"#,
];

#[test]
fn the_walk_matches_the_queue() {
    let mut checked = 0;
    for src in DOCS {
        let doc = load(src).unwrap();
        for cell in 0..doc.cells.len() as u32 {
            for value in [0.5, -3.0, 7.25] {
                let r = Request { cell, value };
                let alone = cells_core::tick::invert::invert_requests(
                    &doc.program,
                    &doc.cells,
                    doc.n_essential,
                    &[r],
                    &[],
                );
                let twice = cells_core::tick::invert::invert_requests(
                    &doc.program,
                    &doc.cells,
                    doc.n_essential,
                    &[r, r],
                    &[],
                );
                assert_eq!(
                    alone.writes, twice.writes,
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
