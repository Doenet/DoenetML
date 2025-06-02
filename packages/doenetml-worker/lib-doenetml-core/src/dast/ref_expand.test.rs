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
                "type": "flatRoot",
                "children": [0],
                "nodes": [
                  {
                    "type": "element",
                    "name": "document",
                    "children": [1, 2],
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
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 2,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 1,
                        "unresolvedPath": null,
                        "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }]
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
                "type": "flatRoot",
                "children": [0],
                "nodes": [
                  {
                    "type": "element",
                    "name": "document",
                    "children": [1, 2],
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
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 2,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 1,
                        "unresolvedPath": [
                          {
                            "type": "flatPathPart",
                            "index": [],
                            "name": "x",
                          }
                        ],
                        "originalPath": [
                          { "type": "flatPathPart", "name": "p", "index": [] },
                          { "type": "flatPathPart", "name": "x", "index": [] }
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
    let dast_root = dast_root_no_position(r#"<point name="p" /><number name="n" />$p.x[$p.y[$n]]"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "nodes": [
                  {
                    "type": "element",
                    "name": "document",
                    "children": [1, 2, 3],
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
                    "name": "number",
                    "parent": 0,
                    "children": [],
                    "attributes": [
                      {
                        "type": "attribute",
                        "name": "name",
                        "parent": 2,
                        "children": ["n"]
                      }
                    ],
                    "idx": 2
                  },
                  {
                    "type": "element",
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 3,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 1,
                        "unresolvedPath": [
                          {
                            "type": "flatPathPart",
                            "index": [{ "value": [4] }],
                            "name": "x",
                          }
                        ],
                        "originalPath": [
                          { "type": "flatPathPart", "name": "p", "index": [] },
                          { "type": "flatPathPart", "name": "x", "index": [{ "value": [4] }] }
                        ]
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
                        "unresolvedPath": [
                          {
                            "type": "flatPathPart",
                            "index": [{ "value": [5] }],
                            "name": "y",
                          }
                        ],
                        "originalPath": [
                          { "type": "flatPathPart", "name": "p", "index": [] },
                          { "type": "flatPathPart", "name": "y", "index": [{ "value": [5] }] }
                        ]
                      }
                    }
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 4,
                    "children": [],
                    "attributes": [],
                    "idx": 5,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 2,
                        "unresolvedPath": null,
                        "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }]
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
                "type": "flatRoot",
                "children": [0],
                "nodes": [
                  {
                    "type": "element",
                    "name": "document",
                    "children": [1, 2],
                    "attributes": [],
                    "idx": 0
                  },
                  {
                    "type": "element",
                    "name": "point",
                    "parent": 0,
                    "children": [],
                    "attributes": [{ "type": "attribute", "name": "name", "parent": 1, "children": ["p"] }],
                    "idx": 1
                  },
                  {
                    "type": "element",
                    "name": "a",
                    "parent": 0,
                    "children": [],
                    "attributes": [{ "type": "attribute", "name": "foo", "parent": 2, "children": [3] }],
                    "idx": 2
                  },
                  {
                    "type": "element",
                    "name": "point",
                    "parent": 2,
                    "children": [],
                    "attributes": [],
                    "idx": 3,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 1,
                        "unresolvedPath": null,
                        "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }]
                      }
                    },
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
            "type": "flatRoot",
            "children": [0],
            "nodes": [
              {
                "type": "element",
                "name": "document",
                "children": [1, 2],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [{ "type": "attribute", "name": "name", "parent": 1, "children": ["p"] }],
                "idx": 1
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [{ "type": "attribute", "name": "foo", "parent": 2, "children": ["bar"] }],
                "idx": 2,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }]
                  }
                }
              },
              // Note, this element is left over from the original `$p` ref. However, it is
              // no longer referenced anywhere.
              {
                "type": "element",
                "name": "point",
                "parent": 2,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }]
                  }
                }
              }
            ]
          }
        )
    );
}

#[test]
fn can_expand_a_copy_attribute_to_a_node_ref() {
    let dast_root = dast_root_no_position(r#"<point name="p"/><point copy="$p" foo="bar" />"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "flatRoot",
            "children": [0],
            "nodes": [
              {
                "type": "element",
                "name": "document",
                "children": [1, 2],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [{ "type": "attribute", "name": "name", "parent": 1, "children": ["p"] }],
                "idx": 1
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [{ "type": "attribute", "name": "foo", "parent": 2, "children": ["bar"] }],
                "idx": 2,
                "extending": {
                  "CopyAttribute": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }]
                  }
                }
              },
              // Note, this element is left over from the original `$p` ref. However, it is
              // no longer referenced anywhere.
              {
                "type": "element",
                "name": "point",
                "parent": 2,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }]
                  }
                }
              }
            ]
          }
        )
    );
}

#[test]
fn initial_ref_skips_option_children() {
    let dast_root = dast_root_no_position(
        r#"<number name="n1" />$n1$n2$o.n2<option name="o"><number name="n2" />$n1$n2</option>"#,
    );
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);

    println!("{:#?}", serde_json::to_value(&flat_root).unwrap());
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "nodes": [
                  {
                    "type": "element",
                    "name": "document",
                    "children": [1, 2, 3, 4, 5],
                    "attributes": [],
                    "idx": 0
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 0,
                    "children": [],
                    "attributes": [
                      {
                        "type": "attribute",
                        "name": "name",
                        "parent": 1,
                        "children": ["n1"]
                      }
                    ],
                    "idx": 1
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 2,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 1,
                        "unresolvedPath": null,
                        "originalPath": [{ "type": "flatPathPart", "name": "n1", "index": [] }]
                      }
                    }
                  },
                  {
                    "type": "error",
                    "message": "No referent found for reference: $n2",
                    "errorType": "warning",
                    "parent": 0,
                    "idx": 3,
                    "unresolvedPath": [{ "type": "flatPathPart", "name": "n2", "index": [] }]
                  },
                  {
                    "type": "element",
                    "name": "option",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 4,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 5,
                        "unresolvedPath":  [{ "type": "flatPathPart", "name": "n2", "index": [] }],
                        "originalPath": [
                          { "type": "flatPathPart", "name": "o", "index": [] },
                          { "type": "flatPathPart", "name": "n2", "index": [] }
                        ]
                      }
                    }
                  },
                  {
                    "type": "element",
                    "name": "option",
                    "parent": 0,
                    "children": [6, 7, 8],
                    "attributes": [
                      {
                        "type": "attribute",
                        "name": "name",
                        "parent": 5,
                        "children": ["o"]
                      }
                    ],
                    "idx": 5
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 5,
                    "children": [],
                    "attributes": [
                      {
                        "type": "attribute",
                        "name": "name",
                        "parent": 6,
                        "children": ["n2"]
                      }
                    ],
                    "idx": 6
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 5,
                    "children": [],
                    "attributes": [],
                    "idx": 7,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 1,
                        "unresolvedPath": null,
                        "originalPath": [{ "type": "flatPathPart", "name": "n1", "index": [] }]
                      }
                    }
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 5,
                    "children": [],
                    "attributes": [],
                    "idx": 8,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 6,
                        "unresolvedPath": null,
                        "originalPath": [{ "type": "flatPathPart", "name": "n2", "index": [] }]
                      }
                    }
                  },
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
