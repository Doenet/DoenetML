import { atomDatabase } from "@doenet/static-assets";
//@ts-ignore
import me from "math-expressions";

/**
 * Load the chemistry data from the csv file containing information about atoms
 * and put it in the format required for the dataForAtom variable of `<atom>` and `<ion>`.
 */
export function getDataForAtom({
    symbol,
    atomicNumber,
}: {
    symbol: string | null;
    atomicNumber: number | null;
}) {
    let rowInd = -1;

    if (atomicNumber !== null) {
        rowInd = atomicNumber - 1;
    } else if (symbol !== null) {
        rowInd = [
            "h",
            "he",
            "li",
            "be",
            "b",
            "c",
            "n",
            "o",
            "f",
            "ne",
            "na",
            "mg",
            "al",
            "si",
            "p",
            "s",
            "cl",
            "ar",
            "k",
            "ca",
            "sc",
            "ti",
            "v",
            "cr",
            "mn",
            "fe",
            "co",
            "ni",
            "cu",
            "zn",
            "ga",
            "ge",
            "as",
            "se",
            "br",
            "kr",
            "rb",
            "sr",
            "y",
            "zr",
            "nb",
            "mo",
            "tc",
            "ru",
            "rh",
            "pd",
            "ag",
            "cd",
            "in",
            "sn",
            "sb",
            "te",
            "i",
            "xe",
            "cs",
            "ba",
            "la",
            "ce",
            "pr",
            "nd",
            "pm",
            "sm",
            "eu",
            "gd",
            "tb",
            "dy",
            "ho",
            "er",
            "tm",
            "yb",
            "lu",
            "hf",
            "ta",
            "w",
            "re",
            "os",
            "ir",
            "pt",
            "au",
            "hg",
            "tl",
            "pb",
            "bi",
            "po",
            "at",
            "rn",
            "fr",
            "ra",
            "ac",
            "th",
            "pa",
            "u",
            "np",
            "pu",
            "am",
            "cm",
            "bk",
            "cf",
            "es",
            "fm",
            "md",
            "no",
            "lr",
            "rf",
            "db",
            "sg",
            "bh",
            "hs",
            "mt",
            "ds",
            "rg",
            "cn",
            "nh",
            "fl",
            "mc",
            "lv",
            "ts",
            "og",
        ].indexOf(symbol.toLowerCase());
    }

    let rowData = atomDatabase[rowInd];
    if (!rowData) {
        return null;
    }

    let columnTypes: Record<string, string> = {
        "Atomic Number": "number",
        Name: "string",
        Symbol: "string",
        Group: "number",
        "Atomic Mass": "number",
        "Phase at STP": "string",
        "Charge of Common Ion": "number",
        "Metal/Nonmetal/Metalloid": "string",
        "Group Name": "string",
        Period: "number",
        "Ionization Energy": "number",
        "Melting Point": "number",
        "Boiling Point": "number",
        "Atomic Radius": "number",
        Density: "number",
        Electronegativity: "number",
        "Electron Configuration": "string",
    };

    let dataForAtom: Record<string, any> = {};
    for (let colName in columnTypes) {
        let prescribedType = columnTypes[colName];
        let value;
        if (prescribedType === "number") {
            value = rowData[colName];
            if (value === "") {
                value = NaN;
            } else {
                value = Number(value);
            }
        } else {
            value = rowData[colName];
            if (
                [`"`, `'`].includes(value[0]) &&
                value[value.length - 1] === value[0]
            ) {
                value = value.substring(1, value.length - 1);
            }
        }
        if (colName === "Electron Configuration") {
            dataForAtom[colName] = me.fromText(value);
        } else {
            dataForAtom[colName] = value;
        }
    }

    return dataForAtom;
}
