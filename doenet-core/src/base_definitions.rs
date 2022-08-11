use std::collections::HashMap;

use crate::state_variables::*;



macro_rules! number_definition_from_attribute {
    ( $attribute:expr, $default:expr, $has_essential:expr) => {
        {
            StateVarVariant::Number(StateVarDefinition {
                for_renderer: true,

                initial_essential_value: if $has_essential { Some($default) } else { None },

                return_dependency_instructions: |_| {
                    let attribute = DependencyInstruction::Attribute{
                        attribute_name: $attribute,
                        index: crate::state_variables::StateIndex::Basic,
                    };
                    HashMap::from([("attribute", attribute)])
                },

                determine_state_var_from_dependencies: |dependency_values| {
                    let attribute = dependency_values.get("attribute").unwrap();
                    if attribute.len() > 0 {
                        DETERMINE_NUMBER(attribute.clone())
                            .map(|x| crate::state_variables::StateVarUpdateInstruction::SetValue(x))
                    } else {
                        Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue($default) )
                    }
                },

                request_dependencies_to_update_value: |desired_value, _| {
                    DETERMINE_NUMBER_DEPENDENCIES(desired_value)
                },

                ..Default::default()
            })
        }
    }
}
pub(crate) use number_definition_from_attribute;


macro_rules! integer_definition_from_attribute {
    ( $attribute:expr, $default:expr, $has_essential:expr ) => {
        {
            StateVarVariant::Integer(StateVarDefinition {
                for_renderer: true,

                initial_essential_value: if $has_essential { Some($default) } else { None },

                return_dependency_instructions: |_| {
                    let attribute = DependencyInstruction::Attribute{
                        attribute_name: $attribute,
                        index: crate::state_variables::StateIndex::Basic,
                    };
                    HashMap::from([("attribute", attribute)])
                },

                determine_state_var_from_dependencies: |dependency_values| {
                    let attribute = dependency_values.get("attribute").unwrap();
                    if attribute.len() > 0 {
                        DETERMINE_NUMBER(attribute.clone())
                            .map(|x| crate::state_variables::StateVarUpdateInstruction::SetValue(x as i64))
                    } else {
                        Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue($default) )
                    }
                },

                request_dependencies_to_update_value: |desired_value, _| {
                    DETERMINE_INTEGER_DEPENDENCIES(desired_value)
                },

                ..Default::default()
            })
        }
    }
}
pub(crate) use integer_definition_from_attribute;

macro_rules! number_array_definition_from_attribute {
    ( $attribute:expr, $default:expr, $has_essential:expr, $default_size:expr) => {
        {
            StateVarVariant::NumberArray(StateVarArrayDefinition {

                initial_essential_element_value: if $has_essential { Some($default) } else { None },

                return_element_dependency_instructions: |i, _| {
                    let attribute = DependencyInstruction::Attribute{
                        attribute_name: $attribute,
                        index: crate::state_variables::StateIndex::Element(i),
                    };
                    HashMap::from([("attribute", attribute)])
                },

                determine_element_from_dependencies: |_, dependency_values| {
                    let attribute = dependency_values.get("attribute").unwrap();
                    if attribute.len() > 0 {
                        DETERMINE_NUMBER(attribute.clone())
                            .map(|x| crate::state_variables::StateVarUpdateInstruction::SetValue(x))
                    } else {
                        Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue($default) )
                    }
                },

                return_size_dependency_instructions: |_| {
                    let attribute = DependencyInstruction::Attribute{
                        attribute_name: $attribute,
                        index: crate::state_variables::StateIndex::SizeOf,
                    };
                    HashMap::from([("attribute", attribute)])
                },

                determine_size_from_dependencies: |dependency_values| {
                    let attribute = dependency_values.get("attribute").unwrap();
                    if attribute.len() > 0 {
                        let num = DETERMINE_NUMBER(attribute.clone())?;
                        if num > 0.0 {
                            Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue(num as usize) )
                        } else {
                            Err("negative size from attribute dependency values".to_string())
                        }
                    } else {
                        Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue($default_size) )
                    }
                },

                request_element_dependencies_to_update_value: |_, desired_value, _| {
                    HashMap::from([
                        ("attribute", vec![
                            DependencyValue {
                                source: DependencySource {
                                    component_type: "",
                                    state_var_name: "",    
                                },
                                value: desired_value.into(),
                            }
                        ])
                    ])
                },

                ..Default::default()
            })
        }
    }
}
pub(crate) use number_array_definition_from_attribute;

