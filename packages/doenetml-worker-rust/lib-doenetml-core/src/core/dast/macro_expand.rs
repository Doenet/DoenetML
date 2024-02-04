use crate::dast::untagged_flat_dast::Index;

use super::{
    macro_resolve::Resolver,
    untagged_flat_dast::{FlatElement, FlatError, FlatNode, FlatRoot},
};

/// An `Expander` replaces all macros with their `DastElement`-equivalent forms. For example
/// ```xml
/// <point name="p" />
/// $p
/// ```
/// expands to
/// ```xml
/// <point name="p" />
/// <point extends="p" />
/// ```
/// Care is taken to preserve the tag name of the referent. (E.g., a `<point />` maps to a `<point extends="..." />`,
/// a `<line />` maps to a `<line extends="..." />`, etc.)
pub struct Expander {}

impl Expander {
    pub fn expand(flat_root: &mut FlatRoot) {
        // Get the name of the element at the given index. If the index does not correspond to an element, panic.
        let get_name = |idx: Index| -> String {
            match &flat_root.nodes[idx] {
                FlatNode::Element(elm) => elm.name.clone(),
                _ => panic!("Tried to get the name of a non-element"),
            }
        };

        let resolver = Resolver::from_flat_root(flat_root);
        let nodes_for_replacement: Vec<FlatNode> = flat_root
            .nodes
            .iter()
            .flat_map(|node| match node {
                FlatNode::Macro(macro_) => {
                    let resolved = match resolver.resolve(&macro_.path, macro_.idx) {
                        Ok(ref_resolution) => {
                            let name = get_name(ref_resolution.node_idx);
                            FlatNode::Element(FlatElement {
                                idx: macro_.idx,
                                parent: macro_.parent,
                                attributes: Vec::new(),
                                children: Vec::new(),
                                name,
                                position: macro_.position.clone(),
                                extending: Some(ref_resolution),
                            })
                        }
                        Err(err) => FlatNode::Error(FlatError {
                            idx: macro_.idx,
                            parent: macro_.parent,
                            message: format!("Macro resolution error: {}", err),
                            position: macro_.position.clone(),
                        }),
                    };
                    Some(resolved)
                }
                _ => None,
            })
            .collect();

        // We know what nodes we need to replace now, so we can mutate `flat_root` and replace them.
        for node in nodes_for_replacement.into_iter() {
            let idx = node.idx();
            flat_root.nodes[idx] = node;
        }
    }
}

#[cfg(test)]
mod test {
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
}
