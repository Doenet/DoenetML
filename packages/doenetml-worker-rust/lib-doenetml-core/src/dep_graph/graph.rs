use std::{collections::HashMap, fmt::Debug, hash::Hash};

/// An abstract graph. The speed of lookups is determined by the `Indexable` type,
/// which is used to map `Node -> usize` for lookups in the internal data structures.
///
/// Example using `HashMap` as the `Indexable` type:
/// ```rust
/// # use doenetml_core::dep_graph::graph::Graph;
/// use std::collections::HashMap;
/// // Make a graph
/// // a -> b -> c
/// // a -> c
/// let mut graph = Graph::<String, HashMap<_, _>>::new();
/// graph.add_node("a".into());
/// graph.add_node("b".into());
/// graph.add_node("c".into());
/// graph.add_edge("a".into(), "b".into());
/// graph.add_edge("a".into(), "c".into());
/// graph.add_edge("b".into(), "c".into());
/// assert_eq!(graph.walk_descendants("a".into()).collect::<Vec<_>>(), vec!["b", "c"]);
/// ```
#[derive(Debug)]
pub struct Graph<Node: Clone + Eq + Hash + Debug, Index: Taggable<Node, usize>> {
    /// An `Indexable` that allows for looking up the index of a node in the graph.
    /// I.e., used for `Node -> usize` lookups.
    index: Index,
    /// The nodes in the graph. Internally nodes are represented as `usize`. But `Graph` stores nodes
    /// for the users to make its internal structure opaque.
    nodes: Vec<Node>,
    /// Directed edges between nodes.
    edges: Vec<Vec<usize>>,
    /// Reverse directed version of every edge.
    reverse_edges: Vec<Vec<usize>>,
}

impl<Node: Clone + Eq + Hash + Debug, Index: Taggable<Node, usize>> Graph<Node, Index> {
    /// Add a node to the graph.
    pub fn add_node(&mut self, node: Node) {
        let index = self.nodes.len();
        self.index.set_tag(node.clone(), index);
        // There should always be the same number of elements in the `nodes`, `edges`, and `reverse_edges`
        // vectors.
        self.nodes.push(node);
        self.edges.push(Vec::new());
        self.reverse_edges.push(Vec::new());
    }
    /// Set an edge between two nodes.
    pub fn add_edge(&mut self, from: Node, to: Node) {
        let &from_index = self.index.get_tag(from);
        let &to_index = self.index.get_tag(to);
        self.edges[from_index].push(to_index);
        self.reverse_edges[to_index].push(from_index);
    }
    /// Walk through all nodes that have `node` as an ancestor. Nodes are walked in _topological_ order.
    /// Panics if a cycle is detected.
    pub fn walk_descendants(&self, node: Node) -> DescendantTopologicalIterator<Node> {
        let &start_index = self.index.get_tag(node);
        DescendantTopologicalIterator::new(&self.nodes, &self.edges, start_index)
    }
    /// Walk through all nodes that have `node` as a descendant. Nodes are walked in _topological_ order.
    /// Panics if a cycle is detected.
    pub fn walk_ancestors(&self, node: Node) -> DescendantTopologicalIterator<Node> {
        let &start_index = self.index.get_tag(node);
        DescendantTopologicalIterator::new(&self.nodes, &self.reverse_edges, start_index)
    }

    /// Iterate through all nodes that have `node` as an ancestor. This iterator is meant to be fast.
    /// The order of the nodes is not guaranteed, and the same node may be yielded multiple times.
    pub fn descendants_quick(&self, node: Node) -> DescendantIterator<Node> {
        let &start_index = self.index.get_tag(node);
        DescendantIterator::new(&self.nodes, &self.edges, start_index)
    }
}

impl<Node: Clone + Eq + Hash + Debug, Index: Taggable<Node, usize> + Default> Default
    for Graph<Node, Index>
{
    fn default() -> Self {
        Self::new()
    }
}

impl<Node: Clone + Eq + Hash + Debug, Index: Taggable<Node, usize> + Default> Graph<Node, Index> {
    pub fn new() -> Self {
        Graph {
            index: Index::default(),
            nodes: Vec::new(),
            edges: Vec::new(),
            reverse_edges: Vec::new(),
        }
    }
}

