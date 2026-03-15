import { compilePrefigure } from "./src/index.ts";

const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");

const sampleDiagram = `<diagram dimensions="(300,300)" margins="5">
  <coordinates bbox="(-2,-2,2,2)">
    <grid-axes xlabel="x" ylabel="y"/>
    <point p="(1,1)">A</point>
  </coordinates>
  <annotations>
    <annotation ref="figure" text="A point on a coordinate grid" />
  </annotations>
</diagram>`;

async function runBrowserRuntimeCheck() {
    const started = performance.now();

    try {
        const result = await compilePrefigure(sampleDiagram, {
            mode: "svg",
            indexURL: new URL("./assets/", window.location.href).toString(),
        });
        const elapsed = Math.round(performance.now() - started);

        const hasSvg = /<svg[\s>]/i.test(result.svg || "");
        const hasAnnotations = /<annotations?\b|<annotation\b/i.test(
            result.annotationsXml || "",
        );

        if (!hasSvg || !hasAnnotations) {
            throw new Error(
                `Unexpected output shape. hasSvg=${hasSvg}, hasAnnotations=${hasAnnotations}`,
            );
        }

        statusEl.textContent = `PASS (${elapsed}ms)`;
        statusEl.className = "pass";
        outputEl.textContent = [
            `svg length: ${result.svg.length}`,
            `annotations length: ${result.annotationsXml.length}`,
            "",
            "SVG preview:",
            result.svg.slice(0, 500),
        ].join("\n");

        window.__PREFIGURE_BROWSER_RUNTIME_CHECK__ = {
            ok: true,
            elapsed,
            svgLength: result.svg.length,
            annotationsLength: result.annotationsXml.length,
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.stack || error.message
                : String(error);
        statusEl.textContent = "FAIL";
        statusEl.className = "fail";
        outputEl.textContent = message;
        window.__PREFIGURE_BROWSER_RUNTIME_CHECK__ = {
            ok: false,
            error: message,
        };
    }
}

runBrowserRuntimeCheck();
