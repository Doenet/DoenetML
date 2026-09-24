//! For each node, calculate the simplest name by which the node can be referenced
//! with the root as the origin. Since the names are designed to be HTML ids,
//! use `:` (rather than `[]`) to join index resolutions to create the names.

use std::mem;

use rustc_hash::FxHashSet;

use super::node_traversal::*;
use super::*;
use crate::dast::flat_dast::{FlatFragment, Index, SourceDoc};

impl Resolver {
    /// Given the data from `resolver`, calculate the root name for each node,
    /// i.e., a name that represents one of the shortest paths through which the node can be referenced from the root.
    ///
    /// Each root name is a representation of a reference to the node from the root that is a valid HTML id.
    /// For this reason, they use a non-standard notation for indices,
    /// where `[3]` is replaced with `:3`. For example, a reference `$a.b[3][4].c`
    /// would be represented by the name `a.b:3:4.c`.
    ///
    /// The shortest paths are calculated via a deterministic breadth-first search of the resolver graph,
    /// where resolutions of names take priority over resolutions of indices.
    /// If there are multiple paths with the same type of edges, the path chosen for the name is arbitrary
    /// but fixed. (The names kept up to date by [`Resolver::update_root_names`] may settle such a tie
    /// differently than a fresh calculation does, as they are not recalculated when nodes are added.)
    ///
    /// Returns a vector indexed by the node index. The vector entries entries are:
    /// - `None`: if the node does not have a uniquely accessible name from the root
    /// - `Some(name)`: where `name` is represents one of the shortest resolution paths to the node
    ///
    /// For example, consider the DoenetML.
    /// ```xml
    /// <a name="y"><group name="g"><b /><c name="x" /></group></a>
    /// <d name="x" />
    /// ```
    /// The results for different nodes would be
    /// - `<a>`: `Some("y")`, as `<a>` is directly resolvable from the root as `$y`
    /// - `<b>`: `Some("g:1")`, as `$g[1]` is the only reference from root that resolves to `<b/>`
    /// - `<c>`: `Some("y.x")`, as `"y.x"` will be selected in preference to `g:2` (as sub-names are searched before indices)
    /// - `<d>`: `None`, as `<d>` does not have a unique reference from the root
    pub fn calculate_root_names(&self) -> Vec<Option<String>> {
        // Note: resolver's data has one more entry than number of nodes as it also contains the root
        let n_nodes = self.node_resolver_data.len() - 1;

        let mut root_names = vec![None; n_nodes];

        for edge in self.breadth_first_traversal() {
            root_names[edge.referent] = Some(extend_root_name(&root_names, &edge));
        }

        root_names
    }

    /// Bring the root names up to date with the resolver and return only those that changed since the previous call,
    /// as `(node index, new root name)` pairs, where `None` means the node no longer has a root name.
    /// The first call, or a call with `report_all` set, returns every node that has a root name,
    /// which is how a caller starting with an empty table gets a complete one.
    ///
    /// Applying the changes to the table built from the previous calls gives the root names
    /// of [`Resolver::calculate_root_names`], without sending the whole table across the WASM boundary
    /// after every change to the resolver.
    ///
    /// When the only changes since the previous call were nodes added by [`Resolver::add_nodes`]
    /// that cannot alter the root names of existing nodes, the root names of the new nodes are found
    /// by continuing the breadth-first search from the parents of the added fragments,
    /// rather than by searching the whole resolver graph again.
    pub fn update_root_names(&mut self, report_all: bool) -> Vec<(Index, Option<String>)> {
        let mut cache = mem::take(&mut self.root_name_cache);

        let extended = if cache.in_sync {
            self.extend_root_names(&mut cache)
        } else {
            None
        };
        #[cfg(test)]
        {
            cache.last_update_extended = extended.is_some();
        }
        let changes = match extended {
            Some(changes) => changes,
            None => self.recalculate_root_names(&mut cache),
        };

        cache.in_sync = true;
        cache.pending_fragments.clear();
        cache.pending_nodes.clear();

        let changes = if report_all {
            cache
                .names
                .iter()
                .enumerate()
                .filter_map(|(idx, name)| name.as_ref().map(|name| (idx, Some(name.clone()))))
                .collect()
        } else {
            changes
        };

        self.root_name_cache = cache;

        changes
    }

