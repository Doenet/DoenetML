use anyhow::Result;

use crate::components::doenet::text_input::TextInputAction;
use crate::components::ComponentEnum;
use crate::{AllActions, ComponentIdx, DoenetMLCore};

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ActionWithOnlyComponentIndex {
    component_idx: usize,
}

impl DoenetMLCore {
    /// Convert a json string into an action. The action must contain a `componentIdx` field.
    /// The type of `self.components[componentIdx]` is checked and the action deserialization
    /// will fail if it is not compatible with the component.
    pub fn deserialize_action(
        &self,
        action_json: &str,
    ) -> Result<(ComponentIdx, AllActions), String> {
        let action_with_only_component_index: ActionWithOnlyComponentIndex =
            serde_json::from_str(action_json).map_err(|e| {
                format!(
                    "Cannot find `componentIdx on action `{}`. Got error: {}",
                    action_json, e
                )
            })?;
        let idx = action_with_only_component_index.component_idx;
        let component = self
            .components
            .get(idx)
            .ok_or_else(|| format!("Cannot find component with index/id {}", idx))?;

        let make_error_string = |e: serde_json::Error| {
            format!(
                "Cannot deserialize action `{}` for component `{}`. Got error: {}",
                action_json,
                component.borrow(),
                e
            )
        };

        let action = match *component.borrow() {
            ComponentEnum::TextInput(_) => {
                let action: TextInputAction =
                    serde_json::from_str(action_json).map_err(make_error_string)?;
                AllActions::TextInput(action)
            }
            _ => {
                return Err(format!(
                    "No actions available for component `{}`",
                    component.borrow()
                ))
            }
        };

        Ok((idx, action))
    }
}
