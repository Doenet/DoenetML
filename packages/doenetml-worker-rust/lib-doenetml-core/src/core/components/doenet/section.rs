use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentStateVariables)]
pub struct Section {
    pub common: ComponentCommonData,

    pub state: SectionStateVariables,
}

#[derive(Debug, Default, ComponentStateVariables)]
pub struct SectionStateVariables {}
