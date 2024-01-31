use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    components::{ComponentEnum, ComponentNode, RenderedChildren},
    dependency::{
        create_dependencies_from_data_query_initialize_essential, DataQuery, DependencySource,
    },
    state::essential_state::{EssentialDataOrigin, EssentialStateDescription, EssentialStateVar},
    state::{Freshness, StateVarValue},
    ComponentIdx, ComponentPointerTextOrMacro, CoreProcessingState, DependencyGraph, ExtendSource,
};

use super::{ComponentState, StateVarPointer};

/// Freshen the state variable specified by original_state_var_ptr,
/// then get its fresh value
pub fn get_state_var_value(
    original_state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarPointer>,
) -> StateVarValue {
    freshen_state_var(
        original_state_var_ptr,
        components,
        dependency_graph,
        essential_data,
        freshen_stack,
    );

    components[original_state_var_ptr.component_idx]
        .borrow()
        .get_state_variable(original_state_var_ptr.state_var_idx)
        .unwrap()
        .get()
}

/// Internal structure used to track changes
#[derive(Debug, Clone)]
pub enum StateVariableUpdateRequest {
    SetEssentialValue(EssentialStateDescription),
    SetStateVar(StateVarPointer),
}

/// Freshen all the state variables for a component that are designated as rendered
/// and recurse to rendered children.
///
/// Returns a vector of the indices of the components reached.
pub fn freshen_all_stale_renderer_states(
    processing_state: &mut CoreProcessingState,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
) -> Vec<usize> {
    let stale_renderers = &mut processing_state.stale_renderers;

    // recursively get a list of all rendered descendants of the components in stale_renderers
    let mut stale_renderer_idx = 0;
    while stale_renderer_idx < stale_renderers.len() {
        let component_idx = stale_renderers[stale_renderer_idx];
        stale_renderer_idx += 1;

        stale_renderers.extend(get_non_string_rendered_children_including_from_extend(
            component_idx,
            components,
        ));
    }

    // deduplicate the list of stale renderers,
    // sorting first since .dedup removes only consecutive duplicates.
    stale_renderers.sort_unstable();
    stale_renderers.dedup();

    for component_idx in stale_renderers.iter() {
        components[*component_idx]
            .borrow_mut()
            .set_is_in_render_tree(true);

        let rendered_state_var_indices = components[*component_idx]
            .borrow()
            .get_for_renderer_state_variable_indices();

        for state_var_idx in rendered_state_var_indices {
            let state_var_ptr = StateVarPointer {
                component_idx: *component_idx,
                state_var_idx,
            };
            freshen_state_var(
                state_var_ptr,
                components,
                dependency_graph,
                essential_data,
                &mut processing_state.freshen_stack,
            );
        }
    }

    let components_freshened = stale_renderers.clone();

    stale_renderers.clear();
    components_freshened
}

/// Returns a vector of the component indices of all rendered children that are elements.
///
/// If the component extends another component, the children from the extend source come first.
fn get_non_string_rendered_children_including_from_extend(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
) -> Vec<ComponentIdx> {
    let component = components[component_idx].borrow();

    let mut children = if let Some(&ExtendSource::Component(source_idx)) = component.get_extending()
    {
        get_non_string_rendered_children_including_from_extend(source_idx, components)
    } else {
        Vec::new()
    };

    children.extend(
        component
            .get_rendered_children()
            .iter()
            .filter_map(|child| match child {
                &ComponentPointerTextOrMacro::Component(comp_idx) => Some(comp_idx),
                _ => None,
            }),
    );

    children
}

