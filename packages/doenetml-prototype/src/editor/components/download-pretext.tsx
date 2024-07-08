import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useAppSelector } from "../../state/hooks";
import { flatDastSelector } from "../../state/redux-slices/dast";
import { doenetToMarkdown, doenetToPretext } from "@doenet/lsp-tools";
import { toXml } from "xast-util-to-xml";

export function DownloadPretextDropdownItem() {
    const flatDast = useAppSelector(flatDastSelector);
    return (
        <DropdownItem
            onClick={() => {
                console.log(flatDast);
                console.log(toXml(doenetToPretext(flatDast)));
            }}
        >
            PreTeXt
        </DropdownItem>
    );
}
