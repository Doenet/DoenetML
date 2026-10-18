//! `<stickyGroup>` (ADR 0007). The first scene is the current core's
//! "attract polygons and point when translating", step for step; the rest
//! are the prototype's own rules (repeat members, shared points, what the
//! pre-pass does and does not see).

mod common;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

const SCENE: &str = r#"
    <graph name="g1">
      <stickyGroup name="sg">
        <polygon name="pg1" vertices="(1,2) (4,5) (-2,5)" rigid filled />
        <polygon name="pg2" vertices="(7,8) (5,4) (9,1) (7,3)" filled />
        <point name="A">(-6,2)</point>
      </stickyGroup>
    </graph>
    <graph name="g2">
      <stickyGroup name="sg">
        <polygon name="pg1" extend="$g1.sg.pg1" />
        <polygon name="pg2" extend="$g1.sg.pg2" />
        <point name="A" extend="$g1.sg.A" />
      </stickyGroup>
    </graph>
    <graph name="g3"><stickyGroup name="sg" extend="$g2.sg" /></graph>
    <graph name="g4" extend="$g3" />"#;

const XY: [(&str, &str); 4] = [("x1", "y1"), ("x2", "y2"), ("x3", "y3"), ("x4", "y4")];

fn verts(doc: &cells_core::Document, path: &str, n: usize) -> Vec<[f64; 2]> {
    (0..n)
        .map(|i| [v(doc, path, XY[i].0), v(doc, path, XY[i].1)])
        .collect()
}

fn check(doc: &cells_core::Document, a: &[[f64; 2]], b: &[[f64; 2]], p: [f64; 2]) {
    for g in ["g1", "g2", "g3", "g4"] {
        for (path, want) in [(format!("{g}.sg.pg1"), a), (format!("{g}.sg.pg2"), b)] {
            let got = verts(doc, &path, want.len());
            for (x, y) in got.iter().zip(want) {
                assert!(
                    close(x[0], y[0]) && close(x[1], y[1]),
                    "{path}: {got:?} != {want:?}"
                );
            }
        }
        let path = format!("{g}.sg.A");
        assert!(
            close(v(doc, &path, "x"), p[0]) && close(v(doc, &path, "y"), p[1]),
            "{path}"
        );
    }
    assert_eq!(reference::check(doc), None);
}

fn shift(v: &[[f64; 2]], d: [f64; 2]) -> Vec<[f64; 2]> {
    v.iter().map(|p| [p[0] + d[0], p[1] + d[1]]).collect()
}

fn drag(doc: &mut cells_core::Document, path: &str, from: &[[f64; 2]], by: [f64; 2]) {
    let to: Vec<(f64, f64)> = shift(from, by).iter().map(|p| (p[0], p[1])).collect();
    move_points(doc, path, &XY[..from.len()], &to);
}

#[test]
fn polygons_and_point_attract_when_translating() {
    let mut doc = load(SCENE).unwrap();
    let mut a = vec![[1.0, 2.0], [4.0, 5.0], [-2.0, 5.0]];
    let mut b = vec![[7.0, 8.0], [5.0, 4.0], [9.0, 1.0], [7.0, 3.0]];
    let mut p = [-6.0, 2.0];
    check(&doc, &a, &b, p);

    // pg1's vertex near a vertex of pg2.
    drag(&mut doc, "g1.sg.pg1", &a, [0.8, -1.2]);
    a = shift(&a, [1.0, -1.0]);
    check(&doc, &a, &b, p);
    // pg2's vertex near a vertex of pg1.
    drag(&mut doc, "g2.sg.pg2", &b, [-5.2, -2.3]);
    b = shift(&b, [-5.0, -2.0]);
    check(&doc, &a, &b, p);
    // Further left: unstuck.
    drag(&mut doc, "g3.sg.pg2", &b, [-1.0, 0.0]);
    b = shift(&b, [-1.0, 0.0]);
    check(&doc, &a, &b, p);
    // pg1's vertex near the point.
    drag(&mut doc, "g4.sg.pg1", &a, [-4.8, -1.8]);
    a = shift(&a, [-5.0, -2.0]);
    check(&doc, &a, &b, p);
    // The point near a vertex of pg2, then away from everything.
    move_point(&mut doc, "g1.sg.A", 0.8, 0.8);
    p = [1.0, 1.0];
    check(&doc, &a, &b, p);
    move_point(&mut doc, "g2.sg.A", -2.0, 1.0);
    p = [-2.0, 1.0];
    check(&doc, &a, &b, p);
    // A vertex of pg1 near an edge of pg2, and the reverse.
    drag(&mut doc, "g3.sg.pg1", &a, [1.4, 3.0]);
    a = shift(&a, [1.0, 3.0]);
    check(&doc, &a, &b, p);
    drag(&mut doc, "g4.sg.pg2", &b, [1.2, 1.8]);
    b = shift(&b, [1.0, 2.0]);
    check(&doc, &a, &b, p);
    // An edge of pg1 near a vertex of pg2, and the reverse.
    drag(&mut doc, "g1.sg.pg1", &a, [2.8, 0.2]);
    a = shift(&a, [3.0, 0.0]);
    check(&doc, &a, &b, p);
    drag(&mut doc, "g2.sg.pg2", &b, [2.2, -2.0]);
    b = shift(&b, [2.0, -2.0]);
    check(&doc, &a, &b, p);
}

