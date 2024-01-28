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
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub state: _ErrorState,
}

#[derive(Debug, Default, ComponentState)]
pub struct _ErrorState {}
