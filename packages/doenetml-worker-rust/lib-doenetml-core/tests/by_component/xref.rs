use super::*;

use doenetml_core::{
    components::{ComponentNode, doenet::xref::XrefProps},
    props::{PropView, prop_type, traits::IntoPropView},
    state::types::component_refs::ComponentRef,
};

#[test]
fn xref_ref_attribute_refs_dont_expand() {
    let dast_root = dast_root_no_position(r#"<section name="foo"/><xref ref="$foo" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = ComponentIdx::from(1);
    let xref_idx = ComponentIdx::from(2);
    let _ref_idx = ComponentIdx::from(3);

    // The `$foo` should be expanded into a `<_ref />` component
    assert_eq!(core.get_component(_ref_idx).get_component_type(), "_ref");

    let prop = core.get_prop(xref_idx, XrefProps::Referent.local_idx());
    let pv: PropView<prop_type::ComponentRef> = prop.into_prop_view();
    assert_eq!(pv.value.unwrap(), ComponentRef(section_idx));
}

#[test]
fn xref_referring_to_itself_wont_crash_the_system() {
    let dast_root = dast_root_no_position(r#"<xref name="foo" ref="$foo" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);
    core.to_flat_dast();

    // the document tag will be index 0.
    let xref_idx = ComponentIdx::from(1);
    let _ref_idx = ComponentIdx::from(2);

    // The `$foo` should be expanded into a `<_ref />` component
    assert_eq!(core.get_component(_ref_idx).get_component_type(), "_ref");

    let prop = core.get_prop(xref_idx, XrefProps::Referent.local_idx());
    let pv: PropView<prop_type::ComponentRef> = prop.into_prop_view();
    assert_eq!(pv.value.unwrap(), ComponentRef(xref_idx));
}

#[test]
fn xref_ref_can_make_display_text() {
    let dast_root = dast_root_no_position(r#"<section name="foo"/><xref ref="$foo" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let xref_idx = ComponentIdx::from(2);

    let prop = core.get_prop(xref_idx, XrefProps::DisplayText.local_idx());
    let pv: PropView<prop_type::String> = prop.into_prop_view();
    assert_eq!(*pv.value, "Section 1".to_string());
}

#[test]
fn xref_ref_can_make_display_text_with_custom_children() {
    let dast_root = dast_root_no_position(r#"<section name="foo"/><xref ref="$foo">Foo</xref>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let xref_idx = ComponentIdx::from(2);

    let prop = core.get_prop(xref_idx, XrefProps::DisplayText.local_idx());
    let pv: PropView<prop_type::String> = prop.into_prop_view();
    assert_eq!(*pv.value, " 1".to_string());
}

#[test]
fn xref_can_tolerate_missing_ref_field() {
    let dast_root = dast_root_no_position(r#"<xref />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);
    core.to_flat_dast();
}

#[test]
fn xref_can_tolerate_invalid_ref_field() {
    let dast_root = dast_root_no_position(r#"<xref ref="$foo" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);
    core.to_flat_dast();
}

#[test]
fn xref_can_tolerate_invalid_ref_field2() {
    let dast_root = dast_root_no_position(r#"<xref ref="foo" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);
    core.to_flat_dast();
}
