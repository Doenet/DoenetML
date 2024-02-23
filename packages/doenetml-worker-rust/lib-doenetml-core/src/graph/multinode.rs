//! A toy version of Core that only supports strings.
//!
//! There is a <text /> component that can have Text or String children.
//! It has props: `upper` and `lower` which store upper-case and lower-case versions
//! of its content.

use std::collections::HashMap;

use itertools::Itertools;

use crate::{
    components::prelude::UntaggedContent,
    dast::flat_dast::{NormalizedNode, NormalizedRoot},
};

use super::directed_graph::{DirectedGraph, Taggable};

/// A `ValueRef` is a pointer to some primitive value stored elsewhere
/// in some other data structure.
#[derive(Clone, Copy, Debug)]
struct ValueRef {
    id: usize,
    pointer: usize,
}

/// A `Tag` is a label that can be attached to a `MultiNode` to affect how it's processed.
#[derive(Clone, Copy, Debug)]
enum Tag {
    /// The `MultiNode` acts like a component. Its first child is its "children", subsequent children are its attributes and then props.
    Component,
    /// The `MultiNode` is a container for children.
    Content,
}

/// A `MultiNode` is a node type that can have children.
#[derive(Clone, Debug)]
struct MultiNode {
    pub id: usize,
    pub children: Vec<Node>,
    tag: Tag,
}

/// A Node on the structure graph or dependency graph.
#[derive(Clone, Debug)]
enum Node {
    /// A node that refers to a value. It has no children.
    Terminal(ValueRef),
    /// A node that has children.
    Multi(MultiNode),
}
impl Node {
    pub fn id(&self) -> usize {
        match self {
            Node::Terminal(v) => v.id,
            Node::Multi(m) => m.id,
        }
    }
}

/// Cheap taggable to lookup `Node`s by index.
/// XXX: This struct makes no attempt to be efficient.
#[derive(Debug, Default)]
struct IdxLookup<T> {
    hash: HashMap<usize, T>,
}
impl IdxLookup<usize> {
    pub fn new() -> Self {
        IdxLookup {
            hash: HashMap::new(),
        }
    }
}
impl<T: Clone> Taggable<Node, T> for IdxLookup<T> {
    fn set_tag(&mut self, node: Node, tag: T) {
        self.hash.insert(node.id(), tag);
    }
    fn get_tag(&self, node: &Node) -> Option<&T> {
        self.hash.get(&node.id())
    }
}

struct Core {
    structure_graph: DirectedGraph<Node, IdxLookup<usize>>,
    dependency_graph: DirectedGraph<Node, IdxLookup<usize>>,
    /// In this simple version of Core, strings are the only type of data there is.
    values: Vec<Component>,
}

impl Core {
    pub fn new() -> Self {
        Core {
            structure_graph: DirectedGraph::new(),
            dependency_graph: DirectedGraph::new(),
            values: Vec::new(),
        }
    }

    pub fn add_node(&mut self, node: Node) {
        self.structure_graph.add_node(node.clone());
        match node {
            Node::Multi(ref m) => {
                for child in &m.children {
                    self.add_node(child.clone());
                    self.structure_graph.add_edge(&node, &child);
                }
            }
            _ => {}
        }
    }
}

#[derive(Debug)]
struct StringComponent {}
impl StringComponent {
    pub fn new(s: String) -> Self {
        StringComponent {}
    }
}
#[derive(Debug)]
struct TextComponent {}
impl TextComponent {
    pub fn new() -> Self {
        TextComponent {}
    }
}

enum Component {
    String(StringComponent),
    Text(TextComponent),
}

#[cfg(test)]
impl NormalizedRoot {
    /// Output a mermaid graph of the structure graph.
    fn to_mermaid(&self) -> String {
        let mut mermaid = String::new();
        mermaid.push_str("graph TD;\n");
        for node in &self.nodes {
            match node {
                NormalizedNode::Element(e) => {
                    // Get the name attribute formatted as `name='foo'` or the empty string if no name exists.
                    let name_attr = e
                        .attributes
                        .iter()
                        .find(|a| a.name.eq_ignore_ascii_case("name"))
                        .map(|n| {
                            n.children
                                .iter()
                                .filter_map(|item| match item {
                                    UntaggedContent::Text(t) => Some(t),
                                    _ => None,
                                })
                                .join("")
                        })
                        .map(|n| format!(" <span style='color:red;font-size:smaller;'>{}</span>", n))
                        .unwrap_or("".into());
                        
                    mermaid.push_str(&format!(
                        r#"{}{{{{"&lt;{}{}><sub>id={}</sub>"}}}}{}"#,
                        e.idx, e.name, name_attr, e.idx, "\n"
                    ));

                    if let Some(referent) = &e.extending {
                        mermaid.push_str(&format!("{} -->|extends| {}\n", e.idx, referent.idx()));
                    } else {
                        let children_name = format!("{}_children", e.idx);
                        if e.children.len() > 0 {
                            mermaid.push_str(&format!("{}([children])\n", children_name));
                            mermaid.push_str(&format!("{} --> {}\n", e.idx, children_name));
                        }
                        for (i, child) in e.children.iter().enumerate() {
                            match child {
                                UntaggedContent::Ref(r) => {
                                    mermaid.push_str(&format!("{} --> {}\n", children_name, r));
                                }
                                UntaggedContent::Text(t) => {
                                    mermaid.push_str(&format!(
                                        "{} --> {}[\"'{}'\"]\n",
                                        children_name,
                                        format!("{}_{}_text", e.idx, i),
                                        t
                                    ));
                                }
                            }
                        }
                    }
                }
                _ => {}
            }
        }
        mermaid
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        dast::{flat_dast::FlatRoot, ref_expand::Expander},
        test_utils::*,
    };

