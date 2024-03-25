use std::rc::Rc;
use thiserror::Error;

use crate::components::prelude::DataQuery;

use super::{prop_type, BoxedUpdater, DataQueryResults, PropValue};

/// The possible results of a call to `calculate`:
/// - `Calculated(val)`: the value was calculated to be `val`
/// - `FromDefault(val)`: the value `val` was determined from the default value
/// - `NoChange`: the value did not change, so just mark it as fresh
#[derive(Debug)]
pub enum PropCalcResult<T: Clone> {
    Calculated(T),
    FromDefault(T),
    NoChange,
}

impl<T: Clone> PropCalcResult<T> {
    /// Apply `f` to the value that `PropCalcResult` wraps.
    pub fn map<U: Clone, F>(self, f: F) -> PropCalcResult<U>
    where
        F: FnOnce(T) -> U,
    {
        match self {
            PropCalcResult::Calculated(val) => PropCalcResult::Calculated(f(val)),
            PropCalcResult::FromDefault(val) => PropCalcResult::FromDefault(f(val)),
            PropCalcResult::NoChange => PropCalcResult::NoChange,
        }
    }
}

#[derive(Debug, Error)]
pub enum InvertError {
    #[error("invert is not implemented")]
    NotImplemented,
    #[error("could not invert")]
    CouldNotUpdate,
}

/// Implemented by all Props. Specifies how a prop is computed and what data it needs to compute its value.
pub trait PropUpdaterUntyped: std::fmt::Debug {
    /// The default value used when creating a state prop for this prop
    /// using a `State` data query
    fn default(&self) -> PropValue {
        PropValue::Boolean(false)
    }

    /// Returns the data queries needed to calculate the dependencies
    /// for this prop. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other props
    /// of the component of this prop.
    fn data_queries(&self) -> Vec<DataQuery>;

    /// Calculate the value of the prop from the passed in `data`.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate_untyped(&self, data: DataQueryResults) -> PropCalcResult<PropValue>;

    /// All props know how to calculate their value given their dependencies.
    /// Sometimes a prop is requested to take on a particular value. If the
    /// prop has dependencies, these dependencies must change in order for the
    /// prop to take on the target value.
    ///
    /// This function returns a list of update requests for the prop's dependencies
    /// that, if set on the dependencies, will cause the prop to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action (as opposed to coming from another prop requesting
    /// a change).
    // TODO: not too happy with the return of nested vectors.
    #[allow(unused)]
    fn invert_untyped(
        &self,
        data: DataQueryResults,
        requested_value: PropValue,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<Option<Vec<Option<PropValue>>>>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}

/// A typed version of [`PropUpdaterUntyped`]. This trait is what most component's props
/// should implement.
///
/// Core uses `PropUpdater`, which is an untyped version of this trait that can be automatically
/// derived from a [`PropUpdater`] implementation.
pub trait PropUpdater {
    /// The type of this prop. It must be one of the types listed in `prop_type::*`.
    type PropType: Clone + std::fmt::Debug + Default + Into<PropValue>;

    /// The default value used when creating a state prop for this prop
    /// using a `State` data query
    fn default(&self) -> Self::PropType {
        Self::PropType::default()
    }

    /// Returns the data queries needed to calculate the dependencies
    /// for this prop. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other props
    /// of the component of this prop.
    fn data_queries(&self) -> Vec<DataQuery>;

    /// Calculate the value of the prop from the passed in `data`. You will
    /// probably want to use a struct that derives `FromDataQueryResults` to unwrap
    /// `data` into a typed form.
    ///
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType>;

