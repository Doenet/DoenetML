use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    components::{ComponentEnum, ComponentNode},
    dependency::{DependenciesCreatedForDataQuery, DependencySource, DependencyValueUpdateRequest},
    state::prop_calculations::PropUpdateRequest,
    state::prop_state::{StateProp, StatePropDataOrigin, StatePropDescription},
    state::Freshness,
    ComponentIdx, CoreProcessingState, DependencyGraph,
};

use super::{ComponentState, PropPointer};

/// Recurse in the inverse direction along the dependency graph to attempt to satisfy
/// the requested update of the prop described in initial_update_request.
/// The requested value must already be set on that prop itself.
///
/// When we reach the leaves (state props), set them to their requested values
/// and then mark all their dependencies as stale
#[allow(clippy::ptr_arg)]
pub fn process_prop_update_request(
    initial_update_request: PropUpdateRequest,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    state_data: &mut Vec<HashMap<StatePropDataOrigin, StateProp>>,
    processing_state: &mut CoreProcessingState,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // See comment in freshen_prop for the motivation.

    let update_stack = &mut processing_state.update_stack;
    update_stack.push(initial_update_request);

    let mut is_direct_change_from_action = true;

    while let Some(update_request) = update_stack.pop() {
        // log!("Process update request: {:?}", update_request);

        match update_request {
            PropUpdateRequest::SetState(state) => {
                // We reached a leaf of the dependency graph.
                // Set it to its requested value (which has been set in a previous step),
                // and then recursively mark all its dependencies as stale.

                let state_prop = state_data[state.component_idx]
                    .get_mut(&state.origin)
                    .unwrap();

                state_prop.set_value_to_requested_value();

                mark_stale_state_datum_dependencies(
                    &state,
                    components,
                    dependency_graph,
                    &mut processing_state.stale_renderers,
                    &mut processing_state.mark_stale_stack,
                );
            }

            PropUpdateRequest::SetProp(prop_ptr) => {
                // The requested value for the prop of prop_ptr
                // has already been set in a previous step.
                // Now, we need to calculate the requested values of its dependencies
                // that will lead to its requested value.

                // The vector dep_update_requests will contain just the identities
                // of the props or state data that we need to recurse to.
                let mut dep_update_requests = invert_including_shadow(
                    prop_ptr,
                    components,
                    &dependency_graph.dependencies,
                    is_direct_change_from_action,
                );

                // TODO: make sure that we do indeed want to reverse here to keep existing conventions
                dep_update_requests.reverse();

                update_stack.extend(dep_update_requests);
            }
        }

        is_direct_change_from_action = false;
    }
}

/// Mark the prop in original_prop_ptr stale
/// and then recurse to its dependencies.
///
/// Also, if a prop has the for_renderer parameter set,
/// then record the component in stale_renderers.
#[allow(clippy::ptr_arg)]
fn mark_stale_prop_and_dependencies(
    original_prop_ptr: PropPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependent_on_prop: &mut Vec<Vec<Vec<PropPointer>>>,
    stale_renderers: &mut Vec<ComponentIdx>,
    mark_stale_stack: &mut Vec<PropPointer>,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // See comment in freshen_prop for the motivation.

    mark_stale_stack.push(original_prop_ptr);

    while let Some(PropPointer {
        component_idx,
        local_prop_idx: prop_idx,
    }) = mark_stale_stack.pop()
    {
        let component = components[component_idx].borrow();
        let prop = &component.get_prop(prop_idx).unwrap();

        if prop.get_freshness() == Freshness::Fresh {
            prop.mark_stale();

            if component.check_if_prop_is_for_renderer(prop_idx)
                && component.get_is_in_render_tree()
            {
                stale_renderers.push(component_idx);
            }

            let states_depending_on_me = &dependent_on_prop[component_idx][prop_idx];

            for PropPointer {
                component_idx: new_comp_idx,
                local_prop_idx: new_prop_idx,
            } in states_depending_on_me.iter()
            {
                // Recurse by adding the props to the stack
                mark_stale_stack.push(PropPointer {
                    component_idx: *new_comp_idx,
                    local_prop_idx: *new_prop_idx,
                });
            }
        }
    }
}

