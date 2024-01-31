use std::{cell::RefCell, collections::HashMap, rc::Rc};

#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use super::components::component_creation::{
    create_component_children, replace_macro_referents_of_children_evaluate_attributes,
};

use super::components::{ComponentActions, ComponentEnum};
use super::dast::{
    DastFunctionMacro, DastMacro, DastRoot, DastWarning, FlatDastElement, FlatDastElementContent,
    FlatDastElementUpdate, FlatDastRoot, Position as DastPosition,
};

use super::state::essential_state::{EssentialDataOrigin, EssentialStateVar};
use super::state::state_var_calculations::{
    freshen_all_stale_renderer_states, get_state_var_value, resolve_state_var,
    StateVariableUpdateRequest,
};
use super::state::state_var_updates::process_state_variable_update_request;
use super::state::Freshness;

use crate::components::actions::{Action, UpdateFromAction};
use crate::components::prelude::{ComponentState, DependenciesCreatedForDataQuery, StateVarIdx};
use crate::dast::{get_flat_dast_update, to_flat_dast};
use crate::state::StateVarPointer;
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
    /// (This dast is currently not modified when macros are replaced or other interactions.)
    pub dast_root: DastRoot,

    /// The root node of the document
    pub root: DoenetMLRoot,

    /// Vector of all components
    ///
    /// Components may or may not be descendants of *root*.
    ///
    /// Each component is identified by its *ComponentIdx*, which is its index in this vector.
    pub components: Vec<Rc<RefCell<ComponentEnum>>>,

    /// A DAG whose vertices are the state variables (and attributes?)
    /// of every component, and whose endpoint vertices are essential data.
    pub dependency_graph: DependencyGraph,

    /// Endpoints of the dependency graph.
    /// Every update instruction will lead to these.
    ///
    /// The essential data are the only data needed to construct the document state
    /// as all other state variables are calculated from them.
    /// When saving state to a database, only essential data needs to be saved.
    ///
    /// Data structure:
    /// - The vector index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The hash map key *EssentialDataOrigin* specifies how the component created the essential data.
    /// - The hash map value *EssentialStateVariable* is a *StateVarMutableViewEnum*
    ///   that stores the value.
    ///   (Note, unlike for state variables, *EssentialStateVariable* is not attached to any *StateVar*,
    ///   as it doesn't need *StateVarUpdater*.)
    pub essential_data: Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,

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
    /// A DAG whose vertices are the state variables (and attributes?)
    /// of every component, and whose endpoint vertices are essential data.
    ///
    /// Used for
    /// - producing values when determining a state variable
    /// - tracking when a change affects other state variables
    ///
    /// Structure of the nested vectors:
    /// - The first index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The second index is the *StateVarIdx*,
    /// defined by the order in which state variables are defined for the component.
    /// - The third index is the index of the *DataQuery* for the state variable.
    /// - The inner DependenciesCreatedForDataQuery is the vector of dependencies
    ///   that matched that DataQuery.
    pub dependencies: Vec<Vec<Vec<DependenciesCreatedForDataQuery>>>,

    /// The inverse of the dependency graph *dependencies* (along with *dependent_on_essential*).
    /// It specifies the state variables that are dependent on each state variable.
    ///
    /// Structure of the nested vectors:
    /// - The first index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The second index is the *StateVarIdx*,
    /// defined by the order in which state variables are defined for the component.
    /// - The inner vector is the list of component/state variable combinations
    /// that are dependent on this state variable.
    pub dependent_on_state_var: Vec<Vec<Vec<StateVarPointer>>>,

    /// The inverse of the dependency graph *dependencies* (along with *dependent_on_state_var*).
    /// It specifies the state variables that are dependent on each piece of essential data.
    ///
    /// Data structure:
    /// - The vector index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The hash map key *EssentialDataOrigin* specifies how the component created the essential data.
    /// - The hash map value vector is the list of component/state variable combinations
    /// that are dependent on this piece of essential data.
    pub dependent_on_essential: Vec<HashMap<EssentialDataOrigin, Vec<StateVarPointer>>>,
}

