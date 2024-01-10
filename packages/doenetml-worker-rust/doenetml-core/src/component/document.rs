use std::collections::HashMap;

use doenetml_derive::add_standard_component_fields;

use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::utils::KeyValueIgnoreCase;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::{
    ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};

#[add_standard_component_fields]
#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct Document {}

impl ComponentNodeStateVariables for Document {
    fn initialize_state_variables(&mut self) {}
}
