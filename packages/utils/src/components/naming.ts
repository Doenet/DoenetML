// @ts-ignore
import sha1 from "crypto-js/sha1";
// @ts-ignore
import Base64 from "crypto-js/enc-base64";

let rePlus = /\+/g;
let reSlash = /\//g;

export function createUniqueName(componentType: string, longNameId: string) {
    // use base64 encoding, but replace + with _ and / with -
    // so that the name is a valid CSS identifier
    let hashStringShortened = Base64.stringify(sha1(longNameId))
        .slice(0, 10)
        .replace(rePlus, "_")
        .replace(reSlash, "-");

    // console.log(`componentType: ${componentType}, longNameID: ${longNameId}, hashString: ${hashStringShortened}`)

    return "__" + componentType + "_" + hashStringShortened;
}

export function getUniqueIdentifierFromBase(
    uniqueIdentifierBase: string,
    uniqueIdentifiersUsed: string[],
) {
    let postfix = 1;
    let uniqueIdentifier = uniqueIdentifierBase + postfix;

    while (uniqueIdentifiersUsed.includes(uniqueIdentifier)) {
        postfix += 1;
        uniqueIdentifier = uniqueIdentifierBase + postfix;
    }

    uniqueIdentifiersUsed.push(uniqueIdentifier);

    return uniqueIdentifier;
}
