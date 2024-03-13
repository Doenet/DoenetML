use super::*;

use test_helpers::*;

#[test]
fn section_finds_beginning_title_tag() {
    let dast_root =
        dast_root_no_position(r#"<section><title>Hello</title><text>content</text></section>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1;

    assert_eq!(get_title_prop(section_idx, &mut core), 2);
}

#[test]
fn section_finds_title_tag_in_middle() {
    let dast_root = dast_root_no_position(
        r#"<section>
        <text>text content</text> string outside
        <title>Hello</title>
        <text>more content</text>
        </section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1;

    assert_eq!(get_title_prop(section_idx, &mut core), 3);
}

#[test]
fn section_with_multiple_title_tags_picks_last() {
    let dast_root = dast_root_no_position(
        r#"<section>
        <title>title 1</title>
        <text>text content</text> string outside
        <title>title 2</title>
        <text>more content</text>
        </section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1;

    assert_eq!(get_title_prop(section_idx, &mut core), 4);
}

mod test_helpers {

    use doenetml_core::state::types::element_refs::ElementRefs;

    use super::*;

    // XXX - get these indices from the component type
    const TITLE_LOCAL_IDX: LocalPropIdx = LocalPropIdx(0);

    /// Resolves `title` from a `<section>` component and returns its value as a `ComponentIdx`
    pub fn get_title_prop(component_idx: ComponentIdx, core: &mut Core) -> ComponentIdx {
        let prop_node = core.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: TITLE_LOCAL_IDX,
        });
        let value = core.get_prop_for_render(prop_node).value;

        let element_refs: ElementRefs = (*value).clone().try_into().unwrap();

        element_refs[0]
    }
}
