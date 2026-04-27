import { LitElement, html, PropertyValues, nothing, unsafeCSS } from "lit-element";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { API } from "../logic/api";

import styles from "./app-client.scss";

@customElement("app-client")
export class AppClient extends LitElement {
    static override styles = unsafeCSS(styles);

    @state() public api: API | undefined;
    @state() public path: string = window.location.pathname + window.location.search;

    @state() public firstLoad = false;
    @state() public loading = false;

    @state() private wrapperRef: Ref<HTMLElement> = createRef();

    connectedCallback() {
        super.connectedCallback();

        const _pushState = history.pushState.bind(history);
        history.pushState = (...args) => {
            _pushState.apply(history, args);

            const newPath = this._handleGetPath(args[2]);
            this.path = newPath;
        }

        window.addEventListener('popstate', this._handlePopState);

        window.addEventListener('api:start', this._handleApiStart as EventListener);
        window.addEventListener('api:end', this._handleApiEnd as EventListener);
        window.addEventListener('api:error', this._handleApiError as EventListener);
        window.addEventListener('api:languageChanged', () => this.requestUpdate());
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('popstate', this._handlePopState);
        window.removeEventListener('api:start', this._handleApiStart as EventListener);
        window.removeEventListener('api:end', this._handleApiEnd as EventListener);
        window.removeEventListener('api:error', this._handleApiError as EventListener);
        window.removeEventListener('api:languageChanged', () => this.requestUpdate());
    }
    
    protected async updated(_changedProperties: PropertyValues): Promise<void> {
        if (this.api === undefined) {
            await this._handleInitAPI();
            return;
        }
    }

    private _handleApiStart = (ev: CustomEvent) => {
        this.loading = true;
    }

    private _handleApiEnd = (ev: CustomEvent) => {
        this.loading = false;
    }

    private _handleApiError = (ev: CustomEvent) => {
        console.error(ev.detail);
        this.loading = false;
    }

    private _handlePopState = (ev: PopStateEvent) => {
        if (ev.state) {
            document.title = ev.state.pageTitle;
            const newPath = this._handleGetPath();
            if (this.path !== newPath) {
                this.path = newPath;
            } else {
                this.requestUpdate('path');
            }
        }
    }

    private _handleGetPath = (args?: string | URL | null | undefined) => {
        let url: URL;

        if (!args) {
            url = new URL(window.location.href);
        } else if (typeof args == 'string') {
            url = new URL(args, window.location.origin);
        } else {
            url = args;
        }

        return url.pathname + url.search;
    }
    
    private _handleInitAPI = async (): Promise<void> => {
        if (this.api) {
            return;
        }
        return new Promise(async (resolve) => {
            const api = new API();
            await api.langPromise;

            this.api = api;
            resolve();
        });
    }

    render() {
        return html`106%`;
    }
}