macro_rules! boolean_definition_from_attribute {
    ( $attribute:expr, $default:expr, $has_essential:expr ) => {
        {
            StateVarVariant::Boolean(StateVarDefinition {
                for_renderer: true,

                initial_essential_value: if $has_essential { Some($default) } else { None },

                return_dependency_instructions: |_| {
                    let attribute = DependencyInstruction::Attribute{
                        attribute_name: $attribute,
                        index: crate::state_variables::StateIndex::Basic,
                    };
                    HashMap::from([("attribute", attribute)])
                },

                determine_state_var_from_dependencies: |dependency_values| {
                    let attribute = dependency_values.get("attribute").unwrap();
                    if attribute.len() > 0 {
                        DETERMINE_BOOLEAN(attribute.clone())
                            .map(|x| crate::state_variables::StateVarUpdateInstruction::SetValue(x))
                    } else {
                        Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue($default) )
                    }
                },

                ..Default::default()
            })
        }
    }
}
pub(crate) use boolean_definition_from_attribute;


macro_rules! string_definition_from_attribute {
    ( $attribute:expr, $default:expr, $has_essential:expr ) => {
        {
            StateVarVariant::String(StateVarDefinition {
                for_renderer: true,

                initial_essential_value: if $has_essential { Some( $default.to_string() ) } else { None },

                return_dependency_instructions: |_| {
                    let attribute = DependencyInstruction::Attribute{
                        attribute_name: $attribute,
                        index: crate::state_variables::StateIndex::Basic,
                    };
                    HashMap::from([("attribute", attribute)])
                },

                determine_state_var_from_dependencies: |dependency_values| {
                    let attribute = dependency_values.get("attribute").unwrap();
                    if attribute.len() > 0 {
                        DETERMINE_STRING(attribute.clone())
                            .map(|x| crate::state_variables::StateVarUpdateInstruction::SetValue(x))
                    } else {
                        Ok ( crate::state_variables::StateVarUpdateInstruction::SetValue($default.to_string()) )
                    }
                },

                ..Default::default()
            })
        }
    }
}
pub(crate) use string_definition_from_attribute;




// Default functions for an essential depenency

#[allow(non_snake_case)]
pub fn USE_ESSENTIAL_DEPENDENCY_INSTRUCTION(
    _: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {
    HashMap::from([
        ("essential", DependencyInstruction::Essential)
    ])
}

#[allow(non_snake_case)]
pub fn DETERMINE_FROM_ESSENTIAL<T>(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> Result<StateVarUpdateInstruction<T>, String>
where
    T: TryFrom<StateVarValue> + Default,
    <T as TryFrom<StateVarValue>>::Error: std::fmt::Debug
{
    let essential = dependency_values.dep_value("essential")?;
    let essential = essential.has_zero_or_one_elements()?;
    let set_value = match essential.0 {
        Some(dep_value) => {
            T::try_from(dep_value.value.clone()).map_err(|e| format!("{:#?}", e))?
        },
        None => T::default(),
    };
    Ok( StateVarUpdateInstruction::SetValue( set_value ) )
}

#[allow(non_snake_case)]
pub fn REQUEST_ESSENTIAL_TO_UPDATE<T: Into<StateVarValue>>(desired_value: T, _: HashMap<InstructionName, Vec<DependencySource>>)
    -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("essential", vec![
            DependencyValue {
                source: DependencySource {
                    component_type: "essential_data",
                    state_var_name: "",    
                },
                value: desired_value.into(),
            }
        ])
    ])
}

