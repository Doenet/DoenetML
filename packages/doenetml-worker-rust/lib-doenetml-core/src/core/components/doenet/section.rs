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
pub struct Section {
    pub common: ComponentCommonData,

    pub state: SectionState,
}

#[derive(Debug, Default, ComponentState)]
pub struct SectionState {}

impl ComponentChildren for Section {
    fn get_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}
