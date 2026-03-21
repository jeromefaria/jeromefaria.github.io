// Constants
const FORM_SELECTOR = '.contact-form';
const NAME_INPUT = '#name';
const EMAIL_INPUT = '#email';
const SUBJECT_INPUT = '#subject';
const MESSAGE_INPUT = '#message';
const SUBMIT_BUTTON = '.contact-form__submit';
const INVALID_CLASS = /contact-form__input--invalid|contact-form__textarea--invalid/;

const VALID_FORM = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a test message with enough content.',
};

describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact');
    cy.get(FORM_SELECTOR).should('be.visible');
  });

  describe('Rendering', () => {
    it('shows all form fields', () => {
      cy.get(NAME_INPUT).should('be.visible');
      cy.get(EMAIL_INPUT).should('be.visible');
      cy.get(SUBJECT_INPUT).should('be.visible');
      cy.get(MESSAGE_INPUT).should('be.visible');
    });

    it('shows the submit button', () => {
      cy.get(SUBMIT_BUTTON).should('be.visible');
    });

    it('has required indicators on required fields', () => {
      cy.get(`label[for="name"] abbr`).should('exist');
      cy.get(`label[for="email"] abbr`).should('exist');
      cy.get(`label[for="message"] abbr`).should('exist');
    });

    it('does not show success message initially', () => {
      cy.get('.contact-success').should('not.exist');
    });
  });

  describe('Validation — required fields', () => {
    it('marks name as invalid after blur when empty', () => {
      cy.get(NAME_INPUT).focus().blur();
      cy.get(NAME_INPUT).should('have.class', 'contact-form__input--invalid');
    });

    it('marks email as invalid after blur when empty', () => {
      cy.get(EMAIL_INPUT).focus().blur();
      cy.get(EMAIL_INPUT).should('have.class', 'contact-form__input--invalid');
    });

    it('marks message as invalid after blur when empty', () => {
      cy.get(MESSAGE_INPUT).focus().blur();
      cy.get(MESSAGE_INPUT).should('have.class', 'contact-form__textarea--invalid');
    });

    it('clears invalid state when valid value is entered', () => {
      cy.get(NAME_INPUT).focus().blur();
      cy.get(NAME_INPUT).should('have.class', 'contact-form__input--invalid');
      cy.get(NAME_INPUT).type('Jane');
      cy.get(NAME_INPUT).should('not.have.class', 'contact-form__input--invalid');
    });
  });

  describe('Validation — email format', () => {
    it('does not mark email as invalid when non-empty (format not validated on blur)', () => {
      cy.get(EMAIL_INPUT).type('notanemail').blur();
      cy.get(EMAIL_INPUT).should('not.have.class', 'contact-form__input--invalid');
    });

    it('marks email as invalid after blur when empty', () => {
      cy.get(EMAIL_INPUT).focus().blur();
      cy.get(EMAIL_INPUT).should('have.class', 'contact-form__input--invalid');
    });
  });

  describe('Submit button state', () => {
    it('does not have the valid class when form is empty', () => {
      cy.get(SUBMIT_BUTTON).should('not.have.class', 'contact-form__submit--valid');
    });

    it('does not have the valid class when only some required fields are filled', () => {
      cy.get(NAME_INPUT).type(VALID_FORM.name);
      cy.get(EMAIL_INPUT).type(VALID_FORM.email);
      cy.get(SUBMIT_BUTTON).should('not.have.class', 'contact-form__submit--valid');
    });

    it('gets the valid class when all required fields are filled', () => {
      cy.get(NAME_INPUT).type(VALID_FORM.name);
      cy.get(EMAIL_INPUT).type(VALID_FORM.email);
      cy.get(MESSAGE_INPUT).type(VALID_FORM.message);
      cy.get(SUBMIT_BUTTON).should('have.class', 'contact-form__submit--valid');
    });
  });

  describe('Successful submission', () => {
    it('shows success message after successful submission', () => {
      // Intercept the form submission to avoid a real network request
      cy.intercept('POST', /formsubmit\.co/, {
        statusCode: 200,
        body: { success: true },
      }).as('formSubmit');

      cy.get(NAME_INPUT).type(VALID_FORM.name);
      cy.get(EMAIL_INPUT).type(VALID_FORM.email);
      cy.get(SUBJECT_INPUT).type(VALID_FORM.subject);
      cy.get(MESSAGE_INPUT).type(VALID_FORM.message);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@formSubmit');
      cy.get('.contact-success').should('be.visible');
      cy.get(FORM_SELECTOR).should('not.be.visible');
    });

    it('success message contains a title', () => {
      cy.intercept('POST', /formsubmit\.co/, {
        statusCode: 200,
        body: { success: true },
      }).as('formSubmit');

      cy.get(NAME_INPUT).type(VALID_FORM.name);
      cy.get(EMAIL_INPUT).type(VALID_FORM.email);
      cy.get(MESSAGE_INPUT).type(VALID_FORM.message);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@formSubmit');
      cy.get('.contact-success h2').should('be.visible');
    });
  });

  describe('Failed submission — fallback', () => {
    it('falls back to native form submit on network error', () => {
      cy.intercept('POST', /formsubmit\.co/, { forceNetworkError: true }).as('formError');

      // Stub form.submit() to prevent actual navigation
      cy.get(FORM_SELECTOR).then(($form) => {
        const form = $form[0] as HTMLFormElement;
        cy.stub(form, 'submit').as('nativeSubmit');
      });

      cy.get(NAME_INPUT).type(VALID_FORM.name);
      cy.get(EMAIL_INPUT).type(VALID_FORM.email);
      cy.get(MESSAGE_INPUT).type(VALID_FORM.message);
      cy.get(SUBMIT_BUTTON).click();

      cy.get('@nativeSubmit').should('have.been.called');
    });
  });

  describe('Spam protection', () => {
    it('honeypot field is hidden from users', () => {
      // The honeypot field should not be visible
      cy.get('input[tabindex="-1"]').should('not.be.visible');
    });
  });

  describe('Accessibility', () => {
    it('all visible inputs have associated labels', () => {
      cy.get(`input:not([type="hidden"]):not([tabindex="-1"]), textarea`).each(($input) => {
        const id = $input.attr('id');
        if (!id) return;
        cy.get(`label[for="${id}"]`).should('exist');
      });
    });

    it('submit button has descriptive text', () => {
      cy.get(SUBMIT_BUTTON).invoke('text').should('not.be.empty');
    });
  });
});
