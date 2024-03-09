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
pub struct Section {
    pub common: ComponentCommonData,

    pub props: SectionProps,
}

#[derive(Debug, Default, ComponentProps)]
pub struct SectionProps {}

impl ComponentChildren for Section {
    fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}
