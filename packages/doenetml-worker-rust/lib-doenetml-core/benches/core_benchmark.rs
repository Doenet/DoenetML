use criterion::{black_box, criterion_group, criterion_main, Criterion};
use doenetml_core::{
    components::{
        actions::{Action, ActionBody},
        doenet::text_input::{TextInputAction, TextInputActionArgs},
        ActionsEnum,
    },
    dast::{DastRoot, FlatDastRoot},
    DoenetMLCore,
};

struct Core {
    core: Option<DoenetMLCore>,
}

impl Core {
    fn new() -> Self {
        Core { core: None }
    }

    fn init_from_dast_root(&mut self, dast_root: &DastRoot) {
        self.core = Some(DoenetMLCore::new(dast_root.clone(), "", "", None));
    }

    fn to_flat_dast(&mut self) -> FlatDastRoot {
        let core = self.core.as_mut().expect("Should be initialized");
        core.to_flat_dast()
    }

    fn dispatch_action(&mut self, action: Action) -> Result<(), String> {
        let core = self.core.as_mut().expect("Should be initialized");
        core.dispatch_action(action)?;
        Ok(())
    }
}

#[path = "../tests/test_utils/mod.rs"]
mod test_utils;
use pprof::criterion::{Output, PProfProfiler};
use test_utils::*;

const SMALL_SOURCE: &str = r#"<textInput />"#;
const THOUSAND_STAR: &str = include_str!("./samples/thousand_star.doenet");
const THOUSAND_CHAIN: &str = include_str!("./samples/thousand_chain.doenet");
const THOUSAND_CHAIN_FLIPPED: &str = include_str!("./samples/thousand_chain_flipped.doenet");
const REVERSE_THOUSAND_CHAIN: &str = include_str!("./samples/reverse_thousand_chain.doenet");

pub fn criterion_benchmark(c: &mut Criterion) {
    // Benchmark initializing Core
    let dast_root = dast_root_no_position(SMALL_SOURCE);
    c.bench_function("init core with small source", |b| {
        let mut core = Core::new();
        b.iter(|| core.init_from_dast_root(black_box(&dast_root)));
    });

    let dast_root = dast_root_no_position(THOUSAND_STAR);
    c.bench_function("init core with thousand star", |b| {
        let mut core = Core::new();
        b.iter(|| core.init_from_dast_root(black_box(&dast_root)));
    });

    let dast_root = dast_root_no_position(THOUSAND_CHAIN);
    c.bench_function("init core with thousand chain", |b| {
        let mut core = Core::new();
        b.iter(|| core.init_from_dast_root(black_box(&dast_root)));
    });

    let dast_root = dast_root_no_position(THOUSAND_CHAIN_FLIPPED);
    c.bench_function("init core with thousand chain flipped", |b| {
        let mut core = Core::new();
        b.iter(|| core.init_from_dast_root(black_box(&dast_root)));
    });

    let dast_root = dast_root_no_position(REVERSE_THOUSAND_CHAIN);
    c.bench_function("init core with reverse thousand chain", |b| {
        let mut core = Core::new();
        b.iter(|| core.init_from_dast_root(black_box(&dast_root)));
    });

    // Benchmark getting the flat dast from Core
    let dast_root = dast_root_no_position(SMALL_SOURCE);
    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    c.bench_function("get_flat_dast with small source", |b| {
        b.iter(|| core.to_flat_dast());
    });

    let dast_root = dast_root_no_position(THOUSAND_STAR);
    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    c.bench_function("get_flat_dast with thousand star", |b| {
        b.iter(|| core.to_flat_dast());
    });

    let dast_root = dast_root_no_position(THOUSAND_CHAIN);
    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    c.bench_function("get_flat_dast with thousand chain", |b| {
        b.iter(|| core.to_flat_dast());
    });

    let dast_root = dast_root_no_position(THOUSAND_CHAIN_FLIPPED);
    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    c.bench_function("get_flat_dast with thousand chain flipped", |b| {
        b.iter(|| core.to_flat_dast());
    });

    let dast_root = dast_root_no_position(REVERSE_THOUSAND_CHAIN);
    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    c.bench_function("get_flat_dast with reverse thousand chain", |b| {
        b.iter(|| core.to_flat_dast());
    });

    // Benchmark sending an action
    let dast_root = dast_root_no_position(THOUSAND_CHAIN);
    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    core.to_flat_dast();
    c.bench_function("dispatch_action with thousand chain", |b| {
        b.iter(|| {
            core.dispatch_action(Action {
                component_idx: 2,
                action: ActionsEnum::TextInput(TextInputAction::UpdateImmediateValue(ActionBody {
                    args: TextInputActionArgs {
                        text: "test1".to_string(),
                    },
                })),
            })
            .unwrap();
            core.dispatch_action(Action {
                component_idx: 2,
                action: ActionsEnum::TextInput(TextInputAction::UpdateValue),
            })
            .unwrap();

            // We do it again with a different value to make sure the benchmark is not optimized
            core.dispatch_action(Action {
                component_idx: 2,
                action: ActionsEnum::TextInput(TextInputAction::UpdateImmediateValue(ActionBody {
                    args: TextInputActionArgs {
                        text: "test2".to_string(),
                    },
                })),
            })
            .unwrap();
            core.dispatch_action(Action {
                component_idx: 2,
                action: ActionsEnum::TextInput(TextInputAction::UpdateValue),
            })
            .unwrap();
        });
    });
}

//criterion_group!(benches, criterion_benchmark);
//criterion_main!(benches);
criterion_group! {
    name = benches;
    config = Criterion::default().with_profiler(PProfProfiler::new(10000, Output::Protobuf));
    targets = criterion_benchmark
}
criterion_main!(benches);
