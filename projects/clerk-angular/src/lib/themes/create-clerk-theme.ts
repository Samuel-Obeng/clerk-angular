/**
 * Options for creating a Clerk appearance theme.
 *
 * If a value is not provided, the helper will attempt to read from:
 * 1. CSS custom properties (e.g. `--clerk-primary` on `:root`)
 * 2. Computed styles on `document.body` (font-family, color, background)
 */
export interface ClerkThemeOptions {
  /** Base theme to extend (e.g. `clerkDarkTheme`) */
  base?: Record<string, unknown>;
  /** Primary brand color. Falls back to `--clerk-primary`. */
  primaryColor?: string;
  /** Text color on primary backgrounds. Falls back to `--clerk-primary-foreground`. */
  primaryForeground?: string;
  /** Default text color. Falls back to `--clerk-text` or body computed color. */
  textColor?: string;
  /** Background color for cards/modals. Falls back to `--clerk-background` or body computed background. */
  backgroundColor?: string;
  /** Border radius. Falls back to `--clerk-radius`. */
  borderRadius?: string;
  /** Font family. Falls back to `--clerk-font` or body computed font-family. */
  fontFamily?: string;
  /** Font size for body text. Falls back to `--clerk-font-size`. */
  fontSize?: string;
  /** Additional Clerk `elements` overrides (merged last). */
  elements?: Record<string, unknown>;
  /** Additional Clerk `variables` overrides (merged last). */
  variables?: Record<string, unknown>;
}

/**
 * Reads a CSS custom property from `:root`, returning `undefined` if not set.
 */
function getCSSVar(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || undefined;
}

/**
 * Reads a computed style property from `document.body`.
 */
function getBodyStyle(prop: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = getComputedStyle(document.body).getPropertyValue(prop).trim();
  return value || undefined;
}

/**
 * Creates a Clerk `appearance` config that inherits your app's styles.
 *
 * With no arguments, it auto-detects your app's font, colors, and border radius
 * from CSS custom properties (`--clerk-*`) or computed body styles.
 *
 * @example
 * ```typescript
 * // Auto-inherit everything from your app's CSS
 * provideClerk({
 *   publishableKey: '...',
 *   appearance: createClerkTheme(),
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Override specific values
 * provideClerk({
 *   publishableKey: '...',
 *   appearance: createClerkTheme({
 *     primaryColor: '#6366f1',
 *     borderRadius: '1rem',
 *   }),
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Extend a pre-built theme
 * provideClerk({
 *   publishableKey: '...',
 *   appearance: createClerkTheme({
 *     base: clerkDarkTheme,
 *     primaryColor: '#8b5cf6',
 *   }),
 * })
 * ```
 */
export function createClerkTheme(options: ClerkThemeOptions = {}): Record<string, unknown> {
  const primary = options.primaryColor ?? getCSSVar('--clerk-primary');
  const primaryFg = options.primaryForeground ?? getCSSVar('--clerk-primary-foreground') ?? '#ffffff';
  const textColor = options.textColor ?? getCSSVar('--clerk-text') ?? getBodyStyle('color');
  const bgColor = options.backgroundColor ?? getCSSVar('--clerk-background') ?? getBodyStyle('background-color');
  const radius = options.borderRadius ?? getCSSVar('--clerk-radius');
  const font = options.fontFamily ?? getCSSVar('--clerk-font') ?? getBodyStyle('font-family');
  const fontSize = options.fontSize ?? getCSSVar('--clerk-font-size');

  const variables: Record<string, unknown> = {
    ...(primary ? { colorPrimary: primary } : {}),
    ...(primaryFg ? { colorTextOnPrimaryBackground: primaryFg } : {}),
    ...(textColor ? { colorText: textColor } : {}),
    ...(bgColor ? { colorBackground: bgColor } : {}),
    ...(radius ? { borderRadius: radius } : {}),
    ...(font ? { fontFamily: font } : {}),
    ...(fontSize ? { fontSize } : {}),
    ...options.variables,
  };

  const elements: Record<string, unknown> = {
    ...(primary
      ? {
          formButtonPrimary: {
            backgroundColor: primary,
            '&:hover': { backgroundColor: primary, filter: 'brightness(0.9)' },
          },
          footerActionLink: {
            color: primary,
            '&:hover': { color: primary, filter: 'brightness(0.8)' },
          },
        }
      : {}),
    ...options.elements,
  };

  return {
    ...(options.base ?? {}),
    variables,
    ...(Object.keys(elements).length > 0 ? { elements } : {}),
  };
}
