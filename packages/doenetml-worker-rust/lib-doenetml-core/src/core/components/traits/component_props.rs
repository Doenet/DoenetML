use crate::{components::types::PropIdx, new_core::props::Prop};

/// The main `Component` struct, which wraps all component variants, implements
/// `ComponentProps`. This is used by `Core` to initialize props.
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
