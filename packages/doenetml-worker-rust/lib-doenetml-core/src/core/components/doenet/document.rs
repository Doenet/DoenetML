use std::collections::HashMap;

use crate::components::preamble::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct Document {
    pub common: ComponentCommonData,
}

impl ComponentNodeStateVariables for Document {
    fn initialize_state_variables(&mut self) {}
}
