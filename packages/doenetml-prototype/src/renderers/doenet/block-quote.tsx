import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import "./block-quote.css";

type BlockQuoteData = { props: unknown };

export const BlockQuote: BasicComponentWithPassthroughChildren<
    BlockQuoteData
> = ({ node, children, htmlId }) => {
    return <blockquote id={htmlId}>{children}</blockquote>;
};
