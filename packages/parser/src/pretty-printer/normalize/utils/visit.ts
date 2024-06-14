import {
    DastElement,
    DastElementV6,
    DastNodes,
    DastNodesV6,
} from "../../../types";

export type VisitorContext = {};

type GetGuard<T> = T extends (x: any) => x is infer R ? R : never;
/**
 * Gets the type that a type-guard function is guarding. If
 * the guard type cannot be determined, the input type is returned.
 */
type GuardTypeOf<T extends (x: any) => boolean> =
    GetGuard<T> extends never
        ? T extends (x: infer A) => any
            ? A
            : never
        : GetGuard<T>;

/**
 * Extracts the guard type from the `test` function provided in a
 * `VisitOptions` argument.
 */
type GuardFromOptions<
    Opts extends VisitOptions,
    PossibleTypes = DastNodes | DastNodes[],
> = Opts extends {
    test: infer R;
}
    ? R extends (x: any) => boolean
        ? // A guard like `typeof Array.isArray` will return `any[]` as the type.
          // This type cannot be narrowed, so instead we use it to pick from
          // the set of all possible types.
          Extract<PossibleTypes, GuardTypeOf<R>>
        : PossibleTypes
    : PossibleTypes;

/**
 * Narrow the type `T` based on the `VisitOptions` supplied. If `{includeArrays: false}`
 * is specified in the `VisitOptions`, then arrays are excluded from `T`.
 */
type NarrowArraysBasedOnOptions<T, Opts extends VisitOptions> = Opts extends {
    includeArrays: infer A;
}
    ? A extends true
        ? T
        : Exclude<T, any[]>
    : Exclude<T, any[]>;

/**
 * Get the type of the parameter to the `Visitor` function based on the
 * `VisitOptions` that are supplied.
 */
type VisitorTypeFromOptions<Opts extends VisitOptions> =
    NarrowArraysBasedOnOptions<GuardFromOptions<Opts>, Opts>;

/**
 * Continue traversing as normal
 */
export const CONTINUE = Symbol("continue");
/**
 * Do not traverse this node’s children
 */
export const SKIP = Symbol("skip");
/**
 * Stop traversing immediately
 */
export const EXIT = Symbol("exit");

type Action = typeof CONTINUE | typeof SKIP | typeof EXIT;
type Index = number;
type ActionTuple = [Action] | [typeof SKIP, Index] | [typeof CONTINUE, Index];

/**
 * A visitor takes a `node`, `key`, `index`, and ...
 *
 * @param key - The key of the parent that we were accessed through.
 */
type Visitor<T> = (
    node: T,
    info: VisitInfo,
) => null | undefined | Action | Index | ActionTuple | void;
type Visitors<T> = { enter?: Visitor<T>; leave?: Visitor<T> };

type VisitOptions = {
    startingContext?: VisitorContext;
    /**
     * Type guard for types that are passed to the `visitor` function.
     */
    test?: (
        node: DastNodes | DastNodes[] | DastNodesV6 | DastNodesV6[],
        info: VisitInfo,
    ) => boolean;
    /**
     * Whether arrays will be sent to the `visitor` function. If falsy,
     * only nodes will be past to `visitor`.
     */
    includeArrays?: boolean;
};

const DEFAULT_CONTEXT: VisitorContext = {
    inMathMode: false,
    hasMathModeAncestor: false,
};

export type VisitInfo = {
    /**
     * If the element was accessed via an attribute, the attribute key is specified.
     */
    readonly key: string | undefined;
    /**
     * If the element was accessed in an array, the index is specified.
     */
    readonly index: number | undefined;
    /**
     * A list of ancestor nodes, `[parent, grandparent, great-grandparent, ...]`
     */
    readonly parents: DastElement[];
    /**
     * If the element was accessed in an array, the array that it is part of.
     */
    readonly containingArray: DastNodes[] | undefined;
    /**
     * The LaTeX context of the current match.
     */
    readonly context: VisitorContext;
};

/**
 * Visit children of tree which pass a test. This is an enhanced version of unified's visit utility.
 *
 * @param tree Abstract syntax tree to walk
 * @param [visitor] Function to run for each node
 */
export function visit<Opts extends VisitOptions>(
    tree: DastNodes | DastNodes[] | DastNodesV6 | DastNodesV6[],
    visitor:
        | Visitor<VisitorTypeFromOptions<Opts>>
        | Visitors<VisitorTypeFromOptions<Opts>>,
    options?: Opts,
) {
    const {
        startingContext = DEFAULT_CONTEXT,
        test = () => true,
        includeArrays = false,
    } = options || {};
    let enter: Visitor<VisitorTypeFromOptions<Opts>> | undefined;
    let leave: Visitor<VisitorTypeFromOptions<Opts>> | undefined;

    if (typeof visitor === "function") {
        enter = visitor;
    } else if (visitor && typeof visitor === "object") {
        enter = visitor.enter;
        leave = visitor.leave;
    }

    walk(tree, {
        key: undefined,
        index: undefined,
        parents: [],
        containingArray: undefined,
        context: { ...startingContext },
    });

    function walk(
        node: DastNodes | DastNodes[] | DastNodesV6 | DastNodesV6[],
        { key, index, parents, context, containingArray }: VisitInfo,
    ): ActionTuple {
        const nodePassesTest = includeArrays
            ? test(node, { key, index, parents, context, containingArray })
            : !Array.isArray(node) &&
              test(node, { key, index, parents, context, containingArray });

        const result: ActionTuple =
            enter && nodePassesTest
                ? toResult(
                      enter(node as any, {
                          key,
                          index,
                          parents,
                          context,
                          containingArray,
                      }),
                  )
                : [CONTINUE];

        if (result[0] === EXIT) {
            return result;
        }

        if (result[0] === SKIP) {
            return leave && nodePassesTest
                ? toResult(
                      leave(node as any, {
                          key,
                          index,
                          parents,
                          context,
                          containingArray,
                      }),
                  )
                : result;
        }

        if (Array.isArray(node)) {
            // The `value` array might be modified in place as we traverse it, so
            // we use a traditional for loop.
            for (let index = 0; index > -1 && index < node.length; index++) {
                const item = node[index];
                const result = walk(item, {
                    key,
                    index,
                    parents,
                    context,
                    containingArray: node as DastNodes[],
                });
                if (result[0] === EXIT) {
                    return result;
                }
                if (typeof result[1] === "number") {
                    // The for loop will increment i every pass. However,
                    // if an index was returned, that's where we want to start next time.
                    index = result[1] - 1;
                }
            }
        } else {
            // Recursively walk all child nodes
            const key = "children";
            if (key in node) {
                const grandparents =
                    node.type === "root" ? parents : [node, ...parents];

                const result = walk(node.children as DastElement[], {
                    key,
                    index: undefined,
                    parents: grandparents as DastElement[],
                    context,
                    containingArray: undefined,
                });
                if (result[0] === EXIT) {
                    return result;
                }
            }
        }

        return leave && nodePassesTest
            ? toResult(
                  leave(node as any, {
                      key,
                      index,
                      parents,
                      context,
                      containingArray,
                  }),
              )
            : result;
    }
}

/**
 * Ensures a result is an `ActionTuple`s
 */
function toResult(
    value: null | undefined | void | Action | Index | ActionTuple,
): ActionTuple {
    if (value == null) {
        return [CONTINUE];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "number") {
        return [CONTINUE, value];
    }

    return [value];
}
