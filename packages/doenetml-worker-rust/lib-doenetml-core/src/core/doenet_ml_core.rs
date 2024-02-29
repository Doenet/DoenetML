use std::{cell::RefCell, collections::HashMap, rc::Rc};

#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use super::components::{ComponentActions, ComponentEnum};
use super::dast::{
    DastRoot, DastWarning, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
    FlatDastRoot, Position as DastPosition,
};

use super::state::prop_calculations::{
    freshen_all_stale_renderer_states, get_prop_value, resolve_prop, PropUpdateRequest,
};
use super::state::prop_state::{StateProp, StatePropDataOrigin};
use super::state::prop_updates::process_prop_update_request;
use super::state::Freshness;

use crate::components::actions::{Action, UpdateFromAction};
use crate::components::component_builder::ComponentBuilder;
use crate::components::prelude::{ComponentState, DependenciesCreatedForDataQuery, PropIdx};
use crate::dast::flat_dast::{FlatRoot, NormalizedRoot, UntaggedContent};
use crate::dast::ref_expand::Expander;
use crate::dast::{get_flat_dast_update, to_flat_dast};
use crate::state::PropPointer;
#[allow(unused)]
use crate::utils::{log, log_debug, log_json};

#[cfg_attr(feature = "web", tsify::declare)]
pub type ComponentIdx = usize;

/// All the state of DoenetML document with methods to interact with it.
#[derive(Debug)]
pub struct DoenetMLCore {
    /// The root of the dast defining the document structure.
    ///
    /// **TODO**: is there a reason to keep the original dast around?
    /// (This dast is currently not modified when refs are expanded or other interactions.)
    pub dast_root: DastRoot,

    /// The root node of the document
    pub root: DoenetMLRoot,

    /// Vector of all components
    ///
    /// Components may or may not be descendants of *root*.
    ///
    /// Each component is identified by its *ComponentIdx*, which is its index in this vector.
    pub components: Vec<Rc<RefCell<ComponentEnum>>>,

    /// A DAG whose vertices are the props (and attributes?)
    /// of every component, and whose endpoint vertices are state data.
    pub dependency_graph: DependencyGraph,

    /// Endpoints of the dependency graph.
    /// Every update instruction will lead to these.
    ///
    /// The state data are the only data needed to construct the document state
    /// as all other props are calculated from them.
    /// When saving state to a database, only state data needs to be saved.
    ///
    /// Data structure:
    /// - The vector index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The hash map key *StatePropDataOrigin* specifies how the component created the state data.
    /// - The hash map value *StatePropProp* is a *PropViewMutEnum*
    ///   that stores the value.
    ///   (Note, unlike for props, *StateProp* is not attached to any *Prop*,
    ///   as it doesn't need *PropUpdater*.)
    pub state_data: Vec<HashMap<StatePropDataOrigin, StateProp>>,

    pub processing_state: CoreProcessingState,

    pub warnings: Vec<DastWarning>,

    /// The original DoenetML string
    ///
    /// Main use is for components and properties that extract portions of the DoenetML.
    pub doenetml: String,
}

#[derive(Debug)]
pub struct DependencyGraph {
    /// **The Dependency Graph**
    ///
    /// A DAG whose vertices are the props (and attributes?)
    /// of every component, and whose endpoint vertices are state data.
    ///
    /// Used for
    /// - producing values when determining a prop
    /// - tracking when a change affects other props
    ///
    /// Structure of the nested vectors:
    /// - The first index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The second index is the *PropIdx*,
    /// defined by the order in which props are defined for the component.
    /// - The third index is the index of the *DataQuery* for the prop.
    /// - The inner DependenciesCreatedForDataQuery is the vector of dependencies
    ///   that matched that DataQuery.
    pub dependencies: Vec<Vec<Vec<DependenciesCreatedForDataQuery>>>,

    /// The inverse of the dependency graph *dependencies* (along with *dependent_on_state*).
    /// It specifies the props that are dependent on each prop.
    ///
    /// Structure of the nested vectors:
    /// - The first index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The second index is the *PropIdx*,
    /// defined by the order in which props are defined for the component.
    /// - The inner vector is the list of component/prop combinations
    /// that are dependent on this prop.
    pub dependent_on_prop: Vec<Vec<Vec<PropPointer>>>,

    /// The inverse of the dependency graph *dependencies* (along with *dependent_on_prop*).
    /// It specifies the props that are dependent on each piece of state data.
    ///
    /// Data structure:
    /// - The vector index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The hash map key *StatePropDataOrigin* specifies how the component created the state data.
    /// - The hash map value vector is the list of component/prop combinations
    /// that are dependent on this piece of state data.
    pub dependent_on_state: Vec<HashMap<StatePropDataOrigin, Vec<PropPointer>>>,
}

