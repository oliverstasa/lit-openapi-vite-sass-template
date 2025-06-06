import { LitElement, html, nothing, unsafeCSS } from "lit-element";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { API } from "../logic/api";

import styles from "./app-client.scss";

@customElement("app-client")
export class AppClient extends LitElement {
    static override styles = unsafeCSS(styles);

    @property({ attribute: false }) public api: API | undefined;
    @property({ type: Boolean }) public isVertical = false;

    @state() private wrapperRef: Ref<HTMLElement> = createRef();
    @state() private trailerEnabled: boolean = false;

    render() {
        return html`106%`;
    }
}