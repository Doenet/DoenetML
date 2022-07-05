

use std::{collections::HashMap, cell::RefCell};

use crate::{ObjectTraitName};



// A macro to provide println! style syntax for console.log logging.
#[macro_export]
macro_rules! log {
    ( $( $t:tt )* ) => {
        
        extern crate web_sys;

        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}




pub type StateVar<T> = RefCell<T>;

pub type StateVarName = &'static str;
pub type InstructionName = &'static str;

/// State variable functions core uses
#[derive(Debug)]
pub struct StateVarDefinition<T> {
    pub state_vars_to_determine_dependencies: fn() -> Vec<StateVarName>,
    pub return_dependency_instructions: fn(HashMap<StateVarName, StateVarValue>) -> HashMap<InstructionName, DependencyInstruction>,
    
    pub determine_state_var_from_dependencies: fn(
        HashMap<InstructionName, Vec<StateVarValue>>
    ) -> StateVarUpdateInstruction<T>,

}

pub fn default_state_vars_for_dependencies() -> Vec<StateVarName> { vec![] }


#[derive(Debug)]
pub enum StateVarVariant {
    String(StateVarDefinition<String>),
    Bool(StateVarDefinition<bool>),
    Number(StateVarDefinition<f64>),
    Integer(StateVarDefinition<i64>),
}



#[derive(Debug)]
pub enum StateVarValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}


#[derive(Debug)]
pub struct Dependency {

    pub component: String,
    pub state_var: StateVarName,

    pub name: InstructionName,


    // We will use outer product of entries (except for the strings, which don't have state vars)
    pub depends_on_objects: Vec<ObjectName>,
    pub depends_on_state_vars: Vec<StateVarName>,

    // TODO: Do we really need this field? It would be easier if we didn't
    // pub instruction: DependencyInstruction,
    pub variables_optional: bool,
}

#[derive(Debug, PartialEq)]
pub enum ObjectName {
    Component(String),
    String(String),
}


#[derive(Eq, Hash, PartialEq)]
pub struct StateVarAddress {
    component: String,
    state_var: StateVarName,
}

impl StateVarAddress {
    pub fn new(component: String, state_var: StateVarName) -> StateVarAddress {
        StateVarAddress {
            component, state_var
        }
    }
}


#[derive(Clone, Debug)]
pub enum DependencyInstruction {
    Child(ChildDependencyInstruction),
    StateVar(StateVarDependencyInstruction),
    Parent(ParentDependencyInstruction),
}

#[derive(Clone, Debug)]
pub struct ChildDependencyInstruction {
    pub desired_children: Vec<ObjectTraitName>,
    pub desired_state_vars: Vec<StateVarName>,
}

#[derive(Default, Clone, Debug)]
pub struct StateVarDependencyInstruction {
    pub component_name: Option<String>, //default: Option::None

    pub state_var: StateVarName, //default: ""
}

#[derive(Clone, Debug)]
pub struct ParentDependencyInstruction {
    pub parent_trait: ObjectTraitName,
    pub state_var: StateVarName,
}


pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    UseDefault,
    NoChange,
}

