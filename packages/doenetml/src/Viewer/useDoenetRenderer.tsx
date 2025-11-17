import React, { useEffect, useState } from "react";
import { renderersLoadComponent } from "./DocViewer";
import { ComponentInfo, mainSlice, useAppSelector } from "../state";
import { DoenetMLFlags } from "../doenetml";

export type UseDoenetRendererProps = {
    coreId: string;
    componentInstructions: {
        actions: Record<string, { actionName: string; componentIdx: number }>;
        componentIdx: number;
        effectiveIdx: number;
        id: string;
        componentType: string;
        rendererType: string;
    };
    rendererClasses: Record<string, any>;
    docId: string;
    activityId: string;
    callAction: (argObj: Record<string, any>) => void;
    doenetViewerUrl?: string;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    requestScrollTo?: (offset: number) => void;
    flags: DoenetMLFlags;
};

// TODO: potentially remove initializeChildrenOnConstruction
/**
 * Hook to retrieve the state variables needed to render a component
 */
export default function useDoenetRenderer(
    props: UseDoenetRendererProps,
    initializeChildrenOnConstruction = true,
) {
    const actions = props.componentInstructions.actions;
    const componentIdx = props.componentInstructions.componentIdx;
    const effectiveIdx = props.componentInstructions.effectiveIdx;
    const id = props.componentInstructions.id;
    const rendererName = props.coreId + componentIdx;
    const [renderersToLoad, setRenderersToLoad] = useState({});
    const componentInfo = useAppSelector(
        (state) => mainSlice.selectors.componentInfo(state)[rendererName],
    );

    const {
        stateValues,
        sourceOfUpdate = {},
        ignoreUpdate,
        childrenInstructions,
        prefixForIds,
    }: ComponentInfo = componentInfo || {
        stateValues: {},
        sourceOfUpdate: {},
        ignoreUpdate: false,
        childrenInstructions: [],
        prefixForIds: "",
    };

    //TODO: Fix this for graph
    // if (initializeChildrenOnConstruction
    let children: React.ReactNode[] = [];
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
            fetchExternalDoenetML: props.fetchExternalDoenetML,
            requestScrollTo: props.requestScrollTo,
            flags: props.flags,
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
                                `./renderers/${childInstructions.rendererType}.tsx`
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
        componentIdx: effectiveIdx,
        id: prefixForIds + id,
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
        doenetViewerUrl: props.doenetViewerUrl,
        fetchExternalDoenetML: props.fetchExternalDoenetML,
        requestScrollTo: props.requestScrollTo,
        flags: props.flags,
    };
}
