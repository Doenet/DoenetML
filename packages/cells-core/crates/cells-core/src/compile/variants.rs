//! A document's variants (ADR 0076): which variants it has, their names
//! and seeds, and, where every load-time choice in it can be counted, the
//! combination of picks each variant index names, as the current core
//! (`utils/variants.ts`, each type's `determineNumberOfUniqueVariants` and
//! `getUniqueVariant`) works them out.
//!
//! Outlining's elements are walked once, right after outlining, as the
//! current core walks its serialized components before it makes any: the
//! *variant components* (a select, a selection from a sequence, a shuffle,
//! a shuffled choice input, a section, a group, a repeat, a sampler, ...)
//! are gathered under the document, each with what it gathers under it,
//! and each counts its unique variants from literal attributes alone. A
//! load picks the document's variant from the requested index
//! ([`Variants::choose`]): its name, its seed, and, with unique variants,
//! the [`Desired`] picks of every variant component, which each build
//! hands down the tree as it expands it.

use crate::compile::*;
use crate::components::VariantDecl;
use crate::program::texts::{letters, letters_number};

/// The most unique variants a document enumerates: past it, as in the
/// current core, its variants draw independently.
const MAX_UNIQUE: f64 = 10_000_000.0;

/// What one variant component picks: a variant index, the picks of a
/// select or a selection (1-based), and what each of its variant
/// components under it picks, as the current core's `desiredVariant`.
#[derive(Debug, Clone, Default, PartialEq)]
pub(crate) struct Desired {
    /// A section's or the document's variant index, from 1.
    pub(crate) index: Option<u64>,
    /// A select's options, a selection's positions in its sequence, a
    /// shuffle's order: each from 1.
    pub(crate) indices: Option<Vec<u64>>,
    /// What each gathered variant component under it picks; for a select,
    /// one per pick, each what the picked option's components pick.
    pub(crate) subvariants: Vec<Desired>,
}

/// The variants a sectioning component with a `<variantControl>`, or the
/// document, has.
#[derive(Debug, Clone, Default)]
pub(crate) struct SectionVariants {
    /// Every variant it may be, by index from 1: `allPossibleVariants`.
    pub(crate) names: Vec<String>,
    /// Every variant name its control names or makes, before any is left
    /// out: `allVariantNames`.
    pub(crate) all_names: Vec<String>,
    /// Each variant's seed, by index.
    pub(crate) seeds: Vec<String>,
    /// Each variant's unique combination, from 1, by index.
    pub(crate) unique_indices: Vec<u64>,
    /// Whether each variant names a combination of picks.
    pub(crate) unique: bool,
}

/// What kind of variant component a node is, and what its count and its
/// picks read.
#[derive(Debug, Clone)]
pub(crate) enum VKind {
    /// A component whose variants are those of the components under it,
    /// combined: a group, an option, a section without a control, a
    /// sampler (which has one).
    Product,
    /// A repeat, or anything else whose components under it are stamped
    /// in scopes the tree does not know: one variant when every component
    /// under it has one, else none to count.
    Opaque,
    /// A `<select>`: its options are its children, each a [`VKind::Product`].
    Select {
        num_to_select: u32,
        with_replacement: bool,
    },
    /// A `<selectFromSequence>`: how many values it may pick, the
    /// positions (from 0) its excludes leave out, in order, and its first
    /// value and step (as numbers, a letter's number for letters).
    Sequence {
        n_options: u64,
        exclude: Vec<u64>,
        from: f64,
        step: f64,
        num_to_select: u32,
        with_replacement: bool,
    },
    /// A `<shuffle>` of `n` components, or a `<choiceInput shuffleOrder>`
    /// of `n` choices of which `shuffled` are shuffled.
    Shuffle { n: u32, shuffled: u32 },
    /// A section with a `<variantControl>`, or the document.
    Section(Box<SectionVariants>),
}

/// One variant component.
#[derive(Debug, Clone)]
pub(crate) struct VNode {
    /// Its element's source node; none for an option.
    pub(crate) node: NodeId,
    /// Its element; an option's is its branch template and no element.
    pub(crate) at: (TemplateId, ElemId),
    pub(crate) kind: VKind,
    /// The variant components it gathers, in document order.
    pub(crate) children: Vec<usize>,
    /// How many unique variants it has; None when they cannot be counted.
    pub(crate) count: Option<f64>,
}

/// The document's variant components and its variants.
#[derive(Debug, Clone, Default)]
pub(crate) struct Variants {
    pub(crate) nodes: Vec<VNode>,
    /// The document's node; None for a document with no root element.
    pub(crate) root: Option<usize>,
    /// Each variant component's node, by its element.
    pub(crate) by_elem: HashMap<(TemplateId, ElemId), usize>,
    /// The samplers whose samples the variant does not determine (no
    /// `variantDeterminesSeed`): they draw from the load's own seed.
    pub(crate) free_draws: HashSet<(TemplateId, ElemId)>,
}

/// The variant a load picked for the document (ADR 0076).
#[derive(Debug, Clone, Default)]
pub struct ChosenVariant {
    /// Its index, from 1.
    pub index: u64,
    /// Its name.
    pub name: String,
    /// Its seed, as written or numbered.
    pub seed: String,
    /// Every variant the document may be.
    pub all_possible: Vec<String>,
    /// Every name its control names or makes.
    pub all_names: Vec<String>,
    /// Its unique combination, from 1, when the document has unique variants.
    pub unique_index: Option<u64>,
    /// What each variant component picks, with unique variants.
    pub(crate) desired: Option<Desired>,
    /// The seed a sampler the variant does not determine draws from: the
    /// load's, from the raw seed and the index as requested, as the
    /// current core draws such samples anew on each load.
    pub sample_seed: u64,
}

impl ChosenVariant {
    /// The document seed its draws take: a hash of its seed's text, so two
    /// variants with one seed draw alike.
    pub fn draw_seed(&self) -> u64 {
        seed_hash(&self.seed)
    }
}

