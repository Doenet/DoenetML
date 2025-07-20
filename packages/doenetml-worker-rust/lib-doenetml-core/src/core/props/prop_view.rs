use std::fmt::Debug;

use crate::graph_node::GraphNode;

use super::{PropValue, cache::PropWithMeta};
use anyhow::anyhow;

/// A view into the (typed) value of a prop. The value is a reference
/// wrapped in an `Rc`.
#[derive(Debug, Clone)]
pub struct PropView<T> {
    pub value: T,
    pub came_from_default: bool,
    pub changed: bool,

    /// The graph node where the value originated
    pub origin: Option<GraphNode>,
}

impl<T> PropView<T> {
    /// Set `self.value` to `value` and mark the prop as changed.
    pub fn change_to(&mut self, value: T) {
        self.value = value;
        self.changed = true;
    }
}

mod try_from {
    //! `TryFrom` implementations for `PropWithMeta` to `PropView` and `PropCloned`.
    use super::*;

    impl<T> TryFrom<PropWithMeta> for PropView<T>
    where
        for<'a> &'a T: TryFrom<&'a PropValue>,
        T: TryFrom<PropValue>,
    {
        type Error = anyhow::Error;

        fn try_from(prop: PropWithMeta) -> Result<Self, Self::Error> {
            match <&PropValue as TryInto<&T>>::try_into(&prop.value) {
                Ok(_) => {}
                // TODO: Destructuring the error here confuses Rust. Is there a way to get the actual error?
                Err(_) => {
                    return Err(anyhow!(
                        "Error converting type. Expected {}",
                        std::any::type_name::<T>()
                    ));
                }
            }

            let untyped_value: Result<T, _> = T::try_from(prop.value);

            // This is safe because we already did a `try_into()?` above
            // TODO: calling `.unwrap()` here confused Rust because it doesn't know the error type. Is there a way to fix this?
            let value = match untyped_value {
                Ok(v) => v,
                Err(_) => unreachable!(),
            };

            Ok(PropView {
                value,
                came_from_default: prop.came_from_default,
                changed: prop.changed,
                origin: prop.origin,
            })
        }
    }

    impl<T> TryFrom<&PropWithMeta> for PropView<T>
    where
        for<'a> &'a T: TryFrom<&'a PropValue>,
        T: TryFrom<PropValue>,
        // TODO: these bounds should allow for `?` syntax and `.unwrap()` to work...but maybe `T` is too generic?
        //  for<'a> <&'a T as TryFrom<&'a PropValue>>::Error: std::fmt::Debug,
        //  anyhow::Error: for<'a> From<<&'a T as TryFrom<&'a PropValue>>::Error>,
    {
        type Error = anyhow::Error;

        fn try_from(prop: &PropWithMeta) -> Result<Self, Self::Error> {
            match <&PropValue as TryInto<&T>>::try_into(&prop.value) {
                Ok(_) => {}
                // TODO: Destructuring the error here confuses Rust. Is there a way to get the actual error?
                Err(_) => {
                    return Err(anyhow!(
                        "Error converting type. Expected {}",
                        std::any::type_name::<T>()
                    ));
                }
            }

            let untyped_value: Result<T, _> = T::try_from(prop.value.clone());
            // TODO: calling `.unwrap()` here confused Rust because it doesn't know the error type. Is there a way to fix this?
            let value = match untyped_value {
                Ok(v) => v,
                Err(_) => unreachable!(),
            };

            Ok(PropView {
                value,
                came_from_default: prop.came_from_default,
                changed: prop.changed,
                origin: prop.origin,
            })
        }
    }
}

mod into_prop_with_meta {
    //! Implementation of `Into<PropWithMeta>` for `PropView`.

    use super::*;

    impl<T> From<PropView<T>> for PropWithMeta
    where
        T: Into<PropValue>,
    {
        fn from(prop: PropView<T>) -> Self {
            PropWithMeta {
                value: prop.value.into(),
                came_from_default: prop.came_from_default,
                changed: prop.changed,
                origin: prop.origin,
            }
        }
    }
}
