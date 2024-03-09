use crate::components::prelude::*;
use doenetml_derive::component;

#[component(name = Document)]
pub mod component {}
impl ComponentChildren for component::Component {
    fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}
impl PropGetUpdater for component::Props {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        unimplemented!()
    }
}

//mod generated_component {
//    use crate::components::prelude::*;
//    struct Component {}
//    impl Component {
//        /// The name of the component. This is used to identify the component in the DoenetML document.
//        /// It is in _camelCase_.
//        #[allow(unused)]
//        const NAME: &'static str = "document";
//        /// The internal name of the component. This is used in Rust enums, etc. It is in _PascalCase_.
//        #[allow(unused)]
//        const COMPONENT_NAME: &'static str = "Document";
//        #[allow(unused)]
//        const REF_TRANSMUTES_TO: Option<&'static str> = Some("text");
//        #[allow(unused)]
//        const EXTEND_VIA_DEFAULT_PROP: bool = false;
//        #[allow(unused)]
//        const ACTION_NAMES: &'static [&'static str] = &["update_immediate_value", "update_value"];
//        #[allow(unused)]
//        const PROP_NAMES: &'static [&'static str] = &["value", "immediateValue"];
//        #[allow(unused)]
//        const ATTRIBUTE_NAMES: &'static [&'static str] = &["hide", "disabled", "prefill"];
//    }
//    impl ComponentNode for Component {
//        fn get_component_type(&self) -> &'static str {
//            Component::COMPONENT_NAME
//        }
//        fn ref_transmutes_to(&self) -> Option<&'static str> {
//            Component::REF_TRANSMUTES_TO
//        }
//        fn extend_via_default_prop(&self) -> bool {
//            Component::EXTEND_VIA_DEFAULT_PROP
//        }
//    }
//}
//
//#[component(name = Document)]
//mod component {
//    use doenetml_derive::component;
//
//    use crate::new_core::props::PropValueDiscriminants;
//
//    use super::ActionBody;
//
//  enum Props {
//        /// Docstring for stuff
//        #[prop(value_type = PropValueType::String,
//              is_public,
//              profile = ComponentProfile::String,
//              default)]
//        Value,
//
//        /// Other docstring
//        #[prop(value_type = String, is_public)]
//    ImmediateValue,
//}
//    enum Actions {
//        UpdateImmediateValue(ActionBody<()>),
//        UpdateValue,
//    }
//    enum Attributes {
//        /// Whether the `<textInput>` should be hidden.
//        #[attribute(prop = BooleanProp, default = false)]
//        Hide,
//        /// Whether the `<textInput>` should be editable.
//        #[attribute(prop = BooleanProp, default = false)]
//        Disabled,
//        /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
//        #[attribute(prop = StringProp, default = String::new())]
//        Prefill,
//    }

//impl Props {
//    fn get_updater(&self) {
//         match self {
//             Props::Value => (),
//             Props::ImmediateValue => {
//                StringProp::new_from_children("".to_string()).into_prop();
//                todo!()
//             },
//        }
//    }
//}
//}
//
////pub type Document = component::Component;
////pub type DocumentProps = component::Props;
////pub type DocumentActions = component::Actions;
////pub type DocumentAttributes = component::Attributes;
////pub type DocumentRenderedProps = component::RenderedProps;
//

//enum RequiredData {
//    FooState,
//    BarState
//}
//
//impl GetDataQueries for RequiredData {
//    fn get_query(&self) -> DataQuery {
//        match self {
//            RequiredData::FooState => DataQuery::State,
//            RequiredData::BarState => DataQuery::Prop{..Default::default()},
//        }
//    }
//}
//
//trait GetProp<T> {
//    fn get(&self, idx: T) -> DataQueryResult;
//}
//
//
//impl GetProp<RequiredData> for Vec<DataQueryResult> {
//    fn get_vec(&self, idx: RequiredData) -> Vec<PropWithMeta> {
//        match idx {
//            RequiredData::FooState => self[0].values,
//            RequiredData::BarState => self[1].values,
//        }
//    }
//    fn get_single(&self, idx: RequiredData) -> PropWithMeta {
//        match idx {
//            RequiredData::FooState => self[0].values[0],
//            RequiredData::BarState => self[1].values[0],
//        }
//    }
//}
//
//fn updater(res: Vec<DataQueryResult>) {
//    let foo_state = res.get_single(RequiredData::FooState);
//    let foo_state_value: String = foo_state.try_into()?;
//    let bar_state = res.get_vec(RequiredData::BarState);
//
//}

//struct TypedPropWithMeta<T> {
//    value: T,
//    meta: ()
//}

//struct RequiredData {
//    foo_state: TypedPropWithMeta<String>,
//    bar_state: Vec<TypedPropWithMeta<bool>>,
//}
