use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::{ComponentChild, ComponentInd, ExtendSource};

use super::ComponentNode;

#[derive(Debug, Default, ComponentNode)]
pub struct Text {
    pub ind: ComponentInd,
    pub parent: Option<ComponentInd>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentInd>>,

    pub position: Option<DastPosition>,
}
