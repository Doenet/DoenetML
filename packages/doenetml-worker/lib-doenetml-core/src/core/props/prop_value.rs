use std::rc::Rc;

#[cfg(feature = "web")]
use tsify_next::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::state::types::math_expr::MathExpr;
use crate::utils::rc_serde;

///////////////////////////////////////////////////////////////////////
// prop enum views that allow one to refer to props
// without specifying type.
// Particularly useful for having vectors of mixed type
///////////////////////////////////////////////////////////////////////

/// The value of a prop tagged with its type.
/// These values follow a naming convention:
///  1. They are all in the form `PropValue::VariantName(prop_type::VariantName)`.
///  2. There is a corresponding type alias `VariantName` in the `prop_type` module.
///
/// This naming convention is relied upon by macros that implement type checking.
#[derive(
    Debug,
    Clone,
    PartialEq, // TODO: this might be too much to require on all value types if we have complex types
    serde::Serialize,
    derive_more::TryInto,
    derive_more::From,
    doenetml_macros::TryFromRef,
    strum_macros::EnumDiscriminants,
    strum_macros::IntoStaticStr,
)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum PropValue {
    #[serde(with = "rc_serde")]
    String(prop_type::String),
    Number(prop_type::Number),
    Integer(prop_type::Integer),
    Boolean(prop_type::Boolean),
    #[serde(with = "rc_serde")]
    Math(prop_type::Math),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    #[serde(with = "rc_serde")]
    ComponentRefs(prop_type::ComponentRefs),
    ComponentRef(prop_type::ComponentRef),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    #[serde(with = "rc_serde")]
    AnnotatedContentRefs(prop_type::AnnotatedContentRefs),
    #[serde(with = "rc_serde")]
    ContentRefs(prop_type::ContentRefs),
    ContentRef(prop_type::ContentRef),
    None(()),
    PropVec(prop_type::PropVec),
    #[serde(with = "rc_serde")]
    XrefLabel(prop_type::XrefLabel),
    ListDepth(prop_type::ListDepth),
    ListMarker(prop_type::ListMarker),
    DivisionType(prop_type::DivisionType),
}

/// The discriminating type of a `PropValue`.
pub type PropValueType = PropValueDiscriminants;

pub mod prop_type {
    //! Type aliases for the inner type of `PropValue`.
    //! These are are named exactly the same as the discriminants of `PropValue`
    //! so that they can be used in macros.

    use super::*;
    use crate::state::types::{
        component_refs, content_refs, division_type, list_depth, list_marker, xref_label,
    };

    /// A macro that declares a type and implements `TypeDiscriminant`.
    ///
    /// For example, `with_discriminant!(Foo, type::Name)` expands to
    /// ```ignore
    /// pub type Foo = type::Name;
    /// impl TypeDiscriminant for Foo {
    ///    const PROP_VALUE_TYPE: Option<PropValueType> = Some(PropValueType::Name);
    /// }
    /// ```
    /// If an optional third argument is supplied, it is included in an attribute macro
    /// with `#[cfg_attr(feature = "web", ...)]`.
    ///
    /// For example, `with_discriminant!(String, prop_type::String, tsify_next::declare)` expands to
    /// ```ignore
    /// #[cfg_attr(feature = "web", tsify_next::declare)]
    /// pub type String = prop_type::String;
    /// impl TypeDiscriminant for String {
    ///   const PROP_VALUE_TYPE: Option<PropValueType> = Some(PropValueType::String);
    /// }
    /// ```
    macro_rules! define_type {
        ($name:ident, $type:path) => {
            pub type $name = $type;

            impl TypeDiscriminant for $name {
                const PROP_VALUE_TYPE: Option<PropValueType> = Some(PropValueType::$name);
            }
        };
        ($name:ident, $type:path, $attr:path) => {
            #[cfg_attr(feature = "web", $attr)]
            pub type $name = $type;

            impl TypeDiscriminant for $name {
                const PROP_VALUE_TYPE: Option<PropValueType> = Some(PropValueType::$name);
            }
        };
    }

    define_type!(String, Rc<std::string::String>, tsify_next::declare);
    define_type!(Number, f64, tsify_next::declare);
    define_type!(Integer, i64, tsify_next::declare);
    define_type!(Boolean, bool, tsify_next::declare);
    define_type!(Math, Rc<MathExpr>, tsify_next::declare);

