import React from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useRecoilValue, useSetRecoilState } from "recoil";

import {
    focusedMathField,
    palletRef,
    focusedMathFieldReturn,
} from "../MathInputSelector";

import { ControlledVirtualKeyboard } from "./ControlledVirtualKeyboard";

/**
 * Virtual keyboard that is connected via Recoil to math elements.
 */
export function VirtualKeyboard() {
    const callback = useRecoilValue(focusedMathField);
    const returnCallback = useRecoilValue(focusedMathFieldReturn);
    const setPalletRef = useSetRecoilState(palletRef);

    const {
        isOpen: keyboardIsOpen,
        // onOpen: keyboardOnOpen,
        onClose: keyboardOnClose,
        onToggle: keyboardOnToggle,
    } = useDisclosure();

    return (
        <ControlledVirtualKeyboard
            callback={callback}
            returnCallback={returnCallback}
            setPalletRef={setPalletRef}
            isOpen={keyboardIsOpen}
            onClose={keyboardOnClose}
            onToggle={keyboardOnToggle}
        />
    );
}
