use std::collections::HashMap;

use crate::components::preamble::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct Section {
    pub common: ComponentCommonData,
}

impl ComponentNodeStateVariables for Section {
    fn initialize_state_variables(&mut self) {}
}
