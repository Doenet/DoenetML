
use crate::state_variables::*;

// Why we need RefCells: the Box does not allow mutability in the thing it wraps.
// If it any point we might want to mutate a field, its value should be wrapped in a RefCell.

use std::{cell::RefCell, fmt};


pub struct StateVar {
    // This field should remain private

    // For state var, the ValueType protector's option means whether or not the value
    // is stale. Some(T) -> Resolved(T), and None -> Stale

    state_ref: RefCell<ValueTypeProtector>,
}


// impl Default for StateVar {

//     fn default() -> Self {
//         StateVar {
//             state_ref: RefCell::new(),
//         }
//     }
// }



#[derive(Debug)]
pub enum State<T> {
    Stale,
    Resolved(T),
}


/// A special endpoint on the dependency graph which is associated to a particular state var
/// Usually, an action update sets this value
pub struct EssentialStateVar {
    value: RefCell<ValueTypeProtector>,
}



// This enum should remain private
enum ValueTypeProtector {
    String(Option<String>),
    Boolean(Option<bool>),
    Integer(Option<i64>),
    Number(Option<f64>),
}







pub enum StateVarValueType {
    String,
    Boolean,
    Integer,
    Number,
}


impl StateVar {

    pub fn new(value_type: StateVarValueType) -> Self {
        StateVar {
            state_ref: RefCell::new(

                match value_type {
                    StateVarValueType::Boolean =>   ValueTypeProtector::Boolean(None),
                    StateVarValueType::Integer =>   ValueTypeProtector::Integer(None),
                    StateVarValueType::Number =>   ValueTypeProtector::Number(None),
                    StateVarValueType::String =>   ValueTypeProtector::String(None),
                }
            )
        }
    }


    pub fn set_value(&self, new_value: StateVarValue) -> Result<(), String> {

        let type_protector = &mut *self.state_ref.borrow_mut();

        type_protector.set_value(new_value)
    }


    pub fn mark_stale(&self) {

        let type_protector = &mut *self.state_ref.borrow_mut();

        *type_protector = match type_protector {
            ValueTypeProtector::String(_) => ValueTypeProtector::String(None),
            ValueTypeProtector::Boolean(_) => ValueTypeProtector::Boolean(None),
            ValueTypeProtector::Number(_) => ValueTypeProtector::Number(None),
            ValueTypeProtector::Integer(_) => ValueTypeProtector::Integer(None),
        }

    }



    pub fn get_state(&self) -> State<StateVarValue> {

        use State::Resolved;
        use State::Stale;

        // NOTE: Internally, we store the Option enum inside the ValueType
        // enum so that the ValueType is retained even when we're Stale/None.
        // However, it is more convenient to pass around a
        // State<StateVarValue> externally.

        let type_protector = &*self.state_ref.borrow();

        match type_protector {
            ValueTypeProtector::String(value_option) => match value_option {
                Some(val) => Resolved(StateVarValue::String(val.clone())),
                None => Stale
            },
            ValueTypeProtector::Number(value_option) => match value_option {
                Some(val) => Resolved(StateVarValue::Number(val.clone())),
                None => Stale
            },
            ValueTypeProtector::Boolean(value_option) => match value_option {
                Some(val) => Resolved(StateVarValue::Boolean(val.clone())),
                None => Stale
            },
            ValueTypeProtector::Integer(value_option) => match value_option {
                Some(val) => Resolved(StateVarValue::Integer(val.clone())),
                None => Stale
            }                                    

        }

    }


    pub fn copy_value_if_resolved(&self) -> Option<StateVarValue> {
        let state = self.get_state();
        if let State::Resolved(value) = state {
            Some(value)
        } else {
            None
        }
    }


}



impl EssentialStateVar {

    pub fn derive_from(state_var: StateVar) -> Self {

        EssentialStateVar {
            value: RefCell::new(

                match &*state_var.state_ref.borrow() {
                    ValueTypeProtector::String(_) => ValueTypeProtector::String(None),
                    ValueTypeProtector::Boolean(_) => ValueTypeProtector::Boolean(None),
                    ValueTypeProtector::Integer(_) => ValueTypeProtector::Integer(None),
                    ValueTypeProtector::Number(_) => ValueTypeProtector::Number(None),
                }
            )
        }
    }

