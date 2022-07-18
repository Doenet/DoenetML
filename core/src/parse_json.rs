


use serde_json::Value;

use crate::ComponentLike;
use crate::ComponentChild;
use crate::document::Document;
use crate::state_var::EssentialStateVar;
use crate::state_var::StateVar;
use crate::state_var::StateVarValueType;
use crate::text::Text;
use crate::number::Number;
use crate::text_input::TextInput;

use std::collections::HashMap;

use crate::state_variables::*;

use crate::log;


#[derive(Debug)]
pub struct Action {
    // pub component: Box<dyn ComponentLike>,
    pub component_name: String,
    pub action_name: String,
    // pub action_func: fn(HashMap<String, StateVarValue>)
        // -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>,
    pub args: HashMap<String, StateVarValue>,
}

fn json_value_to_state_var_value(value: &Value) -> Option<StateVarValue> {
    match value {
        Value::Bool(v) => Some(StateVarValue::Boolean(*v)),
        Value::String(v) => Some(StateVarValue::String(v.clone())),
        Value::Number(v) => Some(if v.is_i64() {
            StateVarValue::Integer(v.as_i64().unwrap())
        } else {
            StateVarValue::Number(v.as_f64().unwrap())
        }),
        _ => None,
    }  
}



pub fn parse_action_from_json(json_action: serde_json::Value)
    -> Result<Action, String> {

    // let component: Box<dyn ComponentLike>;
    let component_name: String;
    let action_name: String;
    // let action_func;
    let args: HashMap<String, StateVarValue>;
    
    if let Value::Object(map) = json_action {

        // Get component, component_name from JSON input
        let component_name_obj = map.get("componentName").expect("no componentName for action");
        if let Value::String(component_name_str) = component_name_obj {
            component_name = component_name_str.to_string();
            // component = Box::clone(core.components.get(&component_name).unwrap());
        } else {
            return Err("componentName should be a string".to_string())
        }

        // Get action_name from JSON input
        let action_name_obj = map.get("actionName").expect("no actionName for action");
        if let Value::String(action_name_str) = action_name_obj {
            action_name = action_name_str.to_string();
            // action_func = *core.components.get(&component_name).unwrap()
                // .actions().get(&action_name).unwrap();
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
        // component,
        component_name,
        action_name,
        // action_func,
        args,
    })

}


/// Returns an option of (components hashmap, root component name)
/// If the option is empty, the json was empty
pub fn create_components_tree_from_json(json_input: &serde_json::Value)
    -> Result<(HashMap<String, Box<dyn ComponentLike>>, String), &str>
{

    // log!("Parse json input {:#?}", json_input);

    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut components: HashMap<String, Box<dyn ComponentLike>> = HashMap::new();

    let trimmed_json_input = if let serde_json::Value::Array(json_array) = json_input {

        // Assuming that the outer tag is a <document>

        let mut trimmed_array = vec![];
        for val in json_array {
            if let serde_json::Value::String(_) = val {
                // don't include it
            } else {
                trimmed_array.push(val);
            }
        }

        if trimmed_array.len() == 1 {

            trimmed_array[0]

        } else {


            return Err("Json object did not have one root");
        }

    } else {
        json_input
    };


    let root_json_obj = if let Value::Object(map) = trimmed_json_input {
        map
    } else {
        return Err("");
    };

    log!("Root json object {:#?}", root_json_obj);

    let root_component_name = add_component_from_json(&mut components, root_json_obj, None, &mut component_type_counter)?;


    Ok((components, root_component_name))

}



fn add_component_from_json(
    components: &mut HashMap<String, Box<dyn ComponentLike>>,
    json_obj: &serde_json::Map<String, Value>,
    parent_name: Option<String>,
    component_type_counter: &mut HashMap<String, u32>,


    // Ok(component_name)
) -> Result<String, &'static str> {


    let component_type_value = json_obj.get("componentType").unwrap();

    let component_type = if let Value::String(str) = component_type_value {
        str
    }  else {
        return Err("componentType is not a string");
    };


    let count = *component_type_counter.get(component_type).unwrap_or(&0);
    component_type_counter.insert(component_type.to_string(), count + 1);
    let mut component_name =  format!("/_{}{}", component_type, count + 1);

    let props_value = json_obj.get("props").expect(
        &format!("No JSON 'props' field for this {} component", component_type_value)
    );

    
    let mut attributes: HashMap<String, StateVarValue> = HashMap::new();

    if let Value::Object(props_map) = props_value {

        for (prop_name, prop_value) in props_map {
            let prop_state_var_value = json_value_to_state_var_value(prop_value).unwrap();

            if prop_name == "name" {
                if let StateVarValue::String(name) = prop_state_var_value {
                    component_name = name.to_string();
                }


            } else {
                attributes.insert(prop_name.to_string(), prop_state_var_value);
            }


        }

    }


    // Before we create the component, we have to figure out which of its 
    // state vars are essential state vars. Note that we're technically doing more
    // work than we have to because we're doing all the work for each component,
    // rather than each component type

    let state_var_definitions: &HashMap<StateVarName, StateVarVariant> = match component_type.as_str() {
        "text" =>       &crate::text::MY_STATE_VAR_DEFINITIONS,
        "number" =>     &crate::number::MY_STATE_VAR_DEFINITIONS,
        "textInput" =>  &crate::text_input::MY_STATE_VAR_DEFINITIONS,
        "document" =>   &crate::document::MY_STATE_VAR_DEFINITIONS,

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


    // Recurse the children


    let mut children: Vec<ComponentChild> = vec![];
    let children_value = json_obj.get("children").expect("No children JSON field");

    if let Value::Array(children_array) = children_value {

        for child_value in children_array {

            match child_value {
                Value::String(child_string) => {
                    children.push(ComponentChild::String(child_string.to_string()));

                },

                Value::Object(child_json_obj) => {
                    let child_name = add_component_from_json(components, child_json_obj, Some(component_name.clone()), component_type_counter)?;

                    children.push(ComponentChild::Component(child_name));
                },

                _ => {
                    return Err("JSON array should have only objects and strings");
                }
            }

        }
    } else {
        return Err("JSON children field should be an array")
    }



    // Create this component

    let component = match component_type.as_str() {

        "text" => Text::create(
            component_name.clone(),
            parent_name,
            children,
            essential_state_vars,
        ),
        "number" => Number::create(
            component_name.clone(),
            parent_name,
            children,
            essential_state_vars,
        ),
        "textInput" => TextInput::create(
            component_name.clone(),
            parent_name,
            children,
            essential_state_vars,
        ),
        "document" => Document::create(
            component_name.clone(),
            parent_name,
            children,
            essential_state_vars,
        ),

        // Add components to this match here

        _ => {return Err("Unrecognized component type")}
    };




    components.insert(component_name.clone(), component);


    Ok(component_name)

}


