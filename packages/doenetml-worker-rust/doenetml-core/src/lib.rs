use std::{
    cell::RefCell,
    collections::{HashMap, HashSet},
    rc::Rc,
};

use component::{ComponentEnum, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode};
use component_creation::{create_component_children, replace_macro_referents};
use dast::{
    DastFunctionMacro, DastMacro, DastRoot, DastWarning, FlatDastElement, FlatDastElementContent,
    FlatDastElementUpdate, FlatDastRoot, Position as DastPosition,
};

use dependency::Dependency;
use essential_state::{EssentialDataOrigin, EssentialStateVar};
use state::{Freshness, StateVarName, StateVarValue};
use state_var_calculations::{
    freshen_renderer_state_for_component, freshen_state_var, get_state_var_value,
    process_state_variable_update_request, StateVarCalculationState, StateVariableUpdateRequest,
};

pub mod component;
pub mod component_creation;
pub mod dast;
pub mod dependency;
pub mod essential_state;
pub mod parse_json;
pub mod state;
pub mod state_var_calculations;
pub mod utils;

use crate::utils::{log, log_debug, log_json};

#[derive(Debug, Clone, Copy)]
pub struct ComponentStateDescription {
    pub component_idx: ComponentIdx,
    pub state_var_idx: StateVarIdx,
}

pub type ComponentIdx = usize;
pub type StateVarIdx = usize;

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

    /// **The Dependency Graph**
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
    /// - The third index is the index of the *DependencyInstruction* for the state variable.
    /// - The inner vector is the dependencies that matched that DependencyInstruction.
    pub dependencies: Vec<Vec<Vec<Vec<Dependency>>>>,

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
    pub dependent_on_state_var: Vec<Vec<Vec<ComponentStateDescription>>>,

    /// The inverse of the dependency graph *dependencies* (along with *dependent_on_state_var*).
    /// It specifies the state variables that are dependent on each piece of essential data.
    ///
    /// Data structure:
    /// - The vector index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The hash map key *EssentialDataOrigin* specifies how the component created the essential data.
    /// - The hash map value vector is the list of component/state variable combinations
    /// that are dependent on this piece of essential data.
    pub dependent_on_essential: Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,

    /// Endpoints of the dependency graph.
    /// Every update instruction will lead to these.
    ///
    /// Data structure:
    /// - The vector index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The hash map key *EssentialDataOrigin* specifies how the component created the essential data.
    /// - The hash map value *EssentialStateVariable* is a *StateVarMutableView*
    ///   that stores the value.
    ///   (Note, unlike for state variables, *EssentialStateVariable* is not attached to any *StateVarTyped*,
    ///   as it doesn't need a *StateVarInterface*.)
    pub essential_data: Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,

    /// if true, then we didn't read in initial essential_data
    /// so must initialize essential data when creating dependencies
    /// TODO: how does this work?
    pub should_initialize_essential_data: bool,

    pub stale_renderers: HashSet<ComponentIdx>,

    pub freshen_stack: Vec<StateVarCalculationState>,

    pub mark_stale_stack: Vec<ComponentStateDescription>,

    pub update_stack: Vec<StateVariableUpdateRequest>,

    pub warnings: Vec<DastWarning>,

    /// The original DoenetML string
    ///
    /// Main use is for components and properties that extract portions of the DoenetML.
    pub doenetml: String,
}

#[derive(Debug)]
pub struct DoenetMLRoot {
    pub children: Vec<ComponentChild>,

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
                ComponentChild::Component(comp_idx) => {
                    Some(FlatDastElementContent::Element(*comp_idx))
                }
                ComponentChild::Text(s) => Some(FlatDastElementContent::Text(s.to_string())),
                ComponentChild::Macro(_the_macro) => None,
                ComponentChild::FunctionMacro(_function_macro) => None,
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

/// Information specifying a child of a component.
/// - If the child is a component, we just store its index.
/// - If the child is a string, store that string
/// TODO: can we eliminate macros eventually since they should be converted to components and strings?
#[derive(Debug, Clone)]
pub enum ComponentChild {
    Component(ComponentIdx),
    Text(String),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

/// Information of the source that a component is extending, which is currently
/// either another component or a state variable.
#[derive(Debug)]
pub enum ExtendSource {
    /// The component is extending another entire component, given by the component index
    Component(ComponentIdx),
    // TODO: what about array state variables?
    /// The component is extending the state variable of another component
    StateVar(ExtendStateVariableDescription),
}

/// Description of the shadowing of state variables
/// when a component extends the state variable of another component
#[derive(Debug)]
pub struct ExtendStateVariableDescription {
    /// the component being extended
    pub component_idx: ComponentIdx,

