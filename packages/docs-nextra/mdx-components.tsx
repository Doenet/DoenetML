import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import type { MDXComponents } from "nextra/mdx-components";

const themeComponents = getThemeComponents();

/**
 * Next.js picks this file up automatically and uses it to supply the components
 * every MDX page renders with. It replaces what Nextra 3 wired up internally
 * through `theme: "nextra-theme-docs"`.
 */
export function useMDXComponents(components?: MDXComponents) {
    return {
        ...themeComponents,
        ...components,
    };
}
