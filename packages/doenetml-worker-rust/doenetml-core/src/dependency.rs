use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    component::{ComponentEnum, ComponentNode, ComponentProfile},
    essential_state::{
        create_essential_data_for, EssentialDataOrigin, EssentialStateVar, InitialEssentialData,
    },
    state::{StateVarName, StateVarReadOnlyView, StateVarValue},
    ComponentChild, ComponentIdx, ExtendSource, StateVarIdx,
};

/// A DependencyInstruction is used to make a Dependency based on the input document structure
#[derive(Debug)]
pub enum DependencyInstruction {
    Child {
        /// The dependency will match child components that has at least one of these profiles
        /// unless the child component has one of the profiles in *exclude_if_prefer_profiles*
        /// ranked higher
        match_profiles: Vec<ComponentProfile>,

        /// If a child component has one of these profiles ranked higher
        /// than any in *match_profiles*, then the child is not matched.
        exclude_if_prefer_profiles: Vec<ComponentProfile>,
    },
    StateVar {
        // TODO: will we need specify a particular component here?
        // For now, a StateVar dependency instruction will just get a state variable
        // from the given component
        // component_name: Option<ComponentName>,

        // Must match the name of a state variable
        state_var_name: StateVarName,
    },
    Parent {
        state_var_name: StateVarName,
    },
    // Attribute {
    //     attribute_name: AttributeName,
    //     default_value: StateVarValue,
    // },
    // Essential {
    //     /// Use the string of this attribute
    //     prefill: Option<AttributeName>,
    // },
}

// TODO: determine what the structure of DependencySource should be
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DependencySource {
    StateVar {
        // component_type: ComponentType,
        component_idx: ComponentIdx,
        state_var_idx: StateVarIdx,
    },
    Essential {
        component_idx: ComponentIdx,
        origin: EssentialDataOrigin,
        // value_type: &'static str,
    },
}

/// Gives both the source of the dependency and the current value of the dependency
///
/// Passed into *calculate_state_var_from_dependencies*
#[derive(Debug)]
pub struct Dependency {
    pub source: DependencySource,
    pub value: StateVarReadOnlyView,
}

/// Information which update were requested so that we can recurse
/// and call *request_dependencies_to_update_value*
/// on the state variables of those dependencies.
///
/// The actual requested values for those dependencies were stored
/// in the *requested_value* field of their state variables.
pub struct UpdatesRequested {
    pub instruction_idx: usize,
    pub dependency_idx: usize,
}

