import { convertUnresolvedAttributesForComponentType } from "./dast/convertNormalizedDast";
import { returnNumberDisplayAttributes } from "./numberDisplay";

/**
 * Replacement pieces for composites that create value-carrying components
 * rather than copying existing ones: `<sequence>`, and `<sort>` for an entry
 * of a list component (`ValueListComponent`), which has no component to copy.
 */

/**
 * The attributes a value-creating composite forwards onto each replacement it
 * creates, so that `<sequence displayDigits="3">` rounds each of its
 * values. `fixed` is included so an author can override the `fixed="true"`
 * that these replacements otherwise carry — their values are computed, so they
 * are not modifiable by default.
 *
 * The composite must declare them all as `leaveRaw`, since it forwards them
 * rather than acting on them itself. Since the declarations and the forwarding
 * have to name the same attributes, both come from here.
 */
export function returnPassThroughAttributeDeclarations() {
    let attributes = {
        fixed: {
            leaveRaw: true,
            description:
                "Whether this component's value is fixed and cannot be modified.",
        },
    };

    const numberDisplayAttrs = returnNumberDisplayAttributes();
    for (let attrName in numberDisplayAttrs) {
        attributes[attrName] = {
            leaveRaw: true,
            description: numberDisplayAttrs[attrName].description,
        };
    }

    return attributes;
}

/**
 * The pass-through attributes an author actually wrote on `component`, ready to
 * be converted onto its replacements.
 */
export function returnPassThroughAttributes(component) {
    let attributesToConvert = {};
    for (let attr of Object.keys(returnPassThroughAttributeDeclarations())) {
        if (attr in component.attributes) {
            attributesToConvert[attr] = component.attributes[attr];
        }
    }
    return attributesToConvert;
}

/**
 * Serialize one replacement carrying `value`, forwarding `attributesToConvert`
 * from the composite onto it.
 */
export function createOneReplacement({
    value,
    componentType,
    attributesToConvert,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}) {
    let attributesFromComposite = {};

    if (Object.keys(attributesToConvert).length > 0) {
        const res = convertUnresolvedAttributesForComponentType({
            attributes: attributesToConvert,
            componentType,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        });

        nComponents = res.nComponents;
        attributesFromComposite = res.attributes;
    }

    let serializedComponent = {
        type: "serialized",
        componentType,
        componentIdx: nComponents++,
        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
        attributes: attributesFromComposite,
        doenetAttributes: {},
        children: [],
        state: { value, fixed: true },
    };

    return { serializedComponent, nComponents };
}
