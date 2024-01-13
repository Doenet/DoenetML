use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use crate::components::prelude::*;
use crate::state_var_interfaces::text_state_var_interfaces::{
    GeneralStringStateVarInterface, SingleDependencyStringStateVarInterface,
};

#[derive(Debug, Default, ComponentNode)]
pub struct Text {
    pub common: ComponentCommonData,

    pub value_state_var_view: StateVarReadOnlyViewTyped<String>,

    pub renderer_data: TextRendererData,
}

impl RenderedComponentNode for Text {
    fn to_flat_dast(&mut self, _: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
        let text_value = self
            .value_state_var_view
            .get_fresh_value_record_viewed()
            .to_string();

        let rendered_children = vec![FlatDastElementContent::Text(text_value)];

        FlatDastElement {
            name: self.get_component_type().to_string(),
            attributes: HashMap::new(),
            children: rendered_children,
            data: ElementData {
                id: self.get_idx(),
                ..Default::default()
            },
            position: self.get_position().cloned(),
        }
    }

    fn get_flat_dast_update(&mut self) -> Option<FlatDastElementUpdate> {
        if self
            .value_state_var_view
            .check_if_changed_since_last_viewed()
        {
            let text_value = self
                .value_state_var_view
                .get_fresh_value_record_viewed()
                .to_string();
            let rendered_children = vec![FlatDastElementContent::Text(text_value)];

            Some(FlatDastElementUpdate {
                changed_attributes: None,
                new_children: Some(rendered_children),
                changed_state: None,
            })
        } else {
            None
        }
    }
}

#[derive(Debug, Default)]
pub struct TextRendererData {
    pub id: ComponentIdx,
    pub value: String,
}

impl ComponentNodeStateVariables for Text {
    fn initialize_state_variables(&mut self) {
        self.common.state_variables = Vec::new();

        ///////////////////////
        // Value state variable
        ///////////////////////

        let value_state_variable = StateVarTyped::new(
            Box::<GeneralStringStateVarInterface>::default(),
            StateVarParameters {
                for_renderer: true,
                name: "value",
                dependency_instruction_hint: Some(DependencyInstruction::Child {
                    match_profiles: vec![ComponentProfile::Text],
                    exclude_if_prefer_profiles: vec![],
                }),
                create_dependency_from_extend_source: true,
                is_primary_state_variable_for_shadowing_extend_source: true,
                is_public: true,
            },
            Default::default(),
        );

        // save a view to field for easy access when create flat dast
        self.value_state_var_view = value_state_variable.create_new_read_only_view();

        // Use the value state variable for fulling the text component profile
        self.common.component_profile_state_variables = vec![ComponentProfileStateVariable::Text(
            value_state_variable.create_new_read_only_view(),
            "value",
        )];
        self.common
            .state_variables
            .push(StateVar::String(value_state_variable));

        //////////////////////
        // Text state variable
        //////////////////////
        let text_state_variable = StateVarTyped::new(
            Box::<SingleDependencyStringStateVarInterface>::default(),
            StateVarParameters {
                name: "text",
                dependency_instruction_hint: Some(DependencyInstruction::StateVar {
                    component_idx: None,
                    state_var_name: "value",
                }),
                is_public: true,
                ..Default::default()
            },
            Default::default(),
        );
        self.common
            .state_variables
            .push(StateVar::String(text_state_variable));
    }
}
