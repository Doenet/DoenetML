

use std::collections::HashMap;

use crate::{ComponentTraitName};


pub type StateVarValuesMap = HashMap<String, StateVarValue>;
pub type DependencyInstructionMap = HashMap<String, DependencyInstruction>;

pub struct StateVarDef<T> {
    pub state_vars_to_determine_dependencies: fn() -> Vec<String>,
    pub return_dependency_instructions: fn(StateVarValuesMap) -> DependencyInstructionMap,
    pub determine_state_var_from_dependencies:fn(StateVarValuesMap) -> StateVarUpdateInstruction<T>,

    //Note: this might not need to be pub later
    // pub access: fn(&Component) -> &std::cell::RefCell<T>,
}

pub fn default_state_vars_for_dependencies() -> Vec<String> { vec![] }


impl<T> std::fmt::Debug for StateVarDef<T> {
    fn fmt<'a>(&'a self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("StateVarDef")
            .field("state_vars_to_determine_dependencies", &self.state_vars_to_determine_dependencies)
            .field("return_dependency_instructions", &self.return_dependency_instructions)
            .field("determine_state_var_from_dependencies", &self.determine_state_var_from_dependencies)
            .field("access", &"Can't print access pointer")
            .finish()

    }
}

#[derive(Debug)]
pub enum StateVar {
    String(StateVarDef<String>),
    Bool(StateVarDef<bool>),
    Number(StateVarDef<f64>),
    Integer(StateVarDef<i64>),
}



pub enum StateVarValue {
    Text(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}


#[derive(Debug)]
pub struct Dependency {
    pub component: String,
    pub state_var: &'static str,

    // We will use outer product of entries
    pub depends_on_components: Vec<String>,
    pub depends_on_state_vars: Vec<String>,

    pub instruction: DependencyInstruction,
    pub variables_optional: bool,
}




#[derive(Clone, Debug)]
pub enum DependencyInstruction {
    Child(ChildDependencyInstruction),
    StateVar(StateVarDependencyInstruction),
    Parent(ParentDependencyInstruction),
}

#[derive(Clone, Debug)]
pub struct ChildDependencyInstruction {
    pub desired_children: Vec<ComponentTraitName>,
    pub desired_state_vars: Vec<String>,
}

#[derive(Default, Clone, Debug)]
pub struct StateVarDependencyInstruction {
    pub component_name: Option<String>, //default: Option::None
    pub state_var: String, //default: ""
}

#[derive(Clone, Debug)]
pub struct ParentDependencyInstruction {
    pub parent_trait: ComponentTraitName,
    pub state_var: String,
}


pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    UseDefault,
    NoChange,
}

