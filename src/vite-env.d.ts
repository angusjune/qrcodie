/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
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
    /** display qr code style */
    // dpCodeStyle: 'auto' | 'dark' | 'light';
    /** downloaded qr code style */
    // dlCodeStyle: 'auto' | 'dark' | 'light';
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