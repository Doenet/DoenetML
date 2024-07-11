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

export function DownloadPretextDropdownItem({
    setFiles,
}: {
    setFiles: (files: Record<string, string>) => void;
}) {
    const flatDast = useAppSelector(flatDastSelector);
    return (
        <DropdownItem
            className="icon-button"
            onClick={() => {
                const fileList = {
                    "main.ptx": renderToPretext(flatDast),
                };
                setFiles(fileList);
            }}
        >
            <VscCode /> PreTeXt
        </DropdownItem>
    );
}
