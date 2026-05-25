import { RowCol } from "../../doenet-source-object";
import type { CompletionItem, Diagnostic } from "vscode-languageserver/browser";
import {
    CompletionItemKind,
    DiagnosticSeverity,
} from "vscode-languageserver/browser";
import {
    DastAttribute,
    DastElement,
    DastNodes,
    DastRoot,
    showCursor,
    toXml,
    visit,
} from "@doenet/parser";
import { AutoCompleter } from "..";

/**
 * Get a list of places where the schema is violated.
 *
 * Async because `_refreshModuleInstanceAttributes` issues resolver
 * round-trips per `<module copy=…>` (or `extend=`) site to populate the
 * per-instance allowlist used below.  See `AutoCompleter._refreshModuleInstanceAttributes`
 * for the coalescing strategy — back-to-back violation runs between edits
 * pay one round-trip per site total.
 */
export async function getSchemaViolations(
    this: AutoCompleter,
): Promise<Diagnostic[]> {
    await this._refreshModuleInstanceAttributes();
    /**
     * Get all pairs of elements and their parent.
     */
    function getElementPairs(
        node: DastElement | DastRoot,
        grandparent: DastElement | DastRoot | null = null,
    ): {
        node: DastElement;
        parent: DastElement | DastRoot;
        grandparent: DastElement | DastRoot | null;
    }[] {
        return node.children.flatMap((child) => {
            if (child.type === "element") {
                return [
                    { node: child, parent: node, grandparent },
                    ...getElementPairs(child, node),
                ];
            }
            return [];
        });
    }

    const allPairs = getElementPairs(this.sourceObj.dast);

    const ret: Diagnostic[] = allPairs.flatMap(
        ({ node, parent, grandparent }) => {
            const ret: Diagnostic[] = [];
            const name = this.normalizeElementName(node.name);

            if (name === "UNKNOWN_NAME") {
                // No further checking for unknown elements.
                const range = this.sourceObj.getElementTagRanges(node);
                return {
                    range: {
                        start: this.sourceObj.offsetToLSPPosition(
                            range[0].start,
                        ),
                        end: this.sourceObj.offsetToLSPPosition(range[0].end),
                    },
                    message: `Element \`<${node.name}>\` is not a recognized Doenet element.`,
                    severity: DiagnosticSeverity.Warning,
                };
            }

            const schema = this.schemaElementsByName[name];
            //
            // Check parent-child relationship
            //
            if (parent.type === "root") {
                if (!schema) {
                    return [];
                }
                if (!schema.top) {
                    const range = this.sourceObj.getElementTagRanges(node);
                    ret.push({
                        range: {
                            start: this.sourceObj.offsetToLSPPosition(
                                range[0].start,
                            ),
                            end: this.sourceObj.offsetToLSPPosition(
                                range[0].end,
                            ),
                        },
                        message: `Element \`<${name}>\` is not allowed at the root of the document.`,
                        severity: DiagnosticSeverity.Warning,
                    });
                }
            } else {
                const parentName = this.normalizeElementName(parent.name);
                // Pass grandparent name through so the alias-aware path
                // resolves `<row>` inside `<matrix>` against the
                // `matrixRow` alias's children (`<math>` is fine) rather
                // than the tabular `<row>`'s (`<cell>` only) — #1174.
                const grandparentName =
                    grandparent && grandparent.type === "element"
                        ? grandparent.name
                        : undefined;
                if (
                    parentName !== "UNKNOWN_NAME" &&
                    !this.isAllowedChild(parentName, name, grandparentName)
                ) {
                    const range = this.sourceObj.getElementTagRanges(node);
                    ret.push({
                        range: {
                            start: this.sourceObj.offsetToLSPPosition(
                                range[0].start,
                            ),
                            end: this.sourceObj.offsetToLSPPosition(
                                range[0].end,
                            ),
                        },
                        message: `Element \`<${name}>\` is not allowed inside of \`<${parentName}>\`.`,
                        severity: DiagnosticSeverity.Warning,
                    });
                }
            }

            // Direct-parent name for the attribute checks below. For the
            // attribute-validation path, the "alias-relevant parent" is
            // `node`'s own parent (one level shallower than for the child
            // check above), since the alias redirects `<row>`'s schema
            // when `<row>` is a child of `<matrix>`.
            const directParentName =
                parent.type === "element" ? parent.name : undefined;

            //
            // Check attributes
            //
            // For `<module copy="$x" .../>` (or `extend=`) sites, pick up the
            // per-instance allowlist of names declared by `$x`'s
            // `<moduleAttributes>` block (issue #1154).  The allowlist is keyed
            // lowercased; `null` here means "no augmentation applies", in
            // which case the canonical schema decides as today and unknown
            // attributes remain a (correct) warning.
            const perInstanceAllowlist =
                this._moduleInstanceAttributeAllowlist.get(node) ?? null;

            // Pre-pass for unquoted attribute values (#1104).
            //
            // The lezer grammar parses `<math name=foo>` as two value-less
            // attributes side-by-side: `name` (source spans `name=`) and `foo`
            // (source spans the bare token).  Detect that pairing so we can
            // emit one helpful warning on the bare token and suppress the
            // spurious "unknown attribute" warning the standard loop would
            // otherwise produce on the bare half.  Two consecutive unquoted
            // values (`<a x=foo y=bar>`) are not picked up here — the parser
            // already emits a quote-mismatch error covering the whole run, so
            // a second diagnostic would just add noise.
            const bareValuePairs = findBareAttributeValuePairs(
                node,
                this.sourceObj.source,
            );
            const bareValueByAttr = new Map(
                bareValuePairs.map(({ valueAttr, assignAttr }) => [
                    valueAttr,
                    assignAttr,
                ]),
            );
            // Assignment halves that successfully paired with a bare
            // value.  Standard value-dependent checks (the empty-string
            // `name=''` error; the "absent value defaults to `true`"
            // enumerated-value check) would otherwise misfire on these
            // — the *real* value lives on the bare-value half, and is
            // already covered by the bare-value warning above.
            const pairedAssignAttrs = new Set(
                bareValuePairs.map(({ assignAttr }) => assignAttr),
            );

            for (const attr of Object.values(node.attributes)) {
                const attrName = this.normalizeAttributeName(attr.name);

                // Unquoted value: point at the bare token, name the
                // corrected form, and skip the standard attribute-name
                // validation (which would otherwise flag this half as an
                // unknown attribute on the parent element).
                const assignAttr = bareValueByAttr.get(attr);
                if (assignAttr) {
                    // `bareValueByAttr` only ever contains attrs whose
                    // `position` was non-null at filter time in
                    // `findBareAttributeValuePairs`; the `?? 0`
                    // fallbacks here exist for the type checker, not as
                    // a runtime guard.
                    const startOffset = attr.position?.start.offset ?? 0;
                    const endOffset = attr.position?.end.offset ?? 0;
                    ret.push({
                        range: {
                            start: this.sourceObj.offsetToLSPPosition(
                                startOffset,
                            ),
                            end: this.sourceObj.offsetToLSPPosition(endOffset),
                        },
                        message: `Attribute values must be enclosed in quotes: \`${assignAttr.name}="${attr.name}"\``,
                        severity: DiagnosticSeverity.Warning,
                    });
                    continue;
                }

                const isPairedAssignHalf = pairedAssignAttrs.has(attr);

                // Make sure that `name` attributes start with a letter.
                // Skip on a paired assignment half: `toXml([])` is `""`,
                // which would emit a misleading "name=''" error even
                // though the author *did* write a value (just unquoted)
                // — already reported as the bare-value warning.
                if (attrName === "name" && !isPairedAssignHalf) {
                    const value = toXml(attr.children);
                    if (!value.charAt(0).match(/[a-zA-Z]/)) {
                        ret.push({
                            range: {
                                start: this.sourceObj.offsetToLSPPosition(
                                    attr.position?.start.offset || 0,
                                ),
                                end: this.sourceObj.offsetToLSPPosition(
                                    attr.position?.end.offset || 0,
                                ),
                            },
                            message: `Invalid attribute name='${value}'. Names must start with a letter.`,
                            severity: DiagnosticSeverity.Error,
                        });
                    }
                }

                // Author-declared module attribute (e.g. `color` on a
                // `<module copy="$drawBalloon" color="1" />` where the target
                // declared `<number name="color"/>`).  Bypass both the
                // UNKNOWN_NAME branch (the name may not exist in the global
                // schema at all — `color` doesn't) and the canonical
                // attribute check.  Names-only scope: no value validation.
                if (
                    perInstanceAllowlist &&
                    perInstanceAllowlist.has(attr.name.toLowerCase())
                ) {
                    continue;
                }

                if (attrName === "UNKNOWN_NAME") {
                    ret.push({
                        range: {
                            start: this.sourceObj.offsetToLSPPosition(
                                attr.position?.start.offset || 0,
                            ),
                            end: this.sourceObj.offsetToLSPPosition(
                                attr.position?.end.offset || 0,
                            ),
                        },
                        message: `Element \`<${name}>\` doesn't have an attribute called \`${attr.name}\`.`,
                        severity: DiagnosticSeverity.Warning,
                    });
                } else if (
                    !this.isAllowedAttribute(
                        name,
                        attrName,
                        directParentName,
                        perInstanceAllowlist ?? undefined,
                    )
                ) {
                    ret.push({
                        range: {
                            start: this.sourceObj.offsetToLSPPosition(
                                attr.position?.start.offset || 0,
                            ),
                            end: this.sourceObj.offsetToLSPPosition(
                                attr.position?.end.offset || 0,
                            ),
                        },
                        message: `Element \`<${name}>\` doesn't have an attribute called \`${attrName}\`.`,
                        severity: DiagnosticSeverity.Warning,
                    });
                } else {
                    // If there are no macros/functions in the attribute value and the list of allowed values is non-empty,
                    // check that the value is in the list of allowed values.
                    // Pass the direct parent so the alias-aware path picks
                    // up alias-specific enumerations (#1092).
                    const allowedValues = this.getAttributeAllowedValues(
                        name,
                        attrName,
                        directParentName,
                    );
                    if (
                        !hasMacroOrFunctionChild(attr.children) &&
                        allowedValues &&
                        // Paired assignment half: defaulting to `"true"`
                        // here would emit a spurious enum-mismatch
                        // warning even though the author *did* write a
                        // value (just unquoted, on the next attr).
                        !isPairedAssignHalf
                    ) {
                        // Attributes specified without a value are considered to have a value of "true".
                        const attrValue =
                            attr.children.length === 0
                                ? "true"
                                : toXml(attr.children);
                        const range = getAttributeValueRange(attr);
                        if (
                            !allowedValues.lowerCase.has(
                                attrValue.toLowerCase(),
                            )
                        ) {
                            ret.push({
                                range: {
                                    start: this.sourceObj.offsetToLSPPosition(
                                        range.start,
                                    ),
                                    end: this.sourceObj.offsetToLSPPosition(
                                        range.end,
                                    ),
                                },
                                message: `Attribute \`${attrName}\` of element \`<${name}>\` must be one of: ${[
                                    ...allowedValues.correctCase,
                                ]
                                    .map((v) => `"${v}"`)
                                    .join(", ")}`,
                                severity: DiagnosticSeverity.Warning,
                            });
                        }
                    }
                }
            }
            return ret;
        },
    );

    return ret;
}

