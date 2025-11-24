import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
//@ts-expect-error no type declaration
import me from "math-expressions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("EigenDecomposition Tag Tests", async () => {
    function reviveComplex(num: number | { re: number; im: number }) {
        if (typeof num === "number") {
            return me.math.complex({ re: num, im: 0 });
        } else {
            return me.math.complex({ re: num.re, im: num.im });
        }
    }

    it("2x2 matrices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>A = <math name="A" format="latex">
      \\begin{pmatrix}
      1 & 2\\\\
      2 & 1
      \\end{pmatrix}
    </math></p>
    <p>B = <math name="B" format="latex">
      \\begin{pmatrix}
      1 & 2\\\\
      -2 & 1
      \\end{pmatrix}
    </math></p>
    
    <eigenDecomposition name="Ad">
      $A
    </eigenDecomposition>
    <eigenDecomposition name="Bd">
      $B
    </eigenDecomposition>

    <p name="pAevs">Eigenvalues of A: <asList name="Aevs"><numberList extend="$Ad.eigenvalues" name="Aevsa" /></asList></p>
    <p>1st eigenvalue of A: <number extend="$Ad.eigenvalue1" name="Aev1" /></p>
    <p>2nd eigenvalue of A: <number extend="$Ad.eigenvalue2" name="Aev2" /></p>

    <p name="pAevecs">Eigenvectors of A: <asList name="Aevecs"><vectorList extend="$Ad.eigenvectors" name="Aevecsa" /></asList></p>
    <p>1st eigenvector of A: <vector extend="$Ad.eigenvector1" name="Aevec1" /></p>
    <p>2nd eigenvector of A: <vector extend="$Ad.eigenvector2" name="Aevec2" /></p>
    <p>1st component of 1st eigenvector of A: <number extend="$Ad.eigenvector1.x" name="Aevec1x" /></p>
    <p>2nd component of 1st eigenvector of A: <number extend="$Ad.eigenvector1.y" name="Aevec1y" /></p>

    <p name="pBevs">Eigenvalues of B: <asList name="Bevs"><numberList extend="$Bd.eigenvalues" name="Bevsa" /></asList></p>
    <p>1st eigenvalue of B: <number extend="$Bd.eigenvalue1" name="Bev1" /></p>
    <p>2nd eigenvalue of B: <number extend="$Bd.eigenvalue2" name="Bev2" /></p>

    <p name="pBevecs">Eigenvectors of B: <asList name="Bevecs"><vectorList extend="$Bd.eigenvectors" name="Bevecsa" /></asList></p>
    <p>1st eigenvector of B: <vector extend="$Bd.eigenvector1" name="Bevec1" /></p>
    <p>2nd eigenvector of B: <vector extend="$Bd.eigenvector2" name="Bevec2" /></p>
    <p>1st component of 1st eigenvector of B: <number extend="$Bd.eigenvector1.x" name="Bevec1x" /></p>
    <p>2nd component of 1st eigenvector of B: <number extend="$Bd.eigenvector1.y" name="Bevec1y" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pAevs")].stateValues
                .text,
        ).eqls("Eigenvalues of A: -1, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev1")].stateValues
                .value,
        ).eqls(-1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev2")].stateValues
                .value,
        ).eqls(3);

        expect(
            stateVariables[await resolvePathToNodeIdx("pBevs")].stateValues
                .text,
        ).eqls("Eigenvalues of B: 1 + 2 i, 1 - 2 i");
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev1")].stateValues.text,
        ).eqls("1 + 2 i");
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev2")].stateValues.text,
        ).eqls("1 - 2 i");

        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvalues,
        ).eqls([-1, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev1")].stateValues
                .value,
        ).eq(-1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevsa[1]")].stateValues
                .value,
        ).eq(-1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev2")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevsa[2]")].stateValues
                .value,
        ).eq(3);

        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvectors[0][1] /
                stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                    .eigenvectors[0][0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvectors[1][1] /
                stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                    .eigenvectors[1][0],
        ).closeTo(1, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec1")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevec1")].stateValues
                    .displacement[0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevecsa[1]")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevecsa[1]")]
                    .stateValues.displacement[0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec2")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevec2")].stateValues
                    .displacement[0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevecsa[2]")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevecsa[2]")]
                    .stateValues.displacement[0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec1y")].stateValues
                .value /
                stateVariables[await resolvePathToNodeIdx("Aevec1x")]
                    .stateValues.value,
        ).closeTo(-1, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[0].re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[0].im,
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[1].re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[1].im,
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev1")].stateValues.value
                .re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev1")].stateValues.value
                .im,
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[1]")].stateValues
                .value.re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[1]")].stateValues
                .value.im,
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev2")].stateValues.value
                .re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev2")].stateValues.value
                .im,
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[2]")].stateValues
                .value.re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[2]")].stateValues
                .value.im,
        ).closeTo(-2, 1e-14);

        let ratio = me.math.divide(
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[0][1],
            ),
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[0][0],
            ),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);
        ratio = me.math.divide(
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[1][1],
            ),
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[1][0],
            ),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(-1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec1")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec1")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[1]")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[1]")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec2")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec2")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(-1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[2]")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[2]")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(-1, 1e-14);

        ratio = me.math.divide(
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bevec1y")]
                    .stateValues.value,
            ),
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bevec1x")]
                    .stateValues.value,
            ),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);
    });

    it("2x2 matrices, fractions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>A = <math name="A" format="latex">
      \\begin{pmatrix}
      2/2 & 6/3\\\\
      8/4 & 5/5
      \\end{pmatrix}
    </math></p>
    <p>B = <math name="B" format="latex">
      \\begin{pmatrix}
      2/2 & 6/3\\\\
      -8/4 & 5/5
      \\end{pmatrix}
    </math></p>
    
    <eigenDecomposition name="Ad">
      $A
    </eigenDecomposition>
    <eigenDecomposition name="Bd">
      $B
    </eigenDecomposition>

    <p name="pAevs">Eigenvalues of A: <asList name="Aevs"><numberList extend="$Ad.eigenvalues" name="Aevsa" /></asList></p>
    <p>1st eigenvalue of A: <number extend="$Ad.eigenvalue1" name="Aev1" /></p>
    <p>2nd eigenvalue of A: <number extend="$Ad.eigenvalue2" name="Aev2" /></p>

    <p name="pAevecs">Eigenvectors of A: <asList name="Aevecs"><vectorList extend="$Ad.eigenvectors" name="Aevecsa" /></asList></p>
    <p>1st eigenvector of A: <vector extend="$Ad.eigenvector1" name="Aevec1" /></p>
    <p>2nd eigenvector of A: <vector extend="$Ad.eigenvector2" name="Aevec2" /></p>
    <p>1st component of 1st eigenvector of A: <number extend="$Ad.eigenvector1.x" name="Aevec1x" /></p>
    <p>2nd component of 1st eigenvector of A: <number extend="$Ad.eigenvector1.y" name="Aevec1y" /></p>

    <p name="pBevs">Eigenvalues of B: <asList name="Bevs"><numberList extend="$Bd.eigenvalues" name="Bevsa" /></asList></p>
    <p>1st eigenvalue of B: <number extend="$Bd.eigenvalue1" name="Bev1" /></p>
    <p>2nd eigenvalue of B: <number extend="$Bd.eigenvalue2" name="Bev2" /></p>

    <p name="pBevecs">Eigenvectors of B: <asList name="Bevecs"><vectorList extend="$Bd.eigenvectors" name="Bevecsa" /></asList></p>
    <p>1st eigenvector of B: <vector extend="$Bd.eigenvector1" name="Bevec1" /></p>
    <p>2nd eigenvector of B: <vector extend="$Bd.eigenvector2" name="Bevec2" /></p>
    <p>1st component of 1st eigenvector of B: <number extend="$Bd.eigenvector1.x" name="Bevec1x" /></p>
    <p>2nd component of 1st eigenvector of B: <number extend="$Bd.eigenvector1.y" name="Bevec1y" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pAevs")].stateValues
                .text,
        ).eqls("Eigenvalues of A: -1, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev1")].stateValues
                .value,
        ).eqls(-1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev2")].stateValues
                .value,
        ).eqls(3);

        expect(
            stateVariables[await resolvePathToNodeIdx("pBevs")].stateValues
                .text,
        ).eqls("Eigenvalues of B: 1 + 2 i, 1 - 2 i");
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev1")].stateValues.text,
        ).eqls("1 + 2 i");
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev2")].stateValues.text,
        ).eqls("1 - 2 i");

        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvalues,
        ).eqls([-1, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev1")].stateValues
                .value,
        ).eq(-1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevsa[1]")].stateValues
                .value,
        ).eq(-1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev2")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevsa[2]")].stateValues
                .value,
        ).eq(3);

        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvectors[0][1] /
                stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                    .eigenvectors[0][0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvectors[1][1] /
                stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                    .eigenvectors[1][0],
        ).closeTo(1, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec1")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevec1")].stateValues
                    .displacement[0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevecsa[1]")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevecsa[1]")]
                    .stateValues.displacement[0],
        ).closeTo(-1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec2")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevec2")].stateValues
                    .displacement[0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevecsa[2]")].stateValues
                .displacement[1] /
                stateVariables[await resolvePathToNodeIdx("Aevecsa[2]")]
                    .stateValues.displacement[0],
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec1y")].stateValues
                .value /
                stateVariables[await resolvePathToNodeIdx("Aevec1x")]
                    .stateValues.value,
        ).closeTo(-1, 1e-14);

        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[0].re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[0].im,
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[1].re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                .eigenvalues[1].im,
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev1")].stateValues.value
                .re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev1")].stateValues.value
                .im,
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[1]")].stateValues
                .value.re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[1]")].stateValues
                .value.im,
        ).closeTo(2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev2")].stateValues.value
                .re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bev2")].stateValues.value
                .im,
        ).closeTo(-2, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[2]")].stateValues
                .value.re,
        ).closeTo(1, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("Bevsa[2]")].stateValues
                .value.im,
        ).closeTo(-2, 1e-14);

        let ratio = me.math.divide(
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[0][1],
            ),
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[0][0],
            ),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);
        ratio = me.math.divide(
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[1][1],
            ),
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bd")].stateValues
                    .eigenvectors[1][0],
            ),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(-1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec1")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec1")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[1]")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[1]")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec2")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevec2")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(-1, 1e-14);

        ratio = me.math.divide(
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[2]")]
                        .stateValues.displacement[1],
                )
                .evaluate_to_constant(),
            me
                .fromAst(
                    stateVariables[await resolvePathToNodeIdx("Bevecsa[2]")]
                        .stateValues.displacement[0],
                )
                .evaluate_to_constant(),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(-1, 1e-14);

        ratio = me.math.divide(
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bevec1y")]
                    .stateValues.value,
            ),
            reviveComplex(
                stateVariables[await resolvePathToNodeIdx("Bevec1x")]
                    .stateValues.value,
            ),
        );
        expect(ratio.re).closeTo(0, 1e-14);
        expect(ratio.im).closeTo(1, 1e-14);
    });

    it("3x3 matrices with real eigenvectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<matrix name="A">
    <row>1 2 3</row>
    <row>4 5 6</row>
    <row>7 8 9</row>
</matrix>
<eigenDecomposition name="eig">$A</eigenDecomposition>
        `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const eigvals =
            stateVariables[await resolvePathToNodeIdx("eig")].stateValues
                .eigenvalues;
        const eigvecs =
            stateVariables[await resolvePathToNodeIdx("eig")].stateValues
                .eigenvectors;
        expect(eigvals[0]).closeTo(0, 1e-14);
        const ev0x = 1;
        const ev0y = -2;
        const ev0z = 1;
        expect(eigvecs[0][0] / eigvecs[0][1]).closeTo(ev0x / ev0y, 1e-13);
        expect(eigvecs[0][0] / eigvecs[0][2]).closeTo(ev0x / ev0z, 1e-13);

        expect(eigvals[1]).closeTo((-3 / 2) * (Math.sqrt(33) - 5), 1e-14);
        const ev1x = (1 / 22) * (-11 - 3 * Math.sqrt(33));
        const ev1y = (1 / 44) * (11 - 3 * Math.sqrt(33));
        const ev1z = 1;
        expect(eigvecs[1][0] / eigvecs[1][1]).closeTo(ev1x / ev1y, 1e-13);
        expect(eigvecs[1][0] / eigvecs[1][2]).closeTo(ev1x / ev1z, 1e-13);

        expect(eigvals[2]).closeTo((3 / 2) * (5 + Math.sqrt(33)), 1e-14);
        const ev2x = (1 / 22) * (-11 + 3 * Math.sqrt(33));
        const ev2y = (1 / 44) * (11 + 3 * Math.sqrt(33));
        const ev2z = 1;
        expect(eigvecs[2][0] / eigvecs[2][1]).closeTo(ev2x / ev2y, 1e-13);
        expect(eigvecs[2][0] / eigvecs[2][2]).closeTo(ev2x / ev2z, 1e-13);
    });

    async function check_eigendecomposition({
        evecs,
        evals,
        core,
        resolvePathToNodeIdx,
        decompositionName,
    }: {
        evecs: any[][];
        evals: any[];
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        decompositionName: string;
    }) {
        const decompositionIdx = await resolvePathToNodeIdx(decompositionName);

        const stateVariables = await core.returnAllStateVariables(false, true);
        const actualEvals =
            stateVariables[decompositionIdx].stateValues.eigenvalues.map(
                reviveComplex,
            );
        const actualEvecs = stateVariables[
            decompositionIdx
        ].stateValues.eigenvectors.map((v: any) => v.map(reviveComplex));
        const n = evecs.length;
        expect(actualEvals.length).eqls(n);
        expect(actualEvecs.length).eqls(n);

        for (let i = 0; i < n; i++) {
            expect(actualEvals[i].re).closeTo(evals[i].re, 1e-12);
            expect(actualEvals[i].im).closeTo(evals[i].im, 1e-12);

            for (let j = 1; j < n; j++) {
                let ratio = me.math.divide(evecs[i][0], evecs[i][j]);
                let actualRatio = me.math.divide(
                    actualEvecs[i][0],
                    actualEvecs[i][j],
                );
                expect(actualRatio.re).closeTo(ratio.re, 1e-12);
                expect(actualRatio.im).closeTo(ratio.im, 1e-12);
            }
        }
    }

    it("3x3 matrix, center and spirals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            
<number name="a11">-9</number>
<number name="a12">-4</number>
<number name="a22">-8</number>
<number name="a23">9</number>
<number name="a31">-1</number>
<number name="a33">-5</number>

<number name='c'>-(2*$a11 *$a22 *$a33 +$a11 *$a22 *($a11 +$a22 )+$a11 *$a33 *($a11 +$a33 )+$a22 *$a33 *($a22 +$a33 ) - $a12 *$a23 *$a31 )</number>
<number name='b' >$a31 *($a11 +$a33 )+$a12 *($a11 +$a22 )+$a23 *($a22 +$a33 )</number>
<number name='sqrt_arg' >$b **3/27 + $c **2/4</number>
<number name='parCenter' displayDigits="14" >$b /(3*($c /2 + sqrt($sqrt_arg ))**(1/3)) - ($c /2 + sqrt($sqrt_arg ))**(1/3)</number>

<number name="parStableSpiral">$parCenter + 0.1</number>
<number name="parUnstableSpiral">$parCenter - 0.1</number>

<math name="A_center" format="latex">\\begin{pmatrix}
    $a11 & $a12 & $parCenter\\\\
    $parCenter & $a22 & $a23\\\\
    $a31 & $parCenter & $a33
\\end{pmatrix}</math>
<eigenDecomposition name="Ad_center">$A_center</eigenDecomposition>

<math name="A_stableSpiral" format="latex">\\begin{pmatrix}
    $a11 & $a12 & $parStableSpiral\\\\
    $parStableSpiral & $a22 & $a23\\\\
    $a31 & $parStableSpiral & $a33
\\end{pmatrix}</math>
<eigenDecomposition name="Ad_stable">$A_stableSpiral</eigenDecomposition>


<math name="A_unstableSpiral" format="latex">\\begin{pmatrix}
    $a11 & $a12 & $parUnstableSpiral\\\\
    $parUnstableSpiral & $a22 & $a23\\\\
    $a31 & $parUnstableSpiral & $a33
\\end{pmatrix}</math>
<eigenDecomposition name="Ad_unstable">$A_unstableSpiral</eigenDecomposition>

        `,
        });

        // Center
        let evals = [me.math.complex({ re: 0, im: 14.78846823004614 })];
        evals.push(me.math.conj(evals[0]));
        evals.push(me.math.complex({ re: -22, im: 0 }));

        let evecs = [
            [
                me.math.complex({
                    re: -0.426486035260864,
                    im: -0.270682079730474,
                }),
                me.math.complex({ re: 0.627291349345459, im: 0 }),
                me.math.complex({
                    re: -0.173343062597144,
                    im: 0.566832090769437,
                }),
            ],
        ];
        evecs.push(evecs[0].map((v) => me.math.conj(v)));
        evecs.push(
            [-0.725759948499824, -0.487701621853287, -0.485200603044974].map(
                (v) => me.math.complex({ re: v, im: 0 }),
            ),
        );
        await check_eigendecomposition({
            evecs,
            evals,
            core,
            resolvePathToNodeIdx,
            decompositionName: "Ad_center",
        });

        // Stable spiral
        evals = [
            me.math.complex({ re: -0.048287227932923, im: 14.703099997319454 }),
            me.math.complex({
                re: -0.048287227932923,
                im: -14.703099997319454,
            }),
            me.math.complex({ re: -21.903425544134173, im: 0 }),
        ];
        evecs = [
            [
                me.math.complex({
                    re: -0.427048386266709,
                    im: -0.269189626634008,
                }),
                me.math.complex({ re: 0.627621340142377, im: 0 }),
                me.math.complex({
                    re: -0.172635887510845,
                    im: 0.566969950209772,
                }),
            ],
        ];
        evecs.push(evecs[0].map((v) => me.math.conj(v)));
        evecs.push(
            [-0.726546459838247, -0.48712036969194, -0.484607044034337].map(
                (v) => me.math.complex({ re: v, im: 0 }),
            ),
        );

        await check_eigendecomposition({
            evecs,
            evals,
            core,
            resolvePathToNodeIdx,
            decompositionName: "Ad_stable",
        });

        // Unstable spiral
        evals = [
            me.math.complex({ re: 0.048306535292557, im: 14.873845525216694 }),
            me.math.complex({ re: 0.048306535292557, im: -14.873845525216694 }),
            me.math.complex({ re: -22.0966130705851, im: 0 }),
        ];
        evecs = [
            [
                me.math.complex({
                    re: -0.425927192657446,
                    im: -0.272156678632516,
                }),
                me.math.complex({ re: 0.626965239909586, im: 0 }),
                me.math.complex({
                    re: -0.174042517907594,
                    im: 0.566692649269571,
                }),
            ],
        ];
        evecs.push(evecs[0].map((v) => me.math.conj(v)));
        evecs.push(
            [-0.724981295406814, -0.488275620239871, -0.485787031516515].map(
                (v) => me.math.complex({ re: v, im: 0 }),
            ),
        );

        await check_eigendecomposition({
            evecs,
            evals,
            core,
            resolvePathToNodeIdx,
            decompositionName: "Ad_unstable",
        });
    });

    it("incomplete set of eigenvectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>A = <math name="A" format="latex">
      \\begin{pmatrix}
      0.9 & 0.1\\\\
      0 & 0.9
      \\end{pmatrix}
    </math></p>
    
    <eigenDecomposition name="Ad">
      $A
    </eigenDecomposition>

    <p name="pAevs">Eigenvalues of A: <asList name="Aevs"><numberList extend="$Ad.eigenvalues" name="Aevsa" /></asList></p>
    <p>1st eigenvalue of A: <number extend="$Ad.eigenvalue1" name="Aev1" /></p>
    <p>2nd eigenvalue of A: <number extend="$Ad.eigenvalue2" name="Aev2" /></p>

    <p name="pAevecs">Eigenvectors of A: <asList name="Aevecs"><vectorList extend="$Ad.eigenvectors" name="Aevecsa" /></asList></p>
    <p>number of eigenvectors of A: <integer extend="$Ad.numEigenvectors" name="AnumVecs" /></p>
    <p>1st eigenvector of A: <vector extend="$Ad.eigenvector1" name="Aevec1" /></p>
    <p>1st component of 1st eigenvector of A: <number extend="$Ad.eigenvector1.x" name="Aevec1x" /></p>
    <p>2nd component of 1st eigenvector of A: <number extend="$Ad.eigenvector1.y" name="Aevec1y" /></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pAevs")].stateValues
                .text,
        ).eqls("Eigenvalues of A: 0.9, 0.9");
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev1")].stateValues
                .value,
        ).eqls(0.9);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev2")].stateValues
                .value,
        ).eqls(0.9);
        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvalues,
        ).eqls([0.9, 0.9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev1")].stateValues
                .value,
        ).eq(0.9);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevsa[1]")].stateValues
                .value,
        ).eq(0.9);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aev2")].stateValues
                .value,
        ).eq(0.9);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevsa[2]")].stateValues
                .value,
        ).eq(0.9);

        expect(
            stateVariables[await resolvePathToNodeIdx("AnumVecs")].stateValues
                .value,
        ).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("Ad")].stateValues
                .eigenvectors,
        ).eqls([[1, 0]]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("Aevec1")
            ].stateValues.displacement.map((v: any) => v.tree),
        ).eqls([1, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("Aevecsa[1]")
            ].stateValues.displacement.map((v: any) => v.tree),
        ).eqls([1, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec1x")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("Aevec1y")].stateValues
                .value,
        ).eq(0);
    });
});
