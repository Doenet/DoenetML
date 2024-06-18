import React from "react";
import { Keyboard, OnClick, Style } from "./keyboard";
import {
    Tab,
    TabList,
    TabPanel,
    TabProvider,
    useTabStore,
} from "@ariakit/react";

/**
 * A keyboard with a tab strip allowing the user to switch between different keyboard styles.
 */
export function ManagedKeyboard({ onClick }: { onClick: OnClick }) {
    const [style, setStyle] = React.useState<Style>("numeric");
    const store = useTabStore();
    const storeState = store.useState();

    React.useEffect(() => {
        if (!storeState.activeId) {
            return;
        }
        if (style !== storeState.activeId) {
            if (
                ["alpha_lower", "alpha_upper"].includes(storeState.activeId) &&
                ["alpha_lower", "alpha_upper"].includes(style)
            ) {
                // These two styles are represented by a single tab
                return;
            }
            if (
                ["greek_lower", "greek_upper"].includes(storeState.activeId) &&
                ["greek_lower", "greek_upper"].includes(style)
            ) {
                // These two styles are represented by a single tab
                return;
            }
            setStyle(storeState.activeId as Style);
        }
    }, [storeState, style]);

    const wrappedOnClick = React.useCallback<OnClick>(
        (e) => {
            const firstPress = e.commands[0];
            if (!firstPress) {
                return;
            }
            if (firstPress.type === "cmd" && firstPress.command === "Shift") {
                switch (style) {
                    case "alpha_lower":
                        setStyle("alpha_upper");
                        break;
                    case "alpha_upper":
                        setStyle("alpha_lower");
                        break;
                    case "greek_lower":
                        setStyle("greek_upper");
                        break;
                    case "greek_upper":
                        setStyle("greek_lower");
                        break;
                }
                // Don't report the shift key
                return;
            }
            onClick(e);
        },
        [style],
    );

    return (
        <TabProvider>
            <TabList className="virtual-keyboard-tab-list">
                <Tab store={store} id="numeric">
                    123
                </Tab>
                <Tab store={store} id="function">
                    f(x)
                </Tab>
                <Tab store={store} id="alpha_lower">
                    ABC
                </Tab>
                <Tab store={store} id="greek_lower">
                    αβγ
                </Tab>
                <Tab store={store} id="symbol">
                    $%∞
                </Tab>
            </TabList>
            <Keyboard style={style} onClick={wrappedOnClick} />
        </TabProvider>
    );
}
