use std::collections::HashMap;

use crate::ComponentName;
use crate::ComponentNode;
use crate::DependencyKey;
use crate::StateForStateVar;
use crate::Dependency;
use crate::component::*;
use crate::state::State;
use crate::state_variables::StateVarName;
use crate::state::EssentialStateVar;
use crate::EssentialDataOrigin;

use serde_json::{Value, Map, json};



/// Macros for logging.
macro_rules! log {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}
macro_rules! log_json {
    ( $label:expr, $a:expr ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_2(&$label.into(), &wasm_bindgen::JsValue::from_serde(&$a).unwrap());
    }
}
macro_rules! log_debug {
    ( $( $t:tt )* ) => {

        // #[cfg(all(feature = "web", feature = "web-debug-log"))]
        #[cfg(feature = "web")]
        web_sys::console::debug_1(&format!( $( $t )* ).into());

        // #[cfg(not(feature = "web"))]
        // println!( $( $t )* )
    }
}

pub(crate) use log;
pub(crate) use log_json;
pub(crate) use log_debug;



/// List components and children in a JSON array
pub fn json_components(
    components: &HashMap<ComponentName, ComponentNode>,
    component_states: &HashMap<ComponentName, HashMap<StateVarName, StateForStateVar>>
) -> Value {

    let json_components: Map<String, Value> = components
        .values()
        .map(|component| (component.name.to_string(),
                package_subtree_as_json(
                    &components,
                    &&component_states,
                    component)))
        .collect();

    Value::Object(json_components)
}


pub fn package_subtree_as_json(
    components: &HashMap<ComponentName, ComponentNode>,
    component_states: &HashMap<ComponentName, HashMap<StateVarName, StateForStateVar>>,
    component: &ComponentNode
) -> Value {


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


    let mut my_json_props: Map<String, Value> = Map::new();

    my_json_props.insert("children".to_owned(), json!(children));
    my_json_props.insert("parent".to_owned(),
        match component.parent {
            Some(ref parent_name) => Value::String(parent_name.into()),
            None => Value::Null,
        });
    my_json_props.insert("type".to_owned(), Value::String(component.definition.component_type.to_string()));
    my_json_props.insert("copySource".to_owned(),
        match &component.copy_source {
            Some(CopySource::Component(component_relative)) => Value::String(format!("{:?}", component_relative)),
            Some(CopySource::StateVar(component_slice_relative)) => Value::String(
                format!("{:?}", component_slice_relative)
            ),
            Some(CopySource::DynamicElement(source_name, math_expression, ..)) => Value::String(
                format!("{:?} {:?}", source_name, math_expression)
            ),
            Some(CopySource::MapSources(sources_name)) => Value::String(sources_name.to_string()),
            None => Value::Null,
        });

    for (static_attr_name, static_attr_val) in component.static_attributes.iter() {
        my_json_props.insert(
            format!("static attr {}", static_attr_name),
            Value::String(static_attr_val.to_string())
        );
    }

    let component_state = component_states.get(&component.name).unwrap();

    for &state_var_name in component.definition.state_var_definitions.keys() {

        let state_for_state_var = component_state.get(state_var_name).unwrap();
        match state_for_state_var {
            StateForStateVar::Single(state_var) => {
                my_json_props.insert(
                    format!("sv: {}", state_var_name),
                    serde_json::Value::Array(state_var.all_instances()
                        .iter().map(|x| serde_json::Value::from(x)).collect())
                );
            },


            StateForStateVar::Array { size, elements, .. } => {
                my_json_props.insert(

                    format!("sv: {} size", state_var_name),
        
                    serde_json::Value::Array(size.all_instances()
                        .iter().map(|x| serde_json::Value::from(x)).collect())
                );

                for (instance, elem) in elements.all_instances().iter().enumerate() {
                    for (id, element) in elem.iter().enumerate() {
                        my_json_props.insert(

                            format!("sv ({}): {} element {}", instance, state_var_name, id),

                            match element.get_state() {
                                State::Resolved(value) => value.into(),
                                State::Stale => Value::Null,
                            }
                        );
                    }
                }
            }

        }
    }

    Value::Object(my_json_props)
}




// pub fn json_dependencies(
//     dependencies: &HashMap<DependencyKey, Vec<Dependency>>,
// ) -> HashMap<String, Vec<Dependency>> {

//     dependencies
//         .iter()
//         .map(|(k, deps)| {
//             (format!("{:?}", k), deps.clone())
//         })
//         .collect()
// }


pub fn json_dependencies<'a>(
    dependencies: &'a HashMap<DependencyKey, Vec<Dependency>>,
) -> HashMap<String, HashMap<String, &'a Vec<Dependency>>> {

    let mut display_deps = HashMap::new();

    for (key, deps) in dependencies {
        let DependencyKey(component, state_var, instruction_name) = key;
        let display_key = format!("{}:{} \"{}\"", component, state_var, instruction_name);

        display_deps.entry(component.clone()).or_insert(HashMap::new())
            .entry(display_key).or_insert(deps.clone());

    }

    display_deps
}

pub fn json_essential_data(
    essential_data: &HashMap<ComponentName, HashMap<EssentialDataOrigin, EssentialStateVar>>,
) -> HashMap<String, HashMap<String, EssentialStateVar>> {
    essential_data.iter().map(|(comp, h)|
        (comp.clone(),
             h.iter().map(|(origin, var)| {
                let origin_name = format!("From {:?}", origin);
                (origin_name, var.clone())
             }).collect::<HashMap<String, EssentialStateVar>>()
        )
    ).collect()
}
