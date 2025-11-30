/**
 * MIT License
 *
 * Copyright (c) 2019 Viktor Hundahl Strate
 * https://github.com/viktorstrate/react-mathquill
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export interface EditableMathFieldProps
    extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onChange"> {
    onChange?: (mathField: MathField) => void;
    latex?: string;
    config?: MathFieldConfig;
    mathquillDidMount?: (mathField: MathField) => void;
}

export interface MathFieldConfig {
    spaceBehavesLikeTab?: boolean;
    leftRightIntoCmdGoes?: "up" | "down";
    restrictMismatchedBrackets?: boolean;
    sumStartsWithNEquals?: boolean;
    supSubsRequireOperand?: boolean;
    charsThatBreakOutOfSupSub?: string;
    autoSubscriptNumerals?: boolean;
    autoCommands?: string;
    autoOperatorNames?: string;
    substituteTextarea?: () => void;
    handlers?: {
        deleteOutOf?: (direction: Direction, mathField: MathField) => void;
        moveOutOf?: (direction: Direction, mathField: MathField) => void;
        selectOutOf?: (direction: Direction, mathField: MathField) => void;
        downOutOf?: (mathField: MathField) => void;
        upOutOf?: (mathField: MathField) => void;
        edit?: (mathField: MathField) => void;
        enter?: (mathField: MathField) => void;
    };
    maxDepth?: number;
}

export enum Direction {
    R,
    L,
}

export interface MathField {
    revert(): void;
    reflow(): void;
    el(): HTMLElement;
    latex(): string;
    latex(latexString: string): void;
    text(): string;
    focus(): void;
    blur(): void;
    write(latex: string): void;
    cmd(latexString: string): void;
    select(): void;
    clearSelection(): void;
    moveToLeftEnd(): void;
    moveToRightEnd(): void;
    keystroke(keys: string): void;
    typedText(text: string): void;
    config(newConfig: MathFieldConfig): void;
}
