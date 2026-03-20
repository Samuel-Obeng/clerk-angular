/**
 * Pre-built Clerk themes that can be used directly or as a base for `createClerkTheme()`.
 */

/** Dark theme with neutral grays */
export const clerkDarkTheme: Record<string, unknown> = {
  variables: {
    colorPrimary: '#818cf8',
    colorTextOnPrimaryBackground: '#ffffff',
    colorText: '#f3f4f6',
    colorBackground: '#1f2937',
    colorInputBackground: '#374151',
    colorInputText: '#f9fafb',
    colorNeutral: '#9ca3af',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  elements: {
    card: {
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
    },
    formButtonPrimary: {
      backgroundColor: '#818cf8',
      '&:hover': { backgroundColor: '#6366f1' },
    },
    footerActionLink: {
      color: '#818cf8',
      '&:hover': { color: '#a5b4fc' },
    },
  },
};

/** Minimal theme with subtle styling and no shadows */
export const clerkMinimalTheme: Record<string, unknown> = {
  variables: {
    colorPrimary: '#374151',
    colorTextOnPrimaryBackground: '#ffffff',
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  elements: {
    card: {
      boxShadow: 'none',
      border: '1px solid #e5e7eb',
    },
    formButtonPrimary: {
      backgroundColor: '#374151',
      '&:hover': { backgroundColor: '#1f2937' },
    },
    userButtonPopoverCard: {
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      border: '1px solid #e5e7eb',
    },
  },
};
