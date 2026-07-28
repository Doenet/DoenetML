import React from "react";
import { UiButton } from "@doenet/ui-components";
import { isMacPlatform } from "@doenet/utils";
import { RxUpdate } from "react-icons/rx";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { AccessibilityStatusButton } from "./AccessibilityStatusButton";
import VariantSelect from "./VariantSelect";
import type { ResolvedTheme } from "../utils/theme";
import { setVariantIndex } from "../utils/variants";
import type { VariantsState } from "../utils/variants";
import { useT } from "../utils/i18n";

/**
 * Header controls above the viewer: update/reset, variant selection, and accessibility status.
 */
export function ViewerControlsBar({
    id,
    readOnly,
    codeChanged,
    documentInteracted,
    updateAction,
    onUpdateViewer,
    variants,
    setVariants,
    showDiagnostics,
    accessibilityLevel1Count,
    accessibilityLevel2Count,
    isAccessibilityReportOpen,
    onToggleAccessibilityReport,
    darkMode,
}: {
    id: string;
    readOnly: boolean;
    codeChanged: boolean;
    documentInteracted: boolean;
    /** Which of the two things the button does, not the word it shows. */
    updateAction: "reset" | "update";
    onUpdateViewer: () => void;
    variants: VariantsState;
    setVariants: React.Dispatch<React.SetStateAction<VariantsState>>;
    showDiagnostics: boolean;
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
    isAccessibilityReportOpen: boolean;
    onToggleAccessibilityReport: () => void;
    darkMode: ResolvedTheme;
}) {
    const t = useT();
    // Translated at render rather than carried in state, so that a language
    // change mid-session cannot leave the previous language's word on the
    // button (#1580).
    const updateWord = t(
        "editor-update-viewer",
        { action: updateAction },
        updateAction === "reset" ? "Reset" : "Update",
    );
    // The shortcut is a branch of the tooltip rather than text appended to it:
    // where a key combination sits in a sentence is not the same in every
    // language.
    const shortcut = !codeChanged
        ? "none"
        : isMacPlatform()
          ? "cmd+s"
          : "ctrl+s";

    return (
        <div className="viewer-controls" id={`${id}-viewer-controls`}>
            {!readOnly && (
                <UiButton
                    data-test="Viewer Update Button"
                    disabled={!codeChanged && !documentInteracted}
                    title={t(
                        "editor-update-viewer-title",
                        { word: updateWord, shortcut },
                        shortcut === "none"
                            ? `${updateWord} Viewer`
                            : `${updateWord} Viewer ${shortcut}`,
                    )}
                    onClick={onUpdateViewer}
                >
                    <RxUpdate /> {updateWord}{" "}
                    {codeChanged ? (
                        <BsExclamationTriangleFill
                            fontSize="18px"
                            color="var(--mainBlue)"
                        />
                    ) : undefined}
                </UiButton>
            )}
            {variants.numVariants > 1 && (
                <VariantSelect
                    darkMode={darkMode}
                    array={variants.allPossibleVariants}
                    syncIndex={variants.index}
                    onChange={(index: number) =>
                        setVariantIndex(setVariants, index)
                    }
                />
            )}
            {showDiagnostics && (
                <AccessibilityStatusButton
                    accessibilityLevel1Count={accessibilityLevel1Count}
                    accessibilityLevel2Count={accessibilityLevel2Count}
                    isAccessibilityReportOpen={isAccessibilityReportOpen}
                    onToggle={onToggleAccessibilityReport}
                />
            )}
        </div>
    );
}
