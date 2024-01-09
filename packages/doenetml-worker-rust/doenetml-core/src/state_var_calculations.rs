use std::{cell::RefCell, collections::HashMap, rc::Rc};

use tailcall::tailcall;

use crate::{
    component::{ComponentEnum, ComponentNode, RenderedComponentNode},
    dependency::{
        create_dependencies_from_instruction_initialize_essential, Dependency,
        DependencyInstruction, DependencySource,
    },
    essential_state::{EssentialDataOrigin, EssentialStateDescription, EssentialStateVar},
    state::{Freshness, StateVarValue},
    ComponentChild, ComponentIdx, ExtendSource, StateVarPointer,
};

/// Freshen the state variable specified by original_state_var_ptr,
/// then get its fresh value
pub fn get_state_var_value(
    original_state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarPointer>,
    should_initialize_essential_data: bool,
) -> StateVarValue {
    freshen_state_var(
        original_state_var_ptr,
        components,
        dependencies,
        dependent_on_state_var,
        dependent_on_essential,
        essential_data,
        freshen_stack,
        should_initialize_essential_data,
    );

    components[original_state_var_ptr.component_idx]
        .borrow()
        .get_state_variables()[original_state_var_ptr.state_var_idx]
        .get_fresh_value()
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
    stale_renderers: &mut Vec<ComponentIdx>,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarPointer>,
    should_initialize_essential_data: bool,
) -> Vec<usize> {
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
        let rendered_state_var_indices = components[*component_idx]
            .borrow()
            .get_rendered_state_variable_indices()
            .clone();

        for state_var_idx in rendered_state_var_indices {
            let state_var_ptr = StateVarPointer {
                component_idx: *component_idx,
                state_var_idx,
            };
            freshen_state_var(
                state_var_ptr,
                components,
                dependencies,
                dependent_on_state_var,
                dependent_on_essential,
                essential_data,
                freshen_stack,
                should_initialize_essential_data,
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

    children.extend(
        component
            .get_rendered_children()
            .iter()
            .filter_map(|child| match child {
                &ComponentChild::Component(comp_idx) => Some(comp_idx),
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
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarPointer>,
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

    let original_freshness = components[original_state_var_ptr.component_idx]
        .borrow()
        .get_state_variables()[original_state_var_ptr.state_var_idx]
        .get_freshness();

    // If the current state variable is fresh, there's nothing to do.
    // If it is unresolved, resolve it
    match original_freshness {
        Freshness::Fresh => return (),
        Freshness::Unresolved => {
            resolve_state_var(
                original_state_var_ptr,
                components,
                dependencies,
                dependent_on_state_var,
                dependent_on_essential,
                essential_data,
                should_initialize_essential_data,
            );
        }
        Freshness::Stale | Freshness::Resolved => (),
    };

    // At this point, the state variable is stale or resolved.

    freshen_stack.push(original_state_var_ptr);

    while let Some(state_var_ptr) = freshen_stack.pop() {
        let current_freshness = components[state_var_ptr.component_idx]
            .borrow()
            .get_state_variables()[state_var_ptr.state_var_idx]
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

        let dependencies_for_state_var =
            &dependencies[state_var_ptr.component_idx][state_var_ptr.state_var_idx];

        let mut found_stale_or_resolved_dependency = false;

        for deps in dependencies_for_state_var.iter() {
            for dep in deps.iter() {
                match &dep.source {
                    DependencySource::StateVar {
                        component_idx,
                        state_var_idx,
                    } => {
                        let new_state_var_ptr = StateVarPointer {
                            component_idx: *component_idx,
                            state_var_idx: *state_var_idx,
                        };

                        let new_current_freshness = dep.value.get_freshness();

                        match new_current_freshness {
                            // No need to recurse if the state var of the dependency is already fresh
                            // so don't do anything to just continue the inner loop
                            Freshness::Fresh => (),
                            Freshness::Stale | Freshness::Resolved => {
                                if !found_stale_or_resolved_dependency {
                                    freshen_stack.push(state_var_ptr);
                                    found_stale_or_resolved_dependency = true;
                                }

                                // Recurse by putting two items on the stack
                                // and then continuing at start of stack loop
                                freshen_stack.push(new_state_var_ptr);
                            }
                            Freshness::Unresolved => {
                                panic!("How did a stale state variable depend on an unresolved state variable?")
                            }
                        };
                    }
                    // nothing to add to stack if have an essential state variable
                    // as they cannot be stale
                    DependencySource::Essential { .. } => (),
                }
            }
        }

        if !found_stale_or_resolved_dependency {
            // All the dependencies of state_var_ptr are fresh.
            // We calculate its value if a dependency has changed,
            // else restore its previous value.

            let component_idx = state_var_ptr.component_idx;
            let state_var_idx = state_var_ptr.state_var_idx;

            let mut comp = components[component_idx].borrow_mut();
            let state_var = &mut comp.get_state_variables_mut()[state_var_idx];

            // Check if any dependency has changed since we last called record_all_dependencies_viewed.
            if state_var.check_if_any_dependency_changed_since_last_viewed() {
                state_var.calculate_state_var_from_dependencies_and_mark_fresh();
                state_var.record_all_dependencies_viewed();
            } else {
                state_var.restore_previous_value();
            }
        }
    }
}

#[tailcall]
pub fn resolve_state_var(
    state_var_ptr: StateVarPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<StateVarPointer>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    // freshen_stack: &mut Vec<StateVarCalculationState>,
    should_initialize_essential_data: bool,
) {
    let component_idx = state_var_ptr.component_idx;
    let state_var_idx = state_var_ptr.state_var_idx;

    let dependency_instructions;

    {
        let component = components[component_idx].borrow();
        let state_var = &component.get_state_variables()[state_var_idx];

        let current_freshness = state_var.get_freshness();

        if current_freshness != Freshness::Unresolved {
            return ();
        }

        dependency_instructions = state_var.return_dependency_instructions(component.get_extend());
    }

    let mut dependencies_for_state_var = Vec::with_capacity(dependency_instructions.len());

    let mut unresolved_state_variable_dependencies: Vec<StateVarPointer> = Vec::new();

    for dep_instruction in dependency_instructions.iter() {
        let instruct_dependencies = create_dependencies_from_instruction_initialize_essential(
            components,
            component_idx,
            state_var_idx,
            dep_instruction,
            essential_data,
            should_initialize_essential_data,
        );

        // add these dependencies to the inverse graph:
        // dependent_on_state_var or dependent_on_essential.
        for dep in instruct_dependencies.iter() {
            match &dep.source {
                DependencySource::StateVar {
                    component_idx: inner_comp_idx,
                    state_var_idx: inner_sv_idx,
                } => {
                    let vec_dep = &mut dependent_on_state_var[*inner_comp_idx];
                    vec_dep[*inner_sv_idx].push(StateVarPointer {
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
                    unresolved_state_variable_dependencies.push(new_state_var_ptr);
                }
            }
        }

        dependencies_for_state_var.push(instruct_dependencies);
    }

    {
        let mut component = components[component_idx].borrow_mut();
        let state_var = &mut component.get_state_variables_mut()[state_var_idx];

        state_var.set_dependencies(&dependencies_for_state_var);

        let dependencies_for_component = &mut dependencies[component_idx];

        dependencies_for_component[state_var_idx] = dependencies_for_state_var;
    }

    components[component_idx].borrow().get_state_variables()[state_var_idx].set_as_resolved();

    for new_state_var_ptr in unresolved_state_variable_dependencies {
        resolve_state_var(
            new_state_var_ptr,
            components,
            dependencies,
            dependent_on_state_var,
            dependent_on_essential,
            essential_data,
            should_initialize_essential_data,
        )
    }
}
