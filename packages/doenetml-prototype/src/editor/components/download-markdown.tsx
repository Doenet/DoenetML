import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useAppSelector } from "../../state/hooks";
import { doenetSourceSelector } from "../../state/redux-slices/dast";
import { doenetToMarkdown } from "@doenet/lsp-tools";
import { VscMarkdown } from "react-icons/vsc";

export function DownloadMarkdownDropdownItem({
    setFiles,
    setError,
}: {
    setFiles: (files: Record<string, string>) => void;
    setError: (error: string) => void;
}) {
    const source = useAppSelector(doenetSourceSelector);
    return (
        <DropdownItem
            className="icon-button"
            onClick={() => {
                try {
                    const fileList = {
                        "main.md": doenetToMarkdown(source),
                    };
                    setFiles(fileList);
                } catch (e) {
                    setError("Could not convert to Markdown");
                    console.error(e);
                }
            }}
        >
            <VscMarkdown /> Markdown
        </DropdownItem>
    );
}
