import React from "react";

/**
 * Whether what is being rendered sits inside a `<p>`, where a block that would otherwise
 * stand in a paragraph of its own has to be written into the one around it instead.
 */
export const InParagraphContext = React.createContext(false);
