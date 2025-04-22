use assert_json_diff::assert_json_eq;

use super::*;
use crate::{dast::ref_expand::Expander, test_utils::*};

#[test]
fn can_compactify() {
    let dast_root = dast_root_no_position(r#"<document><a><b /></a></document>"#);
    let dast_root2 = dast_root_no_position(r#"<document><x><y /></x></document>"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    // Add several nodes that aren't connected to the root
    flat_root.merge_content(&dast_root2.children[0], Some(0));
    flat_root.compactify(None);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "FlatRoot",
            "children": [0],
            "nodes": [
              {
                "type": "Element",
                "name": "document",
                "children": [1],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "Element",
                "name": "a",
                "parent": 0,
                "children": [2],
                "attributes": [],
                "idx": 1
              },
              {
                "type": "Element",
                "name": "b",
                "parent": 1,
                "children": [],
                "attributes": [],
                "idx": 2
              }
            ]
          }
        )
    );

    // Try again, but this time we will attach nodes 2 and 3 to the root.
    flat_root = FlatRoot::from_dast(&dast_root);
    // Add several nodes that aren't connected to the root
    flat_root.merge_content(&dast_root2.children[0], Some(0));
    flat_root.children = vec![UntaggedContent::Ref(2), UntaggedContent::Ref(3)];
    flat_root.nodes[2].set_parent(None);
    flat_root.nodes[3].set_parent(None);
    flat_root.compactify(None);

    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "FlatRoot",
            "children": [0, 1],
            "nodes": [
              {
                "type": "Element",
                "name": "b",
                "children": [],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "Element",
                "name": "document",
                "children": [2],
                "attributes": [],
                "idx": 1
              },
              {
                "type": "Element",
                "name": "x",
                "parent": 1,
                "children": [3],
                "attributes": [],
                "idx": 2
              },
              {
                "type": "Element",
                "name": "y",
                "parent": 2,
                "children": [],
                "attributes": [],
                "idx": 3
              }
            ]
          }
        )
    );
}

#[test]
fn compactify_adjusts_extending_refs_attributes_and_resolver() {
    let dast_root = dast_root_no_position(
        r#"<text name="t">hello</text><text extend="$t"> world</text><textInput name="ti" /><p><text name="tiv" extend="$ti.immediateValue"> world</text></p>"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let mut resolver = Expander::expand(&mut flat_root);
    flat_root.compactify(Some(&mut resolver));

    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "FlatRoot",
            "children": [0],
            "nodes": [
              {
                "type": "Element",
                "name": "document",
                "children": [1, 2, 3, 4],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "Element",
                "name": "text",
                "parent": 0,
                "children": ["hello"],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 1,
                    "children": ["t"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "Element",
                "name": "text",
                "parent": 0,
                "children": [" world"],
                "attributes": [],
                "idx": 2,
                "extending": {
                  "Attribute": {
                    "node_idx": 1,
                    "unresolved_path": null
                  }
                }
              },
              {
                "type": "Element",
                "name": "textInput",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 3,
                    "children": ["ti"]
                  }
                ],
                "idx": 3
              },
              {
                "type": "Element",
                "name": "p",
                "parent": 0,
                "children": [5],
                "attributes": [],
                "idx": 4
              },
              {
                "type": "Element",
                "name": "text",
                "parent": 4,
                "children": [" world"],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 5,
                    "children": ["tiv"]
                  }
                ],
                "idx": 5,
                "extending": {
                  "Attribute": {
                    "node_idx": 3,
                    "unresolved_path": [
                      {
                        "type": "flatPathPart",
                        "name": "immediateValue",
                        "index": []
                      }
                    ]
                  }
                }
              }
            ]
          }
        )
    );

    assert_json_eq!(
        serde_json::to_value(&resolver).unwrap(),
        json!({
          "node_parent": [
            null,
            0,
            0,
            0,
            0,
            4
          ],
          "name_map": [
            {
              "t": { "Unique": 1 },
              "ti": { "Unique": 3 },
              "tiv": { "Unique": 5 }
            },
            {},
            {},
            {},
            {},
            {
              "tiv": { "Unique": 5 }
            },
            {},
            {}
          ]
        })
    );
}

#[test]
fn compactify_preserves_refs_in_path_parts() {
    let dast_root = dast_root_no_position(r#"<number name="n"/><point name="p"/>$p[$n]"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);

    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "FlatRoot",
            "children": [0],
            "nodes": [
              {
                "type": "Element",
                "name": "document",
                "children": [1, 2, 3],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "Element",
                "name": "number",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 1,
                    "children": ["n"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "Element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 2,
                    "children": ["p"]
                  }
                ],
                "idx": 2,
              },
              {
                "type": "Element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "Ref": {
                    "node_idx": 2,
                    "unresolved_path": [
                      {
                        "type": "flatPathPart",
                        "name": "",
                        "index": [
                          {
                            "value": [4]
                          }
                        ]
                      }
                    ]
                  }
                }
              },
              {
                "type": "Element",
                "name": "number",
                "parent": 3,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Ref": {
                    "node_idx": 1,
                    "unresolved_path": null
                  }
                }
              }
            ]
          }
        )
    );
}
