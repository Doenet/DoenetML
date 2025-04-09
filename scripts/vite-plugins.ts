import { PluginOption } from "vite";

/**
 * Vite plugin to suppress warnings about using eval and some other log messages that clutter the logs.
 */
export function suppressLogPlugin(): PluginOption {
    return {
        name: "suppress-log",
        onLog(level, message) {
            if (message.code === "EVAL") {
                // Don't warn about using eval. We know it's bad and the messages just clutter the logs
                return false;
            }
            if (
                /import.meta.url/.test(message.message) &&
                /@vite-ignore/.test(message.message)
            ) {
                // There is an ignorable warning about import.meta.url that is not relevant to us
                return false;
            }
        },
    };
}
