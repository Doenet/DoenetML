import { ResolvedStyleDefinition, textRendererStyle } from "@doenet/utils";
import { darkModeSelector } from "../state/redux-slices/global";
import { useSelector } from "react-redux";

export function useTextRendererStyle(
    style: ResolvedStyleDefinition | undefined,
) {
    const darkMode = useSelector(darkModeSelector);

    // The Rust core sends no `selectedStyle` for math, so the text keeps
    // the color it inherits.
    if (!style) return {};
    return textRendererStyle(darkMode ? "dark" : "light", style);
}
