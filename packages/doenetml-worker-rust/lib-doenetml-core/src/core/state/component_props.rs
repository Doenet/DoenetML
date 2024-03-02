use enum_dispatch::enum_dispatch;

use crate::{
    components::{ComponentEnum, RenderedProps},
    ComponentIdx,
};

use super::{PropEnumRef, PropEnumRefMut};

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

#[enum_dispatch]
pub trait ComponentProps {
    /// Get the number of props for this component
    fn get_num_props(&self) -> PropIdx;

    /// Get the prop at the specified index
    fn get_prop(&self, prop_idx: PropIdx) -> Option<PropEnumRef>;

    /// Get a mutable view of the prop at the specified index
    fn get_prop_mut(&mut self, prop_idx: PropIdx) -> Option<PropEnumRefMut>;

    // TODO: do we need get_prop_index_from_name?
    // Right now, we use it in the parent DataQuery, but maybe we can find a way
    // to specify via index directly from a function created via macro
    fn get_prop_index_from_name(&self, name: &str) -> Option<PropIdx>;

    /// Get the prop index from this component of the prop with name
    /// that has a case-insensitive match to `name`.
    fn get_public_prop_index_from_name_case_insensitive(&self, name: &str) -> Option<PropIdx>;

    /// Return a vector of the indices of this component's props
    /// that have been marked `component_profile_prop`.
    fn get_component_profile_prop_indices(&self) -> Vec<PropIdx>;

    fn get_default_prop(&self) -> Option<PropIdx>;

    /// Get the vector of the indices of all this component's props
    /// that have been marked `for_renderer`.
    fn get_for_renderer_prop_indices(&self) -> Vec<PropIdx>;

    /// Return `true` the specified prop has been marked `for_renderer`.
    fn check_if_prop_is_for_renderer(&self, prop_idx: PropIdx) -> bool;

    /// Return object with the values of all the rendered props
    fn get_rendered_props_old(&mut self) -> Option<RenderedProps>;

    /// Return object with the values of all the rendered props
    /// that have changed since the previous call of
    /// `get_rendered_props_old` or `get_rendered_props_old_update`.
    fn get_rendered_props_old_update(&mut self) -> Option<RenderedProps>;
}