    /// Search the whole resolver graph for the root names, replace those in `cache`,
    /// and return the ones that changed.
    fn recalculate_root_names(&self, cache: &mut RootNameCache) -> Vec<(Index, Option<String>)> {
        let n_nodes = self.node_resolver_data.len() - 1;

        let mut new_cache = RootNameCache::with_len(n_nodes);
        new_cache.record_edges(self.breadth_first_traversal());

        let old_names = &cache.names;
        let mut changes: Vec<(Index, Option<String>)> = new_cache
            .names
            .iter()
            .enumerate()
            .filter(|(idx, name)| old_names.get(*idx).unwrap_or(&None) != *name)
            .map(|(idx, name)| (idx, name.clone()))
            .collect();

        // Nodes beyond the end of the new table no longer have root names
        changes.extend(
            old_names
                .iter()
                .enumerate()
                .skip(n_nodes)
                .filter(|(_, name)| name.is_some())
                .map(|(idx, _)| (idx, None)),
        );

        *cache = new_cache;

        changes
    }

    /// Find the root names of the nodes added since `cache` was last brought up to date,
    /// by continuing the breadth-first search from the parent of each added fragment.
    /// Return the root names found.
    ///
    /// Relies on each added fragment being reachable only through its parents,
    /// which [`RootNameCache::note_added_fragment`] checks.
    /// Returns `None`, leaving the root names in `cache` as they were, if a fragment can be reached through two parents,
    /// as its root names then depend on which parent the full search would reach first.
    fn extend_root_names(&self, cache: &mut RootNameCache) -> Option<Vec<(Index, Option<String>)>> {
        let n_nodes = self.node_resolver_data.len() - 1;
        cache.resize(n_nodes);

        let mut changes = Vec::new();

        for parents in mem::take(&mut cache.pending_fragments) {
            // A parent without a root name hides the fragment from the root.
            // If the parent is in a fragment added later, the search from that fragment's parent reaches it.
            let mut reached_parents = parents
                .into_iter()
                .flatten()
                .filter(|parent_idx| cache.has_root_name(*parent_idx));
            let Some(parent_idx) = reached_parents.next() else {
                continue;
            };
            if reached_parents.next().is_some() {
                // The nodes found so far had no root names before
                for (idx, _) in changes {
                    cache.names[idx] = None;
                }
                return None;
            }
            let parent_reached = cache.reached[parent_idx]
                .expect("A node with a root name was reached by the search");

            let edges = self.breadth_first_traversal_from(
                NodeOrRoot::Node(parent_idx),
                parent_reached.source,
                &mut cache.visited,
            );

            let referents: Vec<Index> = edges.iter().map(|edge| edge.referent).collect();
            cache.record_edges(edges);
            changes.extend(
                referents
                    .into_iter()
                    .map(|idx| (idx, cache.names[idx].clone())),
            );
        }

        Some(changes)
    }
}

/// The root name of `edge.referent`, given the root name of `edge.origin` in `root_names`.
fn extend_root_name(root_names: &[Option<String>], edge: &ResolverEdge) -> String {
    match edge.origin {
        NodeOrRoot::Root => match &edge.edge_type {
            ResolverEdgeType::Name(name) => name.clone(),
            ResolverEdgeType::Index(_) => {
                unreachable!("Root cannot have an index resolution")
            }
        },
        NodeOrRoot::Node(idx) => {
            let origin_name = root_names[idx]
                .as_ref()
                .expect("Incorrect breadth-first traversal of resolver data");

            match &edge.edge_type {
                ResolverEdgeType::Name(name) => format!("{origin_name}.{name}"),
                ResolverEdgeType::Index(index) => format!("{origin_name}:{}", index + 1),
            }
        }
    }
}

/// How the breadth-first search behind the root names reached a node.
#[derive(Debug, Clone, Copy)]
struct Reached {
    /// If the node was reached through an index resolution, the node that resolved it and the index.
    index_edge: Option<(Index, usize)>,
    /// The source with which the search continues from the node.
    source: SourceDoc,
}

/// The root names last reported by [`Resolver::update_root_names`],
/// with what is needed to extend them when nodes are added.
#[derive(Debug, Default)]
pub(super) struct RootNameCache {
    /// The root name of each node
    names: Vec<Option<String>>,
    /// How each node with a root name was reached
    reached: Vec<Option<Reached>>,
    /// Whether each node has a root name, i.e., was visited by the breadth-first search
    visited: Vec<bool>,
    /// Whether the cache reflects the resolver, apart from the fragments recorded in `pending_fragments`.
    /// If not, the next update recalculates every root name.
    in_sync: bool,
    /// For each fragment added since the last update, in the order they were added,
    /// the fragment's parent and the node given the fragment's children as index resolutions,
    /// i.e., the nodes through which the fragment can be reached
    pending_fragments: Vec<[Option<Index>; 2]>,
    /// The nodes of the fragments added since the last update
    pending_nodes: FxHashSet<Index>,
    /// Whether the last update extended the root names rather than recalculating them
    #[cfg(test)]
    last_update_extended: bool,
}

