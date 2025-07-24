use assert_json_diff::assert_json_eq;

use crate::{
    dast::{flat_dast::FlatRoot, ref_expand::Expander},
    test_utils::*,
};

#[test]
fn can_create_normalized_dast_after_expanding_refs() {
    let source = r#"<point name="p"/><function name="f" />$$f(1,2, $p)<foo bar="$p"/>"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);
    let normalized_flat_root = flat_root.into_normalized_root();
    assert_json_eq!(
        serde_json::to_value(&normalized_flat_root).unwrap(),
        json!(
          {
            "type": "normalizedRoot",
            "children": [0],
            "sources": [source],
            "nodes": [
              {
                "type": "element",
                "name": "document",
                "children": [1, 2, 3, 5],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 1,
                    "children": ["p"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "element",
                "name": "function",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 2,
                    "children": ["f"]
                  }
                ],
                "idx": 2
              },
              {
                "type": "element",
                "name": "evaluate",
                "parent": 0,
                "children": [7],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "Ref": {
                    "nodeIdx": 2,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "f", "index": [] }],
                    "nodesInResolvedPath": [3, 2],
                  }
                }
              },
              {
                "type": "element",
                "name": "point",
                "parent": 3,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [4, 1],
                  }
                }
              },
              {
                "type": "element",
                "name": "foo",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "bar",
                    "parent": 5,
                    "children": [6]
                  }
                ],
                "idx": 5
              },
              {
                "type": "element",
                "name": "point",
                "parent": 5,
                "children": [],
                "attributes": [],
                "idx": 6,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [6, 1],
                  }
                }
              },
              {
                "type": "element",
                "name": "ol",
                "parent": 3,
                "children": [8, 9, 10],
                "attributes": [],
                "idx": 7
              },
              {
                "type": "element",
                "name": "li",
                "parent": 7,
                "children": ["1"],
                "attributes": [],
                "idx": 8
              },
              {
                "type": "element",
                "name": "li",
                "parent": 7,
                "children": ["2"],
                "attributes": [],
                "idx": 9
              },
              {
                "type": "element",
                "name": "li",
                "parent": 7,
                "children": [4],
                "attributes": [],
                "idx": 10
              }
            ]
          }
        )
    );
}