use iterators::*;
pub mod iterators {
    //! Iterators for the `Graph` type.

    /// Iterate through the descendants of a node. This iterator is
    /// meant to be fast, does not guarantee any particular order, and
    /// may yield the same node multiple times.
    pub struct DescendantIterator<'a, Node> {
        nodes: &'a [Node],
        graph: &'a [Vec<usize>],
        remaining_indices: Vec<usize>,
        num_visited: usize,
    }
    impl<'a, Node> DescendantIterator<'a, Node> {
        pub fn new(nodes: &'a [Node], graph: &'a [Vec<usize>], start_index: usize) -> Self {
            let remaining_indices = graph[start_index].clone();
            Self {
                nodes,
                graph,
                remaining_indices,
                num_visited: 0,
            }
        }
    }
    impl<'a, Node> Iterator for DescendantIterator<'a, Node> {
        type Item = &'a Node;
        fn next(&mut self) -> Option<Self::Item> {
            let index = self.remaining_indices.pop()?;
            // Add all children of the node to `remaining_indices`
            self.remaining_indices.extend(self.graph[index].iter());

            // We may return the same node multiple times,
            // so this check is not _correct_. It should be `#nodes^2` (assuming
            // at most one edge between nodes).
            // But that's an excessive check for most graphs. Hopefully this quick
            // check will save us trouble.
            self.num_visited += 1;
            if self.num_visited > 2 * self.nodes.len() {
                panic!("Cycle detected in graph")
            }
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
    fn get_tag(&self, node: Node) -> &T;
    /// Set the index of `node` to `index`
    fn set_tag(&mut self, node: Node, tag: T);
}

impl<Node: Clone + Eq + Hash, T> Taggable<Node, T> for HashMap<Node, T> {
    fn get_tag(&self, node: Node) -> &T {
        self.get(&node).unwrap()
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

        assert_eq!(*indexable.get_tag("test".into()), 0);
        assert_eq!(*indexable.get_tag("test2".into()), 1);
    }

    #[test]
    fn can_walk_in_topological_order() {
        // Set up the graph
        // a -> b
        // a -> c -> e
        // c -> d -> e
        let mut graph = Graph::<String, HashMap<_, _>>::new();
        graph.add_node("a".into());
        graph.add_node("b".into());
        graph.add_node("c".into());
        graph.add_node("d".into());
        graph.add_node("e".into());
        graph.add_edge("a".into(), "b".into());
        graph.add_edge("a".into(), "c".into());
        graph.add_edge("c".into(), "d".into());
        graph.add_edge("c".into(), "e".into());
        graph.add_edge("d".into(), "e".into());
        assert_eq!(
            graph.walk_descendants("a".into()).collect::<Vec<_>>(),
            vec!["b", "c", "d", "e"]
        );

        assert_eq!(
            graph.walk_descendants("d".into()).collect::<Vec<_>>(),
            vec!["e"]
        );

        assert_eq!(
            graph.walk_descendants("e".into()).collect::<Vec<_>>(),
            Vec::<&String>::new()
        );
    }

    #[test]
    fn can_quick_iterate_through_descendants() {
        // Set up the graph
        // a -> b
        // a -> c -> e
        // c -> d -> e
        let mut graph = Graph::<String, HashMap<_, _>>::new();
        graph.add_node("a".into());
        graph.add_node("b".into());
        graph.add_node("c".into());
        graph.add_node("d".into());
        graph.add_node("e".into());
        graph.add_edge("a".into(), "b".into());
        graph.add_edge("a".into(), "c".into());
        graph.add_edge("c".into(), "d".into());
        graph.add_edge("c".into(), "e".into());
        graph.add_edge("d".into(), "e".into());
        assert_eq!(
            graph.descendants_quick("a".into()).collect::<Vec<_>>(),
            // Repeated nodes are allowed for the `_quick` iterator
            vec!["c", "e", "d", "e", "b"]
        );
    }
}
