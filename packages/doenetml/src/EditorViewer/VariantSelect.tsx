import {
    Box,
    Button,
    HStack,
    Icon,
    IconButton,
    Input,
    Menu,
    MenuItem,
    Portal,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "../components/tooltip";
import { BsCaretDownFill, BsCaretUpFill, BsChevronDown } from "react-icons/bs";

export default function VariantSelect({
    size = "sm",
    menuWidth,
    array = [],
    onChange = () => {},
    syncIndex, //Optional attribute to keep several variant selects in sync
}: {
    size: "sm" | "md" | "lg";
    menuWidth: string;
    array: string[];
    onChange: (index: number) => void;
    syncIndex?: number;
}) {
    const [index, setIndex] = useState(0);
    const [value, setValue] = useState(array[index]);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const [showTooltip, setShowTooltip] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    useEffect(() => {
        if (syncIndex != undefined && index != syncIndex - 1) {
            setIndex(syncIndex - 1);
            setValue(array[syncIndex - 1]);
        }
    }, [index, syncIndex, array]);

    const filteredArray = array.filter((string) =>
        inputValue === "" ? true : string.includes(inputValue),
    );
    return (
        <>
            <HStack m={0} borderRadius="lg">
                <Menu.Root
                    onOpenChange={(details) => {
                        if (details.open) {
                            setShowTooltip(false);
                            setMenuIsOpen(true);
                        } else {
                            setShowTooltip(false);
                            setMenuIsOpen(false);
                        }
                    }}
                >
                    <Menu.Trigger>
                        <Tooltip showArrow content="Variant" open={showTooltip}>
                            <Button
                                data-test="Variant Select Menu Button"
                                borderBottomRightRadius={0}
                                borderTopRightRadius={0}
                                size={size}
                                as={Button}
                                width={menuWidth ? menuWidth : undefined}
                                borderWidth={1}
                                onMouseEnter={() => {
                                    !menuIsOpen ? setShowTooltip(true) : null;
                                }}
                                onMouseLeave={() => {
                                    setShowTooltip(false);
                                }}
                                aria-label="Select variant menu button"
                            >
                                <Icon>
                                    <BsChevronDown />
                                </Icon>
                                {value}
                            </Button>
                        </Tooltip>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Content>
                            <Menu.Item value="">
                                <Box>hi</Box>
                            </Menu.Item>
                        </Menu.Content>
                    </Portal>
                </Menu.Root>
                {/* <Menu>
                    <MenuList pt={0} maxHeight="400px" overflowY="auto">
                        <Input
                            m={0}
                            ref={inputRef}
                            data-test="Variant Select Filter Input"
                            placeholder="Filter"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                inputRef.current!.focus();
                            }}
                        />
                        {filteredArray.map((val, index) => {
                            return (
                                <MenuItem
                                    key={`mi${index}`}
                                    data-test={`Variant Select Menu Item ${index}`}
                                    borderWidth={1}
                                    onClick={() => {
                                        const index = array.indexOf(val);
                                        setIndex(index);
                                        setValue(val);
                                        setInputValue("");
                                        onChange(index);
                                    }}
                                >
                                    {val}
                                </MenuItem>
                            );
                        })}
                    </MenuList>
                </Menu> */}

                <Tooltip showArrow content="Next variant">
                    <IconButton
                        disabled={index == array.length - 1}
                        data-test="Variant Select Down Button"
                        borderRadius={0}
                        size={size}
                        m={0}
                        aria-label="Select next variant button"
                        borderWidth={1}
                        onClick={() => {
                            if (index == array.length - 1) {
                                return;
                            }
                            const nextIndex = index + 1;
                            setIndex(nextIndex);
                            setValue(array[nextIndex]);
                            setInputValue("");
                            onChange(nextIndex);
                        }}
                    >
                        <BsCaretDownFill />
                    </IconButton>
                </Tooltip>
                <Tooltip showArrow content="Previous variant">
                    <IconButton
                        disabled={index < 1}
                        data-test="Variant Select Up Button"
                        size={size}
                        borderBottomLeftRadius={0}
                        borderTopLeftRadius={0}
                        m={0}
                        aria-label="Select previous variant button"
                        borderWidth={1}
                        onClick={() => {
                            if (index < 1) {
                                return;
                            }
                            const nextIndex = index - 1;
                            setIndex(nextIndex);
                            setValue(array[nextIndex]);
                            setInputValue("");
                            onChange(nextIndex);
                        }}
                    >
                        <BsCaretUpFill />
                    </IconButton>
                </Tooltip>
            </HStack>
        </>
    );
}
