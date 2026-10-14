use cells_core::components::ComponentType;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_via_binary};
use cells_core::{Child, Document, Error};

fn load_ok(src: &str) -> Document {
    let doc = load(src).unwrap_or_else(|e| panic!("load failed: {e}\n{src}"));
    assert_eq!(
        reference::check(&doc),
        None,
        "scheduled values disagree with reference evaluator"
    );
    // The binary wire format must produce the identical document.
    let bin = load_via_binary(src).unwrap_or_else(|e| panic!("binary load failed: {e}\n{src}"));
    assert_eq!(bin.cells.len(), doc.cells.len());
    assert!(
        bin.cells
            .iter()
            .zip(&doc.cells)
            .all(|(a, b)| a == b || (a.is_nan() && b.is_nan()))
    );
    assert_eq!(bin.program.instrs, doc.program.instrs);
    assert_eq!(bin.n_components(), doc.n_components());
    doc
}

#[test]
fn three_cells_for_three_coordinates_plus_one_hide_per_point() {
    // Every count here includes the document's `creditAchieved` and
    // `percentCreditAchieved`: two fixed cells when nothing is scored.
    let doc = load_ok(r#"<point name="p1" x="1" y="2"/><point name="p2" x="5" y="$p1.y"/>"#);
    assert_eq!(doc.cells.len(), 7);
    assert_eq!(doc.n_essential, 5);
    assert_eq!(doc.cell("p1", "y"), doc.cell("p2", "y"));
    assert_ne!(doc.cell("p1", "x"), doc.cell("p2", "x"));
    assert_eq!(doc.value("p2", "y"), Some(2.0));
    assert_eq!(doc.value("p2", "x"), Some(5.0));
}

#[test]
fn bare_component_reference_shares_every_cell() {
    let doc = load_ok(r#"<graph name="g"><point name="p1" x="1" y="2"/>$p1</graph>"#);
    // four graph bounds plus two coordinates and a hide, and the document's
    // two constant credit cells; the copy adds none
    assert_eq!(doc.cells.len(), 9);
    let g = doc.component("g").unwrap();
    let kids: Vec<_> = doc
        .children(g)
        .filter_map(|c| {
            if let Child::Component(i) = c {
                Some(i)
            } else {
                None
            }
        })
        .collect();
    assert_eq!(kids.len(), 2);
    assert_eq!(doc.component_type(kids[1]), ComponentType::Point);
    assert_eq!(doc.name(kids[1]), None);
    assert_eq!(
        doc.prop_cells(kids[1], "coords"),
        doc.prop_cells(kids[0], "coords")
    );
}

#[test]
fn extend_with_override_shares_only_unoverridden_props() {
    let doc = load_ok(r#"<point name="p1" x="1" y="2"/><point name="p2" extend="$p1" y="3"/>"#);
    assert_eq!(doc.cells.len(), 6);
    assert_eq!(doc.cell("p1", "x"), doc.cell("p2", "x"));
    assert_ne!(doc.cell("p1", "y"), doc.cell("p2", "y"));
    assert_eq!(doc.value("p2", "y"), Some(3.0));
}

#[test]
fn coords_attribute_aliases_both_cells() {
    let doc = load_ok(
        r#"<point name="p1" x="1" y="2"/><point name="q" coords="$p1"/><point name="r" coords="$p1.coords"/>"#,
    );
    assert_eq!(doc.cells.len(), 7);
    assert_eq!(doc.cell("q", "x"), doc.cell("p1", "x"));
    assert_eq!(doc.cell("r", "y"), doc.cell("p1", "y"));
}

#[test]
fn number_input_feeds_point_through_default_prop() {
    let mut doc = load_ok(r#"<numberInput name="n" value="4"/><point name="p" x="$n"/>"#);
    assert_eq!(doc.cells.len(), 5);
    assert_eq!(doc.cell("n", "value"), doc.cell("p", "x"));
    assert_eq!(doc.value("p", "x"), Some(4.0));
    let c = doc.cell("n", "value").unwrap();
    doc.set_essential(c, 7.5);
    assert_eq!(doc.value("p", "x"), Some(7.5));
}

#[test]
fn number_children_literal_reference_and_bare_text_reference() {
    let doc = load_ok(
        r#"<point name="p1" x="1" y="2"/><number name="a">3.5</number><number name="b">$p1.x</number> $p1.y <number name="c"/>"#,
    );
    assert_eq!(doc.value("a", "value"), Some(3.5));
    assert_eq!(doc.cell("b", "value"), doc.cell("p1", "x"));
    assert!(doc.value("c", "value").unwrap().is_nan());
    // The bare $p1.y became an anonymous number aliasing p1.y.
    let anon = doc
        .children(doc.root)
        .filter_map(|c| {
            if let Child::Component(i) = c {
                Some(i)
            } else {
                None
            }
        })
        .find(|&c| doc.name(c).is_none() && doc.component_type(c) == ComponentType::Number)
        .expect("anonymous number");
    assert_eq!(doc.comp_cells(anon), &[doc.cell("p1", "y").unwrap()]);
    // p1.x, p1.y, a, c
    assert_eq!(doc.cells.len(), 7);
}

#[test]
fn operators_compute_and_propagate() {
    let mut doc = load_ok(
        r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
           <op name="s" kind="add" args="$a $b"/>
           <op name="t" kind="scale" k="10" args="$s"/>
           <op name="u" kind="clamp" lo="0" hi="50" args="$t"/>
           <op name="v" kind="lerp" t="0.5" args="$a $b"/>
           <op name="w" kind="sub" args="$b $a"/><op name="m" kind="mul" args="$a $b"/>
           <op name="n" kind="negate" args="$a"/><op name="o" kind="offset" k="1" args="$a"/>
           <point name="p" x="$t" y="$u"/>"#,
    );
    assert_eq!(doc.n_essential, 3);
    assert_eq!(doc.cells.len(), 13);
    assert_eq!(doc.value("s", "value"), Some(7.0));
    assert_eq!(doc.value("t", "value"), Some(70.0));
    assert_eq!(doc.value("u", "value"), Some(50.0));
    assert_eq!(doc.value("v", "value"), Some(3.5));
    assert_eq!(doc.value("w", "value"), Some(3.0));
    assert_eq!(doc.value("m", "value"), Some(10.0));
    assert_eq!(doc.value("n", "value"), Some(-2.0));
    assert_eq!(doc.value("o", "value"), Some(3.0));
    assert_eq!(doc.cell("p", "x"), doc.cell("t", "value"));
    let a = doc.cell("a", "value").unwrap();
    doc.set_essential(a, 1.0);
    assert_eq!(doc.value("p", "x"), Some(60.0));
    assert_eq!(doc.value("p", "y"), Some(50.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn forward_references_schedule_correctly() {
    let doc = load_ok(
        r#"<op name="c" kind="negate" args="$b"/><op name="b" kind="negate" args="$a"/>
           <op name="a" kind="offset" k="1" args="$n"/><numberInput name="n" value="1"/>"#,
    );
    assert_eq!(doc.value("c", "value"), Some(2.0));
    assert_eq!(doc.program.len(), 3);
}

#[test]
fn graph_defaults_and_tree() {
    let doc = load_ok(r#"<graph name="g" xmin="-5"><point name="p"/></graph>"#);
    assert_eq!(doc.value("g", "xmin"), Some(-5.0));
    assert_eq!(doc.value("g", "xmax"), Some(10.0));
    assert_eq!(doc.value("p", "x"), Some(0.0));
    let p = doc.component("p").unwrap();
    assert_eq!(doc.parent(p), doc.component("g"));
    assert_eq!(doc.cells.len(), 9);
}

#[test]
fn alias_cycle_is_rejected() {
    let err = load(r#"<point name="a" x="$b.x"/><point name="b" x="$a.x"/>"#).unwrap_err();
    assert!(matches!(err, Error::Cycle(_)), "{err}");
}

#[test]
fn operator_cycle_is_rejected() {
    let err =
        load(r#"<op name="a" kind="negate" args="$b"/><op name="b" kind="negate" args="$a"/>"#)
            .unwrap_err();
    assert!(matches!(err, Error::Cycle(_)), "{err}");
}

#[test]
fn error_cases() {
    assert!(matches!(
        load(r#"<point x="$nope"/>"#).unwrap_err(),
        Error::UnknownName(_)
    ));
    assert!(matches!(
        load(r#"<point name="a"/><point name="a"/>"#).unwrap_err(),
        Error::DuplicateName(_)
    ));
    // Math in an attribute lowers (ADR 0005); a constant folds to an essential.
    assert_eq!(
        load(r#"<point name="p" x="1+2"/>"#)
            .unwrap()
            .value("p", "x"),
        Some(3.0)
    );
    assert!(matches!(
        load(r#"<point name="p"/><point x="$p"/>"#).unwrap_err(),
        Error::ArityMismatch { .. }
    ));
    assert!(matches!(
        load(r#"<point name="p"/><number extend="$p"/>"#).unwrap_err(),
        Error::ExtendTypeMismatch { .. }
    ));
    assert!(matches!(
        load(r#"<point name="p"/><op kind="add" args="$p.x"/>"#).unwrap_err(),
        Error::OpArity { .. }
    ));
    assert!(matches!(
        load(r#"<point name="p"/><op kind="scale" args="$p.x"/>"#).unwrap_err(),
        Error::MissingParam { .. }
    ));
    assert!(matches!(
        load(r#"<point name="p"/>$p.x.y"#).unwrap_err(),
        Error::PathTooDeep(_)
    ));
    assert!(matches!(
        load(r#"<graph name="g"/>$g"#).unwrap_err(),
        Error::UncopyableType(_)
    ));
    assert!(matches!(
        load(r#"<textInput/>"#).unwrap_err(),
        Error::UnsupportedTag(_)
    ));
}

#[test]
fn load_reports_stages() {
    let json = cells_core::testing::test_utils::dast_json(
        r#"<numberInput name="a" value="2"/><op kind="negate" args="$a"/>"#,
    );
    let (doc, t) = Document::load(json.as_bytes(), Default::default()).unwrap();
    assert_eq!(doc.cells.len(), 4);
    assert!(t.deserialize.as_nanos() > 0);
}

#[test]
fn text_children_survive_and_whitespace_is_dropped() {
    let doc =
        load_ok("<point name=\"p\" x=\"1\"/>\nhello $p.x world\n<number name=\"n\">2</number>");
    let kids: Vec<String> = doc
        .children(doc.root)
        .map(|c| match c {
            Child::Component(i) => format!("<{}>", doc.component_type(i).tag()),
            Child::Text(t) => format!("{t:?}"),
        })
        .collect();
    assert_eq!(
        kids,
        vec![
            "<point>",
            "\"\\nhello \"",
            "<number>",
            "\" world\\n\"",
            "<number>"
        ]
    );
}

#[test]
fn binary_wire_format_rejects_garbage() {
    assert!(matches!(
        cells_core::dast::Dast::from_binary(b"CDST\x01\x00\x00\x00junk").unwrap_err(),
        Error::WireFormat(_)
    ));
    let mut good =
        cells_core::dast::Dast::from_json(&cells_core::testing::test_utils::dast_json("<point/>"))
            .unwrap()
            .to_binary();
    // Corrupt a child index.
    let n = good.len();
    good[n - 1] = 0xff;
    assert!(matches!(
        cells_core::dast::Dast::from_binary(&good).unwrap_err(),
        Error::WireFormat(_)
    ));
}

#[test]
fn boolean_input_drives_a_point_hide_as_a_zero_one_cell() {
    let mut doc = load_ok(
        r#"<booleanInput name="b" value="true"/><graph><point name="p" x="1" y="2" hide="$b"/></graph>"#,
    );
    assert_eq!(doc.value("b", "value"), Some(1.0));
    assert_eq!(
        doc.cell("p", "hide"),
        doc.cell("b", "value"),
        "hide aliases the boolean's cell"
    );
    doc.request(&[cells_core::Request {
        cell: doc.cell("p", "hide").unwrap(),
        value: 0.0,
    }]);
    assert_eq!(doc.value("b", "value"), Some(0.0));
    let doc = load_ok(r#"<point name="p"/>"#);
    assert_eq!(doc.value("p", "hide"), Some(0.0));
}

#[test]
fn names_resolve_through_containers_and_copies() {
    let doc = load(
        r#"<graph><point name="q">(1,2)</point></graph>
           <graph name="g"><point name="p">(3,4)</point></graph>
           <graph extend="$g" name="h"/>"#,
    )
    .unwrap();
    assert_eq!(doc.value("q", "x"), Some(1.0));
    // `p` exists in g and in its copy h; the original wins a bare lookup.
    let gp = doc.resolve_path("g.p").unwrap();
    assert_eq!(doc.resolve_path("p"), Some(gp));
    assert_eq!(doc.cells[doc.prop_cells(gp, "x").unwrap()[0] as usize], 3.0);
    let hp = doc.resolve_path("h.p").unwrap();
    assert_eq!(doc.prop_cells(hp, "x"), doc.prop_cells(gp, "x"));
}

#[test]
fn a_copys_own_hide_wins_over_the_inherited_one() {
    // The current core: `<text extend="$hidden" hide="false"/>` reveals.
    let doc = load_ok(
        r#"<point name="p" hide>(1,2)</point><point name="q" extend="$p" hide="false"/><point name="r" extend="$p"/><point name="s" extend="$q" hide/>"#,
    );
    assert_eq!(doc.value("p", "hide"), Some(1.0));
    assert_eq!(doc.value("q", "hide"), Some(0.0));
    assert_eq!(doc.value("r", "hide"), Some(1.0));
    assert_eq!(doc.value("s", "hide"), Some(1.0));
}

#[test]
fn point_list_needs_extend_of_an_array_prop() {
    let e = load(r#"<graph><pointList name="ps"/></graph>"#).unwrap_err();
    assert!(matches!(e, Error::BadValue { .. }), "{e}");
}
