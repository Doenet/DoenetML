import { prng_alea } from "esm-seedrandom";
import { parseAndCompile } from "@doenet/parser";
// import componentInfoObjects from "../../../assets/assets/componentInfoObjects.json";
import {
    cidFromText,
    retrieveTextFileForCid,
    enumerateCombinations,
    convertDoenetMLAttrRange,
    findAllNewlines,
    getLineCharRange,
} from "@doenet/utils";
import { doenetGlobalConfig } from "../global-config";

let rngClass = prng_alea;

export async function parseActivityDefinition(activityDoenetML, activityCid) {
    // parse the activity DoenetML, validate and normalize the form so that the activityJSON
    // is a single object of type "activity" with:
    // - itemWeights (optional): array of numbers for the weights of credit for resulting pages
    // - shuffleItemWeights: currently not used, but included for the future feature
    //   where an author could decide, in the case where the outer order is a shuffle,
    //   whether or no the item weights should be shuffled along with the pages.
    //   The current behavior is that the item weights are not shuffled and refer to the weights
    //   of the pages after shuffling is finished.
    // - isSinglePage: true if the activity was designated as a single page activity.
    //   This attribute is used in the app to determine if the activity
    //   should be displayed to authors as a multi-page activity.
    //   TODO: determine if this attribute is used downstream from this function or if can omit it here.
    // - numVariants (optional): number of variants of the activity
    // - xmlns (optional, at least for now): xml namespace determining version of the activity
    // - children: array of orders and pages
    // Returns:
    // - activityJSON: the new activityJSON object
    // - errors: array of any errors found

    let result = parseAndCompile(activityDoenetML);

    let errors = result.errors;
    let serializedComponents = result.components;

    serializedComponents = removeOuterBlankStrings(serializedComponents);

    if (
        serializedComponents.length !== 1 ||
        serializedComponents[0].componentType !== "document"
    ) {
        serializedComponents = [
            {
                componentType: "document",
                children: serializedComponents,
            },
        ];
    }

    const serializedDocument = serializedComponents[0];

    // make document props lowercase
    let documentProps = {};
    for (let prop in serializedDocument.props) {
        let lowerProp = prop.toLowerCase();
        if (lowerProp in documentProps) {
            errors.push({
                message: `Invalid activity definition: duplicate attribute ${lowerProp}`,
                doenetMLrange: convertDoenetMLAttrRange(
                    serializedDocument.attributeRanges[prop],
                ),
                displayInActivity: true,
            });
            return {
                success: false,
            };
        }
        documentProps[prop.toLowerCase()] = serializedDocument.props[prop];
    }

    let xmlns;

    if (documentProps.type?.toLowerCase() === "activity") {
        let jsonDefinition = {
            type: "activity",
        };
        delete documentProps.type;

        if (documentProps.itemweights) {
            if (typeof documentProps.itemweights !== "string") {
                errors.push({
                    message: `Invalid activity definition: invalid itemWeights`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        serializedDocument.attributeRanges.itemweights,
                    ),
                    displayInActivity: true,
                });
                return {
                    success: false,
                };
            }
            jsonDefinition.itemWeights = documentProps.itemweights
                .split(/\s+/)
                .filter((s) => s)
                .map(Number);

            delete documentProps.itemweights;
        }

        jsonDefinition.shuffleItemWeights =
            documentProps.shuffleitemweights !== undefined &&
            (documentProps.shuffleitemweights === true ||
                documentProps.shuffleitemweights.toLowerCase() === "true");

        delete documentProps.shuffleitemweights;

        jsonDefinition.isSinglePage =
            documentProps.issinglepage !== undefined &&
            (documentProps.issinglepage === true ||
                documentProps.issinglepage.toLowerCase() === "true");

        delete documentProps.issinglepage;

        if (documentProps.xmlns) {
            if (
                documentProps.xmlns.slice(0, 34) ===
                "https://doenet.org/spec/doenetml/v"
            ) {
                jsonDefinition.version = documentProps.xmlns.slice(34);
                xmlns = documentProps.xmlns;
                delete documentProps.xmlns;
            } else {
                errors.push({
                    message: `Invalid activity definition: unrecognized xmlns`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        serializedDocument.attributeRanges.xmlns,
                    ),
                    displayInActivity: true,
                });

                return {
                    success: false,
                };
            }
        } else {
            console.warn("no xmlns of activity!");
        }

        if (documentProps.numvariants) {
            jsonDefinition.numVariants = Number(documentProps.numvariants);
            delete documentProps.numvariants;
        }

        if (Object.keys(documentProps).length > 0) {
            let begin = Infinity;
            let end = -Infinity;
            for (let prop in documentProps) {
                let attrRange = convertDoenetMLAttrRange(
                    serializedDocument.attributeRanges[prop],
                );
                begin = Math.min(begin, attrRange.begin);
                end = Math.max(end, attrRange.end);
            }

            errors.push({
                message: `Invalid activity definition: invalid document attributes: ${Object.keys(
                    documentProps,
                ).join(", ")}`,
                doenetMLrange: { begin, end },
                displayInActivity: true,
            });
        }

        let temporaryOrder = {
            type: "order",
            behavior: "sequence",
            children: serializedDocument.children,
        };
        let result = await validateOrder(temporaryOrder, activityDoenetML);

        errors.push(...result.errors);

        jsonDefinition.children = result.order.children;

        return { activityJSON: jsonDefinition, errors };
    } else {
        let page = {
            type: "page",
            doenetML: activityDoenetML,
            children: serializedComponents,
            cid: activityCid,
        };

        let jsonDefinition = {
            type: "activity",
            children: [page],
        };

        if (documentProps.xmlns) {
            if (
                documentProps.xmlns.slice(0, 34) ===
                "https://doenet.org/spec/doenetml/v"
            ) {
                jsonDefinition.version = documentProps.xmlns.slice(34);
                delete documentProps.xmlns;
            } else {
                errors.push({
                    message: `Invalid activity definition: unrecognized xmlns`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        serializedDocument.attributeRanges.xmlns,
                    ),
                    displayInActivity: true,
                });
            }
        } else {
            console.warn("no xmlns of activity!");
        }

        return { activityJSON: jsonDefinition, errors };
    }

    async function validateOrder(order, activityDoenetML) {
        // Process the order object from parsing the activity definition,
        // creating a new order object with
        // - behavior (if in original order)
        // - numberToSelect (if in original order)
        // - withReplacement (if in original order)
        // - children: array of pages or orders
        // Returns:
        // - order: the new order object
        // - errors: array of any errors found

        let errors = [];

        let newOrder = { type: "order" };

        let orderProps = {};
        for (let prop in order.props) {
            let lowerProp = prop.toLowerCase();
            if (lowerProp in orderProps) {
                errors.push({
                    message: `duplicate attribute of <order>: ${lowerProp}`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        order.attributeRanges[prop],
                    ),
                    displayInActivity: true,
                });
            }
            orderProps[prop.toLowerCase()] = order.props[prop];
        }

        for (let prop in orderProps) {
            if (prop === "behavior") {
                newOrder.behavior = orderProps.behavior;
            } else if (prop == "numbertoselect") {
                newOrder.numberToSelect = Number(orderProps.numbertoselect);
            } else if (prop == "withreplacement") {
                newOrder.withReplacement =
                    orderProps.withreplacement !== undefined &&
                    (orderProps.withreplacement === true ||
                        orderProps.withreplacement.toLowerCase() === "true");
            } else {
                errors.push({
                    message: `invalid <order> attribute: ${prop}`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        order.attributeRanges[prop],
                    ),
                    displayInActivity: true,
                });
            }
        }

        // remove blank string children
        let orderChildren = order.children.filter(
            (x) => typeof x !== "string" || /\S/.test(x),
        );

        let children = [];
        for (let child of orderChildren) {
            if (typeof child === "string") {
                errors.push({
                    message: `invalid child of <order>, found string`,
                    doenetMLrange: order.doenetMLrange, // just use order for now, since don't have range for string
                    displayInActivity: true,
                });
            } else if (child.componentType.toLowerCase() === "order") {
                let result = await validateOrder(child, activityDoenetML);
                children.push(result.order);
                errors.push(...result.errors);
            } else if (child.componentType.toLowerCase() == "page") {
                let result = await validatePage(child, activityDoenetML);
                children.push(result.page);
                errors.push(...result.errors);
            } else {
                errors.push({
                    message: `invalid child of <order>, found type: <${child.componentType}>`,
                    doenetMLrange: child.doenetMLrange,
                    displayInActivity: true,
                });
            }
        }

        newOrder.children = children;

        return {
            order: newOrder,
            errors,
        };
    }

    async function validatePage(page, activityDoenetML) {
        // Process the page object from parsing the activity definition,
        // creating a new page object with
        // - cid
        // - doenetML: the doenetML of the page, or if children is present,
        //   it could be the doenetML of the entire activity, which is OK the doenetML won't be parsed in this case.
        //   The doenetML string needs to correspond to the doenetMLrange of children, if present,
        //   as snippets may be extracted (e.g,. for error messages or doenetML state variables).
        //   The line breaks in doenetML will also be used to calculate line numbers for user messages.
        // - children (optional): the parsed children of the page.
        //   If not present, Core will parse the doenetML string to create the children.
        //   If the contents of the page were provided in the activity definition,
        //   we've already parsed it intot these children,
        //   so we send it to Core to avoid the need to parse it again.
        //   More importantly, we want to use the children parsed with the activity definition,
        //   as the line/character numbers will correspond to what the user composed.
        // Returns:
        // - page: the new page object
        // - errors: array of any errors found

        let errors = [];

        let newPage = { type: "page" };

        let pageProps = {};
        for (let prop in page.props) {
            let lowerProp = prop.toLowerCase();
            if (lowerProp in pageProps) {
                errors.push({
                    message: `duplicate attribute of <page>: ${lowerProp}`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        page.attributeRanges[prop],
                    ),
                    displayInActivity: true,
                });
            }
            pageProps[prop.toLowerCase()] = page.props[prop];
        }

        let foundCid = false;

        for (let prop in pageProps) {
            if (prop === "cid") {
                newPage.cid = pageProps.cid;
                delete pageProps.cid;
                foundCid = true;
            } else if (prop == "label") {
                // we ignore label, at least for now
            } else {
                errors.push({
                    message: `invalid <page> attribute: ${prop}`,
                    doenetMLrange: convertDoenetMLAttrRange(
                        page.attributeRanges[prop],
                    ),
                    displayInActivity: true,
                });
            }
        }

        let pageChildren = removeOuterBlankStrings(page.children);

        if (foundCid) {
            if (pageChildren.length > 0) {
                errors.push({
                    message: `Invalid page: cannot have both cid attribute and children.`,
                    doenetMLrange: page.doenetMLrange,
                    displayInActivity: true,
                });
            }
            try {
                newPage.doenetML = await retrieveTextFileForCid(
                    newPage.cid,
                    "doenet",
                );
            } catch (e) {
                errors.push({
                    message: `DoenetML for page with cid "${newPage.cid}" not found.`,
                    doenetMLrange: page.doenetMLrange,
                    displayInActivity: true,
                });
                newPage.doenetML = "";
            }
        } else if (pageChildren.length > 0) {
            // the page had content inside the <page> tags

            if (
                pageChildren.length > 1 ||
                pageChildren[0].componentType?.toLowerCase() !== "document"
            ) {
                // add document around page components
                pageChildren = [
                    {
                        componentType: "document",
                        children: pageChildren,
                    },
                ];

                if (xmlns) {
                    pageChildren[0].props = { xmlns };
                }
            }

            newPage.children = pageChildren;

            // Note: activityDoenetML is the doenetML of the entire activity, not the just this page.
            // However, the doenetMLrange from the parser is in terms of the activityDoenetML,
            // so this is the correct doenetML to use.
            // Since we pass in serializedComponents, the doenetML will not be parsed or used for the page content.
            newPage.doenetML = activityDoenetML;

            // To calculate the cid, however, we use doenetML of just the page
            let pageDoenetML = activityDoenetML.slice(
                page.doenetMLrange.openEnd,
                page.doenetMLrange.closeBegin - 1,
            );
            newPage.cid = await cidFromText(pageDoenetML);
        } else {
            // No cid and no content specified. Create a blank page.
            newPage.serializedComponents = [
                {
                    componentType: "document",
                },
            ];

            if (xmlns) {
                newPage.serializedComponents[0].props = { xmlns };
            }

            newPage.doenetML = "";
            newPage.cid = await cidFromText(newPage.doenetML);
        }

        return {
            page: newPage,
            errors,
        };
    }
}

