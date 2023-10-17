type DoenetMLRange = {
    begin?: number;
    end?: number;
    selfCloseBegin?: number;
    selfCloseEnd?: number;
    openBegin?: number;
    openEnd?: number;
    closeBegin?: number;
    closeEnd?: number;
    lineBegin?: number;
    lineEnd?: number;
    attrBegin?: number;
    attrEnd?: number;
};

export function printDoenetMLrange(doenetMLrange: DoenetMLRange) {
    if (doenetMLrange.lineBegin === undefined) {
        return "";
    } else if (doenetMLrange.lineBegin === doenetMLrange.lineEnd) {
        return `line ${doenetMLrange.lineBegin}`;
    } else {
        return `lines ${doenetMLrange.lineBegin}–${doenetMLrange.lineEnd}`;
    }
}

export function getLineCharRange(
    doenetMLrange: DoenetMLRange,
    allNewlines: number[],
) {
    let { begin, end } = getBeginEndFromDoenetMLRange(doenetMLrange);

    if (begin === undefined || end === undefined) {
        return {};
    }

    let { line: lineBegin, character: charBegin } = findLineCharInfo(
        begin,
        allNewlines,
    );
    let { line: lineEnd, character: charEnd } = findLineCharInfo(
        end,
        allNewlines,
    );

    return { lineBegin, charBegin, lineEnd, charEnd };
}

function getBeginEndFromDoenetMLRange(doenetMLrange: DoenetMLRange) {
    let begin, end;
    if (doenetMLrange) {
        if (doenetMLrange.begin !== undefined) {
            begin = doenetMLrange.begin;
            end = doenetMLrange.end;
        } else if (doenetMLrange.selfCloseBegin !== undefined) {
            begin = doenetMLrange.selfCloseBegin;
            end = doenetMLrange.selfCloseEnd;
        } else if (doenetMLrange.openBegin !== undefined) {
            begin = doenetMLrange.openBegin;
            end = doenetMLrange.closeEnd;
        }
        doenetMLrange.begin = begin;
        doenetMLrange.end = end;
    }

    return { begin, end };
}

export function findAllNewlines(inText: "string") {
    let allNewlines = [];
    for (let i = 0; i < inText.length; i++) {
        if (inText[i] == "\n") {
            allNewlines.push(i + 1);
        }
    }
    return allNewlines;
}

function findLineCharInfo(pos: number, allNewlines: number[]) {
    for (let i = 0; i < allNewlines.length; i++) {
        if (pos <= allNewlines[i]) {
            if (i === 0) {
                return { line: 1, character: pos };
            } else {
                return { line: i + 1, character: pos - allNewlines[i - 1] };
            }
        }
    }
    return {
        line: allNewlines.length + 1,
        character: pos - (allNewlines[allNewlines.length - 1] || 0),
    };
}

// Assign doenetMLRange to components or to error/warnings objects
export function assignDoenetMLRange(
    components: any[],
    doenetMLrange: DoenetMLRange,
    init = true,
) {
    for (let comp of components) {
        if (typeof comp === "object") {
            if (!comp.doenetMLrange || init) {
                comp.doenetMLrange = doenetMLrange;
            }
            if (comp.children) {
                assignDoenetMLRange(comp.children, doenetMLrange, false);
            }
            if (comp.attributes) {
                for (let attrName in comp.attributes) {
                    let attrComp = comp.attributes[attrName].component;
                    if (attrComp) {
                        assignDoenetMLRange([attrComp], doenetMLrange, false);
                    }
                }
            }
        }
    }
}

// convert attrBegin/attrEnd if exist to begin/end
export function convertDoenetMLAttrRange(doenetMLrange: DoenetMLRange) {
    if (doenetMLrange?.attrBegin) {
        return {
            begin: doenetMLrange.attrBegin,
            end: doenetMLrange.attrEnd,
        };
    } else {
        return doenetMLrange;
    }
}
