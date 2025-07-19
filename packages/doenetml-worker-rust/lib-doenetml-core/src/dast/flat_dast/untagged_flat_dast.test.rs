use assert_json_diff::assert_json_eq;

use super::*;
use crate::test_utils::*;

#[test]
fn can_flatten_dast_root() {
    let source = r#"<document>hi<foo my_attr="777 $x.y.z[$a]"/>and$$f(<bar>xxx</bar>)</document>"#;
    let dast_root = dast_root_no_position(source);
    let flat_root = FlatRoot::from_dast(&dast_root);
    // It is easier to compare JSON, so we serialize and deserialize for the comparison.
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
                    "children": ["hi", 1, "and", 4],
                    "attributes": [],
                    "idx": 0
                  },
                  {
                    "type": "element",
                    "name": "foo",
                    "parent": 0,
                    "children": [],
                    "attributes": [
                      { "type": "attribute", "name": "my_attr", "parent": 1, "children": ["777 ", 2] }
                    ],
                    "idx": 1
                  },
                  {
                    "type": "ref",
                    "parent": 1,
                    "path": [
                      { "type": "flatPathPart", "name": "x", "index": [] },
                      { "type": "flatPathPart", "name": "y", "index": [] },
                      { "type": "flatPathPart", "name": "z", "index": [{"value": [3]}] }
                    ],
                    "idx": 2
                  },
                  {
                    "type": "ref",
                    "parent": 2,
                    "path": [
                      { "type": "flatPathPart", "name": "a", "index": [] },
                    ],
                    "idx": 3
                  },
                  {
                    "type": "functionRef",
                    "parent": 0,
                    "path": [{ "type": "flatPathPart", "name": "f", "index": [] }],
                    "input": [[5]],
                    "idx": 4
                  },
                  {
                    "type": "element",
                    "name": "bar",
                    "parent": 4,
                    "children": ["xxx"],
                    "attributes": [],
                    "idx": 5
                  }
                ]
              }
        )
    );
}

#[test]
fn can_iterate_parents() {
    let dast_root = dast_root_no_position(r#"<document><a><b></b><x><c/></x></a></document>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    let parent_names = FlatRootOrFragment::Root(&flat_root)
        // Iterate from the `c` node
        .parent_iter(4)
        .map(|e| e.name.clone())
        .collect::<Vec<_>>();
    assert_eq!(vec!["x", "a", "document"], parent_names);
}

#[test]
fn can_print_to_xml() {
    let dast_root = dast_root_no_position(r#"<document><a><b></b><x><c/></x></a></document>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    assert_eq!(
        "<document><a><b /><x><c /></x></a></document>",
        flat_root.to_xml()
    );

    let dast_root = dast_root_no_position(
        r#"<document><a foo="bar" baz="zip"><b /><x><c/></x></a></document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    assert_eq!(
        r#"<document><a baz="zip" foo="bar"><b /><x><c /></x></a></document>"#,
        flat_root.to_xml()
    );

    let dast_root = dast_root_no_position(r#"<x>"#);
    let flat_root = FlatRoot::from_dast(&dast_root);
    assert_eq!(
        r#"<document><x><_error message="Invalid DoenetML: The tag `<x>` has no closing tag. Expected a self-closing tag or a `</x>` tag."/></x></document>"#,
        flat_root.to_xml()
    );
}

#[test]
fn calculate_children_position() {
    let source = r#"<document>hi <text>bye</text></document>"#;
    let dast_root = dast_root(source);
    let flat_root = FlatRoot::from_dast(&dast_root);
    // It is easier to compare JSON, so we serialize and deserialize for the comparison.

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
                    "children": ["hi ", 1],
                    "attributes": [],
                    "idx": 0,
                    "position": {
                      "start": {"line": 1, "column": 1, "offset": 0},
                      "end": {"line": 1, "column": 41, "offset": 40}
                    },
                    "childrenPosition": {
                      "start": {"line": 1, "column": 11, "offset": 10},
                      "end": {"line": 1, "column": 30, "offset": 29}
                    }
                  },
                  {
                    "type": "element",
                    "name": "text",
                    "parent": 0,
                    "children": ["bye"],
                    "attributes": [],
                    "idx": 1,
                    "position": {
                      "start": {"line": 1, "column": 14, "offset": 13},
                      "end": {"line": 1, "column": 30, "offset": 29}
                    },
                    "childrenPosition": {
                      "start": {"line": 1, "column": 20, "offset": 19},
                      "end": {"line": 1, "column": 23, "offset": 22}
                    }
                  },
                ]
              }
        )
    );
}
