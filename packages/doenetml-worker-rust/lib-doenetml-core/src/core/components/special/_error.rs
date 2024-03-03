use crate::components::prelude::*;

#[derive(
    Debug,
    Default,
    ComponentNode,
    ComponentChildrenOld,
    ComponentProps,
    ComponentActions,
    ComponentAttributes,
)]
#[pass_through_children]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub props: _ErrorProps,
}

impl _Error {
    pub fn new() -> Self {
        Self::default()
    }
}

impl ComponentChildren for _Error {
    fn get_rendered_children(&self, _child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return no children
        Vec::new()
    }
}

#[derive(Debug, Default, ComponentProps)]
pub struct _ErrorProps {}
