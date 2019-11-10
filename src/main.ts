import * as contentful from "contentful";
import { normalizeContentfulData } from "./helpers/normalize-contentful-data";
import { ICmsAdapter } from "./interfaces/cms-adapter";
import { IContent } from "./interfaces/content";
import { IContentfulConfig } from "./interfaces/contentful-config";

export class ContentfulAdapter implements ICmsAdapter {
    public supportsFieldWiseAdjustment = true;
    private client: contentful.ContentfulClientApi;

    constructor(config: IContentfulConfig) {
        if (!config) {
            throw new Error("Creation of cms adapter failed: config is undefined");
        }
        this.createContentfulClient(config);
    }

    public async getNormalizedContentData(contentId: string, locale: string): Promise<IContent> {
        const contentTypeInfos = await this.client.getContentTypes();

        return this.fetchContentData(contentId, locale)
            .then((rawContentData) => {
                return normalizeContentfulData(rawContentData, contentTypeInfos);
            }).catch((e: Error) => {
                throw e;
            });
    }

    private createContentfulClient(config: IContentfulConfig): void {
        this.client = contentful.createClient({ ...config });
    }

    private async fetchContentData(contentId: string, locale: string): Promise<contentful.Entry<unknown>> {
        return this.client.getEntry(contentId, { locale, include: 10 }).catch((e: Error) => {
            throw new Error(`${this.constructor.name} could not fetch data for contentId ${contentId}. ${e.message}`);
        });
    }
    
}
