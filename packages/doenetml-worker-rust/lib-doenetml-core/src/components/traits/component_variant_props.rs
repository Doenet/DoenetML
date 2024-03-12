use enum_dispatch::enum_dispatch;

use crate::{
    components::{types::PropIdx, ComponentEnum, PropProfile},
    core::props::{PropUpdater, PropValueType},
};

// TODO: remove the default implementations for these methods. It should be a compiler
// error to not implement them.

/// A trait to be implemented on each component variant. `ComponentProps` is only
/// implemented on the master `struct Component`, which contains the `variant` as
/// a field.
#[enum_dispatch]
#[allow(unused)]
pub trait ComponentVariantProps {
    /// Get an updater for a specific prop.
    fn get_prop_updater(&self, local_prop_idx: PropIdx) -> Box<dyn PropUpdater> {
        unimplemented!()
    }
    /// Get the number of props for this component.
    fn get_num_props(&self) -> usize {
        unimplemented!()
    }
    /// Get whether a specific prop is marked as `for_render`. I.e., it should
    /// _always_ be sent to the UI.
    fn get_prop_is_for_render(&self, local_prop_idx: PropIdx) -> bool {
        unimplemented!()
    }
    /// Get the name of a prop.
    fn get_prop_name(&self, local_prop_idx: PropIdx) -> &'static str {
        unimplemented!()
    }
    /// Get an array of all prop names (ordered by their local index)
    fn get_prop_names(&self) -> &'static [&'static str] {
        unimplemented!()
    }
    /// Get the `PropProfile` of the prop.
    fn get_prop_profile(&self, local_prop_idx: PropIdx) -> Option<PropProfile> {
        unimplemented!()
    }
    /// Get whether the prop is public.
    fn get_prop_is_public(&self, local_prop_idx: PropIdx) -> bool {
        unimplemented!()
    }
    /// Get the `PropValueType` of the prop.
    fn get_prop_value_type(&self, local_prop_idx: PropIdx) -> PropValueType {
        unimplemented!()
    }
    /// Get the index of the prop that has `default = true` set,
    /// if one exists.
    fn get_default_prop_local_index(&self) -> Option<PropIdx> {
        unimplemented!()
    }
}
