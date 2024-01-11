use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode)]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
}
