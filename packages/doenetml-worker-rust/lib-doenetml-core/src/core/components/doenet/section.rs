use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentState)]
pub struct Section {
    pub common: ComponentCommonData,

    pub state: SectionState,
}

#[derive(Debug, Default, ComponentState)]
pub struct SectionState {}
