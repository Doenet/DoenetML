use std::collections::HashMap;
use std::fmt::Display;

use crate::component::AttributeName;
use crate::component::ComponentName;
use crate::component::ComponentProfile;
use crate::component::ComponentType;

use crate::utils::log;


/// The name (camelCase) of a state variable that could be
/// a basic or an array depending on the component.
pub type StateVarName = &'static str;

/// camelCase
pub type InstructionName = &'static str;



/// State variable functions core uses.
/// The generics force component code to be consistent with the type of a state variable.
#[derive(Debug)]
pub struct StateVarDefinition<T> {

    /// Some state variable's dependencies change based on other variables.
    // pub state_vars_to_determine_dependencies: fn() -> Vec<StateVarName>,

    /// Return the instructions that core can use to make Dependency structs.
    /// Note: arg currently unused
    pub return_dependency_instructions: fn(
        HashMap<StateVarName, StateVarValue>
    ) -> HashMap<InstructionName, DependencyInstruction>,
    
    /// Determine the value and return that to core as an update instruction.
    pub determine_state_var_from_dependencies: fn(
        HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<T>, String>,

    pub for_renderer: bool,

    /// Determines whether to use essential data
    pub initial_essential_value: T,

    /// The inverse of `return_dependency_instructions`: For a desired value, return dependency
    /// values for the dependencies that would make this state variable return that value.
    pub request_dependencies_to_update_value: fn(T, HashMap<InstructionName, Vec<DependencySource>>) -> HashMap<InstructionName, Vec<DependencyValue>>,
}

#[derive(Debug)]
pub struct StateVarArrayDefinition<T> {

    pub return_array_dependency_instructions: fn(
        HashMap<StateVarName, StateVarValue>
    ) -> HashMap<InstructionName, DependencyInstruction>,



    pub return_element_dependency_instructions: fn(
        usize,
        HashMap<StateVarName, StateVarValue>
    ) -> HashMap<InstructionName, DependencyInstruction>,

    pub determine_element_from_dependencies: fn(
        usize,
        HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<T>, String>,

    pub request_element_dependencies_to_update_value: fn(usize, T, HashMap<InstructionName, Vec<DependencySource>>) -> HashMap<InstructionName, Vec<DependencyValue>>,


    pub return_size_dependency_instructions: fn(
        HashMap<StateVarName, StateVarValue>
    ) -> HashMap<InstructionName, DependencyInstruction>,

    pub determine_size_from_dependencies: fn(
        HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<usize>, String>,

    pub request_size_dependencies_to_update_value: fn(T, HashMap<InstructionName, Vec<DependencySource>>) -> HashMap<InstructionName, Vec<DependencyValue>>,

    pub for_renderer: bool,

    pub initial_essential_element_value: T,

}



/// A single value
#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize)]
pub enum StateRef {
    Basic(StateVarName),
    ArrayElement(StateVarName, usize),
    SizeOf(StateVarName),
}

#[derive(Debug, Clone, Copy)]
pub enum StateIndex {
    Basic,
    Element(usize),
    SizeOf,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize)]
pub enum StateVarSlice {
    Single(StateRef),
    Array(StateVarName),
}

impl StateVarSlice {
    pub fn name(&self) -> StateVarName {
        match self {
            Self::Single(state_ref) => state_ref.name(),
            Self::Array(name) => name,
        }
    }
}

impl StateRef {
    pub fn name(&self) -> StateVarName {
        match self {
            Self::Basic(name) => name,
            Self::ArrayElement(name, _) => name,
            Self::SizeOf(name) => name,
        }
    }

