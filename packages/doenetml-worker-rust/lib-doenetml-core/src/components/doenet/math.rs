use crate::components::prelude::*;
use crate::general_prop::BooleanProp;
use crate::general_prop::LatexProp;
use crate::general_prop::MathProp;
use crate::props::UpdaterObject;
use crate::state::types::math_expr::MathExpr;
use crate::state::types::math_expr::MathParser;

/// The `<math>` component processes its content with a computer algebra system
/// and displays the result as Latex to be formatted by MathJax
#[component(name = Math, extend_via_default_prop)]
mod component {

    use super::*;

    enum Props {
        /// The value of the `<math>` component as a math-expression.
        #[prop(
            value_type = PropValueType::Math,
            profile = PropProfile::Math,
            is_public,
            default,
        )]
        Value,

        /// A representation of `value` as a Latex string
        #[prop(
            value_type = PropValueType::String,
            profile = PropProfile::String,
            is_public,
            for_render,
        )]
        Latex,

        /// If true, then split multi-characters symbols that don't contain numbers into the product of their characters, e.g., "xy" and "x*y" are interpreted in the same way.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::SplitSymbols,
            is_public,
        )]
        SplitSymbols,

        /// If true, then props are prevented from being changed through calling `invert()` on them.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Fixed,
            is_public,
        )]
        Fixed,

        /// Whether the `<math>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden,
            is_public,
        )]
        Hidden,
    }

    enum Attributes {
        /// Whether the `<math>` should split multi-character symbols into the product of the characters.
        #[attribute(prop = BooleanProp, default = true)]
        SplitSymbols,

        /// Whether props of `<math>` are prevented from being changed though calling `invert()` on them
        #[attribute(prop = BooleanProp, default = false)]
        Fixed,

        /// Whether the `<math>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Math;
pub use component::MathActions;
pub use component::MathAttributes;
pub use component::MathProps;
use component::attrs;
use component::props;

impl PropGetUpdater for MathProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            MathProps::Value => {
                as_updater_object::<_, props::types::Value>(MathProp::new_from_children(
                    MathExpr::default(),
                    // TODO: specify parser via attribute once we implement enum attributes and props
                    MathParser::Text,
                    // TODO: specify function_symbols via attribute once we implement array attributes and props
                    vec!["f".to_string(), "g".to_string()],
                ))
            }
            MathProps::Latex => as_updater_object::<_, props::types::Latex>(LatexProp::new(
                MathProps::Value.local_idx(),
            )),
            MathProps::SplitSymbols => as_updater_object::<_, props::types::SplitSymbols>(
                attrs::SplitSymbols::get_prop_updater(),
            ),
            MathProps::Hidden => {
                as_updater_object::<_, props::types::Hidden>(attrs::Hide::get_prop_updater())
            }
            MathProps::Fixed => {
                as_updater_object::<_, props::types::Fixed>(attrs::Fixed::get_prop_updater())
            }
        }
    }
}
