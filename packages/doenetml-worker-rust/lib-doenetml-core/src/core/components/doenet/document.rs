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

impl<'a> ComponentChildren<'a> for Document {
    fn get_children(
        &self,
        child_query_object: ChildQueryObject<'a>,
    ) -> Box<dyn Iterator<Item = GraphNode> + 'a> {
        // Return children without modification
        Box::new(child_query_object.child_iter())
    }
}
