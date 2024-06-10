import React from "react";
import dynamic from "next/dynamic";

export const DoenetML = dynamic(() => import("./doenetInternal"), {
    ssr: false,
});
