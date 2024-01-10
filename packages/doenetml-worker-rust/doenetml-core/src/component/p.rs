use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::utils::KeyValueIgnoreCase;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::{
    ComponentCommonData, ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};

#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct P {
    pub common: ComponentCommonData,
}

impl ComponentNodeStateVariables for P {
    fn initialize_state_variables(&mut self) {}
}
