//! Inverses in the current core that read state outside their dependencies
//! through `stateValues`, expressed as operator chains whose extra values are
//! forward inputs. Each test names the current-core inverse it stands for.
//! These test the core's inversion, so a request on a `<number>` no input
//! reaches is unchecked (ADR 0018).

mod common;

use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::{req, set_unchecked};

fn v(doc: &Document, name: &str) -> f64 {
    doc.value(name, "value").unwrap()
}

/// `Paginator.currentPage` clamps a request to `[1, numPages]` by reading
/// `stateValues.numPages`; `OrbitalDiagramInput.selectedRowIndex` does the
/// same with `numRows`. As a `Min` whose bound is the count's cell, the
/// count is a forward input and the inverse is a projection.
#[test]
fn bound_read_from_a_sibling_is_a_forward_min() {
    let mut doc = load(
        r#"<numberInput name="numPages" value="5"/>
           <numberInput name="stored" value="2"/>
           <number name="upper">min($stored, $numPages)</number>
           <number name="page">clamp($upper, 1, 1e300)</number>"#,
    )
    .unwrap();
    set_unchecked(&mut doc, "page", "value", 9.0);
    assert_eq!(v(&doc, "stored"), 5.0);
    assert_eq!(v(&doc, "page"), 5.0);
    set_unchecked(&mut doc, "page", "value", -3.0);
    assert_eq!(v(&doc, "stored"), 1.0);
    set_unchecked(&mut doc, "page", "value", 4.0);
    assert_eq!(v(&doc, "page"), 4.0);
    // Deviation: the forward clamps too, so fewer pages shows the last page
    // where the current core keeps showing the stale stored page.
    doc.request(&[req(&doc, "numPages", "value", 3.0)]);
    assert_eq!(v(&doc, "page"), 3.0);
    assert_eq!(v(&doc, "stored"), 4.0);
}

/// `AnimateFromSequence.selectedIndex` wraps a request into
/// `1..numValues` by reading `stateValues.numValues`. Written as
/// `stored - numValues * floor((stored - 1) / numValues)`, the inverse of
/// `Sub` writes `stored` with the current multiple added back, and the
/// forward wraps it.
#[test]
fn wrap_read_from_a_sibling_is_a_forward_modulus() {
    let mut doc = load(
        r#"<numberInput name="numValues" value="5"/>
           <numberInput name="stored" value="2"/>
           <number name="zeroBased">$stored - 1</number>
           <number name="quotient">$zeroBased / $numValues</number>
           <number name="laps">floor($quotient)</number>
           <number name="multiple">$laps * $numValues</number>
           <number name="index">$stored - $multiple</number>"#,
    )
    .unwrap();
    // The current core: ((7 - 1) % 5) + 1 = 2.
    set_unchecked(&mut doc, "index", "value", 7.0);
    assert_eq!(v(&doc, "index"), 2.0);
    set_unchecked(&mut doc, "index", "value", 4.0);
    assert_eq!(v(&doc, "index"), 4.0);
    set_unchecked(&mut doc, "index", "value", 11.0);
    assert_eq!(v(&doc, "index"), 1.0);
}

/// `Graph.xMin` refuses a request when `stateValues.fixAxes`, and
/// `Number.value` when `stateValues.canBeModified` is false: a gate the
/// forward ignores. `Hold` takes the flag as a declared input that only its
/// inverse reads, the way `Shape` takes its pivot.
#[test]
fn a_gate_drops_requests_while_its_flag_is_set() {
    let mut doc = load(
        r#"<numberInput name="x" value="2"/>
           <numberInput name="fixAxes" value="0"/>
           <number name="xMin" fixed="$fixAxes">$x</number>
           <number name="doubled">2 * $xMin</number>"#,
    )
    .unwrap();
    let tick = set_unchecked(&mut doc, "xMin", "value", 3.0);
    assert!(tick.dropped.is_empty());
    assert_eq!(v(&doc, "x"), 3.0);

    doc.request(&[req(&doc, "fixAxes", "value", 1.0)]);
    assert_eq!(v(&doc, "xMin"), 3.0, "the forward ignores the flag");
    let tick = set_unchecked(&mut doc, "xMin", "value", 8.0);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(v(&doc, "x"), 3.0);
    // A request from further down the chain stops at the gate too.
    let tick = set_unchecked(&mut doc, "doubled", "value", 10.0);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(v(&doc, "doubled"), 6.0);
    // The gate holds only what passes through it.
    doc.request(&[req(&doc, "x", "value", 4.0)]);
    assert_eq!(v(&doc, "xMin"), 4.0);

    doc.request(&[req(&doc, "fixAxes", "value", 0.0)]);
    set_unchecked(&mut doc, "doubled", "value", 10.0);
    assert_eq!(v(&doc, "x"), 5.0);
}

/// A flag with no value (NaN, as an indexed reference past the end of a
/// repeat gives) holds the gate shut: only an explicit 0 opens it.
#[test]
fn a_gate_with_a_nan_flag_holds() {
    let mut doc = load(
        r#"<numberInput name="x" value="2"/>
           <numberInput name="flag" value="0"/>
           <number name="g" fixed="$flag">$x</number>"#,
    )
    .unwrap();
    doc.request(&[req(&doc, "flag", "value", f64::NAN)]);
    let tick = set_unchecked(&mut doc, "g", "value", 7.0);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(v(&doc, "x"), 2.0);
}
