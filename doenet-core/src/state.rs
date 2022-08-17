use crate::{state_variables::*, utils::log_debug};
use std::{cell::RefCell, fmt, cmp::max};
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


#[derive(Debug, Clone, PartialEq)]
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


    pub fn get_single_state(&self, sv_ref: &StateIndex) -> Result<Option<State<StateVarValue>>, String> {

        log_debug!("Getting single state of {:?}, current value is {:?}", sv_ref, self);

        match self {
            Self::Single(sv) => {
                match sv_ref {
                    StateIndex::Basic => Ok(Some(sv.get_state())),
                    _ => Err(format!("Tried to access a non-array State with an index or a size")),
                }
            },
            Self::Array { size, elements } => {
                match sv_ref {
                    StateIndex::SizeOf => Ok(Some(size.get_state())),
                    StateIndex::Element(id) => {
                        if *id == 0 {
                            Ok(None)
                        } else {
                            let internal_id = id - 1;
                            Ok(elements.borrow().get(internal_id).map(|elem| elem.get_state()))
                        }
                    },
                    _ => Err(format!("Tried to access an array State without an index or a size")),
                }
            },

        }

    }


    pub fn set_single_state(&self, state_var_ref: &StateIndex, val: StateVarValue) -> Result<Option<StateVarValue>, String> {
        match self {
            Self::Single(sv) => sv.set_value(val).map(|new_val| Some(new_val)),

            Self::Array { size, elements } => match state_var_ref {
                StateIndex::Element(id) => {
                    if *id == 0 {
                        Ok(None)
                    } else {
                        let internal_id = id - 1;
                        if let Some(element) = elements.borrow().get(internal_id) {
                            element.set_value(val).map(|new_val| Some(new_val))
                        } else {
                            Ok(None)
                        }
                    }
                }

                StateIndex::SizeOf => {

                    let new_size = size.set_value(val.clone());
                    
                    if let Ok(_) = new_size {
                        elements.borrow_mut().resize(
                            i64::try_from(val).unwrap() as usize,
                            StateVar {
                                value_type_protector: RefCell::new(ValueTypeProtector::Number(Stale))
                            }
                        );
                    }

                    new_size.map(|val| Some(val))
                },
                _ => panic!()
            }
        }
    }

    pub fn mark_single_stale(&self, state_var_ref: &StateIndex) {
        match self {
            Self::Single(sv) => sv.mark_stale(),

            Self::Array { size, elements } => match state_var_ref {
                StateIndex::Element(id) => {
                    if *id == 0 {
                        panic!("Invalid index 0")
                    }
                    let internal_id = id - 1;
                    elements.borrow().get(internal_id).unwrap().mark_stale()
                }
                StateIndex::SizeOf => size.mark_stale(),
                _ => panic!()
            }
        }
    }

    pub fn elements_len(&self) -> usize {
        match self {
            Self::Single(_) => panic!(),
            Self::Array { size: _, elements } => elements.borrow().len(),
        }
    }

}



impl StateVar {


    pub fn set_value(&self, new_value: StateVarValue) -> Result<StateVarValue, String> {

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
#[derive(Clone, serde::Serialize)]
pub enum EssentialStateVar {
    Single(RefCell<StateVarValue>),
    Array {
        size: RefCell<usize>,
        elements:RefCell<Vec<StateVarValue>>,
        extension: RefCell<StateVarValue>,
    },
}


impl EssentialStateVar {

    // pub fn new(value_type: Option<&StateVarVariant>) -> Self {
    //     if let Some(value_type) = value_type {
    //         if value_type.is_array() {
    //             Self::Array {
    //                 size: RefCell::new(0),
    //                 elements: RefCell::new(vec![]),
    //                 extension: RefCell::new(value_type.initial_essential_value()),
    //             }
    //         } else {
    //             Self::Single(RefCell::new(value_type.initial_essential_value()))
    //         }
    //     } else {
    //         Self::Single(RefCell::new(StateVarValue::String("".to_string())))
    //     }
    // }

    pub fn new_array_with_state_var_values(values: Vec<StateVarValue>, default_fill_value: StateVarValue) -> Self {
        log_debug!("Initializing essential state with elements {:?} and default value {:?}", values, default_fill_value);

        let essential_data = Self::Array {
            size: RefCell::new(0),
            elements: RefCell::new(vec![]),
            extension: RefCell::new(default_fill_value)
        };

        essential_data.set_value(StateIndex::SizeOf, StateVarValue::Integer(values.len() as i64)).unwrap();
        for (id, value) in values.into_iter().enumerate() {
            essential_data.set_value(StateIndex::Element(id + 1), value.clone()).expect(
                &format!("Tried to set to {:?}", value)
            );
        }

        essential_data
    }

    pub fn new_single_basic_with_state_var_value(value: StateVarValue) -> Self {
        Self::Single(RefCell::new(value))
    }

    pub fn set_value(&self, state_index: StateIndex, new_value: StateVarValue) -> Result<(), String> {
        match (self, state_index) {
            (Self::Single(v), StateIndex::Basic) => {
                v.borrow_mut().set_protect_type(new_value)
            },

            (Self::Array{size, elements, extension }, StateIndex::SizeOf) => {
                let new_len = max(size.borrow().clone(), usize::try_from(new_value.clone()).expect(
                    &format!("tried to set essential size to {}", new_value))
                );
                elements.borrow_mut().resize(new_len, extension.borrow().clone());

                let mut s = size.borrow_mut();
                *s = new_len;
                Ok(())
            },

            (Self::Array{elements, extension, ..}, StateIndex::Element(id)) => {
                
                if id == 0 {
                    return Err("Index out of range".into())
                }

                let internal_id = id - 1;

                let mut v = elements.borrow_mut();

                let new_len = max(v.len(), internal_id + 1);
                v.resize(new_len, extension.borrow().clone());

                v.get_mut(internal_id).unwrap().set_protect_type(new_value)?;
                Ok(())
            },
            _ => panic!("state ref and essential value do not match"),
        }
    }


    pub fn get_value(&self, state_ref: StateIndex) -> Option<StateVarValue> {
        match (self, state_ref) {
            (Self::Single(v), StateIndex::Basic) => {
                Some(v.borrow().clone())
            },
            (Self::Array{size, .. }, StateIndex::SizeOf) => {
                Some(StateVarValue::Integer(size.borrow().clone() as i64))
            },
            (Self::Array{elements, ..}, StateIndex::Element(id)) => {

                if id == 0 {
                    return None
                }

                let internal_id = id - 1;

                elements.borrow().get(internal_id).cloned()
            },
            _ => panic!("state index {:?} and essential value {:?} do not match", state_ref, &self),
        }
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
        f.write_str(&match self {
            Self::Single(v) => format!("{:?}", v.borrow()),
            Self::Array { elements, ..} => format!("{:?}", elements.borrow()),
        })
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
            },
            StateVarValue::MathExpr(state) => {
                *state = new_value.try_into()?;
            }
        }

        Ok(())
    }
}

impl ValueTypeProtector {

    fn set_value(&mut self, new_value: StateVarValue) -> Result<StateVarValue, String> {

        match self {
            ValueTypeProtector::String(state) => {                
                *state = Resolved(new_value.clone().try_into()?);
            },
            ValueTypeProtector::Integer(state) => {
                *state = Resolved(new_value.clone().try_into()?);
            },
            ValueTypeProtector::Number(state) => {
                *state = Resolved(new_value.clone().try_into()?);
            },
            ValueTypeProtector::Boolean(state) => {
                *state = Resolved(new_value.clone().try_into()?);
            }
        }

        Ok(new_value)
    }

}