function removeOuterBlankStrings(serializedComponents) {
    let firstNonBlankInd, lastNonBlankInd;

    // find any beginning or ending blank strings;
    for (let ind = 0; ind < serializedComponents.length; ind++) {
        let comp = serializedComponents[ind];
        if (typeof comp !== "string" || /\S/.test(comp)) {
            if (firstNonBlankInd === undefined) {
                firstNonBlankInd = ind;
            }
            lastNonBlankInd = ind;
        }
    }

    serializedComponents = serializedComponents.slice(
        firstNonBlankInd,
        lastNonBlankInd + 1,
    );

    return serializedComponents;
}

export async function calculateOrderAndVariants({
    activityDefinition,
    requestedVariantIndex,
    flags = {},
}) {
    let errors = [];

    let activityVariantResult = await determineNumberOfActivityVariants(
        activityDefinition,
        flags,
    );

    let variantIndex =
        ((requestedVariantIndex - 1) % activityVariantResult.numVariants) + 1;
    if (variantIndex < 1) {
        variantIndex += activityVariantResult.numVariants;
    }

    if (!Number.isFinite(variantIndex)) {
        errors.push({
            message: "Invalid requested variant index",
            displayInActivity: true,
        });
        variantIndex = 1;
    }

    let rng = new rngClass(variantIndex.toString());

    let activityPages = [];

    for (let item of activityDefinition.children) {
        let type = item.type.toLowerCase();
        if (type === "page") {
            activityPages.push(item);
        } else if (type === "order") {
            let orderResult = determineOrder(item, rng);
            errors.push(...orderResult.errors);
            activityPages.push(...orderResult.pages);
        } else {
            errors.push({
                message: `Unrecognized item <${item.type}> in activity.`,
                doenetMLrange: item.doenetMLrange,
                displayInActivity: true,
            });
        }
    }

    let itemWeights = activityDefinition.itemWeights || [];

    if (!Array.isArray(itemWeights) || !itemWeights.every((x) => x >= 0)) {
        errors.push({
            message: "Invalid itemWeights",
            displayInActivity: true,
        });
        itemWeights = [];
    }

    let nPages = activityPages.length;

    itemWeights = itemWeights.slice(0, nPages);

    if (itemWeights.length < nPages) {
        itemWeights.push(...Array(nPages - itemWeights.length).fill(1));
    }

    // normalize itemWeights to sum to 1
    let totalWeight = itemWeights.reduce((a, c) => a + c);
    if (totalWeight > 0) {
        itemWeights = itemWeights.map((x) => x / totalWeight);
    }

    let pageVariantsResult;
    let pageCoreWorkersInfo = [];

    if (activityVariantResult.pageVariantsResult) {
        pageVariantsResult = activityVariantResult.pageVariantsResult;
        pageCoreWorkersInfo = activityVariantResult.pageCoreWorkersInfo;
    } else {
        let promises = [];
        pageVariantsResult = [];
        for (let page of activityPages) {
            let coreWorker = createCoreWorker();
            let theInfo = {
                coreWorker,
                doenetML: page.doenetML,
                preliminarySerializedComponents: page.children,
                flags,
            };
            pageCoreWorkersInfo.push(theInfo);
            promises.push(
                initializeCoreWorker(theInfo).then(() => {
                    return returnAllPossibleVariantsFromCoreWorker(coreWorker);
                }),
            );
        }

        // use allSettled to make sure all initializations are run
        let promiseResults = await Promise.allSettled(promises);

        for (let result of promiseResults) {
            if (result.status === "fulfilled") {
                pageVariantsResult.push(result.value);
            } else {
                pageVariantsResult.push(["a"]);
                errors.push({
                    message: `Error initializing activity. ${result.reason}`,
                    displayInActivity: true,
                });
            }
        }
    }

    let variantsByPage;

    let allPossiblePerPage = [];
    let numVariantsPerPage = [];

    for (let possibleVariants of pageVariantsResult) {
        allPossiblePerPage.push(possibleVariants);
        numVariantsPerPage.push(possibleVariants.length);
    }

    let numberOfPageVariantCombinations = numVariantsPerPage.reduce(
        (a, c) => a * c,
        1,
    );

    if (numberOfPageVariantCombinations <= activityVariantResult.numVariants) {
        let pageVariantCombinationIndex =
            ((variantIndex - 1) % numberOfPageVariantCombinations) + 1;

        variantsByPage = enumerateCombinations({
            numberOfOptionsByIndex: numVariantsPerPage,
            maxNumber: pageVariantCombinationIndex,
        })[pageVariantCombinationIndex - 1].map((x) => x + 1);
    } else {
        variantsByPage = [...Array(nPages).keys()].map(
            (i) => Math.floor(rng() * numVariantsPerPage[i]) + 1,
        );
    }

    let previousComponentTypeCounts =
        await initializeComponentTypeCounts(pageCoreWorkersInfo);

    let activityInfo = {
        activityPages,
        variantsByPage,
        itemWeights,
        numVariants: activityVariantResult.numVariants,
        previousComponentTypeCounts,
    };

    return {
        errors,
        order: activityPages,
        itemWeights,
        variantsByPage,
        variantIndex,
        activityInfo,
        previousComponentTypeCounts,
        pageVariantsResult,
        pageCoreWorkersInfo,
    };
}

