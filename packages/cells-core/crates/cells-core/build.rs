//! The release id (ADR 0017, step 6): the crate version and the source
//! revision, so saved state names the core that made it. A platform build
//! may set it outright with `CELLS_CORE_RELEASE`; a tree with uncommitted
//! changes is marked `.dirty`, since its revision is not its source; with
//! no revision known it is the version and `unknown`.

use std::process::Command;

fn git(args: &[&str]) -> Option<String> {
    let out = Command::new("git").args(args).output().ok()?;
    out.status
        .success()
        .then(|| String::from_utf8_lossy(&out.stdout).trim().to_string())
}

fn main() {
    println!("cargo:rerun-if-env-changed=CELLS_CORE_RELEASE");
    // A change to the source or the locked dependencies, or a new commit,
    // is a new release.
    println!("cargo:rerun-if-changed=src");
    println!("cargo:rerun-if-changed=../../Cargo.lock");
    if let Some(dir) = git(&["rev-parse", "--git-dir"]) {
        println!("cargo:rerun-if-changed={dir}/HEAD");
        println!("cargo:rerun-if-changed={dir}/index");
    }
    let release = std::env::var("CELLS_CORE_RELEASE").unwrap_or_else(|_| {
        let version = env!("CARGO_PKG_VERSION");
        match git(&["rev-parse", "HEAD"]) {
            Some(rev) => {
                let dirty = git(&["status", "--porcelain", "--", ".", "../../Cargo.lock"])
                    .is_some_and(|s| !s.is_empty());
                format!("{version}+{rev}{}", if dirty { ".dirty" } else { "" })
            }
            None => format!("{version}+unknown"),
        }
    });
    println!("cargo:rustc-env=CELLS_CORE_RELEASE={release}");
}
