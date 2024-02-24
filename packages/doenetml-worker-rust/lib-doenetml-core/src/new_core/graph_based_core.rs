//! A version of `Core` based on `DirectedGraph`

use std::str::FromStr;

use crate::{
    components::{ComponentEnum, _error::_Error, _external::_External, prelude::UntaggedContent},
    dast::flat_dast::{NormalizedNode, NormalizedRoot},
    graph::directed_graph::DirectedGraph,
};

use super::graph_node::{GraphNode, GraphNodeLookup};

/// Core stores all hydrated components, keeps track of caching data, and tracks dependencies.
/// It is also in charge of marking nodes as dirty when they need to be recalculated and calling
/// functions to recalculate in the appropriate order.
pub struct Core {
    /// A graph that stores the structure of the document. This graph keeps
    /// track of children, attributes, props, and state.
    pub structure_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// A graph that stores the active dependencies between nodes. The nodes
    /// of this graph are the same as the nodes of `structure_graph`, but edges
    /// are only added to this graph if if one node must be updated when another changes.
    pub dependency_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// The reified components. These can be queried for information about their attributes/props/state
    /// as well as asked to calculate/recalculate props.
    pub components: Vec<ComponentEnum>,
    /// A list of all strings in the document. Strings are stored here once and referenced when they appear as children.
    pub strings: Vec<String>,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    virtual_node_count: usize,
    // XXX: fill these in
    #[allow(dead_code)]
    props: Vec<()>,
    #[allow(dead_code)]
    states: Vec<()>,
    #[allow(dead_code)]
    queries: Vec<()>,
}

impl Default for Core {
    fn default() -> Self {
        Self::new()
    }
}

impl Core {
    pub fn new() -> Self {
        Core {
            structure_graph: DirectedGraph::new(),
            dependency_graph: DirectedGraph::new(),
            components: Vec::new(),
            strings: Vec::new(),
            props: Vec::new(),
            states: Vec::new(),
            queries: Vec::new(),
            virtual_node_count: 0,
        }
    }

    /// Generate a new `VirtualNode` with a unique id.
    fn new_virtual_node(&mut self) -> GraphNode {
        let node = GraphNode::Virtual(self.virtual_node_count);
        self.virtual_node_count += 1;
        node
    }

    fn new_string_node(&mut self, s: String) -> GraphNode {
        let node = GraphNode::String(self.strings.len());
        self.strings.push(s);
        node
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    pub fn init_from_normalized_root(&mut self, dast: &NormalizedRoot) {
        self.components.reserve(dast.nodes.len());
        for (idx, node) in dast.nodes.iter().enumerate() {
            let graph_component_node = GraphNode::Component(idx);
            self.structure_graph.add_node(graph_component_node);
            let component = match node {
                NormalizedNode::Element(elm) => {
                    let component = ComponentEnum::from_str(&elm.name).unwrap_or_else(|_| {
                        // If we didn't find a match, then create a component of type external
                        ComponentEnum::_External(_External {
                            name: elm.name.clone(),
                            ..Default::default()
                        })
                    });
                    // Add a virtual node for the children and attach all children to it
                    let graph_virtual_node = self.new_virtual_node();
                    self.structure_graph.add_node(graph_virtual_node);
                    self.structure_graph
                        .add_edge(&graph_component_node, &graph_virtual_node);
                    for child in &elm.children {
                        match child {
                            UntaggedContent::Ref(r) => {
                                self.structure_graph
                                    .add_edge(&graph_virtual_node, &GraphNode::Component(*r));
                            }
                            UntaggedContent::Text(text) => {
                                let graph_string_node = self.new_string_node(text.clone());
                                self.structure_graph.add_node(graph_string_node);
                                self.structure_graph
                                    .add_edge(&graph_virtual_node, &graph_string_node);
                            }
                        }
                    }

                    component
                }
                NormalizedNode::Error(err) => {
                    let mut error = _Error::new();
                    error.message = err.message.clone();
                    ComponentEnum::_Error(error)
                }
            };
            self.components.push(component);
        }
    }
}
