use std::{
    cell::RefCell,
    collections::{HashMap, HashSet},
    rc::Rc,
};

use crate::{
    component::{ComponentEnum, ComponentNode, RenderedComponentNode},
    dependency::{
        create_dependencies_from_instruction_initialize_essential, Dependency,
        DependencyInstruction, DependencySource, DependencyUpdatesRequested,
    },
    essential_state::{EssentialDataOrigin, EssentialStateDescription, EssentialStateVar},
    state::{Freshness, StateVarValue},
    ComponentChild, ComponentIdx, ComponentStateDescription, ExtendSource,
};

/// Internal structure used to track changes
#[derive(Debug, Clone)]
pub enum StateVariableUpdateRequest {
    SetEssentialValue(EssentialStateDescription),
    SetStateVar(ComponentStateDescription),
}

/// Used to save the state in the middle of a calculation while freshening a state variable.
/// Placed on a stack in order to implement recursion using a stack on the heap.
///
/// (When created documents so that had to recurse thousands of times,
/// it would overflow the small stack created by WASM.
/// One could alternatively increase the wasm stack size and use regular function recursion.)
#[derive(Debug)]
pub enum StateVarCalculationState {
    Unresolved(UnresolvedCalculationState),
    Stale(StaleCalculationState),
}

/// The state needed to save the partial progress made while a state variable is still unresolved.
///
/// Since unresolved means that we have not calculated all dependencies,
/// we store the dependencies we have created so far, if any.
#[derive(Debug)]
pub struct UnresolvedCalculationState {
    component_state: ComponentStateDescription,
    instruction_idx: usize,
    val_idx: usize,
    dependency_instructions: Option<Vec<DependencyInstruction>>,
    instruct_dependencies: Option<Vec<Dependency>>,
    dependencies_for_state_var: Option<Vec<Vec<Dependency>>>,
}

/// The state needed to save the partial progress of a state variable that is resolved but still stale.
///
/// Since it is resolved, all dependencies have been calculated, so we just need to keep track
/// of which instruction and value from the dependencies we are freshening.
#[derive(Debug)]
pub struct StaleCalculationState {
    component_state: ComponentStateDescription,
    instruction_idx: usize,
    val_idx: usize,
}

/// Freshen all the state variables for a component that are designated as rendered
/// and recurse to rendered children.
///
/// Returns a vector of the indices of the components reached.
pub fn freshen_renderer_state_for_component(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarCalculationState>,
    should_initialize_essential_data: bool,
) -> Vec<usize> {
    let rendered_state_var_indices = components[component_idx]
        .borrow()
        .get_rendered_state_variable_indices()
        .clone();

    let mut components_freshened = Vec::new();

    for state_var_idx in rendered_state_var_indices {
        let component_state = ComponentStateDescription {
            component_idx,
            state_var_idx,
        };
        freshen_state_var(
            component_state,
            components,
            dependencies,
            dependent_on_state_var,
            dependent_on_essential,
            essential_data,
            freshen_stack,
            should_initialize_essential_data,
        );
    }

    components_freshened.push(component_idx);

    for child_idx in
        get_non_string_rendered_children_including_from_extend(component_idx, components)
    {
        let new_components_freshened = freshen_renderer_state_for_component(
            child_idx,
            components,
            dependencies,
            dependent_on_state_var,
            dependent_on_essential,
            essential_data,
            freshen_stack,
            should_initialize_essential_data,
        );

        components_freshened.extend(new_components_freshened);
    }

    components_freshened
}

