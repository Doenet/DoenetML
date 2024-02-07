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
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
    pub state: _ErrorState,
}

impl _Error {
    pub fn new() -> Self {
        Self::default()
    }
}

#[derive(Debug, Default, ComponentState)]
pub struct _ErrorState {}
