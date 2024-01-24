/// camelCase
pub type AttributeName = &'static str;

#[derive(Debug)]
pub enum AttributeType {
    AttributeChildren,
    Reference,
}

// #[derive(Debug)]
// pub enum AttributeBasis {
//     StateVar(StateVarEnum),
//     Reference(DastMacro),
// }
