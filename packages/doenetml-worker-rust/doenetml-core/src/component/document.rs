use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::{
    ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};

#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct Document {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub state_variables: Vec<StateVar>,

    pub rendered_state_variable_indices: Vec<usize>,

    pub state_variable_name_to_index: HashMap<String, usize>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariable>,
}

impl ComponentNodeStateVariables for Document {
    fn initialize_state_variables(&mut self) {}
}
