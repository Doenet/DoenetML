import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { XrefLabel } from "@doenet/doenetml-worker";
import { Element } from "../element";
import { Header } from "./_header";
import classNames from "classnames";

type TableData = {
    props: {
        /**
         * The id of the title element.
         */
        title: number;
        titlePrefix: string;
        codeNumber: string;
        divisionDepth: number;
        xrefLabel: XrefLabel;
    };
};

export const Table: BasicComponentWithPassthroughChildren<TableData> = ({
    node,
    children,
    htmlId,
    ancestors,
    visibilityRef,
}) => {
    const titleElmId = node.data.props.title;
    const displayName = node.data.props.titlePrefix;

    const title =
        titleElmId != null ? (
            <Element id={titleElmId} ancestors={ancestors} />
        ) : (
            ""
        );

    return (
        <figure
            className={classNames("division", "table")}
            ref={visibilityRef}
            id={htmlId}
        >
            <Header depth={node.data.props.divisionDepth}>
                {/* `titlePrefix` already ends in whatever separates it from
                    the title, in the document's language, so nothing is added
                    here (#1582). An untitled table therefore no longer trails
                    the space this used to print unconditionally, which nothing
                    followed. */}
                <span className="title-prefix">{displayName}</span>
                <span className="title">{title}</span>
            </Header>
            <div className="content">{children}</div>
        </figure>
    );
};
