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
            .get_nth_child(node, 0)
            .expect("A component node should always have children in the structure graph");
        self.get_children(children_virtual_node)
    }

    /// Get's the virtual node that contains the requested component's children.
    ///
    /// `node` must be a `GraphNode::Component`, otherwise this function will
    /// panic.
    pub fn get_component_children_virtual_node(&self, node: GraphNode) -> GraphNode {
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
    pub fn get_component_attributes(&self, node: GraphNode) -> Vec<GraphNode> {
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
    pub fn get_component_props(&self, node: GraphNode) -> Vec<GraphNode> {
        assert!(
            matches!(node, GraphNode::Component(_)),
            "Expected a GraphNode::Component"
        );
        let attributes_virtual_node = self
            .get_nth_child(node, 2)
            .expect("A component node should always have attributes in the structure graph");
        self.get_children(attributes_virtual_node)
    }

    /// Iterate through the "content" children of a node. That is,
    /// all the non-virtual children. If a virtual child is detected,
    /// it's children are recursively iterated over.
    ///
    /// This can be used to, for example, iterate over all string children, etc.
    /// It does _not_ iterate over all descendants.
    pub fn content_children(&self, node: GraphNode) -> ContentChildrenIterator<'_> {
        ContentChildrenIterator::new(self, node)
    }
}

use iterators::*;
mod iterators {
    //! Utility iterators

    type Graph = DirectedGraph<GraphNode, GraphNodeLookup<usize>>;

    use crate::{
        graph::directed_graph::DirectedGraph,
        new_core::graph_node::{GraphNode, GraphNodeLookup},
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
                .content_children(GraphNode::Virtual(0))
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
