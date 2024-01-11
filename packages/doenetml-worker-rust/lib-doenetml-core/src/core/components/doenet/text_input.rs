use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use serde::{Deserialize, Serialize};

use crate::components::preamble::*;

#[derive(Debug, Default, ComponentNode)]
pub struct TextInput {
    pub common: ComponentCommonData,

    pub immediate_value_state_var_view: StateVarReadOnlyViewTyped<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextInputRenderData {
    pub id: usize,

    pub immediate_value: String,
}

impl RenderedComponentNode for TextInput {
    fn to_flat_dast(&mut self, _: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
        let immediate_value = self
            .immediate_value_state_var_view
            .get_fresh_value_record_viewed()
            .to_string();

        FlatDastElement {
            name: self.get_component_type().to_string(),
            attributes: HashMap::new(),
            children: vec![],

            data: ElementData {
                id: self.get_idx(),
                action_names: Some(self.get_action_names()),
                state: Some(HashMap::from([(
                    "immediateValue".to_string(),
                    StateVarValue::String(immediate_value),
                )])),
                ..Default::default()
            },
            position: self.get_position().cloned(),
        }
    }

    fn get_flat_dast_update(&mut self) -> Option<FlatDastElementUpdate> {
        if self
            .immediate_value_state_var_view
            .check_if_changed_since_last_viewed()
        {
            let immediate_value = self
                .immediate_value_state_var_view
                .get_fresh_value_record_viewed()
                .to_string();

            Some(FlatDastElementUpdate {
                changed_attributes: None,
                new_children: None,
                changed_state: Some(HashMap::from([(
                    "immediateValue".to_string(),
                    StateVarValue::String(immediate_value),
                )])),
            })
        } else {
            None
        }
    }

    fn get_action_names(&self) -> Vec<String> {
        vec![
            "updateImmediateValue".to_string(),
            "updateValue".to_string(),
        ]
    }

    fn on_action<'a>(
        &self,
        action_name: &str,
        args: HashMap<String, Vec<StateVarValue>>,
        resolve_and_retrieve_state_var: &'a mut dyn FnMut(usize) -> StateVarValue,
    ) -> Vec<(usize, StateVarValue)> {
        match action_name {
            "updateImmediateValue" => {
                let new_val = args.get("text").expect("No text argument").first().unwrap();

                vec![
                    (
                        self.common.state_variable_name_to_index["immediateValue"],
                        new_val.clone(),
                    ),
                    (
                        self.common.state_variable_name_to_index["syncImmediateValue"],
                        StateVarValue::Boolean(false),
                    ),
                ]
            }

            "updateValue" => {
                let new_val = resolve_and_retrieve_state_var(
                    self.common.state_variable_name_to_index["immediateValue"],
                );

                vec![(self.common.state_variable_name_to_index["value"], new_val)]
            }

            _ => panic!("Unknown action '{}' called on textInput", action_name),
        }
    }
}

