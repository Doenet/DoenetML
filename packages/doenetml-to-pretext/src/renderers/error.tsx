import React from "react";
import type { DastError } from "@doenet/parser";

export function DastErrorComponent({ errorNode }: { errorNode: DastError }) {
    return <div className="dast-error">{errorNode.message}</div>;
}