    /// the matching of which state variables are shadowing which state variables
    pub state_variable_matching: Vec<StateVariableShadowingMatch>,
}

/// Description of which state variable is shadowing
/// another state variable when extending a component
#[derive(Debug)]
pub struct StateVariableShadowingMatch {
    /// The state variable index in the extending component
    /// whose value will match (shadow) the state variable
    /// from the component being extended
    pub shadowing_idx: StateVarIdx,

    /// The state variable name in the component being extended
    pub shadowed_name: StateVarName,
}

/// Specification of an action call received from renderer
#[derive(Debug)]
pub struct Action {
    pub component_idx: ComponentIdx,
    pub action_name: String,

    /// The keys are not state variable names.
    /// They are whatever name the renderer calls the new value.
    pub args: HashMap<String, Vec<StateVarValue>>,
}

impl DoenetMLCore {
    pub fn new(
        dast_json: &str,
        source: &str,
        _flags_json: &str,
        existing_essential_data: Option<Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>>,
    ) -> Self {
        let dast_root: DastRoot = serde_json::from_str(dast_json).expect("Error extracting dast");

        let mut components: Vec<Rc<RefCell<ComponentEnum>>> = Vec::new();
        let mut warnings: Vec<DastWarning> = Vec::new();

        let (children, descendant_names) =
            create_component_children(&mut components, &mut warnings, &dast_root.children, None);

        // add root node
        let root = DoenetMLRoot {
            children,
            descendant_names,
            position: dast_root.position.clone(),
        };

        replace_macro_referents(&mut components, 0);

        components.iter().for_each(|comp| {
            comp.borrow_mut().initialize_state_variables();
        });

        // TODO: what does should_initialize_essential_data mean?
        // We are currently ignoring this flag (but haven't yet set up all types of essential data)
        let should_initialize_essential_data = existing_essential_data.is_none();
        let essential_data = existing_essential_data
            .unwrap_or_else(|| (0..components.len()).map(|_| HashMap::new()).collect());

        let mut dependencies = Vec::with_capacity(components.len());
        let mut dependent_on_state_var = Vec::with_capacity(components.len());
        let mut dependent_on_essential = Vec::with_capacity(components.len());

        for ind in 0..components.len() {
            // create vector of length num of state var defs, where each entry is zero-length vector
            let num_inner_state_var_defs = components[ind].borrow().get_num_state_variables();
            dependencies.push((0..num_inner_state_var_defs).map(|_| vec![]).collect());
            dependent_on_state_var.push(vec![Vec::new(); num_inner_state_var_defs]);

            dependent_on_essential.push(HashMap::new());
        }

        // Initialize with the document element being stale.
        // (We assume that dast_json is normalized so that the only child of root
        // is the document tag.)
        let stale_renderers = HashSet::from([0]);

        DoenetMLCore {
            dast_root,
            root,
            components,
            dependencies,
            dependent_on_state_var,
            dependent_on_essential,
            essential_data,
            stale_renderers,
            should_initialize_essential_data,
            freshen_stack: Vec::new(),
            mark_stale_stack: Vec::new(),
            update_stack: Vec::new(),
            warnings,
            doenetml: source.to_string(),
        }
    }

