use assert_json_diff::assert_json_eq;

use super::*;
use crate::{dast::ref_expand::Expander, test_utils::*};

#[test]
fn can_compactify() {
    let source = r#"<document><a><b /></a></document>"#;
    let dast_root = dast_root_no_position(source);
    let source2 = r#"<document><x><y /></x></document>"#;
    let dast_root2 = dast_root_no_position(source2);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    // Add several nodes that aren't connected to the root
    flat_root.merge_content(&dast_root2.children[0], Some(0));
    flat_root.compactify(None);
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
                "children": [1],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "a",
                "parent": 0,
                "children": [2],
                "attributes": [],
                "idx": 1
              },
              {
                "type": "element",
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
            "type": "flatRoot",
            "children": [0, 1],
            "sources": [source],
            "nodes": [
              {
                "type": "element",
                "name": "b",
                "children": [],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "document",
                "children": [2],
                "attributes": [],
                "idx": 1
              },
              {
                "type": "element",
                "name": "x",
                "parent": 1,
                "children": [3],
                "attributes": [],
                "idx": 2
              },
              {
                "type": "element",
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
    let source = r#"<text name="t">hello</text><text extend="$t"> world</text><textInput name="ti" /><p><text name="tiv" extend="$ti.immediateValue"> world</text></p>"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let mut resolver = Expander::expand(&mut flat_root);
    flat_root.compactify(Some(&mut resolver));

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
                "children": [1, 2, 3, 4],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "text",
                "parent": 0,
                "children": ["hello"],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 1,
                    "children": ["t"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "element",
                "name": "text",
                "parent": 0,
                "children": [" world"],
                "attributes": [],
                "idx": 2,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "t", "index": [] }],
                    "nodesInResolvedPath": [2, 1],
                  }
                }
              },
              {
                "type": "element",
                "name": "textInput",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 3,
                    "children": ["ti"]
                  }
                ],
                "idx": 3
              },
              {
                "type": "element",
                "name": "p",
                "parent": 0,
                "children": [5],
                "attributes": [],
                "idx": 4
              },
              {
                "type": "element",
                "name": "text",
                "parent": 4,
                "children": [" world"],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 5,
                    "children": ["tiv"]
                  }
                ],
                "idx": 5,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 3,
                    "unresolvedPath": [
                      {
                        "type": "flatPathPart",
                        "name": "immediateValue",
                        "index": []
                      }
                    ],
                    "originalPath": [
                      { "type": "flatPathPart", "name": "ti", "index": [] },
                      { "type": "flatPathPart", "name": "immediateValue", "index": [] },
                    ],
                    "nodesInResolvedPath": [5, 3],
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
          "node_resolver_data": [
            {
              "node_parent": "None",
              "name_map": {
                "t:0": { "Unique": 1 },
                "ti:0": { "Unique": 3 },
                "tiv:0": { "Unique": 5 }
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": "FlatRoot",
              "name_map": {
                "t:0": { "Unique": 1 },
                "ti:0": { "Unique": 3 },
                "tiv:0": { "Unique": 5 }
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {
                "tiv:0": { "Unique": 5 }
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 4 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
          ]
        })
    );
}

