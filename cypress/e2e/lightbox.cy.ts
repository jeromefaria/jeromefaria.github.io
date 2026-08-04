const LIGHTBOX_SELECTOR = '.lightbox';
const LIGHTBOX_CLOSE_SELECTOR = '.lightbox__hint--close';
const LIGHTBOX_NEXT_SELECTOR = '.lightbox__hint--next';
const LIGHTBOX_IMAGE_SELECTOR = '.lightbox__image';
const LIGHTBOX_CREDIT_SELECTOR = '.lightbox__credit';
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const ACCORDION_TRIGGER_SELECTOR = '.accordion-trigger';
const GALLERY_BUTTON_SELECTOR = '.link-discrete';
// A gallery button is only actionable while its own accordion section is open —
// collapsed sections are `inert`. Scope every interaction to a visible one.
const VISIBLE_GALLERY_BUTTON = `${GALLERY_BUTTON_SELECTOR}:visible`;

/**
 * Open the accordion section that contains the first gallery button and wait
 * for that button to become actionable, so callers can click a real, visible,
 * non-inert control (no forced clicks, no fixed animation waits).
 */
function openFirstGallery(): void {
  cy.visit('/works');
  cy.waitForHydration();

  // The accordion keeps a single section open at a time, so find the section
  // owning the first gallery button and open it if it isn't already.
  cy.get(GALLERY_BUTTON_SELECTOR).first()
    .closest(ACCORDION_SECTION_SELECTOR)
    .find(ACCORDION_TRIGGER_SELECTOR)
    .then($trigger => {
      if ($trigger.attr('aria-expanded') !== 'true') {
        cy.wrap($trigger).click();
      }
    });

  // Retry-able assertion waits out the expand animation deterministically.
  cy.get(VISIBLE_GALLERY_BUTTON).first().should('be.visible');
}

/**
 * Open the lightbox from the first visible gallery button and wait for it.
 */
function openLightboxFromFirstGallery(): void {
  openFirstGallery();
  cy.get(VISIBLE_GALLERY_BUTTON).first().click();
  cy.get(LIGHTBOX_SELECTOR).should('be.visible');
}

describe('Lightbox', () => {
  describe('Opening', () => {
    it('opens lightbox when clicking a View gallery button', () => {
      openLightboxFromFirstGallery();
      cy.get(LIGHTBOX_SELECTOR).should('be.visible');
    });

    it('displays an image in the lightbox', () => {
      openLightboxFromFirstGallery();
      cy.get(LIGHTBOX_IMAGE_SELECTOR).should('be.visible');
    });

    it('sets body overflow to hidden when open', () => {
      openLightboxFromFirstGallery();
      cy.get('body').should('have.css', 'overflow', 'hidden');
    });
  });

  describe('Closing', () => {
    beforeEach(() => {
      openLightboxFromFirstGallery();
    });

    it('closes lightbox when clicking the close button', () => {
      cy.get(LIGHTBOX_CLOSE_SELECTOR).click();
      cy.get(LIGHTBOX_SELECTOR).should('not.exist');
    });

    it('closes lightbox when pressing Escape', () => {
      cy.get('body').trigger('keydown', { key: 'Escape' });
      cy.get(LIGHTBOX_SELECTOR).should('not.exist');
    });

    it('restores body overflow after closing', () => {
      cy.get(LIGHTBOX_CLOSE_SELECTOR).click();
      cy.get('body').should('not.have.css', 'overflow', 'hidden');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      openLightboxFromFirstGallery();
    });

    it('shows next image when clicking the next button', () => {
      // compact variant always renders next button, but disables it for single-image galleries
      cy.get(LIGHTBOX_NEXT_SELECTOR).then($btn => {
        if ($btn.is(':disabled')) {
          cy.log('Skipping: single-image gallery');
          return;
        }
        cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').then(firstSrc => {
          cy.get(LIGHTBOX_NEXT_SELECTOR).click();
          cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').should('not.eq', firstSrc);
        });
      });
    });

    it('navigates to next image with ArrowRight key', () => {
      cy.get(LIGHTBOX_NEXT_SELECTOR).then($btn => {
        if ($btn.is(':disabled')) {
          cy.log('Skipping: single-image gallery');
          return;
        }
        cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').then(firstSrc => {
          cy.get('body').trigger('keydown', { key: 'ArrowRight' });
          cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').should('not.eq', firstSrc);
        });
      });
    });

    it('navigates to previous image with ArrowLeft key', () => {
      cy.get(LIGHTBOX_NEXT_SELECTOR).then($btn => {
        if ($btn.is(':disabled')) {
          cy.log('Skipping: single-image gallery');
          return;
        }
        cy.get(LIGHTBOX_NEXT_SELECTOR).click();
        cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').then(secondSrc => {
          cy.get('body').trigger('keydown', { key: 'ArrowLeft' });
          cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').should('not.eq', secondSrc);
        });
      });
    });
  });

  describe('Photographer credit', () => {
    it('shows photographer credit when present', () => {
      openLightboxFromFirstGallery();
      cy.get('body').then($body => {
        if ($body.find(LIGHTBOX_CREDIT_SELECTOR).length > 0) {
          cy.get(LIGHTBOX_CREDIT_SELECTOR).should('be.visible');
        } else {
          cy.log('Skipping: no photographer credit on first gallery image');
        }
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      openLightboxFromFirstGallery();
    });

    it('close button is focusable', () => {
      cy.get(LIGHTBOX_CLOSE_SELECTOR).focus().should('have.focus');
    });

    it('lightbox contains focusable elements', () => {
      cy.get(LIGHTBOX_SELECTOR).within(() => {
        cy.get('button').should('have.length.greaterThan', 0);
      });
    });
  });
});
