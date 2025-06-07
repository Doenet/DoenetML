import React, { useContext } from "react";
import { DocContext } from "../DocViewer";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import styled from "styled-components";
import { cesc } from "@doenet/utils";

const RefButton = styled.button`
    position: relative;
    height: 24px;
    display: inline-block;
    color: white;
    color: ${(props) =>
        props.disabled ? "var(--canvastext)" : "var(--canvas)"};
    background-color: ${(props) =>
        props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};

    padding: 2px;
    border: none;
    border-radius: var(--mainBorderRadius);
    cursor: pointer;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    padding: 1px 6px 1px 6px;

    &:hover {
        background-color: ${(props) =>
            props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
        color: ${(props) =>
            props.disabled ? "var(--canvastext)" : "var(--canvas)"};
    }

    &:focus {
        outline: 2px solid var(--mainBlue);
        outline-offset: 2px;
    }
`;

export default React.memo(function Ref(props: UseDoenetRendererProps) {
    let { name, id, SVs, children } = useDoenetRenderer(props);

    let { linkSettings } = useContext(DocContext) || {};

    // XXX: location is never supplied, so this will always be empty
    //let search = location.search || "";
    let search = "";

    if (SVs.hidden) {
        return null;
    }

    let linkContent = children;
    if (children.length === 0) {
        linkContent = SVs.linkText;
    }

    let { targetForATag, url, haveValidTarget, externalUri } = getURLFromRef({
        cid: SVs.cid,
        activityId: SVs.activityId,
        variantIndex: SVs.variantIndex,
        edit: SVs.edit,
        hash: SVs.hash,
        givenUri: SVs.uri,
        targetName: SVs.targetName,
        linkSettings: linkSettings || {},
        search,
        id,
    });

    if (SVs.createButton) {
        if (targetForATag === "_blank") {
            return (
                <span id={id}>
                    <RefButton
                        id={id + "_button"}
                        onClick={() =>
                            window.open(url, targetForATag || undefined)
                        }
                        disabled={SVs.disabled}
                    >
                        {SVs.linkText}
                    </RefButton>
                </span>
            );
        } else {
            return (
                <span id={id}>
                    <RefButton
                        id={id + "_button"}
                        onClick={() => {
                            window.location.href = url;
                        }}
                        disabled={SVs.disabled}
                    >
                        {SVs.linkText}
                    </RefButton>
                </span>
            );
        }
    } else {
        if (haveValidTarget) {
            // TODO: we cannot use a `<Link>` since component is not necessarily contained in a <Router>.
            // We need a solution for proper behavior of scrolling
            return (
                <a
                    style={{
                        color: "var(--mainBlue)",
                        borderRadius: "5px",
                    }}
                    target={targetForATag || undefined}
                    id={id}
                    href={url}
                >
                    {linkContent}
                </a>
            );
        } else {
            return <span id={id}>{linkContent}</span>;
        }
    }
});

// TODO: fix this function as it assume conventions that are no longer valid
export function getURLFromRef({
    cid,
    activityId,
    variantIndex,
    edit,
    hash,
    givenUri,
    targetName = "",
    linkSettings,
    search = "",
    id = "",
}: {
    cid?: string;
    activityId?: string;
    variantIndex?: number;
    edit?: boolean;
    hash?: string;
    givenUri?: string;
    targetName?: string;
    linkSettings: Record<string, any>;
    search?: string;
    id?: string;
}) {
    // possible linkSettings
    // - viewURL
    // - editURL
    // - useQueryParameters

    let url = "";
    let targetForATag: string | null = "_blank";
    let haveValidTarget = false;
    let externalUri = false;

    if (cid || activityId) {
        if (cid) {
            if (linkSettings.useQueryParameters) {
                url = `cid=${cid}`;
            } else {
                // TODO: make this URL work for create another URL to reference by cid
                url = `/${cid}`;
            }
        } else {
            if (linkSettings.useQueryParameters) {
                url = `doenetId=${activityId}`;
            } else {
                url = `/${activityId}`;
            }
        }
        if (variantIndex) {
            // TODO: how to specify variant if don't useQueryParameters
            if (linkSettings.useQueryParameters) {
                url += `&variant=${variantIndex}`;
            }
        }

        if (linkSettings.useQueryParameters) {
            let baseUrl =
                edit == true ? linkSettings.editURL : linkSettings.viewURL;
            if (baseUrl.includes("?")) {
                if (baseUrl[baseUrl.length - 1] !== "?") {
                    baseUrl += "&";
                }
            } else {
                baseUrl += "?";
            }
            url = baseUrl + url;
        } else {
            if (edit == true) {
                url = linkSettings.editURL + url;
            } else {
                url = linkSettings.viewURL + url;
            }
        }

        haveValidTarget = true;

        if (hash) {
            url += hash;
        } else {
            if (targetName) {
                url += "#" + cesc(targetName);
            }
        }
    } else if (givenUri) {
        url = givenUri;
        if (
            url.substring(0, 8) === "https://" ||
            url.substring(0, 7) === "http://" ||
            url.substring(0, 7) === "mailto:"
        ) {
            haveValidTarget = true;
            externalUri = true;
        }
    } else {
        url = search;

        let firstSlash = id.indexOf("\\/");
        let prefix = id.substring(0, firstSlash);
        url += "#" + prefix;
        url += cesc(targetName);
        targetForATag = null;
        haveValidTarget = true;
    }
    return { targetForATag, url, haveValidTarget, externalUri };
}
