use std::collections::HashMap;

use crate::components::{
    ComponentOnAction,
    prelude::{ComponentIdx, FlatDastElementUpdate},
    types::{Action, ActionQueryProp},
};

use super::core::Core;

impl Core {
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
        let query_prop = ActionQueryProp::new(component_idx, &self.document_model);

        // A call to on_action from a component processes the arguments and returns a vector
        // of component props with requested new values
        let updates_from_action = self
            .document_model
            .get_component(component_idx)
            .on_action(action.action, query_prop)?;

        let changes_to_make = self
            .document_model
            .calculate_changes_from_action_updates(updates_from_action, component_idx);

        let changed_components = self.document_model.execute_changes(changes_to_make);

        Ok(self
            .document_renderer
            .get_flat_dast_updates(changed_components, &self.document_model))
    }
}
