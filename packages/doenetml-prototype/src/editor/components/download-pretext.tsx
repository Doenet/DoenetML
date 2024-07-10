import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useAppSelector } from "../../state/hooks";
import {
    _dastReducerActions,
    flatDastSelector,
} from "../../state/redux-slices/dast";
import { toXml } from "xast-util-to-xml";
import { _globalReducerActions } from "../../state/redux-slices/global";
import { renderToPretext } from "../../utils/pretext/render-to-pretext";

export function DownloadPretextDropdownItem() {
    const flatDast = useAppSelector(flatDastSelector);
    return (
        <DropdownItem
            onClick={() => {
                console.log(flatDast);
                console.log(renderToPretext(flatDast));
            }}
        >
            PreTeXt
        </DropdownItem>
    );
}
