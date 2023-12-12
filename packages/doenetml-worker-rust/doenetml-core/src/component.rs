pub mod document;
pub mod p;
pub mod section;
pub mod text;

use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use doenetml_derive::ComponentNode;
use strum_macros::EnumString;

use crate::dast::{ElementData, FlatDastElement, FlatDastElementContent, Position as DastPosition};
use crate::{ComponentChild, ComponentInd, ExtendSource};

use self::document::Document;
use self::p::P;
use self::section::Section;
use self::text::Text;

#[derive(Debug, EnumString, ComponentNode)]
#[strum(ascii_case_insensitive)]
pub enum ComponentEnum {
    Text(Text),
    Section(Section),
    Document(Document),
    P(P),
}

pub trait ComponentNode {
    fn get_ind(&self) -> ComponentInd;
    fn set_ind(&mut self, ind: ComponentInd);
    fn get_parent(&self) -> Option<ComponentInd>;
    fn set_parent(&mut self, parent: Option<ComponentInd>);
    fn get_children(&self) -> &Vec<ComponentChild>;
    fn set_children(&mut self, children: Vec<ComponentChild>);
    fn replace_children(&mut self, new_children: Vec<ComponentChild>) -> Vec<ComponentChild>;

    fn initialize(
        &mut self,
        ind: ComponentInd,
        parent: Option<ComponentInd>,
        position: Option<DastPosition>,
    );

    fn get_extend(&self) -> &Option<ExtendSource>;
    fn set_extend(&mut self, extend_source: Option<ExtendSource>);

    fn get_component_type(&self) -> &str;

    fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentInd>>;
    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentInd>>);

    fn get_position(&self) -> &Option<DastPosition>;
    fn set_position(&mut self, position: Option<DastPosition>);

    fn to_flat_dast(&self, components: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
        // if extending a source that is a component,
        // add children from that source first
        let mut children = if let Some(extend_source) = self.get_extend() {
            match extend_source {
                ExtendSource::Component(source_ind) => {
                    let source_dast = components[*source_ind].borrow().to_flat_dast(components);

                    source_dast.children
                }
                ExtendSource::StateVar((_source_ind, _source_var_ind)) => {
                    // TODO: state variable extend source
                    Vec::new()
                }
            }
        } else {
            Vec::new()
        };

        // children from the component itself come after children the extend source
        let mut children2: Vec<FlatDastElementContent> = self
            .get_children()
            .iter()
            .filter_map(|child| match child {
                ComponentChild::Component(comp_ind) => {
                    Some(FlatDastElementContent::Element(*comp_ind))
                }
                ComponentChild::Text(s) => Some(FlatDastElementContent::Text(s.to_string())),
                ComponentChild::Macro(_the_macro) => None,
                ComponentChild::FunctionMacro(_function_macro) => None,
                ComponentChild::Error(error) => Some(FlatDastElementContent::Error(error.clone())),
            })
            .collect();

        children.append(&mut children2);

        // TODO: attributes

        FlatDastElement {
            name: self.get_component_type().to_string(),
            attributes: HashMap::new(),
            children,
            data: Some(ElementData { id: self.get_ind() }),
            position: self.get_position().clone(),
        }
    }
}
