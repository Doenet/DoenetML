use std::{collections::HashMap, fmt::Debug, hash::Hash};

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
/// graph.add_node("a".into());
/// graph.add_node("b".into());
/// graph.add_node("c".into());
/// graph.add_edge(&"a".into(), &"b".into());
/// graph.add_edge(&"a".into(), &"c".into());
/// graph.add_edge(&"b".into(), &"c".into());
/// assert_eq!(graph.walk_descendants(&"a".into()).collect::<Vec<_>>(), vec!["b", "c"]);
/// ```
#[derive(Debug)]
pub struct DirectedGraph<Node: Clone + Debug, IndexLookup: Taggable<Node, usize>> {
    /// A `Taggable` that allows for looking up the index of a node in the graph.
    /// I.e., used for `Node -> usize` lookups.
    index_lookup: IndexLookup,
    /// The nodes in the graph. Internally nodes are represented as `usize`. But `Graph` stores nodes
    /// for the users to make its internal structure opaque.
    nodes: Vec<Node>,
    /// Directed edges between nodes. `edges[i]` is a list of all node indices that node `i` has an edge to.
    /// The edges are not sorted, so `edges[i][j]` represents the `j`th-added edge from node `i` to node `edges[i][j]`.
    edges: Vec<Vec<usize>>,
    /// Reverse directed version of every edge.
    reverse_edges: Vec<Vec<usize>>,
}

impl<Node: Clone + Debug, IndexLookup: Taggable<Node, usize>> DirectedGraph<Node, IndexLookup> {
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
    pub fn add_node(&mut self, node: Node) -> usize {
        if let Some(index) = self.index_lookup.get_tag(&node) {
            return *index;
        }
        let index = self.nodes.len();
        self.index_lookup.set_tag(node.clone(), index);
        // There should always be the same number of elements in the `nodes`, `edges`, and `reverse_edges`
        // vectors.
        self.nodes.push(node);
        self.edges.push(Vec::new());
        self.reverse_edges.push(Vec::new());
        index
    }

