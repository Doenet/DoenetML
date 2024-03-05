use crate::components::prelude::*;

#[derive(Debug, Default, ComponentProps, ComponentActions, ComponentAttributes, ComponentNode)]
//#[pass_through_children]
pub struct Document {
    pub props: DocumentProps,
}

#[derive(Debug, Default, ComponentProps)]
pub struct DocumentProps {}

impl ComponentChildren for Document {
    fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}
