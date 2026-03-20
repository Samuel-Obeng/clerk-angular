import { createClerkTheme } from './create-clerk-theme';

describe('createClerkTheme', () => {
  let originalGetComputedStyle: typeof window.getComputedStyle;

  beforeEach(() => {
    originalGetComputedStyle = window.getComputedStyle;
  });

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
  });

  describe('explicit options', () => {
    it('should map primaryColor to colorPrimary variable', () => {
      const theme = createClerkTheme({ primaryColor: '#6366f1' });
      expect((theme.variables as any).colorPrimary).toBe('#6366f1');
    });

    it('should map primaryForeground to colorTextOnPrimaryBackground', () => {
      const theme = createClerkTheme({ primaryForeground: '#000000' });
      expect((theme.variables as any).colorTextOnPrimaryBackground).toBe('#000000');
    });

    it('should map textColor to colorText', () => {
      const theme = createClerkTheme({ textColor: '#333' });
      expect((theme.variables as any).colorText).toBe('#333');
    });

    it('should map backgroundColor to colorBackground', () => {
      const theme = createClerkTheme({ backgroundColor: '#fff' });
      expect((theme.variables as any).colorBackground).toBe('#fff');
    });

    it('should map borderRadius', () => {
      const theme = createClerkTheme({ borderRadius: '1rem' });
      expect((theme.variables as any).borderRadius).toBe('1rem');
    });

    it('should map fontFamily', () => {
      const theme = createClerkTheme({ fontFamily: 'Inter, sans-serif' });
      expect((theme.variables as any).fontFamily).toBe('Inter, sans-serif');
    });

    it('should map fontSize', () => {
      const theme = createClerkTheme({ fontSize: '14px' });
      expect((theme.variables as any).fontSize).toBe('14px');
    });

    it('should create formButtonPrimary element when primaryColor is set', () => {
      const theme = createClerkTheme({ primaryColor: '#ff0000' });
      expect(theme.elements).toBeDefined();
      expect((theme.elements as any).formButtonPrimary).toBeDefined();
      expect((theme.elements as any).formButtonPrimary.backgroundColor).toBe('#ff0000');
    });

    it('should create footerActionLink element when primaryColor is set', () => {
      const theme = createClerkTheme({ primaryColor: '#ff0000' });
      expect((theme.elements as any).footerActionLink.color).toBe('#ff0000');
    });
  });

  describe('CSS variable fallback', () => {
    it('should read --clerk-primary from :root', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: (name: string) => {
          if (name === '--clerk-primary') return '#818cf8';
          return '';
        },
      });

      const theme = createClerkTheme();
      expect((theme.variables as any).colorPrimary).toBe('#818cf8');
    });

    it('should read --clerk-radius from :root', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: (name: string) => {
          if (name === '--clerk-radius') return '0.5rem';
          return '';
        },
      });

      const theme = createClerkTheme();
      expect((theme.variables as any).borderRadius).toBe('0.5rem');
    });

    it('should read --clerk-font from :root', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: (name: string) => {
          if (name === '--clerk-font') return 'Roboto';
          return '';
        },
      });

      const theme = createClerkTheme();
      expect((theme.variables as any).fontFamily).toBe('Roboto');
    });
  });

  describe('body computed style fallback', () => {
    it('should fall back to body font-family', () => {
      const mockGetComputedStyle = jest.fn().mockImplementation((el: Element) => {
        if (el === document.documentElement) {
          return { getPropertyValue: () => '' };
        }
        return {
          getPropertyValue: (prop: string) => {
            if (prop === 'font-family') return 'Georgia, serif';
            return '';
          },
        };
      });
      window.getComputedStyle = mockGetComputedStyle;

      const theme = createClerkTheme();
      expect((theme.variables as any).fontFamily).toBe('Georgia, serif');
    });

    it('should fall back to body color for textColor', () => {
      const mockGetComputedStyle = jest.fn().mockImplementation((el: Element) => {
        if (el === document.documentElement) {
          return { getPropertyValue: () => '' };
        }
        return {
          getPropertyValue: (prop: string) => {
            if (prop === 'color') return 'rgb(0, 0, 0)';
            return '';
          },
        };
      });
      window.getComputedStyle = mockGetComputedStyle;

      const theme = createClerkTheme();
      expect((theme.variables as any).colorText).toBe('rgb(0, 0, 0)');
    });

    it('should fall back to body background-color', () => {
      const mockGetComputedStyle = jest.fn().mockImplementation((el: Element) => {
        if (el === document.documentElement) {
          return { getPropertyValue: () => '' };
        }
        return {
          getPropertyValue: (prop: string) => {
            if (prop === 'background-color') return 'rgb(255, 255, 255)';
            return '';
          },
        };
      });
      window.getComputedStyle = mockGetComputedStyle;

      const theme = createClerkTheme();
      expect((theme.variables as any).colorBackground).toBe('rgb(255, 255, 255)');
    });
  });

  describe('base theme merging', () => {
    it('should spread base theme properties', () => {
      const base = {
        variables: { colorNeutral: '#aaa' },
        elements: { card: { border: '1px solid' } },
      };
      const theme = createClerkTheme({ base, primaryColor: '#ff0000' });

      // base properties should be present
      expect(theme.variables).toBeDefined();
      expect(theme.elements).toBeDefined();
      // primaryColor should override/add to variables
      expect((theme.variables as any).colorPrimary).toBe('#ff0000');
    });

    it('should allow base theme without overrides', () => {
      const base = { variables: { colorPrimary: '#000' } };
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: () => '',
      });
      const theme = createClerkTheme({ base });
      expect(theme.variables).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty args', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: () => '',
      });
      const theme = createClerkTheme({});
      expect(theme.variables).toBeDefined();
    });

    it('should not include elements key when no primary color and no custom elements', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: () => '',
      });
      const theme = createClerkTheme({});
      expect(theme.elements).toBeUndefined();
    });

    it('should include custom elements even without primary color', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: () => '',
      });
      const theme = createClerkTheme({ elements: { card: { border: '1px solid red' } } });
      expect(theme.elements).toBeDefined();
      expect((theme.elements as any).card).toEqual({ border: '1px solid red' });
    });

    it('should merge custom variables', () => {
      const theme = createClerkTheme({
        primaryColor: '#000',
        variables: { customVar: 'test' },
      });
      expect((theme.variables as any).colorPrimary).toBe('#000');
      expect((theme.variables as any).customVar).toBe('test');
    });

    it('should default primaryForeground to #ffffff', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: () => '',
      });
      const theme = createClerkTheme({});
      expect((theme.variables as any).colorTextOnPrimaryBackground).toBe('#ffffff');
    });
  });

  describe('SSR safety', () => {
    it('should work with explicit options when CSS vars are unavailable', () => {
      // In SSR, getComputedStyle would not exist or return empty values.
      // When explicit options are provided, they should work regardless.
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: () => '',
      });
      const theme = createClerkTheme({ primaryColor: '#000', fontFamily: 'Arial' });
      expect(theme.variables).toBeDefined();
      expect((theme.variables as any).colorPrimary).toBe('#000');
      expect((theme.variables as any).fontFamily).toBe('Arial');
    });
  });
});
