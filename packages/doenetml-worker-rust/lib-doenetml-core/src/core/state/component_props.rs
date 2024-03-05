use enum_dispatch::enum_dispatch;

use crate::{
    components::{prelude::ComponentIdx, ComponentEnum},
    new_core::props::Prop,
};

pub type PropIdx = usize;

/// Pointer to a component's prop
#[derive(Debug, Clone, Copy)]
pub struct PropPointer {
    /// The index of the component in `Core.components`
    pub component_idx: ComponentIdx,
    /// The local index of the prop relative to the component to which
    /// it belongs. This is _not_ the offset of the prop in `Core.props`.
    pub local_prop_idx: PropIdx,
}

/// Every component must implement `ComponentProps` to provide `Core`
/// with information about its props.
#[enum_dispatch]
pub trait ComponentProps {
    /// Generate a vector of the props of this component.
    /// This function should be called only once, when the component is created.
    fn generate_props(&self) -> Vec<Prop>;

    // TODO: do we need get_prop_index_from_name?
    // Right now, we use it in the parent DataQuery, but maybe we can find a way
    // to specify via index directly from a function created via macro
    fn get_local_prop_index_from_name(&self, name: &str) -> Option<PropIdx>;

    /// Get the prop index from this component of the prop with name
    /// that has a case-insensitive match to `name`.
    fn get_public_local_prop_index_from_name_case_insensitive(&self, name: &str)
        -> Option<PropIdx>;

    /// Return a vector of the indices of this component's props
    /// that have been marked `component_profile_prop`.
    fn get_component_profile_local_prop_indices(&self) -> Vec<PropIdx>;

    fn get_default_prop_local_index(&self) -> Option<PropIdx>;

    /// Get the vector of the indices of all this component's props
    /// that have been marked `for_renderer`.
    fn get_for_renderer_local_prop_indices(&self) -> Vec<PropIdx>;
}
