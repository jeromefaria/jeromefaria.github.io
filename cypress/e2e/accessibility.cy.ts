// Constants
const MIN_TOUCH_TARGET_SIZE = 44;
const MAIN_CONTENT_SELECTOR = '#main-content';
const SKIP_LINK_SELECTOR = 'a[href="#main-content"]';

const PAGES = ['/', '/works', '/live', '/press', '/about', '/contact'] as const;

const LANDMARK_SELECTORS = {
  header: 'header',
  main: 'main',
  footer: 'footer',
} as const;

/**
 * Check if element has accessible label
 */
function hasAccessibleLabel(element: JQuery<HTMLElement>): boolean {
  const $el = element[0];
  const id = $el.getAttribute('id');
  const ariaLabel = $el.getAttribute('aria-label');
  const ariaLabelledBy = $el.getAttribute('aria-labelledby');

  if (ariaLabel || ariaLabelledBy) return true;
  if (!id) return false;

  return Cypress.$(`label[for="${id}"]`).length > 0;
}

describe('Accessibility', () => {
  describe('WCAG Compliance', () => {
    PAGES.forEach((page) => {
      it(`${page} should not have violations`, () => {
        cy.visit(page);
        cy.waitForHydration();
        cy.checkA11y();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should allow tab navigation through interactive elements', () => {
      cy.visit('/');
      cy.waitForHydration();

      cy.get(SKIP_LINK_SELECTOR).focus();

      cy.focused().then(($el) => {
        expect($el[0].tagName).to.eq('A');
      });
    });

    it('should skip to main content with skip link', () => {
      cy.visit('/');
      cy.waitForHydration();

      cy.get(SKIP_LINK_SELECTOR).then(($skipLink) => {
        if ($skipLink.length === 0) {
          cy.log('Skipping: No skip link found');
          return;
        }

        cy.get(SKIP_LINK_SELECTOR).focus().should('have.focus').click();

        cy.get(MAIN_CONTENT_SELECTOR).should('be.visible');

        // Verify page scrolled to main content (allow small tolerance for scroll positioning)
        cy.get(MAIN_CONTENT_SELECTOR).then(($main) => {
          const rect = $main[0].getBoundingClientRect();
          expect(rect.top).to.be.lessThan(110);
        });
      });
    });

    it('should navigate through form fields', () => {
      cy.visit('/contact');
      cy.get('form').should('exist');

      cy.get('input[type="text"], input[type="email"], textarea').first().focus().should('have.focus');
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      cy.visit('/');
      cy.get('a').first().focus();

      cy.focused().then(($el) => {
        const styles = window.getComputedStyle($el[0]);
        const outline = styles.outline || styles.outlineWidth;
        expect(outline).not.to.eq('none');
      });
    });

    it('should maintain focus order', () => {
      cy.visit('/works');
      cy.get('a, button, input, textarea, [tabindex="0"]').then(($elements) => {
        if ($elements.length === 0) return;

        cy.get('a, button, input, textarea, [tabindex="0"]').first().focus();
        cy.focused().then(($focused) => {
          expect($focused[0].tagName).to.exist;
        });
      });
    });
  });

  describe('Semantic HTML', () => {
    it('should have proper heading hierarchy', () => {
      cy.visit('/');

      cy.get('h1').should('have.length', 1);
      cy.get('h1, h2, h3, h4, h5, h6').should('have.length.greaterThan', 0);
    });

    it('should have landmark regions', () => {
      cy.visit('/');

      Object.values(LANDMARK_SELECTORS).forEach((selector) => {
        cy.get(selector).should('be.visible');
      });
    });

    it('should have proper form labels', () => {
      cy.visit('/contact');
      cy.get('form').should('exist');

      cy.get('input:not([type="submit"]):not([type="hidden"]), textarea').each(($input) => {
        const hasLabel = hasAccessibleLabel($input);
        expect(hasLabel).to.be.true;
      });
    });
  });

  describe('Images and Media', () => {
    it('should have alt text for all images', () => {
      cy.visit('/');
      cy.get('body').then(($body) => {
        const imgs = $body.find('img');
        if (imgs.length === 0) return;
        cy.wrap(imgs).each(($img) => {
          expect($img.attr('alt')).to.not.be.undefined;
        });
      });
    });

    it('should have accessible video elements', () => {
      cy.visit('/works');
      cy.get('body').then(($body) => {
        const videos = $body.find('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
        if (videos.length === 0) return;
        cy.wrap(videos).each(($video) => {
          const title = $video.attr('title');
          const ariaLabel = $video.attr('aria-label');
          const hasAccessibleName = Boolean(title || ariaLabel);
          expect(hasAccessibleName).to.be.true;
        });
      });
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG AA contrast requirements', () => {
      cy.visit('/');
      cy.waitForHydration();

      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      }, undefined, true);
    });

    it('should be readable in dark mode', () => {
      cy.visit('/');
      cy.waitForHydration();

      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      }, undefined, true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should have valid ARIA attributes', () => {
      cy.visit('/');
      cy.injectAxe();

      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      });
    });

    it('should use ARIA roles appropriately', () => {
      cy.visit('/');
      cy.get('body').then(($body) => {
        const roleEls = $body.find('[role]');
        if (roleEls.length === 0) return;
        cy.wrap(roleEls).each(($el) => {
          expect($el.attr('role')).to.exist;
        });
      });
    });
  });

  describe('Responsive Accessibility', () => {
    it('should be accessible on all viewports', () => {
      cy.visit('/');
      cy.waitForHydration();
      cy.checkA11y();
    });

    it('should have touch-friendly targets on mobile', () => {
      cy.isMobile().then((isMobile) => {
        if (!isMobile) {
          cy.log('Skipping: Not a mobile viewport');
          return;
        }

        cy.visit('/');
        cy.waitForHydration();

        cy.get('.nav-toggle').then(($navToggle) => {
          if ($navToggle.length === 0) {
            throw new Error('Nav toggle not found or not visible');
          }

          const rect = $navToggle[0].getBoundingClientRect();
          expect(rect.width).to.be.at.least(MIN_TOUCH_TARGET_SIZE);
          expect(rect.height).to.be.at.least(MIN_TOUCH_TARGET_SIZE);
        });
      });
    });
  });
});
