use crate::{
    components::prelude::{ComponentState, PropEnumRef, PropEnumRefMut},
    new_core::graph_based_core::Core,
    state::PropPointer,
};

use super::PropIdent;

impl Core {
    /// Get the prop corresponding to `prop_pointer`
    pub fn get_prop(&self, prop_pointer: PropPointer) -> Option<PropEnumRef> {
        self.components[prop_pointer.component_idx].get_prop(prop_pointer.local_prop_idx)
    }

    /// Get a mutable view of the prop corresponding to `prop_pointer`
    pub fn get_prop_mut(&mut self, prop_pointer: PropPointer) -> Option<PropEnumRefMut> {
        self.components[prop_pointer.component_idx].get_prop_mut(prop_pointer.local_prop_idx)
    }

    /// Get the identity of the prop corresponding to `prop_pointer`
    pub fn get_prop_identity(&self, prop_pointer: PropPointer) -> Option<PropIdent> {
        self.get_prop(prop_pointer).map(|prop| PropIdent {
            prop_pointer,
            profile: prop.get_matching_component_profile(),
        })
    }
}
