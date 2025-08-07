//! Various methods to walk a graph and its children.

use super::iterators::*;
use std::{borrow::Borrow, fmt::Debug};

use super::{DirectedGraph, Taggable};

impl<Node: Clone + Debug, IndexLookup: Taggable<Node, usize>> DirectedGraph<Node, IndexLookup> {
    /// Walk through all nodes that have any node listed in `start_nodes` as an ancestor, including `start_nodes` themselves.
    /// Nodes are walked in _topological_ order.
    /// That is, if there is an edge `a -> b`, the node `a` will be visited before `b`.
    ///
    /// Panics if a cycle is detected.
    pub fn descendants_topological_multiroot<A: Borrow<Node>>(
        &'_ self,
        start_nodes: &[A],
    ) -> DescendantTopologicalIterator<'_, Node> {
        let start_indices = start_nodes
            .iter()
            .map(|node| *self.index_lookup.get_tag(node.borrow()).unwrap())
            .collect();

        DescendantTopologicalIterator::new_multiroot(&self.nodes, &self.edges, start_indices)
    }

    /// Walk through all nodes that have any node listed in `start_nodes` as an ancestor, including `start_nodes` themselves.
    /// Nodes are walked in _reverse topological_ order.
    /// That is, if there is an edge `a -> b`, the node `b` will be visited before `a`.
    /// Panics if a cycle is detected.
    pub fn descendants_reverse_topological_multiroot<A: Borrow<Node>>(
        &self,
        start_nodes: &[A],
    ) -> impl Iterator<Item = &Node> {
        let start_indices = start_nodes
            .iter()
            .map(|node| *self.index_lookup.get_tag(node.borrow()).unwrap())
            .collect();
        DescendantReverseTopologicalIterator::new_multiroot(&self.nodes, &self.edges, start_indices)
    }

    /// Walk through all nodes that have any node listed in `start_nodes` as an ancestor, including `start_nodes` themselves.
    /// Nodes for which `skip` returns `true` are treated as if they are absent from the graph.
    /// Nodes are walked in _reverse topological_ order.
    /// That is, if there is an edge `a -> b`, the node `b` will be visited before `a`.
    /// Panics if a cycle is detected.
    pub fn descendants_reverse_topological_multiroot_with_skip<
        A: Borrow<Node>,
        SkipFn: Fn(&Node) -> bool,
    >(
        &self,
        start_nodes: &[A],
        skip: SkipFn,
    ) -> impl Iterator<Item = &Node> {
        let start_indices = start_nodes
            .iter()
            .map(|node| *self.index_lookup.get_tag(node.borrow()).unwrap())
            .collect();
        DescendantReverseTopologicalIterator::new_multiroot_with_skip(
            &self.nodes,
            &self.edges,
            start_indices,
            skip,
        )
    }

    /// Walk through all nodes that have any node listed in `start_nodes` as a descendant, including `start_nodes` themselves.
    /// Nodes are walked in _topological_ order.
    /// That is, if there is an edge `a -> b`, the node `a` will be visited before `b`.
    /// Panics if a cycle is detected.
    pub fn ancestors_topological_multiroot<A: Borrow<Node>>(
        &'_ self,
        start_nodes: &[A],
    ) -> DescendantTopologicalIterator<'_, Node> {
        let start_indices = start_nodes
            .iter()
            .map(|node| *self.index_lookup.get_tag(node.borrow()).unwrap())
            .collect();

        DescendantTopologicalIterator::new_multiroot(
            &self.nodes,
            &self.reverse_edges,
            start_indices,
        )
    }

    /// Walk through all nodes that have any node listed in `start_nodes` as a descendant, including `start_nodes` themselves.
    /// Nodes are walked in _reverse topological_ order.
    /// That is, if there is an edge `a -> b`, the node `b` will be visited before `a`.
    /// Panics if a cycle is detected.
    pub fn ancestors_reverse_topological_multiroot<A: Borrow<Node>>(
        &self,
        start_nodes: &[A],
    ) -> impl Iterator<Item = &Node> {
        let start_indices = start_nodes
            .iter()
            .map(|node| *self.index_lookup.get_tag(node.borrow()).unwrap())
            .collect();

        DescendantReverseTopologicalIterator::new_multiroot(
            &self.nodes,
            &self.reverse_edges,
            start_indices,
        )
    }

    /// Walk through all nodes that have any node listed in `start_nodes` as a descendant, including `start_nodes` themselves.
    /// Nodes for which `skip` returns `true` are treated as if they are absent from the graph.
    /// Nodes are walked in _reverse topological_ order.
    /// That is, if there is an edge `a -> b`, the node `b` will be visited before `a`.
    /// Panics if a cycle is detected.
    pub fn ancestors_reverse_topological_multiroot_with_skip<
        A: Borrow<Node>,
        SkipFn: Fn(&Node) -> bool,
    >(
        &self,
        start_nodes: &[A],
        skip: SkipFn,
    ) -> impl Iterator<Item = &Node> {
        let start_indices = start_nodes
            .iter()
            .map(|node| *self.index_lookup.get_tag(node.borrow()).unwrap())
            .collect();
        DescendantReverseTopologicalIterator::new_multiroot_with_skip(
            &self.nodes,
            &self.reverse_edges,
            start_indices,
            skip,
        )
    }

    /// Iterate through all nodes that have `node` as an ancestor. This iterator is meant to be fast.
    /// The order of the nodes is not guaranteed.
    /// Panics if a cycle is detected.
    pub fn descendants_quick<A: Borrow<Node>>(&self, node: A) -> impl Iterator<Item = &Node> {
        let node = node.borrow();
        let &start_index = self.index_lookup.get_tag(node).unwrap();
        DescendantReverseTopologicalIterator::new_multiroot(
            &self.nodes,
            &self.edges,
            vec![start_index],
        )
    }
}
