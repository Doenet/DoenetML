use itertools::Itertools;

use super::*;

#[test]
fn test_indexable() {
    let mut indexable: HashMap<String, usize> = HashMap::new();
    indexable.set_tag("test".into(), 0);
    indexable.set_tag("test2".into(), 1);

    assert_eq!(*indexable.get_tag(&"test".into()).unwrap(), 0);
    assert_eq!(*indexable.get_tag(&"test2".into()).unwrap(), 1);
}

#[test]
fn can_walk_in_topological_order() {
    // Set up the graph
    // a -> b
    // a -> c -> e
    // c -> d -> e
    let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
    graph.add_node("a".into());
    graph.add_node("b".into());
    graph.add_node("c".into());
    graph.add_node("d".into());
    graph.add_node("e".into());
    graph.add_edge("a".to_string(), "b".to_string());
    graph.add_edge("a".to_string(), "c".to_string());
    graph.add_edge("c".to_string(), "d".to_string());
    graph.add_edge("c".to_string(), "e".to_string());
    graph.add_edge("d".to_string(), "e".to_string());
    assert_eq!(
        graph
            .descendants_topological(&"a".into())
            .collect::<Vec<_>>(),
        vec!["b", "c", "d", "e"]
    );

    assert_eq!(
        graph
            .descendants_topological(&"d".into())
            .collect::<Vec<_>>(),
        vec!["e"]
    );

    assert_eq!(
        graph
            .descendants_topological(&"e".into())
            .collect::<Vec<_>>(),
        Vec::<&String>::new()
    );
}

#[test]
fn can_quick_iterate_through_descendants() {
    // Set up the graph
    // a -> b
    // a -> c -> e
    // c -> d -> e
    let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
    graph.add_node("a".into());
    graph.add_node("b".into());
    graph.add_node("c".into());
    graph.add_node("d".into());
    graph.add_node("e".into());
    graph.add_edge("a".to_string(), "b".to_string());
    graph.add_edge("a".to_string(), "c".to_string());
    graph.add_edge("c".to_string(), "d".to_string());
    graph.add_edge("c".to_string(), "e".to_string());
    graph.add_edge("d".to_string(), "e".to_string());
    assert_eq!(
        graph.descendants_quick(&"a".into()).collect::<Vec<_>>(),
        // Repeated nodes are allowed for the `_quick` iterator
        vec!["c", "e", "d", "b"]
    );
}

#[test]
fn can_iterate_through_descendant_edges() {
    // Set up the graph
    // a -> b
    // a -> c -> e
    // c -> d -> e
    let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
    graph.add_node("a".into());
    graph.add_node("b".into());
    graph.add_node("c".into());
    graph.add_node("d".into());
    graph.add_node("e".into());
    graph.add_edge("a".to_string(), "b".to_string());
    graph.add_edge("a".to_string(), "c".to_string());
    graph.add_edge("c".to_string(), "d".to_string());
    graph.add_edge("c".to_string(), "e".to_string());
    graph.add_edge("d".to_string(), "e".to_string());
    assert_eq!(
        graph.descendant_edges(&"a".into()).collect::<Vec<_>>(),
        vec![
            (&"a".into(), &"c".into()),
            (&"a".into(), &"b".into()),
            (&"c".into(), &"e".into()),
            (&"c".into(), &"d".into()),
            (&"d".into(), &"e".into())
        ]
    );
}

#[test]
fn can_iterate_through_descendants_with_skip() {
    // Set up the graph
    // a -> b
    // a -> c -> e
    // c -> d -> e
    // b -> e

    let (a, b, c, d, e) = ("a", "b", "c", "d", "e");
    let mut graph = DirectedGraph::<&str, HashMap<_, _>>::new();
    graph.add_edge(a, b);
    graph.add_edge(a, c);
    graph.add_edge(c, d);
    graph.add_edge(c, e);
    graph.add_edge(d, e);
    graph.add_edge(b, e);

    let nodes = graph
        .descendants_reverse_topological_multiroot_with_skip(&[a], |&node| node == "c")
        .collect_vec();
    assert_eq!(nodes, vec![&e, &b, &a]);
}