    /// Freshen all the state variables for a component in *stale_renderers*
    /// and recurse to rendered children.
    ///
    /// Returns a vector of the indices of the components reached.
    pub fn freshen_renderer_state(&mut self) -> Vec<ComponentIdx> {
        let mut components_freshened = Vec::new();

        for comp_idx in self.stale_renderers.iter() {
            let new_components_freshened = freshen_renderer_state_for_component(
                *comp_idx,
                &self.components,
                &mut self.dependencies,
                &mut self.dependent_on_state_var,
                &mut self.dependent_on_essential,
                &mut self.essential_data,
                &mut self.freshen_stack,
                self.should_initialize_essential_data,
            );
            components_freshened.extend(new_components_freshened);
        }
        components_freshened
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
    pub fn handle_action(&mut self, action: &str) -> HashMap<ComponentIdx, FlatDastElementUpdate> {
        let action = parse_json::parse_action_from_json(action)
            .unwrap_or_else(|_| panic!("Error parsing json action: {}", action));

        if action.action_name == "recordVisibilityChange" {
            return HashMap::new();
        }

        let component_idx = action.component_idx;

        // We allow actions to resolve and get the value of any state variable from the component.
        // To accomplish this, we pass in a function closure that will
        // - take a state variable index,
        // - freshen the state variable, if needed, and
        // - return the state variable's value
        let mut state_var_resolver = |state_var_idx: usize| {
            get_state_var_value(
                ComponentStateDescription {
                    component_idx,
                    state_var_idx,
                },
                &self.components,
                &mut self.dependencies,
                &mut self.dependent_on_state_var,
                &mut self.dependent_on_essential,
                &mut self.essential_data,
                &mut self.freshen_stack,
                self.should_initialize_essential_data,
            )
        };

        {
            let component = self.components[component_idx].borrow();

            // A call to on_action from a component processes the arguments and returns a vector
            // of component state variables with requested new values
            let state_vars_to_update =
                component.on_action(&action.action_name, action.args, &mut state_var_resolver);

            for (state_var_idx, requested_value) in state_vars_to_update {
                let component = self.components[component_idx].borrow();
                let state_variable = &component.get_state_variables()[state_var_idx];

                // Record the requested value directly on the state variable.
                // Later calls from within process_state_variable_update_request
                // will call request_dependencies_to_update_value on the state variable
                // which will look up this requested value.
                state_variable.request_change_value_to(requested_value);

                // Since the requested value is stored in the state variable,
                // now we just need to keep track of which state variable we are seeking to update.
                let component_state = ComponentStateDescription {
                    component_idx,
                    state_var_idx,
                };

                // If state variable is unresolved, then calculate its value to resolve it.
                // This could occur only once, but actions are free to seek to modify any state variable,
                // even if it hasn't been accessed before.
                if state_variable.get_freshness() == Freshness::Unresolved {
                    freshen_state_var(
                        component_state,
                        &self.components,
                        &mut self.dependencies,
                        &mut self.dependent_on_state_var,
                        &mut self.dependent_on_essential,
                        &mut self.essential_data,
                        &mut self.freshen_stack,
                        self.should_initialize_essential_data,
                    );
                }

                // Recurse in the inverse direction along to dependency graph
                // to infer how to set the leaves (essential state variables)
                // to attempt to set the state variable to its requested value.
                process_state_variable_update_request(
                    StateVariableUpdateRequest::SetStateVar(component_state),
                    &self.components,
                    &mut self.dependencies,
                    &mut self.dependent_on_state_var,
                    &mut self.dependent_on_essential,
                    &mut self.essential_data,
                    &mut self.stale_renderers,
                    &mut self.mark_stale_stack,
                    &mut self.update_stack,
                );
            }
        }
        self.get_flat_dast_updates()
    }

    /// Output all components as a flat dast,
    /// where we create a vector of each component's dast element,
    /// and dast elements refer to their children via its *ComponentIdx* in that vector.
    ///
    /// Include warnings as a separate vector (errors are embedded in the tree as elements).
    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        // Since are outputting the whole dast, we ignore which components were freshened
        self.freshen_renderer_state();

        let elements: Vec<FlatDastElement> = self
            .components
            .iter()
            .map(|comp| comp.borrow_mut().to_flat_dast(&self.components))
            .collect();

        let warnings: Vec<DastWarning> = self
            .warnings
            .iter()
            .map(|warning| warning.clone())
            .collect();

        self.root.to_flat_dast(elements, warnings)
    }

    pub fn get_flat_dast_updates(&mut self) -> HashMap<ComponentIdx, FlatDastElementUpdate> {
        let components_changed = self.freshen_renderer_state();

        let mut flat_dast_updates: HashMap<ComponentIdx, FlatDastElementUpdate> = HashMap::new();
        for component_idx in components_changed {
            let mut component = self.components[component_idx].borrow_mut();
            if let Some(element_update) = component.get_flat_dast_update() {
                flat_dast_updates.insert(component_idx, element_update);
            }
        }
        flat_dast_updates
    }
}
