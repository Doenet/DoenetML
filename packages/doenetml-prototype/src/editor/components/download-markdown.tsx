import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useAppSelector } from "../../state/hooks";
import { doenetSourceSelector } from "../../state/redux-slices/dast";
import { doenetToMarkdown } from "@doenet/lsp-tools";

export function DownloadMarkdownDropdownItem() {
    const source = useAppSelector(doenetSourceSelector);
    return (
        <DropdownItem
            onClick={() => {
                console.log(doenetToMarkdown(source));
            }}
        >
            Markdown
        </DropdownItem>
    );
}
