import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { API } from '../logic/api';

@customElement('app-element')
export class AppElement extends LitElement {
    @property({ type: Object }) public api: API | undefined;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('api:authChanged', this._handleAppElementUpdate);
        window.addEventListener('api:languageChanged', this._handleAppElementUpdate);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('api:authChanged', this._handleAppElementUpdate);
        window.removeEventListener('api:languageChanged', this._handleAppElementUpdate);
    }

    private _handleAppElementUpdate = () => {
        this.requestUpdate();
    }
}
