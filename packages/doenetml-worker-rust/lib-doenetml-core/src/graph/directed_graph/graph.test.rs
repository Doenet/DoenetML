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
    graph.add_node("a".to_string());
    graph.add_node("b".to_string());
    graph.add_node("c".to_string());
    graph.add_node("d".to_string());
    graph.add_node("e".to_string());
    graph.add_edge("a".to_string(), "b".to_string());
    graph.add_edge("a".to_string(), "c".to_string());
    graph.add_edge("c".to_string(), "d".to_string());
    graph.add_edge("c".to_string(), "e".to_string());
    graph.add_edge("d".to_string(), "e".to_string());
    assert_eq!(
        graph
            .descendants_topological_multiroot(&[&"a".into()])
            .collect::<Vec<_>>(),
        vec!["a", "b", "c", "d", "e"]
    );

    assert_eq!(
        graph
            .descendants_topological_multiroot(&[&"d".into()])
            .collect::<Vec<_>>(),
        vec!["d", "e"]
    );

    assert_eq!(
        graph
            .descendants_topological_multiroot(&[&"e".into()])
            .collect::<Vec<_>>(),
        vec!["e"]
    );
}

#[test]
fn can_quick_iterate_through_descendants() {
    // Set up the graph
    // a -> b
    // a -> c -> e
    // c -> d -> e
    let mut graph = DirectedGraph::<String, HashMap<_, _>>::new();
    graph.add_node("a".to_string());
    graph.add_node("b".to_string());
    graph.add_node("c".to_string());
    graph.add_node("d".to_string());
    graph.add_node("e".to_string());
    graph.add_edge("a".to_string(), "b".to_string());
    graph.add_edge("a".to_string(), "c".to_string());
    graph.add_edge("c".to_string(), "d".to_string());
    graph.add_edge("c".to_string(), "e".to_string());
    graph.add_edge("d".to_string(), "e".to_string());
    assert_eq!(
        graph.descendants_quick(&"a".into()).collect::<Vec<_>>(),
        vec!["e", "d", "c", "b", "a"]
    );
}

#[test]
fn can_iterate_through_descendants_reverse_topological_including_multiroot() {
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
        .descendants_reverse_topological_multiroot(&[&a])
        .collect_vec();
    assert_eq!(nodes, vec![&e, &d, &c, &b, &a]);
    let nodes = graph
        .descendants_reverse_topological_multiroot(&[a])
        .collect_vec();
    assert_eq!(nodes, vec![&e, &d, &c, &b, &a]);
    let nodes = graph
        .descendants_reverse_topological_multiroot(&[c, b])
        .collect_vec();
    assert_eq!(nodes, vec![&e, &b, &d, &c]);
}

#[test]
fn can_iterate_through_descendants_reverse_topological_with_skip() {
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

#[test]
fn can_iterate_through_descendants_topological_including_multiroot() {
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

    let nodes = graph.descendants_topological_multiroot(&[&a]).collect_vec();
    assert_eq!(nodes, vec![&a, &b, &c, &d, &e]);

    let nodes = graph.descendants_topological_multiroot(&[a]).collect_vec();
    assert_eq!(nodes, vec![&a, &b, &c, &d, &e]);

    let nodes = graph
        .descendants_topological_multiroot(&[c, b])
        .collect_vec();
    assert_eq!(nodes, vec![&c, &d, &b, &e]);
}

#[test]
fn can_iterate_through_ancestors_reverse_topological_including_multiroot() {
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
        .ancestors_reverse_topological_multiroot(&[&e])
        .collect_vec();
    assert_eq!(nodes, vec![&a, &b, &c, &d, &e]);

    let nodes = graph
        .ancestors_reverse_topological_multiroot(&[e])
        .collect_vec();
    assert_eq!(nodes, vec![&a, &b, &c, &d, &e]);

    let nodes = graph
        .ancestors_reverse_topological_multiroot(&[d, b])
        .collect_vec();
    assert_eq!(nodes, vec![&a, &b, &c, &d]);
}

#[test]
fn can_iterate_through_ancestors_reverse_topological_with_skip() {
    // Set up the graph
    // a -> b
    // a -> c -> e
    // a -> d -> c
    // b -> e

    let (a, b, c, d, e) = ("a", "b", "c", "d", "e");
    let mut graph = DirectedGraph::<&str, HashMap<_, _>>::new();
    graph.add_edge(a, b);
    graph.add_edge(a, c);
    graph.add_edge(a, d);
    graph.add_edge(c, e);
    graph.add_edge(d, c);
    graph.add_edge(b, e);

    let nodes = graph
        .ancestors_reverse_topological_multiroot_with_skip(&[e], |&node| node == "c")
        .collect_vec();

    assert_eq!(nodes, vec![&a, &b, &e]);
}

#[test]
fn can_iterate_through_ancestors_topological_including_multiroot() {
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

    let nodes = graph.ancestors_topological_multiroot(&[&e]).collect_vec();
    assert_eq!(nodes, vec![&e, &d, &c, &b, &a]);

    let nodes = graph.ancestors_topological_multiroot(&[e]).collect_vec();
    assert_eq!(nodes, vec![&e, &d, &c, &b, &a]);

    let nodes = graph.ancestors_topological_multiroot(&[d, b]).collect_vec();
    assert_eq!(nodes, vec![&d, &c, &b, &a]);
}
