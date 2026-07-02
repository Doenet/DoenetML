import React from "react";
import { DropdownItem } from "./ui/dropdown";
import { useAppSelector } from "../../state/hooks";
import {
    errorsSelector,
    flatDastSelector,
} from "../../state/redux-slices/dast";
import {
    renderFlatDastToPretext,
    extractImages,
} from "@doenet/doenetml-to-pretext/pretext-xml";
import { VscCode } from "react-icons/vsc";
import type { FlatDastRoot } from "@doenet/doenetml-worker-rust";

export function DownloadPretextDropdownItem({
    setFiles,
    setError,
}: {
    setFiles: (files: Record<string, string>) => void;
    setError: (error: string) => void;
}) {
    const { elements, ...rest } = useAppSelector(flatDastSelector);
    const errors = useAppSelector(errorsSelector);
    const flatDast = {
        ...rest,
        elements: elements.filter((e) => e.type === "element"),
    } as FlatDastRoot;
    return (
        <DropdownItem
            className="icon-button"
            onClick={() => {
                if (errors.length > 0) {
                    setError(errors.map((e) => e.message).join(";\n"));
                    return;
                }
                try {
                    const rendered = renderFlatDastToPretext(flatDast);
                    const fileList = extractImages(rendered);
                    setFiles(fileList);
                } catch (e) {
                    setError("Could not convert to PreTeXt");
                    console.error(e);
                }
            }}
        >
            <VscCode /> PreTeXt
        </DropdownItem>
    );
}
