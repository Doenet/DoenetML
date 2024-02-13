/**
 * Ensures that `globalThis` is defined. Code from
 * https://mathiasbynens.be/notes/globalthis
 *
 * Note: This polyfill is used because currently not all browsers support `globalThis`. It can
 * be removed when there is sufficient browser support.
 */
function ensureGlobalThis() {
    if (typeof globalThis === "object") return;
    Object.defineProperty(Object.prototype, "__magic__", {
        get: function () {
            return this;
        },
        configurable: true, // This makes it possible to `delete` the getter later.
    });
    // @ts-ignore
    __magic__.globalThis = __magic__;
    // @ts-ignore
    delete Object.prototype.__magic__;
}

ensureGlobalThis();

const _globalThis = globalThis as any as Window;
export { _globalThis as globalThis };
