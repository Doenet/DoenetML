//! A `_Ref` component is a placeholder component that does nothing but hold a reference to another component. It is used
//! to keep track of referents when they shouldn't be expanded in the tree. For example `<section name="foo"/><xref ref="$foo" />` would normally
//! be expanded to `<section name="foo"><xref ref="<section />"/>` where `<section />` was linked to `<section name="foo"/>`.
//! However, `<xref />` actually needs to know what component is being referenced. It doesn't want a clone of the component.
//! In these situations `$foo` is replaced with `<_ref />` where `<_ref />` holds a pointer to `<section name="foo"/>`, but is not
//! actually extending `<section name="foo"/>`.

use std::rc::Rc;

use crate::{
    components::prelude::*,
    general_prop::IndependentProp,
    props::{ForRenderOutputs, RenderContext, UpdaterObject},
    state::types::component_refs::ComponentRef,
};

/// A `_Ref` component is a placeholder component that does nothing but hold a reference to another component.
/// It can only be created by special processing and not from regular DoenetML source code.
#[derive(Debug, Default, Clone)]
pub struct _Ref {
    /// The index of the component that this _ref refers to
    pub referent_idx: ComponentIdx,
}

impl _Ref {
    /// Return the value of `self.referent_idx` in a form that
    /// can be used in a prop.
    pub fn get_referent_idx_as_prop_value(&self) -> prop_type::ComponentRef {
        Some(ComponentRef(self.referent_idx))
    }
}

impl ComponentActions for _Ref {}
impl ComponentOnAction for _Ref {}
impl ComponentAttributes for _Ref {}
impl ComponentProps for _Ref {
    fn generate_props(&self) -> Vec<PropDefinition> {
        vec![]
    }
    fn get_prop_profile_local_prop_indices(&self) -> impl Iterator<Item = LocalPropIdx> {
        vec![].into_iter()
    }
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        None
    }
    fn get_for_render_local_prop_indices(
        &self,
        _render_context: RenderContext,
    ) -> impl Iterator<Item = LocalPropIdx> {
        vec![].into_iter()
    }
    fn get_local_prop_index_from_name(&self, _name: &str) -> Option<LocalPropIdx> {
        None
    }
    fn get_public_local_prop_index_from_name_case_insensitive(
        &self,
        _name: &str,
    ) -> Option<LocalPropIdx> {
        None
    }
}

impl ComponentNode for _Ref {
    fn get_component_type(&self) -> &str {
        "_ref"
    }
}

impl ComponentVariantProps for _Ref {
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        None
    }
    fn get_num_props(&self) -> usize {
        1
    }
    fn get_prop_for_render_outputs(&self, _local_prop_idx: LocalPropIdx) -> ForRenderOutputs {
        ForRenderOutputs::default()
    }
    fn get_prop_name(&self, local_prop_idx: LocalPropIdx) -> &'static str {
        self.get_prop_names()[local_prop_idx.as_usize()]
    }
    fn get_prop_profile(&self, _local_prop_idx: LocalPropIdx) -> Option<PropProfile> {
        Some(PropProfile::_Ref)
    }
    fn get_prop_value_type(&self, _local_prop_idx: LocalPropIdx) -> PropValueType {
        PropValueType::ComponentRef
    }
    fn get_prop_is_public(&self, _local_prop_idx: LocalPropIdx) -> bool {
        false
    }
    fn get_prop_names(&self) -> &'static [&'static str] {
        &["referent"]
    }
    fn get_prop_updater_object(&self, local_prop_idx: LocalPropIdx) -> UpdaterObject {
        match local_prop_idx.as_usize() {
            0 => Rc::new(IndependentProp::new_frozen(
                self.get_referent_idx_as_prop_value(),
            )),
            _ => panic!("Invalid prop index {local_prop_idx:?}"),
        }
    }
}
