import { atom } from "recoil";

export const focusedMathField = atom({
    key: "focusedMathField",
    default: () => {},
});

export const focusedMathFieldReturn = atom({
    key: "focusedMathFieldReturn",
    default: () => {},
});

export const palletRef = atom({
    key: "palletRef",
    default: null,
});

export const handleRef = atom({
    key: "handleRef",
    default: null,
});

export const footerPanelToggle = atom({
    key: "footerPanelToggle",
    default: true,
});
