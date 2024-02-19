use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    components::{prelude::UntaggedContent, ComponentEnum, ComponentNode, RenderedChildren},
    dependency::{
        create_dependencies_from_data_query_initialize_state, DataQuery, DependencySource,
    },
    state::{
        prop_state::{StateProp, StatePropDataOrigin, StatePropDescription},
        Freshness, PropValue,
    },
    ComponentIdx, CoreProcessingState, DependencyGraph, Extending,
};

use super::{ComponentState, PropPointer};

/// Freshen the prop specified by original_prop_ptr,
/// then get its fresh value
pub fn get_prop_value(
    original_prop_ptr: PropPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    state_data: &mut Vec<HashMap<StatePropDataOrigin, StateProp>>,
    freshen_stack: &mut Vec<PropPointer>,
) -> PropValue {
    freshen_prop(
        original_prop_ptr,
        components,
        dependency_graph,
        state_data,
        freshen_stack,
    );

    components[original_prop_ptr.component_idx]
        .borrow()
        .get_prop(original_prop_ptr.prop_idx)
        .unwrap()
        .get()
}

/// Internal structure used to track changes
#[derive(Debug, Clone)]
pub enum PropUpdateRequest {
    SetState(StatePropDescription),
    SetProp(PropPointer),
}

/// Freshen all the props for a component that are designated as rendered
/// and recurse to rendered children.
///
/// Returns a vector of the indices of the components reached.
pub fn freshen_all_stale_renderer_states(
    processing_state: &mut CoreProcessingState,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    state_data: &mut Vec<HashMap<StatePropDataOrigin, StateProp>>,
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

        let rendered_prop_indices = components[*component_idx]
            .borrow()
            .get_for_renderer_prop_indices();

        for prop_idx in rendered_prop_indices {
            let prop_ptr = PropPointer {
                component_idx: *component_idx,
                prop_idx,
            };
            freshen_prop(
                prop_ptr,
                components,
                dependency_graph,
                state_data,
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

    let mut children = if let Some(&Extending::Component(source_idx)) = component.get_extending() {
        get_non_string_rendered_children_including_from_extend(source_idx, components)
    } else {
        Vec::new()
    };

    children.extend(
        component
            .get_rendered_children()
            .iter()
            .filter_map(|child| match child {
                &UntaggedContent::Ref(comp_idx) => Some(comp_idx),
                _ => None,
            }),
    );

    children
}

/// If the prop specified by original_prop_ptr is stale or unresolved,
/// then freshen the variable, resolving its dependencies if necessary.
///
/// If the prop was not fresh, then recurse to its dependencies to freshen them.
pub fn freshen_prop(
    original_prop_ptr: PropPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    state_data: &mut Vec<HashMap<StatePropDataOrigin, StateProp>>,
    freshen_stack: &mut Vec<PropPointer>,
) {
    // This function currently implements recursion through an iterative method,
    // using a stack on the heap.
    // This approach was chosen because the function recursion implementation would overflow
    // the small WASM stack once it recursed a few thousands of times.
    // An alternative approach would be to increase the size of the WASM stack.
    // This approach was chosen because it is relatively easy to produce documents
    // with thousands of levels in the dependency graph, and it wasn't clear what
    // size WASM stack would be appropriate.

    let original_freshness = components[original_prop_ptr.component_idx]
        .borrow()
        .get_prop(original_prop_ptr.prop_idx)
        .unwrap()
        .get_freshness();

    // If the current prop is fresh, there's nothing to do.
    // If it is unresolved, resolve it
    match original_freshness {
        Freshness::Fresh => return,
        Freshness::Unresolved => {
            resolve_prop(original_prop_ptr, components, dependency_graph, state_data);
        }
        Freshness::Stale | Freshness::Resolved => (),
    };

    // At this point, the prop is stale or resolved.

    freshen_stack.push(original_prop_ptr);

    while let Some(prop_ptr) = freshen_stack.pop() {
        let current_freshness = components[prop_ptr.component_idx]
            .borrow()
            .get_prop(prop_ptr.prop_idx)
            .unwrap()
            .get_freshness();

        // If we have cycles in the graph, it's possible that this
        // prop was reached from another path and already freshened.
        // Skip it in that case.
        match current_freshness {
            Freshness::Fresh => continue,
            Freshness::Unresolved => {
                panic!("Should not have an unresolved prop here!")
            }
            Freshness::Stale | Freshness::Resolved => (),
        };

        let dependencies_for_prop =
            &dependency_graph.dependencies[prop_ptr.component_idx][prop_ptr.prop_idx];

        // If we find a stale or resolved dependency
        // (i.e., not fresh, as we shouldn't have unresolved)
        // then we aren't ready to freshen this prop.
        // In this case, we will put prop_ptr on the stack
        // followed by its stale/resolved dependencies,
        // and skip the calculation/freshen step at the end.
        // (The calculation/freshen step will occur when it comes off the stack
        // next time, as at that point, its dependencies will all be fresh.)
        let mut prop_ptr_is_ready_to_freshen = true;

        for deps in dependencies_for_prop.iter() {
            for dep in deps.iter() {
                // If can create a prop_ptr from dep.source,
                // it means it is a DependencySource::Prop,
                // so we need to check if that prop is fresh.
                // (There is nothing to do for DependencySource::State.)
                if let Ok(dep_prop_ptr) = PropPointer::try_from(&dep.source) {
                    match dep.value.get_freshness() {
                        // No need to recurse if the prop of the dependency is already fresh
                        // so don't do anything to just continue the inner loop
                        Freshness::Fresh => (),
                        Freshness::Stale | Freshness::Resolved => {
                            // If this is the first time we found a stale/resolved dependency,
                            // this means we have not yet put prop_ptr on the stack,
                            // so we do that now.
                            if prop_ptr_is_ready_to_freshen {
                                freshen_stack.push(prop_ptr);
                                prop_ptr_is_ready_to_freshen = false;
                            }

                            // Before we can freshen prop_ptr,
                            // we have to freshen dep_prop_ptr.
                            // We put that on the stack (which will be after where
                            // prop_ptr is on the stack).
                            freshen_stack.push(dep_prop_ptr);
                        }
                        Freshness::Unresolved => {
                            panic!("How did a stale prop depend on an unresolved prop?")
                        }
                    };
                };
            }
        }

        // At this point, we have gone through all the dependencies.
        // We have two possibilities.
        // 1. The prop prop_ptr is ready to freshen
        //    because all its dependencies are fresh.
        //    In this case we calculate its value to freshen it.
        // 2. We found a stale or resolved dependency of prop_ptr
        //    so it is not ready to freshen.
        //    In this case, we have already put prop_ptr
        //    and each stale/resolved dep_prop_ptr on the stack.
        //    There is nothing to do now.
        //    We'll calculate and freshen prop_ptr next time it comes off the stack.

        if prop_ptr_is_ready_to_freshen {
            // All the dependencies of prop_ptr are fresh.
            // We calculate its value if a dependency has changed,
            // else restore its previous value.

            let component_idx = prop_ptr.component_idx;
            let prop_idx = prop_ptr.prop_idx;

            let mut comp = components[component_idx].borrow_mut();
            let prop = &mut comp.get_prop_mut(prop_idx).unwrap();

            // Check if any dependency has changed since we last called record_all_dependencies_viewed.
            if prop.check_if_any_dependency_changed_since_last_viewed() {
                prop.calculate_and_mark_fresh();
                prop.record_all_dependencies_viewed();
            } else {
                prop.mark_fresh();
            }
        }
    }
}

#[allow(clippy::ptr_arg)]
pub fn resolve_prop(
    original_prop_ptr: PropPointer,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    dependency_graph: &mut DependencyGraph,
    state_data: &mut Vec<HashMap<StatePropDataOrigin, StateProp>>,
) {
    // Since resolving props won't recurse with repeated actions,
    // will go ahead and allocate the stack locally, for simplicity.
    let mut resolve_stack = Vec::new();
    resolve_stack.push(original_prop_ptr);

    while let Some(prop_ptr) = resolve_stack.pop() {
        let component_idx = prop_ptr.component_idx;
        let prop_idx = prop_ptr.prop_idx;

        let data_queries: Vec<DataQuery>;

        {
            let mut component = components[component_idx].borrow_mut();
            let prop = &mut component.get_prop_mut(prop_idx).unwrap();

            let current_freshness = prop.get_freshness();

            if current_freshness != Freshness::Unresolved {
                // nothing to do if the prop is already resolved
                continue;
            }

            data_queries = prop.return_data_queries();
        }

        let mut dependencies_for_prop = Vec::with_capacity(data_queries.len());

        for query in data_queries.iter() {
            let deps = create_dependencies_from_data_query_initialize_state(
                components,
                component_idx,
                prop_idx,
                query,
                state_data,
            );

            // add these dependencies to the inverse graph:
            // dependent_on_prop or dependent_on_state.
            for dep in deps.iter() {
                match &dep.source {
                    DependencySource::Prop {
                        component_idx: inner_comp_idx,
                        prop_idx: inner_prop_idx,
                    } => {
                        let vec_dep = &mut dependency_graph.dependent_on_prop[*inner_comp_idx];
                        vec_dep[*inner_prop_idx].push(PropPointer {
                            component_idx,
                            prop_idx,
                        });
                    }
                    DependencySource::State {
                        component_idx: inner_comp_idx,
                        origin,
                    } => {
                        let vec_dep = dependency_graph.dependent_on_state[*inner_comp_idx]
                            .entry(origin.clone())
                            .or_default();
                        vec_dep.push(PropPointer {
                            component_idx,
                            prop_idx,
                        });
                    }
                }
            }

            for dep in deps.iter() {
                if let DependencySource::Prop {
                    component_idx: comp_idx_inner,
                    prop_idx: prop_idx_inner,
                } = &dep.source
                {
                    let new_prop_ptr = PropPointer {
                        component_idx: *comp_idx_inner,
                        prop_idx: *prop_idx_inner,
                    };

                    let new_current_freshness = dep.value.get_freshness();

                    if new_current_freshness == Freshness::Unresolved {
                        // recurse to any unresolved dependencies
                        resolve_stack.push(new_prop_ptr);
                    }
                }
            }

            dependencies_for_prop.push(deps);
        }

        {
            let mut component = components[component_idx].borrow_mut();
            let prop = &mut component.get_prop_mut(prop_idx).unwrap();

            prop.save_dependencies(&dependencies_for_prop);

            let dependencies_for_component = &mut dependency_graph.dependencies[component_idx];

            dependencies_for_component[prop_idx] = dependencies_for_prop;
        }

        {
            components[component_idx]
                .borrow()
                .get_prop(prop_idx)
                .unwrap()
                .set_as_resolved();
        }
    }
}