    /// Set an edge between two nodes. If the nodes do not exist, they are added to the graph.
    pub fn add_edge(&mut self, from: &Node, to: &Node) {
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
    pub fn prepend_edge(&mut self, from: &Node, to: &Node) {
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
    pub fn get_children(&self, node: &Node) -> Vec<Node> {
        let &index = self.index_lookup.get_tag(node).unwrap();
        self.edges[index]
            .iter()
            .map(|&i| self.nodes[i].clone())
            .collect()
    }

    /// Returns the `n`th child of `node`. `n` is 0-indexed.
    pub fn get_nth_child(&self, node: &Node, n: usize) -> Option<Node> {
        let &index = self.index_lookup.get_tag(node).unwrap();
        self.edges[index].get(n).map(|&i| self.nodes[i].clone())
    }

    /// Walk through all nodes that have `node` as an ancestor. Nodes are walked in _topological_ order.
    /// Panics if a cycle is detected.
    pub fn walk_descendants(&self, node: &Node) -> DescendantTopologicalIterator<Node> {
        let &start_index = self.index_lookup.get_tag(node).unwrap();
        DescendantTopologicalIterator::new(&self.nodes, &self.edges, start_index)
    }

    /// Walk through all nodes that have `node` as a descendant. Nodes are walked in _topological_ order.
    /// Panics if a cycle is detected.
    pub fn walk_ancestors(&self, node: &Node) -> DescendantTopologicalIterator<Node> {
        let &start_index = self.index_lookup.get_tag(node).unwrap();
        DescendantTopologicalIterator::new(&self.nodes, &self.reverse_edges, start_index)
    }

    /// Iterate through all nodes that have `node` as an ancestor. This iterator is meant to be fast.
    /// The order of the nodes is not guaranteed.
    /// Panics if a cycle is detected.
    pub fn descendants_quick(&self, node: &Node) -> DescendantIterator<Node> {
        let &start_index = self.index_lookup.get_tag(node).unwrap();
        DescendantIterator::new(&self.nodes, &self.edges, start_index)
    }

    /// Iterate through all edges of `node` and `node`'s descendants. This iterator is meant to be fast.
    /// The order of the edges is not guaranteed.
    /// Panics if a cycle is detected.
    pub fn descendant_edges(&self, node: &Node) -> DescendantEdgeIterator<Node> {
        let &start_index = self.index_lookup.get_tag(node).unwrap();
        DescendantEdgeIterator::new(&self.nodes, &self.edges, start_index)
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

use iterators::*;
pub mod iterators {
    //! Iterators for the `Graph` type.

    /// Iterate through all edges of a node an its descendants.
    /// This returns edges represented with `DirectedGraph`'s internal representation.
    ///
    /// **For internal use**. Only use this function if you know what you're doing.
    pub struct DescendantEdgeIteratorRaw<'a> {
        edges: &'a [Vec<usize>],
        remaining_indices: Vec<(usize, usize)>,
        descendant_iterator_raw: DescendantIteratorRaw<'a>,
    }
    impl<'a> DescendantEdgeIteratorRaw<'a> {
        pub fn new(num_nodes: usize, edges: &'a [Vec<usize>], start_index: usize) -> Self {
            let descendant_iterator_raw =
                DescendantIteratorRaw::new(num_nodes, edges, start_index);
            let remaining_indices = edges[start_index]
                .iter()
                .map(|&to| (start_index, to))
                .collect();
            Self {
                edges,
                remaining_indices,
                descendant_iterator_raw,
            }
        }
    }
    impl<'a> Iterator for DescendantEdgeIteratorRaw<'a> {
        type Item = (usize, usize);
        fn next(&mut self) -> Option<Self::Item> {
            if let Some(edge) = self.remaining_indices.pop() {
                Some(edge)
            } else {
                // We've exhausted our current supply of edges. Move to the next descendant.
                let next_descendant = self.descendant_iterator_raw.next()?;
                self.remaining_indices.extend(
                    self.edges[next_descendant]
                        .iter()
                        .map(|&to| (next_descendant, to)),
                );
                self.next()
            }
        }
    }

    pub struct DescendantEdgeIterator<'a, Node> {
        nodes: &'a [Node],
        descendant_edge_iterator_raw: DescendantEdgeIteratorRaw<'a>,
    }
    impl<'a, Node> DescendantEdgeIterator<'a, Node> {
        pub fn new(nodes: &'a [Node], edges: &'a [Vec<usize>], start_index: usize) -> Self {
            Self {
                nodes,
                descendant_edge_iterator_raw: DescendantEdgeIteratorRaw::new(
                    nodes.len(),
                    edges,
                    start_index,
                ),
            }
        }
    }
    impl<'a, Node> Iterator for DescendantEdgeIterator<'a, Node> {
        type Item = (&'a Node, &'a Node);
        fn next(&mut self) -> Option<Self::Item> {
            let (from, to) = self.descendant_edge_iterator_raw.next()?;
            Some((&self.nodes[from], &self.nodes[to]))
        }
    }

    /// Iterate through the descendants of a node but return
    /// the `DirectedGraph`'s internal representation of each node.
    ///
    /// **For internal use**. Only use this function if you know what you're doing.
    pub struct DescendantIteratorRaw<'a> {
        edges: &'a [Vec<usize>],
        remaining_indices: Vec<usize>,
        num_visited: usize,
        visited: Vec<bool>,
    }
    impl<'a> DescendantIteratorRaw<'a> {
        pub fn new(num_nodes: usize, edges: &'a [Vec<usize>], start_index: usize) -> Self {
            let remaining_indices = edges[start_index].clone();
            let visited = vec![false; num_nodes];
            Self {
                edges,
                remaining_indices,
                num_visited: 0,
                visited,
            }
        }
    }
    impl<'a> Iterator for DescendantIteratorRaw<'a> {
        type Item = usize;
        fn next(&mut self) -> Option<Self::Item> {
            let index = self.remaining_indices.pop()?;
            // Add all children of the node to `remaining_indices`
            self.remaining_indices.extend(self.edges[index].iter());

            // We may return the same node multiple times,
            // so this check is not _correct_. It should be `#nodes^2` (assuming
            // at most one edge between nodes).
            // But that's an excessive check for most graphs. Hopefully this quick
            // check will save us trouble.
            self.num_visited += 1;
            if self.num_visited > 2 * self.visited.len() {
                panic!("Cycle detected in graph")
            }
            // Don't return the same node twice
            if self.visited[index] {
                self.next()
            } else {
                self.visited[index] = true;
                Some(index)
            }
        }
    }

    /// Iterate through the descendants of a node. This iterator
    /// does not guarantee any particular order.
    pub struct DescendantIterator<'a, Node> {
        nodes: &'a [Node],
        descendant_iterator_raw: DescendantIteratorRaw<'a>,
    }
    impl<'a, Node> DescendantIterator<'a, Node> {
        pub fn new(nodes: &'a [Node], edges: &'a [Vec<usize>], start_index: usize) -> Self {
            Self {
                nodes,
                descendant_iterator_raw: DescendantIteratorRaw::new(
                    nodes.len(),
                    edges,
                    start_index,
                ),
            }
        }
    }
    impl<'a, Node> Iterator for DescendantIterator<'a, Node> {
        type Item = &'a Node;
        fn next(&mut self) -> Option<Self::Item> {
            let index = self.descendant_iterator_raw.next()?;
            Some(&self.nodes[index])
        }
    }

