import { clerkDarkTheme, clerkMinimalTheme } from './presets';

describe('clerkDarkTheme', () => {
  it('should have variables', () => {
    expect(clerkDarkTheme.variables).toBeDefined();
  });

  it('should have colorPrimary set to indigo', () => {
    expect((clerkDarkTheme.variables as any).colorPrimary).toBe('#818cf8');
  });

  it('should have dark background color', () => {
    expect((clerkDarkTheme.variables as any).colorBackground).toBe('#1f2937');
  });

  it('should have elements with card styling', () => {
    expect(clerkDarkTheme.elements).toBeDefined();
    expect((clerkDarkTheme.elements as any).card).toBeDefined();
    expect((clerkDarkTheme.elements as any).card.backgroundColor).toBe('#1f2937');
  });

  it('should have formButtonPrimary element', () => {
    expect((clerkDarkTheme.elements as any).formButtonPrimary).toBeDefined();
    expect((clerkDarkTheme.elements as any).formButtonPrimary.backgroundColor).toBe('#818cf8');
  });

  it('should have footerActionLink element', () => {
    expect((clerkDarkTheme.elements as any).footerActionLink).toBeDefined();
    expect((clerkDarkTheme.elements as any).footerActionLink.color).toBe('#818cf8');
  });
});

describe('clerkMinimalTheme', () => {
  it('should have variables', () => {
    expect(clerkMinimalTheme.variables).toBeDefined();
  });

  it('should have neutral primary color', () => {
    expect((clerkMinimalTheme.variables as any).colorPrimary).toBe('#374151');
  });

  it('should have subtle border radius', () => {
    expect((clerkMinimalTheme.variables as any).borderRadius).toBe('0.375rem');
  });

  it('should have card with no shadow', () => {
    expect((clerkMinimalTheme.elements as any).card.boxShadow).toBe('none');
  });

  it('should have card with border', () => {
    expect((clerkMinimalTheme.elements as any).card.border).toBe('1px solid #e5e7eb');
  });

  it('should have userButtonPopoverCard', () => {
    expect((clerkMinimalTheme.elements as any).userButtonPopoverCard).toBeDefined();
  });
});
