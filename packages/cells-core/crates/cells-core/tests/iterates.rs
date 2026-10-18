//! `<functionIterates>`, `<repeat for>` over its iterates, tuples,
//! `<clampNumber>`, `<polyline>`, `prefill="$n"` and `<triggerSet>`, alone
//! and together in the SIR simulation (`fixtures/sir.doenet`).

use cells_core::components::ComponentType;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, repo_root};
use cells_core::{Document, Request};

fn cell(doc: &Document, path: &str, prop: &str) -> u32 {
    let c = doc
        .resolve_path(path)
        .unwrap_or_else(|| panic!("no component at {path}"));
    doc.prop_cells(c, prop)
        .unwrap_or_else(|| panic!("no {path}.{prop}"))[0]
}

fn val(doc: &Document, path: &str, prop: &str) -> f64 {
    doc.cells[cell(doc, path, prop) as usize]
}

fn set(doc: &mut Document, path: &str, prop: &str, value: f64) -> cells_core::TickOutcome {
    let cell = cell(doc, path, prop);
    doc.request(&[Request { cell, value }])
}

fn type_into(doc: &mut Document, path: &str, text: &str) -> cells_core::TickOutcome {
    let h = doc.parse_math(text).unwrap();
    set(doc, path, "expr", h)
}

fn close(a: f64, b: f64) -> bool {
    (a - b).abs() <= 1e-9 * b.abs().max(1.0)
}

/// The SIR recursion the document describes, for checking its iterates.
fn sir(s0: f64, i0: f64, r0: f64, a: f64, b: f64, n: usize) -> Vec<[f64; 3]> {
    let mut out = vec![[s0, i0, r0]];
    for _ in 0..n {
        let [s, i, r] = *out.last().unwrap();
        out.push([s - b * s * i, i + b * s * i - a * i, r + a * i]);
    }
    out
}

const LOGISTIC: &str = r#"
<number name="r">2.5</number>
<function name="f" variables="u">$r u (1 - u)</function>
<numberInput name="n" value="4"/>
<functionIterates name="fi" function="$f" initialValue="0.5" numIterates="$n"/>
<repeat name="rp" for="$fi.allIteratesWithInitial" valueName="x" indexName="i">
  <number name="v">$x[1]</number>
  <number name="t">$i - 1</number>
</repeat>
"#;

#[test]
fn scalar_iterates() {
    let mut doc = load(LOGISTIC).unwrap();
    assert_eq!(reference::check(&doc), None);
    let mut u = 0.5;
    for k in 1..=5 {
        assert!(
            close(val(&doc, &format!("rp[{k}].v"), "value"), u),
            "iterate {k}"
        );
        assert_eq!(val(&doc, &format!("rp[{k}].t"), "value"), (k - 1) as f64);
        u = 2.5 * u * (1.0 - u);
    }
    assert!(doc.resolve_path("rp[6]").is_none());
    // More iterates: a rebuild, and the new ones follow on.
    let t = set(&mut doc, "n", "value", 6.0);
    assert!(t.rebuilt);
    assert_eq!(val(&doc, "fi", "allIteratesWithInitial"), 7.0);
    let mut u = 0.5;
    for _ in 0..6 {
        u = 2.5 * u * (1.0 - u);
    }
    assert!(close(val(&doc, "rp[7].v", "value"), u));
}

#[test]
fn iterates_leave_out_the_initial_value() {
    let src = LOGISTIC.replace("allIteratesWithInitial", "iterates");
    let doc = load(&src).unwrap();
    assert!(close(val(&doc, "rp[1].v", "value"), 2.5 * 0.5 * 0.5));
    assert!(doc.resolve_path("rp[5]").is_none());
}

