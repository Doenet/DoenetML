use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use crate::component::ComponentProfile;
use crate::dast::{ElementData, FlatDastElement, FlatDastElementContent, Position as DastPosition};
use crate::dependency::{Dependency, DependencyInstruction};
use crate::state::{
    StateVar, StateVarInterface, StateVarMutableViewTyped, StateVarParameters,
    StateVarReadOnlyView, StateVarReadOnlyViewTyped, StateVarTyped,
};
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::{
    ComponentEnum, ComponentNode, ComponentNodeBase, ComponentProfileStateVariables,
    RenderedComponentNode,
};

#[derive(Debug, Default, ComponentNode)]
pub struct Text {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub state_variables: Vec<StateVar>,

    pub value_state_var_view: StateVarReadOnlyViewTyped<String>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariables>,

    pub renderer_data: TextRendererData,
}

impl RenderedComponentNode for Text {
    fn to_flat_dast(&self, _: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
        let text_value = self.value_state_var_view.get_fresh_value().to_string();

        let rendered_children = vec![FlatDastElementContent::Text(text_value)];

        FlatDastElement {
            name: self.get_component_type().to_string(),
            attributes: HashMap::new(),
            children: rendered_children,
            data: Some(ElementData {
                id: self.get_idx(),
                ..Default::default()
            }),
            position: self.get_position().cloned(),
        }
    }
}

#[derive(Debug, Default)]
pub struct TextRendererData {
    pub id: ComponentIdx,
    pub value: String,
}

impl ComponentNodeBase for Text {
    fn initialize_state_variables(&mut self) {
        ///////////////////////
        // Value state variable
        ///////////////////////
        let value_state_variable = StateVarTyped::new(
            Box::new(ValueStateVarInterface::default()),
            StateVarParameters {
                for_renderer: true,
                name: "value",
                ..Default::default()
            },
        );

        // save a view to field for easy access when create flat dast
        self.value_state_var_view = value_state_variable.create_new_read_only_view();

        // Use the value state variable for fulling the text component profile
        self.component_profile_state_variables = vec![ComponentProfileStateVariables::Text(
            value_state_variable.create_new_read_only_view(),
        )];
        self.state_variables
            .push(StateVar::String(value_state_variable));

        //////////////////////
        // Text state variable
        //////////////////////
        let text_state_variable = StateVarTyped::new(
            Box::new(TextStateVarInterface::default()),
            StateVarParameters {
                name: "value",
                ..Default::default()
            },
        );
        self.state_variables
            .push(StateVar::String(text_state_variable));
    }
}

#[derive(Debug, Default)]
struct ValueStateVarInterface {
    string_child_values: Vec<StateVarReadOnlyViewTyped<String>>,
}

impl StateVarInterface<String> for ValueStateVarInterface {
    fn return_dependency_instructions(&self) -> Vec<DependencyInstruction> {
        vec![DependencyInstruction::Child {
            match_profiles: vec![ComponentProfile::Text],
            exclude_if_prefer_profiles: vec![],
        }]
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        let children = &dependencies[0];

        let mut string_vals = Vec::with_capacity(children.len());

        for Dependency {
            value: child_value, ..
        } in children.iter()
        {
            if let StateVarReadOnlyView::String(child_string_value) = child_value {
                string_vals.push(child_string_value.create_new_read_only_view())
            } else {
                panic!("Got a non-string value when asked for a Text component profile");
            }
        }

        self.string_child_values = string_vals;
    }

    fn calculate_state_var_from_dependencies(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) -> () {
        // TODO: can we implement this without cloning the inner value?
        let value: String = self
            .string_child_values
            .iter()
            .map(|v| v.get_fresh_value().clone())
            .collect();

        state_var.set_value(value);
    }
}

#[derive(Debug, Default)]
struct TextStateVarInterface {
    value_sv: StateVarReadOnlyViewTyped<String>,
}

impl StateVarInterface<String> for TextStateVarInterface {
    fn return_dependency_instructions(&self) -> Vec<DependencyInstruction> {
        vec![DependencyInstruction::StateVar {
            state_var_name: "value",
        }]
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        let dep_val = &dependencies[0][0].value;

        if let StateVarReadOnlyView::String(string_val) = dep_val {
            self.value_sv = string_val.create_new_read_only_view();
        } else {
            panic!("Something went wrong with text sv of text");
        }
    }

    fn calculate_state_var_from_dependencies(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) -> () {
        state_var.set_value(self.value_sv.get_fresh_value().clone());
    }
}
