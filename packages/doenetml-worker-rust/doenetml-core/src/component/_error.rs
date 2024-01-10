use std::collections::HashMap;

use doenetml_derive::add_standard_component_fields;

use super::{
    ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};
use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::utils::KeyValueIgnoreCase;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

#[add_standard_component_fields]
#[derive(Debug, Default, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode)]
pub struct _Error {
    pub message: String,
}
