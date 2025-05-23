use crate::{
    core::core::Core,
    dast::{flat_dast::FlatRoot, ref_expand::Expander},
    test_utils::*,
};

/// Sample XML:
/// ```xml
/// <text case="upper" name="t">
///    <text name="t2">hello</text> World!
/// </text>
/// <text case="lower" name="t3">
///     $t
/// </text>
/// ```
#[test]
fn test_normalized_root_to_mermaid() {
    let dast_root = dast_root_no_position(
        r#"<text case="upper" name="t"><text name="t2">hello</text> World!</text><text case="lower" name="t3">$t</text>"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);
    let normalized_flat_root = flat_root.into_normalized_root();

    // Print out the mermaid graph
    println!("{}", normalized_flat_root.to_mermaid())
}

#[test]
fn test_core() {
    let dast_root = dast_root_no_position(
        r#"<textInput prefill="hi" name="t"><text name="t2">hello</text> World!</textInput><text case="lower" name="t3">$t</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    println!("{}", core.to_mermaid());
}

#[test]
fn test_core2() {
    let dast_root =
        dast_root_no_position(r#"<text name="t">Hello</text><text extend="$t"> World</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    println!("{}", core.to_mermaid());
}
