//! A version of `Core` based on `DirectedGraph`

use crate::dast::{
    DastRoot, FlatDastRoot,
    flat_dast::{
        FlatFragment, FlatNode, FlatPathPart, FlatRoot, Index, NormalizedRoot, UntaggedContent,
    },
    ref_expand::Expander,
    ref_resolve::{IndexResolution, RefResolution, ResolutionError, Resolver},
};

use crate::components::{
    ComponentProps,
    types::{ComponentIdx, PropPointer},
};
use crate::props::PropValue;

use super::{
    component_builder::ComponentBuilder, document_model::DocumentModel,
    document_renderer::DocumentRenderer,
};

/// Core stores all hydrated components, keeps track of caching data, and tracks dependencies.
/// It is also in charge of marking nodes as dirty when they need to be recalculated and calling
/// functions to recalculate in the appropriate order.
#[derive(Debug)]
pub struct Core {
    pub document_model: DocumentModel,
    pub document_renderer: DocumentRenderer,
    pub resolver: Option<Resolver>,
}

impl Default for Core {
    fn default() -> Self {
        Self::new()
    }
}

impl Core {
    pub fn new() -> Self {
        Core {
            document_model: DocumentModel::new_with_root_data_query(),
            document_renderer: DocumentRenderer::new(),
            resolver: None,
        }
    }

    /// Create a `NormalizedRoot` from `dast_root`, which involves creating a `FlatDast`
    /// and expanding all references to elements (or errors).
    /// Sets the `resolver` so that it can be reused if needed.
    /// Returns the `NormalizedRoot`
    pub fn normalized_root_from_dast_root(&mut self, dast_root: &DastRoot) -> NormalizedRoot {
        let mut flat_root = FlatRoot::from_dast(dast_root);
        let mut resolver = Expander::expand(&mut flat_root);
        flat_root.compactify(Some(&mut resolver));
        self.resolver = Some(resolver);
        flat_root.into_normalized_root()
    }

    pub fn add_nodes_to_resolver(
        &mut self,
        flat_fragment: &FlatFragment,
        index_resolution: IndexResolution,
    ) {
        self.resolver
            .as_mut()
            .expect("Cannot add nodes to resolver before it is created")
            .add_nodes(flat_fragment, index_resolution);
    }

    /// Replace the index resolutions of the parent of `index_resolution` with `components`,
    /// replacing the indices given by `index_resolution`.
    pub fn replace_index_resolutions_in_resolver(
        &mut self,
        components: &[UntaggedContent],
        index_resolution: IndexResolution,
    ) {
        self.resolver
            .as_mut()
            .expect("Cannot replace index resolutions in resolver before it is created")
            .replace_index_resolutions(components, index_resolution);
    }

    pub fn delete_nodes_from_resolver(&mut self, nodes: &[FlatNode]) {
        self.resolver
            .as_mut()
            .expect("Cannot delete noes from resolver before it is created")
            .delete_nodes(nodes);
    }

    pub fn calculate_root_names(&self) -> Vec<Option<String>> {
        self.resolver
            .as_ref()
            .expect("Cannot calculate root names from resolver before it is created")
            .calculate_root_names()
    }

    pub fn update_root_names(&mut self, report_all: bool) -> Vec<(Index, Option<String>)> {
        self.resolver
            .as_mut()
            .expect("Cannot update root names from resolver before it is created")
            .update_root_names(report_all)
    }

    pub fn resolve_path<T: AsRef<[FlatPathPart]>>(
        &self,
        path: T,
        origin: Index,
        skip_parent_search: bool,
    ) -> Result<RefResolution, ResolutionError> {
        self.resolver
            .as_ref()
            .expect("Cannot resolve path before resolver is created")
            .resolve(path, origin, skip_parent_search)
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    ///
    /// A [`Resolver`] is saved to `core. It can be used to look up a `ComponentIdx` by name (useful for testing).
    /// One can also add or delete nodes from it.
    pub fn init_from_dast_root(&mut self, dast_root: &DastRoot) {
        // If we are initializing, we need to make sure that pre-existing data doesn't mess things up.
        // The easiest way is to recreate ourself.
        // TODO: think about whether we can update existing structures.
        *self = Self::new();

        let normalized_flat_root = self.normalized_root_from_dast_root(dast_root);

        let component_builder = ComponentBuilder::from_normalized_root(&normalized_flat_root);
        self.document_model.init_from_builder(component_builder);
    }

    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        self.document_renderer
            .render_flat_dast(&self.document_model)
    }

    /// Get the type of the component at `component_idx`,
    /// or `None` if there is no such component.
    pub fn get_component_type(&self, component_idx: usize) -> Option<String> {
        if component_idx >= self.num_components() {
            return None;
        }
        Some(
            self.document_model
                .get_component_type(ComponentIdx::new(component_idx)),
        )
    }

    /// Get the value of the prop named `prop_name` (in camelCase) of the component
    /// at `component_idx`, resolving and calculating it if needed.
    ///
    /// The read is untracked, so it does not change what the next `to_flat_dast`
    /// reports as changed. Returns `None` if there is no such component or the component
    /// has no prop with that name.
    pub fn get_prop_value_by_name(
        &mut self,
        component_idx: usize,
        prop_name: &str,
    ) -> Option<PropValue> {
        if component_idx >= self.num_components() {
            return None;
        }
        let component_idx = ComponentIdx::new(component_idx);
        let local_prop_idx = self
            .document_model
            .get_component(component_idx)
            .get_local_prop_index_from_name(prop_name)?;
        let prop_node = self.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx,
        });
        Some(
            self.document_renderer
                .get_prop_for_render_untracked(prop_node, &self.document_model)
                .value,
        )
    }

    fn num_components(&self) -> usize {
        self.document_model.get_component_indices().count()
    }

    pub fn _run_test(&mut self, test_name: &str) {
        //   self.document_renderer.run_test(test_name, &self.document_model);
        test_browser::run_test(test_name);
    }

    pub fn _get_tests(&mut self) -> Vec<String> {
        //   self.document_renderer.get_tests(&self.document_model)
        test_browser::run_test("")
    }
}

///
/// Functions used for testing
///
#[cfg(any(feature = "testing", test, not(feature = "web")))]
pub mod testing_features {
    use super::*;
    use crate::{graph_node::GraphNode, props::cache::PropWithMeta};

    impl Core {
        pub fn get_prop_for_render_untracked(&mut self, prop_node: GraphNode) -> PropWithMeta {
            self.document_renderer
                .get_prop_for_render_untracked(prop_node, &self.document_model)
        }
    }
}

#[cfg(test)]
#[path = "./core.test.rs"]
mod test;

#[path = "./test_browser/mod.rs"]
mod test_browser;
