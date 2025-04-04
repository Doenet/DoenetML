use doenetml_core::{components::doenet::division::DivisionProps, props::prop_type};

use super::*;

#[test]
fn division_can_get_division_type() {
    let dast_root = dast_root_no_position(
        r#"<division type="section" name="d1"><division type="chapter" name="d2" /></division>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let ty: prop_type::DivisionType = core.get_prop_value_typed(
        core.get_component_index_by_name("d1"),
        DivisionProps::DivisionType.local_idx(),
    );
    assert_eq!(ty, prop_type::DivisionType::Section);

    let ty: prop_type::DivisionType = core.get_prop_value_typed(
        core.get_component_index_by_name("d2"),
        DivisionProps::DivisionType.local_idx(),
    );
    assert_eq!(ty, prop_type::DivisionType::Chapter);
}

#[test]
fn division_can_infer_their_type() {
    let dast_root =
        dast_root_no_position(r#"<division name="d1"><division name="d2" /></division>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let ty: prop_type::DivisionType = core.get_prop_value_typed(
        core.get_component_index_by_name("d1"),
        DivisionProps::DivisionType.local_idx(),
    );
    assert_eq!(ty, prop_type::DivisionType::Section);

    let ty: prop_type::DivisionType = core.get_prop_value_typed(
        core.get_component_index_by_name("d2"),
        DivisionProps::DivisionType.local_idx(),
    );
    assert_eq!(ty, prop_type::DivisionType::Subsection);
}

#[test]
fn division_report_proper_label() {
    let dast_root = dast_root_no_position(r#"<section name="d1"><chapter name="d2" /></section>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let label: prop_type::XrefLabel = core.get_prop_value_typed(
        core.get_component_index_by_name("d1"),
        DivisionProps::XrefLabel.local_idx(),
    );
    assert_eq!(label.label, "Section");

    let label: prop_type::XrefLabel = core.get_prop_value_typed(
        core.get_component_index_by_name("d2"),
        DivisionProps::XrefLabel.local_idx(),
    );
    assert_eq!(label.label, "Chapter");
}
