use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, MathProp};
use crate::props::UpdaterObject;
use crate::state::types::math_expr::MathExpr;

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
        #[attribute(prop = MathProp, default = MathExpr::default())]
        X,
        /// The point's y-coordinate
        #[attribute(prop = MathProp, default = MathExpr::default())]
        Y,
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
