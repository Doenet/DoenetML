use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentStateVariables)]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub state: _ErrorStateVariables,
}

#[derive(Debug, Default, ComponentStateVariables)]
pub struct _ErrorStateVariables {}
