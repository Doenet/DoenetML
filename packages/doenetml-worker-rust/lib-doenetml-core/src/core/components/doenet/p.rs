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
pub struct P {
    pub common: ComponentCommonData,

    pub state: PState,
}

#[derive(Debug, Default, ComponentState)]
pub struct PState {}
