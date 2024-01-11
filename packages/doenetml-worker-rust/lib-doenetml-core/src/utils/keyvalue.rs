use std::collections::HashMap;

pub trait KeyValueIgnoreCase<K, V> {
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)>;
}

impl<K, V> KeyValueIgnoreCase<K, V> for HashMap<K, V>
where
    K: ToString + std::cmp::Eq + std::hash::Hash,
{
    /// Match key to the HashMap keys, ignoring case.
    /// Return the original key-value pair the HashMap.
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)> {
        for k in self.keys() {
            if k.to_string().eq_ignore_ascii_case(key) {
                return Some((k, self.get(k).unwrap()));
            }
        }

        None
    }
}
