use std::{cell::RefCell, collections::HashMap, rc::Rc, str::FromStr};

use component::{
    ComponentEnum, ComponentNode, RenderedComponentNode, _error::_Error, _external::_External,
};
use dast::{
    DastElementContent, DastError, DastFunctionMacro, DastMacro, DastRoot, DastWarning,
    FlatDastElement, FlatDastElementContent, FlatDastRoot, PathPart, Position as DastPosition,
};

use dependency::Dependency;

pub mod component;
pub mod dast;
pub mod dependency;
pub mod state;
pub mod utils;

use crate::utils::{log, log_debug, log_json};

#[derive(Debug, Clone)]
pub struct ComponentState {
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
    pub dependent_on_state_var: Vec<Vec<Vec<ComponentState>>>,

    pub warnings: Vec<DastWarning>,

    /// The original DoenetML string
    ///
    /// Main use is for components and properties that extract portions of the DoenetML.
    pub doenetml: String,
}

impl DoenetMLCore {
    pub fn to_flat_dast(&self) -> FlatDastRoot {
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

#[derive(Debug)]
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

pub fn create_doenetml_core(
    dast_json: &str,
    source: &str,
    flags_json: &str,
) -> Result<DoenetMLCore, String> {
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

    // log!("after replace macros {:#?}", components);

    let core = DoenetMLCore {
        dast_root,
        root,
        components,
        // component_state_variables: Vec::new(),
        dependencies: Vec::new(),
        dependent_on_state_var: Vec::new(),
        warnings,
        doenetml: source.to_string(),
    };

    Ok(core)
}

fn create_component_children(
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    warnings: &mut Vec<DastWarning>,
    dast_children: &Vec<DastElementContent>,
    parent_ind: ComponentIdx,
) -> (Vec<ComponentChild>, HashMap<String, Vec<ComponentIdx>>) {
    let mut descendant_names: HashMap<String, Vec<ComponentIdx>> = HashMap::new();

    let mut component_children: Vec<ComponentChild> = Vec::new();

    for child in dast_children {
        match child {
            DastElementContent::Element(child_element) => {
                // For element children, both create component and add to descendant names:
                // 1. Look for a name attribute with valid value and add to descendant names.
                // 2. Create component for the child
                // 3. Recurse to child's children, and add in any descendant names found

                // TODO: need to add attributes and determine approach for component types

                let child_ind = components.len();

                if let Some(name_attr) = child_element.attributes.get("name") {
                    if let Ok(name_string) = name_attr.get_string_value() {
                        // Add the child's index to the descendant_names vector for that name
                        // (or create an entry with a vector consisting of just this index).
                        descendant_names
                            .entry(name_string.to_string())
                            .and_modify(|name_indices| name_indices.push(child_ind))
                            .or_insert(vec![child_ind]);
                    }
                }

                // To create a component for child_element,
                // we match the name attribute (which is the component type)
                // to the name of one of the variants of ComponentEnum
                // (a case-insensitive match due to ComponentEnum tagging).

                let mut component_enum = ComponentEnum::from_str(&child_element.name)
                    .unwrap_or_else(|_| {
                        // if we didn't find a match, then create a component of type external
                        ComponentEnum::_External(_External {
                            name: child_element.name.clone(),
                            ..Default::default()
                        })
                    });

                // We have a variant of ComponentEnum
                // corresponding to the name of the DastElement (or _external if no match)
                // where all attributes of the structure were given their default values.
                // Initialize some of the attributes.
                component_enum.initialize(
                    child_ind,
                    Some(parent_ind),
                    child_element.position.clone(),
                );

                components.push(Rc::new(RefCell::new(component_enum)));

                // recurse to children after adding to components
                // so that will get the correct indices for the children
                let (child_children, child_descendent_names) = create_component_children(
                    components,
                    warnings,
                    &child_element.children,
                    child_ind,
                );

                let child_node = &mut components[child_ind].borrow_mut();

                child_node.set_children(child_children);
                child_node.set_descendant_names(child_descendent_names.clone());

                // merge in the descendant names found from the child
                // into the overall descendant names for the parent
                for (comp_name, mut name_inds) in child_descendent_names {
                    descendant_names
                        .entry(comp_name)
                        .and_modify(|name_indices| name_indices.append(&mut name_inds))
                        .or_insert(name_inds);
                }
                component_children.push(ComponentChild::Component(child_ind));
            }
            DastElementContent::Text(child_text) => {
                component_children.push(ComponentChild::Text(child_text.value.clone()));
            }
            DastElementContent::Macro(child_macro) => {
                // for now, just stick in the dast macro
                component_children.push(ComponentChild::Macro(child_macro.clone()));
            }
            DastElementContent::FunctionMacro(child_function_macro) => {
                // for now, just stick in the dast function macro,
                // which clearly is wrong as it will include elements as children
                component_children
                    .push(ComponentChild::FunctionMacro(child_function_macro.clone()));
            }
            DastElementContent::Error(child_error) => {
                let child_ind = components.len();

                let mut error = _Error {
                    ..Default::default()
                };
                error.initialize(child_ind, Some(parent_ind), child_error.position.clone());

                error.message = child_error.message.clone();

                components.push(Rc::new(RefCell::new(ComponentEnum::_Error(error))));

                component_children.push(ComponentChild::Component(child_ind));
            }
        }
    }

    (component_children, descendant_names)
}

fn replace_macro_referents(
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) {
    // We need to temporarily put in an empty vector into the children field
    // and move the children into a separate vector.
    // Otherwise, we cannot take ownership of the vectors components using .into_iter()
    let old_children = components[component_idx]
        .borrow_mut()
        .replace_children(vec![]);

    let new_children = old_children
        .into_iter()
        .map(|child| {
            match child {
                ComponentChild::Component(child_ind) => {
                    // recurse on component children
                    replace_macro_referents(components, child_ind);
                    child
                }
                ComponentChild::Macro(ref dast_macro) => {
                    if let Some((matched_ind, path_remainder)) =
                        match_name_reference(&components, &dast_macro.path, component_idx)
                    {
                        let new_ind = components.len();

                        let mut new_comp_enum = ComponentEnum::from_str(
                            &components[matched_ind].borrow().get_component_type(),
                        )
                        .unwrap();

                        new_comp_enum.initialize(new_ind, Some(component_idx), None);

                        // TODO: if have leftover path (stored in path_remainder),
                        // determine state variable it refers to
                        new_comp_enum.set_extend(Some(ExtendSource::Component(matched_ind)));

                        components.push(Rc::new(RefCell::new(new_comp_enum)));

                        ComponentChild::Component(new_ind)
                    } else {
                        // did not match macro so just keep it as a macro for now
                        child
                    }
                }
                // TODO: need to recurse to arguments of function macros
                _ => child,
            }
        })
        .collect();

    components[component_idx]
        .borrow_mut()
        .set_children(new_children);
}

fn match_name_reference<'a>(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a Vec<PathPart>,
    comp_ind: ComponentIdx,
) -> Option<(ComponentIdx, &'a [PathPart])> {
    let comp = &components[comp_ind].borrow();

    // TODO: handle index of path

    if let Some(matched_inds) = comp.get_descendant_matches(&path[0].name) {
        if matched_inds.len() == 1 {
            // matched initial part of the macro path
            // check if can match any additional parts of the path
            return match_descendant_names(components, &path[1..], matched_inds[0]);
        } else {
            // If there is more than one component that matches the name,
            // then we have no match (do not recurse to parent).
            // We are assuming there are no zero length vectors,
            // as they are treated in the same way as if there is more than one match.
            return None;
        }
    } else if let Some(parent_ind) = comp.get_parent() {
        // since the initial path piece was not found in this component's descendants,
        // recurse to parent
        return match_name_reference(components, path, parent_ind);
    } else {
        // we reached the root with no match found
        return None;
    }
}

fn match_descendant_names<'a>(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a [PathPart],
    comp_ind: ComponentIdx,
) -> Option<(ComponentIdx, &'a [PathPart])> {
    if path.len() > 0 {
        let comp = &components[comp_ind].borrow();

        // TODO: handle index of path

        if let Some(matched_inds) = comp.get_descendant_matches(&path[0].name) {
            if matched_inds.len() == 1 {
                // matched initial part of the macro path
                // check if can match any additional parts of the path
                return match_descendant_names(components, &path[1..], matched_inds[0]);
            }
        }
    }

    Some((comp_ind, path))
}
