import React, { useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function ContentPicker(
    props: UseDoenetRendererProps,
) {
    let {
        name,
        id,
        SVs,
        children,
        actions,
        ignoreUpdate,
        rendererName,
        callAction,
    } = useDoenetRenderer(props);

    // @ts-ignore
    ContentPicker.baseStateVariable = "selectedIndices";

    const [rendererSelectedIndices, setRendererSelectedIndices] = useState(
        SVs.selectedIndices,
    );

    let selectedIndicesWhenSetState = useRef(null);

    if (
        !ignoreUpdate &&
        selectedIndicesWhenSetState.current !== SVs.selectedIndices
    ) {
        setRendererSelectedIndices(SVs.selectedIndices);
        selectedIndicesWhenSetState.current = SVs.selectedIndices;
    } else {
        selectedIndicesWhenSetState.current = null;
    }

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        let newSelectedIndices: number[] = [];

        if (e.target.value) {
            newSelectedIndices = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value),
            );
        }

        if (
            rendererSelectedIndices.length !== newSelectedIndices.length ||
            rendererSelectedIndices.some((v, i) => v != newSelectedIndices[i])
        ) {
            setRendererSelectedIndices(newSelectedIndices);
            selectedIndicesWhenSetState.current = SVs.selectedIndices;

            callAction({
                action: actions.updateSelectedIndices,
                args: {
                    selectedIndices: newSelectedIndices,
                },
                baseVariableValue: newSelectedIndices,
            });
        }
    }

    if (SVs.hidden) {
        return null;
    }

    let options = [];

    if (SVs.separateByTopic) {
        for (let topic in SVs.childrenByTopic) {
            let childIndices = SVs.childrenByTopic[topic];

            let optionsList = childIndices.map(function (ind: number) {
                return (
                    <option key={ind + 1} value={ind + 1}>
                        {SVs.childInfo[ind].title}
                    </option>
                );
            });

            options.push(
                <optgroup label={topic} key={topic}>
                    {optionsList}
                </optgroup>,
            );
        }
    } else {
        options = SVs.childInfo.map(function (obj, ind) {
            return (
                <option key={ind + 1} value={ind + 1}>
                    {obj.title}
                </option>
            );
        });
    }

    let value = rendererSelectedIndices[0];

    if (value === undefined) {
        value == "";
    }

    let label = null;

    if (SVs.label) {
        label = SVs.label + ": ";
    }

    let picker = (
        <p>
            <label>
                {label}
                <select
                    className="custom-select"
                    id={id + "-select"}
                    onChange={onChangeHandler}
                    value={value}
                    disabled={SVs.disabled}
                >
                    {options}
                </select>
            </label>
        </p>
    );

    if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    return (
        <section id={id} ref={ref}>
            {picker}
            {children}
        </section>
    );
});
