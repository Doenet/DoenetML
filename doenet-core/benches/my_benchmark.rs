use criterion::{black_box, criterion_group, criterion_main, Criterion};

use doenet_core::create_doenet_core;

// Note that these benches are run natively, not on NodeJS and not on the web.
// TBD how helpful these benches are. Note that Criterion runs all the benches many times to 
// warm up, which is not the situation we have in the browser

pub fn criterion_benchmark(c: &mut Criterion) {

    let data = r#"
    ["\n\n",{"componentType":"sequence","props":{"from":"1","to":"10000"},"children":[],"range":{"selfCloseBegin":21,"selfCloseEnd":32}}]
    "#;

    c.bench_function("<sequence> with 10,000 elements", |b| b.iter(|| create_doenet_core(black_box(data))));
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);