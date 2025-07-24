//! Utilities for generating `mermaid` diagrams from `doenetml` data.

use crate::{
    Core,
    components::{ComponentAttributes, prelude::UntaggedContent, types::ComponentIdx},
    dast::flat_dast::{NormalizedNode, NormalizedRoot},
    graph::directed_graph::DirectedGraph,
    graph_node::{GraphNode, GraphNodeLookup},
};
use itertools::Itertools;

impl NormalizedRoot {
    /// Output a mermaid graph of the structure graph.
    pub fn to_mermaid(&self) -> String {
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
                        .map(|n| {
                            format!(" <span style='color:red;font-size:smaller;'>{}</span>", n)
                        })
                        .unwrap_or("".into());

                    //
                    // Print the actual node
                    //
                    mermaid.push_str(&format!(
                        r#"{}{{{{"&lt;{}{}><sub>id={}</sub>"}}}}{}"#,
                        e.idx, e.name, name_attr, e.idx, "\n"
                    ));

                    //
                    // Print children if there are any
                    //
                    let children_name = format!("{}_children", e.idx);
                    if !e.children.is_empty() {
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
                                    format_args!("{}_{}_text", e.idx, i),
                                    t
                                ));
                            }
                        }
                    }

                    //
                    // Print attributes if there are any
                    //
                    let attrs_name = format!("{}_attrs", e.idx);
                    let attrs = e
                        .attributes
                        .iter()
                        .filter(|a| {
                            a.name.eq_ignore_ascii_case("name")
                                || a.name.eq_ignore_ascii_case("extend")
                        })
                        .collect::<Vec<_>>();
                    if !attrs.is_empty() {
                        mermaid.push_str(&format!("{}([attrs])\n", attrs_name));
                        mermaid.push_str(&format!("{} --> {}\n", e.idx, attrs_name));
                    }
                    for (i, &attr) in attrs.iter().enumerate() {
                        let attr_name = format!("{}_attr_{}", e.idx, i);
                        mermaid.push_str(&format!(
                            "{} --> {}([\"'{}'\"])\n",
                            attrs_name, attr_name, attr.name,
                        ));
                        for (j, child) in attr.children.iter().enumerate() {
                            match child {
                                UntaggedContent::Ref(r) => {
                                    mermaid.push_str(&format!("{} --> {}\n", attr_name, r));
                                }
                                UntaggedContent::Text(t) => {
                                    mermaid.push_str(&format!(
                                        "{} --> {}[\"'{}'\"]\n",
                                        attr_name,
                                        format_args!("{}_{}_text", e.idx, j),
                                        t
                                    ));
                                }
                            }
                        }
                    }

                    //
                    // Link to referent
                    //
                    if let Some(referent) = &e.extending {
                        mermaid.push_str(&format!("{} -.->|extends| {}\n", e.idx, referent.idx()));
                    }
                }
                _ => {}
            }
        }
        mermaid
    }
}

impl GraphNode {
    pub fn to_mermaid_id(&self) -> String {
        match self {
            GraphNode::Component(idx) => format!("c_{}", idx),
            GraphNode::String(idx) => format!("s_{}", idx),
            GraphNode::Prop(idx) => format!("p_{}", idx),
            GraphNode::State(idx) => format!("state_{}", idx),
            GraphNode::Query(idx) => format!("q_{}", idx),
            GraphNode::Virtual(idx) => format!("v_{}", idx),
        }
    }
}

impl DirectedGraph<GraphNode, GraphNodeLookup<usize>> {
    /// Output `self.edges` in mermaid format.
    /// This function **does not** include the mermaid header `"graph TD"`
    /// at the start of the string. You must include that yourself.
    pub fn to_mermaid_edges(&self) -> String {
        let mut mermaid = String::new();
        let nodes = self.get_nodes();
        for (head, tails) in self._get_edges_raw().iter().enumerate() {
            for &tail in tails {
                mermaid.push_str(&format!(
                    "{} --> {}\n",
                    nodes[head].to_mermaid_id(),
                    nodes[tail].to_mermaid_id()
                ));
            }
        }
        mermaid
    }
}