impl ComponentNodeStateVariables for TextInput {
    fn initialize_state_variables(&mut self) {
        self.common.state_variables = Vec::new();

        ///////////////////////
        // Value state variable
        ///////////////////////
        let value_state_variable = StateVarTyped::new(
            Box::new(ValueStateVarInterface::default()),
            StateVarParameters {
                name: "value",
                is_public: true,
                ..Default::default()
            },
        );

        // Use the value state variable for fulling the text component profile
        self.common.component_profile_state_variables = vec![ComponentProfileStateVariable::Text(
            value_state_variable.create_new_read_only_view(),
            "value",
        )];
        self.common
            .state_variables
            .push(StateVar::String(value_state_variable));

        /////////////////////////////////
        // Immediate value state variable
        /////////////////////////////////
        let immediate_value_state_variable = StateVarTyped::new(
            Box::new(ImmediateValueStateVarInterface::default()),
            StateVarParameters {
                name: "immediateValue",
                is_public: true,
                for_renderer: true,
                ..Default::default()
            },
        );

        // save a view to field for easy access when create flat dast
        self.immediate_value_state_var_view =
            immediate_value_state_variable.create_new_read_only_view();

        self.common
            .state_variables
            .push(StateVar::String(immediate_value_state_variable));

        //////////////////////////////////////
        // Sync immediate value state variable
        //////////////////////////////////////
        let sync_immediate_value_state_variable = StateVarTyped::new(
            Box::new(SyncImmediateValueStateVarInterface::default()),
            StateVarParameters {
                name: "syncImmediateValue",
                initial_essential_value: true,
                ..Default::default()
            },
        );
        self.common
            .state_variables
            .push(StateVar::Boolean(sync_immediate_value_state_variable));

        // ///////////////////////////////
        // // Bind value to state variable
        // ///////////////////////////////
        // let bind_value_to_state_variable = StateVarTyped::new(
        //     Box::new(BindValueToInterface::default()),
        //     StateVarParameters {
        //         name: "bindValueTo",
        //         ..Default::default()
        //     },
        // );
        // self.state_variables
        //     .push(StateVar::String(bind_value_to_state_variable));
    }
}

#[derive(Debug, Default)]
struct ValueStateVarInterface {
    essential_value: StateVarReadOnlyViewTyped<String>,
    immediate_value: StateVarReadOnlyViewTyped<String>,
    sync_values: StateVarReadOnlyViewTyped<bool>,
    // bind_value_to: StateVarReadOnlyViewTyped<String>,
}

impl StateVarInterface<String> for ValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        vec![
            DependencyInstruction::Essential {
                prefill: Some("prefill"),
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "immediateValue",
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "syncImmediateValue",
            },
            // DependencyInstruction::StateVar {
            //     state_var_name: "bindValueTo",
            // },
        ]
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        if let StateVarReadOnlyView::String(essential_value) = &dependencies[0][0].value {
            self.essential_value = essential_value.create_new_read_only_view();
        } else {
            panic!("Got a non-string essential value for value of text input.");
        }

        if let StateVarReadOnlyView::String(immediate_value) = &dependencies[1][0].value {
            self.immediate_value = immediate_value.create_new_read_only_view();
        } else {
            panic!("Got a non-string immediate value for value of text input.");
        }

        if let StateVarReadOnlyView::Boolean(sync_values) = &dependencies[2][0].value {
            self.sync_values = sync_values.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean sync values for value of text input.");
        }

        // if let StateVarReadOnlyView::String(bind_value_to) = &dependencies[3][0].value {
        //     self.bind_value_to = bind_value_to.create_new_read_only_view();
        // } else {
        //     panic!("Got a non-string bind_value_to for value of text input.");
        // }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) -> () {
        let bind_value_to_used_default = true; // = self.bind_value_to.get_used_default();

        let value = if *self.sync_values.get_fresh_value() {
            self.immediate_value.get_fresh_value().clone()
        } else if bind_value_to_used_default {
            self.essential_value.get_fresh_value().clone()
        } else {
            unreachable!()
            // self.bind_value_to.get_fresh_value().clone()
        };

        let value_changed = if let Some(old_value) = state_var.try_get_last_value() {
            if value != *old_value {
                true
            } else {
                false
            }
        } else {
            true
        };

        if value_changed {
            state_var.set_value(value);
        } else {
            state_var.restore_previous_value();
        }
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        let desired_value = state_var.get_requested_value();
        let bind_value_to_used_default = true; //self.bind_value_to.get_used_default();

        if bind_value_to_used_default {
            self.essential_value
                .request_change_value_to(desired_value.clone());
            self.immediate_value
                .request_change_value_to(desired_value.clone());
            self.sync_values.request_change_value_to(true);

            Ok(vec![
                DependencyValueUpdateRequest {
                    instruction_idx: 0,
                    dependency_idx: 0,
                },
                DependencyValueUpdateRequest {
                    instruction_idx: 1,
                    dependency_idx: 0,
                },
                DependencyValueUpdateRequest {
                    instruction_idx: 2,
                    dependency_idx: 0,
                },
            ])
        } else {
            unreachable!();
            // self.bind_value_to
            //     .request_change_value_to(desired_value.clone());
            // self.sync_values.request_change_value_to(true);

            // Ok(vec![
            //     DependencyValueUpdateRequest {
            //         instruction_idx: 3,
            //         dependency_idx: 0,
            //     },
            //     DependencyValueUpdateRequest {
            //         instruction_idx: 2,
            //         dependency_idx: 0,
            //     },
            // ])
        }
    }
}

