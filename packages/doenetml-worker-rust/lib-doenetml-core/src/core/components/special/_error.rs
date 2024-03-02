use crate::components::prelude::*;

#[derive(
    Debug,
    Default,
    ComponentNode,
    ComponentChildrenOld,
    ComponentState,
    ComponentActions,
    ComponentAttributes,
)]
#[pass_through_children]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub state: _ErrorState,
}

impl _Error {
    pub fn new() -> Self {
        Self::default()
    }
}

impl ComponentChildren<'_> for _Error {
    fn get_children(
        &self,
        _child_query_object: ChildQueryObject,
    ) -> Box<dyn Iterator<Item = GraphNode>> {
        // Return no children
        Box::new(std::iter::empty())
    }
}

#[derive(Debug, Default, ComponentState)]
pub struct _ErrorState {}