export async function determineNumberOfActivityVariants(
    activityDefinition,
    flags,
) {
    // Number of variants is numVariants for activity definition or 1000,
    // with one exception that also has additional side effects.
    // If numVariants is not specified and the activity definition has only pages (no orders),
    // then spin up a core worker for each page
    // and use it to calculate the number of variants for each page.
    // The number of variants for the activity is the product of variants for each page
    // (capped at 1000, currently not adjustable).
    // In this case, return the core workers and the variant results
    // to reduce duplicate calculations later.

    let numVariants = 1000;
    let pageVariantsResult = null;
    let pageCoreWorkersInfo = [];

    if (activityDefinition.numVariants !== undefined) {
        numVariants = activityDefinition.numVariants;
        if (!(Number.isInteger(numVariants) && numVariants >= 1)) {
            numVariants = 1000;
        }
    } else if (activityDefinition.children.every((x) => x.type === "page")) {
        // determine number of variants from the pages

        let promises = [];
        for (let page of activityDefinition.children) {
            let coreWorker = createCoreWorker();
            let theInfo = {
                coreWorker,
                doenetML: page.doenetML,
                preliminarySerializedComponents: page.children,
                flags,
            };
            pageCoreWorkersInfo.push(theInfo);
            promises.push(
                initializeCoreWorker(theInfo).then(() => {
                    return returnAllPossibleVariantsFromCoreWorker(coreWorker);
                }),
            );
        }

        try {
            pageVariantsResult = await Promise.all(promises);
            numVariants = pageVariantsResult.reduce((a, c) => a * c.length, 1);
            numVariants = Math.min(1000, numVariants);
        } catch (e) {}
    }

    return { numVariants, pageVariantsResult, pageCoreWorkersInfo };
}