    // The typescript types for these are exported in their respective files,
    // so we don't use `tsify_next::declare` on them.
    define_type!(ComponentRef, Option<component_refs::ComponentRef>);
    define_type!(ComponentRefs, Rc<component_refs::ComponentRefs>);
    define_type!(AnnotatedContentRefs, Rc<content_refs::AnnotatedContentRefs>);
    define_type!(ContentRefs, Rc<content_refs::ContentRefs>);
    define_type!(ContentRef, content_refs::ContentRef);
    define_type!(XrefLabel, Rc<xref_label::XrefLabel>);
    define_type!(ListDepth, list_depth::ListDepth);
    define_type!(ListMarker, list_marker::ListMarker);
    define_type!(DivisionType, division_type::DivisionType);

    pub type PropVec = Vec<PropValue>;

    /// By default, wasm-bindgen won't pick up this module as containing types to export
    /// to Typescript. We force wasm-bindgen to export types in this module by providing a
    /// dummy type that is explicitly referenced in `lib-js-wasm-binding/src/lib.rs`.
    #[cfg(feature = "web")]
    #[cfg_attr(
        feature = "web",
        derive(Copy, Clone, Tsify, serde::Serialize, serde::Deserialize)
    )]
    #[cfg_attr(feature = "web", tsify(from_wasm_abi, into_wasm_abi))]
    pub struct _DummyForWasmBindgen {}
}

pub use type_discriminant::TypeDiscriminant;
mod type_discriminant {
    //! Implementing [`TypeDiscriminant`] allows run-time access to the type variant of a type.
    //! This works around limitations in Rust's type system where you are not allowed to use types as
    //! first-class values. This module provides functions for _testing_ and should not be used in
    //! general.
    use super::*;
    use crate::props::PropView;

    /// A trait that gives access to the `PropValueType` corresponding to a prop value.
    /// This happens _at the type level_. It relies on the following naming convention:
    ///  - Every declared type `Foo` must have a corresponding `PropValue::Foo(Foo)`.
    pub trait TypeDiscriminant {
        /// The discriminating type. If `Some(PropValueType)`, then the type is
        /// known to be that variant. If `None`, the type's variant cannot be determined (e.g. it is a union
        /// of multiple types, like `PropValue` itself).
        const PROP_VALUE_TYPE: Option<PropValueType>;
    }

    // helpful impls
    impl<T: TypeDiscriminant> TypeDiscriminant for PropView<T> {
        const PROP_VALUE_TYPE: Option<PropValueType> = T::PROP_VALUE_TYPE;
    }
    impl<T: TypeDiscriminant> TypeDiscriminant for Vec<PropView<T>> {
        const PROP_VALUE_TYPE: Option<PropValueType> = T::PROP_VALUE_TYPE;
    }
    impl<T: TypeDiscriminant> TypeDiscriminant for Option<PropView<T>> {
        const PROP_VALUE_TYPE: Option<PropValueType> = T::PROP_VALUE_TYPE;
    }
    impl TypeDiscriminant for PropValue {
        // PropValue is a union of all the types, so it doesn't have a specific value type.
        const PROP_VALUE_TYPE: Option<PropValueType> = None;
    }
}

mod conversions {
    //! Implementation of `From` traits for `PropValue`.

    use anyhow::anyhow;

    use crate::state::types::content_refs::{ContentRef, ContentRefs};

    use super::*;

    impl From<String> for PropValue {
        fn from(v: String) -> Self {
            PropValue::String(Rc::new(v))
        }
    }

    impl From<&str> for PropValue {
        fn from(v: &str) -> Self {
            PropValue::String(Rc::new(v.to_string()))
        }
    }

    impl TryFrom<PropValue> for String {
        type Error = &'static str;
        fn try_from(value: PropValue) -> Result<Self, Self::Error> {
            TryInto::<prop_type::String>::try_into(value).map(|s| (*s).clone())
        }
    }

    impl From<MathExpr> for PropValue {
        fn from(v: MathExpr) -> Self {
            PropValue::Math(Rc::new(v))
        }
    }

    impl TryFrom<PropValue> for MathExpr {
        type Error = &'static str;
        fn try_from(value: PropValue) -> Result<Self, Self::Error> {
            TryInto::<prop_type::Math>::try_into(value).map(|s| (*s).clone())
        }
    }

    impl TryFrom<PropValue> for ContentRefs {
        type Error = anyhow::Error;
        fn try_from(value: PropValue) -> Result<Self, Self::Error> {
            match value {
                PropValue::ComponentRef(idx_option) => {
                    let con_ref: Option<ContentRef> = idx_option.map(|c_ref| c_ref.into());
                    Ok(con_ref.into_iter().collect::<Vec<_>>().into())
                }
                PropValue::ComponentRefs(indices) => Ok(indices.into()),
                PropValue::ContentRef(val) => Ok(vec![val].into()),
                PropValue::ContentRefs(val) => Ok((*val).clone()),
                _ => Err(anyhow!("Cannot convert {:?} into a ContentRefs", value)),
            }
        }
    }
}
