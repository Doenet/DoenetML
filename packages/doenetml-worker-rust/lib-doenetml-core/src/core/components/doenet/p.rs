use std::collections::HashMap;

use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct P {
    pub common: ComponentCommonData,
}

impl ComponentNodeStateVariables for P {
    fn initialize_state_variables(&mut self) {}
}