#[test]
fn members_from_a_repeat_attract() {
    let mut doc = load(
        r#"<graph>
             <stickyGroup>
               <repeatForSequence name="r" from="1" to="3" valueName="k">
                 <point name="q">(1,2)</point>
               </repeatForSequence>
               <point name="A">(-5,-5)</point>
             </stickyGroup>
           </graph>"#,
    )
    .unwrap();
    move_point(&mut doc, "A", 1.2, 1.9);
    assert_eq!((v(&doc, "A", "x"), v(&doc, "A", "y")), (1.0, 2.0));
    move_point(&mut doc, "A", -5.0, -5.0);
    move_point(&mut doc, "r[3].q", -4.8, -5.1);
    assert_eq!(
        (v(&doc, "r[3].q", "x"), v(&doc, "r[3].q", "y")),
        (-5.0, -5.0)
    );
    assert_eq!((v(&doc, "r[2].q", "x"), v(&doc, "r[2].q", "y")), (1.0, 2.0));
}

#[test]
fn a_shape_does_not_stick_to_its_own_member_vertex() {
    // A is a member and the polygon's first vertex: dragging the polygon
    // a little must move it, not snap it back onto A.
    let mut doc = load(
        r#"<graph>
             <stickyGroup>
               <point name="A">(0,0)</point>
               <polygon name="pg" vertices="$A (4,0) (0,4)" />
             </stickyGroup>
           </graph>"#,
    )
    .unwrap();
    let from = [[0.0, 0.0], [4.0, 0.0], [0.0, 4.0]];
    drag(&mut doc, "pg", &from, [0.2, 0.1]);
    assert_eq!(verts(&doc, "pg", 3), shift(&from, [0.2, 0.1]));
    assert_eq!((v(&doc, "A", "x"), v(&doc, "A", "y")), (0.2, 0.1));
}

#[test]
fn a_request_that_reaches_a_member_through_inversion() {
    // P is not a member; it is A shifted. Dragging P asks A to move, but
    // the pre-pass sees only the request on P, so nothing snaps. (A
    // `Sticky` instruction would have snapped it; see ADR 0007.)
    let mut doc = load(
        r#"<graph>
             <stickyGroup>
               <point name="A">(0,0)</point>
               <point name="B">(5,5)</point>
             </stickyGroup>
             <point name="P" x="$A.x + 1" y="$A.y" />
           </graph>"#,
    )
    .unwrap();
    move_point(&mut doc, "P", 5.8, 5.1);
    let a = (v(&doc, "A", "x"), v(&doc, "A", "y"));
    assert_eq!(a, (4.8, 5.1));
}

#[test]
fn a_member_computed_from_another_member() {
    // The polygon's first vertex is computed from member A. Legal here; one
    // instruction over every member would read its own output, a cycle
    // (ADR 0007).
    let mut doc = load(
        r#"<graph>
             <stickyGroup>
               <point name="A">(0,0)</point>
               <polygon name="pg" vertices="($A.x+1, $A.y) (4,0) (0,4)" />
             </stickyGroup>
           </graph>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "pg", "x1"), 1.0);
    // Dragging the polygon writes A through the vertex.
    let from = [[1.0, 0.0], [4.0, 0.0], [0.0, 4.0]];
    drag(&mut doc, "pg", &from, [1.0, 1.0]);
    assert_eq!((v(&doc, "A", "x"), v(&doc, "A", "y")), (1.0, 1.0));
}

/// The current core's members are the group's children after composites
/// expand: a select's chosen contents and a conditionalContent's active
/// case, not an inactive one (checked against the current core).
#[test]
fn members_inside_choices_follow_the_active_case() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
        <graph name="g"><stickyGroup name="sg">
          <point name="A">(0,0)</point>
          <conditionalContent name="cc"><case condition="$b"><point name="B">(5,5)</point></case></conditionalContent>
          <select name="s"><option><point name="C">(-5,-5)</point></option></select>
        </stickyGroup></graph>"#,
    )
    .unwrap();
    let a = |doc: &cells_core::Document| (v(doc, "g.sg.A", "x"), v(doc, "g.sg.A", "y"));
    move_point(&mut doc, "g.sg.A", 4.8, 4.9);
    assert_eq!(a(&doc), (5.0, 5.0));
    move_point(&mut doc, "g.sg.A", -4.8, -4.9);
    assert_eq!(a(&doc), (-5.0, -5.0));
    set(&mut doc, "b", "value", 0.0);
    move_point(&mut doc, "g.sg.A", 4.8, 4.9);
    assert_eq!(a(&doc), (4.8, 4.9));
}