/// The draw seed of a variant seed's text (FNV-1a, which no Rust release
/// or platform changes): a section's or the document's (ADR 0076).
pub(crate) fn seed_hash(seed: &str) -> u64 {
    let h = seed.bytes().fold(0xcbf2_9ce4_8422_2325u64, |h, b| {
        (h ^ b as u64).wrapping_mul(0x0100_0000_01b3)
    });
    h ^ 0x7a71_a47e_5eed_0076
}

impl Variants {
    /// The document's variants; the default (one variant `a`, seed `1`)
    /// for a document without a root.
    pub(crate) fn document(&self) -> SectionVariants {
        match self.root.map(|r| &self.nodes[r].kind) {
            Some(VKind::Section(v)) => (**v).clone(),
            _ => SectionVariants {
                names: vec!["a".into()],
                all_names: vec!["a".into()],
                seeds: vec!["1".into()],
                unique_indices: vec![1],
                unique: false,
            },
        }
    }

    /// The variant `requested` (from 1; any number, as the current core
    /// takes it: rounded, then wrapped into range; not finite is 1) picks.
    pub(crate) fn choose(&self, requested: f64, seed: u64) -> ChosenVariant {
        let doc = self.document();
        let n = doc.names.len().max(1) as i64;
        let index = if requested.is_finite() {
            let r = (requested + 0.5).floor() as i64;
            (r - 1).rem_euclid(n) + 1
        } else {
            1
        } as u64;
        let i = index as usize - 1;
        let unique_index = doc.unique.then(|| doc.unique_indices[i]);
        let desired = match (doc.unique, self.root) {
            (true, Some(r)) => self.unique_of_section(r, &doc, index),
            _ => None,
        };
        ChosenVariant {
            index,
            name: doc.names.get(i).cloned().unwrap_or_default(),
            seed: doc.seeds.get(i).cloned().unwrap_or_default(),
            all_possible: doc.names.clone(),
            all_names: doc.all_names.clone(),
            unique_index,
            desired,
            sample_seed: seed ^ (requested as i64 as u64),
        }
    }

    /// The node of the select or other variant component at `at`.
    pub(crate) fn node_at(&self, at: (TemplateId, ElemId)) -> Option<&VNode> {
        self.by_elem.get(&at).map(|&k| &self.nodes[k])
    }

    /// `getUniqueVariant` of a section or the document with its variants
    /// `v`, at variant `index`.
    fn unique_of_section(&self, k: usize, v: &SectionVariants, index: u64) -> Option<Desired> {
        let unique = *v.unique_indices.get(index as usize - 1)?;
        if !v.unique {
            return Some(Desired {
                index: Some(index),
                ..Desired::default()
            });
        }
        let subvariants = self.unique_of_descendants(k, unique)?;
        Some(Desired {
            index: Some(index),
            subvariants,
            ..Desired::default()
        })
    }

    /// `getVariantsForDescendantsForUniqueVariants`: what each component
    /// node `k` gathers picks at its unique combination `index`.
    fn unique_of_descendants(&self, k: usize, index: u64) -> Option<Vec<Desired>> {
        let kids = &self.nodes[k].children;
        let counts: Option<Vec<u64>> = kids
            .iter()
            .map(|&c| self.nodes[c].count.map(|n| n as u64))
            .collect();
        let counts = counts?;
        let combo = enumerate_combinations(&counts, index as usize)
            .into_iter()
            .nth(index as usize - 1)?;
        kids.iter()
            .zip(combo)
            .map(|(&c, i)| self.unique(c, i + 1))
            .collect()
    }

    /// `getUniqueVariant` of node `k` at its variant `index` (from 1).
    pub(crate) fn unique(&self, k: usize, index: u64) -> Option<Desired> {
        let node = &self.nodes[k];
        let count = node.count? as u64;
        if index < 1 || index > count {
            return None;
        }
        match &node.kind {
            VKind::Section(v) => self.unique_of_section(k, v, index),
            VKind::Product => self.unique_of_product(k, index),
            VKind::Opaque => Some(Desired {
                index: Some(index),
                ..Desired::default()
            }),
            VKind::Sequence {
                n_options,
                exclude,
                num_to_select,
                with_replacement,
                ..
            } => {
                let single = |num: u64| {
                    let mut ind = num;
                    for &x in exclude {
                        if ind >= x {
                            ind += 1;
                        }
                    }
                    ind + 1
                };
                let numbers = if *num_to_select == 1 {
                    vec![index - 1]
                } else {
                    enumerate_selection_combinations(
                        *num_to_select as usize,
                        *n_options,
                        index as usize,
                        *with_replacement,
                        false,
                    )
                    .into_iter()
                    .nth(index as usize - 1)?
                };
                Some(Desired {
                    indices: Some(numbers.into_iter().map(single).collect()),
                    ..Desired::default()
                })
            }
            VKind::Select {
                num_to_select,
                with_replacement,
            } => self.unique_of_select(k, index, *num_to_select, *with_replacement),
            VKind::Shuffle { n: _, shuffled } => {
                let kids = &node.children;
                let mut counts: Vec<u64> = kids
                    .iter()
                    .map(|&c| self.nodes[c].count.map(|n| n as u64))
                    .collect::<Option<_>>()?;
                counts.push(factorial(*shuffled as u64));
                let mut combo = enumerate_combinations(&counts, index as usize)
                    .into_iter()
                    .nth(index as usize - 1)?;
                let perm = combo.pop()? + 1;
                let mut indices = nth_permutation(*shuffled as usize, perm);
                if let VKind::Shuffle { n, shuffled } = node.kind
                    && shuffled < n
                {
                    indices.push(n as u64);
                }
                let mut subvariants = Vec::with_capacity(kids.len());
                let mut nontrivial = false;
                for (&c, i) in kids.iter().zip(combo) {
                    if self.nodes[c].count? > 1.0 {
                        subvariants.push(self.unique(c, i + 1)?);
                        nontrivial = true;
                    } else {
                        subvariants.push(Desired::default());
                    }
                }
                Some(Desired {
                    indices: Some(indices),
                    subvariants: if nontrivial { subvariants } else { Vec::new() },
                    ..Desired::default()
                })
            }
        }
    }