#[derive(Debug)]
pub struct CoreProcessingState {
    /// List of the rendered components that have stale `for_renderer` props.
    pub stale_renderers: Vec<ComponentIdx>,

    // To prevent unnecessary reallocations of temporary vectors, like stacks,
    // we store them on the DoenetMLCore struct so that they will stay allocated.
    pub freshen_stack: Vec<PropPointer>,
    pub mark_stale_stack: Vec<PropPointer>,
    pub update_stack: Vec<PropUpdateRequest>,
}

#[derive(Debug)]
pub struct DoenetMLRoot {
    pub children: Vec<UntaggedContent>,

    pub position: Option<DastPosition>,
}

impl DoenetMLRoot {
    fn to_flat_dast(
        &self,
        elements: Vec<FlatDastElement>,
        warnings: Vec<DastWarning>,
    ) -> FlatDastRoot {
        let children: Vec<FlatDastElementContent> = self
            .children
            .iter()
            .map(|child| match child {
                UntaggedContent::Ref(comp_idx) => FlatDastElementContent::Element(*comp_idx),
                UntaggedContent::Text(s) => FlatDastElementContent::Text(s.to_string()),
            })
            .collect();

        FlatDastRoot {
            children,
            elements,
            warnings,
            position: self.position.clone(),
        }
    }
}

/// Information of the source that a component is extending, which is currently
/// either another component or a prop.
#[derive(Debug, Clone)]
pub enum Extending {
    /// The component is extending another entire component, given by the component index
    Component(ComponentIdx),
    // TODO: what about array props?
    /// The component is extending the prop of another component
    Prop(PropSource),
}

#[derive(Debug, Clone, Copy)]
pub struct PropSource {
    /// The prop being extended
    pub prop_pointer: PropPointer,

    /// If true, the source of the extending was due to a direct reference,
    /// as opposed to being in an extend attribute.
    ///
    /// For example, given `<textInput name="i"/>`, a direct ref would be `$i.value` by itself,
    /// unlike `<text extend="$i.value"/>`.
    ///
    /// If we are extending from a direct ref,
    /// we need to add the referenced prop as a child in the `DataQuery::ChildPropProfile`,
    /// because the prop was not already added to the children.
    pub from_direct_ref: bool,
}

impl DoenetMLCore {
    pub fn new(
        dast_root: DastRoot,
        source: &str,
        _flags_json: &str,
        existing_state_data: Option<Vec<HashMap<StatePropDataOrigin, StateProp>>>,
    ) -> Self {
        let warnings: Vec<DastWarning> = Vec::new();

        let mut flat_root = FlatRoot::from_dast(&dast_root);
        Expander::expand(&mut flat_root);
        flat_root.compactify();
        let normalized_root = NormalizedRoot::from_flat_root(&flat_root);
        let components = ComponentBuilder::from_normalized_root(&normalized_root)
            .components
            .into_iter()
            .map(|c| Rc::new(RefCell::new(c)))
            .collect::<Vec<_>>();

        // add root node
        let root = DoenetMLRoot {
            children: flat_root.children,
            position: None,
        };

        let state_data = existing_state_data
            .unwrap_or_else(|| (0..components.len()).map(|_| HashMap::new()).collect());

        let mut dependencies = Vec::with_capacity(components.len());
        let mut dependent_on_prop = Vec::with_capacity(components.len());
        let mut dependent_on_state = Vec::with_capacity(components.len());

        for comp in &components {
            // create vector of length num of prop defs, where each entry is zero-length vector
            let num_inner_prop_defs = comp.borrow().get_num_props();
            dependencies.push((0..num_inner_prop_defs).map(|_| vec![]).collect());
            dependent_on_prop.push(vec![Vec::new(); num_inner_prop_defs]);

            dependent_on_state.push(HashMap::new());
        }

        // Initialize with the document element being stale.
        // (We assume that dast_json is normalized so that the only child of root
        // is the document tag.)
        let stale_renderers = Vec::from([0]);

        DoenetMLCore {
            dast_root,
            root,
            components,
            dependency_graph: DependencyGraph {
                dependencies,
                dependent_on_prop,
                dependent_on_state,
            },
            state_data,
            processing_state: CoreProcessingState {
                stale_renderers,
                freshen_stack: Vec::new(),
                mark_stale_stack: Vec::new(),
                update_stack: Vec::new(),
            },
            warnings,
            doenetml: source.to_string(),
        }
    }

    /// Freshen all the props for a component in *stale_renderers*
    /// and recurse to rendered children.
    ///
    /// Returns a vector of the indices of the components reached.
    pub fn freshen_renderer_state(&mut self) -> Vec<ComponentIdx> {
        freshen_all_stale_renderer_states(
            &mut self.processing_state,
            &self.components,
            &mut self.dependency_graph,
            &mut self.state_data,
        )
    }

