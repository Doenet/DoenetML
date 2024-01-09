use std::{cell::RefCell, collections::HashMap, rc::Rc};

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
    freshen_stack: &mut Vec<StateVarCalculationState>,
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

/// Used to save the state in the middle of a calculation while freshening a state variable.
/// Placed on a stack in order to implement recursion using a stack on the heap.
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
    state_var_ptr: StateVarPointer,
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
    state_var_ptr: StateVarPointer,
    instruction_idx: usize,
    val_idx: usize,
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
    freshen_stack: &mut Vec<StateVarCalculationState>,
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

    let current_freshness = components[original_state_var_ptr.component_idx]
        .borrow()
        .get_state_variables()[original_state_var_ptr.state_var_idx]
        .get_freshness();

    let initial_calculation_state = match current_freshness {
        // No need to do anything if the state var is already fresh
        Freshness::Fresh => return (),
        Freshness::Unresolved => StateVarCalculationState::Unresolved(UnresolvedCalculationState {
            state_var_ptr: original_state_var_ptr,
            instruction_idx: 0,
            val_idx: 0,
            dependency_instructions: None,
            instruct_dependencies: None,
            dependencies_for_state_var: None,
        }),
        Freshness::Stale => StateVarCalculationState::Stale(StaleCalculationState {
            state_var_ptr: original_state_var_ptr.clone(),
            instruction_idx: 0,
            val_idx: 0,
        }),
    };

    freshen_stack.push(initial_calculation_state);

    'stack_loop: while let Some(calculation_state) = freshen_stack.pop() {
        match calculation_state {
            StateVarCalculationState::Unresolved(unresolved_state) => {
                let state_var_ptr = unresolved_state.state_var_ptr;

                let component_idx = state_var_ptr.component_idx;
                let state_var_idx = state_var_ptr.state_var_idx;

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
                            let new_state_var_ptr = StateVarPointer {
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
                                            state_var_ptr,
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
                                            state_var_ptr: new_state_var_ptr,
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
                                            state_var_ptr,
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
                                            state_var_ptr: new_state_var_ptr,
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
                let state_var_ptr = stale_state.state_var_ptr;

                // Stack implementation note:
                // In order to start with instruction from instruction_idx
                // and value from val_idx, we initially skip val_idx values
                // and then set initial_val_idx to zero to not skip values on further instructions.
                let mut initial_val_idx = stale_state.val_idx;

                let dependencies_for_state_var =
                    &dependencies[state_var_ptr.component_idx][state_var_ptr.state_var_idx];

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
                            let new_state_var_ptr = StateVarPointer {
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
                                            state_var_ptr,
                                            instruction_idx,
                                            val_idx,
                                        },
                                    ));
                                    freshen_stack.push(StateVarCalculationState::Stale(
                                        StaleCalculationState {
                                            state_var_ptr: new_state_var_ptr,
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

                let component_idx = state_var_ptr.component_idx;
                let state_var_idx = state_var_ptr.state_var_idx;

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
