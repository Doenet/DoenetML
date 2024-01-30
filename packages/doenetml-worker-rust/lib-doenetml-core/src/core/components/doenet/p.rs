use crate::components::prelude::*;

#[derive(
    Debug,
    Default,
    ComponentNode,
    RenderedChildren,
    ComponentState,
    ComponentActions,
    ComponentAttributes,
)]
#[pass_through_children]
pub struct P {
    pub common: ComponentCommonData,

    pub state: PState,
}

#[derive(Debug, Default, ComponentState)]
pub struct PState {}