    #[test]
    fn test_mermaid() {
        let dast_root = dast_root_no_position(
            r#"<text case="upper" name="t"><text name="t2">hello</text> World!</text><text case="lower" name="t3">$t</text>"#,
        );
        let mut flat_root = FlatRoot::from_dast(&dast_root);
        Expander::expand(&mut flat_root);
        dbg!(&flat_root.to_xml());
        flat_root.compactify();
        let normalized_flat_root = flat_root.into_normalized_root();
        //dbg!(normalized_flat_root);
        println!("{}", normalized_flat_root.to_mermaid())
    }

    /// Hard code the graph structure for
    /// ```xml
    /// <text case="upper" name="t">
    ///    <text name="t2">hello</text> World!
    /// </text>
    /// <text case="lower" name="t3">
    ///     $t
    /// </text>
    /// ```
    #[test]
    fn test_core() {
        let mut core = Core::new();
        core.values = vec![
            // 0 <text case="upper" name="t">
            Component::Text(TextComponent::new()),
            // 1 case="upper"
            Component::String(StringComponent::new("upper".to_string())),
            // 2 storage for value
            Component::String(StringComponent::new("".to_string())),
            // 3 <text name="t2">
            Component::Text(TextComponent::new()),
            // 4 case="default"
            Component::String(StringComponent::new("default".to_string())),
            // 5 storage for value
            Component::String(StringComponent::new("".to_string())),
            // 6 "hello"
            Component::String(StringComponent::new("hello".to_string())),
            // 7 " World!"
            Component::String(StringComponent::new(" World!".to_string())),
            // 8 <text case="lower" name="t3">
            Component::Text(TextComponent::new()),
            // 9 case="lower"
            Component::String(StringComponent::new("lower".to_string())),
            // 10 storage for value
            Component::String(StringComponent::new("".to_string())),
        ];

        // Construct our terminal nodes
        let hello = Node::Terminal(ValueRef {
            id: 106,
            pointer: 6,
        });
        let world = Node::Terminal(ValueRef {
            id: 107,
            pointer: 7,
        });
        let upper = Node::Terminal(ValueRef {
            id: 101,
            pointer: 1,
        });
        let lower = Node::Terminal(ValueRef {
            id: 109,
            pointer: 9,
        });
        let default = Node::Terminal(ValueRef {
            id: 104,
            pointer: 4,
        });
        let t_value = Node::Terminal(ValueRef {
            id: 102,
            pointer: 2,
        });
        let t2_value = Node::Terminal(ValueRef {
            id: 105,
            pointer: 5,
        });
        let t3_value = Node::Terminal(ValueRef {
            id: 110,
            pointer: 10,
        });

        // Construct case attribute nodes
        let t_case = Node::Multi(MultiNode {
            id: 200,
            children: vec![upper],
            tag: Tag::Content,
        });
        let t2_case = Node::Multi(MultiNode {
            id: 201,
            children: vec![default],
            tag: Tag::Content,
        });
        let t3_case = Node::Multi(MultiNode {
            id: 202,
            children: vec![lower],
            tag: Tag::Content,
        });

        // Construct nodes and children multi-nodes
        let t2_children = Node::Multi(MultiNode {
            id: 300,
            children: vec![hello],
            tag: Tag::Content,
        });
        let t2 = Node::Multi(MultiNode {
            id: 400,
            children: vec![t2_children, t2_case, t2_value],
            tag: Tag::Component,
        });

        let t_children = Node::Multi(MultiNode {
            id: 301,
            children: vec![t2, world],
            tag: Tag::Content,
        });
        let t = Node::Multi(MultiNode {
            id: 401,
            children: vec![t_children, t_case, t_value],
            tag: Tag::Component,
        });

        let t3_children = Node::Multi(MultiNode {
            id: 302,
            children: vec![t.clone()],
            tag: Tag::Content,
        });
        let t3 = Node::Multi(MultiNode {
            id: 402,
            children: vec![t3_children, t3_case, t3_value],
            tag: Tag::Component,
        });

        core.add_node(t.clone());
        core.add_node(t3);
        println!("{:?}", core.structure_graph);
    }
}
