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

export function getNamespaceFromName(componentIdx: number) {
    const _componentIdx = componentIdx.toString();
    let lastSlash = _componentIdx.lastIndexOf("/");
    if (lastSlash === -1) {
        throw Error(
            `Encountered name ${_componentIdx} that doesn't include a slash`,
        );
    }
    return _componentIdx.slice(0, lastSlash + 1);
}
