import * as Ariakit from "@ariakit/react";
import React, { useEffect, useState } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import type { ResolvedTheme } from "../utils/theme";
import "./variant-select.css";

export default function VariantSelect({
    darkMode = "light",
    array = [],
    onChange = () => {},
    syncIndex, //Optional attribute to keep several variant selects in sync
}: {
    darkMode?: ResolvedTheme;
    array: string[];
    onChange: (index: number) => void;
    syncIndex?: number;
}) {
    const [index, setIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const value = array[index] ?? "";

    function selectIndex(nextIndex: number) {
        setIndex(nextIndex);
        setInputValue("");
        onChange(nextIndex);
    }

    useEffect(() => {
        if (syncIndex != undefined && index != syncIndex - 1) {
            setIndex(syncIndex - 1);
            setInputValue("");
        }
    }, [index, syncIndex, array]);

    const filteredArray = array.filter((string) =>
        inputValue === "" ? true : string.includes(inputValue),
    );
    const matches = filteredArray.length > 0 ? filteredArray : array;
    return (
        <div className="variant-select">
            <div className="wrapper">
                <Ariakit.ComboboxProvider
                    resetValueOnHide
                    setValue={(value) => {
                        React.startTransition(() => {
                            setInputValue(value);
                        });
                    }}
                >
                    <Ariakit.SelectProvider
                        value={value}
                        setValue={(val) => {
                            const nextIndex = array.indexOf(val);
                            if (nextIndex !== -1) {
                                selectIndex(nextIndex);
                            }
                        }}
                    >
                        <Ariakit.Select
                            className="doenet-ui-button button select-button"
                            title="Variant"
                        />
                        <Ariakit.SelectPopover
                            gutter={4}
                            sameWidth
                            data-theme={darkMode}
                            className="popover"
                        >
                            <div className="combobox-wrapper">
                                <Ariakit.Combobox
                                    autoSelect
                                    placeholder="Filter..."
                                    className="combobox"
                                />
                            </div>
                            <Ariakit.ComboboxList>
                                {matches.map((value) => (
                                    <Ariakit.SelectItem
                                        key={value}
                                        value={value}
                                        className="select-item"
                                        render={<Ariakit.ComboboxItem />}
                                    />
                                ))}
                            </Ariakit.ComboboxList>
                        </Ariakit.SelectPopover>
                    </Ariakit.SelectProvider>
                </Ariakit.ComboboxProvider>
            </div>
            <Ariakit.Button
                title="Select next variant"
                data-test="Next Variant"
                className="doenet-ui-button button prev-next-button"
                disabled={index == array.length - 1}
                onClick={() => {
                    if (index == array.length - 1) {
                        return;
                    }
                    selectIndex(index + 1);
                }}
            >
                <BsCaretDownFill />
            </Ariakit.Button>
            <Ariakit.Button
                title="Select previous variant"
                data-test="Previous Variant"
                className="doenet-ui-button button prev-next-button"
                disabled={index < 1}
                onClick={() => {
                    if (index < 1) {
                        return;
                    }
                    selectIndex(index - 1);
                }}
            >
                <BsCaretUpFill />
            </Ariakit.Button>
        </div>
    );
}
