use std::fmt::Debug;

use super::{cache::PropWithMeta, PropValue};
use anyhow::anyhow;
use genrc::Rc;

/// A view into the (typed) value of a prop. The value is a reference
/// wrapped in an `Rc`.
#[derive(Debug, Clone)]
pub struct PropView<T> {
    pub value: Rc<T>,
    pub came_from_default: bool,
    pub changed: bool,
}
/// A type version of a prop where the value has been cloned. This is more
/// expensive than asking for `PropView` but allows you full ownership of the
/// value.
#[derive(Debug, Clone)]
pub struct PropCloned<T: Clone> {
    pub value: T,
    pub came_from_default: bool,
    pub changed: bool,
}

mod try_from {
    //! `TryFrom` implementations for `PropWithMeta` to `PropView` and `PropCloned`.
    use super::*;

    impl<T> TryFrom<PropWithMeta> for PropCloned<T>
    where
        for<'a> &'a T: TryFrom<&'a PropValue>,
        T: Clone,
    {
        type Error = anyhow::Error;
        fn try_from(prop: PropWithMeta) -> Result<Self, Self::Error> {
            let prop_view: PropView<T> = prop.try_into()?;
            Ok(PropCloned {
                value: (*prop_view.value).clone(),
                came_from_default: prop_view.came_from_default,
                changed: prop_view.changed,
            })
        }
    }

    impl<T> TryFrom<&PropWithMeta> for PropCloned<T>
    where
        for<'a> &'a T: TryFrom<&'a PropValue>,
        T: Clone,
    {
        type Error = anyhow::Error;
        fn try_from(prop: &PropWithMeta) -> Result<Self, Self::Error> {
            let prop_view: PropView<T> = prop.try_into()?;
            Ok(PropCloned {
                value: (*prop_view.value).clone(),
                came_from_default: prop_view.came_from_default,
                changed: prop_view.changed,
            })
        }
    }

    impl<T> TryFrom<PropWithMeta> for PropView<T>
    where
        for<'a> &'a T: TryFrom<&'a PropValue>,
    {
        type Error = anyhow::Error;

        fn try_from(prop: PropWithMeta) -> Result<Self, Self::Error> {
            match <&PropValue as TryInto<&T>>::try_into(&*prop.value) {
                Ok(_) => {}
                // TODO: Destructuring the error here confuses Rust. Is there a way to get the actual error?
                Err(_) => {
                    return Err(anyhow!(
                        "Error converting type. Expected {}",
                        std::any::type_name::<T>()
                    ));
                }
            }

            // Clone the Rc since we will be consuming it to `project()`.
            let untyped_value = Rc::clone(&prop.value);
            let value = Rc::project(untyped_value, |v| {
                // This is safe because we already did a `try_into()?` above
                // TODO: calling `.unwrap()` here confused Rust because it doesn't know the error type. Is there a way to fix this?
                match v.try_into() {
                    Ok(v) => v,
                    Err(_) => unreachable!(),
                }
            });

            Ok(PropView {
                value,
                came_from_default: prop.came_from_default,
                changed: prop.changed,
            })
        }
    }

    impl<T> TryFrom<&PropWithMeta> for PropView<T>
    where
        for<'a> &'a T: TryFrom<&'a PropValue>,
        // TODO: these bounds should allow for `?` syntax and `.unwrap()` to work...but maybe `T` is too generic?
        //  for<'a> <&'a T as TryFrom<&'a PropValue>>::Error: std::fmt::Debug,
        //  anyhow::Error: for<'a> From<<&'a T as TryFrom<&'a PropValue>>::Error>,
    {
        type Error = anyhow::Error;

        fn try_from(prop: &PropWithMeta) -> Result<Self, Self::Error> {
            match <&PropValue as TryInto<&T>>::try_into(&*prop.value) {
                Ok(_) => {}
                // TODO: Destructuring the error here confuses Rust. Is there a way to get the actual error?
                Err(_) => {
                    return Err(anyhow!(
                        "Error converting type. Expected {}",
                        std::any::type_name::<T>()
                    ));
                }
            }

            // Clone the Rc since we will be consuming it to `project()`.
            let untyped_value = Rc::clone(&prop.value);
            let value = Rc::project(untyped_value, |v| {
                // This is safe because we already did a `try_into()?` above
                // TODO: calling `.unwrap()` here confused Rust because it doesn't know the error type. Is there a way to fix this?
                match v.try_into() {
                    Ok(v) => v,
                    Err(_) => unreachable!(),
                }
            });

            Ok(PropView {
                value,
                came_from_default: prop.came_from_default,
                changed: prop.changed,
            })
        }
    }
}

pub use custom_from_trait::*;
mod custom_from_trait {
    //! Implement custom `From` and `Into` traits because Rust will not allow
    //! implementing `From` on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.

    use crate::props::DataQueryResult;

    use super::*;
    /// Trait to allow for conversion from a `PropWithMeta` to a `PropView`.
    /// We need our own trait because Rust will not allow implementing `From`
    /// on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.
    pub trait FromPropWithMeta<In, Out> {
        /// Convert a `PropWithMeta` to a `PropView`.
        fn from_prop_with_meta(val: In) -> Out;
    }

