import me from "math-expressions";

import { EmptySet, RealLine } from "../math/subset-of-reals";
import { buildSubsetFromMathExpression } from "../math/subset-of-reals-operations";
import { isNumericConstant } from "../math/mathexpressions";

interface DomainResult {
    minx: number;
    maxx: number;
    openMin: boolean;
    openMax: boolean;
}

export function find_effective_domain({
    domain,
    truncateToFiniteDomain = false,
    xscale = 1,
}: {
    domain: any[] | null;
    truncateToFiniteDomain?: boolean;
    xscale?: number;
}): DomainResult {
    // Works only for 1 dimension.

    // Arguments
    // - domain: an array of intervals for the domain for each dimension, only first entry is used
    // - truncateToFiniteDomain: if true, infinite domains are made finite base on xscale
    // - xscale: whole real line is truncated to [-100*xscale, 100*xscale]
    //   If one endpoint is specified, domain length is 200*xscale

    // returns
    // - minx: left endpoint
    // - maxx: right endoint
    // - openMin: true if left of interval is open
    // - openMax: true if right of interval is open

    let minx = -Infinity;
    let maxx = Infinity;
    let openMin = true,
        openMax = true;

    // Read and tested exactly as `find_effective_domains_piecewise_children`
    // below reads and tests it, so the two entry points cannot disagree about
    // what "no domain" is. They used to: this one threw on a `domain` of
    // `undefined` and on a `domain[0]` of `null`, where that one returns the
    // unbounded default for both. No caller passes either today — every call
    // site in `function.ts` defaults the parameter to `null`, and the array
    // itself only ever holds an interval or a hole — but a crash is the wrong
    // answer to "no domain" whichever way it arrives.
    const domain1 = domain?.[0];
    if (domain1) {
        // `isNumericConstant`, not `Number.isFinite`: an endpoint that
        // *evaluates to* ±∞ is a real endpoint and is kept as written,
        // where one that cannot be evaluated at all — `null` from the
        // engine, or NaN — falls back to the unbounded side. The two
        // differ only for a literally infinite endpoint, and only in
        // `truncateToFiniteDomain` mode, since the normalization below
        // forces `openMin`/`openMax` false at ±∞ otherwise. This is also
        // exactly the test the nine copies of this block in `function.ts`
        // used before they were replaced by calls to this function.
        minx = me.fromAst(domain1.tree[1][1]).evaluate_to_constant() as number;
        if (!isNumericConstant(minx)) {
            minx = -Infinity;
        } else {
            openMin = !domain1.tree[2][1];
        }
        maxx = me.fromAst(domain1.tree[1][2]).evaluate_to_constant() as number;
        if (!isNumericConstant(maxx)) {
            maxx = Infinity;
        } else {
            openMax = !domain1.tree[2][2];
        }
    }

    if (truncateToFiniteDomain) {
        if (minx === -Infinity) {
            if (maxx === Infinity) {
                minx = -100 * xscale;
                maxx = 100 * xscale;
            } else {
                minx = maxx - 200 * xscale;
            }
        } else if (maxx === Infinity) {
            maxx = minx + 200 * xscale;
        }
    } else {
        // If the domain extends to +/- infinity, then consider the domain closed
        // so that we can evaluate the function at +/- infinity
        if (minx === -Infinity) {
            openMin = false;
        }
        if (maxx === Infinity) {
            openMax = false;
        }
    }

    return { minx, maxx, openMin, openMax };
}

export function find_effective_domains_piecewise_children({
    domain,
    numericalDomainsOfChildren,
}: {
    domain?: any;
    numericalDomainsOfChildren: any[];
}): any[] {
    let domainUnused;

    // As in `find_effective_domain`, the array may be present but say nothing:
    // a `<function>`'s `domain` is an array state variable of one interval per
    // input, and a child that reports no domain at all leaves every entry
    // empty. The array is still truthy, so `domain[0]` has to be tested in its
    // own right — a piecewise function whose pieces have symbolic domains
    // reports `domain: null`, and the `<function>` wrapping it (which is what a
    // field's sugar builds around `$g`) turned that into `[undefined,
    // undefined]` and threw here, taking the whole document down.
    const domain1 = domain?.[0];

    if (domain1) {
        let domainMin = me.fromAst(domain1.tree[1][1]).evaluate_to_constant();
        let domainMax = me.fromAst(domain1.tree[1][2]).evaluate_to_constant();

        // `isNumericConstant`, not `Number.isNaN`: the engine briefly
        // reported an endpoint it cannot evaluate — a symbolic one — as
        // `null`, where legacy reported `NaN`. `Number.isNaN(null)` is
        // `false`, so a symbolic endpoint stopped falling back to the real
        // line and was handed to `buildSubsetFromMathExpression` instead. The
        // engine answers `NaN` again; the helper stays because it also rejects
        // the `Complex` arm. `±Infinity` still passes: an unbounded domain is
        // a real interval.
        if (!isNumericConstant(domainMin) || !isNumericConstant(domainMax)) {
            domainUnused = RealLine();
        } else {
            domainUnused = buildSubsetFromMathExpression(domain1);
        }
    } else {
        domainUnused = RealLine();
    }

    let effectiveChildDomains = [];

    for (let childDomain of numericalDomainsOfChildren) {
        if (!childDomain) {
            effectiveChildDomains.push(EmptySet());
        } else {
            let childDomainMathExpr = me.fromAst([
                "interval",
                ["tuple", ...childDomain[0]],
                ["tuple", ...childDomain[1]],
            ]);

            let childDomainSubset =
                buildSubsetFromMathExpression(childDomainMathExpr);

            let childDomainToConsider =
                childDomainSubset.intersect(domainUnused);
            domainUnused = domainUnused.setMinus(childDomainSubset);
            effectiveChildDomains.push(childDomainToConsider);
        }
    }

    return effectiveChildDomains;
}