impl RootNameCache {
    fn with_len(n_nodes: usize) -> Self {
        let mut cache = RootNameCache::default();
        cache.resize(n_nodes);
        cache
    }

    fn resize(&mut self, n_nodes: usize) {
        self.names.resize(n_nodes, None);
        self.reached.resize(n_nodes, None);
        self.visited.resize(n_nodes, false);
    }

    /// Record the root names given by `edges` of a breadth-first search, in the order the search found them.
    fn record_edges(&mut self, edges: Vec<ResolverEdge>) {
        for edge in edges {
            self.names[edge.referent] = Some(extend_root_name(&self.names, &edge));
            self.visited[edge.referent] = true;
            self.reached[edge.referent] = Some(Reached {
                index_edge: match (&edge.origin, &edge.edge_type) {
                    (NodeOrRoot::Node(origin), ResolverEdgeType::Index(index)) => {
                        Some((*origin, *index))
                    }
                    _ => None,
                },
                source: edge.origin_source,
            });
        }
    }

    /// Mark the cache as out of date, so that the next update recalculates every root name.
    pub(super) fn invalidate(&mut self) {
        self.in_sync = false;
    }

    fn has_root_name(&self, idx: Index) -> bool {
        self.visited.get(idx).copied().unwrap_or(false)
    }

    /// Record that `flat_fragment` is about to be added to `node_resolver_data`,
    /// with its children becoming index resolutions as specified by `index_resolution`.
    ///
    /// Adding a fragment gives new edges to its parent, to the node given the index resolutions, and to its own nodes,
    /// all of them pointing into the fragment, and leaves the edges of every other node alone.
    /// As long as the fragment's nodes had no way to be reached before and no edges of their own,
    /// the root names of existing nodes stay the same, and the fragment's nodes can be reached only through its parents.
    /// Otherwise the cache is invalidated.
    pub(super) fn note_added_fragment(
        &mut self,
        flat_fragment: &FlatFragment,
        index_resolution: &IndexResolution,
        node_resolver_data: &[NodeResolverData],
    ) {
        if !self.in_sync {
            return;
        }

        // A new source sequence on the parent changes which of its existing names can be followed
        if flat_fragment.parent_source_sequence.is_some() {
            self.invalidate();
            return;
        }

        for node in flat_fragment.nodes.iter() {
            let idx = node.idx();
            // A node being re-added keeps the edges it already had, which could give existing nodes shorter paths
            let has_edges = node_resolver_data.get(idx + 1).is_some_and(|data| {
                !data.name_map.is_empty() || !data.index_resolutions.is_empty()
            });
            if has_edges || self.has_root_name(idx) || !self.pending_nodes.insert(idx) {
                self.invalidate();
                return;
            }
        }

        let index_parent = match index_resolution {
            IndexResolution::None => None,
            IndexResolution::ReplaceAll { parent }
            | IndexResolution::ReplaceRange { parent, .. } => {
                Some(*parent).filter(|parent| Some(*parent) != flat_fragment.parent_idx)
            }
        };
        self.pending_fragments
            .push([flat_fragment.parent_idx, index_parent]);
    }

    /// Record that the index resolutions of `parent` from `first_replaced` on
    /// (whose current values are `index_resolutions`) are about to be replaced or shifted.
    ///
    /// A node reached through one of these index resolutions would lose its root name or have it renumbered,
    /// so the cache is invalidated.
    pub(super) fn note_replaced_index_resolutions(
        &mut self,
        parent: Index,
        first_replaced: usize,
        index_resolutions: &[Option<Index>],
    ) {
        if !self.in_sync {
            return;
        }

        let reached_through_parent = index_resolutions
            .iter()
            .enumerate()
            .skip(first_replaced)
            .any(|(index, resolution)| {
                resolution.is_some_and(|referent| {
                    self.reached
                        .get(referent)
                        .copied()
                        .flatten()
                        .is_some_and(|reached| reached.index_edge == Some((parent, index)))
                })
            });

        if reached_through_parent {
            self.invalidate();
        }
    }
}

#[cfg(test)]
#[path = "root_names.test.rs"]
mod test;
