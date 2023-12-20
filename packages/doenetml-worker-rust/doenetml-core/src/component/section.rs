use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::ComponentNode;

#[derive(Debug, Default, ComponentNode)]
pub struct Section {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,
}
