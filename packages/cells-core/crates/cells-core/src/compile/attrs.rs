//! Attributes and math: each prop's source from a literal, a reference, an
//! `<op>`, or math text, and the helpers that read attribute text.

use super::*;
use crate::components::prop::{math_input, section, text, text_input};

impl<'a> Compiler<'a> {
    /// Plans for a type described by `PropFrom`: attributes, bindings,
    /// computed chains, children.
    pub(in crate::compile) fn plan_attrs(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
    ) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        // Without an attribute a prop is the type's default, or under
        // `extend` the referent's prop.
        let default = |v: f64| {
            if extend.is_some() {
                SourcePlan::Inherit
            } else {
                SourcePlan::Default(v)
            }
        };
        let mut props: Vec<Option<SourcePlan>> = vec![None; component_type.prop_defs().len()];
        for (pi, def) in component_type.prop_defs().iter().enumerate() {
            let bound = match def.bind.and_then(|b| d.attr(el, b)) {
                Some(a) => {
                    let bind = def.bind.unwrap();
                    let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                        attr: bind.into(),
                        text: self.attr_text(a).unwrap_or_default(),
                    })?;
                    Some(SourcePlan::reference(self.plan_ref(t, scope, m)?))
                }
                None => None,
            };
            let plan = match (bound, def.from) {
                (Some(p), _) => p,
                (None, PropFrom::Attribute) => match d.attr(el, def.attr_name()) {
                    Some(a) => self.plan_value(
                        t,
                        scope,
                        def.attr_name(),
                        d.attr_children(a),
                        def.ref_prop,
                    )?,
                    None => default(def.default),
                },
                (None, PropFrom::AttributeOr { alias }) => match d.attr(el, def.attr_name()) {
                    Some(a) => {
                        self.plan_value(t, scope, def.attr_name(), d.attr_children(a), None)?
                    }
                    None => SourcePlan::own(alias as usize),
                },
                (None, PropFrom::Computed { op, args }) => SourcePlan::from_def(op, &args),
                (None, PropFrom::Children) => {
                    let blank = d.children(el).iter().all(|&n| self.is_blank(n));
                    // A mathInput's `prefill` stands in for blank children.
                    let from_attr = def.attr.and_then(|a| d.attr(el, a));
                    if blank {
                        match from_attr {
                            Some(a) => {
                                match self.plan_value(
                                    t,
                                    scope,
                                    def.attr_name(),
                                    d.attr_children(a),
                                    None,
                                ) {
                                    Ok(p) => p,
                                    Err(Error::BadValue { .. }) => SourcePlan::Math(
                                        self.plan_math(t, scope, d.attr_children(a))?,
                                    ),
                                    Err(e) => return Err(e),
                                }
                            }
                            None => default(def.default),
                        }
                    } else {
                        match self.plan_value(t, scope, def.name, d.children(el), None) {
                            // `<number>3</number>` cannot be changed by a drag in
                            // the current core (no math child to write), so it is
                            // a constant; an input's literal is its initial state.
                            Ok(SourcePlan::Literal(v))
                                if component_type == ComponentType::Number =>
                            {
                                SourcePlan::Fixed(v)
                            }
                            Ok(p) => p,
                            // Not a single literal or reference: math text.
                            Err(Error::BadValue { .. }) => {
                                SourcePlan::Math(self.plan_math(t, scope, d.children(el))?)
                            }
                            Err(e) => return Err(e),
                        }
                    }
                }
                (None, PropFrom::Derived) => self.plan_op(t, scope, el)?,
                // Set below (`plan_math_input`, `plan_section_flags`,
                // `plan_select_from_sequence`, `Deferred::mark`).
                (None, PropFrom::Planned)
                    if matches!(
                        component_type,
                        ComponentType::Document
                            | ComponentType::Section
                            | ComponentType::MathInput
                            | ComponentType::FunctionIterates
                            | ComponentType::SelectFromSequence
                    ) =>
                {
                    SourcePlan::Fixed(f64::NAN)
                }
                (None, PropFrom::Planned) => unreachable!("geometric types take plan_geo"),
            };
            props[pi] = Some(plan);
        }
        let mut props: Vec<Option<SourcePlan>> = props;
        if let Planner::PropsThen(then) = Self::planner(component_type) {
            then(self, el, &mut props)?;
        }
        let fix_attrs: &[&str] = if component_type == ComponentType::Graph {
            &["fixed", "fixAxes"]
        } else {
            &["fixed"]
        };
        self.plan_fix(t, scope, el, fix_attrs)?.apply(&mut props);
        let mut props: Vec<SourcePlan> = props.into_iter().map(|p| p.unwrap()).collect();
        Deferred::mark(component_type, &mut props);
        self.compiled.templates[t].elems[e].props = props;
        Ok(())
    }

    /// A section's `aggregateScores`, `includeParentNumber` and `label`:
    /// literals, defaulted by tag as in the current core, since they decide
    /// how credit and numbers are wired.
    pub(super) fn plan_section_flags(
        &mut self,
        el: NodeId,
        props: &mut [Option<SourcePlan>],
    ) -> Result<()> {
        let d = self.dast;
        let tag = match d.str(el) {
            "division" => d
                .attr(el, "type")
                .and_then(|a| self.attr_text(a))
                .map(|t| t.trim().to_string())
                .unwrap_or_default(),
            tag => tag.to_string(),
        };
        let (label, &(_, _, aggregate, parent_number)) = crate::components::SECTION_TAGS
            .iter()
            .enumerate()
            .find(|(_, s)| s.0 == tag)
            .ok_or_else(|| Error::UnsupportedTag(format!("division type=\"{tag}\"")))?;
        let flag = |name: &str, default: bool| -> Result<f64> {
            match d.attr(el, name) {
                None => Ok(if default { 1.0 } else { 0.0 }),
                Some(a) if self.attr_text(a).is_some() => {
                    Ok(if self.attr_flag(el, name) { 1.0 } else { 0.0 })
                }
                Some(_) => Err(Error::Unsupported(format!(
                    "'{name}' on a <{tag}> must be a literal: it decides how the section is wired"
                ))),
            }
        };
        props[section::AGGREGATE] = Some(SourcePlan::Fixed(flag("aggregateScores", aggregate)?));
        props[section::INCLUDE_PARENT_NUMBER] = Some(SourcePlan::Fixed(flag(
            "includeParentNumber",
            parent_number,
        )?));
        props[section::LABEL] = Some(SourcePlan::Fixed(label as f64));
        Ok(())
    }

    /// A mathInput bound to a cell (a reference child or `bindValueTo`)
    /// stays a numeric input. Unbound, its `expr` is an essential math cell
    /// holding the prefill (or its children's text) and `value` evaluates it.
    /// A `prefill="$n"` is not a binding: the expression starts as `$n`'s
    /// value when the input is first built.
    pub(super) fn plan_math_input(
        &mut self,
        el: NodeId,
        props: &mut [Option<SourcePlan>],
    ) -> Result<()> {
        let d = self.dast;
        if d.attr(el, "bindValueTo").is_none()
            && d.children(el).iter().all(|&n| self.is_blank(n))
            && let Some(a) = d.attr(el, "prefill")
            && self.single_macro(a).is_some()
            && let Some(SourcePlan::Alias(Arg::Ref(p, Sel::Whole))) = props[math_input::VALUE]
        {
            props[math_input::EXPR] = Some(SourcePlan::MathEssentialFrom(p));
            props[math_input::VALUE] = Some(SourcePlan::computed(
                OpSpec::Sym(SymKind::Evaluate),
                vec![math_input::EXPR],
            ));
            return Ok(());
        }
        let nodes = match d.attr(el, "prefill") {
            Some(a) => d.attr_children(a),
            None => d.children(el),
        };
        let bound = matches!(props[math_input::VALUE], Some(SourcePlan::Alias(_)))
            || nodes.iter().any(|&n| d.kind(n) == NodeKind::Macro);
        if bound {
            props[math_input::EXPR] = Some(SourcePlan::Fixed(f64::NAN));
            return Ok(());
        }
        let text: String = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect();
        let text = text.trim();
        let tree = if text.is_empty() {
            None
        } else {
            Some(
                // Build-time only, so a throwaway engine parses it.
                crate::sym::Engine::new()
                    .parse_tree(text)
                    .map_err(|reason| Error::BadMath {
                        text: text.into(),
                        reason,
                    })?,
            )
        };
        props[math_input::EXPR] = Some(SourcePlan::MathEssential(tree));
        props[math_input::VALUE] = Some(SourcePlan::computed(
            OpSpec::Sym(SymKind::Evaluate),
            vec![math_input::EXPR],
        ));
        Ok(())
    }

    /// `<function>`, `<derivative>`: a curve samples over the x-range of
    /// the graph it sits in, else [-10, 10].
    pub(in crate::compile) fn plan_symbolic(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let nodes: Vec<NodeId> = d.children(el).to_vec();
        use crate::components::prop::{curve, graph};
        let mut plan = ElemPlan::of(component_type);
        if component_type == ComponentType::Function && self.is_vector_function(t, scope, el)? {
            // Not a curve and not a math cell: a function of several
            // variables, or one returning a tuple, is only iterated
            // (`plan_function_iterates` reads its text).
            plan.set(curve::EXPR, SourcePlan::Fixed(f64::NAN));
            plan.set(curve::XMIN, SourcePlan::Fixed(-10.0));
            plan.set(curve::XMAX, SourcePlan::Fixed(10.0));
            plan.set(curve::SAMPLES, SourcePlan::Fixed(f64::NAN));
            self.compiled.templates[t].elems[e].props = plan.finish();
            return Ok(());
        }
        let id = self.plan_sym_math(t, scope, &nodes)?;
        match component_type {
            ComponentType::Function | ComponentType::Derivative => {
                if component_type == ComponentType::Function {
                    plan.set(curve::EXPR, SourcePlan::SymExpr(id, Post::None));
                } else {
                    let of = plan.hidden(SourcePlan::SymExpr(id, Post::None));
                    plan.set(
                        curve::EXPR,
                        SourcePlan::Op(
                            OpSpec::Sym(SymKind::Derivative),
                            vec![Arg::Own(own_slot(of))],
                        ),
                    );
                }
                let graph = (scope != ROOT_SCOPE
                    && self.compiled.templates[t].elems[scope].component_type
                        == ComponentType::Graph)
                    .then_some(scope);
                match graph {
                    Some(g) => {
                        let at = |p: usize| SourcePlan::Alias(Arg::Elem(g, own_slot(p)));
                        plan.set(curve::XMIN, at(graph::XMIN));
                        plan.set(curve::XMAX, at(graph::XMAX));
                    }
                    None => {
                        plan.set(curve::XMIN, SourcePlan::Fixed(-10.0));
                        plan.set(curve::XMAX, SourcePlan::Fixed(10.0));
                    }
                }
                plan.set(
                    curve::SAMPLES,
                    SourcePlan::Op(
                        OpSpec::Sym(SymKind::Sample),
                        vec![
                            Arg::Own(own_slot(curve::EXPR)),
                            Arg::Own(own_slot(curve::XMIN)),
                            Arg::Own(own_slot(curve::XMAX)),
                        ],
                    ),
                );
            }
            _ => unreachable!(),
        }
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }

    /// Whether a `<function>` takes several variables or returns a tuple.
    fn is_vector_function(&mut self, t: TemplateId, scope: ElemId, el: NodeId) -> Result<bool> {
        if self.function_variables(el).len() > 1 {
            return Ok(true);
        }
        let nodes: Vec<NodeId> = self.dast.children(el).to_vec();
        let (toks, _) = self.math_tokens(t, scope, &nodes)?;
        Ok(super::expr::unwrap_parens(&toks)
            .is_some_and(|inner| super::expr::split_top(inner, &Token::Comma).len() > 1))
    }

    /// `<text>`: literal text (or nothing) is an essential cell holding its
    /// string id, since DoenetML's text value is state (a bound `<textInput>`
    /// writes it); a lone reference aliases another text's value.
    pub(in crate::compile) fn plan_text(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let nodes: Vec<NodeId> = d
            .children(el)
            .iter()
            .copied()
            .filter(|&n| !self.is_blank(n))
            .collect();
        let mut plan = ElemPlan::of(ComponentType::Text);
        match nodes.as_slice() {
            [] => plan.set_text_essential(text::VALUE, "value", self.intern_literal("") as f64),
            [n] if d.kind(*n) == NodeKind::Text => {
                plan.set_text_essential(text::VALUE, "value", d.str_id(*n) as f64)
            }
            [n] if d.kind(*n) == NodeKind::Macro => plan.set(
                text::VALUE,
                SourcePlan::reference(self.plan_ref(t, scope, *n)?),
            ),
            _ => {
                return Err(Error::Unsupported(
                    "<text> whose content mixes text, references or elements".into(),
                ));
            }
        };
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }

    /// `<textInput>`: `value` aliases what a lone `$ref` child names, else
    /// what `bindValueTo` names (a child wins, as in DoenetML); otherwise it
    /// is an essential cell holding the id of its `prefill` text (or of "").
    pub(in crate::compile) fn plan_text_input(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let nodes: Vec<NodeId> = d
            .children(el)
            .iter()
            .copied()
            .filter(|&n| !self.is_blank(n))
            .collect();
        let mut plan = ElemPlan::of(ComponentType::TextInput);
        match (nodes.as_slice(), d.attr(el, "bindValueTo")) {
            ([n], _) if d.kind(*n) == NodeKind::Macro => plan.set(
                text_input::VALUE,
                SourcePlan::reference(self.plan_ref(t, scope, *n)?),
            ),
            ([], Some(a)) => {
                let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                    attr: "bindValueTo".into(),
                    text: self.attr_text(a).unwrap_or_default(),
                })?;
                plan.set(
                    text_input::VALUE,
                    SourcePlan::reference(self.plan_ref(t, scope, m)?),
                );
            }
            ([], None) => {
                let text = match d.attr(el, "prefill") {
                    Some(a) => self.attr_text(a).unwrap_or_default(),
                    None => String::new(),
                };
                let id = self.intern_literal(&text);
                plan.set_text_essential(text_input::VALUE, "value", id as f64);
            }
            _ => {
                return Err(Error::Unsupported(
                    "<textInput> with content other than one reference".into(),
                ));
            }
        }
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }

    /// The canonical string id of `text`: the DAST's if it has one (its
    /// table is deduplicated), else from `extra_strings`, appended after
    /// the DAST's in every build. Two text cells holding equal text hold
    /// equal ids, so text equality is `Eq` on ids (`plan_text_condition`).
    pub(in crate::compile) fn intern_literal(&mut self, text: &str) -> StrId {
        let d = self.dast;
        let ids = self.string_ids.get_or_insert_with(|| {
            let mut ids = HashMap::new();
            for i in (0..d.strings.len() as StrId).rev() {
                ids.insert(d.strings.get(i).to_string(), i);
            }
            ids
        });
        if let Some(&id) = ids.get(text) {
            return id;
        }
        let id = (d.strings.len() + self.compiled.extra_strings.len()) as StrId;
        self.compiled.extra_strings.push(text.to_string());
        ids.insert(text.to_string(), id);
        id
    }

    /// Whether `m` is a reference to a text value: `$t`, `$ti`, `$t.value`
    /// on a `<text>` or `<textInput>`. Decided from the referent's type at
    /// plan time, so a text cell never reaches a numeric comparison.
    pub(in crate::compile) fn macro_is_text(
        &self,
        t: TemplateId,
        scope: ElemId,
        m: NodeId,
    ) -> bool {
        let d = self.dast;
        let names = d.macro_path(m);
        let parts = names.len();
        if parts > 2 || parts == 2 && d.strings.get(names[1]).trim() != "value" {
            return false;
        }
        let Ok(Some((hops, e))) = self.lookup(t, scope, d.strings.get(names[0])) else {
            return false;
        };
        let mut cur_t = t;
        for _ in 0..hops {
            cur_t = self.compiled.templates[cur_t].parent.unwrap().0;
        }
        matches!(
            self.compiled.templates[cur_t].elems[e].component_type,
            ComponentType::Text | ComponentType::TextInput
        )
    }

    /// An on/off attribute that may also take a value: present and not
    /// `false` or `none` (`simplify`, `simplify="full"`).
    pub(in crate::compile) fn attr_on(&self, el: NodeId, name: &str) -> bool {
        match self.dast.attr(el, name) {
            None => false,
            Some(a) => {
                let text = self.attr_text(a).unwrap_or_default();
                !matches!(text.trim().to_ascii_lowercase().as_str(), "false" | "none")
            }
        }
    }

    /// A literal number or a single reference.
    pub(in crate::compile) fn plan_value(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        attr: &str,
        nodes: &[NodeId],
        ref_prop: Option<&str>,
    ) -> Result<SourcePlan> {
        let d = self.dast;
        let macros: Vec<NodeId> = nodes
            .iter()
            .copied()
            .filter(|&n| d.kind(n) == NodeKind::Macro)
            .collect();
        let text: String = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect();
        let text = text.trim();
        match (macros.len(), text.is_empty()) {
            (1, true) => {
                let p = self.plan_ref(t, scope, macros[0])?;
                if let (None, Some(rp)) = (&self.compiled.refs[p].prop, ref_prop) {
                    self.compiled.refs[p].prop = Some(rp.to_string());
                }
                Ok(SourcePlan::reference(p))
            }
            (0, false) => match text {
                "true" => Ok(SourcePlan::Literal(1.0)),
                "false" => Ok(SourcePlan::Literal(0.0)),
                _ => text
                    .parse::<f64>()
                    .map(SourcePlan::Literal)
                    .map_err(|_| Error::BadValue {
                        attr: attr.into(),
                        text: text.into(),
                    }),
            },
            _ => Err(Error::BadValue {
                attr: attr.into(),
                text: text.into(),
            }),
        }
    }

    pub(in crate::compile) fn plan_op(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        el: NodeId,
    ) -> Result<SourcePlan> {
        let d = self.dast;
        let kind_text = d
            .attr(el, "kind")
            .and_then(|a| self.attr_text(a))
            .unwrap_or_default();
        let kind_text = kind_text.trim();
        let param = |name: &str| -> Result<f64> {
            let a = d.attr(el, name).ok_or_else(|| Error::MissingParam {
                kind: kind_text.into(),
                attr: name.into(),
            })?;
            self.attr_text(a)
                .and_then(|t| t.trim().parse::<f64>().ok())
                .ok_or_else(|| Error::BadLiteralParam(name.into()))
        };
        let spec = match kind_text {
            "add" => OpSpec::Add,
            "sub" => OpSpec::Sub,
            "mul" => OpSpec::Mul,
            "div" => OpSpec::Div,
            "min" => OpSpec::Min,
            "max" => OpSpec::Max,
            "default" => OpSpec::Default,
            "negate" => OpSpec::Negate,
            "round" => OpSpec::Round,
            "floor" => OpSpec::Floor,
            // `kind="gate"` predates the op's name.
            "gate" => OpSpec::Hold,
            "scale" => OpSpec::Scale { k: param("k")? },
            "offset" => OpSpec::Offset { k: param("k")? },
            "clamp" => OpSpec::Clamp {
                lo: param("lo")?,
                hi: param("hi")?,
            },
            "nanTo" => OpSpec::NanTo { k: param("k")? },
            "lerp" => OpSpec::Lerp { t: param("t")? },
            other => return Err(Error::UnknownOp(other.into())),
        };
        let mut args = Vec::new();
        if let Some(a) = d.attr(el, "args") {
            for &node in d.attr_children(a) {
                match d.kind(node) {
                    NodeKind::Macro => args.push(self.plan_ref(t, scope, node)?),
                    NodeKind::Text if d.str(node).trim().is_empty() => {}
                    NodeKind::Text => return Err(Error::LiteralArg),
                    _ => {}
                }
            }
        }
        if args.len() != spec.arity() {
            return Err(Error::OpArity {
                kind: kind_text.into(),
                expected: spec.arity(),
                got: args.len(),
            });
        }
        Ok(SourcePlan::Op(
            spec,
            args.into_iter().map(|p| Arg::Ref(p, Sel::Whole)).collect(),
        ))
    }

    /// Math text and `$ref` children to an expression template whose cell
    /// leaves are plan ids.
    pub(in crate::compile) fn plan_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let (toks, text) = self.math_tokens(t, scope, nodes)?;
        self.parse_tokens(&toks, &text)
    }

    /// Parse math tokens into the arena; `text` is for the error.
    pub(in crate::compile) fn parse_tokens(
        &mut self,
        toks: &[Token],
        text: &str,
    ) -> Result<ExprId> {
        Parser::parse(toks, &mut self.compiled.arena).map_err(|reason| Error::BadMath {
            text: text.to_string(),
            reason,
        })
    }

    /// Math text and `$ref` children to an expression template, recording
    /// the text for the symbolic engine in case the math turns out symbolic.
    pub(in crate::compile) fn plan_sym_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let (toks, text, sym) = self.math_tokens_sym(t, scope, nodes)?;
        let id = self.parse_tokens(&toks, &text)?;
        self.compiled.sym_text.insert(id, sym);
        Ok(id)
    }

    /// Tokenize math text with `$ref` children as cell leaves holding plan ids.
    pub(in crate::compile) fn math_tokens(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<(Vec<Token>, String)> {
        let (toks, text, _) = self.math_tokens_sym(t, scope, nodes)?;
        Ok((toks, text))
    }

    /// `math_tokens`, plus the text with each `$ref` written `cellN<plan>`,
    /// the engine's own spelling of a numeric cell leaf.
    fn math_tokens_sym(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<(Vec<Token>, String, String)> {
        let d = self.dast;
        let mut toks: Vec<Token> = Vec::new();
        let mut text = String::new();
        let mut sym = String::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => {
                    text.push_str(d.str(n));
                    sym.push_str(d.str(n));
                    super::expr::tokenize(d.str(n), &mut toks).map_err(|reason| {
                        Error::BadMath {
                            text: text.clone(),
                            reason,
                        }
                    })?;
                }
                NodeKind::Element if matches!(d.str(n), "conditionalContent" | "select") => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside math: each branch would have to yield the same type",
                        d.str(n)
                    )));
                }
                NodeKind::Macro => {
                    text.push('$');
                    text.push_str(&d.macro_display(n));
                    // A text cell holds a string id, which is not a number.
                    if self.macro_is_text(t, scope, n) {
                        return Err(Error::Unsupported(format!(
                            "a text value (${}) inside math",
                            d.macro_display(n)
                        )));
                    }
                    let p = self.plan_ref(t, scope, n)?;
                    // Spaces keep `2$a` from reading as one token.
                    sym.push_str(&format!(
                        " {} ",
                        crate::sym::engine::leaf_name(p as u32, false)
                    ));
                    toks.push(Token::Cell(p as CellIdx));
                }
                _ => {}
            }
        }
        Ok((toks, text.trim().to_string(), sym))
    }

    /// A boolean attribute: present and empty, or `true`.
    pub(in crate::compile) fn attr_flag(&self, el: NodeId, name: &str) -> bool {
        match self.dast.attr(el, name) {
            None => false,
            Some(a) => {
                let text = self.attr_text(a).unwrap_or_default();
                let text = text.trim();
                text.is_empty() || text.eq_ignore_ascii_case("true")
            }
        }
    }

    /// The source for one scalar attribute value: literal, reference, or math.
    pub(in crate::compile) fn plan_scalar(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        attr: &str,
        nodes: &[NodeId],
    ) -> Result<SourcePlan> {
        match self.plan_value(t, scope, attr, nodes, None) {
            Ok(p) => Ok(p),
            Err(Error::BadValue { .. }) => {
                let id = self.plan_math(t, scope, nodes)?;
                Ok(self.plan_from_expr(id))
            }
            Err(e) => Err(e),
        }
    }

    /// A plan from an expression template: a constant is an essential
    /// literal, a lone reference an alias, anything else a lowered math.
    pub(in crate::compile) fn plan_from_expr(&mut self, id: ExprId) -> SourcePlan {
        match self.compiled.arena.get(id) {
            Expr::Num(v) => SourcePlan::Literal(*v),
            Expr::Cell(p) => SourcePlan::reference(*p as RefId),
            _ => SourcePlan::Math(id),
        }
    }

    /// `(a, b)`: two scalar plans from tuple text, with `$ref` leaves.
    pub(in crate::compile) fn plan_tuple(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<[SourcePlan; 2]> {
        let d = self.dast;
        let macros: Vec<NodeId> = nodes
            .iter()
            .copied()
            .filter(|&n| d.kind(n) == NodeKind::Macro)
            .collect();
        let text_blank = nodes
            .iter()
            .all(|&n| d.kind(n) != NodeKind::Text || d.str(n).trim().is_empty());
        if macros.len() == 1 && text_blank {
            // `<point>$q</point>`: alias the referent's coordinates.
            let p = self.plan_ref(t, scope, macros[0])?;
            return Ok([SourcePlan::coord(p, 0), SourcePlan::coord(p, 1)]);
        }
        let (toks, text) = self.math_tokens(t, scope, nodes)?;
        let inner = super::expr::unwrap_parens(&toks).ok_or_else(|| Error::BadMath {
            text: text.clone(),
            reason: "expected a tuple like (x, y)".into(),
        })?;
        self.tuple_from_tokens(inner, &text)
    }

    /// The inside of `(a, b)`, as two scalar plans.
    pub(in crate::compile) fn tuple_from_tokens(
        &mut self,
        inner: &[Token],
        text: &str,
    ) -> Result<[SourcePlan; 2]> {
        let parts = super::expr::split_top(inner, &Token::Comma);
        let [x, y] = parts.as_slice() else {
            return Err(Error::BadMath {
                text: text.to_string(),
                reason: format!("expected 2 coordinates, got {}", parts.len()),
            });
        };
        let (x, y) = (self.parse_tokens(x, text)?, self.parse_tokens(y, text)?);
        Ok([self.plan_from_expr(x), self.plan_from_expr(y)])
    }

    /// A point-valued attribute: a reference (`center="$p"`) or a tuple.
    pub(in crate::compile) fn plan_point_attr(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        a: u32,
    ) -> Result<PointPlan> {
        match self.single_macro(a) {
            Some(m) => Ok(PointPlan::Ref(self.plan_ref(t, scope, m)?)),
            None => Ok(PointPlan::Tuple(self.plan_tuple(
                t,
                scope,
                self.dast.attr_children(a),
            )?)),
        }
    }

    pub(in crate::compile) fn attr_text(&self, a: u32) -> Option<String> {
        let d = self.dast;
        let mut s = String::new();
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Text => s.push_str(d.str(n)),
                NodeKind::Macro => return None,
                _ => {}
            }
        }
        Some(s)
    }

    pub(in crate::compile) fn single_macro(&self, a: u32) -> Option<NodeId> {
        let d = self.dast;
        let mut found = None;
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Macro if found.is_none() => found = Some(n),
                NodeKind::Macro => return None,
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                NodeKind::Text => return None,
                _ => {}
            }
        }
        found
    }

    pub(in crate::compile) fn is_blank(&self, n: NodeId) -> bool {
        match self.dast.kind(n) {
            NodeKind::Text => self.dast.str(n).trim().is_empty(),
            NodeKind::Other => true,
            _ => false,
        }
    }
}
