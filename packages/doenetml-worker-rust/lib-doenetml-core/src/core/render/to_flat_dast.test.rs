use crate::test_utils::dast_root_no_position;

use super::*;

#[test]
fn test_can_make_flat_dast_for_component() {
    let dast_root = dast_root_no_position(r#"<document bar="baz">hi<foo /></document>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    //let flat_dast = core.component_to_flat_dast2(&core.components[0]);
    let flat_dast = core.component_to_flat_dast(0.into());
    dbg!(flat_dast);
}
