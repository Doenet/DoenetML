use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentStateVariables)]
pub struct Document {
    pub common: ComponentCommonData,
    pub state: DocumentStateVariables,
}

#[derive(Debug, Default, ComponentStateVariables)]
pub struct DocumentStateVariables {}