/// Returns a vector of the component indices of all rendered children that are elements.
///
/// If the component extends another component, the children from the extend source come first.
fn get_non_string_rendered_children_including_from_extend(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
) -> Vec<ComponentIdx> {
    // TODO: the behavior of this function should mirror the .to_flat_dast method
    // of the RenderedComponent trait.
    // Is there a way to specify the behavior in one place so they cannot diverge and cause bugs?
    // Perhaps, components cannot override the whole .to_flat_dast method, but just pieces
    // such as determining the data sent.
    // And, if they override the behavior is should be through methods called in both places,
    // like the .get_rendered_children method.

    let component = components[component_idx].borrow_mut();

    let mut children = if let Some(&ExtendSource::Component(source_idx)) = component.get_extend() {
        get_non_string_rendered_children_including_from_extend(source_idx, components)
    } else {
        Vec::new()
    };

    let mut children2 = component
        .get_rendered_children()
        .iter()
        .filter_map(|child| match child {
            &ComponentChild::Component(comp_idx) => Some(comp_idx),
            _ => None,
        })
        .collect();

    children.append(&mut children2);

    children
}

/// If the state variable specified by original_component_state is stale or unresolved,
/// then freshen the variable, resolving its dependencies if necessary.
///
/// If the state variable was not fresh, then recurse to its dependencies to freshen them.
pub fn freshen_state_var(
    original_component_state: ComponentStateDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarCalculationState>,
    should_initialize_essential_data: bool,
) -> () {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // This approach was chosen because the function recursion implementation would overflow
    // the small WASM stack once it recursed a few thousands of times.
    // An alternative approach would be to increase the size of the WASM stack.
    // This approach was chosen because it is relatively easy to produce documents
    // with thousands of levels in the dependency graph, and it wasn't clear what
    // size WASM stack would be appropriate.

    let current_freshness = components[original_component_state.component_idx]
        .borrow()
        .get_state_variables()[original_component_state.state_var_idx]
        .get_freshness();

    let initial_calculation_state = match current_freshness {
        // No need to do anything if the state var is already fresh
        Freshness::Fresh => return (),
        Freshness::Unresolved => StateVarCalculationState::Unresolved(UnresolvedCalculationState {
            component_state: original_component_state,
            instruction_idx: 0,
            val_idx: 0,
            dependency_instructions: None,
            instruct_dependencies: None,
            dependencies_for_state_var: None,
        }),
        Freshness::Stale => StateVarCalculationState::Stale(StaleCalculationState {
            component_state: original_component_state.clone(),
            instruction_idx: 0,
            val_idx: 0,
        }),
    };

    freshen_stack.push(initial_calculation_state);

    'stack_loop: while let Some(calculation_state) = freshen_stack.pop() {
        match calculation_state {
            StateVarCalculationState::Unresolved(unresolved_state) => {
                let component_state = unresolved_state.component_state;

                let component_idx = component_state.component_idx;
                let state_var_idx = component_state.state_var_idx;

                let dependency_instructions =
                    unresolved_state.dependency_instructions.unwrap_or_else(|| {
                        let component = components[component_idx].borrow();
                        component.get_state_variables()[state_var_idx]
                            .return_dependency_instructions(component.get_extend())
                    });

                let mut dependencies_for_state_var = unresolved_state
                    .dependencies_for_state_var
                    .unwrap_or_else(|| Vec::with_capacity(dependency_instructions.len()));

                let mut carryover_instruct_dependencies = unresolved_state.instruct_dependencies;

                // Stack implementation note:
                // In order to start with instruction from instruction_idx
                // and value from val_idx, we initially skip val_idx values
                // and then set initial_val_idx to zero to not skip values on further instructions.
                let mut initial_val_idx = unresolved_state.val_idx;

                for (instruction_idx, dep_instruction) in dependency_instructions
                    .iter()
                    .enumerate()
                    .skip(unresolved_state.instruction_idx)
                {
                    let mut initial_creation_of_deps = false;

                    let instruct_dependencies =
                        carryover_instruct_dependencies.unwrap_or_else(|| {
                            initial_creation_of_deps = true;
                            create_dependencies_from_instruction_initialize_essential(
                                components,
                                component_idx,
                                state_var_idx,
                                dep_instruction,
                                essential_data,
                                should_initialize_essential_data,
                            )
                        });
                    carryover_instruct_dependencies = None;

                    if initial_creation_of_deps {
                        // If we just created the dependencies, above,
                        // then we need to add these dependencies to the inverse graph:
                        // dependent_on_state_var or dependent_on_essential.
                        for dep in instruct_dependencies.iter() {
                            match &dep.source {
                                DependencySource::StateVar {
                                    component_idx: inner_comp_idx,
                                    state_var_idx: inner_sv_idx,
                                } => {
                                    let vec_dep = &mut dependent_on_state_var[*inner_comp_idx];
                                    vec_dep[*inner_sv_idx].push(ComponentStateDescription {
                                        component_idx,
                                        state_var_idx,
                                    });
                                }
                                DependencySource::Essential {
                                    component_idx: inner_comp_idx,
                                    origin,
                                } => {
                                    let vec_dep = dependent_on_essential[*inner_comp_idx]
                                        .entry(origin.clone())
                                        .or_insert(Vec::new());
                                    vec_dep.push(ComponentStateDescription {
                                        component_idx,
                                        state_var_idx,
                                    });
                                }
                            }
                        }
                    }

                    for (val_idx, dep) in instruct_dependencies
                        .iter()
                        .enumerate()
                        .skip(initial_val_idx)
                    {
                        if let DependencySource::StateVar {
                            component_idx: comp_idx_inner,
                            state_var_idx: sv_idx_inner,
                        } = &dep.source
                        {
                            let new_component_state = ComponentStateDescription {
                                component_idx: *comp_idx_inner,
                                state_var_idx: *sv_idx_inner,
                            };

                            let new_current_freshness = dep.value.get_freshness();

                            match new_current_freshness {
                                // No need to recurse if the state var of the dependency is already fresh
                                // so don't do anything to just continue the inner loop
                                Freshness::Fresh => (),
                                Freshness::Unresolved => {
                                    // Recurse by putting two items on the stack
                                    // and then continuing at start of stack loop
                                    freshen_stack.push(StateVarCalculationState::Unresolved(
                                        UnresolvedCalculationState {
                                            component_state,
                                            instruction_idx,
                                            val_idx,
                                            dependency_instructions: Some(dependency_instructions),
                                            instruct_dependencies: Some(instruct_dependencies),
                                            dependencies_for_state_var: Some(
                                                dependencies_for_state_var,
                                            ),
                                        },
                                    ));
                                    freshen_stack.push(StateVarCalculationState::Unresolved(
                                        UnresolvedCalculationState {
                                            component_state: new_component_state,
                                            instruction_idx: 0,
                                            val_idx: 0,
                                            dependency_instructions: None,
                                            instruct_dependencies: None,
                                            dependencies_for_state_var: None,
                                        },
                                    ));

                                    // break out of the inner loop and continue to outer loop,
                                    // which will result in first popping off the last instruction
                                    // that we added to the stack
                                    continue 'stack_loop;
                                }
                                Freshness::Stale => {
                                    // Recurse by putting two items on the stack
                                    // and then continuing at start of stack loop
                                    freshen_stack.push(StateVarCalculationState::Unresolved(
                                        UnresolvedCalculationState {
                                            component_state,
                                            instruction_idx,
                                            val_idx,
                                            dependency_instructions: Some(dependency_instructions),
                                            instruct_dependencies: Some(instruct_dependencies),
                                            dependencies_for_state_var: Some(
                                                dependencies_for_state_var,
                                            ),
                                        },
                                    ));
                                    freshen_stack.push(StateVarCalculationState::Stale(
                                        StaleCalculationState {
                                            component_state: new_component_state,
                                            instruction_idx: 0,
                                            val_idx: 0,
                                        },
                                    ));

                                    // break out of the inner loop and continue to outer loop,
                                    // which will result in first popping off the last instruction
                                    // that we added to the stack
                                    continue 'stack_loop;
                                }
                            };
                        }
                    }

                    initial_val_idx = 0;

                    dependencies_for_state_var.push(instruct_dependencies);
                }

                // If we have gotten to this part,
                // then we have resolved and freshened all dependencies
                // for the state variable (component_idx, state_var_idx).
                // We set the dependencies and calculate its value

                let mut comp = components[component_idx].borrow_mut();
                let state_var = &mut comp.get_state_variables_mut()[state_var_idx];

                state_var.set_dependencies(&dependencies_for_state_var);

                let dependencies_for_component = &mut dependencies[component_idx];

                dependencies_for_component[state_var_idx] = dependencies_for_state_var;

                state_var.calculate_state_var_from_dependencies();
                state_var.record_all_dependencies_viewed();
            }
            StateVarCalculationState::Stale(stale_state) => {
                let component_state = stale_state.component_state;

                // Stack implementation note:
                // In order to start with instruction from instruction_idx
                // and value from val_idx, we initially skip val_idx values
                // and then set initial_val_idx to zero to not skip values on further instructions.
                let mut initial_val_idx = stale_state.val_idx;

                let dependencies_for_state_var =
                    &dependencies[component_state.component_idx][component_state.state_var_idx];

                for (instruction_idx, deps) in dependencies_for_state_var
                    .iter()
                    .enumerate()
                    .skip(stale_state.instruction_idx)
                {
                    for (val_idx, dep) in deps.iter().enumerate().skip(initial_val_idx) {
                        if let DependencySource::StateVar {
                            component_idx,
                            state_var_idx,
                        } = &dep.source
                        {
                            let new_component_state = ComponentStateDescription {
                                component_idx: *component_idx,
                                state_var_idx: *state_var_idx,
                            };

                            let new_current_freshness = dep.value.get_freshness();

                            match new_current_freshness {
                                // No need to recurse if the state var of the dependency is already fresh
                                // so don't do anything to just continue the inner loop
                                Freshness::Fresh => (),
                                Freshness::Stale => {
                                    // Recurse by putting two items on the stack
                                    // and then continuing at start of stack loop
                                    freshen_stack.push(StateVarCalculationState::Stale(
                                        StaleCalculationState {
                                            component_state,
                                            instruction_idx,
                                            val_idx,
                                        },
                                    ));
                                    freshen_stack.push(StateVarCalculationState::Stale(
                                        StaleCalculationState {
                                            component_state: new_component_state,
                                            instruction_idx: 0,
                                            val_idx: 0,
                                        },
                                    ));

                                    // break out of the inner loop and continue to outer loop,
                                    // which will result in first popping off the last instruction
                                    // that we added to the stack
                                    continue 'stack_loop;
                                }
                                Freshness::Unresolved => {
                                    panic!("How did a stale state variable depend on an unresolved state variable?")
                                }
                            };
                        }
                    }

                    initial_val_idx = 0;
                }

                // If we have gotten to this part,
                // then we have freshened all dependencies
                // for the state variable (component_idx, state_var_idx).
                // We calculate its value if a dependency has changed,
                // else restore its previous value.

                let component_idx = component_state.component_idx;
                let state_var_idx = component_state.state_var_idx;

                let mut comp = components[component_idx].borrow_mut();
                let state_var = &mut comp.get_state_variables_mut()[state_var_idx];

                // Check if any dependency has changed since we last called record_all_dependencies_viewed.
                if state_var.check_if_any_dependency_changed_since_last_viewed() {
                    state_var.calculate_state_var_from_dependencies();
                    state_var.record_all_dependencies_viewed();
                } else {
                    state_var.restore_previous_value();
                }
            }
        }
    }
}

