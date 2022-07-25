use serde_json::Value;

use crate::Action;
use crate::component::{Attribute, AttributeDefinition};
use crate::prelude::*;


use crate::AttributeData;
use crate::ComponentDefinition;
use crate::ComponentChild;
use crate::ComponentNode;

use std::collections::HashMap;

use crate::state_variables::*;

use crate::log;




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


fn get_component_definition_for_type(component_type: &str) -> Result<(Box<dyn ComponentDefinition>, ComponentType),String> {
    let component_def_and_type = match component_type {
        "text" =>       (Box::new(crate::text::MyComponentDefinition) as Box<dyn ComponentDefinition>, "text"),
        // "number" =>     &crate::number::MyComponentDefinition,
        // "textInput" =>  &crate::text_input::MyComponentDefinition,
        "document" =>   (Box::new(crate::document::MyComponentDefinition) as Box<dyn ComponentDefinition>, "document"),
        "boolean" =>    (Box::new(crate::boolean::MyComponentDefinition) as Box<dyn ComponentDefinition>, "boolean"),

        _ => {
            return Err(format!("Invalid component type {}", component_type));
        } 
    };

    Ok(component_def_and_type)
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
    -> Result<(HashMap<String, ComponentNode>, String), String>
{

    // log!("Parse json input {:#?}", json_input);

    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut component_nodes: HashMap<String, ComponentNode> = HashMap::new();

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


            return Err("Json object did not have one root".into());
        }

    } else {
        json_input
    };


    let root_json_obj = if let Value::Object(map) = trimmed_json_input {
        map
    } else {
        return Err("".into());
    };

    log!("Root json object {:#?}", root_json_obj);

    let root_component_name = add_component_from_json(&mut component_nodes, root_json_obj, None, &mut component_type_counter)?;


    Ok((component_nodes, root_component_name))

}