    /// `BaseComponent.getUniqueVariant`.
    fn unique_of_product(&self, k: usize, index: u64) -> Option<Desired> {
        let kids = &self.nodes[k].children;
        let mut subvariants = Vec::with_capacity(kids.len());
        let mut nontrivial = false;
        if !kids.is_empty() {
            let counts: Vec<u64> = kids
                .iter()
                .map(|&c| self.nodes[c].count.map(|n| n as u64))
                .collect::<Option<_>>()?;
            let combo = enumerate_combinations(&counts, index as usize)
                .into_iter()
                .nth(index as usize - 1)?;
            for (&c, i) in kids.iter().zip(combo) {
                if self.nodes[c].count? > 1.0 {
                    subvariants.push(self.unique(c, i + 1)?);
                    nontrivial = true;
                } else {
                    subvariants.push(Desired::default());
                }
            }
        }
        Some(Desired {
            index: Some(index),
            subvariants: if nontrivial { subvariants } else { Vec::new() },
            ..Desired::default()
        })
    }

    /// `Select.getUniqueVariant`: the options chosen, then what each
    /// chosen option's components pick.
    fn unique_of_select(
        &self,
        k: usize,
        index: u64,
        num_to_select: u32,
        with_replacement: bool,
    ) -> Option<Desired> {
        let options = &self.nodes[k].children;
        let by_child: Vec<u64> = options
            .iter()
            .map(|&c| self.nodes[c].count.map(|n| n as u64))
            .collect::<Option<_>>()?;
        if by_child.is_empty() {
            return Some(Desired {
                indices: Some(Vec::new()),
                ..Desired::default()
            });
        }
        let n_children = by_child.len() as u64;
        let combinations: Vec<Vec<u64>> = if num_to_select == 1 {
            (0..n_children).map(|x| vec![x]).collect()
        } else {
            enumerate_selection_combinations(
                num_to_select as usize,
                n_children,
                usize::MAX,
                with_replacement,
                false,
            )
        };
        let possibilities: Vec<u64> = combinations
            .iter()
            .map(|c| c.iter().map(|&x| by_child[x as usize]).product())
            .collect();
        let mut left: Vec<usize> = (0..combinations.len()).collect();
        let mut used = 0u64;
        let mut index_left = index - 1;
        let (chosen, of_chosen) = loop {
            if left.is_empty() {
                return None;
            }
            let min = left.iter().map(|&i| possibilities[i]).min()?;
            let chunk = min - used;
            let n_left = left.len() as u64;
            if index_left < chunk * n_left {
                break (
                    left[(index_left % n_left) as usize],
                    used + index_left / n_left + 1,
                );
            }
            used += chunk;
            index_left -= chunk * n_left;
            left.retain(|&i| possibilities[i] > used);
        };
        let combination = &combinations[chosen];
        let counts: Vec<u64> = combination.iter().map(|&x| by_child[x as usize]).collect();
        let each = enumerate_combinations(&counts, of_chosen as usize)
            .into_iter()
            .nth(of_chosen as usize - 1)?;
        let mut subvariants = Vec::with_capacity(combination.len());
        let mut nontrivial = false;
        for (&child, i) in combination.iter().zip(each) {
            if by_child[child as usize] > 1 {
                subvariants.push(self.unique(options[child as usize], i + 1)?);
                nontrivial = true;
            } else {
                subvariants.push(Desired::default());
            }
        }
        Some(Desired {
            indices: Some(combination.iter().map(|x| x + 1).collect()),
            subvariants: if nontrivial { subvariants } else { Vec::new() },
            ..Desired::default()
        })
    }
}

/// splitmix64, the stream the shuffle of unique combinations draws from.
fn splitmix(x: u64) -> u64 {
    let mut z = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    z ^ (z >> 31)
}

fn factorial(n: u64) -> u64 {
    (2..=n).product::<u64>().max(1)
}

/// The `index`-th (from 1) permutation of `1..=n` in the order the current
/// core's `enumeratePermutations` lists them: lexicographic.
pub(crate) fn nth_permutation(n: usize, index: u64) -> Vec<u64> {
    let mut left: Vec<u64> = (1..=n as u64).collect();
    let mut k = index - 1;
    let mut out = Vec::with_capacity(n);
    for i in (0..n).rev() {
        let f = factorial(i as u64);
        let j = (k / f) as usize;
        k %= f;
        out.push(left.remove(j.min(left.len() - 1)));
    }
    out
}

fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

fn lcm(a: u64, b: u64) -> u64 {
    if a == 0 || b == 0 {
        0
    } else {
        a / gcd(a, b) * b
    }
}

/// The current core's `enumerateSelectionCombinations`: the combinations
/// of `n_indices` picks among `n_options` (each from 0), with or without
/// replacement, the ones of distinct picks first; at most `max`.
pub(crate) fn enumerate_selection_combinations(
    n_indices: usize,
    n_options: u64,
    max: usize,
    with_replacement: bool,
    skip_zero: bool,
) -> Vec<Vec<u64>> {
    if n_indices == 1 {
        let mut options: Vec<u64> = (1..n_options).collect();
        if !skip_zero {
            options.push(0);
        }
        options.truncate(max);
        return options.into_iter().map(|x| vec![x]).collect();
    }
    let offsets = enumerate_selection_combinations(
        n_indices - 1,
        n_options,
        max,
        with_replacement,
        !with_replacement,
    );
    let mut results = Vec::new();
    for offs in offsets {
        for ind0 in 1..=n_options {
            let mut combination = Vec::with_capacity(n_indices);
            combination.push(ind0 % n_options);
            combination.extend(offs.iter().map(|x| (ind0 + x) % n_options));
            if skip_zero && combination.contains(&0) {
                continue;
            }
            results.push(combination);
            if results.len() >= max {
                return results;
            }
        }
    }
    results
}