    pub fn index(&self) -> StateIndex {
        match self {
            Self::Basic(_) => StateIndex::Basic,
            Self::ArrayElement(_, i) => StateIndex::Element(*i),
            Self::SizeOf(_) => StateIndex::SizeOf,
        }
    }
    pub fn from_name_and_index(name: StateVarName, index: StateIndex) -> StateRef {
        match index {
            StateIndex::Element(i) => StateRef::ArrayElement(name, i),
            StateIndex::SizeOf => StateRef::SizeOf(name),
            StateIndex::Basic => StateRef::Basic(name),
        }
    }
}







impl<T> Default for StateVarDefinition<T>
    where T: Default
{
    fn default() -> Self {
        StateVarDefinition {
            return_dependency_instructions: |_| HashMap::new(),
            determine_state_var_from_dependencies:
                |_| Ok(StateVarUpdateInstruction::SetValue(T::default())),
            for_renderer: false,
            initial_essential_value: T::default(),

            request_dependencies_to_update_value: |_, _| {
                log!("DEFAULT REQUEST_DEPENDENCIES_TO_UPDATE_VALUE DOES NOTHING");
                HashMap::new()
            },
        }
    }
}


impl<T> Default for StateVarArrayDefinition<T>
    where T: Default
{
    fn default() -> Self {
        StateVarArrayDefinition {
            return_array_dependency_instructions: |_| HashMap::new(),

            return_element_dependency_instructions: |_, _| HashMap::new(),
            determine_element_from_dependencies: |_, _| Ok(StateVarUpdateInstruction::SetValue(T::default())),
            request_element_dependencies_to_update_value: |_, _, _| {
                log!("DEFAULT REQUEST_ELEMENT_DEPENDENCIES_TO_UPDATE_VALUE DOES NOTHING");
                HashMap::new()
            },

            return_size_dependency_instructions: |_| HashMap::new(),
            determine_size_from_dependencies: |_| Ok(StateVarUpdateInstruction::SetValue(0)),
            request_size_dependencies_to_update_value: |_, _| {
                log!("DEFAULT REQUEST_SIZE_DEPENDENCIES_TO_UPDATE_VALUE DOES NOTHING");
                HashMap::new()
            },
            for_renderer: false, 
            initial_essential_element_value: T::default(),

        }
    }

}






/// Since `StateVarDefinition` is generic, this enum is needed to store one in a HashMap.
#[derive(Debug)]
pub enum StateVarVariant {
    String(StateVarDefinition<String>),
    Boolean(StateVarDefinition<bool>),
    Number(StateVarDefinition<f64>),
    Integer(StateVarDefinition<i64>),
    NumberArray(StateVarArrayDefinition<f64>),
    // Single(StateVarVariantSingle),
    // Array(StateVarVariantArray),
}

#[derive(Debug)]
pub enum StateVarVariantSingle {
    String(StateVarDefinition<String>),
    Boolean(StateVarDefinition<bool>),
    Number(StateVarDefinition<f64>),
    Integer(StateVarDefinition<i64>),
}


#[derive(Debug)]
pub enum StateVarVariantArray {
    NumberArray(StateVarArrayDefinition<f64>),
}


/// This can contain the value of a state variable of any type,
/// which is useful for function parameters.
#[derive(Debug, Clone, PartialEq, serde::Serialize)]
pub enum StateVarValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}




/// A DependencyInstruction is used to make a Dependency when core is created,
/// which holds the specific information.
#[derive(Clone, Debug)]
pub enum DependencyInstruction {
    Child {
        /// The dependency will only match child components that fulfill at least one of these profiles
        desired_profiles: Vec<ComponentProfile>,
    },
    StateVar {
        component_name: Option<ComponentName>,
        state_var: StateVarSlice,
    },
    Parent {
        state_var: StateVarName,
    },
    Attribute {
        attribute_name: AttributeName,
        index: StateIndex,
    },
    Essential,
}


#[derive(Debug)]
pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    NoChange,
}




#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DependencySource {
    StateVar {
        component_type: ComponentType,
        state_var_name: StateVarName,
    },
    Essential {
        value_type: &'static str,
    },
}

/// Passed into determine_state_vars_from_dependencies
/// TODO: This struct doesn't quite fit the result of an EssentialDependencyInstruction.
#[derive(Debug, Clone)]
pub struct DependencyValue {
    pub source: DependencySource,
    pub value: StateVarValue,
}






