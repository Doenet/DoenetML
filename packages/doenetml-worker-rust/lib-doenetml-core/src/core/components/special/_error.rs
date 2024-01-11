use crate::components::preamble::*;

#[derive(Debug, Default, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode)]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
}
