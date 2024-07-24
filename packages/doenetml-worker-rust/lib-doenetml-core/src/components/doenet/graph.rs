use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

#[component(name = Graph)]
mod component {

    use crate::general_prop::{BooleanProp, NumberProp};

    enum Props {
        /// Whether the `<graph>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::AnnotatedContentRefs, profile = PropProfile::RenderedChildren)]
        RenderedChildren,
        #[prop(value_type = PropValueType::Number, for_render, is_public)]
        XMin,
        #[prop(value_type = PropValueType::Number, for_render, is_public)]
        XMax,
        #[prop(value_type = PropValueType::Number, for_render, is_public)]
        YMin,
        #[prop(value_type = PropValueType::Number, for_render, is_public)]
        YMax,
    }

    enum Attributes {
        /// Whether the `<graph>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
        #[attribute(prop = NumberProp, default = -10.0)]
        XMin,
        #[attribute(prop = NumberProp, default = 10.0)]
        XMax,
        #[attribute(prop = NumberProp, default = -10.0)]
        YMin,
        #[attribute(prop = NumberProp, default = 10.0)]
        YMax,
    }

    #[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
    #[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
    #[cfg_attr(feature = "web", tsify(from_wasm_abi))]
    #[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
    #[serde(expecting = "`x_min`, `x_max`, `y_min`, and `y_max` must be numbers")]
    pub struct GraphChangeBoundingBoxActionArgs {
        pub x_min: prop_type::Number,
        pub x_max: prop_type::Number,
        pub y_min: prop_type::Number,
        pub y_max: prop_type::Number,
    }

    enum Actions {
        ChangeBoundingBox(ActionBody<GraphChangeBoundingBoxActionArgs>),
    }
}

pub use component::Graph;
pub use component::GraphActions;
pub use component::GraphAttributes;
pub use component::GraphProps;

impl PropGetUpdater for GraphProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            GraphProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            GraphProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            GraphProps::XMin => as_updater_object::<_, component::props::types::XMin>(
                component::attrs::XMin::get_prop_updater(),
            ),
            GraphProps::XMax => as_updater_object::<_, component::props::types::XMax>(
                component::attrs::XMax::get_prop_updater(),
            ),
            GraphProps::YMin => as_updater_object::<_, component::props::types::YMin>(
                component::attrs::YMin::get_prop_updater(),
            ),
            GraphProps::YMax => as_updater_object::<_, component::props::types::YMax>(
                component::attrs::YMax::get_prop_updater(),
            ),
        }
    }
}

impl ComponentOnAction for Graph {
    fn on_action(
        &self,
        action: ActionsEnum,
        _query_prop: ActionQueryProp,
    ) -> Result<Vec<UpdateFromAction>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: GraphActions = action.try_into()?;

        match action {
            GraphActions::ChangeBoundingBox(ActionBody { args }) => Ok(vec![
                UpdateFromAction {
                    local_prop_idx: GraphProps::XMin.local_idx(),
                    requested_value: PropValue::Number(args.x_min),
                },
                UpdateFromAction {
                    local_prop_idx: GraphProps::XMax.local_idx(),
                    requested_value: PropValue::Number(args.x_max),
                },
                UpdateFromAction {
                    local_prop_idx: GraphProps::YMin.local_idx(),
                    requested_value: PropValue::Number(args.y_min),
                },
                UpdateFromAction {
                    local_prop_idx: GraphProps::YMax.local_idx(),
                    requested_value: PropValue::Number(args.y_max),
                },
            ]),
        }
    }
}
