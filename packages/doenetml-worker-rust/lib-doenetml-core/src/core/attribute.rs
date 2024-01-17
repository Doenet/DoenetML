/// camelCase
pub type AttributeName = &'static str;

#[derive(Debug)]
pub enum AttributeType {
    AttributeChildren,
    Reference,
}
