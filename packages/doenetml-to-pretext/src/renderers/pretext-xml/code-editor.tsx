import React from "react";
import { BasicComponent } from "../types";

type CodeEditorData = { props: { value: string } };

export const CodeEditor: BasicComponent<CodeEditorData> = ({ node }) => {
    return <program language="xml">{node.data.props.value}</program>;
};
