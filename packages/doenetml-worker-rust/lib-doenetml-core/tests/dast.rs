mod test_utils;

use assert_json_diff::assert_json_eq;
use test_utils::*;

#[test]
fn can_parse_dast_via_node() {
    // Parse without any position information
    assert_json_eq!(
        json!({
            "type": "root",
            "children": [
                {
                    "type": "element",
                    "name": "document",
                    "attributes": {},
                    "children": []
                }
            ],
            "sources": ["<document />"]
        }),
        evaluate_dast_via_node("<document />", true).unwrap()
    );

    // Parse with position information
    assert_json_eq!(
        json!({
            "type": "root",
            "children":[{
                "type":"element",
                "name":"document",
                "attributes":{},
                "children":[],
                "position":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":13,"offset":12}}
            }],
            "position":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":13,"offset":12}},
            "sources": ["<document />"]
        }),
        evaluate_dast_via_node("<document />", false).unwrap()
    );
}

#[test]
fn can_parse_dast_via_macro() {
    // Parse without any position information
    assert_json_eq!(
        json!({
            "type": "root",
            "children": [
                {
                    "type": "element",
                    "name": "document",
                    "attributes": {},
                    "children": []
                }
            ],
            "sources": ["<document />"]
        }),
        dast_no_position_as_serde_value("<document />")
    );

    // Parse with position information
    assert_json_eq!(
        json!({
            "type": "root",
            "children":[{
                "type":"element",
                "name":"document",
                "attributes":{},
                "children":[],
                "position":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":13,"offset":12}}
            }],
            "position":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":13,"offset":12}},
            "sources": ["<document />"]
        }),
        dast_as_serde_value("<document />")
    );
}