export function createCoreWorker() {
    return new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "module",
    });
}

export function initializeCoreWorker({
    coreWorker,
    doenetML,
    preliminarySerializedComponents,
    flags,
}) {
    // Initializes core worker with the given arguments.
    // Returns a promise.
    // If the worker is successfully initialized, the promise is resolved
    // If an error was encountered while initializing, the promise is rejected

    let resolveInitializePromise;
    let rejectInitializePromise;

    let initializePromise = new Promise((resolve, reject) => {
        resolveInitializePromise = resolve;
        rejectInitializePromise = reject;
    });

    let initializeListener = function (e) {
        if (e.data.messageType === "initializeResult") {
            coreWorker.removeEventListener("message", initializeListener);

            let initializeResult = e.data.args;

            if (initializeResult.success) {
                resolveInitializePromise();
            } else {
                rejectInitializePromise(new Error(initializeResult.errMsg));
            }
        }
    };

    coreWorker.addEventListener("message", initializeListener);

    coreWorker.postMessage({
        messageType: "initializeWorker",
        args: {
            doenetML,
            preliminarySerializedComponents,
            flags,
        },
    });

    return initializePromise;
}

export async function createAndInitializePageCoreWorkers(activityPages, flags) {
    let promises = [];
    let pageCoreWorkersInfo = [];
    let errors = [];

    for (let page of activityPages) {
        let coreWorker = createCoreWorker();

        let theInfo = {
            coreWorker,
            doenetML: page.doenetML,
            preliminarySerializedComponents: page.children,
            flags,
        };

        pageCoreWorkersInfo.push(theInfo);
        promises.push(initializeCoreWorker(theInfo));
    }

    // use allSettled to make sure all initializations are run
    let promiseResults = await Promise.allSettled(promises);

    for (let result of promiseResults) {
        if (result.status === "rejected") {
            errors.push({
                message: `Error initializing activity. ${result.reason}`,
                displayInActivity: true,
            });
        }
    }

    return { pageCoreWorkersInfo, errors };
}

