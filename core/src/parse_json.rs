
use serde_json::Value;


use crate::DoenetCore;
use crate::handle_update_instruction;
use crate::Component;
use crate::ComponentChild;
use crate::state_variable_setup::StateVarValue;
use crate::text::Text;
use crate::number::Number;

use std::collections::HashMap;







pub fn handle_action(core: &DoenetCore, action: &str) {
    let json_deserialized: serde_json::Value = serde_json::from_str(&action).unwrap();
    let component_name;
    let action_name;
    let args;
    if let Value::Object(ref map) = json_deserialized {
        component_name = map.get("componentName").expect("no componentName for action");
        action_name = map.get("actionName").expect("no actionName for action");
        args = map.get("args").expect("no args for action");
    } else {
        panic!("wrong json structure for action");
    }

    if let Value::String(component_name) = component_name {
        if let Value::String(action_name) = action_name {
            if let Value::Object(args) = args {
                let component = core.components.get(component_name).unwrap().component();
                let action = component.actions().get(action_name).unwrap();
                let args = args.into_iter().map(|(k, v)| (k.clone(), match v {
                        Value::Bool(v) => StateVarValue::Boolean(*v),
                        Value::String(v) => StateVarValue::String(v.clone()),
                        Value::Number(v) => if v.is_i64() {
                            StateVarValue::Integer(v.as_i64().unwrap())
                        } else {
                            StateVarValue::Number(v.as_f64().unwrap())
                        },
                        _ => panic!("action {} arg is not bool, number, or string", action_name),
                    })
                ).collect();

                let update_instructions_and_names = (action)(args);
                for (state_var_name, update_instruction) in update_instructions_and_names {
                    handle_update_instruction(&component, state_var_name, update_instruction);
                }
            }
        }
    }
}


/// Returns an option of (components hashmap, root component name)
/// If the option is empty, the json was empty
pub fn create_components_tree_from_json(root: &serde_json::Value)
    -> Option<(HashMap<String, Component>, String)>
{
    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut components: HashMap<String, Component> = HashMap::new();
    let mut root_component_name: Option<String> = None;

    add_json_subtree_to_components(&mut components, root, "", &mut component_type_counter, &mut root_component_name);

    if let Some(actual_root_name) = root_component_name {
        Some((components, actual_root_name))
    } else {
        None
    }


}


fn add_json_subtree_to_components(
    components: &mut HashMap<String, Component>,
    json_obj: &serde_json::Value,
    parent_name: &str,
    component_type_counter: &mut HashMap<String, u32>,
    root_component_name: &mut Option<String>
) {

    match json_obj {
        serde_json::Value::Array(value_vec) => {
            log!("array");
            for value in value_vec.iter() {
                add_json_subtree_to_components(components, value, parent_name, component_type_counter, root_component_name);
            }
        },
        
        Value::String(string_value) => {
            if let Some(parent) = components.get(parent_name) {
                parent.component().add_as_child(ComponentChild::String(string_value.to_string()));
            }
        },

        serde_json::Value::Object(map) => {
            log!("object");
            let component_type_value = map.get("componentType").unwrap();

            if let Value::String(component_type) = component_type_value {

                let count = *component_type_counter.get(component_type).unwrap_or(&0);
                component_type_counter.insert(component_type.to_string(), count + 1);
                let mut component_name =  format!("/_{}{}", component_type, count + 1);

                let props_value = map.get("props").unwrap();
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
                

                let component = match component_type.as_str() {
                    

                    "text" => Component::Text(
                        Text::create(component_name.clone(), parent_name.to_string())
                    ),

                    "number" => Component::Number(
                        Number::create(component_name.clone(), parent_name.to_string())
                    ),

                    // Add components to this match here
 
                    _ => {panic!("Unrecognized component type")}
                };

                if let Some(parent) = components.get(parent_name) {
                    parent.clone().component().add_as_child(
                        ComponentChild::Component(component.clone().component()));
                }

                let children_value = map.get("children").unwrap();

                components.insert(component_name.clone(), component);



                add_json_subtree_to_components(components, children_value, &component_name, component_type_counter, root_component_name);

            } else {
                panic!("componentType is not a string");
            }
        },

        _ => {log!("other");},
    }
}

