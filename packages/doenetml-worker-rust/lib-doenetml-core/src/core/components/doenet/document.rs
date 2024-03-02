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
pub struct Document {
    pub common: ComponentCommonData,
    pub state: DocumentState,
}

#[derive(Debug, Default, ComponentState)]
pub struct DocumentState {}

impl ComponentChildren for Document {
    fn get_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}
