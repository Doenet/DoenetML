use assert_json_diff::assert_json_eq;

use super::*;
use crate::test_utils::*;

#[test]
fn macros_get_expanded_to_their_referents() {
    let dast_root = dast_root_no_position(r#"<point name="p" />$p"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
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
                    "children": [1, 2],
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
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 2,
                    "extending": {
                      "node_idx": 1,
                      "unresolved_path": null
                    }
                  }
                ]
              }
        )
    );

    let dast_root = dast_root_no_position(
        &r#"<a name="x">
            <b name="y">
                <c name="z" />
                $x.y
            </b>
            <f>
                <e name="w" />
            </f>
        </a>
        $w
        <d name="y" />"#
            .replace("\n", "")
            .replace("  ", ""),
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_eq!(
        r#"<document><a name="x"><b name="y"><c name="z" /><b /></b><f><e name="w" /></f></a><e /><d name="y" /></document>"#,
        flat_root.to_xml()
    );
}

#[test]
fn leftover_path_parts_are_kept() {
    let dast_root = dast_root_no_position(r#"<point name="p" />$p.x"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
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
                    "children": [1, 2],
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
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 2,
                    "extending": {
                      "node_idx": 1,
                      "unresolved_path": [
                        {
                          "index": [],
                          "name": "x",
                          "type": "pathPart"
                        }
                      ]
                    }
                  }
                ]
              }
        )
    );
}

#[test]
fn macros_in_attributes_are_expanded() {
    let dast_root = dast_root_no_position(r#"<point name="p" /><a foo="$p" />"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
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
                    "children": [1, 2],
                    "attributes": [],
                    "idx": 0
                  },
                  {
                    "type": "Element",
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [{ "name": "name", "parent": 1, "children": ["p"] }],
                    "idx": 1
                  },
                  {
                    "type": "Element",
                    "name": "a",
                    "parent": 0,
                    "children": [],
                    "attributes": [{ "name": "foo", "parent": 2, "children": [3] }],
                    "idx": 2
                  },
                  {
                    "type": "Element",
                    "name": "point",
                    "parent": 2,
                    "children": [],
                    "attributes": [],
                    "idx": 3,
                    "extending": { "node_idx": 1, "unresolved_path": null }
                  }
                ]
            }
        )
    );
}
