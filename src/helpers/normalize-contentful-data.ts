import * as contentful from "contentful";
import { Entry } from "contentful";
import { IContent, IContentData } from "../interfaces/content";

export const normalizeContentfulData = (
    rawContentData: Entry<unknown>,
    contentTypeInfos: contentful.ContentfulCollection<contentful.ContentType>,
    alreadyNormalizedContents: any = {},
): IContent => {
    if (!rawContentData) {
        throw new Error("Normalization of contentful data failed: input undefined");
    }

    alreadyNormalizedContents[rawContentData.sys.id] = {
        data: {},
        id: "",
        type: "",
    };

    const normalizedContent: IContent = {
        data: {},
        id: rawContentData.sys.id,
        type: rawContentData.sys.contentType ? rawContentData.sys.contentType.sys.id : rawContentData.sys.type,
    };

    const contentTypeInfo = contentTypeInfos.items.find(
        (ctInfo) => ctInfo.sys.id === normalizedContent.type,
    );

    Object.keys(rawContentData.fields).forEach((fieldIdentifier) => {
        const contentField = rawContentData.fields[fieldIdentifier];
        const fieldType = contentTypeInfo ? contentTypeInfo.fields.find(
            (contentTypeField) => contentTypeField.id === fieldIdentifier,
        ).type : "unknown";

        if (Array.isArray(contentField)) {
            const normalizedSubField: any[] = [];
            contentField.forEach((subField) => {
                if (subField.fields && subField.sys) {
                    normalizedSubField.push(
                        normalizeContentfulData(subField, contentTypeInfos, alreadyNormalizedContents),
                    );
                } else {
                    normalizedSubField.push(subField);
                }
            });
            normalizedContent.data[fieldIdentifier] = {
                fieldType,
                value: normalizedSubField,
            };
        } else {
            if (contentField.fields && contentField.sys) {
                normalizedContent.data[fieldIdentifier] =
                    alreadyNormalizedContents[contentField.sys.id] ||
                    {
                        fieldType,
                        value: normalizeContentfulData(contentField, contentTypeInfos, alreadyNormalizedContents),
                    };
            } else {
                normalizedContent.data[fieldIdentifier] = {
                    fieldType,
                    value: contentField,
                };
            }
        }
    });

    alreadyNormalizedContents[rawContentData.sys.id] = Object.assign(
        alreadyNormalizedContents[rawContentData.sys.id],
        normalizedContent,
    );
    return normalizedContent;
};
