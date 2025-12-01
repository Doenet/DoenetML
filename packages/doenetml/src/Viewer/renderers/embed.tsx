// @ts-nocheck
import React, { useEffect, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function Figure(props) {
    let { id, SVs, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    useEffect(() => {
        if (SVs.encodedGeogebraContent) {
            let doenetSvData = SVs;

            let cIdx = id;

            let width = sizeToCSS(SVs.width);
            let height = sizeToCSS(SVs.height);

            MathJax.startup.promise.then(function () {
                let parameters = {
                    id: cIdx,
                    width,
                    height,
                    showResetIcon: false,
                    enableLabelDrags: false,
                    useBrowserForJS: true,
                    showMenubar: false,
                    errorDialogsActive: true,
                    showToolbar: false,
                    showAlgebraicInput: false,
                    enableShiftDragZoom: true,
                    enableRightClick: true,
                    showToolBarHelp: false,
                    ggbBase64: doenetSvData.encodedGeogebraContent.trim(),
                    language: "en",
                    country: "US",
                    isPreloader: false,
                    screenshotGenerator: false,
                    preventFocus: false,
                    fixApplet: false,
                    prerelease: false,
                    playButtonAutoDecide: true,
                    playButton: false,
                    canary: false,
                    allowUpscale: false,
                };
                let applet = new window.GGBApplet(parameters, true);
                applet.setHTML5Codebase("/geogebra/HTML5/5.0/web/", "true");
                applet.inject("container_" + cIdx, "preferhtml5");
            });
        }
    }, []);

    if (SVs.hidden) {
        return null;
    }

    let width = sizeToCSS(SVs.width);
    let height = sizeToCSS(SVs.height);

    if (SVs.geogebra) {
        return (
            <div className="geogebra" id={id} ref={ref}>
                <iframe
                    scrolling="no"
                    title=""
                    src={`https://www.geogebra.org/material/iframe/id/${SVs.geogebra}/width/${width}/height/${height}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`}
                    width={width}
                    height={height}
                    style={{ border: "0px" }}
                >
                    {" "}
                </iframe>
            </div>
        );
    } else if (SVs.encodedGeogebraContent) {
        return (
            <div className="javascriptapplet" id={id} ref={ref}>
                <div
                    className="geogebrawebapplet"
                    id={"container_" + id}
                    style={{ minWidth: width, minHeight: height }}
                />
            </div>
        );
    }

    console.warn("Nothing specified to embed");
    return null;
});
