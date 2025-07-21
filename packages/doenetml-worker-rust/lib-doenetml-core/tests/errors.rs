mod test_utils;
use doenetml_core::core::core::Core;
use test_utils::*;

#[test]
fn errors_from_dast_parsing_transmitted() {
    let dast_root = dast_root_no_position("<document><a></document>");

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let elements = core.to_flat_dast().elements;

    assert_eq!(elements[1].name, "a");
    assert_eq!(elements[2].name, "_error");
    assert_eq!(elements[2].data.id, 2);
    assert!(
        elements[2]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("Invalid DoenetML")
    );
}

#[test]
fn error_from_no_referent() {
    let dast_root = dast_root_no_position("<document>$t</document>");

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let elements = core.to_flat_dast().elements;

    assert_eq!(elements[1].name, "_error");
    assert_eq!(elements[1].data.id, 1);
    assert!(
        elements[1]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("No referent")
    );
}

#[test]
fn error_from_multiple_referents() {
    let dast_root =
        dast_root_no_position("<document><text name='t' />$t<text name='t' /></document>");

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let elements = core.to_flat_dast().elements;

    assert_eq!(elements[2].name, "_error");
    assert_eq!(elements[2].data.id, 2);
    assert!(
        elements[2]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("Multiple referents")
    );
}

#[test]
fn error_referencing_external_and_referencing_error() {
    let dast_root = dast_root_no_position(
        "<document><text extend='$e' name='f' />$f<ext name='e'/></document>",
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let elements = core.to_flat_dast().elements;

    assert_eq!(elements[1].name, "_error");
    assert_eq!(elements[1].data.id, 1);
    assert!(
        elements[1]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("Error while extending")
    );
    assert!(
        elements[1]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("from an external component")
    );

    assert_eq!(elements[2].name, "_error");
    assert_eq!(elements[2].data.id, 2);
    assert!(
        elements[2]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("Error while extending")
    );
    assert!(
        elements[2]
            .data
            .message
            .as_ref()
            .unwrap()
            .contains("from an error component")
    );
}
