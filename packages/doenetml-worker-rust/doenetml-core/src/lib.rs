use dast::DastRoot;

pub mod dast;
pub mod utils;

use crate::utils::{log, log_debug, log_json};

#[derive(Debug, Clone)]
pub struct ComponentState {
    pub component_ind: ComponentInd,
    pub state_var_ind: StateVarInd,
}

pub type ComponentInd = usize;
pub type StateVarInd = usize;

#[derive(Debug)]
pub struct DoenetMLCore {
    // for the ancestor with the ComponentInd given by the vector index,
    // map a string to the component ind of its unique descendant with the name given by the string
    // pub unique_component_names_in_ancestor: Vec<HashMap<&str, ComponentInd>>,
    pub a_number: isize,
}

pub fn create_doenetml_core(
    dast_string: &str,
    doenetml: &str,
    flags_string: &str,
) -> Result<DoenetMLCore, String> {
    log!("create doenetml_core");

    let dast: DastRoot = serde_json::from_str(dast_string).expect("Error extracting dast");

    log!("dast: {:#?}", dast);
    log!("dast: {:#?}", serde_json::to_string(&dast).unwrap());

    Ok(DoenetMLCore { a_number: 1 })
}
