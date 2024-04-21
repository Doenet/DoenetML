use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<ol>` component is for making ordered lists
#[component(name = Ol)]
mod component {

    use super::*;
    use crate::general_prop::{BooleanProp, ComponentRefProp};

    enum Props {
        /// Whether the `<ol>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The number of levels deep `<ol>` is nested.
        #[prop(
            value_type = PropValueType::ListDepth,
            profile = PropProfile::ListDepth,
            for_render,
        )]
        ListDepth,

        #[prop(
            value_type = PropValueType::ContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<ol>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
        ///// The item this `<ol>` refers to.
        //#[attribute(prop = NumberProp, default = 1)]
        //Cols,
    }
}

pub use component::Ol;
pub use component::OlActions;
pub use component::OlAttributes;
pub use component::OlProps;

impl PropGetUpdater for OlProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            OlProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            OlProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            OlProps::ListDepth => as_updater_object::<_, component::props::types::ListDepth>(
                custom_props::ListDepth::new(),
            ),
        }
    }
}

mod custom_props {
    use super::*;

    pub use list_depth::*;
    mod list_depth {
        use super::*;

        /// Information about how to reference this component from an `ol`
        #[derive(Debug, Default)]
        pub struct ListDepth {}

        impl ListDepth {
            pub fn new() -> Self {
                ListDepth {}
            }
        }

        /// Structure to hold data generated from the data queries
        #[derive(TryFromDataQueryResults, Debug)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData {
            //  rendered_children: PropView<component::props::types::RenderedChildren>,
            //  label: Vec<PropView<prop_type::OlLabel>>,
            foo: PropView<prop_type::Integer>,
        }

        impl DataQueries for RequiredData {
            fn foo_query() -> DataQuery {
                DataQuery::State
            }
        }

        impl PropUpdater for ListDepth {
            type PropType = prop_type::ListDepth;

            fn data_queries(&self) -> Vec<DataQuery> {
                RequiredData::to_data_queries()
            }
            fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                todo!("hi there i'm not done")
            }
        }
    }
}
