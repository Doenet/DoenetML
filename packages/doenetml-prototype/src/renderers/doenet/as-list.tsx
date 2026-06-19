import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type AsListData = {
    props?: {
        hidden?: boolean;
    };
};

/**
 * Render list items with the comma behavior used for composite replacements in
 * the production doenetml renderers.
 *
 * The comma insertion and trailing-blank trimming below intentionally mirror
 * `addCommasForCompositeRanges` in
 * `packages/doenetml/src/Viewer/renderers/utils/composites.tsx`. Keep the two
 * in sync so FlatDast `<asList>` wrappers remain a faithful rendering of the JS
 * core's `_compositeReplacementActiveRange` metadata.
 */
export const AsList: BasicComponentWithPassthroughChildren<AsListData> = ({
    node,
    children,
}) => {
    if (node.data.props?.hidden) {
        return null;
    }

    return (
        <React.Fragment>
            {addCommasBetweenChildren(React.Children.toArray(children))}
        </React.Fragment>
    );
};

function addCommasBetweenChildren(children: React.ReactNode[]) {
    if (children.length === 0) {
        return [];
    }

    const isBlankStringChild = children.map(isBlankString);
    const childrenWithCommas = [children[0]];

    for (const [prevInd, child] of children.slice(1).entries()) {
        if (
            !isBlankStringChild[prevInd] &&
            isBlankStringChild.slice(prevInd + 1).some((x) => !x)
        ) {
            childrenWithCommas[childrenWithCommas.length - 1] =
                removeEndingBlankString(
                    childrenWithCommas[childrenWithCommas.length - 1],
                );
            childrenWithCommas.push(", ");
        }
        childrenWithCommas.push(child);
    }

    return childrenWithCommas;
}

function isBlankString(child: React.ReactNode) {
    return typeof child === "string" && child.trim() === "";
}

function removeEndingBlankString(component: React.ReactNode): React.ReactNode {
    if (
        !component ||
        typeof component === "boolean" ||
        typeof component === "number"
    ) {
        return component;
    }
    if (typeof component === "string") {
        return component.trimEnd();
    }
    if (
        !React.isValidElement<{
            children?: React.ReactNode | React.ReactNode[];
        }>(component) ||
        !Array.isArray(component.props.children) ||
        component.props.children.length === 0
    ) {
        return component;
    }

    const children = [...component.props.children];
    const originalLastChild = children[children.length - 1];
    let lastChild = originalLastChild;
    while (isBlankString(lastChild)) {
        children.pop();
        if (children.length === 0) {
            return React.cloneElement(component, { children: [] });
        }
        lastChild = children[children.length - 1];
    }

    lastChild = removeEndingBlankString(lastChild);

    if (lastChild === originalLastChild) {
        return component;
    }

    return React.cloneElement(component, {
        children: [...children.slice(0, children.length - 1), lastChild],
    });
}