/////////// DependencyValue boilerplate ///////////
// Note that these functions aren't cost free. They do allocate vectors, which you wouldn't have to do if 
// you were unwrapping manually

pub trait DepValueHashMap {
    fn dep_value(&self, instruction_name: InstructionName) -> Result<(Vec<&DependencyValue>, InstructionName), String>;
}

impl DepValueHashMap for HashMap<InstructionName, Vec<DependencyValue>> {

    fn dep_value(&self, instruction_name: InstructionName) -> Result<(Vec<&DependencyValue>, InstructionName), String> {
        if let Some(values) = self.get(instruction_name) {

            let values_vec = values.iter().collect();
            Ok((values_vec, instruction_name))
        } else {
            Err(format!("Instruction [{}] does not exist", instruction_name))
        }
    }
}


pub trait DepValueVec {
    fn has_zero_or_one_elements(&self) -> Result<(Option<&DependencyValue>, InstructionName), String>;
    fn has_exactly_one_element(&self) -> Result<(&DependencyValue, InstructionName), String>;

    fn are_strings_if_non_empty(&self) -> Result<Vec<String>, String>;

    fn into_number_list(&self) -> Result<Vec<f64>, String>;

    fn filter_include_component_type(&self, component_type: ComponentType) -> (Vec<&DependencyValue>, InstructionName);
}

impl DepValueVec for (Vec<&DependencyValue>, InstructionName) {

   fn has_zero_or_one_elements(&self) -> Result<(Option<&DependencyValue>, InstructionName), String> {
        let (dep_values, name) = self;
        match dep_values.len() {
            0 => Ok((None, name)),
            1 => Ok((Some(&dep_values[0]), name)),
            _ => Err(format!("Expected instruction [{}] to have zero or one elements", name))
        }
    }

    fn has_exactly_one_element(&self) -> Result<(&DependencyValue, InstructionName), String> {
        let (dep_values, name) = self;

        if dep_values.len() == 1 {
            Ok((&dep_values[0], name))
        } else {
            Err(format!("Expected instruction [{}] to have exactly one element", name))
        }
    }

    fn are_strings_if_non_empty(&self) -> Result<Vec<String>, String> {
        let (dep_values, name) = self;

        dep_values.iter().map(|dep_value|
            dep_value.value.clone().try_into().map_err(|_|
                format!("Not all elements in instruction [{}] were strings", name)
            )
        ).collect()
    }


    fn into_number_list(&self) -> Result<Vec<f64>, String> {
        let (dep_values, name) = self;

        dep_values.iter().map(|dep_value|
            dep_value.value.clone().try_into().map_err(|_|
                format!("Not all elements in instruction [{}] were strings", name)
            )
        ).collect()
    }



    fn filter_include_component_type(&self, component_type: ComponentType) -> (Vec<&DependencyValue>, InstructionName) {
        let (dep_values, name) = self;

        let filtered_dep_values = dep_values.iter()
            .filter(|dep_value| match dep_value.source {
                DependencySource::StateVar { component_type: comp, ..} => comp == component_type,
                _ => false,
            })
            .map(|&dep_value| dep_value)
            .collect();

        (filtered_dep_values, name)
    }
}


pub trait DepValueSingle {
    fn into_bool(&self) -> Result<bool, String>;
    fn into_string(&self) -> Result<String, String>;
    fn into_number(&self) -> Result<f64, String>;
    fn into_integer(&self) -> Result<i64, String>;
    fn value(&self) -> StateVarValue;
}

impl DepValueSingle for (&DependencyValue, InstructionName) {
    fn into_bool(&self) -> Result<bool, String> {
        self.0.value.clone().try_into().map_err(|_|
            format!("Instruction [{}] is a {}, expected a bool", self.1, self.0.value.type_as_str()))
    }

    fn into_string(&self) -> Result<String, String> {
        self.0.value.clone().try_into().map_err(|_|
            format!("Instruction [{}] is a {}, expected a string", self.1, self.0.value.type_as_str()))
    }

