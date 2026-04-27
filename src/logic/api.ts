import createClient from "openapi-fetch";
import type { Client } from "openapi-fetch";
import type { paths as PathsPublic } from './schema.d.ts';

import i18next, { i18n } from 'i18next';
import en from '../../i18n/en.json';
import cs from '../../i18n/cs.json';
const resources = {
    en: { translation: en }, // must be packed in translation, or have to define NS
    cs: { translation: cs }
};

export class API {
    private host: string = 'localhost:3000/api';
    public clientPublic: Client<PathsPublic>;
    public lang: 'cs' | 'en' = 'cs';

    public i18n: i18n;
    public langPromise: Promise<void>;

    public token: string | undefined;

    constructor() {
        // setup lang
        const savedLang = window.localStorage.getItem('app_lang') as 'cs' | 'en' | null;

        if (savedLang) {
            this.lang = savedLang;
        } else {
            const browserLang = navigator.language || (navigator as any).userLanguage || '';
            this.lang = browserLang.toLowerCase().startsWith('cs') ? 'cs' : 'en';
        }

        // setup translator
        this.i18n = i18next.createInstance();
        this.langPromise = this.i18n.init({
            resources,
            lng: this.lang,
            fallbackLng: 'en',
            interpolation: { escapeValue: false }
        })
            .then(() => {
                this.lang = this.i18n.language as 'cs' | 'en';
                document.documentElement.setAttribute('lang', this.lang);

                this.i18n.on('languageChanged', (lng) => {
                    this.lang = lng as 'cs' | 'en';
                    document.documentElement.setAttribute('lang', this.lang);
                    window.localStorage.setItem('app_lang', this.lang);
                    window.dispatchEvent(new CustomEvent('api:languageChanged', { detail: { lang: this.lang } }));
                });
            });

        // setup client
        const client: Client<any> = createClient({
            baseUrl: this.host
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