    /// Run the action specified by the `action` json and return any changes to the output flat dast.
    ///
    /// The behavior of an action is defined by each component type. Based on the arguments
    /// to the action, it will request that certain props have new values.
    ///
    /// The `action` json should be an object with these fields
    /// - `component_idx`: the index of the component originating the action
    /// - `action_name`: the name of the action
    /// - `args`: an object containing data that will be interpreted by the action implementation.
    ///   The values of each field must be quantities that can be converted into `PropValue`
    ///   or a vector of `PropValue`.
    pub fn dispatch_action(
        &mut self,
        action: Action,
    ) -> Result<HashMap<ComponentIdx, FlatDastElementUpdate>, String> {
        let component_idx = action.component_idx;

        // We allow actions to resolve and get the value of any prop from the component.
        // To accomplish this, we pass in a function closure that will
        // - take a prop index,
        // - freshen the prop, if needed, and
        // - return the prop's value
        let mut prop_resolver = |prop_idx: PropIdx| {
            get_prop_value(
                PropPointer {
                    component_idx,
                    local_prop_idx: prop_idx,
                },
                &self.components,
                &mut self.dependency_graph,
                &mut self.state_data,
                &mut self.processing_state.freshen_stack,
            )
        };

        {
            // A call to on_action from a component processes the arguments and returns a vector
            // of component props with requested new values
            let props_to_update = self.components[component_idx]
                .borrow()
                .on_action(action.action, &mut prop_resolver)?;

            for UpdateFromAction(prop_idx, requested_value) in props_to_update {
                let freshness;

                {
                    let component = self.components[component_idx].borrow();
                    let prop = &component.get_prop(prop_idx).unwrap();

                    // Record the requested value directly on the prop.
                    // Later calls from within process_prop_update_request
                    // will call invert on the prop
                    // which will look up this requested value.
                    prop.set_requested_value(requested_value);

                    freshness = prop.get_freshness();
                }

                // Since the requested value is stored in the prop,
                // now we just need to keep track of which prop we are seeking to update.
                let prop_ptr = PropPointer {
                    component_idx,
                    local_prop_idx: prop_idx,
                };

                // If prop is unresolved, then resolve it.
                // This could occur only once, but actions are free to seek to modify any prop,
                // even if it hasn't been accessed before.
                if freshness == Freshness::Unresolved {
                    resolve_prop(
                        prop_ptr,
                        &self.components,
                        &mut self.dependency_graph,
                        &mut self.state_data,
                    );
                }

                // Recurse in the inverse direction along to dependency graph
                // to infer how to set the leaves (state props)
                // to attempt to set the prop to its requested value.
                process_prop_update_request(
                    PropUpdateRequest::SetProp(prop_ptr),
                    &self.components,
                    &mut self.dependency_graph,
                    &mut self.state_data,
                    &mut self.processing_state,
                );
            }
        }
        Ok(self.get_flat_dast_updates())
    }

    /// Output all components as a flat dast,
    /// where we create a vector of each component's dast element,
    /// and dast elements refer to their children via its *ComponentIdx* in that vector.
    ///
    /// Include warnings as a separate vector (errors are embedded in the tree as elements).
    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        // Since are outputting the whole dast, we ignore which components were freshened
        self.freshen_renderer_state();

        let elements: Vec<FlatDastElement> = (0..self.components.len())
            .map(|comp_idx| to_flat_dast(comp_idx, &self.components))
            .collect();

        self.root.to_flat_dast(elements, self.warnings.to_vec())
    }

    /// Output updates for any elements with changed rendered props
    pub fn get_flat_dast_updates(&mut self) -> HashMap<ComponentIdx, FlatDastElementUpdate> {
        let components_changed = self.freshen_renderer_state();

        let mut flat_dast_updates: HashMap<ComponentIdx, FlatDastElementUpdate> = HashMap::new();
        for component_idx in components_changed {
            if let Some(element_update) = get_flat_dast_update(component_idx, &self.components) {
                flat_dast_updates.insert(component_idx, element_update);
            }
        }
        flat_dast_updates
    }

    /// Convenience function to freshen and evaluate a prop from tests.
    ///
    /// Intended for use in integration tests.
    /// Not generally useful as it requires a mutable reference to all of core,
    /// which doesn't play well with the borrow checker.
    pub fn get_prop_value(
        &mut self,
        component_idx: ComponentIdx,
        prop_idx: PropIdx,
    ) -> crate::components::prelude::PropValue {
        get_prop_value(
            PropPointer {
                component_idx,
                local_prop_idx: prop_idx,
            },
            &self.components,
            &mut self.dependency_graph,
            &mut self.state_data,
            &mut self.processing_state.freshen_stack,
        )
    }
}
