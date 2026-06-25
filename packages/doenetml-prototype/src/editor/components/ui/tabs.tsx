import React from "react";
import {
    TabProvider,
    TabList,
    Tab as AriakitTab,
    TabPanel as AriakitTabPanel,
} from "@ariakit/react";
import "./tabs.css";

export type TabsProps = {
    children: React.ReactNode;
    defaultSelectedId?: string;
};

type TabDef = {
    key: string;
    eventKey: string;
    title: React.ReactNode;
    children: React.ReactNode;
};

function collectTabs(children: React.ReactNode): TabDef[] {
    const tabs: TabDef[] = [];
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            return;
        }
        // Accept both our Tab and any element with eventKey + title
        const props = child.props as any;
        if (props.eventKey != null) {
            tabs.push({
                key: props.eventKey,
                eventKey: props.eventKey,
                title: props.title,
                children: props.children,
            });
        }
    });
    return tabs;
}

export function Tabs({ children }: TabsProps) {
    const tabs = collectTabs(children);
    const defaultId = tabs[0]?.eventKey;

    return (
        <TabProvider defaultSelectedId={defaultId}>
            <div className="ui-tabs">
                <TabList className="ui-tab-list">
                    {tabs.map((tab) => (
                        <AriakitTab
                            key={tab.eventKey}
                            id={tab.eventKey}
                            className="ui-tab"
                        >
                            {tab.title}
                        </AriakitTab>
                    ))}
                </TabList>
                <div className="ui-tab-content">
                    {tabs.map((tab) => (
                        <AriakitTabPanel
                            key={tab.eventKey}
                            tabId={tab.eventKey}
                            className="ui-tab-panel"
                        >
                            {tab.children}
                        </AriakitTabPanel>
                    ))}
                </div>
            </div>
        </TabProvider>
    );
}

// Tab is only used as a data carrier — Tabs reads its props via collectTabs.
export function Tab(_props: {
    eventKey: string;
    title: React.ReactNode;
    children: React.ReactNode;
}) {
    return null;
}
