import React, { useCallback, useEffect, useRef } from "react";
import { Center, Grid, GridItem, Icon } from "@chakra-ui/react";
import { BsGripHorizontal } from "react-icons/bs";

export const ResizableCollapsiblePanelPair = ({
    mainPanel,
    subPanel,
    centerWidth = "10px",
    closedHeight = "32px",
    width = "100%",
    height = "100%",
    border = "none",
    isOpen,
    setIsOpen,
}: {
    mainPanel: React.JSX.Element;
    subPanel: React.JSX.Element;
    centerWidth?: string;
    closedHeight?: string;
    width?: string;
    height?: string;
    border?: string;
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const handleClicked = useRef(false);
    const handleDragged = useRef(false);

    const proportion = useRef(0.8);

    useEffect(() => {
        if (wrapperRef.current) {
            if (isOpen) {
                wrapperRef.current.style.gridTemplateRows = `${proportion.current}fr ${centerWidth} ${
                    1 - proportion.current
                }fr`;
            } else {
                wrapperRef.current.style.gridTemplateRows = `1fr 0px ${closedHeight}`;
            }
        }
    }, [isOpen]);

    const onMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.preventDefault();
        handleClicked.current = true;
    };

    const onMouseMove = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            //TODO: minimum movement calc
            if (handleClicked.current) {
                event.preventDefault();
                handleDragged.current = true;

                proportion.current =
                    (event.clientY - wrapperRef.current!.offsetTop) /
                    wrapperRef.current!.clientHeight;

                //using a ref to save without react refresh
                wrapperRef.current!.style.gridTemplateRows = `${proportion.current}fr ${centerWidth} ${
                    1 - proportion.current
                }fr`;
            }
        },
        [],
    );

    const onMouseUp = () => {
        if (handleClicked.current) {
            handleClicked.current = false;
            if (handleDragged.current) {
                handleDragged.current = false;
                if (proportion.current > 0.95) {
                    setIsOpen(false);
                    proportion.current = 0.8;
                }
            }
        }
    };

    const templateAreas = `"panelA"
                         "middleGutter"
                         "panelB"`;
    const gridTemplateRows = `0.5fr ${centerWidth} 0.5fr`;
    const gutterHeight = centerWidth;
    const gutterWidth = "100%";
    const gutterIcon = BsGripHorizontal;
    const gutterCursor = "row-resize";

    return (
        <Grid
            width={width}
            height={height}
            border={border}
            boxSizing="border-box"
            templateAreas={templateAreas}
            gridTemplateRows={gridTemplateRows}
            overflow="hidden"
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseUp}
            ref={wrapperRef}
        >
            <GridItem
                area="panelA"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
            >
                {mainPanel}
            </GridItem>
            <GridItem
                area="middleGutter"
                width="100%"
                height="100%"
                placeSelf="center"
            >
                <Center
                    hidden={!isOpen}
                    cursor={gutterCursor}
                    background="doenet.mainGray"
                    boxSizing="border-box"
                    border="solid 1px"
                    borderColor="doenet.mediumGray"
                    height={gutterHeight}
                    width={gutterWidth}
                    onMouseDown={onMouseDown}
                    data-test="contentPanelDragHandle"
                >
                    <Icon ml="0" as={gutterIcon} />
                </Center>
            </GridItem>
            <GridItem
                area="panelB"
                width="100%"
                height="100%"
                placeSelf="center"
                overflow="hidden"
            >
                {subPanel}
            </GridItem>
        </Grid>
    );
};
