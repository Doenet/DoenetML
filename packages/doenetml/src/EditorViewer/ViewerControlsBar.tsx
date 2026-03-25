import React from "react";
import { UiButton } from "@doenet/ui-components";
import { RxUpdate } from "react-icons/rx";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { AccessibilityStatusButton } from "./AccessibilityStatusButton";
// @ts-ignore
import VariantSelect from "./VariantSelect";

type VariantsState = {
    index: number;
    numVariants: number;
    allPossibleVariants: string[];
};

/**
 * Header controls above the viewer: update/reset, variant selection, and accessibility status.
 */
export function ViewerControlsBar({
    id,
    readOnly,
    codeChanged,
    documentInteracted,
    platform,
    updateWord,
    onUpdateViewer,
    variants,
    setVariants,
    showDiagnostics,
    accessibilityLevel1Count,
    accessibilityLevel2Count,
    isAccessibilityReportOpen,
    onToggleAccessibilityReport,
}: {
    id: string;
    readOnly: boolean;
    codeChanged: boolean;
    documentInteracted: boolean;
    platform: "Mac" | "Win" | "Linux";
    updateWord: string;
    onUpdateViewer: () => void;
    variants: VariantsState;
    setVariants: React.Dispatch<React.SetStateAction<VariantsState>>;
    showDiagnostics: boolean;
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
    isAccessibilityReportOpen: boolean;
    onToggleAccessibilityReport: () => void;
}) {
    return (
        <div className="viewer-controls" id={`${id}-viewer-controls`}>
            {!readOnly && (
                <UiButton
                    data-test="Viewer Update Button"
                    disabled={!codeChanged && !documentInteracted}
                    title={
                        platform == "Mac"
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
                    size="sm"
                    menuWidth="140px"
                    array={variants.allPossibleVariants}
                    syncIndex={variants.index}
                    onChange={(index: number) =>
                        setVariants((prev) => {
                            let next = { ...prev };
                            next.index = index + 1;
                            return next;
                        })
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
