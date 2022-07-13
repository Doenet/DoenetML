use std::{collections::HashMap};

use crate::ObjectTraitName;


/// A macro to provide println! style syntax for console.log logging.
#[macro_export]
macro_rules! log {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}





pub type StateVarName = &'static str;
pub type InstructionName = &'static str;
pub type ComponentType = &'static str;







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

    pub default_value: T,

    pub has_essential: bool,
}







impl<T> Default for StateVarDefinition<T>
    where T: Default
{
    fn default() -> Self {
        StateVarDefinition {
            state_vars_to_determine_dependencies: || vec![],
            return_dependency_instructions: |_| HashMap::new(),
            determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(T::default()),
            for_renderer: false,
            default_value: T::default(),
            has_essential: false,
        }
    }
}



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


#[derive(Debug)]
pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    UseEssentialOrDefault,
    NoChange,
}










#[allow(non_snake_case)]
pub fn HIDDEN_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Bool(StateVarDefinition { 
        for_renderer: true,
        determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(false),
       ..Default::default()

    })
}


#[allow(non_snake_case)]
pub fn DISABLED_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Bool(StateVarDefinition {     
        for_renderer: true,
        determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(false),
        ..Default::default()
    })
}


#[allow(non_snake_case)]
pub fn FIXED_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Bool(StateVarDefinition {     
        for_renderer: true,
        determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(false),
        ..Default::default()
    })
}








// impl fmt::Debug for StateVar<String> {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         f.write_str(&format!("{:?}", &self.get_state()))
//     }
// }
// impl fmt::Debug for StateVar<bool> {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         f.write_str(&format!("{:?}", &self.get_state()))
//     }
// }
// impl fmt::Debug for StateVar<f64> {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         f.write_str(&format!("{:?}", &self.get_state()))
//     }
// }
// impl fmt::Debug for StateVar<i64> {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         f.write_str(&format!("{:?}", &self.get_state()))
//     }
// }







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
                    StateVarUpdateInstruction::UseEssentialOrDefault => StateVarUpdateInstruction::UseEssentialOrDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::String(val)),
                }
            },
            StateVarVariant::Integer(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseEssentialOrDefault => StateVarUpdateInstruction::UseEssentialOrDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::Integer(val)),
                }
            },
            StateVarVariant::Number(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseEssentialOrDefault => StateVarUpdateInstruction::UseEssentialOrDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::Number(val)),
                }
            },
            StateVarVariant::Bool(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    StateVarUpdateInstruction::NoChange => StateVarUpdateInstruction::NoChange,
                    StateVarUpdateInstruction::UseEssentialOrDefault => StateVarUpdateInstruction::UseEssentialOrDefault,

                    StateVarUpdateInstruction::SetValue(val) => StateVarUpdateInstruction::SetValue(StateVarValue::Boolean(val)),
                }
            }                     
        }
    }



    pub fn for_renderer(&self) -> bool {
        match self {
            StateVarVariant::String(def) =>     def.for_renderer,
            StateVarVariant::Integer(def) =>    def.for_renderer,
            StateVarVariant::Number(def) =>     def.for_renderer,
            StateVarVariant::Bool(def) =>       def.for_renderer,
        }

    }

    pub fn has_essential(&self) -> bool {
        match self {
            StateVarVariant::String(def) =>     def.has_essential,
            StateVarVariant::Integer(def) =>    def.has_essential,
            StateVarVariant::Number(def) =>     def.has_essential,
            StateVarVariant::Bool(def) =>       def.has_essential,
        }

    }


    pub fn default_value(&self) -> StateVarValue {
        match self {
            StateVarVariant::String(def) =>   StateVarValue::String( def.default_value.clone()),
            StateVarVariant::Integer(def) =>  StateVarValue::Integer(def.default_value),
            StateVarVariant::Number(def) =>   StateVarValue::Number( def.default_value),
            StateVarVariant::Bool(def) =>     StateVarValue::Boolean(def.default_value),
        }
    }


}
