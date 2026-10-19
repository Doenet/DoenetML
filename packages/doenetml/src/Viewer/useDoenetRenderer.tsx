import React, { useEffect, useState } from "react";
import { renderersLoadComponent } from "./renderersLoadComponent";
import { ComponentInfo, mainSlice, useAppSelector } from "../state";
import { DoenetMLFlags } from "../doenetml";

export type RendererAction = {
    actionName: string;
    componentIdx: number;
};

export type SourceOfUpdate = {
    local?: boolean;
    sourceInformation?: Record<string, unknown>;
};

export type CallActionArgs = {
    action?: RendererAction;
    args?: Record<string, any>;
    componentIdx?: number;
    rendererType?: string;
    [key: string]: any;
};

export type UseDoenetRendererProps = {
    coreId: string;
    componentInstructions: {
        actions: Record<string, RendererAction>;
        componentIdx: number;
        effectiveIdx: number;
        id: string;
        componentType: string;
        rendererType: string;
    };
    rendererClasses: Record<string, any>;
    docId: string;
    activityId: string;
    callAction: (argObj: CallActionArgs) => void;
    doenetViewerUrl?: string;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    requestScrollTo?: (offset: number) => void;
    flags: DoenetMLFlags;
};

export interface DoenetRendererResult<SVs = Record<string, any>> {
    componentIdx: number;
    id: string;
    SVs: SVs;
    docId: string;
    activityId: string;
    actions: Record<string, RendererAction>;
    children: React.ReactNode[];
    sourceOfUpdate: SourceOfUpdate;
    ignoreUpdate: boolean;
    rendererName: string;
    initializeChildren: () => void;
    callAction: (argObj: CallActionArgs) => void;
    doenetViewerUrl: string | undefined;
    fetchExternalDoenetML: ((arg: string) => Promise<string>) | undefined;
    requestScrollTo: ((offset: number) => void) | undefined;
    flags: DoenetMLFlags;
}

// TODO: potentially remove initializeChildrenOnConstruction
/**
 * Hook to retrieve the state variables needed to render a component
 */
export default function useDoenetRenderer<SVs = Record<string, any>>(
    props: UseDoenetRendererProps,
    initializeChildrenOnConstruction = true,
): DoenetRendererResult<SVs> {
    const actions = props.componentInstructions.actions;
    const componentIdx = props.componentInstructions.componentIdx;
    const effectiveIdx = props.componentInstructions.effectiveIdx;
    const id = props.componentInstructions.id;
    const rendererName = props.coreId + componentIdx;
    // Map of rendererType -> factory that returns the dynamic-import promise.
    // We store a factory rather than an in-flight Promise so that
    // `renderersLoadComponent` can drive retry-on-transient-failure (see
    // issue #1190): a bare `import(...)` promise stored here would settle
    // before any handler attached, turning a rare Vite dev-server hiccup
    // into an unhandled rejection that fails the Cypress spec.
    const [renderersToLoad, setRenderersToLoad] = useState<
        Record<string, () => Promise<any>>
    >({});
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
        const entries = Object.entries(renderersToLoad);
        if (entries.length > 0) {
            const names = entries.map(([name]) => name);
            const loaders = entries.map(([, loader]) => loader);
            renderersLoadComponent(loaders, names).then(
                ({ rendererClasses: newRendererClasses }) => {
                    Object.assign(props.rendererClasses, newRendererClasses);
                    setRenderersToLoad({});
                },
            );
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
                setRenderersToLoad((old) => {
                    let rendererLoaders = { ...old };
                    if (!(childInstructions.rendererType in rendererLoaders)) {
                        rendererLoaders[childInstructions.rendererType] = () =>
                            import(
                                `./renderers/${childInstructions.rendererType}.tsx`
                            );
                    }
                    return rendererLoaders;
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
        SVs: stateValues as SVs,
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
