import { ResolvedStyleDefinition, textRendererStyle } from "@doenet/utils";
import { darkModeSelector } from "../state/redux-slices/global";
import { useSelector } from "react-redux";

export function useTextRendererStyle(style: ResolvedStyleDefinition) {
    const darkMode = useSelector(darkModeSelector);

    return textRendererStyle(darkMode ? "dark" : "light", style);
}
