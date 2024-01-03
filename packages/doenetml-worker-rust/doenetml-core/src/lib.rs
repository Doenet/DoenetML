use std::{
    cell::RefCell,
    collections::{HashMap, HashSet},
    rc::Rc,
};

use component::{ComponentEnum, ComponentNode, ComponentNodeStateVariables, RenderedComponentNode};
use component_creation::{create_component_children, replace_macro_referents};
use dast::{
    DastFunctionMacro, DastMacro, DastRoot, DastWarning, FlatDastElement, FlatDastElementContent,
    FlatDastRoot, Position as DastPosition,
};

use dependency::Dependency;
use essential_state::{EssentialDataOrigin, EssentialStateDescription, EssentialStateVar};
use state_var_calculations::{freshen_renderer_state_for_comp, StateVarCalculationState};

pub mod component;
pub mod component_creation;
pub mod dast;
pub mod dependency;
pub mod essential_state;
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

    /// Vector of all state variables of all components.
    ///
    /// Structure of the nested vectors:
    /// - The first index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The second index is the *StateVarIdx*,
    /// defined by the order in which state variables are defined for the component.
    // pub component_state_variables: Vec<Vec<StateVar>>,

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

    /// The inverse of the dependency graph *dependencies*.
    /// It specifies the state variables that are dependent on each state variable
    ///
    /// Structure of the nested vectors:
    /// - The first index is the *ComponentIdx* of the component,
    /// defined by the order in *components*.
    /// - The second index is the *StateVarIdx*,
    /// defined by the order in which state variables are defined for the component.
    /// - The inner vector is the list of component/state variable combinations
    /// that are dependent on this state variable
    pub dependent_on_state_var: Vec<Vec<Vec<ComponentStateDescription>>>,

    pub dependent_on_essential: Vec<HashMap<EssentialDataOrigin, Vec<ComponentStateDescription>>>,

    /// Endpoints of the dependency graph.
    /// Every update instruction will lead to these.
    pub essential_data: Vec<HashMap<EssentialDataOrigin, EssentialStateVar>>,

    /// if true, then we didn't read in initial essential_data
    /// so must initialize essential data when creating dependencies
    pub should_initialize_essential_data: bool,

    pub stale_renderers: HashSet<ComponentIdx>,

    pub freshen_stack: Vec<StateVarCalculationState>,

    pub mark_stale_stack: Vec<(ComponentIdx, StateVarIdx)>,

    pub update_stack: Vec<UpdateRequest>,

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
                ComponentChild::Component(comp_ind) => {
                    Some(FlatDastElementContent::Element(*comp_ind))
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

#[derive(Debug, Clone)]
pub enum ComponentChild {
    Component(ComponentIdx),
    Text(String),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

#[derive(Debug)]
pub enum ExtendSource {
    Component(ComponentIdx),
    // TODO: what about array state variables?
    StateVar((ComponentIdx, StateVarIdx)),
}

/// Internal structure used to track changes
#[derive(Debug, Clone)]
pub enum UpdateRequest {
    SetEssentialValue(EssentialStateDescription),
    SetStateVar(ComponentStateDescription),
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
            create_component_children(&mut components, &mut warnings, &dast_root.children, 0);

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

    pub fn freshen_renderer_state(&mut self) {
        for comp_idx in self.stale_renderers.iter() {
            freshen_renderer_state_for_comp(
                *comp_idx,
                &self.components,
                &mut self.dependencies,
                &mut self.dependent_on_state_var,
                &mut self.dependent_on_essential,
                &mut self.essential_data,
                &mut self.freshen_stack,
                self.should_initialize_essential_data,
            )
        }
    }

    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        self.freshen_renderer_state();

        let elements: Vec<FlatDastElement> = self
            .components
            .iter()
            .map(|comp| comp.borrow().to_flat_dast(&self.components))
            .collect();

        let warnings: Vec<DastWarning> = self
            .warnings
            .iter()
            .map(|warning| warning.clone())
            .collect();

        self.root.to_flat_dast(elements, warnings)
    }
}
