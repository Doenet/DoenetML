//! `<polygon>`, rigid and free, and shapes whose vertices refer to
//! their own siblings.

mod common;
use cells_core::Request;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

#[test]
fn rigid_polygon_rotates_about_its_centroid_when_one_vertex_is_dragged() {
    let mut doc = load(
        r#"<graph name="g1">
             <point name="p1">(3,7)</point><point name="p2">(-4,-1)</point><point name="p3">(8,2)</point><point name="p4">(-3,4)</point>
             <polygon vertices="$p1 $p2 $p3 $p4" name="pg" rigid/>
           </graph>
           <graph name="g2"><polygon extend="$g1.pg" name="pg"/><pointList extend="$pg.vertices" name="vs"/></graph>
           <graph extend="$g2" name="g3"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "g1.pg", "numVertices"), 4.0);
    let mut verts = [[3.0, 7.0], [-4.0, -1.0], [8.0, 2.0], [-3.0, 4.0]];
    let c = [
        verts.iter().map(|p| p[0]).sum::<f64>() / 4.0,
        verts.iter().map(|p| p[1]).sum::<f64>() / 4.0,
    ];
    // Rotate 90 degrees counterclockwise about the centroid, asking for half the length.
    let requested = [
        -0.5 * (verts[1][1] - c[1]) + c[0],
        0.5 * (verts[1][0] - c[0]) + c[1],
    ];
    for p in &mut verts {
        *p = [-(p[1] - c[1]) + c[0], p[0] - c[0] + c[1]];
    }
    doc.request(&[
        req(&doc, "g1.pg", "x2", requested[0]),
        req(&doc, "g1.pg", "y2", requested[1]),
    ]);
    for (i, p) in verts.iter().enumerate() {
        assert_close!(v(&doc, &format!("p{}", i + 1), "x"), p[0]);
        assert_close!(v(&doc, &format!("p{}", i + 1), "y"), p[1]);
    }
    // The copies see the same vertices through their aliases.
    let g3 = doc.resolve_path("g3.pg").unwrap();
    let cells = doc.prop_cells(g3, "x1").unwrap();
    assert_close!(doc.cells[cells[0] as usize], verts[0][0]);
    let vs2 = doc.resolve_path("g3.vs[2]").unwrap();
    let cells = doc.prop_cells(vs2, "coords").unwrap();
    assert_close!(doc.cells[cells[1] as usize], verts[1][1]);
    // Dragging every vertex of the copy translates by the smallest shift.
    let moved: Vec<Request> = verts
        .iter()
        .enumerate()
        .flat_map(|(i, p)| {
            let cx = doc.prop_cells(g3, &format!("x{}", i + 1)).unwrap()[0];
            let cy = doc.prop_cells(g3, &format!("y{}", i + 1)).unwrap()[0];
            [
                Request {
                    cell: cx,
                    value: p[0] + 3.0 + i as f64,
                },
                Request {
                    cell: cy,
                    value: p[1] + 2.0 + 2.0 * i as f64,
                },
            ]
        })
        .collect();
    doc.request(&moved);
    for (i, p) in verts.iter().enumerate() {
        assert_close!(v(&doc, &format!("p{}", i + 1), "x"), p[0] + 3.0);
        assert_close!(v(&doc, &format!("p{}", i + 1), "y"), p[1] + 2.0);
    }
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn self_referencing_shapes_are_not_cycles() {
    // A parallelogram's fourth vertex from its first three, as the current
    // core's tests write it: legal, since nothing couples the free vertices.
    let mut doc = load(
        r#"<graph>
             <polygon name="pg" vertices="(1,2) (3,4) (-5,6) ($pg.vertex3[1]+$pg.vertex2[1]-$pg.vertex1[1], $pg.vertex3[2]+$pg.vertex2[2]-$pg.vertex1[2])"/>
           </graph>"#,
    )
    .unwrap();
    assert_eq!((v(&doc, "pg", "x4"), v(&doc, "pg", "y4")), (-3.0, 8.0));
    // Dragging vertex 1 moves the derived fourth vertex with it.
    doc.request(&[req(&doc, "pg", "x1", 0.0), req(&doc, "pg", "y1", 0.0)]);
    assert_eq!((v(&doc, "pg", "x4"), v(&doc, "pg", "y4")), (-2.0, 10.0));
    let doc2 = load(r#"<graph><point name="A">(1,2)</point><line name="l" through="$A ($l.point1.y, $l.point1.x)"/></graph>"#).unwrap();
    assert_eq!((v(&doc2, "l", "x2"), v(&doc2, "l", "y2")), (2.0, 1.0));
    let _ = doc;
}
