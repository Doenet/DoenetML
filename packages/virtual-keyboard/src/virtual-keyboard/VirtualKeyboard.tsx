import React, { useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useRecoilValue, useSetRecoilState } from "recoil";

import {
    focusedMathField,
    palletRef,
    focusedMathFieldReturn,
} from "../MathInputSelector";

import { ControlledVirtualKeyboard } from "./ControlledVirtualKeyboard";

export function VirtualKeyboard() {
    console.log("Render non-existant virtual keyboard");
    return (<div></div>);
}

/**
 * Virtual keyboard that is connected via Recoil to math elements.
 */
export function VirtualKeyboardOld() {
    console.log("Render virtual keyboard, hopefully with no recoil?");
    // const callback = useRecoilValue(focusedMathField);
    const callback = useCallback(() => {}, []);
    // const returnCallback = useRecoilValue(focusedMathFieldReturn);
    // const setPalletRef = useSetRecoilState(palletRef);

    const returnCallback = useCallback(() => {}, []);
    const setPalletRef = useCallback(() => {}, []);
    // const {
    //     isOpen: keyboardIsOpen,
    //     // onOpen: keyboardOnOpen,
    //     onClose: keyboardOnClose,
    //     onToggle: keyboardOnToggle,
    // } = useDisclosure();

    return (
        <ControlledVirtualKeyboard
            callback={callback}
            returnCallback={returnCallback}
            setPalletRef={setPalletRef}
            isOpen={true}
            onClose={useCallback(() => {}, [])}
            onToggle={useCallback(() => {}, [])}
        />
    );
}
