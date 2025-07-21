//! Implementation of [`ApplyTest`] for [`ContentFilter`]. This module contains the implementation details of
//! filtering/querying a component and its props.

use super::{ApplyTest, Cond, PropValue};
use crate::{DocumentModel, graph_node::GraphNode, props::PropProfile};

/// Filters used to filter content (props/components/strings) from the structure graph.
#[derive(Debug, Clone)]
pub enum ContentFilter {
    /// Match a component by type name.
    IsType(&'static str),
    /// Match components that have a prop matching a profile;
    /// The value of the matched prop is not considered.
    HasPropMatchingProfile(PropProfile),
    /// Match components that have a prop matching a profile;
    /// The value of the matched prop is tested against `Cond` and only matches
    /// if `Cond` is true.
    HasPropMatchingProfileAndCondition(PropProfile, Cond<PropValue>),
    /// Match content is a component.
    IsComponent,
    /// Match content is a string.
    IsString,
}

/// Information needed to determine if `node` matches a given filter condition.
#[derive(Debug, Clone)]
pub struct FilterData<'a> {
    pub node: GraphNode,
    pub origin: GraphNode,
    pub document_model: &'a DocumentModel,
}

impl ApplyTest<FilterData<'_>, GraphNode> for ContentFilter {
    fn apply_test(&self, data: &FilterData) -> bool {
        // Warning: Only use `get_prop_unchecked` for getting a prop in this function.
        // This is so that we possibly catch errors a little earlier if a prop that is not
        // set in the dependency graph is accessed.
        let node = data.node;
        let document_model = data.document_model;
        let origin = data.origin;

        match self {
            ContentFilter::IsType(type_name) => match node {
                GraphNode::Component(_) => {
                    let component_type = document_model.get_component_type(node);
                    component_type.eq(type_name)
                }
                _ => false,
            },
            ContentFilter::HasPropMatchingProfile(profile) => match node {
                GraphNode::Component(component_idx) => {
                    let prop =
                        document_model.get_component_prop_by_profile(component_idx, &[*profile]);
                    prop.is_some()
                }
                GraphNode::String(_) => {
                    // `PropProfile::String` and `PropProfile::LiteralString` are the only profiles that non-component nodes can match.
                    // We special case them here.
                    matches!(profile, PropProfile::String | PropProfile::LiteralString)
                }
                // We may encounter a prop here if we were created with syntax like `$sec.title`.
                // We are looking for components with matching props, not props themselves, so we filter out the prop.
                // Ideally, if the prop is a `ContentRef/ComponentRef`, we should determine its referent
                // and apply this test to that component, but it was too hard (Apr 16, 24)
                GraphNode::Prop(_) => false,
                _ => unreachable!("Only components and strings can match profiles"),
            },
            ContentFilter::HasPropMatchingProfileAndCondition(profile, cond) => match node {
                GraphNode::Component(component_idx) => {
                    let prop =
                        document_model.get_component_prop_by_profile(component_idx, &[*profile]);

                    let prop = prop.map(|prop_pointer| {
                        let prop_node = document_model.prop_pointer_to_prop_node(prop_pointer);
                        document_model._get_prop_unchecked(prop_node, origin)
                    });

                    prop.map(|prop| {
                        let value = prop.value;
                        // Test the condition
                        cond.apply_test(&value)
                    })
                    .unwrap_or(false)
                }
                GraphNode::String(_) => {
                    // `PropProfile::String` and `PropProfile::LiteralString` are the only profiles that non-component nodes can match.
                    // We special case them here.
                    if !matches!(profile, PropProfile::String | PropProfile::LiteralString) {
                        return false;
                    }
                    let str_val = document_model.get_string(node, origin).value;
                    cond.apply_test(&str_val)
                }
                _ => false,
            },
            ContentFilter::IsComponent => matches!(node, GraphNode::Component(_)),
            ContentFilter::IsString => matches!(node, GraphNode::String(_)),
        }
    }

    fn accumulate_deps(&self, data: &FilterData<'_>) -> Vec<GraphNode> {
        // Warning: **Do not get prop values in this function**
        // We won't initialize their deps here. Only return the required prop nodes.
        let node = data.node;
        let document_model = data.document_model;

        match node {
            GraphNode::Component(_) => {}
            GraphNode::String(_) => {
                match self {
                    ContentFilter::HasPropMatchingProfileAndCondition(profile, _) => {
                        // If we are testing the value of a string, since the string value could change, the strings
                        // themselves need to be added as dependencies.
                        if matches!(profile, PropProfile::String | PropProfile::LiteralString) {
                            return vec![node];
                        }
                    }
                    _ => {}
                }
                return vec![];
            }
            _ => {
                // The only allowable deps are from props. If we are here, we're querying a non-component
                // (e.g. a String). These cannot have deps.
                return vec![];
            }
        }

        let component_idx = match node {
            GraphNode::Component(component_idx) => component_idx,
            _ => unreachable!(),
        };

        match self {
            ContentFilter::IsType(_) => vec![],
            ContentFilter::HasPropMatchingProfile(_) => {
                // This search merely returns the presence of a prop matching the profile, not its value.
                // Since prop profiles are static, we can safely return no deps.
                vec![]
            }
            ContentFilter::HasPropMatchingProfileAndCondition(profile, _cond) => {
                let prop = document_model.get_component_prop_by_profile(component_idx, &[*profile]);
                let prop_node =
                    prop.map(|prop_pointer| document_model.prop_pointer_to_prop_node(prop_pointer));

                // Turn the Option into a Vec
                prop_node.into_iter().collect()
            }
            ContentFilter::IsComponent => vec![],
            ContentFilter::IsString => vec![],
        }
    }
}
