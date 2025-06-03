use std::{
    ops::{Index, IndexMut},
    slice::Iter,
};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ExtendedVector<T> {
    inner: Vec<T>,
    index_offset: isize,
}

impl<T> ExtendedVector<T> {
    pub fn new(index_offset: isize) -> ExtendedVector<T> {
        ExtendedVector {
            inner: Vec::new(),
            index_offset,
        }
    }

    pub fn from_vector(values: Vec<T>, index_offset: isize) -> ExtendedVector<T> {
        ExtendedVector {
            inner: values,
            index_offset,
        }
    }

    pub fn len(&self) -> usize {
        self.inner.len()
    }

    pub fn is_empty(&self) -> bool {
        self.inner.is_empty()
    }

    pub fn insert(&mut self, index: isize, element: T) {
        if index + self.index_offset < 0 {
            panic!("Extended vector index cannot be less than index offset");
        }
        self.inner
            .insert((index + self.index_offset).try_into().unwrap(), element);
    }

    pub fn remove(&mut self, index: isize) -> T {
        if index + self.index_offset < 0 {
            panic!("Extended vector index cannot be less than index offset");
        }
        self.inner
            .remove((index + self.index_offset).try_into().unwrap())
    }

    pub fn push(&mut self, value: T) {
        self.inner.push(value)
    }

    pub fn pop(&mut self) -> Option<T> {
        self.inner.pop()
    }

    pub fn iter(&self) -> Iter<'_, T> {
        self.inner.iter()
    }
}

impl<T> Index<isize> for ExtendedVector<T> {
    type Output = T;

    fn index(&self, index: isize) -> &Self::Output {
        if index + self.index_offset < 0 {
            panic!("Extended vector index cannot be less than index offset");
        }
        let inner_index: usize = (index + self.index_offset).try_into().unwrap();
        self.inner.index(inner_index)
    }
}

impl<T> IndexMut<isize> for ExtendedVector<T> {
    fn index_mut(&mut self, index: isize) -> &mut Self::Output {
        if index + self.index_offset < 0 {
            panic!("Extended vector index cannot be less than index offset");
        }
        let inner_index: usize = (index + self.index_offset).try_into().unwrap();
        self.inner.index_mut(inner_index)
    }
}

impl<T> Extend<T> for ExtendedVector<T> {
    fn extend<I: IntoIterator<Item = T>>(&mut self, iter: I) {
        self.inner.extend(iter)
    }
}