/// Requires that the component has a parent with 'hidden' and a bool 'hide' attribute
#[allow(non_snake_case)]
pub fn HIDDEN_DEFAULT_DEFINITION() -> StateVarVariant {
    use StateVarUpdateInstruction::*;


    StateVarVariant::Boolean(StateVarDefinition {
        
        return_dependency_instructions: |_| {
            HashMap::from([
                ("parent_hidden", DependencyInstruction::Parent {
                    state_var: "hidden",
                }),
                ("my_hide", DependencyInstruction::Attribute {
                    attribute_name: "hide",
                    index: crate::state_variables::StateIndex::Basic,
                }),
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
            HashMap::from([("value_of_value", DependencyInstruction::StateVar {
                component_name: None,
                state_var: StateVarSlice::Single(StateRef::Basic("value"))
            })])
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
    boolean_definition_from_attribute!("disabled", false, false)
}


#[allow(non_snake_case)]
pub fn FIXED_DEFAULT_DEFINITION() -> StateVarVariant {
    StateVarVariant::Boolean(StateVarDefinition {     
        for_renderer: true,
        determine_state_var_from_dependencies: |_| Ok(StateVarUpdateInstruction::SetValue(false)),
        ..Default::default()
    })
}


#[allow(non_snake_case)]
pub fn DETERMINE_BOOLEAN(dependency_values: Vec<DependencyValue>)
    -> Result<bool, String> {

    let bool_child_value = match dependency_values.len() {
        1 => dependency_values.first(),
        _ => None,
    };

    if let Some(DependencyValue { value: StateVarValue::Boolean(value), .. }) = bool_child_value {
        return Ok(*value);
    }

    let textlike_children: Result<Vec<String>, &str> = dependency_values
        .iter()
        .map(|dep_value|
            String::try_from(dep_value.value.clone())
        ).collect();
    let textlike_children = textlike_children.map_err(|e| "Not all boolean children were strings: ".to_owned() + e)?;

    let mut concatted_text = String::from("");
    for textlike_child in textlike_children {
        concatted_text.push_str(&textlike_child);
    }

    let trimmed_text = concatted_text.trim().to_lowercase();

    Ok(trimmed_text == "true")
}

#[allow(non_snake_case)]
pub fn DETERMINE_NUMBER(dependency_values: Vec<DependencyValue>)
    -> Result<f64, String> {

    let mut concatted_children = String::new();
    for value in dependency_values {
        let str_child_val = match &value.value {
            StateVarValue::Number(num) => num.to_string(),
            StateVarValue::String(str) => str.to_string(),
            StateVarValue::Integer(num) => num.to_string(),
            _ => return Err("Invalid value for number".to_string())
        };

        concatted_children.push_str(&str_child_val);
    }

    // log!("concatted children {}", concatted_children);

    let num = if let Ok(num_result) = evalexpr::eval(&concatted_children) {
        num_result.as_number().unwrap_or(f64::NAN)
    } else {
        return Err(format!("Can't parse number values '{}' as math", concatted_children));
    };


    Ok(num)
}


#[allow(non_snake_case)]
pub fn DETERMINE_NUMBER_DEPENDENCIES(desired_value: f64)
    -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("attribute", vec![
            DependencyValue {
                source: DependencySource {
                    component_type: "number",
                    state_var_name: "",    
                },
                value: desired_value.into(),
            }
        ])
    ])
}

#[allow(non_snake_case)]
pub fn DETERMINE_INTEGER_DEPENDENCIES(desired_value: i64)
    -> HashMap<InstructionName, Vec<DependencyValue>> {
    HashMap::from([
        ("attribute", vec![
            DependencyValue {
                source: DependencySource {
                    component_type: "number",
                    state_var_name: "",    
                },
                value: desired_value.into(),
            }
        ])
    ])
}


#[allow(non_snake_case)]
pub fn DETERMINE_STRING(dependency_values: Vec<DependencyValue>)
    -> Result<String, String> {

    let mut val = String::new();
    for textlike_value_sv in dependency_values {
        
        val.push_str(& match &textlike_value_sv.value {
            StateVarValue::String(v)  => v.to_string(),
            StateVarValue::Boolean(v) => v.to_string(),
            StateVarValue::Integer(v) => v.to_string(),
            StateVarValue::Number(v)  => v.to_string(),
        });
    }

    Ok(val)
}