#[test]
fn compactify_adjusts_copying_refs_attributes_and_resolver() {
    let source = r#"<text name="t">hello</text><text copy="$t"> world</text><textInput name="ti" /><p><text name="tiv" copy="$ti.immediateValue"> world</text></p>"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let mut resolver = Expander::expand(&mut flat_root);
    flat_root.compactify(Some(&mut resolver));

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
                "children": [1, 2, 3, 4],
                "attributes": [],
                "idx": 0
              },
              {
                "type": "element",
                "name": "text",
                "parent": 0,
                "children": ["hello"],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 1,
                    "children": ["t"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "element",
                "name": "text",
                "parent": 0,
                "children": [" world"],
                "attributes": [],
                "idx": 2,
                "extending": {
                  "CopyAttribute": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "t", "index": [] }],
                    "nodesInResolvedPath": [2, 1],
                  }
                }
              },
              {
                "type": "element",
                "name": "textInput",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 3,
                    "children": ["ti"]
                  }
                ],
                "idx": 3
              },
              {
                "type": "element",
                "name": "p",
                "parent": 0,
                "children": [5],
                "attributes": [],
                "idx": 4
              },
              {
                "type": "element",
                "name": "text",
                "parent": 4,
                "children": [" world"],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 5,
                    "children": ["tiv"]
                  }
                ],
                "idx": 5,
                "extending": {
                  "CopyAttribute": {
                    "nodeIdx": 3,
                    "unresolvedPath": [
                      {
                        "type": "flatPathPart",
                        "name": "immediateValue",
                        "index": []
                      }
                    ],
                    "originalPath": [
                      { "type": "flatPathPart", "name": "ti", "index": [] },
                      { "type": "flatPathPart", "name": "immediateValue", "index": [] },
                    ],
                    "nodesInResolvedPath": [5, 3],
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
          "node_resolver_data": [
            {
              "node_parent": "None",
              "name_map": {
                "t:0": { "Unique": 1 },
                "ti:0": { "Unique": 3 },
                "tiv:0": { "Unique": 5 }
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": "FlatRoot",
              "name_map": {
                "t:0": { "Unique": 1 },
                "ti:0": { "Unique": 3 },
                "tiv:0": { "Unique": 5 }
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {
                "tiv:0": { "Unique": 5 }
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 4 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
          ]
        })
    );
}

#[test]
fn compactify_adjusts_refs_to_document() {
    let source = r#"<document name="doc"><number extend="$doc.creditAchieved" /><number copy="$doc.creditAchieved" /></document>"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    let mut resolver = Expander::expand(&mut flat_root);
    flat_root.compactify(Some(&mut resolver));

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
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 0,
                    "children": ["doc"]
                  }
                ],
                "idx": 0
              },
              {
                "type": "element",
                "name": "number",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 1,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 0,
                    "unresolvedPath": [{ "type": "flatPathPart", "name": "creditAchieved", "index": [] }],
                    "originalPath": [
                        { "type": "flatPathPart", "name": "doc", "index": [] },
                        { "type": "flatPathPart", "name": "creditAchieved", "index": [] }
                      ],
                      "nodesInResolvedPath": [1, 0],
                  }
                }
              },
              {
                "type": "element",
                "name": "number",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 2,
                "extending": {
                  "CopyAttribute": {
                    "nodeIdx": 0,
                    "unresolvedPath": [{ "type": "flatPathPart", "name": "creditAchieved", "index": [] }],
                    "originalPath": [
                        { "type": "flatPathPart", "name": "doc", "index": [] },
                        { "type": "flatPathPart", "name": "creditAchieved", "index": [] }
                      ],
                      "nodesInResolvedPath": [2, 0],
                  }
                }
              },
            ]
          }
        )
    );

    assert_json_eq!(
        serde_json::to_value(&resolver).unwrap(),
        json!({

          "node_resolver_data": [
            {
              "node_parent": "None",
              "name_map": {
                "doc:0": { "Unique": 0 },
              },
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": "FlatRoot",
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
            {
              "node_parent": { "Node": 0 },
              "name_map": {},
              "index_resolutions": [],
              "source_sequence": null,
            },
          ]
        })
    );
}

#[test]
fn compactify_preserves_refs_in_path_parts() {
    let source = r#"<number name="n"/><point name="p"/>$p[$n]"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);

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
                "name": "number",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 1,
                    "children": ["n"]
                  }
                ],
                "idx": 1
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
                    "parent": 2,
                    "children": ["p"]
                  }
                ],
                "idx": 2,
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
                    "nodeIdx": 2,
                    "unresolvedPath": [
                      {
                        "type": "flatPathPart",
                        "name": "",
                        "index": [
                          {
                            "value": [4]
                          }
                        ]
                      }
                    ],
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [{ "value": [4] }] }],
                    "nodesInResolvedPath": [3, 2],
                  }
                }
              },
              {
                "type": "element",
                "name": "number",
                "parent": 3,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }],
                    "nodesInResolvedPath": [4, 1],
                  }
                }
              }
            ]
          }
        )
    );
}

