import React from "react";
import styled, { ThemeProvider } from "styled-components";

const Container = styled.div<{
    vertical?: boolean;
    width?: "menu" | string;
}>`
    display: ${(props) => (props.vertical ? "static" : "flex")};
    width: ${(props) => (props.width == "menu" ? "var(--menuWidth)" : "")};
    /* flex-wrap: wrap; */
    // margin: 2px 0px 2px 0px
    /* overflow: clip; */
`;

export function ButtonGroup(
    props: React.PropsWithChildren<{
        vertical?: boolean;
        width?: "menu" | string;
    }>,
) {
    const buttonGroup = {
        margin: "0px 2px 0px 2px",
        borderRadius: "0",
        padding: "0px 12px 0px 10px",
    };

    const verticalButtonGroup = {
        margin: "4px 4px 4px 4px",
        borderRadius: "0",
        padding: "0px 10px 0px 10px",
    };

    let elem = React.Children.toArray(props.children);
    return (
        <Container vertical={props.vertical} width={props.width}>
            <ThemeProvider
                theme={props.vertical ? verticalButtonGroup : buttonGroup}
            >
                {elem}
            </ThemeProvider>
        </Container>
    );
}
