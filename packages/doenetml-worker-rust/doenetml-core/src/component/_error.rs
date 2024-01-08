use std::collections::HashMap;

use super::{
    ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};
use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::utils::KeyValueIgnoreCase;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

#[derive(Debug, Default, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode)]
pub struct _Error {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub state_variables: Vec<StateVar>,

    pub rendered_state_variable_indices: Vec<usize>,

    pub public_state_variable_indices: Vec<usize>,

    pub state_variable_name_to_index: HashMap<String, usize>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariable>,

    pub message: String,
}
