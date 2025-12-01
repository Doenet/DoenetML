import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

type LineLegendItem = {
    swatchType: "line";
    label: string;
    hasLatex: boolean;
    lineStyle?: string;
    lineColor?: string;
    lineWidth?: number;
    lineOpacity?: number;
};
type RectangleLegendItem = Omit<LineLegendItem, "swatchType"> & {
    swatchType: "rectangle";
    fillColor?: string;
    filled?: boolean;
    fillOpacity?: number;
};
type MarkerLegendItem = {
    swatchType: "marker";
    label: string;
    hasLatex: boolean;
    markerStyle?: string;
    markerColor?: string;
    markerSize?: number;
};

type LegendItem = LineLegendItem | RectangleLegendItem | MarkerLegendItem;

async function check_legend({
    core,
    resolvePathToNodeIdx,
    legendName = "legend1",
    legendItems,
    position,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    legendName?: string;
    legendItems: LegendItem[];
    position?: string;
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);

    if (position) {
        expect(
            stateVariables[await resolvePathToNodeIdx(legendName)].stateValues
                .position,
        ).eq(position);
    }

    let numItems = legendItems.length;
    let legendElements =
        stateVariables[await resolvePathToNodeIdx(legendName)].stateValues
            .legendElements;
    expect(legendElements.length).eq(numItems);

    for (let i = 0; i < numItems; i++) {
        let element = legendElements[i];
        let item = legendItems[i];
        expect(element.swatchType).eq(item.swatchType);
        expect(element.label.value).eq(item.label);
        expect(element.label.hasLatex).eq(item.hasLatex);
        if (item.swatchType === "marker") {
            if (item.markerStyle !== undefined) {
                expect(element.markerStyle).eq(item.markerStyle);
                expect(element.markerColor).eq(item.markerColor);
                expect(element.markerSize).eq(item.markerSize);
            }
        } else {
            if (item.lineStyle !== undefined) {
                expect(element.lineStyle).eq(item.lineStyle);
                expect(element.lineColor).eq(item.lineColor);
                expect(element.lineWidth).eq(item.lineWidth);
                expect(element.lineOpacity).eq(item.lineOpacity);
                if (item.swatchType === "rectangle") {
                    expect(element.fillColor).eq(item.fillColor);
                    expect(element.filled).eq(item.filled);
                    expect(element.fillOpacity).eq(item.fillOpacity);
                }
            }
        }
    }
}

