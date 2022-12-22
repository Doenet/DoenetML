use enum_as_inner::EnumAsInner;

use crate::{state_variables::*, utils::log_debug, Instance, InstanceGroup};
use std::{cell::{RefCell, RefMut, Ref}, fmt, cmp::max, iter::repeat};
use self::State::*;
use ndarray::{ArrayD, SliceInfoElem};

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
#[derive(Clone, Debug)]
enum ValueTypeProtector {
    String(State<String>),
    Boolean(State<bool>),
    Integer(State<i64>),
    Number(State<f64>),
}


#[derive(Debug, Clone, PartialEq, EnumAsInner)]
pub enum State<T> {
    Stale,
    Resolved(T),
}

impl From<&StateVar> for serde_json::Value {
    fn from(state: &StateVar) -> serde_json::Value {
        match state.get_state() {
            State::Resolved(value) => value.into(),
            State::Stale => serde_json::Value::Null,
        }
    }
}


#[derive(Debug, Clone, serde::Serialize)]
pub struct ForEachMap<T: Clone + std::fmt::Debug> {
    values: RefCell<ArrayD<T>>,
    default: T,
}

// with index starting at 1
fn map_instance_to_index(map: &Instance) -> Vec<usize> {
    if map.len() == 0 {
        vec![1]
    } else {
        map.clone()
    }
}

impl<T: Clone + std::fmt::Debug> ForEachMap<T> {
    fn new(value: T) -> Self {
        ForEachMap {
            values: RefCell::new(ArrayD::<T>::from_elem(vec![0], value.clone())),
            default: value,
        }
    }

    fn resize(&self, dim: &Vec<usize>) {
        let array = self.values.borrow().clone();
        let mut shape = array.shape().to_vec();
        let add_dimensions: usize = max(dim.len(), shape.len()) - shape.len();

        let required_shape: Vec<usize> = (0..(shape.len() + add_dimensions))
            .map(|i| {
                match (shape.get(i),dim.get(i)) {
                    (Some(&x), Some(&y)) => max(x,y),
                    (Some(&x), None) => x,
                    (None, Some(&y)) => y,
                    (None, None) => unreachable!(),
                }
            }).collect();

        // log_debug!("should have size: {:?} vs shape {:?}", required_shape, current_shape);

        if add_dimensions > 0 || shape != required_shape {

            shape.extend(repeat(1).take(add_dimensions));
            let array_reshape = array.to_shape(shape.clone()).unwrap();
            let slice_info_elements: Vec<SliceInfoElem> = shape.iter()
                .map(|&i| SliceInfoElem::Slice {
                    start: 0,
                    end: Some(i.try_into().unwrap()),
                    step: 1,
                })
                .collect();
            let slice_info = slice_info_elements.as_slice().as_ref();

            let mut new = ArrayD::<T>::from_elem(required_shape.clone(), self.default.clone());
            new.slice_mut(slice_info).assign(&array_reshape);

            let mut value = self.values.borrow_mut();
            *value = new;
        }
    }

    fn instance_mut(& self, map: &Instance) -> RefMut<'_, T> {
        let dim = map_instance_to_index(map);
        self.resize(&dim);

        let index: Vec<usize> = dim.iter().map(|&i| i-1)
            .chain(repeat(0).take(self.values.borrow().ndim()-dim.len())).collect();

        RefMut::map(self.values.borrow_mut(), |x| x.get_mut(index.as_slice()).unwrap())
    }

    pub fn instance(&self, map: &Instance) -> Ref<'_, T> {
        let dim = map_instance_to_index(map);
        self.resize(&dim);

        let index: Vec<usize> = dim.iter().map(|&i| i-1)
            .chain(repeat(0).take(self.values.borrow().ndim()-dim.len())).collect();

        Ref::map(self.values.borrow(), |x| x.get(index.as_slice()).unwrap())
    }

    pub fn all_instances(&self) -> ArrayD<T> {
        self.values.borrow().clone()
    }

    pub fn instances_existing_in_instance_group(&self, instance_group: &InstanceGroup) -> Vec<Instance> {
        let array = self.values.borrow().clone();
        let shape = array.shape();

        if shape == [1] {
            // assert!(instance_group.is_empty(), "instance: {:?}", instance_group);
            return vec![vec![]];
        }

        let add_instances: Vec<std::ops::RangeInclusive<usize>> = shape.iter()
            .skip(instance_group.len())
            .map(|&s| 1..=s)
            .collect();

        all_group_instances(instance_group, &add_instances)
    }
}

/// Extend the instance with every possibility of each range.
fn all_group_instances(
    map: &InstanceGroup,
    add_instances: &[std::ops::RangeInclusive<usize>],
) -> Vec<Instance> {
    if add_instances.is_empty() {
        return vec![map.clone()]
    }
    let mut vec = vec![];
    for i in add_instances[0].clone() {
        let mut next_map = map.clone();
        next_map.push(i);
        vec.extend(all_group_instances(&next_map, &add_instances[1..]));
    }
    vec
}