/**
 * Determine if the list of nodes contains a macro or function descendant.
 */
function hasMacroOrFunctionChild(nodes: DastNodes[]): boolean {
    let ret = false;
    visit(nodes, (node) => {
        if (node.type === "macro" || node.type === "function") {
            ret = true;
        }
    });

    return ret;
}

/**
 * Identify `<element name=foo>`-style unquoted attribute values.
 *
 * The lezer grammar splits an unquoted assignment into two parsed
 * `DastAttribute`s side-by-side: an "assignment" half whose source ends
 * with `=` (after optional whitespace) and a value-less "bare value" half
 * carrying the unquoted token as its `name`.  Returns each such pair so
 * the diagnostics path can warn on the bare half and suppress the
 * spurious unknown-attribute warning that would otherwise fire on it.
 *
 * Cases the parser does NOT split this way never reach the pair loop —
 * they're handled at lower layers and we have nothing to add:
 *   - `<a x=$y>` — the `$y` gets absorbed as an element child, so `x`
 *     ends up as a lone assignment half with no sibling to pair with.
 *   - `<a x=23>` — numeric-leading tokens can't form an attribute name,
 *     so no bare-value half materializes.
 *   - `<a x=foo y=bar>` — the parser greedily reads through the second
 *     `=` and reports a quote-mismatch over the whole run.
 */