/// If the state variable specified by original_state_var_ptr is stale or unresolved,
/// then freshen the variable, resolving its dependencies if necessary.
///
/// If the state variable was not fresh, then recurse to its dependencies to freshen them.
pub fn freshen_state_var(
    original_state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarPointer>,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // This approach was chosen because the function recursion implementation would overflow
    // the small WASM stack once it recursed a few thousands of times.
    // An alternative approach would be to increase the size of the WASM stack.
    // This approach was chosen because it is relatively easy to produce documents
    // with thousands of levels in the dependency graph, and it wasn't clear what
    // size WASM stack would be appropriate.

    let original_freshness = components[original_state_var_ptr.component_idx]
        .borrow()
        .get_state_variable(original_state_var_ptr.state_var_idx)
        .unwrap()
        .get_freshness();

    // If the current state variable is fresh, there's nothing to do.
    // If it is unresolved, resolve it
    match original_freshness {
        Freshness::Fresh => return,
        Freshness::Unresolved => {
            resolve_state_var(
                original_state_var_ptr,
                components,
                dependency_graph,
                essential_data,
            );
        }
        Freshness::Stale | Freshness::Resolved => (),
    };

    // At this point, the state variable is stale or resolved.

    freshen_stack.push(original_state_var_ptr);

    while let Some(state_var_ptr) = freshen_stack.pop() {
        let current_freshness = components[state_var_ptr.component_idx]
            .borrow()
            .get_state_variable(state_var_ptr.state_var_idx)
            .unwrap()
            .get_freshness();

        // If we have cycles in the graph, it's possible that this
        // state variable was reached from another path and already freshened.
        // Skip it in that case.
        match current_freshness {
            Freshness::Fresh => continue,
            Freshness::Unresolved => {
                panic!("Should not have an unresolved state variable here!")
            }
            Freshness::Stale | Freshness::Resolved => (),
        };

        let dependencies_for_state_var = &dependency_graph.dependencies
            [state_var_ptr.component_idx][state_var_ptr.state_var_idx];

        // If we find a stale or resolved dependency
        // (i.e., not fresh, as we shouldn't have unresolved)
        // then we aren't ready to freshen this state variable.
        // In this case, we will put state_var_ptr on the stack
        // followed by its stale/resolved dependencies,
        // and skip the calculation/freshen step at the end.
        // (The calculation/freshen step will occur when it comes off the stack
        // next time, as at that point, its dependencies will all be fresh.)
        let mut state_var_ptr_is_ready_to_freshen = true;

        for deps in dependencies_for_state_var.iter() {
            for dep in deps.iter() {
                // If can create a state_var_ptr from dep.source,
                // it means it is a DependencySource::StateVar,
                // so we need to check if that state variable is fresh.
                // (There is nothing to do for DependencySource::Essential.)
                if let Ok(dep_state_var_ptr) = StateVarPointer::try_from(&dep.source) {
                    match dep.value.get_freshness() {
                        // No need to recurse if the state var of the dependency is already fresh
                        // so don't do anything to just continue the inner loop
                        Freshness::Fresh => (),
                        Freshness::Stale | Freshness::Resolved => {
                            // If this is the first time we found a stale/resolved dependency,
                            // this means we have not yet put state_var_ptr on the stack,
                            // so we do that now.
                            if state_var_ptr_is_ready_to_freshen {
                                freshen_stack.push(state_var_ptr);
                                state_var_ptr_is_ready_to_freshen = false;
                            }

                            // Before we can freshen state_var_ptr,
                            // we have to freshen dep_state_var_ptr.
                            // We put that on the stack (which will be after where
                            // state_var_ptr is on the stack).
                            freshen_stack.push(dep_state_var_ptr);
                        }
                        Freshness::Unresolved => {
                            panic!("How did a stale state variable depend on an unresolved state variable?")
                        }
                    };
                };
            }
        }

        // At this point, we have gone through all the dependencies.
        // We have two possibilities.
        // 1. The state variable state_var_ptr is ready to freshen
        //    because all its dependencies are fresh.
        //    In this case we calculate its value to freshen it.
        // 2. We found a stale or resolved dependency of state_var_ptr
        //    so it is not ready to freshen.
        //    In this case, we have already put state_var_ptr
        //    and each stale/resolved dep_state_var_ptr on the stack.
        //    There is nothing to do now.
        //    We'll calculate and freshen state_var_ptr next time it comes off the stack.

        if state_var_ptr_is_ready_to_freshen {
            // All the dependencies of state_var_ptr are fresh.
            // We calculate its value if a dependency has changed,
            // else restore its previous value.

            let component_idx = state_var_ptr.component_idx;
            let state_var_idx = state_var_ptr.state_var_idx;

            let mut comp = components[component_idx].borrow_mut();
            let state_var = &mut comp.get_state_variable_mut(state_var_idx).unwrap();

            // Check if any dependency has changed since we last called record_all_dependencies_viewed.
            if state_var.check_if_any_dependency_changed_since_last_viewed() {
                state_var.calculate_and_mark_fresh();
                state_var.record_all_dependencies_viewed();
            } else {
                state_var.mark_fresh();
            }
        }
    }
}

