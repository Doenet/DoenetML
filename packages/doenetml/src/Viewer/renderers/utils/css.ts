export function sizeToCSS(size?: { size: string; isAbsolute: boolean }) {
    let cssSize;

    if (size) {
        cssSize = size.size;
        if (size.isAbsolute) {
            cssSize += "px";
        } else {
            cssSize += "%";
        }
    }
    return cssSize;
}
