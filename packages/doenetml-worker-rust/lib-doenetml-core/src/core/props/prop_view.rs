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

#[cfg(test)]
mod tests {
    use super::*;
    use std::convert::TryInto;

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