#[derive(Debug)]
pub struct CoreProcessingState {
    /// List of the rendered components that have stale `for_renderer` state variables.
    pub stale_renderers: Vec<ComponentIdx>,

    // To prevent unnecessary reallocations of temporary vectors, like stacks,
    // we store them on the DoenetMLCore struct so that they will stay allocated.
    pub freshen_stack: Vec<StateVarPointer>,
    pub mark_stale_stack: Vec<StateVarPointer>,
    pub update_stack: Vec<StateVariableUpdateRequest>,
}

#[derive(Debug)]
pub struct DoenetMLRoot {
    pub children: Vec<ComponentPointerTextOrMacro>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

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
            .filter_map(|child| match child {
                ComponentPointerTextOrMacro::Component(comp_idx) => {
                    Some(FlatDastElementContent::Element(*comp_idx))
                }
                ComponentPointerTextOrMacro::Text(s) => {
                    Some(FlatDastElementContent::Text(s.to_string()))
                }
                ComponentPointerTextOrMacro::Macro(_the_macro) => None,
                ComponentPointerTextOrMacro::FunctionMacro(_function_macro) => None,
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

/// Information specifying a component, string or macro, used for component children or attributes.
/// - For a component, we just store its index.
/// - For a string, store that string
///
/// TODO: can we eliminate macros eventually since they should be converted to components and strings?
#[derive(Debug, Clone)]
pub enum ComponentPointerTextOrMacro {
    Component(ComponentIdx),
    Text(String),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

/// Information of the source that a component is extending, which is currently
/// either another component or a state variable.
#[derive(Debug, Clone)]
pub enum ExtendSource {
    /// The component is extending another entire component, given by the component index
    Component(ComponentIdx),
    // TODO: what about array state variables?
    /// The component is extending the state variable of another component
    StateVar(ExtendStateVariableDescription),
}

/// Description of the shadowing of state variables
/// when a component extends the state variable of another component
#[derive(Debug, Clone)]
pub struct ExtendStateVariableDescription {
    /// the component being extended
    pub component_idx: ComponentIdx,

    /// the matching of which state variables are shadowing which state variables
    pub state_variable_matching: Vec<StateVariableShadowingMatch>,
}

/// Description of which state variable is shadowing
/// another state variable when extending a component
#[derive(Debug, Clone)]
pub struct StateVariableShadowingMatch {
    /// The state variable with this index in the extending component
    /// will match (shadow) the state variable
    /// from the component being extended
    pub shadowing_state_var_idx: StateVarIdx,

    /// The state variable with this index in the component being extended
    /// will be shadowed
    pub shadowed_state_var_idx: StateVarIdx,
}

impl DoenetMLCore {
    pub fn new(
        dast_root: DastRoot,
        source: &str,
        _flags_json: &str,
        existing_essential_data: Option<Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>>,
    ) -> Self {
        let mut components: Vec<Rc<RefCell<ComponentEnum>>> = Vec::new();
        let warnings: Vec<DastWarning> = Vec::new();

        let (children, descendant_names) =
            create_component_children(&mut components, &dast_root.children, None);

        // add root node
        let root = DoenetMLRoot {
            children,
            descendant_names,
            position: dast_root.position.clone(),
        };

        replace_macro_referents_of_children_evaluate_attributes(&mut components, 0);

        let essential_data = existing_essential_data
            .unwrap_or_else(|| (0..components.len()).map(|_| HashMap::new()).collect());

        let mut dependencies = Vec::with_capacity(components.len());
        let mut dependent_on_state_var = Vec::with_capacity(components.len());
        let mut dependent_on_essential = Vec::with_capacity(components.len());

        for comp in &components {
            // create vector of length num of state var defs, where each entry is zero-length vector
            let num_inner_state_var_defs = comp.borrow().get_num_state_variables();
            dependencies.push((0..num_inner_state_var_defs).map(|_| vec![]).collect());
            dependent_on_state_var.push(vec![Vec::new(); num_inner_state_var_defs]);

            dependent_on_essential.push(HashMap::new());
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
                dependent_on_state_var,
                dependent_on_essential,
            },
            essential_data,
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

    /// Freshen all the state variables for a component in *stale_renderers*
    /// and recurse to rendered children.
    ///
    /// Returns a vector of the indices of the components reached.
    pub fn freshen_renderer_state(&mut self) -> Vec<ComponentIdx> {
        freshen_all_stale_renderer_states(
            &mut self.processing_state,
            &self.components,
            &mut self.dependency_graph,
            &mut self.essential_data,
        )
    }

    /// Run the action specified by the `action` json and return any changes to the output flat dast.
    ///
    /// The behavior of an action is defined by each component type. Based on the arguments
    /// to the action, it will request that certain state variables have new values.
    ///
    /// The `action` json should be an object with these fields
    /// - `component_idx`: the index of the component originating the action
    /// - `action_name`: the name of the action
    /// - `args`: an object containing data that will be interpreted by the action implementation.
    ///   The values of each field must be quantities that can be converted into `StateVarValue`
    ///   or a vector of `StateVarValue`.
    pub fn dispatch_action(
        &mut self,
        action: Action,
    ) -> Result<HashMap<ComponentIdx, FlatDastElementUpdate>, String> {
        let component_idx = action.component_idx;

        // We allow actions to resolve and get the value of any state variable from the component.
        // To accomplish this, we pass in a function closure that will
        // - take a state variable index,
        // - freshen the state variable, if needed, and
        // - return the state variable's value
        let mut state_var_resolver = |state_var_idx: StateVarIdx| {
            get_state_var_value(
                StateVarPointer {
                    component_idx,
                    state_var_idx,
                },
                &self.components,
                &mut self.dependency_graph,
                &mut self.essential_data,
                &mut self.processing_state.freshen_stack,
            )
        };

        {
            // A call to on_action from a component processes the arguments and returns a vector
            // of component state variables with requested new values
            let state_vars_to_update = self.components[component_idx]
                .borrow()
                .on_action(action.action, &mut state_var_resolver)?;

            for UpdateFromAction(state_var_idx, requested_value) in state_vars_to_update {
                let freshness;

                {
                    let component = self.components[component_idx].borrow();
                    let state_variable = &component.get_state_variable(state_var_idx).unwrap();

                    // Record the requested value directly on the state variable.
                    // Later calls from within process_state_variable_update_request
                    // will call request_dependency_updates on the state variable
                    // which will look up this requested value.
                    state_variable.set_requested_value(requested_value);

                    freshness = state_variable.get_freshness();
                }

                // Since the requested value is stored in the state variable,
                // now we just need to keep track of which state variable we are seeking to update.
                let state_var_ptr = StateVarPointer {
                    component_idx,
                    state_var_idx,
                };

                // If state variable is unresolved, then resolve it.
                // This could occur only once, but actions are free to seek to modify any state variable,
                // even if it hasn't been accessed before.
                if freshness == Freshness::Unresolved {
                    resolve_state_var(
                        state_var_ptr,
                        &self.components,
                        &mut self.dependency_graph,
                        &mut self.essential_data,
                    );
                }

                // Recurse in the inverse direction along to dependency graph
                // to infer how to set the leaves (essential state variables)
                // to attempt to set the state variable to its requested value.
                process_state_variable_update_request(
                    StateVariableUpdateRequest::SetStateVar(state_var_ptr),
                    &self.components,
                    &mut self.dependency_graph,
                    &mut self.essential_data,
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

    /// Output updates for any elements with changed rendered state variables
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
}
