use std::collections::HashMap;

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





pub type StateVarName = &'static str;
pub type InstructionName = &'static str;
pub type ComponentType = &'static str;


/// Passed into determine_state_vars_from_dependencies
pub struct DependencyValue {
    pub component_type: ComponentType,
    pub state_var_name: StateVarName,
    pub value: StateVarValue,
}



// // The only way to make this should be through the constructor
// #[derive(Debug, PartialEq, Eq, Hash, Clone)]
// pub struct ComponentName(String);

// impl ComponentName {
//     pub fn new(name: &str, components: &HashMap<String, Box<dyn ComponentLike>>) -> Result<Self, String> {
        
//         if components.contains_key(name) {
//             Ok(ComponentName(name.to_string()))
//         } else {
//             Err(format!("{} is not a component name", name))
//         }

//     }
// }



/// State variable functions core uses.
/// The generics force component devs to be consistent with the type of a state variable.
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
        HashMap<InstructionName, Vec<DependencyValue>>
    ) -> StateVarUpdateInstruction<T>,

    pub for_renderer: bool,

    pub default_value: T,

    pub has_essential: bool,


    // arg is desired value
    pub request_dependencies_to_update_value: fn(T) -> Vec<UpdateRequest>,
}




// Would it be better for the default_value to be coupled with the existence
// of an essential state var?

// Note that default_value won't get used unless you specify UseEssentialOrDefault


impl<T> Default for StateVarDefinition<T>
    where T: Default
{
    fn default() -> Self {
        StateVarDefinition {
            state_vars_to_determine_dependencies: || vec![],
            return_dependency_instructions: |_| HashMap::new(),
            determine_state_var_from_dependencies:
                |_| StateVarUpdateInstruction::SetValue(T::default()),
            for_renderer: false,
            default_value: T::default(),
            has_essential: false,

            request_dependencies_to_update_value: |_| {
                log!("DEFAULT REQUEST_DEPENDENCIES_TO_UPDATE_VALUE DOES NOTHING");
                vec![]
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



/// This stores some of the state variables (or strings) that a state variable depends on.
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

/// An object refers to either a component or a string child.
#[derive(Debug, PartialEq)]
pub enum ObjectName {
    Component(String),
    String(String),
}


/// This tells core what dependencies to make.
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
    // pub parent_trait: ObjectTraitName,

    // pub parent_of_component: Option<String>,

    pub state_var: StateVarName,
}


#[derive(Debug)]
pub enum StateVarUpdateInstruction<T> {
    SetValue(T),
    UseEssentialOrDefault,
    NoChange,
}


#[derive(Debug)]
pub enum UpdateRequest {
    SetEssentialValue(StateVarName, StateVarValue),

    // rename this
    SetStateVarDependingOnMe(StateVarName, StateVarValue),
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

            let from_hide_instruct = StateVarDependencyInstruction {
                component_name: None,
                state_var: "hide",
            };

            HashMap::from([
                ("parent_hidden", DependencyInstruction::Parent(parent_dep_instruct)),
                ("my_hide", DependencyInstruction::StateVar(from_hide_instruct)),
            ])
        },


        determine_state_var_from_dependencies: |dependency_values| {

            let parent_hidden = dependency_values.get("parent_hidden").unwrap()[0].value.unwrap_bool();
            let my_hide = dependency_values.get("my_hide").unwrap()[0].value.unwrap_bool();

            SetValue(parent_hidden || my_hide)
        },


        for_renderer: true,
        ..Default::default()
    })
}


#[allow(non_snake_case)]
pub fn DISABLED_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Boolean(StateVarDefinition {     
        for_renderer: true,
        determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(false),
        ..Default::default()
    })
}


#[allow(non_snake_case)]
pub fn FIXED_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Boolean(StateVarDefinition {     
        for_renderer: true,
        determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(false),
        ..Default::default()
    })
}





impl StateVarValue {
    fn value_type_name(&self) -> &'static str {
        match self {
            Self::String(_) => "String",
            Self::Boolean(_) => "Boolean",
            Self::Integer(_) => "Integer",
            Self::Number(_) => "Number",
        }
    }

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

    pub fn state_vars_to_determine_dependencies(&self) -> Vec<StateVarName> {

        match self {
            StateVarVariant::String(def) => (def.state_vars_to_determine_dependencies)(),
            StateVarVariant::Boolean(def) => (def.state_vars_to_determine_dependencies)(),
            StateVarVariant::Number(def) => (def.state_vars_to_determine_dependencies)(),
            StateVarVariant::Integer(def) => (def.state_vars_to_determine_dependencies)(),
        }
    }

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
    ) -> StateVarUpdateInstruction<StateVarValue> {

        use StateVarUpdateInstruction::*;

        match self {
            StateVarVariant::String(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {                    
                    NoChange => NoChange,
                    UseEssentialOrDefault => UseEssentialOrDefault,
                    SetValue(val) => SetValue(StateVarValue::String(val)),
                }
            },
            StateVarVariant::Integer(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    NoChange => NoChange,
                    UseEssentialOrDefault => UseEssentialOrDefault,
                    SetValue(val) => SetValue(StateVarValue::Integer(val)),
                }
            },
            StateVarVariant::Number(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    NoChange => NoChange,
                    UseEssentialOrDefault => UseEssentialOrDefault,
                    SetValue(val) => SetValue(StateVarValue::Number(val)),
                }
            },
            StateVarVariant::Boolean(def) => {
                let instruction = (def.determine_state_var_from_dependencies)(dependency_values);
                match instruction {
                    NoChange => NoChange,
                    UseEssentialOrDefault => UseEssentialOrDefault,
                    SetValue(val) => SetValue(StateVarValue::Boolean(val)),
                }
            }                     
        }
    }

    pub fn request_dependencies_to_update_value(&self, desired_value: StateVarValue)
        -> Vec<UpdateRequest> {

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

    pub fn has_essential(&self) -> bool {
        match self {
            StateVarVariant::String(def) =>  def.has_essential,
            StateVarVariant::Integer(def) => def.has_essential,
            StateVarVariant::Number(def) =>  def.has_essential,
            StateVarVariant::Boolean(def) => def.has_essential,
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
