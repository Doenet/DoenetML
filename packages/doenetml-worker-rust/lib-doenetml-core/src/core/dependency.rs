use std::{cell::RefCell, collections::HashMap, ops::Deref, rc::Rc};

use crate::{
    attribute::AttributeName,
    components::{
        prelude::{ComponentState, StateVarIdx},
        ComponentEnum, ComponentNode, ComponentProfile,
    },
    state::{
        essential_state::{
            create_essential_data_for, EssentialDataOrigin, EssentialStateVar, InitialEssentialData,
        },
        StateVarPointer,
    },
    state::{StateVarName, StateVarValue, StateVarViewEnum},
    ComponentIdx, ComponentPointerTextOrMacro, ExtendSource,
};

/// A DataQuery is used to make a Dependency based on the input document structure
#[derive(Debug, Clone, Default)]
pub enum DataQuery {
    Child {
        /// The dependency will match child components that has at least one of these profiles
        /// unless the child component has one of the profiles in *exclude_if_prefer_profiles*
        /// ranked higher
        match_profiles: Vec<ComponentProfile>,

        // TODO: can we remove exclude_if_prefer_profiles?
        /// If a child component has one of these profiles ranked higher
        /// than any in *match_profiles*, then the child is not matched.
        exclude_if_prefer_profiles: Vec<ComponentProfile>,
    },
    StateVar {
        /// If None, state variable is from the component making the query.
        component_idx: Option<ComponentIdx>,

        /// The state variable from component_idx or component making the query.
        state_var_idx: StateVarIdx,
    },
    Parent {
        state_var_name: StateVarName,
    },
    AttributeChild {
        attribute_name: AttributeName,
        match_profiles: Vec<ComponentProfile>,
        // TODO: do we need to add exclude_if_prefer_profiles?
    },
    #[default]
    Essential,
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

impl TryFrom<&DependencySource> for StateVarPointer {
    type Error = &'static str;

