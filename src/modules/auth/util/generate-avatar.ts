/**
 * Generates a deterministic hash from a string.
 *
 * WHY THIS EXISTS:
 * We need a stable numeric fingerprint of a user name so we can:
 * - Always map the same name → same color
 * - Avoid randomness (which would break identity consistency)
 * - Ensure avatars remain stable across sessions and devices
 *
 * DESIGN CHOICE:
 * - Uses a simple bitwise hash (fast, dependency-free)
 * - Good enough for UI distribution (not cryptographic use)
 */
const hashString = (str: string) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return Math.abs(hash);
};

/**
 * Selects a deterministic color from a predefined palette.
 *
 * WHY THIS EXISTS:
 * We want controlled UI consistency:
 * - Avoid ugly/random colors
 * - Ensure brand-safe avatar appearance
 * - Guarantee repeatability (same input → same output)
 *
 * WHY PALETTE INSTEAD OF RANDOM COLORS:
 * - Prevents visually chaotic or inaccessible colors
 * - Ensures predictable contrast behavior with text overlay
 * - Gives design control over allowed brand tones
 */
const pickColor = (str: string, palette: string[]) => {
    const index = hashString(str) % palette.length;

    // SECURITY NOTE:
    // ESLint warns about dynamic indexing, but here it is safe because:
    // - palette is a controlled internal array
    // - index is bounded using modulo operation
    // eslint-disable-next-line security/detect-object-injection
    return palette[index];
};

/**
 * Determines readable text color (black or white) based on background brightness.
 *
 * WHY THIS EXISTS:
 * Avatar text must always be readable regardless of background color.
 *
 * DESIGN APPROACH:
 * - Uses luminance formula (standard perceptual brightness model)
 * - Chooses black or white text for optimal contrast
 *
 * WHY NOT USE COMPLEX COLOR THEORY:
 * - Overkill for UI avatars
 * - Binary decision is sufficient and performant
 */
const getTextColor = (bgHex: string) => {
    const r = parseInt(bgHex.slice(0, 2), 16);
    const g = parseInt(bgHex.slice(2, 4), 16);
    const b = parseInt(bgHex.slice(4, 6), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 150 ? "000000" : "FFFFFF";
};

/**
 * Generates a UI Avatar URL using ui-avatars.com service.
 *
 * CORE PURPOSE:
 * Converts a user's name into a visually consistent avatar image URL
 * without storing or generating image files manually.
 *
 * FLOW:
 * 1. Encode user name for safe URL usage
 * 2. Deterministically select background color
 * 3. Compute readable text color
 * 4. Build final avatar API URL
 *
 * WHY THIS DESIGN:
 * - Stateless: no backend storage required for images
 * - Deterministic: same name always produces same avatar
 * - External service offloads rendering complexity
 * - Easy to swap provider later if needed
 *
 * TRADE-OFF:
 * - Depends on third-party service availability
 * - Less control compared to self-hosted SVG system
 */
export const generateAvatar = (name: string) => {
    const encoded = encodeURIComponent(name.trim());

    const bgColors = [
        // Soft, balanced palette designed for UI consistency
        // WHY THESE COLORS:
        // - Medium saturation (avoids neon / eye strain)
        // - Even distribution across hue spectrum
        // - Works well with both black and white text
        "E57373", // soft red
        "F06292", // pink
        "BA68C8", // purple
        "64B5F6", // blue
        "4DB6AC", // teal
        "81C784", // green
        "FFD54F", // amber
        "FF8A65", // orange
    ];

    const bgColor = pickColor(name, bgColors);
    const textColor = getTextColor(bgColor);

    return `https://ui-avatars.com/api/?name=${encoded}&background=${bgColor}&color=${textColor}&size=128`;
};
