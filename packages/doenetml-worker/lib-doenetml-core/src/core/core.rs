//! A version of `Core` based on `DirectedGraph`

use crate::dast::{
    flat_dast::{FlatFragment, FlatRoot, NormalizedRoot},
    ref_expand::Expander,
    ref_resolve::Resolver,
    DastRoot, FlatDastRoot,
};

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
        }
    }

    /// Create a `FlatRoot` from `dast_root`, which involves creating a `FlatDast`
    /// and expanding most references to elements (or errors)
    /// unless the component type specifies to hold its children from resolving
    pub fn flat_root_from_dast_root(dast_root: &DastRoot) -> (FlatRoot, Resolver) {
        let mut flat_root = FlatRoot::from_dast(dast_root);
        let mut resolver = Expander::expand(&mut flat_root);
        flat_root.compactify(Some(&mut resolver));
        (flat_root, resolver)
    }

    /// Create a `NormalizedRoot` from `dast_root`, which involves creating a `FlatDast`
    /// and expanding all references to elements (or errors).
    pub fn normalized_root_from_dast_root(dast_root: &DastRoot) -> (NormalizedRoot, Resolver) {
        let mut flat_root = FlatRoot::from_dast(dast_root);
        let mut resolver = Expander::expand(&mut flat_root);
        flat_root.compactify(Some(&mut resolver));
        let normalized_flat_root = flat_root.into_normalized_root();
        (normalized_flat_root, resolver)
    }

    pub fn add_nodes_to_resolver(flat_fragment: &FlatFragment, resolver: &mut Resolver) {
        resolver.add_nodes(&flat_fragment);
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    ///
    /// A [`Resolver`] is returned. In most cases the resolver is not needed, but it can be used
    /// to look up a `ComponentIdx` by name (useful for testing).
    pub fn init_from_dast_root(&mut self, dast_root: &DastRoot) -> Resolver {
        let (normalized_flat_root, resolver) = Self::normalized_root_from_dast_root(dast_root);

        // If we are initializing, we need to make sure that pre-existing data doesn't mess things up.
        // The easiest way is to recreate ourself.
        // TODO: think about whether we can update existing structures.
        *self = Self::new();

        let component_builder = ComponentBuilder::from_normalized_root(&normalized_flat_root);
        self.document_model.init_from_builder(component_builder);
        resolver
    }

    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        self.document_renderer
            .render_flat_dast(&self.document_model)
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
