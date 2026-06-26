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

/**
 * Header controls above the viewer: update/reset, variant selection, and accessibility status.
 */
export function ViewerControlsBar({
    id,
    readOnly,
    codeChanged,
    documentInteracted,
    updateWord,
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
    updateWord: string;
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
    return (
        <div className="viewer-controls" id={`${id}-viewer-controls`}>
            {!readOnly && (
                <UiButton
                    data-test="Viewer Update Button"
                    disabled={!codeChanged && !documentInteracted}
                    title={
                        isMacPlatform()
                            ? `${updateWord} Viewer cmd+s`
                            : `${updateWord} Viewer ctrl+s`
                    }
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