    pub fn set_value(&self, new_value: StateVarValue) -> Result<(), String> {

        let type_protector = &mut *self.value.borrow_mut();
        type_protector.set_value(new_value)
    }


    pub fn get_value(&self) -> Option<StateVarValue> {

        let type_protector = &*self.value.borrow();

        match type_protector {
            ValueTypeProtector::String(value_option) => match value_option {
                Some(val) => Some(StateVarValue::String(val.clone())),
                None => None,
            },
            ValueTypeProtector::Number(value_option) => match value_option {
                Some(val) => Some(StateVarValue::Number(val.clone())),
                None => None,
            },
            ValueTypeProtector::Boolean(value_option) => match value_option {
                Some(val) => Some(StateVarValue::Boolean(val.clone())),
                None => None,
            },
            ValueTypeProtector::Integer(value_option) => match value_option {
                Some(val) => Some(StateVarValue::Integer(val.clone())),
                None => None,
            }
        }
    }

}




// Boilerplate to display StateVar better
impl fmt::Debug for StateVar {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("{:?}", &self.get_state()))
    }
}


// Boilerplate to display EssentialStateVar better
impl fmt::Debug for EssentialStateVar {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("{:?}", &self.get_value()))
    }
}





impl ValueTypeProtector {

    fn set_value(&mut self, new_value: StateVarValue) -> Result<(), String> {


        fn invalid_new_value<T: std::fmt::Display>(
            my_type: &'static str,
            new_value_type: &'static str,
            new_val: T)
        -> String
        {                
            format!("Value is type {}, but tried to set it to {} ({})",
                my_type, new_val.to_string(), new_value_type)
        }



        match self {
        
            ValueTypeProtector::String(state) => {                

                match new_value {
                    StateVarValue::String(val) => {
                        *state = Some(val);
                    },



                    StateVarValue::Boolean(val) => {
                        return Err(invalid_new_value("String", "Boolean", val));
                    },
                    StateVarValue::Number(val) => {
                        return Err(invalid_new_value("String", "Number", val));
                    },   
                    StateVarValue::Integer(val) => {
                        return Err(invalid_new_value("String", "Integer", val));
                    },                                     


                }


            },
            ValueTypeProtector::Integer(state) => {

                match new_value {
                    StateVarValue::Integer(val) => {
                        *state = Some(val);
                    },



                    StateVarValue::Boolean(val) => {
                        return Err(invalid_new_value("Integer", "Boolean", val));
                    },
                    StateVarValue::Number(val) => {
                        return Err(invalid_new_value("Integer", "Number", val));
                    },   
                    StateVarValue::String(val) => {
                        return Err(invalid_new_value("Integer", "String", val));
                    },                                     

                }
            },


            
            ValueTypeProtector::Number(state) => {
                match new_value {
                    StateVarValue::Number(val) => {
                        *state = Some(val);
                    },



                    StateVarValue::Boolean(val) => {
                        return Err(invalid_new_value("Number", "Boolean", val));
                    },
                    StateVarValue::Integer(val) => {
                        return Err(invalid_new_value("Number", "Integer", val));
                    },
                    StateVarValue::String(val) => {
                        return Err(invalid_new_value("Number", "String", val));
                    },
                }
            },


            ValueTypeProtector::Boolean(state) => {

                match new_value {
                    StateVarValue::Boolean(val) => {
                        *state = Some(val);
                    },



                    StateVarValue::Number(val) => {
                        return Err(invalid_new_value("Boolean", "Number", val));
                    },
                    StateVarValue::Integer(val) => {
                        return Err(invalid_new_value("Boolean", "Integer", val));
                    },   
                    StateVarValue::String(val) => {
                        return Err(invalid_new_value("Boolean", "String", val));
                    },                                     
                }
            }

        }

        Ok(())
    }
}



