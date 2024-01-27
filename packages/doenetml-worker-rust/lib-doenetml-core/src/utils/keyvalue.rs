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
    ///
    /// Warning: This function returns the first match if multiple keys match. It is the
    /// caller's responsibility to ensure that the keys are unique up to case.
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)> {
        self.iter()
            .find(|(k, _)| k.to_string().eq_ignore_ascii_case(key))
    }

    /// Match key to the HashMap keys, ignoring case.
    /// If found, remove the original value from the HashMap.
    ///
    /// Warning: This function deletes the first match if multiple keys match. It is the
    /// caller's responsibility to ensure that the keys are unique up to case.
    fn remove_ignore_case(&mut self, key: &str) -> Option<V> {
        self.keys()
            .find(|k| k.to_string().eq_ignore_ascii_case(key))
            .cloned()
            .and_then(|k| self.remove(&k))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_key_value_ignore_case() {
        let mut map = HashMap::new();
        map.insert("Key1".to_string(), "Value1");
        map.insert("KEY2".to_string(), "Value2");

        assert_eq!(
            map.get_key_value_ignore_case("key1"),
            Some((&"Key1".to_string(), &"Value1"))
        );
        assert_eq!(
            map.get_key_value_ignore_case("key2"),
            Some((&"KEY2".to_string(), &"Value2"))
        );
        assert_eq!(map.get_key_value_ignore_case("nonexistent"), None);
    }

    #[test]
    fn test_remove_ignore_case() {
        let mut map = HashMap::new();
        map.insert("Key1".to_string(), "Value1");
        map.insert("KEY2".to_string(), "Value2");

        assert_eq!(map.get("Key1"), Some(&"Value1"));
        assert_eq!(map.remove_ignore_case("key1"), Some("Value1"));
        assert_eq!(map.remove_ignore_case("key2"), Some("Value2"));
        assert_eq!(map.remove_ignore_case("nonexistent"), None);
        assert_eq!(map.get("Key1"), None);
    }
}