export function returnAllPossibleVariantsFromCoreWorker(coreWorker) {
    // calculate all possible variants from an initialized core worker
    // returns promise
    // If the worker was already initialized,
    // then the promise resolves to the allPossibleVariants object
    // If the worker was not already initialized, then the promise is rejected

    let resolveAllPossibleVariantsPromise;
    let rejectAllPossibleVariantsPromise;

    let allPossibleVariantsPromise = new Promise((resolve, reject) => {
        resolveAllPossibleVariantsPromise = resolve;
        rejectAllPossibleVariantsPromise = reject;
    });

    let allPossibleVariantsListener = function (e) {
        if (e.data.messageType === "allPossibleVariants") {
            let allPossibleVariantsResult = e.data.args;

            coreWorker.removeEventListener(
                "message",
                allPossibleVariantsListener,
            );

            if (allPossibleVariantsResult.success) {
                resolveAllPossibleVariantsPromise(
                    allPossibleVariantsResult.allPossibleVariants,
                );
            } else {
                rejectAllPossibleVariantsPromise();
            }
        }
    };

    coreWorker.addEventListener("message", allPossibleVariantsListener);

    coreWorker.postMessage({
        messageType: "returnAllPossibleVariants",
    });

    return allPossibleVariantsPromise;
}

export async function returnNumberOfActivityVariantsForCid(cid) {
    let activityDefinitionDoenetML = await retrieveTextFileForCid(cid);

    let result = await parseActivityDefinition(activityDefinitionDoenetML);

    let errors = result.errors;

    result = await determineNumberOfActivityVariants(result.activityJSON);

    return {
        numVariants: result.numVariants,
        pageVariantsResult: result.pageVariantsResult,
        errors,
    };
}

