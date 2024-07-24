use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, LatexProp, MathProp};
use crate::props::UpdaterObject;

#[component(name = Point)]
mod component {

    use super::*;

    enum Props {
        /// Whether the `<point>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::Math,
            is_public, for_render(in_graph))]
        X,
        #[prop(value_type = PropValueType::Math,
            is_public, for_render(in_graph))]
        Y,
        #[prop(value_type = PropValueType::Math,
            profile = PropProfile::Math,
            is_public)]
        Coords,
        #[prop(value_type = PropValueType::String,
            profile = PropProfile::String,
            for_render(in_text))]
        CoordsLatex,
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
pub use component::PointMoveActionArgs;
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
            PointProps::Coords => {
                as_updater_object::<_, component::props::types::Coords>(custom_props::Coords::new())
            }
            PointProps::CoordsLatex => {
                as_updater_object::<_, component::props::types::CoordsLatex>(LatexProp::new(
                    PointProps::Coords.local_idx(),
                ))
            }
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

mod custom_props {
    use super::*;

    pub use coords::*;

    mod coords {

        use crate::state::types::math_expr::MathExpr;

        use super::*;

        #[derive(Debug, Default)]
        pub struct Coords {}

        impl Coords {
            pub fn new() -> Self {
                Coords {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, IntoDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        #[derive(TestDataQueryTypes)]
        #[owning_component(Point)]
        struct RequiredData {
            x: PropView<prop_type::Math>,
            y: PropView<prop_type::Math>,
        }

        impl DataQueries for RequiredData {
            fn x_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PointProps::X.local_idx().into(),
                }
            }
            fn y_query() -> DataQuery {
                DataQuery::Prop {
                    source: PropSource::Me,
                    prop_specifier: PointProps::Y.local_idx().into(),
                }
            }
        }

        impl PropUpdater for Coords {
            type PropType = prop_type::Math;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                let x = required_data.x.value;
                let y = required_data.y.value;

                let coords = MathExpr::new_vector(&[(*x).clone(), (*y).clone()]);

                PropCalcResult::Calculated(coords.into())
            }

            fn invert(
                &self,
                data: DataQueryResults,
                requested_value: Self::PropType,
                _is_direct_change_from_action: bool,
            ) -> Result<DataQueryResults, InvertError> {
                let mut desired = RequiredData::try_new_desired(&data).unwrap();

                match requested_value.to_vector_components() {
                    Err(_) => Err(InvertError::CouldNotUpdate),
                    Ok(components) => {
                        if components.len() < 2 {
                            return Err(InvertError::CouldNotUpdate);
                        }
                        let mut comp_iter = components.into_iter();
                        desired.x.change_to(comp_iter.next().unwrap().into());
                        desired.y.change_to(comp_iter.next().unwrap().into());

                        Ok(desired.into_data_query_results())
                    }
                }
            }
        }
    }
}
