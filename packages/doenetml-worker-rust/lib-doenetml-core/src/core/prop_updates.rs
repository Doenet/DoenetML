use std::collections::HashMap;

use crate::components::{
    prelude::{ComponentIdx, FlatDastElementUpdate},
    types::{Action, ActionQueryProp, PropPointer, PropUpdateRequest, UpdateFromAction},
    ComponentOnAction,
};

use super::{core::Core, props::cache::PropStatus};

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
        let query_prop = ActionQueryProp::new(component_idx, self);

        // A call to on_action from a component processes the arguments and returns a vector
        // of component props with requested new values
        let _props_to_update = self
            .document_model
            .get_component(component_idx)
            .on_action(action.action, query_prop)?
            .into_iter()
            .map(
                |UpdateFromAction {
                     local_prop_idx,
                     requested_value,
                 }| {
                    let prop_node = self.document_model.prop_pointer_to_prop_node(PropPointer {
                        component_idx,
                        local_prop_idx,
                    });

                    // If prop is unresolved, then resolve it.
                    // This could occur only once, but actions are free to seek to modify any prop,
                    // even if it hasn't been accessed before.
                    // TODO: probably don't need this step anymore?
                    let status = self.document_model.get_prop_status(prop_node);
                    if status == PropStatus::Unresolved {
                        self.document_model.resolve_prop(prop_node);
                    }

                    PropUpdateRequest {
                        prop_node,
                        requested_value,
                    }
                },
            );

        // XXX: implement this
        // process_prop_update_request(props_to_update);
        Ok(self.document_renderer.get_flat_dast_updates())
    }
}
