use std::collections::HashMap;

use crate::graph::directed_graph::Taggable;

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
