use assert_json_diff::assert_json_eq;

use super::*;
use crate::dast::{Position, flat_dast::FlatPathPart};
use crate::test_utils::*;

#[test]
fn refs_get_expanded_to_their_referents() {
    let source = r#"<point name="p" />$p"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "sources": [source],
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
                        "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                        "nodesInResolvedPath": [2, 1],
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
    let source = r#"<point name="p" />$p.x"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "sources": [source],
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
                        ],
                        "nodesInResolvedPath": [2, 1],
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
    let source = r#"<point name="p" /><number name="n" />$p.x[$p.y[$n]]"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "sources": [source],
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
                        ],
                        "nodesInResolvedPath": [3, 1],
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
                        ],
                        "nodesInResolvedPath": [4, 1],
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
                        "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }],
                        "nodesInResolvedPath": [5, 2],
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
    let source = r#"<point name="p" /><a foo="$p" />"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "sources": [source],
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
                        "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                        "nodesInResolvedPath": [3, 1],
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
    let source = r#"<point name="p"/><point extend="$p" foo="bar" />"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "flatRoot",
            "children": [0],
            "sources": [source],
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
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [2, 1],
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
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [3, 1],
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
    let source = r#"<point name="p"/><point copy="$p" foo="bar" />"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
          {
            "type": "flatRoot",
            "children": [0],
            "sources": [source],
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
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [2, 1],
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
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [3, 1],
                  }
                }
              }
            ]
          }
        )
    );
}

#[test]
fn initial_ref_skips_unqualified_option_children() {
    let source =
        r#"<number name="n1" />$n1$n2$o.n2<option name="o"><number name="n2" />$n1$n2</option>"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);

    assert_json_eq!(
        serde_json::to_value(&flat_root).unwrap(),
        json!(
            {
                "type": "flatRoot",
                "children": [0],
                "sources": [source],
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
                        "originalPath": [{ "type": "flatPathPart", "name": "n1", "index": [] }],
                        "nodesInResolvedPath": [2, 1],
                      }
                    }
                  },
                  {
                    "type": "error",
                    "message": "No referent found for reference: `$n2`",
                    "errorType": "warning",
                    "code": "doenet-w0104",
                    "parent": 0,
                    "idx": 3,
                    "unresolvedPath": [{ "type": "flatPathPart", "name": "n2", "index": [] }]
                  },
                  {
                    "type": "element",
                    "name": "number",
                    "parent": 0,
                    "children": [],
                    "attributes": [],
                    "idx": 4,
                    "extending": {
                      "Ref": {
                        "nodeIdx": 6,
                        "unresolvedPath":  null,
                        "originalPath": [
                          { "type": "flatPathPart", "name": "o", "index": [] },
                          { "type": "flatPathPart", "name": "n2", "index": [] }
                        ],
                        "nodesInResolvedPath": [4, 5, 6],
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
                        "originalPath": [{ "type": "flatPathPart", "name": "n1", "index": [] }],
                        "nodesInResolvedPath": [7, 1],
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
                        "originalPath": [{ "type": "flatPathPart", "name": "n2", "index": [] }],
                        "nodesInResolvedPath": [8, 6],
                      }
                    }
                  },
                ]
              }
        )
    );
}

/// The text of `source` that `position` spans.
fn spanned<'a>(source: &'a str, position: &Option<Position>) -> &'a str {
    let position = position.as_ref().expect("a position");
    &source[position.start.offset.unwrap()..position.end.offset.unwrap()]
}

/// The text of `source` that `path` spans, with the `$` in front of it: what
/// the worker quotes as the reference (`convertNormalizedDast.ts`).
fn spanned_path(source: &str, path: &[FlatPathPart]) -> String {
    let start = path[0].position.as_ref().unwrap().start.offset.unwrap();
    let end = path
        .last()
        .unwrap()
        .position
        .as_ref()
        .unwrap()
        .end
        .offset
        .unwrap();
    format!("${}", &source[start..end])
}

/// The error nodes of `flat_root`.
fn errors_of(flat_root: &FlatRoot) -> Vec<&FlatError> {
    flat_root
        .nodes
        .iter()
        .filter_map(|node| match node {
            FlatNode::Error(e) => Some(e),
            _ => None,
        })
        .collect()
}

