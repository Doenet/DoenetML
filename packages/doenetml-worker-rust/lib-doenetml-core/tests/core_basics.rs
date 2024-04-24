mod test_utils;
use assert_json_diff::assert_json_eq;
use doenetml_core::core::core::Core;
use test_utils::*;

#[test]
fn basic_core_initialization() {
    let dast_root = dast_root_no_position("<document>hi there<text>you</text></document>");

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    let result = core.to_flat_dast();

    let processed_string = to_serde_value(&result);
    assert_json_eq!(
        json!({
            "type": "root",
            "children": [0],
            "elements": [
                {
                    "type": "element",
                    "name": "document",
                    "attributes": {},
                    "children": [
                        "hi there",
                        1
                    ],
                    "data": {
                        "id": 0,
                        "action_names": [],
                        "props": {}
                    }
                },
                {
                    "type": "element",
                    "name": "text",
                    "attributes": {},
                    "children": [],
                    "data": {
                        "id": 1,
                        "action_names": [],
                        "props": {
                            "value": "you",
                        }
                    }
                }
            ],
            "warnings": []
        }),
        processed_string
    );
}

#[test]
fn test_core_can_get_component_index_by_name() {
    let dast_root =
        dast_root_no_position(r#"<text name="t1"/><text name="t2"><text name="t3"/></text>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    assert_eq!(core.get_component_index_by_name("t1"), 1);
    assert_eq!(core.get_component_index_by_name("t2"), 2);
    assert_eq!(core.get_component_index_by_name("t3"), 3);
}