    fn try_from(ds: &DependencySource) -> Result<Self, Self::Error> {
        match ds {
            DependencySource::StateVar {
                component_idx,
                state_var_idx,
            } => Ok(StateVarPointer {
                component_idx: *component_idx,
                state_var_idx: *state_var_idx,
            }),
            DependencySource::Essential { .. } => {
                Err("Cannot convert essential dependency source to a state variable pointer.")
            }
        }
    }
}

/// Gives both the source of the dependency and the current value of the dependency
#[derive(Debug)]
pub struct Dependency {
    pub source: DependencySource,
    pub value: StateVarViewEnum,
}

/// The vector of dependencies that were created for a `DataQuery`
#[derive(Debug)]
pub struct DependenciesCreatedForDataQuery(pub Vec<Dependency>);

impl Deref for DependenciesCreatedForDataQuery {
    type Target = Vec<Dependency>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// Information which update were requested so that we can recurse
/// and call *request_dependency_updates*
/// on the state variables of those dependencies.
///
/// The actual requested values for those dependencies were stored
/// in the *requested_value* field of their state variables.
#[derive(Debug)]
pub struct DependencyValueUpdateRequest {
    pub data_query_idx: usize,
    pub dependency_idx: usize,
}

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
        DataQuery::Essential => {
            // We recurse to extend source components so that this essential data
            // is shared with the extend source any any other components that extend from it.
            let source_idx = get_extend_source_origin(components, component_idx);

            let essential_origin = EssentialDataOrigin::StateVar(state_var_idx);

            let essential_data_view =
                if let Some(current_view) = essential_data[source_idx].get(&essential_origin) {
                    current_view.create_new_read_only_view()
                } else {
                    // Use the default value for the state variable and set came_from_default to true
                    let initial_data = components[component_idx]
                        .borrow()
                        .get_state_variable(state_var_idx)
                        .unwrap()
                        .return_default_value();

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
            // Create a dependency that references the value of state_var_name

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
        } => {
            // Create a dependency that references the profile state variable from all children
            // that match match_profiles before matching exclude_if_prefer_profiles.

            // Local enum to keep track of what children were found
            // before creating dependencies from this enum in the end.
            // Right now, it appears that the RelevantChild intermediate step is not needed,
            // as we could create dependencies from children as we encounter them.
            // However, the intermediate step will be needed when we parse math expressions
            // from children, so leave it in for now.
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

            // For each component child (including those from an extend source)
            // iterate through all its component profile state variables
            // to see if one matches matches_profile before one matches exclude_if_prefer_profiles.

            let children_info =
                get_children_with_parent_including_from_extend_source(components, component_idx);

            for child_info in children_info.iter() {
                match child_info {
                    (ComponentPointerTextOrMacro::Component(child_idx), parent_idx) => {
                        let child = components[*child_idx].borrow();

                        let mut child_matches_with_profile = None;
                        for child_profile_state_var in child.get_component_profile_state_variables()
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
                            let (state_var_view, sv_idx) =
                                profile_sv.into_state_variable_view_enum_and_idx();

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
                    (ComponentPointerTextOrMacro::Text(string_value), parent_idx) => {
                        // Text children are just strings, and they just match the String or Text profiles
                        if match_profiles.contains(&ComponentProfile::String)
                            || match_profiles.contains(&ComponentProfile::Text)
                        {
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

            if dependencies.is_empty() {
                // Found no matching children.
                // Create an essential dependency with the default_value for the state variable

                // Treat the essential data as though it came from the first string child
                // of the component, except recursing to extend source components
                // in order to share the essential data with the extend source.

                let source_idx = get_extend_source_origin(components, component_idx);

                let essential_origin = EssentialDataOrigin::StringChild(0);

                let essential_data_view =
                    if let Some(current_view) = essential_data[source_idx].get(&essential_origin) {
                        current_view.create_new_read_only_view()
                    } else {
                        let initial_data = components[source_idx]
                            .borrow()
                            .get_state_variable(state_var_idx)
                            .unwrap()
                            .return_default_value();

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
        } => {
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
                        ComponentPointerTextOrMacro::Component(child_idx) => components[*child_idx]
                            .borrow()
                            .get_component_profile_state_variables()
                            .into_iter()
                            .find_map(|child_profile_state_var| {
                                let child_profile = child_profile_state_var.get_matching_profile();

                                if match_profiles.contains(&child_profile) {
                                    Some(child_profile_state_var)
                                } else {
                                    None
                                }
                            })
                            .map(|profile_sv| {
                                let (state_var_view, sv_idx) =
                                    profile_sv.into_state_variable_view_enum_and_idx();

                                Dependency {
                                    source: DependencySource::StateVar {
                                        component_idx: *child_idx,
                                        state_var_idx: sv_idx,
                                    },
                                    value: state_var_view,
                                }
                            }),
                        ComponentPointerTextOrMacro::Text(string_value) => {
                            // Text children are just strings, and they just match the String or Text profiles
                            if match_profiles.contains(&ComponentProfile::String)
                                || match_profiles.contains(&ComponentProfile::Text)
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
                        _ => None,
                    }
                })
                .collect();

            if dependencies.is_empty() {
                // Found no matching attribute children.
                // This means that the component and any component extend sources do not have any attribute children.

                // Create an essential dependency with the default_value for the state variable
                // Treat the essential data as though it came from the first string attribute child
                // of the component, except recursing to extend source components
                // in order to share the essential data with the extend source.

                let source_idx = get_extend_source_origin(components, component_idx);

                let essential_origin = EssentialDataOrigin::AttributeChild(attribute_name, 0);

                let essential_data_view =
                    if let Some(current_view) = essential_data[source_idx].get(&essential_origin) {
                        current_view.create_new_read_only_view()
                    } else {
                        let initial_data = components[source_idx]
                            .borrow()
                            .get_state_variable(state_var_idx)
                            .unwrap()
                            .return_default_value();

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

/// Recurse until the name of the original source is found.
///
/// When we store essential data, we store it with this original source name,
/// allowing copies to share the same essential data as the source.
fn get_extend_source_origin(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> ComponentIdx {
    match &components[component_idx].borrow().get_extending() {
        Some(&ExtendSource::Component(source_idx)) => {
            get_extend_source_origin(components, source_idx)
        }
        _ => component_idx,
    }
}

/// Return a vector of (child, parent_idx) tuples from the children of a component
/// and children of any extend sources.
///
/// Since children from extend sources will have a different parent,
/// we include the parent index in the output.
fn get_children_with_parent_including_from_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> Vec<(ComponentPointerTextOrMacro, ComponentIdx)> {
    let component = components[component_idx].borrow();

    let mut children_vec =
        if let Some(&ExtendSource::Component(source_idx)) = component.get_extending() {
            get_children_with_parent_including_from_extend_source(components, source_idx)
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

/// Return the attribute children for `attribute`,
/// falling back to the attribute children of any extend source if none found for the component.
///
/// Returns an option of a tuple with components
/// - a vector of the attribute children found
/// - the index of the parent where those attribute children were found.
fn get_attribute_children_with_parent_falling_back_to_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
    attribute: AttributeName,
) -> Option<(Vec<ComponentPointerTextOrMacro>, ComponentIdx)> {
    let component = components[component_idx].borrow();

    component
        .get_attribute_children_for_attribute(attribute)
        .and_then(|attribute_children| {
            if attribute_children.is_empty() {
                if let Some(&ExtendSource::Component(source_idx)) = component.get_extending() {
                    return get_attribute_children_with_parent_falling_back_to_extend_source(
                        components, source_idx, attribute,
                    );
                }
            }
            Some((attribute_children.clone(), component_idx))
        })
}

pub trait TryIntoStateVar<'a, T> {
    type Error;

    fn try_into_state_var(&self) -> Result<T, Self::Error>;
}

impl<'a, T> TryIntoStateVar<'a, T> for &'a DependenciesCreatedForDataQuery
where
    T: TryFrom<&'a StateVarViewEnum>,
{
    type Error = T::Error;

    fn try_into_state_var(&self) -> Result<T, Self::Error> {
        if self.len() != 1 {
            panic!("Must have a single dependency. Got `{:?}`", &self);
            // return Err("Must have a single dependency");
        }
        (&self[0].value).try_into()
    }
}

impl<'a, T> TryIntoStateVar<'a, Vec<T>> for &'a DependenciesCreatedForDataQuery
where
    T: TryFrom<&'a StateVarViewEnum>,
{
    type Error = T::Error;

    fn try_into_state_var(&self) -> Result<Vec<T>, Self::Error> {
        self.iter().map(|dep| (&dep.value).try_into()).collect()
    }
}
