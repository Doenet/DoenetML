import { Connection } from "vscode-languageserver/browser";
import { DocumentInfo } from "../globals";

export function addDocumentHoverSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    connection.onHover((params) => {
        return null;
    });
}
