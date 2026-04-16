// Constants
const NAV_TOGGLE_SELECTOR = '.nav-toggle';
const NAV_OPEN_SELECTOR = '.nav--open';
const NAV_LINK_SELECTOR = '.nav__link';
const NAV_SELECTOR = '.nav';
const MASTHEAD_TITLE_SELECTOR = '.masthead-title';
const HERO_SELECTOR = '.hero';
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const NOT_FOUND_SELECTOR = '.not-found';
const MOBILE_MENU_TIMEOUT = 5000;

const PAGES = {
  HOME: '/',
  WORKS: '/works',
  LIVE: '/live',
  PRESS: '/press',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

describe('Navigation', () => {
  it('should load the homepage', () => {
    cy.visit(PAGES.HOME);
    cy.title().should('match', /Jerome Faria/);
    cy.get(MASTHEAD_TITLE_SELECTOR).should('be.visible');
    cy.get(HERO_SELECTOR).should('be.visible');
  });

  it('should navigate to Works page', () => {
    cy.visit(PAGES.HOME);
    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.WORKS}"]`).first().click();
    cy.url().should('match', /\/works/);
    cy.title().should('match', /Works/);
    cy.get('[data-page="works"]', { timeout: MOBILE_MENU_TIMEOUT }).should('exist');
    cy.get(ACCORDION_SECTION_SELECTOR).should('have.length.greaterThan', 0);
  });

  it('should navigate to Live page', () => {
    cy.visit(PAGES.HOME);
    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.LIVE}"]`).first().click();
    cy.url().should('match', /\/live/);
    cy.title().should('match', /Live/);
    cy.get('[data-page="live"]', { timeout: MOBILE_MENU_TIMEOUT }).should('exist');
    cy.get(ACCORDION_SECTION_SELECTOR).should('have.length.greaterThan', 0);
  });

  it('should navigate to Press page', () => {
    cy.visit(PAGES.HOME);
    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.PRESS}"]`).first().click();
    cy.url().should('match', /\/press/);
    cy.title().should('match', /Press/);
    cy.get('[data-page="press"]').should('be.visible');
  });

  it('should navigate to About page', () => {
    cy.visit(PAGES.HOME);
    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.ABOUT}"]`).first().click();
    cy.url().should('match', /\/about/);
    cy.title().should('match', /About/);
    cy.get('[data-page="about"]').should('be.visible');
  });

  it('should navigate to Contact page', () => {
    cy.visit(PAGES.HOME);
    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.CONTACT}"]`).first().click();
    cy.url().should('match', /\/contact/);
    cy.title().should('match', /Contact/);
    cy.get('form').should('be.visible');
  });

  it('should have working header navigation', () => {
    cy.visit(PAGES.WORKS);
    cy.get(`header a[href="${PAGES.HOME}"]`).should('be.visible');
    cy.get(`header a[href="${PAGES.HOME}"]`).click({ force: true });
    cy.url().should('eq', Cypress.config().baseUrl + PAGES.HOME);
    cy.get(HERO_SELECTOR).should('be.visible');
  });

  it('should have working footer links', () => {
    cy.visit(PAGES.HOME);
    cy.get('footer nav').should('be.visible');
    cy.get('footer nav a').should('have.length.greaterThan', 0);
  });

  it('should show 404 page for non-existent routes', () => {
    cy.visit('/non-existent-page');
    cy.title().should('match', /Not Found/);
    cy.get(NOT_FOUND_SELECTOR).should('be.visible');
    cy.get(`${NOT_FOUND_SELECTOR} h1`).should('contain.text', 'Page Not Found');
  });

  it('should maintain navigation state across pages', () => {
    cy.visit(PAGES.HOME);
    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.WORKS}"]`).first().click();
    cy.url().should('match', /\/works/);

    cy.openMobileMenuIfNeeded();
    cy.get(`nav a[href="${PAGES.LIVE}"]`).first().click();
    cy.url().should('match', /\/live/);

    cy.go('back');
    cy.url().should('match', /\/works/);

    cy.go('forward');
    cy.url().should('match', /\/live/);
  });

  it('should support direct URL access', () => {
    cy.visit(PAGES.ABOUT);
    cy.url().should('match', /\/about/);
    cy.title().should('match', /About/);
    cy.get('[data-page="about"]').should('be.visible');
  });

  it('should have appropriate navigation UI for viewport', () => {
    cy.visit(PAGES.HOME);

    cy.isMobile().then((isMobile) => {
      if (isMobile) {
        // Mobile: should have toggle button and collapsible menu
        cy.get(NAV_TOGGLE_SELECTOR).should('be.visible').click();
        cy.get(NAV_OPEN_SELECTOR).should('be.visible');
        return;
      }

      // Desktop: navigation should be visible without toggle
      cy.get(NAV_SELECTOR).should('be.visible');
      cy.get(NAV_LINK_SELECTOR).should('have.length.greaterThan', 0);
    });
  });
});
