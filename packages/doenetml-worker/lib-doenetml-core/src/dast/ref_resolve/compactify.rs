use crate::dast::ref_resolve::NameMap;

use super::{NodeParent, NodeResolverData, Ref, Resolver};

impl Resolver {
    /// Compactify the resolver so that it corresponds to the new indices
    /// of the compactified dast.
    pub fn compactify(&mut self, node_is_referenced: &[bool], old_to_new_indices: &[usize]) {
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
                            Ref::Unique(idx) => {
                                (key.clone(), Ref::Unique(old_to_new_indices[*idx]))
                            }
                            Ref::Ambiguous(vec_idx) => (
                                key.clone(),
                                Ref::Ambiguous(
                                    vec_idx.iter().map(|idx| old_to_new_indices[*idx]).collect(),
                                ),
                            ),
                        })
                        .collect(),
                );

                let index_resolutions = node_data
                    .index_resolutions
                    .iter()
                    .map(|v| v.map(|idx| old_to_new_indices[idx]))
                    .collect();

                if idx_plus_1 == 0 {
                    NodeResolverData {
                        node_parent: NodeParent::None,
                        name_map,
                        index_resolutions,
                        source_sequence: node_data.source_sequence.clone(),
                    }
                } else {
                    NodeResolverData {
                        node_parent: match node_data.node_parent {
                            NodeParent::None | NodeParent::FlatRoot => node_data.node_parent,
                            NodeParent::Node(idx) => NodeParent::Node(old_to_new_indices[idx]),
                        },
                        name_map,
                        index_resolutions,
                        source_sequence: node_data.source_sequence.clone(),
                    }
                }
            })
            .collect();
        self.node_resolver_data = new_node_resolver_data;
    }
}
