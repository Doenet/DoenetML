import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import { XrefLabel } from "@doenet/doenetml-worker";
import classNames from "classnames";
import "./aside.css";
import { Header } from "./_header";

type AsideData = {
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

/**
 * An `<aside>` element.
 * 
 * Sample code
 * -----------
 * ```xml
 <section boxed>
  <aside includeAutoNumber>
    <title>Title with <m>math</m></title>
    <p>
      This aside is nested inside a section. The default number does not include
      the parent number.
    </p>
  </aside>
</section>

<section>
  <aside includeParentNumber="true" startOpen="true">
    <p>
      This aside is nested inside a section. Rendering of the parent section
      number has been included.
    </p>
  </aside>
  <aside collapsible="false" boxed>
    <title>foo</title>
    <p>
      This aside is nested inside a section. Rendering of the parent section
      number has been included.
    </p>
  </aside>
</section>
 * ```
 */
export const Aside: BasicComponentWithPassthroughChildren<AsideData> = ({
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
    const boxed = node.data.props.boxed || node.data.props.collapsible;

    const title =
        titleElmId != null ? (
            <Element id={titleElmId} ancestors={ancestors} />
        ) : (
            ""
        );

    // The container element will be `<details>` or `<aside>` as needed.
    const ContainerElement: React.FC<
        React.HTMLAttributes<HTMLElement> & {
            open?: boolean;
            ref?: typeof visibilityRef;
        }
    > = React.useCallback(
        (props) => {
            if (node.data.props.collapsible) {
                return <details {...props} />;
            } else {
                return <aside {...props} />;
            }
        },
        [node.data.props.collapsible],
    );

    return (
        <ContainerElement
            // Make this tag appear like an `<aside>` to screen readers.
            role="complementary"
            className={classNames("division", "aside", {
                collapsible: node.data.props.collapsible,
                boxed,
            })}
            ref={visibilityRef}
            id={htmlId}
            open={node.data.props.open || !node.data.props.collapsible}
        >
            <summary
                onClick={
                    node.data.props.collapsible
                        ? undefined
                        : (e) => e.preventDefault()
                }
                className="summary"
            >
                <Header depth={node.data.props.divisionDepth}>
                    <span className="title-prefix">{displayName}</span>{" "}
                    <span className="title">{title}</span>
                </Header>
            </summary>
            <div className="content">{children}</div>
        </ContainerElement>
    );
};
