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
        for k in self.keys() {
            if k.to_string().eq_ignore_ascii_case(key) {
                return Some((k, self.get(k).unwrap()));
            }
        }

        None
    }

    /// Match key to the HashMap keys, ignoring case.
    /// If found, remove the original value from the HashMap.
    fn remove_ignore_case(&mut self, key: &str) -> Option<V> {
        let mut found_key_option = None;
        for k in self.keys() {
            if k.to_string().eq_ignore_ascii_case(key) {
                found_key_option = Some(k.clone());
                break;
            }
        }

        found_key_option.and_then(|k| self.remove(&k))
    }
}
