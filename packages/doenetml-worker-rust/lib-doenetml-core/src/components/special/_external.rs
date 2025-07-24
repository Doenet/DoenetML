//! An external component is a component not recognized by DoenetML. It is left untouched by the DoenetML processor and returned (mostly)
//! as-is when converted into `FlatDast`.

use crate::{
    components::prelude::*,
    general_prop::RenderedChildrenPassthroughProp,
    props::{ForRenderOutputs, RenderContext, UpdaterObject},
};

#[derive(Debug, Default, Clone)]
pub struct _External {
    pub name: String,
}

impl _External {
    pub const ATTRIBUTE_NAMES: &'static [&'static str] = &[];
    const PROPS: &'static [_ExternalProps] = &[_ExternalProps::RenderedChildren];
    pub const PROP_NAMES: &'static [&'static str] = &["renderedChildren"];
    const PROP_PROFILES: &'static [Option<PropProfile>] = &[Some(PropProfile::RenderedChildren)];
    const PROP_FOR_RENDERS: &'static [ForRenderOutputs] = &[ForRenderOutputs {
        in_graph: false,
        in_text: false,
    }];
    const PROP_IS_PUBLICS: &'static [bool] = &[false];
    const PROP_VALUE_TYPES: &'static [PropValueType] = &[PropValueType::ContentRefs];
    const DEFAULT_PROP: Option<LocalPropIdx> = None;
}

///The props for this component are: `renderedChildren`
#[derive(Debug, Clone, Copy)]
pub enum _ExternalProps {
    ///
    /// - Name: `"renderedChildren"`
    /// - Private: this prop can only be used internally.
    /// - NotForRender: this prop is not rendered.
    /// - Profile: [`PropProfile::RenderedChildren`]
    /// - Type: [`PropValueType::ContentRefs`]*/
    RenderedChildren,
}
impl _ExternalProps {
    /// Get the local index of the prop.
    pub const fn local_idx(&self) -> LocalPropIdx {
        match self {
            Self::RenderedChildren => LocalPropIdx::new(0_usize),
        }
    }
}

impl ComponentActions for _External {}
impl ComponentOnAction for _External {}
impl ComponentAttributes for _External {}
impl ComponentProps for _External {
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

impl PropGetUpdater for _ExternalProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            _ExternalProps::RenderedChildren => {
                as_updater_object::<_, prop_type::AnnotatedContentRefs>(
                    RenderedChildrenPassthroughProp::new(),
                )
            }
        }
    }
}

impl ComponentNode for _External {
    // The main reason we customize the implementation of ComponentNode
    // is to use this custom component type coming from name
    fn get_component_type(&self) -> &str {
        &self.name
    }
}

impl ComponentVariantProps for _External {
    fn get_prop_updater_object(&self, local_prop_idx: LocalPropIdx) -> crate::props::UpdaterObject {
        PropGetUpdater::get_updater(&_External::PROPS[local_prop_idx.as_usize()])
    }
    fn get_num_props(&self) -> usize {
        _External::PROP_NAMES.len()
    }
    fn get_prop_for_render_outputs(&self, local_prop_idx: LocalPropIdx) -> ForRenderOutputs {
        _External::PROP_FOR_RENDERS[local_prop_idx.as_usize()]
    }
    fn get_prop_name(&self, local_prop_idx: LocalPropIdx) -> &'static str {
        _External::PROP_NAMES[local_prop_idx.as_usize()]
    }
    fn get_prop_names(&self) -> &'static [&'static str] {
        _External::PROP_NAMES
    }
    fn get_prop_profile(&self, local_prop_idx: LocalPropIdx) -> Option<PropProfile> {
        _External::PROP_PROFILES[local_prop_idx.as_usize()]
    }
    fn get_prop_is_public(&self, local_prop_idx: LocalPropIdx) -> bool {
        _External::PROP_IS_PUBLICS[local_prop_idx.as_usize()]
    }
    fn get_prop_value_type(&self, local_prop_idx: LocalPropIdx) -> PropValueType {
        _External::PROP_VALUE_TYPES[local_prop_idx.as_usize()]
    }
    fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
        _External::DEFAULT_PROP
    }
}