/// The current core's `enumerateCombinations`: an index into each of
/// `options` (from 0), every combination once, cycling every index as
/// soon as it can; at most `max`.
pub(crate) fn enumerate_combinations(options: &[u64], max: usize) -> Vec<Vec<u64>> {
    let n = options.len();
    if n == 0 {
        return Vec::new();
    }
    let mut max_gcd = 1;
    for i in 0..n {
        for j in 0..i {
            max_gcd = max_gcd.max(gcd(options[i], options[j]));
        }
    }
    if max_gcd == 1 {
        let total = options
            .iter()
            .try_fold(1u64, |a, &c| a.checked_mul(c))
            .unwrap_or(u64::MAX)
            .min(max as u64);
        return (0..total)
            .map(|ind| options.iter().map(|&x| ind % x).collect())
            .collect();
    }
    if n == 2 {
        let l = lcm(options[0], options[1]);
        let mut results = Vec::new();
        for offset in 0..max_gcd {
            for ind in 0..l {
                results.push(vec![ind % options[0], (ind + offset) % options[1]]);
                if results.len() >= max {
                    return results;
                }
            }
        }
        return results;
    }
    // Combine the first pair, of a gcd over 1, with the least lcm.
    let mut best: Option<(u64, usize, usize)> = None;
    for i in 0..n {
        for j in 0..i {
            if gcd(options[i], options[j]) > 1 {
                let l = lcm(options[i], options[j]);
                if best.is_none_or(|b| l < b.0) {
                    best = Some((l, j, i));
                }
            }
        }
    }
    // The current core takes the first pair, in the order it scans, with
    // the least lcm: row by row, lowest column first.
    let (min_lcm, _, _) = best.expect("a pair of gcd over 1");
    let (a, b) = (0..n)
        .flat_map(|i| (0..i).map(move |j| (j, i)))
        .find(|&(j, i)| gcd(options[i], options[j]) > 1 && lcm(options[i], options[j]) == min_lcm)
        .expect("the pair found");
    let (n0, n1) = (options[a], options[b]);
    let mut outer = options.to_vec();
    outer[a] = n0 * n1;
    outer.remove(b);
    let mut outer_result = enumerate_combinations(&outer, max);
    let inner = enumerate_combinations(&[n0, n1], max);
    for r in &mut outer_result {
        let ires = &inner[r[a] as usize];
        let (i0, i1) = (ires[0], ires[1]);
        r[a] = i0;
        r.insert(b, i1);
    }
    outer_result
}

/// `countOptions`: the picks of `n_items` of `by_item` without
/// replacement, in every order, each weighted by its options.
fn count_options(by_item: &[f64], n_items: u32) -> f64 {
    if n_items == 0 {
        return 0.0;
    }
    if n_items == 1 {
        return by_item.iter().sum();
    }
    let mut total = 0.0;
    for i in 0..by_item.len() {
        let mut rest = by_item.to_vec();
        rest.remove(i);
        total += by_item[i] * count_options(&rest, n_items - 1);
    }
    total
}

/// The analysis: outlining's elements read with the source's literal
/// attributes.
struct Analysis<'a> {
    rd: Reader<'a>,
    settled: &'a Settled,
    out: Variants,
}

/// The document's variants, from outlining's elements. Reads (and so
/// accepts) every `<variantControl>`'s attributes.
pub(in crate::compile) fn analyze(dast: &Dast, settled: &Settled) -> Variants {
    let mut a = Analysis {
        rd: Reader::new(dast, settled),
        settled,
        out: Variants::default(),
    };
    let t0 = TemplateId::new(0);
    // Every control's attributes are read, wherever it sits.
    for tpl in &settled.templates {
        for el in &tpl.elems {
            if el.component_type.creates_variants() == Some(VariantDecl::Control) {
                let _ = a.control(el.node);
            }
        }
    }
    let root = settled.templates[0].children.iter().find_map(|c| match c {
        Child::Elem(e) => Some(*e),
        _ => None,
    });
    if let Some(r) = root {
        let k = a
            .section(t0, r)
            .expect("the document is a variant component");
        a.out.root = Some(k);
    }
    a.out
}

/// A `<variantControl>`'s attributes, as written.
#[derive(Debug, Default)]
struct Control {
    num_variants: Option<f64>,
    variant_names: Option<Vec<String>>,
    seeds: Option<Vec<String>>,
    include: Option<Vec<String>>,
    exclude: Option<Vec<String>>,
    unique: Option<bool>,
}

