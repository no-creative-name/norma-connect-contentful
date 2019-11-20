import { IContent } from "./content";

export interface ICmsAdapter {
    supportsFieldWiseAdjustments: boolean;
    getNormalizedContentData: (contentId: string, locale: string) => Promise<IContent>;
}