function findBareAttributeValuePairs(
    node: DastElement,
    source: string,
): { assignAttr: DastAttribute; valueAttr: DastAttribute }[] {
    const sorted = Object.values(node.attributes)
        .filter(
            (a) =>
                a.position?.start.offset != null &&
                a.position?.end.offset != null,
        )
        .sort(
            (a, b) =>
                (a.position?.start.offset ?? 0) -
                (b.position?.start.offset ?? 0),
        );
    const pairs: { assignAttr: DastAttribute; valueAttr: DastAttribute }[] = [];
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        // Both halves must be value-less.  `curr.children.length === 0`
        // rules out `<a x= y="bar" />`, where `x`'s source ends in `= `
        // (matching the regex below) but `y` is a real attribute with
        // its own quoted value — flagging `y` there would emit a
        // misleading `x="y"` suggestion.  Two adjacent assignment halves
        // never materialize at this layer: the lezer parser swallows a
        // trailing `=` into the previous attribute's value (so
        // `<a x= y= />` parses as a single attribute `x` with source
        // `x= y= />`), and macro-valued unquoted assignments
        // (`<a x=$y z=foo />`) drop `$y`/`z`/`foo` out of the attribute
        // list entirely, leaving only `x` behind.
        if (prev.children.length !== 0 || curr.children.length !== 0) {
            continue;
        }
        // Filter above guarantees both offsets are present; the `?? 0`
        // is for the type checker.
        const prevSrc = source.slice(
            prev.position?.start.offset ?? 0,
            prev.position?.end.offset ?? 0,
        );
        // `=` as the last non-whitespace character marks `prev` as an
        // assignment half (`x=` or `x = `), distinguishing `<a x=foo>`
        // from the unrelated boolean-attribute pair `<a x foo>`.
        if (!/=\s*$/.test(prevSrc)) {
            continue;
        }
        pairs.push({ assignAttr: prev, valueAttr: curr });
    }
    return pairs;
}

/**
 * Get the offset of the start and end of the attribute value.
 */
function getAttributeValueRange(node: DastAttribute): {
    start: number;
    end: number;
} {
    if (node.children.length === 0) {
        return {
            start: node.position?.end.offset || 0,
            end: node.position?.end.offset || 0,
        };
    }
    const first = node.children[0];
    const last = node.children[node.children.length - 1];
    const firstStart = first.position?.start.offset || 0;
    const lastEnd = last.position?.end.offset || 0;
    const attrStart = node.position?.start.offset;
    const attrEnd = node.position?.end.offset;

    return {
        // Include the surrounding quote characters when present.
        start:
            attrStart == null
                ? Math.max(0, firstStart - 1)
                : Math.max(attrStart, firstStart - 1),
        end: attrEnd == null ? lastEnd + 1 : Math.min(attrEnd, lastEnd + 1),
    };
}
