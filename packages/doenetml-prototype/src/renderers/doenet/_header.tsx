import React from "react";

export const Header: React.FunctionComponent<
    React.PropsWithChildren<{ depth: number }>
> = ({ depth, children }) => {
    if (depth > 5) {
        depth = 5;
    }
    if (depth < 0) {
        depth = 0;
    }
    depth += 1;

    return React.createElement(`h${depth}`, { className: "heading" }, children);
};
