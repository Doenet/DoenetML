use std::collections::HashMap;

pub trait KeyValueIgnoreCase<K, V> {
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)>;
    fn remove_ignore_case(&mut self, key: &str) -> Option<V>;
}

impl<K, V> KeyValueIgnoreCase<K, V> for HashMap<K, V>
where
    K: ToString + std::cmp::Eq + std::hash::Hash + Clone,
{
    /// Match key to the HashMap keys, ignoring case.
    /// Return the original key-value pair from the HashMap.
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)> {
        self.iter()
            .find(|(k, _)| k.to_string().eq_ignore_ascii_case(key))
    }

    /// Match key to the HashMap keys, ignoring case.
    /// If found, remove the original value from the HashMap.
    fn remove_ignore_case(&mut self, key: &str) -> Option<V> {
        self.keys()
            .find(|k| k.to_string().eq_ignore_ascii_case(key)).cloned()
            .and_then(|k| self.remove(&k))
    }
}