#[test]
fn tuple_math_and_clamp_number() {
    let mut doc = load(
        r#"
<clampNumber name="c" lowerValue="0" upperValue="Infinity">5</clampNumber>
<math name="t">($c, 2, $c + 1)</math>
<number name="second">$t[2]</number>
"#,
    )
    .unwrap();
    let t = doc.resolve_path("t").unwrap();
    assert_eq!(doc.component_type(t), ComponentType::Tuple);
    assert_eq!(val(&doc, "t", "n"), 3.0);
    assert_eq!(val(&doc, "t", "x3"), 6.0);
    assert_eq!(val(&doc, "second", "value"), 2.0);
    // Clamped below at 0, through the projection inverse.
    set(&mut doc, "c", "value", -4.0);
    assert_eq!(val(&doc, "c", "value"), 0.0);
    assert_eq!(val(&doc, "t", "x1"), 0.0);
    set(&mut doc, "c", "value", 1e9);
    assert_eq!(val(&doc, "t", "x3"), 1e9 + 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn prefill_reference_seeds_without_binding() {
    let mut doc = load(
        r#"
<number name="d">0.1</number>
<mathInput name="a" prefill="$d"/>
<triggerSet name="reset"><label>Reset</label><updateValue target="$a" newValue="$d"/></triggerSet>
"#,
    )
    .unwrap();
    assert_eq!(val(&doc, "a", "value"), 0.1);
    assert_eq!(doc.math_text(cell(&doc, "a", "expr")), "0.1");
    // Typing changes the input, not the number it was prefilled from.
    type_into(&mut doc, "a", "0.3");
    assert_eq!(val(&doc, "a", "value"), 0.3);
    assert_eq!(val(&doc, "d", "value"), 0.1);
    let reset = doc.resolve_path("reset").unwrap();
    let t = doc.trigger(reset);
    assert!(t.dropped.is_empty());
    assert_eq!(val(&doc, "a", "value"), 0.1);
}

fn sir_doc() -> Document {
    let src = std::fs::read_to_string(repo_root().join("fixtures/sir.doenet")).unwrap();
    load(&src).unwrap()
}

fn check_sir(doc: &Document, s0: f64, i0: f64, r0: f64, a: f64, b: f64, n: usize) {
    let want = sir(s0, i0, r0, a, b, n);
    assert_eq!(val(doc, "iteration", "count"), (n + 1) as f64);
    for (k, w) in want.iter().enumerate() {
        let k = k + 1;
        for (j, &want) in w.iter().enumerate() {
            let got = val(doc, &format!("iteration[{k}]"), &format!("x{}", j + 1));
            assert!(close(got, want), "iterate {k} entry {j}: {got} vs {want}");
        }
        for (r, j) in [("SPoints", 0), ("IPoints", 1), ("RPoints", 2)] {
            let p = format!("plot.{r}[{k}]");
            assert_eq!(val(doc, &p, "x"), (k - 1) as f64);
            assert!(close(val(doc, &p, "y"), w[j]));
        }
    }
    assert!(
        doc.resolve_path(&format!("plot.SPoints[{}]", n + 2))
            .is_none()
    );
}

#[test]
fn sir_loads_and_iterates() {
    let doc = sir_doc();
    assert_eq!(reference::check(&doc), None);
    check_sir(&doc, 9990.0, 10.0, 0.0, 0.1, 0.0001, 200);
    assert_eq!(val(&doc, "Ntot", "value"), 10000.0);
    assert_eq!(val(&doc, "plot", "xmax"), 50.0);
    assert_eq!(val(&doc, "plot", "ymin"), -2000.0);
    // Each polyline gathers its repeat's points.
    let polylines: Vec<_> = (0..doc.n_components() as u32)
        .filter(|&c| doc.component_type(c) == ComponentType::Polyline)
        .collect();
    assert_eq!(polylines.len(), 3);
    for &p in &polylines {
        assert_eq!(doc.cells[doc.comp_cells(p)[0] as usize], 201.0);
    }
    // Presentation attributes are read from the element.
    assert_eq!(
        doc.attr_text(polylines[1], "styleNumber").as_deref(),
        Some("2")
    );
}

#[test]
fn sir_drag_type_and_reset() {
    let mut doc = sir_doc();
    // Drag the infectives' point: snapped to the grid, held at x = 0 (its x
    // is a fixed number), and the whole simulation follows.
    let p = doc
        .resolve_path("plot")
        .and_then(|g| {
            doc.children(g).find_map(|k| match k {
                cells_core::Child::Component(c)
                    if doc.component_type(c) == ComponentType::Point
                        && doc.attr_text(c, "styleNumber").as_deref() == Some("2") =>
                {
                    Some(c)
                }
                _ => None,
            })
        })
        .unwrap();
    let cells = doc.prop_cells(p, "coords").unwrap();
    let t = doc.request_points(&[cells_core::PointRequest {
        cells: [cells[0], cells[1]],
        values: [3.2, 99.6],
    }]);
    assert!(!t.rebuilt);
    assert_eq!(doc.cells[cells[0] as usize], 0.0);
    assert_eq!(doc.cells[cells[1] as usize], 100.0);
    assert_eq!(val(&doc, "I0", "value"), 100.0);
    check_sir(&doc, 9990.0, 100.0, 0.0, 0.1, 0.0001, 200);
    // A negative initial count is clamped to zero.
    set(&mut doc, "S0", "value", -5.0);
    assert_eq!(val(&doc, "S0", "value"), 0.0);
    set(&mut doc, "S0", "value", 9990.0);

    // Parameters typed into the inputs.
    type_into(&mut doc, "a", "0.2");
    type_into(&mut doc, "b", "0.00005");
    check_sir(&doc, 9990.0, 100.0, 0.0, 0.2, 0.00005, 200);
    let t = type_into(&mut doc, "nIterates", "30");
    assert!(t.rebuilt);
    check_sir(&doc, 9990.0, 100.0, 0.0, 0.2, 0.00005, 30);
    assert_eq!(reference::check(&doc), None);

    // Reset parameters: back to the defaults, and back to 200 iterates.
    let reset = (0..doc.n_components() as u32)
        .find(|&c| doc.component_type(c) == ComponentType::TriggerSet)
        .unwrap();
    let t = doc.trigger(reset);
    assert!(t.rebuilt, "{:?}", t.rebuild_error);
    check_sir(&doc, 9990.0, 100.0, 0.0, 0.1, 0.0001, 200);
    assert_eq!(val(&doc, "plot", "xmax"), 50.0);
    assert_eq!(reference::check(&doc), None);
}
