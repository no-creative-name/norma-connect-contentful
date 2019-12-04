import { IContent } from "./content";

export interface ICmsAdapter {
    supportsFieldTypeWiseAdjustments: boolean;
    getNormalizedContentData: (contentId: string, locale: string) => Promise<IContent>;
}
