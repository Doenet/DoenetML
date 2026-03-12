export function prefigureGraph(
    body: string,
    options: { name?: string; attrs?: string } = {},
) {
    const name = options.name ?? "g";
    const attrs = options.attrs ? ` ${options.attrs}` : "";
    return `<graph name="${name}" renderer="prefigure"${attrs}>\n${body}\n</graph>`;
}

export function withStyleDefinitions(
    styleDefinitions: string,
    content: string,
) {
    return `<setup>\n  <styleDefinitions>\n${styleDefinitions}\n  </styleDefinitions>\n</setup>\n${content}`;
}