function determineOrder(order, rng) {
    if (order?.type?.toLowerCase() !== "order") {
        return { success: false, message: "invalid order" };
    }

    let behavior = order.behavior?.toLowerCase();

    if (behavior === undefined) {
        behavior = "sequence";
    }

    switch (behavior) {
        case "sequence":
            return processSequenceOrder(order, rng);
        case "select":
            return processSelectOrder(order, rng);
        case "shuffle":
            return processShuffleOrder(order, rng);
        default:
            return {
                success: false,
                message: `Have not implemented behavior: ${behavior}`,
            };
    }
}

function processSequenceOrder(order, rng) {
    let pages = [];
    let errors = [];

    for (let item of order.children) {
        let type = item.type.toLowerCase();
        if (type === "page") {
            pages.push(item);
        } else if (type === "order") {
            let orderResult = determineOrder(item, rng);
            errors.push(...orderResult.errors);
            pages.push(...orderResult.pages);
        } else {
            errors.push({
                message: `Unrecognized item <${item.type}> in order.`,
                doenetMLrange: item.doenetMLrange,
                displayInActivity: true,
            });
        }
    }

    return { pages, errors };
}

function processSelectOrder(order, rng) {
    let numberToSelect = order.numberToSelect;
    let nItems = order.children.length;
    let errors = [];

    if (!(Number.isInteger(numberToSelect) && numberToSelect > 0)) {
        numberToSelect = 1;
    }

    let numberUniqueRequired = 1;
    if (!order.withReplacement) {
        numberUniqueRequired = numberToSelect;
    }

    if (numberUniqueRequired > nItems) {
        errors.push({
            message:
                "Cannot select " +
                numberUniqueRequired +
                " components from only " +
                nItems,
            doenetMLrange: order.doenetMLrange,
            displayInActivity: true,
        });
        return {
            pages: [],
            errors,
        };
    }

    let selectWeights = order.selectWeights || [];

    if (!Array.isArray(selectWeights) || !selectWeights.every((x) => x >= 0)) {
        errors.push({
            message: "Invalid selectWeights",
            doenetMLrange: order.doenetMLrange,
            displayInActivity: true,
        });
    }

    selectWeights = selectWeights.slice(0, nItems);

    if (selectWeights.length < nItems) {
        selectWeights.push(...Array(nItems - selectWeights.length).fill(1));
    }

    // normalize selectWeights to sum to 1
    let totalWeight = selectWeights.reduce((a, c) => a + c);
    selectWeights = selectWeights.map((x) => x / totalWeight);

    //https://stackoverflow.com/a/44081700
    let cumulativeWeights = selectWeights.reduce(
        (a, x, i) => [...a, x + (a[i - 1] || 0)],
        [],
    );
    let indsRemaining = [...Array(cumulativeWeights.length).keys()];

    let selectedItems = [];

    for (let ind = 0; ind < numberToSelect; ind++) {
        // random number in [0, 1)
        let rand = rng();

        // find largest index where cumulativeWeight is larger than rand
        // using binary search
        let start = -1,
            end = cumulativeWeights.length - 1;
        while (start < end - 1) {
            let mid = Math.floor((start + end) / 2); // mid point
            if (cumulativeWeights[mid] > rand) {
                end = mid;
            } else {
                start = mid;
            }
        }

        selectedItems.push(order.children[indsRemaining[end]]);

        if (!order.withReplacement && ind < numberToSelect - 1) {
            // remove selected index and renormalize weights
            selectWeights.splice(end, 1);
            indsRemaining.splice(end, 1);
            totalWeight = selectWeights.reduce((a, c) => a + c);
            selectWeights = selectWeights.map((x) => x / totalWeight);
            cumulativeWeights = selectWeights.reduce(
                (a, x, i) => [...a, x + (a[i - 1] || 0)],
                [],
            );
        }
    }

    let pages = [];

    for (let item of selectedItems) {
        let type = item.type.toLowerCase();
        if (type === "page") {
            pages.push(item);
        } else if (type === "order") {
            let orderResult = determineOrder(item);
            pages.push(...orderResult.pages);
            errors.push(...orderResult.errors);
        } else {
            errors.push({
                message: `Unrecognized item ${item.type} in order`,
                doenetMLrange: item.doenetMLrange,
                displayInActivity: true,
            });
        }
    }

    return { pages, errors };
}