#[derive(Debug, Default)]
struct ImmediateValueStateVarInterface {
    essential_value: StateVarReadOnlyViewTyped<String>,
    sync_values: StateVarReadOnlyViewTyped<bool>,
    // bind_value_to: StateVarReadOnlyViewTyped<String>,
}

impl StateVarInterface<String> for ImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        vec![
            DependencyInstruction::Essential {
                prefill: Some("prefill"),
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "syncImmediateValue",
            },
            // DependencyInstruction::StateVar {
            //     state_var_name: "bindValueTo",
            // },
        ]
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        if let StateVarReadOnlyView::String(essential_value) = &dependencies[0][0].value {
            self.essential_value = essential_value.create_new_read_only_view();
        } else {
            panic!("Got a non-string essential value for immediate value of text input.");
        }

        if let StateVarReadOnlyView::Boolean(sync_values) = &dependencies[1][0].value {
            self.sync_values = sync_values.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean sync values for immediate value of text input.");
        }

        // if let StateVarReadOnlyView::String(bind_value_to) = &dependencies[2][0].value {
        //     self.bind_value_to = bind_value_to.create_new_read_only_view();
        // } else {
        //     panic!("Got a non-string bind_value_to for immediate value of text input.");
        // }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) -> () {
        let bind_value_to_used_default = true; //self.bind_value_to.get_used_default();

        let immediate_value = if !bind_value_to_used_default && *self.sync_values.get_fresh_value()
        {
            unreachable!()
            // self.bind_value_to.get_fresh_value().clone()
        } else {
            self.essential_value.get_fresh_value().clone()
        };

        let value_changed = if let Some(old_value) = state_var.try_get_last_value() {
            if immediate_value != *old_value {
                true
            } else {
                false
            }
        } else {
            true
        };

        if value_changed {
            state_var.set_value(immediate_value);
        } else {
            state_var.restore_previous_value();
        }
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        let desired_value = state_var.get_requested_value();

        let mut updates = Vec::with_capacity(2);
        let bind_value_to_used_default = true; // self.bind_value_to.get_used_default();

        self.essential_value
            .request_change_value_to(desired_value.clone());

        updates.push(DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        });

        if !is_direct_change_from_renderer && !bind_value_to_used_default {
            unreachable!()
            // self.bind_value_to
            //     .request_change_value_to(desired_value.clone());

            // updates.push(DependencyValueUpdateRequest {
            //     instruction_idx: 2,
            //     dependency_idx: 0,
            // });
        }

        Ok(updates)
    }
}

#[derive(Debug, Default)]
struct SyncImmediateValueStateVarInterface {
    essential_value: StateVarReadOnlyViewTyped<bool>,
}

impl StateVarInterface<bool> for SyncImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        vec![DependencyInstruction::Essential { prefill: None }]
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        if let StateVarReadOnlyView::Boolean(essential_value) = &dependencies[0][0].value {
            self.essential_value = essential_value.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean essential value for syncImmediate of text input.");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<bool>,
    ) -> () {
        state_var.set_value(self.essential_value.get_fresh_value().clone());
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        let desired_value = state_var.get_requested_value();

        self.essential_value.request_change_value_to(*desired_value);

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}
