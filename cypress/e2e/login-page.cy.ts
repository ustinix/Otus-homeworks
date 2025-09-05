describe('Login page', () => {
  it('should login user successfully', () => {
    cy.visit('/login');
    cy.get('[data-test="username"]').type('Ksenia');
    cy.get('[data-test="email"]').type('user@example.com');
    cy.get('[data-test="password"]').type('Password123@');
    cy.get('[data-test="submit-btn"]').click();

    cy.url().should('include', '/');
    cy.get('[data-test="user-profile"]').should('be.visible').and('contain', 'Ksenia');
  });

  it('should login admin successfully', () => {
    cy.visit('/login');
    cy.get('[data-test="username"]').type('AdminUser');
    cy.get('[data-test="email"]').type('admin@example.com');
    cy.get('[data-test="password"]').type('Password123@');
    cy.get('[data-test="admin"]').find('input[type="checkbox"]').click({ force: true });
    cy.get('[data-test="submit-btn"]').click();

    cy.url().should('include', '/admin');
    cy.get('[data-test="user-profile"]').should('be.visible').and('contain', 'AdminUser');
  });
});
