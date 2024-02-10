use assert_json_diff::assert_json_eq;

use crate::{
    dast::{flat_dast::FlatRoot, macro_expand::Expander},
    test_utils::*,
};

#[test]
fn can_create_normalized_dast_after_expanding_macros() {
    let dast_root = dast_root_no_position(
        r#"<point name="p"/><function name="f" />$$f(1,2, $p)<foo bar="$p"/>"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify();
    let normalized_flat_root = flat_root.into_normalized_root();
    assert_json_eq!(
        serde_json::to_value(&normalized_flat_root).unwrap(),
        json!(
          {
            "type": "NormalizedRoot",
            "children": [0],
            "nodes": [
              {
                "type": "Element",
                "name": "document",
                "children": [1, 2, 3, 5],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "Element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 1,
                    "children": ["p"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "Element",
                "name": "function",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "name": "name",
                    "parent": 2,
                    "children": ["f"]
                  }
                ],
                "idx": 2
              },
              {
                "type": "Element",
                "name": "evaluate",
                "parent": 0,
                "children": [7],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "Macro": {
                    "node_idx": 2,
                    "unresolved_path": null
                  }
                }
              },
              {
                "type": "Element",
                "name": "point",
                "parent": 3,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Macro": {
                    "node_idx": 1,
                    "unresolved_path": null
                  }
                }
              },
              {
                "type": "Element",
                "name": "foo",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "name": "bar",
                    "parent": 5,
                    "children": [6]
                  }
                ],
                "idx": 5
              },
              {
                "type": "Element",
                "name": "point",
                "parent": 5,
                "children": [],
                "attributes": [],
                "idx": 6,
                "extending": {
                  "Macro": {
                    "node_idx": 1,
                    "unresolved_path": null
                  }
                }
              },
              {
                "type": "Element",
                "name": "ol",
                "parent": 3,
                "children": [8, 9, 10],
                "attributes": [],
                "idx": 7
              },
              {
                "type": "Element",
                "name": "li",
                "parent": 7,
                "children": ["1"],
                "attributes": [],
                "idx": 8
              },
              {
                "type": "Element",
                "name": "li",
                "parent": 7,
                "children": ["2"],
                "attributes": [],
                "idx": 9
              },
              {
                "type": "Element",
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
