use std::{borrow::Borrow, collections::HashMap, fmt::Debug, hash::Hash};

/// An abstract graph. The speed of lookups is determined by the `Taggable` type,
/// which is used to map `Node -> usize` for lookups in the internal data structures.
///
/// Example using `HashMap` as the `Taggable` type:
/// ```rust
/// # use doenetml_core::graph::directed_graph::DirectedGraph;
/// use std::collections::HashMap;
/// // Make a graph
/// // a -> b -> c
/// // a -> c
/// let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
/// graph.add_node("a".to_string());
/// graph.add_node("b".to_string());
/// graph.add_node("c".to_string());
/// graph.add_edge("a".to_string(), "b".to_string());
/// graph.add_edge("a".to_string(), "c".to_string());
/// graph.add_edge("b".to_string(), "c".to_string());
/// assert_eq!(graph.descendants_topological_multiroot(&["a".to_string()]).collect::<Vec<_>>(), vec!["a", "b", "c"]);
/// ```
#[derive(Debug)]
pub struct DirectedGraph<Node: Clone + Debug, IndexLookup: Taggable<Node, usize>> {
    /// A `Taggable` that allows for looking up the index of a node in the graph.
    /// I.e., used for `Node -> usize` lookups.
    pub(super) index_lookup: IndexLookup,
    /// The nodes in the graph. Internally nodes are represented as `usize`. But `Graph` stores nodes
    /// for the users to make its internal structure opaque.
    pub(super) nodes: Vec<Node>,
    /// Directed edges between nodes. `edges[i]` is a list of all node indices that node `i` has an edge to.
    /// The edges are not sorted, so `edges[i][j]` represents the `j`th-added edge from node `i` to node `edges[i][j]`.
    pub(super) edges: Vec<Vec<usize>>,
    /// Reverse directed version of every edge.
    pub(super) reverse_edges: Vec<Vec<usize>>,
}

impl<Node: Clone + Debug, IndexLookup: Taggable<Node, usize>> DirectedGraph<Node, IndexLookup> {
    /// **For internal use**. Get the `IndexLookup` object.
    pub fn _debug_get_index_lookup(&self) -> &IndexLookup {
        &self.index_lookup
    }

    /// Get `self.nodes`
    pub fn get_nodes(&self) -> &Vec<Node> {
        &self.nodes
    }

    /// Get a slice of `self.edges`. Note values listed in the edges array are internal indices.
    /// `self.nodes` must be used to look up the node for each index.
    ///
    /// **For internal use**. Only use this function if you know what you're doing.
    pub(crate) fn _get_edges_raw(&self) -> &Vec<Vec<usize>> {
        &self.edges
    }

    /// Get a slice of `self.edges`. Note values listed in the edges array are internal indices.
    /// `self.nodes` must be used to look up the node for each index.
    ///
    /// **For internal use**. Only use this function if you know what you're doing.
    pub(crate) fn _get_reverse_edges_raw(&self) -> &Vec<Vec<usize>> {
        &self.reverse_edges
    }

    /// Add a node to the graph.
    pub fn add_node<A: Borrow<Node>>(&mut self, node: A) -> usize {
        let node = node.borrow();
        if let Some(index) = self.index_lookup.get_tag(node) {
            return *index;
        }
        let index = self.nodes.len();
        self.index_lookup.set_tag(node.clone(), index);
        // There should always be the same number of elements in the `nodes`, `edges`, and `reverse_edges`
        // vectors.
        self.nodes.push(node.clone());
        self.edges.push(Vec::new());
        self.reverse_edges.push(Vec::new());
        index
    }

    /// Set an edge between two nodes. If the nodes do not exist, they are added to the graph.
    pub fn add_edge<A: Borrow<Node>, B: Borrow<Node>>(&mut self, from: A, to: B) {
        let from = from.borrow();
        let to = to.borrow();
        let from_index = self
            .index_lookup
            .get_tag(from)
            .cloned()
            .unwrap_or_else(|| self.add_node(from.clone()));
        let to_index = self
            .index_lookup
            .get_tag(to)
            .cloned()
            .unwrap_or_else(|| self.add_node(to.clone()));
        self.edges[from_index].push(to_index);
        self.reverse_edges[to_index].push(from_index);
    }

