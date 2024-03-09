use crate::components::prelude::*;

#[derive(Debug, Default, ComponentAttributes)]
//#[pass_through_children]
pub struct _External {
    pub common: ComponentCommonData,

    pub name: String,
    pub props: _ExternalProps,
}

#[derive(Debug, Default, ComponentProps)]
pub struct _ExternalProps {}

impl ComponentActions for _External {}
impl ComponentOnAction for _External {}

impl ComponentNode for _External {
    // The main reason we customize the implementation of ComponentNode
    // is to use this custom component type coming from name
    fn get_component_type(&self) -> &str {
        &self.name
    }
}

impl ComponentChildren for _External {
    fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}

impl ComponentVariantProps for _External {
    fn get_default_prop_local_index(&self) -> Option<PropIdx> {
        None
    }
    fn get_num_props(&self) -> usize {
        0
    }
    fn get_prop_is_for_render(&self, _local_prop_idx: PropIdx) -> bool {
        panic!("No props on _External")
    }
    fn get_prop_name(&self, _local_prop_idx: PropIdx) -> &'static str {
        panic!("No props on _External")
    }
    fn get_prop_profile(&self, _local_prop_idx: PropIdx) -> Option<ComponentProfile> {
        None
    }
    fn get_prop_value_type(&self, _local_prop_idx: PropIdx) -> PropValueType {
        panic!("No props on _External")
    }
    fn get_prop_is_public(&self, _local_prop_idx: PropIdx) -> bool {
        panic!("No props on _External")
    }
    fn get_prop_names(&self) -> &'static [&'static str] {
        &[]
    }
    fn get_prop_updater(&self, _local_prop_idx: PropIdx) -> Box<dyn PropUpdater> {
        panic!("No props on _External")
    }
}
