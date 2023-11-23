declare module "*.png" {
    const content: Uint8Array;
    export default content;
}

declare module "*.svg" {
    const content: string;
    export default content;
}
