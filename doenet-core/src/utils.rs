use std::collections::HashMap;

use crate::prelude::*;
use crate::component::*;
use crate::state_var::StateVar;
use crate::state_variables::StateVarValue;
use crate::state_var::State;
use crate::Dependency;



/// List components and children in a JSON array
pub fn json_components(
    components: &HashMap<ComponentName, ComponentNode>,
    component_states: &HashMap<ComponentName, HashMap<StateVarName, StateVar>>
) -> serde_json::Value {

    let json_components: serde_json::Map<String, serde_json::Value> = components
        .values()
        .map(|component| (component.name.to_string(),
                package_subtree_as_json(
                    &components,
                    &&component_states,
                    component)))
        .collect();

    serde_json::Value::Object(json_components)
}


pub fn package_subtree_as_json(
    components: &HashMap<ComponentName, ComponentNode>,
    component_states: &HashMap<ComponentName, HashMap<StateVarName, StateVar>>,
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
            match component.attributes.get(attribute_name) {
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

    my_json_props.insert("children".to_owned(), json!(children));
    my_json_props.insert("attributes".to_owned(), json!(attributes));
    my_json_props.insert("parent".to_owned(), match component.parent {
        Some(ref parent_name) => Value::String(parent_name.into()),
        None => Value::Null,
    });
    my_json_props.insert("type".to_owned(), Value::String(component.component_type.to_string()));
    my_json_props.insert("copySource".to_owned(), match &component.copy_source {
        Some(CopySource::Component(copy_source_name)) => Value::String(copy_source_name.to_string()),
        Some(CopySource::StateVar(source_name, source_state_var)) => Value::String(
            format!("{} {}", source_name, source_state_var)
        ),
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


    Value::Object(my_json_props)
}




pub fn json_dependencies(
    dependencies: &HashMap<ComponentName, HashMap<StateVarReference, HashMap<InstructionName, Dependency>>>
) -> serde_json::Value {

    use serde_json::Value;
    use serde_json::json;

    let mut output: HashMap<String, HashMap<StateVarName, HashMap<String, Value>>> = HashMap::new();

    for (comp_name, comp_deps) in dependencies {
        for (state_var_name, state_var_deps) in comp_deps {

            for (instruct_name, instruction) in state_var_deps {

                let display_name = match instruction {
                    Dependency::Essential(_) => format!("{} (essential)", instruct_name),
                    Dependency::StateVar(_) => format!("{} (state var)", instruct_name),
                };


                let value = match instruction {
                    Dependency::Essential(ref essen_dep) => {
                        json!({
                            "depends_on_essential": essen_dep.depends_on_essential,
                        })
                    },
                    Dependency::StateVar(ref sv_dep) => {
                        let depends_on_objects: Vec<String> = sv_dep.depends_on_objects.iter().map(
                            |depends_on_obj| match depends_on_obj {
                                ObjectName::Component(comp_name) => comp_name.to_string(),
                                ObjectName::String(str) => format!("{} (str)", str),
                            }
                        ).collect();

                        json!({
                            "depends on objects": depends_on_objects,
                            "depends on state_vars": sv_dep.depends_on_state_vars,
                            "variables optional": sv_dep.variables_optional,
                        })
                    },
                };

                output
                    .entry(comp_name.clone()).or_insert(HashMap::new())
                    .entry(state_var_name.name().clone()).or_insert(HashMap::new())
                    .entry(display_name)
                    .or_insert(value);
                

            }
        }
    }

    serde_json::json!(output)
}
