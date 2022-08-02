use crate::state_variables::*;
use std::{cell::RefCell, fmt};
use self::State::*;


pub struct StateVar {

    // Why we need RefCells: the Box does not allow mutability in the thing it wraps.
    // If it any point we might want to mutate a field, its value should be wrapped in a RefCell.

    // This field should remain private
    value_type_protector: RefCell<ValueTypeProtector>,
}


/// This private enum does not change its variant once initialized,
/// which protects state variables from changing type.
/// We have to store the State enum *inside* each variant
/// so that the type is retained even when the content is Stale.
enum ValueTypeProtector {
    String(State<String>),
    Boolean(State<bool>),
    Integer(State<i64>),
    Number(State<f64>),
    NumberArray(Vec<State<f64>>),
}


#[derive(Debug)]
pub enum State<T> {
    Stale,
    Resolved(T),
}



impl StateVar {

    /// Stale StateVar of the given type
    pub fn new(value_type: &StateVarVariant) -> Self {
        StateVar {
            value_type_protector: RefCell::new(
                match value_type {
                    StateVarVariant::Boolean(_) => ValueTypeProtector::Boolean(Stale),
                    StateVarVariant::Integer(_) => ValueTypeProtector::Integer(Stale),
                    StateVarVariant::Number(_) => ValueTypeProtector::Number(Stale),
                    StateVarVariant::String(_) => ValueTypeProtector::String(Stale),
                    StateVarVariant::NumberArray(_) => ValueTypeProtector::NumberArray(Vec::new()),
                }
            )
        }
    }


    pub fn set_value(&self, new_value: StateVarValue) -> Result<(), String> {

        self.value_type_protector.borrow_mut().set_value(new_value)
    }


    pub fn mark_stale(&self) {

        let type_protector = &mut *self.value_type_protector.borrow_mut();

        *type_protector = match type_protector {
            ValueTypeProtector::String(_)  => ValueTypeProtector::String(Stale),
            ValueTypeProtector::Boolean(_) => ValueTypeProtector::Boolean(Stale),
            ValueTypeProtector::Number(_)  => ValueTypeProtector::Number(Stale),
            ValueTypeProtector::Integer(_) => ValueTypeProtector::Integer(Stale),
            ValueTypeProtector::NumberArray(array)  => ValueTypeProtector::NumberArray(
                array.iter().map(|_| Stale).collect()
            ),
        }
    }


    pub fn get_state(&self) -> State<StateVarValue> {

        let type_protector = &*self.value_type_protector.borrow();

        match type_protector {
            ValueTypeProtector::String(value_option) => match value_option {
                Resolved(val) => Resolved(StateVarValue::String(val.clone())),
                Stale => Stale
            },
            ValueTypeProtector::Number(value_option) => match value_option {
                Resolved(val) => Resolved(StateVarValue::Number(val.clone())),
                Stale => Stale
            },
            ValueTypeProtector::Boolean(value_option) => match value_option {
                Resolved(val) => Resolved(StateVarValue::Boolean(val.clone())),
                Stale => Stale
            },
            ValueTypeProtector::Integer(value_option) => match value_option {
                Resolved(val) => Resolved(StateVarValue::Integer(val.clone())),
                Stale => Stale
            }
            ValueTypeProtector::NumberArray(_) => panic!(),
        }
    }


    pub fn get_element_state(&self, index: usize) -> State<StateVarValue> {

        let type_protector = &*self.value_type_protector.borrow();

        match type_protector {
            ValueTypeProtector::NumberArray(array) => match array[index] {
                Resolved(val) => Resolved(StateVarValue::Number(val.clone())),
                Stale => Stale
            },
            _ => panic!(),
        }
    }


    pub fn copy_value_if_resolved(&self) -> Option<StateVarValue> {
        match self.get_state() {
            State::Resolved(value) => Some(value),
            State::Stale => None,
        }
    }
}



/// A special endpoint on the dependency graph which is associated with a
/// particular state var. Actions often update these.
/// An EssentialStateVar cannot be stale so it does not need a ValueTypeProtector
pub struct EssentialStateVar {
    value: RefCell<StateVarValue>,
}


impl EssentialStateVar {

    pub fn new(value: StateVarValue) -> Self {
        EssentialStateVar {
            value: RefCell::new(value)
        }
    }

    pub fn set_value(&self, new_value: StateVarValue) -> Result<(), String> {
        self.value.borrow_mut().set_protect_type(new_value)?;
        Ok(())
    }


    pub fn get_value(&self) -> StateVarValue {
        self.value.borrow().clone()
    }
}



// Boilerplate to display EssentialStateVar and StateVar better

impl fmt::Debug for StateVar {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("{:?}", &self.get_state()))
    }
}

impl fmt::Debug for EssentialStateVar {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("{:?}", &self.get_value()))
    }
}



impl StateVarValue {
    fn set_protect_type(&mut self,  new_value: StateVarValue) -> Result<(), String> {
        match self {
            StateVarValue::String(state) => {
                *state = new_value.try_into()?;
            },
            StateVarValue::Integer(state) => {
                *state = new_value.try_into()?;
            },
            StateVarValue::Number(state) => {
                *state = new_value.try_into()?;
            },
            StateVarValue::Boolean(state) => {
                *state = new_value.try_into()?;
            }
        }

        Ok(())
    }
}

impl ValueTypeProtector {

    fn set_value(&mut self, new_value: StateVarValue) -> Result<(), String> {
        match self {
            ValueTypeProtector::String(state) => {                
                *state = Resolved(new_value.try_into()?);
            },
            ValueTypeProtector::Integer(state) => {
                *state = Resolved(new_value.try_into()?);
            },
            ValueTypeProtector::Number(state) => {
                *state = Resolved(new_value.try_into()?);
            },
            ValueTypeProtector::Boolean(state) => {
                *state = Resolved(new_value.try_into()?);
            }
            ValueTypeProtector::NumberArray(state) => panic!(),
        }

        Ok(())
    }

    fn set_element_value(&mut self, index: usize, new_value: StateVarValue) -> Result<(), String> {
        match self {
            ValueTypeProtector::NumberArray(array) => {
                array[index] = Resolved(new_value.try_into()?);
            }
            _ => panic!(),
        }

        Ok(())
    }
}

