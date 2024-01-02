use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::{ComponentNode, ComponentProfileStateVariables, RenderedComponentNode};

#[derive(Debug, Default, ComponentNode, RenderedComponentNode)]
pub struct Section {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub state_variables: Vec<StateVar>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariables>,
}
