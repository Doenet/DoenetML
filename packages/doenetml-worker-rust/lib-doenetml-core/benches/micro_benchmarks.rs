use criterion::{Criterion, black_box, criterion_group, criterion_main};
use doenetml_core::{
    graph::directed_graph::{DirectedGraph, Taggable},
    graph_node::{GraphNode, GraphNodeLookup},
};

#[path = "../tests/test_utils/mod.rs"]
mod test_utils;
use pprof::criterion::{Output, PProfProfiler};

type GraphNodeGraph = DirectedGraph<GraphNode, GraphNodeLookup<usize>>;

/// Create a graph with `depth` layers and `branches` children per node.
fn make_graph(depth: usize, branches: usize) -> GraphNodeGraph {
    let mut graph: GraphNodeGraph = DirectedGraph::new();

    for i in 1..(depth + 1) {
        for j in 1..(branches.pow(i as u32) + 1) {
            let mut parent_num = (j - 1) / branches + 1;
            if i > 1 {
                parent_num += branches.pow((i - 2) as u32) * (branches - 1)
            }
            let child_num = j + branches.pow((i - 1) as u32) * (branches - 1);
            graph.add_edge(
                GraphNode::Virtual(parent_num),
                GraphNode::Virtual(child_num),
            );
        }
    }

    graph.add_edge(GraphNode::Query(0), GraphNode::Virtual(1));

    graph
}

pub fn criterion_benchmark(c: &mut Criterion) {
    // Populate `wide_graph` with three layers of nodes, each of which has 10 children.
    let root = GraphNode::Query(0);
    let wide_graph = make_graph(5, 10);
    let descendants = wide_graph.descendants_quick(root).collect::<Vec<_>>();
    dbg!(descendants.len());

    c.bench_function("GraphNodeLookup", |b| {
        let taggable = wide_graph._debug_get_index_lookup();
        b.iter(|| {
            for node in descendants.iter() {
                let idx = taggable.get_tag(node);
                black_box(idx);
            }
        });
    });

    c.bench_function("iterate quick", |b| {
        b.iter(|| {
            for x in wide_graph.descendants_quick(root) {
                black_box(x);
            }
        });
    });

    c.bench_function("iterate topological", |b| {
        b.iter(|| {
            for x in wide_graph.descendants_topological_multiroot(&[root]) {
                black_box(x);
            }
        });
    });

    c.bench_function("iterate reverse-topological", |b| {
        b.iter(|| {
            for x in wide_graph.descendants_reverse_topological_multiroot(&[root]) {
                black_box(x);
            }
        });
    });

    let num_nodes = wide_graph
        .descendants_reverse_topological_multiroot_with_skip(&[root], |node| node.idx() > 1000)
        .count();
    dbg!(num_nodes);

    c.bench_function("iterate full graph with skip", |b| {
        b.iter(|| {
            for x in wide_graph
                .descendants_reverse_topological_multiroot_with_skip(&[root], |node| {
                    node.idx() > 1000
                })
            {
                black_box(x);
            }
        });
    });

    let root = GraphNode::Virtual(1000);
    dbg!(wide_graph.descendants_quick(root).count());

    c.bench_function("iterate part of graph", |b| {
        b.iter(|| {
            for x in wide_graph.descendants_reverse_topological_multiroot(&[root]) {
                black_box(x);
            }
        });
    });

    c.bench_function("iterate part of graph with skip", |b| {
        b.iter(|| {
            for x in wide_graph
                .descendants_reverse_topological_multiroot_with_skip(&[root], |node| {
                    node.idx() < 1000
                })
            {
                black_box(x);
            }
        });
    });
}

// Uncomment to run benchmarks without profiling
// criterion_group!(benches, criterion_benchmark);
// criterion_main!(benches);
criterion_group! {
    name = benches;
    config = Criterion::default().with_profiler(PProfProfiler::new(1000, Output::Protobuf));
    targets = criterion_benchmark
}
criterion_main!(benches);
