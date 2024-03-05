use crate::components::prelude::*;

#[derive(Debug, Default, ComponentProps, ComponentActions, ComponentAttributes)]
//#[pass_through_children]
pub struct _External {
    pub common: ComponentCommonData,

    pub name: String,
    pub props: _ExternalProps,
}

#[derive(Debug, Default, ComponentProps)]
pub struct _ExternalProps {}

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