impl<'a> Analysis<'a> {
    fn elem(&self, t: TemplateId, e: ElemId) -> &'a Elem {
        &self.settled.templates[t.index()].elems[e.index()]
    }

    fn push(&mut self, mut node: VNode) -> usize {
        let k = self.out.nodes.len();
        if node.at.1 != ElemId::NONE {
            self.out.by_elem.insert(node.at, k);
            node.node = self.elem(node.at.0, node.at.1).node;
        }
        self.out.nodes.push(node);
        k
    }

    /// The words of attribute `name` of `n`, read; None when absent or not
    /// literal.
    fn words(&self, n: NodeId, name: &str) -> Option<Vec<String>> {
        let a = self.rd.dast.attr(n, name)?;
        let text = self.rd.attr_text(a)?;
        Some(text.split_whitespace().map(str::to_string).collect())
    }

    fn control(&self, n: NodeId) -> Control {
        let d = self.rd.dast;
        let num_variants = d
            .attr(n, "numVariants")
            .and_then(|a| self.rd.attr_text(a))
            .and_then(|t| t.trim().parse::<f64>().ok());
        let unique = d.attr(n, "uniqueVariants").map(|a| {
            let text = self.rd.attr_text(a).unwrap_or_default();
            let text = text.trim();
            text.is_empty() || text.eq_ignore_ascii_case("true")
        });
        let lower = |v: Vec<String>| v.into_iter().map(|s| s.to_lowercase()).collect();
        Control {
            num_variants,
            variant_names: self.words(n, "variantNames").map(lower),
            seeds: self.words(n, "seeds"),
            include: self.words(n, "variantsToInclude").map(lower),
            exclude: self.words(n, "variantsToExclude").map(lower),
            unique,
        }
    }

    /// The `<variantControl>` child of element `(t, e)`, if any.
    fn control_child(&self, t: TemplateId, e: ElemId) -> Option<NodeId> {
        self.elem(t, e).children.iter().find_map(|c| match c {
            Child::Elem(k) if self.is(t, *k, VariantDecl::Control) => Some(self.elem(t, *k).node),
            _ => None,
        })
    }

    /// `gatherVariantComponents` over `children` of template `t`.
    fn gather(&mut self, t: TemplateId, children: &[Child]) -> Vec<usize> {
        let mut out = Vec::new();
        for c in children {
            let Child::Elem(e) = *c else { continue };
            if let Some(k) = self.component(t, e) {
                out.push(k);
                continue;
            }
            let el = self.elem(t, e);
            // A code editor's content is another document's.
            if el.node != NodeId::NONE && self.rd.dast.str(el.node) == "codeEditor" {
                continue;
            }
            match &el.body {
                Body::Repeat { template } => {
                    let template = *template;
                    let kids = self.settled.templates[template.index()].children.clone();
                    let under = self.gather(template, &kids);
                    if !under.is_empty() {
                        let k = self.opaque((t, e), under);
                        out.push(k);
                    }
                }
                _ => {
                    let kids = el.children.clone();
                    out.extend(self.gather(t, &kids));
                }
            }
        }
        out
    }

    /// A node of kind `Opaque` over `under`.
    fn opaque(&mut self, at: (TemplateId, ElemId), under: Vec<usize>) -> usize {
        let one = under.iter().all(|&k| self.out.nodes[k].count == Some(1.0));
        self.push(VNode {
            node: NodeId::NONE,
            at,
            kind: VKind::Opaque,
            children: Vec::new(),
            count: one.then_some(1.0),
        })
    }

    /// A product node over `children`, counted.
    fn product(&mut self, at: (TemplateId, ElemId), children: Vec<usize>) -> usize {
        let count = children
            .iter()
            .try_fold(1.0, |a, &k| self.out.nodes[k].count.map(|c| a * c))
            .filter(|&n| n > 0.0);
        self.push(VNode {
            node: NodeId::NONE,
            at,
            kind: VKind::Product,
            children,
            count,
        })
    }

    /// Element `(t, e)` as a variant component, if its type makes one.
    fn component(&mut self, t: TemplateId, e: ElemId) -> Option<usize> {
        let el = self.elem(t, e);
        let n = el.node;
        // An element the compile made (an answer's input) is none.
        if n == NodeId::NONE {
            return None;
        }
        let d = self.rd.dast;
        use VariantDecl as V;
        // What its type is to the variants: its definition says (ADR 0038).
        let Some(decl) = el.component_type.creates_variants() else {
            // An element with a control is a variant component, of the
            // variants under it.
            self.control_child(t, e)?;
            let kids = el.children.clone();
            let under = self.gather(t, &kids);
            return Some(self.product((t, e), under));
        };
        Some(match decl {
            V::Select => {
                let Body::Choice(cid) = el.body else {
                    return Some(self.push(VNode {
                        node: NodeId::NONE,
                        at: (t, e),
                        kind: VKind::Product,
                        children: Vec::new(),
                        count: None,
                    }));
                };
                self.select(t, e, cid)
            }
            V::Repeat => {
                let under = match el.body {
                    Body::Repeat { template } => {
                        let kids = self.settled.templates[template.index()].children.clone();
                        self.gather(template, &kids)
                    }
                    Body::Choice(cid) => {
                        let mut under = Vec::new();
                        for &b in &self.settled.choices[cid.index()].branches {
                            let kids = self.settled.templates[b.index()].children.clone();
                            under.extend(self.gather(b, &kids));
                        }
                        under
                    }
                    _ => Vec::new(),
                };
                self.opaque((t, e), under)
            }
            V::Sequence => self.sequence(t, e),
            V::Uncounted => self.push(VNode {
                node: NodeId::NONE,
                at: (t, e),
                kind: VKind::Product,
                children: Vec::new(),
                count: None,
            }),
            V::Sampler => {
                // Every sample is the variant's in this core: whether the
                // variant determines it decides only how many variants
                // there are, which is where it is read.
                let seeded = d.attr(n, "variantDeterminesSeed").is_some_and(|a| {
                    let text = self.rd.attr_text(a).unwrap_or_default();
                    let text = text.trim().to_string();
                    text.is_empty() || text.eq_ignore_ascii_case("true")
                });
                if !seeded {
                    self.out.free_draws.insert((t, e));
                }
                self.push(VNode {
                    node: NodeId::NONE,
                    at: (t, e),
                    kind: VKind::Product,
                    children: Vec::new(),
                    count: (!seeded).then_some(1.0),
                })
            }
            V::Shuffle => {
                let kids = el.children.clone();
                // Each child one component: not a list, nor anything that
                // stands for components (a reference, a repeat, a select),
                // which the current core cannot count either.
                let one = |c: &Child| match c {
                    Child::Elem(k) => {
                        let ty = self.elem(t, *k).component_type;
                        ty.list().is_none() && ty.structure_kind().is_none()
                    }
                    Child::Text(s) => d.strings.get(*s).trim().is_empty(),
                    Child::Macro(_) => false,
                };
                let simple = kids.iter().all(one);
                let n_comps = kids.iter().filter(|c| matches!(c, Child::Elem(_))).count() as u32;
                let under = self.gather(t, &kids);
                self.shuffle((t, e), under, simple.then_some((n_comps, n_comps)))
            }
            V::ChoiceInput => {
                let kids = el.children.clone();
                let shuffle = self.rd.attr_flag(n, "shuffleOrder");
                let under = self.gather(t, &kids);
                if !shuffle {
                    return Some(self.product((t, e), under));
                }
                let n_choices = kids
                    .iter()
                    .filter(|c| matches!(c, Child::Elem(k) if self.is(t, *k, V::Choice)))
                    .count() as u32;
                let simple = kids.iter().all(|c| match c {
                    Child::Elem(k) => self.is(t, *k, V::Choice),
                    Child::Text(s) => d.strings.get(*s).trim().is_empty(),
                    Child::Macro(_) => false,
                });
                let shuffled = if self.rd.attr_flag(n, "preserveLastChoice") {
                    n_choices.saturating_sub(1).max(1)
                } else {
                    n_choices
                };
                self.shuffle((t, e), under, simple.then_some((n_choices, shuffled)))
            }
            V::Section | V::Document => self.section(t, e)?,
            V::Product => {
                let kids = el.children.clone();
                let under = self.gather(t, &kids);
                self.product((t, e), under)
            }
            // Read where they sit, no variant component.
            V::Control | V::Choice => return None,
        })
    }

    /// Whether the element at `(t, e)` is `decl` to the variants.
    fn is(&self, t: TemplateId, e: ElemId, decl: VariantDecl) -> bool {
        self.elem(t, e).component_type.creates_variants() == Some(decl)
    }

    /// A shuffle of `n` components, `shuffled` of them shuffled, with the
    /// components `under` it.
    fn shuffle(
        &mut self,
        at: (TemplateId, ElemId),
        under: Vec<usize>,
        n: Option<(u32, u32)>,
    ) -> usize {
        let product = under
            .iter()
            .try_fold(1.0, |a, &k| self.out.nodes[k].count.map(|c| a * c));
        let count = match (n, product) {
            (Some((_, s)), Some(p)) => Some(p * factorial(s as u64) as f64).filter(|&v| v > 0.0),
            _ => None,
        };
        let (n, shuffled) = n.unwrap_or((0, 0));
        self.push(VNode {
            node: NodeId::NONE,
            at,
            kind: VKind::Shuffle { n, shuffled },
            children: under,
            count,
        })
    }

    /// A select: one product node per option.
    fn select(&mut self, t: TemplateId, e: ElemId, cid: ChoiceId) -> usize {
        let def = &self.settled.choices[cid.index()];
        let n = self.elem(t, e).node;
        let d = self.rd.dast;
        let branches = def.branches.clone();
        let weighted = def.weights.iter().any(|&w| w != 1.0) || !def.for_variants.is_empty();
        // Literal `numToSelect` and `withReplacement` only.
        let num = match d.attr_peek(n, "numToSelect") {
            None => Some(1.0),
            Some(a) => self
                .rd
                .attr_text(a)
                .and_then(|t| t.trim().parse::<f64>().ok())
                .filter(|v| *v >= 0.0 && v.fract() == 0.0),
        };
        let with_replacement = match d.attr_peek(n, "withReplacement") {
            None => Some(false),
            Some(a) => self.rd.attr_text(a).and_then(|t| {
                let t = t.trim().to_lowercase();
                match t.as_str() {
                    "" | "true" => Some(true),
                    "false" => Some(false),
                    _ => None,
                }
            }),
        };
        let mut options = Vec::with_capacity(branches.len());
        for &b in &branches {
            let kids = self.settled.templates[b.index()].children.clone();
            let under = self.gather(b, &kids);
            options.push(self.product((b, ElemId::NONE), under));
        }
        let by_child: Option<Vec<f64>> = options.iter().map(|&k| self.out.nodes[k].count).collect();
        let count = match (num, with_replacement, by_child, weighted) {
            (Some(num), Some(repl), Some(by_child), false) => {
                let num = num as u32;
                if by_child.is_empty() {
                    Some(1.0)
                } else if repl || num == 1 {
                    Some(by_child.iter().sum::<f64>().powi(num as i32))
                } else if num as usize > by_child.len() {
                    None
                } else if by_child.iter().all(|&x| x == by_child[0]) {
                    let n_children = by_child.len();
                    let perms: f64 = (n_children + 1 - num as usize..=n_children)
                        .map(|x| x as f64)
                        .product();
                    Some(perms * by_child[0].powi(num as i32))
                } else {
                    Some(count_options(&by_child, num))
                }
            }
            _ => None,
        }
        .filter(|&v| v > 0.0);
        self.push(VNode {
            node: NodeId::NONE,
            at: (t, e),
            kind: VKind::Select {
                num_to_select: num.unwrap_or(1.0) as u32,
                with_replacement: with_replacement.unwrap_or(false),
            },
            children: options,
            count,
        })
    }

    /// A selection from a sequence, its parameters literal.
    fn sequence(&mut self, t: TemplateId, e: ElemId) -> usize {
        let counted = self.sequence_count(self.elem(t, e).node);
        let (kind, count) = match counted {
            Some((n_options, exclude, num_to_select, with_replacement, from, step)) => {
                let left = (n_options - exclude.len() as u64) as f64;
                let count = if with_replacement || num_to_select == 1 {
                    left.powi(num_to_select as i32)
                } else {
                    (0..num_to_select).map(|i| left - i as f64).product()
                };
                (
                    VKind::Sequence {
                        n_options: left as u64,
                        exclude,
                        from,
                        step,
                        num_to_select,
                        with_replacement,
                    },
                    Some(count).filter(|&v| v > 0.0),
                )
            }
            None => (VKind::Product, None),
        };
        self.push(VNode {
            node: NodeId::NONE,
            at: (t, e),
            kind,
            children: Vec::new(),
            count,
        })
    }

    /// A selection's (length, excluded positions, numToSelect,
    /// withReplacement), from literal attributes as the current core reads
    /// them; None when it cannot tell.
    #[allow(clippy::type_complexity)]
    fn sequence_count(&self, n: NodeId) -> Option<(u64, Vec<u64>, u32, bool, f64, f64)> {
        let d = self.rd.dast;
        let text = |name: &str| -> Option<Option<String>> {
            match d.attr_peek(n, name) {
                None => Some(None),
                Some(a) => self.rd.attr_text(a).map(|t| Some(t.trim().to_string())),
            }
        };
        let kind = text("type")?.map(|s| s.to_lowercase());
        let letters_type = match kind.as_deref() {
            None | Some("number") => false,
            Some("letters") => true,
            _ => return None,
        };
        let num = match text("numToSelect")? {
            None => 1.0,
            Some(s) => s
                .parse::<f64>()
                .ok()
                .filter(|v| *v >= 0.0 && v.fract() == 0.0)?,
        } as u32;
        let with_replacement = match text("withReplacement")?.map(|s| s.to_lowercase()) {
            None => false,
            Some(s) if s.is_empty() || s == "true" => true,
            Some(s) if s == "false" => false,
            Some(_) => return None,
        };
        if d.attr_peek(n, "excludeCombinations").is_some() {
            return None;
        }
        let value = |s: &str| -> Option<f64> {
            if letters_type {
                letters_number(s)
            } else {
                s.parse::<f64>().ok().filter(|v| v.is_finite())
            }
        };
        let from = text("from")?
            .map(|s| value(&s))
            .map_or(Some(None), |v| v.map(Some))?;
        let to = text("to")?
            .map(|s| value(&s))
            .map_or(Some(None), |v| v.map(Some))?;
        let step = text("step")?
            .map(|s| s.parse::<f64>().ok().filter(|v| v.is_finite()))
            .map_or(Some(None), |v| v.map(Some))?;
        let length = text("length")?
            .map(|s| s.parse::<f64>().ok().filter(|v| v.fract() == 0.0))
            .map_or(Some(None), |v| v.map(Some))?;
        if letters_type && step.is_some_and(|s| s.fract() != 0.0) {
            return None;
        }
        // The current core's sort, when given, must be literal, and of one
        // pick only.
        if let Some(sort) = text("sort")?
            && sort.to_lowercase() != "unsorted"
            && num > 1
        {
            return None;
        }
        let (from, step, length) =
            crate::program::sequence_parameters(from, to, step, length.map(|l| l.max(0.0)))?;
        if !(length.is_finite() && length >= 0.0) {
            return None;
        }
        let mut exclude: Vec<u64> = Vec::new();
        if let Some(words) = text("exclude")? {
            let mut xs: Vec<f64> = words.split_whitespace().map(value).collect::<Option<_>>()?;
            xs.sort_by(f64::total_cmp);
            xs.dedup();
            for x in xs {
                if x < from {
                    continue;
                }
                let ind = (x - from) / step;
                if ind > length - 1.0 + 1e-10 {
                    break;
                }
                if (ind - ind.round()).abs() < 1e-10 {
                    exclude.push(ind.round() as u64);
                }
            }
        }
        if length as u64 <= exclude.len() as u64 {
            return None;
        }
        Some((length as u64, exclude, num, with_replacement, from, step))
    }

    /// The document, or a section: `getNumVariants` and
    /// `determineVariantsForSection`. None for a section without a
    /// control that is to be gathered as a product, which it returns as
    /// that.
    fn section(&mut self, t: TemplateId, e: ElemId) -> Option<usize> {
        let el = self.elem(t, e);
        let is_document = el.component_type.creates_variants() == Some(VariantDecl::Document);
        let control = self.control_child(t, e);
        let kids = el.children.clone();
        if control.is_none() && !is_document {
            let under = self.gather(t, &kids);
            return Some(self.product((t, e), under));
        }
        if control.is_none() && is_document {
            // A document whose one child is a section with a control takes
            // that section's variants.
            let non_blank: Vec<&Child> = kids
                .iter()
                .filter(|c| match c {
                    Child::Text(s) => !self.rd.dast.strings.get(*s).trim().is_empty(),
                    _ => true,
                })
                .collect();
            if let [Child::Elem(s)] = non_blank.as_slice()
                && self.is(t, *s, VariantDecl::Section)
                && self.control_child(t, *s).is_some()
            {
                let s = *s;
                let under = self.gather(t, &kids);
                let inner =
                    self.out
                        .by_elem
                        .get(&(t, s))
                        .and_then(|&k| match &self.out.nodes[k].kind {
                            VKind::Section(v) => Some((**v).clone()),
                            _ => None,
                        });
                if let Some(v) = inner {
                    let n = v.names.len();
                    let variants = SectionVariants {
                        names: v.names,
                        all_names: v.all_names,
                        seeds: (1..=n).map(|i| i.to_string()).collect(),
                        unique_indices: (1..=n as u64).collect(),
                        unique: true,
                    };
                    return Some(self.push(VNode {
                        node: NodeId::NONE,
                        at: (t, e),
                        kind: VKind::Section(Box::new(variants)),
                        children: under,
                        count: Some(n as f64),
                    }));
                }
            }
        }
        let control = control.map(|c| self.control(c)).unwrap_or_default();
        let under = self.gather(t, &kids);
        let product = under
            .iter()
            .try_fold(1.0, |a, &k| self.out.nodes[k].count.map(|c| a * c))
            .filter(|&n| n > 0.0);
        let variants = section_variants(&control, product);
        let count = Some(variants.names.len() as f64);
        Some(self.push(VNode {
            node: NodeId::NONE,
            at: (t, e),
            kind: VKind::Section(Box::new(variants)),
            children: under,
            count,
        }))
    }
}

