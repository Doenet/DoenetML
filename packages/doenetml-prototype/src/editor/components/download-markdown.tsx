import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useAppSelector } from "../../state/hooks";
import { doenetSourceSelector } from "../../state/redux-slices/dast";
import { doenetToMarkdown } from "@doenet/lsp-tools";
import { VscMarkdown } from "react-icons/vsc";

export function DownloadMarkdownDropdownItem({
    setFiles,
}: {
    setFiles: (files: Record<string, string>) => void;
}) {
    const source = useAppSelector(doenetSourceSelector);
    return (
        <DropdownItem
            className="icon-button"
            onClick={() => {
                const fileList = {
                    "main.md": doenetToMarkdown(source),
                };
                setFiles(fileList);
            }}
        >
            <VscMarkdown /> Markdown
        </DropdownItem>
    );
}
