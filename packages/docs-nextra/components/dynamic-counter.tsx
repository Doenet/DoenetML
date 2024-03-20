import React from "react";
import dynamic from "next/dynamic";

export const DynamicMyCounter = dynamic(() => import("./counter"), {
    ssr: false,
});
