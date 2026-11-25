//! A `<graph>`'s scales and `identicalAxisScales` (ADR 0084), as the
//! current core's `graph.test.ts` reads them.

mod common;
use cells_core::testing::test_utils::load_unpruned;
use common::*;

fn limits(doc: &cells_core::Document) -> [f64; 4] {
    ["xmin", "xmax", "ymin", "ymax"].map(|p| v(doc, "g", p))
}

#[test]
fn a_scale_request_keeps_the_midpoint() {
    let mut doc = load_unpruned(
        r#"<graph name="g" xmin="2" xmax="8" ymin="-3" ymax="7" />
<mathInput name="xs" bindValueTo="$g.xScale" />"#,
    )
    .unwrap();
    assert_eq!(
        (v(&doc, "g", "xScale"), v(&doc, "g", "yScale")),
        (6.0, 10.0)
    );
    doc.request(&[req(&doc, "xs", "value", 4.0)]);
    assert_eq!(limits(&doc), [3.0, 7.0, -3.0, 7.0]);
    // A scale that is not positive is refused.
    doc.request(&[req(&doc, "xs", "value", -2.0)]);
    assert_eq!(limits(&doc), [3.0, 7.0, -3.0, 7.0]);
}

#[test]
fn identical_scales_fill_in_the_ranges_not_given() {
    let src = |limits: &str| {
        format!(
            r#"<mathInput name="ar" prefill="2" />
<graph name="g" identicalAxisScales aspectRatio="$ar" {limits} />"#
        )
    };
    for (given, expected) in [
        ("", [-10.0, 10.0, -5.0, 5.0]),
        (r#"xmin="-5""#, [-5.0, 15.0, -5.0, 5.0]),
        (r#"ymin="-20" ymax="40""#, [-60.0, 60.0, -20.0, 40.0]),
        (
            r#"xmin="-50" xmax="30" ymin="-20" ymax="40""#,
            [-50.0, 70.0, -20.0, 40.0],
        ),
        (
            r#"xmax="30" ymin="-20" ymax="40""#,
            [-90.0, 30.0, -20.0, 40.0],
        ),
    ] {
        let doc = load_unpruned(&src(given)).unwrap();
        assert_eq!(limits(&doc), expected, "{given}");
    }
    // A range is written as given.
    let mut doc = load_unpruned(
        r#"<graph name="g" identicalAxisScales />
<mathInput name="xm" bindValueTo="$g.xMin" />"#,
    )
    .unwrap();
    doc.request(&[req(&doc, "xm", "value", -5.0)]);
    assert_eq!(limits(&doc), [-5.0, 10.0, -10.0, 10.0]);
    assert_eq!(v(&doc, "g", "aspectRatio"), 15.0 / 20.0);
    // Without an aspect ratio, the ratio follows the scales.
    let doc = load_unpruned(r#"<graph name="g" identicalAxisScales xmin="-5" />"#).unwrap();
    assert_eq!(v(&doc, "g", "aspectRatio"), 15.0 / 20.0);
}

#[test]
fn a_graph_inside_a_graph_has_its_parent_s_ranges() {
    let mut doc = load_unpruned(
        r#"<graph name="p" xmin="1" xmax="7" ymin="-5" ymax="3"><graph name="g" /></graph>
<mathInput name="xs" bindValueTo="$g.xScale" />"#,
    )
    .unwrap();
    assert_eq!(limits(&doc), [1.0, 7.0, -5.0, 3.0]);
    doc.request(&[req(&doc, "xs", "value", 10.0)]);
    assert_eq!(limits(&doc), [-1.0, 9.0, -5.0, 3.0]);
    assert_eq!(v(&doc, "p", "xmin"), -1.0);
}
