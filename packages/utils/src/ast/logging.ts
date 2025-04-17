export type position = {
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

export function printDoenetMLrange(position: position) {
    if (position.lineBegin === undefined) {
        return "";
    } else if (position.lineBegin === position.lineEnd) {
        return `line ${position.lineBegin}`;
    } else {
        return `lines ${position.lineBegin}–${position.lineEnd}`;
    }
}

export function getLineCharRange(position: position, allNewlines: number[]) {
    let { begin, end } = getBeginEndFromDoenetMLRange(position);

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

function getBeginEndFromDoenetMLRange(position: position) {
    let begin, end;
    if (position) {
        if (position.begin !== undefined) {
            begin = position.begin;
            end = position.end;
        } else if (position.selfCloseBegin !== undefined) {
            begin = position.selfCloseBegin;
            end = position.selfCloseEnd;
        } else if (position.openBegin !== undefined) {
            begin = position.openBegin;
            end = position.closeEnd;
        }
        position.begin = begin;
        position.end = end;
    }

    return { begin, end };
}

export function findAllNewlines(inText: string) {
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

// Assign position to components or to error/warnings objects
export function assignDoenetMLRange(
    components: any[],
    position: position,
    init = true,
) {
    for (let comp of components) {
        if (typeof comp === "object") {
            if (!comp.position || init) {
                comp.position = position;
            }
            if (comp.children) {
                assignDoenetMLRange(comp.children, position, false);
            }
            if (comp.attributes) {
                for (let attrName in comp.attributes) {
                    let attrComp = comp.attributes[attrName].component;
                    if (attrComp) {
                        assignDoenetMLRange([attrComp], position, false);
                    }
                }
            }
        }
    }
}

// convert attrBegin/attrEnd if exist to begin/end
export function convertDoenetMLAttrRange(position: position) {
    if (position?.attrBegin) {
        return {
            begin: position.attrBegin,
            end: position.attrEnd,
        };
    } else {
        return position;
    }
}