#[derive(Debug)]
pub enum StateForStateVar {
    Single(ForEachMap<StateVar>),
    Array {
        size: ForEachMap<StateVar>,
        stale_resize: StateVar,
        elements: ForEachMap<Vec<StateVar>>,
    }
}

impl StateForStateVar {

    /// Stale StateVar of the given type
    pub fn new(value_type: &StateVarVariant) -> Self {

        match value_type {
            StateVarVariant::Boolean(_) => Self::Single(ForEachMap::new(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::Boolean(Stale))
            })),
            StateVarVariant::Integer(_) => Self::Single(ForEachMap::new(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::Integer(Stale))
            })),
            StateVarVariant::Number(_) =>  Self::Single(ForEachMap::new(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::Number(Stale))
            })),
            StateVarVariant::String(_) =>  Self::Single(ForEachMap::new(StateVar {
                value_type_protector: RefCell::new(ValueTypeProtector::String(Stale))
            })),
            StateVarVariant::NumberArray(_) => {
                Self::Array {
                    size: ForEachMap::new(StateVar {
                        value_type_protector: RefCell::new(ValueTypeProtector::Integer(Stale)),
                    }),
                    stale_resize: StateVar {
                        value_type_protector: RefCell::new(ValueTypeProtector::Number(Stale)),
                    },
                    elements: ForEachMap::new(
                        vec![]
                    )
                }
            }
            StateVarVariant::StringArray(_) => {
                Self::Array {
                    size: ForEachMap::new(StateVar {
                        value_type_protector: RefCell::new(ValueTypeProtector::Integer(Stale)),
                    }),
                    stale_resize: StateVar {
                        value_type_protector: RefCell::new(ValueTypeProtector::String(Stale)),
                    },
                    elements: ForEachMap::new(
                        vec![]
                    )
                }
            }
        }
    }


    pub fn get_single_state(&self, sv_ref: &StateIndex, map: &Instance) -> Result<Option<State<StateVarValue>>, String> {

        // log_debug!("Getting single state of {:?}, current value is {:?}", sv_ref, self);

        match self {
            Self::Single(sv) => {
                match sv_ref {
                    StateIndex::Basic => Ok(Some(sv.instance(map).get_state())),
                    _ => Err(format!("Tried to access a non-array State with an index or a size")),
                }
            },
            Self::Array { size, elements, .. } => {
                match sv_ref {
                    StateIndex::SizeOf => Ok(Some(size.instance(map).get_state())),
                    StateIndex::Element(id) => {
                        if *id == 0 {
                            Ok(None)
                        } else {
                            let internal_id = id - 1;
                            Ok(elements.instance(map).get(internal_id).map(|elem| elem.get_state()))
                        }
                    },
                    _ => Err(format!("Tried to access an array State without an index or a size")),
                }
            },

        }

    }


    pub fn set_single_state(&self, state_var_ref: &StateIndex, val: StateVarValue, map: &Instance) -> Result<Option<StateVarValue>, String> {
        match self {
            Self::Single(sv) => sv.instance(map).set_value(val).map(|new_val| Some(new_val)),

            Self::Array { size, elements, stale_resize } => match state_var_ref {
                StateIndex::Element(id) => {
                    if *id == 0 {
                        Ok(None)
                    } else {
                        let internal_id = id - 1;
                        if let Some(element) = elements.instance(map).get(internal_id) {
                            element.set_value(val).map(|new_val| Some(new_val))
                        } else {
                            Ok(None)
                        }
                    }
                }

                StateIndex::SizeOf => {

                    // log_debug!("current array:

                    let new_size = size.instance(map).set_value(val.clone());
                    
                    if new_size.is_ok() {
                        elements.instance_mut(map).resize(
                            i64::try_from(val).unwrap() as usize,
                            stale_resize.clone(),
                        );
                    }

                    new_size.map(|val| Some(val))
                },
                _ => panic!()
            }
        }
    }

    pub fn instances_where_slice_is_resolved(&self, sv_slice: &StateVarSlice, instance_group: &InstanceGroup)
        -> Vec<Result<Instance, String>> {
        match self {
            Self::Single(sv) => {
                sv.instances_existing_in_instance_group(instance_group).into_iter().filter_map(|i| {
                    match self.slice_is_stale(sv_slice, &i) {
                        Ok(stale) => if stale { None } else { Some(Ok(i)) },
                        Err(e) => Some(Err(e)),
                    }
                }).collect()
            }
            Self::Array { size, ..} => {
                size.instances_existing_in_instance_group(instance_group).into_iter().filter_map(|i| {
                    match self.slice_is_stale(sv_slice, &i) {
                        Ok(stale) => if stale { None } else { Some(Ok(i)) },
                        Err(e) => Some(Err(e)),
                    }
                }).collect()
            }
        }
    }

    // When referring to an array, this returns true if every aspect is stale
    pub fn slice_is_stale(&self, sv_slice: &StateVarSlice, map: &Instance) -> Result<bool, String> {

        // log_debug!("is {:?} stale? {:?}", sv_slice, self);
        match (self, sv_slice) {
            (Self::Single(sv), StateVarSlice::Single(StateRef::Basic(_))) =>
                Ok(sv.instance(map).get_state().is_stale()),
            (Self::Array { size, .. }, StateVarSlice::Single(StateRef::SizeOf(_))) =>
                Ok(size.instance(map).get_state().is_stale()),
            (Self::Array { size, elements, .. }, StateVarSlice::Array(_)) =>
                if size.instance(map).get_state().is_stale() {
                    Ok(true)
                } else {
                    let elements = elements.instance(map);
                    Ok((0..elements.len()).map(|i| elements.get(i).unwrap().get_state().is_stale()).reduce(|a,b| a || b).unwrap_or(false))
                }
            (Self::Array { elements, .. }, StateVarSlice::Single(StateRef::ArrayElement(_, id))) => {
                if *id == 0 {
                    Err("requested id 0".into())
                } else {
                    let internal_id = id - 1;
                    elements.instance(map).get(internal_id)
                        .map(|elem| elem.get_state().is_stale())
                        .ok_or("index out of range".into())
                }
            },
            _ => panic!(),
        }

    }

    pub fn mark_stale_slice(&self, sv_slice: &StateVarSlice, map: &Instance) {
        match (self, sv_slice) {
            (Self::Single(sv), StateVarSlice::Single(StateRef::Basic(_))) => {
                sv.instance(map).mark_stale()
            },
            (Self::Array { size, elements, .. }, StateVarSlice::Single(StateRef::SizeOf(_))) |
            (Self::Array { size, elements, .. }, StateVarSlice::Array(_)) => {
                size.instance(map).mark_stale();
                let elements = elements.instance(map);
                for i in elements.iter() {
                    i.mark_stale()
                }
            }
            (Self::Array { elements, .. }, StateVarSlice::Single(StateRef::ArrayElement(_, id))) => {
                if *id == 0 {
                    panic!("Invalid index 0")
                }
                let internal_id = id - 1;
                elements.instance(map).get(internal_id).unwrap().mark_stale()
            },
            _ => panic!()
        }
    }

    pub fn elements_len(&self, map: &Instance) -> usize {
        match self {
            Self::Single(_) => panic!(),
            Self::Array { elements, .. } => elements.instance(map).len(),
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
    Single(ForEachMap<StateVarValue>),
    Array {
        size: ForEachMap<usize>,
        elements:ForEachMap<Vec<StateVarValue>>,
        extension: StateVarValue,
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
        // log_debug!("Initializing essential state with elements {:?} and default value {:?}", values, default_fill_value);

        Self::Array {
            size: ForEachMap::new(values.len()),
            elements: ForEachMap::new(values),
            extension: default_fill_value,
        }
    }

    pub fn new_single_basic_with_state_var_value(value: StateVarValue) -> Self {
        Self::Single(ForEachMap::new(value))
    }

    pub fn set_value(&self, state_index: StateIndex, new_value: StateVarValue, map: &Instance) -> Result<(), String> {
        match (self, state_index) {
            (Self::Single(v), StateIndex::Basic) => {
                v.instance_mut(map).set_protect_type(new_value)
            },

            (Self::Array{size, elements, extension }, StateIndex::SizeOf) => {
                let new_len = max(size.instance(map).clone(), usize::try_from(new_value.clone()).expect(
                    &format!("tried to set essential size to {}", new_value))
                );
                elements.instance_mut(map).resize(new_len, extension.clone());

                let mut s = size.instance_mut(map);
                *s = new_len;
                Ok(())
            },

            (Self::Array{elements, extension, ..}, StateIndex::Element(id)) => {
                
                if id == 0 {
                    return Err("Index out of range".into())
                }

                let internal_id = id - 1;

                let mut v = elements.instance_mut(map);

                let new_len = max(v.len(), internal_id + 1);
                v.resize(new_len, extension.clone());

                v.get_mut(internal_id).unwrap().set_protect_type(new_value)?;
                Ok(())
            },
            _ => panic!("state ref and essential value do not match"),
        }
    }


    pub fn get_value(&self, state_index: StateIndex, map: &Instance) -> Option<StateVarValue> {
        match (self, state_index) {
            (Self::Single(v), StateIndex::Basic) => {
                Some(v.instance(map).clone())
            },
            (Self::Array{size, .. }, StateIndex::SizeOf) => {
                Some(StateVarValue::Integer(size.instance(map).clone() as i64))
            },
            (Self::Array{elements, ..}, StateIndex::Element(id)) => {

                if id == 0 {
                    return None
                }

                let internal_id = id - 1;

                elements.instance(map).get(internal_id).cloned()
            },
            _ => panic!("state index {:?} and essential value {:?} do not match", state_index, &self),
        }
    }

    pub fn get_type_as_str(&self) -> &'static str {
        match self {
            Self::Array { extension, .. } => {
                extension.type_as_str()
            },
            Self::Single(val) => {
                val.default.type_as_str()
            }
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
            Self::Single(v) => format!("{:?}", v.all_instances()),
            Self::Array { elements, ..} => format!("{:?}", elements.all_instances()),
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

