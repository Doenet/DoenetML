use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, MathProp};
use crate::props::UpdaterObject;

#[component(name = Point)]
mod component {

    use super::*;

    enum Props {
        /// Whether the `<point>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::Math,
            profile = PropProfile::Math,
            is_public, for_render)]
        X,
        #[prop(value_type = PropValueType::Math,
            profile = PropProfile::Math,
            is_public, for_render)]
        Y,
    }

    enum Attributes {
        /// Whether the `<point>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
        /// The point's x-coordinate
        #[attribute(prop = MathProp, default = 0.0.into())]
        X,
        /// The point's y-coordinate
        #[attribute(prop = MathProp, default = 0.0.into())]
        Y,
    }

    #[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
    #[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
    #[cfg_attr(feature = "web", tsify(from_wasm_abi))]
    #[serde(expecting = "`x` and `y` must be numbers")]
    pub struct PointMoveActionArgs {
        pub x: prop_type::Number,
        pub y: prop_type::Number,
    }

    enum Actions {
        Move(ActionBody<PointMoveActionArgs>),
    }
}

pub use component::Point;
pub use component::PointActions;
pub use component::PointAttributes;
pub use component::PointProps;

impl PropGetUpdater for PointProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            PointProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            PointProps::X => as_updater_object::<_, component::props::types::X>(
                component::attrs::X::get_prop_updater(),
            ),
            PointProps::Y => as_updater_object::<_, component::props::types::Y>(
                component::attrs::Y::get_prop_updater(),
            ),
        }
    }
}

impl ComponentOnAction for Point {
    fn on_action(
        &self,
        action: ActionsEnum,
        _query_prop: ActionQueryProp,
    ) -> Result<Vec<UpdateFromAction>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: PointActions = action.try_into()?;

        match action {
            PointActions::Move(ActionBody { args }) => Ok(vec![
                UpdateFromAction {
                    local_prop_idx: PointProps::X.local_idx(),
                    requested_value: PropValue::Math(Rc::new(args.x.into())),
                },
                UpdateFromAction {
                    local_prop_idx: PointProps::Y.local_idx(),
                    requested_value: PropValue::Math(Rc::new(args.y.into())),
                },
            ]),
        }
    }
}