describe("Legend tag tests", async () => {
    it("legend includes unique styles, points separate, closed path not separate", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <function styleNumber="3">(x+5)^2</function>
      <point name="P1" styleNumber="1" displayDigits="2">(-3,2)</point>
      <circle styleNumber="3" center="(5,-8)" />
      <vector styleNumber="2" head="(-3,1)" tail="(2,2)" />
      <point name="P2" styleNumber="1" displayDigits="2">(-5,6)</point>
      <point name="P3" styleNumber="2">(0,-6)</point>

      <legend name="legend1">
        <label>parabola and circle</label>
        <label>$P1 and $P2</label>
        <label>vector</label>
        <label><m>r^2</m></label>
        <label>This will be unused</label>
      </legend>
    </graph>
    `,
        });

        let legendItems: LegendItem[] = [
            {
                swatchType: "line",
                label: "parabola and circle",
                hasLatex: false,
            },
            {
                swatchType: "marker",
                label: "\\(\\left( -3, 2 \\right)\\) and \\(\\left( -5, 6 \\right)\\)",
                hasLatex: true,
            },
            { swatchType: "line", label: "vector", hasLatex: false },
            { swatchType: "marker", label: "\\(r^2\\)", hasLatex: true },
        ];

        await check_legend({
            core,
            resolvePathToNodeIdx,
            legendItems,
            position: "upperright",
        });
    });

    it("displayClosedSwatches separates closed path", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <function styleNumber="3">(x+5)^2</function>
      <point name="P1" styleNumber="1" displayDigits="2">(-3,2)</point>
      <circle styleNumber="3" center="(5,-8)" />
      <vector styleNumber="2" head="(-3,1)" tail="(2,2)" />
      <point name="P2" styleNumber="1" displayDigits="2">(-5,6)</point>
      <point name="P3" styleNumber="2">(0,-6)</point>

      <legend name="legend1" displayClosedSwatches>
        <label>parabola</label>
        <label>$P1 and $P2</label>
        <label>circle</label>
        <label>vector</label>
        <label><m>r^2</m></label>
        <label>This will be unused</label>
      </legend>
    </graph>
    `,
        });

        let legendItems: LegendItem[] = [
            { swatchType: "line", label: "parabola", hasLatex: false },
            {
                swatchType: "marker",
                label: "\\(\\left( -3, 2 \\right)\\) and \\(\\left( -5, 6 \\right)\\)",
                hasLatex: true,
            },
            { swatchType: "rectangle", label: "circle", hasLatex: false },
            { swatchType: "line", label: "vector", hasLatex: false },
            { swatchType: "marker", label: "\\(r^2\\)", hasLatex: true },
        ];

        await check_legend({
            core,
            resolvePathToNodeIdx,
            legendItems,
            position: "upperright",
        });
    });

    it("legend with dynamical functions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />
    <textInput name="pos" />
    <graph>
      <setup><sequence name="s" length="$n" /></setup>
      <repeat for="$s" valueName="v">
        <function styleNumber="floor($v/2+1/2)">sin(x)+$v</function>
      </repeat>
      <legend name="legend1" position="$pos">
        <label>hi</label>
        <label><m>\\int_a^b f(x) \\,dx</m> is it!</label>
        <label>only this</label>
        <label><m>x^2</m></label>
      </legend>
    </graph>
    `,
        });

        let possibleLegendItems: LegendItem[] = [
            { swatchType: "line", label: "hi", hasLatex: false },
            {
                swatchType: "line",
                label: "\\(\\int_a^b f(x) \\,dx\\) is it!",
                hasLatex: true,
            },
            { swatchType: "line", label: "only this", hasLatex: false },
            { swatchType: "line", label: "\\(x^2\\)", hasLatex: true },
        ];

        let position = "upperright";
        let numItems = 1;
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        position = "upperleft";
        await updateTextInputValue({
            text: "upperLeft",
            componentIdx: await resolvePathToNodeIdx("pos"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        numItems = 2;
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        numItems = 3;
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        position = "lowerright";
        await updateTextInputValue({
            text: "LowerRight",
            componentIdx: await resolvePathToNodeIdx("pos"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        numItems = 4;
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        numItems = 1;
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        position = "lowerleft";
        await updateTextInputValue({
            text: "lowerleft",
            componentIdx: await resolvePathToNodeIdx("pos"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });

        numItems = 4;
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_legend({
            core,
            resolvePathToNodeIdx,
            position,
            legendItems: possibleLegendItems.slice(0, numItems),
        });
    });

    it("legend with forObject", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition styleNumber="1" lineColor="green" lineWidth="1" lineOpacity="0.9" lineStyle="dotted" markerSize="5" markerStyle="triangle" markerColor="green" fillColor="red" fillOpacity="0.3" />
        <styleDefinition styleNumber="2" lineColor="blue" lineWidth="2" lineOpacity="0.8" lineStyle="dashed" markerSize="4" markerStyle="square" markerColor="blue" fillColor="orange" fillOpacity="0.4" />
        <styleDefinition styleNumber="3" lineColor="cyan" lineWidth="3" lineOpacity="0.7" lineStyle="solid" markerSize="3" markerStyle="circle" markerColor="cyan" fillColor="magenta" fillOpacity="0.5" />
        <styleDefinition styleNumber="4" lineColor="black" lineWidth="4" lineOpacity="0.6" lineStyle="dotted" />
    </setup>

    <p>display closed swatches: <booleanInput name="closedSwatches" /></p>

    <graph>
      <lineSegment styleNumber="3" />
      <point styleNumber="1" displayDigits="2" name="A">(-3,2)</point>
      <circle styleNumber="3" center="(5,-8)" filled />
      <vector styleNumber="2" head="(-3,1)" tail="(2,2)" />
      <point styleNumber="1" displayDigits="2" name="B">(-5,6)</point>
      <point styleNumber="2" name="C">(0,-6)</point>
      <function styleNumber="2" name="f">(x+5)^2</function>
      <rectangle styleNumber="2" filled />
      <curve through="(-9,-9) (-8, -8) (-7, -9)" styleNumber="4" />

      <legend name="legend1" displayClosedSwatches="$closedSwatches">
        <label forObject="$f">targeted function</label>
        <label>first one</label>
        <label>second one <m>x^2</m></label>
        <label forObject="$B">targeted point <m>B</m></label>
        <label>third one</label>
        <label forObject="$incorrect">This will be unused</label>
        <label>fourth one</label>
      </legend>
    </graph>
    `,
        });

        async function check_items(displayClosedSwatches: boolean) {
            let legendItems: LegendItem[] = [
                {
                    swatchType: "line",
                    label: "targeted function",
                    hasLatex: false,
                    lineStyle: "dashed",
                    lineColor: "blue",
                    lineWidth: 2,
                    lineOpacity: 0.8,
                },
                {
                    swatchType: "line",
                    label: "first one",
                    hasLatex: false,
                    lineStyle: "solid",
                    lineColor: "cyan",
                    lineWidth: 3,
                    lineOpacity: 0.7,
                },
            ];

            if (displayClosedSwatches) {
                legendItems.push({
                    swatchType: "rectangle",
                    label: "second one \\(x^2\\)",
                    hasLatex: true,
                    lineStyle: "solid",
                    lineColor: "cyan",
                    lineWidth: 3,
                    lineOpacity: 0.7,
                    fillColor: "magenta",
                    filled: true,
                    fillOpacity: 0.5,
                });

                legendItems.push({
                    swatchType: "marker",
                    label: "targeted point \\(B\\)",
                    hasLatex: true,
                    markerStyle: "triangle",
                    markerColor: "green",
                    markerSize: 5,
                });
                legendItems.push({
                    swatchType: "marker",
                    label: "third one",
                    hasLatex: false,
                    markerStyle: "square",
                    markerColor: "blue",
                    markerSize: 4,
                });
                legendItems.push({
                    swatchType: "rectangle",
                    label: "fourth one",
                    hasLatex: false,
                    lineStyle: "dashed",
                    lineColor: "blue",
                    lineWidth: 2,
                    lineOpacity: 0.8,
                    fillColor: "orange",
                    filled: true,
                    fillOpacity: 0.4,
                });
            } else {
                legendItems.push({
                    swatchType: "marker",
                    label: "second one \\(x^2\\)",
                    hasLatex: true,
                    markerStyle: "square",
                    markerColor: "blue",
                    markerSize: 4,
                });

                legendItems.push({
                    swatchType: "marker",
                    label: "targeted point \\(B\\)",
                    hasLatex: true,
                    markerStyle: "triangle",
                    markerColor: "green",
                    markerSize: 5,
                });
                legendItems.push({
                    swatchType: "line",
                    label: "third one",
                    hasLatex: false,
                    lineStyle: "dotted",
                    lineColor: "black",
                    lineWidth: 4,
                    lineOpacity: 0.6,
                });
            }

            await check_legend({
                core,
                resolvePathToNodeIdx,
                legendItems,
            });
        }

        await check_items(false);

        // change displayClosedSwatches to true
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("closedSwatches"),
            core,
        });
        await check_items(true);
    });

    it("legend with forObject, use names of shadow sources", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="p" labelIsName>(3,4)</point>
      <point name="Q" styleNumber="2" labelIsName>(4,5)</point>
      <legend name="legend1">
        <label forObject="$p">point p</label>
        <label forObject="$Q">point Q</label>
      </legend> 
    </graph>
    
    
    <graph>
      $p
      $Q
      <legend name="legend2">
      <label forObject="$Q">point Q</label>
      <label forObject="$p">point p</label>
      </legend> 
    </graph>
  
    `,
        });

        let legend1Items: LegendItem[] = [
            { swatchType: "marker", label: "point p", hasLatex: false },
            { swatchType: "marker", label: "point Q", hasLatex: false },
        ];

        let legend2Items: LegendItem[] = [
            { swatchType: "marker", label: "point Q", hasLatex: false },
            { swatchType: "marker", label: "point p", hasLatex: false },
        ];

        await check_legend({
            core,
            resolvePathToNodeIdx,
            legendName: "legend1",
            legendItems: legend1Items,
        });

        await check_legend({
            core,
            resolvePathToNodeIdx,
            legendName: "legend2",
            legendItems: legend2Items,
        });
    });
});