    fn into_number(&self) -> Result<f64, String> {
        self.0.value.clone().try_into().map_err(|_|
            format!("Instruction [{}] is a {}, expected a number", self.1, self.0.value.type_as_str()))
    }

    fn into_integer(&self) -> Result<i64, String> {
        self.0.value.clone().try_into().map_err(|_|
            format!("Instruction [{}] is a {}, expected an integer", self.1, self.0.value.type_as_str()))
    }

    fn value(&self) -> StateVarValue {
        self.0.value.clone()
    }
}



pub trait DepValueOption {
    fn is_bool_if_exists(&self) -> Result<Option<bool>, String>;
    fn into_if_exists<T: TryFrom<StateVarValue>>(&self) -> Result<Option<T>, String>;
    fn value(&self) -> Option<StateVarValue>;
}

impl DepValueOption for (Option<&DependencyValue>, InstructionName) {

    fn is_bool_if_exists(&self) -> Result<Option<bool>, String> {
        self.into_if_exists().map_err(|e| e + ", expected a bool")
    }

    fn into_if_exists<T: TryFrom<StateVarValue>>(&self) -> Result<Option<T>, String> {
        let (dep_value_opt, name) = self;

        dep_value_opt.and_then(|dep_value| Some(dep_value.value.clone().try_into().map_err(|_|
                format!("could not convert value {} from instruction [{}]",
                    dep_value.value.type_as_str(), name)
            )))
            .map_or(Ok(None), |v| v.map(Some)) // flip nested Option<Result<T>>
    }

    fn value(&self) -> Option<StateVarValue> {
        match self.0 {
            Some(dep_value) => Some(dep_value.value.clone()),
            None => None,
        }
    }
}


/////////// StateVarValue boilerplate ///////////

impl TryFrom<StateVarValue> for String {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::String(x) => Ok( x.to_string() ),
            StateVarValue::Number(_) => Err("cannot convert StateVarValue::Number to string"),
            StateVarValue::Integer(_) => Err("cannot convert StateVarValue::Integer to string"),
            StateVarValue::Boolean(_) => Err("cannot convert StateVarValue::Boolean to string"),
        }
    }
}
impl TryFrom<StateVarValue> for bool {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Boolean(x) => Ok( x ),
            StateVarValue::Number(_) => Err("cannot convert StateVarValue::Number to boolean"),
            StateVarValue::Integer(_) => Err("cannot convert StateVarValue::Integer to boolean"),
            StateVarValue::String(_) => Err("cannot convert StateVarValue::String to boolean"),
        }
    }
}
impl TryFrom<StateVarValue> for f64 {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Number(x) => Ok( x ),
            StateVarValue::Integer(x) => Ok( x as f64 ),
            StateVarValue::String(_) => Err("cannot convert StateVarValue::String to number"),
            StateVarValue::Boolean(_) => Err("cannot convert StateVarValue::Boolean to number"),
        }
    }
}
impl TryFrom<StateVarValue> for i64 {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Integer(x) => Ok( x ),
            StateVarValue::Number(_) => Err("cannot convert StateVarValue::Number to integer"),
            StateVarValue::String(_) => Err("cannot convert StateVarValue::String to integer"),
            StateVarValue::Boolean(_) => Err("cannot convert StateVarValue::Boolean to integer"),
        }
    }
}

impl From<StateVarValue> for serde_json::Value {
    fn from(v: StateVarValue) -> serde_json::Value {
        match v {
            StateVarValue::Integer(v) => serde_json::json!(v),
            StateVarValue::Number(v) =>  serde_json::json!(v),
            StateVarValue::String(v) =>  serde_json::json!(v),
            StateVarValue::Boolean(v) => serde_json::json!(v),
        }
    }
}
impl TryFrom<StateVarValue> for usize {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Integer(x) => match x >= 0 {
                true => Ok(x as usize),
                false => Err("cannot convert negative int to usize"),
            },
            StateVarValue::Number(_) => Err("cannot convert StateVarValue::Number to usize"),
            StateVarValue::String(_) => Err("cannot convert StateVarValue::String to usize"),
            StateVarValue::Boolean(_) => Err("cannot convert StateVarValue::Boolean to usize"),
        }
    }
}