    /// An iterator that yields all descendants of a node in a graph in topological order (i.e., parents are
    /// always yielded first).
    pub struct DescendantTopologicalIterator<'a, Node> {
        nodes: &'a [Node],
        iter: std::vec::IntoIter<usize>,
    }

    impl<'a, Node> DescendantTopologicalIterator<'a, Node> {
        pub fn new(nodes: &'a [Node], edges: &'a [Vec<usize>], start_index: usize) -> Self {
            let rti = ReverseTopologicalIterator::new(edges, start_index);
            let mut order = rti.collect::<Vec<_>>();
            order.reverse();

            Self {
                nodes,
                iter: order.into_iter(),
            }
        }
    }

    impl<'a, Node> Iterator for DescendantTopologicalIterator<'a, Node> {
        type Item = &'a Node;

        fn next(&mut self) -> Option<Self::Item> {
            self.iter.next().map(|index| &self.nodes[index])
        }
    }

    /// An iterator that yields indices of all descendants of a node in a graph in reverse topological order.
    pub struct ReverseTopologicalIterator<'a> {
        edges: &'a [Vec<usize>],
        remaining_indices: Vec<usize>,
        visited: Vec<bool>,
    }

    impl<'a> ReverseTopologicalIterator<'a> {
        pub fn new(edges: &'a [Vec<usize>], start_index: usize) -> Self {
            let visited = vec![false; edges.len()];
            let remaining_indices = edges[start_index].clone();
            Self {
                edges,
                visited,
                remaining_indices,
            }
        }
    }

    impl<'a> Iterator for ReverseTopologicalIterator<'a> {
        type Item = usize;

        fn next(&mut self) -> Option<Self::Item> {
            // We want to return nodes sorted topologically.
            while let Some(&index) = self.remaining_indices.last() {
                // In the worst case, we have to queue the whole graph for iteration.
                // If we have more queued than that, we have a cycle.
                if self.remaining_indices.len() > self.edges.len() {
                    panic!("Cycle detected in graph")
                }

                // If the node has been visited, pop it off the stack and continue.
                if self.visited[index] {
                    self.remaining_indices.pop();
                    continue;
                }
                // If the node has no unvisited children, that's the node we want
                // to return next.
                if self.edges[index].iter().all(|&to| self.visited[to]) {
                    self.visited[index] = true;
                    self.remaining_indices.pop();
                    return Some(index);
                }
                // Otherwise, add all unvisited children to the stack.
                self.remaining_indices
                    .extend(self.edges[index].iter().filter(|&&to| !self.visited[to]));
            }
            None
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
mod test {
    use super::*;

    #[test]
    fn test_indexable() {
        let mut indexable: HashMap<String, usize> = HashMap::new();
        indexable.set_tag("test".into(), 0);
        indexable.set_tag("test2".into(), 1);

        assert_eq!(*indexable.get_tag(&"test".into()).unwrap(), 0);
        assert_eq!(*indexable.get_tag(&"test2".into()).unwrap(), 1);
    }

    #[test]
    fn can_walk_in_topological_order() {
        // Set up the graph
        // a -> b
        // a -> c -> e
        // c -> d -> e
        let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
        graph.add_node("a".into());
        graph.add_node("b".into());
        graph.add_node("c".into());
        graph.add_node("d".into());
        graph.add_node("e".into());
        graph.add_edge(&"a".into(), &"b".into());
        graph.add_edge(&"a".into(), &"c".into());
        graph.add_edge(&"c".into(), &"d".into());
        graph.add_edge(&"c".into(), &"e".into());
        graph.add_edge(&"d".into(), &"e".into());
        assert_eq!(
            graph.walk_descendants(&"a".into()).collect::<Vec<_>>(),
            vec!["b", "c", "d", "e"]
        );

        assert_eq!(
            graph.walk_descendants(&"d".into()).collect::<Vec<_>>(),
            vec!["e"]
        );

        assert_eq!(
            graph.walk_descendants(&"e".into()).collect::<Vec<_>>(),
            Vec::<&String>::new()
        );
    }

    #[test]
    fn can_quick_iterate_through_descendants() {
        // Set up the graph
        // a -> b
        // a -> c -> e
        // c -> d -> e
        let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
        graph.add_node("a".into());
        graph.add_node("b".into());
        graph.add_node("c".into());
        graph.add_node("d".into());
        graph.add_node("e".into());
        graph.add_edge(&"a".into(), &"b".into());
        graph.add_edge(&"a".into(), &"c".into());
        graph.add_edge(&"c".into(), &"d".into());
        graph.add_edge(&"c".into(), &"e".into());
        graph.add_edge(&"d".into(), &"e".into());
        assert_eq!(
            graph.descendants_quick(&"a".into()).collect::<Vec<_>>(),
            // Repeated nodes are allowed for the `_quick` iterator
            vec!["c", "e", "d", "b"]
        );
    }

    #[test]
    fn can_iterate_through_descendant_edges() {
        // Set up the graph
        // a -> b
        // a -> c -> e
        // c -> d -> e
        let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
        graph.add_node("a".into());
        graph.add_node("b".into());
        graph.add_node("c".into());
        graph.add_node("d".into());
        graph.add_node("e".into());
        graph.add_edge(&"a".into(), &"b".into());
        graph.add_edge(&"a".into(), &"c".into());
        graph.add_edge(&"c".into(), &"d".into());
        graph.add_edge(&"c".into(), &"e".into());
        graph.add_edge(&"d".into(), &"e".into());
        assert_eq!(
            graph.descendant_edges(&"a".into()).collect::<Vec<_>>(),
            vec![
                (&"a".into(), &"c".into()),
                (&"a".into(), &"b".into()),
                (&"c".into(), &"e".into()),
                (&"c".into(), &"d".into()),
                (&"d".into(), &"e".into())
            ]
        );
    }
}