#[test]
fn compactify_shifts_refs_in_path_parts() {
    let source = r#"<number name="n"/><point name="p"/><point extend="$p" />$p[$n]"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);

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
                "children": [1, 2, 3, 4],
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
                    "children": ["n"]
                  }
                ],
                "idx": 1
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
                    "parent": 2,
                    "children": ["p"]
                  }
                ],
                "idx": 2,
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 2,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [] }],
                    "nodesInResolvedPath": [3, 2],
                  }
                }
              },
              {
                "type": "element",
                "name": "point",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Ref": {
                    "nodeIdx": 2,
                    "unresolvedPath": [
                      {
                        "type": "flatPathPart",
                        "name": "",
                        "index": [
                          {
                            "value": [5]
                          }
                        ]
                      }
                    ],
                    "originalPath": [{ "type": "flatPathPart", "name": "p", "index": [{ "value" : [5]}] }],
                    "nodesInResolvedPath": [4, 2],
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
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }],
                    "nodesInResolvedPath": [5, 1],
                  }
                }
              }
            ]
          }
        )
    );
}

#[test]
fn compactify_index_in_extend() {
    let source = r#"<number name="n"/><math name="m"/><math extend="$m[$n]" />"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);

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
                "name": "number",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 1,
                    "children": ["n"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "element",
                "name": "math",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 2,
                    "children": ["m"]
                  }
                ],
                "idx": 2,
              },
              {
                "type": "element",
                "name": "math",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 2,
                    "unresolvedPath": [{ "type": "flatPathPart", "name": "", "index": [{ "value": [4] }] }],
                    "originalPath": [{ "type": "flatPathPart", "name": "m", "index": [{ "value": [4] }] }],
                    "nodesInResolvedPath": [3, 2],
                  }
                }
              },
              {
                "type": "element",
                "name": "number",
                "parent": 3,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }],
                    "nodesInResolvedPath": [4, 1],
                  }
                }
              },
            ]
          }
        )
    );
}

#[test]
fn compactify_index_in_extend_additional_compactification_before() {
    let source = r#"<number name="n"/><math name="m" extend="$n" /><math extend="$m[$n]" />"#;
    let dast_root = dast_root_no_position(source);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify(None);

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
                "name": "number",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 1,
                    "children": ["n"]
                  }
                ],
                "idx": 1
              },
              {
                "type": "element",
                "name": "math",
                "parent": 0,
                "children": [],
                "attributes": [
                  {
                    "type": "attribute",
                    "name": "name",
                    "parent": 2,
                    "children": ["m"]
                  }
                ],
                "idx": 2,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }],
                    "nodesInResolvedPath": [2, 1],
                  }
                }
              },
              {
                "type": "element",
                "name": "math",
                "parent": 0,
                "children": [],
                "attributes": [],
                "idx": 3,
                "extending": {
                  "ExtendAttribute": {
                    "nodeIdx": 2,
                    "unresolvedPath": [{ "type": "flatPathPart", "name": "", "index": [{ "value": [4] }] }],
                    "originalPath": [{ "type": "flatPathPart", "name": "m", "index": [{ "value": [4] }] }],
                    "nodesInResolvedPath": [3, 2],
                  }
                }
              },
              {
                "type": "element",
                "name": "number",
                "parent": 3,
                "children": [],
                "attributes": [],
                "idx": 4,
                "extending": {
                  "Ref": {
                    "nodeIdx": 1,
                    "unresolvedPath": null,
                    "originalPath": [{ "type": "flatPathPart", "name": "n", "index": [] }],
                    "nodesInResolvedPath": [4, 1],
                  }
                }
              },
            ]
          }
        )
    );
}
