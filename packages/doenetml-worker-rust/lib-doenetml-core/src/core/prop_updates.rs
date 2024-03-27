use std::collections::HashMap;

use crate::components::{
    prelude::{ComponentIdx, FlatDastElementUpdate},
    types::{Action, ActionQueryProp, PropPointer, UpdateFromAction},
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

        {
            // A call to on_action from a component processes the arguments and returns a vector
            // of component props with requested new values
            let props_to_update = self
                .document_model
                .get_component(component_idx)
                .on_action(action.action, query_prop)?;

            for UpdateFromAction {
                local_prop_idx,
                prop_value: _requested_value,
            } in props_to_update
            {
                let prop_pointer = PropPointer {
                    component_idx,
                    local_prop_idx,
                };

                let prop_node = self.document_model.prop_pointer_to_prop_node(prop_pointer);

                let status = self.document_model.get_prop_status(prop_node);

                // If prop is unresolved, then resolve it.
                // This could occur only once, but actions are free to seek to modify any prop,
                // even if it hasn't been accessed before.
                if status == PropStatus::Unresolved {
                    self.document_model.resolve_prop(prop_node);
                }

                // Recurse in the inverse direction along to dependency graph
                // to infer how to set the leaves (state props)
                // to attempt to set the prop to its requested value.

                // XXX: implement this
                // process_prop_update_request(PropUpdateRequest::SetProp(prop_ptr, requested_value));
            }
        }
        Ok(self.document_renderer.get_flat_dast_updates())
    }
}
