//import { ENTITY_MAP } from "./entity-map";
import { ENTITY_MAP } from "@doenet/static-assets";

export function entityStringToRawString(entityStr: string): string {
    if (!entityStr.startsWith("&")) {
        entityStr = "&" + entityStr;
    }
    if (!entityStr.endsWith(";")) {
        entityStr += ";";
    }
    try {
        if (entityStr.charAt(1) === "#") {
            // Numeric entity specification
            const val =
                entityStr.charAt(2) === "x"
                    ? parseInt(entityStr.slice(3, entityStr.length - 1), 16)
                    : parseInt(entityStr.slice(2, entityStr.length - 1), 10);
            return String.fromCharCode(val);
        }
        const trimmedEntityString = entityStr.slice(1, entityStr.length - 1);
        if (trimmedEntityString in ENTITY_MAP) {
            return ENTITY_MAP[trimmedEntityString];
        }
    } catch (e: any) {
        console.warn(
            `Encountered error when converting entity "${entityStr}": ${e.message}`,
        );
    }
    console.warn(`Cannot convert XML entity "${entityStr}"`);
    return entityStr;
}
