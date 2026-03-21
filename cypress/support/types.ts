/**
 * TypeScript definitions for custom Cypress commands
 */

declare namespace Cypress {
  interface Chainable {
    /**
     * Wait for Vue hydration to complete
     * @example cy.waitForHydration()
     */
    waitForHydration(): Chainable<void>;

    /**
     * Toggle accordion and verify state change
     * @param selector - CSS selector for accordion trigger
     * @param initialState - Expected initial aria-expanded state
     * @example cy.toggleAndVerifyAccordion('.accordion-trigger:first', 'true')
     */
    toggleAndVerifyAccordion(selector: string, initialState: 'true' | 'false'): Chainable<void>;

    /**
     * Open mobile menu if viewport is mobile
     * @example cy.openMobileMenuIfNeeded()
     */
    openMobileMenuIfNeeded(): Chainable<void>;

    /**
     * Check if current viewport is mobile (< 768px)
     * @example cy.isMobile().then((isMobile) => { ... })
     */
    isMobile(): Chainable<boolean>;
  }
}

export {};