/// Mark stale all the props that depend on state_prop.
#[allow(clippy::ptr_arg)]
fn mark_stale_state_datum_dependencies(
    state_prop: &StatePropDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    stale_renderers: &mut Vec<ComponentIdx>,
    mark_stale_stack: &mut Vec<PropPointer>,
) {
    let component_idx = state_prop.component_idx;

    if let Some(vec_deps) =
        dependency_graph.dependent_on_state[component_idx].get(&state_prop.origin)
    {
        vec_deps.iter().for_each(|prop_ptr| {
            mark_stale_prop_and_dependencies(
                *prop_ptr,
                components,
                &mut dependency_graph.dependent_on_prop,
                stale_renderers,
                mark_stale_stack,
            );
        })
    }
}

/// Determine what props must be changed to attempt to create the desired value
/// that has been saved to the prop specified by *prop_ptr*.
///
/// If *is_direct_change_from_action* is true, then the desired value for the prop
/// was specified directly from the action itself.
///
/// Returns a vector specifying which props or state data have been requested to change.
/// The actual requested values will be added directly to the props or state data.
fn invert_including_shadow(
    prop_ptr: PropPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &Vec<Vec<Vec<DependenciesCreatedForDataQuery>>>,
    is_direct_change_from_action: bool,
) -> Vec<PropUpdateRequest> {
    let component_idx = prop_ptr.component_idx;
    let prop_idx = prop_ptr.local_prop_idx;
    let mut component = components[component_idx].borrow_mut();
    let prop = &mut component.get_prop_mut(prop_idx).unwrap();

    let requests = prop.invert(is_direct_change_from_action);

    requests
        .map(|req| {
            convert_dependency_updates_requested_to_prop_update_requests(
                prop_ptr,
                req,
                components,
                dependencies,
            )
        })
        .unwrap_or_default()
}

/// Convert the dependency update results of `invert()`
/// into prop update requests by determining the props
/// referenced by the dependencies.
#[allow(clippy::ptr_arg)]
fn convert_dependency_updates_requested_to_prop_update_requests(
    prop_ptr: PropPointer,
    requests: Vec<DependencyValueUpdateRequest>,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &Vec<Vec<Vec<DependenciesCreatedForDataQuery>>>,
) -> Vec<PropUpdateRequest> {
    let component_idx = prop_ptr.component_idx;
    let prop_idx = prop_ptr.local_prop_idx;

    let my_dependencies = &dependencies[prop_ptr.component_idx][prop_ptr.local_prop_idx];

    let mut update_requests = Vec::new();

    for DependencyValueUpdateRequest {
        data_query_idx,
        dependency_idx,
    } in requests
    {
        let instruct_dependencies = my_dependencies.get(data_query_idx).unwrap_or_else(|| {
            panic!(
                "{}:{} has too few data queries to determine dependencies",
                components[component_idx].borrow().get_component_type(),
                prop_idx
            )
        });

        let dependency = &instruct_dependencies[dependency_idx];

        match &dependency.source {
            DependencySource::State {
                component_idx,
                origin,
            } => update_requests.push(PropUpdateRequest::SetState(StatePropDescription {
                component_idx: *component_idx,
                origin: origin.clone(),
            })),
            DependencySource::Prop {
                component_idx,
                prop_idx,
            } => {
                // TODO: receiving multiple dependencies because of multiple instances

                let prop_ptr = PropPointer {
                    component_idx: *component_idx,
                    local_prop_idx: *prop_idx,
                };
                update_requests.push(PropUpdateRequest::SetProp(prop_ptr));
            }
        }
    }

    update_requests
}
