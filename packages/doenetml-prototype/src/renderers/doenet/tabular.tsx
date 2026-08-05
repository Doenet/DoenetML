import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { sizeToCSS } from "../../utils/size-to-css";
import "./tabular.css";
import classNames from "classnames";

export type BorderStyle = "none" | "minor" | "medium" | "major";

type TabularData = {
    props: {
        width?: { size: string; isAbsolute: boolean };
        height?: { size: string; isAbsolute: boolean };
        topBorder?: BorderStyle;
    };
};

/**
 * Renders a table from `<tabular>` elements.
 *
 * Sample code
 * -----------
 ```
<tabular>
  <row>
    <cell>1</cell>
    <cell>2</cell>
    <cell>3</cell>
  </row>
  <row>
    <cell>A</cell>
    <cell>B</cell>
    <cell>C</cell>
  </row>
</tabular>

<tabular topBorder="minor" bottomBorder="minor" startBorder="minor" endBorder="minor">
  <row header="true">
    <cell>Name</cell>
    <cell>Occupation</cell>
  </row>
  <row>
    <cell>Jeremiah</cell>
    <cell>Bullfrog</cell>
  </row>
</tabular>

<tabular topBorder="major" bottomBorder="minor" startBorder="medium" endBorder="minor">
  <row>
    <cell endBorder="medium">🟣</cell>
    <cell>🔵</cell>
    <cell>🔴</cell>
  </row>
  <row bottomBorder="medium">
    <cell>😆</cell>
    <cell bottomBorder="minor">🥲</cell>
    <cell bottomBorder="major">😠</cell>
  </row>
</tabular>

<tabular
  left="minor"
  right="minor"
  top="minor"
  bottom="minor"
  height="200"
  vAlign="top"
>
  <row>
    <cell>1</cell>
    <cell>2</cell>
    <cell>3</cell>
  </row>
  <row>
    <cell>a</cell>
    <cell>b</cell>
    <cell>c</cell>
  </row>
</tabular>

<tabular topBorder="minor" bottomBorder="minor" startBorder="minor" endBorder="minor">
  <row halign="start">
    <cell>1</cell>
    <cell>2</cell>
  </row>
  <row halign="center">
    <cell>3</cell>
    <cell>4</cell>
  </row>
  <row halign="end">
    <cell>5</cell>
    <cell>6</cell>
  </row>
</tabular>
```
 */
export const Tabular: BasicComponentWithPassthroughChildren<TabularData> = ({
    node,
    children,
    htmlId,
}) => {
    return (
        <table
            id={htmlId}
            style={{
                width: sizeToCSS(node.data.props.width),
                height: sizeToCSS(node.data.props.height),
            }}
            className={classNames({
                [`border-top-${node.data.props.topBorder}`]:
                    node.data.props.topBorder &&
                    node.data.props.topBorder !== "none",
            })}
        >
            <tbody>{children}</tbody>
        </table>
    );
};
