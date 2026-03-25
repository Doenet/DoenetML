import React from "react";
import { UiButton } from "@doenet/ui-components";
import {
    Select,
    SelectItem,
    SelectLabel,
    SelectPopover,
    SelectProvider,
} from "@ariakit/react";

/**
 * Footer bar for editor formatting controls and the current DoenetML version.
 */
export function FormatterVersionBar({
    showFormatter,
    setFormatAsDoenetML,
    onFormat,
}: {
    showFormatter: boolean;
    setFormatAsDoenetML: (value: boolean) => void;
    onFormat: () => void;
}) {
    return (
        <div className="formatter-and-version">
            {showFormatter ? (
                <>
                    <SelectProvider
                        defaultValue={"DoenetML"}
                        setValue={(value) => {
                            setFormatAsDoenetML(value === "DoenetML");
                        }}
                    >
                        <SelectLabel className="label">Format as</SelectLabel>
                        <div className="wrapper">
                            <Select
                                className="button"
                                data-test="Format As Select"
                            />
                        </div>
                        <SelectPopover
                            sameWidth
                            gutter={2}
                            className="popover"
                            data-test="Format As Select Popover"
                        >
                            <SelectItem
                                className="select-item"
                                value="DoenetML"
                            />
                            <SelectItem className="select-item" value="XML" />
                        </SelectPopover>
                    </SelectProvider>
                    <UiButton
                        title="Format your source code"
                        data-test="Format DoenetML Button"
                        onClick={onFormat}
                    >
                        Format
                    </UiButton>
                </>
            ) : null}
            <div className="doenetml-version" title="DoenetML version">
                Version: {DOENETML_VERSION}
            </div>
        </div>
    );
}