#[allow(clippy::ptr_arg)]
pub fn resolve_state_var(
    original_state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
) {
    // Since resolving state variables won't recurse with repeated actions,
    // will go ahead and allocate the stack locally, for simplicity.
    let mut resolve_stack = Vec::new();
    resolve_stack.push(original_state_var_ptr);

    while let Some(state_var_ptr) = resolve_stack.pop() {
        let component_idx = state_var_ptr.component_idx;
        let state_var_idx = state_var_ptr.state_var_idx;

        let data_queries: Vec<DataQuery>;

        {
            let extending: Option<ExtendSource> =
                components[component_idx].borrow().get_extending().cloned();

            let mut component = components[component_idx].borrow_mut();
            let state_var = &mut component.get_state_variable_mut(state_var_idx).unwrap();

            let current_freshness = state_var.get_freshness();

            if current_freshness != Freshness::Unresolved {
                // nothing to do if the state variable is already resolved
                continue;
            }

            data_queries = state_var.return_data_queries(extending, state_var_idx);
        }

        let mut dependencies_for_state_var = Vec::with_capacity(data_queries.len());

        for query in data_queries.iter() {
            let instruct_dependencies = create_dependencies_from_data_query_initialize_essential(
                components,
                component_idx,
                state_var_idx,
                query,
                essential_data,
            );

            // add these dependencies to the inverse graph:
            // dependent_on_state_var or dependent_on_essential.
            for dep in instruct_dependencies.iter() {
                match &dep.source {
                    DependencySource::StateVar {
                        component_idx: inner_comp_idx,
                        state_var_idx: inner_sv_idx,
                    } => {
                        let vec_dep = &mut dependency_graph.dependent_on_state_var[*inner_comp_idx];
                        vec_dep[*inner_sv_idx].push(StateVarPointer {
                            component_idx,
                            state_var_idx,
                        });
                    }
                    DependencySource::Essential {
                        component_idx: inner_comp_idx,
                        origin,
                    } => {
                        let vec_dep = dependency_graph.dependent_on_essential[*inner_comp_idx]
                            .entry(origin.clone())
                            .or_default();
                        vec_dep.push(StateVarPointer {
                            component_idx,
                            state_var_idx,
                        });
                    }
                }
            }

            for dep in instruct_dependencies.iter() {
                if let DependencySource::StateVar {
                    component_idx: comp_idx_inner,
                    state_var_idx: sv_idx_inner,
                } = &dep.source
                {
                    let new_state_var_ptr = StateVarPointer {
                        component_idx: *comp_idx_inner,
                        state_var_idx: *sv_idx_inner,
                    };

                    let new_current_freshness = dep.value.get_freshness();

                    if new_current_freshness == Freshness::Unresolved {
                        // recurse to any unresolved dependencies
                        resolve_stack.push(new_state_var_ptr);
                    }
                }
            }

            dependencies_for_state_var.push(instruct_dependencies);
        }

        {
            let mut component = components[component_idx].borrow_mut();
            let state_var = &mut component.get_state_variable_mut(state_var_idx).unwrap();

            state_var.save_dependencies(&dependencies_for_state_var);

            let dependencies_for_component = &mut dependency_graph.dependencies[component_idx];

            dependencies_for_component[state_var_idx] = dependencies_for_state_var;
        }

        {
            components[component_idx]
                .borrow()
                .get_state_variable(state_var_idx)
                .unwrap()
                .set_as_resolved();
        }
    }
}
