use std::collections::HashMap;
use std::fmt::Display;

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



pub enum StateVarValueType {
    String,
    Boolean,
    Integer,
    Number,
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

    pub default_value: T,

    /// The inverse of `return_dependency_instructions`: For a desired value, return dependency
    /// values for the dependencies that would make this state variable return that value.
    pub request_dependencies_to_update_value: fn(T) -> HashMap<InstructionName, Vec<DependencyValue>>,
}




// Would it be better for the default_value to be coupled with the existence
// of an essential state var?

// Note that default_value won't get used unless you specify UseEssentialOrDefault


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




/// This tells core what dependencies to make.
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




// struct DependencyValueTyped<T> {
//     pub component_type: ComponentType,
//     pub state_var_name: StateVarName,
//     pub value: T,
// }



pub struct InstructionAddress {
    component: String,
    state_var: StateVarName,
    instruction: InstructionName,
}

impl Display for InstructionAddress {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}:{}", self.component, self.state_var, self.instruction)
    }
}



pub trait DepValueHashMap {
    fn dep_value(&self, instruction_name: InstructionName) -> Result<(&[DependencyValue], InstructionName), String>;
}

impl DepValueHashMap for HashMap<InstructionName, Vec<DependencyValue>> {

    fn dep_value(&self, instruction_name: InstructionName) -> Result<(&[DependencyValue], InstructionName), String> {
        if let Some(values) = self.get(instruction_name) {
            Ok((values, instruction_name))
        } else {
            Err(format!("Instruction [{}] does not exist", instruction_name))
        }
    }
}


pub trait DepValueVec {
    fn has_zero_or_one_elements(&self) -> Result<(Option<&DependencyValue>, InstructionName), String>;
    fn has_exactly_one_element(&self) -> Result<(&DependencyValue, InstructionName), String>;
    fn are_strings_if_non_empty(&self) -> Result<Vec<String>, String>;

}



impl DepValueVec for (&[DependencyValue], InstructionName) {

    fn has_zero_or_one_elements(&self) -> Result<(Option<&DependencyValue>, InstructionName), String> {
        let (dep_values, name) = self;

        if dep_values.is_empty() {
            Ok((None, name))
        } else if dep_values.len() == 1 {
            Ok((Some(&dep_values[0]), name))
        } else {
            Err(format!("Expected instruction [{}] to have zero or one elements", name))
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
        let (dep_values, name) = *self;

        let mut string_values = vec![];
        for dep_value in dep_values {
            string_values.push(
            match &dep_value.value {
                StateVarValue::String(v) => v.to_string(),
                _ => return Err(format!("Not all elements in instruction [{}] were strings", name))
            })
        }

        Ok(string_values)

    }
}

pub trait DepValueSingle {
    fn is_bool(&self) -> Result<bool, String>;
    fn is_string(&self) -> Result<String, String>;
    fn is_number(&self) -> Result<f64, String>;
    fn is_integer(&self) -> Result<i64, String>;

    fn value(&self) -> StateVarValue;
}

impl DepValueSingle for (&DependencyValue, InstructionName) {
    fn is_bool(&self) -> Result<bool, String> {
        match self.0.value {
            StateVarValue::Boolean(v) => Ok(v),
            _ => {
                // log!("{:#?}", self.0);
                Err(format!("Instruction [{}] is not a bool", self.1))
            }
        }
    }

    fn is_string(&self) -> Result<String, String> {
        match &self.0.value {
            StateVarValue::String(v) => Ok(v.to_string()),
            _ => Err(format!("Instruction [{}] is not a string", self.1))
        } 
    }

    fn is_number(&self) -> Result<f64, String> {
        match self.0.value {
            StateVarValue::Number(v) => Ok(v),
            _ => Err(format!("Instruction [{}] is not a number", self.1))
        }
    }

    fn is_integer(&self) -> Result<i64, String> {
        match self.0.value {
            StateVarValue::Integer(v) => Ok(v),
            _ => Err(format!("Instruction [{}] is not an integer", self.1))
        }
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

        if let Some(dep_value) = dep_value_opt {
            match dep_value.value {
                StateVarValue::Boolean(v) => Ok(Some(v)),
                _ => Err(format!("Instruction [{}] is a type other than a bool", name))
            }

        } else {
            Ok(None)
        }

    }