fn add_component_from_json(
    component_nodes: &mut HashMap<String, ComponentNode>,
    json_obj: &serde_json::Map<String, Value>,
    parent_name: Option<String>,
    component_type_counter: &mut HashMap<String, u32>,


    // Ok(component_name)
) -> Result<String, String> {


    let component_type_value = json_obj.get("componentType").unwrap();

    let component_type_str: &str = if let Value::String(str) = component_type_value {
        str
    }  else {
        return Err("componentType is not a string".into());
    };

    // let component_type: ComponentType = COMPONENT_TYPES.get(component_type_string).expect(&format!("Unrecognized component type {}", component_type_string));
    let (component_definition, component_type) = get_component_definition_for_type(component_type_str)?;


    let count = *component_type_counter.get(component_type).unwrap_or(&0);
    component_type_counter.insert(component_type.to_string(), count + 1);
    let mut component_name =  format!("/_{}{}", component_type, count + 1);


    let mut copy_target: Option<String> = None;


    let props_value = json_obj.get("props").expect(
        &format!("No JSON 'props' field for this {} component", component_type_value)
    );


    // let component_definition = match component_type {
    //     "text" =>       &crate::text::MyComponentDefinition,
    //     // "number" =>     &crate::number::MyComponentDefinition,
    //     // "textInput" =>  &crate::text_input::MyComponentDefinition,
    //     // "document" =>   &crate::document::MyComponentDefinition,
    //     // "boolean" =>    &crate::boolean::MyComponentDefinition,

    //     _ => {
    //         return Err("Invalid component type".to_string());
    //     } 
    // };


    // Attributes

    let attribute_definitions = component_definition.attribute_definitions();

    // let attribute_definitions: &HashMap<AttributeName, AttributeDefinition> = match component_type {
    //     "text" =>       &crate::text::MY_ATTRIBUTE_DEFINITIONS,
    //     "number" =>     &crate::number::MY_ATTRIBUTE_DEFINITIONS,
    //     "textInput" =>  &crate::text_input::MY_ATTRIBUTE_DEFINITIONS,
    //     "document" =>   &crate::document::MY_ATTRIBUTE_DEFINITIONS,
    //     "boolean" =>    &crate::boolean::MY_ATTRIBUTE_DEFINITIONS,

    //     _ => {
    //         return Err("Invalid component type".to_string());
    //     }
    // };

    let mut attributes: Box<dyn AttributeData> = component_definition.empty_attribute_data();


    // let attributes: Box<dyn AttributeData> = match component_type {
    //     "text" =>       crate::text::,
    //     // "number" =>     &crate::number::empty_attribute_data(),
    //     // "textInput" =>  &crate::text_input::empty_attribute_data(),
    //     // "document" =>   &crate::document::empty_attribute_data(),
    //     // "boolean" =>    &crate::boolean::empty_attribute_data(),

    //     _ => {
    //         return Err("Invalid component type".to_string());
    //     }
    // };


    // let mut attributes: HashMap<AttributeName, Attribute> = HashMap::new();


    if let Value::Object(props_map) = props_value {




        // Create a hashmap from lowercase valid names to normalized valid names
        let mut attr_lowercase_to_normalized: HashMap<String, AttributeName> = HashMap::new();
        for attr_name in attribute_definitions.keys() {
            attr_lowercase_to_normalized.insert(attr_name.to_lowercase(), attr_name);
        }
        let attr_lowercase_to_normalized = attr_lowercase_to_normalized;




        for (prop_name, prop_value) in props_map {

            if prop_name.to_lowercase() == "name".to_lowercase() {

                // let prop_state_var_value = json_value_to_state_var_value(prop_value).unwrap();
                if let Value::String(name) = prop_value {
                    component_name = name.to_string();
                }


            } else if prop_name.to_lowercase() == "copyTarget".to_lowercase() {

                if let Value::String(copy_target_value) = prop_value {
                    copy_target = Some(copy_target_value.to_string());

                } else {
                    return Err("copyTarget must be a string".to_string());
                }


            } else if let Some(attribute_name) = attr_lowercase_to_normalized.get(&prop_name.to_lowercase()) {
                // Ensure that prop is valid attribute

                let attribute_def = attribute_definitions.get(attribute_name).unwrap();
        
                match attribute_def {
                    AttributeDefinition::Component(attr_comp_type) => {

                        //String child
                        let string_child = ComponentChild::String(match prop_value {
                            Value::Bool(v) => v.to_string(),
                            Value::String(v) => v.to_string(),
                            _ => {
                                return Err("Prop value should only be string and bool".to_string());
                            }
                        });

                        // Make sure this is unique
                        let attr_comp_name = format!("__attr:{}:{}", component_name, attribute_name);



                        let (attr_component_definition, _) = get_component_definition_for_type(attr_comp_type)?;

                        let attribute_component_node = ComponentNode {
                            name: attr_comp_name.clone(),
                            parent: Some(component_name.clone()),
                            children: vec![string_child],
                    
                            component_type: attr_comp_type,
                            attributes: attr_component_definition.empty_attribute_data(),
                    
                            copy_target: None,
                            is_shadow_for: None,

                            definition: attr_component_definition,
                        };

                        // let attribute_component = create_new_component_of_type(attr_comp_type, &attr_comp_name, Some(&component_name), vec![string_child], HashMap::new(), None)?;

            
                        attributes.add_attribute(attribute_name, Attribute::Component(attr_comp_name.clone())).unwrap();


                        component_nodes.insert(attr_comp_name, attribute_component_node);

                    },
        
                    AttributeDefinition::Primitive(attr_primitive_type) => {

                        match attr_primitive_type {
                            StateVarValueType::Boolean => {

                                if let Value::Bool(bool_value) = prop_value {
                                    attributes.add_attribute(
                                        attribute_name,
                                        Attribute::Primitive(StateVarValue::Boolean(*bool_value))
                                    ).unwrap();

                                } else {
                                    return Err("Attribute of recognized name has different type".into());
                                }

                            },

                            _ => {
                                log!("Primitive non-bool attribute definition does nothing right now");
                            }
                        }
        
                    }
                }

                
            } else {
                return Err(format!("{} does not have the attribute {}", component_name, prop_name));
            }


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
                    let child_name = add_component_from_json(component_nodes, child_json_obj, Some(component_name.clone()), component_type_counter)?;

                    children.push(ComponentChild::Component(child_name));
                },

                _ => {
                    return Err("JSON array should have only objects and strings".into());
                }
            }

        }
    } else {
        return Err("JSON children field should be an array".into())
    }




    // Create this component

    let component_node = ComponentNode {
        name: component_name.clone(),
        parent: parent_name,
        children,

        component_type,
        attributes,

        copy_target,
        is_shadow_for: None,

        definition: component_definition,
    };

    
    // let component = create_new_component_of_type(component_type, &component_name, parent_name, children, attributes, copy_target)?;


    component_nodes.insert(component_name.clone(), component_node);


    Ok(component_name)

}


