use std::{collections::HashMap, cell::RefCell};

use crate::ObjectTraitName;


// extern crate web_sys;


// A macro to provide println! style syntax for console.log logging.
#[macro_export]
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}





pub type StateVarName = &'static str;
pub type InstructionName = &'static str;
pub type ComponentType = &'static str;


/// Why we need RefCells: the Rc does not allow mutability in the thing it wraps.
/// If it any point we might want to mutate a field, its value should be wrapped in a RefCell.
#[derive(Debug)]
pub struct StateVar<T> (pub RefCell<State<T>>);

impl<T> StateVar<T> {

    pub fn new() -> StateVar<T> {
        StateVar(RefCell::new(State::Stale))
    }
}

impl<T> StateVar<T> 
    where T: Clone {
    /// Note: don't implement variants of this function, such as `unwrap_or`
    /// because we really don't want to sidestep when a state var is stale
    pub fn unwrap(&self) -> T {
        if let State::Resolved(value) = &*self.0.borrow() {
            (*value).clone()
        } else {
            panic!("Tried to unwrap stale value");
        }
    }

    pub fn expect_resolved(&self, msg: &str) -> T {
        if let State::Resolved(value) = &*self.0.borrow() {
            (*value).clone()
        } else {
            panic!("{}", msg);
        }
    }
}




#[derive(Debug)]
pub enum State<T> {
    Stale,
    Resolved(T),
}


/// State variable functions core uses.
#[derive(Debug)]
pub struct StateVarDefinition<T> {

    /// Some state variable's dependencies change based on other variables.
    pub state_vars_to_determine_dependencies: fn() -> Vec<StateVarName>,

    /// Reutrn the instructions that core can use to make Dependency structs.
    pub return_dependency_instructions: fn(
        HashMap<StateVarName, StateVarValue>
    ) -> HashMap<InstructionName, DependencyInstruction>,
    
    /// Determine the value and return that to core as an update instruction.
    pub determine_state_var_from_dependencies: fn(
        HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
    ) -> StateVarUpdateInstruction<T>,

    pub for_renderer: bool,

    pub default_value: fn() -> T,
}

pub fn default_state_vars_for_dependencies() -> Vec<StateVarName> { vec![] }


#[derive(Debug)]
pub enum StateVarVariant {
    String(StateVarDefinition<String>),
    Bool(StateVarDefinition<bool>),
    Number(StateVarDefinition<f64>),
    Integer(StateVarDefinition<i64>),
}






#[derive(Debug, Clone)]
pub enum StateVarValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}





#[derive(Debug)]
pub enum StateVarAccess<'a> {
    String(&'a StateVar<String>),
    Number(&'a StateVar<f64>),
    Integer(&'a StateVar<i64>),
    Bool(&'a StateVar<bool>),
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

/// An object refers to a component or a primitive string
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
        StateVarAddress { component, state_var }
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





impl StateVar<String> {
    pub fn get_state(&self) -> State<StateVarValue> {
        if let State::Resolved(value) = &*self.0.borrow() {
            State::Resolved(StateVarValue::String(value.to_string()))
        } else {
            State::Stale
        }
    }
}

impl StateVar<bool> {
    pub fn get_state(&self) -> State<StateVarValue> {
        if let State::Resolved(value) = *self.0.borrow() {
            State::Resolved(StateVarValue::Boolean(value))
        } else {
            State::Stale
        }
    }
}

impl StateVar<i64> {
    pub fn get_state(&self) -> State<StateVarValue> {
        if let State::Resolved(value) = *self.0.borrow() {
            State::Resolved(StateVarValue::Integer(value))
        } else {
            State::Stale
        }
    }
}

impl StateVar<f64> {
    pub fn get_state(&self) -> State<StateVarValue> {
        if let State::Resolved(value) = *self.0.borrow() {
            State::Resolved(StateVarValue::Number(value))
        } else {
            State::Stale
        }
    }
}






// Hide

pub const HIDE_DEFAULT_DEFINITION: StateVarVariant = StateVarVariant::Bool(StateVarDefinition { 
    state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
    return_dependency_instructions: default_hide_return_dependency_instructions,
    determine_state_var_from_dependencies: default_hide_determine_state_var_from_dependencies,
    for_renderer: true,
    default_value: || false,
});


fn default_hide_return_dependency_instructions(_prerequisite_state_values: HashMap<StateVarName, StateVarValue>) -> HashMap<InstructionName, DependencyInstruction> {
    HashMap::new()
}

fn default_hide_determine_state_var_from_dependencies(
    _dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
) -> StateVarUpdateInstruction<bool> {

    StateVarUpdateInstruction::NoChange
}















// Boilerplate so we don't have to match over StateVarVariant elsewhere

impl StateVarVariant {

    pub fn state_vars_to_determine_dependencies(&self) -> Vec<StateVarName> {

        match self {
            StateVarVariant::String(def) => (def.state_vars_to_determine_dependencies)(),
            StateVarVariant::Bool(def) => (def.state_vars_to_determine_dependencies)(),
            StateVarVariant::Number(def) => (def.state_vars_to_determine_dependencies)(),
            StateVarVariant::Integer(def) => (def.state_vars_to_determine_dependencies)(),
        }
    }

    pub fn return_dependency_instructions(&self,
        prerequisite_state_values: HashMap<StateVarName, StateVarValue>)
         -> HashMap<InstructionName, DependencyInstruction> {

        match self {
            StateVarVariant::String(def) =>  (def.return_dependency_instructions)(prerequisite_state_values),
            StateVarVariant::Bool(def) =>    (def.return_dependency_instructions)(prerequisite_state_values),
            StateVarVariant::Number(def) =>  (def.return_dependency_instructions)(prerequisite_state_values),
            StateVarVariant::Integer(def) => (def.return_dependency_instructions)(prerequisite_state_values),
        }
    }
    
    pub fn determine_state_var_from_dependencies(&self,
        dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
    ) -> StateVarUpdateInstruction<StateVarValue> {

        match self {
            StateVarVariant::String(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseDefault => StateVarUpdateInstruction::UseDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::String(val)),
                }
            },
            StateVarVariant::Integer(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseDefault => StateVarUpdateInstruction::UseDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::Integer(val)),
                }
            },
            StateVarVariant::Number(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseDefault => StateVarUpdateInstruction::UseDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::Number(val)),
                }
            },
            StateVarVariant::Bool(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseDefault => StateVarUpdateInstruction::UseDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::Boolean(val)),
                }
            }                     
        }
    }



    pub fn for_renderer(&self) -> bool {
        match self {
            StateVarVariant::String(def) => def.for_renderer,
            StateVarVariant::Integer(def) => def.for_renderer,
            StateVarVariant::Number(def) => def.for_renderer,
            StateVarVariant::Bool(def) => def.for_renderer,
        }

    }

    pub fn default_value(&self) -> StateVarValue {
        match self {
            StateVarVariant::String(def) =>   StateVarValue::String(  (def.default_value)()),
            StateVarVariant::Integer(def) =>  StateVarValue::Integer( (def.default_value)()),
            StateVarVariant::Number(def) =>   StateVarValue::Number(  (def.default_value)()),
            StateVarVariant::Bool(def) =>     StateVarValue::Boolean( (def.default_value)()),
        }
    }

}
