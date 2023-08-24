import { RecoilState, atom } from "recoil";

export const focusedMathField = atom<(command: string) => void>({
    key: "focusedMathField",
    default: () => {},
});

export const focusedMathFieldReturn = atom({
    key: "focusedMathFieldReturn",
    default: () => {},
});

export const palletRef = atom<React.MutableRefObject<null> | null>({
    key: "palletRef",
    default: null,
});

export const handleRef = atom<React.MutableRefObject<null> | null>({
    key: "handleRef",
    default: null,
});

export const footerPanelToggle = atom({
    key: "footerPanelToggle",
    default: true,
});
