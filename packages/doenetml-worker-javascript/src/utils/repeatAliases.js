/**
 * The components named for the value and the index of a `<repeat>` or
 * `<repeatForSequence>` that its template reads (`_placeholder` and
 * `integer` in a `_repeatSetup`, from the parser's repeat sugar), by kind,
 * each with its index and its name.
 *
 * There can be more than one `_repeatSetup`: a `copy` of a repeat with a
 * `valueName` or `indexName` of its own has its own setup after its
 * source's (#2211), and the children written in it read the copy's names.
 */
export function iterationDummies(serializedChildren) {
    const valueDummies = [];
    const indexDummies = [];
    for (const setup of serializedChildren) {
        if (setup?.componentType !== "_repeatSetup") {
            continue;
        }
        for (const child of setup.children) {
            if (typeof child !== "object") {
                continue;
            }
            const nameAttribute = child.attributes?.name;
            const dummy = {
                componentIdx: child.componentIdx,
                name:
                    nameAttribute?.type === "primitive"
                        ? String(nameAttribute.primitive.value)
                        : undefined,
            };
            if (child.componentType === "_placeholder") {
                valueDummies.push(dummy);
            } else if (child.componentType === "integer") {
                indexDummies.push(dummy);
            }
        }
    }
    return { valueDummies, indexDummies };
}

/**
 * The names each iteration of a repeat makes a component of, for its value
 * or its index, and which of them each placeholder (`dummies`, from
 * `iterationDummies`) reads: the repeat's own name (`ownName`, its
 * `valueName` or `indexName`), unless it holds them as a list its template
 * reads its entries of (`holdsList`), and the name of each placeholder, one
 * component per distinct name. A placeholder with no name of its own reads
 * the repeat's.
 *
 * So the template a copy of a repeat copies from its source and the
 * children written in the copy, which can each name the value differently,
 * each read the value of the iteration they are in (#2211).
 */
export function iterationAliasNames({ ownName, holdsList, dummies }) {
    const names = [];
    if (ownName && !holdsList) {
        names.push(ownName);
    }
    const nameOfDummy = {};
    for (const { componentIdx, name } of dummies) {
        const aliasName = name ?? ownName;
        if (!aliasName) {
            continue;
        }
        if (!names.includes(aliasName)) {
            names.push(aliasName);
        }
        nameOfDummy[componentIdx] = aliasName;
    }
    return { names, nameOfDummy };
}
