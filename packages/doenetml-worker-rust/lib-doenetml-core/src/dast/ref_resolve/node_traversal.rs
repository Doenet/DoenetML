//! Perform a breadth-first search traversal of the resolver tree,
//! returning a description of the edges encountered.

use super::*;
use crate::dast::flat_dast::{Index, SourceDoc};
use std::collections::VecDeque;

#[derive(Debug, Clone, Copy)]
pub enum NodeOrRoot {
    Root,
    Node(Index),
}

impl NodeOrRoot {
    fn resolver_data_index(&self) -> Index {
        match self {
            NodeOrRoot::Root => 0,
            NodeOrRoot::Node(idx) => idx + 1,
        }
    }
}

#[derive(Debug)]
pub(super) enum ResolverEdgeType {
    Name(String),
    Index(usize),
}

/// An edge in the resolver graph from `origin` to `referent`. Each edge corresponds to a uniquely
/// resolved reference from `origin` to `referent`.
///
/// The resolver has two types of edges:
/// - `ResolverEdgeType::Name`: a resolution of a name from the origin to the referent, e.g., `$origin.name`
/// - `ResolverEdgeType::Index`: a resolution of an index from the origin to the referent, e.g., `$origin[2]`
#[derive(Debug)]
pub(super) struct ResolverEdge {
    pub(super) origin: NodeOrRoot,
    pub(super) origin_source: SourceDoc,
    pub(super) referent: Index,
    pub(super) edge_type: ResolverEdgeType,
}

impl Resolver {
    /// Traverse the resolver graph via a breadth-first search where each node is visited at most once.
    /// When a node is reached, the edge used to reach the node is recorded.
    ///
    /// Returns: a vector of the edges by which each node was reached.
    ///
    /// Each edge in the graph represents a (unique) reference from an origin node to a referent node.
    /// If there are multiple edges connected to a referent, only the first edge encountered is returned.
    /// If a node does not have a path of (unique) references from the root, it will not be visited.
    ///
    /// From each origin node, name edges are traversed before index edges.
    pub(super) fn breadth_first_traversal(&self) -> Vec<ResolverEdge> {
        // TODO: decide if this should be converted to an iterator

        let mut edges_encountered = Vec::new();

        let mut queue: VecDeque<(NodeOrRoot, SourceDoc)> = VecDeque::new();
        queue.push_back((NodeOrRoot::Root, None.into()));

        let mut visited = vec![false; self.node_resolver_data.len() - 1];

        let mut counter = 0;
        let max_count = self.node_resolver_data.len();

        while let Some((origin, origin_source)) = queue.pop_front() {
            counter += 1;
            if counter > max_count {
                panic!("Cycles detected in references")
            }

            let current_data = &self.node_resolver_data[origin.resolver_data_index()];

            // Note: this iteration over the `name_map` is done in a consistent order because we used a `FxHashMap`.
            for edge in current_data
                .name_map
                .iter()
                .filter_map(|(name_with_source, ref_)| match ref_ {
                    Ref::Unique(idx) => {
                        // TODO: the check to ignore names than begin with `'_'` is only due to
                        // adding `pluginAddCompatibilityNames` in `normalize-dast.ts` of the parser.
                        // This plugin creates automatically generated names of the from `_componentType1`,
                        // which we do not want to include in root names.
                        // When we remove `pluginAddCompatibilityNames`, we should remove the check for `'_'`.
                        if visited[*idx] || name_with_source.name.starts_with('_') {
                            None
                        } else if name_with_source.source_doc == origin_source {
                            visited[*idx] = true;
                            Some(ResolverEdge {
                                origin,
                                origin_source,
                                referent: *idx,
                                edge_type: ResolverEdgeType::Name(name_with_source.name.clone()),
                            })
                        } else {
                            // If `name_with_source` has a different origin, check to see if the node extended an external document,
                            // and if `name_with_source` matches the source that was extended
                            if let Some(source_sequence) = &current_data.source_sequence {
                                // Since we have a `source_sequence`, the node must have extended an external document
                                let mut sources = source_sequence.iter();

                                if sources.any(|source| *source == origin_source) {
                                    // If there is a subsequent source, determine if `name_with_source` matches the new source.
                                    if let Some(next_source) = sources.next()
                                        && name_with_source.source_doc == *next_source {
                                            visited[*idx] = true;
                                            return Some(ResolverEdge {
                                                origin,
                                                origin_source: *next_source,
                                                referent: *idx,
                                                edge_type: ResolverEdgeType::Name(
                                                    name_with_source.name.clone(),
                                                ),
                                            });
                                        }
                                }
                            }
                            None
                        }
                    }
                    Ref::Ambiguous(_) => None,
                })
            {
                queue.push_back((NodeOrRoot::Node(edge.referent), edge.origin_source));
                edges_encountered.push(edge)
            }

            // Index edges are traversed after all name edges
            for edge in current_data
                .index_resolutions
                .iter()
                .enumerate()
                .filter_map(|(index, index_resolution)| match index_resolution {
                    None => None,
                    Some(res_index) => {
                        if visited[*res_index] {
                            None
                        } else {
                            visited[*res_index] = true;
                            Some(ResolverEdge {
                                origin,
                                origin_source,
                                referent: *res_index,
                                edge_type: ResolverEdgeType::Index(index),
                            })
                        }
                    }
                })
            {
                queue.push_back((NodeOrRoot::Node(edge.referent), origin_source));
                edges_encountered.push(edge)
            }
        }

        edges_encountered
    }
}
