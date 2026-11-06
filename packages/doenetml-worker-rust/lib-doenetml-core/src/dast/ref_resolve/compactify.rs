use crate::dast::ref_resolve::NameMap;

use super::{NodeParent, NodeResolverData, Ref, Resolver};

impl Resolver {
    /// Compactify the resolver so that it corresponds to the new indices
    /// of the compactified dast.
    ///
    /// A name, or an index, now resolves to `name_targets` of the node it
    /// resolved to: its new index, or, for a node in the arguments of a
    /// function reference that names nothing, the index of that reference
    /// (`FlatRoot::compactify`).
    pub fn compactify(
        &mut self,
        node_is_referenced: &[bool],
        old_to_new_indices: &[usize],
        name_targets: &[usize],
    ) {
        // Note: the first entry, which corresponds to the flat_root, is always present
        let new_node_resolver_data: Vec<NodeResolverData> = self
            .node_resolver_data
            .iter()
            .enumerate()
            .filter(|(idx_plus_1, _node_data)| {
                *idx_plus_1 == 0 || node_is_referenced[idx_plus_1 - 1]
            })
            .map(|(idx_plus_1, node_data)| {
                let name_map = NameMap(
                    node_data
                        .name_map
                        .iter()
                        .map(|(key, ref_)| match ref_ {
                            Ref::Unique(idx) => (key.clone(), Ref::Unique(name_targets[*idx])),
                            Ref::Branches(idx) => (key.clone(), Ref::Branches(name_targets[*idx])),
                            Ref::Ambiguous(vec_idx) => (
                                key.clone(),
                                Ref::Ambiguous(
                                    vec_idx
                                        .iter()
                                        .map(|ref_| match ref_ {
                                            Ref::Branches(idx) => Ref::Branches(name_targets[*idx]),
                                            ref_ => Ref::Unique(
                                                name_targets[ref_.single_idx().unwrap()],
                                            ),
                                        })
                                        .collect(),
                                ),
                            ),
                        })
                        .collect(),
                );

                let index_resolutions = node_data
                    .index_resolutions
                    .iter()
                    .map(|v| v.map(|idx| name_targets[idx]))
                    .collect();

                if idx_plus_1 == 0 {
                    NodeResolverData {
                        node_parent: NodeParent::None,
                        name_map,
                        copied_names: node_data.copied_names.clone(),
                        index_resolutions,
                        index_kind: node_data.index_kind,
                        source_sequence: node_data.source_sequence.clone(),
                        branch_kind: node_data.branch_kind,
                        iteration_aliases: node_data.iteration_aliases,
                    }
                } else {
                    NodeResolverData {
                        node_parent: match node_data.node_parent {
                            NodeParent::None | NodeParent::FlatRoot => node_data.node_parent,
                            NodeParent::Node(idx) => NodeParent::Node(old_to_new_indices[idx]),
                        },
                        name_map,
                        copied_names: node_data.copied_names.clone(),
                        index_resolutions,
                        index_kind: node_data.index_kind,
                        source_sequence: node_data.source_sequence.clone(),
                        branch_kind: node_data.branch_kind,
                        iteration_aliases: node_data.iteration_aliases,
                    }
                }
            })
            .collect();
        self.node_resolver_data = new_node_resolver_data;
        // Cached root names are indexed by the old indices
        self.root_name_cache = Default::default();
    }
}
