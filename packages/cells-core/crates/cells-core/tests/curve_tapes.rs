//! A curve whose expression has a fixed shape samples a
//! tape compiled at build time instead of asking the engine on each tick.
//! The tapes must sample what the engine samples.

use cells_core::program::Op;
use cells_core::program::{SAMPLES, SymKind};
use cells_core::testing::test_utils::dast_json;
use cells_core::{Document, LoadOptions, Request};

const SRC: &str = r#"<numberInput name="a" value="1.5"/><numberInput name="b" value="-2"/><mathInput name="mi" prefill="x^3"/>
<graph xmin="-3" xmax="4">
  <function name="f">$a x^2 + $b x + 3</function><derivative name="df">$f</derivative>
  <function name="g">sin($a x) e^($b x/10) + sqrt(x) + x^(1/3)</function><derivative name="dg">$g</derivative>
  <function name="h">ln(abs($b) x^2 + 1)/($a + x^2) - tan(x/$a)</function>
  <function name="k">$mi + $a x</function><derivative name="dk">$k</derivative>
</graph>"#;

fn samples(doc: &Document, name: &str) -> Vec<f64> {
    let c = doc.cell(name, "samples").unwrap() as usize;
    doc.cells[c..c + SAMPLES].to_vec()
}

fn tapes(doc: &Document) -> usize {
    doc.program
        .instrs
        .iter()
        .filter(|i| matches!(i.op, Op::Sym(SymKind::SampleTape { .. }, ..)))
        .count()
}

#[test]
fn tapes_sample_what_the_engine_samples() {
    let json = dast_json(SRC);
    let mut slow = Document::load(
        json.as_bytes(),
        LoadOptions {
            sample_with_engine: true,
            ..Default::default()
        },
    )
    .unwrap()
    .0;
    let mut fast = Document::from_bytes(json.as_bytes()).unwrap();
    assert_eq!(tapes(&slow), 0);
    // f, df, g, dg, h compile; k and dk depend on a mathInput's expression.
    assert_eq!(tapes(&fast), 5);
    let check = |slow: &Document, fast: &Document| {
        for name in ["f", "df", "g", "dg", "h", "k", "dk"] {
            for (i, (s, f)) in samples(slow, name)
                .iter()
                .zip(samples(fast, name))
                .enumerate()
            {
                let ok = (s.is_nan() && f.is_nan()) || (s - f).abs() <= 1e-9 * s.abs().max(1.0);
                assert!(ok, "{name}[{i}]: engine {s}, tape {f}");
            }
        }
    };
    check(&slow, &fast);
    for (a, b) in [(2.0, 0.5), (-1.0, 3.0), (0.25, -4.0)] {
        for doc in [&mut slow, &mut fast] {
            let r = [
                Request {
                    cell: doc.cell("a", "value").unwrap(),
                    value: a,
                },
                Request {
                    cell: doc.cell("b", "value").unwrap(),
                    value: b,
                },
            ];
            doc.request(&r);
        }
        check(&slow, &fast);
        assert_eq!(
            slow.math_text(slow.cell("df", "expr").unwrap()),
            fast.math_text(fast.cell("df", "expr").unwrap())
        );
    }
    assert_eq!(cells_core::testing::reference::check(&fast), None);
}
