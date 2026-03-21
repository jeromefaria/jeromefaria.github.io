// Constants
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const ACCORDION_TRIGGER_SELECTOR = '.accordion-trigger';
const SOLO_TRIGGER_ID = '#trigger-solo';
const SOLO_SECTION_ID = '#section-solo';
const WORKS_PAGE = '/works';
const LIVE_PAGE = '/live';

describe('Accordion Functionality', () => {
  describe('Works Page Accordion', () => {
    it('should have accordion sections', () => {
      cy.visit(WORKS_PAGE);
      cy.get(ACCORDION_SECTION_SELECTOR).should('have.length.greaterThan', 0);
    });

    it('should toggle accordion sections on click', () => {
      cy.visit(WORKS_PAGE);
      cy.waitForHydration();

      // First accordion ('solo') starts OPEN by default
      cy.toggleAndVerifyAccordion(`${ACCORDION_TRIGGER_SELECTOR}:first`, 'true');

      // Click to open again
      cy.toggleAndVerifyAccordion(`${ACCORDION_TRIGGER_SELECTOR}:first`, 'false');
    });

    it('should open accordion section from URL hash', () => {
      cy.visit(`${WORKS_PAGE}#section-solo`);
      cy.get(SOLO_TRIGGER_ID).should('have.attr', 'aria-expanded', 'true');
    });

    it('should update URL hash when accordion opens', () => {
      cy.visit(WORKS_PAGE);
      cy.waitForHydration();

      cy.get(ACCORDION_SECTION_SELECTOR).eq(1).invoke('attr', 'id').then((sectionId) => {
        if (!sectionId) {
          throw new Error('Second section ID not found');
        }

        cy.get(ACCORDION_TRIGGER_SELECTOR).eq(1).click();
        cy.url().should('match', new RegExp(`#${sectionId}`));
      });
    });

    it('should scroll to accordion section when opened via hash', () => {
      cy.visit(`${WORKS_PAGE}#section-solo`);
      cy.get(SOLO_SECTION_ID).should('be.visible');
    });

    it('should handle multiple accordion sections', () => {
      cy.visit(WORKS_PAGE);
      cy.waitForHydration();

      cy.get(ACCORDION_TRIGGER_SELECTOR).should('have.length.greaterThan', 1);

      // First accordion ('solo') starts open, close it
      cy.toggleAndVerifyAccordion(`${ACCORDION_TRIGGER_SELECTOR}:eq(0)`, 'true');

      // Open second section
      cy.toggleAndVerifyAccordion(`${ACCORDION_TRIGGER_SELECTOR}:eq(1)`, 'false');
    });

    it('should maintain accordion state on page reload', () => {
      cy.visit(`${WORKS_PAGE}#section-solo`);
      cy.reload();
      cy.get(SOLO_TRIGGER_ID).should('have.attr', 'aria-expanded', 'true');
    });
  });

  describe('Live Page Accordion', () => {
    it('should have year-based accordion sections', () => {
      cy.visit(LIVE_PAGE);
      cy.get(ACCORDION_SECTION_SELECTOR).should('have.length.greaterThan', 0);
    });

    it('should toggle year sections', () => {
      cy.visit(LIVE_PAGE);
      cy.waitForHydration();

      // First year section starts OPEN by default
      cy.toggleAndVerifyAccordion(`${ACCORDION_TRIGGER_SELECTOR}:first`, 'true');
    });

    it('should open specific year from URL hash', () => {
      cy.visit(LIVE_PAGE);

      cy.get(ACCORDION_SECTION_SELECTOR).should('have.length.greaterThan', 0);

      cy.get(ACCORDION_SECTION_SELECTOR).first().invoke('attr', 'id').then((firstSectionId) => {
        if (!firstSectionId) {
          throw new Error('First section ID not found');
        }

        const year = firstSectionId.replace('section-', '');
        cy.visit(`${LIVE_PAGE}#section-${year}`);
        cy.get(`#trigger-${year}`).should('have.attr', 'aria-expanded', 'true');
      });
    });

    it('should handle invalid hash gracefully', () => {
      cy.visit(`${LIVE_PAGE}#section-invalid`);
      cy.get(ACCORDION_TRIGGER_SELECTOR).should('have.length.greaterThan', 0);
    });
  });

  describe('Accordion Keyboard Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.visit(WORKS_PAGE);
      cy.waitForHydration();

      cy.get(ACCORDION_TRIGGER_SELECTOR).first().focus().should('have.focus');

      // First accordion starts open, pressing Enter closes it
      cy.get(ACCORDION_TRIGGER_SELECTOR).first()
        .should('have.attr', 'aria-expanded', 'true')
        .type('{enter}')
        .should('have.attr', 'aria-expanded', 'false');
    });

    it('should support Space key activation', () => {
      cy.visit(WORKS_PAGE);
      cy.waitForHydration();

      cy.get(ACCORDION_TRIGGER_SELECTOR).first().focus();

      // First accordion starts open, pressing Space closes it
      cy.get(ACCORDION_TRIGGER_SELECTOR).first()
        .should('have.attr', 'aria-expanded', 'true')
        .type(' ')
        .should('have.attr', 'aria-expanded', 'false');
    });
  });

  describe('Accordion Mobile Behavior', () => {
    it('should toggle accordion with pointer events', () => {
      cy.visit(WORKS_PAGE);
      cy.waitForHydration();

      // First accordion starts open
      cy.get(ACCORDION_TRIGGER_SELECTOR).first()
        .should('have.attr', 'aria-expanded', 'true')
        .click()
        .should('have.attr', 'aria-expanded', 'false')
        .click()
        .should('have.attr', 'aria-expanded', 'true');
    });

    it('should handle hash navigation on all devices', () => {
      cy.visit(`${WORKS_PAGE}#section-solo`);
      cy.waitForHydration();
      cy.get(SOLO_SECTION_ID).should('be.visible');
      cy.get(SOLO_TRIGGER_ID).should('have.attr', 'aria-expanded', 'true');
    });
  });
});
