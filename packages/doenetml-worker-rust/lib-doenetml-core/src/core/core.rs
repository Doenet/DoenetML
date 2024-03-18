//! A version of `Core` based on `DirectedGraph`

use crate::{
    components::prelude::ComponentIdx,
    dast::{flat_dast::FlatRoot, ref_expand::Expander, DastRoot, FlatDastRoot},
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

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    pub fn init_from_dast_root(&mut self, dast_root: &DastRoot) {
        let mut flat_root = FlatRoot::from_dast(dast_root);
        Expander::expand(&mut flat_root);
        flat_root.compactify();
        let normalized_flat_root = flat_root.into_normalized_root();

        let component_builder = ComponentBuilder::from_normalized_root(&normalized_flat_root);
        self.document_model.init_from_builder(component_builder);
    }

    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        self.document_renderer
            .render_flat_dast(&self.document_model)
    }
}

///
/// Functions used for testing
///
#[cfg(feature = "testing")]
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

#[derive(Debug)]
pub struct CoreProcessingState {
    /// List of the rendered components that have stale `for_renderer` props.
    pub stale_renderers: Vec<ComponentIdx>,
}

//#[cfg(test)]
//#[path = "core.test.rs"]
//mod test;
