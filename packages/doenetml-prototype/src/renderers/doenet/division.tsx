import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { DivisionPropsInText, XrefLabel } from "@doenet/doenetml-worker";
import { Header } from "./_header";

import classNames from "classnames";

import "./division.css";

type DivisionData = {
    props: {
        /**
         * The id of the title element.
         */
        title: number;
        titlePrefix: string;
        codeNumber: string;
        divisionDepth: number;
        /**
         * Is there a toggle button to collapse this?
         */
        collapsible: boolean;
        /**
         * Is this to be rendered in a frame? (collapsible implies this.)
         */
        boxed: boolean;
        xrefLabel: XrefLabel;
        /**
         * The open state.
         */
        open: boolean;
    };
};

export const Division: BasicComponentWithPassthroughChildren<DivisionData> = ({
    children,
    node,
    visibilityRef,
    ancestors,
    htmlId,
}) => {
    const titleElmId = node.data.props.title;
    const codeNumber = node.data.props.codeNumber;
    const xrefLabel = node.data.props.xrefLabel;
    const displayName = `${xrefLabel.label}${
        codeNumber ? ` ${codeNumber}.` : ""
    }`;

    const title =
        titleElmId != null ? (
            <Element id={titleElmId} ancestors={ancestors} />
        ) : (
            ""
        );

    return (
        <section
            className={classNames("division", "section", {
                boxed: node.data.props.boxed,
            })}
            ref={visibilityRef}
            id={htmlId}
        >
            <Header depth={node.data.props.divisionDepth}>
                <span className="title-prefix">{displayName}</span>{" "}
                <span className="title">{title}</span>
            </Header>
            <div className="content">{children}</div>
        </section>
    );
};
