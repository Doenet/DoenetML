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

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MathQuill from "./mathquill-loader";

const EditableMathField = ({
    latex,
    onChange,
    config,
    mathquillDidMount,
    ...otherProps
}) => {
    // MathQuill fire 2 edit events on startup.
    const ignoreEditEvents = useRef(2);
    const mathField = useRef(null);
    const wrapperElement = useRef(null);

    // This is required to prevent state closure over the onChange function
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Setup MathQuill on the wrapperElement
    useEffect(() => {
        if (!wrapperElement.current) return;

        let combinedConfig = {
            restrictMismatchedBrackets: true,
            handlers: {},
        };

        if (config) {
            combinedConfig = {
                ...combinedConfig,
                ...config,
            };
        }

        const configEditHandler = combinedConfig.handlers.edit;
        combinedConfig.handlers.edit = (mathField) => {
            if (configEditHandler) configEditHandler();

            if (ignoreEditEvents.current > 0) {
                ignoreEditEvents.current -= 1;
            } else {
                if (onChangeRef.current) onChangeRef.current(mathField);
            }
        };

        mathField.current = MathQuill.MathField(
            wrapperElement.current,
            combinedConfig,
        );
        mathField.current.latex(latex || "");

        if (mathquillDidMount) mathquillDidMount(mathField.current);
    }, [wrapperElement]);

    useEffect(() => {
        if (mathField.current && mathField.current.latex() !== latex) {
            mathField.current.latex(latex);
        }
    }, [latex]);

    const ariaLabel = otherProps.ariaLabel;
    delete otherProps.ariaLabel;

    return <span {...otherProps} aria-label={ariaLabel} ref={wrapperElement} />;
};

EditableMathField.propTypes = {
    latex: PropTypes.string,
    onChange: PropTypes.func,
    config: PropTypes.object,
    mathquillDidMount: PropTypes.func,
};

export { EditableMathField };
