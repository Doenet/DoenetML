/**
 * Call `callback` when the `class` attribute of `node` changes.
 */
export function onClassChange(node: HTMLElement, callback: Function) {
    let lastClassString = node.classList.toString();

    const mutationObserver = new MutationObserver((mutationList) => {
        for (const item of mutationList) {
            if (item.attributeName === "class") {
                const classString = node.classList.toString();
                if (classString !== lastClassString) {
                    callback(mutationObserver);
                    lastClassString = classString;
                    break;
                }
            }
        }
    });

    mutationObserver.observe(node, { attributes: true });

    return mutationObserver;
}

/**
 * Set's the theme of the document (for Charkra).
 */
export function setColorStyle(mode: "light" | "dark") {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
    document.documentElement.style.colorScheme = mode;
}