    /// Trait to convert into a typed `PropView`.
    /// We need our own trait because Rust will not allow implementing `Into`
    /// on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.
    pub trait IntoPropView<Out> {
        /// Convert the object into a `PropView`-like object.
        fn into_prop_view(self) -> Out;
    }

    /// Blanked implementation of `IntoPropView` for items with `FromPropViewWithMeta`
    impl<Target, Item> IntoPropView<Target> for Item
    where
        Target: FromPropWithMeta<Item, Target>,
    {
        fn into_prop_view(self) -> Target {
            Target::from_prop_with_meta(self)
        }
    }

    impl<PropType> FromPropWithMeta<PropWithMeta, Self> for PropView<PropType>
    where
        for<'a> &'a PropType: TryFrom<&'a PropValue>,
    {
        fn from_prop_with_meta(val: PropWithMeta) -> Self {
            val.try_into().unwrap()
        }
    }

    impl<PropType> FromPropWithMeta<&PropWithMeta, Self> for PropView<PropType>
    where
        for<'a> &'a PropType: TryFrom<&'a PropValue>,
    {
        fn from_prop_with_meta(val: &PropWithMeta) -> Self {
            val.try_into().unwrap()
        }
    }

    //
    // Implement for vectors
    //

    impl<PropType> FromPropWithMeta<Vec<PropWithMeta>, Self> for PropView<PropType>
    where
        PropWithMeta: IntoPropView<PropView<PropType>>,
    {
        fn from_prop_with_meta(val: Vec<PropWithMeta>) -> Self {
            if val.len() != 1 {
                panic!(
                    "Converting from a Vec into a PropView can only be done if the vec is length 1, not {}",
                    val.len()
                );
            }
            let val = val.into_iter().next().unwrap();
            val.into_prop_view()
        }
    }

    impl<PropType> FromPropWithMeta<Vec<PropWithMeta>, Self> for Vec<PropView<PropType>>
    where
        PropWithMeta: IntoPropView<PropView<PropType>>,
    {
        fn from_prop_with_meta(val: Vec<PropWithMeta>) -> Self {
            val.into_iter().map(|val| val.into_prop_view()).collect()
        }
    }

    impl<PropType> FromPropWithMeta<DataQueryResult, Self> for PropView<PropType>
    where
        PropWithMeta: IntoPropView<PropView<PropType>>,
    {
        fn from_prop_with_meta(val: DataQueryResult) -> Self {
            val.values.into_prop_view()
        }
    }

    impl<PropType> FromPropWithMeta<DataQueryResult, Self> for Vec<PropView<PropType>>
    where
        PropWithMeta: IntoPropView<PropView<PropType>>,
    {
        fn from_prop_with_meta(val: DataQueryResult) -> Self {
            val.values.into_prop_view()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::convert::TryInto;

    #[test]
    fn test_from_prop_with_meta() {
        let prop = PropWithMeta {
            value: Rc::new(PropValue::String("hello".to_string())),
            came_from_default: false,
            changed: false,
        };
        let prop_view: PropView<String> = PropView::from_prop_with_meta(prop);
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&*prop_view.value, "hello");
    }

    #[test]
    fn test_into_prop_view() {
        let prop = PropWithMeta {
            value: Rc::new(PropValue::String("hello".to_string())),
            came_from_default: false,
            changed: false,
        };
        let prop_view: PropView<String> = prop.into_prop_view();
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&*prop_view.value, "hello");
    }

    #[test]
    fn test_try_into() {
        let prop = PropWithMeta {
            value: Rc::new(PropValue::String("hello".to_string())),
            came_from_default: false,
            changed: false,
        };
        let prop_view_res: Result<PropView<String>, anyhow::Error> = prop.clone().try_into();
        let prop_view = prop_view_res.unwrap();
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&*prop_view.value, "hello");

        // Cannot convert to wrong type
        let prop_view_res: Result<PropView<i64>, anyhow::Error> = prop.clone().try_into();
        assert!(prop_view_res.is_err());

        let prop_cloned: PropCloned<String> = prop.clone().try_into().unwrap();
        // No need to dereference. Value is cloned.
        assert_eq!(prop_cloned.value, "hello");
    }

    #[test]
    fn test_try_into_from_ref() {
        let prop = PropWithMeta {
            value: Rc::new(PropValue::String("hello".to_string())),
            came_from_default: false,
            changed: false,
        };
        let prop_view_res: Result<PropView<String>, anyhow::Error> = (&prop).try_into();
        let prop_view = prop_view_res.unwrap();
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&*prop_view.value, "hello");

        // Cannot convert to wrong type
        let prop_view_res: Result<PropView<i64>, anyhow::Error> = (&prop).try_into();
        assert!(prop_view_res.is_err());

        let prop_cloned: PropCloned<String> = (&prop).try_into().unwrap();
        // No need to dereference. Value is cloned.
        assert_eq!(prop_cloned.value, "hello");
    }
}