    fn value(&self) -> Option<StateVarValue> {
        match self.0 {
            Some(dep_value) => Some(dep_value.value.clone()),
            None => None,
        }
    }

}



// Default essential depenency instructions
// This boilerplate is needed because of the StateVarValue enum (?)

#[allow(non_snake_case)]
pub fn USE_ESSENTIAL_DEPENDENCY_INSTRUCTION(
    _: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {
    HashMap::from([
        ("essential", DependencyInstruction::Essential(EssentialDependencyInstruction))
    ])
}
#[allow(non_snake_case)]
pub fn STRING_DETERMINE_FROM_ESSENTIAL(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> Result<StateVarUpdateInstruction<String>, String> {

    let essential = dependency_values.dep_value("essential")?
        .has_exactly_one_element()?
        .is_string()?;
    Ok(StateVarUpdateInstruction::SetValue(essential))

}
#[allow(non_snake_case)]
pub fn BOOLEAN_DETERMINE_FROM_ESSENTIAL(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> Result<StateVarUpdateInstruction<bool>, String> {

    let essential = dependency_values.dep_value("essential")?
        .has_exactly_one_element()?
        .is_bool()?;
    Ok(StateVarUpdateInstruction::SetValue(essential))

}
#[allow(non_snake_case)]
pub fn NUMBER_DETERMINE_FROM_ESSENTIAL(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> Result<StateVarUpdateInstruction<f64>, String> {

    let essential = dependency_values.dep_value("essential")?
        .has_exactly_one_element()?
        .is_number()?;
    Ok(StateVarUpdateInstruction::SetValue(essential))
}

#[allow(non_snake_case)]
pub fn INTEGER_DETERMINE_FROM_ESSENTIAL(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> Result<StateVarUpdateInstruction<i64>, String> {

    let essential = dependency_values.dep_value("essential")?
        .has_exactly_one_element()?
        .is_integer()?;
    Ok(StateVarUpdateInstruction::SetValue(essential))
}

#[allow(non_snake_case)]
pub fn STRING_REQUEST_ESSENTIAL_TO_UPDATE(
    desired_value: String,
) -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("essential", vec![
            DependencyValue {
                component_type: "essential_data",
                state_var_name: "",
                value: StateVarValue::String(desired_value),
            }
        ])
    ])
}
#[allow(non_snake_case)]
pub fn BOOLEAN_REQUEST_ESSENTIAL_TO_UPDATE(
    desired_value: bool,
) -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("essential", vec![
            DependencyValue {
                component_type: "essential_data",
                state_var_name: "",
                value: StateVarValue::Boolean(desired_value),
            }
        ])
    ])
}
#[allow(non_snake_case)]
pub fn NUMBER_REQUEST_ESSENTIAL_TO_UPDATE(
    desired_value: f64,
) -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("essential", vec![
            DependencyValue {
                component_type: "essential_data",
                state_var_name: "",
                value: StateVarValue::Number(desired_value),
            }
        ])
    ])
}
#[allow(non_snake_case)]
pub fn INTEGER_REQUEST_ESSENTIAL_TO_UPDATE(
    desired_value: i64,
) -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("essential", vec![
            DependencyValue {
                component_type: "essential_data",
                state_var_name: "",
                value: StateVarValue::Integer(desired_value),
            }
        ])
    ])
}

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
                .is_bool()?;

            let my_hide = dependency_values.dep_value("my_hide")?
                .has_zero_or_one_elements()?
                .is_bool_if_exists()?;

            Ok(SetValue(parent_hidden || my_hide.unwrap_or(false)))
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





impl StateVarValue {
    // fn value_type_name(&self) -> &'static str {
    //     match self {
    //         Self::String(_) => "String",
    //         Self::Boolean(_) => "Boolean",
    //         Self::Integer(_) => "Integer",
    //         Self::Number(_) => "Number",
    //     }
    // }

    pub fn unwrap_bool(&self) -> bool {
        match self {
            Self::Boolean(val) => *val,
            _ => panic!(),
        }
    }

    pub fn unwrap_string(&self) -> String {
        match self {
            Self::String(val) => val.to_string(),
            _ => panic!(),
        }
    }

    pub fn unwrap_number(&self) -> f64 {
        match self {
            Self::Number(val) => *val,
            _ => panic!(),
        }
    }

    pub fn unwrap_integer(&self) -> i64 {
        match self {
            Self::Integer(val) => *val,
            _ => panic!(),
        }
    }

}






// Boilerplate so we don't have to match over StateVarVariant elsewhere

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
                match desired_value {
                    StateVarValue::String(v) =>  (def.request_dependencies_to_update_value)(v),
                    StateVarValue::Number(_) =>  panic!("Requested Number state var update to String"),
                    StateVarValue::Boolean(_) => panic!("Requested Boolean state var update to String"),
                    StateVarValue::Integer(_) => panic!("Requested Integer state var update to String"),
                }
            },
            StateVarVariant::Integer(def) => {
                match desired_value {
                    StateVarValue::Integer(v) => (def.request_dependencies_to_update_value)(v),
                    StateVarValue::String(_) =>  panic!("Requested String state var update to Integer"),
                    StateVarValue::Number(_) =>  panic!("Requested Number state var update to Integer"),
                    StateVarValue::Boolean(_) => panic!("Requested Boolean state var update to Integer"),
                }
            },
            StateVarVariant::Number(def) =>  {
                match desired_value {
                    StateVarValue::Number(v) =>  (def.request_dependencies_to_update_value)(v),
                    StateVarValue::String(_) =>  panic!("Requested String state var update to Number"),
                    StateVarValue::Boolean(_) => panic!("Requested Boolean state var update to Number"),
                    StateVarValue::Integer(_) => panic!("Requested Integer state var update to Number"),
                }
            },
            StateVarVariant::Boolean(def) => {
                match desired_value {
                    StateVarValue::Boolean(v) => (def.request_dependencies_to_update_value)(v),
                    StateVarValue::String(_) =>  panic!("Requested String state var update to Boolean"),
                    StateVarValue::Number(_) =>  panic!("Requested Number state var update to Boolean"),
                    StateVarValue::Integer(_) => panic!("Requested Integer state var update to Boolean"),
                }
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






