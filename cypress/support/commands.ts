/**
 * Custom Cypress commands for E2E testing
 * Converted from Playwright helper functions
 */

/**
 * Wait for Vue hydration to complete.
 * `body.ready` is added in App's onMounted, i.e. after the app has mounted and
 * hydrated (event handlers attached). Waiting for web fonts to finish loading
 * on top of that removes a FOUT-driven flake class from axe colour-contrast
 * checks, and replaces the previous arbitrary fixed delay with a deterministic
 * signal.
 */
Cypress.Commands.add('waitForHydration', () => {
  cy.get('body.ready', { timeout: 10000 }).should('exist');
  cy.document().then(doc => cy.wrap(doc.fonts.ready, { timeout: 10000 }));
  cy.injectAxe();
});

/**
 * Toggle accordion trigger and verify aria-expanded state changes
 */
Cypress.Commands.add('toggleAndVerifyAccordion', (
  selector: string,
  initialState: 'true' | 'false',
) => {
  const expectedState = initialState === 'true' ? 'false' : 'true';

  cy.get(selector)
    .should('have.attr', 'aria-expanded', initialState)
    .click()
    .should('have.attr', 'aria-expanded', expectedState);
});

/**
 * Open mobile navigation menu if needed
 * Automatically detects viewport width and opens menu on mobile
 */
Cypress.Commands.add('openMobileMenuIfNeeded', () => {
  cy.window().then(win => {
    const isMobile = win.innerWidth < 768;
    if (!isMobile) return;

    cy.get('.nav--open').then($nav => {
      if ($nav.is(':visible')) return;

      cy.get('.nav-toggle').click();
      cy.get('.nav--open', { timeout: 5000 }).should('be.visible');
    });
  });
});

/**
 * Check if current viewport is mobile
 * Returns true if viewport width < 768px
 */
Cypress.Commands.add('isMobile', () => {
  return cy.window().then(win => win.innerWidth < 768);
});
