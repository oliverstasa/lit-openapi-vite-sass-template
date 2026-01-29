import createClient from "openapi-fetch";
import type { Client } from "openapi-fetch";
import type { paths as PathsPublic } from './schema-public.d.ts';

import i18next, { i18n } from 'i18next';
import en from '../../i18n/en.json';
import cs from '../../i18n/cs.json';
const resources = {
    en: en,
    cs: cs
};

export class API {
    private host: string = 'https://www.czechdigitalart.cz';
    public clientPublic: Client<PathsPublic>;
    public lang: 'cs' | 'en' = 'cs';

    public i18n: i18n;

    public readonly publicUrl = this.host + '/api';
    public token: string | undefined;

    constructor() {
        // setup translator
        this.i18n = i18next.createInstance();
        this.i18n.init({
            resources,
            lng: this.lang,
            fallbackLng: 'en',
            interpolation: { escapeValue: false },
            ns: ['common', 'menu'],
            defaultNS: 'common',
        })
            .then(() => {
                this.lang = this.i18n.language as 'cs' | 'en';

                this.i18n.on('languageChanged', (lng) => {
                    this.lang = lng as 'cs' | 'en';
                });
            });

        // setup client
        const client: Client<any> = createClient({
            baseUrl: this.publicUrl
        });

        client.use({
            onRequest: (ctx) => {
                window.dispatchEvent(
                    new CustomEvent("api:start", {
                        detail: {
                            method: ctx.request.method,
                            url: ctx.request.url,
                        },
                    })
                );
            },

            onResponse: (ctx) => {
                window.dispatchEvent(
                    new CustomEvent("api:end", {
                        detail: {
                            method: ctx.request.method,
                            url: ctx.request.url,
                            status: ctx.response?.status,
                        },
                    })
                );
            },

            onError: (ctx) => {
                window.dispatchEvent(
                    new CustomEvent("api:error", {
                        detail: {
                            method: ctx.request.method,
                            url: ctx.request.url,
                            error: ctx.error,
                        },
                    })
                );
            }
        });

        this.clientPublic = client;
    }
}