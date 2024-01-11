use std::collections::HashMap;

use super::{
    ComponentCommonData, ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};
use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::utils::KeyValueIgnoreCase;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

#[derive(Debug, Default, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode)]
pub struct _Error {
    pub common: ComponentCommonData,
    pub message: String,
}
