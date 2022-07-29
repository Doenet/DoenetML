use std::collections::HashMap;

use crate::prelude::*;

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


// #[link(name = "logger", kind = "static")]
// extern "Rust" {
//     pub fn log_json(json_obj: serde_json::Value);
// }




/// State variable functions core uses.
/// The generics force component code to be consistent with the type of a state variable.
#[derive(Debug)]
pub struct StateVarDefinition<T> {

    /// Some state variable's dependencies change based on other variables.
    // pub state_vars_to_determine_dependencies: fn() -> Vec<StateVarName>,

    /// Reutrn the instructions that core can use to make Dependency structs.
    pub return_dependency_instructions: fn(
        HashMap<StateVarName, StateVarValue>
    ) -> HashMap<InstructionName, DependencyInstruction>,
    
    /// Determine the value and return that to core as an update instruction.
    pub determine_state_var_from_dependencies: fn(
        HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<T>, String>,

    pub for_renderer: bool,

    /// Not used much right now except for the default StateVarDefinition
    pub default_value: T,

    /// The inverse of `return_dependency_instructions`: For a desired value, return dependency
    /// values for the dependencies that would make this state variable return that value.
    pub request_dependencies_to_update_value: fn(T) -> HashMap<InstructionName, Vec<DependencyValue>>,
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
            default_value: T::default(),

            request_dependencies_to_update_value: |_| {
                log!("DEFAULT REQUEST_DEPENDENCIES_TO_UPDATE_VALUE DOES NOTHING");
                HashMap::new()
            },
        }
    }
}



pub enum StateVarValueType {
    String,
    Boolean,
    Integer,
    Number,
}


/// Since `StateVarDefinition` is generic, this enum is needed to store one in a HashMap.
#[derive(Debug)]
pub enum StateVarVariant {
    String(StateVarDefinition<String>),
    Boolean(StateVarDefinition<bool>),
    Number(StateVarDefinition<f64>),
    Integer(StateVarDefinition<i64>),
}


/// This can contain the value of a state variable of any type,
/// which is useful for function parameters.
#[derive(Debug, Clone)]
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
    Child(ChildDependencyInstruction),
    StateVar(StateVarDependencyInstruction),
    Parent(ParentDependencyInstruction),
    Attribute(AttributeDependencyInstruction),
    Essential(EssentialDependencyInstruction),
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
    // pub parent_trait: ObjectTraitName,

    // pub parent_of_component: Option<String>,

    pub state_var: StateVarName,
}

#[derive(Debug, Clone)]
pub struct AttributeDependencyInstruction {
    pub attribute_name: AttributeName,
}

#[derive(Debug, Clone)]
pub struct EssentialDependencyInstruction;


#[derive(Debug)]
pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    NoChange,
}



/// Passed into determine_state_vars_from_dependencies
/// TODO: This struct doesn't quite fit the result of an EssentialDependencyInstruction.
#[derive(Debug)]
pub struct DependencyValue {
    /// For now, `component_type: "essential_data"` is used with essential data dependencies
    pub component_type: ComponentType,
    pub state_var_name: StateVarName,
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


    fn filter_include_component_type(&self, component_type: ComponentType) -> (Vec<&DependencyValue>, InstructionName) {
        let (dep_values, name) = self;

        let filtered_dep_values = dep_values.iter()
            .filter(|dep_value| dep_value.component_type == component_type)
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
    fn value(&self) -> Option<StateVarValue>;
}

impl DepValueOption for (Option<&DependencyValue>, InstructionName) {

    fn is_bool_if_exists(&self) -> Result<Option<bool>, String> {
        let (dep_value_opt, name) = self;

        dep_value_opt.and_then(|dep_value| Some(dep_value.value.clone().try_into().map_err(|_|
            format!("Instruction [{}] is {}, expected an optional bool", 
                name, dep_value.value.type_as_str()))))
            .map_or(Ok(None), |v| v.map(Some)) // flip nested Option<Result<T>>
    }

