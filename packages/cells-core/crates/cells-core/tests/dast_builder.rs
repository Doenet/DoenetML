//! `testing::dast` against the parser: a tree written as the parser
//! produces it is the same DAST, byte for byte, and one that leaves out
//! what the core skips loads to the same values.

use cells_core::dast::Dast;
use cells_core::testing::dast::{self, Node, document, el, mac, part, text};
use cells_core::testing::test_utils::{dast_json, load_unpruned};

fn same_as_parsed(source: &str, built: Dast) {
    let parsed = Dast::from_json(&dast_json(source)).unwrap();
    assert!(
        built.to_binary() == parsed.to_binary(),
        "{source}: the built DAST differs from the parsed one"
    );
}

#[test]
fn references_with_and_without_indices() {
    same_as_parsed(
        r#"<point name="p">(1,2)</point><point name="q" extend="$p" x="3"/><number name="n">$p.x + $r[2].y</number>"#,
        document([
            el("point").name("p").text("(1,2)"),
            el("point")
                .name("q")
                .attr("extend", mac("p"))
                .attr("x", "3"),
            el("number")
                .name("n")
                .child(mac("p.x"))
                .text(" + ")
                .child([part("r").index("2"), part("y")]),
        ]),
    );
}

#[test]
fn flags_and_indices_holding_references() {
    same_as_parsed(
        r#"<point name="p" hide>(1,2)</point><number>$r[$i+1][2].x</number>"#,
        document([
            el("point").name("p").flag("hide").text("(1,2)"),
            el("number").child([
                part("r").index([mac("i"), text("+1")]).index("2"),
                part("x"),
            ]),
        ]),
    );
}

#[test]
fn nested_elements_and_references_in_attributes() {
    same_as_parsed(
        r#"<mathInput name="r" prefill="3"/><graph><circle name="c" center="(1,2)" radius="$r"/></graph>"#,
        document([
            el("mathInput").name("r").attr("prefill", "3"),
            // The normalizer gives every graph a `_dynamicChildren`.
            el("graph")
                .child(
                    el("circle")
                        .name("c")
                        .attr("center", "(1,2)")
                        .attr("radius", mac("r")),
                )
                .child(el("_dynamicChildren")),
        ]),
    );
}

#[test]
fn without_what_the_core_skips_the_values_are_the_same() {
    let source = r#"<graph><circle name="c" center="(1,2)" radius="3"/><circle name="d" extend="$c" radius="5"/></graph>"#;
    // No `_dynamicChildren`, and no `<document>`: the compile skips the one
    // and synthesizes the other.
    let built = dast::build([Node::Element(
        el("graph")
            .child(
                el("circle")
                    .name("c")
                    .attr("center", "(1,2)")
                    .attr("radius", "3"),
            )
            .child(
                el("circle")
                    .name("d")
                    .attr("extend", mac("c"))
                    .attr("radius", "5"),
            ),
    )]);
    // `dast::load` computes every prop (ADR 0019); so must the other.
    let built = dast::load(built).unwrap();
    let parsed = load_unpruned(source).unwrap();
    assert_eq!(built.cells.len(), parsed.cells.len());
    for (name, prop) in [("c", "radius"), ("d", "radius"), ("d", "center")] {
        let read = |doc: &cells_core::Document| -> Vec<f64> {
            let comp = doc.component(name).unwrap();
            doc.prop_cells(comp, prop)
                .unwrap()
                .iter()
                .map(|&c| doc.cells[c.index()])
                .collect()
        };
        assert_eq!(read(&built), read(&parsed), "{name}.{prop}");
    }
}
