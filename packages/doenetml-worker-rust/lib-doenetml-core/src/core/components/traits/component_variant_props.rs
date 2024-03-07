use enum_dispatch::enum_dispatch;

use crate::{
    components::{types::PropIdx, ComponentEnum, ComponentProfile},
    new_core::props::{PropUpdater, PropValueType},
};

/// A trait to be implemented on each component variant. `ComponentProps` is only
/// implemented on the master `struct Component`, which contains the `variant` as
/// a field.
#[enum_dispatch]
#[allow(unused)]
pub trait ComponentVariantProps {
    fn get_num_props(&self) -> usize {
        unimplemented!()
    }
    fn get_prop_is_for_render(&self, local_prop_idx: PropIdx) -> bool {
        unimplemented!()
    }
    fn get_prop_name(&self, local_prop_idx: PropIdx) -> &'static str {
        unimplemented!()
    }
    fn get_prop_names(&self) -> &'static [&'static str] {
        unimplemented!()
    }
    fn get_prop_profile(&self, local_prop_idx: PropIdx) -> Option<ComponentProfile> {
        unimplemented!()
    }
    fn get_prop_is_public(&self, local_prop_idx: PropIdx) -> bool {
        unimplemented!()
    }
    fn get_prop_updater(&self, local_prop_idx: PropIdx) -> Box<dyn PropUpdater> {
        unimplemented!()
    }
    fn get_prop_value_type(&self, local_prop_idx: PropIdx) -> PropValueType {
        unimplemented!()
    }
    fn get_default_prop_local_index(&self) -> Option<PropIdx> {
        unimplemented!()
    }
}
