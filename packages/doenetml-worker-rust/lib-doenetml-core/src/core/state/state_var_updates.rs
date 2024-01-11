use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    components::{ComponentEnum, ComponentNode},
    dependency::{Dependency, DependencySource, DependencyValueUpdateRequest},
    state::essential_state::{EssentialDataOrigin, EssentialStateDescription, EssentialStateVar},
    state::state_var_calculations::StateVariableUpdateRequest,
    state::Freshness,
    ComponentIdx, StateVarPointer,
};

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
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    stale_renderers: &mut Vec<ComponentIdx>,
    mark_stale_stack: &mut Vec<StateVarPointer>,
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

            StateVariableUpdateRequest::SetStateVar(state_var_ptr) => {
                // The requested value for the state variable of state_var_ptr
                // has already been set in a previous step.
                // Now, we need to calculate the requested values of its dependencies
                // that will lead to its requested value.

                // The vector dep_update_requests will contain just the identities
                // of the state variables or essential data that we need to recurse to.
                let mut dep_update_requests = request_dependencies_to_update_value_including_shadow(
                    state_var_ptr,
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

/// Mark the state variable in original_state_var_ptr stale
/// and then recurse to its dependencies.
///
/// Also, if a state variable has the for_renderer parameter set,
/// then record the component in stale_renderers.
fn mark_stale_state_var_and_dependencies(
    original_state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    stale_renderers: &mut Vec<ComponentIdx>,
    mark_stale_stack: &mut Vec<StateVarPointer>,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // See comment in freshen_state_var for the motivation.

    mark_stale_stack.push(original_state_var_ptr);

    while let Some(StateVarPointer {
        component_idx,
        state_var_idx,
    }) = mark_stale_stack.pop()
    {
        let component = components[component_idx].borrow();
        let state_var = &component.get_state_variables()[state_var_idx];

        if state_var.get_freshness() == Freshness::Fresh {
            state_var.mark_stale();

            if state_var.get_for_renderer() {
                stale_renderers.push(component_idx);
            }

            let states_depending_on_me = &dependent_on_state_var[component_idx][state_var_idx];

            for StateVarPointer {
                component_idx: new_comp_idx,
                state_var_idx: new_sv_idx,
            } in states_depending_on_me.iter()
            {
                // Recurse by adding the state variables to the stack
                mark_stale_stack.push(StateVarPointer {
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
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
    stale_renderers: &mut Vec<ComponentIdx>,
    mark_stale_stack: &mut Vec<StateVarPointer>,
) {
    let component_idx = essential_state.component_idx;

    // log!("Marking stale essential {}:{:?}", component_name, origin);

    if let Some(vec_deps) = dependent_on_essential[component_idx].get(&essential_state.origin) {
        vec_deps.iter().for_each(|state_var_ptr| {
            mark_stale_state_var_and_dependencies(
                *state_var_ptr,
                components,
                dependent_on_state_var,
                stale_renderers,
                mark_stale_stack,
            );
        })
    }
}

/// Determine what state variables must be changed to attempt to create the desired value
/// that has been saved to the state variable specified by *state_var_ptr*.
///
/// If *is_direct_change_from_renderer* is true, then the desired value for the state variable
/// was specified directly from the action itself.
///
/// Returns a vector specifying which state variables or essential data have been requested to change.
/// The actual requested values will be added directly to the state variables or essential data.
fn request_dependencies_to_update_value_including_shadow(
    state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &Vec<Vec<Vec<Vec<Dependency>>>>,
    is_direct_change_from_renderer: bool,
) -> Vec<StateVariableUpdateRequest> {
    let component_idx = state_var_ptr.component_idx;
    let state_var_idx = state_var_ptr.state_var_idx;
    let component = components[component_idx].borrow();
    let state_variable = &component.get_state_variables()[state_var_idx];

    let requests =
        state_variable.request_dependencies_to_update_value(is_direct_change_from_renderer);

    let update_requests = requests
        .map(|req| {
            convert_dependency_updates_requested_to_state_variable_update_requests(
                state_var_ptr,
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
    state_var_ptr: StateVarPointer,
    requests: Vec<DependencyValueUpdateRequest>,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &Vec<Vec<Vec<Vec<Dependency>>>>,
) -> Vec<StateVariableUpdateRequest> {
    let component_idx = state_var_ptr.component_idx;
    let state_var_idx = state_var_ptr.state_var_idx;

    let my_dependencies = &dependencies[state_var_ptr.component_idx][state_var_ptr.state_var_idx];

    let mut update_requests = Vec::new();

    for DependencyValueUpdateRequest {
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

                let state_var_ptr = StateVarPointer {
                    component_idx: *component_idx,
                    state_var_idx: *state_var_idx,
                };
                update_requests.push(StateVariableUpdateRequest::SetStateVar(state_var_ptr));
            }
        }
    }

    update_requests
}