impl From<String> for StateVarValue {
    fn from(v: String) -> StateVarValue {
        StateVarValue::String(v)
    }
}
impl From<bool> for StateVarValue {
    fn from(v: bool) -> StateVarValue {
        StateVarValue::Boolean(v)
    }
}
impl From<f64> for StateVarValue {
    fn from(v: f64) -> StateVarValue {
        StateVarValue::Number(v)
    }
}
impl From<i64> for StateVarValue {
    fn from(v: i64) -> StateVarValue {
        StateVarValue::Integer(v)
    }

}


impl StateVarValue {
    pub fn type_as_str(&self) -> &'static str {
        match self {
            Self::String(_) => "string",
            Self::Boolean(_) => "boolean",
            Self::Integer(_) => "integer",
            Self::Number(_) => "number",
        }
    }

    pub fn into_number(self) -> Result<StateVarValue, String> {
        match self {
            StateVarValue::Integer(i) => Ok(StateVarValue::Number(i as f64)),
            StateVarValue::Number(n) => Ok(StateVarValue::Number(n)),
            _ => Err("cannot convert value into number".to_string()),
        }
    }
}

impl std::fmt::Display for StateVarValue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}








// Boilerplate matching over StateVarVariant

impl StateVarVariant {

    // pub fn state_vars_to_determine_dependencies(&self) -> Vec<StateVarName> {

    //     match self {
    //         StateVarVariant::String(def) => (def.state_vars_to_determine_dependencies)(),
    //         StateVarVariant::Boolean(def) => (def.state_vars_to_determine_dependencies)(),
    //         StateVarVariant::Number(def) => (def.state_vars_to_determine_dependencies)(),
    //         StateVarVariant::Integer(def) => (def.state_vars_to_determine_dependencies)(),
    //     }
    // }


    // Non-array specific functions


