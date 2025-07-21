use crate::props::{PropView, cache::PropWithMeta};

/// Trait to allow for conversion from a `PropView` to a `Vec<PropWithMeta>`.
pub trait IntoPropWithMetaVec {
    /// Convert into a vector of `PropWithMeta`.
    fn into_prop_with_meta_vec(self) -> Vec<PropWithMeta>;
}

impl<T> IntoPropWithMetaVec for PropView<T>
where
    PropWithMeta: From<PropView<T>>,
{
    fn into_prop_with_meta_vec(self) -> Vec<PropWithMeta> {
        vec![self.into()]
    }
}

impl<T> IntoPropWithMetaVec for Vec<PropView<T>>
where
    PropView<T>: Into<PropWithMeta>,
{
    /// Convert a vector of `PropView` into a vector of `PropWithMeta`.
    fn into_prop_with_meta_vec(self) -> Vec<PropWithMeta> {
        self.into_iter().map(|v| v.into()).collect()
    }
}

impl<T> IntoPropWithMetaVec for Option<PropView<T>>
where
    PropView<T>: Into<PropWithMeta>,
{
    /// Convert an option of `PropView` into a vector of `PropWithMeta`.
    fn into_prop_with_meta_vec(self) -> Vec<PropWithMeta> {
        self.into_iter().map(|v| v.into()).collect()
    }
}

#[cfg(test)]
mod test {
    use prop_value::prop_type;

    use crate::components::prelude::*;
    use crate::props::{PropValue, prop_value};

    use super::*;

    #[test]
    fn test_into_prop_with_meta_vec() {
        let prop_view: PropView<prop_type::Integer> = PropView {
            value: 5,
            came_from_default: false,
            changed: false,
            origin: Some(GraphNode::Prop(7)),
        };

        let prop_with_meta = PropWithMeta {
            value: PropValue::Integer(5),
            came_from_default: false,
            changed: false,
            origin: Some(GraphNode::Prop(7)),
        };

        assert_eq!(
            prop_view.clone().into_prop_with_meta_vec(),
            vec![prop_with_meta.clone()]
        );

        let prop_view_vec = vec![prop_view.clone(), prop_view.clone()];

        assert_eq!(
            prop_view_vec.into_prop_with_meta_vec(),
            vec![prop_with_meta.clone(), prop_with_meta.clone()]
        );
    }
}
