use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentState)]
pub struct P {
    pub common: ComponentCommonData,

    pub state: PState,
}

#[derive(Debug, Default, ComponentState)]
pub struct PState {}
