
use serde_json::Value;


use crate::ComponentLike;
use crate::DoenetCore;
use crate::ComponentChild;
use crate::state_var::EssentialStateVar;
use crate::state_var::StateVar;
use crate::state_var::StateVarValueType;
use crate::state_variables::StateVarName;
use crate::state_variables::StateVarUpdateInstruction;
use crate::state_variables::StateVarValue;
use crate::state_variables::StateVarVariant;
use crate::text::Text;
use crate::number::Number;
use crate::text_input::TextInput;

use std::collections::HashMap;
use std::rc::Rc;




pub struct Action {
    pub component: Rc<dyn ComponentLike>,
    pub component_name: String,
    pub action_name: String,
    pub action_func: fn(HashMap<String, StateVarValue>)
        -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>,
    pub args: HashMap<String, StateVarValue>,
}



pub fn parse_action_from_json(core: &DoenetCore, json_action: serde_json::Value)
    -> Result<Action, String> {

    let component: Rc<dyn ComponentLike>;
    let component_name: String;
    let action_name: String;
    let action_func;
    let args: HashMap<String, StateVarValue>;
    
    if let Value::Object(map) = json_action {

        // Get component, component_name from JSON input
        let component_name_obj = map.get("componentName").expect("no componentName for action");
        if let Value::String(component_name_str) = component_name_obj {
            component_name = component_name_str.to_string();
            component = Rc::clone(core.components.get(&component_name).unwrap());
        } else {
            return Err("componentName should be a string".to_string())
        }

        // Get action, action_name from JSON input
        let action_name_obj = map.get("actionName").expect("no actionName for action");
        if let Value::String(action_name_str) = action_name_obj {
            action_name = action_name_str.to_string();
            action_func = *core.components.get(&component_name).unwrap()
                .actions().get(&action_name).unwrap();
        } else {
            return Err("action should be a string".to_string());
        }

        let args_obj = map.get("args").expect("no args for action");
        if let Value::Object(args_json_obj) = args_obj {

            let args_result: Result<HashMap<String, StateVarValue>, String> =
                args_json_obj.into_iter().map(|(k, v)| 
                    match v {
                        Value::Bool(v) => Ok((k.clone(), StateVarValue::Boolean(*v))),
                        Value::String(v) => Ok((k.clone(), StateVarValue::String(v.clone()))),
                        Value::Number(v) => Ok((k.clone(), if v.is_i64() {
                            StateVarValue::Integer(v.as_i64().unwrap())
                        } else {
                            StateVarValue::Number(v.as_f64().unwrap())
                        })),
                        _ => Err(format!("action {} arg is not bool, number, or string", action_name)),
                    }
                ).collect();

            args = args_result?;
        } else {
            return Err("args should be an object".to_string());
        }


    } else {
        return Err("wrong json structure for action".to_string());
    }


    Ok(Action {
        component,
        component_name,
        action_name,
        action_func,
        args,
    })

}


/// Returns an option of (components hashmap, root component name)
/// If the option is empty, the json was empty
pub fn create_components_tree_from_json(root: &serde_json::Value)
    -> Result<(HashMap<String, Rc<dyn ComponentLike>>, String), &str>
{
    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut components: HashMap<String, Rc<dyn ComponentLike>> = HashMap::new();
    let mut root_component_name: Option<String> = None;

    add_json_subtree_to_components(&mut components, root, "", &mut component_type_counter, &mut root_component_name)?;

    if let Some(actual_root_name) = root_component_name {
        Ok((components, actual_root_name))
    } else {
        Err( "json empty" )
    }
}


fn add_json_subtree_to_components(
    components: &mut HashMap<String, Rc<dyn ComponentLike>>,
    json_obj: &serde_json::Value,
    parent_name: &str,
    component_type_counter: &mut HashMap<String, u32>,
    root_component_name: &mut Option<String>
) -> Result<(), &'static str> {

    match json_obj {
        serde_json::Value::Array(value_vec) => {
            // log!("array");
            for value in value_vec.iter() {
                add_json_subtree_to_components(components, value, parent_name, component_type_counter, root_component_name)?;
            }
        },
        
        Value::String(string_value) => {
            if let Some(parent) = components.get(parent_name) {
                parent.add_as_child(ComponentChild::String(string_value.to_string()));
            }
        },

        serde_json::Value::Object(map) => {
            // log!("object");
            let component_type_value = map.get("componentType").unwrap();

            if let Value::String(component_type) = component_type_value {

                let count = *component_type_counter.get(component_type).unwrap_or(&0);
                component_type_counter.insert(component_type.to_string(), count + 1);
                let mut component_name =  format!("/_{}{}", component_type, count + 1);

                let props_value = map.get("props").expect(
                    &format!("No JSON 'props' field for this {} component", component_type_value)
                );
                
                if let Value::Object(props_map) = props_value {
                    if let Some(name_value) = props_map.get("name") {
                        if let Value::String(name) = name_value {
                            component_name = name.to_string();
                        }
                    }

                    // Address other props here
                }


                // Make sure to do this before you recurse to the next Value::Object
                if root_component_name.is_none() {
                    *root_component_name = Option::Some(component_name.clone());
                }

                // Before we create the component, we have to figure out which of its 
                // state vars are essential state vars. Note that we're technically doing more
                // work than we have to because we're doing all the work for each component,
                // rather than each component type

                let state_var_definitions: &HashMap<StateVarName, StateVarVariant> = match component_type.as_str() {
                    "text" =>       &crate::text::MY_STATE_VAR_DEFINITIONS,
                    "number" =>     &crate::number::MY_STATE_VAR_DEFINITIONS,
                    "textInput" =>  &crate::text_input::MY_STATE_VAR_DEFINITIONS,
                    _ => {return Err("Unrecognized component type")}
                };

                let mut essential_state_vars = HashMap::new();
                for (&state_var_name, state_var_def) in state_var_definitions {
                    
                    if state_var_def.has_essential() {
                        essential_state_vars.insert(state_var_name, EssentialStateVar::derive_from(
                            
                            // TODO: This is hacky. We should create the actual StateVars first
                            match state_var_def {
                                StateVarVariant::String(_) => StateVar::new(StateVarValueType::String),
                                StateVarVariant::Integer(_) => StateVar::new(StateVarValueType::Integer),
                                StateVarVariant::Number(_) => StateVar::new(StateVarValueType::Number),
                                StateVarVariant::Boolean(_) => StateVar::new(StateVarValueType::Boolean),
                            }
                        ));
                    }
                }
                
                

                let component = match component_type.as_str() {

                    "text" => Text::create(
                        component_name.clone(),
                        parent_name.to_string(),
                        essential_state_vars,
                    ),
                    "number" => Number::create(
                        component_name.clone(),
                        parent_name.to_string(),
                        essential_state_vars,
                    ),
                    "textInput" => TextInput::create(
                        component_name.clone(),
                        parent_name.to_string(),
                        essential_state_vars,
                    ),

                    // Add components to this match here
 
                    _ => {return Err("Unrecognized component type")}
                };

                if let Some(parent) = components.get(parent_name) {
                    parent.clone().add_as_child(
                        ComponentChild::Component(Rc::clone(&component)));
                }

                let children_value = map.get("children").expect("No children JSON field");

                components.insert(component_name.clone(), component);



                add_json_subtree_to_components(components, children_value, &component_name, component_type_counter, root_component_name)?;

            } else {
                return Err("componentType is not a string");
            }
        },

        _ => {
            // log!("other");
        },
    }
    Ok(())
}