    fn value(&self) -> Option<StateVarValue> {
        match self.0 {
            Some(dep_value) => Some(dep_value.value.clone()),
            None => None,
        }
    }
}


/////////// Default functions for an essential depenency ///////////

#[allow(non_snake_case)]
pub fn USE_ESSENTIAL_DEPENDENCY_INSTRUCTION(
    _: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {
    HashMap::from([
        ("essential", DependencyInstruction::Essential(EssentialDependencyInstruction))
    ])
}

#[allow(non_snake_case)]
pub fn DETERMINE_FROM_ESSENTIAL<T>(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> Result<StateVarUpdateInstruction<T>, String>
where
    T: TryFrom<StateVarValue>,
    <T as TryFrom<StateVarValue>>::Error: std::fmt::Debug
{
    let essential = dependency_values.get("essential").unwrap().first().unwrap().value.clone();
    let set_value = T::try_from(essential).map_err(|e| format!("{:#?}", e))?;
    Ok( StateVarUpdateInstruction::SetValue( set_value ) )
}

#[allow(non_snake_case)]
pub fn REQUEST_ESSENTIAL_TO_UPDATE<T: Into<StateVarValue>>(desired_value: T)
    -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("essential", vec![
            DependencyValue {
                component_type: "essential_data",
                state_var_name: "",
                value: desired_value.into(),
            }
        ])
    ])
}

/////////// State variable default definitions ///////////

/// Requires that the component has a parent with 'hidden' and a bool 'hide' state var
#[allow(non_snake_case)]
pub fn HIDDEN_DEFAULT_DEFINITION() -> StateVarVariant {
    use StateVarUpdateInstruction::*;


    StateVarVariant::Boolean(StateVarDefinition {
        
        return_dependency_instructions: |_| {
            let parent_dep_instruct = ParentDependencyInstruction {
                state_var: "hidden",
            };

            let from_hide_instruct = AttributeDependencyInstruction {
                attribute_name: "hide"
            };

            HashMap::from([
                ("parent_hidden", DependencyInstruction::Parent(parent_dep_instruct)),
                ("my_hide", DependencyInstruction::Attribute(from_hide_instruct)),
            ])
        },


        determine_state_var_from_dependencies: |dependency_values| {

            let parent_hidden = dependency_values.dep_value("parent_hidden")?
                .has_exactly_one_element()?
                .into_bool();

            let my_hide = dependency_values.dep_value("my_hide")?
                .has_zero_or_one_elements()?
                .is_bool_if_exists()?;

            Ok(SetValue(parent_hidden.unwrap_or(false) || my_hide.unwrap_or(false)))
        },


        for_renderer: true,
        ..Default::default()
    })
}


/// Text (string) value of value sv
#[allow(non_snake_case)]
pub fn TEXT_DEFAULT_DEFINITION() -> StateVarVariant {
    use StateVarUpdateInstruction::*;

    StateVarVariant::String(StateVarDefinition {
        for_renderer: true,

        return_dependency_instructions: |_| {
            let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
                component_name: None, //myself
                state_var: "value",
            });
        
            HashMap::from([("value_of_value", instruction)])
        },

        determine_state_var_from_dependencies: |dependency_values| {

            let value = dependency_values.dep_value("value_of_value")?
                .has_exactly_one_element()?
                .value();

            match &value {
                StateVarValue::String(v) => Ok(SetValue(v.to_string())),
                StateVarValue::Boolean(v) => Ok(SetValue(v.to_string())),
                StateVarValue::Integer(v) => Ok(SetValue(v.to_string())),
                StateVarValue::Number(v) => Ok(SetValue(v.to_string())),
            }
        },

        ..Default::default()
    })
}


#[allow(non_snake_case)]
pub fn DISABLED_DEFAULT_DEFINITION() -> StateVarVariant {
    use StateVarUpdateInstruction::*;
    use DependencyInstruction::*;

    StateVarVariant::Boolean(StateVarDefinition {     
        for_renderer: true,
        return_dependency_instructions: |_| {

            let disabled_attribute = Attribute(AttributeDependencyInstruction {
                attribute_name: "disabled",
            });

            HashMap::from([("disabled_attribute", disabled_attribute)])
        },

        determine_state_var_from_dependencies: |dependency_values| {

            let disabled = dependency_values.dep_value("disabled_attribute")?
                .has_zero_or_one_elements()?.is_bool_if_exists()?;

            Ok(SetValue(disabled.unwrap_or(false)))
        },

        ..Default::default()
    })
}


