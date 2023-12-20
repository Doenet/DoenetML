import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetML } from "../src/index";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

const root = createRoot(document.getElementById("root")!);
root.render(<DoenetML doenetML={doenetMLstring} />);