/// `determineVariantsForSection` from a control's attributes and the
/// unique combinations of what the section gathers (None: not counted).
fn section_variants(control: &Control, product: Option<f64>) -> SectionVariants {
    let specified_names = control.variant_names.clone().unwrap_or_default();
    let mut specified_unique = specified_names.clone();
    specified_unique.sort();
    specified_unique.dedup();
    let num_specified = control
        .num_variants
        .filter(|v| v.is_finite())
        .map_or(100.0, |v| (v + 0.5).floor())
        .clamp(1.0, 1000.0) as usize;
    let mut names = specified_names.clone();
    if names.len() < num_specified {
        let mut value = names.len() as u64;
        while names.len() < num_specified {
            value += 1;
            let mut s = letters(value, true);
            while specified_names.contains(&s) {
                value += 1;
                s = letters(value, true);
            }
            names.push(s);
        }
    } else {
        names.truncate(num_specified);
    }
    let exclude = control.exclude.clone().unwrap_or_default();
    let include: Vec<String> = match &control.include {
        Some(inc) if !inc.is_empty() => {
            let mut seen = Vec::new();
            for v in inc {
                if !seen.contains(v) && names.contains(v) {
                    seen.push(v.clone());
                }
            }
            seen.into_iter().filter(|x| !exclude.contains(x)).collect()
        }
        _ => names
            .iter()
            .filter(|x| !exclude.contains(x))
            .cloned()
            .collect(),
    };
    let mut seeds = control.seeds.clone().unwrap_or_default();
    if seeds.len() < num_specified {
        seeds = (1..=num_specified).map(|i| i.to_string()).collect();
    } else {
        seeds.truncate(num_specified);
    }
    // (variant, index from 1, seed)
    let mut chosen: Vec<(String, u64, String)> = include
        .into_iter()
        .map(|v| {
            let index = names.iter().position(|x| *x == v).expect("a name") as u64 + 1;
            let seed = seeds[index as usize - 1].clone();
            (v, index, seed)
        })
        .collect();
    let unique = match (control.unique, product) {
        (Some(false), _) => None,
        (_, Some(n)) if n > 0.0 && n <= MAX_UNIQUE => Some(n as u64),
        _ => None,
    };
    let mut out = SectionVariants {
        all_names: names.clone(),
        ..Default::default()
    };
    match unique {
        Some(n_unique) => {
            chosen.retain(|c| c.1 <= n_unique);
            let max_index = chosen.iter().map(|c| c.1).max().unwrap_or(0);
            let shuffled = unique_order(n_unique, max_index);
            for (v, index, seed) in chosen {
                out.unique_indices.push(shuffled[index as usize - 1]);
                out.names.push(v);
                out.seeds.push(seed);
            }
            out.unique = true;
        }
        None => {
            for (v, index, seed) in chosen {
                out.unique_indices.push(index);
                out.names.push(v);
                out.seeds.push(seed);
            }
        }
    }
    if out.names.is_empty() {
        // No variant left: the first, as a document must have one.
        out.names.push(names[0].clone());
        out.seeds.push(seeds[0].clone());
        out.unique_indices.push(1);
    }
    out
}

