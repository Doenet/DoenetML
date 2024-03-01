use crate::{
    components::{
        prelude::{ComponentState, DataQuery, FlatDastElementContent},
        ComponentNode,
    },
    graph::directed_graph::Taggable,
    state::{Freshness, PropPointer},
    ComponentIdx,
};

use super::graph_based_core::Core;

impl Core {
    pub fn freshen_renderer_state(&mut self) -> Vec<ComponentIdx> {
        let mut stale_renderers = Vec::new();

        // recursively get a list of all rendered descendants of the components in stale_renderers
        let mut stale_renderer_idx = 0;
        while stale_renderer_idx < stale_renderers.len() {
            let component_idx = stale_renderers[stale_renderer_idx];
            stale_renderer_idx += 1;

            stale_renderers.extend(
                self.component_rendered_children(&self.components[component_idx])
                    .into_iter()
                    .filter_map(|child| match child {
                        FlatDastElementContent::Text(_) => None,
                        FlatDastElementContent::Element(child_idx) => Some(child_idx),
                    }),
            );
        }

        // deduplicate the list of stale renderers,
        // sorting first since .dedup removes only consecutive duplicates.
        stale_renderers.sort_unstable();
        stale_renderers.dedup();

        for component_idx in stale_renderers.iter() {
            self.components[*component_idx].set_is_in_render_tree(true);

            let rendered_prop_indices =
                self.components[*component_idx].get_for_renderer_prop_indices();

            for prop_idx in rendered_prop_indices {
                let prop_ptr = PropPointer {
                    component_idx: *component_idx,
                    local_prop_idx: prop_idx,
                };
                self.freshen_prop(prop_ptr);
            }
        }

        let components_freshened = stale_renderers.clone();

        stale_renderers.clear();
        components_freshened
    }

    /// If the prop specified by original_prop_ptr is stale or unresolved,
    /// then freshen the variable, resolving its dependencies if necessary.
    ///
    /// If the prop was not fresh, then recurse to its dependencies to freshen them.
    pub fn freshen_prop(&mut self, original_prop_ptr: PropPointer) {
        // This function currently implements recursion through an iterative method,
        // using a stack on the heap.
        // This approach was chosen because the function recursion implementation would overflow
        // the small WASM stack once it recursed a few thousands of times.
        // An alternative approach would be to increase the size of the WASM stack.
        // This approach was chosen because it is relatively easy to produce documents
        // with thousands of levels in the dependency graph, and it wasn't clear what
        // size WASM stack would be appropriate.

        let original_freshness = self
            .freshness
            .get_tag(&self.prop_pointer_to_prop_node(original_prop_ptr))
            .unwrap();

        // If the current prop is fresh, there's nothing to do.
        // If it is unresolved, resolve it
        match original_freshness {
            Freshness::Fresh => return,
            Freshness::Unresolved => {
                self.resolve_prop(original_prop_ptr);
            }
            Freshness::Stale | Freshness::Resolved => (),
        };

        // TODO: unfinished
    }

    pub fn resolve_prop(&mut self, original_prop_ptr: PropPointer) {
        // Since resolving props won't recurse with repeated actions,
        // will go ahead and allocate the stack locally, for simplicity.
        let mut resolve_stack = Vec::new();
        resolve_stack.push(original_prop_ptr);

        while let Some(prop_ptr) = resolve_stack.pop() {
            let component_idx = prop_ptr.component_idx;
            let local_prop_idx = prop_ptr.local_prop_idx;

            let current_freshness = self
                .freshness
                .get_tag(&self.prop_pointer_to_prop_node(original_prop_ptr))
                .unwrap();

            if *current_freshness != Freshness::Unresolved {
                // nothing to do if the prop is already resolved
                continue;
            }

            let data_queries = self.components[component_idx]
                .get_prop_mut(local_prop_idx)
                .unwrap()
                .return_data_queries();

            // TODO: unfinished
        }
    }
}
