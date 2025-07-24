use enum_dispatch::enum_dispatch;

use crate::{
    components::{ComponentEnum, types::LocalPropIdx},
    core::props::{PropProfile, PropValueType},
    props::{ForRenderOutputs, PropUpdater, PropUpdaterUntyped, UpdaterObject},
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
    fn get_prop_updater_object(&self, local_prop_idx: LocalPropIdx) -> UpdaterObject {
        unimplemented!()
    }

    /// Get the `PropUpdater` (with type information).
    fn get_prop_updater<T: PropUpdater + PropUpdaterUntyped>(
        &self,
        local_prop_idx: LocalPropIdx,
    ) -> T {
        unimplemented!()
    }

    /// Get the number of props for this component.
    fn get_num_props(&self) -> usize {
        unimplemented!()
    }
    /// Get whether a specific prop is marked as `for_render` for one or more render outputs. I.e., it should
    /// be sent to the UI if the component is in a graph or in text.
    fn get_prop_for_render_outputs(&self, local_prop_idx: LocalPropIdx) -> ForRenderOutputs {
        unimplemented!()
    }
    /// Get the name of a prop.
    fn get_prop_name(&self, local_prop_idx: LocalPropIdx) -> &'static str {
        unimplemented!()
    }
    /// Get an array of all prop names (ordered by their local index)
    fn get_prop_names(&self) -> &'static [&'static str] {
        unimplemented!()
    }
    /// Get the `PropProfile` of the prop.
    fn get_prop_profile(&self, local_prop_idx: LocalPropIdx) -> Option<PropProfile> {
        unimplemented!()
    }
    /// Get whether the prop is public.
    fn get_prop_is_public(&self, local_prop_idx: LocalPropIdx) -> bool {
        unimplemented!()
    }
    /// Get the `PropValueType` of the prop.
    fn get_prop_value_type(&self, local_prop_idx: LocalPropIdx) -> PropValueType {
        unimplemented!()
    }
    /// Get the index of the prop that has `default = true` set,
    /// if one exists.
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        unimplemented!()
    }
}
