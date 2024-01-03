use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    component::{ComponentEnum, ComponentNode, RenderedComponentNode},
    dependency::{
        create_dependencies_from_instruction_initialize_essential, Dependency,
        DependencyInstruction, DependencySource,
    },
    essential_state::{EssentialDataOrigin, EssentialStateVar},
    state::Freshness,
    ComponentChild, ComponentIdx, ComponentStateDescription, ExtendSource,
};

#[derive(Debug)]
pub enum StateVarCalculationState {
    Unresolved(UnresolvedCalculationState),
    Stale(StaleCalculationState),
}

#[derive(Debug)]
pub struct UnresolvedCalculationState {
    component_state: ComponentStateDescription,
    instruction_idx: usize,
    val_idx: usize,
    dependency_instructions: Option<Vec<DependencyInstruction>>,
    instruct_dependencies: Option<Vec<Dependency>>,
    dependencies_for_state_var: Option<Vec<Vec<Dependency>>>,
}

#[derive(Debug)]
pub struct StaleCalculationState {
    component_state: ComponentStateDescription,
    instruction_idx: usize,
    val_idx: usize,
}

pub fn freshen_renderer_state_for_comp(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarCalculationState>,
    should_initialize_essential_data: bool,
) {
    // TODO: for efficiency, could create a vector of rendereds
    let rendered_state_var_indices = components[component_idx]
        .borrow()
        .get_rendered_state_variable_indices()
        .clone();

    let mut found_changed_state_var = false;
    let mut state_values = serde_json::Map::new();
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

        let mut comp = components[component_idx].borrow_mut();
        let state_var = &mut comp.get_state_variables()[state_var_idx];

        // let value = state_var.get_fresh_value();

        if state_var.check_if_changed_since_last_rendered() {
            found_changed_state_var = true;
        }

        state_var.record_rendered();
    }

    for child_idx in
        get_non_string_rendered_children_including_from_extend(component_idx, components)
    {
        freshen_renderer_state_for_comp(
            child_idx,
            components,
            dependencies,
            dependent_on_state_var,
            dependent_on_essential,
            essential_data,
            freshen_stack,
            should_initialize_essential_data,
        )
    }
}

fn get_non_string_rendered_children_including_from_extend(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
) -> Vec<ComponentIdx> {
    let component = components[component_idx].borrow_mut();

    let mut children = if let Some(extend_source) = component.get_extend() {
        match extend_source {
            &ExtendSource::Component(source_idx) => {
                get_non_string_rendered_children_including_from_extend(source_idx, components)
            }
            ExtendSource::StateVar((_source_idx, _source_var_idx)) => {
                // TODO: state variable extend source
                Vec::new()
            }
        }
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

fn freshen_state_var(
    original_component_state: ComponentStateDescription,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependencies: &mut Vec<Vec<Vec<Vec<Dependency>>>>,
    dependent_on_state_var: &mut Vec<Vec<Vec<ComponentStateDescription>>>,
    dependent_on_essential: &mut Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,
    essential_data: &mut Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,
    freshen_stack: &mut Vec<StateVarCalculationState>,
    should_initialize_essential_data: bool,
) -> () {
    let current_freshness = components[original_component_state.component_idx]
        .borrow_mut()
        .get_state_variables()[original_component_state.state_var_idx]
        .get_freshness();

    let initial_calculation_state = match current_freshness {
        // No need to continue if the state var is already fresh
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
                        components[component_idx].borrow_mut().get_state_variables()[state_var_idx]
                            .return_dependency_instructions()
                    });

                let mut dependencies_for_state_var = unresolved_state
                    .dependencies_for_state_var
                    .unwrap_or_else(|| Vec::with_capacity(dependency_instructions.len()));

                let mut carryover_instruct_dependencies = unresolved_state.instruct_dependencies;

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
                        for dep in instruct_dependencies.iter() {
                            match &dep.source {
                                DependencySource::StateVar {
                                    component_idx: inner_comp_ind,
                                    state_var_idx: inner_sv_ind,
                                } => {
                                    let vec_dep = &mut dependent_on_state_var[*inner_comp_ind];
                                    vec_dep[*inner_sv_ind].push(ComponentStateDescription {
                                        component_idx,
                                        state_var_idx,
                                    });
                                }
                                DependencySource::Essential {
                                    component_idx: inner_comp_ind,
                                    origin,
                                } => {
                                    let vec_dep = dependent_on_essential[*inner_comp_ind]
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
                                // No need to recurse if the state var is already fresh
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
                let state_var = &mut comp.get_state_variables()[state_var_idx];

                state_var.set_dependencies(&dependencies_for_state_var);

                let dependencies_for_component = &mut dependencies[component_idx];

                dependencies_for_component[state_var_idx] = dependencies_for_state_var;

                state_var.calculate_state_var_from_dependencies();
                state_var.record_all_dependencies_viewed();
            }
            StateVarCalculationState::Stale(stale_state) => {
                let component_state = stale_state.component_state;

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
                                // No need to recurse if the state var is already fresh
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

                let component_idx = component_state.component_idx;
                let state_var_idx = component_state.state_var_idx;

                let mut comp = components[component_idx].borrow_mut();
                let state_var = &mut comp.get_state_variables()[state_var_idx];

                if state_var.check_if_any_dependency_changed_since_last_viewed() {
                    state_var.calculate_state_var_from_dependencies();
                    state_var.record_all_dependencies_viewed();
                } else {
                    state_var.restore_previous_value();
                }
            }
        }
    }

    // log_debug!("Dependency values for {}: {:#?}", component_state, dependency_values);

    // log_debug!("Updated {} to {:?}", component_state, updated_value);

    // return updated_value;
}
