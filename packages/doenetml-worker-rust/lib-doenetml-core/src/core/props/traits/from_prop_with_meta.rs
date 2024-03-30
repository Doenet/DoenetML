//! Implement custom `From` and `Into` traits because Rust will not allow
//! implementing `From` on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.

use crate::props::{cache::PropWithMeta, DataQueryResult, PropValue, PropView};

use super::IntoPropView;

/// Trait to allow for conversion from a `PropWithMeta` to a `PropView`.
/// We need our own trait because Rust will not allow implementing `From`
/// on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.
pub trait FromPropWithMeta<In, Out> {
    /// Convert a `PropWithMeta` to a `PropView`.
    fn from_prop_with_meta(val: In) -> Out;
}

impl<PropType> FromPropWithMeta<PropWithMeta, Self> for PropView<PropType>
where
    PropType: TryFrom<PropValue>,
{
    fn from_prop_with_meta(val: PropWithMeta) -> Self {
        let value: PropType = match val.value.try_into() {
            Ok(v) => v,
            Err(_e) => panic!("Error converting type"),
        };
        Self {
            value,
            came_from_default: val.came_from_default,
            changed: val.changed,
            node: val.node,
        }
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

#[cfg(test)]
mod tests {
    use crate::props::prop_type;

    use super::*;
    use std::convert::TryInto;

    #[test]
    fn test_from_prop_with_meta() {
        let prop = PropWithMeta {
            value: "hello".into(),
            came_from_default: false,
            changed: false,
            node: None,
        };
        let prop_view: PropView<prop_type::String> = PropView::from_prop_with_meta(prop);
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&**prop_view.value, "hello");
    }

    #[test]
    fn test_into_prop_view() {
        let prop = PropWithMeta {
            value: "hello".into(),
            came_from_default: false,
            changed: false,
            node: None,
        };
        let prop_view: PropView<prop_type::String> = prop.into_prop_view();
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&**prop_view.value, "hello");
    }

    #[test]
    fn test_try_into() {
        let prop = PropWithMeta {
            value: "hello".into(),
            came_from_default: false,
            changed: false,
            node: None,
        };
        let prop_view_res: Result<PropView<prop_type::String>, anyhow::Error> =
            prop.clone().try_into();
        let prop_view = prop_view_res.unwrap();
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&**prop_view.value, "hello");

        // Cannot convert to wrong type
        let prop_view_res: Result<PropView<i64>, anyhow::Error> = prop.clone().try_into();
        assert!(prop_view_res.is_err());
    }

    #[test]
    fn test_try_into_from_ref() {
        let prop = PropWithMeta {
            value: "hello".into(),
            came_from_default: false,
            changed: false,
            node: None,
        };
        let prop_view_res: Result<PropView<prop_type::String>, anyhow::Error> = (&prop).try_into();
        let prop_view = prop_view_res.unwrap();
        // Value is in an Rc, so it needs to be dereferenced.
        assert_eq!(&**prop_view.value, "hello");

        // Cannot convert to wrong type
        let prop_view_res: Result<PropView<i64>, anyhow::Error> = (&prop).try_into();
        assert!(prop_view_res.is_err());
    }
}
