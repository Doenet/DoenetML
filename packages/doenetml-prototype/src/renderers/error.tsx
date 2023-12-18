import React from "react";
import { DastError } from "@doenet/parser";

export function DastError({ errorNode }: { errorNode: DastError }) {
    return <div className="dast-error">{errorNode.message}</div>;
}
