import React from "react";
import reconciler, { HostConfig, FiberRoot } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import type * as Xast from "xast";
import type { DastAttribute } from "@doenet/doenetml-worker";
import { fromXml } from "xast-util-from-xml";
import { denormalizeAttrs } from "./normalize-attrs";

type RootContainer = Xast.Root & {
    _rootContainer?: FiberRoot;
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

function hasDangerouslySetInnerHTML(
    props: Props,
): props is Props & { dangerouslySetInnerHTML: { __html: string } } {
    const value = props.dangerouslySetInnerHTML;
    return (
        !!value && typeof value === "object" && typeof value.__html === "string"
    );
}

/**
 * Parse a string as XML.
 */
function parseXmlFragmentToXastChildren(
    xmlFragment: string,
): Xast.ElementContent[] {
    // Wrap in a <xast_fragment> since valid XML only allows a single element at the root.
    const parsed = fromXml(`<xast_fragment>${xmlFragment}</xast_fragment>`);
    const fragmentNode = parsed.children.find(
        (child): child is Xast.Element =>
            child.type === "element" && child.name === "xast_fragment",
    );

    if (!fragmentNode) {
        throw new Error("Could not parse dangerouslySetInnerHTML XML fragment");
    }

    // Return the children directly, with all metadata (including position)
    return fragmentNode.children;
}

/**
 * The config object used by `react-reconciler` to render React elements to Xast.
 */
const HOST_CONFIG: HostConfig<
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
    unknown,
    unknown
> = {
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    noTimeout: -1,
    // NotPendingTransition and HostTransitionContext are supposed to be supplied.
    // I'm not sure what they do, so I copied default values from the React source code.
    NotPendingTransition: {
        pending: false,
        data: null,
        method: null,
        action: null,
    },
    HostTransitionContext: {
        $$typeof: 0,
        Consumer: null as any,
        Provider: null as any,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
    },

    // Define other methods as needed
    createInstance(
        elmName,
        props,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle,
    ) {
        const { children, dangerouslySetInnerHTML, ...rest } = props;
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
        const instance: Xast.Element = {
            type: "element",
            name: elmName,
            attributes,
            children: [],
        };

        if (hasDangerouslySetInnerHTML(props)) {
            if (
                props.children &&
                Array.isArray(props.children) &&
                props.children.length > 0
            ) {
                throw new Error(
                    "dangerouslySetInnerHTML cannot be used together with children",
                );
            }
            instance.children = parseXmlFragmentToXastChildren(
                dangerouslySetInnerHTML.__html,
            );
        }

        return instance;
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

    commitTextUpdate(textInstance, oldText, newText) {
        textInstance.value = newText;
    },
    shouldSetTextContent(type, props) {
        return hasDangerouslySetInnerHTML(props);
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
    resolveUpdatePriority() {
        return DefaultEventPriority;
    },
    getCurrentUpdatePriority() {
        return DefaultEventPriority;
    },
    setCurrentUpdatePriority(newPriority) {},
    maySuspendCommit(type, props) {
        return false;
    },
    preloadInstance(type, props) {
        return false;
    },
    requestPostPaintCallback(callback) {},
    resetFormInstance(form) {},
    resolveEventTimeStamp() {
        return 1;
    },
    resolveEventType() {
        return null;
    },
    shouldAttemptEagerTransition() {
        return false;
    },
    startSuspendingCommit() {},
    suspendInstance(type, props) {},
    trackSchedulerEvent() {},
    waitForCommitToBeReady() {
        return null;
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
        (error: Error) => console.error(error),
        (error: Error) => console.error(error),
        () => {},
        null,
    );

    // Used to be `updateContainer` and `flushSync`, but those methods don't seem
    // to work with newer `react-reconciler` versions.
    // 2025-05-25 TS errors due to the types on `react-reconciler` being wrong?
    // @ts-ignore
    renderer.updateContainerSync(element, container);
    // @ts-ignore
    renderer.flushSyncWork(); //(() => {});
    // Save our return XAST before we clear the container
    const ret = structuredClone(xastRoot);

    // We render `null` to the container to force all the
    // useEffect cleanup blocks to run.
    renderer.updateContainer(null, container);

    return ret;
}
