use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentState)]
pub struct Document {
    pub common: ComponentCommonData,
    pub state: DocumentState,
}

#[derive(Debug, Default, ComponentState)]
pub struct DocumentState {}
