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
pub struct Document {
    pub common: ComponentCommonData,
    pub props: DocumentProps,
}

#[derive(Debug, Default, ComponentProps)]
pub struct DocumentProps {}

impl ComponentChildren for Document {
    fn get_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}