/// This function also creates essential data when a DependencyInstruction asks for it.
pub fn create_dependencies_from_instruction_initialize_essential(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
    state_var_idx: usize,
    instruction: &DependencyInstruction,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    should_initialize_essential_data: bool,
) -> Vec<Dependency> {
    // log!("Creating dependency {}:{} from instruction {:?}", component_name, state_var_idx, instruction);

    match instruction {
        DependencyInstruction::StateVar { state_var_name } => {
            // For now, use component_idx as haven't create a way to grab another component
            let comp_idx = component_idx;

            let mut comp = components[comp_idx].borrow_mut();

            let sv_idx = comp
                .get_state_variable_index_from_name(&state_var_name.to_string())
                .expect(&format!("Invalid state variable 1: {}", state_var_name));

            vec![Dependency {
                source: DependencySource::StateVar {
                    component_idx: comp_idx,
                    state_var_idx: sv_idx,
                },
                value: comp.get_state_variables()[sv_idx].create_new_read_only_view(),
            }]
        }

        DependencyInstruction::Parent { state_var_name } => {
            let component = components[component_idx].borrow();
            let parent_idx = component
                .get_parent()
                .expect("Component asks for a parent but there is none.");

            let mut parent = components[parent_idx].borrow_mut();

            let sv_idx = parent
                .get_state_variable_index_from_name(&state_var_name.to_string())
                .expect(&format!("Invalid state variable 2: {}", state_var_name));

            vec![Dependency {
                source: DependencySource::StateVar {
                    component_idx: parent_idx,
                    state_var_idx: sv_idx,
                },
                value: parent.get_state_variables()[sv_idx].create_new_read_only_view(),
            }]
        }

        DependencyInstruction::Child {
            match_profiles,
            exclude_if_prefer_profiles,
        } => {
            enum RelevantChild<'a> {
                StateVar {
                    dependency: Dependency,
                    parent: ComponentIdx,
                },
                String {
                    value: &'a String,
                    parent: ComponentIdx,
                },
            }

            let mut relevant_children: Vec<RelevantChild> = Vec::new();

            let source_idx =
                get_recursive_extend_source_component_when_exists(components, component_idx);
            let source = components[source_idx].borrow();

            if let Some(&ExtendSource::StateVar((comp_idx, sv_idx))) = source.get_extend() {
                // copying a state var means we don't inherit its children,
                // so we depend on it directly

                let mut comp_of_state_var = components[comp_idx].borrow_mut();

                let state_var_dep = Dependency {
                    source: DependencySource::StateVar {
                        component_idx: comp_idx,
                        state_var_idx: sv_idx,
                    },
                    value: comp_of_state_var.get_state_variables()[sv_idx]
                        .create_new_read_only_view(),
                };

                relevant_children.push(RelevantChild::StateVar {
                    dependency: state_var_dep,
                    parent: source_idx,
                });
            }

            let children_info =
                get_children_info_including_from_extend_source(components, component_idx);

            for child_info in children_info.iter() {
                match child_info {
                    (ComponentChild::Component(child_idx), parent_idx) => {
                        let child = components[*child_idx].borrow();

                        let mut child_matches_with_profile = None;
                        for child_profile_state_var in
                            child.get_component_profile_state_variables().iter()
                        {
                            let child_profile = child_profile_state_var.get_matching_profile();

                            if match_profiles.contains(&child_profile) {
                                child_matches_with_profile = Some(child_profile_state_var);
                                break;
                            } else if exclude_if_prefer_profiles.contains(&child_profile) {
                                break;
                            }
                        }

                        if let Some(profile_sv) = child_matches_with_profile {
                            let (state_var_view, sv_name) =
                                profile_sv.return_untyped_state_variable_view_and_name();

                            let sv_idx = child
                                .get_state_variable_index_from_name(&sv_name.to_string())
                                .expect(&format!("Invalid state variable 3: {}", sv_name));

                            let state_var_dep = Dependency {
                                source: DependencySource::StateVar {
                                    component_idx: *child_idx,
                                    state_var_idx: sv_idx,
                                },
                                value: state_var_view,
                            };

                            relevant_children.push(RelevantChild::StateVar {
                                dependency: state_var_dep,
                                parent: *parent_idx,
                            });
                        }
                    }
                    (ComponentChild::Text(string_value), parent_idx) => {
                        if match_profiles.contains(&ComponentProfile::Text) {
                            relevant_children.push(RelevantChild::String {
                                value: string_value,
                                parent: *parent_idx,
                            });
                        }
                    }
                    _ => (),
                }
            }

            let mut dependencies = Vec::new();

            // Stores how many string children added per parent.
            let mut essential_data_numbering: HashMap<ComponentIdx, usize> = HashMap::new();

            for relevant_child in relevant_children {
                match relevant_child {
                    RelevantChild::StateVar {
                        dependency: child_dep,
                        ..
                    } => {
                        dependencies.push(child_dep);
                    }

                    RelevantChild::String {
                        value: string_value,
                        parent: actual_parent_idx,
                    } => {
                        let index = essential_data_numbering
                            .entry(actual_parent_idx)
                            .or_insert(0 as usize);

                        let essential_origin = EssentialDataOrigin::StringChild(*index);

                        // TODO: ignoring should_initialize_essential_data
                        // Do we need to do something different if it is false?

                        let essential_data_view = if let Some(current_view) =
                            essential_data[actual_parent_idx].get(&essential_origin)
                        {
                            current_view.create_new_read_only_view()
                        } else {
                            let value = StateVarValue::String(string_value.clone());
                            let new_view = create_essential_data_for(
                                actual_parent_idx,
                                essential_origin.clone(),
                                InitialEssentialData::Single {
                                    value,
                                    used_default: false,
                                },
                                essential_data,
                            );
                            new_view.create_new_read_only_view()
                        };

                        dependencies.push(Dependency {
                            source: DependencySource::Essential {
                                component_idx: actual_parent_idx,
                                origin: essential_origin,
                            },
                            value: essential_data_view,
                        });

                        *index += 1;
                    }
                }
            }

            dependencies
        }
    }
}

/// Recurse until the name of the original source is found.
/// This allows copies to share essential data.
fn get_recursive_extend_source_component_when_exists(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> ComponentIdx {
    match &components[component_idx].borrow().get_extend() {
        Some(&ExtendSource::Component(source_idx)) => {
            get_recursive_extend_source_component_when_exists(components, source_idx)
        }
        _ => component_idx,
    }
}

fn get_children_info_including_from_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> Vec<(ComponentChild, ComponentIdx)> {
    let component = components[component_idx].borrow();

    let mut children_vec =
        if let Some(&ExtendSource::Component(source_idx)) = component.get_extend() {
            get_children_info_including_from_extend_source(components, source_idx)
        } else {
            Vec::new()
        };

    children_vec.extend(
        component
            .get_children()
            .iter()
            .map(|c| (c.clone(), component_idx)),
    );

    children_vec
}
