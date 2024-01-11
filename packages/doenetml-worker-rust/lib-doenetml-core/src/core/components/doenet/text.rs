use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use crate::components::preamble::*;

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
            Box::new(TextStateVarInterface::default()),
            StateVarParameters {
                name: "text",
                ..Default::default()
            },
        );
        self.common
            .state_variables
            .push(StateVar::String(text_state_variable));
    }
}

#[derive(Debug, Default)]
struct ValueStateVarInterface {
    string_child_values: Vec<StateVarReadOnlyViewTyped<String>>,
}

impl StateVarInterface<String> for ValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        let mut dep_instructs = Vec::with_capacity(2);

        dep_instructs.push(DependencyInstruction::Child {
            match_profiles: vec![ComponentProfile::Text],
            exclude_if_prefer_profiles: vec![],
        });

        if let Some(ExtendSource::StateVar(extend_state_var_description)) = extend_source {
            for state_var_match in extend_state_var_description.state_variable_matching.iter() {
                if state_var_match.shadowing_name.is_none() // "value" is the primary state variable for text
                    || state_var_match.shadowing_name.unwrap() == "value"
                {
                    // determined that "value" is shadowing
                    dep_instructs.push(DependencyInstruction::StateVar {
                        component_idx: Some(extend_state_var_description.component_idx),
                        state_var_name: state_var_match.shadowed_name,
                    });

                    break;
                }
            }
        }

        dep_instructs
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        let children = &dependencies[0];

        let mut string_vals = Vec::with_capacity(children.len() + dependencies.len() - 1);

        if dependencies.len() == 2 {
            let extend_value = &dependencies[1][0].value;
            if let StateVarReadOnlyView::String(extend_string_value) = extend_value {
                string_vals.push(extend_string_value.create_new_read_only_view())
            } else {
                panic!("Got a non-string value in extend source for a Text component");
            }
        }

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

    fn calculate_state_var_from_dependencies_and_mark_fresh(
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

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        if self.string_child_values.len() != 1 {
            // TODO: implement for no children where saves to essential value
            Err(())
        } else {
            let desired_value = state_var.get_requested_value();

            self.string_child_values[0].request_change_value_to(desired_value.clone());

            Ok(vec![DependencyValueUpdateRequest {
                instruction_idx: 0,
                dependency_idx: 0,
            }])
        }
    }
}

#[derive(Debug, Default)]
struct TextStateVarInterface {
    value_sv: StateVarReadOnlyViewTyped<String>,
}

impl StateVarInterface<String> for TextStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        vec![DependencyInstruction::StateVar {
            component_idx: None,
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

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) -> () {
        state_var.set_value(self.value_sv.get_fresh_value().clone());
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        let desired_value = state_var.get_requested_value();

        self.value_sv.request_change_value_to(desired_value.clone());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}
