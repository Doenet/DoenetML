import { Transaction } from "@codemirror/state";
import { Command, keymap } from "@codemirror/view";

// XXX: this extension appears to do nothing!

//tabs = 2 spaces
const tab = "  ";
const tabCommand: Command = ({ state, dispatch }) => {
    console.log("running")
    dispatch(
        state.update(state.replaceSelection(tab), {
            scrollIntoView: true,
            annotations: Transaction.userEvent.of("input"),
        }),
    );
    return true;
};

export const tabExtension = keymap.of([
    {
        key: "Tab",
        run: tabCommand,
    },
]);
