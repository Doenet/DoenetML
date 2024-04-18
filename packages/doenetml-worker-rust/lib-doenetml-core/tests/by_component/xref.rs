use super::*;

use doenetml_core::{
    components::{doenet::xref::XrefProps, ComponentNode},
    props::{prop_type, traits::IntoPropView, PropView},
    state::types::component_refs::ComponentRef,
};

#[test]
fn xref_ref_attribute_refs_dont_expand() {
    let dast_root = dast_root_no_position(r#"<section name="foo"/><xref ref="$foo" />"#);

    //attach_codelldb_debugger();

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
