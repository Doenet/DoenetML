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
pub struct Section {
    pub common: ComponentCommonData,

    pub state: SectionState,
}

#[derive(Debug, Default, ComponentState)]
pub struct SectionState {}
