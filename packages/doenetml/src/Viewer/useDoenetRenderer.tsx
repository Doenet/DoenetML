import React, { useEffect, useState } from "react";
import { atomFamily, useRecoilValue, useSetRecoilState } from "recoil";
// import { serializedComponentsReviver } from '@doenet/utils';
import { renderersLoadComponent } from "./DocViewer";

export const rendererState = atomFamily<
    {
        stateValues: Record<string, any>;
        sourceOfUpdate?: Record<string, any>;
        ignoreUpdate: boolean;
        childrenInstructions: Record<string, any>[];
        prefixForIds: string;
    },
    string
>({
    key: "rendererState",
    default: {
        stateValues: {},
        sourceOfUpdate: {},
        ignoreUpdate: false,
        childrenInstructions: [],
        prefixForIds: "",
    },
    // dangerouslyAllowMutability: true,
});

// TODO: potentially remove initializeChildrenOnConstruction
export default function useDoenetRenderer(
    props: Record<string, any>,
    initializeChildrenOnConstruction = true,
) {
    let actions = props.componentInstructions.actions;
    let componentIdx = props.componentInstructions.componentIdx;
    let effectiveName = props.componentInstructions.effectiveName;
    let rendererName = props.coreId + componentIdx;
    let [renderersToLoad, setRenderersToLoad] = useState({});

    let {
        stateValues,
        sourceOfUpdate = {},
        ignoreUpdate,
        childrenInstructions,
        prefixForIds,
    } = useRecoilValue(rendererState(rendererName));

    //TODO: Fix this for graph
    // if (initializeChildrenOnConstruction
    let children = [];
    const loadMoreRenderers = Object.keys(renderersToLoad).length === 0;
    for (let childInstructions of childrenInstructions) {
        let child = createChildFromInstructions(
            childInstructions,
            loadMoreRenderers,
        );
        children.push(child);
    }

    useEffect(() => {
        if (Object.keys(renderersToLoad).length > 0) {
            renderersLoadComponent(
                Object.values(renderersToLoad),
                Object.keys(renderersToLoad),
            ).then((newRendererClasses) => {
                Object.assign(props.rendererClasses, newRendererClasses);
                setRenderersToLoad({});
            });
        }
    }, [renderersToLoad, props.rendererClasses]);

    function createChildFromInstructions(
        childInstructions: Record<string, any> | string | null,
        loadMoreRenderers: boolean,
    ) {
        if (
            typeof childInstructions === "string" ||
            childInstructions === null
        ) {
            return childInstructions;
        }

        let propsForChild = {
            key: props.coreId + childInstructions.componentIdx,
            componentInstructions: childInstructions,
            rendererClasses: props.rendererClasses,
            coreId: props.coreId,
            docId: props.docId,
            activityId: props.activityId,
            callAction: props.callAction,
        };

        let rendererClass =
            props.rendererClasses[childInstructions.rendererType];

        if (!rendererClass) {
            //If we don't have the component then attempt to load it
            if (loadMoreRenderers) {
                setRenderersToLoad((old: Promise<any>[]) => {
                    let rendererPromises = { ...old };
                    if (!(childInstructions.rendererType in rendererPromises)) {
                        rendererPromises[childInstructions.rendererType] =
                            import(
                                `./renderers/${childInstructions.rendererType}.jsx`
                            );
                    }
                    return rendererPromises;
                });
            }

            return null; //skip the child for now
        }

        let child = React.createElement(rendererClass, propsForChild);
        return child;
    }

    let rendererType = props.componentInstructions.rendererType;
    const callAction = (argObj: Record<string, any>) => {
        if (!argObj.componentIdx) {
            argObj = { ...argObj };
            argObj.componentIdx = componentIdx;
        }
        if (!argObj.rendererType) {
            argObj = { ...argObj };
            argObj.rendererType = rendererType;
        }
        return props.callAction(argObj);
    };

    return {
        name: effectiveName,
        id: prefixForIds + effectiveName,
        SVs: stateValues,
        docId: props.docId,
        activityId: props.activityId,
        actions,
        children,
        sourceOfUpdate,
        ignoreUpdate,
        rendererName,
        initializeChildren: () => {},
        callAction,
        linkSettings: props.linkSettings,
        scrollableContainer: props.scrollableContainer,
    };
}
