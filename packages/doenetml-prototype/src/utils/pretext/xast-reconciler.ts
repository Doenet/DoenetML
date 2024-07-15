import React from "react";
import reconciler, * as ReactReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import type * as Xast from "xast";
import type { DastAttribute } from "@doenet/doenetml-worker-rust";
import { denormalizeAttrs } from "./normalize-attrs";

type RootContainer = Xast.Root & {
    _rootContainer?: ReactReconciler.FiberRoot;
};

type Type = string;

type Props = {
    children?: unknown[];
    [key: string]: any;
};

type Instance = Xast.Element;

type TextInstance = Xast.Text;

function isDastAttribute(node: any): node is DastAttribute {
    return node && node.type === "attribute";
}

/**
 * The config object used by `react-reconciler` to render React elements to Xast.
 */
const HOST_CONFIG: ReactReconciler.HostConfig<
    Type,
    Props,
    RootContainer,
    Instance,
    TextInstance,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
> = {
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    noTimeout: -1,

    // Define other methods as needed
    createInstance(
        elmName,
        props,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle,
    ) {
        const { children, ...rest } = props;
        const attributes = Object.fromEntries(
            Object.entries(denormalizeAttrs(rest)).map(([key, value]) => {
                if (typeof value === "string") {
                    return [key, value];
                }
                if (isDastAttribute(value)) {
                    // XXX: Check whether this is the correct behavior
                    // For now, we filter out any non-text children
                    const val = value.children
                        .map((x) => (x.type === "text" ? x.value : ""))
                        .join("");
                    return [key, val];
                }
                return [key, value];
            }),
        );
        return {
            type: "element",
            name: elmName,
            attributes,
            children: [],
        };
    },

    createTextInstance(
        text,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle,
    ): TextInstance {
        return { type: "text", value: text };
    },

    appendInitialChild(parentInstance, child) {
        parentInstance.children.push(child);
    },
    appendChild(parentInstance, child) {
        parentInstance.children.push(child);
    },
    appendChildToContainer(container, child) {
        container.children.push(child);
    },
    clearContainer(container) {
        container.children.length = 0;
    },

    finalizeInitialChildren(
        instance,
        type,
        props,
        rootContainerInstance,
        hostContext,
    ) {
        return false;
    },

    prepareUpdate(
        instance,
        type,
        oldProps,
        newProps,
        rootContainerInstance,
        hostContext,
    ) {
        const { children, ...rest } = newProps;
        // We don't need to be efficient and calculate a diff. Just update all the props each time.
        return rest;
    },

    commitUpdate(
        instance,
        updatePayload: Xast.Attributes,
        type,
        oldProps,
        newProps,
        internalInstanceHandle,
    ) {
        instance.attributes = { ...instance.attributes, ...updatePayload };
    },

    commitTextUpdate(textInstance, oldText, newText) {
        textInstance.value = newText;
    },
    shouldSetTextContent(type, props) {
        return false;
    },
    getRootHostContext(rootContainerInstance) {},
    getChildHostContext(parentHostContext, type, rootContainerInstance) {
        return parentHostContext;
    },
    prepareForCommit(containerInfo) {
        return null;
    },
    resetAfterCommit(containerInfo) {},
    afterActiveInstanceBlur() {},
    beforeActiveInstanceBlur() {},
    cancelTimeout(id) {},
    detachDeletedInstance(node) {},
    getCurrentEventPriority() {
        return DefaultEventPriority;
    },
    getInstanceFromNode(node) {
        return null;
    },
    getInstanceFromScope(scopeInstance) {
        return null;
    },
    getPublicInstance(instance) {
        return instance;
    },
    preparePortalMount(containerInfo) {
        return null;
    },
    prepareScopeUpdate(scopeInstance, instance) {},
    scheduleTimeout(fn, delay) {},
    removeChildFromContainer(container, child) {
        container.children = container.children.filter((c) => c !== child);
    },
};

const renderer = reconciler(HOST_CONFIG);

/**
 * Render a React element to a Xast Abstract Syntax Tree.
 */
export function renderReactToXast(element: React.ReactNode): Xast.Root {
    const xastRoot: Xast.Root = { type: "root", children: [] };
    const container = renderer.createContainer(
        xastRoot,
        0,
        null,
        false,
        null,
        "xastRoot",
        console.log,
        null,
    );

    renderer.updateContainer(element, container);
    renderer.flushSync(() => {});
    // Save our return XAST before we clear the container
    const ret = structuredClone(xastRoot);

    // We render `null` to the container to force all the
    // useEffect cleanup blocks to run.
    renderer.updateContainer(null, container);

    return ret;
}
