
use crate::state_variables::*;

// Why we need RefCells: the Rc does not allow mutability in the thing it wraps.
// If it any point we might want to mutate a field, its value should be wrapped in a RefCell.

use std::{cell::RefCell, fmt};


pub struct StateVar {
    // This field should remain private
    state_ref: RefCell<ValueTypeProtector>
}

// This enum should remain private
enum ValueTypeProtector {
    String(State<String>),
    Boolean(State<bool>),
    Integer(State<i64>),
    Number(State<f64>),
}



#[derive(Debug)]
pub enum State<T> {
    Stale,
    Resolved(T),
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
                    StateVarValueType::Boolean =>   ValueTypeProtector::Boolean(State::Stale),
                    StateVarValueType::Integer =>   ValueTypeProtector::Integer(State::Stale),
                    StateVarValueType::Number =>   ValueTypeProtector::Number(State::Stale),
                    StateVarValueType::String =>   ValueTypeProtector::String(State::Stale),
                }
            )
        }
    }


    pub fn set_value(&self, new_value: StateVarValue) -> Result<(), String> {


        fn invalid_new_value<T: std::fmt::Display>(
            my_type: &'static str,
            new_value_type: &'static str,
            new_val: T)
        -> String
        {                
            format!("Invalid value for state var: State var is type {}, but tried to set it to {} ({})",
                my_type, new_val.to_string(), new_value_type)
        }



        let type_protector = &mut *self.state_ref.borrow_mut();

        match type_protector {
        
            ValueTypeProtector::String(state) => {                

                match new_value {
                    StateVarValue::String(val) => {
                        *state = State::Resolved(val);
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
                        *state = State::Resolved(val);
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
                        *state = State::Resolved(val);
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
                        *state = State::Resolved(val);
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

        Result::Ok(())

    }



    pub fn get_state(&self) -> State<StateVarValue> {

        use State::Resolved;
        use State::Stale;

        // NOTE: Internally, we store the State enum inside the ValueType
        // enum so that the ValueType is retained even when we're Stale.
        // However, it is more convenient to pass around a
        // State<StateVarValue> externally.

        let type_protector = &*self.state_ref.borrow();

        match type_protector {
            ValueTypeProtector::String(state) => match state {
                Resolved(val) => Resolved(StateVarValue::String(val.clone())),
                Stale => Stale
            },
            ValueTypeProtector::Number(state) => match state {
                Resolved(val) => Resolved(StateVarValue::Number(val.clone())),
                Stale => Stale
            },
            ValueTypeProtector::Boolean(state) => match state {
                Resolved(val) => Resolved(StateVarValue::Boolean(val.clone())),
                Stale => Stale
            },
            ValueTypeProtector::Integer(state) => match state {
                Resolved(val) => Resolved(StateVarValue::Integer(val.clone())),
                Stale => Stale
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





// Boilerplate to display StateVar better
impl fmt::Debug for StateVar {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("{:?}", &self.get_state()))
    }
}
