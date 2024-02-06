use assert_json_diff::assert_json_eq;

use super::*;
use crate::test_utils::*;

#[test]
fn can_flatten_dast_root() {
    let dast_root = dast_root_no_position(
        r#"<document>hi<foo my_attr="777 $x.y.z"/>and$$f(<bar>xxx</bar>)</document>"#,
    );
    let flat_root = FlatRoot::from_dast(&dast_root);
    // It is easier to compare JSON, so we serialize and deserialize for the comparison.
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
                    "children": ["hi", 1, "and", 3],
                    "attributes": [],
                    "idx": 0
                  },
                  {
                    "type": "Element",
                    "name": "foo",
                    "parent": 0,
                    "children": [],
                    "attributes": [
                      { "name": "my_attr", "parent": 1, "children": ["777 ", 2] }
                    ],
                    "idx": 1
                  },
                  {
                    "type": "Macro",
                    "parent": 1,
                    "path": [
                      { "type": "pathPart", "name": "x", "index": [] },
                      { "type": "pathPart", "name": "y", "index": [] },
                      { "type": "pathPart", "name": "z", "index": [] }
                    ],
                    "idx": 2
                  },
                  {
                    "type": "FunctionMacro",
                    "parent": 0,
                    "path": [{ "type": "pathPart", "name": "f", "index": [] }],
                    "input": [[4]],
                    "idx": 3
                  },
                  {
                    "type": "Element",
                    "name": "bar",
                    "parent": 3,
                    "children": ["xxx"],
                    "attributes": [],
                    "idx": 4
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
    let parent_names = flat_root
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
fn can_compactify() {
    let dast_root = dast_root_no_position(r#"<document><a><b /></a></document>"#);
    let dast_root2 = dast_root_no_position(r#"<document><x><y /></x></document>"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    // Add several nodes that aren't connected to the root
    flat_root.merge_content(&dast_root2.children[0], Some(0));
    flat_root.compactify();
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
    flat_root.compactify();

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
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "Element",
                "name": "document",
                "parent": 0,
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
