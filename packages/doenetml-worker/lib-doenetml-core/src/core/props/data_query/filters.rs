//! Abstract operations that can be used to build up complex queries

use crate::graph_node::GraphNode;
use std::fmt::Debug;

/// Trait that lets you test to filter different values
pub trait ApplyTest<TestableValue, Dependency>
where
    Self: Debug,
{
    /// Test `value` against this filter
    fn apply_test(&self, value: &TestableValue) -> bool;

    /// Similar to `apply_test` except it returns every "dependency" that was used
    /// to evaluate the test. This is used to accumulate props referenced when evaluating
    /// a filter.
    #[allow(unused_variables)]
    fn accumulate_deps(&self, value: &TestableValue) -> Vec<Dependency>;
    //{
    //    unimplemented!("accumulate_deps not implemented for this filter")
    // }
}

/// Operations used to build up complex queries
#[derive(Debug, Clone, PartialEq)]
pub enum Op<Left, Right> {
    /// Satisfied if both `Left` and `Right` are satisfied
    And(Left, Right),
    /// Satisfied if either `Left` or `Right` are satisfied
    Or(Left, Right),
}

/// Not operation used to build complex queries
/// Satisfied only if `T` is not satisfied
#[derive(Debug, Clone, PartialEq)]
pub struct OpNot<T>(pub T);

impl<T, D, Left, Right> ApplyTest<T, D> for Op<Left, Right>
where
    Left: ApplyTest<T, D>,
    Right: ApplyTest<T, D>,
    T: Debug,
{
    fn apply_test(&self, value: &T) -> bool {
        match self {
            Op::And(a, b) => a.apply_test(value) && b.apply_test(value),
            Op::Or(a, b) => a.apply_test(value) || b.apply_test(value),
        }
    }

    fn accumulate_deps(&self, value: &T) -> Vec<D> {
        let (a, b) = match self {
            Op::And(a, b) => (a, b),
            Op::Or(a, b) => (a, b),
        };
        let mut deps = a.accumulate_deps(value);
        deps.extend(b.accumulate_deps(value));
        deps
    }
}

impl<T, D, S> ApplyTest<T, D> for OpNot<S>
where
    S: ApplyTest<T, D>,
    T: Debug,
{
    fn apply_test(&self, value: &T) -> bool {
        !self.0.apply_test(value)
    }
    fn accumulate_deps(&self, value: &T) -> Vec<D> {
        self.0.accumulate_deps(value)
    }
}

/// Implement the ApplyTest trait for bool. This ignores any input to `apply_test` and just returns
/// the value of the bool.
impl<T> ApplyTest<T, GraphNode> for bool
where
    T: Debug,
{
    fn apply_test(&self, _value: &T) -> bool {
        *self
    }
    fn accumulate_deps(&self, _: &T) -> Vec<GraphNode> {
        vec![]
    }
}

/// Conditions that can be applied when filtering
#[derive(Debug, Clone)]
pub enum Cond<T> {
    Eq(T),
    NotEq(T),
}

impl<T> ApplyTest<T, GraphNode> for Cond<T>
where
    T: PartialEq + Debug + Clone,
{
    fn apply_test(&self, value: &T) -> bool {
        match self {
            Cond::Eq(a) => a == value,
            Cond::NotEq(a) => a != value,
        }
    }
    fn accumulate_deps(&self, _: &T) -> Vec<GraphNode> {
        panic!("Not meaningful to call accumulate_deps on a Cond")
    }
}

#[cfg(test)]
#[path = "filters.test.rs"]
mod tests;
