use crate::components::prelude::*;

#[derive(
    Debug,
    Default,
    ComponentNode,
    ComponentChildren,
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
