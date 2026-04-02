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
 *
 * =============================================================================
 * ACCESSIBILITY CUSTOMIZATION
 * =============================================================================
 * This component has been customized to keep accessibility semantics on
 * MathQuill's internal textarea (the focused control).
 *
 * PROBLEM:
 *   MathQuill creates an internal textarea and sets aria-labelledby to its own
 *   auto-generated mathspeak span (e.g., "Math Input: x squared"). Wrapper-level
 *   attributes are not sufficient for focused-input announcements, so explicit
 *   labels and supplementary annotations must be applied on the textarea itself.
 *
 * SOLUTION:
 *   1) After MathQuill mounts, prepend explicit label IDs (internal/external
 *      labels and shortDescription fallback ID) to the textarea's aria-labelledby,
 *      preserving MathQuill's auto-generated math speech ID.
 *   2) Mirror supplementary aria-description and aria-details from props onto
 *      the same internal textarea, and keep them in sync as props change.
 *   Result: the focused control carries both primary labeling and supplementary
 *   accessibility relationships.
 *
 * AFFECTED PROPS (passed from parent, typically mathInput.tsx):
 *   - labelIds: Array of label element IDs (e.g., from <label htmlFor>)
 *   - shortDescriptionId: ID of a <span> with shortDescription text
 *   - aria-description: Supplemental description text
 *   - aria-details: Space-separated IDs for related detail regions
 *
 * UPDATING FROM UPSTREAM:
 *   If react-mathquill is updated, preserve both accessibility effects:
 *   - the aria-labelledby merge effect (runs after MathQuill init)
 *   - the aria-description/aria-details mirroring effect
 *   These are specific to Doenet's accessibility behavior.
 * =============================================================================
 */

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MathQuill from "./mathquill-loader";

const EditableMathField = ({
    latex,
    onChange,
    config,
    mathquillDidMount,
    labelIds,
    shortDescriptionId,
    "aria-description": ariaDescription,
    "aria-details": ariaDetails,
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

    // Preserve MathQuill's own labelled-by ids so we can rebuild a merged value
    // whenever explicit label inputs change.
    const mathquillAriaLabelledByIdsRef = useRef(null);

    useEffect(() => {
        if (!mathField.current || !wrapperElement.current) return;

        const textarea = wrapperElement.current.querySelector("textarea");
        if (!textarea) return;

        // Collect all label IDs that should be included, avoiding duplicates
        const allLabelIds = [];
        const seenIds = new Set();

        if (labelIds && Array.isArray(labelIds)) {
            labelIds.forEach((id) => {
                if (id && !seenIds.has(id)) {
                    allLabelIds.push(id);
                    seenIds.add(id);
                }
            });
        }

        if (shortDescriptionId && !seenIds.has(shortDescriptionId)) {
            allLabelIds.push(shortDescriptionId);
            seenIds.add(shortDescriptionId);
        }

        if (mathquillAriaLabelledByIdsRef.current === null) {
            const mathquillAriaLabelledBy =
                textarea.getAttribute("aria-labelledby") || "";
            let mathquillIds = mathquillAriaLabelledBy
                .split(" ")
                .filter(Boolean);

            // Fallback for timing cases where MathQuill hasn't yet reflected
            // aria-labelledby on the textarea when this effect first runs.
            if (mathquillIds.length === 0) {
                const mathspeak =
                    wrapperElement.current.querySelector(".mq-mathspeak[id]");
                if (mathspeak?.id) {
                    mathquillIds = [mathspeak.id];
                }
            }

            mathquillAriaLabelledByIdsRef.current = mathquillIds;
        }

        const mergedIds = [
            ...allLabelIds,
            ...(mathquillAriaLabelledByIdsRef.current || []),
        ]
            .filter(Boolean)
            .filter((id, ind, arr) => arr.indexOf(id) === ind);

        if (mergedIds.length > 0) {
            textarea.setAttribute("aria-labelledby", mergedIds.join(" "));
        } else {
            textarea.removeAttribute("aria-labelledby");
        }
    }, [labelIds, shortDescriptionId]);

    useEffect(() => {
        if (mathField.current && mathField.current.latex() !== latex) {
            mathField.current.latex(latex);
        }
    }, [latex]);

    // Keep supplementary annotations on the focused textarea (not only wrapper span).
    useEffect(() => {
        if (!wrapperElement.current) return;

        const textarea = wrapperElement.current.querySelector("textarea");
        if (!textarea) return;

        if (ariaDescription) {
            textarea.setAttribute("aria-description", ariaDescription);
        } else {
            textarea.removeAttribute("aria-description");
        }

        if (ariaDetails) {
            textarea.setAttribute("aria-details", ariaDetails);
        } else {
            textarea.removeAttribute("aria-details");
        }
    }, [ariaDescription, ariaDetails]);

    const ariaLabel = otherProps.ariaLabel;
    delete otherProps.ariaLabel;

    return <span {...otherProps} aria-label={ariaLabel} ref={wrapperElement} />;
};

EditableMathField.propTypes = {
    latex: PropTypes.string,
    onChange: PropTypes.func,
    config: PropTypes.object,
    mathquillDidMount: PropTypes.func,
    /**
     * ACCESSIBILITY: Array of IDs of elements that label this input.
     * These are prepended to aria-labelledby on the textarea, so the label
     * is announced before MathQuill's auto-generated math description.
     */
    labelIds: PropTypes.arrayOf(PropTypes.string),
    /**
     * ACCESSIBILITY: ID of a span or div containing a shortDescription.
     * Prepended to aria-labelledby for textual inputs with no explicit label.
     */
    shortDescriptionId: PropTypes.string,
    /**
     * ACCESSIBILITY: Supplementary description announced by supporting AT.
     * Applied directly to MathQuill's internal textarea.
     */
    "aria-description": PropTypes.string,
    /**
     * ACCESSIBILITY: IDs of related details (e.g., preview/description content).
     * Applied directly to MathQuill's internal textarea.
     */
    "aria-details": PropTypes.string,
};

export { EditableMathField };