    /// Set an edge between two nodes as the first edge of the first node.
    /// If the nodes do not exist, they are added to the graph.
    pub fn prepend_edge<A: Borrow<Node>, B: Borrow<Node>>(&mut self, from: A, to: B) {
        let from = from.borrow();
        let to = to.borrow();
        let from_index = self
            .index_lookup
            .get_tag(from)
            .cloned()
            .unwrap_or_else(|| self.add_node(from.clone()));
        let to_index = self
            .index_lookup
            .get_tag(to)
            .cloned()
            .unwrap_or_else(|| self.add_node(to.clone()));
        self.edges[from_index].insert(0, to_index);
        self.reverse_edges[to_index].push(from_index);
    }

    /// Returns the immediate children of `node`.
    pub fn get_children<A: Borrow<Node>>(&self, node: A) -> Vec<Node> {
        let node = node.borrow();
        let &index = self.index_lookup.get_tag(node).unwrap();
        self.edges[index]
            .iter()
            .map(|&i| self.nodes[i].clone())
            .collect()
    }

    /// Returns the `n`th child of `node`. `n` is 0-indexed.
    pub fn get_nth_child<A: Borrow<Node>>(&self, node: A, n: usize) -> Option<Node> {
        let node = node.borrow();
        let &index = self.index_lookup.get_tag(node).unwrap();
        self.edges[index].get(n).map(|&i| self.nodes[i].clone())
    }

    /// Returns the unique leaf descendant of `node` (I.e., the unique descendant without
    /// any children). This function will only return `Some(Node)` if there is a unique
    /// chain starting at `node`. If multiple children are detected, `None` is returned.
    pub fn get_leaf<A: Borrow<Node>>(&self, node: A) -> Option<Node> {
        let node = node.borrow();
        let mut node_idx = self.index_lookup.get_tag(node).unwrap();
        let mut loop_count = 0;
        loop {
            match self.edges[*node_idx].len() {
                0 => return Some(self.nodes[*node_idx].clone()),
                1 => {
                    if loop_count > self.nodes.len() {
                        panic!("Cycle detected in graph")
                    }
                    loop_count += 1;
                    node_idx = &self.edges[*node_idx][0];
                }
                _ => return None,
            }
        }
    }

    /// Get the parent of `node` if it exists and is unique.
    pub fn get_unique_parent<A: Borrow<Node>>(&self, node: A) -> Option<Node> {
        let node = node.borrow();
        let node_idx = self
            .index_lookup
            .get_tag(node)
            .expect("Could not find index of node. This should never happen.");
        if self.reverse_edges[*node_idx].len() == 1 {
            Some(self.nodes[self.reverse_edges[*node_idx][0]].clone())
        } else {
            None
        }
    }
}

impl<Node: Clone + Debug, IndexLookup: Taggable<Node, usize> + Default> Default
    for DirectedGraph<Node, IndexLookup>
{
    fn default() -> Self {
        Self::new()
    }
}

impl<Node: Clone + Debug, IndexLookup: Taggable<Node, usize> + Default>
    DirectedGraph<Node, IndexLookup>
{
    pub fn new() -> Self {
        DirectedGraph {
            index_lookup: IndexLookup::default(),
            nodes: Vec::new(),
            edges: Vec::new(),
            reverse_edges: Vec::new(),
        }
    }
}

/// `Taggable` items can have data attached to them. This provides hash-map-like functionality,
/// but may be optimized for faster lookup.
pub trait Taggable<Node, T> {
    /// Get the index of `node`
    fn get_tag(&self, node: &Node) -> Option<&T>;
    /// Set the index of `node` to `index`
    fn set_tag(&mut self, node: Node, tag: T);
}

impl<Node: Clone + Eq + Hash, T> Taggable<Node, T> for HashMap<Node, T> {
    fn get_tag(&self, node: &Node) -> Option<&T> {
        self.get(node)
    }

    fn set_tag(&mut self, node: Node, tag: T) {
        self.insert(node, tag);
    }
}

#[cfg(test)]
#[path = "graph.test.rs"]
mod test;