/// Freshen the state variable specified by original_component_state,
/// then get its fresh value
pub fn get_state_var_value(
    original_component_state: ComponentStateDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarCalculationState>,
    should_initialize_essential_data: bool,
) -> StateVarValue {
    freshen_state_var(
        original_component_state,
        components,
        dependencies,
        dependent_on_state_var,
        dependent_on_essential,
        essential_data,
        freshen_stack,
        should_initialize_essential_data,
    );

    components[original_component_state.component_idx]
        .borrow()
        .get_state_variables()[original_component_state.state_var_idx]
        .get_fresh_value()
}

/// Recurse in the inverse direction along the dependency graph to attempt to satisfy
/// the requested update of the state variable described in initial_update_request.
/// The requested value must already be set on that state variable itself.
///
/// When we reach the leaves (essential state variables), set them to their requested values
/// and then mark all their dependencies as stale
pub fn process_state_variable_update_request(
    initial_update_request: StateVariableUpdateRequest,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    stale_renderers: &mut HashSet<ComponentIdx>,
    mark_stale_stack: &mut Vec<ComponentStateDescription>,
    update_stack: &mut Vec<StateVariableUpdateRequest>,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // See comment in freshen_state_var for the motivation.

    update_stack.push(initial_update_request);

    let mut is_direct_change_from_renderer = true;

    while let Some(update_request) = update_stack.pop() {
        // log!("Process update request: {:?}", update_request);

        match update_request {
            StateVariableUpdateRequest::SetEssentialValue(essential_state) => {
                // We reached a leaf of the dependency graph.
                // Set it to its requested value (which has been set in a previous step),
                // and then recursively mark all its dependencies as stale.

                let essential_var = essential_data[essential_state.component_idx]
                    .get_mut(&essential_state.origin)
                    .unwrap();

                essential_var.set_value_to_requested_value();

                // log_debug!("Updated essential data {:?}", core.essential_data);

                mark_stale_essential_datum_dependencies(
                    &essential_state,
                    components,
                    dependent_on_state_var,
                    dependent_on_essential,
                    stale_renderers,
                    mark_stale_stack,
                );
            }

            StateVariableUpdateRequest::SetStateVar(component_state) => {
                // The requested value for the state variable of component_state
                // has already been set in a previous step.
                // Now, we need to calculate the requested values of its dependencies
                // that will lead to its requested value.

                // The vector dep_update_requests will contain just the identities
                // of the state variables or essential data that we need to recurse to.
                let mut dep_update_requests = request_dependencies_to_update_value_including_shadow(
                    component_state,
                    components,
                    dependencies,
                    is_direct_change_from_renderer,
                );

                // TODO: make sure that we do indeed want to reverse here to keep existing conventions
                dep_update_requests.reverse();

                update_stack.extend(dep_update_requests);
            }
        }

        is_direct_change_from_renderer = false;
    }
}

