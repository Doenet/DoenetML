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
    graph.add_edge(&"a".into(), &"b".into());
    graph.add_edge(&"a".into(), &"c".into());
    graph.add_edge(&"c".into(), &"d".into());
    graph.add_edge(&"c".into(), &"e".into());
    graph.add_edge(&"d".into(), &"e".into());
    assert_eq!(
        graph.walk_descendants(&"a".into()).collect::<Vec<_>>(),
        vec!["b", "c", "d", "e"]
    );

    assert_eq!(
        graph.walk_descendants(&"d".into()).collect::<Vec<_>>(),
        vec!["e"]
    );

    assert_eq!(
        graph.walk_descendants(&"e".into()).collect::<Vec<_>>(),
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
    graph.add_edge(&"a".into(), &"b".into());
    graph.add_edge(&"a".into(), &"c".into());
    graph.add_edge(&"c".into(), &"d".into());
    graph.add_edge(&"c".into(), &"e".into());
    graph.add_edge(&"d".into(), &"e".into());
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
    graph.add_edge(&"a".into(), &"b".into());
    graph.add_edge(&"a".into(), &"c".into());
    graph.add_edge(&"c".into(), &"d".into());
    graph.add_edge(&"c".into(), &"e".into());
    graph.add_edge(&"d".into(), &"e".into());
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