    pub fn return_dependency_instructions(&self,
        prerequisite_state_values: HashMap<StateVarName, StateVarValue>)
         -> HashMap<InstructionName, DependencyInstruction> {

        match self {
            Self::String(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
            Self::Boolean(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
            Self::Number(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
            Self::Integer(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),

            _ => unreachable!(),
        }
    }


    
    
    pub fn determine_state_var_from_dependencies(&self,
        dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<StateVarValue>, String> {

        use StateVarUpdateInstruction::*;

        match self {
            Self::String(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {                    
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::String(val)),
                })
            },
            Self::Integer(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Integer(val)),
                })
            },
            Self::Number(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Number(val)),
                })
            },
            Self::Boolean(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Boolean(val)),
                })
            },

            _ => unreachable!(),
        }
    }

    pub fn request_dependencies_to_update_value(
        &self,
        state_ref: &StateRef,
        desired_value: StateVarValue,
        dependency_sources: HashMap<InstructionName, Vec<DependencySource>>
    ) -> HashMap<InstructionName, Vec<DependencyValue>> {

        match self {
            Self::String(def) =>  {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested String be updated to {:#?}", desired_value)
                    ),
                    dependency_sources,
                )
            },
            Self::Integer(def) => {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested Integer be updated to {:#?}", desired_value)
                    ),
                    dependency_sources,
                )
            },
            Self::Number(def) =>  {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested Number be updated to {:#?}", desired_value)
                    ),
                    dependency_sources,
                )
            },
            Self::Boolean(def) => {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested Boolean be updated to {:#?}", desired_value)
                    ),
                    dependency_sources,
                )
            },

            Self::NumberArray(def) => {
                match state_ref {
                    StateRef::ArrayElement(_, i) => {
                        (def.request_element_dependencies_to_update_value)(
                            *i,
                            desired_value.clone().try_into().expect( // only cloned for error msg
                                &format!("Requested NumberArray element be updated to {:#?}", desired_value)
                            ),
                            dependency_sources,
                        )
                    },
                    StateRef::SizeOf(_) => {
                        (def.request_size_dependencies_to_update_value)(
                            desired_value.clone().try_into().expect( // only cloned for error msg
                                &format!("Requested NumberArray size be updated to {:#?}", desired_value)
                            ),
                            dependency_sources,
                        )
                    }
                    StateRef::Basic(_) => panic!("reference does not match definition"),
                }
            },

        }       
    }



    // Array specific functions

    pub fn return_array_dependency_instructions(&self,
        prereq_state_values: HashMap<StateVarName, StateVarValue>)
         -> HashMap<InstructionName, DependencyInstruction> {

        match self {
            Self::NumberArray(def) => (def.return_array_dependency_instructions)(prereq_state_values),
            _ => unreachable!(),
        }
    }

    pub fn return_element_dependency_instructions(&self,
        index: usize,
        prereq_state_values: HashMap<StateVarName, StateVarValue>)
         -> HashMap<InstructionName, DependencyInstruction> {

        match self {
            Self::NumberArray(def) => (def.return_element_dependency_instructions)(index, prereq_state_values),
            _ => unreachable!(),
        }
    }

    pub fn return_size_dependency_instructions(&self,
        prereq_state_values: HashMap<StateVarName, StateVarValue>)
         -> HashMap<InstructionName, DependencyInstruction> {

        match self {
            Self::NumberArray(def) => (def.return_size_dependency_instructions)(prereq_state_values),
            _ => unreachable!(),
        }
    }

    
    pub fn determine_size_from_dependencies(&self,
        dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<StateVarValue>, String> {

        use StateVarUpdateInstruction::*;

        match self {
            Self::NumberArray(def) => {
                let instruction = (def.determine_size_from_dependencies)(dependency_values)?;
                Ok(match instruction {                    
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Integer(val as i64)),
                })
            },

            _ => unreachable!(),
        }
    }


    pub fn determine_element_from_dependencies(&self,
        id: usize, dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<StateVarValue>, String> {

        use StateVarUpdateInstruction::*;

        match self {
            Self::NumberArray(def) => {
                let instruction = (def.determine_element_from_dependencies)(id, dependency_values)?;
                Ok(match instruction {                    
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Number(val)),
                })
            },

            _ => unreachable!(),
        }
    }





    // Both array and non-array functions



    pub fn initial_essential_value(&self) -> StateVarValue {
        match self {
            Self::String(def) =>  StateVarValue::String(def.initial_essential_value.clone()),
            Self::Integer(def) => StateVarValue::Integer(def.initial_essential_value),
            Self::Number(def) =>  StateVarValue::Number(def.initial_essential_value),
            Self::Boolean(def) => StateVarValue::Boolean(def.initial_essential_value),
            Self::NumberArray(def) => StateVarValue::Number(def.initial_essential_element_value),
        }
    }


    pub fn for_renderer(&self) -> bool {
        match self {
            Self::String(def) =>  def.for_renderer,
            Self::Integer(def) => def.for_renderer,
            Self::Number(def) =>  def.for_renderer,
            Self::Boolean(def) => def.for_renderer,
            Self::NumberArray(def) => def.for_renderer,
        }
    }


    pub fn is_array(&self) -> bool {
        match self {
            Self::NumberArray(_) => true,
            _ => false,
        }
    }

}





impl Display for StateRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Basic(sv_name) => write!(f, "{}", sv_name),
            Self::SizeOf(sv_name) => write!(f, "{}.size", sv_name),
            Self::ArrayElement(sv_name, i) => write!(f, "{}[{}]", sv_name, i),
        }
    }
}
impl Display for StateVarSlice {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Single(sv_ref) => write!(f, "Single::{}", sv_ref),
            Self::Array(sv_name) => write!(f, "Array::{}", sv_name),
        }
    }
}
