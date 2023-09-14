/**
 * A lazy data object. This allows typescript to infer whether `data` exists based on the
 * value of `init`.
 */
export type LazyData<T> =
    | { type: "lazy-data"; init: false; data?: null }
    | { type: "lazy-data"; init: true; data: T };

/**
 * Create an uninitialized lazy data object
 */
export function uninitializedLazyData(): LazyData<any> {
    return { type: "lazy-data", init: false, data: null };
}

/**
 * Create a lazy data object initialized with `data`
 */
export function initializedLazyData<T>(data: T): LazyData<T> {
    return { type: "lazy-data", init: true, data };
}

/**
 * Clear the data in a lazy data object.
 */
export function resetLazyData(lazyData: LazyData<unknown>) {
    lazyData.init = false;
    lazyData.data = null;
}

export function isLazyData<T extends unknown>(obj: any): obj is LazyData<T> {
    return (
        typeof obj === "object" &&
        obj != null &&
        (obj as any).type === "lazy-data"
    );
}

/**
 * A class that allows you to create lazily computed data objects.
 * If you inherit from this class, use `_lazyDataGetter` to create a getter function for
 * lazily computed data. `_lazyDataGetter(initFunction)` will call `initFunction` the first
 * time the getter is called, and cache the result. Subsequent calls will return the cached
 * data.
 */
export class LazyDataObject {
    _lazyData: Record<string, LazyData<unknown>> = {};

    /**
     * Clear all stale data to force a recompute next time it's used.
     */
    _clearLazyData() {
        for (const [name, val] of Object.entries(this._lazyData)) {
            resetLazyData(val);
        }
    }

    /**
     * Create a `getter` function for lazily computed data. You must pass in the name of the
     */
    _lazyDataGetter<T, S extends LazyDataObject>(initFunction: (this: S) => T) {
        // Create a new cache object for this lazy data.
        const cacheName = generateNameFromInitializer(
            initFunction,
            this._lazyData,
        );
        this._lazyData[cacheName] = uninitializedLazyData();

        return function getter(this: S): T {
            if (!(cacheName in this._lazyData)) {
                throw new Error(
                    `Lazy data cache object named "${cacheName}" not found`,
                );
            }
            const lazyData = this._lazyData[cacheName];
            if (!isLazyData<T>(lazyData)) {
                throw new Error(
                    `Asked to treat "${cacheName}" as a lazy data but it appears not to be`,
                );
            }

            if (!lazyData.init) {
                this._lazyData[cacheName] = initializedLazyData(
                    initFunction.call(this),
                );
                return getter.call(this);
            }
            return lazyData.data!;
        };
    }
}

/**
 * Based on an initializer function, create a suitable (and unique) name for a lazy data object.
 * Initializers are expected to start with `_init`.
 */
function generateNameFromInitializer(
    fn: Function,
    existingNames: Record<string, unknown>,
) {
    const fnSource = fn.toString();
    let name = (
        fnSource.replace("function ", "").replace(/\(.*/, "").split("\n")[0] ||
        ""
    ).replace(/^(_?)init/, "");
    while (name in existingNames) {
        name += "_";
    }
    return name;
}
