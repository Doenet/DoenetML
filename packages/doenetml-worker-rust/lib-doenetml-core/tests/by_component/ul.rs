use super::*;

use doenetml_core::{
    components::doenet::{ol::OlProps, ul::UlProps},
    props::{PropView, prop_type},
};

#[test]
fn ol_can_report_their_depth() {
    let dast_root = dast_root_no_position(r#"<ul><ul /></ul><ul />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let depth: prop_type::ListDepth = core.get_prop_value_typed(1, UlProps::ListDepth.local_idx());
    assert_eq!(depth, prop_type::ListDepth::Ul(0));

    let depth: prop_type::ListDepth = core.get_prop_value_typed(2, UlProps::ListDepth.local_idx());
    assert_eq!(depth, prop_type::ListDepth::Ul(1));
}

#[test]
fn ol_can_compute_marker() {
    let dast_root = dast_root_no_position(
        r#"<ul marker="square" name="a" /><ul name="b" ><ul name="c" /></ul>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // Test the marker that has been computed
    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("a"),
        UlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Square);

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("b"),
        UlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Disc);

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("c"),
        UlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Circle);
}

#[test]
fn nested_ol_inside_ul_have_correct_markers() {
    let dast_root = dast_root_no_position(
        r#"
                <ul name="a">
                  <li>
                    there
                    <ol name="b">
                      <li>
                        you
                        <ol name="c">
                          <li>hey</li>
                        </ol>
                      </li>
                    </ol>
                  </li>
                </ul>
                "#,
    );
    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // Test the marker that has been computed
    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("a"),
        UlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Disc);

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
fn nested_ul_inside_ol_have_correct_markers() {
    let dast_root = dast_root_no_position(
        r#"
                <ol name="a">
                  <li>
                    there
                    <ul name="b">
                      <li>
                        you
                        <ul name="c">
                          <li>hey</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ol>
                "#,
    );
    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // Test the marker that has been computed
    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("a"),
        OlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Decimal { start: 1 });

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("b"),
        UlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Disc);

    let marker: PropView<prop_type::ListMarker> = core.get_prop_typed(
        core.get_component_index_by_name("c"),
        UlProps::Marker.local_idx(),
    );
    assert_eq!(marker.value, prop_type::ListMarker::Circle);
}
