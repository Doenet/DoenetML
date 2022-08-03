use crate::{state_variables::*, prelude::StateVarReference};
use std::{cell::RefCell, fmt, borrow::{Borrow, BorrowMut}};
use self::State::*;


#[derive(Clone)]
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
#[derive(Clone)]
enum ValueTypeProtector {
    String(State<String>),
    Boolean(State<bool>),
    Integer(State<i64>),
    Number(State<f64>),
}


#[derive(Debug, Clone)]
pub enum State<T> {
    Stale,
    Resolved(T),
}



#[derive(Debug)]
pub enum StateForStateVar {
    Single(StateVar),
    Array {
        size: StateVar,
        elements: RefCell<Vec<StateVar>>,
    }
}

impl StateForStateVar {

    /// Stale StateVar of the given type
    pub fn new(value_type: &StateVarVariant) -> Self {

        match value_type {
            StateVarVariant::Boolean(_) => Self::Single(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::Boolean(Stale))
            }),
            StateVarVariant::Integer(_) => Self::Single(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::Integer(Stale))
            }),
            StateVarVariant::Number(_) =>  Self::Single(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::Number(Stale))
            }),
            StateVarVariant::String(_) =>  Self::Single(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::String(Stale))
            }),
            StateVarVariant::NumberArray(_) => {
                Self::Array {
                    size: StateVar {
                        value_type_protector: RefCell::new(ValueTypeProtector::Integer(Stale)),
                    },
                    elements: RefCell::new(
                        vec![]
                    )
                }
            }
        }
    }


    pub fn get_single_state(&self, sv_ref: &StateVarReference) -> State<StateVarValue> {
        match self {
            Self::Single(sv) => {
                match sv_ref {
                    StateVarReference::Basic(_) => sv.get_state(),
                    _ => panic!(),
                }
            },
            Self::Array { size, elements } => {
                match sv_ref {
                    StateVarReference::SizeOf(_) => size.get_state(),
                    StateVarReference::ArrayElement(_, id) => elements.borrow().get(*id).unwrap().get_state(),
                    _ => panic!(),
                }
            },

        }

    }


    pub fn set_single_state(&self, state_var_ref: &StateVarReference, val: StateVarValue) -> Result<(), String> {
        match self {
            Self::Single(sv) => sv.set_value(val),

            Self::Array { size, elements } => match state_var_ref {
                StateVarReference::ArrayElement(_, id) => elements.borrow().get(*id).unwrap().set_value(val),

                StateVarReference::SizeOf(_) => {

                    let new_size = size.set_value(val.clone());
                    
                    if let Ok(_) = new_size {
                        let basic_variant = StateVarVariant::Number(Default::default());
                        elements.borrow_mut().resize(
                            i64::try_from(val).unwrap() as usize,
                            StateVar {
                                value_type_protector: RefCell::new(ValueTypeProtector::Number(Stale))
                            }
                        );
                    }

                    new_size
                },
                _ => panic!()
            }
        }
    }

}



impl StateVar {


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
        }

        Ok(())
    }

}

