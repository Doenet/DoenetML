//! Iterators for the `Graph` type.

/// Iterate through all edges of a node an its descendants.
/// This returns edges represented with `DirectedGraph`'s internal representation.
///
/// **For internal use**. Only use this function if you know what you're doing.
struct DescendantEdgeIteratorRaw<'a> {
    edges: &'a [Vec<usize>],
    remaining_indices: Vec<(usize, usize)>,
    descendant_iterator_raw: DescendantIteratorRaw<'a>,
}
impl<'a> DescendantEdgeIteratorRaw<'a> {
    pub fn new(num_nodes: usize, edges: &'a [Vec<usize>], start_index: usize) -> Self {
        let descendant_iterator_raw = DescendantIteratorRaw::new(num_nodes, edges, start_index);
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
struct DescendantIteratorRaw<'a> {
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
            descendant_iterator_raw: DescendantIteratorRaw::new(nodes.len(), edges, start_index),
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
        let rti = DescendantReverseTopologicalIteratorRaw::new(edges, start_index);
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
    pub fn new(nodes: &'a [Node], edges: &'a [Vec<usize>], start_index: usize) -> Self {
        Self {
            nodes,
            iter: DescendantReverseTopologicalIteratorRaw::new(edges, start_index),
        }
    }
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
}
impl<'a, Node> Iterator for DescendantReverseTopologicalIterator<'a, Node> {
    type Item = &'a Node;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|index| &self.nodes[index])
    }
}

/// An iterator that yields indices of all descendants of a node in a graph in reverse topological order.
///
/// **For internal use**. Only use this function if you know what you're doing.
struct DescendantReverseTopologicalIteratorRaw<'a> {
    edges: &'a [Vec<usize>],
    remaining_indices: Vec<usize>,
    visited: Vec<bool>,
}

impl<'a> DescendantReverseTopologicalIteratorRaw<'a> {
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
