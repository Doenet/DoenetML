use std::collections::HashMap;

use crate::{
    components::types::LocalPropIdx,
    graph::directed_graph::{DirectedGraph, Taggable},
};

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
    serde::Serialize,
    serde::Deserialize,
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

impl GraphNode {
    pub fn idx(&self) -> usize {
        match self {
            GraphNode::Component(idx) => *idx,
            GraphNode::String(idx) => *idx,
            GraphNode::Prop(idx) => *idx,
            GraphNode::State(idx) => *idx,
            GraphNode::Query(idx) => *idx,
            GraphNode::Virtual(idx) => *idx,
        }
    }
    /// Get the wrapped `index` value. This is the same as `idx()`
    /// except it will panic if `self` is not `GraphNode::Prop`.
    pub fn prop_idx(&self) -> usize {
        match self {
            GraphNode::Prop(idx) => *idx,
            _ => panic!("`prop_idx` expected a GraphNode::Prop"),
        }
    }

    /// Get the wrapped `index` value. This is the same as `idx()`
    /// except it will panic if `self` is not `GraphNode::Component`.
    pub fn component_idx(&self) -> usize {
        match self {
            GraphNode::Component(idx) => *idx,
            _ => panic!("`component_idx` expected a GraphNode::Component"),
        }
    }
}

impl From<&GraphNode> for GraphNode {
    fn from(node: &GraphNode) -> Self {
        *node
    }
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
impl<T> Taggable<GraphNode, T> for GraphNodeLookup<T> {
    fn set_tag(&mut self, node: GraphNode, tag: T) {
        self.hash.insert(node, tag);
    }
    fn get_tag(&self, node: &GraphNode) -> Option<&T> {
        self.hash.get(node)
    }
}

pub type StructureGraph = DirectedGraph<GraphNode, GraphNodeLookup<usize>>;
pub type DependencyGraph = DirectedGraph<GraphNode, GraphNodeLookup<usize>>;

impl StructureGraph {
    /// Get a list of `GraphNode`s corresponding to the requested
    /// component's children. This function will "unwrap" any virtual children.
    /// E.g., if a component has children `v_1, c_2, c_3` and `v_1 -> c_a, c_b` (where `v_1` is a virtual node),
    /// then this function will return `c_a, c_b, c_2, c_3`.
    ///
    /// If you want _only_ the direct children without any expanding, use
    /// `self.get_children(self.get_component_children_virtual_node(node))`
    /// instead.
    ///
    /// `node` must be a `GraphNode::Component`, otherwise this function will
    /// panic.
    pub fn get_component_children(&self, node: GraphNode) -> ContentChildrenIterator<'_> {
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        let children_virtual_node = self
            .get_nth_child(node, 0)
            .expect("A component node should always have children in the structure graph");
        self.get_content_children(children_virtual_node)
    }

    /// Get's the virtual node that contains the requested component's children.
    ///
    /// `node` must be a `GraphNode::Component`, otherwise this function will
    /// panic.
    pub fn get_component_children_virtual_node<T: Into<GraphNode>>(&self, node: T) -> GraphNode {
        let node: GraphNode = node.into();
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        self.get_nth_child(node, 0)
            .expect("A component node should always have children in the structure graph")
    }

    /// Get a list of `GraphNode`s corresponding to the requested
    /// component's attributes. Each node will be a `GraphNode::Virtual` and
    /// the children of each virtual node will be the content of the attribute.
    /// The order is the same as that returned by `Component::get_attribute_names()`.
    pub fn get_component_attributes<T: Into<GraphNode>>(&self, node: T) -> Vec<GraphNode> {
        let node: GraphNode = node.into();
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        let attributes_virtual_node = self
            .get_nth_child(node, 1)
            .expect("A component node should always have attributes in the structure graph");
        self.get_children(attributes_virtual_node)
    }

