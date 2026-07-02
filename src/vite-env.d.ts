/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '~icons/*?raw' {
    const svg: string
    export default svg
}

interface UserOptions {
    /** display search input */
    displayInput: boolean;
    /** display theme switching */
    displayAction: boolean;
    /** qr code download as svg */
    dlAsSvg: boolean;
    /** allow click to download */
    enableDownload: boolean;
    /** popup background style */
    popupStyle: 'emoji' | 'color';
    /** qr code color */
    color: 'white' | 'dark' | 'orange' | 'green' | 'blue' | 'purple' | 'pink';
    /** emoji selected */
    emoji: 'pizza' | 'heart' | 'goofy' | 'smile' | 'star' | 'confetti' | 'love' | 'rainbow';
    /** allow clicking popup to change background */
    enableClickToChangeBg: boolean;
    /** qr code size */
    qrCodeSize: number;
    /** icon style */
    iconStyle: 'solid' | 'outline';
    /** icon color */
    iconColor: 'auto' | 'light' | 'dark' | 'yellow' | 'blue' | 'custom';
    /** icon custom color */
    iconCustomColor: string;
    /** simple ui */
    simpleUi: boolean;
}

type ColorScheme = 'light' | 'dark'