    /// All props know how to calculate their value given their dependencies.
    /// Sometimes a prop is requested to take on a particular value. If the
    /// prop has dependencies, these dependencies must change in order for the
    /// prop to take on the target value.
    ///
    /// This function returns a list of update requests for the prop's dependencies
    /// that, if set on the dependencies, will cause the prop to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action (as opposed to coming from another prop requesting
    /// a change).
    // TODO: not too happy with the return of nested vectors.
    #[allow(unused)]
    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<Option<Vec<Option<PropValue>>>>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//
// A trick to implement `PropUpdaterUntyped` for types that implement `PropUpdater`.
// Because of https://github.com/rust-lang/rust/issues/20400 Rust (2021 edition)
// cannot tell that `impl PropUpdaterUntyped for PropUpdater<X>` and
// `impl<T> PropUpdaterUntyped for PropUpdater<Y>` are disjoint when `X` and `Y` are disjoint.
//
// We use a hack developed in the `disjoint_impls` crate to implement `PropUpdaterUntyped`
// for these types.
//
/////////////////////////////////////////////////////////////////////////////////////////////////

const _: () = {
    /// Implement `_PropUpdaterUntyped` from a typed `PropUpdater` for the specified
    /// type. This cannot be implemented using generics because of limitations in Rust.
    macro_rules! implement_prop_updater_untyped {
        ($type:ty) => {
            impl<T> _PropUpdaterUntyped<$type> for T
            where
                T: PropUpdater<PropType = $type> + std::fmt::Debug,
            {
                fn default(&self) -> PropValue {
                    PropValue::from(Self::default(self))
                }
                fn data_queries(&self) -> Vec<DataQuery> {
                    Self::data_queries(self)
                }
                fn calculate_untyped(&self, data: DataQueryResults) -> PropCalcResult<PropValue> {
                    Self::calculate(self, data).map(PropValue::from)
                }
                fn invert_untyped(
                    &self,
                    data: DataQueryResults,
                    requested_value: PropValue,
                    is_direct_change_from_action: bool,
                ) -> Result<Vec<Option<Vec<Option<PropValue>>>>, InvertError> {
                    Self::invert(
                        self,
                        data,
                        requested_value.try_into().unwrap(),
                        is_direct_change_from_action,
                    )
                }
            }
        };
    }

    implement_prop_updater_untyped!(prop_type::Boolean);
    implement_prop_updater_untyped!(prop_type::ElementRefs);
    implement_prop_updater_untyped!(prop_type::GraphNodes);
    implement_prop_updater_untyped!(prop_type::Integer);
    implement_prop_updater_untyped!(prop_type::Math);
    implement_prop_updater_untyped!(prop_type::Number);
    implement_prop_updater_untyped!(prop_type::String);

    /// Anonymous trait to implement `PropUpdaterUntyped` for types that implement `PropUpdater`.
    /// Modeled after the `disjoint_impls` crate.
    pub trait _PropUpdaterUntyped<_X: ?Sized> {
        fn default(&self) -> PropValue;
        fn data_queries(&self) -> Vec<DataQuery>;
        fn calculate_untyped(&self, data: DataQueryResults) -> PropCalcResult<PropValue>;
        fn invert_untyped(
            &self,
            data: DataQueryResults,
            requested_value: PropValue,
            is_direct_change_from_action: bool,
        ) -> Result<Vec<Option<Vec<Option<PropValue>>>>, InvertError>;
    }

    /// The generic implementation for `PropUpdaterUntyped`.
    impl<T> PropUpdaterUntyped for T
    where
        T: PropUpdater + std::fmt::Debug,
        Self: _PropUpdaterUntyped<<T as PropUpdater>::PropType>,
    {
        fn default(&self) -> PropValue {
            <Self as _PropUpdaterUntyped<<T as PropUpdater>::PropType>>::default(self)
        }
        fn calculate_untyped(&self, data: DataQueryResults) -> PropCalcResult<PropValue> {
            <Self as _PropUpdaterUntyped<<T as PropUpdater>::PropType>>::calculate_untyped(
                self, data,
            )
        }
        fn data_queries(&self) -> Vec<DataQuery> {
            <Self as _PropUpdaterUntyped<<T as PropUpdater>::PropType>>::data_queries(self)
        }
        fn invert_untyped(
            &self,
            data: DataQueryResults,
            requested_value: PropValue,
            is_direct_change_from_action: bool,
        ) -> Result<Vec<Option<Vec<Option<PropValue>>>>, InvertError> {
            <Self as _PropUpdaterUntyped<<T as PropUpdater>::PropType>>::invert_untyped(
                self,
                data,
                requested_value,
                is_direct_change_from_action,
            )
        }
    }
};

/// Turn a `PropUpdater<PropType>` in a `Box<dyn PropUpdaterUntyped>` while asserting
/// `PropType`.
///
/// ## Example
/// ```ignore
/// let bool_updater = MyBoolUpdater::new();
/// let boxed_updater = as_boxed::<_, bool>(typed_updater);
/// ```
///
/// If `MyBoolUpdater::new()` returned a `PropUpdater<PropType != bool>`, `as_boxed` would
/// produce a type error.
pub fn as_boxed<T, RequiredType>(typed_updater: T) -> BoxedUpdater
where
    T: PropUpdater<PropType = RequiredType> + PropUpdaterUntyped + 'static,
    RequiredType: Clone + std::fmt::Debug + Default,
    PropValue: From<RequiredType>,
{
    Rc::new(typed_updater)
}
