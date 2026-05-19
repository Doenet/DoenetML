import { doenetSchema } from "@doenet/static-assets/schema";
import { AttrInfo, PropInfo } from "../components";

const SCHEMA: {
    elements: {
        name: string;
        summary: string;
        children: string[];
        attributes: {
            name: string;
            type?: string;
            description: string;
            defaultValue?: unknown;
            values?: string[];
            autocompleteValues?: { value: string; description: string }[];
        }[];
        properties: {
            name: string;
            type?: string;
            isArray: boolean;
            description: string;
        }[];
        acceptsStringChildren: boolean;
        top: boolean;
    }[];
} = doenetSchema;

type OptimizedSchemaItem = {
    summary: string;
    children: string[];
    parents: string[];
    attrs: AttrInfo[];
    props: PropInfo[];
};

/**
 * `doenet-schema.json` contains a lot of information. This function massages that information and adds more categories to it.
 */
export function computeOptimizedSchema() {
    const optimizedSchema: Record<string, OptimizedSchemaItem> =
        Object.fromEntries(
            SCHEMA.elements.map((element) => [
                element.name,
                {
                    summary: element.summary,
                    children: [],
                    parents: [],
                    attrs: [],
                    props: [],
                },
            ]),
        );

    for (const element of doenetSchema.elements) {
        for (const child of element.children) {
            optimizedSchema[element.name].children.push(child);
            optimizedSchema[child].parents.push(element.name);
        }
        optimizedSchema[element.name].attrs = getAttrInfo(element);
        optimizedSchema[element.name].props = getPropInfo(element);
    }

    // Now that all attributes are computed, we can count each attribute. If the attribute appears on > 90% of elements,
    // we mark it as common.
    const attrCounts: Record<string, number> = {};
    for (const element of doenetSchema.elements) {
        for (const attr of element.attributes) {
            attrCounts[attr.name] = (attrCounts[attr.name] || 0) + 1;
        }
    }
    for (const info of Object.values(optimizedSchema)) {
        for (const attr of info.attrs) {
            if (attrCounts[attr.name] / SCHEMA.elements.length > 0.9) {
                attr.common = true;
            }
        }
    }

    // Same as above, but for props.
    const propCounts: Record<string, number> = {};
    for (const element of doenetSchema.elements) {
        for (const prop of element.properties) {
            propCounts[prop.name] = (propCounts[prop.name] || 0) + 1;
        }
    }
    for (const info of Object.values(optimizedSchema)) {
        for (const prop of info.props) {
            if (propCounts[prop.name] / SCHEMA.elements.length > 0.9) {
                prop.common = true;
            }
        }
    }

    return optimizedSchema;
}

/**
 * Find information about all attributes, cross-referencing with identically-named props if available.
 */
function getAttrInfo(element: (typeof SCHEMA)["elements"][number]) {
    const propLookup = Object.fromEntries(
        element.properties.map((prop) => [prop.name, prop]),
    );
    const attrInfo: AttrInfo[] = [];
    for (const attr of element.attributes) {
        const correspondingProp = propLookup[attr.name];
        const info: AttrInfo = {
            name: attr.name,
            common: false,
            description: attr.description,
        };
        // The type comes from the attribute's own schema entry.
        if (attr.type) {
            info.type = attr.type;
        }
        if (attr.defaultValue !== undefined) {
            info.defaultValue = attr.defaultValue;
        }
        if (attr.autocompleteValues) {
            // Prefer the author-facing values, which carry per-value descriptions.
            info.values = attr.autocompleteValues.map((v) => ({
                value: v.value,
                description: v.description,
            }));
        } else if (attr.values) {
            info.values = attr.values.map((value) => ({ value }));
        }
        // `isArray` is still cross-referenced from a same-named property.
        if (correspondingProp?.isArray) {
            info.isArray = true;
        }

        attrInfo.push(info);
    }
    // Sort by name once here so the display components don't have to.
    attrInfo.sort((a, b) => a.name.localeCompare(b.name));
    return attrInfo;
}

/**
 * Find information about all props of an element.
 */
function getPropInfo(element: (typeof SCHEMA)["elements"][number]) {
    const propInfo: PropInfo[] = [];
    for (const prop of element.properties) {
        const info: PropInfo = {
            name: prop.name,
            common: false,
            description: prop.description,
        };
        if (prop.type) {
            info.type = prop.type;
        }
        if (prop.isArray) {
            info.isArray = true;
        }

        propInfo.push(info);
    }
    // Sort by name once here so the display components don't have to.
    propInfo.sort((a, b) => a.name.localeCompare(b.name));
    return propInfo;
}
