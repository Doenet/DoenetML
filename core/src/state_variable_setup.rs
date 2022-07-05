

use std::{collections::HashMap, cell::RefCell};

use crate::{ObjectTraitName};


pub type StateVar<T> = RefCell<T>;

pub type StateVarValuesMap = HashMap<&'static str, StateVarValue>;

pub type DependencyInstructionMap = HashMap<&'static str, DependencyInstruction>;

/// State variable functions core uses
pub struct StateVarDefinition<T> {
    pub state_vars_to_determine_dependencies: fn() -> Vec<&'static str>,
    pub return_dependency_instructions: fn(StateVarValuesMap) -> DependencyInstructionMap,
    pub determine_state_var_from_dependencies:fn(HashMap<StateVarAddress, StateVarValue>) -> StateVarUpdateInstruction<T>,

    // Note: this might not need to be pub later
    // pub access: fn(&Component) -> &std::cell::RefCell<T>,
}

pub fn default_state_vars_for_dependencies() -> Vec<&'static str> { vec![] }


impl<T> std::fmt::Debug for StateVarDefinition<T> {
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
    pub state_var: &'static str,

    // We will use outer product of entries
    pub depends_on_components_and_strings: Vec<ObjectName>,
    pub depends_on_state_vars: Vec<&'static str>,

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
    component: String, // should this be &str? It can't be 'static because it refers
    // to a component instance
    state_var: &'static str,
}

impl StateVarAddress {
    pub fn new(component: String, state_var: &'static str) -> StateVarAddress {
        StateVarAddress {
            component, state_var
        }
    }
}


#[derive(Clone, Debug)]
pub enum DependencyInstruction {
    Child(ChildDependencyInstruction),
    StateVarVariant(StateVarDependencyInstruction),
    Parent(ParentDependencyInstruction),
}

#[derive(Clone, Debug)]
pub struct ChildDependencyInstruction {
    pub desired_children: Vec<ObjectTraitName>,
    pub desired_state_vars: Vec<&'static str>,
}

#[derive(Default, Clone, Debug)]
pub struct StateVarDependencyInstruction {
    // Since component_name is the name of a component instance, we don't want to clone the name and therefore allow a dependency to refer to that instance even if it doesn't exist anymore

    pub component_name: Option<String>, //default: Option::None

    pub state_var: &'static str, //default: ""
}

#[derive(Clone, Debug)]
pub struct ParentDependencyInstruction {
    pub parent_trait: ObjectTraitName,
    pub state_var: &'static str,
}


pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    UseDefault,
    NoChange,
}

