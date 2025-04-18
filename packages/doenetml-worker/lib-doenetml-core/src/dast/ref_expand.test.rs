use assert_json_diff::assert_json_eq;

use super::*;
use crate::test_utils::*;

#[test]
fn refs_get_expanded_to_their_referents() {
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
                      "Ref": {
                        "node_idx": 1,
                        "unresolved_path": [
                          {
                            "index": [],
                            "name": "x",
                          }
                        ]
                      }
                    }
                  }
                ]
              }
        )
    );
}

#[test]
fn references_expanded_in_leftover_path_parts() {
    let dast_root = dast_root_no_position(r#"<point name="p" /><number name="n" />$p.x[$n]"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    println!("{:#?}", serde_json::to_value(&flat_root).unwrap());
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
                    "name": "number",
                    "parent": 0,
                    "children": [],
                    "attributes": [
                      {
                        "name": "name",
                        "parent": 2,
                        "children": ["n"]
                      }
                    ],
                    "idx": 2
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
                        "node_idx": 1,
                        "unresolved_path": [
                          {
                            "index": [{ "value": [4] }],
                            "name": "x",
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
                        "node_idx": 2,
                        "unresolved_path": null
                      }
                    }
                  }
                ]
              }
        )
    );
}

#[test]
fn refs_in_attributes_are_expanded() {
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
                    "extending": { "Ref": { "node_idx": 1, "unresolved_path": null } }
                  }
                ]
            }
        )
    );
}

#[test]
fn can_expand_function_refs() {
    let dast_root = dast_root_no_position(r#"<point name="p"/><function name="f" />$$f(1,2, $p)"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_eq!(
        r#"<document><point name="p" /><function name="f" /><evaluate><ol><li>1</li><li>2</li><li><point /></li></ol></evaluate></document>"#,
        flat_root.to_xml()
    );
}

#[test]
fn can_expand_an_extend_attribute_to_a_node_ref() {
    let dast_root = dast_root_no_position(r#"<point name="p"/><point extend="$p" foo="bar" />"#);
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
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [{ "name": "foo", "parent": 2, "children": ["bar"] }],
                "idx": 2,
                "extending": { "Attribute": { "node_idx": 1, "unresolved_path": null } }
              },
              // Note, this element is left over from the original `$p` ref. However, it is
              // no longer referenced anywhere.
              {
                "type": "Element",
                "name": "point",
                "parent": 2,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": { "Ref": { "node_idx": 1, "unresolved_path": null } }
              }
            ]
          }
        )
    );
}
