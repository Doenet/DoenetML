//! Iterators for the `Graph` type.

/// A [`NodeSkipFn`] that should never be called. It is used as a type stand-in.
pub(super) struct UnusedSkip {}
impl RawSkipFn for UnusedSkip {
    fn skip(&self, _: usize) -> bool {
        unreachable!("UnusedSkip should never be called")
    }
}

/// Struct to turn a skip function that works on `Node` into a [`RawSkipFn`].
pub(super) struct SkipToRawSkipFn<'a, Node, F: Fn(&Node) -> bool> {
    f: F,
    nodes: &'a [Node],
}

/// Trait implemented for skipping nodes during graph traversal.
/// The _raw_ version works on the internal indices of the nodes.
pub(super) trait RawSkipFn {
    fn skip(&self, _: usize) -> bool;
}
impl<Node, F: Fn(&Node) -> bool> RawSkipFn for SkipToRawSkipFn<'_, Node, F> {
    fn skip(&self, index: usize) -> bool {
        (self.f)(&self.nodes[index])
    }
}

/// An iterator that yields indices of all descendants of a node in a graph in reverse topological order.
/// This is the iterator all others are based on.
///
/// **For internal use**. Only use this function if you know what you're doing.
struct DescendantReverseTopologicalIteratorRaw<'a, SkipFn: RawSkipFn> {
    edges: &'a [Vec<usize>],
    remaining_indices: Vec<usize>,
    visited: Vec<bool>,
    skip_fn: Option<SkipFn>,
}

impl<SkipFn: RawSkipFn> Iterator for DescendantReverseTopologicalIteratorRaw<'_, SkipFn> {
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

            // If the node should be skipped, mark it as visited and continue.
            if let Some(ref skip_fn) = self.skip_fn
                && skip_fn.skip(index)
            {
                self.visited[index] = true;
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
        // No skip function for this iterator.
        let skip_fn: Option<UnusedSkip> = None;
        let rti = DescendantReverseTopologicalIteratorRaw {
            edges,
            remaining_indices: start_indices,
            visited: vec![false; edges.len()],
            skip_fn,
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
///
/// `_RawSkipFn` is an internal type used by the `Raw` version of the iterator.
pub struct DescendantReverseTopologicalIterator<'a, Node, _RawSkipFn: RawSkipFn> {
    nodes: &'a [Node],
    iter: DescendantReverseTopologicalIteratorRaw<'a, _RawSkipFn>,
}

// We implement on `UnusedSkip` so that there is a unique implementation for the `new_*` functions.
// Each `new_*` returns a customized version of `Self` with the `UnusedSkip` type replaced by one
// derived from a function closure.
impl<'a, Node> DescendantReverseTopologicalIterator<'a, Node, UnusedSkip> {
    /// Iterate over all descendants of any node in `start_indices` in reverse topological order.
    pub fn new_multiroot(
        nodes: &'a [Node],
        edges: &'a [Vec<usize>],
        start_indices: Vec<usize>,
    ) -> DescendantReverseTopologicalIterator<'a, Node, UnusedSkip> {
        DescendantReverseTopologicalIterator {
            nodes,
            iter: DescendantReverseTopologicalIteratorRaw {
                edges,
                remaining_indices: start_indices,
                visited: vec![false; edges.len()],
                skip_fn: None,
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
    ) -> DescendantReverseTopologicalIterator<'a, Node, SkipToRawSkipFn<'a, Node, SkipFn>> {
        // Wrap the `skip_fn` so that it can operate on raw indices.
        let skip_fn = SkipToRawSkipFn { f: skip, nodes };

        // Just like in other cases, we start out not having "visited" any nodes.
        let visited = vec![false; nodes.len()];
        DescendantReverseTopologicalIterator {
            nodes,
            iter: DescendantReverseTopologicalIteratorRaw {
                edges,
                remaining_indices: start_indices,
                visited,
                skip_fn: Some(skip_fn),
            },
        }
    }
}
impl<'a, Node, _RawSkipFn: RawSkipFn> Iterator
    for DescendantReverseTopologicalIterator<'a, Node, _RawSkipFn>
{
    type Item = &'a Node;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|index| &self.nodes[index])
    }
}
