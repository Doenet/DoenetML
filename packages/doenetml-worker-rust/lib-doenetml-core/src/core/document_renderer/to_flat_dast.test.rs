use std::rc::Rc;

use crate::{
    components::types::{ComponentIdx, StringIdx},
    props::PropValue,
    state::types::content_refs::ContentRef,
    test_utils::dast_root_no_position,
    Core,
};

#[test]
fn test_can_make_flat_dast_for_component() {
    let dast_root = dast_root_no_position(r#"<document bar="baz">hi<foo /></document>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    //let flat_dast = core.component_to_flat_dast2(&core.components[0]);
    let flat_dast = core
        .document_renderer
        .component_to_flat_dast(0.into(), &core.document_model);
    dbg!(flat_dast);
}

#[test]
fn test_content_ref_prop_values_get_serialized_correctly() {
    let dast_root = dast_root_no_position(r#"hi"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let refs = PropValue::ContentRefs(Rc::new(
        vec![
            ContentRef::String(StringIdx::new(0)),
            ComponentIdx::new(2).into(),
        ]
        .into(),
    ));
    let prepared =
        core.document_renderer
            .prepare_prop_value_for_render("foo", refs, &core.document_model);
    assert_eq!(
        serde_json::to_string(&prepared.value).unwrap(),
        r#"["hi",2]"#
    );
}
