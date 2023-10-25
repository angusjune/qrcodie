type IconColors = Record<Exclude<UserOptions['iconColor'], 'auto' | 'custom'>, string>
type IconPaths  = Record<UserOptions['iconStyle'], string | string[]>

export const colors: IconColors =  {
    light: '#fff',
    dark: '#444',
    blue: '#3076DE',
    yellow: '#E9A83D',
}

const paths: IconPaths = {
    solid: ['M3 3V15H15V3H3ZM6 12V6H12V12H6Z', 'M17 3V15H29V3H17ZM20 12V6H26V12H20Z', 'M3 17V29H15V17H3ZM6 26V20H12V26H6Z', 'M29 26H26V29H29V26Z', 'M20 17H17V20H20V17Z', 'M23 20H20V23H23V20Z', 'M20 23H17V26H20V23Z', 'M23 26H20V29H23V26Z', 'M26 23H23V26H26V23Z', 'M26 17H23V20H26V17Z', 'M29 20H26V23H29V20Z'],
    outline: ['M2 6C2 3.79086 3.79086 2 6 2H14V5H6C5.44772 5 5 5.44772 5 6V14H2V6Z', 'M14 30H6C3.79086 30 2 28.2091 2 26V18H5V26C5 26.5523 5.44772 27 6 27H14V30Z', 'M26 2C28.2091 2 30 3.79086 30 6V14L27 14V6C27 5.44772 26.5523 5 26 5L18 5V2L26 2Z', 'M30 18V26C30 28.2091 28.2091 30 26 30L18 30V27L26 27C26.5523 27 27 26.5523 27 26V18H30Z', 'M7 9C7 7.89543 7.89543 7 9 7H15V15H7V9Z', 'M7 17H15V25H9C7.89543 25 7 24.1046 7 23V17Z', 'M17 7H23C24.1046 7 25 7.89543 25 9V15H17V7Z', 'M17 17H25V23C25 24.1046 24.1046 25 23 25H17V17Z'],
}

/**
 * Get icon
 * @param name icon name
 * @param color color hex value
 * @param size icon size
 * @returns imageData of icon
 */
export function getIcon(name: UserOptions['iconStyle'], color: string, size: number): ImageData {

    const offscreen = new OffscreenCanvas(size, size);
    const ctx = offscreen.getContext('2d');
    if (!ctx) return new ImageData(size, size);

    // 32 is the original size of the icon
    ctx.scale(size / 32, size / 32);
    ctx.fillStyle = color;

    for(const path of [paths[name]].flat()) {
        const path2d = new Path2D(path);
        ctx.fill(path2d);
    }

    //return imageData of canvas
    return ctx.getImageData(0, 0, size, size, { colorSpace: 'display-p3' });
}

export function getIconDictionary(name: UserOptions['iconStyle'] = 'solid', color = colors.dark, sizes: number[] = [16, 24, 32]): Record<string, ImageData> {
    const iconDictionary: Record<string, ImageData> = {};
    for (const size of sizes) {
        iconDictionary[size.toString()] = getIcon(name, color, size);
    }
    return iconDictionary;
}