/// Mark the state variable in original_component_state stale
/// and then recurse to its dependencies.
///
/// Also, if a state variable has the for_renderer parameter set,
/// then record the component in stale_renderers.
fn mark_stale_state_var_and_dependencies(
    original_component_state: ComponentStateDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    stale_renderers: &mut HashSet<ComponentIdx>,
    mark_stale_stack: &mut Vec<ComponentStateDescription>,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // See comment in freshen_state_var for the motivation.

    mark_stale_stack.push(original_component_state);

    while let Some(ComponentStateDescription {
        component_idx,
        state_var_idx,
    }) = mark_stale_stack.pop()
    {
        let component = components[component_idx].borrow();
        let state_var = &component.get_state_variables()[state_var_idx];

        if state_var.get_freshness() == Freshness::Fresh {
            state_var.mark_stale();

            if state_var.get_for_renderer() {
                stale_renderers.insert(component_idx);
            }

            let states_depending_on_me = &dependent_on_state_var[component_idx][state_var_idx];

            for ComponentStateDescription {
                component_idx: new_comp_idx,
                state_var_idx: new_sv_idx,
            } in states_depending_on_me.iter()
            {
                // Recurse by adding the state variables to the stack
                mark_stale_stack.push(ComponentStateDescription {
                    component_idx: *new_comp_idx,
                    state_var_idx: *new_sv_idx,
                });
            }
        }
    }
}

