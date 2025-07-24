use super::*;

use doenetml_core::{
    components::doenet::{li::LiProps, ol::OlProps},
    dast::ElementRefAnnotation,
    props::{PropView, prop_type},
    state::types::content_refs::{AnnotatedContentRefs, ContentRef},
};

#[test]
fn ol_can_report_their_depth() {
    let dast_root = dast_root_no_position(r#"<ol><ol /></ol><ol />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let depth: prop_type::ListDepth = core.get_prop_value_typed(1, OlProps::ListDepth.local_idx());
    assert_eq!(depth, prop_type::ListDepth::Ol(0));

    let depth: prop_type::ListDepth = core.get_prop_value_typed(2, OlProps::ListDepth.local_idx());
    assert_eq!(depth, prop_type::ListDepth::Ol(1));
}

#[test]
fn ol_can_compute_their_start_index() {
    let dast_root = dast_root_no_position(r#"<ol /><ol start="3" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let idx: prop_type::Integer = core.get_prop_value_typed(1, OlProps::StartIndex.local_idx());
    assert_eq!(idx, 1);

    let idx: prop_type::Integer = core.get_prop_value_typed(2, OlProps::StartIndex.local_idx());
    assert_eq!(idx, 3);
}

#[test]
fn ol_can_compute_marker() {
    let dast_root =
        dast_root_no_position(r#"<ol marker="I" name="a" /><ol name="b" ><ol name="c" /></ol>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // Test the marker coming from the attr
    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("a"),
        OlProps::MarkerAttr.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::UpperRoman);
    assert_eq!(marker.came_from_default, false);

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("b"),
        OlProps::MarkerAttr.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Decimal { start: 1 });
    assert_eq!(marker.came_from_default, true);

    // Test the marker that has been computed
    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("a"),
        OlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::UpperRoman);

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("b"),
        OlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Decimal { start: 1 });

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("c"),
        OlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::LowerAlpha);
}

#[test]
fn li_know_their_own_local_serial_number() {
    let dast_root = dast_root_no_position(
        r#"<ol><li name="a"/><li name="b"/></ol><ol><li name="c"/></ol><li name="d"/>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("a"),
        LiProps::LocalSerialNumber.local_idx(),
    );
    assert_eq!(pos, 0);

    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("b"),
        LiProps::LocalSerialNumber.local_idx(),
    );
    assert_eq!(pos, 1);

    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("c"),
        LiProps::LocalSerialNumber.local_idx(),
    );
    assert_eq!(pos, 0);

    // List item $d has no list container, but it should still have a serial number
    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("d"),
        LiProps::LocalSerialNumber.local_idx(),
    );
    assert_eq!(pos, 0);
}

#[test]
fn li_know_their_own_serial_number() {
    let dast_root = dast_root_no_position(
        r#"<ol><li name="a"/><li name="b"/></ol><ol start="4"><li name="c"/></ol><li name="d"/>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("a"),
        LiProps::SerialNumber.local_idx(),
    );
    assert_eq!(pos, 1);

    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("b"),
        LiProps::SerialNumber.local_idx(),
    );
    assert_eq!(pos, 2);

    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("c"),
        LiProps::SerialNumber.local_idx(),
    );
    assert_eq!(pos, 4);

    // List item $d has no list container, but it should still have a serial number
    let pos: prop_type::Integer = core.get_prop_value_typed(
        core.get_component_index_by_name("d"),
        LiProps::SerialNumber.local_idx(),
    );
    assert_eq!(pos, 1);
}

#[test]
fn li_know_their_own_code_number() {
    let dast_root = dast_root_no_position(
        r#"<ol><li name="a"/><li name="b"/></ol><ol start="4"><li><ol><li name="c" /></ol></li></ol><li name="d"/>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let pos: prop_type::String = core.get_prop_value_typed(
        core.get_component_index_by_name("a"),
        LiProps::CodeNumber.local_idx(),
    );
    assert_eq!(*pos, "1");

    let pos: prop_type::String = core.get_prop_value_typed(
        core.get_component_index_by_name("b"),
        LiProps::CodeNumber.local_idx(),
    );
    assert_eq!(*pos, "2");

    let pos: prop_type::String = core.get_prop_value_typed(
        core.get_component_index_by_name("c"),
        LiProps::CodeNumber.local_idx(),
    );
    assert_eq!(*pos, "4.a");

    // List item $d has no list container, but it should still have a serial number
    let pos: prop_type::String = core.get_prop_value_typed(
        core.get_component_index_by_name("d"),
        LiProps::CodeNumber.local_idx(),
    );
    assert_eq!(*pos, "1");
}

#[test]
fn li_can_start_at_zero() {
    let dast_root = dast_root_no_position(
        r#"<ol marker="0" name="ol"><li name="a"/><li name="b"/></ol><ol start="4"><li><ol><li name="c" /></ol></li></ol><li name="d"/>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let marker: prop_type::ListMarker = core.get_prop_value_typed(
        core.get_component_index_by_name("ol"),
        OlProps::Marker.local_idx(),
    );
    assert_eq!(marker, prop_type::ListMarker::Decimal { start: 0 });

    let pos: prop_type::String = core.get_prop_value_typed(
        core.get_component_index_by_name("a"),
        LiProps::CodeNumber.local_idx(),
    );
    assert_eq!(*pos, "0");

    let pos: prop_type::String = core.get_prop_value_typed(
        core.get_component_index_by_name("b"),
        LiProps::CodeNumber.local_idx(),
    );
    assert_eq!(*pos, "1");
}

#[test]
fn li_can_get_xref_display_children() {
    let dast_root =
        dast_root_no_position(r#"<ol><li name="a"><text name="t"/></li><li name="b"/></ol>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let pos: prop_type::AnnotatedContentRefs = core.get_prop_value_typed(
        core.get_component_index_by_name("a"),
        LiProps::XrefDisplayContent.local_idx(),
    );
    assert_eq!(
        *pos,
        AnnotatedContentRefs::from_vec(
            vec![(
                ContentRef::from(ComponentIdx::new(core.get_component_index_by_name("t"))),
                ElementRefAnnotation::Original
            )]
            .into()
        )
    );
}
