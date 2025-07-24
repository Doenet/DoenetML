/// Information for creating a textual reference to a component.
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct XrefLabel {
    /// The name/label of the item being referenced. E.g. `Section` or `Chapter`.
    pub label: String,
    /// The global identifier of the item being referenced. E.g. `1.2.3`.
    pub global_ident: String,
    /// The local identifier of the item being referenced. E.g. `4`.
    pub local_ident: String,
    /// The preferred form of the reference. Used when not overridden by additional attributes.
    pub preferred_form: XrefLabelPreferredForm,
}

/// Information for creating a textual reference to a component.
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub enum XrefLabelPreferredForm {
    /// Prefer a globally-unique identifier when creating a reference. E.g. `Section 1.2.3`.
    #[default]
    Global,
    /// Prefer a locally-unique identifier when creating a reference. E.g. `Section 4`.
    Local,
}
