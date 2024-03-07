use enum_dispatch::enum_dispatch;

use crate::{
    components::{prelude::ComponentIdx, ComponentEnum, ComponentProfile},
    new_core::props::{Prop, PropUpdater},
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

/// A trait to be implemented on each component variant. `ComponentProps` is only
/// implemented on the master `struct Component`, which contains the `variant` as
/// a field.
pub trait ComponentVariantProps {
    fn get_num_props(&self) -> usize;
    fn get_prop_is_for_render(&self, local_prop_idx: PropIdx) -> bool;
    fn get_prop_name(&self, local_prop_idx: PropIdx) -> &'static str;
    fn get_prop_profile(&self, local_prop_idx: PropIdx) -> Option<ComponentProfile>;
    fn get_prop_is_public(&self, local_prop_idx: PropIdx) -> bool;
    fn get_prop_updater(&self, local_prop_idx: PropIdx) -> Box<dyn PropUpdater>;
    fn get_default_prop_local_index(&self) -> Option<PropIdx>;
}
