import React, { useRef } from "react";
import { Center, Grid, GridItem, Icon } from "@chakra-ui/react";
import { BsGripVertical } from "react-icons/bs";

export const ResizableSideBySide = ({
    panelA,
    panelB,
    centerWidth = "10px",
    width = "100%",
    height = "100%",
}: {
    panelA: React.JSX.Element;
    panelB: React.JSX.Element;
    centerWidth?: string;
    width?: string;
    height?: string;
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const handleClicked = useRef(false);
    const handleDragged = useRef(false);

    const onMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.preventDefault();
        handleClicked.current = true;
    };

    const onMouseMove = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        //TODO: minimum movement calc
        if (handleClicked.current) {
            event.preventDefault();
            handleDragged.current = true;

            let proportion =
                (event.clientX - wrapperRef.current!.offsetLeft) /
                wrapperRef.current!.clientWidth;

            //using a ref to save without react refresh
            wrapperRef.current!.style.gridTemplateColumns = `${proportion}fr ${centerWidth} ${
                1 - proportion
            }fr`;
        }
    };

    const onMouseUp = () => {
        if (handleClicked.current) {
            handleClicked.current = false;
            if (handleDragged.current) {
                handleDragged.current = false;
            }
        }
    };

    return (
        <Grid
            width={width}
            height={height}
            templateAreas={`"panelA middleGutter panelB"`}
            templateColumns={`.5fr ${centerWidth} .5fr`}
            overflow="hidden"
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseUp}
            ref={wrapperRef}
        >
            <GridItem
                area="panelA"
                width="100%"
                placeSelf="center"
                height="100%"
                overflow="hidden"
            >
                {panelA}
            </GridItem>
            <GridItem
                area="middleGutter"
                background="doenet.lightBlue"
                width="100%"
                height="100%"
                alignSelf="start"
            >
                <Center
                    cursor="col-resize"
                    background="doenet.mainGray"
                    borderLeft="solid 1px"
                    borderTop="solid 1px"
                    borderBottom="solid 1px"
                    borderColor="doenet.mediumGray"
                    height={height}
                    width="10px"
                    onMouseDown={onMouseDown}
                    data-test="contentPanelDragHandle"
                    paddingLeft="1px"
                >
                    <Icon ml="0" as={BsGripVertical} />
                </Center>
            </GridItem>
            <GridItem
                area="panelB"
                width="100%"
                placeSelf="center"
                height="100%"
                overflow="hidden"
            >
                {panelB}
            </GridItem>
        </Grid>
    );
};
