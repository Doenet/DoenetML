import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";

const Container = styled.div<{
    vertical?: boolean;
    width?: "menu" | string;
}>`
    display: ${(props) => (props.vertical ? "static" : "flex")};
    width: ${(props) => (props.width == "menu" ? "var(--menuWidth)" : "")};
    // height: 'fit-content';
    // margin: 2px 0px 2px 0px ;
    /* flex-wrap: wrap; */
    overflow: clip;
`;

const toggleGroup = {
    margin: "0px -2px 0px -2px",
    borderRadius: "0",
    padding: "0px 12px 0px 10px",
};

const verticalToggleGroup = {
    margin: "-2px 4px -2px 4px",
    borderRadius: "0",
    padding: "0px 10px 0px 10px",
};

export const ToggleButtonGroup = (
    props: React.PropsWithChildren<{
        onClick?: (index: number) => void;
        vertical?: boolean;
        width?: "menu" | string;
    }>,
) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = (index: number) => {
        setSelectedIndex(index);
        if (props.onClick) {
            props.onClick(index);
        }
    };

    let first_prop = props.vertical ? "first_vert" : "first";
    let last_prop = props.vertical ? "last_vert" : "last";

    let elem = React.Children.toArray(props.children);

    let modElem = elem.map((element, index) => {
        if (!React.isValidElement(element)) {
            return element; // Skip non-element children
        }
        let props = {
            index,
            isSelected: index === selectedIndex,
            onClick: handleClick,
        };

        // XXX: What is this? Why is `props` being mutated??
        if (index === 0) {
            props["num"] = first_prop;
        } else if (index === elem.length - 1) {
            props["num"] = last_prop;
        }

        return React.cloneElement(element, props);
    });

    return (
        <Container
            style={{ height: "fit-content" }}
            vertical={props.vertical}
            width={props.width}
            role="group"
        >
            <ThemeProvider
                theme={props.vertical ? verticalToggleGroup : toggleGroup}
            >
                {modElem}
            </ThemeProvider>
        </Container>
    );
};
