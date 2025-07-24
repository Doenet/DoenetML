//! Implement custom `From` and `Into` traits because Rust will not allow
//! implementing `From` on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.

use anyhow::anyhow;

use crate::props::{DataQueryResult, PropValue, PropView, cache::PropWithMeta};

use super::IntoPropView;

/// Trait to allow for conversion from a `PropWithMeta` to a `PropView`.
/// We need our own trait because Rust will not allow implementing `From`
/// on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.
pub trait FromPropWithMeta<In, Out> {
    /// Convert a `PropWithMeta` to a `PropView`.
    fn from_prop_with_meta(val: In) -> Out;

    fn try_from_prop_with_meta(val: In) -> anyhow::Result<Out>;
}

impl<PropType> FromPropWithMeta<PropWithMeta, Self> for PropView<PropType>
where
    PropType: TryFrom<PropValue>,
    <PropType as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
    //anyhow::Error: From<<PropType as TryFrom<PropValue>>::Error>,
{
    fn from_prop_with_meta(val: PropWithMeta) -> Self {
        Self::try_from_prop_with_meta(val).unwrap()
    }

    fn try_from_prop_with_meta(val: PropWithMeta) -> anyhow::Result<Self> {
        let error_func = {
            let variant_name: &'static str = (&val.value).into();
            move |err| anyhow!("{}; found PropValue::{}(..)", err, variant_name,)
        };
        let value: PropType = val
            .value
            .try_into()
            // Convert the error to an anyhow::Error. This seems to be an issue with derive_more
            // https://users.rust-lang.org/t/the-trait-std-error-is-not-implemented-for-str/44474
            .map_err(error_func)?;
        Ok(Self {
            value,
            came_from_default: val.came_from_default,
            changed: val.changed,
            origin: val.origin,
        })
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
        Self::try_from_prop_with_meta(val).unwrap()
    }
    fn try_from_prop_with_meta(val: Vec<PropWithMeta>) -> anyhow::Result<Self> {
        if val.len() != 1 {
            return Err(anyhow!(
                "Converting from a Vec into a PropView can only be done if the vec is length 1, not {}",
                val.len()
            ));
        }
        // Slightly faster than
        // val.into_iter().next().unwrap().into_prop_view()
        val[0].to_owned().try_into_prop_view()
    }
}

impl<PropType> FromPropWithMeta<Vec<PropWithMeta>, Self> for Vec<PropView<PropType>>
where
    PropWithMeta: IntoPropView<PropView<PropType>>,
{
    fn from_prop_with_meta(val: Vec<PropWithMeta>) -> Self {
        val.into_iter().map(|val| val.into_prop_view()).collect()
    }
    fn try_from_prop_with_meta(val: Vec<PropWithMeta>) -> anyhow::Result<Self> {
        let mut ret = Vec::with_capacity(val.len());
        for prop in val {
            ret.push(prop.try_into_prop_view()?);
        }
        Ok(ret)
    }
}

impl<PropType> FromPropWithMeta<Vec<PropWithMeta>, Self> for Option<PropView<PropType>>
where
    PropWithMeta: IntoPropView<PropView<PropType>>,
{
    fn from_prop_with_meta(val: Vec<PropWithMeta>) -> Self {
        Self::try_from_prop_with_meta(val).unwrap()
    }
    fn try_from_prop_with_meta(val: Vec<PropWithMeta>) -> anyhow::Result<Self> {
        match val.len() {
            0 => Ok(None),
            1 => Ok(Some(val[0].to_owned().try_into_prop_view()?)),
            _ => Err(anyhow!(
                "Converting from a Vec into a Option<PropView> can only be done if the vec is length 0 or 1, not {}",
                val.len()
            )),
        }
    }
}

impl<PropType> FromPropWithMeta<DataQueryResult, Self> for PropView<PropType>
where
    PropWithMeta: IntoPropView<PropView<PropType>>,
{
    fn from_prop_with_meta(val: DataQueryResult) -> Self {
        val.values.into_prop_view()
    }
    fn try_from_prop_with_meta(val: DataQueryResult) -> anyhow::Result<Self> {
        val.values.try_into_prop_view()
    }
}

impl<PropType> FromPropWithMeta<DataQueryResult, Self> for Vec<PropView<PropType>>
where
    PropWithMeta: IntoPropView<PropView<PropType>>,
{
    fn from_prop_with_meta(val: DataQueryResult) -> Self {
        val.values.into_prop_view()
    }
    fn try_from_prop_with_meta(val: DataQueryResult) -> anyhow::Result<Self> {
        val.values.try_into_prop_view()
    }
}

impl<PropType> FromPropWithMeta<DataQueryResult, Self> for Option<PropView<PropType>>
where
    PropWithMeta: IntoPropView<PropView<PropType>>,
{
    fn from_prop_with_meta(val: DataQueryResult) -> Self {
        val.values.into_prop_view()
    }
    fn try_from_prop_with_meta(val: DataQueryResult) -> anyhow::Result<Self> {
        val.values.try_into_prop_view()
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
            origin: None,
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
            origin: None,
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
            origin: None,
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
            origin: None,
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
