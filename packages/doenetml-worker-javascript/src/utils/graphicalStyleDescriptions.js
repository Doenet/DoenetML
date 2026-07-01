export function getLineColorWord(selectedStyle, theme) {
    return theme === "dark"
        ? selectedStyle.lineColorWordDarkMode
        : selectedStyle.lineColorWord;
}

export function getFillColorWord(selectedStyle, theme) {
    return theme === "dark"
        ? selectedStyle.fillColorWordDarkMode
        : selectedStyle.fillColorWord;
}

export function getBorderDescription(selectedStyle) {
    let borderDescription = selectedStyle.lineWidthWord;
    if (selectedStyle.lineStyleWord) {
        if (borderDescription) {
            borderDescription += " ";
        }
        borderDescription += selectedStyle.lineStyleWord;
    }
    if (borderDescription) {
        borderDescription += " ";
    }
    return borderDescription;
}

export function buildClosedShapeStyleDescription({
    filled,
    lineColorWord,
    fillColorWord,
    fillStyleWord,
    borderDescription,
    noun = "",
    includeBorderArticle = false,
}) {
    if (!filled) {
        return borderDescription + lineColorWord + noun;
    }

    let styleDescription = `filled ${fillColorWord}${noun}`;
    if (fillStyleWord) {
        styleDescription += ` with ${fillStyleWord}`;
    }

    if (fillColorWord === lineColorWord) {
        if (borderDescription) {
            styleDescription +=
                (fillStyleWord
                    ? includeBorderArticle
                        ? " and a "
                        : " and "
                    : includeBorderArticle
                      ? " with a "
                      : " with ") +
                borderDescription +
                "border";
        }
        return styleDescription;
    }

    return (
        styleDescription +
        (fillStyleWord
            ? includeBorderArticle
                ? " and a "
                : " and "
            : includeBorderArticle
              ? " with a "
              : " with ") +
        borderDescription +
        lineColorWord +
        " border"
    );
}

export function buildFillStyleDescription({
    filled,
    fillColorWord,
    fillStyleWord,
}) {
    if (!filled) {
        return "unfilled";
    }

    return fillStyleWord ? `${fillColorWord} ${fillStyleWord}` : fillColorWord;
}
