# DoenetML Core Rust

This folder contains the Rust implementation of DoenetML Core.

### Benchmarking

To run the benchmarks with `criterion` run
```
cargo bench --features testing -p doenetml-core --bench core_benchmark
```

To run a single benchmark, you can use the `-- <bench name>` syntax. For example,

```
cargo bench --features testing -p doenetml-core --bench core_benchmark -- "get_flat_dast with thousand star"
```

Reports are generated in `target/criterion/report`.

### Profiling

The `pprof` crate allows profiling via `pprof`. You will need [`pprof`](https://github.com/google/pprof)
installed to view the profile output.

To run a specific benchmark and generate a profile report, run

```
cargo bench --features testing -p doenetml-core --bench core_benchmark -- --profile-time 10 "get_flat_dast with thousand star"
```
where `"get_flat_dast with thousand star"` is the name of the benchmark you want to run. A corresponding
`profile.pb` will be created in `target/criterion/<bench name>/profile`. You can view the profile by
running
```
pprof -http=localhost:1234 <profile.pb path>
```