#[allow(non_snake_case)]
pub fn FIXED_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Boolean(StateVarDefinition {     
        for_renderer: true,
        determine_state_var_from_dependencies: |_| Ok(StateVarUpdateInstruction::SetValue(false)),
        ..Default::default()
    })
}



/////////// StateVarValue boilerplate ///////////

impl TryFrom<StateVarValue> for String {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::String(x) => Ok( x.to_string() ),
            _ => Err("StateVarValue is not a string"),
        }
    }
}
impl TryFrom<StateVarValue> for bool {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Boolean(x) => Ok( x ),
            _ => Err("StateVarValue is not a bool"),
        }
    }
}
impl TryFrom<StateVarValue> for f64 {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Number(x) => Ok( x ),
            _ => Err("StateVarValue is not a number"),
        }
    }
}
impl TryFrom<StateVarValue> for i64 {
    type Error = &'static str;
    fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
        match v {
            StateVarValue::Integer(x) => Ok( x ),
            _ => Err("StateVarValue is not an integer"),
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

    pub fn return_dependency_instructions(&self,
        prerequisite_state_values: HashMap<StateVarName, StateVarValue>)
         -> HashMap<InstructionName, DependencyInstruction> {

        match self {
            StateVarVariant::String(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
            StateVarVariant::Boolean(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
            StateVarVariant::Number(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
            StateVarVariant::Integer(def) =>
                (def.return_dependency_instructions)(prerequisite_state_values),
        }
    }
    
    pub fn determine_state_var_from_dependencies(&self,
        dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
    ) -> Result<StateVarUpdateInstruction<StateVarValue>, String> {

        use StateVarUpdateInstruction::*;

        match self {
            StateVarVariant::String(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {                    
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::String(val)),
                })
            },
            StateVarVariant::Integer(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Integer(val)),
                })
            },
            StateVarVariant::Number(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Number(val)),
                })
            },
            StateVarVariant::Boolean(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values)?;
                Ok(match instruction {
                    NoChange => NoChange,
                    SetValue(val) => SetValue(StateVarValue::Boolean(val)),
                })
            }                     
        }
    }

    pub fn request_dependencies_to_update_value(&self, desired_value: StateVarValue)
        -> HashMap<InstructionName, Vec<DependencyValue>> {

        match self {
            StateVarVariant::String(def) =>  {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested String be updated to {:#?}", desired_value))
                )
            },
            StateVarVariant::Integer(def) => {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested Integer be updated to {:#?}", desired_value))
                )
            },
            StateVarVariant::Number(def) =>  {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested Number be updated to {:#?}", desired_value))
                )
            },
            StateVarVariant::Boolean(def) => {
                (def.request_dependencies_to_update_value)(
                    desired_value.clone().try_into().expect( // only cloned for error msg
                        &format!("Requested Boolean be updated to {:#?}", desired_value))
                )
            }
        }       
    }


    pub fn for_renderer(&self) -> bool {
        match self {
            StateVarVariant::String(def) =>  def.for_renderer,
            StateVarVariant::Integer(def) => def.for_renderer,
            StateVarVariant::Number(def) =>  def.for_renderer,
            StateVarVariant::Boolean(def) => def.for_renderer,
        }
    }

    pub fn default_value(&self) -> StateVarValue {
        match self {
            StateVarVariant::String(def) =>  StateVarValue::String( def.default_value.clone()),
            StateVarVariant::Integer(def) => StateVarValue::Integer(def.default_value),
            StateVarVariant::Number(def) =>  StateVarValue::Number( def.default_value),
            StateVarVariant::Boolean(def) => StateVarValue::Boolean(def.default_value),
        }
    }
}






