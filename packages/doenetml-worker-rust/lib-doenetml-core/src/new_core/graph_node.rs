use std::collections::HashMap;

use crate::graph::directed_graph::{DirectedGraph, Taggable};

/// A node in `Core`'s `structure_graph` or `dependency_graph`. `GraphNode` don't store
/// any data themselves, but serve as pointers to data that is stored by `Core`. This enables
/// "cheap" graphs to keep track of the structure of components (children, attributes, etc.)
/// while keeping the actual data separate.
#[derive(
    Clone,
    Copy,
    Debug,
    // XXX: These three are for `NewNodeTypeLookup`
    // They can be removed when a more efficient implementation is made.
    Hash,
    PartialEq,
    Eq,
)]
pub enum GraphNode {
    /// A node that corresponds to a component stored by `Core`
    Component(usize),
    /// A node that corresponds to a `String` stored by `Core`
    String(usize),
    /// A node that corresponds to a `Prop` (whose value may be cached by `Core`)
    Prop(usize),
    /// A node that corresponds to a piece of state that is stored by `Core`
    State(usize),
    /// A node that corresponding to a `DataQuery` (whose value may be cached by `Core`)
    Query(usize),
    /// A node that has no data associated with it.
    Virtual(usize),
}

/// Data structure on which a `Taggable<GraphNode, _>` can be implemented.
#[derive(Clone, Debug)]
pub struct GraphNodeLookup<T> {
    /// A `HashMap` is a not-so-efficient, but easy way to implement a lookup table.
    /// XXX: This should be replaced with a more efficient data structure after performance tests.
    hash: HashMap<GraphNode, T>,
    //    components: Vec<Option<T>>,
    //    strings: Vec<Option<T>>,
    //    props: Vec<Option<T>>,
    //    states: Vec<Option<T>>,
    //    queries: Vec<Option<T>>,
    //    virtuals: Vec<Option<T>>,
}

impl<T> Default for GraphNodeLookup<T> {
    fn default() -> Self {
        Self {
            hash: HashMap::new(),
        }
    }
}
impl<T> GraphNodeLookup<T> {
    pub fn new() -> Self {
        Self::default()
    }
}

/// Cheap taggable to lookup `Node`s by index.
/// XXX: This struct makes no attempt to be efficient.
impl<T: Clone> Taggable<GraphNode, T> for GraphNodeLookup<T> {
    fn set_tag(&mut self, node: GraphNode, tag: T) {
        self.hash.insert(node, tag);
    }
    fn get_tag(&self, node: &GraphNode) -> Option<&T> {
        self.hash.get(node)
    }
}

impl DirectedGraph<GraphNode, GraphNodeLookup<usize>> {
    /// Get a list of `GraphNode`s corresponding to the requested
    /// component's children.
    ///
    /// `node` must be a `GraphNode::Component`, otherwise this function will
    /// panic.
    pub fn get_component_children(&self, node: GraphNode) -> Vec<GraphNode> {
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        let children_virtual_node = self
            .get_nth_child(&node, 0)
            .expect("A component node should always have children in the structure graph");
        self.get_children(&children_virtual_node)
    }

    /// Get a list of `GraphNode`s corresponding to the requested
    /// component's attributes. Each node will be a `GraphNode::Virtual` and
    /// the children of each virtual node will be the content of the attribute.
    /// The order is the same as that returned by `Component::get_attribute_names()`.
    pub fn get_component_attributes(&self, node: GraphNode) -> Vec<GraphNode> {
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        let attributes_virtual_node = self
            .get_nth_child(&node, 1)
            .expect("A component node should always have attributes in the structure graph");
        self.get_children(&attributes_virtual_node)
    }
}
