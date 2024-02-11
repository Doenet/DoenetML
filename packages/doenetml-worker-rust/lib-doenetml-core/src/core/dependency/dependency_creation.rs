use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    components::{
        prelude::{ComponentState, StateVarIdx, StateVarValue, UntaggedContent},
        ComponentEnum, ComponentNode, ComponentProfile,
    },
    state::essential_state::{
        create_essential_data_for, EssentialDataOrigin, EssentialStateVar, InitialEssentialData,
    },
    ComponentIdx,
};

use super::{
    dependency_creation_utils::{
        create_dependency_from_extend_source_if_matches_profile,
        get_attribute_children_with_parent_falling_back_to_extend_source,
        get_children_with_parent_including_from_extend_source, get_component_extend_source_origin,
    },
    DataQuery, DependenciesCreatedForDataQuery, Dependency, DependencySource,
};

/// Create the dependencies specified by the data query
/// by finding elements in the document that match.
///
/// If an data query asks for essential data, create it and add it to *essential_data*.
pub fn create_dependencies_from_data_query_initialize_essential(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
    state_var_idx: StateVarIdx,
    query: &DataQuery,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
) -> DependenciesCreatedForDataQuery {
    match query {
        DataQuery::PreliminaryValue => {
            // We recurse to extend source components so that this preliminary value data
            // is shared with the extend source of any other components that extend from it.
            let source_idx = get_component_extend_source_origin(components, component_idx);

            let essential_origin = EssentialDataOrigin::StateVarPreliminaryValue(state_var_idx);

            let essential_data_view =
                if let Some(current_view) = essential_data[source_idx].get(&essential_origin) {
                    current_view.create_new_read_only_view()
                } else {
                    // Use the default value for the state variable and set came_from_default to true
                    let initial_data = components[component_idx]
                        .borrow()
                        .get_state_variable(state_var_idx)
                        .unwrap()
                        .default();

                    let initial_data = InitialEssentialData::Single {
                        value: initial_data,
                        came_from_default: true,
                    };

                    let new_view = create_essential_data_for(
                        source_idx,
                        essential_origin.clone(),
                        initial_data,
                        essential_data,
                    );

                    new_view.create_new_read_only_view()
                };

            DependenciesCreatedForDataQuery(vec![Dependency {
                source: DependencySource::Essential {
                    component_idx: source_idx,
                    origin: essential_origin,
                },
                value: essential_data_view,
            }])
        }

        DataQuery::StateVar {
            component_idx: comp_idx,
            state_var_idx: sv_idx,
        } => {
            // Create a dependency that references the value of sv_idx from comp_idx

            let comp_idx = comp_idx.unwrap_or(component_idx);

            let comp = components[comp_idx].borrow();

            DependenciesCreatedForDataQuery(vec![Dependency {
                source: DependencySource::StateVar {
                    component_idx: comp_idx,
                    state_var_idx: *sv_idx,
                },
                value: comp
                    .get_state_variable(*sv_idx)
                    .unwrap()
                    .create_new_read_only_view(),
            }])
        }

        DataQuery::Parent { state_var_name } => {
            // Create a dependency that references the value of state_var_name
            // from the parent of this component

            let component = components[component_idx].borrow();
            let parent_idx = component
                .get_parent()
                .expect("Component asks for a parent but there is none.");

            let parent = components[parent_idx].borrow();

            let sv_idx = parent
                .get_state_variable_index_from_name(state_var_name)
                .unwrap_or_else(|| panic!("Invalid state variable 2: {}", state_var_name));

            DependenciesCreatedForDataQuery(vec![Dependency {
                source: DependencySource::StateVar {
                    component_idx: parent_idx,
                    state_var_idx: sv_idx,
                },
                value: parent
                    .get_state_variable(sv_idx)
                    .unwrap()
                    .create_new_read_only_view(),
            }])
        }

        DataQuery::Child {
            match_profiles,
            exclude_if_prefer_profiles,
            always_return_value,
        } => {
            let always_return_value = *always_return_value;

            // Create a dependency from all children
            // that match a profile from match_profiles before matching exclude_if_prefer_profiles.
            // The dependency for each child will be a view of the matching state variable.

            /// Local enum to keep track of what children were found
            /// before creating dependencies from this enum in the end.
            /// Right now, it appears that the RelevantChild intermediate step is not needed,
            /// as we could create dependencies from children as we encounter them.
            /// However, the intermediate step will be needed when we parse math expressions
            /// from children, so leave it in for now.
            enum RelevantChild<'a> {
                StateVar {
                    dependency: Dependency,
                    _parent: ComponentIdx,
                },
                String {
                    value: &'a String,
                    parent: ComponentIdx,
                },
            }

            let mut relevant_children: Vec<RelevantChild> = Vec::new();

            // We address two possible extend sources
            // 1. If there is a state variable extend source extending this state variable,
            //    and that state variable matches `match_profiles`, then the first dependency
            //    will be that state variable.
            // 2. If, instead, there is a component extend source, then include the children
            //    from the extend source in the list of children (starting with extend source children)

            let mut dependencies = Vec::new();

            // First check if there is a matching a state variable extend source
            match create_dependency_from_extend_source_if_matches_profile(
                components[component_idx].borrow().get_extending(),
                state_var_idx,
                match_profiles,
                components,
            ) {
                Some(dependency) => dependencies.push(dependency),
                None => (),
            }

            // To address a potential component extend source, we get all children,
            // including those from a component extend source.
            let children_info =
                get_children_with_parent_including_from_extend_source(components, component_idx);

            for child_info in children_info.iter() {
                match child_info {
                    (UntaggedContent::Ref(child_idx), parent_idx) => {
                        let child = components[*child_idx].borrow();

                        // Iterate through all the child's component profile state variables
                        // to see if one matches matches_profile before one matches exclude_if_prefer_profiles.

                        let mut child_matches_with_sv = None;

                        for sv_idx in child.get_component_profile_state_variable_indices() {
                            let child_sv = child.get_state_variable(sv_idx).unwrap();
                            let child_profile = child_sv.get_matching_component_profile();

                            if match_profiles.contains(&child_profile) {
                                child_matches_with_sv =
                                    Some((child_sv.create_new_read_only_view(), sv_idx));
                                break;
                            } else if exclude_if_prefer_profiles.contains(&child_profile) {
                                break;
                            }
                        }

                        if let Some((state_var_view, sv_idx)) = child_matches_with_sv {
                            let state_var_dep = Dependency {
                                source: DependencySource::StateVar {
                                    component_idx: *child_idx,
                                    state_var_idx: sv_idx,
                                },
                                value: state_var_view,
                            };

                            relevant_children.push(RelevantChild::StateVar {
                                dependency: state_var_dep,
                                _parent: *parent_idx,
                            });
                        }
                    }
                    (UntaggedContent::Text(string_value), parent_idx) => {
                        // Text children are just strings, and they just match the String or LiteralString profiles
                        if match_profiles.contains(&ComponentProfile::String)
                            || match_profiles.contains(&ComponentProfile::LiteralString)
                        {
                            relevant_children.push(RelevantChild::String {
                                value: string_value,
                                parent: *parent_idx,
                            });
                        }
                    }
                }
            }

            // Stores how many string children added per parent.
            // Use it to generate the index for the EssentialDataOrigin so it points to the right string child
            let mut essential_data_numbering: HashMap<ComponentIdx, usize> = HashMap::new();

            for relevant_child in relevant_children {
                match relevant_child {
                    RelevantChild::StateVar {
                        dependency: child_dep,
                        ..
                    } => {
                        dependencies.push(child_dep);
                    }

                    // For string children, we create an essential datum for them
                    // so that they can be added to the dependency graph.
                    RelevantChild::String {
                        value: string_value,
                        parent: actual_parent_idx,
                    } => {
                        let index = essential_data_numbering
                            .entry(actual_parent_idx)
                            .or_insert(0_usize);

                        let essential_origin = EssentialDataOrigin::StringChild(*index);

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
                                    came_from_default: false,
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

            if always_return_value && dependencies.is_empty() {
                // Found no matching children.
                // Create an essential dependency with the default_value for the state variable

                // For the essential data origin, recurse to extend source components
                // in order to share the essential data with the extend source.
                let source_idx = get_component_extend_source_origin(components, component_idx);
                let essential_origin = EssentialDataOrigin::ChildSubstitute(state_var_idx);

                let essential_data_view = if let Some(current_view) =
                    essential_data[source_idx].get(&essential_origin)
                {
                    current_view.create_new_read_only_view()
                } else {
                    let source_comp = components[source_idx].borrow();
                    let source_state_var = source_comp.get_state_variable(state_var_idx).unwrap();

                    // If the state variable of state_var_idx is in match_profiles,
                    // then create a variable of the same type with the state variable's default value.
                    // Note: the type of essential variable created, below,
                    // depends on the type of the initial value.
                    let initial_data = if match_profiles
                        .contains(&source_state_var.get_matching_component_profile())
                    {
                        source_state_var.default()
                    } else {
                        // Since the state variable wasn't in match_profiles,
                        // create a state variable of the type from the first match_profile
                        // and use the default value associated with that type
                        match_profiles[0].default()
                    };

                    let new_view = create_essential_data_for(
                        source_idx,
                        essential_origin.clone(),
                        InitialEssentialData::Single {
                            value: initial_data,
                            came_from_default: true,
                        },
                        essential_data,
                    );
                    new_view.create_new_read_only_view()
                };

                dependencies.push(Dependency {
                    source: DependencySource::Essential {
                        component_idx: source_idx,
                        origin: essential_origin,
                    },
                    value: essential_data_view,
                });
            }

            DependenciesCreatedForDataQuery(dependencies)
        }

        DataQuery::AttributeChild {
            attribute_name,
            match_profiles,
            always_return_value,
        } => {
            let always_return_value = *always_return_value;

            // Create a dependency from all attribute children
            // that match a profile from match_profiles.
            // The dependency for each child will be a view of the matching state variable.

            let (attribute_children, parent_idx) =
                get_attribute_children_with_parent_falling_back_to_extend_source(
                    components,
                    component_idx,
                    attribute_name,
                )
                .unwrap_or_else(|| {
                    panic!(
                        "Invalid attribute {} for component of type {}",
                        attribute_name,
                        components[component_idx].borrow().get_component_type()
                    );
                });

            // Stores how many string children added.
            // Use it to generate the index for the EssentialDataOrigin so it points to the right string child
            let mut essential_data_index = 0;

            let mut dependencies: Vec<_> = attribute_children
                .iter()
                .filter_map(|child| {
                    match child {
                        UntaggedContent::Ref(child_idx) => {
                            let child_comp = components[*child_idx].borrow();

                            child_comp
                                .get_component_profile_state_variable_indices()
                                .into_iter()
                                .find_map(|sv_idx| {
                                    let child_sv = child_comp.get_state_variable(sv_idx).unwrap();
                                    let child_profile = child_sv.get_matching_component_profile();

                                    if match_profiles.contains(&child_profile) {
                                        Some(Dependency {
                                            source: DependencySource::StateVar {
                                                component_idx: *child_idx,
                                                state_var_idx: sv_idx,
                                            },
                                            value: child_sv.create_new_read_only_view(),
                                        })
                                    } else {
                                        None
                                    }
                                })
                        }
                        UntaggedContent::Text(string_value) => {
                            // Text children are just strings, and they just match the String or LiteralString profiles
                            if match_profiles.contains(&ComponentProfile::String)
                                || match_profiles.contains(&ComponentProfile::LiteralString)
                            {
                                let essential_origin = EssentialDataOrigin::AttributeChild(
                                    attribute_name,
                                    essential_data_index,
                                );
                                essential_data_index += 1;

                                // Essential data is from parent_idx, so it will be shared with the extend_source
                                // if the children came from an extend_source
                                let essential_data_view = if let Some(current_view) =
                                    essential_data[parent_idx].get(&essential_origin)
                                {
                                    current_view.create_new_read_only_view()
                                } else {
                                    let value = StateVarValue::String(string_value.clone());
                                    let new_view = create_essential_data_for(
                                        parent_idx,
                                        essential_origin.clone(),
                                        InitialEssentialData::Single {
                                            value,
                                            came_from_default: false,
                                        },
                                        essential_data,
                                    );
                                    new_view.create_new_read_only_view()
                                };

                                Some(Dependency {
                                    source: DependencySource::Essential {
                                        component_idx: parent_idx,
                                        origin: essential_origin,
                                    },
                                    value: essential_data_view,
                                })
                            } else {
                                None
                            }
                        }
                    }
                })
                .collect();

            if always_return_value && dependencies.is_empty() {
                // Found no matching attribute children.
                // This means that the component and any component extend sources do not have any attribute children.

                // For the essential data origin, recurse to extend source components
                // in order to share the essential data with the extend source.
                let source_idx = get_component_extend_source_origin(components, component_idx);
                let essential_origin =
                    EssentialDataOrigin::AttributeChildSubstitute(attribute_name, state_var_idx);

                let essential_data_view = if let Some(current_view) =
                    essential_data[source_idx].get(&essential_origin)
                {
                    current_view.create_new_read_only_view()
                } else {
                    let source_comp = components[source_idx].borrow();
                    let source_state_var = source_comp.get_state_variable(state_var_idx).unwrap();

                    // If the state variable of state_var_idx is in match_profiles,
                    // then create a variable of the same type with the state variable's default value.
                    // Note: the type of essential variable created, below,
                    // depends on the type of the initial value.
                    let initial_data = if match_profiles
                        .contains(&source_state_var.get_matching_component_profile())
                    {
                        source_state_var.default()
                    } else {
                        // Since the state variable wasn't in match_profiles,
                        // create a state variable of the type from the first match_profile
                        // and use the default value associated with that type
                        match_profiles[0].default()
                    };

                    let new_view = create_essential_data_for(
                        source_idx,
                        essential_origin.clone(),
                        InitialEssentialData::Single {
                            value: initial_data,
                            came_from_default: true,
                        },
                        essential_data,
                    );
                    new_view.create_new_read_only_view()
                };

                dependencies.push(Dependency {
                    source: DependencySource::Essential {
                        component_idx: source_idx,
                        origin: essential_origin,
                    },
                    value: essential_data_view,
                });
            }

            DependenciesCreatedForDataQuery(dependencies)
        }
    }
}
