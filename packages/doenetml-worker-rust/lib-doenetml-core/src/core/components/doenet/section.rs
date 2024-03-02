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

impl<'a> ComponentChildren<'a> for Section {
    fn get_children(
        &self,
        child_query_object: ChildQueryObject<'a>,
    ) -> Box<dyn Iterator<Item = GraphNode> + 'a> {
        // Return children without modification
        Box::new(child_query_object.child_iter())
    }
}
