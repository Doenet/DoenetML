import React from "react";
import { BasicComponent } from "../types";
import "./orbital-diagram.css";

type Box = "U" | "D" | "UD" | "DU" | "E";

type OrbitalDiagramData = {
    props: {
        value: { orbitalText: string; boxes: Box[] }[];
    };
};

function buildAriaLabel(
    value: { orbitalText: string; boxes: Box[] }[],
): string {
    const groups = value.map(({ orbitalText, boxes }) => {
        const boxDescriptions = boxes.map((b) => {
            if (b === "UD" || b === "DU") return "2 electrons, paired";
            if (b === "U") return "spin up";
            if (b === "D") return "spin down";
            return "empty";
        });
        return `${orbitalText} subshell: ${boxDescriptions.join(", ")}`;
    });
    return `Orbital diagram: ${groups.join("; ")}`;
}

function Arrow({ dir }: { dir: "up" | "down" }) {
    return (
        <span className="orbital-arrow" aria-hidden="true">
            {/* {dir === "up" ? "↑" : "↓"} */}
            {dir === "up" ? "↿" : "⇂"}
        </span>
    );
}

function OrbitalBox({ box }: { box: Box }) {
    return (
        <div className="orbital-box" aria-hidden="true">
            {box === "U" && <Arrow dir="up" />}
            {box === "D" && <Arrow dir="down" />}
            {(box === "UD" || box === "DU") && (
                <>
                    <Arrow dir={box[0] === "U" ? "up" : "down"} />
                    <Arrow dir={box[1] === "U" ? "up" : "down"} />
                </>
            )}
        </div>
    );
}

/**
 * An `<orbitalDiagram>` element.
 *
 * Sample code
 * -----------
 * ```xml
 * <atom name="hydrogen" symbol="H" />, <atom name="helium" symbol="He" />,
 * <atom name="lithium" symbol="O" />
 *
 * <p>At standard temperature and pressure, hydrogen is a $hydrogen.phaseAtSTP.</p>
 *
 * <p>The atomic mass of helium is $helium.atomicMass <m>\text{amu}</m>.</p>
 *
 * <p>The orbitalDiagram for oxygen is $lithium.orbitalDiagram</p>
 * ```
 */
export const OrbitalDiagram: BasicComponent<OrbitalDiagramData> = ({
    node,
    htmlId,
}) => {
    const ariaLabel = buildAriaLabel(node.data.props.value);
    return (
        <div
            className="orbital-diagram"
            id={htmlId}
            role="img"
            aria-label={ariaLabel}
            tabIndex={0}
        >
            {node.data.props.value.map(({ orbitalText, boxes }, groupIndex) => (
                <div key={groupIndex} className="orbital-group">
                    <div className="orbital-boxes">
                        {boxes.map((box, i) => (
                            <OrbitalBox key={i} box={box} />
                        ))}
                    </div>
                    <div className="orbital-label" aria-hidden="true">
                        {orbitalText}
                    </div>
                </div>
            ))}
        </div>
    );
};
