use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentStateVariables)]
pub struct P {
    pub common: ComponentCommonData,

    pub state: PStateVariables,
}

#[derive(Debug, Default, ComponentStateVariables)]
pub struct PStateVariables {}
