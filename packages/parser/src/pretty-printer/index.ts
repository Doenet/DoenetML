import { Options } from "prettier";
import * as Prettier from "prettier/standalone";
import { PrintOptions } from "../types";
import * as prettierPluginDoenet from "./prettier-plugin-doenet";

export async function prettyPrint(
    source = "",
    options: Options & PrintOptions = {},
) {
    const plugins = options.plugins || [];
    plugins.push(prettierPluginDoenet);

    return await Prettier.format(source, {
        printWidth: 80,
        useTabs: false,
        tabWidth: 4,
        ...options,
        parser: "doenet-parser",
        plugins,
    });
}
