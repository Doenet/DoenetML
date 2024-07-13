import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useAppSelector } from "../../state/hooks";
import {
    _dastReducerActions,
    flatDastSelector,
} from "../../state/redux-slices/dast";
import { _globalReducerActions } from "../../state/redux-slices/global";
import { renderToPretext } from "../../utils/pretext/render-to-pretext";
import { VscCode } from "react-icons/vsc";
import { FlatDastRoot } from "../../../../doenetml-worker-rust/dist/CoreWorker";
import { extractImages } from "../../utils/pretext/extract-images";

export function DownloadPretextDropdownItem({
    setFiles,
    setError,
}: {
    setFiles: (files: Record<string, string>) => void;
    setError: (error: string) => void;
}) {
    const { elements, ...rest } = useAppSelector(flatDastSelector);
    // The flat dast may have errors in it. None of these errors should be shown when converting to PreTeXt.
    const flatDast = {
        ...rest,
        elements: elements.filter((e) => e.type === "element"),
    } as FlatDastRoot;
    return (
        <DropdownItem
            className="icon-button"
            onClick={() => {
                try {
                    const rendered = renderToPretext(flatDast);
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
