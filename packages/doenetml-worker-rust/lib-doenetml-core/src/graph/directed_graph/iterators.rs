//! Iterators for the `Graph` type.

/// An iterator that yields indices of all descendants of a node in a graph in reverse topological order.
/// This is the iterator all others are based on.
///
/// **For internal use**. Only use this function if you know what you're doing.
struct DescendantReverseTopologicalIteratorRaw<'a> {
    edges: &'a [Vec<usize>],
    remaining_indices: Vec<usize>,
    visited: Vec<bool>,
}

impl<'a> Iterator for DescendantReverseTopologicalIteratorRaw<'a> {
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

/// An iterator that yields all descendants of a node in a graph in topological order (i.e., parents are
/// always yielded first).
pub struct DescendantTopologicalIterator<'a, Node> {
    nodes: &'a [Node],
    iter: std::vec::IntoIter<usize>,
}
impl<'a, Node> DescendantTopologicalIterator<'a, Node> {
    pub fn new_multiroot(
        nodes: &'a [Node],
        edges: &'a [Vec<usize>],
        start_indices: Vec<usize>,
    ) -> Self {
        let rti = DescendantReverseTopologicalIteratorRaw {
            edges,
            remaining_indices: start_indices,
            visited: vec![false; edges.len()],
        };
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

/// An iterator that yields all descendants of a node in a graph in reverse topological order (i.e., children are
/// always yielded before parents).
pub struct DescendantReverseTopologicalIterator<'a, Node> {
    nodes: &'a [Node],
    iter: DescendantReverseTopologicalIteratorRaw<'a>,
}
impl<'a, Node> DescendantReverseTopologicalIterator<'a, Node> {
    /// Iterate over all descendants of any node in `start_indices` in reverse topological order.
    pub fn new_multiroot(
        nodes: &'a [Node],
        edges: &'a [Vec<usize>],
        start_indices: Vec<usize>,
    ) -> Self {
        Self {
            nodes,
            iter: DescendantReverseTopologicalIteratorRaw {
                edges,
                remaining_indices: start_indices,
                visited: vec![false; edges.len()],
            },
        }
    }
    /// Iterate over all descendants of any node in `start_indices` in reverse topological order, but skip
    /// over nodes that `fn_skip` returns `true` for.
    pub fn new_multiroot_with_skip<SkipFn: Fn(&Node) -> bool>(
        nodes: &'a [Node],
        edges: &'a [Vec<usize>],
        start_indices: Vec<usize>,
        skip: SkipFn,
    ) -> Self {
        // TODO: This might be made more efficient by calling `skip` in the _raw_ version of this iterator
        // only when needed. Investigate if we need this performance boost.
        let visited = nodes.iter().map(skip).collect::<Vec<_>>();
        Self {
            nodes,
            iter: DescendantReverseTopologicalIteratorRaw {
                edges,
                remaining_indices: start_indices,
                visited,
            },
        }
    }
}
impl<'a, Node> Iterator for DescendantReverseTopologicalIterator<'a, Node> {
    type Item = &'a Node;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|index| &self.nodes[index])
    }
}
