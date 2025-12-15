/// <reference types="cypress" />

/**
 * Smoke test - basic page load verification
 */
describe('Smoke Test', () => {
  it('loads the page', () => {
    cy.visit('/', { timeout: 30000 });
    
    // Just wait and see what we get
    cy.wait(5000);
    
    // Log the page content
    cy.document().then((doc) => {
      cy.log('Page HTML:', doc.body.innerHTML.substring(0, 500));
    });
    
    // Try to find any element
    cy.get('body').should('be.visible');
  });
});

