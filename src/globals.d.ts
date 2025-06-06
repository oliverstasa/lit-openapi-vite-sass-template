declare module '*.scss' {
    const content: import('lit').CSSResultGroup;
    export = content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module "*.svg?raw" {
    const content: string;
    export default content;
}

