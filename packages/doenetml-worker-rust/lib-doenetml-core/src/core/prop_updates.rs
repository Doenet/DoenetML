use std::collections::HashMap;

use crate::components::{
    prelude::{ComponentIdx, FlatDastElementUpdate, LocalPropIdx},
    types::{Action, PropPointer, UpdateFromAction},
    ComponentOnAction,
};

use super::{
    core::Core,
    props::{cache::PropStatus, PropValue},
};

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
        // To accomplish this, we pass in a function closure that will
        // - take a prop index,
        // - freshen the prop, if needed, and
        // - return the prop's value
        let mut prop_resolver = |_prop_idx: LocalPropIdx| {
            // XXX - we need another solution here.
            // probably have the action request which prop values it wants and do multiple passes

            PropValue::Boolean(false) // return something for now

            // self.get_prop_value(PropPointer {
            //     component_idx,
            //     local_prop_idx: prop_idx,
            // })
        };

        {
            // A call to on_action from a component processes the arguments and returns a vector
            // of component props with requested new values
            let props_to_update = self
                .document_model
                .document_structure
                .get_component(component_idx)
                .on_action(action.action, &mut prop_resolver)?;

            for UpdateFromAction(local_prop_idx, _requested_value) in props_to_update {
                let prop_pointer = PropPointer {
                    component_idx,
                    local_prop_idx,
                };

                // XXX: this is obsolete. Replace with new method
                // Record the requested value directly on the prop.
                // Later calls from within process_prop_update_request
                // will call invert on the prop
                // which will look up this requested value.
                // prop.set_requested_value(requested_value);

                let prop_node =
                    prop_pointer.into_prop_node(&self.document_model.document_structure);

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
                // process_prop_update_request(PropUpdateRequest::SetProp(prop_ptr));
            }
        }
        Ok(self.get_flat_dast_updates())
    }
}
