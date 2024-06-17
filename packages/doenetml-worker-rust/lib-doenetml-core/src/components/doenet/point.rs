use crate::components::prelude::*;
use crate::general_prop::MathProp;
use crate::props::UpdaterObject;
use crate::state::types::math_expr::MathExpr;
use crate::state::types::math_expr::MathParser;

#[component(name = Point)]
mod component {

    use crate::general_prop::{BooleanProp, MathProp};

    enum Props {
        /// Whether the `<point>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::Math)]
        X,
    }

    enum Attributes {
        /// Whether the `<point>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
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
            PointProps::X => {
                as_updater_object::<_, component::props::types::X>(MathProp::new_from_children(
                    MathExpr::default(),
                    // TODO: specify parser via attribute once we implement enum attributes and props
                    MathParser::Text,
                    MathProps::SplitSymbols.local_idx(),
                    // TODO: specify function_symbols via attribute once we implement array attributes and props
                    vec!["f".to_string(), "g".to_string()],
                ))
            }
        }
    }
}