/// The first `max_index` of the unique combinations `1..=n`, shuffled: a
/// partial Fisher and Yates over a fixed stream, so a document asking for
/// more variants keeps the ones it had (ADR 0076). The current core
/// shuffles with its own generator (`seedrandom.alea("0")`), so a variant
/// index names another combination there.
fn unique_order(n: u64, max_index: u64) -> Vec<u64> {
    let mut picked: HashMap<u64, u64> = HashMap::new();
    let mut out = Vec::with_capacity(max_index as usize);
    let mut h: u64 = 0x0076_5eed_0000_0000;
    for i in 0..max_index.min(n) {
        h = splitmix(h);
        let rand = (h >> 11) as f64 / (1u64 << 53) as f64;
        let j = i + ((rand * (n - i) as f64) as u64).min(n - i - 1);
        let at_i = *picked.get(&i).unwrap_or(&(i + 1));
        let at_j = *picked.get(&j).unwrap_or(&(j + 1));
        picked.insert(i, at_j);
        picked.insert(j, at_i);
        out.push(at_j);
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn combinations_cycle_every_index() {
        // Coprime counts step together.
        assert_eq!(
            enumerate_combinations(&[2, 3], 6),
            vec![
                vec![0, 0],
                vec![1, 1],
                vec![0, 2],
                vec![1, 0],
                vec![0, 1],
                vec![1, 2]
            ]
        );
        // A shared factor shifts the second after each lcm.
        let all = enumerate_combinations(&[3, 3], 9);
        assert_eq!(all.len(), 9);
        assert_eq!(all[3], vec![0, 1]);
        // Three counts with a shared factor: every combination once.
        let mut three = enumerate_combinations(&[2, 2, 2], 100);
        assert_eq!(three.len(), 8);
        three.sort();
        three.dedup();
        assert_eq!(three.len(), 8);
    }

    #[test]
    fn selections_without_replacement_are_distinct() {
        let all = enumerate_selection_combinations(3, 4, usize::MAX, false, false);
        assert_eq!(all.len(), 24);
        for c in &all {
            let mut d = c.clone();
            d.sort();
            d.dedup();
            assert_eq!(d.len(), 3);
        }
        let with = enumerate_selection_combinations(2, 3, usize::MAX, true, false);
        assert_eq!(with.len(), 9);
    }

    #[test]
    fn permutations_are_lexicographic() {
        assert_eq!(nth_permutation(3, 1), vec![1, 2, 3]);
        assert_eq!(nth_permutation(3, 2), vec![1, 3, 2]);
        assert_eq!(nth_permutation(3, 6), vec![3, 2, 1]);
    }

    #[test]
    fn more_variants_keep_the_first_ones() {
        let four = unique_order(100, 4);
        let six = unique_order(100, 6);
        assert_eq!(four, six[..4]);
        let mut all = unique_order(6, 6);
        all.sort();
        assert_eq!(all, vec![1, 2, 3, 4, 5, 6]);
    }

    #[test]
    fn a_control_names_and_numbers_its_variants() {
        let v = section_variants(
            &Control {
                num_variants: Some(3.5),
                ..Default::default()
            },
            None,
        );
        assert_eq!(v.names, vec!["a", "b", "c", "d"]);
        assert_eq!(v.seeds, vec!["1", "2", "3", "4"]);
        let v = section_variants(&Control::default(), Some(6.0));
        assert_eq!(v.names.len(), 6);
        assert!(v.unique);
    }
}
