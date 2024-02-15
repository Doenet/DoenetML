use enum_dispatch::enum_dispatch;

use crate::{
    components::{ComponentEnum, RenderedState},
    ComponentIdx,
};

use super::{PropEnumRef, PropEnumRefMut};

pub type PropIdx = usize;

/// Pointer to a component's state variable
#[derive(Debug, Clone, Copy)]
pub struct PropPointer {
    pub component_idx: ComponentIdx,
    pub prop_idx: PropIdx,
}

#[enum_dispatch]
pub trait ComponentState {
    /// Get the number of state variables for this component
    fn get_num_props(&self) -> PropIdx;

    /// Get the prop at the specified index
    fn get_prop(&self, prop_idx: PropIdx) -> Option<PropEnumRef>;

    /// Get a mutable view of the prop at the specified index
    fn get_prop_mut(&mut self, prop_idx: PropIdx) -> Option<PropEnumRefMut>;

    // TODO: do we need get_prop_index_from_name?
    // Right now, we use it in the parent DataQuery, but maybe we can find a way
    // to specify via index directly from a function created via macro
    fn get_prop_index_from_name(&self, name: &str) -> Option<PropIdx>;

    // TODO: do we need get_prop_index_from_name_case_insensitive?
    // It isn't used by anything right now.
    // fn get_prop_index_from_name_case_insensitive(
    //     &self,
    //     name: &str,
    // ) -> Option<PropIdx>;

    /// Get the state variable index from this component of the state variable with name
    /// that has a case-insensitive match to `name`.
    fn get_public_prop_index_from_name_case_insensitive(&self, name: &str) -> Option<PropIdx>;

    /// Return a vector of the indices of this component's state variables
    /// that have been marked `component_profile_prop`.
    fn get_component_profile_prop_indices(&self) -> Vec<PropIdx>;

    /// Get the vector of the indices of all this component's state variables
    /// that have been marked `for_renderer`.
    fn get_for_renderer_prop_indices(&self) -> Vec<PropIdx>;

    /// Return `true` the specified prop has been marked `for_renderer`.
    fn check_if_prop_is_for_renderer(&self, prop_idx: PropIdx) -> bool;

    /// Return object with the values of all the rendered state variables
    fn return_rendered_state(&mut self) -> Option<RenderedState>;

    /// Return object with the values of all the rendered state variables
    /// that have changed since the previous call of
    /// `return_rendered_state` or `return_rendered_state_update`.
    fn return_rendered_state_update(&mut self) -> Option<RenderedState>;
}