function processShuffleOrder(order, rng) {
    let newOrder = [...order.children];
    let errors = [];

    // shuffle the order
    // https://stackoverflow.com/a/12646864
    for (let i = order.children.length - 1; i > 0; i--) {
        const rand = rng();
        const j = Math.floor(rand * (i + 1));
        [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }

    let pages = [];

    for (let item of newOrder) {
        let type = item.type.toLowerCase();
        if (type === "page") {
            pages.push(item);
        } else if (type === "order") {
            let orderResult = determineOrder(item, rng);
            pages.push(...orderResult.pages);
            errors.push(...orderResult.errors);
        } else {
            errors.push({
                message: `Unrecognized item ${item.type} in order`,
                doenetMLrange: item.doenetMLrange,
                displayInActivity: true,
            });
        }
    }

    return { pages, errors };
}

async function returnComponentTypeCounts(coreWorker) {
    // Returns a promise.
    // If successfully obtain counts, the promise is resolved with those counts.
    // If an error was encountered, the promise is rejected

    let resolveCountPromise;
    let rejectCountPromise;

    let countPromise = new Promise((resolve, reject) => {
        resolveCountPromise = resolve;
        rejectCountPromise = reject;
    });

    let componentCountListener = function (e) {
        if (e.data.messageType === "componentTypeCounts") {
            coreWorker.removeEventListener("message", componentCountListener);

            let countResult = e.data.args;

            if (countResult.success) {
                resolveCountPromise(countResult.componentTypeCounts);
            } else {
                rejectCountPromise();
            }
        }
    };

    coreWorker.addEventListener("message", componentCountListener);

    coreWorker.postMessage({
        messageType: "returnComponentCounts",
    });

    return countPromise;
}

async function initializeComponentTypeCounts(pageCoreWorkersInfo) {
    let previousComponentTypeCountsByPage = [{}];

    let promises = [];

    for (let coreWorkerInfo of pageCoreWorkersInfo.slice(
        0,
        pageCoreWorkersInfo.length - 1,
    )) {
        promises.push(returnComponentTypeCounts(coreWorkerInfo.coreWorker));
    }

    try {
        let allComponentCounts = await Promise.all(promises);

        for (let [ind, componentTypeCounts] of allComponentCounts.entries()) {
            let countsSoFar = previousComponentTypeCountsByPage[ind];
            for (let cType in countsSoFar) {
                if (cType in componentTypeCounts) {
                    componentTypeCounts[cType] += countsSoFar[cType];
                } else {
                    componentTypeCounts[cType] = countsSoFar[cType];
                }
            }

            previousComponentTypeCountsByPage.push(componentTypeCounts);
        }
    } catch (e) {}

    return previousComponentTypeCountsByPage;
}

export function normalizeErrors(errors, doenetML) {
    if (errors.length > 0) {
        let doenetMLNewlines = findAllNewlines(doenetML);
        for (let err of errors) {
            if (
                err.doenetMLrange &&
                err.doenetMLrange.lineBegin === undefined
            ) {
                Object.assign(
                    err.doenetMLrange,
                    getLineCharRange(err.doenetMLrange, doenetMLNewlines),
                );
            }
        }
    }

    return errors;
}