/// An index that names nothing whatever the length (`0`, or one that is not a
/// count, such as `-1`) fails to resolve, and is reported with the same code as
/// a name that names nothing, `doenet-w0104`. The worker raises that code for
/// the same index written dynamically (`$l[$i]` with `i` = 0), so the two read
/// alike (#2407). The resolver leaves the code's argument to the worker, which
/// quotes the reference from the path's positions, so the path has to span the
/// whole reference, and the node has to be marked where it was written.
#[test]
fn an_index_that_names_nothing_is_coded_as_no_referent() {
    for written in ["$l[0]", "$l[-1]", "$l[0].x", "$nothing.x[2]"] {
        let source = format!(r#"<mathList name="l">1 2</mathList>{written}"#);
        let dast_root = dast_root(&source);
        let mut flat_root = FlatRoot::from_dast(&dast_root);
        Expander::expand(&mut flat_root);

        let errors = errors_of(&flat_root);
        assert_eq!(errors.len(), 1, "{written}");
        let error = errors[0];
        assert_eq!(error.code.as_deref(), Some("doenet-w0104"), "{written}");
        assert!(error.args.is_none(), "{written}");
        assert!(matches!(error.error_type, ErrorType::Warning), "{written}");
        assert_eq!(spanned(&source, &error.position), written);
        let path = error.unresolved_path.as_ref().expect(written);
        assert_eq!(spanned_path(&source, path), written);
    }
}

/// A name that names more than one thing is coded `doenet-w0105`. It carries no
/// path, so the worker quotes the reference from the node's position.
#[test]
fn a_reference_with_more_than_one_referent_is_coded() {
    let source = r#"<text name="t" /><text name="t" />$t"#;
    let dast_root = dast_root(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);

    let errors = errors_of(&flat_root);
    assert_eq!(errors.len(), 1);
    assert_eq!(errors[0].code.as_deref(), Some("doenet-w0105"));
    assert!(errors[0].args.is_none());
    assert!(errors[0].unresolved_path.is_none());
    assert_eq!(spanned(source, &errors[0].position), "$t");
}

/// The same index in an `extend` or `copy` attribute keeps the code and the
/// path, and is marked at the reference inside the attribute rather than at the
/// whole attribute, as the same reference written as text is (#2407).
#[test]
fn an_index_that_names_nothing_in_an_extend_attribute_is_coded() {
    for attribute in ["extend", "copy"] {
        let source = format!(r#"<mathList name="l">1 2</mathList><math {attribute}="$l[0]" />"#);
        let dast_root = dast_root(&source);
        let mut flat_root = FlatRoot::from_dast(&dast_root);
        Expander::expand(&mut flat_root);

        let math = flat_root
            .nodes
            .iter()
            .find_map(|node| match node {
                FlatNode::Element(e) if e.name == "math" => Some(e),
                _ => None,
            })
            .unwrap();
        assert!(math.attributes.is_empty(), "{attribute}");
        assert!(math.extending.is_none(), "{attribute}");
        let [UntaggedContent::Ref(error_idx)] = math.children[..] else {
            panic!("{attribute}: the attribute's failure is the element's only child");
        };
        let FlatNode::Error(error) = &flat_root.nodes[error_idx] else {
            panic!("{attribute}: expected an error");
        };
        assert_eq!(error.parent, Some(math.idx), "{attribute}");
        assert_eq!(error.code.as_deref(), Some("doenet-w0104"), "{attribute}");
        assert!(error.args.is_none(), "{attribute}");
        assert!(
            matches!(error.error_type, ErrorType::Warning),
            "{attribute}"
        );
        assert_eq!(
            error.message,
            format!("In '{attribute}' attribute: No referent found for reference: `$l`")
        );
        assert_eq!(spanned(&source, &error.position), "$l[0]", "{attribute}");
        assert_eq!(error.source_doc, math.source_doc, "{attribute}");
        let path = error.unresolved_path.as_ref().expect(attribute);
        assert_eq!(spanned_path(&source, path), "$l[0]", "{attribute}");
    }
}

/// An `extend` attribute that is invalid for another reason than a reference
/// that failed to resolve is still an uncoded error marked at the attribute.
#[test]
fn an_invalid_extend_attribute_is_still_uncoded() {
    let source = r#"<math extend="x" />"#;
    let dast_root = dast_root(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);

    let errors = errors_of(&flat_root);
    assert_eq!(errors.len(), 1);
    assert_eq!(errors[0].code, None);
    assert!(errors[0].unresolved_path.is_none());
    assert!(matches!(errors[0].error_type, ErrorType::Error));
    assert_eq!(errors[0].message, "Invalid 'extend' attribute");
    assert_eq!(spanned(source, &errors[0].position), r#"extend="x""#);
}
