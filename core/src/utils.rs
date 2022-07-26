use std::collections::HashMap;

use crate::component::*;
use crate::state_variables::StateVarValue;
use crate::state_var::State;




pub fn package_subtree_as_json(
    components: &HashMap<String, ComponentNode>,
    component_states: &HashMap<String, Box<dyn ComponentStateVars>>,
    component: &ComponentNode
) -> serde_json::Value {

    use serde_json::Value;
    use serde_json::Map;
    use serde_json::json;

    let children: Map<String, Value> = component.children.iter()
        .enumerate()
        .map(|(child_num, child)| 
             match child {
                 ComponentChild::Component(comp_child_name) => {
                     let comp_child = components.get(comp_child_name).unwrap();
                     (format!("{} {}", child_num, comp_child_name),
                     package_subtree_as_json(components, component_states, comp_child))
                 },
                 ComponentChild::String(str) => {
                     (format!("{}", child_num), Value::String(str.to_string()))
                 }
             }
        )
        .collect();

    let attributes: Map<String, Value> = component.definition.attribute_definitions().keys()
        .into_iter()
        .filter_map(|attribute_name|
            match component.attributes.get(&attribute_name) {
                Some(attribute) => {
                    let attribute_json = match attribute {
                        Attribute::Component(component_name) => {
                            Value::String(component_name.to_string())
                        },
                        Attribute::Primitive(state_var_value) => {
                            match state_var_value {
                                StateVarValue::String(v) => json!(v),
                                StateVarValue::Number(v) => json!(v),
                                StateVarValue::Integer(v) => json!(v),
                                StateVarValue::Boolean(v) => json!(v),
                            }
                        }
                    };
                    Some((attribute_name.to_string(), attribute_json))
                }
                None => None,
            }
        )
        .collect();


    
    let mut my_json_props: serde_json::Map<String, Value> = serde_json::Map::new();

    my_json_props.insert("children".to_string(), json!(children));
    my_json_props.insert("attributes".to_string(), json!(attributes));
    my_json_props.insert("parent".to_string(), match component.parent {
        Some(ref parent_name) => Value::String(parent_name.into()),
        None => Value::Null,
    });
    my_json_props.insert("type".to_string(), Value::String(component.component_type.to_string()));
    my_json_props.insert("copyTarget".to_string(), match &component.copy_target {
        Some(copy_target_name) => Value::String(copy_target_name.to_string()),
        None => Value::Null,
    });

    let component_state = component_states.get(&component.name).unwrap();

    for &state_var_name in component.definition.state_var_definitions().keys() {

        let state_var = component_state.get(state_var_name).unwrap();

        my_json_props.insert(

            format!("sv: {}", state_var_name),

            match state_var.get_state() {
                State::Resolved(value) => match value {
                    StateVarValue::String(v) => json!(v),
                    StateVarValue::Number(v) => json!(v),
                    StateVarValue::Integer(v) => json!(v),
                    StateVarValue::Boolean(v) => json!(v),
                },
                State::Stale => Value::Null,
            }
        );

    }


    for (esv_name, essential_state_var) in component_state.get_essential_state_vars() {

        let essen_value = match essential_state_var.get_value() {
            Some(value) => match value {
                StateVarValue::String(v) => json!(v),
                StateVarValue::Number(v) => json!(v),
                StateVarValue::Integer(v) => json!(v),
                StateVarValue::Boolean(v) => json!(v),
            },
            None => Value::Null,
        };

        my_json_props.insert(format!("essen: {}", esv_name),
        json!(essen_value)

        );

    }

    Value::Object(my_json_props)
}
