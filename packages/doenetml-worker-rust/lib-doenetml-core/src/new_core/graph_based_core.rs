//! A version of `Core` based on `DirectedGraph`

use std::{collections::HashMap, str::FromStr};

use crate::{
    components::{
        ComponentEnum,
        _error::_Error,
        _external::_External,
        prelude::{ComponentState, KeyValueIgnoreCase, UntaggedContent},
        ComponentAttributes, ComponentNode,
    },
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
        // We record _original_ parent information. After including `extend` information, the `structure_graph`
        // may not be a tree, and so looking up parent information about the original parent may not be possible.
        let mut parents: Vec<Option<usize>> =
            std::iter::repeat(None).take(dast.nodes.len()).collect();
        for node in &dast.nodes {
            match node {
                NormalizedNode::Element(elm) => {
                    for child_idx in elm.children.iter().filter_map(|c| match c {
                        UntaggedContent::Ref(r) => Some(*r),
                        _ => None,
                    }) {
                        parents[child_idx] = Some(elm.idx);
                    }
                }
                NormalizedNode::Error(_) => {}
            }
        }

        self.components.reserve(dast.nodes.len());
        for (idx, node) in dast.nodes.iter().enumerate() {
            let graph_component_node = GraphNode::Component(idx);
            self.structure_graph.add_node(graph_component_node);
            let component = match node {
                NormalizedNode::Element(elm) => {
                    let mut component = ComponentEnum::from_str(&elm.name).unwrap_or_else(|_| {
                        // If we didn't find a match, then create a component of type external
                        ComponentEnum::_External(_External {
                            name: elm.name.clone(),
                            ..Default::default()
                        })
                    });

                    //
                    // Add a virtual node for the children and attach all children to it
                    // **MUST** be the **first** child of `graph_component_node`
                    //
                    let graph_virtual_node = self.new_virtual_node();
                    self.structure_graph.add_node(graph_virtual_node);
                    self.structure_graph
                        .add_edge(&graph_component_node, &graph_virtual_node);
                    self.add_content_to_structure_graph(graph_virtual_node, &elm.children);

                    //
                    // Add a virtual node for the attributes and attach all attributes to it
                    // **MUST** be the **second** child of `graph_component_node`
                    //
                    let graph_virtual_node = self.new_virtual_node();
                    self.structure_graph.add_node(graph_virtual_node);
                    self.structure_graph
                        .add_edge(&graph_component_node, &graph_virtual_node);
                    // These are the unused attributes that are not recognized by the component
                    let mut unused_attributes = HashMap::<String, _>::from_iter(
                        elm.attributes
                            .iter()
                            .map(|attr| (attr.name.clone(), attr.clone())),
                    );

                    for attr_name in component.get_attribute_names() {
                        // Each attribute's content is stored in a virtual node
                        let attr_virtual_node = self.new_virtual_node();
                        self.structure_graph.add_node(attr_virtual_node);
                        self.structure_graph
                            .add_edge(&graph_virtual_node, &attr_virtual_node);

                        let attr_content = unused_attributes
                            .remove_ignore_case(attr_name)
                            .map_or_else(Vec::new, |v| v.children);
                        self.add_content_to_structure_graph(attr_virtual_node, &attr_content);
                    }
                    // XXX: This should be updated when we update the type of information `component` stores.
                    component.initialize(
                        idx,
                        parents[idx],
                        None,
                        unused_attributes,
                        elm.position.clone(),
                    );

                    //
                    // Add a virtual node for the props and attach all props to it
                    //
                    //
                    let graph_virtual_node = self.new_virtual_node();
                    self.structure_graph.add_node(graph_virtual_node);
                    self.structure_graph
                        .add_edge(&graph_component_node, &graph_virtual_node);
                    for _ in 0..component.get_num_props() {
                        let prop_graph_node = GraphNode::Prop(self.props.len());
                        // XXX: right now we don't do any caching or initialization of props, so we just push a placeholder
                        self.props.push(());
                        self.structure_graph.add_node(prop_graph_node);
                        self.structure_graph
                            .add_edge(&graph_virtual_node, &prop_graph_node);
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

    /// Add every node in `content` as a child node of `parent` in `structure_graph`.
    /// If `content` contains string children, they are added to `self.strings`.
    fn add_content_to_structure_graph(&mut self, parent: GraphNode, content: &[UntaggedContent]) {
        for child in content {
            match child {
                UntaggedContent::Ref(idx) => {
                    let graph_child_node = GraphNode::Component(*idx);
                    // `graph_child_node` may already be in the graph or it may be missing.
                    // If it is missing, it is automatically added, so there's no need to check.
                    self.structure_graph.add_edge(&parent, &graph_child_node);
                }
                UntaggedContent::Text(text) => {
                    let graph_string_node = self.new_string_node(text.clone());
                    self.structure_graph.add_node(graph_string_node);
                    self.structure_graph.add_edge(&parent, &graph_string_node);
                }
            }
        }
    }
}