    /// Get a list of `GraphNode`s corresponding to the requested
    /// component's props. Each node will be a `GraphNode::Virtual` and
    /// the children of each virtual node will be the content of the attribute.
    /// The order is the same as that returned by `Component::get_attribute_names()`.
    pub fn get_component_props<T: Into<GraphNode>>(
        &self,
        node: T,
    ) -> TiVec<LocalPropIdx, GraphNode> {
        let node: GraphNode = node.into();
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        let attributes_virtual_node = self
            .get_nth_child(node, 2)
            .expect("A component node should always have attributes in the structure graph");
        self.get_children(attributes_virtual_node).into()
    }

    /// Iterate through the "content" children of a node. That is,
    /// all the non-virtual children. If a virtual child is detected,
    /// it's children are recursively iterated over.
    ///
    /// This can be used to, for example, iterate over all string children, etc.
    /// It does _not_ iterate over all descendants.
    pub fn get_content_children(&self, node: GraphNode) -> ContentChildrenIterator<'_> {
        ContentChildrenIterator::new(self, node)
    }
}

use iterators::*;
use typed_index_collections::TiVec;
mod iterators {
    //! Utility iterators

    type Graph = DirectedGraph<GraphNode, GraphNodeLookup<usize>>;

    use crate::{
        core::graph_node::{GraphNode, GraphNodeLookup},
        graph::directed_graph::DirectedGraph,
    };
    /// Iterate through the "content" children of a node. That is,
    /// all the non-virtual children. If a virtual child is detected,
    /// it's children are recursively iterated over.
    ///
    /// This can be used to, for example, iterate over all string children, etc.
    /// It does _not_ iterate over all descendants.
    pub struct ContentChildrenIterator<'a> {
        graph: &'a Graph,
        /// Stack storing the nodes for iteration in _reverse_ order.
        stack: Vec<GraphNode>,
    }
    impl<'a> ContentChildrenIterator<'a> {
        pub fn new(graph: &'a Graph, start: GraphNode) -> Self {
            let mut stack = graph.get_children(start);
            // Order matters and we will be popping values off the end of the stack, so
            // we reverse it.
            stack.reverse();
            Self { graph, stack }
        }
    }
    impl<'a> Iterator for ContentChildrenIterator<'a> {
        type Item = GraphNode;
        fn next(&mut self) -> Option<Self::Item> {
            let node = self.stack.pop();
            match node {
                Some(GraphNode::Virtual(idx)) => {
                    // A virtual node's only job is to hold children.
                    // So if we encounter one, push its children onto the stack.
                    self.stack.extend(
                        self.graph
                            .get_children(GraphNode::Virtual(idx))
                            .into_iter()
                            .rev(),
                    );
                    self.next()
                }
                _ => node,
            }
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_can_iterate_content_children() {
        // Set up a graph
        // v_0 -> v_1
        // v_0 -> s_0
        // v_0 -> s_1 -> s_2
        // v_1 -> s_3
        // v_1 -> s_4

        let mut graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>> = DirectedGraph::new();
        graph.add_edge(GraphNode::Virtual(0), GraphNode::Virtual(1));
        graph.add_edge(GraphNode::Virtual(0), GraphNode::String(0));
        graph.add_edge(GraphNode::Virtual(0), GraphNode::String(1));
        graph.add_edge(GraphNode::String(1), GraphNode::String(2));
        graph.add_edge(GraphNode::Virtual(1), GraphNode::String(3));
        graph.add_edge(GraphNode::Virtual(1), GraphNode::String(4));

        // The direct children
        assert_eq!(
            graph.get_children(GraphNode::Virtual(0)),
            vec![
                GraphNode::Virtual(1),
                GraphNode::String(0),
                GraphNode::String(1)
            ]
        );

        assert_eq!(
            graph
                .get_content_children(GraphNode::Virtual(0))
                .collect::<Vec<_>>(),
            vec![
                GraphNode::String(3),
                GraphNode::String(4),
                GraphNode::String(0),
                GraphNode::String(1),
            ]
        );
    }
}