/// Mark stale all the state variables that depend on essential_state.
fn mark_stale_essential_datum_dependencies(
    essential_state: &EssentialStateDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    stale_renderers: &mut HashSet<ComponentIdx>,
    mark_stale_stack: &mut Vec<ComponentStateDescription>,
) {
    let component_idx = essential_state.component_idx;

    // log!("Marking stale essential {}:{:?}", component_name, origin);

    if let Some(vec_deps) = dependent_on_essential[component_idx].get(&essential_state.origin) {
        vec_deps.iter().for_each(|component_state| {
            mark_stale_state_var_and_dependencies(
                *component_state,
                components,
                dependent_on_state_var,
                stale_renderers,
                mark_stale_stack,
            );
        })
    }
}

/// Determine what state variables must be changed to attempt to create the desired value
/// that has been saved to the state variable specified by *component_state*.
///
/// If *is_direct_change_from_renderer* is true, then the desired value for the state variable
/// was specified directly from the action itself.
///
/// Returns a vector specifying which state variables or essential data have been requested to change.
/// The actual requested values will be added directly to the state variables or essential data.
fn request_dependencies_to_update_value_including_shadow(
    component_state: ComponentStateDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &Vec<Vec<Vec<Vec<Dependency>>>>,
    is_direct_change_from_renderer: bool,
) -> Vec<StateVariableUpdateRequest> {
    let component_idx = component_state.component_idx;
    let state_var_idx = component_state.state_var_idx;
    let component = components[component_idx].borrow();
    let state_variable = &component.get_state_variables()[state_var_idx];

    let requests =
        state_variable.request_dependencies_to_update_value(is_direct_change_from_renderer);

    let update_requests = requests
        .map(|req| {
            convert_dependency_updates_requested_to_state_variable_update_requests(
                component_state,
                req,
                components,
                dependencies,
            )
        })
        .unwrap_or(vec![]);

    update_requests
}

