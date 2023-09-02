export function lettersToNumber(letters: string) {
    try {
        letters = letters.toUpperCase();
    } catch (e) {
        console.warn("Cannot convert " + letters + " to a number");
        return undefined;
    }

    let number = 0,
        len = letters.length,
        pos = len;
    while ((pos -= 1) > -1) {
        let numForLetter = letters.charCodeAt(pos) - 64;
        if (numForLetter < 1 || numForLetter > 26) {
            console.warn("Cannot convert " + letters + " to a number");
            return undefined;
        }
        number += numForLetter * Math.pow(26, len - 1 - pos);
    }
    return number;
}

export function numberToLetters(number: number, lowercase: boolean) {
    number--;
    let offset = 65;
    if (lowercase) {
        offset = 97;
    }
    let letters = "";
    while (true) {
        let nextNum = number % 26;
        letters = String.fromCharCode(offset + nextNum) + letters;
        if (number < 26) {
            break;
        }
        number = Math.floor(number / 26) - 1;
    }
    return letters;
}