impl Core {
    /// Output a mermaid graph of the dependency graph.
    pub fn to_mermaid_dependency_graph(&self) -> String {
        self.to_mermaid_from_graph(&self.document_model.get_dependency_graph(), false)
    }
    /// Output a mermaid graph of the structure graph.
    pub fn to_mermaid_structure_graph(&self) -> String {
        self.to_mermaid_from_graph(
            self.document_model
                .document_structure
                .borrow()
                .get_structure_graph(),
            true,
        )
    }
    /// Output a mermaid graph of the structure graph.
    pub fn to_mermaid(&self) -> String {
        self.to_mermaid_from_graph(
            self.document_model
                .document_structure
                .borrow()
                .get_structure_graph(),
            true,
        )
    }
    /// Output a mermaid graph of the structure graph.
    /// If `print_labels == true` then `document_structure` is assumed and labels are printed for components/attributes/etc.
    pub fn to_mermaid_from_graph(
        &self,
        graph: &DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
        print_labels: bool,
    ) -> String {
        let mut mermaid = String::new();
        mermaid.push_str("graph TD;\n");
        mermaid.push_str("classDef text color:red, stroke:red, fill:#fee\n");
        mermaid.push_str(&graph.to_mermaid_edges());

        // `mermaid` contains just the edges of the structure graph
        // labeled as `1, 2, 3, ...`. We want to give appropriate labels to
        // each node.
        for graph_node in graph.get_nodes().iter() {
            match graph_node {
                GraphNode::Component(idx) => {
                    mermaid.push_str(&format!(
                        "{}{{{{\"&lt;{}><sub>id={}</sub>\"}}}}\n",
                        graph_node.to_mermaid_id(),
                        self.document_model.get_component_type(graph_node),
                        idx
                    ));
                }
                GraphNode::Virtual(_) => {
                    // These are all overridden with names, so no need to do anything here.
                    //mermaid.push_str(&format!("{}([virtual])\n", graph_node.to_mermaid_id()));
                }
                GraphNode::String(_) => {
                    mermaid.push_str(&format!(
                        "{}[\"&quot;{}&quot;\"]:::text\n",
                        graph_node.to_mermaid_id(),
                        self.document_model
                            .document_structure
                            .borrow()
                            .get_string_value(graph_node)
                    ));
                }
                _ => {}
            }
        }

        // Some virtual nodes have special names. For example the 1st virtual
        // node of a component is the children of that component. The 2nd is the attributes.
        // We want to label these nodes appropriately.
        for &component_node in graph
            .get_nodes()
            .iter()
            .filter(|n| matches!(n, GraphNode::Component(_)) && print_labels)
        {
            let component_idx = ComponentIdx::from(component_node);
            // Children
            if let Some(children_virtual_node) = graph.get_nth_child(component_node, 0) {
                mermaid.push_str(&format!(
                    "{}([children])\n",
                    children_virtual_node.to_mermaid_id()
                ));
            }

            // Attrs
            if let Some(attrs_virtual_node) = graph.get_nth_child(component_node, 1) {
                mermaid.push_str(&format!(
                    "{}([attrs])\n",
                    attrs_virtual_node.to_mermaid_id()
                ));
            }

            let document_structure = self.document_model.document_structure.borrow();
            let component = document_structure.get_component(component_idx);
            // Label the individual attributes
            for (i, attr_virtual_node) in graph
                .get_component_attributes(component_node)
                .iter()
                .enumerate()
            {
                if let Some(attr_name) = component.get_attribute_names().get(i) {
                    mermaid.push_str(&format!(
                        "{}([\"@{}\"])\n",
                        attr_virtual_node.to_mermaid_id(),
                        attr_name
                    ));
                } else {
                    mermaid.push_str(&format!(
                        "{}([\"@{}\"])\n",
                        attr_virtual_node.to_mermaid_id(),
                        "ERROR_MISSING_ATTRIBUTE"
                    ));
                }
            }

            // Props
            let props_virtual_node = graph.get_nth_child(component_node, 2).unwrap();
            mermaid.push_str(&format!(
                "{}([props])\n",
                props_virtual_node.to_mermaid_id()
            ));
        }

        mermaid
    }
}

#[cfg(test)]
#[path = "mermaid.test.rs"]
mod test;
