// Constants — WorksView uses the 'compact' variant of LightboxOverlay
const LIGHTBOX_SELECTOR = '.lightbox';
const LIGHTBOX_CLOSE_SELECTOR = '.lightbox__hint--close';
const LIGHTBOX_PREV_SELECTOR = '.lightbox__hint--prev';
const LIGHTBOX_NEXT_SELECTOR = '.lightbox__hint--next';
const LIGHTBOX_IMAGE_SELECTOR = '.lightbox__image';
const LIGHTBOX_CREDIT_SELECTOR = '.lightbox__credit';
const ACCORDION_TRIGGER_SELECTOR = '.accordion-trigger';
const GALLERY_BUTTON_SELECTOR = '.link-discrete';

/**
 * Open all accordion sections that are not already open,
 * then wait for animations to complete before proceeding.
 */
function openFirstGallery(): void {
  cy.visit('/works');

  // Only click triggers that are not already expanded
  cy.get(ACCORDION_TRIGGER_SELECTOR).each(($trigger) => {
    if ($trigger.attr('aria-expanded') !== 'true') {
      cy.wrap($trigger).click();
    }
  });

  // Wait for all opacity transitions to complete:
  // 150ms transition-delay + 300ms transition-base + 150ms buffer
  cy.wait(650);

  // Verify gallery buttons exist in the DOM
  cy.get(GALLERY_BUTTON_SELECTOR).should('have.length.greaterThan', 0);
}

describe('Lightbox', () => {
  describe('Opening', () => {
    it('opens lightbox when clicking a View gallery button', () => {
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get(LIGHTBOX_SELECTOR).should('be.visible');
    });

    it('displays an image in the lightbox', () => {
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get(LIGHTBOX_IMAGE_SELECTOR).should('be.visible');
    });

    it('sets body overflow to hidden when open', () => {
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get('body').should('have.css', 'overflow', 'hidden');
    });
  });

  describe('Closing', () => {
    beforeEach(() => {
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get(LIGHTBOX_SELECTOR).should('be.visible');
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
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get(LIGHTBOX_SELECTOR).should('be.visible');
    });

    it('shows next image when clicking the next button', () => {
      // compact variant always renders next button, but disables it for single-image galleries
      cy.get(LIGHTBOX_NEXT_SELECTOR).then(($btn) => {
        if ($btn.is(':disabled')) {
          cy.log('Skipping: single-image gallery');
          return;
        }
        cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').then((firstSrc) => {
          cy.get(LIGHTBOX_NEXT_SELECTOR).click();
          cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').should('not.eq', firstSrc);
        });
      });
    });

    it('navigates to next image with ArrowRight key', () => {
      cy.get(LIGHTBOX_NEXT_SELECTOR).then(($btn) => {
        if ($btn.is(':disabled')) {
          cy.log('Skipping: single-image gallery');
          return;
        }
        cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').then((firstSrc) => {
          cy.get('body').trigger('keydown', { key: 'ArrowRight' });
          cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').should('not.eq', firstSrc);
        });
      });
    });

    it('navigates to previous image with ArrowLeft key', () => {
      cy.get(LIGHTBOX_NEXT_SELECTOR).then(($btn) => {
        if ($btn.is(':disabled')) {
          cy.log('Skipping: single-image gallery');
          return;
        }
        cy.get(LIGHTBOX_NEXT_SELECTOR).click();
        cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').then((secondSrc) => {
          cy.get('body').trigger('keydown', { key: 'ArrowLeft' });
          cy.get(LIGHTBOX_IMAGE_SELECTOR).invoke('attr', 'src').should('not.eq', secondSrc);
        });
      });
    });
  });

  describe('Photographer credit', () => {
    it('shows photographer credit when present', () => {
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get(LIGHTBOX_SELECTOR).should('be.visible');
      cy.get('body').then(($body) => {
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
      openFirstGallery();
      cy.get(GALLERY_BUTTON_SELECTOR).first().click({ force: true });
      cy.get(LIGHTBOX_SELECTOR).should('be.visible');
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