/// Convert the dependency update results of `request_dependencies_to_update_value()`
/// into state variable update requests by determining the state variables
/// referenced by the dependencies.
fn convert_dependency_updates_requested_to_state_variable_update_requests(
    component_state: ComponentStateDescription,
    requests: Vec<DependencyUpdatesRequested>,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &Vec<Vec<Vec<Vec<Dependency>>>>,
) -> Vec<StateVariableUpdateRequest> {
    let component_idx = component_state.component_idx;
    let state_var_idx = component_state.state_var_idx;

    let my_dependencies =
        &dependencies[component_state.component_idx][component_state.state_var_idx];

    let mut update_requests = Vec::new();

    for DependencyUpdatesRequested {
        instruction_idx,
        dependency_idx,
    } in requests
    {
        let instruct_dependencies = my_dependencies.get(instruction_idx).unwrap_or_else(|| {
            panic!(
                "{}:{} has too few instructions to determine dependencies",
                components[component_idx].borrow().get_component_type(),
                state_var_idx
            )
        });

        let dependency = &instruct_dependencies[dependency_idx];

        match &dependency.source {
            DependencySource::Essential {
                component_idx,
                origin,
            } => update_requests.push(StateVariableUpdateRequest::SetEssentialValue(
                EssentialStateDescription {
                    component_idx: *component_idx,
                    origin: origin.clone(),
                },
            )),
            DependencySource::StateVar {
                component_idx,
                state_var_idx,
            } => {
                // TODO: receiving multiple dependencies because of multiple instances

                let component_state = ComponentStateDescription {
                    component_idx: *component_idx,
                    state_var_idx: *state_var_idx,
                };
                update_requests.push(StateVariableUpdateRequest::SetStateVar(component_state));
            }
        }
    }

    update_requests
}
