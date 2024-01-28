use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentState)]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub state: _ErrorState,
}

#[derive(Debug, Default, ComponentState)]
pub struct _ErrorState {}
